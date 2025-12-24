---
title: "High-Performance Object Storage for Veeam Backup and Replication"
description: "Using RustFS to extend your v12 instances and significantly improve Veeam storage capacity and performance."
---

# High-Performance Object Storage for Veeam Backup and Replication

![Veeam Logo](./images/veeam-logo.png)

Use RustFS to extend your v12 instances and significantly improve Veeam storage capacity and performance.

## RustFS Partners with Veeam to Add High-Performance Private Cloud Object Storage to S3 Endpoint Portfolio

Veeam Backup and Replication provides various software-defined optimized backup solutions. We work together to add high-performance object storage as endpoints, disaggregating compute and storage in backup environments while providing excellent performance, scalability, and economics. A single RustFS instance can serve as a Veeam endpoint for virtual machines, Oracle, SAP, and MS Office.

## Main Application Scenarios

### 🖥️ Veeam Backups for VMware ESXi Using RustFS

Use Veeam to seamlessly backup virtual infrastructure to object storage, providing you with the flexibility of nearly unlimited object storage capacity. You can control costs and security, thereby controlling how data is accessed.

### 📧 Veeam Backups for Office 365 Using RustFS

Use Veeam to seamlessly backup virtual infrastructure to object storage, providing you with the flexibility of nearly unlimited object storage capacity. You can control costs and security, thereby controlling how data is accessed.

### 💼 Veeam Backups for SAP HANA Using RustFS

With RustFS, Veeam backup solutions for SAP HANA are faster and more secure.

### 🗄️ Veeam Backups for Oracle Using RustFS

Backing up Oracle workloads requires performance, resilience, and security. Optimize this mission-critical backup using RustFS object storage.

---

## Veeam and RustFS are Natural Partners

Both Veeam and RustFS provide best-in-class software solutions for their respective technologies. From VMs to Office 365, large-scale performance is the metric for end-to-end solutions. RustFS object storage provides the most scalable and high-performance object storage solution in today's market, making it an ideal choice for Veeam customers.

## Core Advantages

### ⚡ Fast Backup is One Thing, Fast Recovery is Another

Regardless of size, backups and recoveries need to be fast. RustFS for Veeam Backup and Replication can read/write at speeds exceeding 160 GiB/s in a single 32-node cluster, enabling backup and recovery from object storage at speeds once thought impossible.

### 🗃️ Metadata Advantages

Because RustFS atomically writes metadata together with object data, Veeam backups don't require external metadata databases (Cassandra in most cases). This eliminates performance penalties associated with small objects. RustFS can provide performance within Veeam's recommended object size ranges, helping with fast deletion and deduplication.

### 🔒 Inline and Strictly Consistent

Data in RustFS is always readable and consistent because all I/O is synchronously committed with inline erasure coding, bitrot hashing, and encryption. The S3 service provided by RustFS can flexibly handle any interruptions or restarts during busy transactions. There is no cached or staged data in asynchronous I/O. This guarantees the success of all backup operations.

### 🔧 Hardware Independent

Like Veeam, RustFS is software-defined and hardware-independent. This approach provides Veeam customers with tremendous savings and flexibility when designing systems to accommodate various different backup use cases.

### 🚀 RustFS and Veeam: Backup and Recovery from Object Storage

RustFS and Veeam make a powerful combination! Deploying RustFS object storage with Veeam brings multiple advantages. These include advantages related to software-defined solutions, performance characteristics of fast backup and recovery, and the resilience and flexibility of object storage that writes metadata atomically.
