---
title: "集成"
description: "将 RustFS 与反向代理、备份工具、数据库、大数据与存储系统、AI 与云原生平台、可观测性平台、容器镜像仓库和 DevOps 工具集成。"
---

通过 S3 兼容 API 将 **RustFS** 连接到基础设施和应用平台。

## 集成类别

- [反向代理](./reverse-proxy/index.md)涵盖 Nginx、Traefik、Caddy、HAProxy 和 Envoy。
- [备份](./backup/index.md)涵盖 Kopia、Longhorn、Restic 和 Velero。
- [AI](./ai/index.md)涵盖 MLflow、Ray、vLLM 等 AI 平台。
- [数据库](./database/index.md)涵盖 ClickHouse、Databend、Doris、DuckDB、InfluxDB、LanceDB、Milvus、Trino 和 Vitess 等数据库。
- [大数据](./big-data/index.md)涵盖 Airflow、AutoMQ、Delta Lake、DolphinScheduler、Flink、Hive、Hudi、Iceberg、Kafka、Paimon、PyIceberg、SeaTunnel、Spark 和 Zeppelin 等大数据系统。
- [存储](./storage/index.md)涵盖 Alluxio、lakeFS、OpenDAL、SFTPGo、s3fs 和 ZeroFS 等存储系统。
- [云原生](./cloud-native/index.md)涵盖 Cortex 与 Flux。
- [可观测性](./observability/index.md)涵盖 Fluentd、GreptimeDB、Loki、OpenObserve、OpenTelemetry、Tempo、Thanos 和 VictoriaMetrics 等遥测系统。
- [其他](./others/index.md)涵盖 capo SDK、rclone、JuiceFS、Nextcloud 和 tusd 等工具。
- [镜像仓库](./registry/index.md)涵盖 Docker Registry 和 Harbor。
- [DevOps](./devops/index.md)涵盖 Elasticsearch、Gitea、Jenkins、OpenSearch 和 Terraform。

每篇指南都会说明配置集成系统时需要使用的 RustFS 端点和寻址要求。