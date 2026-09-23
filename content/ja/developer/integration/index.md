---
title: "Integration"
description: "RustFS をリバースプロキシ、バックアップツール、データ分析システム、AI とクラウドネイティブプラットフォーム、オブザーバビリティプラットフォーム、コンテナレジストリ、DevOps ツールと連携させます。"
---

このセクションでは、**RustFS** を S3 互換 API 経由でインフラストラクチャとアプリケーションプラットフォームに接続します。

## Integration categories

- [Reverse Proxy](./reverse-proxy/index.md) は Nginx、Traefik、Caddy、HAProxy を扱います。
- [Backup](./backup/index.md) は Kopia、Longhorn、Restic、Velero を扱います。
- [AI](./ai/index.md) は Ray などの AI プラットフォームを扱います。
- [データ分析](./big-data/index.md) は ClickHouse、Doris、Hudi、Iceberg、lakeFS、Milvus、OpenDAL、Vitess、Zeppelin などの分析システムを扱います。
- [クラウドネイティブ](./cloud-native/index.md) は Cortex、Flux を扱います。
- [オブザーバビリティ](./observability/index.md) は Fluentd、OpenObserve、OpenTelemetry、Thanos、Tempo などのテレメトリシステムを扱います。
- [その他](./others/index.md) はコミュニティ主導の Python 用 capo SDK を扱います。
- [コンテナレジストリ](./registry/index.md) は Harbor を扱います。
- [DevOps](./devops/index.md) は Elasticsearch、Gitea、Jenkins、Terraform を扱います。

各ガイドでは、連携先システムを設定する際に使用する RustFS のエンドポイントとアドレス指定の要件を示します。