---
title: "High-Performance Object Storage for Commvault Backup, Recovery and Replication"
description: "Simple. Scalable. Fast. Ransomware-resistant. In other words, exactly what you want."
---

# High-Performance Object Storage for Commvault Backup, Recovery and Replication

**Simple. Scalable. Fast. Ransomware-resistant. In other words, exactly what you want.**

## Core Advantages

### 🔒 Simple = Secure

The world is already complex enough. Commvault and RustFS simplify backup and recovery to protect your data. It works for a range of data sources from VMs to Office 365.

### 📈 Simple Delivery at Scale

RustFS object storage seamlessly scales to EB and beyond through its server pool approach. This ensures Commvault can focus on its core mission while leaving the rest (from hardware heterogeneity to erasure coding and bitrot protection) to RustFS. This means enterprises can scale their backups and protect as much data as possible.

### ⚡ Fast Backup is One Thing, Fast Recovery is Another

Regardless of size, backups and recoveries need to be fast. RustFS and Commvault can read/write at speeds exceeding **325 GiB/s** in a single 32-node cluster, enabling backup and recovery from object storage at speeds once thought impossible. When your business depends on fast recovery, there's no better solution in the market.

### ⚛️ Atomic Power

Because RustFS atomically writes metadata together with object data, no external metadata database is required (Cassandra in most cases). This eliminates performance penalties associated with small objects. RustFS can provide performance within Commvault's recommended object size ranges, helping with fast deletion and deduplication.

### 🔐 Inline and Strictly Consistent

Data in RustFS is always readable and consistent because all I/O is synchronously committed with inline erasure coding, bitrot hashing, and encryption. The S3 service provided by RustFS can flexibly handle any interruptions or restarts during busy transactions. There is no cached or staged data in asynchronous I/O. This guarantees the success of all backup operations.

### 🔧 Hardware Independent

Like Commvault, RustFS is software-defined and hardware-independent. This approach provides Commvault customers with tremendous savings and flexibility when designing systems to accommodate various different backup use cases.

## Solution Overview

RustFS and Commvault provide various software-defined optimized backup solutions. We work together to add high-performance object storage as endpoints in backup environments, disaggregating compute and storage while providing excellent performance, scalability, and economics. A single RustFS cluster can serve as a Commvault endpoint for anything in VMs, Oracle, SAP, and MS Office.

## Main Application Scenarios

### 🖥️ Commvault Backups for VMware ESXi Using RustFS

Use Commvault to seamlessly backup virtual infrastructure to object storage, providing you with the flexibility of nearly unlimited object storage capacity. You can control costs and security, thereby controlling how data is accessed.

### 📧 Commvault Backups for Office 365 Using RustFS

Use Commvault to seamlessly backup Office 365 data to object storage, providing you with the flexibility of nearly unlimited object storage capacity. You can control costs and security, thereby controlling how data is accessed.

### 💼 Commvault Backups for SAP HANA Using RustFS

With RustFS, Commvault backup solutions for SAP HANA are faster and more secure.

### 🗄️ Commvault Backups for Oracle Using RustFS

Backing up Oracle workloads requires performance, resilience, and security. Optimize this mission-critical backup using RustFS object storage.
