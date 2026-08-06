let redirectRulesPromise;
const DEFAULT_LOCALE = "en";

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
  if (!redirectRulesPromise) {
    redirectRulesPromise = loadRedirectRules(env);
  }
  return redirectRulesPromise;
}

function matchRedirect(pathname, rules) {
  for (const rule of rules) {
    const { source, target, status } = rule;

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
  if (locale !== DEFAULT_LOCALE) return { locale: null, remainder: pathname };

  const remainder = `/${parts.slice(1).join("/")}`;
  return { locale, remainder: remainder === "/" ? "/" : remainder };
}

function isLocalizedPath(pathname) {
  return pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`);
}

function applyLocaleToTarget(target, locale) {
  if (!target.startsWith("/")) return target;
  if (isLocalizedPath(target)) return target;
  if (target === "/") return `/${locale}`;
  return `/${locale}${target}`;
}

export default {
  async fetch(request, env) {
    const method = request.method.toUpperCase();
    if (method === "GET" || method === "HEAD") {
      const url = new URL(request.url);
      const rules = await getRedirectRules(env);
      let matched = matchRedirect(url.pathname, rules);

      // English-only fallback: /en/foo can reuse base rule /foo -> /en/bar.
      if (!matched) {
        const { locale, remainder } = splitLocale(url.pathname);
        if (locale) {
          const baseMatch = matchRedirect(remainder, rules);
          if (baseMatch) {
            matched = {
              status: baseMatch.status,
              target: applyLocaleToTarget(baseMatch.target, locale),
            };
          }
        }
      }

      if (matched) {
        const targetUrl = new URL(matched.target, url);
        targetUrl.search = url.search;

        // Avoid redirect loops caused by equivalent source/target paths.
        if (`${targetUrl.pathname}${targetUrl.search}` !== `${url.pathname}${url.search}`) {
          return Response.redirect(targetUrl.toString(), matched.status);
        }
      }
    }

    return env.ASSETS.fetch(request);
  },
};
