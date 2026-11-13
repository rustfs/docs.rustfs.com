const redirectRulesByEnv = new WeakMap();
const DEFAULT_LOCALE = "en";
const LOCALES = ["en", "zh", "de", "fr", "ja"];
const LOCALE_SET = new Set(LOCALES);

async function loadRedirectRules(env) {
  // Use the built _redirects file from the assets bundle so build-time generated rules are honored.
  const req = new Request("https://docs.rustfs.com/_redirects");
  const res = await env.ASSETS.fetch(req);
  if (!res.ok) return [];

  const text = await res.text();
  const rules = [];

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^(\S+)\s+(\S+)\s+(\d{3})$/);
    if (!match) continue;

    const source = match[1];
    const target = match[2];
    const status = Number(match[3]);

    if (!source || !target || !Number.isInteger(status)) continue;

    rules.push({ source, target, status });
  }

  return rules;
}

async function getRedirectRules(env) {
  // Cache per env so one isolate keeps a single parse, and tests can supply
  // a different rules file without inheriting the first request's payload.
  let pending = redirectRulesByEnv.get(env);
  if (!pending) {
    pending = loadRedirectRules(env);
    redirectRulesByEnv.set(env, pending);
  }
  return pending;
}

function matchRedirect(pathname, rules, exactOnly = false) {
  for (const rule of rules) {
    const { source, target, status } = rule;
    // Non-English locales reuse exact historical rules only. Splats such as
    // /management/* guess a prefix that is wrong for several moved sections.
    if (exactOnly && source.includes("*")) continue;

    if (source.endsWith("/*")) {
      const prefix = source.slice(0, -1);
      if (!pathname.startsWith(prefix)) continue;

      const splat = pathname.slice(prefix.length);
      return {
        target: target.replace(":splat", splat),
        status,
      };
    }

    if (pathname === source) {
      return { target, status };
    }
  }

  return null;
}

function splitLocale(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { locale: null, remainder: pathname };

  const locale = parts[0];
  if (!LOCALE_SET.has(locale)) return { locale: null, remainder: pathname };

  const remainder = `/${parts.slice(1).join("/")}`;
  return { locale, remainder: remainder === "/" ? "/" : remainder };
}

// Redirect sources never carry a trailing slash (see scripts/language-redirects.mjs),
// but inbound URLs may. Canonicalize before matching so /installation/ reuses the
// /installation rule instead of falling through to a missing asset.
function normalizePathname(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function localizeTarget(target, locale) {
  if (!target.startsWith("/")) return target;
  if (target === `/${DEFAULT_LOCALE}`) return `/${locale}`;
  if (target.startsWith(`/${DEFAULT_LOCALE}/`)) {
    return `/${locale}${target.slice(DEFAULT_LOCALE.length + 1)}`;
  }
  if (target === "/") return `/${locale}`;
  const first = target.split("/")[1];
  if (LOCALE_SET.has(first)) return target;
  return `/${locale}${target}`;
}

// Base rules are written for English (/old /en/new). Every locale reuses the
// exact rules; the /en prefix is swapped for the locale that was requested.
function resolveRedirect(pathname, rules) {
  const direct = matchRedirect(pathname, rules);
  if (direct) return direct;

  const { locale, remainder } = splitLocale(pathname);
  // "/" is the docs root rule, not a per-locale page move.
  if (!locale || remainder === "/") return null;

  const base = matchRedirect(remainder, rules, locale !== DEFAULT_LOCALE);
  if (!base) return null;

  const target = localizeTarget(base.target, locale);
  // Do not publish English homepage dumps (for example /concepts/architecture
  // → /en) as locale homepages. Those old URLs stay unmatched.
  if (locale !== DEFAULT_LOCALE && target === `/${locale}`) return null;
  return { status: base.status, target };
}

// Permanent pretty-URL canonicalization. Cloudflare's asset html_handling
// does the same rewrites with a temporary 307; these shapes never change.
// Root-level files such as /baidu_verify_*.html stay addressable.
function canonicalizePath(pathname) {
  let path = pathname;
  for (let i = 0; i < 6; i++) {
    let next = path;
    if (
      next.endsWith(".html") &&
      (next === "/index.html" || next.lastIndexOf("/") > 0)
    ) {
      next = next.slice(0, -".html".length);
    }
    if (next.length > 1 && next.endsWith("/")) {
      next = next.slice(0, -1);
    }
    if (next === "/index" || next.endsWith("/index")) {
      next = next.slice(0, -"/index".length);
      if (next.length > 1 && next.endsWith("/")) next = next.slice(0, -1);
      if (next === "") next = "/";
    }
    if (next === path) return path || "/";
    path = next;
  }
  return path || "/";
}

export default {
  async fetch(request, env) {
    const method = request.method.toUpperCase();
    if (method === "GET" || method === "HEAD") {
      const url = new URL(request.url);
      const rules = await getRedirectRules(env);
      const originalPath = url.pathname;
      const pathname = normalizePathname(originalPath);
      let matched = resolveRedirect(pathname, rules);
      const canonical = canonicalizePath(originalPath);

      // /installation/docker/index.html should hit /installation/docker in one hop.
      if (!matched && canonical !== pathname) {
        matched = resolveRedirect(canonical, rules);
      }

      if (matched) {
        const targetUrl = new URL(matched.target, url);
        targetUrl.search = url.search;

        // Avoid redirect loops caused by equivalent source/target paths.
        // Compare with the original path so a trailing slash still redirects.
        if (`${targetUrl.pathname}${targetUrl.search}` !== `${originalPath}${url.search}`) {
          return Response.redirect(targetUrl.toString(), matched.status);
        }
      }

      if (canonical !== originalPath) {
        const targetUrl = new URL(canonical, url);
        targetUrl.search = url.search;
        return Response.redirect(targetUrl.toString(), 301);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
