---
title: "Environment Variables"
description: "Reference for the environment variables that configure the RustFS server, console, TLS, KMS, observability, scanner, healing, storage classes, credentials, and event targets."
---

This page lists the environment variables recognized by the `rustfs` server binary. It covers the operations-relevant subset verified against the RustFS source code; some internal tuning knobs are intentionally omitted. Every variable can also be supplied through the matching command-line flag where one exists (see the [CLI reference](./cli)).

:::note
Boolean variables accept `true`/`false`. Values shown as "unset" have no default and the corresponding feature stays disabled or falls back to built-in behavior.
:::

## Core server

| Variable | Default | Description |
| --- | --- | --- |
| `RUSTFS_VOLUMES` | unset (required) | Storage volumes or endpoints, space-separated. Supports `{N...M}` ellipses expansion, e.g. `/data/rustfs{0...3}` or `http://node{1...4}:9000/data/rustfs{0...3}`. The Docker image defaults to `/data`. |
| `RUSTFS_ADDRESS` | `:9000` | Bind address and port for the S3 API listener (also carries internal node RPC). |
| `RUSTFS_SERVER_DOMAINS` | unset | Comma-separated domain name(s) for virtual-hosted-style S3 requests, e.g. `s3.example.com` so `bucket.s3.example.com` resolves to bucket `bucket`. When unset, only path-style addressing works. |
| `RUSTFS_REGION` | unset | Region reported to S3 clients. When unset the server falls back to `us-east-1`. |
| `RUSTFS_LICENSE` | unset | License string. |
| `RUSTFS_BUFFER_PROFILE` | `GeneralPurpose` | Workload profile for adaptive buffer sizing. Options: `GeneralPurpose`, `AiTraining`, `DataAnalytics`, `WebWorkload`, `IndustrialIoT`, `SecureStorage`. |
| `RUSTFS_BUFFER_PROFILE_DISABLE` | `false` | Disable adaptive buffer sizing and use legacy fixed-size buffers. |
| `RUSTFS_HEALTH_ENDPOINT_ENABLE` | `true` | Register the unauthenticated `/health` and `/health/ready` probe endpoints. |
| `RUSTFS_HEALTH_READINESS_CACHE_TTL_MS` | `1000` | Cache TTL for readiness probe results, in milliseconds. |
| `RUSTFS_HEALTH_CLUSTER_TIMEOUT_MS` | `2000` | Timeout for cluster health probes (`/minio/health/cluster`), in milliseconds. |
| `RUSTFS_STARTUP_READINESS_MAX_WAIT_SECS` | `120` | Maximum time the readiness probe reports "starting" before startup is considered failed. |

## Console

| Variable | Default | Description |
| --- | --- | --- |
| `RUSTFS_CONSOLE_ENABLE` | `true` | Enable the embedded web console (served on a separate listener). |
| `RUSTFS_CONSOLE_ADDRESS` | `:9001` | Bind address and port for the console listener. |

## TLS & KMS

| Variable | Default | Description |
| --- | --- | --- |
| `RUSTFS_TLS_PATH` | unset | Directory containing the TLS certificate and key (`rustfs_cert.pem` / `rustfs_key.pem`) for the S3 API and console. TLS is enabled when set. |
| `RUSTFS_TLS_RELOAD_ENABLE` | `false` | Watch the TLS directory and hot-reload certificates. |
| `RUSTFS_TLS_KEYLOG` | `false` | Write TLS session keys to a keylog file for debugging. Do not enable in production. |
| `RUSTFS_TRUST_SYSTEM_CA` | `false` | Also trust the operating system CA store for outbound TLS connections. |
| `RUSTFS_TRUST_LEAF_CERT_AS_CA` | `false` | Trust a leaf certificate as if it were a CA (self-signed setups). |
| `RUSTFS_SERVER_MTLS_ENABLE` | `false` | Require client certificates (mutual TLS) on the server listeners. |
| `RUSTFS_MTLS_CLIENT_CERT` | unset | Client certificate presented for internode mTLS connections. |
| `RUSTFS_MTLS_CLIENT_KEY` | unset | Client private key for internode mTLS connections. |
| `RUSTFS_KMS_ENABLE` | `false` | Enable KMS-backed server-side encryption. |
| `RUSTFS_KMS_BACKEND` | `local` | KMS backend: `local`, `vault` / `vault-kv2` (Vault KV2 + Transit), or `vault-transit`. |
| `RUSTFS_KMS_KEY_DIR` | unset | Key directory for the `local` backend. |
| `RUSTFS_KMS_LOCAL_MASTER_KEY` | unset | Master key protecting local KMS key files. |
| `RUSTFS_KMS_VAULT_ADDRESS` | unset | Vault server address for the Vault backends. |
| `RUSTFS_KMS_VAULT_TOKEN` | unset | Vault token for the Vault backends. |
| `RUSTFS_KMS_VAULT_MOUNT_PATH` | unset | Vault mount path for the Vault backends. |
| `RUSTFS_KMS_DEFAULT_KEY_ID` | unset | Default KMS key ID used for encryption. |
| `RUSTFS_KMS_ALLOW_INSECURE_DEV_DEFAULTS` | `false` | Allow development-only insecure KMS defaults. Never enable in production. |

