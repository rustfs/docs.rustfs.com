---
title: "Cluster Lifecycle Operations"
description: "Plan, start, expand, rebalance, decommission, heal, and restart erasure-coded RustFS clusters with verified quorum and storage-class behavior."
---

This runbook is the operator entry point for erasure-coded RustFS deployments: layout boundaries, storage classes and quorum, zero-parity mode, expansion, rebalancing, decommissioning, healing, drive replacement, and restarts. Every behavior described here was verified against the RustFS source; the upstream runbook in [rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998) is the change that introduced it.

Related task pages: [Storage Pool Expansion](./scaling/storage-pool-expansion.md), [Data Rebalancing](./scaling/data-rebalancing.md), [Storage Pool Decommission](./scaling/storage-pool-decommission.md), and [Node Healing](./high-availability/node-healing.md).

## Layout boundaries

A pool's endpoint count, set count, drives per set, and position in the pool list are persisted layout. On startup RustFS compares the stored format with the configured drive count and set width and fails permanently with `PoolTopologyMismatch` (or `UnsupportedSnsdExpansion` for a single-drive deployment) instead of migrating. Restore the original endpoints and set width; do not delete `format.json` to get past the error.

:::warning[Never do these]

- Overwrite an existing pool with more or fewer endpoints, or change `RUSTFS_ERASURE_SET_DRIVE_COUNT` for an initialized pool.
- Reorder volume arguments or move a drive directory to another slot.
- Delete, copy, or rename object shards, `xl.meta`, or anything under `.rustfs.sys` by hand.
- Treat a manual file copy as data movement. Only rebalance and decommission move objects, under object locks with version re-checks and source cleanup.

:::

Runtime roles:

- **Pool** — one endpoint list with persisted layout. Multi-drive sets contain 2 to 16 drives; a single local path is the only single-drive layout.
- **Pool leader** — the first endpoint of a pool. Decommission start, cancel, and clear may be sent to any node; requests are forwarded to the pool leader over authenticated internode RPC.
- **Cluster-wide state** — rebalance and root heal propagate to peers and recover from persisted metadata on restart.

## Plan and first start

