---
title: "Observability für RustFS"
description: "Exportieren Sie Metriken, Traces und Protokolle von RustFS über OTLP, binden Sie Monitoring-Werkzeuge ein und konfigurieren Sie empfohlene Alarme."
---

## Wie RustFS Telemetrie bereitstellt

RustFS **sendet** Metriken, Traces und Protokolle über OTLP (OpenTelemetry Protocol). Es stellt **keinen** nativen Prometheus-Endpunkt `/metrics` zum Scrapen bereit. Auf Port 9000 oder 9001 gibt es keine HTTP-Route, die das Prometheus-Textformat ausliefert. Um RustFS-Metriken nach Prometheus zu bringen, müssen Sie einen OpenTelemetry Collector betreiben, der OTLP von RustFS empfängt und die Daten im Prometheus-Format erneut bereitstellt:

```text
RustFS (RUSTFS_OBS_ENDPOINT) --OTLP--> OpenTelemetry Collector --> Prometheus --> Grafana
                                                              \--> Loki (logs)
                                                              \--> Tempo / Jaeger (traces)
```

Richten Sie RustFS auf den Collector aus:

```bash
# OTLP over HTTP (the Collector's default HTTP receiver port is 4318; gRPC is 4317)
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```

Zugehörige Umgebungsvariablen (alle in der Serverkonfiguration definiert):

| Variable | Zweck |
| --- | --- |
| `RUSTFS_OBS_ENDPOINT` | Basis-OTLP-Endpunkt für Traces, Metriken und Protokolle |
| `RUSTFS_OBS_TRACE_ENDPOINT` / `RUSTFS_OBS_METRIC_ENDPOINT` / `RUSTFS_OBS_LOG_ENDPOINT` | Endpunktüberschreibungen je Signal |
| `RUSTFS_OBS_METRICS_EXPORT_ENABLED` / `RUSTFS_OBS_TRACES_EXPORT_ENABLED` / `RUSTFS_OBS_LOGS_EXPORT_ENABLED` | Schaltet jedes Signal ein oder aus |
| `RUSTFS_OBS_METER_INTERVAL` | Exportintervall der Metriken |
| `RUSTFS_OBS_SERVICE_NAME` / `RUSTFS_OBS_ENVIRONMENT` | Ressourcenattribute, die an die exportierte Telemetrie gehängt werden |
| `RUSTFS_OBS_LOGGER_LEVEL` | Protokollausführlichkeit (z. B. `info`) |

## Referenzbereitstellung (Observability-Profil von Docker Compose)

Das Upstream-Repository `rustfs/rustfs` liefert in `docker-compose.yml` hinter dem Profil `observability` einen vollständigen Referenzstapel: **otel-collector**, **Prometheus**, **Grafana**, **Loki** (Protokolle), **Tempo** und **Jaeger** (Traces). Die Collector-Konfiguration empfängt OTLP auf 4317 (gRPC) und 4318 (HTTP) und exportiert Metriken für Prometheus erneut auf Port `8889`:

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

Prometheus scrapt danach den Collector, nicht RustFS:

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

Wenn Prometheus keine Zeitreihen `rustfs_*` zeigt, prüfen Sie die Kette der Reihe nach: Ist `RUSTFS_OBS_ENDPOINT` auf jedem Knoten gesetzt, ist der Collector von den Knoten erreichbar, und scrapt Prometheus den Exporter-Port `8889` des Collectors.

:::

## Metrikreferenz

Jeder Name unten ist gegen den Serverquellcode geprüft. Die Liste umfasst die betrieblich relevante Teilmenge, die über OTLP exportiert wird. Interne und experimentelle Instrumente sind ausgelassen, und neue Versionen können Metriken hinzufügen, die hier nicht stehen. Die Label-Sätze sind die am Emissionsort aufgezeichneten. Collector und Prometheus können weitere Ressourcenlabels anhängen, etwa `service_name` und die Instanz.

### Bereitschaft und Prozess

| Metrik | Typ | Labels | Bedeutung |
| --- | --- | --- | --- |
| `rustfs_start_total` | counter | — | Prozessstarts; eine steigende Rate weist auf Neustartschleifen hin |
| `rustfs_runtime_readiness_ready` | gauge | — | `1`, wenn der Knoten vollständig bereit ist, `0`, solange die Bereitschaft beeinträchtigt ist |
| `rustfs_runtime_readiness_degraded_total` | counter | `reason` | Auswertungen mit beeinträchtigter Bereitschaft, nach dem Wert von `degradedReasons` (z. B. `storage_quorum_unavailable`) |

