# Logging and Auditing (/features/logging)



Metrics and logging are crucial for system health. RustFS provides robust monitoring and observability through detailed storage performance monitoring, metrics, and logging.

## Features [#features]

### Monitoring Metrics [#monitoring-metrics]

Provides complete system monitoring and performance metrics collection.

### Logging [#logging]

Records detailed log information for every operation, supporting audit trails.

## Metrics Monitoring [#metrics-monitoring]

RustFS collects a wide range of fine-grained hardware and software metrics and exports them over OTLP (the OpenTelemetry Protocol, configured via `RUSTFS_OBS_ENDPOINT`). Deploy an OpenTelemetry Collector to forward these metrics to Prometheus, Grafana, or any OTLP-compatible backend. The upstream [`docker-compose.yml`](https://github.com/rustfs/rustfs/blob/main/docker-compose.yml) ships a ready-made observability profile with OpenTelemetry Collector, Prometheus, Grafana, and Jaeger.

RustFS also provides health check endpoints (`/health` and `/health/ready`) for probing node and cluster liveness.

## Audit Logs [#audit-logs]

Audit logging generates logs for every cluster operation. Each operation generates an audit log containing a unique ID and detailed information about the client, object, bucket, and metadata. RustFS writes audit data to configured targets such as HTTP/HTTPS webhook endpoints and Kafka (`RUSTFS_AUDIT_*` environment variables).

RustFS event notifications provide additional logging support: bucket and object events can be pushed automatically to third-party systems (for example RabbitMQ via AMQP, Kafka, or a webhook) for event-driven processing.

## Architecture [#architecture]

RustFS does not natively expose metrics via Prometheus-compatible HTTP(S) endpoints for direct scraping. To integrate with Prometheus, deploy an OpenTelemetry Collector to gather metrics from RustFS and forward them to your Prometheus backend.

<Mermaid
  chart="flowchart TD
  RUSTFS[&#x22;RustFS Object Storage&#x22;]
  OTEL[&#x22;OpenTelemetry Collector&#x22;]
  subgraph PROM[&#x22;Prometheus&#x22;]
    AM[Alertmanager]
    QA[&#x22;Query API&#x22;]
    RRW[&#x22;Remote Read/Write&#x22;]
    WH[Webhooks]
  end
  AR[&#x22;Alert Response&#x22;]
  VA[&#x22;Visualization / Analytics&#x22;]
  AB[&#x22;Archival / Backup&#x22;]
  RUSTFS -->|OTLP| OTEL
  OTEL --> PROM
  PROM --> AR
  PROM --> VA
  PROM --> AB
  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;
  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;
  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;
  class RUSTFS server
  class OTEL,AM,QA,RRW,WH svc
  class AR,VA,AB accent"
/>

RustFS event notifications automatically push bucket and object events to supported target services. Administrators can define bucket-level notification rules.

<Mermaid
  chart="flowchart LR
  subgraph Clients[&#x22;Client Applications&#x22;]
    IOT[&#x22;Internet of Things&#x22;]
    WEB[&#x22;Web Applications&#x22;]
    BK[&#x22;Backup / Archival&#x22;]
    BS[&#x22;Block Storage&#x22;]
  end
  TENANT[&#x22;RustFS Cluster&#x22;]
  subgraph Targets[&#x22;Notification Targets&#x22;]
    WH[Webhooks]
    KAFKA[Kafka]
    AMQP[AMQP]
    MQTT[MQTT]
    RED[Redis]
    NATS[NATS]
    PULSAR[Pulsar]
    MYSQL[MySQL]
    PG[PostgreSQL]
  end
  Clients <-->|S3 operations| TENANT
  TENANT -->|events| Targets
  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;
  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;
  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;
  class IOT,WEB,BK,BS server
  class TENANT svc
  class WH,KAFKA,AMQP,MQTT,RED,NATS,PULSAR,MYSQL,PG accent"
/>

## Requirements [#requirements]

### For Metrics [#for-metrics]

Deploy an OpenTelemetry Collector and point `RUSTFS_OBS_ENDPOINT` at it; visualize with Prometheus and Grafana (see the upstream observability compose profile).

### For Audit Logs [#for-audit-logs]

Configure one or more audit targets (webhook, Kafka) via `RUSTFS_AUDIT_*` environment variables.

### For Event Notifications [#for-event-notifications]

Configure bucket notification rules toward the supported targets: webhook, Kafka, AMQP, MQTT, Redis, NATS, Pulsar, MySQL, or PostgreSQL.
