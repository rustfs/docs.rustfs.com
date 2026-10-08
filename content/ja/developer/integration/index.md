---
title: "Integration"
description: "RustFS をリバースプロキシ、バックアップツール、データ分析システム、AI とクラウドネイティブプラットフォーム、オブザーバビリティプラットフォーム、コンテナレジストリ、DevOps ツールと連携させます。"
---

このセクションでは、**RustFS** を S3 互換 API 経由でインフラストラクチャとアプリケーションプラットフォームに接続します。

## Integration categories

- [Reverse Proxy](./reverse-proxy/index.md) は Nginx、Traefik、Caddy、HAProxy、Envoy を扱います。
- [Backup](./backup/index.md) は Kopia、Longhorn、Restic、Velero を扱います。
- [AI](./ai/index.md) は Ray、vLLM などの AI プラットフォームを扱います。
- [Database](./database/index.md) covers ClickHouse, Databend, Doris, DuckDB, InfluxDB, LanceDB, Milvus, Trino, and Vitess.
- [Big Data](./big-data/index.md) covers Airflow, AutoMQ, Delta Lake, DolphinScheduler, Flink, Hive, Hudi, Iceberg, Kafka, Paimon, PyIceberg, SeaTunnel, Spark, and Zeppelin.
- [Storage](./storage/index.md) covers Alluxio, lakeFS, OpenDAL, SFTPGo, s3fs, and ZeroFS.
- [クラウドネイティブ](./cloud-native/index.md) は Cortex、Flux を扱います。
- [オブザーバビリティ](./observability/index.md) は Fluentd、GreptimeDB、Loki、OpenObserve、OpenTelemetry、Tempo、Thanos、VictoriaMetrics などのテレメトリシステムを扱います。
- [その他](./others/index.md) は capo SDK、rclone、JuiceFS、Nextcloud、tusd などのツールを扱います。
- [コンテナレジストリ](./registry/index.md) は Docker Registry、Harbor を扱います。
- [DevOps](./devops/index.md) は Elasticsearch、Gitea、Jenkins、OpenSearch、Terraform を扱います。

各ガイドでは、連携先システムを設定する際に使用する RustFS のエンドポイントとアドレス指定の要件を示します。