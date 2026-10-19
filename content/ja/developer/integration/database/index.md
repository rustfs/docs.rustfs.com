---
title: "データベース"
description: "S3 互換のオブジェクトストレージインターフェースを経由して、データベースを RustFS に接続します。"
---

S3 互換エンドポイントをサポートするデータベースのオブジェクトストレージ層として **RustFS** を使用します。

## データベース

- [ClickHouse](./clickhouse.md)
- [Doris](./doris.md)
- [DuckDB](./duckdb.md)
- [InfluxDB](./influxdb.md)
- [LanceDB](./lancedb.md)
- [Milvus](./milvus.md)
- [Trino](./trino.md)
- [Databend](./databend.md)
- [Vitess](./vitess.md)

データベースのデータとバックアップは専用のバケットとプレフィックスにまとめ、必要なバケット操作だけに絞った認証情報を使用します。
