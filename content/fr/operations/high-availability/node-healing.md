---
title: "Node Healing"
description: "Recover failed RustFS nodes and disks, monitor automatic healing, and run bounded manual heal tasks with rc."
---

RustFS healing reconstructs missing or inconsistent erasure-coded data from the healthy shards that remain in a storage set. Use this workflow after restoring an unavailable node, replacing a failed disk, or investigating scanner and heal alerts.

Healing is a cluster storage operation. It is different from [site replication](/operations/high-availability/site-replication), which copies data and identity configuration between independent RustFS deployments.

:::warning[Healing is not a backup]

RustFS can reconstruct data only while enough healthy shards remain in the affected erasure set. Healing cannot recover an object after failures exceed the set's available redundancy, and it does not protect against intentional deletion or application-level corruption. Maintain independent backups or replication according to your recovery requirements.

:::

## How healing works

RustFS coordinates several healing sources through the cluster heal queue:

- `autoHeal`: The automatic disk scanner detects disks that are unformatted or have returned after an outage and queues erasure-set healing.
- `scanner`: The background data scanner can queue object and bucket healing when it finds inconsistent storage state.
- `readRepair`: Read-repair paths can submit work discovered while serving requests.
- `internal`: Internal recovery paths can submit system-initiated work.
- `admin`: Administrators can submit a recursive, bucket, or prefix heal with `rc admin heal start`.

Automatic disk healing runs at low priority. The `healOperations` status object uses these source names to separate queued, active, and retrying work.

:::note[Reconstruction consumes cluster resources]

Healing reads healthy shards and writes reconstructed data. Deep scans add read and checksum work. Monitor client latency, disk utilization, available capacity, and the heal queue while recovery is active.

:::

## Requirements

Before recovering a node or disk, prepare:

- A RustFS deployment that still has enough healthy shards to reconstruct the affected data.
- Stable node addresses and the original configured storage mount paths.
- Replacement storage with capacity appropriate for the affected erasure set.
- The RustFS [`rc`](/operations/rc) client on a secured administration host.
- Administrative credentials that permit cluster information, scanner, and heal operations.
- A maintenance window when replacing hardware or running a deep recursive scan.

Record the failed node, pool, set, disk endpoint, mount path, and file-system UUID before changing hardware. Do not remove additional disks from the same erasure set while recovery is incomplete.

## 1. Identify the failed component

Configure an `rc` alias if you do not already have one:

```bash
rc alias set rustfs https://rustfs.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

Check cluster readiness, topology, storage health, and heal activity:

```bash
rc ready rustfs
rc admin info cluster rustfs
rc admin info storage rustfs
rc admin scanner status rustfs
rc admin heal status rustfs
```

Readiness can fail while the cluster is degraded. Use the administrative information commands to identify which node or disk is unavailable and note its pool and erasure-set location.

For machine-readable output, request JSON:

```bash
rc --json admin info storage rustfs
rc --json admin heal status rustfs
```

The aggregate heal status reports runtime state, queued and active tasks, retrying work, request sources, priorities, and available progress counters. A zero-length queue does not prove that an offline disk has been replaced or that every object is recoverable; correlate it with storage topology and readiness.

## 2. Restore the node or disk

Correct the underlying failure before starting a manual heal.

For a node outage:

1. Restore the node's configured network identity and connectivity to every other RustFS node on the S3 API port, normally `9000`.
2. Mount the original data disks at their configured paths.
3. Confirm that the RustFS process uses the same storage endpoint configuration as the rest of the cluster.
4. Start RustFS and verify that the node rejoins the cluster.

For a failed disk:

1. Stop the RustFS process on the affected node before removing or remounting storage.
2. Replace the failed device and prepare its file system according to [Disk Preparation](/installation/requirement/disk-preparation).
3. Mount the replacement at the exact path used by the failed disk and update `/etc/fstab` with its file-system UUID.
4. Verify the mount, file-system type, ownership, and available capacity before starting RustFS.
5. Start RustFS and confirm that the disk appears in the expected pool and erasure set.

```bash
findmnt /data/rustfs0
df -hT /data/rustfs0
rc admin info storage rustfs
```

:::warning[Do not reuse stale storage blindly]

Confirm the identity and contents of every device before mounting it at a RustFS data path. Do not copy internal metadata between disks, combine multiple configured endpoints on one replacement file system, or mount a replacement over a path that still contains required data.

:::

## 3. Monitor automatic healing

After the node or replacement disk is online, RustFS can detect the recovery candidate and queue erasure-set healing. Check both storage state and aggregate heal activity:

```bash
rc admin info storage rustfs
rc admin heal status rustfs
rc admin scanner status rustfs
```

In JSON output, watch these groups:

| Field | Meaning |
| --- | --- |
| `state` | Heal runtime state, such as `active` or `idle`. |
| `healQueueLength` | Total work waiting in the heal queue. |
| `healActiveTasks` | Total heal tasks currently running. |
| `healOperations` | Queue, active, and retry counts grouped by source (`scanner`, `admin`, `autoHeal`, `internal`, and `readRepair`) and priority. |
| `progress` | Available totals for objects scanned, healed, failed, and bytes processed. |
| `clusterStatusComplete` | Whether the response includes every expected node. |

Do not treat `idle` as successful recovery by itself. Confirm that the replacement disk is online, no heal failures remain, the cluster is ready, and representative objects are readable.

## 4. Run a targeted manual heal

Use a manual task when automatic recovery does not cover the required path or when you need an explicit scan after an incident. Start with the narrowest bucket or prefix that contains affected data.

Preview a bucket heal without applying changes:

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--scan-mode normal \
	--dry-run
```

