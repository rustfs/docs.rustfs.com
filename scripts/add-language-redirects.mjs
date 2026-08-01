#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectLanguageRedirects } from './language-redirects.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_INDEX = path.join(ROOT, 'public', 'index.html');
const OUTPUT_INDEX = path.join(ROOT, 'dist', 'public', 'index.html');
const OUTPUT_REDIRECTS = path.join(ROOT, 'dist', 'public', '_redirects');
const rules = collectLanguageRedirects();

const output = [...rules].map(([source, target]) => `${source} ${target}`).join('\n');
fs.copyFileSync(SOURCE_INDEX, OUTPUT_INDEX);
fs.writeFileSync(OUTPUT_REDIRECTS, `${output}\n`);
console.log(`language redirects: wrote the language entry page and ${rules.size} Cloudflare rules`);
