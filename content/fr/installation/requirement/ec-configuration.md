---
title: "EC Configuration"
description: "Plan and configure RustFS erasure-set size and parity before deploying storage pools."
---

RustFS uses Reed-Solomon erasure coding (EC) to distribute each object across the drives in an erasure set. Use this page to estimate usable capacity, understand the automatic defaults, and decide whether your deployment needs an explicit parity setting.

## Understand the layout

Each storage pool is divided into one or more erasure sets. For a set with `N` drives and `M` parity shards:

- data shards: `N - M`
- parity shards: `M`
- maximum unavailable shards that can be reconstructed: `M`
- approximate capacity efficiency: `(N - M) / N`

For example, a 16-drive set with `EC:4` stores 12 data shards and 4 parity shards. Its approximate capacity efficiency is 75% before file-system, metadata, and operational overhead.

:::note[Failure domains]

Parity describes unavailable shards within one erasure set. Node-level fault tolerance depends on how the set's drives are distributed across nodes. Do not assume that `EC:4` always tolerates four complete node failures; a node can host multiple drives from the same set.

:::

## Automatic parity

We recommend leaving `RUSTFS_STORAGE_CLASS_STANDARD` unset unless you have a specific, validated durability or capacity requirement. RustFS derives STANDARD parity independently for each pool from its drives per erasure set:

| Drives per erasure set (`N`) | Automatic STANDARD parity | Data shards | Approximate efficiency |
| --- | --- | --- | --- |
| 1 | `EC:0` | 1 | 100% |
| 2–3 | `EC:1` | `N - 1` | 50%–67% |
| 4–5 | `EC:2` | `N - 2` | 50%–60% |
| 6–7 | `EC:3` | `N - 3` | 50%–57% |
| 8–16 | `EC:4` | `N - 4` | 50%–75% |

Multi-drive erasure sets contain between 2 and 16 drives. A single-drive deployment is a separate layout with zero parity.

:::warning[Use the set width, not the cluster total]

Validate parity against the number of drives in each erasure set, not the total number of drives in the cluster. A cluster can contain multiple sets or pools with different widths.

:::

## Estimate usable capacity

For a pool whose sets all use the same width and parity, estimate EC capacity with:

$$
\text{usable capacity} \approx \text{raw capacity} \times \frac{N-M}{N}
$$

For example, 16 equal 10 TiB drives arranged as one 16-drive set with `EC:4` provide approximately:

$$
160\ \text{TiB} \times \frac{16-4}{16} = 120\ \text{TiB}
$$

Reserve additional capacity for XFS, object metadata, versioning, incomplete uploads, healing, and normal operational headroom. Treat the result as a planning estimate, not guaranteed available space.

## Configure parity

Set EC variables in the same environment file used by the RustFS service, such as `/etc/default/rustfs`.

To use the recommended automatic STANDARD parity, omit `RUSTFS_STORAGE_CLASS_STANDARD` or leave it empty:

```ini title="/etc/default/rustfs"
RUSTFS_STORAGE_CLASS_STANDARD=
```

To pin parity explicitly, use the `EC:<parity>` format:

```ini title="/etc/default/rustfs"
RUSTFS_STORAGE_CLASS_STANDARD=EC:4
RUSTFS_STORAGE_CLASS_RRS=EC:1
```

`RUSTFS_STORAGE_CLASS_STANDARD` controls writes using the `STANDARD` storage class. `RUSTFS_STORAGE_CLASS_RRS` controls `REDUCED_REDUNDANCY` writes and defaults to one parity shard on multi-drive sets. RustFS accepts these two storage classes for local writes.

Explicit settings must satisfy all of these rules:

- parity must be no greater than half of the drives in every target set: `M <= N / 2`
- STANDARD parity must be greater than or equal to REDUCED_REDUNDANCY parity when both are non-zero
- the configured parity must be valid for every pool, including the narrowest pool

RustFS validates explicit storage classes against each pool during startup. An invalid value causes startup to fail instead of silently reducing parity. Remove the explicit STANDARD value to return to per-pool automatic parity, or choose a value every pool can satisfy.

## Control erasure-set width

RustFS normally selects a valid set width automatically from the volume topology. Multi-drive set widths range from 2 through 16.

`RUSTFS_ERASURE_SET_DRIVE_COUNT` can pin the width when you need a specific symmetric layout:

```ini title="/etc/default/rustfs"
RUSTFS_ERASURE_SET_DRIVE_COUNT=16
```

The value must divide the pool topology symmetrically and be valid for every volume expansion pattern. RustFS rejects a width that cannot evenly partition the configured endpoints. Leave this variable unset unless you have verified the complete pool layout.

## Validate the configuration

Before starting or restarting RustFS:

1. Determine the drives per erasure set for every pool.
2. Confirm that explicit parity does not exceed half of the narrowest set width.
3. Estimate usable capacity and reserve operational headroom.
4. Keep the same service environment configuration on every node.

After startup, use the Console **Status** page or `rc admin info cluster` to confirm the backend layout, erasure-coding parity, drive availability, and pool membership. See [Status Check](/operations/status-check) for the complete workflow.

## Next steps

- [Prepare data disks](./disk-preparation.md)
- [Choose a deployment topology](/installation#deployment-mode-comparison)
- [Review all storage environment variables](/reference/environment-variables#storage--erasure)