---
title: "ビッグデータ"
description: "S3 互換のオブジェクトストレージインターフェースを経由して、ビッグデータシステムを RustFS に接続します。"
---

S3 互換エンドポイントをサポートするデータ分析システムのオブジェクトストレージ層として **RustFS** を使用します。

## システム

- [Airflow](./airflow.md)
- [Delta Lake](./delta-lake.md)
- [Flink](./flink.md)
- [Hudi](./hudi.md)
- [Iceberg](./iceberg.md)
- [Kafka](./kafka.md)
- [PyIceberg](./pyiceberg.md)
- [Spark](./spark.md)
- [SeaTunnel](./seatunnel.md)
- [AutoMQ](./automq.md)
- [Paimon](./paimon.md)
- [DolphinScheduler](./dolphinscheduler.md)
- [Hive](./hive.md)
- [Zeppelin](./zeppelin.md)

ビッグデータのワークロードデータは専用のバケットとプレフィックスにまとめ、必要なバケット操作だけに絞った認証情報を使用します。
