---
title: "状态检查"
description: "检查 RustFS 网络访问、健康端点、集群状态和存储容量。"
---

使用网络探针、RustFS 控制台中的 **Status** 页面或 `rc` 命令行查看 RustFS 可用性和存储消耗。使用命令行工作流程之前，请[安装 `rc`](/operations/rc) 并为目标集群配置别名。

## 网络端口

RustFS 默认使用两个监听器。您可以通过环境变量或命令行标志更改两个绑定地址。

| 端口 | 监听器 | 配置方式 | 流量 |
| --- | --- | --- | --- |
| `9000` | S3 API | `RUSTFS_ADDRESS` / `--address` | S3 对象 API、管理 API，以及 `/rustfs/rpc/` 和 `/rustfs/peer/` 下的内部节点间 RPC |
| `9001` | 控制台 | `RUSTFS_CONSOLE_ADDRESS` / `--console-address` | `/rustfs/console/` 下的嵌入式 Web 控制台；使用 `RUSTFS_CONSOLE_ENABLE=false` 将其禁用 |

:::note[节点间连接]

节点间 RPC 共用端口 9000。在多节点集群中，每个节点都必须能够通过 S3 端口访问其他所有节点；没有单独的集群端口。

:::

当客户端需要访问两个监听器时，使用 `firewalld` 开放默认端口：

```bash title="firewall-cmd"
firewall-cmd --permanent --add-port=9000/tcp
firewall-cmd --permanent --add-port=9001/tcp
firewall-cmd --reload
```

:::warning[限制控制台访问]

仅向可信网络开放端口 9001。如果不需要控制台，请设置 `RUSTFS_CONSOLE_ENABLE=false` 并保持端口关闭。

:::

## 健康端点

端口 **9000** 上的 S3 监听器提供无需身份认证的探针端点。使用 `RUSTFS_HEALTH_ENDPOINT_ENABLE=false` 将其禁用。端口 **9001** 上的控制台具有自己的健康检查路径。

| 端点 | 端口 | 含义 |
| --- | --- | --- |
| `GET /health`, `HEAD /health`, `GET /health/live`, `GET /minio/health/live` | 9000 | 存活状态，只要进程正在运行就返回 `200` |
| `GET /health/ready` | 9000 | 就绪状态，仅当存储、IAM 和对等节点健康状态就绪时返回 `200`，否则返回 `503` |
| `GET /minio/health/ready` | 9000 | 与 MinIO 兼容的就绪探针别名 |
| `GET /minio/health/cluster`, `GET /minio/health/cluster/read` | 9000 | 集群写入/读取健康状态（还要求锁定仲裁） |
| `GET /rustfs/console/health` | 9001 | 控制台进程健康状态 |

就绪节点响应 `200` 和 `"ready": true`。降级节点响应 `503`，并提供各依赖项的详细信息：

```bash title="Probe examples"
curl -fsS http://localhost:9000/health
curl -s http://<node>:9000/health/ready | jq
curl -fsS http://localhost:9001/rustfs/console/health
```

`details` 对象报告 `storage` / `iam` / `lock`（配置 KMS 时还包括 `kms`），`degradedReasons` 列出机器可读的原因，例如 `storage_quorum_unavailable`、`iam_not_ready` 或 `lock_quorum_unavailable`。

## 集群状态

### 在控制台中检查集群状态

1. 登录 RustFS 控制台。
2. 打开 **Status**。
3. 确认集群在线，并查看服务器、网络和驱动器状态。
4. 在维护或容量变更前，调查所有离线服务器、不可用驱动器或失败的网络连接。

### 使用 rc 检查集群状态

使用已配置的别名运行集群信息命令：

```bash
rc admin info cluster rustfs
```

概览报告集群状态、RustFS 版本、服务器和磁盘数量、后端类型以及纠删码奇偶校验数。节点列表显示运行时间、网络连接、驱动器可用性和存储池成员关系。磁盘列表显示每个驱动器的状态，以及存储池、集合和磁盘位置。

如需机器可读的输出，请请求 JSON：

```bash
rc admin info cluster rustfs --json
```

## 存储容量

### 在控制台中检查存储容量

1. 登录 RustFS 控制台并打开 **Status**。
2. 查看集群的已用和总存储容量。
3. 查看每个磁盘的容量和可用空间。
4. 对比一段时间内的使用情况，并在可用容量不足以支持正常写入和维护之前规划扩容。

### 使用 rc 检查存储容量

使用相同的集群信息命令：

```bash
rc admin info cluster rustfs
```

**Storage** 摘要报告集群的已用容量、总容量和已用百分比。**Disks** 下的每个条目报告相应驱动器的已用、总计和可用容量。

在脚本或监控集成中采集这些值时，请使用 JSON 输出：

```bash
rc admin info cluster rustfs --json
```

管理信息命令要求凭证具有相应的 RustFS Admin API 权限。

## 后续步骤

如需持续遥测和告警，请继续阅读[可观测性](./observability.md)。如需添加存储，请查看[存储池扩容](./scaling/storage-pool-expansion.md)。