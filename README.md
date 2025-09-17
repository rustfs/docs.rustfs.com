# RustFS Documentation Contribution Guide

Welcome to the RustFS community! We really appreciate your interest in contributing to our documentation. Your contribution, whether it's fixing a typo or translating an entire guide, is important to us. This guide aims to provide you with clear instructions to help you smoothly participate in the co-construction of RustFS documentation.

<p align="center">
English |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ZH.md">简体中文</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_JA.md">日本語</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_DA.md">Deutsch</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_FR.md">Français</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_TR.md">Türkçe</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_ES.md">Español</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_KO.md">한국어</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_PT.md">Português</a> |
 <a href="https://github.com/rustfs/docs.rustfs.com/blob/main/README_RU.md">Русский</a>
</p>

------

### Table of Contents

1. (#1-what-is-rustfs)
2. (#2-our-mission-accessible--secure-data-for-everyone)
3. Your Contribution Journey
   - (#31-getting-started-your-first-contribution)
   - (#32-translating-the-documentation-adding-a-new-language)
4. (#4-the-technical-workflow)
   - Prerequisites
   - (#42-local-development-setup)
   - (#43-pull-request-pr--commit-guidelines)
   - (#44-automated-checks--deployment)
5. Community & Licensing
   - Acknowledgements
   - Content License

### 1. What is RustFS?

RustFS is a simple, high-performance, distributed object storage solution. It is 100% S3-compatible and released under the Apache 2.0 license, making it a commercially-friendly open-source software.

Written entirely in Rust—the modern programming language known for memory safety and exceptional performance 1—RustFS is developed by a global community of talented engineers. It is designed to be a powerful, reliable open-source alternative and can serve as a direct replacement for products like MinIO.2

### 2. Our Mission: Accessible & Secure Data for Everyone

We believe that data storage should be affordable, reliable, and secure for everyone, everywhere.

High-quality, multilingual documentation is central to this mission. It's not just an add-on; it's key to lowering the barrier to entry for users and developers across the globe. When you translate a guide or fix an error, you are directly helping people in different linguistic communities to more easily build robust, cost-effective data infrastructure. Your contributions empower a global audience, collectively enhancing data security and sovereignty. This community-driven approach to knowledge sharing maximizes the project's value and helps us truly realize our vision.4

### 3. Your Contribution Journey

We have designed different pathways for various types of contributors. Whether you want to quickly fix a small issue or systematically translate the entire documentation, you'll find the right guide here.

#### 3.1 Getting Started: Your First Contribution

The easiest way to get started is by making small edits directly through the GitHub web interface. This method requires no local development setup and is perfect for minor changes.6

Simple contributions you can make include:

- Fixing typos or grammatical errors.
- Correcting broken links.
- Clarifying confusing sentences or paragraphs.
- Reporting an issue for something you don't know how to fix.

**The "5-Minute" Pull Request Process:**

1. Navigate to the page you want to edit on the documentation site `https://docs.rustfs.com/`.
2. Scroll to the bottom and click the "Edit this page on GitHub" link.
3. This will take you to the corresponding Markdown source file on GitHub. Click the pencil icon (✏️) in the top right to enter edit mode.
4. Make your changes in the text editor.
5. When you're done, scroll to the bottom. In the "Propose changes" section, write a concise commit message, e.g., "Fix typo in installation guide."
6. Click the "Propose changes" button. GitHub will then guide you through the process of creating a pull request.

This process serves as an excellent "on-ramp for contributors," allowing you to familiarize yourself with our workflow without any complex setup. A successful lightweight contribution is often the first step toward deeper involvement.5

#### 3.2 Translating the Documentation: Adding a New Language

This is the core area where we most need community help. Please follow these steps to add or improve translations.

**Step 1: Coordinate via GitHub Issues**

To avoid duplicated work and ensure collaboration, please visit our **[GitHub Issues page](https://github.com/rustfs/rustfs/issues)** before you start translating.

- **Adding a New Language**: Check if someone else is already working on the language you want to translate. If not, please create a new issue with the title `[i18n] Add <Language> (<lang-code>) Translation`, e.g., `[i18n] Add German (de) Translation`. This helps us track progress and assign ownership.7
- **Improving an Existing Translation**: If you want to improve an existing translation, find the relevant issue or create a new one detailing the improvements you plan to make.

**Step 2: Understand the Directory Structure**

Our documentation site is built with VitePress, which uses a file-based directory structure to manage multiple languages.9 All source files are located in the

`docs/` directory.

```
docs/
├── en/                  # English (or as the root directory)
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
├── ja/                  # Japanese
│   ├── guide/
│   │   └── getting-started.md
│   └── index.md
└──.vitepress/
    └── config.ts        # VitePress configuration file
```

**Step 3: Add a New Language Pack**

1. **Fork and clone** the repository to your local machine, then create a new branch.

2. In the `docs/` directory, create a new folder using the corresponding **ISO 639-1 language code** for your target language. Please refer to the language code table below.

3. Copy the **entire contents** of `docs/en/` (or the English source files in the root) into your new language folder. This provides you with a complete file structure to translate.

4. Open the `docs/.vitepress/config.ts` file and add a new entry for your language in the `locales` object.

   For example, to add German (`de`):

   TypeScript

   ```
   //.vitepress/config.ts
   import { defineConfig } from 'vitepress'

   export default defineConfig({
     //... other configs
     locales: {
       root: {
         label: 'English',
         lang: 'en'
       },
       // Add the new locale config here
       de: {
         label: 'Deutsch', // Text in the language dropdown
         lang: 'de',       // HTML lang attribute
         link: '/de/',     // Link to redirect to
         // You can override theme configs for this locale,
         // e.g., for navbar and sidebar text.
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

   To help you configure this correctly, the following table explains the purpose of each property in the `locales` object.9

| Property      | Type     | Required | Description                                                  |
| ------------- | -------- | -------- | ------------------------------------------------------------ |
| `label`       | `string` | Yes      | The text that appears in the language selection dropdown menu in the navbar. |
| `lang`        | `string` | No       | The `lang` attribute for the `<html>` tag. Uses the directory name if not specified. |
| `link`        | `string` | No       | The link the user is redirected to when selecting this language. Defaults to the locale's root path (e.g., `/ja/`). |
| `title`       | `string` | No       | Overrides the site's main title for this specific locale.    |
| `description` | `string` | No       | Overrides the site's main description for this specific locale. |
| `themeConfig` | `object` | No       | Locale-specific theme configuration. Used to translate navbar links, sidebar text, etc. |

```
This table is designed to eliminate ambiguity in the configuration, ensuring contributors can get it right the first time and reducing the need for back-and-forth revisions.
```

**Step 4: Translate the Content**

- In your new language directory, open the Markdown files one by one and translate the text content.
- **Important**: Please **do not** translate the following:
  - Keys in the frontmatter (e.g., `title:`, `layout:`).
  - Any code within code blocks.
  - URL links.
  - HTML tags.
- Only translate the human-readable text.

**Step 5: Submit Your Pull Request**

Once you've finished translating, please follow the(#43-pull-request-pr--commit-guidelines) to submit your contribution, and make sure to link it to the issue you created in Step 1.

**Language Code Reference**

To ensure consistency, please use the standard ISO 639-1 codes from the table below.13

| Language             | ISO 639-1 Code  |
| -------------------- | --------------- |
| Chinese (Simplified) | `zh` or `zh-CN` |
| English              | `en`            |
| Japanese             | `ja`            |
| German               | `de`            |
| French               | `fr`            |

### 4. The Technical Workflow

For developers who wish to make more substantial contributions locally (such as adding a new language pack or making extensive changes), please follow this technical workflow.

#### 4.1 Prerequisites

Before you begin, please ensure you have the following software installed on your system:

- **Node.js**: Version `18.x` or higher.14 You can download it from the

  [official Node.js website](https://nodejs.org/).

- **Package Manager**: We recommend using `pnpm` for efficiency. You can install it globally with `npm install -g pnpm`. Alternatively, you can use `npm` or `yarn`.15

- **Git**: A version control system. You can download it from the [official Git website](https://git-scm.com/).

#### 4.2 Local Development Setup

Follow this sequence of commands to run the documentation development server locally:

1. Fork & Clone the Repository

   First, fork this repository on GitHub. Then, clone your fork to your local machine.

   Bash

   ```
   # Replace <YOUR_USERNAME> with your GitHub username
   git clone https://github.com/<YOUR_USERNAME>/docs.rustfs.com.git
   cd docs.rustfs.com
   ```

2. Install Dependencies

   Use pnpm to install all required project dependencies.

   Bash

   ```
   pnpm install
   ```

3. Run the Development Server

   This command will start a local development server with hot-reloading enabled.

   Bash

   ```
   pnpm docs:dev
   ```

4. Access the Site

   After successful execution, you should see output in your terminal similar to VitePress dev server running at: <http://localhost:5173/>. Open this URL in your browser to see the documentation site. Any changes you make to the Markdown files will be reflected instantly in the browser.15

#### 4.3 Pull Request (PR) & Commit Guidelines

We follow a standardized workflow to ensure code quality and a clean project history.

- **Branching Strategy**

  - Always create a new branch for your work. Do not commit directly to the `main` branch.
  - Use a descriptive branch name, such as `feat/add-german-translation` or `fix/correct-s3-api-typo`.17

- Commit Message Convention

  We adhere to the Conventional Commits specification. This helps us automate changelogs and makes the commit history easier to understand.

  - **Format**: `<type>(<scope>): <subject>`

  - **Examples**:

    - `feat(i18n): add initial french translation`

    - `fix(guide): correct typo in getting-started.md`

    - docs(contributing): update local development setup

      This structured approach is a best practice in many mature open-source projects.8

- **Submitting a Pull Request**

  1. Push your branch to your fork: `git push -u origin your-branch-name`.
  2. On GitHub, open a pull request from your fork to the `main` branch of the `rustfs/docs.rustfs.com` repository.
  3. **Link the Issue**: In the PR description, use keywords like `Closes #123` or `Fixes #123` to link the issue you created earlier. This will automatically close the issue when the PR is merged, a key step in our workflow automation.7
  4. **Write a Clear Description**: Clearly explain **what** you changed and **why**. If your changes are visual, please include before-and-after screenshots.5

- **The Review Process**

  - Once you submit a PR, a project maintainer will review it.
  - We may request changes. Please don't be discouraged! This is a normal part of collaborative open-source development aimed at improving the quality of contributions.
  - Once your PR is approved and all automated checks have passed, a maintainer will merge it.

#### 4.4 Automated Checks & Deployment

To ensure the quality and stability of our documentation, we have a fully automated CI/CD (Continuous Integration/Continuous Deployment) pipeline.

- **Automated Checks**: When you submit a pull request, GitHub Actions will automatically run a series of checks. These checks verify that the documentation site builds successfully and that the code formatting is correct (linting).19
- **Automated Deployment**: Once your PR is merged into the `main` branch, GitHub Actions will trigger again, automatically building the latest version of the site and deploying it to `https://docs.rustfs.com`.

By making this process transparent, we aim to build contributor trust in our workflow. You don't need to worry about the deployment details; a successful merge means a successful deployment. This gives you a clear view of the entire lifecycle of your contribution, from submission to publication.19

### 5. Community & Licensing

#### 5.1 Acknowledgements

The RustFS documentation is built by the community, for the community. We are incredibly grateful to everyone who contributes their time and expertise.

Every contribution, no matter how small, is highly valued. To fairly and transparently recognize all contributions, we use GitHub's built-in tools.

You can see a list of all our amazing contributors on the **[Contributors graph](https://github.com/rustfs/docs.rustfs.com/graphs/contributors)**. This automated, scalable approach ensures that every contribution is acknowledged and always up-to-date.22

#### 5.2 Content License

All documentation in this project is licensed under the **Creative Commons Attribution 4.0 International License**.23

By contributing to the RustFS documentation project, you agree that your contributions will be released under this license.

Under this license, you are free to:

- **Share** — copy and redistribute the material in any medium or format.
- **Adapt** — remix, transform, and build upon the material for any purpose, even commercially.

You must follow these terms:

- **Attribution** — You must give **appropriate credit**, provide a link to the license, and **indicate if changes were made**. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.23
