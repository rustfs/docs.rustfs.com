# RustFS Documentation

RustFS is an S3-compatible distributed object storage engine written in Rust. This repository hosts the official VitePress documentation site. Use this guide to understand the layout, add or update content, and keep the docs build passing.

## Quick Links

- Documentation: <https://docs.rustfs.com>
- Repo issues: <https://github.com/rustfs/docs.rustfs.com/issues>
- Product issues & roadmap: <https://github.com/rustfs/rustfs/issues>
- Contributor playbook: `AGENTS.md`

## Repository Snapshot

- `docs/` – Markdown sources; each section has an `index.md` entry point.
- `docs/sidebar.ts` & `docs/config.ts` – navigation definitions that must be updated whenever you add or rename a page.
- `.vitepress/` – global site configuration, theme, and shared components.
- `public/` or `images/` folders beside the relevant doc – store media here and reference via relative paths.

## Contribution Paths

### Quick edits on GitHub

1. Browse to the page on <https://docs.rustfs.com> and click **Edit this page on GitHub**.
2. Use the inline editor for small fixes (typos, broken links, formatting).
3. Describe the change briefly, submit a pull request (PR), and link any related issue.

### Planned work or new content

1. Open/confirm an issue so others see what you are tackling.
2. Create a topic branch such as `docs/feature-short-title`.
3. Update only the files relevant to the change, keeping edits focused.
4. Reflect new pages in both `docs/sidebar.ts` and `docs/config.ts`.

### Translations

1. Mirror the English structure under `docs/<locale>/...` (for example `docs/ja/installation/index.md`).
2. Reuse existing frontmatter fields (`title`, `outline`, etc.) so VitePress renders consistently.
3. Keep screenshots or diagrams in locale-specific `images/` folders where possible.
4. Note covered languages in the PR description so reviewers can track parity.

## Local Development

### Prerequisites

- Node.js 18+
- `pnpm` (preferred) or another Node package manager
- Git

### Setup & common commands

```bash
git clone https://github.com/rustfs/docs.rustfs.com.git
cd docs.rustfs.com
pnpm install

# Work locally
pnpm dev       # vitepress dev server at http://localhost:5173

# Required before opening a PR
pnpm build

# Optional final check
pnpm preview
```

## Authoring Guidelines

- Follow the structure “context → overview → steps → references” and keep prose concise, active, and reproducible.
- Spell out a term the first time it appears (for example, “Large Language Model (LLM)”).
- Cite third-party facts inline and scrub secrets or private configuration values from examples.
- Use fenced code blocks with language hints (` ```bash `, ` ```rust `) and provide runnable snippets only.
- When adding assets, include descriptive `alt` text and ensure tables contain a header row.

See `AGENTS.md` for the full checklist that governs navigation updates, localization, and release hygiene.

## Pull Request Checklist

- [ ] `pnpm build` completes without warnings or errors.
- [ ] Navigation files updated for any new or renamed pages.
- [ ] Frontmatter validated and relative links confirmed.
- [ ] Conventional commit message (for example, `docs: add lifecycle guide`).
- [ ] PR description explains the change, references issues, and includes screenshots when visuals change.

## License

Documentation content is released under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). By contributing, you agree that your submissions use the same license.

_Last Updated: 2025-11-08_
