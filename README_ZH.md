# RustFS 文档贡献指南



欢迎来到 RustFS 社区！我们非常感谢您有兴趣为我们的文档做出贡献。您的每一份力量，无论是修正一个错字，还是翻译一整篇指南，都对我们至关重要。本指南旨在为您提供清晰的指引，帮助您顺利地参与到 RustFS 文档的共建中来。

<p align="center">
  <a href="https://github.com/rustfs/rustfs.com/blob/main/README_ZH.md">English </a> |
 简体中文 |
 <a href="https://github.com/rustfs/rustfs.com/blob/main/README_JA.md">日本語</a> |
 <a href="https://github.com/rustfs/rustfs.com/blob/main/README_DA.md">(#deutsch)</a> |
 <a href="https://github.com/rustfs/rustfs.com/blob/main/README_FR.md">Français</a>
</p>

------



(https://img.shields.io/badge/License-CC%20BY%204.0-blue.svg)](https://creativecommons.org/licenses/by/4.0/deed.zh)



(https://img.shields.io/discord/YOUR_SERVER_ID?label=社区交流&logo=discord&color=5865F2)](https://discord.gg/YOUR_INVITE_LINK)



### 目录



1. (#1-rustfs-是什么)
2. 我们的使命：让数据存储更普惠、更安全
3. 您的贡献之旅
   - 快速开始：您的第一个贡献
   - 翻译文档：添加一门新语言
4. 技术工作流程
   - 环境准备
   - 本地开发设置
   - (#43-pull-request-pr-与提交规范)
   - 自动化检查与部署
5. 社区与许可
   - 致谢
   - 内容许可



### 1. RustFS 是什么？



RustFS 是一款简单、高效、分布式的对象存储解决方案。它 100% 兼容 S3 协议，并基于 Apache 2.0 许可发行，是一款对商业应用友好的开源软件。

RustFS 完全采用 Rust 语言编写——这门以内存安全和卓越性能著称的现代编程语言 1。由来自世界各地的优秀工程师共同参与和贡献，RustFS 致力于提供一个强大、可靠的开源替代方案，可作为 MinIO 等产品的直接平替 2。



### 2. 我们的使命：让数据存储更普惠、更安全



我们坚信，无论身处何地，每个人都应享有经济、可靠且安全的数据存储。

高质量、多语言的文档是我们实现这一使命的核心。它不仅仅是项目的附属品，更是降低全球用户和开发者使用门槛的关键。当您翻译一篇指南或修正一个错误时，您正在直接帮助不同语言社区的人们更轻松地构建稳健、经济高效的数据基础设施。您的贡献将赋能全球用户，共同提升数据安全和数据主权的水平。这种社区驱动的知识共享模式，能够将项目的价值最大化，从而真正实现我们的愿景 4。



### 3. 您的贡献之旅



我们为不同类型的贡献者设计了不同的参与路径。无论您是想快速修复一个小问题，还是希望系统性地翻译整个文档，这里都有适合您的指引。



#### 3.1 快速开始：您的第一个贡献



对于新贡献者来说，最简单的参与方式是通过 GitHub 网页界面直接进行。这种方式无需在本地配置开发环境，非常适合进行小范围的修改 6。

您可以进行的简单贡献包括：

- 修正拼写错误或语法问题。
- 修复失效的链接。
- 澄清模糊不清的句子或段落。
- 如果您发现一个问题但不知如何修复，可以创建一个 Issue 来报告它。

**“五分钟” Pull Request 流程：**

1. 在文档网站 `https://docs.rustfs.com/` 上找到您想编辑的页面。
2. 滚动到页面底部，点击“在 GitHub 上编辑此页”链接。
3. 这会将您带到 GitHub 上对应的 Markdown 源文件。点击右上角的铅笔图标 (✏️) 进入编辑模式。
4. 在文本编辑器中进行您的修改。
5. 完成后，滚动到页面底部。在“Propose changes”区域，填写简明扼要的提交信息，例如：“修正安装指南中的拼写错误”。
6. 点击“Propose changes”按钮。GitHub 将引导您完成创建一个 Pull Request 的后续步骤。

这个流程是一个极佳的“贡献者入口”，可以让您在无需任何复杂设置的情况下熟悉我们的协作流程。一次成功的轻量级贡献，往往是参与更深度贡献的开始 5。



#### 3.2 翻译文档：添加一门新语言



这是我们最需要社区帮助的核心领域。请遵循以下步骤来添加或改进翻译。

**第一步：通过 GitHub Issues 进行协调**

为了避免重复劳动和确保工作协同，请在开始翻译前访问我们的 **[GitHub Issues 页面](https://github.com/rustfs/rustfs/issues)**。

- **添加新语言**：检查是否已有其他人正在进行您想翻译的语言。如果没有，请创建一个新的 Issue，标题格式为 `[i18n] Add <Language> (<lang-code>) Translation`，例如：`[i18n] Add German (de) Translation`。这有助于我们追踪进度并指定负责人 7。
- **改进现有翻译**：如果您想改进已有的翻译，可以查找相关的 Issue 或创建一个新的 Issue，详细说明您计划改进的内容。

**第二步：理解目录结构**

我们的文档站使用 VitePress 构建，它通过基于文件的目录结构来管理多语言内容 9。所有文档源文件都位于 

`docs/` 目录下。

```
docs/
├── en/                  # 英文 (或者作为根目录)
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
├── ja/                  # 日文
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
└──.vitepress/
    └── config.ts        # VitePress 配置文件
```

**第三步：添加新的语言包**

1. **Fork 并克隆** 仓库到您的本地，然后创建一个新的分支。

2. 在 `docs/` 目录下，根据您的目标语言，使用对应的 **ISO 639-1 语言代码** 创建一个新的文件夹。请参考下方的语言代码表。

3. 将 `docs/en/` (或根目录下的英文源文件) 的**全部内容**复制到您新建的语言文件夹中。这为您提供了一个完整的、待翻译的文件结构。

4. 打开 `docs/.vitepress/config.ts` 文件，在 `locales` 对象中为您的语言添加一个新的条目。

   例如，要添加德语 (`de`)：

   TypeScript

   ```
   //.vitepress/config.ts
   import { defineConfig } from 'vitepress'
   
   export default defineConfig({
     //... 其他配置
     locales: {
       root: {
         label: 'English',
         lang: 'en'
       },
       // 在这里添加新的语言配置
       de: {
         label: 'Deutsch', // 显示在语言切换菜单中的文本
         lang: 'de',       // HTML lang 属性
         link: '/de/',     // 点击后跳转的链接
         // 在此可以覆盖特定语言的主题配置，例如导航栏和侧边栏文本
         themeConfig: {
           nav: [
             { text: 'Anleitung', link: '/de/guide/getting-started' }
           ],
           sidebar: {
             '/de/guide/':
               }
             ]
           }
         }
       }
     }
   })
   ```

   为了帮助您更好地理解配置，我们提供了以下表格，解释了 `locales` 对象中每个属性的作用 9。

| 属性          | 类型     | 是否必须 | 描述                                                         |
| ------------- | -------- | -------- | ------------------------------------------------------------ |
| `label`       | `string` | 是       | 在导航栏的语言选择下拉菜单中显示的文本。                     |
| `lang`        | `string` | 否       | `<html>` 标签的 `lang` 属性。如果未指定，则使用目录名。      |
| `link`        | `string` | 否       | 当用户选择此语言时重定向到的链接。默认为该语言的根路径（例如 `/ja/`）。 |
| `title`       | `string` | 否       | 为此特定语言环境覆盖站点的主标题。                           |
| `description` | `string` | 否       | 为此特定语言环境覆盖站点的主描述。                           |
| `themeConfig` | `object` | 否       | 特定于语言环境的主题配置。用于翻译导航栏链接、侧边栏文本等。 |

```
这张表格旨在消除配置中的不确定性，确保贡献者能够一次性正确地完成设置，从而减少了来回修改的需要。
```

**第四步：翻译内容**

- 在您新建的语言目录中，逐个打开 Markdown 文件并翻译其中的文本内容。
- **重要提示**：请**不要**翻译以下内容：
  - Frontmatter 中的键名 (例如 `title:`, `layout:`)。
  - 代码块中的任何代码。
  - URL 链接。
  - HTML 标签。
- 只需翻译人类可读的文本。

**第五步：提交您的 Pull Request**

完成翻译后，请遵循(#43-pull-request-pr-与提交规范) 提交您的贡献，并确保将其关联到您在第一步中创建的 Issue。

**语言代码参考**

为保证一致性，请使用下表中标准的 ISO 639-1 代码 13。

| 语言        | ISO 639-1 代码  |
| ----------- | --------------- |
| 中文 (简体) | `zh` 或 `zh-CN` |
| 英语        | `en`            |
| 日语        | `ja`            |
| 德语        | `de`            |
| 法语        | `fr`            |



### 4. 技术工作流程



对于希望在本地进行更深度贡献（如添加新语言包或进行大量修改）的开发者，请遵循以下技术流程。



#### 4.1 环境准备



在开始之前，请确保您的系统中安装了以下软件：

- **Node.js**: 版本 `18.x` 或更高 14。您可以从 

  [Node.js 官网](https://nodejs.org/) 下载。

- **包管理器**: 我们推荐使用 `pnpm` 以获得更高的效率。您可以通过 `npm install -g pnpm` 进行全局安装。当然，您也可以使用 `npm` 或 `yarn` 15。

- **Git**: 版本控制系统。您可以从 [Git 官网](https://git-scm.com/) 下载。



#### 4.2 本地开发设置



请按照以下命令序列在本地启动文档开发服务器：

1. Fork 并克隆仓库

   首先，在 GitHub 上 Fork 本仓库。然后将您的 Fork 克隆到本地。

   Bash

   ```
   # 将 <YOUR_USERNAME> 替换为您的 GitHub 用户名
   git clone https://github.com/<YOUR_USERNAME>/docs.rustfs.com.git
   cd docs.rustfs.com
   ```

2. 安装依赖

   使用 pnpm 安装项目所需的所有依赖项。

   Bash

   ```
   pnpm install
   ```

3. 启动开发服务器

   此命令将启动一个本地开发服务器，并支持热重载。

   Bash

   ```
   pnpm docs:dev
   ```

4. 访问站点

   执行成功后，您应该会在终端看到类似 VitePress dev server running at: http://localhost:5173/ 的输出。在浏览器中打开该地址，即可看到正在运行的文档站点。您对 Markdown 文件所做的任何修改都会即时反映在浏览器中 15。



#### 4.3 Pull Request (PR) 与提交规范



我们遵循一套标准化的工作流程，以确保代码质量和项目历史的清晰度。

- **分支策略**

  - 请始终为您的工作创建一个新的分支，不要直接在 `main` 分支上提交。
  - 使用具有描述性的分支名称，例如 `feat/add-german-translation` 或 `fix/correct-s3-api-typo` 17。

- 提交信息规范

  我们遵循 Conventional Commits 规范。这有助于我们自动化生成更新日志，并使提交历史更易于理解。

  - **格式**: `<type>(<scope>): <subject>`

  - **示例**:

    - `feat(i18n): add initial french translation` (新增功能：添加法语初步翻译)

    - `fix(guide): correct typo in getting-started.md` (修复 Bug：修正入门指南中的拼写错误)

    - docs(contributing): update local development setup (文档：更新本地开发设置说明)

      这种结构化的提交方式是许多成熟开源项目的最佳实践 8。

- **提交 Pull Request**

  1. 将您的分支推送到您的 Fork：`git push -u origin your-branch-name`。
  2. 在 GitHub 上，从您的 Fork 向 `rustfs/docs.rustfs.com` 仓库的 `main` 分支发起一个 Pull Request。
  3. **关联 Issue**：在 PR 的描述中，使用关键词如 `Closes #123` 或 `Fixes #123` 来关联您之前创建的 Issue。这将在 PR 合并时自动关闭该 Issue，是实现工作流自动化的关键一步 7。
  4. **清晰的描述**：在 PR 描述中，清晰地解释您**做了什么**以及**为什么**。如果您的更改涉及视觉变化，请附上前后对比的截图 5。

- **代码审查流程**

  - 提交 PR 后，项目维护者会对其进行审查。
  - 我们可能会提出修改建议。请不要因此感到沮ら。这是开源协作中非常正常的一部分，旨在共同提升贡献的质量。
  - 一旦您的 PR 被批准且所有自动化检查都通过后，维护者会将其合并。



#### 4.4 自动化检查与部署



为了保证文档的质量和稳定性，我们建立了一套完全自动化的 CI/CD (持续集成/持续部署) 流程。

- **自动化检查**：当您提交一个 Pull Request 时，GitHub Actions 会自动运行一系列检查。这些检查会验证文档站点是否能成功构建，并检查代码格式是否符合规范 (Linting) 19。
- **自动部署**：一旦您的 PR 被合并到 `main` 分支，GitHub Actions 会再次触发，自动构建最新的文档站点，并将其部署到 `https://docs.rustfs.com`。

通过明确这一自动化流程，我们希望建立贡献者对项目流程的信任。您无需担心部署的细节，一次成功的合并即代表着一次成功的上线。这让您能够清晰地看到自己贡献的完整生命周期，从提交代码到最终发布 19。



### 5. 社区与许可





#### 5.1 致谢



RustFS 的文档是由社区构建，并服务于社区的。我们对每一位贡献者付出的时间和专业知识表示由衷的感谢。

每一份贡献，无论大小，都弥足珍贵。为了公平、透明地记录所有贡献，我们使用 GitHub 提供的工具来展示每一位贡献者的努力。

您可以在 **[贡献者图谱](https://github.com/rustfs/docs.rustfs.com/graphs/contributors)** 中查看我们所有杰出贡献者的列表。这种自动化、可扩展的方式确保了每一份贡献都能得到应有的认可，且永远保持最新 22。



#### 5.2 内容许可



本项目的所有文档内容均采用 **知识共享署名 4.0 国际许可协议 (Creative Commons Attribution 4.0 International License)** 进行许可 23。

当您向 RustFS 文档项目提交贡献时，即表示您同意您的贡献将以此许可证发布。

根据此许可，您可以自由地：

- **共享** — 在任何媒介以任何形式复制、发行本作品。
- **演绎** — 修改、转换或以本作品为基础进行创作，可用于任何目的，甚至商业目的。

您只需遵守以下条件：

- **署名 (Attribution)** — 您必须给出**适当的署名**，提供指向本许可的链接，同时**标明是否（对原始作品）作了修改**。您可以用任何合理的方式来署名，但不得以任何方式暗示许可人为您或您的使用背书 23。