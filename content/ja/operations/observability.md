---
title: "オブザーバビリティ"
description: "OTLP で RustFS のメトリクス、トレース、ログをエクスポートし、監視ツールと連携して、推奨アラートを設定する方法を説明します。"
---

## テレメトリの公開方法

RustFS は、メトリクス、トレース、ログを OTLP（OpenTelemetry Protocol）で**プッシュします**。ネイティブの Prometheus `/metrics` スクレイプエンドポイントは**公開しません**。ポート 9000 と 9001 のどちらにも、Prometheus のテキスト形式を返す HTTP ルートはありません。RustFS のメトリクスを Prometheus へ取り込むには、RustFS から OTLP を受信し、データを Prometheus 形式で再公開する OpenTelemetry Collector を実行する必要があります。

```text
RustFS (RUSTFS_OBS_ENDPOINT) --OTLP--> OpenTelemetry Collector --> Prometheus --> Grafana
                                                              \--> Loki (logs)
                                                              \--> Tempo / Jaeger (traces)
```

Collector の宛先は、次のように指定します。

```bash
# OTLP over HTTP (the Collector's default HTTP receiver port is 4318; gRPC is 4317)
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```

関連する環境変数（いずれもサーバー設定で定義されています）は次のとおりです。

| 変数 | 用途 |
| --- | --- |
| `RUSTFS_OBS_ENDPOINT` | トレース、メトリクス、ログのベースとなる OTLP エンドポイント |
| `RUSTFS_OBS_TRACE_ENDPOINT` / `RUSTFS_OBS_METRIC_ENDPOINT` / `RUSTFS_OBS_LOG_ENDPOINT` | シグナルごとのエンドポイント上書き |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` / `RUSTFS_OBS_TRACES_EXPORT_ENABLED` / `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | 各シグナルのエクスポートを切り替える |
| `RUSTFS_OBS_METER_INTERVAL` | メトリクスのエクスポート間隔 |
| `RUSTFS_OBS_SERVICE_NAME` / `RUSTFS_OBS_ENVIRONMENT` | エクスポートするテレメトリに付けるリソース属性 |
| `RUSTFS_OBS_LOGGER_LEVEL` | ログの詳細度（例: `info`） |

## 参照デプロイ（Docker Compose の Observability プロファイル）

アップストリームの `rustfs/rustfs` リポジトリは、`docker-compose.yml` の `observability` プロファイル配下に、参照用スタック一式を同梱しています。構成は **otel-collector**、**Prometheus**、**Grafana**、**Loki**（ログ）、**Tempo** と **Jaeger**（トレース）です。Collector の設定は 4317（gRPC）と 4318（HTTP）で OTLP を受信し、Prometheus 向けにポート `8889` でメトリクスを再エクスポートします。

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

Prometheus は RustFS をスクレイプせず、Collector をスクレイプします。

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

Prometheus に `rustfs_*` の系列が出ない場合は、次の順で経路を確認します。すべてのノードに `RUSTFS_OBS_ENDPOINT` が設定されているか、ノードから Collector へ到達できるか、Prometheus が Collector の `8889` エクスポーターポートをスクレイプしているかです。

:::

## メトリクスリファレンス

以下の名前は、いずれもサーバーのソースコードに照らして確認済みです。一覧は、OTLP でエクスポートされる運用に関係するサブセットです。内部向けと実験的な計器は省略しており、新しいリリースではここにないメトリクスが追加されることがあります。ラベルセットは、メトリクスを出力する箇所で記録されるものです。Collector と Prometheus は、`service_name` や instance などのリソースラベルを追加することがあります。

### 準備完了とプロセス

| メトリクス | タイプ | ラベル | 意味 |
| --- | --- | --- | --- |
| `rustfs_start_total` | counter | — | プロセスの起動回数。増加率が上がっている場合は、再起動ループを示します |
| `rustfs_runtime_readiness_ready` | gauge | — | ノードが完全に準備完了のとき `1`、劣化している間は `0` |
| `rustfs_runtime_readiness_degraded_total` | counter | `reason` | 準備完了が劣化した評価の回数。`degradedReasons` の値ごと（例: `storage_quorum_unavailable`） |

