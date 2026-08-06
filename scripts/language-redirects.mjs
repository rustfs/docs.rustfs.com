import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_REDIRECTS = path.join(ROOT, 'public', '_redirects');

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

  return rules;
}
