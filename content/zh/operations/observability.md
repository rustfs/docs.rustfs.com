---
title: "可观测性"
description: "本文介绍 RustFS 遥测导出、监控集成、指标名称和标签、建议告警以及日志采集。"
---

## RustFS 如何公开遥测数据

RustFS 通过 OTLP（OpenTelemetry Protocol）**推送**指标、追踪和日志。它**不提供**原生 Prometheus `/metrics` 抓取端点，端口 9000 或 9001 上没有提供 Prometheus 文本格式的 HTTP 路由。要将 RustFS 指标导入 Prometheus，必须运行 OpenTelemetry Collector，由它接收 RustFS 的 OTLP 数据并以 Prometheus 格式重新公开：

```text
RustFS (RUSTFS_OBS_ENDPOINT) --OTLP--> OpenTelemetry Collector --> Prometheus --> Grafana
                                                              \--> Loki (logs)
                                                              \--> Tempo / Jaeger (traces)
```

使用以下配置将 RustFS 指向 Collector：

```bash
# OTLP over HTTP (the Collector's default HTTP receiver port is 4318; gRPC is 4317)
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```

相关环境变量（均在服务器配置中定义）：

| 变量 | 用途 |
| --- | --- |
| `RUSTFS_OBS_ENDPOINT` | 追踪、指标和日志的基础 OTLP 端点 |
| `RUSTFS_OBS_TRACE_ENDPOINT` / `RUSTFS_OBS_METRIC_ENDPOINT` / `RUSTFS_OBS_LOG_ENDPOINT` | 各信号的端点覆盖值 |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` / `RUSTFS_OBS_TRACES_EXPORT_ENABLED` / `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | 切换各信号 |
| `RUSTFS_OBS_METER_INTERVAL` | 指标导出间隔 |
| `RUSTFS_OBS_SERVICE_NAME` / `RUSTFS_OBS_ENVIRONMENT` | 附加到导出遥测数据的资源属性 |
| `RUSTFS_OBS_LOGGER_LEVEL` | 日志详细程度（例如 `info`） |

## 参考部署（Docker Compose 可观测性 Profile）

上游 `rustfs/rustfs` 仓库在 `docker-compose.yml` 的 `observability` profile 中提供完整参考栈：**otel-collector**、**Prometheus**、**Grafana**、**Loki**（日志）、**Tempo** 和 **Jaeger**（追踪）。其 Collector 配置在 4317（gRPC）和 4318（HTTP）上接收 OTLP，并在端口 `8889` 上为 Prometheus 重新导出指标：

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

随后 Prometheus 抓取 Collector，而不是 RustFS：

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

如果 Prometheus 中没有 `rustfs_*` 序列，请依次检查：是否在每个节点上设置了 `RUSTFS_OBS_ENDPOINT`、节点能否访问 Collector，以及 Prometheus 是否正在抓取 Collector 的 `8889` 导出端口。

:::

## 指标参考

以下每个名称均已对照服务器源代码验证。该列表涵盖通过 OTLP 导出的运维相关子集；省略了内部和实验性工具，新版本可能会添加未在此列出的指标。标签集是在发出位置记录的标签。Collector 和 Prometheus 可能会附加其他资源标签，例如 `service_name` 和实例。

### 就绪状态和进程

| 指标 | 类型 | 标签 | 含义 |
| --- | --- | --- | --- |
| `rustfs_start_total` | counter | — | 进程启动；速率升高表示重启循环 |
| `rustfs_runtime_readiness_ready` | gauge | — | 节点完全就绪时为 `1`，降级时为 `0` |
| `rustfs_runtime_readiness_degraded_total` | counter | `reason` | 按 `degradedReasons` 值（例如 `storage_quorum_unavailable`）统计的降级就绪评估 |

### 扫描器

| 指标 | 类型 | 标签 | 含义 |
| --- | --- | --- | --- |
| `rustfs_scanner_objects_scanned_total` | counter | — | 后台扫描器访问的对象 |
| `rustfs_scanner_directories_scanned_total` | counter | — | 已访问目录 |
| `rustfs_scanner_buckets_scanned_total` | counter | `result`, `bucket`, `disk` | 按结果（`success` / `error` / `partial`）统计完成的存储桶/驱动器扫描 |
| `rustfs_scanner_cycles_total` | counter | `result` | 已完成扫描周期（`success` / `error` / `partial` / `unknown`） |
| `rustfs_scanner_cycle_duration_seconds` | gauge | — | 上次完成扫描周期的持续时间 |
| `rustfs_scanner_bucket_drive_duration_seconds` | histogram | `bucket`, `disk` | 扫描一个驱动器上一个存储桶的时间 |
| `rustfs_scanner_leader_lock_total` | counter | `state` | 扫描器领导锁获取事件 |
| `rustfs_scanner_inline_heal_total` | counter | — | 扫描器直接排队等待修复的对象 |
| `rustfs_scanner_cache_save_duration_seconds` | histogram | `cache` | 持久化数据使用缓存的时间 |
| `rustfs_scanner_set_scan_concurrency_limit` | gauge | — | 当前每集合扫描并发限制 |
| `rustfs_scanner_disk_scan_concurrency_limit` | gauge | `pool`, `set` | 当前每磁盘扫描并发限制 |

