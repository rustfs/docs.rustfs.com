---
title: "Installing RustFS on Linux"
description: "Choose a Linux deployment mode — SNSD, SNMD, or MNMD — and install RustFS on one or more servers."
---

This section covers installing RustFS on Linux servers. For a one-command trial installation, use the [Quick Start](./quick-start.md). For a manual installation, pick one of the three deployment modes below — all three share the same [prerequisites and service setup](./prerequisites-and-service.md), and differ only in topology and volume configuration.

:::warning[Change the default credentials immediately]

After installation, set unique `RUSTFS_ACCESS_KEY` and `RUSTFS_SECRET_KEY` values in `/etc/default/rustfs`. Do not use the well-known `rustfsadmin` value for either credential. Restart the service with `sudo systemctl restart rustfs` after changing the file.

:::

## Single Node Single Disk (SNSD)

One server, one data disk. The simplest mode, with no redundancy — a disk failure means data loss, so rely on backups. Suitable for development, testing, and low-density non-critical business.

→ [Single Node Single Disk installation](./single-node-single-disk.md)

## Single Node Multiple Disk (SNMD)

One server, multiple data disks. Erasure coding shards data across the disks, so the node tolerates a limited number of disk failures, but a whole-server failure still means data loss. Suitable for medium, non-critical business on a single machine.

→ [Single Node Multiple Disk installation](./single-node-multiple-disk.md)

## Multiple Node Multiple Disk (MNMD)

Four or more servers, each with one or more disks. Erasure coding spans servers, providing disk- and node-level fault tolerance plus horizontal scalability. This is the mode for production workloads.

→ [Multiple Node Multiple Disk installation](./multiple-node-multiple-disk.md)

## Before Production

Work through the [Pre-Installation Checklists](../requirement/checklists/index.md) — hardware, network, software, and security — before deploying to production. If you don't need production standards, you can skip them.
