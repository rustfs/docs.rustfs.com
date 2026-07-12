# RustFS Documentation

RustFS is an S3-compatible distributed object storage engine written in Rust. This repository hosts the official documentation site, built with **[FumaPress](https://press.fumadocs.dev/)** (a static-site generator powered by [Waku](https://waku.gg/) and [Fumadocs](https://fumadocs.dev/)). Use this guide to understand the layout, add or update content, and keep the docs build passing.

## Quick Links

- Documentation: <https://docs.rustfs.com>
- Chinese docs: <https://docs.rustfs.com.cn>
- Repo issues: <https://github.com/rustfs/docs.rustfs.com/issues>
- Product issues & roadmap: <https://github.com/rustfs/rustfs/issues>

## Repository Snapshot

- `content/` – Markdown (`.md`) sources; each section has an `index.md` entry point. URLs mirror the folder path (e.g. `content/installation/linux/quick-start.md` → `/installation/linux/quick-start`).
- `content/meta.json` – root sidebar definition (section order, labels, and links).
- `content/**/meta.json` – per-folder sidebar titles and ordering for nested groups.
- `press.config.tsx` – site config: name, navbar links, social links, logo, analytics, SEO, plugins, and MDX components.
- `source.config.ts` – content collection + global MDX options (KaTeX math, Mermaid diagrams).
- `waku.config.ts` – Waku/Vite plugins (FumaPress, Fumadocs MDX, Tailwind).
- `src/app.css` – Tailwind + Fumadocs UI theme imports.
- `src/components/` – custom React components (e.g. the Mermaid renderer).
- `public/` – static assets (favicons, logo, manifest) served from the site root.
- Images can be co-located in an `images/` folder beside a page and referenced with relative paths (e.g. `./images/diagram.png`); FumaPress bundles and optimizes them at build time.

## Contribution Paths

### Quick edits on GitHub

1. Browse to the page on <https://docs.rustfs.com> and use the **Open → Edit** action (or the GitHub edit link).
2. Use the inline editor for small fixes (typos, broken links, formatting).
3. Describe the change briefly, submit a pull request (PR), and link any related issue.

### Planned work or new content

1. Open/confirm an issue so others see what you are tackling.
2. Create a topic branch such as `docs/feature-short-title`.
3. Add or edit Markdown under `content/`, keeping edits focused.
4. Reflect new pages in `content/meta.json` (and the relevant folder `meta.json`) so they appear in the sidebar.

### Translations

- Chinese docs: <https://docs.rustfs.com.cn>

## Local Development

### Prerequisites

- Node.js 20+ (Node 22 recommended)
- `npm`
- Git

### Setup & common commands

```bash
git clone https://github.com/rustfs/docs.rustfs.com.git
cd docs.rustfs.com
npm install

# Work locally
npm run dev        # Waku dev server (defaults to http://localhost:3000)

# Required before opening a PR
npm run build      # static export to dist/public/

# Optional checks
npm start          # serve the production build
npm run types:check
```

## Authoring Guidelines

- Every page needs frontmatter with a `title` (rendered as the page heading and sidebar/tab label) and ideally a `description`. Do **not** repeat the title as a top-level `#` heading in the body — FumaPress renders the title automatically.
- Follow the structure “context → overview → steps → references” and keep prose concise, active, and reproducible.
- Spell out a term the first time it appears (for example, “Large Language Model (LLM)”).
- Cite third-party facts inline and scrub secrets or private configuration values from examples.
- Use fenced code blocks with language hints (` ```bash `, ` ```rust `) and provide runnable snippets only.
- Math renders via KaTeX using `$…$` (inline) and `$$…$$` (display). Diagrams render via Mermaid using ` ```mermaid ` code blocks.
- When adding assets, include descriptive `alt` text and ensure tables contain a header row.

See `AGENTS.md` for the full checklist that governs navigation updates, localization, and release hygiene.

## Pull Request Checklist

- [ ] `npm run build` completes without errors.
- [ ] `content/meta.json` (and folder `meta.json`) updated for any new or renamed pages.
- [ ] Frontmatter validated (`title` present) and relative links confirmed.
- [ ] Conventional commit message (for example, `docs: add lifecycle guide`).
- [ ] PR description explains the change, references issues, and includes screenshots when visuals change.

## Deployment

`main` is built by GitHub Actions (`.github/workflows/deploy.yml`) with `npm run build`, and the static output in `dist/public/` is uploaded to Aliyun OSS.

## License

Documentation content is released under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). By contributing, you agree that your submissions use the same license.

_Last Updated: 2026-07-12_
