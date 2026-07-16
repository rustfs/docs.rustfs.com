---
title: "Glossary"
description: "This article introduces commonly used vocabulary in object storage to help users quickly understand object storage"
---

| Term | Description |
|--------------------------|--------------------------------------------------------------------------|
| Object Storage | An architecture where data is stored as objects, replacing traditional file hierarchy structures |
| Bucket | A container for storing objects with globally unique namespace |
| Object | Basic storage unit containing data, metadata, and unique identifier (Object Key) |
| Metadata | Key-value pair information describing object attributes (such as file type, creation time) |
| S3-Compatible | Storage services compatible with Amazon S3 API standards |
| Data Durability | The probability that data remains intact and accessible over a period of time (e.g., 99.999999999%) |
| Replication | Redundancy technology that ensures data safety through multiple copies |
| Erasure Coding | A method of data protection in which data is broken into fragments, expanded and encoded with redundant data pieces |
| Cold Storage | Low-cost storage type for infrequently accessed data (such as archived data) |
| Lifecycle Management | Policies for automatically transitioning/deleting objects (e.g., move to cold storage after 30 days) |
| Versioning | Retaining historical versions of objects to prevent overwriting |
| Storage Class | Different performance/cost storage tiers (Standard, Infrequent Access, Archive) |
| Access Key | Authentication keys for API requests (Access Key ID + Secret Access Key) |
| Region | Geographic location of storage infrastructure (e.g., East China 1, US West) |
| Availability Zone (AZ) | Isolated data centers with independent power/network within the same region |
| Endpoint | Domain address for accessing storage service (e.g., us-east1.rustfs.com) |
| RESTful API | API design specification based on HTTP protocol |
| Multipart Upload | Mechanism for splitting large files for upload and merging |
| Pre-Signed URL | Temporary access links with time validity |
| Server-Side Encryption (SSE) | Automatic data encryption on server side (SSE-S3/SSE-KMS/SSE-C) |
| Client-Side Encryption (CSE) | Local encryption on client side before upload |
| Cross-Region Replication | Automatic object replication across geographic regions |
| Access Control List (ACL) | Rule list controlling access permissions for buckets/objects |
| Bucket Policy | JSON-based fine-grained permission control policies |
| IAM | Identity and Access Management system for centralized user/role permission management |
| Event Notification | Sending notifications to message queues/function computing when events trigger |
| Data Lake | Repository for centralized storage of structured/unstructured data |
| Compliance | Meeting data storage regulatory requirements like GDPR, HIPAA |
| Logging & Audit | Recording all API operation logs for auditing |
| Monitoring & Alerting | Real-time monitoring of storage usage/requests with alerting |
| CORS | Rules controlling browser cross-origin resource access |
| Transfer Acceleration | Optimizing upload/download speed through edge nodes |
| CDN Integration | Combining with Content Delivery Network for caching acceleration |
| Data Export | Process of migrating data to other storage systems |
| Data Import | Batch data migration from external systems to object storage |
| Static Website Hosting | Directly hosting HTML/CSS/JS static files through buckets |
| Hotlink Protection | Technology preventing external websites from stealing resource links |
| Request Rate Limiting | Controlling API request frequency per user/IP |
| Tagging | Adding classification tags to buckets/objects for management |
| Inventory Report | Periodically generated CSV/ORC files listing storage objects |
| Data Restoration | Restoring data from archive storage to accessible state |
| Storage Gateway | Access layer mapping object storage as a local file system; also a hybrid cloud solution connecting local systems with cloud storage |
| Data Compression | Compressing data before upload to save storage space |
| Data Deduplication | Eliminating duplicate data to reduce storage usage |
| Direct Read Archive | Technology for directly reading archived data without restoration |
| Bandwidth Control | Limiting download bandwidth to avoid network congestion |
| Concurrent Connections | Number of simultaneous data transfer connections |
| Data Migration Service | Automated migration tools (e.g., AWS Snowball) |
| Client SDK | Developer toolkits for integrating storage services (e.g., Python/Java SDK) |
| CLI | Command line management tools (e.g., aws s3 cp) |
| Web Console | Web-based management interface |
| Data Integrity Check | Verifying transmission integrity through MD5/SHA |
| Resumable Upload/Download | Continuing transfer from breakpoint after network interruption |
| Mirror Back to Source | Pulling and saving from specified origin when requested object doesn't exist |
| Canary Release | Release strategy gradually opening new features to some users |
| Soft Delete | Marking objects for deletion while maintaining recovery period |
| Object Lock | Compliance protection mechanism preventing object deletion or overwriting |
| Watermarking | Adding identification information to images/videos |
| Thumbnail Generation | Automatically creating thumbnail versions of images |
| Image Processing | Online cropping/scaling/rotation processing functions |
| Video Transcoding | Converting video formats/resolutions for different devices |
| Content Moderation | Automatically detecting inappropriate images/videos/text |
| Cost Analysis | Calculating costs by storage type/request count dimensions |
| Usage Monitoring | Real-time dashboard viewing storage/traffic/request counts |
| Storage Analytics | Tools analyzing storage patterns to optimize costs |
| Requester Pays | Billing model where data downloader bears the cost |
| Tiered Storage | Automatically moving data to lower-cost storage tiers |
| Intelligent Tiering | Automatically selecting optimal storage type based on access patterns |
| PrivateLink | Accessing object storage through internal network avoiding public exposure |
| VPC Endpoint | Entry point for securely accessing storage services within Virtual Private Cloud |
| SSL/TLS | Encrypting data transmission through HTTPS protocol |
| Client-Side Encryption | Users encrypting data themselves before upload |
| KMS | Key Management Service for centralized encryption key management |
| Permission Boundary | Limiting maximum permission scope of IAM roles/users |
| Temporary Credentials | Short-term valid access tokens (e.g., STS Token) |
| MFA Delete | Requiring multi-factor authentication to delete data |
| Immutability | Property preventing data tampering (combined with WORM model) |
| Legal Hold | Mandatory protection prohibiting data deletion/modification in compliance scenarios |
| Cross-Account Sharing | Allowing other cloud accounts to access specified storage resources |
| Prefetch Policy | Loading data into cache in advance to accelerate subsequent access |
| Cache-Control | Specifying browser/CDN caching behavior through HTTP headers |
| Delayed Deletion | Delaying deletion operations to prevent accidental actions |
| Batch Operations | Performing unified operations on multiple objects (delete/copy/restore) |
| Data Lineage | Metadata records tracking data sources and change history |
| Data Catalog | Retrieval system storing metadata information |
| Hybrid Cloud Storage | Architecture using both local storage and cloud storage |
| Edge Storage | Providing storage services at edge nodes close to data sources |
| Multi-Cloud Storage | Storage solutions across different cloud service providers |
| Storage Federation | Abstraction layer for unified management of multiple storage systems |
| Object Tag | Adding custom classification tags to objects |
| Bucket Tag | Adding management/billing related tags to buckets |
| Storage Quota | Limiting maximum capacity of buckets |
| Request Throttling | Limiting API requests per unit time |
| SLA | Service Level Agreement commitments for availability/durability (e.g., 99.9% availability) |
| Disaster Recovery | Ensuring business continuity through cross-region backups |
| Storage Topology | Distribution structure of data at physical/logical levels |
| Proximity Access | Routing user requests to nearest storage nodes |
| Global Namespace | Unified view management of cross-region buckets |
| Zero-Copy Migration | Fast data migration through metadata operations |
| SNSD (Single-Node Single-Disk) | Deployment topology with one server and one data disk, suited for testing and development; see [Single Node Single Disk Mode](../installation/linux/single-node-single-disk.md) |
| SNMD (Single-Node Multiple-Disk) | Deployment topology with one server and multiple data disks, providing disk-level redundancy via erasure coding; see [Single Node Multiple Disk Mode](../installation/linux/single-node-multiple-disk.md) |
| MNMD (Multiple-Node Multiple-Disk) | Distributed deployment topology across multiple servers and disks, recommended for production; see [Multiple Node Multiple Disk Mode](../installation/linux/multiple-node-multiple-disk.md) |
