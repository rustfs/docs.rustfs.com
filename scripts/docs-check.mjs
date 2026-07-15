#!/usr/bin/env node
/**
 * docs-check.mjs — lightweight documentation hygiene checks for content/.
 *
 * Checks:
 *   1. Orphan pages   — .md/.mdx files not referenced by any meta.json
 *                       (and not an index.md of a referenced folder)
 *   2. Broken links   — relative .md links pointing to nonexistent files
 *   3. Code fences    — fenced code blocks without a language
 *   4. Banned strings — placeholder IPs, fake regions, leaked paths, marketing claims
 *   5. Large images   — referenced images larger than 300 KB
 *
 * No external dependencies. Exits non-zero if any check fails.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONTENT = path.join(ROOT, 'content');

const BANNED_STRINGS = [
  '12.34.56.78',
  'cn-east-1',
  'password.txt',
  '100% S3',
  '100% secure',
  'rustfs-admin',
  '/Users/jhma',
];

const IMAGE_SIZE_LIMIT = 300 * 1024; // 300 KB

// ---------- helpers ----------

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const allFiles = walk(CONTENT);
const mdFiles = allFiles.filter((f) => /\.(md|mdx)$/.test(f));
const metaFiles = allFiles.filter((f) => path.basename(f) === 'meta.json');

const rel = (f) => path.relative(ROOT, f);

// ---------- check 1: orphan pages ----------

const referencedPages = new Set(); // absolute paths of referenced .md files
const referencedFolders = new Set(); // absolute paths of referenced folders

// content/index.md is the site root; folders that own a meta.json count as referenced.
referencedFolders.add(CONTENT);

for (const metaFile of metaFiles) {
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  } catch {
    continue;
  }
  const pages = Array.isArray(meta.pages) ? meta.pages : [];
  for (const entry of pages) {
    if (typeof entry !== 'string') continue;
    if (/^---.*---$/.test(entry)) continue; // separator
    const link = entry.match(/\]\((\/[^)]+)\)/); // [Title](/url)
    if (link) {
      const url = link[1].replace(/[#?].*$/, '');
      const base = path.join(CONTENT, url);
      referencedPages.add(`${base}.md`);
      referencedPages.add(`${base}.mdx`);
      referencedPages.add(path.join(base, 'index.md'));
      referencedPages.add(path.join(base, 'index.mdx'));
    } else if (!entry.startsWith('[')) {
      // bare folder/page ref, relative to the meta.json's folder (root meta uses content/)
      const base = path.resolve(path.dirname(metaFile), entry);
      referencedFolders.add(base);
      referencedPages.add(`${base}.md`);
      referencedPages.add(`${base}.mdx`);
    }
  }
}

const orphans = [];
for (const file of mdFiles) {
  if (referencedPages.has(file)) continue;
  if (/^index\.(md|mdx)$/.test(path.basename(file)) && referencedFolders.has(path.dirname(file))) {
    continue;
  }
  orphans.push(rel(file));
}

// ---------- per-file scans (checks 2–5) ----------

const brokenLinks = [];
const bareFences = [];
const bannedHits = [];
const largeImages = [];
const seenLargeImages = new Set();

for (const file of mdFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const dir = path.dirname(file);

  // code fences without language
  let inFence = false;
  lines.forEach((line, i) => {
    const fence = line.match(/^\s*(```+|~~~+)(.*)$/);
    if (!fence) return;
    if (inFence) {
      inFence = false;
    } else {
      inFence = true;
      if (fence[2].trim() === '') bareFences.push(`${rel(file)}:${i + 1}`);
    }
  });

  // banned strings
  lines.forEach((line, i) => {
    for (const banned of BANNED_STRINGS) {
      if (line.includes(banned)) bannedHits.push(`${rel(file)}:${i + 1}  contains "${banned}"`);
    }
  });

  // relative .md links: [text](path.md) — skip http(s), absolute, and anchors
  for (const m of text.matchAll(/\]\(([^)\s]+?\.mdx?)(?:#[^)]*)?\)/g)) {
    const target = m[1];
    if (/^(https?:)?\/\//.test(target) || target.startsWith('/')) continue;
    const resolved = path.resolve(dir, decodeURIComponent(target));
    if (!fs.existsSync(resolved)) brokenLinks.push(`${rel(file)}  ->  ${target}`);
  }

  // referenced images
  const imageRefs = [
    ...text.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g),
    ...text.matchAll(/src=["']([^"']+)["']/g),
  ];
  for (const m of imageRefs) {
    const target = m[1];
    if (/^(https?:)?\/\//.test(target) || target.startsWith('data:')) continue;
    const resolved = target.startsWith('/')
      ? path.join(ROOT, 'public', target)
      : path.resolve(dir, decodeURIComponent(target));
    if (!fs.existsSync(resolved) || seenLargeImages.has(resolved)) continue;
    const size = fs.statSync(resolved).size;
    if (size > IMAGE_SIZE_LIMIT) {
      seenLargeImages.add(resolved);
      largeImages.push(`${rel(resolved)}  (${(size / 1024).toFixed(0)} KB, referenced by ${rel(file)})`);
    }
  }
}

// ---------- report ----------

let failed = false;

function report(title, items) {
  if (items.length === 0) {
    console.log(`PASS  ${title}`);
    return;
  }
  failed = true;
  console.log(`FAIL  ${title} (${items.length})`);
  for (const item of items.sort()) console.log(`      - ${item}`);
}

console.log(`docs-check: scanned ${mdFiles.length} pages, ${metaFiles.length} meta.json files\n`);
report('Orphan pages (not referenced by any meta.json)', orphans);
report('Broken relative .md links', brokenLinks);
report('Code fences without a language', bareFences);
report('Banned strings', bannedHits);
report(`Referenced images larger than ${IMAGE_SIZE_LIMIT / 1024} KB`, largeImages);

console.log('');
if (failed) {
  console.log('docs-check: FAILED');
  process.exit(1);
}
console.log('docs-check: OK');
