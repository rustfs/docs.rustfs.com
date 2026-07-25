---
title: "Event Notifications"
description: "Configure RustFS bucket event notifications and deliver filtered object events to external targets."
---

RustFS Event Notifications deliver S3 bucket activity to external systems. This guide configures a webhook target, associates it with a bucket, and verifies delivery with AWS CLI.

## Overview

An event notification has two independent parts:

- A **notification target** defines where RustFS sends events.
- A **bucket notification configuration** selects the target, event types, and optional object-key filters for one bucket.

RustFS supports webhook, Kafka, MQTT, MySQL, PostgreSQL, NATS, Redis, AMQP, and Pulsar target families. The webhook workflow below is useful for HTTP services, serverless functions, and integration platforms.

Bucket rules use the S3 `PutBucketNotificationConfiguration` and `GetBucketNotificationConfiguration` APIs. RustFS currently accepts queue configurations; AWS SNS topic and Lambda function configurations are not supported.

Common event families include:

| Event family | Example events |
| --- | --- |
| Object creation | `s3:ObjectCreated:Put`, `s3:ObjectCreated:Copy`, `s3:ObjectCreated:CompleteMultipartUpload` |
| Object removal | `s3:ObjectRemoved:Delete`, `s3:ObjectRemoved:DeleteMarkerCreated` |
| Object access | `s3:ObjectAccessed:Get`, `s3:ObjectAccessed:Head` |
| Object tagging | `s3:ObjectTagging:Put`, `s3:ObjectTagging:Delete` |
| Lifecycle and tiering | Expiration, restore, replication, and transition events |

Use a wildcard such as `s3:ObjectCreated:*` to subscribe to every event in a family.

## Configuration

Event Notifications are disabled by default. The following environment variables enable the module and create a webhook target named `primary`:

```bash
export RUSTFS_NOTIFY_ENABLE="true"
export RUSTFS_NOTIFY_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY="https://events.example.com/rustfs"
export RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/notify-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://events.example.com"
```

Restart RustFS after changing environment-managed targets. The target name is the lowercase form of the environment-variable suffix, so `_PRIMARY` creates `primary`. Use the target ARN `arn:rustfs:sqs:us-east-1:primary:webhook` in the bucket configuration.

RustFS sends a `HEAD` health check to the endpoint origin's root path, such as `https://events.example.com/`, and sends JSON `POST` requests to the complete configured endpoint. The origin must respond to `HEAD`, while delivery requests must return a successful HTTP status. Allow the RustFS service account to write to the queue directory.

### Webhook settings

Use the same `_PRIMARY` suffix on all settings for this target:

| Variable | Purpose |
| --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY` | HTTP or HTTPS delivery endpoint |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY` | Bearer token sent in the `Authorization` header |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY` | Directory for queued deliveries |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT_PRIMARY` | Maximum number of queued events |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT_PRIMARY` | Client certificate for mutual TLS (mTLS) |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY_PRIMARY` | Private key paired with the client certificate |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY` | Certificate authority used to verify the receiver |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | Disable server certificate verification |

:::warning[Keep certificate verification enabled]

Do not enable `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` in production. Configure `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY` when the receiver uses a private certificate authority. If you use mTLS, provide both the client certificate and private key.

:::

For all target families and target-specific keys, see [Environment Variables](/reference/environment-variables#event--audit-targets).

## Usage

The following example sends creation and removal events for `.dat` objects under `uploads/` to the `primary` webhook.

### Configure the bucket rule

Create the notification configuration:

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

Apply it to `my-bucket` with [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html):

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration file://notification.json
```

Saving a bucket rule does not prove that its target exists or is online. Confirm that the module and target are enabled, the receiver answers health checks, and a test object operation produces a delivery.

Read the active configuration:

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api get-bucket-notification-configuration \
	--bucket my-bucket
```

Prefix and suffix filters are case-sensitive and are combined with AND logic. A rule can contain at most one prefix and one suffix filter.

### Manage rules with rc

The `rc` client can add, list, and remove bucket notification rules. It does not configure the notification module or create the underlying webhook, broker, or database target; configure those first through environment variables or the Console.

Add creation and removal events for the `primary` target:

```bash
rc bucket event add \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook \
	--event put,delete
```

List the active rules:

```bash
rc --json bucket event list rustfs/my-bucket
```

Remove every rule associated with that target ARN:

```bash
rc bucket event remove \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook
```

The current `rc bucket event add` command does not expose prefix or suffix filter options. Use AWS CLI when the rule must filter object keys.

### Trigger and inspect events

Upload and remove a matching object:

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/uploads/hello.dat

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 rm s3://my-bucket/uploads/hello.dat
```

The webhook receives an S3-compatible JSON envelope. Important fields include the event name, bucket, object key, size, ETag, and request identifiers:

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

Decode the object key as URL-encoded data before using it. Consumers should also be idempotent: queued delivery provides store-and-forward recovery, but a receiver can observe the same event more than once.

### Replace or remove rules

`PutBucketNotificationConfiguration` replaces the complete notification configuration for the bucket. Include every rule that you want to retain when updating it.

Remove all rules by applying an empty configuration:

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration '{}'
```

## Next steps

Configure [Audit Targets](/security-compliance/audit-logs) when you need request-level security and compliance records instead of bucket-scoped object events. Review [Observability](/operations/observability) to monitor the RustFS service.