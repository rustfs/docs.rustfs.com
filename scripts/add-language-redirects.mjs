#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectLanguageRedirects } from './language-redirects.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_REDIRECTS = path.join(ROOT, 'dist', 'public', '_redirects');
const rules = collectLanguageRedirects();

const output = [...rules].map(([source, target]) => `${source} ${target}`).join('\n');
fs.writeFileSync(OUTPUT_REDIRECTS, `${output}\n`);
console.log(`language redirects: wrote ${rules.size} Cloudflare rules`);
