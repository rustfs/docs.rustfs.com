---
title: "Glossary"
description: "This article introduces commonly used vocabulary in object storage to help users quickly understand object storage"
---

# Object Storage Core Vocabulary Collection (100 Terms)

| No. | Term | Description |
|------|--------------------------|--------------------------------------------------------------------------|
| 1 | Object Storage | An architecture where data is stored as objects, replacing traditional file hierarchy structures |
| 2 | Bucket | A container for storing objects with globally unique namespace |
| 3 | Object | Basic storage unit containing data, metadata, and unique identifier (Object Key) |
| 4 | Metadata | Key-value pair information describing object attributes (such as file type, creation time) |
| 5 | S3-Compatible | Storage services compatible with Amazon S3 API standards |
| 6 | Data Durability | The probability that data remains intact and accessible over a period of time (e.g., 99.999999999%) |
| 7 | Replication | Redundancy technology that ensures data safety through multiple copies |
| 8 | Erasure Coding | A method of data protection in which data is broken into fragments, expanded and encoded with redundant data pieces |
| 9 | Cold Storage | Low-cost storage type for infrequently accessed data (such as archived data) |
| 10 | Lifecycle Management | Policies for automatically transitioning/deleting objects (e.g., move to cold storage after 30 days) |
| 11 | Versioning | Retaining historical versions of objects to prevent overwriting |
| 12 | Storage Class | Different performance/cost storage tiers (Standard, Infrequent Access, Archive) |
| 13 | Access Key | Authentication keys for API requests (Access Key ID + Secret Access Key) |
| 14 | Region | Geographic location of storage infrastructure (e.g., East China 1, US West) |
| 15 | Availability Zone (AZ) | Isolated data centers with independent power/network within the same region |
| 16 | Endpoint | Domain address for accessing storage service (e.g., us-east1.rustfs.com) |
| 17 | RESTful API | API design specification based on HTTP protocol |
| 18 | Multipart Upload | Mechanism for splitting large files for upload and merging |
| 19 | Pre-Signed URL | Temporary access links with time validity |
| 20 | Server-Side Encryption (SSE) | Automatic data encryption on server side (SSE-S3/SSE-KMS/SSE-C) |
| 21 | Client-Side Encryption (CSE) | Local encryption on client side before upload |
| 22 | Cross-Region Replication | Automatic object replication across geographic regions |
| 23 | Access Control List (ACL) | Rule list controlling access permissions for buckets/objects |
| 24 | Bucket Policy | JSON-based fine-grained permission control policies |
| 25 | IAM | Identity and Access Management system for centralized user/role permission management |
| 26 | Event Notification | Sending notifications to message queues/function computing when events trigger |
| 27 | Data Lake | Repository for centralized storage of structured/unstructured data |
| 28 | Compliance | Meeting data storage regulatory requirements like GDPR, HIPAA |
| 29 | Logging & Audit | Recording all API operation logs for auditing |
| 30 | Monitoring & Alerting | Real-time monitoring of storage usage/requests with alerting |
| 31 | CORS | Rules controlling browser cross-origin resource access |
| 32 | Transfer Acceleration | Optimizing upload/download speed through edge nodes |
| 33 | CDN Integration | Combining with Content Delivery Network for caching acceleration |
| 34 | Data Export | Process of migrating data to other storage systems |
| 35 | Data Import | Batch data migration from external systems to object storage |
| 36 | Static Website Hosting | Directly hosting HTML/CSS/JS static files through buckets |
| 37 | Hotlink Protection | Technology preventing external websites from stealing resource links |
| 38 | Request Rate Limiting | Controlling API request frequency per user/IP |
| 39 | Tagging | Adding classification tags to buckets/objects for management |
| 40 | Inventory Report | Periodically generated CSV/ORC files listing storage objects |
| 41 | Data Restoration | Restoring data from archive storage to accessible state |
| 42 | Storage Gateway | Access layer mapping object storage as local file system |
| 43 | Data Compression | Compressing data before upload to save storage space |
| 44 | Data Deduplication | Eliminating duplicate data to reduce storage usage |
| 45 | Direct Read Archive | Technology for directly reading archived data without restoration |
| 46 | Bandwidth Control | Limiting download bandwidth to avoid network congestion |
| 47 | Concurrent Connections | Number of simultaneous data transfer connections |
| 48 | Data Migration Service | Automated migration tools (e.g., AWS Snowball) |
| 49 | Client SDK | Developer toolkits for integrating storage services (e.g., Python/Java SDK) |
| 50 | CLI | Command line management tools (e.g., aws s3 cp) |
| 51 | Web Console | Web-based management interface |
| 52 | Data Integrity Check | Verifying transmission integrity through MD5/SHA |
| 53 | Resumable Upload/Download | Continuing transfer from breakpoint after network interruption |
| 54 | Mirror Back to Source | Pulling and saving from specified origin when requested object doesn't exist |
| 55 | Canary Release | Release strategy gradually opening new features to some users |
| 56 | Soft Delete | Marking objects for deletion while maintaining recovery period |
| 57 | Object Lock | Compliance protection mechanism preventing object deletion or overwriting |
| 58 | Watermarking | Adding identification information to images/videos |
| 59 | Thumbnail Generation | Automatically creating thumbnail versions of images |
| 60 | Image Processing | Online cropping/scaling/rotation processing functions |
| 61 | Video Transcoding | Converting video formats/resolutions for different devices |
| 62 | Content Moderation | Automatically detecting inappropriate images/videos/text |
| 63 | Cost Analysis | Calculating costs by storage type/request count dimensions |
| 64 | Usage Monitoring | Real-time dashboard viewing storage/traffic/request counts |
| 65 | Storage Analytics | Tools analyzing storage patterns to optimize costs |
| 66 | Requester Pays | Billing model where data downloader bears the cost |
| 67 | Tiered Storage | Automatically moving data to lower-cost storage tiers |
| 68 | Intelligent Tiering | Automatically selecting optimal storage type based on access patterns |
| 69 | PrivateLink | Accessing object storage through internal network avoiding public exposure |
| 70 | VPC Endpoint | Entry point for securely accessing storage services within Virtual Private Cloud |
| 71 | SSL/TLS | Encrypting data transmission through HTTPS protocol |
| 72 | Client-Side Encryption | Users encrypting data themselves before upload |
| 73 | KMS | Key Management Service for centralized encryption key management |
| 74 | Permission Boundary | Limiting maximum permission scope of IAM roles/users |
| 75 | Temporary Credentials | Short-term valid access tokens (e.g., STS Token) |
| 76 | MFA Delete | Requiring multi-factor authentication to delete data |
| 77 | Immutability | Property preventing data tampering (combined with WORM model) |
| 78 | Legal Hold | Mandatory protection prohibiting data deletion/modification in compliance scenarios |
| 79 | Cross-Account Sharing | Allowing other cloud accounts to access specified storage resources |
| 80 | Prefetch Policy | Loading data into cache in advance to accelerate subsequent access |
| 81 | Cache-Control | Specifying browser/CDN caching behavior through HTTP headers |
| 82 | Delayed Deletion | Delaying deletion operations to prevent accidental actions |
| 83 | Batch Operations | Performing unified operations on multiple objects (delete/copy/restore) |
| 84 | Data Lineage | Metadata records tracking data sources and change history |
| 85 | Data Catalog | Retrieval system storing metadata information |
| 86 | Storage Gateway | Hybrid cloud solution connecting local systems with cloud storage |
| 87 | Hybrid Cloud Storage | Architecture using both local storage and cloud storage |
| 88 | Edge Storage | Providing storage services at edge nodes close to data sources |
| 89 | Multi-Cloud Storage | Storage solutions across different cloud service providers |
| 90 | Storage Federation | Abstraction layer for unified management of multiple storage systems |
| 91 | Object Tag | Adding custom classification tags to objects |
| 92 | Bucket Tag | 存储桶标签 | Adding management/billing related tags to buckets |
| 93 | Storage Quota | 存储配额 | Limiting maximum capacity of buckets |
| 94 | Request Throttling | 请求限速 | Limiting API requests per unit time |
| 95 | SLA | 服务等级协议 | Service Level Agreement commitments for availability/durability (e.g., 99.9% availability) |
| 96 | Disaster Recovery | 灾难恢复 | Ensuring business continuity through cross-region backups |
| 97 | Storage Topology | 存储拓扑 | Distribution structure of data at physical/logical levels |
| 98 | Proximity Access | 就近访问 | Routing user requests to nearest storage nodes |
| 99 | Global Namespace | 全球统一命名空间 | Unified view management of cross-region buckets |
| 100 | Zero-Copy Migration | 零拷贝迁移 | Fast data migration through metadata operations |
