import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_REDIRECTS = path.join(ROOT, 'public', '_redirects');
const DEFAULT_LOCALE = 'en';
const LOCALE_DIR = path.join(ROOT, 'dist', 'public', DEFAULT_LOCALE);
// `/404` is the Cloudflare Pages error page. `/` is not a content page; it is
// pinned to the default language below so crawlers never stop on the chooser.
const SKIPPED_PAGES = new Set(['/404']);
/** @type {Array<[string, string]>} */
const ROOT_REDIRECTS = [
  ['/', `/${DEFAULT_LOCALE} 301`],
  ['/index.html', `/${DEFAULT_LOCALE} 301`],
];

/** @returns {Map<string, string>} */
export function collectLanguageRedirects() {
  /** @type {Map<string, string>} */
  const rules = new Map();

  const existingRules = fs.readFileSync(SOURCE_REDIRECTS, 'utf8').split('\n');
  for (const line of existingRules) {
    const match = line.trim().match(/^(\S+)\s+(\S+)\s+(\d+)$/);
    if (!match) continue;
    const source = match[1];
    const target = match[2];
    const status = match[3];
    if (!source || !target || !status) continue;

    // Keep only base rules in _redirects to stay below Cloudflare's 100 dynamic rule limit.
    // Locale-aware variants are resolved at runtime by worker.mjs.
    rules.set(source, `${target} ${status}`);
  }

  // Always pin the docs root, even if public/_redirects drops the lines.
  for (const [source, target] of ROOT_REDIRECTS) {
    rules.set(source, target);
  }

  return rules;
}

/** @param {string} dir @param {string[]} segments @returns {string[]} */
function listPagePaths(dir, segments) {
  /** @type {string[]} */
  const pages = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const nested = [...segments, entry.name];
    if (fs.existsSync(path.join(dir, entry.name, 'index.html'))) {
      pages.push(`/${nested.join('/')}`);
    }

    pages.push(...listPagePaths(path.join(dir, entry.name), nested));
  }

  return pages;
}

/**
 * Static 301 rules for every English page, so a locale-less URL such as
 * `/installation` resolves to `/en/installation` instead of returning 404.
 * These are static (no splat), so they stay well clear of Cloudflare's
 * 100 dynamic rule limit — Pages allows 2,000 static rules.
 *
 * @returns {Map<string, string>}
 */
export function collectPageRedirects() {
  /** @type {Map<string, string>} */
  const rules = new Map();

  if (!fs.existsSync(LOCALE_DIR)) return rules;

  for (const page of listPagePaths(LOCALE_DIR, [])) {
    if (SKIPPED_PAGES.has(page)) continue;
    rules.set(page, `/${DEFAULT_LOCALE}${page} 301`);
  }

  return rules;
}