## Observability

The observability pipeline exports traces, metrics, and logs over OTLP/HTTP.

| Variable | Default | Description |
| --- | --- | --- |
| `RUSTFS_OBS_ENDPOINT` | empty | Root OTLP/HTTP base URL for traces, metrics, and logs, e.g. `http://otel-collector:4318`. When empty, logs go to stdout or local files. |
| `RUSTFS_OBS_TRACE_ENDPOINT` | unset | Per-signal override for the traces endpoint. |
| `RUSTFS_OBS_METRIC_ENDPOINT` | unset | Per-signal override for the metrics endpoint. |
| `RUSTFS_OBS_LOG_ENDPOINT` | unset | Per-signal override for the logs endpoint. |
| `RUSTFS_OBS_TRACES_EXPORT_ENABLED` | `true` | Export traces to the OTLP endpoint. |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` | `true` | Export metrics to the OTLP endpoint. |
| `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | `true` | Export logs to the OTLP endpoint. |
| `RUSTFS_OBS_USE_STDOUT` | unset | Force telemetry output to stdout. |
| `RUSTFS_OBS_SAMPLE_RATIO` | unset | Trace sampling ratio (0.0–1.0). |
| `RUSTFS_OBS_METER_INTERVAL` | unset | Metrics export interval in seconds. |
| `RUSTFS_OBS_SERVICE_NAME` | unset | Service name reported in telemetry resource attributes. |
| `RUSTFS_OBS_ENVIRONMENT` | unset | Deployment environment label (`production`, `development`, `test`, `staging`). |
| `RUSTFS_OBS_LOGGER_LEVEL` | unset | Log level filter (e.g. `info`, `debug`). |
| `RUSTFS_OBS_LOG_STDOUT_ENABLED` | unset | Also mirror logs to stdout when file/OTLP logging is active. |
| `RUSTFS_OBS_LOG_DIRECTORY` | unset | Local log directory. Unset means logs go to stdout; a URL value sends logs to a remote endpoint. |
| `RUSTFS_OBS_LOG_FILENAME` | `rustfs.log` | Log filename inside the log directory. |
| `RUSTFS_OBS_LOG_ROTATION_TIME` | `hourly` | Time-based log rotation: `daily`, `hourly`, `minutely`. |
| `RUSTFS_OBS_LOG_KEEP_FILES` | `30` | Number of rotated log files to keep. |
| `RUSTFS_OBS_LOG_MAX_TOTAL_SIZE_BYTES` | `2147483648` | Total size budget (2 GiB) for the log directory before cleanup. |
| `RUSTFS_OBS_LOG_COMPRESS_OLD_FILES` | `true` | Compress rotated log files (`zstd` by default, controllable via `RUSTFS_OBS_LOG_COMPRESSION_ALGORITHM`). |

Metrics collection intervals follow the pattern `RUSTFS_METRICS_<SCOPE>_INTERVAL_SEC` with scopes `DEFAULT`, `SYSTEM`, `CLUSTER`, `BUCKET`, `NODE`, `RESOURCE`, `AUDIT`, `NOTIFICATION`, and `BUCKET_REPLICATION_BANDWIDTH` — for example `RUSTFS_METRICS_CLUSTER_INTERVAL_SEC=60`.

## Scanner & Healing

