---
title: "FTP(S)"
description: "配置 RustFS FTP 或 FTPS 网关，并使用 FTP 客户端管理存储桶和对象。"
---

RustFS 包含一个 FTP 网关，向标准 FTP 客户端公开存储桶和对象。可以将其作为未加密 FTP 运行，用于隔离的本地测试；也可以作为基于 TLS 的显式 FTP（FTPS）运行，以提供加密连接。RustFS 使用身份与访问管理（IAM）凭证验证每个会话，并将用户的 S3 策略应用于存储操作。

标准 RustFS 二进制文件中已编译 FTP 和 FTPS 支持，但两个监听器在运行时均默认禁用。只启用需要使用的监听器。

## 概述

网关将 FTP 路径映射到 RustFS 资源：

| FTP 路径 | RustFS 资源 |
| --- | --- |
| `/` | 已验证身份的用户可见的所有存储桶 |
| `/my-bucket/` | `my-bucket` 存储桶 |
| `/my-bucket/hello.txt` | `my-bucket` 中的 `hello.txt` 对象 |

支持以下 FTP 操作：

| FTP 命令 | 操作 |
| --- | --- |
| `LIST` | 列出根目录下的存储桶，或存储桶中的对象和前缀 |
| `MKD` | 创建存储桶 |
| `CWD` | 进入存储桶 |
| `STOR` | 上传对象 |
| `RETR` | 下载对象 |
| `DELE` | 删除对象 |
| `RMD` | 递归删除存储桶及其中的对象 |

RustFS 目前不支持 FTP 重命名操作，也不支持向现有对象追加内容。由于 S3 存储没有原生工作目录或 POSIX 目录模型，某些客户端特定的文件系统操作可能与传统 FTP 服务器不同。

将 RustFS 访问密钥作为 FTP 用户名，将其秘密密钥作为密码。无效的用户名和密码都会返回 `530 Not logged in`。登录后，RustFS 会针对每项操作检查 IAM 用户的 S3 权限。

:::danger[纯 FTP 会暴露凭证]

FTP 以未加密方式发送凭证和数据。纯 FTP 只能绑定到回环接口或隔离的测试网络。所有远程或生产连接都应使用 FTPS。

:::

:::warning[存储桶删除是递归操作]

当前 `RMD` 实现会先删除目标存储桶中的对象，再删除存储桶。在 FTP 客户端中运行 `rmdir` 前请确认路径。

:::

## 配置

FTP 和 FTPS 使用不同的监听器和环境变量。

### FTP 变量

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `RUSTFS_FTP_ENABLE` | 启用未加密 FTP 监听器。 | `false` |
| `RUSTFS_FTP_ADDRESS` | FTP 控制连接的绑定地址。 | `0.0.0.0:8021` |
| `RUSTFS_FTP_PASSIVE_PORTS` | `start-end` 格式的闭区间被动数据端口范围。 | `40000-50000` |
| `RUSTFS_FTP_EXTERNAL_IP` | RustFS 位于 NAT 后时向被动客户端公布的公共 IP 或主机名。 | 未设置 |

### FTPS 变量

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `RUSTFS_FTPS_ENABLE` | 启用显式 FTPS 监听器。 | `false` |
| `RUSTFS_FTPS_ADDRESS` | FTPS 控制连接的绑定地址。 | `0.0.0.0:8022` |
| `RUSTFS_FTPS_TLS_ENABLED` | 在 FTPS 监听器上启用 TLS。使用 FTPS 时保持启用。 | `true` |
| `RUSTFS_FTPS_CERTS_DIR` | 包含 FTPS 证书和私钥的目录。FTPS 必需。 | 未设置 |
| `RUSTFS_FTPS_PASSIVE_PORTS` | `start-end` 格式的闭区间被动数据端口范围。 | `40000-50000` |
| `RUSTFS_FTPS_EXTERNAL_IP` | RustFS 位于 NAT 后时向被动客户端公布的公共 IP 或主机名。 | 未设置 |

标准 RustFS 构建会启用 `ftps` 编译时功能，该功能同时提供 FTP 和 FTPS。如果使用 `--no-default-features` 构建 RustFS，请显式加入该功能：

```bash
cargo build --release --features ftps
```

### 使用 FTP 进行本地测试

在回环接口上启动未加密的 FTP 监听器：

```bash
export RUSTFS_FTP_ENABLE=true
export RUSTFS_FTP_ADDRESS=127.0.0.1:8021
export RUSTFS_FTP_PASSIVE_PORTS=40000-40010
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

绑定到 `127.0.0.1` 可阻止远程主机连接未加密的监听器。

### 准备测试证书

FTPS 要求证书目录中包含 `rustfs_cert.pem` 和 `rustfs_key.pem`。本地测试时，创建一个短期自签名证书：

```bash
mkdir -p /path/to/ftps-certs

