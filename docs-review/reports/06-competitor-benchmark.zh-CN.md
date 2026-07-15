# 专项评审 · 竞品文档对标（信息架构参照）

> 调研对象：MinIO（最直接对标）、Garage、JuiceFS 社区版、Cloudflare R2、Backblaze B2，另附 Ceph 简评。数据来源为各家线上文档与文档仓库源码的实地抓取（2026-07-15）；Ceph 仅浏览了入口页、SeaweedFS 未深入，结论中不引用其细节。

## 一、各家结构实录

### MinIO（docs.min.io，源自 minio/docs 仓库 index.rst 的 toctree，逐字）

顶层顺序：**Introduction → Quickstart → Deployment and Management → IAM（Security）→ Encryption（Security）→ Object Retention → Lifecycle Management → Replication → Monitoring → Support → Reference: mc → Reference: mc admin → Reference: minio server → Console → SDK（drivers）**

关键做法：

- **落地页即选路器**：首页用五张平台卡片（Linux / macOS / Windows / Kubernetes / Docker-Podman）分流 Quickstart，正文只留一段产品定位 + `play` 公共演示集群 + 许可证说明。
- **部署按拓扑组织**：Deployment and Management 下明确定义三种拓扑——**SNSD（评估/开发）、SNMD（仅盘级容错）、MNMD（生产级）**，并列子页：deploy-distributed / expand-distributed / deploy-snsd / **upgrade** / **restore** / **decommission-pool**。**RustFS 文档现用的 SNSD/SNMD/MNMD 术语正源于此**——保留它可以降低 MinIO 迁移用户的心智成本，但必须进术语表。
- **Reference 是一等公民**：`mc`、`mc admin`、`minio server`（含全部环境变量/设置项）三套参考并列于顶层；升级/恢复/退役等 Day-2 操作与部署同区。
- **文档站内没有营销**：solutions/行业方案全部在 min.io 主站，文档只保留能力型章节（Retention/Lifecycle/Replication 等，每章 overview + 操作子页）。

### Garage（garagehq.deuxfleurs.fr，全树）

顶层：**Quick Start → Cookbook → Existing integrations → Build your own app → Operations & Maintenance → Reference Manual → Design → Development → Working Documents**

- 典型的 **Diátaxis 分区**：教程（Quick Start）/ 操作指南（Cookbook：集群部署、systemd、反代、K8s、Ansible、监控、加密）/ 参考（Reference Manual）/ 解释（Design）互不混杂。
- Quick Start 端到端：取二进制 → 生成配置与凭据 → 启动 → 验证 → **用 AWS CLI 上传下载**——正是"第一次成功"闭环。
- Day-2 独立成区（Operations & Maintenance：升级、多盘、集群布局、持久性与修复、故障恢复）。
- **Existing integrations** 独立成区（Nextcloud、Hugo、restic、s3fs……）——生态集成不与技术文档混排。

### JuiceFS 社区版（juicefs.com/docs/community）

顶层：**Introduction → Quick Start → Key Features → Deployment → Benchmark & Profiling → Administration → Security → Tutorials → Reference → FAQ → Development → Community/Release Notes**

- **入门按部署形态拆并列页**：单机模式（SQLite+本地盘，零外部依赖 5 分钟跑通）与分布式模式是并列的两页，而不是一篇大而全。
- **Reference 区内容完备且分类清晰**：命令参考按 **ADMIN / INSPECTOR / SERVICE / TOOL** 四类分组；指标参考独立成页；POSIX 兼容性、规格上限、后端支持列表各自成页。
- **场景内容进 Tutorials 单列**（AI/ML、大数据、各云上手），不污染主线。
- **双语同构树**：en/zh 共用同一 sidebar 与 URL 结构，逐页对应，语言切换不丢位置。
- 社区版与企业版用**完全分离的文档树**（/docs/community 与 /docs/cloud），不在页面里打版本标签。

### Cloudflare R2（developers.cloudflare.com/r2）

顶层：**Get started → How R2 works → Buckets → Objects → Data migration → API → R2 Data Catalog/SQL → Tutorials → Examples → Platform（Limits/Metrics/Audit/Troubleshooting/Release notes）→ Pricing → Reference**

- **Get started 先选路**：一张表让读者在 Workers API / S3 SDK / CLI / Dashboard 四种接入方式中选择，每条路径独立成页、5 分钟可跑通。
- **S3 兼容矩阵页是信任锚点**：按 Bucket 操作 / Object 操作分节，✅ 已实现 / 🚧 实验性 / ❌ 未实现三态标注，每个操作附行为差异 callout（region 固定、覆盖语义等）。
- **Examples-per-tool**：aws CLI、boto3、aws-sdk-js/go/java/kotlin/net/php/ruby/rust、rclone、Terraform……每工具一页，只放"连上我"的最小可运行配置——同时是 SEO 落地页（"rustfs + boto3" 这类搜索的直接命中页）。
- Limits、Pricing、错误码都在文档站内一级可达。

