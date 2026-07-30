---
title: "SFTP"
description: "构建、配置并使用 RustFS SFTP 网关，通过 SFTP 客户端访问存储桶和对象。"
---

RustFS 包含一个 SSH 文件传输协议（SSH File Transfer Protocol，SFTP）网关，通过加密的 SSH 连接向 SFTP 客户端公开存储桶和对象。你可以列出和创建存储桶，以及上传、下载、重命名或删除对象；RustFS 会根据通过身份验证的身份与访问管理（IAM）用户权限执行每项操作。

SFTP 是可选的编译时功能，不包含在默认 RustFS 构建中。启用监听器前，请使用 `sftp` 或 `full` 功能构建 RustFS。监听器在运行时默认禁用。

## 概述

网关将 SFTP 路径映射到 RustFS 资源：

| SFTP 路径 | RustFS 资源 |
| --- | --- |
| `/` | 已验证身份的用户可见的所有存储桶 |
| `/my-bucket/` | `my-bucket` 存储桶 |
| `/my-bucket/hello.txt` | `my-bucket` 中的 `hello.txt` 对象 |
| `/my-bucket/docs/hello.txt` | `my-bucket` 中的 `docs/hello.txt` 对象 |

RustFS 通过 SFTP 网关支持以下操作：

| SFTP 操作 | RustFS 操作 |
| --- | --- |
| 列出 `/` | 列出可见存储桶 |
| 列出存储桶或前缀 | 列出对象和前缀 |
| 在 `/` 下执行 `mkdir` | 创建存储桶 |
| `put` | 上传对象 |
| `get` | 下载对象 |
| `rename` | 复制对象，然后删除源对象 |
| `rm` | 删除对象 |
| 在 `/` 下执行 `rmdir` | 删除空存储桶 |

在 `/` 的直属位置创建或删除目录，会创建或删除存储桶。存储桶下的目录映射到对象键前缀，不作为独立的文件系统目录存在。

将 RustFS 访问密钥作为 SFTP 用户名，将其秘密密钥作为密码。RustFS 会针对每项操作检查 IAM 用户的 S3 策略。

:::warning[仅支持密码身份验证]

SFTP 网关不支持客户端公钥身份验证或匿名访问。SSH 主机密钥用于标识服务器，不用于验证客户端身份。不要为 RustFS SFTP 配置 `authorized_keys` 文件。

:::

## 配置

### 构建 SFTP 支持

使用 SFTP 功能构建 RustFS：

```bash
cargo build --release --features sftp
```

要启用包括 SFTP 在内的所有可选 RustFS 功能，请改用 `--features full`。在未使用 `sftp` 功能构建的二进制文件中，设置 `RUSTFS_SFTP_ENABLE=true` 不会生效。

### SFTP 变量

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `RUSTFS_SFTP_ENABLE` | 启用 SFTP 监听器。 | `false` |
| `RUSTFS_SFTP_ADDRESS` | SFTP 连接的绑定地址。 | `0.0.0.0:2222` |
| `RUSTFS_SFTP_HOST_KEY_DIR` | 包含至少一个未加密 SSH 私有主机密钥的目录。启用 SFTP 时必需。 | 未设置 |
| `RUSTFS_SFTP_READ_ONLY` | 拒绝修改存储桶或对象的操作。 | `false` |
| `RUSTFS_SFTP_IDLE_TIMEOUT` | SSH 不活动超时秒数。必须大于零。 | `600` |
| `RUSTFS_SFTP_PART_SIZE` | 分段上传的分段大小（字节）。 | `16777216` (16 MiB) |

默认端口 `2222` 避免使用特权 SSH 端口 `22`。地址可以使用 IPv4 或 IPv6 语法，例如 `127.0.0.1:2222` 或 `[::]:2222`。

### 准备主机密钥

创建持久主机密钥目录并生成 Ed25519 主机密钥：

```bash
mkdir -p /path/to/sftp-keys
ssh-keygen -t ed25519 \
	-f /path/to/sftp-keys/ssh_host_ed25519_key \
	-N ""
chmod 600 /path/to/sftp-keys/ssh_host_ed25519_key*
```

