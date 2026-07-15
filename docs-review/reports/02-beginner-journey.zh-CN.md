# 专项评审 · 新手旅程与教学设计（教育专家视角）

> 评审方式：模拟一个"听说过 RustFS、想在 10 分钟内跑起来"的完全新手，从首页开始走完 安装 → 登录控制台 → 建桶 → 上传 → 接入应用 全旅程。以下引用均为 `content/` 下相对路径 + 行号。

## 一、新手旅程走查

### Step 0 首页 `index.md`
- `index.md:12` 承诺 "What is RustFS? — architecture, features, and design principles"，但目标页 `concepts/introduction.md` 无架构内容（架构在 `concepts/architecture.md`），承诺与落地不符。
- 没有一条"10 分钟跑通"的端到端路径；"Get Started" 三个链接全部只覆盖"装"这一半，没有"装完之后干什么"。
- `concepts/introduction.md` 不在侧边栏导航中，从导航进来的用户永远看不到它。

### Step 1 概念入门 `concepts/introduction.md`
全篇市场语言，无图、无命令、无下一步链接，页尾停在愿景宣言（:33-35），典型死胡同。特性列表与 `installation/index.md:33-43`、`installation/linux/index.md:30-40` 三处近乎逐字重复，后者还有 "RustFS is 100% secure"（`installation/linux/index.md:36`）这类经不起推敲的断言。

### Step 2 安装总览 `installation/index.md`
一半以上篇幅（:6-21、:33-47）是与安装无关的重复营销文案；没有"选哪个？"的决策指引（如"本机试用选 Docker，服务器试用选 Linux 快速安装"）。

### Step 3 Linux 快速安装 `installation/linux/quick-start.md`（旅程核心断裂点）
1. **脚本跑完后发生什么，只字未提**——无预期输出、无验证方式、无控制台地址、无登录凭证、无"下一步：创建桶"。新手在最兴奋的时刻被扔在命令行前。
2. **凭证从未说明**：脚本会用什么 access key？全站搜不到默认值。
3. **控制台端口从未提及**：备注只说 "Default installation port is 9000"（:29），控制台实际在 9001。
4. **未学先考**：标题是 Quick Start，第 1 节却先灌 SNSD/SNMD/MNMD 三个缩写（:14-16）——这三个缩写在 `concepts/glossary.md` 里也查不到。
5. 结尾 5 条"重要说明"（防火墙、NTP、IO-Uring、SELinux）全是生产关切，无命令、无解释、无链接（:35-41），对"先试试"的新手是纯噪音。

### Step 4 SNSD 完整安装 `installation/linux/single-node-single-disk.md`
- **进度铺垫过重**：单机试用场景要先读完 EC 冗余等级表（:101-107）、JBOD vs RAID 论述（:109-120）、三大段 XFS 论证（:124-132）才见到第一条安装命令（:203）。"Erasure Coding" 出现时尚未被任何前置页面解释，也没有链接到已存在的 `concepts/principle/erasure-coding.md`。
- **防火墙只开 9000**（:67-73），本页结尾却要求访问 9001 控制台（:324）——照文档做，远程访问控制台必然被自己配置的防火墙拦截。
- **凭证再次留白**：环境变量给 `<your-access-key>` 占位（:217-218），控制台一节（:322-326）只说"试着访问控制台"，不说用哪组账号密码登录。
- `:78` "production environments need a minimum of 128 GB of memory"——单机试用文档里的吓退级生产门槛。
- 页尾止步于控制台截图，没有"下一步：登录 → 创建桶"。

### Step 5 Docker 安装 `installation/docker/index.md`
- `:6` 第一句就是 "the backend uses zero erasure coding without additional data redundancy"——新手第一段撞上未解释的"零纠删码"。
- **失约的引用**：`:22` 说配置写在 `/etc/rustfs/config.toml`"(see Section 4 for details)"，但第 4 节（:240）是 "Verification and Access"，全文再没出现过 config.toml。
- **9001 被映射但从未解释**：每条 `docker run` 都有 `-p 9001:9001`，但参数说明只解释 9000；全页没有一句"打开 http://localhost:9001 即控制台"。`:238` 只说通过 `http://localhost:9000` 访问实例（那是 S3 API，不是浏览器界面）。
- **示例过载**："完整参数示例"（:65-83）同时塞进环境变量与命令行参数两套写法、再叠加与快速上手无关的 `RUSTFS_SERVER_DOMAINS=example.com`。
- 亮点：全站唯一有"验证部署成功"闭环（mc mb + mc ls）和预期输出的安装页。

