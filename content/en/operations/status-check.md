---
title: "Status Check"
description: "Check RustFS network access, health endpoints, cluster status, and storage capacity."
---

Use network probes, the **Status** page in the RustFS Console, or the `rc` command line to review RustFS availability and storage consumption. Before using the command-line workflow, [install `rc`](/operations/rc) and configure an alias for the target cluster.

## Network ports

RustFS uses two listeners by default. You can change both bind addresses through environment variables or command-line flags.

| Port | Listener | Configured by | Traffic |
| --- | --- | --- | --- |
| `9000` | S3 API | `RUSTFS_ADDRESS` / `--address` | S3 object API, admin API, and internal node-to-node RPC under `/rustfs/rpc/` and `/rustfs/peer/` |
| `9001` | Console | `RUSTFS_CONSOLE_ADDRESS` / `--console-address` | Embedded web console under `/rustfs/console/`; disable it with `RUSTFS_CONSOLE_ENABLE=false` |

:::note[Internode connectivity]

Internode RPC shares port 9000. In a multi-node cluster, every node must be able to reach every other node on the S3 port; there is no separate cluster port.

:::

Open the default ports with `firewalld` when clients need to reach both listeners:

```bash title="firewall-cmd"
firewall-cmd --permanent --add-port=9000/tcp
firewall-cmd --permanent --add-port=9001/tcp
firewall-cmd --reload
```

:::warning[Restrict console access]

Expose port 9001 only to trusted networks. If you do not need the console, set `RUSTFS_CONSOLE_ENABLE=false` and leave the port closed.

:::

## Health endpoints

The S3 listener on port **9000** serves unauthenticated probe endpoints. Disable them with `RUSTFS_HEALTH_ENDPOINT_ENABLE=false`. The console on port **9001** has its own health path.

| Endpoint | Port | Meaning |
| --- | --- | --- |
| `GET /health`, `HEAD /health`, `GET /health/live`, `GET /minio/health/live` | 9000 | Liveness — returns `200` as long as the process is up |
| `GET /health/ready` | 9000 | Readiness — `200` only when storage, IAM, and peer health are ready; `503` otherwise |
| `GET /minio/health/ready` | 9000 | MinIO-compatible alias of the readiness probe |
| `GET /minio/health/cluster`, `GET /minio/health/cluster/read` | 9000 | Cluster write/read health (additionally require lock quorum) |
| `GET /rustfs/console/health` | 9001 | Console process health |

A ready node answers `200` with `"ready": true`. A degraded node answers `503` with per-dependency detail:

```bash title="Probe examples"
curl -fsS http://localhost:9000/health
curl -s http://<node>:9000/health/ready | jq
curl -fsS http://localhost:9001/rustfs/console/health
```

The `details` object reports `storage` / `iam` / `lock` (and `kms` when configured), and `degradedReasons` lists machine-readable causes such as `storage_quorum_unavailable`, `iam_not_ready`, or `lock_quorum_unavailable`.

## Cluster status

### Check cluster status in the Console

1. Sign in to the RustFS Console.
2. Open **Status**.
3. Confirm that the cluster is online and review the server, network, and drive status.
4. Investigate any offline server, unavailable drive, or failed network connection before maintenance or capacity changes.

### Check cluster status with rc

Run the cluster information command with your configured alias:

```bash
rc admin info cluster rustfs
```

The overview reports the cluster state, RustFS version, server and disk counts, backend type, and erasure-coding parity. The node list shows uptime, network connectivity, drive availability, and pool membership. The disk list shows each drive's state and pool, set, and disk location.

For machine-readable output, request JSON:

```bash
rc admin info cluster rustfs --json
```

## Storage capacity

### Check storage capacity in the Console

1. Sign in to the RustFS Console and open **Status**.
2. Review the cluster's used and total storage capacity.
3. Review the capacity and available space for each disk.
4. Compare usage over time and plan expansion before available capacity becomes insufficient for normal writes and maintenance.

### Check storage capacity with rc

Use the same cluster information command:

```bash
rc admin info cluster rustfs
```

The **Storage** summary reports used capacity, total capacity, and the used percentage for the cluster. Each entry under **Disks** reports used, total, and available capacity for that drive.

Use JSON output when collecting the values in a script or monitoring integration:

```bash
rc admin info cluster rustfs --json
```

Administrative information commands require credentials with the corresponding RustFS Admin API permissions.

## Next steps

For continuous telemetry and alerting, continue with [Observability](./observability.md). To add storage, review [Pool Expansion](./scaling/storage-pool-expansion.md).
