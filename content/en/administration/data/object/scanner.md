---
title: "Object Scanning"
description: "Guide to the RustFS object scanner, including design, implementation, and monitoring."
---

This guide covers the design and implementation of the RustFS object scanner, including how it works with erasure coding, scrubbing and repair, scheduling, metrics, and troubleshooting.

## Overview

The RustFS object scanner is built into the storage engine and is responsible for periodically checking object integrity and executing scheduled operations.
The scanner collects disk usage statistics, evaluates lifecycle rules, performs object replication, and triggers healing for corrupted objects.

## Architecture and Design Principles

### Scanner Architecture

The RustFS scanner uses a hash sampling mechanism, selecting one out of every 1024 objects for inspection based on object name hashing to minimize performance impact.
The scanner works with the erasure coding layer: when it detects a missing or corrupted shard, it rebuilds the shard online from the remaining redundant shards.

## Data Verification and Recovery

The RustFS data verification mechanism checks metadata consistency and reads and verifies data bit by bit to detect latent bad sectors. The object scanner detects issues like bit rot and triggers repair processes when necessary.

## Scanning Modes and Scheduling

RustFS supports three scanning modes that balance performance and reliability: inline checks during reads, periodic background scans, and manual full scans.
Similar to the `osd_scrub_begin_hour` configuration in Ceph, administrators can set scanning start times and frequency. For example, a lightweight check runs once a day by default.

## Monitoring and Metrics

The scanner reports the total number of tasks, the number of failures, and duration distribution as Prometheus metrics, such as `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total`, and `rustfs_scanner_duration_seconds`.
Configure alerts on scan failure rate and duration so you can detect and diagnose storage or network problems early.