### Step 6 Windows / macOS
- **没有下载链接**："Go to the official website download page"（`windows/index.md:20`、`macos/index.md:27`）——连 URL 都没有。
- **锚点失效**：两页都指向 `../linux/index.md#mode`，但 `#mode` 锚点实际在 `quick-start.md:6`。
- **控制台端口第三个版本**：`http://127.0.0.1:7001`（`windows/index.md:50`、`macos/index.md:57`），与 Linux 的 9001 冲突且无解释。
- "Modify Permissions" 只说"请确认有执行权限"，不给 macOS 实际需要的 `xattr` 操作。

### Step 7 登录控制台（文档空白）
**全站没有任何一页讲控制台登录**：登录页长什么样、用户名密码填什么、登录后首页有什么。所有管理页都以 "Log in to the RustFS Console" 一句带过。唯一暗示默认凭证存在的地方是安全清单 `security-checklists.md:29-30`（"Change Default Credentials"），但"默认凭证"的值全站未出现。

### Step 8 创建桶、上传文件 `management/bucket/*`、`management/object/*`
- UI 步骤简洁清楚，截图齐全（亮点）。
- **API 示例不可复现**：手写 AWS SigV4 签名头的 curl（`bucket/creation.md:48-51`、`object/creation.md:60-66`）——签名对具体时间戳和密钥计算，读者复制必然 403。应改用 `aws s3api` 或注明生成方式。
- 示例上传的文件叫 `password.txt` 且带作者私人路径 `/Users/jhma/Desktop/password.txt`（`object/creation.md:60,88`）——对象存储教程演示"上传密码文件"是糟糕示范。
- 悬空列表项：`bucket/index.md:10` "Bucket Copying"；`object/index.md:10-12` "Object Versioning / Locking / Sharing" 全是纯文本。
- mc 路线循环依赖：`mc.md` 前置要求 access keys → `access-token.md` 要求先登录控制台 → 控制台登录无文档。

### Step 9 连接应用 `developer/*`
- `developer/index.md:8,12` 列出 "STS"、"API Usage Guide" 两个无链接死项。
- `mc.md:11` 前置 "The mc tool is installed"——不给安装命令或官方链接；`:19` 端点用占位 IP `12.34.56.78`。亮点：每条命令都有预期输出，是全站期望输出做得最好的页面。
- `sdk/index.md:12` "the SDKs provided by RustFS include" 措辞误导——列出的全是 AWS SDK 用法，并非 RustFS 出品。

## 二、断点清单（按杀伤力排序）

| # | 断点 | 后果 |
|---|------|------|
| 1 | **默认凭证全站无处可查**，所有安装路径用 `<your-access-key>` 占位，快速安装脚本用什么凭证空白 | 新手到达登录页即卡死，10 分钟旅程终结 |
| 2 | **控制台地址三处矛盾且无权威出处**：9001（Linux）vs 7001（Windows/macOS）vs 只字不提（quick-start）；`RUSTFS_CONSOLE_ADDRESS` 全站只出现一次 | 不知道浏览器该打开哪个端口 |
| 3 | **quick-start 脚本跑完即死胡同**：无输出、无验证、无控制台、无凭证、无 next | 首页主推路径无法走完第一小时 |
| 4 | **防火墙指引自相矛盾**：SNSD/MNMD 只放行 9000，同文档却要求访问 9001 控制台 | 照做即被防火墙拦截 |
| 5 | **Windows/macOS 无下载链接** | 桌面用户第一步就无法开始 |
| 6 | **控制台登录/首页无任何文档** | UI 旅程缺第一环 |
| 7 | **mc → access key → 控制台的循环依赖** | CLI 旅程也绕回断点 6 |
| 8 | **失效锚点** `../linux/index.md#mode` | 新手被引向不存在的段落 |
| 9 | **悬空导航项**（Bucket Copying、Versioning/Locking/Sharing、STS、API Usage Guide） | 显得未完工，削弱信任 |
| 10 | **不可复现的手写 SigV4 curl 示例** | 复制必失败，且无失败解释 |
| 11 | `concepts/introduction.md` 等 hub 页不在侧边栏 | 首页承诺的内容在导航中不可达 |
| 12 | Docker 页引用不存在的 config.toml 章节 | 配置文件路线是断头路 |

**跨页默认值冲突汇总**：
- S3 端口 9000：全站一致（唯一可靠常量）。
- 控制台端口：9001 vs 7001（windows/macos）。
- 数据路径：`/data/rustfs0`（Linux）vs `/mnt/rustfs/data`（Docker）。
- Region：`us-east-1`（python/java/js/mcp）vs `cn-east-1`（typescript、bucket-creation 签名）。
- 示例端点：`192.168.1.100:9000` vs `12.34.56.78:9000` vs `localhost:9000` vs `rustfs.local:9000`。

## 三、"五分钟快速上手"应有的样子

