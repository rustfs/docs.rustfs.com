---
title: "事件通知"
description: "配置 RustFS 存储桶事件通知，并将筛选后的对象事件发送到外部目标。"
---

RustFS 事件通知将 S3 存储桶活动发送到外部系统。本指南配置 webhook 目标、将其与存储桶关联，并使用 AWS CLI 验证投递。

## 概述

事件通知包含两个独立部分：

- **通知目标**定义 RustFS 将事件发送到何处。
- **存储桶通知配置**为一个存储桶选择目标、事件类型和可选的对象键筛选条件。

RustFS 支持 webhook、Kafka、MQTT、MySQL、PostgreSQL、NATS、Redis、AMQP 和 Pulsar 目标系列。以下 webhook 工作流程适用于 HTTP 服务、无服务器函数和集成平台。

存储桶规则使用 S3 `PutBucketNotificationConfiguration` 和 `GetBucketNotificationConfiguration` API。RustFS 当前接受队列配置；不支持 AWS SNS 主题和 Lambda 函数配置。

常见事件系列包括：

| 事件系列 | 示例事件 |
| --- | --- |
| 对象创建 | `s3:ObjectCreated:Put`, `s3:ObjectCreated:Copy`, `s3:ObjectCreated:CompleteMultipartUpload` |
| 对象删除 | `s3:ObjectRemoved:Delete`, `s3:ObjectRemoved:DeleteMarkerCreated` |
| 对象访问 | `s3:ObjectAccessed:Get`, `s3:ObjectAccessed:Head` |
| 对象标签 | `s3:ObjectTagging:Put`, `s3:ObjectTagging:Delete` |
| 生命周期和分层 | 过期、恢复、复制和转换事件 |

使用 `s3:ObjectCreated:*` 等通配符订阅一个系列中的所有事件。

## 配置

事件通知默认禁用。以下环境变量启用模块并创建名为 `primary` 的 webhook 目标：

```bash
export RUSTFS_NOTIFY_ENABLE="true"
export RUSTFS_NOTIFY_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY="https://events.example.com/rustfs"
export RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/notify-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://events.example.com"
```

更改由环境变量管理的目标后，请重启 RustFS。目标名称是环境变量后缀的小写形式，因此 `_PRIMARY` 会创建 `primary`。在存储桶配置中使用目标 ARN `arn:rustfs:sqs:us-east-1:primary:webhook`。

RustFS 向端点源的根路径（例如 `https://events.example.com/`）发送 `HEAD` 健康检查，并向完整的已配置端点发送 JSON `POST` 请求。源必须响应 `HEAD`，投递请求必须返回成功的 HTTP 状态。请允许 RustFS 服务账户写入队列目录。

### Webhook 设置

此目标的所有设置都使用相同的 `_PRIMARY` 后缀：

| 变量 | 用途 |
| --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY` | HTTP 或 HTTPS 投递端点 |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY` | 在 `Authorization` 标头中发送的 Bearer 令牌 |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY` | 排队投递的目录 |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT_PRIMARY` | 排队事件的最大数量 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT_PRIMARY` | 双向 TLS（mTLS）的客户端证书 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY_PRIMARY` | 与客户端证书配对的私钥 |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY` | 用于验证接收方的证书颁发机构 |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | 禁用服务器证书验证 |

:::warning[保持证书验证启用]

请勿在生产环境中启用 `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY`。当接收方使用私有证书颁发机构时，请配置 `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY`。如果使用 mTLS，请同时提供客户端证书和私钥。

:::

有关所有目标系列及其特定键，请参阅[环境变量](/reference/environment-variables#event--audit-targets)。

## 用法

以下示例将 `uploads/` 下 `.dat` 对象的创建和删除事件发送到 `primary` webhook。

### 配置存储桶规则

创建通知配置：

```json title="notification.json"
{
	"QueueConfigurations": [
		{
			"Id": "primary-uploads",
			"QueueArn": "arn:rustfs:sqs:us-east-1:primary:webhook",
			"Events": [
				"s3:ObjectCreated:*",
				"s3:ObjectRemoved:*"
			],
			"Filter": {
				"Key": {
					"FilterRules": [
						{ "Name": "prefix", "Value": "uploads/" },
						{ "Name": "suffix", "Value": ".dat" }
					]
				}
			}
		}
	]
}
```

使用 [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) 将其应用到 `my-bucket`：

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration file://notification.json
```

保存存储桶规则并不能证明其目标存在或在线。请确认模块和目标已启用、接收方响应健康检查，并且测试对象操作产生了投递。

读取当前配置：

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api get-bucket-notification-configuration \
	--bucket my-bucket
```

前缀和后缀筛选区分大小写，并通过 AND 逻辑组合。一条规则最多可包含一个前缀和一个后缀筛选条件。

### 使用 rc 管理规则

`rc` 客户端可以添加、列出和删除存储桶通知规则。它不会配置通知模块，也不会创建底层 webhook、代理或数据库目标；请先通过环境变量或控制台配置这些目标。

为 `primary` 目标添加创建和删除事件：

```bash
rc bucket event add \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook \
	--event put,delete
```

列出当前规则：

```bash
rc --json bucket event list rustfs/my-bucket
```

删除与该目标 ARN 关联的所有规则：

```bash
rc bucket event remove \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook
```

当前 `rc bucket event add` 命令不提供前缀或后缀筛选选项。规则需要筛选对象键时，请使用 AWS CLI。

### 触发并检查事件

上传并删除匹配的对象：

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/uploads/hello.dat

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 rm s3://my-bucket/uploads/hello.dat
```

Webhook 会收到与 S3 兼容的 JSON 信封。重要字段包括事件名称、存储桶、对象键、大小、ETag 和请求标识符：

```json
{
	"EventName": "s3:ObjectCreated:Put",
	"Records": [
		{
			"eventName": "s3:ObjectCreated:Put",
			"s3": {
				"bucket": { "name": "my-bucket" },
				"object": { "key": "uploads%2Fhello.dat" }
			}
		}
	]
}
```

使用对象键之前，请将其作为 URL 编码数据进行解码。消费者还应具有幂等性：排队投递提供存储转发恢复，但接收方可能多次观察到同一事件。

### 替换或删除规则

`PutBucketNotificationConfiguration` 会替换存储桶的完整通知配置。更新时，请包含要保留的每条规则。

应用空配置以删除所有规则：

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration '{}'
```

## 后续步骤

如果需要请求级安全与合规记录，而不是存储桶范围的对象事件，请配置[审计目标](/security-compliance/audit-logs)。查看[可观测性](/operations/observability)以监控 RustFS 服务。