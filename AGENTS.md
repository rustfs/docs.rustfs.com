# AI Agent Operating Guidelines

This playbook directs AI agents working in the RustFS documentation repository so that every deliverable stays accurate, auditable, and easy to maintain.

> **Every agent:** the operating playbook for writing and reviewing these docs is the skill at [`.agents/skills/rustfs-docs/SKILL.md`](.agents/skills/rustfs-docs/SKILL.md) — factual-accuracy discipline, canonical constants, FumaPress syntax, screenshots, and the `npm run docs:check` / `npm run build` pre-flight. Read it before changing anything under `content/`. It uses the cross-client `.agents/skills/` convention; Claude Code auto-loads it via the `.claude/skills/rustfs-docs` symlink, and other agents should open the file directly. See also `STYLE.md` for the detailed style guide.

## 1. Repository Snapshot
- Framework: **FumaPress** (static-site generator powered by Waku + Fumadocs). Content lives in `content/`; site configuration is in `press.config.tsx`, `source.config.ts`, and `waku.config.ts`.
- Goal: produce documentation for a distributed object storage product aimed at a global audience, currently English-first with room for other locales.
- Navigation: `content/meta.json` (root sidebar: section order, labels, links) and per-folder `content/**/meta.json` (nested group titles/order) define the site structure. New pages must be reflected there immediately.
- Routing: a page's URL mirrors its path under `content/` (e.g. `content/administration/data/bucket/creation.md` → `/administration/data/bucket/creation`). `.md` links between pages are resolved automatically; you can write `./sibling.md` or `/absolute/path`.

## 2. Core Principles
1. **Accuracy**: Data, APIs, and commands must be reproducible; cite third-party information with a concise source note.
2. **Consistency**: Match the existing file layout, naming, frontmatter, and heading hierarchy.
3. **Minimal change**: Touch only files relevant to the task; avoid drive-by formatting or reordering.
4. **Readability**: Use concise active-voice English; spell out technical terms once with their abbreviations (e.g., Large Language Model, LLM).
5. **Security**: Never commit secrets, tokens, or real certificates; scrub sensitive values from sample configs.

## 3. Recommended Workflow
### 3.1 Environment Prep
1. `git checkout main && git pull` to sync with the latest baseline.
2. Use Node.js 20+ (Node 22 recommended). Install dependencies via `npm install` whenever the repo is fresh or packages changed.
3. Create a topic branch for the task: `git checkout -b docs/<topic>-<short-desc>`.

### 3.2 Editing Steps
1. Locate or create the Markdown file under `content/`; when adding a section, create `index.md` in that directory as its entry point.
2. Every page needs frontmatter with a `title` (required — it is rendered as the page heading and the sidebar/tab label) and, ideally, a `description`. **Do not** add a duplicate top-level `#` heading matching the title; FumaPress renders the title from frontmatter.
3. Store images in a sibling `images/` folder and reference them via relative paths such as `./images/<name>.png`. FumaPress bundles and optimizes them at build time. Global assets (favicons, logo, manifest) live in `public/`.
4. Math renders via KaTeX (`$…$` inline, `$$…$$` display). Diagrams render via Mermaid (` ```mermaid ` code blocks).
5. **Rich formatting** — use these built-ins (sparingly, where they genuinely aid scanning):
   - Admonitions (works in `.md`): `:::note` / `:::tip` / `:::warning[Optional Title]` / `:::danger` … closed by `:::`. Prefer these over bare `>` blockquotes for notes and warnings.
   - Code blocks: language hint required; add `title="/etc/default/rustfs"` for file contents, `{2,3}` meta ranges or `[!code highlight]` for line highlighting. Put command output in separate ` ```text ` blocks.
   - Steps: numbered `## 1. Xxx` headings render automatically as steps (remark-steps) — use for install/how-to sequences.
   - **JSX components require the `.mdx` extension** (in plain `.md` they are silently dropped): `<Cards>/<Card title href>` for landing-page link grids, `<Tabs items={[...]}><Tab value id>` for mutually-exclusive alternatives (each `Tab` needs a page-unique `id`; selecting updates the URL hash). Rename a page to `.mdx` only when it actually uses components — the URL does not change.
5. Update navigation by editing `content/meta.json` (and the relevant folder `meta.json`). Sidebar labels come from a page's frontmatter `title`, a folder `meta.json` `title`, or a `[Custom Label](/url)` entry in a `pages` array.

### 3.3 Review
1. Run the local dev server (`npm run dev`) and confirm the changed pages render, links resolve, and the sidebar looks correct.
2. Compare against requirements or issues to confirm every acceptance criterion is satisfied.
3. Run the commands listed in Section 5 to ensure the build succeeds.

## 4. Content and Language Rules
- **Structure**: Start with context, then cover “Overview → Steps → References/Constraints.”
- **Terminology**: Bold or code-style the first mention of product/module names; wrap commands and filenames in backticks.
- **Code blocks**: Include language hints (` ```bash `, ` ```rust `, etc.) and provide runnable snippets only.
- **Tables and media**: Tables need a header row; every image requires meaningful `alt` text.
- **Update note**: Optionally append “Last Updated: YYYY-MM-DD” at the end for traceability.

## 5. Quality Verification
1. **Build**: Run `npm run build` to ensure FumaPress generates the static site (output in `dist/public/`) without errors.
2. **Preview** (optional): `npm run dev` is recommended when navigation or interactive pieces change.
3. **Types** (optional): `npm run types:check`.
4. **Self-checklist**:
   - Frontmatter is complete and valid (`title` present).
   - Every relative path points to an existing file, and new pages appear in `meta.json`.
   - No new build errors were introduced.

## 6. Delivery Requirements
1. Use `git status` to verify only task-related files changed.
2. Write semantic commits such as `docs: <scope>` or `feat: add xxx guide`.
3. Include in the Pull Request:
   - A concise change summary.
   - Build/preview commands and their outcomes.
   - Links to related issues or requirement docs.
4. When translation or locale sync is involved, list the language directories covered.

## 7. Command Reference
```bash
npm install         # install dependencies (Node 20+)
npm run dev         # local development preview (http://localhost:3000)
npm run build       # generate static site into dist/public/
npm start           # serve the production build
npm run types:check # fumadocs-mdx + tsc type check
```

## 8. Quality and Review Tips
- Avoid PRs that mix unrelated domains (e.g., config refactors plus large wording sweeps).
- Prefer Markdown + Mermaid for diagrams; if an image is required, provide the source or reproduction steps.
- Fix historical doc issues in the same PR only when documented as a “drive-by fix” with rationale.

Following these guidelines keeps AI agent contributions maintainable and ready for future reviews or automation hooks.
