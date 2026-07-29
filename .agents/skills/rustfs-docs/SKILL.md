---
name: rustfs-docs
description: >-
  Write, edit, or review RustFS documentation in this repo (docs.rustfs.com,
  a FumaPress site under content/). Use whenever a task adds or changes a page
  in content/, updates navigation (meta.json), touches screenshots, or reviews
  a docs change. Encodes the factual-accuracy discipline, canonical constants,
  FumaPress syntax rules, page structure, voice, and the pre-flight checks that
  keep the docs correct and consistent.
---

# Writing RustFS documentation

This is a **FumaPress** site (Waku + Fumadocs). Pages live in `content/`; each
page's URL mirrors its path (`content/administration/data/bucket/creation.md` →
`/administration/data/bucket/creation`). Navigation is defined by `content/meta.json`
(root sidebar) and per-folder `meta.json` files.

Read `STYLE.md` (repo root) for the full style guide and `AGENTS.md` for repo
mechanics. This skill is the operating playbook — follow it for every change.

## 1. Accuracy is the first rule

The single worst class of past defects was **plausible but false** content:
invented CLI commands, non-existent config files, wrong defaults, capabilities
that don't exist. Never repeat it.

- Every command, flag, environment variable, port, default, metric name, limit,
  or capability claim MUST be verifiable against the **upstream source**
  (`rustfs/rustfs`) or observed by running RustFS. When you cannot verify it,
  **omit it** — do not guess, and never ship a command you have not confirmed
  exists (no "hypothetical `rustfs-admin ...`" placeholders).
- To verify: read `rustfs/src/config/cli.rs` and `crates/config/src/constants/`
  for flags/env/defaults; `crates/*` for capabilities; run the binary or the
  Docker image for behavior. Cite the source (file:line) in your reasoning.
- The only CLI binary is `rustfs` (subcommands `server` / `info` / `tls`).
  There is a `rc` admin client referenced by the Helm chart — treat its exact
  syntax as unverified unless confirmed. Admin operations are the Console or the
  admin HTTP API.
- RustFS is S3-compatible but **not 100%** — link the compatibility notes rather
  than claiming full coverage. Never write "100% S3 compatible" or "100% secure".

## 2. Canonical constants (use these verbatim)

| Thing | Value |
|---|---|
| S3 API endpoint (examples) | `http://localhost:9000` (note: replace with server IP) |
| Console | port `9001` (`RUSTFS_CONSOLE_ADDRESS`); desktop launcher uses `7001` |
| Internal node RPC | shares port `9000` |
| Region | `us-east-1` |
| Bucket name | `my-bucket` |
| Sample object / path | `hello.txt` / `/path/to/hello.txt` |
| Credentials | `<your-access-key>` / `<your-secret-key>` placeholders |
| Default credentials | `rustfsadmin` / `rustfsadmin` — mention only as a local-test caveat, never as the recommended value |
| Addressing | RustFS defaults to **path-style**; every SDK/client example must enable path-style (`forcePathStyle` / `force_path_style` / `UsePathStyle` / `addressing_style=path`); virtual-host needs `RUSTFS_SERVER_DOMAINS` |

Banned in examples (the CI rejects them): `12.34.56.78`, `cn-east-1`,
`password.txt`, `/Users/<name>` private paths, real-looking access keys,
`100% S3`, `100% secure`, `rustfs-admin`.

## 3. Page structure

- Frontmatter: `title` (required — rendered as the H1 and sidebar label) and a
  `description` that is a **complete sentence** (no `…` truncation, not a copy
  of the first body line). Do **not** add a duplicate top-level `#` heading.
- Open with what the page is and what the reader will accomplish, plus any
  prerequisites — not a marketing slogan.
- Headings are unnumbered, EXCEPT install/how-to step sequences: `## 1. …`
  headings render as numbered steps (remark-steps). Don't skip heading levels.
- Same-level parallel operations (UI / mc / API) use same-level headings.
- End task pages with a short "Next steps" with real links.
- Follow Diátaxis: keep concept / task / reference / troubleshooting content in
  separate pages; a reference page is a lookup table, a task page is steps.

## 4. FumaPress formatting (use sparingly, where it aids scanning)

- **Admonitions** (work in `.md`): `:::note`, `:::tip`, `:::warning[Title]`,
  `:::danger`, closed by `:::`. Prefer these over bare `>` blockquotes for
  notes/warnings. Do not mix syntaxes.
- **Code fences** always carry a language. Commands → `bash`; command output →
  `text`; config files → `ini`/`yaml`/`nginx` with `title="/etc/…"`; S3 request
  lines → `http`. Use `{2,3}` meta ranges to highlight lines.
- **JSX components require the `.mdx` extension** — in a plain `.md` file they
  are silently dropped (renders blank, no build error). `<Cards>`/`<Card title
  href>` for link grids; `<Tabs items={[...]}><Tab value id>` for mutually
  exclusive alternatives (each `Tab` needs a page-unique `id`). Rename a page to
  `.mdx` only when it actually uses components — the URL does not change.
- Diagrams: ```mermaid fenced blocks. Math: KaTeX `$…$` / `$$…$$`.

## 5. Voice

Second person ("you"). Official recommendations as "We recommend". No
superlatives or promises (fastest, perfect, 100% …). Technical pages carry
instructions, not sales copy — solutions/marketing content belongs on the main
site (rustfs.com), not in these docs. The docs sidebar has seven sections:
Installation · Administration · Security & Compliance · Operations ·
Troubleshooting · Developer · Reference. New pages go into one of these.

## 6. Navigation

Every new page must be added to the appropriate `meta.json` (root or folder),
or it becomes an orphan (invisible in the sidebar but still indexed). Align the
sidebar label with the page's `title`. Relative `.md` links between pages
resolve automatically (FumaPress maps by URL, so a `.md` link to a page shipped
as `.mdx` is fine).

## 7. Screenshots

- Capture the **current Console** in **English**, **light theme**, at **2×**
  device-pixel-ratio; downscale to ~2000 px wide and keep each **≤300 KB**.
- No leaked secrets: use throwaway demo keys, `hello.txt` (never
  `password.txt`), and clear any presigned-URL/token field.
- Meaningful `alt` text describing the location and action. Match the platform
  (don't show a macOS window on the Windows page).
- Store images in a sibling `images/` folder; reference by relative path.

## 8. Pre-flight before proposing a change

Always run, from the repo root, and fix every finding:

```bash
npm run docs:check   # orphans, broken links, unlabelled fences, banned strings, oversized images
npm run build        # must succeed
```

For a change with runtime surface (commands, config, Console flows), verify the
behavior against a running RustFS (binary or `docker run rustfs/rustfs`) or the
upstream source — do not rely on the previous docs, which may be wrong.

## 9. Reviewing a docs change

Check, in priority order: (1) every factual claim is verifiable; (2) canonical
constants and no banned strings; (3) page structure and voice; (4) correct
`.md`/`.mdx` extension for any component use; (5) new pages are in `meta.json`;
(6) `docs:check` and `build` pass. Reject invented commands and unverifiable
numbers rather than softening them.
