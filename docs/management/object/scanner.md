---
title: "Object Scanning"
description: "Guide to the RustFS object scanner, including design, implementation, and monitoring."
---

# Object Scanning

This guide covers the design and implementation of the RustFS object scanner, including its integration with Erasure Coding, Scrub & Repair mechanisms, scheduling strategies, monitoring metrics, and troubleshooting.

## Overview

The RustFS object scanner is built into the storage engine and is responsible for periodically checking object integrity and executing scheduled operations.
Scanning tasks include disk usage statistics, lifecycle management rule evaluation, object replication execution, and triggering corrupted object self-healing.

## Architecture and Design Principles

### Scanner Architecture

The RustFS scanner uses a hash sampling mechanism, selecting one out of every 1024 objects for inspection based on object name hashing to minimize performance impact.
The scanner is deeply integrated with the Erasure Coding module, utilizing redundant shards for online reconstruction when detecting lost or corrupted shards, ensuring high data availability and consistency.

## Data Verification and Recovery

The RustFS data verification mechanism checks metadata consistency and performs bit-by-bit reading and verification to discover hidden bad blocks. The object scanner detects issues like bit rot and triggers repair processes when necessary.

## Scanning Modes and Scheduling

RustFS supports three scanning modes: online scanning during reads, background periodic scanning, and manual full scanning, balancing performance and reliability.
Similar to the `osd_scrub_begin_hour` configuration in Ceph, administrators can set scanning start times and frequency. For example, light verification is set to once daily by default.

## Monitoring and Metrics

Scanner statistics include total task count, failure count, and time distribution, exposing metrics through the Prometheus data model such as `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total`, and `rustfs_scanner_duration_seconds`.
Combined with monitoring systems, alerts can be set based on scanning failure rates and duration to promptly discover and locate potential issues at the storage or network levels.
