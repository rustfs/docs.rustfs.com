---
title: "WebDAV"
description: "配置 RustFS WebDAV 网关，并使用 WebDAV 客户端访问存储桶和对象。"
---

RustFS 包含一个网络分布式创作与版本控制（Web Distributed Authoring and Versioning，WebDAV）网关，通过 HTTP 或 HTTPS 向 WebDAV 客户端公开存储桶和对象。你可以浏览存储桶、创建集合，以及上传、下载、重命名或删除对象；RustFS 会根据通过身份验证的身份与访问管理（IAM）用户权限执行每项操作。

标准 RustFS 二进制文件中已编译 WebDAV 支持，但网关在运行时默认禁用。连接客户端前必须启用并配置网关。

## 概述

网关将 WebDAV 路径映射到 RustFS 资源：

| WebDAV 路径 | RustFS 资源 |
| --- | --- |
| `/` | 已验证身份的用户可见的所有存储桶 |
| `/my-bucket/` | `my-bucket` 存储桶 |
| `/my-bucket/hello.txt` | `my-bucket` 中的 `hello.txt` 对象 |
| `/my-bucket/docs/hello.txt` | `my-bucket` 中的 `docs/hello.txt` 对象 |

RustFS 通过网关支持以下操作：

| 方法 | 操作 |
| --- | --- |
| `PROPFIND` | 列出存储桶或对象并读取元数据 |
| `MKCOL` | 创建存储桶或目录前缀 |
| `PUT` | 上传对象 |
| `GET` | 下载对象 |
| `HEAD` | 读取对象元数据 |
| `MOVE` | 重命名或移动对象或目录 |
| `DELETE` | 删除对象、目录或存储桶 |

请使用 `PROPFIND` 而不是 `GET` 列出集合。当前网关会为针对目录的 `GET` 请求返回 `405 Method Not Allowed`。

WebDAV 使用 HTTP Basic 身份验证。将 RustFS 访问密钥作为用户名，将其秘密密钥作为密码。网关会根据 RustFS IAM 验证凭证，并将用户的 S3 策略应用于每项操作。

:::warning[保护凭证]

Basic 身份验证不会加密凭证。仅在隔离的本地测试中禁用 TLS。所有远程或生产连接都应使用 HTTPS。

:::

## 配置

启动 RustFS 前，使用环境变量配置网关：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `RUSTFS_WEBDAV_ENABLE` | 启用 WebDAV 网关。 | `false` |
| `RUSTFS_WEBDAV_ADDRESS` | WebDAV 连接的绑定地址。 | `0.0.0.0:8080` |
| `RUSTFS_WEBDAV_TLS_ENABLED` | 为 WebDAV 监听器启用 TLS。 | `true` |
| `RUSTFS_WEBDAV_CERTS_DIR` | RustFS TLS 运行时使用的证书目录。启用 TLS 时必需。 | 未设置 |
| `RUSTFS_WEBDAV_MAX_BODY_SIZE` | 最大请求正文大小（字节）。必须大于零。 | `5368709120` (5 GiB) |

标准 RustFS 构建会启用 WebDAV 编译时功能。如果使用 `--no-default-features` 构建 RustFS，请显式加入该功能：

```bash
cargo build --release --features webdav
```

### 不使用 TLS 进行本地测试

以下示例在端口 `8080` 上启动带 HTTP WebDAV 监听器的 RustFS：

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=127.0.0.1:8080
export RUSTFS_WEBDAV_TLS_ENABLED=false
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

绑定到 `127.0.0.1` 可阻止其他主机连接未加密的测试端点。

### HTTPS

对于远程或生产连接，请启用 TLS 并提供证书目录：

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=0.0.0.0:8080
export RUSTFS_WEBDAV_TLS_ENABLED=true
export RUSTFS_WEBDAV_CERTS_DIR=/path/to/certs

rustfs /path/to/data
```

如果启用了 TLS 但未设置 `RUSTFS_WEBDAV_CERTS_DIR`，或该目录不存在，WebDAV 初始化会失败。有关证书准备指南，请参阅[配置 TLS](/integration/tls-configured)。

允许传入 TCP 流量访问已配置的 WebDAV 端口。此监听器与 S3 API 和控制台监听器分开。

## 使用

以下命令使用 HTTP 端点进行本地测试。请将端点和凭证替换为 HTTPS WebDAV 端点，以及具有所需存储桶和对象权限的 IAM 用户。

设置可复用的 shell 变量，避免在每条命令中直接放置秘密密钥：

```bash
export WEBDAV_URL=http://127.0.0.1:8080
export WEBDAV_USER=<your-access-key>
read -s WEBDAV_PASSWORD
export WEBDAV_PASSWORD
```

### 列出存储桶

发送带 `Depth: 1` 的 `PROPFIND`，列出用户可见的存储桶：

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/"
```

### 创建存储桶

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/"
```

存储桶名称必须遵循与通过 S3 API 创建的存储桶相同的命名规则。

### 上传和下载对象

上传 `/path/to/hello.txt`：

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--upload-file /path/to/hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

下载对象：

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--output hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

### 创建和列出目录

存储桶下的 WebDAV 目录映射到对象键前缀：

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/docs/"

curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/my-bucket/docs/"
```

### 重命名对象

使用 `MOVE` 和同一 WebDAV 端点上的目标路径：

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MOVE \
	--header "Destination: $WEBDAV_URL/my-bucket/greeting.txt" \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

IAM 用户需要读取和删除源对象以及写入目标位置的权限。如果授权失败，RustFS 会保留源对象不变。

### 删除对象或存储桶

删除对象：

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/greeting.txt"
```

删除存储桶中的内容后再删除存储桶：

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/"
```

### 连接桌面客户端

在支持 Basic 身份验证的客户端中使用 WebDAV 端点：

| 客户端 | 连接地址 |
| --- | --- |
| GNOME Files | HTTP 使用 `dav://<host>:8080/`，HTTPS 使用 `davs://<host>:8080/` |
| macOS Finder | `http://<host>:8080/` 或 `https://<host>:8080/` |
| Windows File Explorer | `https://<host>:8080/` |

客户端提示输入凭证时，请输入 RustFS 访问密钥和秘密密钥。客户端行为和支持的 WebDAV 方法各不相同；排查故障时可使用 `curl` 隔离服务器端错误。

## 后续步骤

- [管理凭证](/operations/credentials)
- [配置 TLS](/integration/tls-configured)
- [检查服务状态](/operations/status-check)
