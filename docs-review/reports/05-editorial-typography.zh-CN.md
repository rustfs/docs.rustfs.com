# 专项评审 · 内容质量与排版（技术编辑视角）

> 评审范围：`content/` 下全部 88 个 Markdown 文件逐一审阅；量化数据均附可复现命令。

## 一、全站体检数据

| 检查项 | 结果 | 检查方式 |
|---|---|---|
| 文档总数 | 88 个 .md | `find content -name "*.md" \| wc -l` |
| 正文以重复 H1 开头（违反 frontmatter title 即 H1 的站点约定） | **6 页** | awk 取 frontmatter 后首个非空行判断 `^# ` |
| 标题层级跳跃（H1→H3、H2→H4） | 3 处 | 扫描围栏外 `^#{1,6}` 序列 |
| 编号标题（`## 1.` / `## 1)` / `## I.`）页面 | 12 页、3 种编号风格并存 | `grep -E '^#{2,6} ([0-9]+[.)]\|[IVX]+\.) '` |
| 无语言标注的代码围栏 | **26 处 / 11 个文件** | 扫描 ``` 开栏无 lang |
| 残留 CJK 字符 | 0 处 | `grep -rPn "[\x{4e00}-\x{9fff}]"` |
| 产品名大小写错误 | `rustFS` 1 处（quantitative-trading:78）、`MacOS` 3 处 | `grep -rn 'Rustfs\|rustFS\|MacOS'` |
| 裸 URL（未用 Markdown 链接） | 8 处 | 正则扫描围栏外 `https?://` |
| 相对链接指向不存在文件 | 0 处（文件级全部有效） | 自写链接检查脚本 |
| **失效锚点** | ≥3 处 | 人工比对 `<a id>` 与 `#fragment` |
| 磁盘图片 / 被引用 / **孤儿图片** | 145 / 83 / **62（43%）** | 引用集合与 glob 文件集合对比 |
| 中文界面截图出现在英文页面 | ≥4 张（逐张查验确认） | Read 查看图片 |
| frontmatter 缺 title / description | 0 / 0 | 解析 frontmatter |
| description 以 `…` 截断（SEO 文案未写完） | 6 页 | 同上 |
| **重复 title** | 1 对：`features/distributed` 与 `features/encryption` 同为 "Infrastructure for Large-Scale Data" | 同上 |
| 正文首行 = description 原文复读（口号式开场） | **19 页** | 前缀比对 |
| 不在任何 meta.json 导航中的页面 | **27 页** | nav 条目与文件 slug 比对 |
| "Last Updated" 尾注 | 全站 0 页（规范提及但无人使用，建议删除该规范或改为构建时自动生成） | `grep -rin "last updated"` |
| emoji | 87 个集中在 15 个文件；`:::` 提示框 24 处 vs 裸引用块 38 行混用 | Unicode 区间扫描 |
| 营销性最高级 | comprehensive 21、seamless 11、extremely 11、"world's fastest" 2、"no better solution in the market" 1 | `grep -riE` |

## 二、典型问题与例证

### 1. 机翻/LLM 生成痕迹直接残留（最伤专业形象）
- `developer/sdk/java.md:149` — 正文赫然写着 **"Good, below is the RustFS AWS S3 Java SDK Advanced Features Example Supplement"**（LLM 对话开场白未删）。
- `developer/sdk/go.md:126` — "It's even simpler with the help of an llm!"；`typescript.md:129`、`rust.md:191` 同款 "If you use Vibe Coding, it becomes even simpler!"。
- `installation/linux/index.md:32-39` — "therefore, RustFS can meet various needs" 同一列表连出现 3 次；"RustFS is **100% secure**"、"infinitely close to C language speed" 均是中式直译+过度承诺。
- `single-node-*.md` "The official strongly recommends"（主语悬空直译）×3；`multiple-node-multiple-disk.md:214` "modify the username and password in the systemctl startup configuration file"（应为 user/group，翻译错义）。

