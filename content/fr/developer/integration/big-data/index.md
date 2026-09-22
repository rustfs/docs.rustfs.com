---
title: "Analyse de données"
description: "Connect data analytics systems to RustFS through S3-compatible object storage interfaces."
---

Use **RustFS** as the object storage layer for data analytics systems that support an S3-compatible endpoint.

## Systems

- [ClickHouse](./clickhouse.md)
- [Hudi](./hudi.md)
- [Iceberg](./iceberg.md)
- [PyIceberg](./pyiceberg.md)
- [Milvus](./milvus.md)
- [MLflow](./mlflow.md)
- [OpenDAL](./opendal.md)
- [DuckDB](./duckdb.md)
- [Doris](./doris.md)
- [lakeFS](./lakefs.md)
- [InfluxDB](./influxdb.md)
- [Spark](./spark.md)
- [Flink](./flink.md)
- [Trino](./trino.md)

Keep application data in a dedicated bucket and prefix, and use credentials scoped to the required bucket operations.