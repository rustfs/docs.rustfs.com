# High-Performance Object Storage for Commvault Backup, Recovery and Replication (/features/commvault)



**Simple. Scalable. Fast. Ransomware-resistant. In other words, exactly what you want.**

## Core Advantages [#core-advantages]

### 🔒 Simple = Secure [#-simple--secure]

The world is already complex enough. Commvault and RustFS simplify backup and recovery to protect your data. It works for a range of data sources from VMs to Office 365.

### 📈 Simple Delivery at Scale [#-simple-delivery-at-scale]

RustFS object storage seamlessly scales to EB and beyond through its server pool approach. This ensures Commvault can focus on its core mission while leaving the rest (from hardware heterogeneity to erasure coding and bitrot protection) to RustFS. This means enterprises can scale their backups and protect as much data as possible.

### ⚡ Fast Backup is One Thing, Fast Recovery is Another [#-fast-backup-is-one-thing-fast-recovery-is-another]

Regardless of size, backups and recoveries need to be fast. RustFS and Commvault can read/write at speeds exceeding **325 GiB/s** in a single 32-node cluster, enabling backup and recovery from object storage at speeds once thought impossible. When your business depends on fast recovery, there's no better solution in the market.

### ⚛️ Atomic Power [#️-atomic-power]

Because RustFS atomically writes metadata together with object data, no external metadata database is required (Cassandra in most cases). This eliminates performance penalties associated with small objects. RustFS can provide performance within Commvault's recommended object size ranges, helping with fast deletion and deduplication.

### 🔐 Inline and Strictly Consistent [#-inline-and-strictly-consistent]

Data in RustFS is always readable and consistent because all I/O is synchronously committed with inline erasure coding, bitrot hashing, and encryption. The S3 service provided by RustFS can flexibly handle any interruptions or restarts during busy transactions. There is no cached or staged data in asynchronous I/O. This guarantees the success of all backup operations.

### 🔧 Hardware Independent [#-hardware-independent]

Like Commvault, RustFS is software-defined and hardware-independent. This approach provides Commvault customers with tremendous savings and flexibility when designing systems to accommodate various different backup use cases.

## Solution Overview [#solution-overview]

RustFS and Commvault provide various software-defined optimized backup solutions. We work together to add high-performance object storage as endpoints in backup environments, disaggregating compute and storage while providing excellent performance, scalability, and economics. A single RustFS cluster can serve as a Commvault endpoint for anything in VMs, Oracle, SAP, and MS Office.

## Main Application Scenarios [#main-application-scenarios]

### 🖥️ Commvault Backups for VMware ESXi Using RustFS [#️-commvault-backups-for-vmware-esxi-using-rustfs]

Use Commvault to seamlessly backup virtual infrastructure to object storage, providing you with the flexibility of nearly unlimited object storage capacity. You can control costs and security, thereby controlling how data is accessed.

### 📧 Commvault Backups for Office 365 Using RustFS [#-commvault-backups-for-office-365-using-rustfs]

Use Commvault to seamlessly backup Office 365 data to object storage, providing you with the flexibility of nearly unlimited object storage capacity. You can control costs and security, thereby controlling how data is accessed.

### 💼 Commvault Backups for SAP HANA Using RustFS [#-commvault-backups-for-sap-hana-using-rustfs]

With RustFS, Commvault backup solutions for SAP HANA are faster and more secure.

### 🗄️ Commvault Backups for Oracle Using RustFS [#️-commvault-backups-for-oracle-using-rustfs]

Backing up Oracle workloads requires performance, resilience, and security. Optimize this mission-critical backup using RustFS object storage.