目前**不存在**任何一页能端到端跑完"启动 → 控制台 → 建桶 → 第一次 PUT"。素材散落各处，重写 `quick-start.md` 结构如下：

1. **一条命令启动（Docker/Linux 二选一 Tab）**——Docker 命令补显式凭证与控制台开关；Linux 脚本补"脚本输出示例 + 凭证说明"。
2. **启动成功长这样**：容器日志/`systemctl status` 预期输出。
3. **打开控制台**：明确 `http://localhost:9001` + 登录页截图 + "输入你在第 1 步设置的 ACCESS_KEY/SECRET_KEY"。
4. **创建第一个桶**：三步 UI 操作 + 截图（搬 `bucket/creation.md:14-20`）。
5. **上传第一个文件**：UI 方式（搬 `object/creation.md:18-29`）+ 命令行一行（aws cli / mc）。
6. **验证读回**：`mc ls` / `aws s3 ls` + 预期输出。
7. **下一步**：三张卡片——生产部署（SNSD/SNMD/MNMD 选型下移到这里）、SDK 接入、核心概念。

七步中仅第 2、3、7 步需新写，其余全部是既有片段重组。

## 四、SDK 快速开始评分表（满分 5）

| SDK | 评分 | 关键问题 |
|---|---|---|
| Python | 3.5 | 全篇 1 空格缩进；**多段上传代码缩进损坏成语法错误**（:177-195）；排障表提 path-style 但初始化处不讲 |
| Java | 3 | **正文残留 LLM 对话痕迹 "Good, below is the …"（:149）**；进阶示例缺 import；Presigner 未设 path-style |
| JavaScript | 3.5 | 未说明 ESM/顶层 await 环境要求；multipart 代码中段插 import 结构混乱 |
| TypeScript | 1.5 | 无安装命令、无 import，不可运行；**未设 forcePathStyle**；region 用 `cn-east-1` 与他页冲突；作者私人路径 `/Users/jhma/Desktop/1.txt`（:96）；结尾 "If you use Vibe Coding, it becomes even simpler!"（:129） |
| Go | 2 | 无 `go get`、无 import、`ctx` 未定义；多数代码块无语言标注；结尾 "It's even simpler with the help of an llm!"（:126） |
| Rust | 1.5 | 无 Cargo.toml 依赖、无 use 声明；**未设 force_path_style（对 IP 端点大概率直接失败）**；诡异桶名 `cn-east-1rust-sdk`（:95）；同款 "Vibe Coding" 结尾（:191） |

共性：没有一篇给出运行成功后的预期输出；没有一篇把端点/凭证与安装页的实际产物对接。

## 五、教学性改进建议（按优先级）

**P0 修复旅程致命断点**
1. 五个安装页统一补齐"安装后三件事"：控制台 URL（澄清 9001/7001 及来源变量）、登录凭证、下一步链接。
2. 新建/重写"5 分钟快速上手"（见第三节大纲），首页 Quick Start 指向它；SNSD/SNMD/MNMD 选型阅读下移至"下一步"。
3. 补 Windows/macOS 下载 URL；修复 `#mode` 锚点。
4. SNSD/MNMD 防火墙节补开 9001。

**P1 消除自相矛盾与不可复现内容**
5. 全站统一示例常量：端点、region `us-east-1`、数据路径、演示桶名；清理 `cn-east-1`、`12.34.56.78`、`/Users/jhma/...`。
6. 手写 SigV4 curl 替换为 `aws s3api`；演示文件 `password.txt` 改 `hello.txt`。
7. Docker 页删除 config.toml 承诺；解释 9001；首个完整示例移除 SERVER_DOMAINS。
8. 补齐或删除全部悬空项。

**P2 SDK 达到"可复制运行"标准**
9. 每篇 SDK 补依赖安装、完整 import、衔接安装页的端点凭证、预期输出、path-style 说明；修 Python 缩进；删 Java 对话残留与三处 "llm/Vibe Coding" 结尾。

**P3 语气与信息架构**
10. 三处重复的特性/价值观块收敛为一处；删 "100% secure" 类断言。
11. hub 页纳入侧边栏。
12. SNSD 的 XFS 论证与 EC 表折叠为"生产调优"或外链 erasure-coding 页；glossary 增补 SNSD/SNMD/MNMD 词条。
13. 为无输出的验证步骤补预期输出（参照 mc.md 的好做法）。

**总体判断**：安装骨架和管理页截图已齐，mc/Docker 页已具备输出示例的好习惯；但"装完之后的前五分钟"——凭证、控制台入口、第一次成功反馈——是系统性空白，三个控制台端口、四种示例端点的漂移进一步放大迷失感。P0 四项补上，新手 10 分钟旅程即可打通。
