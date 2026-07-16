---
title: "Pool Decommission and Rebalance"
description: "This article describes how to retire a server pool with the decommission workflow and how to spread existing data onto new pools with rebalance, including the admin API endpoints, progress monitoring, and abort semantics."
---

## Concepts

A RustFS cluster grows by adding **server pools** — additional groups of nodes/drives listed in `RUSTFS_VOLUMES` (space-separated expansion expressions). Two data-movement operations manage pools over their lifecycle:

- **Decommission** drains all objects off a pool onto the remaining active pools, so the pool can be removed from the deployment. Movement is one-directional and the pool is retired afterwards.
- **Rebalance** redistributes existing objects across **all** pools after an expansion, so a newly added (empty) pool takes its fair share. No pool is removed.

The two are mutually exclusive: rebalance refuses to start while a decommission is in progress, and both require a multi-pool deployment (single-pool clusters reject either operation because there is nowhere to move data).

## When to Decommission

- Retiring old hardware after adding a replacement pool.
- Shrinking a cluster that was previously expanded.
- Consolidating small pools into a larger one.

## Prerequisites

1. **At least one active pool must remain.** You cannot decommission every pool; the request is rejected if no active pool would be left.
2. **Remaining pools need capacity.** The server verifies before starting that the free space on the remaining active pools is at least the used bytes of the pool(s) being drained **plus a 30% overhead**. Otherwise the start request fails with `insufficient target pool capacity`.
3. **Completed pools cannot be re-decommissioned.** Completion means the pool should now be removed from the deployment configuration (`RUSTFS_VOLUMES` / Helm pool list). Failed or canceled pools may be retried.
4. Healthy cluster: run decommission with all nodes up; the operation persists its state and resumes after restarts, but starting it on a degraded cluster adds risk.

:::warning
Decommission moves data. Take a fresh backup or verify your replication targets before draining a pool, and schedule it in a low-traffic window.
:::

## Admin API Endpoints

The admin API is served on port 9000 under the `/rustfs/admin/v3` prefix (a MinIO-compatible `/minio/admin` prefix also exists). All requests must be signed (AWS Signature V4) with credentials that hold the decommission admin permission — the root credential works. The `pool` query parameter takes the pool's command-line expression exactly as configured, or a zero-based pool index with `by-id=true`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/rustfs/admin/v3/pools/list` | List pools and their status |
| `GET` | `/rustfs/admin/v3/pools/status?pool=<pool>` | Status of one pool |
| `GET` | `/rustfs/admin/v3/decommission/status[?pool=<pool>]` | Decommission progress (all pools or one) |
| `POST` | `/rustfs/admin/v3/pools/decommission?pool=<pool>` | Start draining a pool (comma-separated multi-pool targets are queued) |
| `POST` | `/rustfs/admin/v3/pools/cancel?pool=<pool>` | Cancel a running decommission |
| `POST` | `/rustfs/admin/v3/pools/clear?pool=<pool>` | Clear failed/canceled decommission metadata |

Example with `curl` (SigV4 signing via `--aws-sigv4`):

```bash
# Start decommissioning pool 0 (by index)
curl -X POST \
  --aws-sigv4 "aws:amz:us-east-1:s3" \
  --user "<your-access-key>:<your-secret-key>" \
  "http://<node>:9000/rustfs/admin/v3/pools/decommission?pool=0&by-id=true"

# Or address the pool by its volumes expression
curl -X POST \
  --aws-sigv4 "aws:amz:us-east-1:s3" \
  --user "<your-access-key>:<your-secret-key>" \
  "http://<node>:9000/rustfs/admin/v3/pools/decommission?pool=http://server{1...4}/disk{1...4}"
```

The request can be sent to any node; if the target pool's leader is a different node, RustFS forwards the operation over the authenticated internode RPC channel.

The upstream Helm chart documents the same workflow through an admin CLI as `rc admin pool ls` / `rc admin decommission` / `rc admin rebalance start <alias>`.

:::note
The `rc` admin CLI is referenced by the upstream Helm README but may not be generally available in your distribution yet. The HTTP admin API above and the RustFS console are the verified interfaces; treat `rc admin ...` commands as equivalent shorthand where the tool is available.
:::

## Monitoring Progress

Poll the decommission status endpoint:

```bash
curl -s \
  --aws-sigv4 "aws:amz:us-east-1:s3" \
  --user "<your-access-key>:<your-secret-key>" \
  "http://<node>:9000/rustfs/admin/v3/decommission/status" | jq
```

Each pool entry reports a `decommissionInfo` object with (field names as serialized):

- `startTime`, `startSize`, `totalSize`, `currentSize`
- `complete`, `failed`, `canceled`
- `objectsDecommissioned`, `objectsDecommissionedFailed`
- `bytesDecommissioned`, `bytesDecommissionedFailed`

The operation is finished when `complete` is `true` and the failed counters are zero. Only one pool actively moves data at a time; additional targets in a multi-pool request wait in a queue.

After completion, remove the drained pool from `RUSTFS_VOLUMES` (or the Helm `pools` list — entries there are append-only, so decommission **before** removing an entry) and restart the cluster with the new topology.

## Cancel, Clear, and Rollback Semantics

- **Cancel** (`POST /rustfs/admin/v3/pools/cancel?pool=<pool>`) stops the running drain. The pool is marked `canceled` and stops receiving decommission traffic; a canceled (or failed) pool can be decommissioned again later.
- **Clear** (`POST /rustfs/admin/v3/pools/clear?pool=<pool>`) removes failed/canceled decommission metadata only, so status output is clean again.
- **There is no data rollback.** Objects already moved to other pools stay where they are; cancel/clear never move data back. This is by design — a partially drained pool is still fully functional, just emptier.

## Rebalance After Expansion

After adding a pool, existing objects stay where they were written; only new writes prefer the pool with more free space. To actively spread existing data:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/rustfs/admin/v3/rebalance/start` | Start a cluster-wide rebalance (no query parameters; returns `{"id": ...}`) |
| `GET` | `/rustfs/admin/v3/rebalance/status` | Per-pool progress: `objects`, `versions`, `bytes`, `remainingBuckets`, current `bucket`/`object`, `elapsed`, `eta` |
| `POST` | `/rustfs/admin/v3/rebalance/stop` | Stop the rebalance |

```bash
curl -X POST \
  --aws-sigv4 "aws:amz:us-east-1:s3" \
  --user "<your-access-key>:<your-secret-key>" \
  "http://<node>:9000/rustfs/admin/v3/rebalance/start"
```

Rules enforced by the server:

- rejected on single-pool deployments;
- rejected while a decommission is in progress (`cannot start rebalance while decommission is in progress`);
- rejected when a rebalance is already running (`rebalance is already in progress`).

Rebalance runs until pools converge toward equal usage ratios; you can stop it at any time — like decommission, stopping never undoes moves already made.

## Local Test Rig

The upstream repository ships `docker-compose.decommission.yml`, a single-container two-pool layout useful for rehearsing the workflow before touching production:

```bash
# Two pools inside one container: /data/pool0/disk{1...4} and /data/pool1/disk{1...4}
# S3 on host port 9100, console on 9101
docker compose -f docker-compose.decommission.yml up -d
```
