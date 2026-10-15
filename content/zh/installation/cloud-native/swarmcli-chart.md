---
title: "SwarmCLI Chart"
description: "使用 swarmcli 的 rustfs Chart 在 Docker Swarm 上运行单节点 RustFS 服务，并将凭证保存为 Docker Secret。"
---

本文将 RustFS 部署为 Docker Swarm 服务，其根凭证以 Docker Secret 而非环境变量的形式提供：RustFS 通过 `RUSTFS_ACCESS_KEY_FILE` 和 `RUSTFS_SECRET_KEY_FILE` 从文件中读取凭证，因此这两个值都不会出现在服务定义或 `docker inspect` 的输出中。部署使用社区仓库 swarmcli-charts 中的 [`rustfs` Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs)，并通过 [swarmcli](https://github.com/Eldara-Tech/swarmcli) 安装。二者均由 Eldara Tech 维护，而非 RustFS 项目。

该 Chart 在一个节点上运行一个使用单块磁盘的 RustFS 服务（单节点单磁盘，SNSD）。单块磁盘不提供纠删码冗余，因此适用于构建缓存、备份目标和小型 Swarm 上的应用 Blob 存储；它不运行多节点 RustFS 部署。

## 1. 前提条件

* 一个 Docker Swarm（`docker swarm init`），以及管理节点上的 Shell
* swarmcli 1.11.0 或更高版本，请参阅 [swarmcli 安装指南](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)
* Swarm 节点上的 9000 端口（S3 API）未被占用，因为第 5 步会在 Swarm 路由网格上发布该端口

## 2. 将凭证创建为 Docker Secret

替换凭证占位符，然后为每个密钥创建一个 Secret：

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

每个值都应位于一行内，且内部不含空白字符。例如，可以使用 `openssl rand -base64 30` 生成高强度的秘密密钥。

:::warning[服务会拒绝弱凭证]

如果任一 Secret 缺失、为空、包含空白字符或使用众所周知的 `rustfsadmin` 值，该 Chart 的容器会在启动时退出。Docker Secret 无法修改：如需轮换凭证，请以新名称创建 Secret，将 Chart 的 `s3.accessKeySecret` 和 `s3.secretKeySecret` 值指向它们，然后升级该 Release。

:::

## 3. 标记数据节点

命名卷只存在于一个节点上，因此服务会被固定到带有 `rustfs-data=true` 标签的节点。请只为一个节点添加该标签：

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

在单节点 Swarm 上，可以跳过标签，改为在第 5 步的安装命令中添加 `--set persistence.nodeLabel=""`。

## 4. 添加 Chart 仓库

如果 `swarmcli charts repo list` 已显示 `swarmcli-charts`，请跳过此步骤：

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 5. 安装 RustFS

将该 Chart 安装为名为 `rustfs` 的 Release，在 9000 端口发布 S3 API，并在启动时创建一个存储桶：

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

服务将数据保存在 `rustfs-data` 命名卷的 `/data` 下，Docker 会以 Release 名称为前缀将其命名为 `rustfs_rustfs-data`。`buckets` 中的每个存储桶会在服务器开始响应后创建；已存在的存储桶保持不变，因此重启和升级都是安全的。

## 6. 验证部署

检查 Release、服务任务和 S3 API 健康检查端点：

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health
```

S3 API 在每个 Swarm 节点上均可通过 `http://localhost:9000` 访问。客户端使用路径式寻址和区域 `us-east-1`。

## 暴露模式

该 Chart 分别暴露 S3 API 和控制台。控制台默认关闭，可通过 `console.enabled=true` 启用。S3 API 的模式由 `exposure.mode` 设置，控制台的模式由 `console.exposure.mode` 设置：

| 模式 | 可访问范围 |
| - | - |
| `none`（默认） | 仅限连接到 `rustfs-net` 覆盖网络的服务，地址为 `http://<release>-rustfs:9000` |
| `published` | 在 Swarm 路由网格上发布的端口：S3 API 使用 `publish.port`，控制台使用 `console.publish.port`（9001） |
| `traefik` | 由 Traefik 路由的主机名：S3 API 使用 `ingress.host`，控制台使用 `console.ingress.host` |

例如，同时在 9001 端口发布控制台：

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set console.enabled=true \
  --set console.exposure.mode=published \
  --set 'buckets={my-bucket}'
```

:::note[控制台端口同样提供 S3 API]

控制台监听器同样提供完整的签名 S3 API 和管理 API，因此即使只暴露控制台，也会将这些 API 置于公开地址上。不使用控制台时，请保持其关闭。

:::

## 关键配置值

| 配置值 | 用途 | Chart 默认值 |
| - | - | - |
| `image.tag` | RustFS 镜像标签 | `""`（Chart 固定的 RustFS 版本） |
| `s3.accessKeySecret` / `s3.secretKeySecret` | 保存根凭证的 Docker Secret | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | 启动时创建的存储桶（若尚不存在） | `[]` |
| `exposure.mode` | S3 API 暴露方式：`none`、`published` 或 `traefik` | `none` |
| `publish.port` | 发布的 S3 API 端口 | `9000` |
| `console.enabled` | 运行控制台监听器 | `false` |
| `console.exposure.mode` | 控制台暴露方式：`none`、`published` 或 `traefik` | `none` |
| `persistence.nodeLabel` | 服务固定到的节点标签；`""` 表示不固定 | `rustfs-data` |
| `persistence.volumePath` | 以绑定挂载方式挂载到 `/data` 的主机目录，用于代替命名卷；所有者必须为 `10001` | `""` |
| `extraEnv` | 额外的 `RUSTFS_*` 环境变量，例如 `RUSTFS_SERVER_DOMAINS` | `{}` |

[Chart README](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) 记录了所有配置值，包括 Traefik 路由、通过 OpenID Connect 为控制台配置单点登录，以及主机目录绑定挂载。

## 卸载

```bash
swarmcli charts uninstall rustfs
```

卸载会删除服务和 Release 历史记录，但会保留数据卷、两个 Docker Secret 和 `rustfs-net` 网络；swarmcli 会列出该网络及其删除命令。

:::note[数据卷在卸载后仍会保留]

之后以相同 Release 名称重新安装时，会重新挂载该卷及其中的数据。如需丢弃数据，请在带标签的节点上删除该卷；如果不再需要这些 Secret，也可将其删除：

```bash
docker volume rm rustfs_rustfs-data
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## 后续步骤

- [RustFS 控制台](/administration/console)
- [配置 S3 客户端](../../developer/examples/aws-cli.md)
- [安装前检查清单](../requirement/checklists/index.md)
