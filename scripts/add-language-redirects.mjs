#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectLanguageRedirects, collectPageRedirects } from './language-redirects.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_INDEX = path.join(ROOT, 'public', 'index.html');
const OUTPUT_INDEX = path.join(ROOT, 'dist', 'public', 'index.html');
const OUTPUT_REDIRECTS = path.join(ROOT, 'dist', 'public', '_redirects');
const rules = collectLanguageRedirects();

// Locale-less URLs fall through to the English page. Legacy rules stay first so
// they keep winning, and page rules only fill the gaps.
for (const [source, target] of collectPageRedirects()) {
  if (!rules.has(source)) rules.set(source, target);
}

// Cloudflare Workers static assets counts every rule at or after the first
// wildcard rule against the 100-rule dynamic budget, so the file must stay
// static-first: exact rules keep their precedence, and the legacy splat rules
// move to the end where they consume the dynamic budget on their own.
const isDynamic = (source) => source.includes('*');
const entries = [...rules];
const ordered = [
  ...entries.filter(([source]) => !isDynamic(source)),
  ...entries.filter(([source]) => isDynamic(source)),
];

const output = ordered.map(([source, target]) => `${source} ${target}`).join('\n');
fs.copyFileSync(SOURCE_INDEX, OUTPUT_INDEX);
fs.writeFileSync(OUTPUT_REDIRECTS, `${output}\n`);
stripThinRootFromSitemap(path.join(ROOT, 'dist', 'public', 'sitemap.xml'));
console.log(`language redirects: wrote the noindex fallback page and ${rules.size} Cloudflare rules`);

/**
 * Drop a sitemap entry whose path is only `/`, so the language chooser is not listed.
 *
 * @param {string} file
 */
function stripThinRootFromSitemap(file) {
  if (!fs.existsSync(file)) return;

  const xml = fs.readFileSync(file, 'utf8');
  const next = xml.replace(/<url>\s*([\s\S]*?)\s*<\/url>/g, (entry, body) => {
    const loc = body.match(/<loc>([^<]*)<\/loc>/)?.[1];
    if (!loc) return entry;

    let pathname = loc;
    try {
      pathname = new URL(loc).pathname;
    } catch {
      // Relative sitemap locs are already pathnames.
    }

    return pathname === '/' ? '' : entry;
  });

  if (next !== xml) fs.writeFileSync(file, next);
}
