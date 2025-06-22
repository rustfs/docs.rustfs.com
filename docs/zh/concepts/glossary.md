---
title: "词汇说明"
description: "本文介绍对象存储中经常会用到的词汇，方便用户快速了解对象存储"
---

# 对象存储核心词汇全集（100 项）

| 序号 | 词汇 | 英文 | 解释说明 |
|------|--------------------------|------------------------------|--------------------------------------------------------------------------|
| 1 | 对象存储 | Object Storage | 数据以对象（Object）形式存储的架构，取代传统文件层级结构 |
| 2 | 存储桶 | Bucket | 存放对象的容器，全局唯一命名空间 |
| 3 | 对象 | Object | 存储基本单元，包含数据、元数据和唯一标识符（Object Key） |
| 4 | 元数据 | Metadata | 描述对象属性的键值对信息（如文件类型、创建时间） |
| 5 | S3 兼容 | S3-Compatible | 兼容亚马逊 S3 API 标准的存储服务 |
| 6 | 数据持久性 | Data Durability | 数据在系统中长期保存不丢失的概率（如 99.999999999%） |
| 7 | 多副本 | Replication | 通过多个副本保障数据安全的冗余技术 |
| 8 | 纠删码 | Erasure Coding | 将数据分片并编码存储，用更少空间实现高可靠性 |
| 9 | 冷存储 | Cold Storage | 低频访问数据的低成本存储类型（如归档数据） |
| 10 | 生命周期管理 | Lifecycle Management | 自动转移/删除对象的策略（如 30 天后转冷存储） |
| 11 | 版本控制 | Versioning | 保留对象历史版本防止覆盖 |
| 12 | 存储类型 | Storage Class | 不同性能/成本的存储层级（标准型、低频型、归档型） |
| 13 | 访问密钥 | Access Key | API 请求的身份验证密钥（Access Key ID + Secret Access Key） |
| 14 | 区域 | Region | 存储基础设施的地理位置（如华东 1、美西） |
| 15 | 可用区 | Availability Zone (AZ) | 同一区域内独立供电/网络的隔离机房 |
| 16 | 端点 | Endpoint | 访问存储服务的域名地址（如 us-east1.rustfs.com） |
| 17 | RESTful API | RESTful API | 基于 HTTP 协议的 API 设计规范 |
| 18 | 分片上传 | Multipart Upload | 大文件分割上传并合并的机制 |
| 19 | 预签名 URL | Pre-Signed URL | 带有时效性的临时访问链接 |
| 20 | 服务端加密 | SSE | 服务器端自动加密数据（SSE-S3/SSE-KMS/SSE-C） |
| 21 | 客户端加密 | CSE | 客户端本地加密后上传 |
| 22 | 跨区域复制 | Cross-Region Replication | 自动跨地理区域复制对象 |
| 23 | 访问控制列表 | ACL | 控制存储桶/对象访问权限的规则列表 |
| 24 | 存储桶策略 | Bucket Policy | 基于 JSON 的精细化权限控制策略 |
| 25 | IAM | Identity and Access Management | 集中管理用户/角色的访问权限系统 |
| 26 | 事件通知 | Event Notification | 触发事件时向消息队列/函数计算发送通知 |
| 27 | 数据湖 | Data Lake | 集中存储结构化/非结构化数据的仓库 |
| 28 | 合规性 | Compliance | 符合 GDPR、HIPAA 等数据存储法规的要求 |
| 29 | 日志审计 | Logging & Audit | 记录所有 API 操作日志用于审计 |
| 30 | 监控告警 | Monitoring & Alerting | 实时监控存储用量/请求数并触发告警 |
| 31 | 跨域资源共享 | CORS | 控制浏览器跨域访问资源的规则 |
| 32 | 传输加速 | Transfer Acceleration | 通过边缘节点优化上传/下载速度 |
| 33 | CDN 加速 | CDN Integration | 与内容分发网络结合实现缓存加速 |
| 34 | 数据导出 | Data Export | 将数据迁移到其他存储系统的过程 |
| 35 | 数据导入 | Data Import | 从外部系统批量迁移数据到对象存储 |
| 36 | 静态网站托管 | Static Website Hosting | 通过存储桶直接托管 HTML/CSS/JS 等静态文件 |
| 37 | 防盗链 | Hotlink Protection | 防止外部网站盗用资源链接的技术 |
| 38 | 请求速率限制 | Request Rate Limiting | 控制单个用户/IP 的 API 请求频率 |
| 39 | 标签 | Tagging | 为存储桶/对象添加分类标签便于管理 |
| 40 | 清单报告 | Inventory Report | 定期生成存储对象列表的 CSV/ORC 文件 |
| 41 | 数据恢复 | Data Restoration | 从归档存储中恢复数据到可访问状态 |
| 42 | 存储网关 | Storage Gateway | 将对象存储映射为本地文件系统的接入层 |
| 43 | 数据压缩 | Data Compression | 上传前压缩数据以节省存储空间 |
| 44 | 数据去重 | Data Deduplication | 消除重复数据减少存储占用 |
| 45 | 直读归档 | Direct Read Archive | 无需恢复即可直接读取归档数据的技术 |
| 46 | 流量控制 | Bandwidth Control | 限制下载带宽避免网络拥塞 |
| 47 | 并发连接数 | Concurrent Connections | 同时处理的数据传输连接数量 |
| 48 | 数据迁移服务 | Data Migration Service | 自动化迁移工具（如 AWS Snowball） |
| 49 | 客户端 SDK | Client SDK | 开发者集成存储服务的工具包（如 Python/Java SDK） |
| 50 | CLI 工具 | Command Line Interface | 命令行管理工具（如 aws s3 cp） |
| 51 | 图形化控制台 | Web Console | 网页端管理界面 |
| 52 | 数据校验 | Data Integrity Check | 通过 MD5/SHA 验证传输完整性 |
| 53 | 断点续传 | Resumable Upload/Download | 网络中断后可从断点继续传输 |
| 54 | 镜像回源 | Mirror Back to Source | 请求不存在对象时从指定源站拉取并保存 |
| 55 | 灰度发布 | Canary Release | 新功能逐步开放给部分用户的发布策略 |
| 56 | 软删除 | Soft Delete | 标记删除对象但保留可恢复期 |
| 57 | 对象锁定 | Object Lock | 防止对象被删除或覆盖的合规保护机制 |
| 58 | 水印 | Watermarking | 在图片/视频中添加标识信息 |
| 59 | 缩略图生成 | Thumbnail Generation | 自动创建图片的缩略版本 |
| 60 | 图片处理 | Image Processing | 在线裁剪/缩放/旋转等处理功能 |
| 61 | 视频转码 | Video Transcoding | 转换视频格式/分辨率以适应不同设备 |
| 62 | 内容审核 | Content Moderation | 自动检测违规图片/视频/文本 |
| 63 | 成本分析 | Cost Analysis | 按存储类型/请求次数等维度统计费用 |
| 64 | 用量监控 | Usage Monitoring | 实时查看存储量/流量/请求次数的仪表盘 |
| 65 | 存储分析 | Storage Analytics | 分析存储模式优化成本的工具 |
| 66 | 请求者付费 | Requester Pays | 由数据下载方承担费用的计费模式 |
| 67 | 数据分层 | Tiered Storage | 自动将数据转移到成本更低的存储层级 |
| 68 | 智能分层 | Intelligent Tiering | 基于访问模式自动选择最佳存储类型 |
| 69 | 私有链接 | PrivateLink | 通过内网直接访问对象存储避免公网暴露 |
| 70 | VPC 端点 | VPC Endpoint | 在虚拟私有云内安全访问存储服务的入口 |
| 71 | 传输加密 | SSL/TLS | 通过 HTTPS 协议加密传输数据 |
| 72 | 客户端加密 | Client-Side Encryption | 用户在上传前自行加密数据 |
| 73 | KMS | Key Management Service | 集中管理加密密钥的服务 |
| 74 | 权限边界 | Permission Boundary | 限制 IAM 角色/用户的最大权限范围 |
| 75 | 临时凭证 | Temporary Credentials | 短期有效的访问令牌（如 STS Token） |
| 76 | MFA 删除保护 | MFA Delete | 要求多因素认证才能删除数据 |
| 77 | 数据不可变性 | Immutability | 防止数据被篡改的特性（结合 WORM 模型） |
| 78 | 法律保留 | Legal Hold | 合规场景下禁止删除/修改数据的强制保护 |
| 79 | 跨账户共享 | Cross-Account Sharing | 允许其他云账户访问指定存储资源 |
| 80 | 预取策略 | Prefetch Policy | 提前将数据加载到缓存加速后续访问 |
| 81 | 缓存控制 | Cache-Control | 通过 HTTP 头指定浏览器/CDN 缓存行为 |
| 82 | 延迟删除 | Delayed Deletion | 删除操作延迟执行以防止误操作 |
| 83 | 批量操作 | Batch Operations | 对多个对象执行统一操作（删除/复制/恢复） |
| 84 | 数据血缘 | Data Lineage | 追踪数据来源和变更历史的元数据记录 |
| 85 | 数据目录 | Data Catalog | 存储元数据信息的检索系统 |
| 86 | 存储网关 | Storage Gateway | 连接本地系统与云存储的混合云解决方案 |
| 87 | 混合云存储 | Hybrid Cloud Storage | 同时使用本地存储和云存储的架构 |
| 88 | 边缘存储 | Edge Storage | 在靠近数据源的边缘节点提供存储服务 |
| 89 | 多云存储 | Multi-Cloud Storage | 跨不同云服务商的存储方案 |
| 90 | 存储联盟 | Storage Federation | 统一管理多个存储系统的抽象层 |
| 91 | 对象标签 | Object Tag | 为对象添加自定义分类标签 |
| 92 | 存储桶标签 | Bucket Tag | 为存储桶添加管理/计费相关的标签 |
| 93 | 存储配额 | Storage Quota | 限制存储桶的最大容量 |
| 94 | 请求限速 | Request Throttling | 限制单位时间内的 API 请求次数 |
| 95 | 服务等级协议 | SLA | 服务可用性/持久性的承诺指标（如 99.9%可用性） |
| 96 | 灾难恢复 | Disaster Recovery | 通过跨区域备份保障业务连续性 |
| 97 | 存储拓扑 | Storage Topology | 数据在物理/逻辑层面的分布结构 |
| 98 | 就近访问 | Proximity Access | 将用户请求路由到最近的存储节点 |
| 99 | 全球统一命名空间 | Global Namespace | 跨区域存储桶的统一视图管理 |
| 100 | 零拷贝迁移 | Zero-Copy Migration | 通过元数据操作实现快速数据迁移 |


