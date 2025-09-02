---
title: "Bare Metal and Virtualized Deployment Supporting Windows/Linux"
description: "Open source, S3-compatible, enterprise-hardened, and extremely fast."
---

# Bare Metal and Virtualized Deployment Supporting Windows/Linux

Open source, S3-compatible, enterprise-hardened, and extremely fast.

RustFS is a high-performance distributed object storage system. It is software-defined, runs on industry-standard hardware, and is 100% open source with Apache V2.0 as the primary open source license.

What makes RustFS different is that it was designed from the ground up to be the standard for private cloud/hybrid cloud object storage. Because RustFS is built specifically to serve objects only, the single-layer architecture can achieve all necessary functionality without compromising performance. The result is a cloud-native object server that is simultaneously high-performance, scalable, and lightweight.

While RustFS excels in traditional object storage use cases such as secondary storage, disaster recovery, and archiving, it stands out in overcoming challenges related to machine learning, analytics, and cloud-native application workloads.

## Core Features

### Erasure Coding

RustFS uses inline erasure coding written in assembly code for each object to protect data while providing the highest possible performance. RustFS uses Reed-Solomon codes to stripe objects into data and parity blocks with user-configurable redundancy levels. RustFS's erasure coding performs repairs at the object level and can independently repair multiple objects.

With maximum parity of N/2, RustFS's implementation can ensure uninterrupted read and write operations using only ((N/2)+1) operational drives in deployment. For example, in a 12-drive setup, RustFS shards objects between 6 data drives and 6 parity drives, and can reliably write new objects or rebuild existing objects with only 7 drives remaining in deployment.

![Erasure Coding](./images/sec2-1.png)

### Bitrot Protection

Silent data corruption or bitrot is a serious problem facing disk drives, causing data to be corrupted without user awareness. The causes are multiple (drive aging, current spikes, disk firmware errors, phantom writes, misdirected reads/writes, driver errors, accidental overwrites), but the result is the same - data corruption.

RustFS's optimized implementation of the HighwayHash algorithm ensures it never reads corrupted data - it can catch and repair corrupted objects instantly. By calculating hashes on READ and verifying them on WRITE from application, network to memory/drive, it ensures end-to-end integrity. The implementation is designed for speed and can achieve hash speeds exceeding 10 GB/s on a single core on Intel CPUs.

![Bitrot Protection](./images/sec2-2.png)

### Server-Side Encryption

Encrypting data in flight is one thing; protecting data at rest is another. RustFS supports multiple sophisticated server-side encryption schemes to protect data - regardless of where the data resides. RustFS's approach ensures confidentiality, integrity, and authenticity with negligible performance overhead. Server-side and client-side encryption are supported using AES-256-GCM, ChaCha20-Poly1305, and AES-CBC.

Encrypted objects are tamper-proof using AEAD server-side encryption. Additionally, RustFS is compatible and tested with all common key management solutions (such as HashiCorp Vault). RustFS uses Key Management System (KMS) to support SSE-S3.

If a client requests SSE-S3 or auto-encryption is enabled, the RustFS server encrypts each object with a unique object key protected by a master key managed by KMS. Given the extremely low overhead, auto-encryption can be enabled for every application and instance.

![Server-Side Encryption](./images/sec2-3.png)

### WORM (Write Once Read Many)

#### Identity Management

RustFS supports the most advanced standards in identity management and can integrate with OpenID connect compatible providers as well as major external IDP vendors. This means access is centralized, passwords are temporary and rotated, rather than stored in configuration files and databases. Additionally, access policies are fine-grained and highly configurable, meaning supporting multi-tenant and multi-instance deployments becomes simple.

#### Continuous Replication

The challenge with traditional replication methods is that they don't scale effectively beyond a few hundred TiB. That said, everyone needs a replication strategy to support disaster recovery, and that strategy needs to span geographic locations, data centers, and clouds.

RustFS's continuous replication is designed for large-scale, cross-data center deployments. By leveraging Lambda compute notifications and object metadata, it can efficiently and quickly calculate increments. Lambda notifications ensure immediate propagation of changes rather than traditional batch modes.

Continuous replication means that in case of failure, data loss will be kept to a minimum - even in the face of highly dynamic datasets. Finally, like everything RustFS does, continuous replication is multi-vendor, meaning your backup location can be anywhere from NAS to public cloud.

#### Global Federation

Modern enterprise data is everywhere. RustFS allows these disparate instances to be combined to form a unified global namespace. Specifically, any number of RustFS servers can be combined into a distributed mode set, and multiple distributed mode sets can be combined into a RustFS server federation. Each RustFS server federation provides unified administration and namespace.

RustFS federated servers support unlimited numbers of distributed mode sets. The impact of this approach is that object storage can scale massively for large enterprises with geographically dispersed locations while retaining the ability to accommodate various applications (Splunk, Teradata, Spark, Hive, Presto, TensorFlow, H20) from a single console.

#### Multi-Cloud Gateway

All enterprises are adopting multi-cloud strategies. This includes private clouds as well. Therefore, your bare metal virtualized containers and public cloud services (including non-S3 providers like Google, Microsoft, and Alibaba) must look the same. While modern applications are highly portable, the data supporting these applications is not.

Providing access to this data regardless of where it resides is the primary challenge RustFS solves. RustFS runs on bare metal, network-attached storage, and every public cloud. More importantly, RustFS ensures that from an application and management perspective, the view of that data looks exactly the same through the Amazon S3 API.

RustFS can go further, making your existing storage infrastructure Amazon S3 compatible. The implications are profound. Now organizations can truly unify their data infrastructure - from file to block, all data appears as objects accessible through the Amazon S3 API without migration.

When WORM is enabled, RustFS disables all APIs that might alter object data and metadata. This means data becomes tamper-proof once written. This has practical applications in many different regulatory requirements.

![WORM Feature](./images/sec2-4.png)

## System Architecture

RustFS is designed to be cloud-native and can run as lightweight containers managed by external orchestration services like Kubernetes. The entire server is a static binary of about 40 MB that efficiently uses CPU and memory resources even under high load. As a result, you can co-host a large number of tenants on shared hardware.

RustFS runs on commodity servers with locally attached drives (JBOD/JBOF). All servers in the cluster are functionally equal (completely symmetric architecture). There are no name nodes or metadata servers.

RustFS writes data and metadata together as objects, requiring no metadata database. Additionally, RustFS performs all functions (erasure coding, bitrot checking, encryption) as inline, strictly consistent operations. The result is that RustFS has extraordinary resilience.

Each RustFS cluster is a collection of distributed RustFS servers with one process per node. RustFS runs as a single process in user space and uses lightweight coroutines to achieve high concurrency. Drives are grouped into erasure sets (16 drives per set by default) and objects are placed on these sets using deterministic hashing algorithms.

RustFS is designed for large-scale, multi-data center cloud storage services. Each tenant runs their own RustFS cluster, completely isolated from other tenants, enabling them to protect against any disruptions from upgrades, updates, and security events. Each tenant scales independently by federating clusters across geographic locations.