1. Plan endpoints by node, rack, power, and network failure domain. Topology admission is not a high-availability guarantee: a single-node pool loses every shard with its host, and startup logs a `host_failure_data_unavailable` warning for every multi-drive pool.
2. Pick each pool's set width. Pools may differ in width, but each pool must split evenly into sets of one width from 2 to 16 drives; `RUSTFS_ERASURE_SET_DRIVE_COUNT` may pin a width that is already a valid divisor, nothing else.
3. Pick STANDARD and RRS parity per the rules in [Storage classes](#storage-classes-parity-and-quorum), then validate against the narrowest pool, because an explicit parity must fit every pool.
4. Record the full launch command, endpoint order, pool order, set width, and storage-class variables. They must be identical on every node and on every restart.
5. Give RustFS exclusive ownership of every endpoint path.

Volumes come from positional arguments or `RUSTFS_VOLUMES`; `rustfs` with no arguments behaves as `rustfs server` with volumes from the environment. Ellipsis expansion follows the MinIO pattern:

```bash
# one pool, four nodes, four drives each: sixteen endpoints
rustfs server http://node{1...4}:9000/data{1...4}

# two pools; every argument must carry an ellipsis once there is more than one
rustfs server http://node{1...4}:9000/data{1...4} http://node{5...8}:9000/data{1...4}
```

With more than one argument, every argument needs an ellipsis; each pool must expand to at least two distinct drive endpoints; a single-drive pool cannot join a multi-pool deployment; a singleton range such as `{3...3}` does not bypass the minimum.

A storage-class error stops startup before any disk is touched. Startup then initializes local disks, the lock clients, and the format quorum in that order.

## Startup configuration

| Variable | Effect | Boundary |
|---|---|---|
| `RUSTFS_ERASURE_SET_DRIVE_COUNT` | Pin the set width | Must be a valid symmetric divisor of the pool, at most 16; cannot change an initialized pool |
| `RUSTFS_STORAGE_CLASS_STANDARD` | STANDARD parity as `EC:<n>` | Validated per pool; affects new writes only |
| `RUSTFS_STORAGE_CLASS_RRS` | RRS parity as `EC:<n>` | Validated per pool; an explicit value fails on a single drive, the persisted default `EC:1` resolves to `0` there |
| `RUSTFS_STORAGE_CLASS_OPTIMIZE` | Accepted for MinIO compatibility | Stored but currently unused: it changes nothing at runtime |
| `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` | Fixed per-shard inline limit (bytesize syntax such as `128KiB`) | Replaces the scaled default in [Inline objects](#inline-objects); values above 128 KiB log a warning |

An empty `RUSTFS_STORAGE_CLASS_STANDARD` or `RUSTFS_STORAGE_CLASS_RRS` restores the automatic policy and overrides a persisted value. `MINIO_`-prefixed spellings of these keys, of `ERASURE_SET_DRIVE_COUNT`, and of `VOLUMES` are mapped onto the `RUSTFS_` names when the `RUSTFS_` name is unset; when both are set the `RUSTFS_` value wins and the conflict is reported at startup.

Other data-movement and listing knobs: `RUSTFS_REBALANCE_MAX_ATTEMPTS` (default 3), `RUSTFS_DECOMMISSION_BUCKET_CONCURRENCY` (default cap 4), `RUSTFS_DECOMMISSION_ENTRY_CONCURRENCY` (default cap 8, hard cap 64), and `RUSTFS_LIST_OBJECTS_QUORUM` (default `optimal`; accepts `disk`, `reduced`, `optimal`, `auto`, anything else means `strict`). None of them relaxes object quorum, object locks, or version checks.

## Storage classes, parity, and quorum

### Geometry

Each object is Reed-Solomon coded across the `N` drives of one set into `K` data and `M` parity shards, `N = K + M`; any `K` shards rebuild it. The geometry is stored per object in `xl.meta`, so changing the default later rewrites nothing. Objects hash to a set and shards rotate within it; sets never share a failure budget.

Default STANDARD parity by set width: 0 for one drive, 1 for 2 to 3, 2 for 4 to 5, 3 for 6 to 7, 4 for 8 to 16. Default RRS parity is 1 (0 on a single drive).

Validation rules: each parity is at most `N/2` for every pool, and STANDARD parity is at least RRS parity only when both are non-zero. There is no minimum, so `EC:0` passes on any width. Only `STANDARD` and `REDUCED_REDUNDANCY` are accepted on PUT, CopyObject, and CreateMultipartUpload; other AWS storage classes return `InvalidStorageClass`.

### Quorum and capacity

```text
usable capacity  ≈ raw × K / N
read quorum      = K            (metadata vote and shard decode)
write quorum     = K, or K + 1 when K == M
delete markers   = N/2 + 1      (majority, both write and vote)
```

Sixteen drives at `EC:4`: `K = 12`, about 75 percent usable, four failures tolerated, twelve valid shards needed to read. Two drives at `EC:1`: `K = M = 1`, so one drive down still reads but no longer writes. Internal metadata under `.rustfs.sys` is always written with parity `N/2`, regardless of the configured class.

### Inline objects

An object is stored inline in `xl.meta` when every shard is at most the per-shard budget. The default budget is `256 KiB / K` capped at 128 KiB per shard, so a wider set does not raise the maximum inline object size; on a versioned bucket the budget is divided by 8. `RUSTFS_STORAGE_CLASS_INLINE_BLOCK` replaces the scaled default with a fixed per-shard limit. Each drive keeps only its own shard inline, so inline data has the same loss semantics as external shards. Compressed or encrypted streams inline only when the stored size is known and within budget.

### Write and read paths

Writes resolve the layout per pool, encode with Reed-Solomon in 1 MiB blocks, write bitrot-protected shards, and commit only after write quorum. A write below quorum is never reported as success. Reads pick the authoritative metadata at read quorum, verify bitrot, decode from at least `K` shards, and fail closed below that; a read that succeeds with missing shards enqueues read-repair. Multipart parts use the object's geometry and write quorum; `CompleteMultipartUpload` re-checks metadata and commit quorum, so an uploaded part is not a committed object.

## Zero parity (EC:0)

`EC:0` is accepted for STANDARD, for RRS, or for both, on any set width. It gives raw capacity and no redundancy.

:::danger[EC:0 means one drive loss equals set loss]

A replaced or wiped drive permanently loses every zero-parity object that had a shard on it, unless a copy exists outside the set. Healing cannot rebuild zero-parity objects: heal reports `no-parity object is unrecoverable` for them. Production deployments should use `EC:1` or higher; `EC:2` or more per set is the usual floor once a set spans more than one node. Use `EC:0` only where an external layer (RAID, replication, backup, or a re-creatable source) owns durability and availability, and only with explicit sign-off.

:::

Behavior details:

- **Configuration.** Explicit `EC:0` produces no startup warning — the zero-redundancy warning fires only for automatic zero parity, meaning a single-drive pool. `STANDARD=EC:2` with `RRS=EC:0` is valid because the ordering rule is skipped when either side is zero; only objects written with `x-amz-storage-class: REDUCED_REDUNDANCY` then carry zero-parity semantics.
- **Writes.** Write quorum is `N`: if any drive of the set is unwritable, the write fails with `ErasureWriteQuorum` and nothing is committed. Because a zero-parity shard cannot be rebuilt later, the write path verifies every shard it just wrote against its bitrot hash before commit and refuses to commit a shard that already fails.
- **Reads.** Read quorum is `N`. With any drive of the set offline, HEAD and GET of every zero-parity object in that set fail with `ErasureReadQuorum`. There is no degraded read.
- **Deletes.** Delete markers and version deletes use majority quorum (`N/2 + 1`), so a delete can succeed on a set whose reads and writes are failing. A successful delete is not evidence that the set is healthy.
- **What still works with one drive down.** Bucket operations, `.rustfs.sys` metadata, delete markers, and listings that satisfy the list quorum. Everything else in the set is unavailable, including rebalance and decommission of its objects, which must read all `N` shards.
- **Raising parity later rewrites nothing.** Re-upload or server-side copy each object after the change to re-protect it.

## Post-start verification

Read-only admin checks:

```text
GET /rustfs/admin/v3/pools/list
GET /rustfs/admin/v3/pools/status?pool=<pool>[&by-id=true]
GET /rustfs/admin/v3/decommission/status[?pool=<pool>&by-id=true]
GET /rustfs/admin/v4/cluster/snapshot
GET /rustfs/admin/v4/runtime/capabilities
```

`pool` is a pool command line, or a zero-based index with `by-id=true`. Status queries ignore unknown parameters; mutation queries reject unknown or duplicate parameters and a `by-id` value other than `true` or `false`.

Confirm: pool count, endpoints per pool, set count and width per pool, local versus remote endpoints, and no topology mismatch.

Data-plane checks: write one STANDARD and one RRS object; GET, HEAD, range GET, CopyObject, and a multipart upload; take one drive or node offline within parity and confirm reads continue and writes behave per the quorum table; bring it back and confirm the heal queue drains and bitrot errors stop; confirm every node reports the same pool metadata and cluster snapshot.

## Expansion

An existing pool cannot grow in place. Add a pool:

1. Plan its nodes, drives, and failure domain; each new pool needs at least two drive endpoints and its own valid set layout.
2. Prepare empty, RustFS-exclusive paths on every node.
3. Append the pool to the launch arguments on **every** node, keeping existing pools, their order, endpoints, and set width unchanged. A single-node single-drive deployment cannot expand; migrate through S3 instead.
4. Restart and verify per the checks above.
5. New writes are placed across available pools; old objects stay where they are. To move them, start a rebalance. A restart never rebalances.

Adding a pool does not add parity to existing objects and does not copy anything. Cross-pool movement is rebalance or decommission only. See [Storage Pool Expansion](./scaling/storage-pool-expansion.md) for a worked example.

## Rebalance

Rebalance redistributes objects across pools by usage. Preconditions: more than one pool (a single pool returns `NotImplemented`), no decommission running or conflicting, and no query string on `start` or `stop`.

```text
POST /rustfs/admin/v3/rebalance/start     → {"id": "<uuid>"}
GET  /rustfs/admin/v3/rebalance/status
POST /rustfs/admin/v3/rebalance/stop
```

Status reports per-pool `id`, `status`, `stopping`, `used`, `lastError`, `cleanupWarnings`, and `progress` (objects, versions, bytes, remaining buckets, current bucket and object, elapsed, ETA), plus `stoppedAt` and stop-propagation fields.

Start propagates an admission fence and worker state to peers; a propagation failure rolls back to a terminal state and reports any peer that did not roll back. Stop closes admission, stops local and remote workers, and persists the stopped state. Treat a rebalance as finished only when no pool is active or stopping, `lastError` is empty or explained, `cleanupWarnings` are understood, stop propagation has completed, and migrated objects read from their new pool. Per-pool state lives in `rebalance.bin`; never delete it to unblock a run. See [Data Rebalancing](./scaling/data-rebalancing.md) for the walkthrough.

## Decommission

Operator summary — supported only on multi-pool, non-legacy (ellipsis) deployments; anything else returns `NotImplemented`. A rebalance in progress blocks start.

```text
POST /rustfs/admin/v3/pools/decommission?pool=<a>[,<b>]      # by command line
POST /rustfs/admin/v3/pools/decommission?pool=1&by-id=true   # by index
GET  /rustfs/admin/v3/decommission/status[?pool=1&by-id=true]
POST /rustfs/admin/v3/pools/cancel?pool=1&by-id=true
POST /rustfs/admin/v3/pools/clear?pool=1&by-id=true
```

- Targets are validated as a batch before anything is persisted: unknown, duplicate, active, queued, or completed targets are rejected; failed or canceled targets must be cleared first unless they hold unresolved listing entries, in which case a new start is the retry path.
- Entry states: `queued` → `active` → `completed`, `failed`, or `canceled`, persisted in `pool.bin`. Startup resumes non-terminal entries and skips terminal predecessors.
- A source pool in any decommission state rejects new ordinary PUTs and new multipart uploads (a staged PUT gets `SlowDown`); existing multipart uploads may drain while the source is non-terminal.
- `clear` removes failed or canceled metadata only and never moves data back.
- Remove a pool from the launch arguments only after its entry is `completed`, free versions and tier ownership have converged, and every node shows the same status. Never detach source drives before that, and never substitute a directory delete for the configuration change.

See [Storage Pool Decommission](./scaling/storage-pool-decommission.md) for the walkthrough.

## Heal and drive replacement

### Admin heal

```text
POST /rustfs/admin/v3/heal/                    # root: cluster, or one erasure set with pool+set
POST /rustfs/admin/v3/heal/<bucket>
POST /rustfs/admin/v3/heal/<bucket>/<prefix>
POST /rustfs/admin/v3/background-heal/status
GET  /rustfs/admin/v4/heal/replacement-recovery
```

The JSON body carries `recursive`, `dryRun`, `remove`, `recreate`, `scanMode`, `updateParity`, `nolock`, `readRepair`, `pool`, and `set`. Handler rules:

- a root heal must set `recursive=true` or name both `pool` and `set`; a bucket heal without a prefix is always recursive, and a prefix heal honors `recursive`;
- `readRepair=true` is rejected with `InvalidArgument`;
- `nolock` is accepted on the wire but always forced to `false` — admin heals always take the object namespace lock, so there is no lock bypass;
- `clientToken` correlates start, status, and stop; `forceStart` and `forceStop` are validated against it, and unknown or duplicate query keys are rejected.

Heal selects the authoritative version from quorum metadata and refuses when more shards are missing than parity can rebuild or when the stored geometry does not match the set. It shares the `(bucket, object)` lock with PUT, delete, multipart complete, and data movement.

### Drive replacement

1. Confirm the affected set still meets read quorum for its objects (impossible at `EC:0`) and record pool index, set index, slot, and the failed disk's UUID from the pool status.
2. Replace the drive at the **same** endpoint and mount path with an empty filesystem owned by RustFS. Do not copy the old drive's directories; a copied `format.json` claims an identity the set already tracks.
3. Bring the node back. The empty drive is not a format-quorum member, so its slot stays offline until the erasure-set heal task writes the format into the original slot and rebuilds the shards — through the recorded automatic replacement intent when startup or the disk scanner observes a changed mount identity, or through an admin erasure-set heal (`POST /rustfs/admin/v3/heal/` with `pool` and `set`).
4. Watch `GET /rustfs/admin/v4/heal/replacement-recovery`, background heal status, disk health, and bitrot counters. An `idle` queue or a readable object is not proof of completion.
5. The replacement is done when recovery reports `completed` for that instance and sampled objects have `xl.meta` and parts on the new drive.

If a set has lost more drives than its parity, heal cannot rebuild; recover from replication, a remote tier, or backup. See [Node Healing](./high-availability/node-healing.md) for the broader healing model.

## Restart and recovery

- **Ordinary restart.** No topology change in flight, identical arguments on every node, one node at a time. Startup reloads pool metadata, `rebalance.bin`, the decommission queue, and heal recovery records, and resumes workers by leader and owner rules.
- **Rebalance.** Read `/rebalance/status` first. Handle active or stopping pools, `lastError`, cleanup warnings, and stop propagation before deciding to stop or restart. Do not delete `rebalance.bin`.
- **Decommission.** Non-terminal entries resume; failed and canceled entries survive restarts until cleared or retried through the allowed path.
- **Root heal.** A graceful shutdown persists an unfinished cluster heal as `root-heal-<task-id>.json` under `.rustfs.sys` and replays it with the same task id. Invalid, oversized, or unsupported records move to quarantine prefixes and are skipped with a log line until an operator repairs them. Do not delete quarantine markers or reuse a task id.
- **Unclean shutdown.** When the previous run left its marker behind, the heal manager enqueues a full erasure-set heal for every local set; graceful shutdown clears the marker.

## Mutual exclusion and prohibited actions

| Operation | With rebalance | With decommission | Notes |
|---|---|---|---|
| PUT, DELETE, multipart complete | Object lock | Source pool rejects new publication | Never bypass the pool fence |
| Decommission | Rejected while rebalance runs | Serial queue | Leader-only mutation |
| Rebalance | Multi-pool only | Rejected while decommission runs or conflicts | No query parameters |
| Admin heal | Object lock | Repairs data, never changes decommission state | `nolock` is ignored |
| Drive replacement | Cannot change the layout | Avoid on a source pool mid-decommission | Same slot, empty drive |

:::warning[Prohibited]

Do not change launch endpoints while rebalance or decommission runs; do not delete `.rustfs.sys`, `rebalance.bin`, `pool.bin`, or root-heal records; do not run manual heal, file copies, and drive replacement on one pool at the same time; do not treat an HTTP 200 on a start call as completion.

:::

## Checklists

- **After start or expansion**: identical endpoints and pool order on every node; topology equals the stored format; peers ready; new endpoints unique and RustFS-exclusive; GET, HEAD, range GET, and multipart verified.
- **After rebalance**: no pool active or stopping; `lastError` empty or explained; `cleanupWarnings` handled; stop propagation complete; migrated objects readable.
- **After decommission**: status `completed`; other entries handled by policy; source pool rejects new writes; free versions, tier ownership, and listing entries converged; launch arguments updated on every node before drives are detached.
- **After heal or replacement**: replacement recovery `completed`; slot and UUID correct; heal queue drained; no growing bitrot count; sampled current and historical versions readable; no leftover temporary directories.

## rc command mapping

`rc` is the RustFS CLI (see [CLI Client (rc)](./rc.mdx)); its `expand` group is an alias of `rebalance` — there is no server-side expand API. Flags below are the commonly used ones; check `rc admin <group> --help` for the installed version.

```bash
rc alias set local http://localhost:9000 <your-access-key> <your-secret-key>
rc ping local
rc ready local --timeout 2
rc admin info cluster local
rc admin info disk local --offline
rc admin pool list local
rc admin pool status local 0 --by-id
rc admin rebalance start local
rc admin rebalance status local
rc admin rebalance stop local
rc admin decommission start local '/data/pool1/disk{1...4}'
rc admin decommission status local 1 --by-id
rc admin decommission cancel local 1 --by-id
rc admin decommission clear local 1 --by-id
rc admin heal start local --scan-mode deep
rc admin heal start local --bucket logs --prefix 2026/ --scan-mode deep
rc admin heal status local --client-token <TOKEN_FROM_START>
rc admin heal stop local --client-token <TOKEN_FROM_START>
```

| `rc` command | Server route |
|---|---|
| `rc ping` / `rc ready` | `GET /health` / `GET /health/ready` |
| `rc admin pool list` / `status` | `GET /rustfs/admin/v3/pools/list` / `GET /rustfs/admin/v3/pools/status` |
| `rc admin rebalance …` (alias `expand`) | `/rustfs/admin/v3/rebalance/*` |
| `rc admin decommission start` / `cancel` / `clear` | `POST /rustfs/admin/v3/pools/decommission` / `cancel` / `clear` |
| `rc admin decommission status` | `GET /rustfs/admin/v3/decommission/status` |
| `rc admin heal start` / `status` / `stop` | `/rustfs/admin/v3/heal/*`, `POST /rustfs/admin/v3/background-heal/status` |

`rc admin heal start` exposes `--bucket`, `--prefix`, `--scan-mode`, `--remove`, `--recreate`, and `--dry-run`; it does not expose `nolock`, `forceStart`, `forceStop`, `pool`, or `set`. There is no `rc` command for replacement recovery; call `GET /rustfs/admin/v4/heal/replacement-recovery` directly.

## References

- Upstream runbook: `docs/operations/cluster-lifecycle-operations.md` in [rustfs/rustfs#7998](https://github.com/rustfs/rustfs/pull/7998) — the source this page is adapted from, verified claim by claim against the RustFS source code.
- [Storage Pool Expansion](./scaling/storage-pool-expansion.md) · [Data Rebalancing](./scaling/data-rebalancing.md) · [Storage Pool Decommission](./scaling/storage-pool-decommission.md) · [Node Healing](./high-availability/node-healing.md) · [CLI Client (rc)](./rc.mdx)
