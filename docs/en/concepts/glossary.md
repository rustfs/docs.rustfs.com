---
title: "Glossary"
description: "This article introduces commonly used vocabulary in object storage to help users quickly understand object storage"
---

# Object Storage Core Vocabulary Collection (100 Terms)

| No. | Term | Chinese | Description |
|------|--------------------------|------------------------------|--------------------------------------------------------------------------|
| 1 | Object Storage | 对象存储 | An architecture where data is stored as objects, replacing traditional file hierarchy structures |
| 2 | Bucket | 存储桶 | A container for storing objects with globally unique namespace |
| 3 | Object | 对象 | Basic storage unit containing data, metadata, and unique identifier (Object Key) |
| 4 | Metadata | 元数据 | Key-value pair information describing object attributes (such as file type, creation time) |
| 5 | S3-Compatible | S3 兼容 | Storage services compatible with Amazon S3 API standards |
| 6 | Data Durability | 数据持久性 | Probability of data being preserved long-term in the system without loss (e.g., 99.999999999%) |
| 7 | Replication | 多副本 | Redundancy technology that ensures data safety through multiple copies |
| 8 | Erasure Coding | 纠删码 | Technology that fragments and encodes data for high reliability with less space |
| 9 | Cold Storage | 冷存储 | Low-cost storage type for infrequently accessed data (such as archived data) |
| 10 | Lifecycle Management | 生命周期管理 | Policies for automatically transitioning/deleting objects (e.g., move to cold storage after 30 days) |
| 11 | Versioning | 版本控制 | Retaining historical versions of objects to prevent overwriting |
| 12 | Storage Class | 存储类型 | Different performance/cost storage tiers (Standard, Infrequent Access, Archive) |
| 13 | Access Key | 访问密钥 | Authentication keys for API requests (Access Key ID + Secret Access Key) |
| 14 | Region | 区域 | Geographic location of storage infrastructure (e.g., East China 1, US West) |
| 15 | Availability Zone (AZ) | 可用区 | Isolated data centers with independent power/network within the same region |
| 16 | Endpoint | 端点 | Domain address for accessing storage service (e.g., us-east1.rustfs.com) |
| 17 | RESTful API | RESTful API | API design specification based on HTTP protocol |
| 18 | Multipart Upload | 分片上传 | Mechanism for splitting large files for upload and merging |
| 19 | Pre-Signed URL | 预签名 URL | Temporary access links with time validity |
| 20 | Server-Side Encryption (SSE) | 服务端加密 | Automatic data encryption on server side (SSE-S3/SSE-KMS/SSE-C) |
| 21 | Client-Side Encryption (CSE) | 客户端加密 | Local encryption on client side before upload |
| 22 | Cross-Region Replication | 跨区域复制 | Automatic object replication across geographic regions |
| 23 | Access Control List (ACL) | 访问控制列表 | Rule list controlling access permissions for buckets/objects |
| 24 | Bucket Policy | 存储桶策略 | JSON-based fine-grained permission control policies |
| 25 | IAM | IAM | Identity and Access Management system for centralized user/role permission management |
| 26 | Event Notification | 事件通知 | Sending notifications to message queues/function computing when events trigger |
| 27 | Data Lake | 数据湖 | Repository for centralized storage of structured/unstructured data |
| 28 | Compliance | 合规性 | Meeting data storage regulatory requirements like GDPR, HIPAA |
| 29 | Logging & Audit | 日志审计 | Recording all API operation logs for auditing |
| 30 | Monitoring & Alerting | 监控告警 | Real-time monitoring of storage usage/requests with alerting |
| 31 | CORS | 跨域资源共享 | Rules controlling browser cross-origin resource access |
| 32 | Transfer Acceleration | 传输加速 | Optimizing upload/download speed through edge nodes |
| 33 | CDN Integration | CDN 加速 | Combining with Content Delivery Network for caching acceleration |
| 34 | Data Export | 数据导出 | Process of migrating data to other storage systems |
| 35 | Data Import | 数据导入 | Batch data migration from external systems to object storage |
| 36 | Static Website Hosting | 静态网站托管 | Directly hosting HTML/CSS/JS static files through buckets |
| 37 | Hotlink Protection | 防盗链 | Technology preventing external websites from stealing resource links |
| 38 | Request Rate Limiting | 请求速率限制 | Controlling API request frequency per user/IP |
| 39 | Tagging | 标签 | Adding classification tags to buckets/objects for management |
| 40 | Inventory Report | 清单报告 | Periodically generated CSV/ORC files listing storage objects |
| 41 | Data Restoration | 数据恢复 | Restoring data from archive storage to accessible state |
| 42 | Storage Gateway | 存储网关 | Access layer mapping object storage as local file system |
| 43 | Data Compression | 数据压缩 | Compressing data before upload to save storage space |
| 44 | Data Deduplication | 数据去重 | Eliminating duplicate data to reduce storage usage |
| 45 | Direct Read Archive | 直读归档 | Technology for directly reading archived data without restoration |
| 46 | Bandwidth Control | 流量控制 | Limiting download bandwidth to avoid network congestion |
| 47 | Concurrent Connections | 并发连接数 | Number of simultaneous data transfer connections |
| 48 | Data Migration Service | 数据迁移服务 | Automated migration tools (e.g., AWS Snowball) |
| 49 | Client SDK | 客户端 SDK | Developer toolkits for integrating storage services (e.g., Python/Java SDK) |
| 50 | CLI | 命令行工具 | Command line management tools (e.g., aws s3 cp) |
| 51 | Web Console | 图形化控制台 | Web-based management interface |
| 52 | Data Integrity Check | 数据校验 | Verifying transmission integrity through MD5/SHA |
| 53 | Resumable Upload/Download | 断点续传 | Continuing transfer from breakpoint after network interruption |
| 54 | Mirror Back to Source | 镜像回源 | Pulling and saving from specified origin when requested object doesn't exist |
| 55 | Canary Release | 灰度发布 | Release strategy gradually opening new features to some users |
| 56 | Soft Delete | 软删除 | Marking objects for deletion while maintaining recovery period |
| 57 | Object Lock | 对象锁定 | Compliance protection mechanism preventing object deletion or overwriting |
| 58 | Watermarking | 水印 | Adding identification information to images/videos |
| 59 | Thumbnail Generation | 缩略图生成 | Automatically creating thumbnail versions of images |
| 60 | Image Processing | 图片处理 | Online cropping/scaling/rotation processing functions |
| 61 | Video Transcoding | 视频转码 | Converting video formats/resolutions for different devices |
| 62 | Content Moderation | 内容审核 | Automatically detecting inappropriate images/videos/text |
| 63 | Cost Analysis | 成本分析 | Calculating costs by storage type/request count dimensions |
| 64 | Usage Monitoring | 用量监控 | Real-time dashboard viewing storage/traffic/request counts |
| 65 | Storage Analytics | 存储分析 | Tools analyzing storage patterns to optimize costs |
| 66 | Requester Pays | 请求者付费 | Billing model where data downloader bears the cost |
| 67 | Tiered Storage | 数据分层 | Automatically moving data to lower-cost storage tiers |
| 68 | Intelligent Tiering | 智能分层 | Automatically selecting optimal storage type based on access patterns |
| 69 | PrivateLink | 私有链接 | Accessing object storage through internal network avoiding public exposure |
| 70 | VPC Endpoint | VPC 端点 | Entry point for securely accessing storage services within Virtual Private Cloud |
| 71 | SSL/TLS | 传输加密 | Encrypting data transmission through HTTPS protocol |
| 72 | Client-Side Encryption | 客户端加密 | Users encrypting data themselves before upload |
| 73 | KMS | KMS | Key Management Service for centralized encryption key management |
| 74 | Permission Boundary | 权限边界 | Limiting maximum permission scope of IAM roles/users |
| 75 | Temporary Credentials | 临时凭证 | Short-term valid access tokens (e.g., STS Token) |
| 76 | MFA Delete | MFA 删除保护 | Requiring multi-factor authentication to delete data |
| 77 | Immutability | 数据不可变性 | Property preventing data tampering (combined with WORM model) |
| 78 | Legal Hold | 法律保留 | Mandatory protection prohibiting data deletion/modification in compliance scenarios |
| 79 | Cross-Account Sharing | 跨账户共享 | Allowing other cloud accounts to access specified storage resources |
| 80 | Prefetch Policy | 预取策略 | Loading data into cache in advance to accelerate subsequent access |
| 81 | Cache-Control | 缓存控制 | Specifying browser/CDN caching behavior through HTTP headers |
| 82 | Delayed Deletion | 延迟删除 | Delaying deletion operations to prevent accidental actions |
| 83 | Batch Operations | 批量操作 | Performing unified operations on multiple objects (delete/copy/restore) |
| 84 | Data Lineage | 数据血缘 | Metadata records tracking data sources and change history |
| 85 | Data Catalog | 数据目录 | Retrieval system storing metadata information |
| 86 | Storage Gateway | 存储网关 | Hybrid cloud solution connecting local systems with cloud storage |
| 87 | Hybrid Cloud Storage | 混合云存储 | Architecture using both local storage and cloud storage |
| 88 | Edge Storage | 边缘存储 | Providing storage services at edge nodes close to data sources |
| 89 | Multi-Cloud Storage | 多云存储 | Storage solutions across different cloud service providers |
| 90 | Storage Federation | 存储联盟 | Abstraction layer for unified management of multiple storage systems |
| 91 | Object Tag | 对象标签 | Adding custom classification tags to objects |
| 92 | Bucket Tag | 存储桶标签 | Adding management/billing related tags to buckets |
| 93 | Storage Quota | 存储配额 | Limiting maximum capacity of buckets |
| 94 | Request Throttling | 请求限速 | Limiting API requests per unit time |
| 95 | SLA | 服务等级协议 | Service Level Agreement commitments for availability/durability (e.g., 99.9% availability) |
| 96 | Disaster Recovery | 灾难恢复 | Ensuring business continuity through cross-region backups |
| 97 | Storage Topology | 存储拓扑 | Distribution structure of data at physical/logical levels |
| 98 | Proximity Access | 就近访问 | Routing user requests to nearest storage nodes |
| 99 | Global Namespace | 全球统一命名空间 | Unified view management of cross-region buckets |
| 100 | Zero-Copy Migration | 零拷贝迁移 | Fast data migration through metadata operations |