### 2. 复制粘贴串台
- `features/aliyun/index.md:68,72`、`aws-elastic/index.md:50,60,68,72`、`tanzu/index.md:50,60,68,72,74` — 阿里云/AWS/Tanzu 页里仍写 "RustFS integrates with **OpenShift** certificate manager"、"installed in the **OpenShift-user-workload-monitoring** project"。对目标读者是事实性错误。
- `features/aliyun/index.md:14` — 平台列表同名重复 "(Alibaba Cloud ACK, Tanzu, Azure, GCP, **Alibaba Cloud ACK**)"。
- `features/encryption/index.md:2` — title/首段整体照抄 distributed 页。
- `features/cold-archiving/index.md:26,42` — 同页两个 `### Power-Off Network Disaster Recovery`，第二个实际讲防勒索/air gap。

### 3. 同一事实全站互相矛盾（比病句更危险）
- **控制台端口三个版本**：9001（`single-node-single-disk.md:324`）vs 7001（`macos/index.md:57`、`windows/index.md:50`）vs 9090（`security-checklists.md:52`）。
- **Prometheus 同页自相矛盾**：`features/logging/index.md:20` vs `:38`。
- **文件系统**：安装页强制 XFS 并点名"避免 ext4"，换盘教程 `troubleshooting/driver.md:49` 示范 `mkfs.ext4`。
- **Path-style**：`sdk/python.md:221` 称 "RustFS only supports path-style"，`integration/virtual.md` 整页讲启用 Virtual Host Style。
- **内核版本**：`software-checklists.md:11` 推荐 5.x+（io_uring），三个 Linux 安装页写 "4.x and above"。
- **性能数字四个版本**：`concepts/comparison.md:50`（读 323 GB/s 写 183 GB/s）、`data-lake:32`（325/165 GiB）、`cloud-native:42`（325/171 GiB）、`veeam:40`（160 GiB）。
- **CLI 工具名漂移**：`rustfs-admin`（driver.md，自称 hypothetical）、`rc admin heal`（healing.md）、`rustfs-server`+`rc cluster status`（node.md），与安装页统一的 `rustfs`/`rustfs.service` 不符——排障三页整体像从其他产品文档改写而来（`network-checklists.md:72-73` 甚至出现 Serf 7946、VxLAN 4789 端口）。

### 4. 结构违规与占位残留
- 6 页正文重复 H1；测试页 `deep/nested/test-deep.md` 与占位页 `installation/cloud-native/index.md`（title "English Documentation"）在线上。
- 索引页无链接占位项 9 处：`concepts/principle/index.md:9-12`（"Stripes" 重复两次）、`management/bucket/index.md:10`、`management/object/index.md:10-12`、`developer/index.md:8,12`、`upgrade-scale/index.md:9-12`。
- `developer/sdk/other.md:71` 末节 `## Summary Recommendations` 下**无任何内容**；6 个平台页 "Learn More:" 后面无链接。
- 平行操作层级混乱：`bucket/creation.md` 的 UI 用 H2、mc/API 用 H3，而 `bucket/deletion.md` 全用 H2；`object/creation.md:70-91` 整段重复了 deletion 页内容。

### 5. 隐私与安全细节泄漏
- 个人路径：`object/creation.md:88`、`object/deletion.md:50`、`sdk/typescript.md:96` 出现 `/Users/jhma/Desktop/…`，示例文件还叫 `password.txt`。
- 真实感 AccessKey `H4xcBZKQfvJjEnk3zp1N` 在 curl 示例出现 5 处，且与 `administration/iam/images/access_token_creation.png` 截图中的密钥一致——应全部替换为明显假值。
- `docker/index.md:171`、`developer/mcp.md:129` 用 `git@github.com:` SSH 克隆地址，对无 SSH key 读者不可用，应改 HTTPS。

