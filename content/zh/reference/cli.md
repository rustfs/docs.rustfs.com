---
title: "CLI 参考"
description: "介绍 rustfs 命令行界面，包括 server、info 和 tls 子命令、主要参数及对应环境变量，以及卷路径语法。"
---

`rustfs` 二进制文件提供三个子命令。不带子命令运行 `rustfs` 时会启动服务器。

## 子命令

| 命令 | 说明 |
| --- | --- |
| `rustfs server [OPTIONS] <VOLUMES>...` | 启动对象存储服务器（未指定子命令时的默认行为）。 |
| `rustfs info [--all] [--json] [system\|runtime\|build\|config\|deps]` | 显示系统、运行时、构建、配置或依赖项信息。 |
| `rustfs tls inspect --path <DIR>` | 检查 TLS 证书目录布局和解析状态。 |

```bash title="Examples"
rustfs server /data/rustfs
rustfs info --all --json
rustfs tls inspect --path /etc/rustfs/tls
```

### 旧版调用兼容性

RustFS 会预处理参数以保持向后兼容，因此旧版调用方式仍可使用：

| 旧版形式 | 解释为 |
| --- | --- |
| `rustfs /data` | `rustfs server /data` |
| `rustfs --address :9000 /data` | `rustfs server --address :9000 /data` |
| `rustfs`（无参数） | `rustfs server`，卷从 `RUSTFS_VOLUMES` 读取 |
| `rustfs --info` | `rustfs info` |
| `rustfs help` | `rustfs --help` |

## 服务器参数

每个服务器参数都有对应的环境变量；两者同时设置时，以参数为准。

| 参数 | 环境变量 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `<VOLUMES>...`（位置参数） | `RUSTFS_VOLUMES` | 必填 | 存储卷或端点，以空格分隔。 |
| `--address` | `RUSTFS_ADDRESS` | `:9000` | S3 API 绑定地址（`ADDRESS:PORT`、IP 或主机名）。 |
| `--server-domains` | `RUSTFS_SERVER_DOMAINS` | 未设置 | 用于虚拟主机风格请求的域名，以逗号分隔。 |
| `--access-key` | `RUSTFS_ACCESS_KEY` | 未设置 | 根访问密钥（与 `--access-key-file` 冲突）。 |
| `--access-key-file` | `RUSTFS_ACCESS_KEY_FILE` | 未设置 | 包含根访问密钥的文件。 |
| `--secret-key` | `RUSTFS_SECRET_KEY` | 未设置 | 根私有密钥（与 `--secret-key-file` 冲突）。 |
| `--secret-key-file` | `RUSTFS_SECRET_KEY_FILE` | 未设置 | 包含根私有密钥的文件。 |
| `--console-enable` | `RUSTFS_CONSOLE_ENABLE` | `true` | 启用内嵌 Web 控制台。 |
| `--console-address` | `RUSTFS_CONSOLE_ADDRESS` | `:9001` | 控制台绑定地址。 |
| `--obs-endpoint` | `RUSTFS_OBS_ENDPOINT` | 空 | 用于链路、指标和日志的 OTLP/HTTP 基础 URL。 |
| `--tls-path` | `RUSTFS_TLS_PATH` | 未设置 | API 和控制台的 TLS 证书目录。 |
| `--license` | `RUSTFS_LICENSE` | 未设置 | 许可证字符串。 |
| `--region` | `RUSTFS_REGION` | 未设置 | 向客户端报告的服务区域。 |
| `--kms-enable` | `RUSTFS_KMS_ENABLE` | `false` | 启用 KMS 服务端加密。 |
| `--kms-backend` | `RUSTFS_KMS_BACKEND` | `local` | KMS 后端：`local`、`vault` / `vault-kv2`、`vault-transit`。 |
| `--kms-key-dir` | `RUSTFS_KMS_KEY_DIR` | 未设置 | 本地 KMS 后端的密钥目录。 |
| `--kms-local-master-key` | `RUSTFS_KMS_LOCAL_MASTER_KEY` | 未设置 | 用于加密本地 KMS 密钥文件的主密钥。 |
| `--kms-vault-address` | `RUSTFS_KMS_VAULT_ADDRESS` | 未设置 | Vault 后端的 Vault 地址。 |
| `--kms-vault-token` | `RUSTFS_KMS_VAULT_TOKEN` | 未设置 | Vault 后端的 Vault 令牌。 |
| `--kms-vault-mount-path` | `RUSTFS_KMS_VAULT_MOUNT_PATH` | 未设置 | Vault 挂载路径。 |
| `--kms-default-key-id` | `RUSTFS_KMS_DEFAULT_KEY_ID` | 未设置 | 用于加密的默认 KMS 密钥 ID。 |
| `--kms-allow-insecure-dev-defaults` | `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | 允许仅用于开发的不安全 KMS 默认值。 |
| `--buffer-profile` | `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | 自适应缓冲区大小的工作负载配置。 |
| `--buffer-profile-disable` | `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | 使用旧版固定大小缓冲区。 |

:::note

如果既未提供 `--access-key`/`--secret-key`，也未提供对应的文件参数，服务器会回退到内置默认凭证（`rustfsadmin`/`rustfsadmin`）并记录警告。任何非一次性部署都应设置实际凭证。

:::

## 卷语法

卷通过位置参数（或 `RUSTFS_VOLUMES`）传入，并以空格分隔。

### 省略号展开

卷标记可以包含一个或多个 `{N...M}` 范围，并按数字展开：

```bash title="Ellipses expansion"
# Expands to /data/rustfs0 /data/rustfs1 /data/rustfs2 /data/rustfs3
rustfs server /data/rustfs{0...3}

# Multi-node: expands across hosts and disks
rustfs server http://node{1...4}:9000/data/rustfs{0...3}
```

解析器验证的规则如下：

- 范围格式为 `{N...M}`，其中 `N` 和 `M` 是十进制或十六进制正整数，且 `M` 必须大于 `N`。
- 单个标记可以包含多个范围（例如主机范围和磁盘范围）；所有组合都会展开。
- 单个范围最多展开为 10,000 个条目。

### 多个池

不同服务器池表示为以空格分隔的端点组。每个参数（每个空格分隔项）形成独立的展开组：

```bash title="Two pools"
rustfs server http://node{1...4}:9000/data/rustfs{0...3} http://node{5...8}:9000/data/rustfs{0...3}
```

通过环境变量设置时，将相同字符串写入 `RUSTFS_VOLUMES`：

```bash title="Via environment"
export RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}"
rustfs server
```