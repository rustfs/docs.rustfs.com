#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_SOURCE = "en";
const DEFAULT_ROOT = "content";
const DEFAULT_MAX_FINDINGS = 200;
const TITLE_ALLOWLIST = new Set([
  "amazon s3",
  "boto3",
  "cors",
  "docker",
  "ftps",
  "helm",
  "iam",
  "java",
  "javascript",
  "kms",
  "kubernetes",
  "linux",
  "macos",
  "oidc",
  "podman",
  "python",
  "rclone",
  "rust",
  "rustfs",
  "s3",
  "s3cmd",
  "sdk",
  "sftp",
  "sts",
  "terraform",
  "traefik",
  "typescript",
  "webdav",
  "windows",
]);

function usage() {
  return `Usage: node audit-locales.mjs [options]

Options:
  --root <path>          Content root (default: content)
  --source <locale>      Source locale (default: en)
  --locales <a,b,c>      Target locales (default: discover all except source)
  --strict               Treat warnings as failures
  --json                 Emit machine-readable JSON
  --max-findings <n>     Limit displayed text findings (default: 200)
  --help                 Show this help
`;
}

function parseArgs(argv) {
  const options = {
    root: DEFAULT_ROOT,
    source: DEFAULT_SOURCE,
    locales: null,
    strict: false,
    json: false,
    maxFindings: DEFAULT_MAX_FINDINGS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help") {
      options.help = true;
    } else if (argument === "--strict") {
      options.strict = true;
    } else if (argument === "--json") {
      options.json = true;
    } else if (["--root", "--source", "--locales", "--max-findings"].includes(argument)) {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} requires a value`);
      index += 1;
      if (argument === "--root") options.root = value;
      if (argument === "--source") options.source = value;
      if (argument === "--locales") {
        options.locales = [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
      }
      if (argument === "--max-findings") {
        options.maxFindings = Number.parseInt(value, 10);
        if (!Number.isInteger(options.maxFindings) || options.maxFindings < 1) {
          throw new Error("--max-findings must be a positive integer");
        }
      }
    } else {
      throw new Error(`unknown option: ${argument}`);
    }
  }

  return options;
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function isAuditedFile(filename) {
  return filename === "meta.json" || filename.endsWith(".md") || filename.endsWith(".mdx");
}

async function listFiles(root) {
  const files = [];

  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else if (entry.isFile() && isAuditedFile(entry.name)) {
        files.push(toPosix(path.relative(root, absolute)));
      }
    }
  }

  await walk(root);
  return files.sort();
}

async function readFiles(root, files) {
  const result = new Map();
  await Promise.all(
    files.map(async (relative) => {
      result.set(relative, await readFile(path.join(root, relative), "utf8"));
    }),
  );
  return result;
}

function addIssue(issues, severity, code, locale, file, message) {
  issues.push({ severity, code, locale, file, message });
}

function parseFrontmatter(content) {
  const lines = content.replaceAll("\r\n", "\n").split("\n");
  if (lines[0]?.trim() !== "---") return null;
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end < 0) return null;

  const keys = [];
  const values = new Map();
  for (const line of lines.slice(1, end)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    keys.push(match[1]);
    values.set(match[1], match[2].trim().replace(/^(["'])(.*)\1$/, "$2"));
  }
  return { keys, values, end };
}

function withoutFrontmatter(content) {
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) return content;
  return content.replaceAll("\r\n", "\n").split("\n").slice(frontmatter.end + 1).join("\n");
}

function extractCodeFences(content) {
  const lines = withoutFrontmatter(content).replaceAll("\r\n", "\n").split("\n");
  const fences = [];

  for (let index = 0; index < lines.length; index += 1) {
    const opening = lines[index].match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (!opening) continue;
    const marker = opening[1];
    const markerCharacter = marker[0];
    const body = [];
    let closing = index + 1;
    for (; closing < lines.length; closing += 1) {
      const closeMatch = lines[closing].match(/^\s*(`{3,}|~{3,})\s*$/);
      if (closeMatch && closeMatch[1][0] === markerCharacter && closeMatch[1].length >= marker.length) break;
      body.push(lines[closing]);
    }
    fences.push({ info: opening[2].trim(), body: body.join("\n") });
    index = closing;
  }
  return fences;
}

