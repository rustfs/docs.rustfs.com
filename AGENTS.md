# AI Agent Operating Guidelines

This playbook directs AI agents working in the RustFS documentation repository so that every deliverable stays accurate, auditable, and easy to maintain.

## 1. Repository Snapshot
- Framework: VitePress; source files live in `docs/`, site-wide configuration in `.vitepress`.
- Goal: produce documentation for a distributed object storage product aimed at a global audience, currently English-first with room for other locales.
- Navigation: `docs/sidebar.ts` and `docs/config.ts` define the site structure; new pages must be reflected in these files immediately.

## 2. Core Principles
1. **Accuracy**: Data, APIs, and commands must be reproducible; cite third-party information with a concise source note.
2. **Consistency**: Match the existing file layout, naming, frontmatter, and heading hierarchy.
3. **Minimal change**: Touch only files relevant to the task; avoid drive-by formatting or reordering.
4. **Readability**: Use concise active-voice English; spell out technical terms once with their abbreviations (e.g., Large Language Model, LLM).
5. **Security**: Never commit secrets, tokens, or real certificates; scrub sensitive values from sample configs.

## 3. Recommended Workflow
### 3.1 Environment Prep
1. `git checkout main && git pull` to sync with the latest baseline.
2. Install dependencies via `pnpm install` (or `npm install`) whenever the repo is fresh or packages changed.
3. Create a topic branch for the task: `git checkout -b docs/<topic>-<short-desc>`.

### 3.2 Editing Steps
1. Locate or create the Markdown file under `docs/`; when adding a section, create `index.md` in that directory as its entry point.
2. Reuse existing frontmatter fields (`title`, `aside`, `outline`, etc.) to keep VitePress behavior intact.
3. Store images in a sibling `images/` folder or `public/`, use descriptive names, and reference them via relative paths such as `./images/<name>.png`.
4. For multilingual work, mirror the default structure under `docs/<locale>/...` exactly.
5. Update navigation by editing `docs/sidebar.ts` or the relevant scoped `sidebar.ts`, keeping paths free of extra prefixes.

### 3.3 Review
1. Manually preview Markdown: keep heading levels sequential and leave blank lines between lists and code blocks.
2. Compare against requirements or issues to confirm every acceptance criterion is satisfied.
3. Run the commands listed in Section 5 to ensure builds succeed without warnings.

## 4. Content and Language Rules
- **Structure**: Start with context, then cover “Overview → Steps → References/Constraints.”
- **Terminology**: Bold or code-style the first mention of product/module names; wrap commands and filenames in backticks.
- **Code blocks**: Include language hints (```bash, ```rust, etc.) and provide runnable snippets only.
- **Tables and media**: Tables need a header row; every image requires meaningful `alt` text.
- **Update note**: Optionally append “Last Updated: YYYY-MM-DD” at the end for traceability.

## 5. Quality Verification
1. **Build**: Run `pnpm build` (or `npm run build`) to ensure VitePress generates the site without errors.
2. **Preview** (optional): `pnpm dev` is recommended when navigation or interactive pieces change.
3. **Links/assets**: Watch the terminal for warnings; confirm external URLs use the right protocol and remain reachable.
4. **Self-checklist**:
   - Frontmatter is complete and valid.
   - Every relative path points to an existing file.
   - No new console warnings were introduced (missing default export, TS errors, etc.).

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
pnpm install        # install dependencies
pnpm dev            # local development preview
pnpm build          # generate static site
pnpm preview        # preview the build output
```

## 8. Quality and Review Tips
- Avoid PRs that mix unrelated domains (e.g., config refactors plus large wording sweeps).
- Prefer Markdown + Mermaid for diagrams; if an image is required, provide the source or reproduction steps.
- Fix historical doc issues in the same PR only when documented as a “drive-by fix” with rationale.

Following these guidelines keeps AI agent contributions maintainable and ready for future reviews or automation hooks.