openssl req -x509 -newkey rsa:2048 -nodes \
	-keyout /path/to/ftps-certs/rustfs_key.pem \
	-out /path/to/ftps-certs/rustfs_cert.pem \
	-days 7 \
	-subj "/CN=localhost" \
	-addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

生产环境请使用受信任证书颁发机构签发的证书。防止未经授权访问 `rustfs_key.pem`，并确保证书使用者可选名称与客户端使用的主机匹配。

### 启动 FTPS

配置显式 FTPS 监听器：

```bash
export RUSTFS_FTPS_ENABLE=true
export RUSTFS_FTPS_ADDRESS=0.0.0.0:8022
export RUSTFS_FTPS_TLS_ENABLED=true
export RUSTFS_FTPS_CERTS_DIR=/path/to/ftps-certs
export RUSTFS_FTPS_PASSIVE_PORTS=40000-50000

rustfs /path/to/data
```

RustFS 要求 FTPS 控制和数据通道都使用 TLS。将客户端配置为 **explicit FTP over TLS**，有时也称为 **FTPES** 或 **Require explicit FTP over TLS**。此监听器未实现隐式 FTPS 模式。

如果证书目录未设置、不存在或不包含可用的证书和密钥，FTPS 初始化会失败。有关常规证书指南，请参阅[配置 TLS](/integration/tls-configured)。

### 配置被动连接

FTP 使用控制端口发送命令，并使用单独的数据连接传输目录列表和文件。对于被动模式：

1. 允许传入 TCP 流量访问已配置的控制端口。
2. 允许传入 TCP 流量访问已配置被动范围内的每个端口。
3. 客户端通过 NAT 或负载均衡器连接时，设置 `RUSTFS_FTP_EXTERNAL_IP` 或 `RUSTFS_FTPS_EXTERNAL_IP`。

例如，NAT 后的 FTPS 服务器可以公布其公共主机名：

```bash
export RUSTFS_FTPS_EXTERNAL_IP=storage.example.com
export RUSTFS_FTPS_PASSIVE_PORTS=40000-40100
```

纯 FTP 监听器请使用对应的 FTP 前缀变量。RustFS 同时支持主动和被动传输模式，但被动模式通常更容易穿过客户端防火墙。

## 使用

示例使用 [`lftp`](https://lftp.yar.ru/) 以及规范的 `my-bucket` 和 `hello.txt` 名称。IAM 用户必须具有每项操作所需的 S3 权限。

### 使用 FTP 连接

纯 FTP 只能连接回环测试监听器：

```bash
lftp -u <your-access-key> ftp://127.0.0.1:8021
```

当 `lftp` 提示输入密码时，请输入秘密密钥。

### 使用 FTPS 连接

连接到显式 FTPS 监听器，并要求控制和数据连接加密：

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	open ftp://storage.example.com:8022
'
```

出现提示时输入秘密密钥。生产环境应保持启用证书验证。

仅针对自签名本地测试证书，连接到 `localhost` 并为该会话禁用证书验证：

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	set ssl:verify-certificate no;
	open ftp://localhost:8022
'
```

:::warning

不要在生产环境中禁用证书验证。请改为在客户端信任库中安装签发 CA。

:::

### 列出存储桶并创建存储桶

在 `lftp` 提示符下，列出可见存储桶并创建 `my-bucket`：

```text
lftp> cls -1 /
lftp> mkdir my-bucket
lftp> cd my-bucket
```

存储桶名称必须遵循与通过 S3 API 创建的存储桶相同的命名规则。

### 上传和下载对象

上传 `/path/to/hello.txt`、列出存储桶并下载对象：

```text
lftp> put /path/to/hello.txt -o hello.txt
lftp> ls
lftp> get hello.txt -o hello.txt
```

上传会替换具有相同键的对象。不支持向现有对象追加内容。

### 删除对象和存储桶

删除对象，返回根目录，然后删除存储桶：

```text
lftp> rm hello.txt
lftp> cd /
lftp> rmdir my-bucket
```

请注意，`rmdir` 会先递归删除存储桶中剩余的对象，再删除存储桶。

### 连接其他客户端

在 FileZilla 或 Cyberduck 等图形 FTP 客户端中使用以下设置：

| 设置 | FTP 测试监听器 | FTPS 监听器 |
| --- | --- | --- |
| 协议 | FTP | FTP over TLS (explicit) |
| 主机 | `127.0.0.1` | FTPS 主机名 |
| 端口 | `8021` | `8022` |
| 用户名 | RustFS 访问密钥 | RustFS 访问密钥 |
| 密码 | RustFS 秘密密钥 | RustFS 秘密密钥 |
| 传输模式 | 被动 | 被动 |

如果登录成功但目录列表或传输超时，请先检查被动端口防火墙规则和外部 IP 设置。

## 后续步骤

- [管理凭证](/operations/credentials)
- [配置 TLS](/integration/tls-configured)
- [检查服务状态](/operations/status-check)
