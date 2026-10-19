---
title: "連携"
description: "RustFS を、リバースプロキシ、バックアップツール、データベース、ビッグデータとストレージのシステム、AI とクラウドネイティブのプラットフォーム、オブザーバビリティプラットフォーム、コンテナレジストリ、DevOps ツールと連携させます。"
---

このセクションでは、**RustFS** を S3 互換 API 経由でインフラストラクチャとアプリケーションのプラットフォームに接続します。

## 連携のカテゴリ

- [リバースプロキシ](./reverse-proxy/index.md) は Nginx、Traefik、Caddy、HAProxy、Envoy を扱います。
- [バックアップ](./backup/index.md) は Kopia、Longhorn、Restic、Velero を扱います。
- [AI](./ai/index.md) は MLflow、Ray、vLLM などの AI プラットフォームを扱います。
- [データベース](./database/index.md) は ClickHouse、Databend、Doris、DuckDB、InfluxDB、LanceDB、Milvus、Trino、Vitess を扱います。
- [ビッグデータ](./big-data/index.md) は Airflow、AutoMQ、Delta Lake、DolphinScheduler、Flink、Hive、Hudi、Iceberg、Kafka、Paimon、PyIceberg、SeaTunnel、Spark、Zeppelin を扱います。
- [ストレージ](./storage/index.md) は Alluxio、lakeFS、OpenDAL、SFTPGo、s3fs、ZeroFS を扱います。
- [クラウドネイティブ](./cloud-native/index.md) は Cortex、Flux、celld を扱います。
- [オブザーバビリティ](./observability/index.md) は Fluentd、GreptimeDB、Loki、OpenObserve、OpenTelemetry、Tempo、Thanos、VictoriaMetrics などのテレメトリシステムを扱います。
- [その他](./others/index.md) は capo SDK、rclone、JuiceFS、Nextcloud、tusd を扱います。
- [コンテナレジストリ](./registry/index.md) は Docker Registry と Harbor を扱います。
- [DevOps](./devops/index.md) は Elasticsearch、Gitea、Jenkins、OpenSearch、Terraform を扱います。

各ガイドでは、連携先のシステムを設定するときに使う RustFS のエンドポイントとアドレス指定の要件を示します。
