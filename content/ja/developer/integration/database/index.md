---
title: "Database"
description: "Connect databases to RustFS through S3-compatible object storage interfaces."
---

Use **RustFS** as the object storage layer for databases that support an S3-compatible endpoint.

## Databases

- [ClickHouse](./clickhouse.md)
- [Doris](./doris.md)
- [DuckDB](./duckdb.md)
- [InfluxDB](./influxdb.md)
- [LanceDB](./lancedb.md)
- [Milvus](./milvus.md)
- [Trino](./trino.md)
- [Databend](./databend.md)
- [Vitess](./vitess.md)

Keep database data and backups in a dedicated bucket and prefix, and use credentials scoped to the required bucket operations.
