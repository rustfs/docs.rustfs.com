---
title: "Object Inspection and Auto-Recovery"
description: "How RustFS object self-healing works: design principles, trigger paths, scrub and repair process, and usage notes."
---

## RustFS Architecture and Self-Healing Design

### Erasure-Coded Storage Pools

RustFS organizes disks — on a single node or across nodes — into erasure-set storage pools. Each object is split into data shards and parity shards when written, and distributed across different disks (and nodes) to improve reliability and performance.

### Self-Healing Design Principles

1. **Data Integrity Verification**: Combines checksum mechanisms to ensure object shard data consistency during reads, for example, ZFS validates each data block's checksum during reads and repairs when validation fails.
2. **Shard Redundancy and Erasure Coding**: Generates redundant shards through erasure coding. When some data shards are lost or corrupted, original objects can be reconstructed using redundant shards.
3. **Multi-Level Self-Healing Triggers**: Includes online self-healing during reads, background scanning self-healing, and manual trigger self-healing to balance performance and data reliability.

## Object Self-Healing Principles

### Verification and Erasure Coding

During object write phase, RustFS splits objects into *k* data shards and *m* redundant shards, distributed across *n=k+m* block devices according to specified erasure parameters. During reads, if shard corruption or loss is detected, reconstruction can be performed from other intact shards.

### Data Verification and Repair (Scrub & Repair)

RustFS periodically performs lightweight verification (light scrub) and deep verification (deep scrub) on storage pools:
- **Lightweight Verification**: Compares object metadata and shard sizes, marking corruption when discovered.
- **Deep Verification**: Reads shard data bit by bit and verifies checksums, detecting and repairing hidden bad blocks or bit rot issues.

When data scanning discovers inconsistencies, RustFS automatically calls the Repair process, reconstructing corrupted shards using redundant shards, and writes repaired shards back to original disks or backup disks, ensuring data integrity for next access.

## Self-Healing Process

### Online Self-Healing During Reads

When a client executes a `GET` or `HEAD` request, RustFS reads the data shards required to serve the object (a read quorum, not every shard):
1. If enough shards are intact, data is returned directly.
2. If shards are lost or corrupted, the system reconstructs the missing shards from parity shards, repairs them, then returns the complete object to the client.
This enables transparent data repair without affecting client requests.

### Background Scanning Self-Healing

RustFS has a built-in object scanner that traverses 1/1024 of objects in the storage pool using hash methods for integrity checks:
- Object scanner runs lightweight verification periodically (configurable frequency);
- If corruption is discovered, self-healing reconstruction process is immediately triggered.
Deep bit-rot verification runs on its own cycle (30 days by default) and can be tuned or disabled to trade thoroughness against resource overhead.

### Manual Trigger Self-Healing

Administrators can trigger a full heal through the RustFS Console or the admin API. A full heal scans the entire storage pool and performs complete verification and repair on all objects, consuming significant resources, so it should be used cautiously during low-peak periods.

## Summary

RustFS's object self-healing combines mature designs from systems like MinIO, Ceph, and ZFS. Through multi-level triggered verification and repair processes, it can effectively handle shard corruption, disk failures, and bit rot issues in both single-machine multi-disk and multi-machine multi-disk environments, ensuring high reliability and high availability of object storage.
