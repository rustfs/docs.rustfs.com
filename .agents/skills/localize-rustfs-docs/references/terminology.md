# RustFS localization terminology

Use this hierarchy when choosing a translation:

1. The term used by the current RustFS product, Console, source code, or API.
2. An established term already used consistently in the target-language RustFS documentation.
3. The standard term used by the relevant ecosystem, such as Amazon S3 or Kubernetes.
4. English with a concise target-language explanation when no stable translation exists.

Never choose a dictionary translation that changes the RustFS concept. Search the repository and upstream source before adding a new translation, and update this glossary when a new term becomes canonical.

## Simplified Chinese baseline

| Source term | Preferred Chinese | Guidance |
|---|---|---|
| RustFS | RustFS | Never translate or alter capitalization. |
| Amazon S3 / S3 | Amazon S3 / S3 | Keep the product and protocol name. |
| S3-compatible | 兼容 S3 | Do not claim complete or 100% compatibility. |
| object storage | 对象存储 | Use for the storage model. |
| bucket | 存储桶 | Use consistently in prose. Preserve `bucket` in code and API names. |
| object | 对象 | Use for an S3 object; do not substitute “file” unless the source specifically means a local file. |
| object key | 对象键 | Keep `Key` unchanged in API or JSON examples. |
| access key | 访问密钥 | Preserve `RUSTFS_ACCESS_KEY` and SDK field names. |
| secret key | 秘密密钥 | Preserve `RUSTFS_SECRET_KEY` and SDK field names. |
| Console | 控制台 | Keep visible English UI labels unchanged in step instructions. |
| endpoint | 端点 | Use “S3 API 端点” when the endpoint type could be ambiguous. |
| region | 区域 | Preserve region values such as `us-east-1`. |
| tenant | 租户 | Use in the RustFS Operator and multi-tenancy context. |
| storage pool | 存储池 | Do not shorten to “池” when the storage meaning is unclear. |
| erasure coding | 纠删码 | Use for the data-protection scheme. |
| healing | 修复 | Use for RustFS data or node recovery operations; do not translate as medical “healing”. |
| rebalance | 数据再平衡 | Use “再平衡” for the operation name when context is already clear. |
| decommission | 退役 | Use the established RustFS operation name “存储池退役”; explain that the pool is drained and deactivated rather than substituting a generic “下线”. |
| replication | 复制 | Qualify as “站点复制” or “存储桶复制” according to the RustFS feature. |
| versioning | 版本控制 | Use specifically for S3 object versioning. |
| object lock | 对象锁定 | Do not conflate with distributed locks. |
| legal hold | 依法保留 | Use the established Amazon S3 Chinese term; preserve API names such as `ObjectLockLegalHold`. |
| lifecycle management | 生命周期管理 | Use for S3 lifecycle rules. |
| IAM | IAM | Keep the acronym; explain as identity and access management on first conceptual use. |
| KMS | KMS | Keep the acronym; distinguish RustFS built-in KMS from external backends. |
| STS | STS | Keep the acronym; explain temporary credentials when needed. |
| OIDC | OIDC | Keep the acronym and protocol terminology. |
| server-side encryption | 服务端加密 | Keep SSE-S3, SSE-KMS, and SSE-C unchanged. |
| path-style addressing | 路径式寻址 | Preserve SDK option names such as `forcePathStyle`. |
| virtual-hosted-style addressing | 虚拟主机式寻址 | Relate it to `RUSTFS_SERVER_DOMAINS` when relevant. |
| presigned URL | 预签名 URL | Keep URL uppercase. |
| multipart upload | 分片上传 | Use the established S3 term. |
| health check | 健康检查 | Keep endpoint paths unchanged. |
| readiness | 就绪状态 | Use for readiness probes and `/health/ready`. |
| observability | 可观测性 | Keep OpenTelemetry and OTLP unchanged. |
| webhook | Webhook | Prefer the established English product term over a literal translation. |
| rootless | 无 root 权限 | In Podman context, prefer this over the ambiguous literal “无根”. |
| root credentials | 根凭证 | Use for the deployment-wide `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` pair; do not confuse it with an operating-system root account. |

## UI labels and identifiers

When the Console screenshot or interface displays an English label, write instructions like `Select **Buckets（存储桶）**` rather than translating the clickable label to a string the reader cannot find. Keep exact casing for buttons, menu items, resource kinds, and error messages.

Do not translate identifiers embedded in prose, including:

- executable and command names such as `rustfs`, `rc`, `aws`, and `kubectl`;
- Kubernetes resource kinds such as `Tenant`, `Secret`, and `PersistentVolumeClaim`;
- environment variables and flags;
- API actions, HTTP methods, status text, metric names, and JSON/YAML keys;
- filenames, paths, package names, image tags, domains, and URLs.
