# RustFS 文档站深度评审与改进方案

**评审日期**：2026-07-15
**评审对象**：docs.rustfs.com（`content/` 下 88 篇英文文档、145 张图片、FumaPress 站点）
**评审方法**：五个独立角色并行评审、交叉对抗——信息架构（文档专家）、新手旅程（教育专家）、技术准确性（架构师 + 测试，逐条对照 rustfs/rustfs 上游源码）、生产就绪度（SRE）、内容质量与排版（技术编辑）；另对线上站点做了实际渲染走查、核验了一键安装脚本的真实行为，并实地调研了 MinIO、Garage、JuiceFS、Cloudflare R2、Backblaze B2 五家竞品的文档组织方式作为信息架构参照。六份专项报告全文见 `docs-review/reports/`。

---

## 一、结论摘要

站点工程底座（FumaPress 迁移、搜索、Mermaid、Callout、llms.txt、sitemap）已经达标，**短板全部在内容层**，且比"排版不优雅"严重得多：

1. **结构失衡**：营销向的 `features/` 以 29 页、2.14 万词占了全站近一半文字量和 120/134 张配图；而决定用户留存的运维文档薄得惊人——IAM 全部文档 250 词，桶/对象管理 8 页合计 1253 词，升级扩容 893 词。**没有 Getting Started，没有任何一页能让新手端到端跑通"启动 → 登录 → 建桶 → 上传"。**
2. **导航失明**：21 个页面（占 24%）是导航孤儿——包括最重要的 "What is RustFS?" 和 6 个写完的 K8s 平台方案页；测试残留页 `deep/nested/test-deep` 和翻译占位页正挂在生产站上，还会进 sitemap 与 llms.txt。
3. **事实漂移已到危险级别**：排障与扩容文档存在**虚构的 CLI 命令**（`rustfs-admin`、`rc cluster status`，文档自己写着 "hypothetical"）、会导致**全集群停机**的扩容示例（新旧节点 `RUSTFS_VOLUMES` 主机名模式不一致）、与安装要求相反的换盘命令（`mkfs.ext4` vs 全站要求 XFS）、与上游 runbook 相反的"禁止滚动重启"断言。控制台端口在三处写成三个值（9001 / 7001 / 9090，源码真值 9001）；单次 PUT 上限写成 MinIO 的 500 GiB（源码 5 GiB）；EC 读写仲裁公式与实现不符；`developer/mcp.md` 的构建命令指向已从上游移除的 crate，整页失效；约 9 个 features 页是 MinIO 文案换皮，宣称 KES、Kubernetes Operator、Elasticsearch/NSQ 通知、HDFS/NFS 协议等源码中不存在的能力——而真实存在的 FTPS/SFTP/WebDAV/Swift 协议与 MinIO 环境变量兼容层反而无人书写。
4. **专业形象硬伤**：Java SDK 正文残留 LLM 对话开场白（"Good, below is the…"），三篇 SDK 以 "Vibe Coding / with the help of an llm" 收尾，示例演示上传 `password.txt` 且带员工私人路径 `/Users/jhma/Desktop`。
5. **默认凭据全站无处可查**——新手装完后连控制台都登不进去。这是新手旅程的第一致命断点。

好消息：问题高度集中、修复路径清晰。P0 清障一天内可完成；信息架构有"零 URL 变更"降级方案，当天可上线；内容补齐可按角色分工滚动推进。

---

## 二、对八项问题的诊断结论

| 用户提出的问题 | 评审结论 | 最硬的证据 |
|---|---|---|
| 1. 目录结构混乱、层级不合理 | **成立，且比预想严重**。根 meta.json 是约 60 项扁平列表 + 11 个不可折叠的伪分组；21 页孤儿；概念排在安装之后；两个"管理"分组并存；营销与技术共用 `/features/` | `content/meta.json`；报告 01 硬伤清单 20 条 |
| 2. 新手不友好 | **成立**。Quick Start 实为"先读三种模式"，装完后无验证、无控制台地址、无凭据、无下一步；默认凭据全站不可查；生产检查清单横在试用路径上 | 报告 02 断点清单 12 条 |
| 3. 没有分角色文档 | **成立**。单一侧边栏塞下全部内容，评估者/新手/运维/开发者混流；SRE 视角七个生产阶段平均得分 1.4/5 | 报告 04 评分卡 |
| 4. 排版不够优雅 | **成立但属次要矛盾**。组件（Callout/Tabs/Mermaid）已可用而使用率极低：24 处规范提示框 vs 38 行裸引用块；3 种标题编号风格并存；26 处代码块无语言标注 | 报告 05 体检数据 |
| 5. 内容不循序渐进 | **成立**。SNSD 试用文档要先读完 EC 冗余表、JBOD 论述、XFS 论证才见到第一条命令；SNSD/SNMD/MNMD 缩写未进术语表就被使用 | 报告 02 Step 4 |
| 6. 内容过时/命令参数不存在 | **成立，最高危**。虚构 CLI 命令、不存在的 config.yaml/config.toml、不存在的 Prometheus 指标名、不存在的 "RustFS Operator"/"KES" 组件；上游 948 个 `RUSTFS_*` 变量文档只覆盖 13 个 | 报告 03（逐项核对表）、04 危险项 |
| 7. 不符合最佳实践的小问题 | **成立**。SSH 克隆地址、手写 SigV4 签名的不可复现 curl、真实感 AccessKey 出现在示例与截图、裸 URL、"Last Updated" 规范无人执行 | 报告 05 |
| 8. 配图缺失/不美观 | **成立**。8 个描述控制台操作的页面 0 截图；中文界面截图出现在英文站 ≥4 张；Windows 安装页配 macOS 风格窗口截图；62 张孤儿图片（43%）；14 张超 300KB、最大 1.38MB | 报告 05 图片清单 |

