---
title: "Object Scanning"
description: "RustFS is a simple, efficient, distributed object storage. It is 100% S3 compatible and open-source software released under Apache2 license."
---

# Object Scanning

This article provides an in-depth introduction to the design and implementation of RustFS object scanner, covering its integration with Erasure Coding, Scrub & Repair mechanisms, as well as scheduling strategies, monitoring metrics, and troubleshooting methods.

## Overview

RustFS object scanner is built into the storage engine, responsible for periodically checking object integrity and executing scheduled operations.
Scanning tasks include disk usage statistics, lifecycle management rule evaluation, object replication execution, and triggering corrupted object self-healing, among other functions.

## Architecture and Design Principles

### Scanner Architecture

RustFS scanner adopts a hash sampling mechanism, selecting one out of every 1024 objects for inspection based on object name hashing to reduce performance impact on normal requests.
The scanner is deeply integrated with the Erasure Coding module, able to utilize redundant shards for online reconstruction when detecting lost or corrupted shards, ensuring high data availability and consistency.

## Data Verification and Recovery

RustFS data verification mechanism can quickly check metadata consistency, with the latter performing bit-by-bit reading and verification to discover hidden bad blocks. Object scanner execution can detect issues like bit rot and trigger repair processes when necessary.

## Scanning Modes and Scheduling

RustFS supports three scanning trigger modes: online scanning during reads, background periodic scanning, and manual full scanning, balancing performance and reliability.
Similar to `osd_scrub_begin_hour` configuration in Ceph, administrators can set scanning start times and frequency, for example, setting light verification to once daily by default.

## Monitoring and Metrics

RustFS scanner statistics include total task count, failure count, and time distribution, exposing metrics through Prometheus data model such as `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total`, and `rustfs_scanner_duration_seconds`.
Combined with monitoring systems, alerts can be set based on scanning failure rates and duration to promptly discover and locate potential issues at storage or network levels.
