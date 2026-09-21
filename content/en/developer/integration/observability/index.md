---
title: "Observability"
description: "Connect observability platforms to RustFS through S3-compatible object storage interfaces."
---

Use **RustFS** as the object storage layer for observability platforms that support an S3-compatible endpoint.

## Platforms

- [Fluentd](./fluentd.md)
- [OpenObserve](./openobserve.md)
- [OpenTelemetry](./opentelemetry.md)
- [Loki](./loki.md)
- [Tempo](./tempo.md)
- [Thanos](./thanos.md)

Keep telemetry data in a dedicated bucket, and use credentials scoped to the required bucket operations.