| Variable | Default | Description |
| --- | --- | --- |
| `RUSTFS_SCANNER_SPEED` | `default` | Scanner speed preset: `fastest`, `fast`, `default`, `slow`, `slowest`. Controls sleep factor, max sleep, and cycle interval. |
| `RUSTFS_SCANNER_DELAY` | preset | Overrides the scanner sleep multiplier (e.g. `30.0`). |
| `RUSTFS_SCANNER_MAX_WAIT_SECS` | preset | Overrides the maximum scanner sleep in seconds. |
| `RUSTFS_SCANNER_CYCLE` | preset | Overrides the scan cycle interval in seconds (e.g. `3600`). |
| `RUSTFS_SCANNER_START_DELAY_SECS` | unset | Startup delay in seconds before the first scan cycle. |
| `RUSTFS_SCANNER_CYCLE_MAX_DURATION_SECS` | `0` | Caps one cycle's runtime in seconds; `0` disables the budget. |
| `RUSTFS_SCANNER_CYCLE_MAX_OBJECTS` | `0` | Caps objects processed per cycle; `0` disables the budget. |
| `RUSTFS_SCANNER_CYCLE_MAX_DIRECTORIES` | `0` | Caps directories entered per cycle; `0` disables the budget. |
| `RUSTFS_SCANNER_BITROT_CYCLE_SECS` | `2592000` | Periodic deep (bitrot) scan cycle in seconds (30 days). `0`/`true`/`on` makes every cycle deep; `false`/`off` disables deep scans. |
| `RUSTFS_SCANNER_IDLE_MODE` | `true` | When `true` the scanner throttles itself; `false` runs at full speed. |
| `RUSTFS_SCANNER_CACHE_SAVE_TIMEOUT_SECS` | `30` | Scanner cache save timeout in seconds (minimum `1`). |
| `RUSTFS_SCANNER_MAX_CONCURRENT_SET_SCANS` | `0` | Caps concurrent erasure-set scan tasks; `0` keeps topology-based concurrency. |
| `RUSTFS_SCANNER_MAX_CONCURRENT_DISK_SCANS` | `0` | Caps concurrent disk bucket walks per set; `0` keeps disk-count-based concurrency. |
| `RUSTFS_SCANNER_YIELD_EVERY_N_OBJECTS` | `128` | How often scanner object loops yield to the async runtime; `0` disables the extra yield. |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSIONS` | `100` | Object version count that triggers scanner alerts. |
| `RUSTFS_SCANNER_ALERT_EXCESS_VERSION_SIZE` | `1099511627776` | Cumulative version bytes (1 TiB) that trigger scanner alerts. |
| `RUSTFS_SCANNER_ALERT_EXCESS_FOLDERS` | `65538` | Direct subfolder count that triggers scanner alerts. |
| `RUSTFS_HEAL_AUTO_HEAL_ENABLE` | `true` | Enable automatic background healing of degraded objects. |
| `RUSTFS_HEAL_QUEUE_SIZE` | `10000` | Capacity of the heal-candidate queue. |
| `RUSTFS_HEAL_INTERVAL_SECS` | `10` | Interval between heal scheduler runs, in seconds. |
| `RUSTFS_HEAL_TASK_TIMEOUT_SECS` | `300` | Timeout for a single heal task, in seconds. |
| `RUSTFS_HEAL_MAX_CONCURRENT_HEALS` | `4` | Maximum concurrent heal tasks. |
| `RUSTFS_HEAL_MAX_CONCURRENT_PER_SET` | `1` | Maximum concurrent heal tasks per erasure set. |

## Storage & Erasure

| Variable | Default | Description |
| --- | --- | --- |
| `RUSTFS_STORAGE_CLASS_STANDARD` | auto | Parity for the STANDARD storage class in `EC:n` format, e.g. `EC:4`. When unset, parity is derived from the erasure set size. |
| `RUSTFS_STORAGE_CLASS_RRS` | `EC:1` | Parity for the REDUCED_REDUNDANCY storage class in `EC:n` format. |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | `availability` | Optimization goal for parity selection. |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | `131072` | Threshold (128 KiB) below which object data is inlined into metadata. |
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | `0` | Force the number of drives per erasure set; `0` selects the layout automatically. |
| `RUSTFS_DURABILITY_MODE` | unset | Write durability mode: `strict`, `relaxed`, or `none`. Takes precedence over the legacy drive-sync switch when set to a valid value. |

## Credentials & Internal

| Variable | Default | Description |
| --- | --- | --- |
| `RUSTFS_ACCESS_KEY` | `rustfsadmin` | Root access key. Mutually exclusive with `RUSTFS_ACCESS_KEY_FILE`. |
| `RUSTFS_SECRET_KEY` | `rustfsadmin` | Root secret key. Mutually exclusive with `RUSTFS_SECRET_KEY_FILE`. |
| `RUSTFS_ACCESS_KEY_FILE` | unset | Path to a file containing the access key (e.g. a Docker/Kubernetes secret mount). |
| `RUSTFS_SECRET_KEY_FILE` | unset | Path to a file containing the secret key. |
| `RUSTFS_RPC_SECRET` | derived | Secret used to authenticate internode RPC. When unset it is derived from the active access/secret key pair; with an all-default credential pair, multi-node clusters must set it explicitly. |

:::warning
The built-in default credentials `rustfsadmin`/`rustfsadmin` are for first-boot convenience only. Always set non-default credentials for production deployments.
:::

## Event & Audit targets

Module switches:

| Variable | Default | Description |
| --- | --- | --- |
| `RUSTFS_NOTIFY_ENABLE` | `false` | Enable the bucket event notification module. |
| `RUSTFS_AUDIT_ENABLE` | `false` | Enable the audit logging module. |

Target configuration is pattern-based: `RUSTFS_NOTIFY_<TARGET>_<KEY>` for event notification and `RUSTFS_AUDIT_<TARGET>_<KEY>` for audit logs. Supported targets in both families: `WEBHOOK`, `KAFKA`, `MQTT`, `MYSQL`, `POSTGRES`, `NATS`, `REDIS`, `AMQP`, `PULSAR`.

Sub-keys for the webhook target (the same keys exist under `RUSTFS_AUDIT_WEBHOOK_*`):

| Variable | Default | Description |
| --- | --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENABLE` | `false` | Enable the webhook target. |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT` | unset | Webhook HTTP(S) endpoint URL. |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN` | unset | Bearer token sent with each delivery. |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR` | unset | Directory for the persistent delivery queue. |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT` | unset | Maximum queued events. |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT` | unset | Client certificate for mTLS to the endpoint. |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY` | unset | Client private key for mTLS to the endpoint. |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA` | unset | CA certificate used to verify the endpoint. |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY` | unset | Skip TLS verification of the endpoint (not recommended). |

