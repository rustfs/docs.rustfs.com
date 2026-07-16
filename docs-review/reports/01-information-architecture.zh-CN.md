# 专项评审 · 信息架构与导航（文档专家视角）

> 评审范围：`content/` 下全部 88 个 `.md` 文件、7 个 `meta.json`、`press.config.tsx` 导航配置。
> 现状概括：根 `content/meta.json` 是一个约 60 项的扁平大列表，用 `---分隔符---` 切成 11 个伪分组；由于所有 meta.json 都没有 `...`（rest）条目，**任何未被显式列出的页面都从侧边栏消失**——这直接制造了 21 个孤儿页面（占全站 24%）。无死链（63 个导航目标全部可解析），但孤儿、占位页、测试残留、复制粘贴错误密集。

## 硬伤清单

| # | 文件 / 导航项 | 问题 | 证据 |
|---|---|---|---|
| 1 | `content/deep/nested/test-deep.md` | **测试残留文件被发布到生产站**。标题 "Deep Test File"，正文仅一句。站点启用了 `sitemapPlugin()` 和 `llmsPlugin()`（见 `press.config.tsx`），它会进入 sitemap 和 llms.txt 被搜索引擎/LLM 收录 | 来自 VitePress→FumaPress 迁移提交的深层路由测试用例，忘删 |
| 2 | `content/installation/cloud-native/index.md` | **占位空页**。标题 "English Documentation"，description "This documentation is being translated from Chinese to English"。这本应是 Kubernetes 安装文档——全站最重要的部署路径之一完全缺失，而 Solutions 里却有一个云原生**营销**页（`features/cloud-native`） | 文件全文仅 7 行 |
| 3 | `content/concepts/introduction.md` | **"What is RustFS?" 是全站最重要的认知页，却是孤儿**。首页 `content/index.md:12` 明确链向它，但根 meta.json 从未收录 | 根 meta.json 的 concepts 区块只列了 comparison/architecture/glossary/limit/principle |
| 4 | `content/features/encryption/index.md` | **标题复制粘贴错误**：frontmatter title 为 "Infrastructure for Large-Scale Data"，与 `features/distributed/index.md` 完全同名。浏览器标签、站内搜索、SEO 里加密页显示成"大规模数据基础设施" | 两文件 title 逐字相同，encryption 页正文实为 SSE-S3/SSE-C/KMS 内容 |
| 5 | `content/installation/linux/index.md` | 标题 "What is RustFS and Installation Instructions"——安装页顶着产品介绍标题；"What is RustFS / Features / Values / Vision" 与 `concepts/introduction.md`、`installation/index.md` **三处复制粘贴**，且互有出入（CPU 架构一处写 x86/ARM、一处写 x86/ARM/RISC-V） | 三个文件的 Features 九条列表逐字近似 |
| 6 | 根 meta.json `[Object Level and Read-Only](/features/worm)` | **机翻残次标签**（"对象级别与只读"直译）。页面真实标题是 "Object Immutability"（WORM） | `content/features/worm/index.md` |
| 7 | 根 meta.json `[Domestic Innovation and SM Solution](/features/domestic)` | 机翻标签（"信创与国密"直译，"SM" 无解释），页面真实标题 "Sovereign Cloud & Compliance Solutions" | `content/features/domestic/index.md` |
| 8 | `content/upgrade-scale/index.md` + 分组 "Upgrade, Expansion and Uninstallation" | **分组承诺与内容不符**：没有任何升级、卸载文档。index 里 "Upgrade / Scaling / Retirement / Rebalancing" 是四个无链接的裸文本 bullet | index.md:8-12 |
| 9 | `content/developer/index.md` | 画饼目录："STS"、"API Usage Guide" 是无链接裸文本；该页本身是孤儿，首页 `/developer/` 链接落在侧边栏不可见的页面上 | 文件第 8、12 行 |
| 10 | `content/concepts/principle/index.md` | 画饼目录 + 笔误：承诺 Stripes、Data Scanner、Data Self-healing 均无链接，"Stripes" **列了两次**；实际目录只有 erasure-coding 一个子页 | 文件第 8-12 行 |
| 11 | 11 个 features 孤儿页 | **整类内容不可见**：6 个 Kubernetes 平台页（aliyun/aws-elastic/huaweicloud/qcloud/openshift/tanzu）、2 个备份集成页（veeam/commvault）、baremetal、small-file、integration 总览页，写完了却没进任何导航 | 根 meta.json Solutions 区块只收录 10 个 |
| 12 | `management/index.md`、`installation/index.md`、`installation/checklists/index.md`、`concepts/index.md` | **四个章节 index 全是孤儿**，但正文里到处被引用（首页链 `/installation/`；`developer/mc.md` 链 `../installation/index.md` 等）。用户点进去后侧边栏无任何定位 | 各文件正文交叉引用 |
| 13 | `about/index.md`、`trademark/index.md` | 存在但全站导航无入口，纯死存量 | 不在任何 meta.json |
| 14 | 根 meta.json `[Object Scanner](/management/object/scanner)` | **粒度错位**：文件在 `management/object/` 内，导航上却与 bucket/object 文件夹平级；内容（巡检、自愈）与 `troubleshooting/healing.md` 高度重叠，属运维主题 | scanner.md 正文以调度/监控/自愈为主 |
| 15 | 分组 "System Administration" → `administration/iam` | **三层结构只装一页**；`iam/index.md` 承诺的 Users/Groups/Policies/Bucket Policy 均不存在 | `administration/iam/meta.json` 仅 1 项 |
| 16 | 根 meta.json 安装区块 | **同级混粒度**：`installation/linux` 用文件夹引用，Windows/macOS/Docker 用扁平链接；Checklist 5 页平铺在根级 | meta.json:5-14 |
| 17 | `/integration/*`（技术配置）与 `features/integration`（营销集成墙） | **同名双义**，用户搜 "integration" 会撞车 | 两组文件并存 |
| 18 | "Troubleshooting" 与 "Upgrade…" 各有一个 `[Overview]` | 同一侧边栏两个一模一样的 "Overview" 标签 | 根 meta.json:26、29 |
| 19 | `content/index.md`（文档首页） | 首页不在侧边栏；其 "Explore" 链接因章节 index 全是孤儿，只好指向任意首个子页 | index.md:16-19 |
| 20 | 顶栏 "Installation" → `/installation/linux` | 因 `installation/index.md` 是孤儿，顶栏只能指向 Linux 子文件夹——Windows/Docker 用户被强行带进 Linux 章节 | press.config.tsx links 数组 |