### 修复

| 指标 | 类型 | 标签 | 含义 |
| --- | --- | --- | --- |
| `rustfs_heal_task_running` | gauge | `type`, `set` | 每个纠删码集合当前运行的修复任务 |
| `rustfs_heal_task_start_total` | counter | `type`, `set` | 已启动修复任务 |
| `rustfs_heal_queue_delay_seconds` | histogram | `type`, `set` | 修复任务启动前的排队时间 |
| `rustfs_heal_admission_total` | counter | `source`, `result`, `reason`, `context` | 修复准入决定（接受/拒绝及原因） |
| `rustfs_heal_mainline_throttle_total` | counter | `source`, `result`, `reason` | 为保护前台流量而限制的后台修复 |
| `rustfs_heal_scheduler_skip_total` | counter | `reason`, `set` | 跳过修复调度（例如达到每集合限制） |
| `rustfs_heal_page_concurrency_current` | gauge | — | 当前页面级修复并发数 |
| `rustfs_heal_candidate_enqueue_total` | counter | — | 扫描器排队的修复候选项 |
| `rustfs_heal_candidate_merge_total` | counter | — | 与现有队列条目合并的候选项 |
| `rustfs_heal_candidate_drop_total` | counter | — | 已丢弃候选项 |
| `rustfs_heal_candidate_priority_reject_total` | counter | — | 被优先级策略拒绝的候选项 |
| `rustfs_heal_read_repair_dedup_total` | counter | `reason` | 已去重的读取路径修复请求 |

### API / IO 路径

| 指标 | 类型 | 标签 | 含义 |
| --- | --- | --- | --- |
| `rustfs_io_get_object_request_duration_seconds` | histogram | `status` | 端到端 GetObject 延迟 |
| `rustfs_io_get_object_stage_duration_seconds` | histogram | `path`, `stage` | 按内部阶段细分的 GetObject 延迟 |
| `rustfs_io_get_object_response_size_bytes` | histogram | — | GetObject 响应大小 |
| `rustfs_io_operation_duration_seconds` | histogram | `operation` | IO 操作持续时间 |
| `rustfs_io_timeout_events_total` | counter | `operation` | 达到超时的 IO 操作 |
| `rustfs_operation_progress` | gauge | `operation` | 长时间运行操作的进度百分比 |
| `rustfs_operation_stalled` | counter | `operation` | 检测到停滞的操作 |
| `rustfs_operation_completions` | counter | `operation`, `status` | 按状态统计的操作完成数 |
| `rustfs_io_queue_operations` | counter | `operation`, `priority` | IO 队列入队/出队操作 |
| `rustfs_io_queue_size` | gauge | `priority` | 每个优先级的当前 IO 队列深度 |
| `rustfs_io_starvation_events` | counter | `priority` | 低优先级 IO 饥饿事件 |
| `rustfs_io_bandwidth_bps` | gauge | — | 观测到的 IO 带宽（字节/秒） |
| `rustfs_io_scheduler_decisions` | counter | — | 已执行的 IO 调度器决定 |
| `rustfs_io_scheduler_load` | counter | `level` | 按负载级别统计的调度器决定 |
| `rustfs_io_load_changes` | counter | `from`, `to` | IO 负载级别转换 |

### 背压

| 指标 | 类型 | 标签 | 含义 |
| --- | --- | --- | --- |
| `rustfs_backpressure_state_changes` | counter | `from`, `to` | 背压状态转换 |
| `rustfs_backpressure_activations` | counter | — | 背压启用次数 |
| `rustfs_backpressure_deactivations` | counter | — | 背压解除次数 |
| `rustfs_backpressure_rejections` | counter | — | 因背压而拒绝的请求 |
| `rustfs_backpressure_concurrent` | gauge | — | 限制器跟踪的当前并发请求数 |

### 容量

| 指标 | 类型 | 标签 | 含义 |
| --- | --- | --- | --- |
| `rustfs_capacity_current_bytes` | gauge | — | 当前已用容量（字节） |
| `rustfs_capacity_update_total` | counter | `source` | 容量重新计算次数 |
| `rustfs_capacity_update_duration_seconds` | histogram | `source` | 重新计算容量的时间 |
| `rustfs_capacity_cache_hits` | counter | — | 容量缓存命中次数 |
| `rustfs_capacity_cache_misses` | counter | — | 容量缓存未命中次数 |
| `rustfs_capacity_cache_served_total` | counter | `state` | 按新鲜度状态统计的缓存容量响应 |