function removeCodeFences(content) {
  const lines = withoutFrontmatter(content).replaceAll("\r\n", "\n").split("\n");
  const visible = [];
  let marker = null;

  for (const line of lines) {
    if (!marker) {
      const opening = line.match(/^\s*(`{3,}|~{3,})/);
      if (opening) {
        marker = opening[1];
      } else {
        visible.push(line);
      }
      continue;
    }

    const closing = line.match(/^\s*(`{3,}|~{3,})\s*$/);
    if (closing && closing[1][0] === marker[0] && closing[1].length >= marker.length) marker = null;
  }
  return visible.join("\n");
}

function extractInlineCode(content) {
  const tokens = [];
  const visible = removeCodeFences(content);
  const pattern = /(?<!`)`([^`\n]+)`(?!`)/g;
  for (const match of visible.matchAll(pattern)) tokens.push(match[1]);
  return tokens.sort();
}

function extractHeadings(content) {
  return removeCodeFences(content)
    .split("\n")
    .map((line) => line.match(/^(#{1,6})\s+/)?.[1].length)
    .filter(Boolean);
}

function extractExternalUrls(content) {
  const urls = [];
  for (const match of removeCodeFences(content).matchAll(/https?:\/\/[^\s)<>{}"']+/g)) {
    urls.push(match[0].replace(/[.,;:!?]+$/, ""));
  }
  return urls.sort();
}

function normalizeLocaleLinks(content, locale, source) {
  return content.replaceAll(`/${locale}/`, `/${source}/`);
}

function normalizeDocument(content, locale, source) {
  return normalizeLocaleLinks(content, locale, source)
    .replaceAll("\r\n", "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function visibleProseLines(content, locale, source) {
  return removeCodeFences(content)
    .split("\n")
    .map((line) => normalizeLocaleLinks(line, locale, source).trim())
    .map((line) => line
      .replace(/<[^>]*>/g, " ")
      .replace(/`[^`\n]+`/g, " ")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/^[#>*+\-\d.\s|]+/, "")
      .replace(/[|*_~]/g, " ")
      .replace(/\s+/g, " ")
      .trim())
    .filter((line) => {
      if (line.length < 60) return false;
      if (/^(import|export)\s/.test(line)) return false;
      if (/^<[^>]+>$/.test(line)) return false;
      if (/^\|?\s*:?-{3,}/.test(line)) return false;
      const words = line.match(/[A-Za-z]{2,}/g) ?? [];
      return words.length >= 8;
    });
}

function shapeOf(value) {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, shapeOf(value[key])]));
  }
  return typeof value;
}

function visibleMetaStrings(value) {
  const strings = [];
  if (typeof value?.title === "string") strings.push(value.title);
  if (Array.isArray(value?.pages)) {
    for (const page of value.pages) {
      if (typeof page !== "string") continue;
      const label = page.match(/^\[([^\]]+)]\(/)?.[1];
      if (label) strings.push(label);
    }
  }
  return strings;
}

function requiresLocalization(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized || TITLE_ALLOWLIST.has(normalized)) return false;
  return /[A-Za-z]{3,}/.test(value);
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function auditMeta(sourceContent, targetContent, sourceLocale, locale, file, issues) {
  let source;
  let target;
  try {
    source = JSON.parse(sourceContent);
  } catch (error) {
    addIssue(issues, "error", "INVALID_SOURCE_JSON", locale, file, error.message);
    return;
  }
  try {
    target = JSON.parse(targetContent);
  } catch (error) {
    addIssue(issues, "error", "INVALID_TARGET_JSON", locale, file, error.message);
    return;
  }

  if (!same(shapeOf(source), shapeOf(target))) {
    addIssue(issues, "error", "META_STRUCTURE_MISMATCH", locale, file, "meta.json keys, types, or array structure differ from English");
  }
  const sourceVisible = visibleMetaStrings(source);
  const targetVisible = visibleMetaStrings(target);
  const unchangedVisible = sourceVisible.filter((value, index) => value === targetVisible[index] && requiresLocalization(value));
  if (unchangedVisible.length > 0) {
    addIssue(issues, "warning", "UNLOCALIZED_META", locale, file, `${unchangedVisible.length} visible navigation string(s) remain unchanged from English`);
  }
  if (targetContent.includes(`/${sourceLocale}/`)) {
    addIssue(issues, "error", "SOURCE_LOCALE_LINK", locale, file, `contains an internal /${sourceLocale}/ link`);
  }
}

function auditDocument(sourceContent, targetContent, source, locale, file, issues) {
  const untranslatedFile = normalizeDocument(sourceContent, source, source) === normalizeDocument(targetContent, locale, source);
  if (untranslatedFile) {
    addIssue(issues, "error", "UNTRANSLATED_FILE", locale, file, "target content is identical to English after normalizing locale links");
  }

  const sourceFrontmatter = parseFrontmatter(sourceContent);
  const targetFrontmatter = parseFrontmatter(targetContent);
  if (!sourceFrontmatter || !targetFrontmatter) {
    if (Boolean(sourceFrontmatter) !== Boolean(targetFrontmatter)) {
      addIssue(issues, "error", "FRONTMATTER_MISMATCH", locale, file, "frontmatter presence differs from English");
    }
  } else {
    if (!same(sourceFrontmatter.keys, targetFrontmatter.keys)) {
      addIssue(issues, "error", "FRONTMATTER_KEYS", locale, file, "frontmatter keys or order differ from English");
    }
    for (const key of ["title", "description"]) {
      const sourceValue = sourceFrontmatter.values.get(key);
      const targetValue = targetFrontmatter.values.get(key);
      if (!sourceValue || sourceValue !== targetValue) continue;
      const allowlistedTitle = key === "title" && TITLE_ALLOWLIST.has(sourceValue.toLowerCase());
      if (!untranslatedFile && !allowlistedTitle && (key === "description" || sourceValue.split(/\s+/).length > 1)) {
        addIssue(issues, "warning", "UNLOCALIZED_FRONTMATTER", locale, file, `${key} is unchanged from English`);
      }
    }
  }

  if (!same(extractCodeFences(sourceContent), extractCodeFences(targetContent))) {
    addIssue(issues, "error", "CODE_FENCE_MISMATCH", locale, file, "code-fence metadata or content differs from English");
  }
  if (!same(extractInlineCode(sourceContent), extractInlineCode(targetContent))) {
    addIssue(issues, "warning", "INLINE_CODE_MISMATCH", locale, file, "inline-code tokens differ from English");
  }
  if (!same(extractHeadings(sourceContent), extractHeadings(targetContent))) {
    addIssue(issues, "error", "HEADING_STRUCTURE_MISMATCH", locale, file, "heading levels differ from English");
  }
  if (!same(extractExternalUrls(sourceContent), extractExternalUrls(targetContent))) {
    addIssue(issues, "error", "EXTERNAL_URL_MISMATCH", locale, file, "external URL set differs from English");
  }

  const visibleTarget = removeCodeFences(targetContent);
  if (visibleTarget.includes(`/${source}/`)) {
    addIssue(issues, "error", "SOURCE_LOCALE_LINK", locale, file, `contains an internal /${source}/ link`);
  }

  const targetLines = new Set(visibleProseLines(targetContent, locale, source));
  const sharedLines = visibleProseLines(sourceContent, source, source).filter((line) => targetLines.has(line));
  const sharedCharacters = sharedLines.reduce((total, line) => total + line.length, 0);
  if (!untranslatedFile && (sharedLines.length >= 2 || sharedCharacters >= 160)) {
    addIssue(issues, "warning", "UNTRANSLATED_PROSE", locale, file, `${sharedLines.length} long prose line(s) remain identical to English`);
  }
}

async function discoverLocales(root, source) {
  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== source)
    .map((entry) => entry.name)
    .sort();
}

