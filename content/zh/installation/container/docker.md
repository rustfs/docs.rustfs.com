---
title: "Docker"
description: "使用 Docker 运行 RustFS：单节点部署、主机目录权限、Docker Compose、TLS 和多节点部署。"
---

本页介绍如何使用官方 RustFS 镜像在 Docker 中运行 RustFS：带持久化存储的单节点实例、非 root 容器用户的主机目录权限、带可选可观测性服务的 Docker Compose、TLS 以及多节点部署。你需要可用的 Docker Engine，并拥有运行容器的权限。

## 1. 前提条件

* 已安装 Docker Engine（≥ 20.10），并能正常拉取镜像和运行容器
* 主机端口 9000（S3 API）和 9001（控制台）可用，或与自定义端口一致
* 如果绑定挂载主机目录，目录所有者必须与容器用户匹配——参见[绑定挂载主机目录](#bind-mount-a-host-directory)

## 2. 拉取镜像

```bash
docker pull rustfs/rustfs:latest
```

## 3. 创建持久化存储

创建命名卷，以便替换容器后对象数据仍然可用：

```bash
docker volume create rustfs-data
```

## 4. 启动 RustFS

运行容器前，请替换凭证占位符：

```bash
docker run -d \
  --name rustfs \
  --restart unless-stopped \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_ADDRESS=":9000" \
  -e RUSTFS_CONSOLE_ADDRESS=":9001" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_OBS_LOGGER_LEVEL=error \
  -e RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/" \
  rustfs/rustfs:latest \
  /data
```

:::warning[创建容器时设置凭证]

在将 RustFS 接入网络前，请设置唯一的 `RUSTFS_ACCESS_KEY` 和 `RUSTFS_SECRET_KEY` 环境变量。任一凭证都不要使用众所周知的 `rustfsadmin` 值。如果容器启动时未设置自定义凭证，请停止容器，并使用上面所示的两个 `-e` 选项重新创建；`rustfs-data` 卷会保持不变。

:::

### 环境变量或命令行参数

上面的示例通过环境变量配置 RustFS。你也可以使用命令行参数传入相同的设置；两者同时存在时，命令行参数优先：

```bash
docker run -d \
  --name rustfs \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  rustfs/rustfs:latest \
  --access-key "<your-access-key>" \
  --secret-key "<your-secret-key>" \
  --address :9000 \
  --console-enable \
  /data
```

## 5. 绑定挂载主机目录

上面的命名卷无需额外设置。如果改用主机目录挂载（`-v /path/on/host:/data`），请注意容器以非 root 用户 `rustfs`（ID `10001`）运行。请确保主机目录的所有者为 `10001`，否则会遇到权限拒绝错误：

```bash
chown -R 10001:10001 /path/to/host_directory
```

## 6. 验证部署

检查容器和 S3 API 健康检查端点：

```bash
docker ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

S3 API 位于 `http://localhost:9000`，控制台位于 `http://localhost:9001`。

## Docker Compose

RustFS 官方提供 Docker Compose 安装方式。[`docker-compose.yml`](https://github.com/rustfs/rustfs/blob/main/docker-compose.yml) 文件包含 `grafana`、`prometheus`、`otel-collector` 和 `jaeger` 等服务，主要用于可观测性。如果要一起部署这些服务，请将 [RustFS 代码仓库](https://github.com/rustfs/rustfs)克隆到本地：

```bash
git clone https://github.com/rustfs/rustfs.git
```

在仓库根目录下运行命令：

```bash
docker compose --profile observability up -d
```

compose 文件使用初始化容器为 `rustfs` 授予正确的访问权限：下面的 `rustfs_perms` 服务在 `rustfs` 启动前将挂载卷的所有权更改为 `10001`，并使用 `depends_on` 等待其完成。为了确保日志持久化且可访问，将主机日志目录映射到容器的 `/var/log/rustfs/` 路径：

```yaml title="docker-compose.yml"
  services:
    # grant the necessary permissions to RUSTFS volumes path
    rustfs_perms:
      image: alpine
      user: root
      volumes:
        - /path/to/host_directory/volumes:/fix_path
      command: chown -R 10001:10001 /fix_path

    rustfs:
      image: rustfs/rustfs:latest
      depends_on:
        rustfs_perms:
          condition: service_completed_successfully
      volumes:
        - /path/to_host_directory/volumes/data:/data
        - /path/to_host_directory/volumes/logs:/var/log/rustfs/
      environment:
        - RUSTFS_ADDRESS=":9000"
        - RUSTFS_CONSOLE_ADDRESS=":9001"
        - RUSTFS_CONSOLE_ENABLE=true
        - RUSTFS_OBS_LOGGER_LEVEL=error
        - RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"

      # ... other configurations
```

如果只想安装 RustFS，而不安装 Grafana、Prometheus 和其他可观测性服务，请仅启动 `rustfs` 服务（compose 文件将 collector 依赖项标记为可选）：

```bash
docker compose -f docker-compose.yml up -d rustfs
```

这样只会安装并启动 `rustfs-server` 容器。无论只启动 `rustfs-server` 还是完整栈，S3 API 都位于 `http://localhost:9000`，RustFS 控制台位于 `http://localhost:9001`。请在浏览器中打开控制台，使用上面配置的访问密钥和秘密密钥登录。例如使用 `openssl rand -base64 24` 生成强密钥，绝不要将占位符值用于生产环境。

对于 Docker Compose，请在 `rustfs` 服务环境或用于变量替换的环境文件中定义唯一的 `RUSTFS_ACCESS_KEY` 和 `RUSTFS_SECRET_KEY`，然后使用 `docker compose up -d rustfs` 重新创建服务。

## 多节点部署

Docker 默认的桥接网络不支持多节点部署。使用 `--network host`，让每个容器可以直接与其他节点通信。

在**每个节点**上运行以下命令：

```bash
docker run -d \
  --name rustfs \
  --network host \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_ADDRESS=":9000" \
  -e RUSTFS_CONSOLE_ADDRESS=":9001" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_OBS_LOGGER_LEVEL=error \
  -e RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/" \
  -e RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}" \
  rustfs/rustfs:latest
```

在**每个**节点的 `/etc/hosts` 中添加条目：

```ini title="/etc/hosts"
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

## TLS 配置

如果[使用 TLS](../../integration/tls-configured.md)，需要额外挂载证书路径并指向 RustFS：

```bash
-v /path/to/certs:/certs \
-e RUSTFS_TLS_PATH=/certs \
```

## 生产环境之前

在生产环境部署前，请完成[预安装检查清单](../requirement/checklists/index.md)——硬件、网络、软件和安全。建议使用多节点部署架构、[启用 TLS 加密通信](../../integration/tls-configured.md)、配置日志轮转策略，并设置定期备份策略。

## 后续步骤

- [RustFS 控制台](/administration/console)
- [配置 S3 客户端](../../developer/examples/aws-cli.md)
- [TLS 配置](../../integration/tls-configured.md)
