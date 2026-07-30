---
title: "审计目标"
description: "配置 RustFS 审计目标，并将请求级审计记录投递到外部系统。"
---

RustFS 审计目标将请求级活动记录发送到外部系统，用于安全监控、合规和事件调查。本指南配置一个 webhook 目标，并通过 S3 请求验证审计投递。

## 概述

审计目标和事件通知的用途不同：

| 功能 | 审计目标 | 事件通知 |
| --- | --- | --- |
| 范围 | 整个 RustFS 中的请求和 API 活动 | 由每个存储桶配置选择的事件 |
| 路由 | 每个已启用的审计目标都会收到审计记录 | 每条存储桶规则选择一个目标 |
| 筛选 | 不提供按目标设置的事件筛选器 | 支持事件、前缀和后缀筛选器 |
| 典型用途 | 安全信息和事件管理（SIEM）、合规、调查 | 应用程序工作流程和数据管道 |

RustFS 支持 webhook、Kafka、MQTT、MySQL、PostgreSQL、NATS、Redis、AMQP 和 Pulsar 审计目标系列。每个已启用的目标都会独立接收审计流。

审计记录可能包含请求路径、查询参数、选定标头、身份声明、访问密钥标识符、远程主机、用户代理、响应状态和错误。请保护目标位置，并根据保留和合规要求限制访问。

## 配置

审计投递默认禁用。以下环境变量启用该模块，并创建名为 `primary` 的 webhook 目标：

```bash
export RUSTFS_AUDIT_ENABLE="true"
export RUSTFS_AUDIT_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY="https://audit.example.com/rustfs"
export RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/audit-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://audit.example.com"
```

更改由环境管理的目标后，请重启 RustFS。目标名称是环境变量后缀的小写形式，因此 `_PRIMARY` 会创建 `primary`。

RustFS 向端点源的根路径发送 `HEAD` 运行状况检查，例如 `https://audit.example.com/`，并向完整配置端点发送 JSON `POST` 请求。源必须响应 `HEAD`，而投递请求必须返回成功的 HTTP 状态。请允许 RustFS 服务账户写入队列目录。

### Webhook 设置

对该目标的所有设置使用相同的 `_PRIMARY` 后缀：

| 变量 | 用途 |
| --- | --- |
| `RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY` | HTTP 或 HTTPS 投递端点 |
| `RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY` | 在 `Authorization` 标头中发送的 Bearer 令牌 |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` | 排队审计记录的目录 |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` | 排队记录的最大数量 |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CERT_PRIMARY` | 用于双向 TLS（mTLS）的客户端证书 |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_KEY_PRIMARY` | 与客户端证书配对的私钥 |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CA_PRIMARY` | 用于验证接收方的证书颁发机构 |
| `RUSTFS_AUDIT_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | 禁用服务器证书验证 |

:::warning[保护审计数据]

对于远程收集器，请使用 HTTPS。保持启用证书验证，将 Bearer 令牌存储在源代码管理系统之外，并在使用 mTLS 时同时提供客户端证书和密钥。审计负载可能包含安全敏感的请求和身份元数据。

:::

有关所有目标系列及其特定键，请参阅[环境变量](/reference/environment-variables#event--audit-targets)。

### 多个目标

添加不同的大写后缀以定义另一个实例。例如，使用 `RUSTFS_AUDIT_WEBHOOK_ENABLE_ARCHIVE` 和相应的 `_ARCHIVE` 设置，可创建一个 `archive` webhook，与 `primary` 并行运行。

RustFS 将每条审计记录扇出到所有已启用的目标。一个目标发生故障不会阻止向其他目标尝试投递。

:::note[环境管理的目标]

通过环境变量定义的目标无法通过控制台或管理 API 编辑或移除。请改为更改其环境变量并重启 RustFS。不要同时通过环境变量和持久化配置定义同一个目标。

:::

## 使用

:::note[rc 命令行支持]

当前 `rc` 客户端不提供创建、列出或移除审计目标的命令。请通过环境变量或控制台进行配置。`rc bucket event` 命令只管理存储桶通知规则，不管理审计投递。

:::

### 验证接收方

生成流量之前，请验证 RustFS 主机可以访问收集器，并且收集器接受配置的 Bearer 令牌：

```bash
curl --fail --head \
	https://audit.example.com/
```

运行状况检查用于测量源的可达性，不包含 webhook 授权令牌。另请单独确认配置的 `/rustfs` 投递路径接受 `Authorization: Bearer <your-webhook-token>`，并用于 `POST` 请求。

如果目标持续离线，请检查 DNS、防火墙策略、`RUSTFS_OUTBOUND_ALLOW_ORIGINS`、证书信任以及源对 `HEAD /` 的响应。

### 生成审计记录

对 RustFS 执行经过身份验证的 S3 操作：

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/hello.txt
```

Webhook 会收到一个 JSON 审计条目。字段因操作而异，空的可选字段可能被省略。以下是一个有代表性的字段子集：

```json
{
	"version": "1",
	"time": 1719331200000,
	"event": "s3:ObjectCreated:Put",
	"trigger": "s3",
	"api": {
		"name": "PutObject",
		"bucket": "my-bucket",
		"object": "hello.txt",
		"status": "OK",
		"statusCode": 200
	},
	"remotehost": "192.0.2.10",
	"requestID": "<request-id>",
	"userAgent": "aws-cli",
	"requestPath": "/my-bucket/hello.txt",
	"accessKey": "<your-access-key>"
}
```

将负载模式视为可扩展模式。请解析所需字段，并容许未知字段或缺失字段，使收集器与后续 RustFS 版本保持兼容。

### 投递行为

配置 `RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` 后，RustFS 会将待处理记录存储在磁盘上，并在暂时性投递失败后重放这些记录。根据预期的中断时段确定队列目录和 `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` 的大小，并同时监控磁盘使用量和目标运行状况。

Webhook 至少投递一次。接收方处理请求之后、RustFS 观察到响应之前可能发生超时，因此在需要时请使用 `requestID` 和其他稳定字段对记录去重。

接收方只有在持久接收记录后才应确认。返回非成功状态会使投递路径仍可观察到故障；如果静默接受并丢弃记录，RustFS 无法恢复该记录。

## 后续步骤

为存储桶范围的应用程序工作流程配置[事件通知](/operations/event-notifications)。查看[可观测性](/operations/observability)以监控服务运行状况，并查看[凭证](/operations/credentials)以限制管理访问。