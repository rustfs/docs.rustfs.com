# 面向 Veeam Backup and Replication 的高性能对象存储

![Veeam Logo](./images/veeam-logo.png)

使用 RustFS 扩展您的 v12 实例，并大幅提升 Veeam 存储容量和性能。

## RustFS 与 Veeam 合作，将高性能私有云对象存储添加到 S3 端点产品组合中

Veeam Backup and Replication 提供各种软件定义的优化备份解决方案。我们携手合作，将高性能对象存储添加为端点，在备份环境中分解计算和存储，同时提供卓越的性能、可扩展性和经济性。RustFS 的单个实例可作为 Veeam 端点，适用于虚拟机、Oracle、SAP 和 MS Office。

## 主要应用场景

### 🖥️ Veeam Backups for VMware ESXi 使用 RustFS

使用 Veeam 将虚拟基础架构无缝备份到对象存储，为您提供近乎无限的对象存储容量的灵活性。您可以控制成本和安全性，从而控制数据的访问方式。

### 📧 Veeam Backups for Office 365 使用 RustFS

使用 Veeam 将虚拟基础架构无缝备份到对象存储，为您提供近乎无限的对象存储容量的灵活性。您可以控制成本和安全性，从而控制数据的访问方式。

### 💼 Veeam Backups for SAP HANA 使用 RustFS

借助 RustFS，面向 SAP HANA 的 Veeam 备份解决方案更快、更安全。

### 🗄️ 使用 RustFS 的 Veeam Backups for Oracle

备份 Oracle 工作负载需要性能、弹性和安全性。使用 RustFS 对象存储优化此任务关键型备份。

---

## Veeam 和 RustFS 是天然的合作伙伴

Veeam 和 RustFS 都为各自的技术提供一流的软件解决方案。从 VM 到 Office 365，大规模性能是衡量端到端解决方案的指标。RustFS 对象存储提供当今市场上最具可扩展性和高性能的对象存储解决方案，是 Veeam 客户的理想选择。

## 核心优势

### ⚡ 快速备份是一回事，快速恢复是另一回事

无论大小，备份和恢复都需要快速进行。RustFS for Veeam Backup and Replication 能够在单个 32 节点集群中以超过 160 GiB/s 的速度读/写，能够以曾经被认为不可能的速度从对象存储进行备份和恢复。

### 🗃️ 元数据优势

使用外部表，企业可以享受 SQL Server 的全部功能，而不会产生移动数据的成本或协调的挑战。

由于 RustFS 以原子方式将元数据与对象数据一起写入，因此 Veeam 备份不需要外部元数据数据库（大多数情况下为 Cassandra）。这消除了与小物体相关的性能损失。RustFS 可在 Veeam 推荐的对象大小范围内提供性能，有助于快速删除和重复数据删除。

### 🔒 内联且严格一致

RustFS 中的数据始终是可读和一致的，因为所有 I/O 都与内联擦除码、bitrot 哈希和加密同步提交。RustFS 提供的 S3 服务可灵活应对繁忙事务中的任何中断或重启。异步 I/O 没有缓存或暂存数据。这保证了所有备份操作的成功。

### 🔧 与硬件无关

与 Veeam 一样，RustFS 与软件定义和硬件无关。这种方法为 Veeam 客户在设计系统以适应各种不同的备份用例时提供了巨大的节省和灵活性。

### 🚀 RustFS 和 Veeam：从对象存储备份和恢复

RustFS 和 Veeam 强强联手！将 RustFS 对象存储与 Veeam 结合部署可带来多种优势。其中包括与软件定义解决方案相关的优势、快速备份和恢复的性能特征，以及以原子方式写入元数据的对象存储的弹性和灵活性。
