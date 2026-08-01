---
title: "Installation"
description: "Choose the right RustFS deployment path: local trial, single-node or multi-node production, containers, and Kubernetes."
---

RustFS is a distributed object storage system written in Rust and released under the Apache 2.0 license. It runs on Linux, Windows, macOS, FreeBSD, and containers, across x86, ARM, RISC-V, and other CPU architectures.

:::warning[Change the default credentials immediately]

After installation, set unique values for `RUSTFS_ACCESS_KEY` and `RUSTFS_SECRET_KEY` before exposing RustFS to a network. Do not use the well-known `rustfsadmin` value for either credential.

- For a Linux binary or systemd installation, set both values in `/etc/default/rustfs`, then restart the `rustfs` service.
- For Docker, Podman, or Docker Compose, pass both values as container environment variables when creating the container. Recreate an existing container if it was started without them.

:::

## Choose Your Path

| Your goal | Recommended path | Guide |
| - | - | - |
| Try RustFS on a local machine | One-command install script, or a container | [Linux Quick Start](./linux/quick-start.md) · [Container](./container/index.mdx) |
| Single-server production | SNSD (one disk) or SNMD (multiple disks) | [Installing RustFS on Linux](./linux/index.md) |
| Multi-server production cluster | MNMD, after completing the production checklists | [Multiple Node Multiple Disk](./linux/multiple-node-multiple-disk.md) · [Checklists](./requirement/checklists/index.md) |
| Kubernetes / cloud-native | Container orchestration deployment | [Cloud Native](./cloud-native/index.md) |
| Windows or macOS host | Native installation | [Windows](./windows/index.md) · [macOS](./macos/index.md) |

## Deployment Mode Comparison

| Mode | Nodes | Disks | Fault Tolerance | Typical Use |
| - | - | - | - | - |
| [SNSD](./linux/single-node-single-disk.md) | 1 | 1 | None — rely on backups | Development, testing, low-density non-critical business |
| [SNMD](./linux/single-node-multiple-disk.md) | 1 | Multiple | Up to M parity disks within the node | Medium, non-critical business on a single server |
| [MNMD](./linux/multiple-node-multiple-disk.md) | 4+ | Multiple per node | Disk- and node-level via erasure coding across servers | Production workloads |

## Checklist

Before any production deployment, work through the [Pre-Installation Checklists](./requirement/checklists/index.md) — hardware, network, software, and security — to make sure your environment meets production guidance.