## 层级与命名问题

| 现状 | 为什么不好 | 建议 |
|---|---|---|
| 根 meta.json 约 60 项扁平列表 + 11 个 `---` 伪分组 | 分隔符不可折叠、不可点击、无落地页；侧边栏全量展开约 50 项，认知负担极大 | 每个章节变成真实文件夹（`meta.json` + `index.md` 落地页），根 meta.json 只列 8-9 个文件夹 |
| 章节顺序：安装 → 检查清单 → 概念 → 管理 → … | 学习旅程倒置：**概念在安装之后**；生产检查清单插在新手路径中间；没有 Getting Started | 学习 → 快速上手 → 安装 → 使用 → 运维 → 开发 → 参考 → 方案 的漏斗顺序 |
| 分组名 "RustFS Performance and Framework" | 内容是架构/对比/术语/限制/EC 原理，名不符实 | 改为 "Core Concepts" |
| "Manage RustFS" vs "System Administration" | 两个"管理"分组；IAM 被单独割裂 | 合并为一个 "Administration" |
| "Integration" 装的是 Nginx/TLS/虚拟主机 | 这不是集成，是**网络与接入配置** | 改名 "Networking & Access"，"Integration" 让给生态集成页 |
| "Upgrade, Expansion and Uninstallation" 仅 2 页且无升级/卸载内容 | 名实不符 + 单薄章节 | 改为 "Scaling & Availability"，并入 Operations |
| `concepts/principle/` 套娃（"概念里的核心概念"），只有 1 个实页 | 层级冗余 | 拍平：erasure-coding 直接归入 concepts/ |
| 标签与页面标题大量错位（"Hardware Requirements" ↔ "Production Environment Hardware Configuration Guide"；"Version Control" ↔ "Bucket and Object Versioning" 等） | 损伤信任与可扫读性；"Version Control" 让开发者联想 Git | 统一以页面标题为准生成标签 |
| "Linux Quick Installation" 藏在 Linux 文件夹第一项 | 全站唯一 Quick Start 被埋在三级 | 提升为顶部 "Getting Started → Quickstart" |
| Features（8 页）与 Solutions（10 页）共用 `/features/` | 技术参考与行业营销混在同一路径；`features/cloud-native`（营销）与 `installation/cloud-native`（安装占位页）同名对撞 | 营销页迁至 `/solutions/`，技术能力留 `/features/` |

## 孤儿页面与死链

**死链（导航 → 不存在页面）：无。** 全部 63 个导航目标均存在。