### Backblaze B2 / Ceph（简评）

- B2：Quickstart 按"接入方式 × 语言"矩阵拆（Web UI / CLI / S3 API / Python 项目式教程），原生 API 与 S3 兼容 API 双轨；设 "Popular Articles" 高频直达区。
- Ceph：巨型项目按组件分域（Object Store / Block / File），Getting Started 独立于组件；对 RustFS 的体量而言参考价值有限，不宜模仿其层级深度。

## 二、共同模式提炼（六家交集）

| # | 模式 | 采用者 | 对 RustFS 的含义 |
|---|---|---|---|
| 1 | **入门先选路，每条路 5 分钟闭环**（平台卡 / 部署形态 / 接入方式） | MinIO、R2、JuiceFS、B2 | Getting Started 首页做选择器；单机路径零依赖跑通"装→登→传" |
| 2 | **Reference 独立成区且完备**（CLI、配置/环境变量、指标、限制、错误码） | 全部 | 我们的 IA v1 缺一个顶层 Reference 区——必须补 |
| 3 | **S3 兼容矩阵独立成页、三态标注** | R2（标杆）、B2 | 上游已有 452/17/273 测试口径，做成 ✅/🚧/❌ 页即可，替代 "100% S3 compatible" 口号 |
| 4 | **Examples-per-tool（每工具一页最小示例）** | R2（标杆）、B2、Garage(integrations) | Developer 区为 mc/aws-cli/boto3/js/go/rclone/s3cmd/Terraform 各建一页 |
| 5 | **Day-2 运维（升级/扩容/退役/恢复）与部署同级或独立成区** | MinIO、Garage、JuiceFS | 佐证 IA v1 的 Operations 区方向正确；补 upgrade/restore/decommission 三页对齐 MinIO 子页清单 |
| 6 | **文档站不放营销**；场景/集成内容单列（Tutorials / Integrations） | MinIO（站外）、Garage、JuiceFS、R2 | 佐证 solutions 与技术文档分离；行业方案页保留在独立 /solutions/ 命名空间是合理折中 |
| 7 | **教程 / 操作指南 / 参考 / 解释 分型不混写**（Diátaxis） | Garage（显式）、其余隐式 | 作为页面模板的底层框架写入 STYLE.md：概念页/任务页/参考页/排障页四模板 |

## 三、对 RustFS 信息架构的修订建议（IA v2 增量）

在报告 01 提案（v1）基础上做四点修订：

1. **新增顶层 Reference 区**：环境变量大全、CLI（`rustfs server/info/tls`）、端口矩阵、监控指标表、S3 兼容矩阵、使用限制（limit.md 移入）、术语表（glossary 移入）、错误码。Concepts 区收窄为纯"解释"（架构/EC 原理/对比）。
2. **Getting Started 首页改为选路卡**：Linux 一键脚本 / Docker / Kubernetes / Windows·macOS 四张卡（对齐 MinIO 落地页模式），每条路径复用既有安装页的 Quickstart 段落；SNSD/SNMD/MNMD 术语保留并进术语表。
3. **Developer 区增设 Examples 子区**：每工具一页（mc、AWS CLI、boto3、aws-sdk-js、aws-sdk-go、rclone、s3cmd、Terraform），只放最小连通配置 + 一次上传下载；六篇 SDK 教程保持深度版。
4. **Operations 区补齐 MinIO 对齐的三页**：升级（rolling restart runbook 移植）、扩容（现 availability-and-resiliency 重构）、Pool 退役与恢复（decommission/restore，上游已有实现与演练 compose）。

修订后顶层（9 区）：**Getting Started / Concepts / Installation / Administration / Operations / Developer / Reference / Features / Solutions（+About）**——与 MinIO 的差异仅在于我们保留 Solutions 区（营销内容暂无主站承接）与 Features 区（能力页修正后有真实技术价值）。

## 四、覆盖说明

- MinIO 数据取自 minio/docs 仓库 `source/index.rst` 与 `source/installation/deployment-and-management.rst` 原文（master 分支），以及其 main 分支目录结构（administration/developers/integrations/operations/reference 的新五区制）；两版并存说明 MinIO 自身也在向"运维/开发者/参考"三分法演进。
- Ceph 仅核实了入口页组件分域结构；SeaweedFS 未纳入（wiki 形态，参考价值低）。
