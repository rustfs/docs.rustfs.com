---
title: "SSE-KMS"
description: "使用本地或 HashiCorp Vault KMS 后端为 RustFS 配置 SSE-KMS。"
---

RustFS 密钥管理服务（KMS）为 [SSE-S3](./sse-s.md) 和 SSE-KMS 生成并封装每对象数据加密密钥。本指南介绍如何在服务器启动时使用本地密钥存储、Vault KV v2 加 Transit 或 Vault Transit 配置 SSE-KMS。

## 要求

- 为加密验证工作流程安装并配置 [`rc`](/operations/rc)。
- 更改加密配置之前，备份所有现有数据和 KMS 密钥材料。
- 对每个 RustFS 节点应用相同的 KMS 后端和默认密钥 ID。
- 使用进程管理器或密钥管理器注入密钥，不要将其提交到源代码管理系统。
- 使用 Vault 时，请启用所需的密钥引擎、创建最小权限令牌，并确保每个 RustFS 节点都可以访问 Vault。
- 在将 KMS 主密钥的 ID 配置为 RustFS 默认密钥之前，先预置该主密钥。

:::warning[密钥丢失会导致加密对象无法读取]

RustFS 不会在配置的后端之外存储可恢复的 KMS 主密钥副本。写入加密对象之前，请备份本地密钥文件及其主密钥，或保护 Vault 数据和恢复凭证。

:::

## 选择后端

| 后端 | `RUSTFS_KMS_BACKEND` | 密钥存储和封装 | 适用场景 |
| --- | --- | --- | --- |
| Local | `local` | RustFS 主机上的密钥文件 | 开发、测试或经过审慎备份的单主机部署 |
| Vault KV2 | `vault` 或 `vault-kv2` | 元数据存储在 Vault KV v2 中；通过 Vault Transit 进行封装 | 集中式生产密钥管理 |
| Vault Transit | `vault-transit` | 通过 Vault Transit 执行加密操作 | 不使用 KV2 后端模式的集中式生产密钥管理 |

SSE-S3 和 SSE-KMS 都要求 KMS 服务正在运行。当 KMS 不可用时，仅配置存储桶默认设置并不能使加密写入成功。

## 配置本地后端

创建一个由 RustFS 服务账户拥有的绝对路径密钥目录：

```bash
sudo install -d -m 0700 -o rustfs -g rustfs /var/lib/rustfs/kms
```

在每个节点的 RustFS 环境文件中添加 KMS 设置：

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=local
RUSTFS_KMS_KEY_DIR=/var/lib/rustfs/kms
RUSTFS_KMS_LOCAL_MASTER_KEY=<your-kms-master-key>
```

RustFS 服务器启动路径需要 `RUSTFS_KMS_KEY_DIR`。本地后端写入密钥文件时只授予所有者权限。除非显式设置 `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true`，否则 RustFS 会拒绝临时密钥目录或缺失本地主密钥等开发默认值；切勿在生产环境中启用此覆盖设置。

更新环境后重启 RustFS。此操作会启动 KMS 后端，但不会创建主密钥：

```bash
sudo systemctl restart rustfs
sudo systemctl status rustfs --no-pager
```

## 配置 Vault KV2

为密钥元数据启用 KV v2 引擎，并为密钥封装启用 Transit 引擎。然后配置每个 RustFS 节点：

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-kv2
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_MOUNT_PATH=transit
```

服务器启动接口使用 `secret` 作为 KV 挂载点，使用 `rustfs/kms/keys` 作为密钥前缀。使用能够读写该 KV 路径并执行所需 Transit 操作的 Vault 令牌。

RustFS 会验证 Vault URL；除非设置 `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS=true`，否则会拒绝不安全的开发默认值。在生产环境中使用 HTTPS 以及 RustFS 主机信任的证书。

## 配置 Vault Transit

启用 Transit 引擎并配置每个 RustFS 节点：

```ini title="/etc/default/rustfs"
RUSTFS_KMS_ENABLE=true
RUSTFS_KMS_BACKEND=vault-transit
RUSTFS_KMS_VAULT_ADDRESS=https://vault.example.com:8200
RUSTFS_KMS_VAULT_TOKEN=<your-vault-token>
RUSTFS_KMS_VAULT_MOUNT_PATH=transit
```

Vault Transit 会保留历史密钥版本，因此轮换 Transit 密钥本身不会导致使用旧版本封装的对象无法读取。只要仍有对象依赖旧版本，就应保持这些版本启用。

## 创建并选择默认密钥

`RUSTFS_KMS_DEFAULT_KEY_ID` 用于选择现有密钥，不会创建密钥。启动 KMS 后端时先不设置此变量，创建密钥后再添加该变量并重启 RustFS。

当安装的 `rc` 提供 KMS 生命周期命令时，使用以下命令创建并检查密钥：

```bash
rc admin kms status rustfs
rc admin kms key create rustfs --name rustfs-default-key
rc admin kms key status rustfs rustfs-default-key
```

然后在每个 RustFS 节点上添加相同的默认密钥 ID：

```ini title="/etc/default/rustfs"
RUSTFS_KMS_DEFAULT_KEY_ID=rustfs-default-key
```

更改默认设置后，以一致方式重启每个节点。

对于 Vault Transit，也可以直接在 Vault 中创建具名 Transit 密钥，再将其配置为默认密钥：

```bash
vault write -f transit/keys/rustfs-default-key
```

:::note[rc 版本边界]

验证主机上测试的 `rc 0.1.29` 不提供 `rc admin kms`；它仅支持下文使用的存储桶和对象加密命令。执行密钥生命周期命令之前，请运行 `rc admin --help`。如果没有 KMS 命令系列，请使用包含这些命令的较新 `rc` 版本，或通过原生 RustFS KMS Admin API 预置密钥。

:::

## 验证 KMS 支持的加密

创建测试存储桶，使用默认密钥配置 SSE-KMS，上传对象并将其读回：

```bash
rc bucket create rustfs/my-bucket
rc bucket encryption set rustfs/my-bucket --mode sse-kms
rc bucket encryption info rustfs/my-bucket
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

要选择特定 KMS 密钥，请在存储桶默认设置或单次写入中进行设置：

```bash
rc bucket encryption set rustfs/my-bucket \
	--mode sse-kms \
	--key-id rustfs-default-key

rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-kms rustfs/my-bucket/hello.txt=rustfs-default-key
```

`=` 前的选择器必须与传递给 `rc object copy` 的目标完全匹配。

## 轮换和恢复密钥

- **Vault 令牌：** 签发替代令牌、更新每个 RustFS 节点、以一致方式重启、验证加密读取和写入，然后撤销旧令牌。
- **Vault Transit 密钥：** 在 Vault 中轮换 Transit 密钥。新的封装操作使用新版本，而 Vault 保留旧版本用于解密。
- **本地或 Vault KV2 密钥材料：** 轮换前备份当前材料，并验证轮换前后写入的对象都仍然可以读取。
- **现有对象：** 轮换主密钥不会重写对象数据。每个对象会保留与其加密元数据一起存储的已封装数据密钥。

在确认没有保留的对象依赖旧主密钥版本之前，不要删除或禁用该版本。

## 后续步骤

配置 [SSE-S3](./sse-s.md)；如果客户端必须掌控加密密钥，请使用 [SSE-C](./sse-c.md)。