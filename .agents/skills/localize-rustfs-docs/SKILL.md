---
name: localize-rustfs-docs
description: Localize, add, review, or repair RustFS documentation languages and FumaPress internationalization. Use for locale directories, translated Markdown or MDX, localized navigation and UI, terminology decisions, language routing, hreflang metadata, search indexes, redirects, and translation-quality reviews in docs.rustfs.com.
---

# Localize RustFS documentation

Build each locale as a complete RustFS documentation experience. Preserve product meaning and operational accuracy; do not perform literal sentence-by-sentence substitution.

## Required context

1. Read `../rustfs-docs/SKILL.md` and the repository `STYLE.md` before editing content.
2. Read [the current FumaPress internationalization guide](https://press.fumadocs.dev/docs/internationalization.md) before changing `press.config.tsx` or locale layout.
3. Read [references/terminology.md](references/terminology.md) before translating or reviewing terminology.
4. Verify commands, flags, configuration keys, defaults, ports, APIs, and feature claims against `rustfs/rustfs`; never infer them from a translation.

## Translation standard

- Translate meaning in the context of the RustFS product, its Console, and S3-compatible behavior. Rewrite sentence structure when necessary for natural target-language documentation.
- Keep `RustFS`, protocol names, API names, CLI commands, code, environment variables, configuration keys, file paths, URLs, JSON/YAML keys, and identifiers unchanged.
- Use the glossary consistently. When a technical term has no established translation, keep the English term and add a short target-language explanation on first use.
- Preserve visible Console labels exactly when instructing the reader to click them; add a translation in parentheses only when it improves comprehension.
- Preserve the source page's technical scope. Do not add capabilities, defaults, warnings, or recommendations during translation unless they are verified and added to every maintained locale.
- Keep code fences byte-for-byte equivalent across locales unless a localized string is itself part of the demonstrated behavior. Translate prose outside code fences instead.
- Preserve links and cited sources. Localize internal documentation links to the current locale while keeping external destinations unchanged.
- Review the completed page as native technical writing. Reject awkward calques, ambiguous pronouns, untranslated prose fragments, terminology drift, and sentences that are grammatically correct but unnatural.

## Configure FumaPress i18n

1. Define all locales with `defineI18n` and choose the parser explicitly. This repository uses locale directories, so keep `parser: "dir"`.
2. Pass the resulting translations API to `defineConfig`.
3. Use an official `@fumapress/language` preset when available. A preset localizes Fumadocs UI and FumaPress strings; setting only `displayName` is insufficient.
4. Localize repository-owned navigation, footer text, labels, and calls to action separately because language packs cannot translate hard-coded strings.
5. Keep `content/<locale>/` trees structurally aligned. Every maintained page must have a target-locale counterpart or an explicitly documented fallback decision.
6. Emit the correct `<html lang>`, canonical URL, and `hreflang` alternates for every page.
7. Verify that search output is partitioned by locale and that the language switcher retains the corresponding page path.

## Content and navigation workflow

1. Start from the current default-language page, not from an older translation.
2. Identify RustFS-specific terms and runtime claims before translating.
3. Translate headings and prose for reader intent, then reconcile terminology against the glossary and nearby translated pages.
4. Copy or share required images without changing the English, light-theme screenshot policy from `rustfs-docs`.
5. Update the target locale's `meta.json`. Use bare entries for pages inside the same folder; use locale-prefixed URLs for cross-folder navigation entries.
6. Check that frontmatter, heading levels, admonitions, links, images, code-fence languages, and MDX component structure match the source page.
7. Review the rendered page, including sidebar, breadcrumbs, table of contents, previous/next links, search, and custom navbar/footer text.

## Routing and deployment

- Keep locale prefixes explicit (`/en/...`, `/zh/...`) while `hideLocale: "never"` is configured.
- Redirect `/` to the default locale and preserve every historical unprefixed URL by redirecting it to the equivalent default-locale URL.
- Treat hosting configuration as part of i18n. `_redirects` is used by Cloudflare-style static hosting; Vercel requires `vercel.json`, `vercel.ts`, or a configured bulk redirects file.
- Never delete a legacy redirect merely because the destination gained a locale prefix. Prefix its destination and retain the original source.
- Smoke-test redirects against the deployed preview. A successful build or deployment status does not prove that redirects work.

## Validation

Run all repository checks:

```bash
npm run docs:check
npm run types:check
npm run build
```

Then verify:

- `content/en` and every maintained locale contain the same relative file set.
- Commands and non-localized code blocks remain identical across translated counterparts.
- Every generated internal `href` resolves to a generated page or public asset.
- Target-language pages do not expose unexpected English framework UI strings.
- `/`, representative legacy URLs, and representative locale URLs return the intended status and destination on the deployment preview.

Do not commit `node_modules/`, `dist/`, preview output, or temporary translation files.