主机密钥不能使用密码短语。RustFS 也接受可解码的 ECDSA 和 RSA 私有主机密钥。

在 Unix 上，主机密钥目录中的每个常规文件必须只能由其所有者访问。`ssh-keygen` 命令还会创建 `.pub` 文件；可以按上述方式保留仅限所有者的权限，也可以将其删除，因为 RustFS 不会读取该文件。如果目录缺失、不包含可用私钥，或包含设置了组或其他用户权限位的常规文件，RustFS 会拒绝启动。

:::warning[保护主机密钥]

重启后应继续使用相同的主机密钥，以便客户端验证服务器身份。将访问权限限制到运行 RustFS 的账户，并安全备份密钥。主机密钥发生变化会导致客户端显示可能存在中间人攻击的警告。

:::

### 启动 SFTP 监听器

以下示例在回环接口上启动 SFTP，用于本地测试：

```bash
export RUSTFS_SFTP_ENABLE=true
export RUSTFS_SFTP_ADDRESS=127.0.0.1:2222
export RUSTFS_SFTP_HOST_KEY_DIR=/path/to/sftp-keys
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

对于远程连接，请绑定到合适的网络接口，并允许传入 TCP 流量访问已配置的 SFTP 端口。此监听器与 S3 API 和控制台监听器分开。

## 使用

以下示例使用 OpenSSH `sftp` 客户端、规范的 `my-bucket` 和 `hello.txt` 名称，以及端口 `2222` 上的本地监听器。

### 连接

```bash
sftp -P 2222 <your-access-key>@127.0.0.1
```

出现密码提示时输入 RustFS 秘密密钥。首次连接时，请先验证显示的主机密钥指纹，再接受该密钥。

### 列出和创建存储桶

在 `sftp` 提示符下，列出 IAM 用户可见的存储桶并创建 `my-bucket`：

```text
sftp> ls /
sftp> mkdir /my-bucket
sftp> cd /my-bucket
```

存储桶名称必须遵循与通过 S3 API 创建的存储桶相同的命名规则。不能直接在 `/` 下创建文件。

### 上传和下载对象

上传 `/path/to/hello.txt`、列出存储桶并下载对象：

```text
sftp> put /path/to/hello.txt /my-bucket/hello.txt
sftp> ls /my-bucket
sftp> get /my-bucket/hello.txt hello.txt
```

上传必须从文件开头按顺序进行。不支持续传、追加、原地编辑，以及通过多个分段连接上传一个对象。

### 重命名对象

```text
sftp> rename /my-bucket/hello.txt /my-bucket/greeting.txt
```

RustFS 通过服务器端复制后删除源对象来实现重命名。该操作不是原子的，也不支持重命名存储桶。IAM 用户需要读取和删除源对象以及写入目标位置的权限。

### 删除对象和存储桶

删除对象，然后删除空存储桶：

```text
sftp> rm /my-bucket/greeting.txt
sftp> rmdir /my-bucket
```

RustFS 不会通过 SFTP 递归删除非空存储桶。

### 连接桌面客户端

在 FileZilla、Cyberduck 或 WinSCP 等图形客户端中使用以下设置：

| 设置 | 值 |
| --- | --- |
| 协议 | SFTP (SSH File Transfer Protocol) |
| 主机 | RustFS SFTP 主机名 |
| 端口 | `2222`，或 `RUSTFS_SFTP_ADDRESS` 中的端口 |
| 用户名 | RustFS 访问密钥 |
| 密码 | RustFS 秘密密钥 |
| 身份验证 | 密码 |

将客户端配置为使用单连接上传完整文件。网关将 SFTP 操作映射到对象存储，因此不支持符号链接，也不支持更改 POSIX 所有权、权限或时间戳。

## 后续步骤

- [管理凭证](/operations/credentials)
- [检查服务状态](/operations/status-check)
- [配置生命周期管理](/administration/data/lifecycle-management)
