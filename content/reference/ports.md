---
title: "Ports and Health Endpoints"
description: "Reference for the network ports RustFS listens on, the health check endpoints it exposes, and a minimal firewall configuration example."
---

RustFS uses two listeners. Both bind addresses are configurable; the values below are the defaults.

## Port matrix

| Port | Listener | Configured by | Traffic |
| --- | --- | --- | --- |
| `9000` | S3 API | `RUSTFS_ADDRESS` / `--address` | S3 object API, admin API, and internal node-to-node RPC (paths under `/rustfs/rpc/` and `/rustfs/peer/`) — all on the same port. |
| `9001` | Console | `RUSTFS_CONSOLE_ADDRESS` / `--console-address` | Embedded web console (UI served under `/rustfs/console/`). Enabled by default; disable with `RUSTFS_CONSOLE_ENABLE=false`. |

:::note
Because internode RPC shares port 9000, every node in a multi-node cluster must be able to reach every other node on the S3 port. There is no separate cluster port to open.
:::

## Health endpoints

Health probes are served unauthenticated on the S3 listener (port 9000) and can be disabled with `RUSTFS_HEALTH_ENDPOINT_ENABLE=false`:

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Liveness probe (also accepts `HEAD`). `/health/live` is an alias. |
| `GET /health/ready` | Readiness probe; reports whether storage is initialized and ready to serve. |
| `GET /minio/health/live`, `/minio/health/ready`, `/minio/health/cluster`, `/minio/health/cluster/read` | MinIO-compatible probe aliases for existing tooling. |

The console listener (port 9001) exposes its own probe at `GET /rustfs/console/health`.

```bash title="Probe examples"
curl -fsS http://localhost:9000/health
curl -fsS http://localhost:9000/health/ready
curl -fsS http://localhost:9001/rustfs/console/health
```

## Firewall example

Open the S3 API and console ports with `firewalld`:

```bash title="firewall-cmd"
firewall-cmd --permanent --add-port=9000/tcp
firewall-cmd --permanent --add-port=9001/tcp
firewall-cmd --reload
```

:::warning
Expose port 9001 (console) only to trusted networks. If the console is not needed, set `RUSTFS_CONSOLE_ENABLE=false` and do not open the port.
:::
