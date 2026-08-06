import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_REDIRECTS = path.join(ROOT, 'public', '_redirects');
const LOCALES = ['en', 'zh', 'de', 'fr', 'ja'];

/** @param {string} pathname */
function isLocalizedPath(pathname) {
  return LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

/** @param {string} source @param {string} locale */
function localizeSource(source, locale) {
  if (!source.startsWith('/')) return source;
  if (isLocalizedPath(source)) return source;
  return `/${locale}${source}`;
}

/** @param {string} target @param {string} locale */
function localizeTarget(target, locale) {
  if (!target.startsWith('/')) return target;
  if (isLocalizedPath(target)) return target;
  if (target === '/') return `/${locale}`;
  return `/${locale}${target}`;
}

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

    // Keep the original unprefixed rule exactly as declared in public/_redirects.
    rules.set(source, `${target} ${status}`);

    // Also emit language-prefixed variants, e.g. /zh/foo -> /zh/bar.
    for (const locale of LOCALES) {
      const localizedSource = localizeSource(source, locale);
      const localizedTarget = localizeTarget(target, locale);
      rules.set(localizedSource, `${localizedTarget} ${status}`);
    }
  }

  return rules;
}
