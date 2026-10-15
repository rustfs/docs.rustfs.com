---
title: "Container"
description: "Run the official RustFS container image with Docker or Podman."
---

RustFS is a high-performance, S3-compatible open-source distributed object storage system. In single-node single-disk (SNSD) deployment mode, the backend uses zero erasure coding without additional data redundancy, which makes it suitable for local testing and small-scale scenarios. The official RustFS image packages the RustFS binary and its runtime environment into a container, so you can start a service with a single command and persistent storage.

The container runs as non-root user `rustfs` with id `10001`, so a bind-mounted host directory must be owned by `10001` to avoid permission denied errors.

## Container runtimes

- [Docker](./docker.md): run a single-node instance with persistent storage, then extend it with Docker Compose, TLS, and multi-node networking.
- [Podman](./podman.md): run the same image in a daemonless workflow.

:::note[Directory permissions]

If you mount a host directory into the container with `-v`, make sure the owner of the host directory is `10001`:

```bash
chown -R 10001:10001 /path/to/host_directory
```

:::

For Kubernetes deployments, see the [Helm chart](/installation/cloud-native/helm-chart) or the [Operator](/installation/cloud-native/operator) instead.
