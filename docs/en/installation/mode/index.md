---
title: Startup Modes
description: How many startup modes does RustFS have?
---

# Startup Modes

RustFS has three startup modes:

- **Single Node Single Disk**: One data disk on one server
- **Single Node Multiple Disks**: Multiple data disks on one server
- **Multiple Nodes Multiple Disks**: Multiple data disks on multiple servers

## Single Node Single Disk Mode (SNSD)

> Suitable for low-density non-critical business. Data backup is recommended in production environments to avoid risks.

Only one data disk on one server, all data is stored on this single data disk.

The specific architecture diagram is as follows:

<img src="./images/1.jpg" alt="RustFS Single Node Single Disk Mode" />

## Single Node Multiple Disk Mode (SNMD)

> Suitable for medium non-critical business. In production environments, damage to specified M disks usually won't cause data risk. If the entire server is damaged or more than M disks are damaged, data will be lost.

Multiple data disks on one server, data is stored in shards across multiple data disks.

A data block will be split into specified K data blocks and M parity blocks. At most K data blocks cannot be lost, and at most M parity blocks cannot be lost.

As shown in the diagram below:

<img src="./images/2.jpg" alt="RustFS Single Node Multiple Disk Mode" />

## Multiple Nodes Multiple Disks (MNMD)

> Suitable for critical business in production environments. Configuration under expert guidance is recommended, with comprehensive system optimization considering concurrency, throughput, business scenarios, pressure and other metrics.

Minimum of 4 servers required, with at least 1 disk per server to safely start a distributed object storage cluster.

In the following architecture diagram example, data is written to any server randomly through load balancing. Using the default 12 + 4 mode, a data block is split into 12 data blocks + 4 parity blocks by default, stored on different disks of different servers.

Damage or maintenance of any 1 server will not affect data safety.

Damage to any 4 disks or fewer will not affect data safety.

<img src="./images/lb.jpg" alt="RustFS Multiple Node Multiple Disk Mode" />
