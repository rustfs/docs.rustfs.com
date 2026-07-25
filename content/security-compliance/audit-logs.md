---
title: "Audit Targets"
description: "Configure RustFS audit targets and deliver request-level audit records to external systems."
---

RustFS Audit Targets send request-level activity records to external systems for security monitoring, compliance, and incident investigation. This guide configures a webhook target and verifies audit delivery with an S3 request.

## Overview

Audit Targets and Event Notifications serve different purposes:

| Feature | Audit Targets | Event Notifications |
| --- | --- | --- |
| Scope | Request and API activity across RustFS | Events selected by each bucket configuration |
| Routing | Every enabled audit target receives audit records | Each bucket rule selects a target |
| Filtering | No per-target event filter | Event, prefix, and suffix filters |
| Typical use | Security information and event management (SIEM), compliance, investigation | Application workflows and data pipelines |

RustFS supports webhook, Kafka, MQTT, MySQL, PostgreSQL, NATS, Redis, AMQP, and Pulsar audit target families. Each enabled target receives the audit stream independently.

Audit records can contain request paths, query parameters, selected headers, identity claims, access-key identifiers, remote hosts, user agents, response status, and errors. Protect the destination and restrict access according to your retention and compliance requirements.

## Configuration

Audit delivery is disabled by default. The following environment variables enable the module and create a webhook target named `primary`:

```bash
export RUSTFS_AUDIT_ENABLE="true"
export RUSTFS_AUDIT_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY="https://audit.example.com/rustfs"
export RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/audit-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://audit.example.com"
```

Restart RustFS after changing environment-managed targets. The target name is the lowercase form of the environment-variable suffix, so `_PRIMARY` creates `primary`.

RustFS sends a `HEAD` health check to the endpoint origin's root path, such as `https://audit.example.com/`, and sends JSON `POST` requests to the complete configured endpoint. The origin must respond to `HEAD`, while delivery requests must return a successful HTTP status. Allow the RustFS service account to write to the queue directory.

### Webhook settings

Use the same `_PRIMARY` suffix on all settings for this target:

| Variable | Purpose |
| --- | --- |
| `RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY` | HTTP or HTTPS delivery endpoint |
| `RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY` | Bearer token sent in the `Authorization` header |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` | Directory for queued audit records |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` | Maximum number of queued records |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CERT_PRIMARY` | Client certificate for mutual TLS (mTLS) |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_KEY_PRIMARY` | Private key paired with the client certificate |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CA_PRIMARY` | Certificate authority used to verify the receiver |
| `RUSTFS_AUDIT_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | Disable server certificate verification |

:::warning[Protect audit data]

Use HTTPS for remote collectors. Keep certificate verification enabled, store bearer tokens outside source control, and provide both the client certificate and key when using mTLS. Audit payloads may contain security-sensitive request and identity metadata.

:::

For all target families and target-specific keys, see [Environment Variables](/reference/environment-variables#event--audit-targets).

### Multiple targets

Add a distinct uppercase suffix to define another instance. For example, use `RUSTFS_AUDIT_WEBHOOK_ENABLE_ARCHIVE` and the corresponding `_ARCHIVE` settings to create an `archive` webhook alongside `primary`.

RustFS fans each audit record out to all enabled targets. A failure in one target does not prevent delivery attempts to the others.

:::note[Environment-managed targets]

A target defined by environment variables cannot be edited or removed through the Console or admin API. Change its environment variables and restart RustFS instead. Do not define the same target through both environment variables and persisted configuration.

:::

## Usage

:::note[rc command-line support]

The current `rc` client does not provide commands for creating, listing, or removing Audit Targets. Configure them through environment variables or the Console. The `rc bucket event` commands manage bucket notification rules only; they do not manage audit delivery.

:::

### Verify the receiver

Before generating traffic, verify that the collector is reachable from the RustFS host and accepts the configured bearer token:

```bash
curl --fail --head \
	https://audit.example.com/
```

The health check measures origin reachability and does not include the webhook authorization token. Separately confirm that the configured `/rustfs` delivery path accepts `Authorization: Bearer <your-webhook-token>` on `POST` requests.

If the target remains offline, check DNS, firewall policy, `RUSTFS_OUTBOUND_ALLOW_ORIGINS`, certificate trust, and the origin's response to `HEAD /`.

### Generate an audit record

Perform an authenticated S3 operation against RustFS:

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/hello.txt
```

The webhook receives a JSON audit entry. Fields vary by operation and empty optional fields may be omitted. A representative subset is:

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

Treat the payload schema as additive. Parse the fields you need and tolerate unknown or absent fields so collectors remain compatible with later RustFS releases.

### Delivery behavior

When `RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` is configured, RustFS stores pending records on disk and replays them after transient delivery failures. Size the queue directory and `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` for the expected outage window, then monitor both disk usage and target health.

Webhook delivery is at least once. A timeout can occur after the receiver processes a request but before RustFS observes the response, so use `requestID` and other stable fields to deduplicate records where required.

The receiver should acknowledge a record only after it has durably accepted it. Returning a non-success status keeps failures visible to the delivery path; silently accepting and discarding a record cannot be recovered by RustFS.

## Next steps

Configure [Event Notifications](/operations/event-notifications) for bucket-scoped application workflows. Review [Observability](/operations/observability) to monitor service health and [Credentials](/operations/credentials) to limit administrative access.