### Scanner

| Metrik | Typ | Labels | Bedeutung |
| --- | --- | --- | --- |
| `rustfs_scanner_objects_scanned_total` | counter | — | Vom Hintergrundscanner besuchte Objekte |
| `rustfs_scanner_directories_scanned_total` | counter | — | Besuchte Verzeichnisse |
| `rustfs_scanner_buckets_scanned_total` | counter | `result`, `bucket`, `disk` | Abgeschlossene Scans von Bucket und Laufwerk, nach Ergebnis (`success` / `error` / `partial`) |
| `rustfs_scanner_cycles_total` | counter | `result` | Abgeschlossene Scanner-Zyklen (`success` / `error` / `partial` / `unknown`) |
| `rustfs_scanner_cycle_duration_seconds` | gauge | — | Dauer des zuletzt abgeschlossenen Scan-Zyklus |
| `rustfs_scanner_bucket_drive_duration_seconds` | histogram | `bucket`, `disk` | Zeit, um einen Bucket auf einem Laufwerk zu scannen |
| `rustfs_scanner_leader_lock_total` | counter | `state` | Ereignisse zur Übernahme der Leader-Sperre des Scanners |
| `rustfs_scanner_inline_heal_total` | counter | — | Objekte, die der Scanner direkt zur Datenwiederherstellung einreiht |
| `rustfs_scanner_cache_save_duration_seconds` | histogram | `cache` | Zeit, um den Cache der Datennutzung zu persistieren |
| `rustfs_scanner_set_scan_concurrency_limit` | gauge | — | Aktuelle Grenze der Scan-Nebenläufigkeit je Set |
| `rustfs_scanner_disk_scan_concurrency_limit` | gauge | `pool`, `set` | Aktuelle Grenze der Scan-Nebenläufigkeit je Laufwerk |

### Datenwiederherstellung

| Metrik | Typ | Labels | Bedeutung |
| --- | --- | --- | --- |
| `rustfs_heal_task_running` | gauge | `type`, `set` | Derzeit laufende Aufgaben der Datenwiederherstellung je Erasure-Set |
| `rustfs_heal_task_start_total` | counter | `type`, `set` | Gestartete Aufgaben der Datenwiederherstellung |
| `rustfs_heal_queue_delay_seconds` | histogram | `type`, `set` | Zeit, die eine Aufgabe der Datenwiederherstellung in der Warteschlange auf den Start gewartet hat |
| `rustfs_heal_admission_total` | counter | `source`, `result`, `reason`, `context` | Zulassungsentscheidungen der Datenwiederherstellung (angenommen oder abgelehnt, und warum) |
| `rustfs_heal_mainline_throttle_total` | counter | `source`, `result`, `reason` | Hintergrund-Datenwiederherstellung gedrosselt, um Vordergrundverkehr zu schützen |
| `rustfs_heal_scheduler_skip_total` | counter | `reason`, `set` | Planung der Datenwiederherstellung übersprungen (z. B. Grenze je Set erreicht) |
| `rustfs_heal_page_concurrency_current` | gauge | — | Aktuelle Nebenläufigkeit der Datenwiederherstellung auf Seitenebene |
| `rustfs_heal_candidate_enqueue_total` | counter | — | Vom Scanner eingereihte Kandidaten der Datenwiederherstellung |
| `rustfs_heal_candidate_merge_total` | counter | — | Kandidaten, die mit einem vorhandenen Warteschlangeneintrag zusammengeführt wurden |
| `rustfs_heal_candidate_drop_total` | counter | — | Verworfene Kandidaten |
| `rustfs_heal_candidate_priority_reject_total` | counter | — | Von der Prioritätsrichtlinie abgelehnte Kandidaten |
| `rustfs_heal_read_repair_dedup_total` | counter | `reason` | Deduplizierte Reparaturanforderungen des Lesepfads |

### API- und E/A-Pfad