function printText(report, maxFindings) {
  console.log(`Locale audit: ${report.source} -> ${report.locales.join(", ")}`);
  for (const stats of report.coverage) {
    console.log(`  ${stats.locale}: ${stats.audited} audited, ${stats.missing} missing, ${stats.extra} extra`);
  }
  console.log(`Findings: ${report.summary.errors} error(s), ${report.summary.warnings} warning(s)`);

  for (const issue of report.issues.slice(0, maxFindings)) {
    console.log(`${issue.severity.toUpperCase()} [${issue.locale}] ${issue.file} ${issue.code}: ${issue.message}`);
  }
  if (report.issues.length > maxFindings) {
    console.log(`... ${report.issues.length - maxFindings} additional finding(s) omitted; use --json for complete output`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const root = path.resolve(options.root);
  const sourceRoot = path.join(root, options.source);
  const locales = options.locales ?? (await discoverLocales(root, options.source));
  if (locales.length === 0) throw new Error("no target locales found");
  if (locales.includes(options.source)) throw new Error("source locale cannot also be a target locale");

  const sourceFiles = await listFiles(sourceRoot);
  const sourceContents = await readFiles(sourceRoot, sourceFiles);
  const sourceSet = new Set(sourceFiles);
  const issues = [];
  const coverage = [];

  for (const locale of locales) {
    const targetRoot = path.join(root, locale);
    const targetFiles = await listFiles(targetRoot);
    const targetContents = await readFiles(targetRoot, targetFiles);
    const targetSet = new Set(targetFiles);
    const missing = sourceFiles.filter((file) => !targetSet.has(file));
    const extra = targetFiles.filter((file) => !sourceSet.has(file));
    const shared = sourceFiles.filter((file) => targetSet.has(file));

    for (const file of missing) addIssue(issues, "error", "MISSING_TARGET_FILE", locale, file, "English counterpart has no target file");
    for (const file of extra) addIssue(issues, "warning", "EXTRA_TARGET_FILE", locale, file, "target file has no English counterpart");

    for (const file of shared) {
      const sourceContent = sourceContents.get(file);
      const targetContent = targetContents.get(file);
      if (file.endsWith("meta.json")) {
        auditMeta(sourceContent, targetContent, options.source, locale, file, issues);
      } else {
        auditDocument(sourceContent, targetContent, options.source, locale, file, issues);
      }
    }

    coverage.push({ locale, audited: shared.length, missing: missing.length, extra: extra.length });
  }

  issues.sort((left, right) => {
    const severity = { error: 0, warning: 1 };
    return severity[left.severity] - severity[right.severity]
      || left.locale.localeCompare(right.locale)
      || left.file.localeCompare(right.file)
      || left.code.localeCompare(right.code);
  });

  const errors = issues.filter((issue) => issue.severity === "error").length;
  const warnings = issues.length - errors;
  const report = { source: options.source, locales, coverage, summary: { errors, warnings }, issues };

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printText(report, options.maxFindings);
  }

  if (errors > 0 || (options.strict && warnings > 0)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`locale audit failed: ${error.message}`);
  process.exitCode = 2;
});