Run the targeted heal after reviewing the preview:

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--scan-mode normal
```

Limit the task to an object prefix when the affected scope is known:

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--scan-mode deep
```

`normal` is the default scan mode. Use `deep` when you need deeper data verification and have planned for the additional disk I/O. Omit `--bucket` only when a recursive scan of all buckets is necessary.

:::warning[Review mutation options separately]

The `--remove` option removes dangling objects or parts, and `--recreate` requests recreation of missing data. Do not add either option to an incident command until you have inspected the affected storage state, tested with `--dry-run`, and confirmed the intended result.

:::

## 5. Track the manual task

Every manual heal returns a `clientToken`. Save it with the incident record because status and stop operations for that task require the token.

For a bucket or prefix task, pass the original target and token:

```bash
rc admin heal status rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--client-token <client-token>
```

For a recursive task started without `--bucket`, use the token alone:

```bash
rc admin heal status rustfs --client-token <client-token>
```

The tokenless command remains the cluster-wide background summary:

```bash
rc admin heal status rustfs
```

Task status can include scanned, healed, and failed item totals, bytes processed, the current item, scan mode, start time, and last update. Investigate failed items rather than relying only on the task's aggregate state.

## 6. Validate recovery

After the heal queue drains, verify the cluster and the recovered data path:

```bash
rc ready rustfs
rc admin info cluster rustfs
rc admin info storage rustfs
rc admin heal status rustfs
```

Read representative objects from affected buckets and versions. For a known test object:

```bash
rc object stat rustfs/my-bucket/hello.txt
rc object copy rustfs/my-bucket/hello.txt ./hello-recovered.txt
```

Compare the downloaded object with an independent checksum or trusted source when one is available. A successful object read validates that request, not every object or every shard in the cluster.

Continue monitoring storage health and heal failures after the cluster becomes ready. Preserve the incident timeline, failed-device information, task token, and final status output for review.

## 7. Stop a manual heal

Stop only the task you have identified. For a bucket or prefix task, include the original target and token:

```bash
rc admin heal stop rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--client-token <client-token>
```

Stop a recursive token-scoped task with:

```bash
rc admin heal stop rustfs --client-token <client-token>
```

The tokenless stop command targets the global background heal operation:

```bash
rc admin heal stop rustfs
```

Use the global stop only when continued background work creates a larger operational risk. Stopping healing leaves recovery incomplete; record the reason and confirm how healing will resume before closing the incident.

## Troubleshooting

### The replacement disk is not healing

Confirm that the replacement is mounted at the configured endpoint and appears in `rc admin info storage`. Check the RustFS logs for disk identification, formatting, permission, or queue-admission failures. Also confirm that healing services are initialized with `rc admin heal status`.

### Heal status is partial

If `clusterStatusComplete` is false, one or more expected nodes did not contribute to the aggregate response. Restore node-to-node connectivity and check each node's storage and process health before trusting cluster totals.

### The queue remains active

Compare queued, active, and retrying work by source. A growing `autoHeal` count points to disk or erasure-set recovery; scanner work points to background discovery; admin work belongs to manually submitted tasks. Check disk latency, free capacity, node connectivity, and repeated item failures before starting another task.

### Objects cannot be reconstructed

Stop additional maintenance on the affected erasure set. Preserve the remaining disks and logs, then determine whether enough healthy shards survive. Repeated deep scans cannot reconstruct data when the available redundancy has already been exceeded.

### A manual task cannot be queried

Use the `clientToken` returned by `heal start`. Bucket and prefix tasks must be queried with the same `--bucket` and `--prefix` target used at start; a recursive root task uses the token without a bucket.

## Next steps

- Review [Status Check](/operations/status-check) for readiness, cluster, and capacity checks.
- Configure [Observability](/operations/observability) to alert on disk health and sustained recovery work.
- Review [Site Replication](/operations/high-availability/site-replication) when recovery requires an independent RustFS deployment.