| Metrik | Typ | Labels | Bedeutung |
| --- | --- | --- | --- |
| `rustfs_io_get_object_request_duration_seconds` | histogram | `status` | Ende-zu-Ende-Latenz von GetObject |
| `rustfs_io_get_object_stage_duration_seconds` | histogram | `path`, `stage` | GetObject-Latenz, aufgeteilt nach interner Stufe |
| `rustfs_io_get_object_response_size_bytes` | histogram | — | Antwortgrößen von GetObject |
| `rustfs_io_operation_duration_seconds` | histogram | `operation` | Dauer von E/A-Operationen |
| `rustfs_io_timeout_events_total` | counter | `operation` | E/A-Operationen, die ein Zeitlimit erreicht haben |
| `rustfs_operation_progress` | gauge | `operation` | Fortschritt lang laufender Operationen in Prozent |
| `rustfs_operation_stalled` | counter | `operation` | Als stehen geblieben erkannte Operationen |
| `rustfs_operation_completions` | counter | `operation`, `status` | Abschlüsse von Operationen nach Status |
| `rustfs_io_queue_operations` | counter | `operation`, `priority` | Einreih- und Ausreihoperationen der E/A-Warteschlange |
| `rustfs_io_queue_size` | gauge | `priority` | Aktuelle Tiefe der E/A-Warteschlange je Priorität |
| `rustfs_io_starvation_events` | counter | `priority` | Aushungerungsereignisse von E/A mit niedriger Priorität |
| `rustfs_io_bandwidth_bps` | gauge | — | Beobachtete E/A-Bandbreite (Bytes/s) |
| `rustfs_io_scheduler_decisions` | counter | — | Getroffene Entscheidungen des E/A-Schedulers |
| `rustfs_io_scheduler_load` | counter | `level` | Scheduler-Entscheidungen nach Laststufe |
| `rustfs_io_load_changes` | counter | `from`, `to` | Übergänge der E/A-Laststufe |

### Gegendruck

| Metrik | Typ | Labels | Bedeutung |
| --- | --- | --- | --- |
| `rustfs_backpressure_state_changes` | counter | `from`, `to` | Zustandsübergänge des Gegendrucks |
| `rustfs_backpressure_activations` | counter | — | Wie oft der Gegendruck gegriffen hat |
| `rustfs_backpressure_deactivations` | counter | — | Wie oft der Gegendruck gelöst wurde |
| `rustfs_backpressure_rejections` | counter | — | Wegen Gegendruck abgelehnte Anfragen |
| `rustfs_backpressure_concurrent` | gauge | — | Aktuelle gleichzeitige Anfragen, die der Begrenzer führt |

### Kapazität

| Metrik | Typ | Labels | Bedeutung |
| --- | --- | --- | --- |
| `rustfs_capacity_current_bytes` | gauge | — | Aktuell genutzte Kapazität in Bytes |
| `rustfs_capacity_update_total` | counter | `source` | Neuberechnungen der Kapazität |
| `rustfs_capacity_update_duration_seconds` | histogram | `source` | Zeit für die Neuberechnung der Kapazität |
| `rustfs_capacity_cache_hits` | counter | — | Treffer im Kapazitätscache |
| `rustfs_capacity_cache_misses` | counter | — | Fehltreffer im Kapazitätscache |
| `rustfs_capacity_cache_served_total` | counter | `state` | Aus dem Cache bediente Kapazitätsantworten, nach Frischezustand |

### Sperren

| Metrik | Typ | Labels | Bedeutung |
| --- | --- | --- | --- |
| `rustfs_lock_contentions` | counter | — | Ereignisse von Sperrkonkurrenz |
| `rustfs_lock_hold_time_secs` | histogram | — | Wie lange Sperren gehalten wurden |
| `rustfs_lock_spin_successes` / `rustfs_lock_spin_failures` | counter | — | Ergebnisse der Übernahme von Spin-Locks |
| `rustfs_lock_early_releases` | counter | — | Durch Optimierung vorzeitig freigegebene Sperren |
| `rustfs_object_lock_diag_acquire_duration_seconds` | histogram | — | Latenz der Übernahme der Objektsperre (Diagnosemodus) |
| `rustfs_object_lock_diag_hold_duration_seconds` | histogram | — | Haltedauer der Objektsperre (Diagnosemodus) |
| `rustfs_object_lock_diag_slow_acquire_total` / `rustfs_object_lock_diag_slow_hold_total` | counter | — | Langsame Übernahme oder langes Halten einer Sperre (Diagnosemodus) |

### Protokollbereinigung

