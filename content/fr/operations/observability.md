---
title: "Observability"
description: "This article explains RustFS telemetry exports, monitoring integrations, metric names and labels, recommended alerts, and log collection."
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

## Metrics Reference

Every name below is verified against the server source. The list covers the operations-relevant subset exported via OTLP; internal and experimental instruments are omitted, and new releases may add metrics not listed here. Label sets are those recorded at the emission site. The Collector and Prometheus may attach additional resource labels, such as `service_name` and instance.

### Readiness and Process

| Metric | Type | Labels | Meaning |
| --- | --- | --- | --- |
| `rustfs_start_total` | counter | — | Process starts; a rising rate indicates restart loops |
| `rustfs_runtime_readiness_ready` | gauge | — | `1` when the node is fully ready, `0` while degraded |
| `rustfs_runtime_readiness_degraded_total` | counter | `reason` | Degraded readiness evaluations, by `degradedReasons` value (e.g. `storage_quorum_unavailable`) |

### Scanner

| Metric | Type | Labels | Meaning |
| --- | --- | --- | --- |
| `rustfs_scanner_objects_scanned_total` | counter | — | Objects visited by the background scanner |
| `rustfs_scanner_directories_scanned_total` | counter | — | Directories visited |
| `rustfs_scanner_buckets_scanned_total` | counter | `result`, `bucket`, `disk` | Bucket/drive scans completed, by outcome (`success` / `error` / `partial`) |
| `rustfs_scanner_cycles_total` | counter | `result` | Scanner cycles finished (`success` / `error` / `partial` / `unknown`) |
| `rustfs_scanner_cycle_duration_seconds` | gauge | — | Duration of the last completed scan cycle |
| `rustfs_scanner_bucket_drive_duration_seconds` | histogram | `bucket`, `disk` | Time to scan one bucket on one drive |
| `rustfs_scanner_leader_lock_total` | counter | `state` | Scanner leader-lock acquisition events |
| `rustfs_scanner_inline_heal_total` | counter | — | Objects queued for heal directly by the scanner |
| `rustfs_scanner_cache_save_duration_seconds` | histogram | `cache` | Time to persist the data-usage cache |
| `rustfs_scanner_set_scan_concurrency_limit` | gauge | — | Current per-set scan concurrency limit |
| `rustfs_scanner_disk_scan_concurrency_limit` | gauge | `pool`, `set` | Current per-disk scan concurrency limit |

### Heal

| Metric | Type | Labels | Meaning |
| --- | --- | --- | --- |
| `rustfs_heal_task_running` | gauge | `type`, `set` | Currently running heal tasks per erasure set |
| `rustfs_heal_task_start_total` | counter | `type`, `set` | Heal tasks started |
| `rustfs_heal_queue_delay_seconds` | histogram | `type`, `set` | Time a heal task waited in queue before starting |
| `rustfs_heal_admission_total` | counter | `source`, `result`, `reason`, `context` | Heal admission decisions (accepted / rejected and why) |
| `rustfs_heal_mainline_throttle_total` | counter | `source`, `result`, `reason` | Background heal throttled to protect foreground traffic |
| `rustfs_heal_scheduler_skip_total` | counter | `reason`, `set` | Heal scheduling skipped (e.g. per-set limit reached) |
| `rustfs_heal_page_concurrency_current` | gauge | — | Current page-level heal concurrency |
| `rustfs_heal_candidate_enqueue_total` | counter | — | Heal candidates enqueued by the scanner |
| `rustfs_heal_candidate_merge_total` | counter | — | Candidates merged with an existing queue entry |
| `rustfs_heal_candidate_drop_total` | counter | — | Candidates dropped |
| `rustfs_heal_candidate_priority_reject_total` | counter | — | Candidates rejected by priority policy |
| `rustfs_heal_read_repair_dedup_total` | counter | `reason` | Read-path repair requests deduplicated |

### API / IO Path