Other targets follow the same shape with target-specific keys, e.g. `RUSTFS_NOTIFY_KAFKA_BROKERS`, `RUSTFS_NOTIFY_KAFKA_TOPIC`, `RUSTFS_NOTIFY_MQTT_BROKER`, `RUSTFS_NOTIFY_MQTT_TOPIC`, `RUSTFS_NOTIFY_MYSQL_DSN_STRING`, `RUSTFS_NOTIFY_NATS_ADDRESS`, `RUSTFS_NOTIFY_REDIS_URL`, `RUSTFS_NOTIFY_AMQP_URL`, `RUSTFS_NOTIFY_PULSAR_BROKER`.

## Legacy compatibility

### MINIO_* variable mapping

For migration convenience, RustFS maps a fixed allowlist of `MINIO_*` variables to their `RUSTFS_*` equivalents at startup:

- If only the `MINIO_`-prefixed variable is set, its value is used and a deprecation warning is logged.
- If both `MINIO_*` and `RUSTFS_*` are set with different values, the `RUSTFS_*` value wins and a conflict is recorded.

The mapped suffixes include `ACCESS_KEY`, `SECRET_KEY`, `ACCESS_KEY_FILE`, `SECRET_KEY_FILE`, `ROOT_USER`, `ROOT_PASSWORD`, `ADDRESS`, `CONSOLE_ADDRESS`, `VOLUMES`, `REGION`, `LICENSE`, `ERASURE_SET_DRIVE_COUNT`, `STORAGE_CLASS_STANDARD`, `STORAGE_CLASS_RRS`, `STORAGE_CLASS_OPTIMIZE`, `STORAGE_CLASS_INLINE_BLOCK`, `SCANNER_SPEED`, `SCANNER_CYCLE`, `COMPRESS_ENABLE`, `COMPRESS_EXTENSIONS`, `COMPRESS_MIME_TYPES`, `DRIVE_ACTIVE_MONITORING`, `ILM_EXPIRATION_WORKERS`, `API_XFF_HEADER`, `POLICY_PLUGIN_URL`, `POLICY_PLUGIN_AUTH_TOKEN`, the `IDENTITY_OPENID_*` keys, and every variable starting with `NOTIFY_WEBHOOK_`, `NOTIFY_MQTT_`, `AUDIT_WEBHOOK_`, or `AUDIT_MQTT_`. For example, `MINIO_ROOT_USER` maps to `RUSTFS_ROOT_USER` and `MINIO_NOTIFY_WEBHOOK_ENDPOINT` maps to `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT`.

### Deprecated aliases

| Deprecated variable | Use instead |
| --- | --- |
| `RUSTFS_ROOT_USER` | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD` | `RUSTFS_SECRET_KEY` |
| `RUSTFS_DATA_SCANNER_START_DELAY_SECS` | `RUSTFS_SCANNER_START_DELAY_SECS` |

Deprecated aliases still work but log a warning; the canonical `RUSTFS_*` name always takes precedence when both are set.
