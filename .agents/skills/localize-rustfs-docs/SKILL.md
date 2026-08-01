---
name: localize-rustfs-docs
description: Localize, review, audit, or repair RustFS documentation and FumaPress internationalization. Use for translated Markdown or MDX, frontmatter, meta.json navigation, locale directories, localized links and UI, terminology decisions, language routing, hreflang metadata, search indexes, redirects, untranslated-content detection, and localization pull requests in docs.rustfs.com, especially for German, French, Japanese, or Chinese.
---

# Localize and review RustFS documentation

Produce target-language documentation that is technically equivalent to the current English source, idiomatic for infrastructure developers, structurally valid for FumaPress, and safe to publish. Preserve meaning, operational behavior, warnings, constraints, and claim strength instead of translating sentence by sentence.

## Load the required context

1. Read `../rustfs-docs/SKILL.md`, the repository `AGENTS.md`, and `STYLE.md`.
2. Read [references/terminology.md](references/terminology.md), then read the target-locale reference when one exists:
   - [references/de.md](references/de.md) for German
   - [references/fr.md](references/fr.md) for French
   - [references/ja.md](references/ja.md) for Japanese
3. Read the [current FumaPress internationalization guide](https://press.fumadocs.dev/docs/internationalization.md) before changing `press.config.tsx`, routing, search, or locale layout.
4. Verify commands, flags, configuration keys, defaults, ports, APIs, and feature claims against `rustfs/rustfs`; never infer them from a translation.

Use the current English page as the content baseline. For a pull request, compare against the English page at the base commit unless the pull request also proposes a newer English version.

## Select the operation mode

- **Audit**: report prioritized findings without modifying files.
- **Repair**: correct existing translations and validate the affected locales.
- **Translate**: create missing locale counterparts from the current English source.
- **Integrate**: update navigation, routing, search, language metadata, or repository-owned UI strings.

Infer the mode from the request. Default to audit when the user asks only to check or review content. Do not hardcode a pull request, branch, locale, or file list in this skill.

## Establish scope and coverage

Map each target file to its English counterpart:

```text
content/<locale>/<relative-path>
content/en/<relative-path>
```

Include `.md`, `.mdx`, `meta.json`, locale-aware configuration, repository-owned UI strings, internal links, redirects, search, and language metadata. Ignore copied binary images during linguistic review, but verify paths and avoid unnecessary binary duplication.

For large changes, run exhaustive structural checks before semantic review. Review content in traceable batches and record exactly which files and locales were covered. Never claim full review after sampling only part of a change.

Run the bundled audit before and after broad locale work:

```bash
node .agents/skills/localize-rustfs-docs/scripts/audit-locales.mjs --locales de,fr,ja
```

Use `--strict` when warnings must fail the command and `--json` for machine-readable output.

## Preserve technical truth

Keep the translation semantically equivalent to the source. Preserve:

- commands, flags, API operations, and configuration behavior;
- environment variables, identifiers, filenames, paths, ports, versions, regions, units, and numeric limits;
- prerequisites, conditions, exceptions, warnings, negation, and modal strength;
- feature status, compatibility scope, security guidance, and operational consequences.

Distinguish `must`, `should`, `may`, and `can`; `supported`, `compatible`, `experimental`, and `unavailable`; local files and S3 Objects; Bucket replication and site replication; and replication, erasure coding, healing, rebalancing, and decommissioning.

Never strengthen “S3-compatible” into “fully compatible” or “100% compatible”. Never turn “alternative to MinIO” into “drop-in replacement for MinIO” unless the English source and verified behavior support that claim.

Report an English-source defect instead of silently correcting the fact in only one locale.

## Protect non-translatable content

Preserve these exactly unless a repository rule explicitly requires a locale-specific change:

- fenced code contents, languages, and metadata;
- inline-code tokens;
- CLI commands, API actions, HTTP methods, headers, status codes, and protocol tokens;
- environment variables, configuration keys, JSON/YAML keys, metrics, and identifiers;
- class, function, type, field, package, and Kubernetes resource names;
- filenames, paths, domains, image tags, external URLs, and explicit anchors;
- MDX component names, imports, JavaScript expressions, and structural attributes.

Do not reformat protected content for style. Preserve visible Console labels exactly when instructing the reader to select them; add a target-language explanation on first use only when it helps the reader.

## Preserve document structure

### Frontmatter

Preserve delimiters, key names, key order where practical, and non-user-facing values. Translate user-facing values such as `title` and `description`. Keep `description` a complete sentence and do not introduce new claims.

### Markdown

Preserve heading hierarchy, list nesting, numbering, table dimensions, admonition types, footnote identifiers, code fences, explicit anchors, emphasis, and inline-code boundaries. Translate prose, headings, link labels, image alt text, table prose, and admonition titles. Do not add a body H1 when frontmatter renders the title.

### Links

Translate visible labels, preserve external destinations, and point internal documentation links to the corresponding target locale. Preserve relative links where practical. Verify fragments after translating headings because generated slugs can change. Preserve explicit anchors unless every reference is deliberately updated.

### MDX and HTML

Preserve component and tag names, nesting, imports, expressions, and structural attributes. Translate visible children and user-facing properties such as `title`, `description`, `alt`, and `aria-label`. Keep `id`, `value`, `name`, `className`, and `aria-hidden` unchanged, except for required locale changes in internal `href` values.

### `meta.json`

Preserve valid JSON, keys, array order, page identifiers, and navigation structure. Translate visible section titles and Markdown link labels. Change only the locale segment of internal locale-prefixed URLs, and ensure every entry resolves within that locale.

### Images

Keep screenshots in English when required by `STYLE.md`. Translate captions and alt text. Do not edit image files merely to localize visible Console labels.

## Apply terminology consistently

Choose terms in this order:

1. RustFS product names, source code, Console labels, APIs, and protocol identifiers.
2. The approved RustFS glossary for the target locale.
3. Consistent usage in nearby target-language RustFS pages.
4. Official localized terminology from Amazon S3, AWS IAM, Kubernetes, and the applicable ecosystem.
5. Established target-language infrastructure usage.
6. English with a concise target-language explanation when no stable translation exists.

Do not preserve every S3-related noun in English indiscriminately. Preserve exact English for product names, API identifiers, SDK fields, commands, and visible UI labels. Use approved localized terms in explanatory prose.

Protected identifiers include `CreateBucket`, `ListObjectsV2`, `MultipartUpload`, `AccessKeyId`, `SecretAccessKey`, `forcePathStyle`, `RUSTFS_ACCESS_KEY`, and `RUSTFS_SECRET_KEY`.

Record a new canonical decision in the target-locale reference instead of allowing several translations for the same concept.

## Review in priority order

1. **Completeness**: detect untranslated pages, fragments, frontmatter, labels, omissions, and duplicated content.
2. **Technical accuracy**: compare commands, identifiers, values, conditions, warnings, behavior, negation, modality, compatibility scope, and feature status.
3. **Structural integrity**: compare frontmatter, headings, lists, tables, admonitions, links, images, code fences, MDX, and navigation.
4. **Terminology**: enforce the target glossary and product capitalization across related pages.
5. **Native-language quality**: reject awkward calques, ambiguous pronouns, unnatural word order, grammar errors, machine-translated phrasing, and casual slang.
6. **Site integration**: validate navigation, language switching, search partitioning, canonical URLs, `hreflang`, redirects, and rendered output.

## Classify audit findings

- **P0 — Blocker**: build failure, broken route, unsafe command change, security-critical mistranslation, wrong locale, or substantially untranslated page.
- **P1 — Major**: changed meaning, omitted requirement, incorrect negation or condition, unsupported compatibility claim, wrong operational terminology, or broken internal link.
- **P2 — Normal**: terminology drift, unnatural technical writing, inconsistent UI-label handling, accessibility text issue, or localized navigation defect.
- **P3 — Minor**: punctuation or stylistic polish with no effect on meaning.

Report actionable findings as:

```text
[P1] path/to/file:line — Short title
Problem: ...
Source meaning: ...
Recommended correction: ...
```

Group repeated mechanical problems by cause and include representative files plus the total affected count. Report locales reviewed, files reviewed, files skipped, automated checks, semantic-review coverage, and remaining uncertainty.

## Repair and translate narrowly

1. Make the smallest changes that correct the translation.
2. Keep locale trees structurally aligned and update affected navigation and links.
3. Update the locale terminology reference when establishing a new canonical term.
4. Do not mix unrelated English-source improvements into a localization repair.
5. Review the final diff to ensure protected content did not change.

When the user supplies one document and explicitly requests “Markdown source only”, return only the corrected Markdown without a surrounding code fence or explanation. Do not apply that output rule to a pull-request audit unless explicitly requested.

## Validate the result

Run from the repository root:

```bash
node .agents/skills/localize-rustfs-docs/scripts/audit-locales.mjs --locales de,fr,ja
npm run docs:check
npm run types:check
npm run build
```

Replace the locale list with the comma-separated locales changed by the task.

Also verify that locale file sets align, code blocks and identifiers remain protected, `meta.json` files parse, frontmatter contains localized `title` and `description`, target pages contain no unexpected source-language prose, links and fragments resolve, language switching preserves the corresponding page, language metadata is correct, and search results do not mix locales unexpectedly.

Preview representative pages whenever routing, MDX, navigation, or visible UI text changes. Do not commit `node_modules`, `dist`, generated search indexes, preview output, or temporary translation artifacts.

## Report completion

For an audit, return prioritized findings, coverage and limitations, validation performed, and merge readiness. For a repair, translation, or integration, return files changed, important terminology or structural decisions, validation commands and results, and remaining unverified issues.

Use the requester’s language for the report. Keep documentation content in its target locale and repository-owned technical identifiers in English.
