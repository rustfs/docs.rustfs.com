---
title: "Object Inspection and Automatic Recovery"
description: "This document introduces RustFS's self-healing functionality design and implementation in single-server multi-disk architecture, including the significance, principles, processes, configuration, and common troubleshooting of self-healing."
---

# Object Inspection and Automatic Recovery

## Overview

RustFS provides robust object self-healing capabilities to ensure data integrity and availability across storage systems.

## RustFS Architecture and Self-Healing Design

### Single-Server Multi-Disk Architecture

RustFS adopts a single-server multi-disk design, organizing multiple disks into a logical storage pool to provide object storage services. Each object is split into multiple data shards and redundant shards when written, distributed across different disks to improve reliability and performance.

### Self-Healing Design Principles

1. **Data Integrity Verification**: Combines checksum mechanisms to ensure object shard data consistency during reads. For example, ZFS verifies the checksum of each data block during reads and performs repairs when verification fails.
2. **Shard Redundancy and Erasure**: Generates redundant shards through erasure coding. When some data shards are lost or corrupted, the original object can be reconstructed using redundant shards.
3. **Multi-Level Self-Healing Triggers**: Includes online healing during reads, background scanning healing, and manual triggered healing to balance performance and data reliability.

## Object Self-Healing Principles

### Verification and Erasure

During object writing, RustFS splits the object into *k* data shards and *m* redundant shards, distributed across *n=k+m* devices according to specified erasure parameters. During reads, if shards are found damaged or missing, they can be reconstructed from other intact shards.

### Data Verification and Repair (Scrub & Repair)

RustFS periodically performs lightweight scrub and deep scrub on storage pools:

- **Light Scrub**: Compares object metadata and shard sizes, promptly marking damage when detected.
- **Deep Scrub**: Reads shard data bit by bit and verifies checksums, detecting and repairing hidden bad blocks or bit rot issues.

When data scanning discovers inconsistencies, RustFS automatically invokes the Repair process, reconstructing damaged shards using redundant shards and writing the repaired shards back to the original disk or spare disk, ensuring data integrity for subsequent access.

## Self-Healing Workflow

### Online Healing During Reads

Every time a client executes a `GET` or `HEAD` request, RustFS first checks all data shards of the corresponding object:

1. If all data shards are intact, it directly returns the data.
2. If shards are missing or damaged, the system calculates missing shards based on redundant shards, repairs them, then returns the complete object to the client.

This mechanism is consistent with MinIO's read-time healing process, transparently repairing data without affecting client requests.

### Background Scanning Healing

RustFS has a built-in object scanner that traverses 1/1024 of objects in the storage pool using a hash method for integrity checks:

- The object scanner runs lightweight verification at regular (configurable) intervals.
- If damage is detected, it immediately triggers the self-healing reconstruction process.

By default, deep bit rot checking is not performed to reduce resource overhead, but deep verification functionality can be enabled as needed.

### Manual Triggered Healing

Administrators can execute full healing via command-line tools:

```bash
rc admin heal start --all
```

This operation scans the entire storage pool and performs complete verification and repair on all objects. It consumes significant resources and should be used cautiously during low-traffic periods.

## Usage Examples

```bash
# View current healing status
rc admin heal status

# Start healing for a specific bucket
rc admin heal start --bucket photos

# Stop ongoing healing tasks
rc admin heal stop
```

## Summary

RustFS's object self-healing combines mature designs from systems like MinIO, Ceph, and ZFS. Through multi-level triggered verification and repair processes, it effectively handles shard damage, disk failures, and bit rot issues in both single-machine multi-disk and multi-machine multi-disk environments, ensuring high reliability and high availability of object storage.