### スキャナー

| メトリクス | タイプ | ラベル | 意味 |
| --- | --- | --- | --- |
| `rustfs_scanner_objects_scanned_total` | counter | — | バックグラウンドスキャナーが走査したオブジェクト数 |
| `rustfs_scanner_directories_scanned_total` | counter | — | 走査したディレクトリ数 |
| `rustfs_scanner_buckets_scanned_total` | counter | `result`, `bucket`, `disk` | 完了したバケットとドライブのスキャン数。結果ごと（`success` / `error` / `partial`） |
| `rustfs_scanner_cycles_total` | counter | `result` | 完了したスキャナーのサイクル（`success` / `error` / `partial` / `unknown`） |
| `rustfs_scanner_cycle_duration_seconds` | gauge | — | 最後に完了したスキャンサイクルの所要時間 |
| `rustfs_scanner_bucket_drive_duration_seconds` | histogram | `bucket`, `disk` | 1 つのドライブ上で 1 つのバケットをスキャンする時間 |
| `rustfs_scanner_leader_lock_total` | counter | `state` | スキャナーのリーダーロック取得イベント |
| `rustfs_scanner_inline_heal_total` | counter | — | スキャナーが直接、データ修復のキューへ入れたオブジェクト数 |
| `rustfs_scanner_cache_save_duration_seconds` | histogram | `cache` | データ使用量キャッシュの永続化にかかった時間 |
| `rustfs_scanner_set_scan_concurrency_limit` | gauge | — | セットあたりの、現在のスキャン同時実行数の上限 |
| `rustfs_scanner_disk_scan_concurrency_limit` | gauge | `pool`, `set` | ディスクあたりの、現在のスキャン同時実行数の上限 |

### データ修復

| メトリクス | タイプ | ラベル | 意味 |
| --- | --- | --- | --- |
| `rustfs_heal_task_running` | gauge | `type`, `set` | イレイジャーセットごとに、現在実行中のデータ修復タスク |
| `rustfs_heal_task_start_total` | counter | `type`, `set` | 開始されたデータ修復タスク |
| `rustfs_heal_queue_delay_seconds` | histogram | `type`, `set` | データ修復タスクが開始前にキューで待機した時間 |
| `rustfs_heal_admission_total` | counter | `source`, `result`, `reason`, `context` | データ修復の受付判定（受理または拒否と、その理由） |
| `rustfs_heal_mainline_throttle_total` | counter | `source`, `result`, `reason` | フォアグラウンドのトラフィックを守るため抑制された、バックグラウンドのデータ修復 |
| `rustfs_heal_scheduler_skip_total` | counter | `reason`, `set` | スキップされたデータ修復のスケジューリング（例: セットあたりの上限に到達） |
| `rustfs_heal_page_concurrency_current` | gauge | — | 現在の、ページ単位のデータ修復の同時実行数 |
| `rustfs_heal_candidate_enqueue_total` | counter | — | スキャナーがキューへ入れたデータ修復の候補 |
| `rustfs_heal_candidate_merge_total` | counter | — | 既存のキュー項目へマージされた候補 |
| `rustfs_heal_candidate_drop_total` | counter | — | 破棄された候補 |
| `rustfs_heal_candidate_priority_reject_total` | counter | — | 優先度ポリシーによって拒否された候補 |
| `rustfs_heal_read_repair_dedup_total` | counter | `reason` | 重複排除された、読み取りパスの修復リクエスト |

### API／IO パス

