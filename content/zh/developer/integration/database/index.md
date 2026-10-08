---
title: "数据库"
description: "将 RustFS 用作支持 S3 兼容端点的数据库的对象存储层。"
---

将 **RustFS** 用作支持 S3 兼容端点的数据库的对象存储层。

## 数据库

- [ClickHouse](./clickhouse.md)
- [Doris](./doris.md)
- [DuckDB](./duckdb.md)
- [InfluxDB](./influxdb.md)
- [LanceDB](./lancedb.md)
- [Milvus](./milvus.md)
- [Trino](./trino.md)
- [Databend](./databend.md)
- [Vitess](./vitess.md)

请将数据库数据与备份保存在专用的桶和前缀下，并为凭证仅授予所需桶操作的权限。
