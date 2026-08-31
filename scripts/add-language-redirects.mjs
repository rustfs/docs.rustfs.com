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

const output = [...rules].map(([source, target]) => `${source} ${target}`).join('\n');
fs.copyFileSync(SOURCE_INDEX, OUTPUT_INDEX);
fs.writeFileSync(OUTPUT_REDIRECTS, `${output}\n`);
console.log(`language redirects: wrote the language entry page and ${rules.size} Cloudflare rules`);
