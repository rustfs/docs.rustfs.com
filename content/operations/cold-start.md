---
title: "Cold Start and Quorum Loss"
description: "This article explains how RustFS nodes behave when they start before the cluster has quorum, how to read the degraded-mode signals, and how to diagnose the most common startup failures."
---

## Degraded Startup in One Paragraph

When several nodes of an erasure-coded cluster went down together (power loss, host maintenance, a crash-looping rollout) and come back one at a time, the early nodes cannot reach the storage read quorum. They do **not** exit. The process stays alive in **degraded mode**, answers S3 requests with `503`, and recovers **automatically** as soon as enough peers are online. Do not restart-loop degraded nodes — just keep starting the remaining ones.

## Why One Node Cannot Serve Alone

Erasure coding shards every object — including internal metadata such as IAM users and policies under `.rustfs.sys` — across the drives of a set. Reading anything back requires a read quorum of shards. With a set's drives spread over several nodes, a single node can never satisfy that quorum by itself; the cluster becomes readable once roughly half the nodes of a set are up (internal configuration objects are written with maximum parity). Distributed locking similarly needs a majority of nodes' lock RPC endpoints.

## The 503 Contract

While a node is not yet ready, S3 requests receive:

- status `503 Service Unavailable`;
- header `Retry-After: 5` — clients should retry, the condition is temporary;
- header `x-rustfs-readiness-pending` naming the blocking dependency:
  - `storage_quorum` — waiting for enough nodes/disks for the erasure read quorum;
  - `iam` — storage is up, the IAM cache is still loading;
  - `startup_finalization` — the last startup steps are being published.

Probe the readiness endpoint for per-dependency detail:

```bash
curl -s http://<node>:9000/health/ready | jq
```

A degraded response includes a `details` object (`storage` / `iam` / `lock`, plus `kms` when configured) and a `degradedReasons` array. Verified reason values:

| `degradedReasons` value | Meaning |
| --- | --- |
| `storage_quorum_unavailable` | Erasure read quorum not met |
| `iam_not_ready` | IAM cache still loading |
| `lock_quorum_unavailable` | Lock RPC majority not reachable (cluster probes only) |
| `kms_not_ready` | Configured KMS not reachable |
| `peer_health_unavailable` | Peer health check failing |
| `cluster_health_timeout` | Cluster health evaluation timed out |
| `storage_and_iam_unavailable`, `storage_and_lock_unavailable`, `iam_and_lock_unavailable`, `storage_iam_and_lock_unavailable` | Combined variants of the above |

`GET /health` and `GET /health/live` stay `200` throughout — the process is alive, only readiness is pending. Point Kubernetes liveness probes at `/health` and readiness probes at `/health/ready`, or a degraded-but-recovering node will be killed mid-recovery.

## Why You Should Not Restart-Loop

1. **Recovery is automatic.** As soon as enough peers are online, pending nodes finish IAM bootstrap on the next retry and flip `/health/ready` to `200` on their own. Restarting does not speed this up — it throws away retry progress.
2. **Logs tell you what is missing.** The IAM recovery loop logs `event="iam_bootstrap_retry_failed"` with an actionable `hint` field (for example, "storage read quorum not met yet; waiting for enough cluster nodes/disks to come online"). After repeated failures the level escalates from WARN to ERROR — this still does not kill the process.
3. **A node process exiting during startup is a bug, not the design.** The fatal IAM/lock startup path was removed after v1.0.0-beta.5; upgrade if you still see nodes exit while waiting for quorum.

## Tuning

- `RUSTFS_STARTUP_READINESS_MAX_WAIT_SECS` (default `120`): how long startup waits for full readiness before continuing in degraded mode with background recovery. Raising it delays the listener during genuinely slow starts; lowering it surfaces degraded mode sooner. Recovery retries continue regardless of this limit.

## Recommended Cold-Start Procedure

1. Start all nodes (order does not matter). Early nodes sit in degraded mode.
2. Watch readiness converge:

   ```bash
   for n in node1 node2 node3 node4; do
     echo -n "$n: "; curl -s http://$n:9000/health/ready | jq -r '.status'
   done
   ```

3. Once every node reports `ok`, the cluster is fully serving. If a node is still degraded **after** all peers are up, check network reachability between nodes (peer RPC ports), compare per-node clocks, then read `degradedReasons` and the `hint` field of the IAM retry logs.

## Common Startup Failures

These fail fast at container start (checks performed by the image entrypoint) or during listener setup, before any degraded-mode logic applies:

| Symptom | Cause | Fix |
| --- | --- | --- |
| `ERROR: RUSTFS_ACCESS_KEY must not be empty.` | Credential env var set to an empty string (often an unexpanded compose interpolation like `${VAR}`) | Set a real value or remove the variable |
| `ERROR: Set either RUSTFS_ACCESS_KEY or RUSTFS_ACCESS_KEY_FILE, not both.` | Both direct and file-based credential sources configured | Keep exactly one source |
| `ERROR: RUSTFS_ACCESS_KEY_FILE points to an unreadable file.` | Secret file missing or wrong permissions | Mount the secret and check file modes |
| `WARNING: ... uses the default rustfsadmin credential.` | Running with default credentials | Not fatal, but set real credentials before exposing the listener — see [Credential Management](./credentials) |
| Startup aborts with `VolumeNotFound` | The local path component of a distributed volume URL does not exist on disk — RustFS does not auto-create disk roots | Create the data directories (the container entrypoint creates local paths listed in `RUSTFS_VOLUMES`, but verify host mounts) |
| `HTTP listener bind failed` in logs | Port 9000 (or 9001 for the console) already in use, or address unavailable | Free the port or change `RUSTFS_ADDRESS` / `RUSTFS_CONSOLE_ADDRESS` |

:::note
Keep node clocks synchronized (NTP/chrony). S3 request signing is time-sensitive, and the rolling-restart runbook explicitly lists per-node clock drift as a cause of nodes staying degraded after the cluster is otherwise back.
:::

## Related

- Rolling restarts without downtime (restart one node at a time, wait for `/health/ready` = `200` before the next) follow the same readiness signals — see the availability documentation in [Availability and Resiliency](../upgrade-scale/availability-and-resiliency).
- [Monitoring and Alerting](./monitoring) shows how to alert on `rustfs_runtime_readiness_ready` so a stuck-degraded node pages you.