### 6. 营销化文风侵入技术文档
- 不可核验的宏大数字："over 280,000 Docker pulls"（ai:44，疑为 MinIO 数据）、"2M+ IPs"（cloud-native:54）、"250PB daily"（data-lake:50）、"VFC-3 patent"（video:28）、"Cohasset Associates" 报告称可下载却无链接（worm:36-38）。
- 销售话术收尾："Contact us immediately to get century-long storage cost optimization solutions"（cold-archiving:145-147）、"30% Cost Savings Commitment"（industry:82）、货币单位一页 `$` 一页 `¥`（industry:44 vs :67-69）。
- 19 页开场是 description 原文复读；`about/index.md` 混入投资者关系文案，联系邮箱块重复两次（:30-31、:44-45）。

### 7. 排版细节不统一
- 编号风格三分裂：`## 1.` vs `## 1)`（node.md:14）vs 罗马数字 `## I.`（javascript.md 7 处）；`windows/index.md` 编号断档；`erasure-coding.md` 在无编号 H2 下用 `### 1.1.`。
- 提示框三套语法混用：`:::note/tip/warning`（9 文件 24 处，主流）、`> **Note**`（3 处）、`> ⚠️/✅/💡` emoji 引用。
- emoji 集中滥用于个别页（mcp.md 5 个 H2 全带、commvault 10 个 H3、versioning 红绿黄圆点），其余 73 页零 emoji。
- 表格问题：`features/integration/index.md:27-94` 空表头表格排 logo 墙（无障碍差、移动端溢出）；`comparison.md` `√`/`x` 混用；`glossary.md` 大表带无意义 "No." 列且 "Storage Gateway" 重复收词（#42、#86）；对照表 `✓`/`✅`/`▲▼` 混用。
- 代码块内容错位：`network-checklists.md:68-74` 的 ```bash 围栏里是端口清单不是命令；`hardware-checklists.md:92-102` Python 函数体无缩进；java/python/javascript 代码普遍丢失缩进成单空格（python.md:178-179 实为 SyntaxError）。
- 列表尾随分号（中文顿号习惯）：macos、windows、single-node-single-disk 多处。
- 人称混杂："we recommend"（29 个文件）、"you can"、无主语祈使句、"The official recommends" 并存。

## 三、重复内容分析

1. **六个 K8s 平台页是同一模板**（aliyun/aws-elastic/huaweicloud/openshift/qcloud/tanzu，各 81-85 行）：两两行级相似度 **75%-85%**（difflib 实测）；20 个 >80 字符段落逐字出现在 2-6 个页面，仅替换平台名且替换不彻底。建议抽出 "RustFS on Kubernetes 通用能力" 单页，各平台页只留差异化前置条件与部署入口。
2. **Linux 三种安装模式页互为复制体**：SNMD vs MNMD 相似度 **87%**，SNSD vs SNMD 74%——约 250 行 ×3 份，已出现漂移（表头 "Recommended Check Level" vs "Recommended Parity Level"；MNMD:86 残留"单机模式请跳过本步"的合并稿痕迹）。
3. **"What is RustFS" 三处重复**：`concepts/introduction.md`、`installation/index.md`（9 条 Features 逐字相同）、`installation/linux/index.md`（更旧的机翻版本）。
4. **commvault 与 veeam** 共用整节（含相同 emoji 标题）；veeam:20 甚至忘了把 "virtual infrastructure" 换成 Office 365。
5. **sql-server（507 行）大段扩写自 ai 页**，同义反复 bullet 全页占比 44%。
6. 架构 Mermaid 大图在 `concepts/architecture.md`、`features/distributed`、`upgrade-scale/availability-and-resiliency.md` 三处整段复制。

## 四、断链与图片问题清单

**链接（文件级 0 断链；以下为锚点/语义级）**
1. `macos/index.md:21`、`windows/index.md:14` → `../linux/index.md#mode`：锚点实际在 `quick-start.md:6`，**失效**。
2. `developer/mcp.md:173` → `(#️-available-tools)`：含 emoji 变体符的手写锚点，与渲染 id 大概率不匹配。
3. `docker/index.md:22` → "see Section 4"（config.toml）：目标章节不存在。
4. 索引页无链接占位项 9 处（对读者等同断链）。
5. 27 页未挂入任何导航。
6. 裸 URL 8 处（license.md:14,197、sdk/other.md:20、quick-start.md:33、nginx.md:198,217、trademark:60、availability-and-resiliency:234）。
7. `availability-and-resiliency.md:130` 版本目录 `1.0.0-alpha.67` 配 `…-latest.zip` 文件名自相矛盾；`:144` `node-{1...4}` 与 `:219` `node{5...8}` 一横杠之差，照抄配置失败。

