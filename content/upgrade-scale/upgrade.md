---
title: "Upgrade"
description: "Zero-downtime rolling upgrade runbook for multi-node RustFS clusters: pre-checks, node-by-node procedure, degraded-startup semantics, rollback, and verification."
---

This runbook describes how to upgrade the RustFS binary (or container image) on a multi-node, erasure-coded cluster without losing availability, and how to read the degraded-mode signals if several nodes end up down at once.

:::note[Upgrades never change the on-disk format]

Upgrading the binary or container image never changes the on-disk data format. Replacing the executable and restarting is safe; no migration step runs on startup.

:::

## When a rolling restart applies

A **rolling restart** — restarting one node at a time while the rest keep serving — covers:

- Binary or container image upgrades
- Changes to environment variables or startup parameters on individual nodes (edits to `/etc/default/rustfs`)

It does **not** cover topology changes. Changing `RUSTFS_VOLUMES` — for example, adding a Server Pool — must be applied to **every** node's configuration, and all nodes must be restarted so the whole cluster agrees on the new layout; expect a short interruption while the cluster converges. See [Availability and Scalability](./availability-and-resiliency.md) for the pool expansion workflow.

## Why one node at a time

Erasure coding shards every object — including internal metadata such as IAM users, groups, and policies under `.rustfs.sys` — across the drives of a set. Reading data back needs a read quorum of shards online. While one node is down, the rest of the cluster keeps quorum and serves all traffic. If you take a second node down before the first is back, some erasure sets may lose write or even read quorum and requests start failing — this is the situation to avoid.

## Pre-checks

Before touching the first node:

1. **Confirm the cluster is fully healthy.** Every node should return `200`:

   ```bash
   curl -fsS http://<node>:9000/health/ready
   ```

   Do not start a rolling upgrade on a cluster that already has offline nodes or degraded erasure sets.

2. **Back up each node's configuration** (generic precaution — it holds credentials and the volume layout):

   ```bash
   sudo cp /etc/default/rustfs /etc/default/rustfs.bak-$(date +%F)
   ```

3. **Keep the currently running binary** so rollback is a file copy, not a download:

   ```bash
   sudo cp /usr/local/bin/rustfs /usr/local/bin/rustfs.previous
   ```

4. **Read the release notes** of the target version for any version-specific guidance.

## Rolling upgrade procedure

For each node, in any order, **one at a time**:

### 1. Replace the binary

```bash
# stage the new binary, then swap it in
sudo systemctl stop rustfs
sudo cp rustfs-new /usr/local/bin/rustfs
sudo chmod +x /usr/local/bin/rustfs
```

(For container deployments, update the image tag on this node instead.)

### 2. Restart the node

```bash
sudo systemctl start rustfs
```

The bundled systemd unit uses `Type=notify` with `TimeoutStartSec=120s`: systemd waits for the server's readiness notification, and the timeout is sized to cover initialization plus readiness checks on slower disks or cold starts. Do not shorten it.

### 3. Wait until the node reports ready

```bash
curl -fsS http://<node>:9000/health/ready
```

A ready node returns `200` with `"ready": true` in the JSON body. Only then move on to the next node.

### 4. Repeat for the remaining nodes

Same steps, next node — never two in parallel.

## If a node comes up degraded

Nodes started before the cluster has quorum (relevant when several nodes are down at once, e.g. after a power loss) come up in **degraded mode** — the process stays alive and recovers automatically:

- S3 requests receive `503 Service Unavailable` with a `Retry-After: 5` header, an `x-rustfs-readiness-pending` header, and a body naming the blocking dependency: `storage_quorum` (waiting for the erasure read quorum), `iam` (storage is up, IAM cache still loading), or `startup_finalization` (last startup steps being published).
- The IAM recovery loop retries with backoff and logs `event="iam_bootstrap_retry_failed"` with an actionable `hint` field. After repeated failures the log level escalates from WARN to ERROR — this still does not kill the process.
- As soon as enough peers are online, pending nodes finish IAM bootstrap on the next retry and flip `/health/ready` to `200` on their own.

:::warning[Do not restart-loop degraded nodes]

Recovery is automatic; restarting a degraded node does not speed anything up. Just keep starting the remaining nodes and wait.

:::

While waiting, `/health/ready` returns per-dependency detail:

```bash
curl -s http://<node>:9000/health/ready | jq
```

The `details` object shows `storage` / `iam` / `lock` readiness, and `degradedReasons` lists machine-readable causes such as `storage_quorum_unavailable` or `lock_quorum_unavailable`.

`RUSTFS_STARTUP_READINESS_MAX_WAIT_SECS` (default `120`) controls how long startup waits for full readiness before continuing in degraded mode with background recovery; recovery retries continue regardless of this limit.

## Rollback

Because no migration runs on startup, rollback is the same rolling procedure in reverse — one node at a time, with the previous binary:

```bash
sudo systemctl stop rustfs
sudo cp /usr/local/bin/rustfs.previous /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node>:9000/health/ready   # wait for 200 before the next node
```

If you also changed `/etc/default/rustfs`, restore the backup taken during pre-checks before restarting.

## Verification

After the last node is back:

1. **All nodes ready:** `curl -fsS http://<node>:9000/health/ready` returns `200` on every node.
2. **Console check:** open the Console (`http://<node>:9001`), confirm every server is listed online and shows the new version.
3. **Functional smoke test** with any S3 client, e.g. `mc`:

   ```bash
   mc alias set rustfs http://<node>:9000 <your-access-key> <your-secret-key>
   mc mb rustfs/upgrade-smoke-test
   mc cp ./somefile rustfs/upgrade-smoke-test/
   mc cat rustfs/upgrade-smoke-test/somefile > /dev/null && echo OK
   mc rb --force rustfs/upgrade-smoke-test
   ```

## What is not normal

- A node process **exiting** with a fatal IAM/lock error during startup — that fatal path was removed after `v1.0.0-beta.5`; upgrade if you still see it.
- A node stuck degraded **after** the whole cluster is back: check network reachability between nodes (peer RPC ports) and per-node clocks, then inspect `degradedReasons` and the `hint` field of the IAM retry logs.

## Related

- [Availability and Scalability](./availability-and-resiliency.md) — adding Server Pools
- [Multiple Node Multiple Disk](../installation/linux/multiple-node-multiple-disk.md) — cluster deployment layout
- [Node troubleshooting](../troubleshooting/node.md) — diagnosing offline nodes
