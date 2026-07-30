#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENGLISH_CONTENT = path.join(ROOT, 'content', 'en');
const SOURCE_REDIRECTS = path.join(ROOT, 'public', '_redirects');
const OUTPUT_REDIRECTS = path.join(ROOT, 'dist', 'public', '_redirects');
const VERCEL_REDIRECTS = path.join(ROOT, 'dist', 'vercel-redirects.json');

/**
 * @param {string} directory
 * @param {string[]} files
 * @returns {string[]}
 */
function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolutePath, files);
    else files.push(absolutePath);
  }
  return files;
}

/** @param {string} target */
function prefixEnglishTarget(target) {
  if (!target.startsWith('/') || target === '/en' || target.startsWith('/en/')) return target;
  return target === '/' ? '/en' : `/en${target}`;
}

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

for (const file of walk(ENGLISH_CONTENT)) {
  if (!/\.mdx?$/.test(file)) continue;
  let route = path.relative(ENGLISH_CONTENT, file).split(path.sep).join('/');
  route = route.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
  if (!route) continue;
  const source = `/${route}`;
  if (!rules.has(source)) rules.set(source, `/en${source} 301`);
}

const output = [...rules].map(([source, target]) => `${source} ${target}`).join('\n');
fs.writeFileSync(OUTPUT_REDIRECTS, `${output}\n`);

const vercelRedirects = [...rules].flatMap(([source, rule]) => {
  // Wildcards use Vercel's path syntax and remain in the root vercel.json.
  if (source.includes('*')) return [];

  const separator = rule.lastIndexOf(' ');
  const destination = rule.slice(0, separator);
  const status = rule.slice(separator + 1);
  return [{ source, destination, permanent: status === '301' || status === '308' }];
});

fs.writeFileSync(VERCEL_REDIRECTS, `${JSON.stringify(vercelRedirects, null, 2)}\n`);
console.log(
  `language redirects: wrote ${rules.size} Cloudflare rules and ${vercelRedirects.length} Vercel rules`,
);
