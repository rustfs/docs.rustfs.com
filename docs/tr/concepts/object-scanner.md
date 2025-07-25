---
title: "Object Scanning"
description: "RustFS is a simple, efficient, distributed object storage. It is 100% S3 compatible, open source software released under the Apache2 license."
---

# Object Scanning

This article provides an in-depth introduction to the design and implementation of the RustFS object scanner, covering its integration with Erasure Coding, Scrub & Repair mechanisms, as well as scheduling strategies, monitoring metrics, and troubleshooting methods.

## Overview

The RustFS object scanner is built into the storage engine and is responsible for periodically checking object integrity and performing scheduled operations. Scanning tasks include statistics on disk usage, evaluating lifecycle management rules, performing object replication, and triggering self-healing of corrupted objects.

## Architecture and Design Principles

### Scanner Architecture

The RustFS scanner employs a hash sampling mechanism, selecting one out of every 1024 objects for inspection based on object name hash, to reduce performance impact on normal requests. The scanner is deeply integrated with the Erasure Coding module and can perform online reconstruction using redundant shards when missing or corrupted shards are detected, ensuring high data availability and consistency.

## Data Verification and Recovery

RustFS data verification mechanisms can quickly check metadata consistency, while the latter reads bit by bit and verifies data to discover hidden bad blocks. The object scanner's execution can detect issues such as bit rot and trigger repair processes when necessary.

## Scanning Modes and Scheduling

RustFS supports three scanning trigger modes: online scanning during reads, background periodic scanning, and manual full scanning, balancing performance and reliability. Similar to the `osd_scrub_begin_hour` configuration in Ceph, administrators can set scanning start times and frequencies, for example, setting light verification to default once daily.

## Monitoring and Metrics

The RustFS scanner counts total tasks, failure counts, and time distribution, exposing metrics such as `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total`, and `rustfs_scanner_duration_seconds` through the Prometheus data model. Combined with monitoring systems, alerts can be set based on scanning failure rates and duration to promptly discover and locate potential issues at the storage or network level.
