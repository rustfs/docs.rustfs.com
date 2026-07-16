---
title: "Monitoring and Alerting"
description: "This article explains how RustFS exports metrics, traces, and logs over OTLP, how to wire the pipeline into Prometheus and Grafana, which health endpoints to probe, and which signals to alert on."
---

## How RustFS Exposes Telemetry

RustFS **pushes** metrics, traces, and logs over OTLP (OpenTelemetry Protocol). It does **not** expose a native Prometheus `/metrics` scrape endpoint — there is no HTTP route on port 9000 or 9001 that serves Prometheus text format. To get RustFS metrics into Prometheus you must run an OpenTelemetry Collector that receives OTLP from RustFS and re-exposes the data in Prometheus format:

```text
RustFS (RUSTFS_OBS_ENDPOINT) --OTLP--> OpenTelemetry Collector --> Prometheus --> Grafana
                                                              \--> Loki (logs)
                                                              \--> Tempo / Jaeger (traces)
```

Point RustFS at the Collector with:

```bash
# OTLP over HTTP (the Collector's default HTTP receiver port is 4318; gRPC is 4317)
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```

Related environment variables (all defined in the server configuration):

| Variable | Purpose |
| --- | --- |
| `RUSTFS_OBS_ENDPOINT` | Base OTLP endpoint for traces, metrics, and logs |
| `RUSTFS_OBS_TRACE_ENDPOINT` / `RUSTFS_OBS_METRIC_ENDPOINT` / `RUSTFS_OBS_LOG_ENDPOINT` | Per-signal endpoint overrides |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` / `RUSTFS_OBS_TRACES_EXPORT_ENABLED` / `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | Toggle each signal |
| `RUSTFS_OBS_METER_INTERVAL` | Metric export interval |
| `RUSTFS_OBS_SERVICE_NAME` / `RUSTFS_OBS_ENVIRONMENT` | Resource attributes attached to exported telemetry |
| `RUSTFS_OBS_LOGGER_LEVEL` | Log verbosity (e.g. `info`) |

## Reference Deployment (Docker Compose Observability Profile)

The upstream `rustfs/rustfs` repository ships a complete reference stack in `docker-compose.yml` behind the `observability` profile: **otel-collector**, **Prometheus**, **Grafana**, **Loki** (logs), **Tempo** and **Jaeger** (traces). Its Collector configuration receives OTLP on 4317 (gRPC) and 4318 (HTTP) and re-exports metrics for Prometheus on port `8889`:

```yaml
# OpenTelemetry Collector (excerpt from the upstream reference config)
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
service:
  pipelines:
    metrics:
      receivers: [otlp]
      exporters: [prometheus]
```

Prometheus then scrapes the Collector, not RustFS:

```yaml
# prometheus.yml (excerpt)
scrape_configs:
  - job_name: "rustfs-app-metrics"
    static_configs:
      - targets: ["otel-collector:8889"]   # RustFS application metrics
  - job_name: "otel-collector"
    static_configs:
      - targets: ["otel-collector:8888"]   # Collector self-metrics
```

:::note
If Prometheus shows no `rustfs_*` series, check the chain in order: is `RUSTFS_OBS_ENDPOINT` set on every node, is the Collector reachable from the nodes, and is Prometheus scraping the Collector's `8889` exporter port.
:::

## Health Endpoints

The S3 listener on port **9000** serves the probe endpoints; the console on port **9001** has its own health path.

| Endpoint | Port | Meaning |
| --- | --- | --- |
| `GET /health`, `GET /health/live` | 9000 | Liveness — returns `200` as long as the process is up |
| `GET /health/ready` | 9000 | Readiness — `200` only when storage, IAM, and peer health are ready; `503` otherwise |
| `GET /minio/health/ready` | 9000 | MinIO-compatible alias of the readiness probe |
| `GET /minio/health/cluster`, `GET /minio/health/cluster/read` | 9000 | Cluster write/read health (additionally require lock quorum) |
| `GET /rustfs/console/health` | 9001 | Console process health |