**孤儿页面（存在但任何 meta.json 都不可达，共 21 个 / 88 个，24%）：**

`concepts/introduction.md`（高价值——产品第一认知页）、`installation/index.md`、`installation/checklists/index.md`、`installation/cloud-native/index.md`（占位空页）、`management/index.md`、`developer/index.md`、`concepts/index.md`、`about/index.md`、`trademark/index.md`、`deep/nested/test-deep.md`（应删除）、`features/{aliyun,aws-elastic,huaweicloud,qcloud,openshift,tanzu}/index.md`（6 个 K8s 平台方案页）、`features/{veeam,commvault}/index.md`（备份集成页）、`features/baremetal/index.md`、`features/small-file/index.md`（技术特性，值得救回）、`features/integration/index.md`。

**连带后果**：`sitemapPlugin`/`llmsPlugin` 仍会收录全部孤儿（包括 test-deep 与占位页），搜索引擎与站内搜索可以搜到，点进去却没有侧边栏定位——体验断裂。

**正文级断链风险（非 404，但落到孤儿页）**：`content/index.md` → `/installation/`、`/developer/`；`developer/mc.md` → `../installation/index.md`；`installation/linux/quick-start.md` → `../checklists/index.md`；`management/object/creation.md` → `../../installation/index.md`。

## 新版信息架构提案

设计原则：① 四类角色各有主入口——评估者（Concepts+Solutions）、新手开发者（Getting Started）、运维/SRE（Installation+Administration+Operations）、应用开发者（Developer）；② 漏斗渐进：5 分钟上手在前，生产部署在后；③ 营销与技术分离：`/solutions/` 独立命名空间；④ 每个章节都是真实文件夹 + index 落地页，根 meta.json 只剩 9 项；⑤ 全部现有文件有去处，仅 3-4 个新增页填明显空洞。

```
content/
├─ getting-started/          【入门 · 新手开发者/评估者】
│   ├─ index.md              ← NEW: 3 段式导览（是什么/装哪种/下一步）
│   ├─ introduction          ← concepts/introduction.md 移入
│   ├─ quickstart            ← installation/linux/quick-start.md 移入，加 Docker 一行命令 Tab
│   └─ console-first-steps   ← NEW: 创建第一个桶并上传对象
├─ concepts/                 【核心概念 · 评估者/架构师】
│   ├─ index / architecture / erasure-coding(拍平) / comparison / limits / glossary
├─ installation/             【安装部署 · 运维/SRE】
│   ├─ index.md（重写为"选择部署模式"决策页）
│   ├─ checklists/（Production Checklists，整组入导航）
│   ├─ linux/{index, snsd, snmd, mnmd} / docker/ / kubernetes/(NEW,替换 cloud-native 占位页) / windows/ / macos/
├─ administration/           【管理 · 运维+使用者】
│   ├─ index ← management/index.md
│   ├─ buckets/ ← management/bucket/*   objects/ ← management/object/*
│   ├─ iam/（原地）
│   └─ networking/ ← integration/{nginx,virtual,tls-configured}
├─ operations/               【运维与排障 · SRE】
│   ├─ scanner ← management/object/scanner.md
│   ├─ scaling/ ← upgrade-scale/*
│   └─ troubleshooting/ ← troubleshooting/*（healing 与 scanner 建议合并）
├─ developer/                【开发者 · 应用开发者】
│   ├─ index / sdk/* / mc / mcp
│   └─ s3-compatibility ← features/s3-compatibility（开发者最需要的兼容性参考）
├─ features/                 【功能特性（技术参考）】
│   └─ distributed / versioning / worm / replication / encryption / lifecycle / logging / small-file(救回)
├─ solutions/                【解决方案（营销） · 评估者/决策者】
│   ├─ index.md(NEW: 分类卡片总览)
│   ├─ data-lake / ai / hdfs / sql-server / quantitative-trading / industry / cold-archiving / video / domestic / cloud-native / integrations
│   ├─ kubernetes/{aliyun, aws-eks, huawei-cce, tencent-tke, openshift, tanzu}（6 个孤儿全部救回）
│   ├─ backup/{veeam, commvault}（孤儿救回）
│   └─ baremetal（孤儿救回）
└─ about/                    【关于】
    ├─ index（救回） / trademark（救回） / license ← developer/license.md
```

**侧边栏首屏效果**：第一屏即 Getting Started；评估者 2 次点击到 comparison，运维 2 次点击到 checklists，开发者 2 次点击到 SDK——四类角色均有直达路径。

