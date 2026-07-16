# Amazon S3 Compatibility (/features/s3-compatibility)





S3 compatibility is essential for cloud-native applications. RustFS strictly adheres to S3 API standards. RustFS offers a widely tested S3 alternative.

## RustFS and S3 API - Designed for Multi-Cloud Storage [#rustfs-and-s3-api---designed-for-multi-cloud-storage]

RustFS prioritizes S3 compatibility. As an early adopter of the S3 API (V2 and V4), RustFS ensures compatibility across public cloud, private cloud, data center, multi-cloud, hybrid cloud, and edge environments.

## S3 Enables Hybrid and Multi-Cloud Computing [#s3-enables-hybrid-and-multi-cloud-computing]

S3 is the standard for multi-cloud compatibility. As a RESTful API standard, S3 facilitates interactions between applications, data, and infrastructure.

Kubernetes-native, S3-compatible object storage and applications can run anywhere - from public cloud instances (Google, Azure, AWS) to private clouds (Red Hat OpenShift, VMware Tanzu) and bare metal.

## S3 Compatibility for Bare Metal Workloads [#s3-compatibility-for-bare-metal-workloads]

Private cloud is a fundamental building block of hybrid cloud architecture. S3 compatibility is crucial for all applications, from analytics to archiving.

With RustFS, S3 compatibility is location-independent. RustFS bare metal instances have the same S3 compatibility and performance as public cloud or edge instances.

## Advantages of RustFS Scalable Object Storage [#advantages-of-rustfs-scalable-object-storage]

Cloud-native applications use the S3 API to communicate with object storage. Many vendors only support a subset of functionality.

RustFS has a proven track record of S3 compatibility. We test millions of hardware, software, and application combinations. RustFS releases software weekly, and community-reported defects are promptly addressed.

Comprehensive S3 API support means applications can leverage data stored in RustFS on any hardware, location, or cloud.

## Core Features [#core-features]

### S3 Select [#s3-select]

<img alt="S3 Select" src="__img0" />

S3 Select relies on performance for complex queries. RustFS leverages SIMD instruction sets to optimize performance, running complex S3 Select queries on CSV, Parquet, JSON, and more.

### Amazon Signature V4 [#amazon-signature-v4]

<Mermaid
  chart="flowchart LR
    A1[&#x22;1. Create canonical request&#x22;]
    A2[&#x22;2. Create string to sign&#x22;]
    A3[&#x22;3. Calculate signature&#x22;]
    A4[&#x22;4. Add signature to request&#x22;]
    A1 --> A2 --> A3 --> A4
    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;
    class A1,A2,A3,A4 svc"
/>

Applications and clients must authenticate to access RustFS management APIs. RustFS supports AWS Signature Version 4. After authentication, RustFS uses policy-based access control compatible with AWS IAM to authorize operations.

## AWS S3 API and RustFS [#aws-s3-api-and-rustfs]

RustFS is a high-performance object storage. Combined with S3 compatibility, it supports a wide set of use cases, including code repositories (GitHub, GitLab), analytics (MongoDB, ClickHouse, MariaDB, CockroachDB, Teradata), and archiving/backup.

RustFS is ideal for AI/ML and data science workloads. KubeFlow and TensorFlow require high-performance S3-compatible object storage. RustFS provides multi-cloud object storage and efficient replication.