---

## 三、目标信息架构（分角色重构，v2 · 已按竞品对标修订）

四类读者，四条主路径，一条漏斗顺序（学习 → 上手 → 部署 → 管理 → 运维 → 开发 → 参考 → 方案）：

| 章节 | 主要角色 | 内容来源 |
|---|---|---|
| **Getting Started** | 新手/评估者 | 首页改为**选路卡**（Linux 脚本 / Docker / K8s / Win·macOS，对齐 MinIO 落地页模式）+ introduction（移入）+ 重写的 Quickstart + 新增 Console First Steps |
| **Core Concepts** | 评估者/架构师 | 收窄为纯"解释"：架构、EC 原理、对比（limit/glossary 移往 Reference） |
| **Installation** | 运维 | 现 installation/*，新增 kubernetes/（替换占位页，对齐上游 Helm chart）；保留 SNSD/SNMD/MNMD 拓扑命名（MinIO 同款术语，降低迁移用户心智成本，需进术语表） |
| **Administration** | 运维+使用者 | management/* + iam + integration/*（改名 Networking & Access） |
| **Operations** | SRE | scanner + 扩容重构 + troubleshooting/*（重写虚构命令）+ 新增升级 / Pool 退役与恢复（对齐 MinIO 的 upgrade/restore/decommission 子页与上游 runbook） |
| **Developer** | 应用开发者 | sdk/*（深度教程）+ 新增 **Examples 子区：每工具一页最小示例**（mc、AWS CLI、boto3、aws-sdk-js/go、rclone、s3cmd、Terraform，对齐 R2 模式，兼作 SEO 落地页）+ mcp |
| **Reference**（新增顶层区） | 全体 | 环境变量大全、CLI 参考、端口矩阵、监控指标表、**S3 兼容矩阵**（✅/🚧/❌ 三态，用上游 452/17/273 口径，替代 "100% compatible" 口号）、使用限制、术语表、错误码 |
| **Features** | 评估者/开发者 | 8 个技术特性页（修 encryption 标题、救回 small-file） |
| **Solutions** | 决策者/售前 | 现 features 下 10 个行业方案 + 救回的 11 个孤儿页，归入 `/solutions/` |
| **About** | — | about + trademark + license |

关键收益：侧边栏第一屏即 Getting Started；评估者 2 次点击到对比页，运维 2 次点击到检查清单，开发者 2 次点击到 SDK；营销内容与技术文档物理分离，互不污染。

**角色→任务→路径验收矩阵**（零 URL 变更版导航已在评审分支落地，以下路径均已可点击验证；"击"指侧边栏点击次数，分组标题不计）：

| 角色 | 高频任务 | 路径 | 点击 |
|---|---|---|---|
| 评估者 | 这是什么产品 | Getting Started ▸ What is RustFS? | 1 |
| 评估者 | 与竞品对比 / 架构可信度 | Core Concepts ▸ Performance Comparison / Design Architecture | 1 |
| 评估者 | S3 兼容到什么程度 / 能力边界 | Reference ▸ S3 Compatibility / Usage Limits | 1 |
| 评估者 | 行业方案 | Solutions ▸ 对应行业页 | 1 |
| 新手 | 10 分钟跑通 | Getting Started ▸ Quick Start | 1 |
| 新手 | Docker 本地试用 | Installation ▸ Docker | 1 |
| 新手 | 第一个桶 / 第一次上传 | Administration ▸ Bucket/Object Management ▸ 操作页 | 2 |
| 新手 | 看不懂缩写 | Reference ▸ Glossary | 1 |
| 应用开发者 | 某语言 SDK 接入 | Developer ▸ SDK ▸ 语言页 | 2 |
| 应用开发者 | mc / aws-cli / boto3 / rclone 快速连接 | Developer ▸ Examples ▸ 工具页 | 2 |
| 应用开发者 | 某 S3 API 是否支持 | Reference ▸ S3 Compatibility | 1 |
| SRE | 生产前检查 | Installation ▸ Production Checklists | 1-2 |
| SRE | 多节点部署 / K8s 部署 | Installation ▸ Linux ▸ MNMD / Kubernetes | 1-2 |
| SRE | 扩容 / 升级 / 换盘 / 换节点 | Operations ▸ 对应页 | 1 |
| SRE | 某环境变量默认值 / 开哪些端口 | Reference ▸ Environment Variables / Ports | 1 |

**竞品对标依据**（详见报告 06）：六家共同模式——① 入门先选路、每条路 5 分钟闭环（MinIO 平台卡 / R2 接入方式表 / JuiceFS 单机-分布式并列）；② Reference 独立成区且完备（六家皆然，v1 提案的缺口）；③ S3 兼容矩阵独立成页（R2 是标杆）；④ Examples-per-tool；⑤ Day-2 运维与部署同级（MinIO 把 upgrade/restore/decommission 放在部署区，Garage 设 Operations & Maintenance 区）；⑥ 文档站不放营销（MinIO 营销全在主站）；⑦ 教程/操作/参考/解释分型不混写（Diátaxis，Garage 显式实践）——作为页面模板框架写入 STYLE.md。

**落地策略**：完整方案含 88 个文件的全量迁移映射（报告 01）。若静态托管暂不便做 301 重定向，先执行**零 URL 变更降级版**——只改 meta.json（章节文件夹化、救孤儿、改标签、置顶 Getting Started），当天上线即可拿到约九成收益。

---

## 四、分阶段执行路线图

### P0 · 清障（1 天内，杀伤力最大、工作量最小）

1. 下线测试页 `content/deep/` 与占位页判定（cloud-native 占位页在 K8s 文档写好前先移出导航）。
2. 删除 LLM 对话残留（java.md:149）与三处 "Vibe Coding / llm" 收尾（go/rust/typescript）。
3. 修复 `features/encryption` 复制粘贴错误标题。
4. 统一控制台端口口径为 9001（修 windows/macos 的 7001、security-checklists 的 9090），并在安装页交代 `RUSTFS_CONSOLE_ADDRESS` 出处。
5. 清理隐私与安全示例：`/Users/jhma/*`、`password.txt`、真实感 AccessKey（含 IAM 截图重打码）、SSH 克隆地址改 HTTPS。
6. 修复失效锚点（windows/macos → `#mode`）与 Docker 页 config.toml 幽灵引用。
7. **危险运维指导先行打补丁**（在重写前先改错的）：ext4 → XFS；扩容主机名模式统一；"禁止滚动重启"改为"仅加 pool 需全量重启"；systemd `TimeoutStartSec` 30s → 120s（对齐上游模板）。
8. 硬数字纠错：limit.md 单次 PUT 500 GiB → 5 GiB、读写仲裁公式改为 read = N−parity / write = data（data==parity 时 +1）；quick-start 删除 io_uring 检查项（上游明确不启用 tokio io-uring）；erasure-coding 页 Blake3 → HighwayHash256。
9. `developer/mcp.md` 构建路径失效（`crates/mcp` 已移出主仓库）：先加失效提示或下线，联系上游确认 MCP 新仓库地址后重写。

### P1 · 信息架构重构（1 周）

1. 按第三节执行导航重构（推荐先做零 URL 变更版），救回 21 个孤儿页。
2. 重写三个入口页：文档首页（分角色入口卡片）、installation/index（部署模式决策页，删重复营销文案）、quick-start（真正的 10 分钟上手，见下）。
3. 新手主线补全：Quickstart 必须交付完整闭环——启动（Docker/Linux 双 Tab）→ 预期输出 → 控制台 9001 登录（附英文界面截图与凭据说明）→ 建桶 → 上传 → 验证 → 下一步三张卡片。素材 90% 已存在，只缺组装（报告 02 第三节有逐步大纲）。
4. 顶栏 "Installation" 改指 `/installation/`；глossary 增补 SNSD/SNMD/MNMD 词条。

### P2 · 内容补齐与重写（2-4 周，按角色分工）

**运维线（最高优先，报告 04 P0 清单）**
- Kubernetes/Helm 生产部署指南（对齐上游 chart：探针、PDB、反亲和、pool 扩容、256Mi PVC 陷阱）。
- 升级 runbook（滚动重启 + `/health/ready` 门控）；换盘/换节点 runbook 重写（消灭全部虚构命令）。
- 环境变量参考大全（运维相关 60+ `RUSTFS_*`）；端口矩阵；监控搭建指南（OTLP 路径，明确"无原生 Prometheus 端点"）。
- IAM 参考（策略 JSON/用户组/服务账号/STS/OIDC——上游已有 Keycloak/Authing runbook 可移植）。

**开发线**
- 六篇 SDK 全部达到"复制即可运行"标准：依赖安装、完整 import、path-style 说明（Rust/TS 现状必失败）、预期输出、与安装页衔接的端点凭据；修复 Python 缩进语法错误。
- 手写 SigV4 curl 全部替换为 `aws s3api`；示例常量全站统一（endpoint、region us-east-1、桶名）。
- S3 兼容性矩阵页（✅/🚧/❌ 三态，对齐上游 452/17/273 测试口径，全站停用 "100% S3 compatible" 表述）。
- Examples 子区起步：mc、AWS CLI、boto3、rclone 四页最小连通示例先行，其余工具滚动补齐。

**内容治理线**
- Linux 三模式页去重（87% 相似度 → 公共前置抽出，模式页只讲拓扑与容错语义）。
- 六个 K8s 平台页收敛为"通用能力 + 平台差异"（并修 OpenShift 串台残留）。
- "What is RustFS" 三处重复收敛为一处；性能数字全站单一出处（新建 benchmarks 页）。

### P3 · 视觉与治理（并行滚动）

1. **截图规范与补拍**：英文界面、浅色主题、统一分辨率（~1600px）、≤300KB；优先补齐 8 个"描述 UI 却无图"的页面与 Quickstart 全流程；替换 4 张中文截图与 Windows 页的 macOS 截图。
2. **图片治理**：删除 62 张孤儿图片；14 张大图压缩为 WebP。
3. **风格指南落库**：将报告 05 第五节整理为 `STYLE.md`（人称、提示框、代码块、表格、截图六章），并同步进 AGENTS.md 约束 AI 贡献。
4. **文档 CI**：构建时跑链接/锚点检查、孤儿页检查（文件存在但不在 meta.json 即告警）、代码围栏语言标注检查、图片体积检查；示例常量用词表 lint（禁 12.34.56.78、cn-east-1、password.txt）。
5. **度量**：GA 已接入，补三件事——站内搜索词报表（找"搜不到"的内容缺口）、每页 thumbs up/down 反馈组件、按文档类型设新鲜度 SLA（安装/排障类每 release 核对，参考类随源码变更）。

---

## 五、内容规范要点（详见报告 05 第五节，将固化为 STYLE.md）

- **叙述**：面向读者用 "you"，官方建议统一 "We recommend"；技术页禁用最高级与承诺式措辞（fastest / 100% secure / perfect）。
- **页面骨架**：开场三句话交代"是什么、本页做什么、前置条件"；标题不编号、层级不跳级；同层操作（UI / mc / API）用同级标题。
- **代码**：围栏必带语言；命令与输出分块（bash / text）；凭据一律占位符；示例必须可运行、可复现。
- **提示框**：统一 `:::note` / `:::tip` / `:::warning`，废除裸引用块与 emoji 引用两种旧写法。
- **配图**：描述 UI 必配截图；截图英文界面、统一风格；每图有效 alt。
- **事实纪律**：命令、变量、端口、指标名必须能在上游源码或实测中复核；写不准的宁可不写，禁止 "hypothetical" 命令进入文档。

---

## 六、治理机制（防止回退）

1. **PR 检查单**：新增/修改文档必须声明——命令是否实测、截图是否合规、是否进 meta.json、是否更新中文站。
2. **角色守门**：运维类文档需 SRE 角色 review；SDK 类需对应语言开发者 review。
3. **上游联动**：rustfs/rustfs 的 `docs/operations/*` runbook 是高质量事实源，建立"上游 runbook → 文档站"的移植与同步机制，避免两处漂移。
4. **季度审计**：每季度跑一次本次评审的自动化检查集（孤儿页、断链、体检脚本），指标进看板。

---

## 附录：五份专项报告

| # | 报告 | 视角 | 文件 |
|---|---|---|---|
| 01 | 信息架构与导航 | 文档专家 | `docs-review/reports/01-information-architecture.zh-CN.md` |
| 02 | 新手旅程与教学 | 教育专家 | `docs-review/reports/02-beginner-journey.zh-CN.md` |
| 03 | 技术准确性核对 | 架构师 + 测试 | `docs-review/reports/03-technical-accuracy.zh-CN.md` |
| 04 | 生产就绪度 | SRE | `docs-review/reports/04-sre-production-readiness.zh-CN.md` |
| 05 | 内容质量与排版 | 技术编辑 | `docs-review/reports/05-editorial-typography.zh-CN.md` |
| 06 | 竞品文档对标 | 信息架构参照 | `docs-review/reports/06-competitor-benchmark.zh-CN.md` |