| Metrik | Typ | Labels | Bedeutung |
| --- | --- | --- | --- |
| `rustfs_log_cleaner_runs_total` | counter | — | Läufe der Protokollbereinigung |
| `rustfs_log_cleaner_deleted_files_total` | counter | — | Gelöschte Protokolldateien |
| `rustfs_log_cleaner_freed_bytes_total` | counter | — | Zurückgewonnene Bytes |
| `rustfs_log_cleaner_rotation_total` / `rustfs_log_cleaner_rotation_failures_total` | counter | — | Protokollrotationen und Rotationsfehler |
| `rustfs_log_cleaner_rotation_duration_seconds` | histogram | — | Dauer der Rotation |
| `rustfs_log_cleaner_active_file_size_bytes` | gauge | — | Größe der aktiven Protokolldatei |

:::note[Weitere Metriken]

Weitere geprüfte Metriknamen existieren, deren Typ- und Label-Details hier nicht dokumentiert sind, darunter `rustfs_scanner_cache_save_attempt_total`, `rustfs_scanner_cache_save_timeout_total`, `rustfs_scanner_cache_save_retry_total`, `rustfs_scanner_excess_object_versions_total`, `rustfs_scanner_excess_object_version_size_total`, `rustfs_scanner_excess_folders_total`, `rustfs_scanner_pending_heal_prune_total`, `rustfs_scanner_pending_heal_malformed_total` sowie die Familien `rustfs_io_scheduler_*`, `rustfs_io_buffer_*` und `rustfs_timeout_dynamic_*`. Sehen Sie sie in Prometheus ein, sobald die Pipeline läuft.

:::

## Empfohlene Alarme

| Alarm | Signal | Empfohlene Regel |
| --- | --- | --- |
| Knoten länger als 2 Minuten nicht bereit | Gauge `rustfs_runtime_readiness_ready` oder eine externe Prüfung von `GET /health/ready`, die nicht 200 liefert | `rustfs_runtime_readiness_ready == 0` für `2m` |
| Neustartschleife | `rustfs_start_total` | `increase(rustfs_start_total[10m]) > 3` |
| Wachsender Rückstand der Datenwiederherstellung | `rustfs_heal_task_running` und `rustfs_heal_queue_delay_seconds` | anhaltend von null verschiedene laufende Aufgaben plus steigende Warteschlangenverzögerung für `30m` |
| Scanner steht still | `rustfs_scanner_cycles_total` | `increase(rustfs_scanner_cycles_total[24h]) == 0` |
| Schwellenwert der genutzten Clusterkapazität | `rustfs_capacity_current_bytes` | Vergleich mit Ihrer bereitgestellten Rohkapazität (eine Konstante, die Sie setzen), z. B. `rustfs_capacity_current_bytes > 0.8 * <total-bytes>` |

:::note

Die Nutzung je Laufwerk und der Online- oder Offline-Zustand eines Laufwerks erscheinen derzeit über die Console und die Admin-API (Server- und Speicherinformationen), nicht als eigene OTLP-Metriken. Für einen Alarm zum Schwellenwert je Laufwerk fragen Sie die Admin-API aus Ihrem eigenen Exporter ab oder beobachten Sie das Dashboard der Console.

:::

## Protokollerfassung

Wohin Protokolle gehen, steuert `RUSTFS_OBS_LOG_DIRECTORY`:

- **Nicht gesetzt:** Protokolle gehen nach stdout. Verwenden Sie in Containern Ihren Log-Treiber. Auf systemd-Hosts erfasst **journald** stdout und stderr, deshalb funktioniert `journalctl -u rustfs -f` ohne weitere Konfiguration.
- **Ein lokales Verzeichnis** (z. B. `/var/log/rustfs/`): RustFS schreibt dort rotierende Protokolldateien. Die Rotation stellen Sie mit `RUSTFS_OBS_LOG_FILENAME`, `RUSTFS_OBS_LOG_ROTATION_SIZE_MB`, `RUSTFS_OBS_LOG_ROTATION_TIME` und `RUSTFS_OBS_LOG_KEEP_FILES` ein.
- **Eine URL** (enthält `://`): Protokolle werden an einen entfernten Endpunkt geliefert.

Wenn `RUSTFS_OBS_ENDPOINT` gesetzt ist und der Protokollexport aktiviert ist, werden Protokolle zusätzlich über OTLP exportiert. Der Referenzstapel leitet sie zur Abfrage aus Grafana nach Loki.

```bash title="Example: file logs plus OTLP export"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ADDRESS=":9001"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"
RUSTFS_OBS_ENDPOINT=http://otel-collector:4318
```
