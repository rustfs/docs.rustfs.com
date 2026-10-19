import { staticClient } from "fumadocs-core/search/client/orama-static";

/**
 * @param {{ locale: string, baseUrl?: string, attempt?: number }} options
 */
export function localSearchClient({ locale, baseUrl = "/", attempt = 0 }) {
  const path = `${baseUrl.replace(/\/$/, "")}/api/search/${locale}.json`;
  // The upstream client caches failed downloads too. An explicit retry uses a
  // fresh cache key for the same static asset, without reloading the page.
  const client = staticClient({
    locale,
    from: attempt === 0 ? path : `${path}?retry=${attempt}`,
  });
  return { ...client, deps: [locale, attempt] };
}
