---
title: "OpenStack Swift API"
description: "构建包含可选 Swift API 的 RustFS，并接入 OpenStack Keystone 身份验证。"
---

RustFS 可以在 S3 API 的同一 HTTP 端点上提供兼容 OpenStack Swift 的 API。本指南介绍如何构建可选的 `swift` 功能、配置 Keystone 令牌验证，并验证基本的账户、容器和对象操作。

:::warning[兼容范围]

Swift 支持是可选功能，尚未覆盖 OpenStack Swift 的全部行为。目前不支持账户 `HEAD` 请求和非 JSON 格式的列表响应。用于生产环境前，请先验证你的客户端工作流。

:::

## Swift 如何映射到 RustFS

Swift 请求通过 RustFS S3 API 端点上的 `/v1/AUTH_<project-id>/...` 路径访问：

| Swift 资源 | 请求路径 | RustFS 映射 |
| --- | --- | --- |
| 账户 | `/v1/AUTH_<project-id>` | 已通过身份验证的 Keystone 项目 |
| 容器 | `/v1/AUTH_<project-id>/<container>` | 按项目隔离的 RustFS 存储桶 |
| 对象 | `/v1/AUTH_<project-id>/<container>/<object>` | 映射存储桶中的对象 |

URL 中的项目 ID 必须与已验证 Keystone 令牌中的项目 ID 一致。RustFS 接受通过 `X-Auth-Token` 或 `X-Storage-Token` 传入的令牌。

已确认的核心操作包括：

| 范围 | 操作 |
| --- | --- |
| 账户 | 列出容器、更新账户元数据 |
| 容器 | 创建、列出、查看、更新元数据、删除 |
| 对象 | 上传、下载、范围下载、查看、更新元数据、复制、删除 |

## 构建 Swift 支持

RustFS 默认功能集不包含 Swift。请在 `rustfs/rustfs` 仓库中显式构建该功能：

```bash
cargo build --release --features swift
```

生成的二进制会在已配置的 S3 API 地址上提供 Swift 路径，不会启动单独的 Swift 监听器或使用 Swift 专属端口。

## 配置 Keystone

启动 RustFS 前，启用 Keystone 并设置其身份验证端点：

```bash
export RUSTFS_KEYSTONE_ENABLE=true
export RUSTFS_KEYSTONE_AUTH_URL=https://keystone.example.com
export RUSTFS_KEYSTONE_VERSION=v3
export RUSTFS_KEYSTONE_VERIFY_SSL=true
```

| 变量 | 用途 | 默认值 |
| --- | --- | --- |
| `RUSTFS_KEYSTONE_ENABLE` | 启用 Keystone 令牌验证。 | `false` |
| `RUSTFS_KEYSTONE_AUTH_URL` | 设置 Keystone 身份验证端点；启用 Keystone 时必填。 | 未设置 |
| `RUSTFS_KEYSTONE_VERSION` | 选择 Keystone API 版本。 | `v3` |
| `RUSTFS_KEYSTONE_VERIFY_SSL` | 验证 Keystone TLS 证书。 | `true` |
| `RUSTFS_KEYSTONE_CACHE_SIZE` | 设置令牌缓存的最大条目数。 | `10000` |
| `RUSTFS_KEYSTONE_CACHE_TTL` | 设置令牌缓存的有效期，单位为秒。 | `300` |
| `RUSTFS_KEYSTONE_TIMEOUT` | 设置 Keystone 请求超时时间，单位为秒。 | `30` |

建议保持 TLS 验证开启。Keystone 拒绝传入的令牌时，RustFS 会返回 `401 Unauthorized`，不会对该请求回退到本地凭证。

## 验证 API

从 Keystone 获取限定范围的令牌和项目 ID，然后设置以下 shell 变量：

```bash
export SWIFT_TOKEN='<your-keystone-token>'
export SWIFT_ACCOUNT='AUTH_<your-project-id>'
export SWIFT_URL="http://localhost:9000/v1/${SWIFT_ACCOUNT}"
```

列出该项目可见的容器：

```bash
curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}"
```

创建 `my-bucket`、上传 `hello.txt`，然后下载该对象：

```bash
curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket"

curl --fail-with-body --request PUT \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	--upload-file /path/to/hello.txt \
	"${SWIFT_URL}/my-bucket/hello.txt"

curl --fail-with-body \
	--header "X-Auth-Token: ${SWIFT_TOKEN}" \
	"${SWIFT_URL}/my-bucket/hello.txt"
```

如果请求中的 `AUTH_<project-id>` 账户与令牌项目不一致，RustFS 会返回 `403 Forbidden`。

## 后续步骤

- [查看 S3 兼容性矩阵](/zh/reference/s3-compatibility)
- [管理 RustFS 凭证](/zh/operations/credentials)
- [为 RustFS 配置 TLS](/zh/integration/tls-configured)