**图片**
1. **中文 UI 截图用于英文页**（逐张查验）：`installation/linux/images/console.jpg`（登录页全中文，被三页引用）、`administration/iam/images/access_token_creation.png`、`management/bucket/images/bucket-creation-by-ui.png`、`developer/images/add-rustfs-mcp-succ.png`（Trae 中文界面）。
2. **截图与平台不符**：`installation/windows/images/windows-setup.jpg` 是 **macOS 窗口样式**（红黄绿灯）却用于 Windows 页；windows 与 macos 共用 `setting.jpg`。
3. **孤儿图片 62 张（43%）**：`features/domestic/images/` 8 张全孤儿、`data-lake` 10 张、`ai` 10 张、`about/images/office-location.png`（799KB）等。
4. **体积离群**：`about/images/vision-values.png` **1.38MB**、`cloud-native/multi-cloud-architecture.png` 965KB、`ai-performance.png` 780KB；300KB+ 共 14 张。建议压缩 WebP/限宽 1600px。
5. 无意义 alt：`features/integration` 36 张 logo 的 alt 是 "Monitoring 1/2/3" 式编号。
6. `mc.md`、`object/creation.md:40` 用 ```bash 承载命令输出，语言标注名不副实（输出应用 ```text）。

## 五、文风与排版规范建议（可直接写入 STYLE.md）

**1. 语气与人称**：面向读者一律 "you"；官方建议统一 "We recommend"；禁用 "The official recommends"。技术页禁用最高级与承诺式措辞（fastest、100% secure、perfect）；性能数字全站单一出处（建 benchmarks 单页，其余只链接），统一 GiB/s。营销类内容要么迁往官网，要么重写为"场景 → 参考架构 → 配置步骤"；删除 "Contact us immediately" 类 CTA。

**2. 页面骨架**：description 必须是完整独立句（禁 `…` 截断、禁与正文首段重复）；正文不得再有 H1；开场段模板"X 是什么 + 本页做什么 + 前置条件"；标题不编号；层级不跳级；同层平行操作（UI/mc/API）用同级标题；连续 bullet 不超过 7 条；禁止 `**Bold**:` 单独成行充当标题（现存 31 处）；删除手写 TOC 与 `<a id>` 锚点。

**3. 提示框与强调**：统一 `:::note` / `:::tip` / `:::warning[Title]`；废除 `> **Note**` 与 `> ⚠️` 两种写法；emoji 全站禁用于标题与列表符号（状态改文字 Yes/No）。

**4. 代码块**：所有围栏带语言（26 处待补）；命令用 bash、输出独立 text 块、配置文件用 ini/yaml/nginx 并带 `title="/etc/…"`；凭据一律 `<your-access-key>` 占位；示例路径 `/path/to/file`；git 克隆用 HTTPS；代码必须可运行（修复 java/python/javascript 丢失的缩进）；示例桶名统一 `my-bucket`、endpoint 统一。

**5. 表格**：只用于真正的对照数据；logo 墙改图片组或组件；布尔值统一 Yes/No；同一表格族措辞统一。

**6. 截图**：英文站只允许英文界面截图；按页面平台截图；统一浅色主题、~1600px 宽、≤300KB；alt 描述"界面位置+动作"。

**最优先 10 个修复**（影响可信度、工作量小）：java.md:149 对话残句、go/ts/rust 的 "llm/Vibe Coding" 收尾、aliyun/aws/tanzu 的 OpenShift 残留、encryption 页错误标题、logging 页 Prometheus 自相矛盾、driver.md 的 ext4 示例、控制台端口统一、/Users/jhma 与真实 AccessKey 清理、两个占位/测试页下线、`#mode` 失效锚点。
