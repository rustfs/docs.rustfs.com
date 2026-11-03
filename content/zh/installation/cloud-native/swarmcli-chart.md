---
title: "SwarmCLI Chart"
description: "使用 SwarmCLI 的 rustfs Chart 在 Docker Swarm 上部署 RustFS，可部署为单节点服务或采用纠删码的分布式集群：凭证保存在 Docker Secret 中，支持带版本的升级和回滚，并可选择通过 Traefik 启用 HTTPS。"
---

[SwarmCLI](https://github.com/Eldara-Tech/swarmcli) 是一个受 Helm 启发、面向 Docker Swarm 的包管理器和终端 UI。它的开源 [`rustfs` Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) 将 RustFS 部署到 Docker Swarm 上。二者均由 Eldara Tech 维护，而非 RustFS 项目。

与手写的 Stack 文件相比，该 Chart 额外提供：

- **凭证保存在 Docker Secret 中。** RustFS 通过 `RUSTFS_ACCESS_KEY_FILE` 和 `RUSTFS_SECRET_KEY_FILE` 从文件中读取根密钥，因此这两个值都不会出现在服务定义或 `docker inspect` 的输出中。默认的 `rustfsadmin` 密钥会被拒绝。
- **带版本的 Release。** 可以预览升级、应用升级，并回滚到之前的修订版本。SwarmCLI 将修订历史记录保存在 Swarm 自身中，因此无需额外的数据库。
- **通过 Traefik 启用 HTTPS。** 配合配套的 [`traefik` Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik)，S3 API 和控制台可以获得各自的主机名和 Let's Encrypt 证书，控制台还可以通过 OpenID Connect 使用单点登录。
- **带健康检查的滚动更新。** 配置值中列出的存储桶会在启动时创建，单机模式 Release 的每次滚动更新都会通过 RustFS 的 `/health/ready` 端点进行监测，因此 `--wait` 会报告出错的升级，而不是报告成功。
- **集群滚动升级。** 在分布式模式下，升级一次只滚动更新一个对等节点；如果默认的四个对等节点均在运行，集群在整个升级期间会以少一个对等节点的状态持续提供读写服务。

该 Chart 以两种模式之一运行，模式在安装时选择。单机模式为默认模式，在一个节点上运行一个使用单块磁盘的 RustFS 服务（单节点单磁盘，SNSD）。单块磁盘不提供纠删码冗余，因此适用于构建缓存、备份目标和小型 Swarm 上的应用 Blob 存储。分布式模式将对象以纠删码方式分布到四个或更多对等节点上（每个节点一个），适用于必须在丢失一个节点后依然保留的数据。第 4 步安装单机模式，第 5 步安装分布式模式；其他步骤对两种模式均适用。

## 1. 前提条件

* 一个 Docker Swarm（`docker swarm init`），以及管理节点上的 Shell
* SwarmCLI 2.2.0 或更高版本，请参阅 [SwarmCLI 安装指南](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)
* 单机模式下，Swarm 节点上的 9000 端口（S3 API）未被占用，因为第 4 步会在 Swarm 路由网格上发布该端口
* 分布式模式下，每个对等节点各需一个节点，至少四个（用于开发时单个节点即可；请参阅第 5 步）

## 2. 将凭证创建为 Docker Secret

替换凭证占位符，然后为每个密钥创建一个 Secret：

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

每个值都应位于一行内，且内部不含空白字符。例如，可以使用 `openssl rand -base64 30` 生成高强度的秘密密钥。在分布式模式下，每个对等节点都读取同样的这两个 Secret。

:::warning[服务会拒绝弱凭证]

只要任一 Secret 缺失，SwarmCLI 就会拒绝安装该 Chart；如果某个密钥为空、包含空白字符或是众所周知的 `rustfsadmin` 值，容器会在启动时退出。Docker Secret 无法修改：如需轮换凭证，请以新名称创建 Secret，然后在升级该 Release 时将 `s3.accessKeySecret` 和 `s3.secretKeySecret` 指向它们。在分布式模式下，轮换需要完全停机，如“升级与回滚”一节所述。

:::

## 3. 添加 Chart 仓库

如果 `swarmcli charts repo list` 已显示 `swarmcli-charts`，请跳过此步骤：

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 4. 安装单机模式

此步骤与第 5 步二选一，不要同时执行。命名卷只存在于一个节点上，因此服务会被固定到带有 `rustfs-data=true` 标签的节点。请只为一个节点添加该标签：

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

在单节点 Swarm 上，可以跳过标签，改为在下面的安装命令中添加 `--set persistence.nodeLabel=""`。

将该 Chart 安装为名为 `rustfs` 的 Release，在 9000 端口发布 S3 API，并在启动时创建一个存储桶：

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

服务将数据保存在 `rustfs-data` 命名卷的 `/data` 下，Docker 会以 Release 名称为前缀将其命名为 `rustfs_rustfs-data`。`buckets` 中的每个存储桶会在服务器开始响应后创建；已存在的存储桶保持不变，因此重启和升级都是安全的。

## 5. 安装分布式模式

请执行此步骤，而不是第 4 步。在分布式模式下，每个对等节点都是一个独立的 Swarm 服务（对于名为 `rustfs` 的 Release，为 `rustfs_rustfs-1` 到 `rustfs_rustfs-4`），各自拥有一个副本、自己的卷和自己的节点标签。为每个对等节点各标记一个节点：

```bash
docker node update --label-add rustfs-1=true <node-a>
docker node update --label-add rustfs-2=true <node-b>
docker node update --label-add rustfs-3=true <node-c>
docker node update --label-add rustfs-4=true <node-d>
```

请将每个对等节点放在不同的节点上：共享同一节点的对等节点会随该节点一同失效；采用默认的四个对等节点时，丢失一个承载两个对等节点的节点会导致写入停止。在单节点 Swarm 上，为这一个节点添加全部四个标签；这仅适用于开发，因为这种方式无法提供任何可用性保障。

请显式设置模式和集群结构。磁盘总数等于 `cluster.peers * cluster.drivesPerPeer`。

:::warning[安装前选择拓扑]

`cluster.peers` 和 `cluster.drivesPerPeer` 在安装时即已固定：RustFS 会在每块磁盘上记录磁盘数量和纠删集宽度，使用其他值时会拒绝启动。`mode` 同样在安装时选择。在现有 Release 上更改它不会转换数据：新模式的服务会在空磁盘上启动，旧模式的服务会继续在旁边运行，客户端会访问到两者。要将单机模式的存储迁移到集群，请将集群安装为第二个 Release，并通过 S3 将存储桶复制过去。

:::

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

buckets:
  - my-bucket
```

该示例创建四个对等节点，每个对等节点一块磁盘。每个对象会拆分为两个数据分片和两个校验分片，因此读取可容忍两个对等节点宕机，写入可容忍一个，可用容量为磁盘总容量的一半。每个对等节点使用多于一块磁盘时需要 `persistence.volumePaths`，每块磁盘对应一个主机目录，且各自位于独立的物理磁盘上；Chart README 对此有说明。使用该配置值文件安装 Chart：

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

所有对等节点会同时启动。当每个对等节点的任务都在运行，且运行时间已超过其两分钟的监控窗口时，`--wait` 就会返回。对等节点 1 会在集群接受写入后创建存储桶；如果在启动后五分钟内仍无法创建，它会记录未能创建的存储桶（可通过 `docker service logs rustfs_rustfs-1` 查看），并继续提供服务。对等节点的健康检查只能表明该对等节点存活，因此 `--wait` 无法表明集群是否在提供服务；第 6 步会检查这一点。

## 6. 验证部署

在单机模式下，检查 Release、服务任务和 S3 API 就绪端点：

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health/ready
```

S3 API 在每个 Swarm 节点上均可通过 `http://localhost:9000` 访问。客户端使用路径式寻址和区域 `us-east-1`。如果任务一直处于 pending 状态并显示 `no suitable node`，说明没有节点带有第 4 步中的 `rustfs-data=true` 标签。

在分布式模式下，检查 Release 和各对等节点的任务，然后从 `rustfs-net` 覆盖网络上的一个容器中查询集群是否在提供服务：

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs-1 rustfs_rustfs-2 rustfs_rustfs-3 rustfs_rustfs-4
docker run --rm --network rustfs-net curlimages/curl -s -o /dev/null -w '%{http_code}\n' \
  http://rustfs-rustfs:9000/minio/health/cluster
```

`200` 表示每个纠删集都达到写入法定数量。如果某个对等节点的任务一直处于 pending 状态并显示 `no suitable node`，说明没有节点带有第 5 步中该对等节点的 `rustfs-<n>=true` 标签。添加标签后，该对等节点就会启动；如果之后对等节点 1 的日志报告了未能创建的存储桶，请重启对等节点 1 以再次创建存储桶：`docker service update --force rustfs_rustfs-1`。

加入 `rustfs-net` 的服务通过 `http://rustfs-rustfs:9000` 访问集群，使用路径式寻址和区域 `us-east-1`。任一对等节点都能提供所有对象，该名称会解析到每个健康检查通过的对等节点。该检查只能表明对等节点存活，因此在首次安装时，或在所有对等节点都停止之后，对等节点可能会返回 503，直到集群开始提供服务。正在发往某个对等节点的请求在该对等节点停止时也会失败。客户端必须重试，S3 客户端默认会这样做。要从 Swarm 外部访问集群，请按“暴露模式”一节所述将其暴露。

## 升级与回滚

每次安装、升级和回滚都会为该 Release 创建一个带编号的修订版本。升级会从 Chart 的默认值开始，因此请重新传入所有配置值（如果在第 4 步中使用了 `--set persistence.nodeLabel=""`，也要一并传入），或者将配置值保存在文件中并通过 `-f` 传入。对于第 4 步中的单机模式 Release，预览变更、应用变更，并列出修订版本：

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts upgrade rustfs swarmcli-charts/rustfs --wait \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts history rustfs
```

要恢复到之前的修订版本：

```bash
swarmcli charts rollback rustfs 1
```

回滚会重新部署该修订版本的服务定义，但不会恢复数据。

在分布式模式下，请在每次升级时传入安装时使用的配置值文件，而不是使用 `--reuse-values`，并将之后的变更（例如暴露设置）写入该文件。配置值中缺少 `mode: distributed` 的升级会保持对等节点不变，并在它们旁边启动一个单机模式服务。

SwarmCLI 逐个更新对等节点：它停止一个对等节点，启动其新任务，并且只有在该任务运行且运行时间已超过其监控窗口后，才会转到下一个对等节点。如果默认的四个对等节点均在运行，集群在整个升级期间会以少一个对等节点的状态持续提供读写服务；如果已有一个对等节点宕机，则每当升级停止另一个对等节点时，集群都会停止接受写入。因此，请先使用第 6 步中的命令确认每个对等节点的任务都在运行，且集群返回 `200`；仅凭 `200` 并不能表明每个对等节点都在运行。然后预览并应用升级，之后再次检查集群：

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

回滚也会以相同方式滚动更新对等节点。如果升级中某个对等节点启动失败，升级会在此停止，其余对等节点保持不变。

:::warning[轮换集群凭证需要完全停机]

每个对等节点都从凭证对派生其节点间密钥，因此使用旧凭证对的对等节点与使用新凭证对的对等节点无法互相访问，一次只滚动更新一个对等节点的升级会导致集群分裂。创建新的 Secret：

```bash
printf '%s' '<your-new-access-key>' | docker secret create rustfs-access-key-2 -
printf '%s' '<your-new-secret-key>' | docker secret create rustfs-secret-key-2 -
```

将这两个 Secret 名称添加到 `distributed-values.yaml` 中，以便之后的升级保留它们。基于第 5 步中的配置值，该文件随后如下所示：

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

s3:
  accessKeySecret: rustfs-access-key-2
  secretKeySecret: rustfs-secret-key-2

buckets:
  - my-bucket
```

然后停止所有对等节点并执行升级，使所有对等节点使用新凭证对同时启动：

```bash
for n in 1 2 3 4; do docker service scale "rustfs_rustfs-$n=0"; done
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

数据和存储桶会保留下来；客户端需要使用新凭证对。不要回滚到轮换之前的修订版本：回滚会逐个将对等节点切换回旧凭证对，同样会导致集群分裂。

:::

## 暴露模式

该 Chart 分别暴露 S3 API 和控制台。控制台默认关闭，可通过 `console.enabled=true` 启用。S3 API 的模式由 `exposure.mode` 设置，控制台的模式由 `console.exposure.mode` 设置：

| 模式 | 可访问范围 |
| - | - |
| `none`（默认） | 连接到 `rustfs-net` 覆盖网络的服务，地址为 `http://<release>-rustfs:9000`（控制台启用后位于 9001 端口）；另一个监听器使用 `traefik` 时，`traefik-public` 上的服务也可访问 |
| `published` | 发布的端口：S3 API 使用 `publish.port`，控制台使用 `console.publish.port`（9001），发布在 Swarm 路由网格上（在分布式模式下，发布在每个对等节点自身所在的节点上） |
| `traefik` | 由 Traefik 通过 HTTPS 路由的主机名：S3 API 使用 `ingress.host`，控制台使用 `console.ingress.host` |

`traefik` 模式需要先安装 [`traefik` Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik)：它会创建 RustFS 所加入的 `traefik-public` 网络，并获取 Let's Encrypt 证书。然后让单机模式 Release 的 S3 API 通过自己的主机名对外提供服务：

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=traefik \
  --set ingress.host=s3.example.com \
  --set 'buckets={my-bucket}'
```

不使用 Traefik 时，可以在发布 S3 API 的同时，在 9001 端口发布单机模式 Release 的控制台：

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

在分布式模式下，每个对等节点都使用相同的暴露设置；请在 `distributed-values.yaml` 中设置它们，然后按“升级与回滚”一节所述执行升级。使用 `traefik` 时，Traefik 会在所有健康的对等节点之间均衡请求。`published` 模式需要 `publish.mode=host`（控制台还需要 `console.publish.mode=host`），它会在每个对等节点自身所在的节点上发布端口，而不是在路由网格上发布，因此某个节点的端口只能访问该节点上的对等节点。请在这些节点前部署负载均衡器，或使用 Traefik。主机模式发布要求每个对等节点各自位于独立的节点上，因此单节点 Swarm 无法使用它。

## 关键配置值

| 配置值 | 用途 | Chart 默认值 |
| - | - | - |
| `image.tag` | RustFS 镜像标签 | `""`（Chart 固定的 RustFS 版本） |
| `mode` | `standalone` 或 `distributed`，在安装时选择 | `standalone` |
| `cluster.peers` | 分布式模式的对等节点数，每个对应一个服务和一个节点标签；至少为 4 | `4` |
| `cluster.drivesPerPeer` | 每个分布式对等节点的磁盘数；多于一块时需要 `persistence.volumePaths` | `1` |
| `s3.accessKeySecret` / `s3.secretKeySecret` | 保存根凭证的 Docker Secret | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | 启动时创建的存储桶（若尚不存在） | `[]` |
| `exposure.mode` | S3 API 暴露方式：`none`、`published` 或 `traefik` | `none` |
| `publish.port` | 发布的 S3 API 端口 | `9000` |
| `ingress.host` | Traefik 路由到 S3 API 的主机名 | `s3.example.com` |
| `console.enabled` | 运行控制台监听器 | `false` |
| `console.exposure.mode` | 控制台暴露方式：`none`、`published` 或 `traefik` | `none` |
| `persistence.nodeLabel` | 单机模式服务固定到的节点标签；`""` 表示不固定 | `rustfs-data` |
| `persistence.nodeLabelPrefix` | 将分布式对等节点 `<n>` 固定到 `<prefix>-<n>` 的节点标签前缀；`""` 表示不固定，仅适用于单节点 Swarm | `rustfs` |
| `persistence.volumePath` | 在单机模式下以绑定挂载方式挂载到 `/data` 的主机目录，用于代替命名卷；所有者必须为 `10001` | `""` |
| `extraEnv` | 额外的 `RUSTFS_*` 环境变量，例如 `RUSTFS_SERVER_DOMAINS` | `{}` |

[Chart README](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) 记录了所有配置值，包括 Traefik 路由、通过 OpenID Connect 为控制台配置单点登录，以及两种模式的主机目录绑定挂载。

## 卸载

```bash
swarmcli charts uninstall rustfs
```

卸载会删除服务（在分布式模式下为每个对等节点的服务）和 Release 历史记录，但会保留数据卷（在分布式模式下每个对等节点一个）、两个 Docker Secret 和 `rustfs-net` 网络；SwarmCLI 会列出该网络及其删除命令。

:::note[数据卷在卸载后仍会保留]

在单机模式下，之后以相同 Release 名称重新安装时，会重新挂载该卷及其中的数据。如需丢弃数据，请在任务停止后（最多 30 秒）在带标签的节点上删除该卷：

```bash
docker volume rm rustfs_rustfs-data
```

在分布式模式下，每个对等节点都在带有 `rustfs-<n>=true` 标签的节点上保留自己的卷 `rustfs_rustfs-data-<n>`；请在该对等节点的任务停止后，在该节点上删除它。之后以相同 Release 名称重新安装时会复用这些卷，因此必须保持相同的 `cluster.peers` 和 `cluster.drivesPerPeer`。

无论哪种模式，如果不再需要这些 Secret，请将其删除：包括该 Release 使用的一对 Secret，以及被轮换替换下来的任何一对 Secret。以第 2 步中的名称为例：

```bash
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## 后续步骤

- [RustFS 控制台](/administration/console)
- [配置 S3 客户端](../../developer/examples/aws-cli.md)
- [安装前检查清单](../requirement/checklists/index.md)
