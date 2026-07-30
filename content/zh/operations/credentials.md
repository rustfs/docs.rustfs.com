---
title: "凭证管理"
description: "本文介绍通过环境变量和密钥文件配置 RustFS 根凭证、安全轮换凭证、节点间 RPC 密钥，以及兼容 MinIO 的环境变量别名。"
---

## 根凭证

RustFS 从以下变量读取根（管理员）凭证对：

```bash
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

如果两者均未提供，服务器会回退到内置默认值 `rustfsadmin` / `rustfsadmin`。

:::warning

默认的 `rustfsadmin` 凭证是公开且广为人知的。容器入口点会输出警告，但仍会启动。在将端口 9000/9001 暴露到 localhost 以外之前，请务必设置非默认凭证。此外，使用全默认凭证对运行的多节点集群**必须**设置 `RUSTFS_RPC_SECRET`（见下文），否则服务器会拒绝从默认密钥派生节点间 RPC 身份认证信息。

:::

## 基于文件的注入（Docker/Kubernetes Secrets）

您可以让 RustFS 指向包含凭证的文件，而不是将密钥放入环境变量：

```bash
RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
```

也可以使用等效的 CLI 标志（`--access-key-file`、`--secret-key-file`）。容器入口点会强制执行以下规则：

- 仅读取文件的**第一行**；会移除两端空白和 CR 字符（使用 CRLF 编辑的文件）。文件末尾没有换行符也有效。
- 为同一凭证同时设置直接变量和 `_FILE` 变体会导致硬错误：`Set either RUSTFS_ACCESS_KEY or RUSTFS_ACCESS_KEY_FILE, not both.`
- 空值、空文件或无法读取的文件会导致硬错误（退出码 1）。
- 文件包含默认值 `rustfsadmin` 时，会触发与直接变量相同的警告。

```yaml title="docker-compose example with secrets"
services:
  rustfs:
    image: rustfs/rustfs:latest
    environment:
      - RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
      - RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
    secrets:
      - rustfs_access_key
      - rustfs_secret_key
secrets:
  rustfs_access_key:
    file: ./secrets/access_key.txt
  rustfs_secret_key:
    file: ./secrets/secret_key.txt
```

## 轮换根凭证

集群中的所有节点都必须使用**相同的**根凭证对运行，除非显式设置 `RUSTFS_RPC_SECRET`，否则节点间 RPC 身份认证信息会由该凭证对派生。

:::note

以下分步过程由经过验证的构建块组成（环境变量/文件配置以及经过验证的滚动重启就绪信号），属于标准运维实践；RustFS 目前未提供在线根凭证轮换 API 的文档。

:::

1. 如果尚未设置，请在轮换**之前**显式设置 `RUSTFS_RPC_SECRET`（所有节点使用相同值）。这样可将节点间身份认证与凭证对解耦，使集群能够在滚动重启期间容忍节点暂时混用新旧根凭证。
2. 使用新的 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY`（或 `_FILE` 变体指向的文件）更新**每个**节点上的环境文件/密钥。
3. **一次重启一个节点**，等待每个节点的端口 9000 上 `GET /health/ready` 返回 `200`，再重启下一个节点。
4. 更新所有使用旧凭证对的客户端、SDK 配置和自动化任务。
5. 验证：使用旧凭证签署请求，并确认请求被拒绝。

## RUSTFS_RPC_SECRET（节点间 RPC 身份认证）

分布式集群的节点使用共享密钥对内部 RPC 流量进行身份认证：

- 如果设置了 `RUSTFS_RPC_SECRET`，则直接使用该值。请在**每个节点上设置相同的值**。
- 如果未设置，则从当前访问密钥/秘密密钥对**派生**（HMAC）该密钥，因此所有节点必须共享相同的根凭证。
- 当秘密密钥为默认值 `rustfsadmin` 时，派生会**以失败关闭**：公开已知的密钥会生成任何网络对等端都能计算的 RPC 密钥，从而伪造节点间签名。在这种配置中，必须设置 `RUSTFS_RPC_SECRET` 或配置非默认的 `RUSTFS_SECRET_KEY`，节点间 RPC 才能进行身份认证。

需要显式设置的情况：

- （临时或长期）使用默认根凭证的多节点集群；
- 轮换根凭证之前，以便在发布期间保持节点间身份认证稳定；
- 希望节点间身份认证独立于 S3 根凭证生命周期的环境。

```bash
# Same value on every node
RUSTFS_RPC_SECRET=<your-rpc-secret>
```

## 兼容性别名

为了直接迁移，在未设置规范的 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` 时，RustFS 接受旧版和 MinIO 兼容名称的凭证变量：

| 接受的别名 | 规范变量 |
| --- | --- |
| `RUSTFS_ROOT_USER` (legacy) | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD` (legacy) | `RUSTFS_SECRET_KEY` |
| `MINIO_ROOT_USER` | `RUSTFS_ROOT_USER` → `RUSTFS_ACCESS_KEY` |
| `MINIO_ROOT_PASSWORD` | `RUSTFS_ROOT_PASSWORD` → `RUSTFS_SECRET_KEY` |

`MINIO_` 前缀映射涵盖更广泛的变量允许列表（地址、控制台地址、审计 webhook 设置等），并在启动时作为“外部前缀兼容性映射”应用。

:::note

这些别名已弃用。使用别名时，服务器会记录一次以下形式的警告：`Environment variable MINIO_ROOT_USER is deprecated, use RUSTFS_ROOT_USER instead`。新部署请使用带 `RUSTFS_` 前缀的规范名称；同时设置两者时，规范名称始终优先。

:::

## 根凭证之外的访问

日常访问不应使用根凭证对。请通过端口 9001 上的控制台或 IAM 管理 API 创建权限受限的用户、组、策略和服务账户，并仅将根凭证用于管理操作。请参阅管理部分的 IAM 文档。