| メトリクス | タイプ | ラベル | 意味 |
| --- | --- | --- | --- |
| `rustfs_io_get_object_request_duration_seconds` | histogram | `status` | GetObject のエンドツーエンドのレイテンシ |
| `rustfs_io_get_object_stage_duration_seconds` | histogram | `path`, `stage` | 内部ステージ別に分解した GetObject のレイテンシ |
| `rustfs_io_get_object_response_size_bytes` | histogram | — | GetObject のレスポンスサイズ |
| `rustfs_io_operation_duration_seconds` | histogram | `operation` | IO 操作の所要時間 |
| `rustfs_io_timeout_events_total` | counter | `operation` | タイムアウトした IO 操作 |
| `rustfs_operation_progress` | gauge | `operation` | 長時間実行される操作の進捗率 |
| `rustfs_operation_stalled` | counter | `operation` | 停滞として検出された操作 |
| `rustfs_operation_completions` | counter | `operation`, `status` | ステータス別の操作完了数 |
| `rustfs_io_queue_operations` | counter | `operation`, `priority` | IO キューのエンキューとデキュー |
| `rustfs_io_queue_size` | gauge | `priority` | 優先度ごとの、現在の IO キュー深度 |
| `rustfs_io_starvation_events` | counter | `priority` | 低優先度 IO の枯渇イベント |
| `rustfs_io_bandwidth_bps` | gauge | — | 観測された IO 帯域（バイト/秒） |
| `rustfs_io_scheduler_decisions` | counter | — | 実行された IO スケジューラの判定 |
| `rustfs_io_scheduler_load` | counter | `level` | 負荷レベル別のスケジューラ判定 |
| `rustfs_io_load_changes` | counter | `from`, `to` | IO 負荷レベルの遷移 |

### バックプレッシャー

| メトリクス | タイプ | ラベル | 意味 |
| --- | --- | --- | --- |
| `rustfs_backpressure_state_changes` | counter | `from`, `to` | バックプレッシャー状態の遷移 |
| `rustfs_backpressure_activations` | counter | — | バックプレッシャーが働いた回数 |
| `rustfs_backpressure_deactivations` | counter | — | バックプレッシャーが解除された回数 |
| `rustfs_backpressure_rejections` | counter | — | バックプレッシャーにより拒否されたリクエスト |
| `rustfs_backpressure_concurrent` | gauge | — | リミッターが追跡している、現在の同時リクエスト数 |

### 容量

| メトリクス | タイプ | ラベル | 意味 |
| --- | --- | --- | --- |
| `rustfs_capacity_current_bytes` | gauge | — | 現在の使用済み容量（バイト） |
| `rustfs_capacity_update_total` | counter | `source` | 容量の再計算回数 |
| `rustfs_capacity_update_duration_seconds` | histogram | `source` | 容量の再計算にかかった時間 |
| `rustfs_capacity_cache_hits` | counter | — | 容量キャッシュのヒット |
| `rustfs_capacity_cache_misses` | counter | — | 容量キャッシュのミス |
| `rustfs_capacity_cache_served_total` | counter | `state` | キャッシュから返した容量の応答。鮮度の状態ごと |

### ロック

| メトリクス | タイプ | ラベル | 意味 |
| --- | --- | --- | --- |
| `rustfs_lock_contentions` | counter | — | ロック競合のイベント |
| `rustfs_lock_hold_time_secs` | histogram | — | ロックを保持していた時間 |
| `rustfs_lock_spin_successes` / `rustfs_lock_spin_failures` | counter | — | スピンロック取得の結果 |
| `rustfs_lock_early_releases` | counter | — | 最適化によって早期に解放されたロック |
| `rustfs_object_lock_diag_acquire_duration_seconds` | histogram | — | オブジェクトロックの取得レイテンシ（診断モード） |
| `rustfs_object_lock_diag_hold_duration_seconds` | histogram | — | オブジェクトロックの保持時間（診断モード） |
| `rustfs_object_lock_diag_slow_acquire_total` / `rustfs_object_lock_diag_slow_hold_total` | counter | — | 取得または保持が遅かったロックのイベント（診断モード） |

### ログクリーナー

