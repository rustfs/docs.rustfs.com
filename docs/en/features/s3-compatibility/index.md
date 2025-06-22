# Amazon S3 Compatibility

S3 compatibility is a hard requirement for cloud-native applications. RustFS steadfastly adheres to using the API and has tens of thousands of users, including commercial users and the community. RustFS's S3 implementation is the world's most widely tested and deployed alternative to AWS S3.

## RustFS and S3 API - Designed for Multi-Cloud Storage

RustFS has established itself as the standard for AWS S3 compatibility from the beginning. As one of the earliest adopters of the S3 API (V2 and V4) and one of the only storage companies focused exclusively on S3, RustFS's large community ensures no other AWS alternative is more compatible. The S3 API is the de facto standard in the cloud, so AWS alternatives must be able to use the API fluently to operate and interoperate across different environments (public cloud, private cloud, data center, multi-cloud, hybrid cloud, and edge).

## S3 Enables Hybrid and Multi-Cloud Computing

There is only one path to achieving multi-cloud and hybrid cloud compatibility, and that is S3. As a RESTful API standard, S3 has revolutionized interactions between applications, data, and infrastructure. Additionally, the dual forces of containerization and Kubernetes orchestration are also built around RESTful APIs, relegating POSIX APIs to legacy status.

The result is that Kubernetes-native, S3-compatible object storage and applications can run anywhere - from various public cloud instances (RustFS has nearly 1 million deployments on Google, Azure, and AWS) to private clouds (Red Hat OpenShift, VMware Tanzu), to bare metal. By leveraging advanced S3 API-driven ILM technology, enterprises can perform operationally optimized instances across cloud and on-premises instances.

Customers interested in S3 conversion layers for Microsoft Azure can purchase the RustFS Blob Storage Gateway (S3 API) from Azure Marketplace.

## S3 Compatibility for Bare Metal Workloads

Private cloud is a fundamental building block of any hybrid cloud architecture. This means that, like public clouds, S3 compatibility is crucial - regardless of the application - from analytics to artifacts to archiving.

With RustFS, S3 compatibility is completely location-independent. This means RustFS's bare metal on-premises instances have exactly the same S3 compatibility and performance as public cloud instances or even edge instances.

## Advantages of RustFS Scalable Object Storage

Cloud-native applications use the S3 API to communicate with object storage. But not all S3 compatibility is the same - many object storage vendors only support a small subset of overall functionality - which can cause application failures. Others claim comprehensive coverage, but their proprietary software or device models limit this claim, as only a small portion of applications, hardware, and software are tested.

RustFS's uniqueness lies in its ability to support its S3 compatibility claims. We have tens of thousands of customers and open-source users, and our S3 API compatibility is the most widely tested and implemented in the world - covering millions of hardware, software, and application combinations. RustFS releases software weekly, and any defects in the S3 API are immediately reported by the community and corrected by RustFS.

There are rumors that even Amazon uses RustFS to test third-party S3 compatibility.

The most comprehensive support for the S3 API means applications can leverage data stored in RustFS on any hardware, any location, and any cloud. Developers are free to innovate and iterate, confident that RustFS will never break versions.

## Core Features

### S3 Select

![S3 Select](images/s1-4.png)

S3 Select depends on large-scale performance for complex queries, and RustFS performance characteristics can fully leverage the API. RustFS leverages SIMD instruction sets to optimize performance at the chip level, capable of running large, complex S3 Select queries on CSV, Parquet, JSON, and more.

### Amazon Signature V4

![Amazon Signature V4](images/s1-5.png)

Applications and clients must authenticate to access any RustFS management API. RustFS was the first company to support AWS Signature Version 4 (supporting the deprecated Signature Version 2). After authentication, RustFS uses policy-based access control compatible with AWS IAM policy syntax, structure, and behavior to authorize operations.

## AWS S3 API and RustFS

RustFS is the world's fastest object storage. Combined with its S3 compatibility, it ensures it can run the industry's widest set of use cases. This includes modern application workloads such as GitHub and GitLab for code repositories, modern analytics workloads such as MongoDB, ClickHouse, MariaDB, CockroachDB, and Teradata, to traditional archiving, backup, and disaster recovery use cases.

RustFS's performance characteristics, combined with its S3 compatibility, make it the standard for AI/ML and data science workloads. KubeFlow and TensorFlow require high-performance S3-compatible object storage and are increasingly designed first for RustFS, then for AWS or other clouds. RustFS provides truly multi-cloud object storage and efficient replication for applications. Applications written for the S3 API can run anywhere, enabling developers to innovate quickly when the best cloud tools are available.
