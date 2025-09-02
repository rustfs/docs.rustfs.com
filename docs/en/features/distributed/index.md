---
title: "待翻译"
description: "此页面待翻译"
source: "features/distributed/index.md"
---

# Infrastructure for Large-Scale Data

RustFS is designed for scaling. Technical scale, operational scale, and economic scale. Fundamental scaling.

RustFS is designed to be cloud-native and can run as lightweight containers managed by external orchestration services like Kubernetes. The entire server is a ~100 MB static binary that efficiently uses CPU and memory resources even under high load. As a result, you can co-host many tenants on shared hardware.

![RustFS Architecture Diagram](./images/s2-1.png)

RustFS can run anywhere and on any cloud, but typically runs on commercial servers with locally attached drives (JBOD/JBOF). All servers in the cluster are functionally equal (fully symmetric architecture). There are no name nodes or metadata servers.

RustFS writes data and metadata together as objects, eliminating the need for a metadata database. Additionally, RustFS performs all functions (erasure coding, bitrot checking, encryption) as inline, strictly consistent operations. The result is that RustFS has extraordinary resilience.

Each RustFS cluster is a collection of distributed RustFS servers, with one process per node. RustFS runs as a single process in user space and uses lightweight coroutines to achieve high concurrency. Drives are grouped into erasure sets (see the erasure calculator here), and objects are placed on these sets using a deterministic hashing algorithm.

RustFS is designed for large-scale, multi-data center cloud storage services. Each tenant runs their own RustFS cluster, completely isolated from other tenants, enabling them to protect themselves from any disruption due to upgrades, updates, and security events. Each tenant scales independently by federating clusters across geographies.
