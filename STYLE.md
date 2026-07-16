# RustFS Documentation Style Guide

This guide defines the writing and formatting conventions for all pages under `content/`. When in doubt, match the existing installation guides, which follow these rules.

## Voice and Tone

- Address the reader as **"you"** (second person). Never "the user" or "one".
- Phrase recommendations as **"We recommend ..."**.
- No superlatives or promises: avoid *fastest*, *best-in-class*, *world-leading*, *100% secure*, *100% compatible*, *perfect*, *military-grade*.
- No marketing CTAs ("Contact us immediately", "Buy now") inside technical pages.
- Every factual claim must be verifiable against the [rustfs/rustfs](https://github.com/rustfs/rustfs) source or an official release. Never document hypothetical commands, flags, or components. If you are unsure whether a capability exists, remove the claim.
- Do not restate performance numbers on feature pages; link to `/concepts/comparison` instead so figures live in one place.
- Use USD (`$`) for any cost examples; never mix currencies.

## Page Skeleton

- Frontmatter must contain `title` and `description`. The `description` is a complete sentence (ends with a period), not a keyword list.
- **No H1 (`#`) in the body** — the title is rendered from frontmatter. Body headings start at `##`.
- The opening paragraph states what the page covers, why it matters, and any prerequisites — before the first heading.
- One blank line between blocks; no trailing whitespace.

## Headings

- Headings are unnumbered, except in install/how-to step sequences where numbered H2s (`## 1. Download the Package`) render as steps.
- Use sentence-style capitalization consistently within a page.
- Never duplicate a heading text within a page; if two sections feel identical, one of them is about something else — retitle it.

## Admonitions

Only the three supported forms, always with a title:

```md
:::note[Title]
:::tip[Title]
:::warning[Title]
```

Do not use blockquote-based "Note:" paragraphs or other callout syntaxes.

## Code Blocks

- Every fence declares a language.
- Shell commands: `bash`. Command output: `text` (separate fence from the command). Config files: `ini`, `yaml`, etc. with `title="path/to/file"`.
- Prompts: do not prefix commands with `$`.

Example:

````md
```bash
rustfs server /data
```

```ini title="/etc/default/rustfs"
RUSTFS_VOLUMES="/data"
```
````

## Placeholders and Canonical Constants

- Placeholders use angle brackets and kebab-case: `<your-access-key>`, `<your-secret-key>`, `<node-hostname>`.
- Canonical example values — always use these, never invent variants:
  - Endpoint: `http://localhost:9000`
  - Console: port `9001`
  - Region: `us-east-1`
  - Bucket: `my-bucket`
  - Object/file: `/path/to/hello.txt`
- Never publish real credentials, tokens, or internal hostnames, even as examples.

## Tables

- Use tables only for comparative data (option matrices, platform comparisons, parameter lists). Do not use tables for narrative content.
- Always include a header row.
- Keep cell content short; move explanation into surrounding prose.

## Links

- Internal links are root-relative paths without file extension: `/installation/linux/quick-start`, `/concepts/comparison`.
- Link text describes the target ("see the cloud-native installation guide"), never "click here".

## Images and Screenshots

- Screenshots show the **English UI** in the **light theme**.
- Capture at approximately 1600px width; compress to **≤300KB**.
- Every image has meaningful alt text describing what it shows.
- Store images next to the page in an `images/` directory and reference them relatively.

## Components and File Types

- Plain Markdown pages use `.md`.
- Pages that need JSX components (`<Cards>`, `<Tabs>`, `<Steps>`, etc.) must use the `.mdx` extension. Do not put JSX in `.md` files.
- Mermaid diagrams are supported in fenced ```mermaid blocks.
- **Card icons:** when a landing grid (`<Cards>`) uses icons, use a single consistent set of monochrome line icons from `lucide-react` (registered in `press.config.tsx`), one semantically matched icon per card, applied to **every** card in the grid — never a partial set. Do not use emoji-as-icons and do not mix brand logos (e.g. the Docker whale) with abstract icons. Pass them via `<Card icon={<Rocket />} …>`.

## Product Terminology

- The product is **RustFS** (capital R, capital FS) — never "rustFS", "Rustfs", or "RUSTFS".
- RustFS ships as a single binary and an official **Helm chart** for Kubernetes. There is **no Operator, no Tenant CRD, and no KES component** — do not reference them.
- Key management is the **built-in KMS** with `local`, `vault`, and `vault-transit` backends.
- Observability is **OpenTelemetry (OTLP)**-based: metrics, logs, and traces export through an OTLP endpoint.