**配套动作（必须）**：
1. 删除 `content/deep/`（测试残留）。
2. 顶栏 "Installation" 改指 `/installation/`。
3. 所有 URL 变更配置重定向；若静态托管无法做 301，可先执行**零 URL 变更降级版**：只改 meta.json（章节文件夹化、救孤儿、改标签），文件暂不搬——上表 90% 的收益（孤儿清零、Getting Started 置顶、命名修复）不依赖搬文件。
4. 中文站（docs.rustfs.com.cn）同步同一套树，避免两站结构漂移。

## 文件迁移映射表（88 个文件全量处置）

统计：原地 44、移动 39、合并 2、重写 2、删除 1；新增 4 个薄页（getting-started/index、console-first-steps、solutions/index、operations 总览可选）。

| 旧路径（content/ 下） | 处置 |
|---|---|
| `index.md` | 原地（"Explore" 链接改指各新章节 index） |
| `concepts/introduction.md` | 移动 → `getting-started/introduction.md` |
| `installation/linux/quick-start.md` | 移动 → `getting-started/quickstart.md` |
| `concepts/index.md` | 重写（章节落地页，吸收 principle/index.md） |
| `concepts/{architecture,comparison,glossary,limit}.md` | 原地 |
| `concepts/principle/index.md` | 合并 → `concepts/index.md` 后删除 |
| `concepts/principle/erasure-coding.md` | 移动 → `concepts/erasure-coding.md` |
| `installation/index.md` | 原地，**入导航**（重写为部署模式决策页） |
| `installation/checklists/*`（6 文件） | 原地，整组入导航（标签统一 "... Checklist"） |
| `installation/linux/index.md` | 重写标题 "Installing on Linux"，删 What-is-RustFS 段 |
| `installation/linux/{single-node-single-disk,single-node-multiple-disk,multiple-node-multiple-disk}.md` | 原地 |
| `installation/docker/index.md` | 原地 |
| `installation/cloud-native/index.md` | 重写 → `installation/kubernetes/index.md`（真实 K8s/Helm 安装文档） |
| `installation/{windows,macos}/index.md` | 原地 |
| `management/index.md` | 移动 → `administration/index.md`，入导航 |
| `management/bucket/*`（3 文件） | 移动 → `administration/buckets/*`（删 "Bucket Copying" 画饼项） |
| `management/object/{index,creation,deletion}.md` | 移动 → `administration/objects/*` |
| `management/object/scanner.md` | 移动 → `operations/scanner.md` |
| `administration/iam/*` | 原地（删未实现的裸列表或标注 Roadmap） |
| `integration/nginx.md` | 移动 → `administration/networking/nginx.md` |
| `integration/virtual.md` | 移动 → `administration/networking/virtual-host.md` |
| `integration/tls-configured.md` | 移动 → `administration/networking/tls.md` |
| `upgrade-scale/*`（2 文件） | 移动 → `operations/scaling/*`（删 4 个画饼 bullet） |
| `troubleshooting/*`（4 文件） | 移动 → `operations/troubleshooting/*` |
| `developer/index.md` | 原地，入导航（删 STS/API 画饼） |
| `developer/{mc,mcp}.md` | 原地（标签 "MinIO Client (mc)"、"MCP Server"） |
| `developer/license.md` | 移动 → `about/license.md` |
| `developer/sdk/*`（8 文件） | 原地 |
| `features/s3-compatibility/index.md` | 移动 → `developer/s3-compatibility.md` |
| `features/{distributed,versioning,worm,replication,encryption,lifecycle,logging}/index.md` | 原地（修 encryption 标题；标签见上文） |
| `features/small-file/index.md` | 原地，**入导航** |
| `features/{data-lake,ai,hdfs,sql-server,quantitative-trading,industry,cold-archiving,video,domestic,cloud-native}/index.md` | 移动 → `solutions/<同名>/index.md` |
| `features/integration/index.md` | 移动 → `solutions/integrations/index.md`，入导航 |
| `features/{aliyun,aws-elastic,huaweicloud,qcloud,openshift,tanzu}/index.md` | 移动 → `solutions/kubernetes/{aliyun,aws-eks,huawei-cce,tencent-tke,openshift,tanzu}.md`，入导航 |
| `features/{veeam,commvault}/index.md` | 移动 → `solutions/backup/*.md`，入导航 |
| `features/baremetal/index.md` | 移动 → `solutions/baremetal/index.md`，入导航 |
| `about/index.md` | 原地，**入导航** |
| `trademark/index.md` | 移动 → `about/trademark.md`，入导航 |
| `deep/nested/test-deep.md` | **删除**（连同 `content/deep/`） |