### 锁定

| 指标 | 类型 | 标签 | 含义 |
| --- | --- | --- | --- |
| `rustfs_lock_contentions` | counter | — | 锁争用事件 |
| `rustfs_lock_hold_time_secs` | histogram | — | 锁持有时间 |
| `rustfs_lock_spin_successes` / `rustfs_lock_spin_failures` | counter | — | 自旋锁获取结果 |
| `rustfs_lock_early_releases` | counter | — | 通过优化提前释放的锁 |
| `rustfs_object_lock_diag_acquire_duration_seconds` | histogram | — | 对象锁获取延迟（诊断模式） |
| `rustfs_object_lock_diag_hold_duration_seconds` | histogram | — | 对象锁持有时间（诊断模式） |
| `rustfs_object_lock_diag_slow_acquire_total` / `rustfs_object_lock_diag_slow_hold_total` | counter | — | 慢速锁获取/持有事件（诊断模式） |

### 日志清理器

| 指标 | 类型 | 标签 | 含义 |
| --- | --- | --- | --- |
| `rustfs_log_cleaner_runs_total` | counter | — | 日志清理器运行次数 |
| `rustfs_log_cleaner_deleted_files_total` | counter | — | 已删除日志文件数 |
| `rustfs_log_cleaner_freed_bytes_total` | counter | — | 已回收字节数 |
| `rustfs_log_cleaner_rotation_total` / `rustfs_log_cleaner_rotation_failures_total` | counter | — | 日志轮换和轮换失败次数 |
| `rustfs_log_cleaner_rotation_duration_seconds` | histogram | — | 轮换持续时间 |
| `rustfs_log_cleaner_active_file_size_bytes` | gauge | — | 活跃日志文件大小 |

:::note[其他指标]

还有一些已验证名称的指标，其类型/标签详情未在此记录，包括 `rustfs_scanner_cache_save_attempt_total`、`rustfs_scanner_cache_save_timeout_total`、`rustfs_scanner_cache_save_retry_total`、`rustfs_scanner_excess_object_versions_total`、`rustfs_scanner_excess_object_version_size_total`、`rustfs_scanner_excess_folders_total`、`rustfs_scanner_pending_heal_prune_total`、`rustfs_scanner_pending_heal_malformed_total`，以及 `rustfs_io_scheduler_*` / `rustfs_io_buffer_*` / `rustfs_timeout_dynamic_*` 系列。管道运行后，请在 Prometheus 中检查这些指标。

:::

## 建议告警

| 告警 | 信号 | 建议规则 |
| --- | --- | --- |
| 节点超过 2 分钟未就绪 | `rustfs_runtime_readiness_ready` gauge，或 `GET /health/ready` 返回非 200 的外部探针 | `rustfs_runtime_readiness_ready == 0` for `2m` |
| 重启循环 | `rustfs_start_total` | `increase(rustfs_start_total[10m]) > 3` |
| 修复积压增长 | `rustfs_heal_task_running` 和 `rustfs_heal_queue_delay_seconds` | 运行任务持续非零且队列延迟持续上升 `30m` |
| 扫描器停滞 | `rustfs_scanner_cycles_total` | `increase(rustfs_scanner_cycles_total[24h]) == 0` |
| 集群已用容量水位 | `rustfs_capacity_current_bytes` | 与部署的原始容量（您设置的常量）比较，例如 `rustfs_capacity_current_bytes > 0.8 * <total-bytes>` |

:::note

当前通过控制台和管理 API（服务器/存储信息）公开每磁盘使用情况和磁盘在线/离线状态，而不是使用专用 OTLP 指标。如需每磁盘水位告警，请通过自己的导出器轮询管理 API，或查看控制台仪表板。

:::

## 日志采集

日志去向由 `RUSTFS_OBS_LOG_DIRECTORY` 控制：

- **未设置**：日志写入 stdout。在容器中使用日志驱动；在 systemd 主机上，stdout/stderr 由 **journald** 捕获，因此无需额外配置即可使用 `journalctl -u rustfs -f`。
- **本地目录**（例如 `/var/log/rustfs/`）：RustFS 在其中写入轮换日志文件。使用 `RUSTFS_OBS_LOG_FILENAME`、`RUSTFS_OBS_LOG_ROTATION_SIZE_MB`、`RUSTFS_OBS_LOG_ROTATION_TIME` 和 `RUSTFS_OBS_LOG_KEEP_FILES` 调整轮换。
- **URL**（包含 `://`）：日志发送到远程端点。

设置 `RUSTFS_OBS_ENDPOINT` 并启用日志导出后，日志还会通过 OTLP 导出；参考栈将其路由到 Loki，以便从 Grafana 查询。

```bash title="Example: file logs plus OTLP export"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ADDRESS=":9001"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```