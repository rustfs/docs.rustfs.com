---
title: "データ分析"
description: "Connect data analytics systems to RustFS through S3-compatible object storage interfaces."
---

Use **RustFS** as the object storage layer for data analytics systems that support an S3-compatible endpoint.

## Systems

- [Iceberg](./iceberg.md)
- [PyIceberg](./pyiceberg.md)
- [Milvus](./milvus.md)
- [DuckDB](./duckdb.md)
- [InfluxDB](./influxdb.md)
- [Spark](./spark.md)
- [Flink](./flink.md)
- [Trino](./trino.md)

Keep application data in a dedicated bucket and prefix, and use credentials scoped to the required bucket operations.