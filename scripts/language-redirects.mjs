import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENGLISH_CONTENT = path.join(ROOT, 'content', 'en');
const SOURCE_REDIRECTS = path.join(ROOT, 'public', '_redirects');

/** @param {string} target */
function prefixEnglishTarget(target) {
  if (!target.startsWith('/') || target === '/en' || target.startsWith('/en/')) return target;
  return target === '/' ? '/en' : `/en${target}`;
}

/** @returns {Map<string, string>} */
export function collectLanguageRedirects() {
  /** @type {Map<string, string>} */
  const rules = new Map();
  rules.set('/', '/en 302');

  const existingRules = fs.readFileSync(SOURCE_REDIRECTS, 'utf8').split('\n');
  for (const line of existingRules) {
    const match = line.trim().match(/^(\S+)\s+(\S+)\s+(\d+)$/);
    if (!match) continue;
    const source = match[1];
    const target = match[2];
    const status = match[3];
    if (!source || !target || !status) continue;
    rules.set(source, `${prefixEnglishTarget(target)} ${status}`);
  }

  // Collapse all current unprefixed documentation routes into one rule per
  // top-level section. This keeps Cloudflare's _redirects file below its
  // 100-rule dynamic redirect limit while preserving the legacy rules above.
  for (const entry of fs.readdirSync(ENGLISH_CONTENT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const section = `/${entry.name}`;
    if (!rules.has(section)) rules.set(section, `/en${section} 301`);
    rules.set(`${section}/*`, `/en${section}/:splat 301`);
  }

  return rules;
}