A ready node answers `200` with `"ready": true`. A degraded node answers `503` with per-dependency detail:

```bash
curl -s http://<node>:9000/health/ready | jq
```

The `details` object reports `storage` / `iam` / `lock` (and `kms` when configured), and `degradedReasons` lists machine-readable causes such as `storage_quorum_unavailable`, `iam_not_ready`, or `lock_quorum_unavailable`. See [Cold Start and Quorum Loss](./cold-start) for the full degraded-startup semantics.

## Key Metrics

All metric names below are exported via OTLP and appear in Prometheus after the Collector re-exports them (label set as recorded in the server source; the Collector may add resource labels). See the [Metrics Reference](../reference/metrics) for the full verified list.

| Metric | Type | What it tells you |
| --- | --- | --- |
| `rustfs_runtime_readiness_ready` | gauge | `1` when the node is fully ready, `0` while degraded |
| `rustfs_runtime_readiness_degraded_total` | counter (`reason`) | Degraded-readiness evaluations by reason |
| `rustfs_scanner_objects_scanned_total` | counter | Objects visited by the background scanner |
| `rustfs_scanner_cycles_total` | counter (`result`: success/error/partial) | Completed scanner cycles |
| `rustfs_scanner_cycle_duration_seconds` | gauge | Duration of the last scanner cycle |
| `rustfs_heal_task_running` | gauge (`type`, `set`) | Currently running heal tasks per erasure set |
| `rustfs_heal_queue_delay_seconds` | histogram (`type`, `set`) | Time heal tasks spend queued before starting |
| `rustfs_heal_task_start_total` | counter (`type`, `set`) | Heal tasks started |
| `rustfs_capacity_current_bytes` | gauge | Current used capacity in bytes |
| `rustfs_start_total` | counter | Process starts (spikes indicate restart loops) |

## Suggested Alerts

| Alert | Signal | Suggested rule |
| --- | --- | --- |
| Node not ready > 2 min | `rustfs_runtime_readiness_ready` gauge, or an external probe on `GET /health/ready` returning non-200 | `rustfs_runtime_readiness_ready == 0` for `2m` |
| Restart loop | `rustfs_start_total` | `increase(rustfs_start_total[10m]) > 3` |
| Heal backlog growing | `rustfs_heal_task_running` and `rustfs_heal_queue_delay_seconds` | sustained non-zero running tasks plus rising queue delay for `30m` |
| Scanner stalled | `rustfs_scanner_cycles_total` | `increase(rustfs_scanner_cycles_total[24h]) == 0` |
| Cluster used capacity watermark | `rustfs_capacity_current_bytes` | compare against your deployed raw capacity (a constant you set), e.g. `rustfs_capacity_current_bytes > 0.8 * <total-bytes>` |

:::note
Per-disk usage and disk online/offline state are currently surfaced through the console and the admin API (server/storage info), not as dedicated OTLP metrics. For a per-disk watermark alert, poll the admin API from your own exporter or watch the console dashboard.
:::

## Log Collection

Where logs go is controlled by `RUSTFS_OBS_LOG_DIRECTORY`:

- **Unset** — logs go to stdout. In containers, use your log driver; on systemd hosts, stdout/stderr is captured by **journald**, so `journalctl -u rustfs -f` works without extra configuration.
- **A local directory** (e.g. `/logs`) — RustFS writes rotating log files there. Rotation is tuned with `RUSTFS_OBS_LOG_FILENAME`, `RUSTFS_OBS_LOG_ROTATION_SIZE_MB`, `RUSTFS_OBS_LOG_ROTATION_TIME`, and `RUSTFS_OBS_LOG_KEEP_FILES`.
- **A URL** (contains `://`) — logs are shipped to a remote endpoint.

When `RUSTFS_OBS_ENDPOINT` is set and log export is enabled, logs are additionally exported via OTLP; the reference stack routes them into Loki for querying from Grafana.

```bash title="Example: file logs plus OTLP export"
RUSTFS_OBS_LOG_DIRECTORY=/var/log/rustfs
RUSTFS_OBS_LOGGER_LEVEL=info
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```