| Metric | Type | Labels | Meaning |
| --- | --- | --- | --- |
| `rustfs_io_get_object_request_duration_seconds` | histogram | `status` | End-to-end GetObject latency |
| `rustfs_io_get_object_stage_duration_seconds` | histogram | `path`, `stage` | GetObject latency broken down by internal stage |
| `rustfs_io_get_object_response_size_bytes` | histogram | — | GetObject response sizes |
| `rustfs_io_operation_duration_seconds` | histogram | `operation` | Duration of IO operations |
| `rustfs_io_timeout_events_total` | counter | `operation` | IO operations that hit a timeout |
| `rustfs_operation_progress` | gauge | `operation` | Progress percentage of long-running operations |
| `rustfs_operation_stalled` | counter | `operation` | Operations detected as stalled |
| `rustfs_operation_completions` | counter | `operation`, `status` | Operation completions by status |
| `rustfs_io_queue_operations` | counter | `operation`, `priority` | IO queue enqueue/dequeue operations |
| `rustfs_io_queue_size` | gauge | `priority` | Current IO queue depth per priority |
| `rustfs_io_starvation_events` | counter | `priority` | Low-priority IO starvation events |
| `rustfs_io_bandwidth_bps` | gauge | — | Observed IO bandwidth (bytes/s) |
| `rustfs_io_scheduler_decisions` | counter | — | IO scheduler decisions taken |
| `rustfs_io_scheduler_load` | counter | `level` | Scheduler decisions by load level |
| `rustfs_io_load_changes` | counter | `from`, `to` | IO load-level transitions |

### Backpressure

| Metric | Type | Labels | Meaning |
| --- | --- | --- | --- |
| `rustfs_backpressure_state_changes` | counter | `from`, `to` | Backpressure state transitions |
| `rustfs_backpressure_activations` | counter | — | Times backpressure engaged |
| `rustfs_backpressure_deactivations` | counter | — | Times backpressure released |
| `rustfs_backpressure_rejections` | counter | — | Requests rejected due to backpressure |
| `rustfs_backpressure_concurrent` | gauge | — | Current concurrent requests tracked by the limiter |

### Capacity

| Metric | Type | Labels | Meaning |
| --- | --- | --- | --- |
| `rustfs_capacity_current_bytes` | gauge | — | Current used capacity in bytes |
| `rustfs_capacity_update_total` | counter | `source` | Capacity recalculations |
| `rustfs_capacity_update_duration_seconds` | histogram | `source` | Time to recalculate capacity |
| `rustfs_capacity_cache_hits` | counter | — | Capacity cache hits |
| `rustfs_capacity_cache_misses` | counter | — | Capacity cache misses |
| `rustfs_capacity_cache_served_total` | counter | `state` | Capacity responses served from cache, by freshness state |

### Locking

| Metric | Type | Labels | Meaning |
| --- | --- | --- | --- |
| `rustfs_lock_contentions` | counter | — | Lock contention events |
| `rustfs_lock_hold_time_secs` | histogram | — | How long locks were held |
| `rustfs_lock_spin_successes` / `rustfs_lock_spin_failures` | counter | — | Spin-lock acquisition outcomes |
| `rustfs_lock_early_releases` | counter | — | Locks released early by optimization |
| `rustfs_object_lock_diag_acquire_duration_seconds` | histogram | — | Object-lock acquire latency (diagnostics mode) |
| `rustfs_object_lock_diag_hold_duration_seconds` | histogram | — | Object-lock hold duration (diagnostics mode) |
| `rustfs_object_lock_diag_slow_acquire_total` / `rustfs_object_lock_diag_slow_hold_total` | counter | — | Slow lock acquire/hold events (diagnostics mode) |

### Log Cleaner

| Metric | Type | Labels | Meaning |
| --- | --- | --- | --- |
| `rustfs_log_cleaner_runs_total` | counter | — | Log-cleaner runs |
| `rustfs_log_cleaner_deleted_files_total` | counter | — | Log files deleted |
| `rustfs_log_cleaner_freed_bytes_total` | counter | — | Bytes reclaimed |
| `rustfs_log_cleaner_rotation_total` / `rustfs_log_cleaner_rotation_failures_total` | counter | — | Log rotations and rotation failures |
| `rustfs_log_cleaner_rotation_duration_seconds` | histogram | — | Rotation duration |
| `rustfs_log_cleaner_active_file_size_bytes` | gauge | — | Size of the active log file |

:::note[Additional metrics]

Additional verified metric names exist whose type/label details are not documented here, including `rustfs_scanner_cache_save_attempt_total`, `rustfs_scanner_cache_save_timeout_total`, `rustfs_scanner_cache_save_retry_total`, `rustfs_scanner_excess_object_versions_total`, `rustfs_scanner_excess_object_version_size_total`, `rustfs_scanner_excess_folders_total`, `rustfs_scanner_pending_heal_prune_total`, `rustfs_scanner_pending_heal_malformed_total`, and the `rustfs_io_scheduler_*` / `rustfs_io_buffer_*` / `rustfs_timeout_dynamic_*` families. Inspect them in Prometheus once the pipeline is live.

:::

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