| メトリクス | タイプ | ラベル | 意味 |
| --- | --- | --- | --- |
| `rustfs_log_cleaner_runs_total` | counter | — | ログクリーナーの実行回数 |
| `rustfs_log_cleaner_deleted_files_total` | counter | — | 削除されたログファイル数 |
| `rustfs_log_cleaner_freed_bytes_total` | counter | — | 回収したバイト数 |
| `rustfs_log_cleaner_rotation_total` / `rustfs_log_cleaner_rotation_failures_total` | counter | — | ログのローテーションとその失敗 |
| `rustfs_log_cleaner_rotation_duration_seconds` | histogram | — | ローテーションの所要時間 |
| `rustfs_log_cleaner_active_file_size_bytes` | gauge | — | アクティブなログファイルのサイズ |

:::note[追加のメトリクス]

型やラベルの詳細をここでは文書化していない、確認済みのメトリクス名がほかにもあります。対象は `rustfs_scanner_cache_save_attempt_total`、`rustfs_scanner_cache_save_timeout_total`、`rustfs_scanner_cache_save_retry_total`、`rustfs_scanner_excess_object_versions_total`、`rustfs_scanner_excess_object_version_size_total`、`rustfs_scanner_excess_folders_total`、`rustfs_scanner_pending_heal_prune_total`、`rustfs_scanner_pending_heal_malformed_total`、および `rustfs_io_scheduler_*` / `rustfs_io_buffer_*` / `rustfs_timeout_dynamic_*` の系統です。パイプラインが稼働したら、Prometheus で確認します。

:::

## 推奨アラート

| アラート | シグナル | 推奨ルール |
| --- | --- | --- |
| ノードが 2 分を超えて準備完了でない | `rustfs_runtime_readiness_ready` ゲージ、または `GET /health/ready` への外部プローブが 200 以外を返す | `2m` の間 `rustfs_runtime_readiness_ready == 0` |
| 再起動ループ | `rustfs_start_total` | `increase(rustfs_start_total[10m]) > 3` |
| データ修復のバックログが増加 | `rustfs_heal_task_running` と `rustfs_heal_queue_delay_seconds` | 実行中タスクがゼロ以外のまま続き、キュー遅延が `30m` にわたって上昇 |
| スキャナーの停滞 | `rustfs_scanner_cycles_total` | `increase(rustfs_scanner_cycles_total[24h]) == 0` |
| クラスター使用容量のウォーターマーク | `rustfs_capacity_current_bytes` | デプロイ済みの総容量（自ら設定する定数）と比較します。例: `rustfs_capacity_current_bytes > 0.8 * <total-bytes>` |

:::note

ディスクごとの使用量と、ディスクのオンライン／オフライン状態は、現時点では専用の OTLP メトリクスとしては出てきません。Console（管理画面）と管理 API（サーバーとストレージの情報）で確認できます。ディスクごとのウォーターマークアラートにするには、独自のエクスポーターから管理 API をポーリングするか、Console のダッシュボードを監視します。

:::

## ログの収集

ログの出力先は `RUSTFS_OBS_LOG_DIRECTORY` で制御します。

- **未設定**の場合、ログは stdout に出力されます。コンテナではログドライバーを使います。systemd のホストでは、stdout と stderr を **journald** が捕捉するため、追加設定なしで `journalctl -u rustfs -f` を使えます。
- **ローカルディレクトリ**（例: `/var/log/rustfs/`）の場合、RustFS はそこにローテーションするログファイルを書き込みます。ローテーションは `RUSTFS_OBS_LOG_FILENAME`、`RUSTFS_OBS_LOG_ROTATION_SIZE_MB`、`RUSTFS_OBS_LOG_ROTATION_TIME`、`RUSTFS_OBS_LOG_KEEP_FILES` で調整します。
- **URL**（`://` を含む）の場合、ログはリモートのエンドポイントへ送られます。

`RUSTFS_OBS_ENDPOINT` が設定され、ログのエクスポートが有効なときは、ログは OTLP でも追加でエクスポートされます。参照スタックは、Grafana から照会できるよう、これらを Loki へ送ります。

```bash title="Example: file logs plus OTLP export"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ADDRESS=":9001"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```
