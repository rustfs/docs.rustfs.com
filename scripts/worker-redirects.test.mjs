// Tests for the docs.rustfs.com redirect Worker (worker.mjs).
//
// Run with: npm run test:worker  (node --test, no extra dependencies)
//
// The suite drives the real default export with a fake env.ASSETS that serves
// a configurable _redirects payload, so rule parsing, matching, locale
// fallback, and redirect emission are exercised end to end. A final block
// additionally runs against the real build output (dist/public/_redirects)
// when it exists, so production rules can be checked locally after `npm run build`.

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { collectLanguageRedirects } from "./language-redirects.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const worker = (await import(path.join(here, "..", "worker.mjs"))).default;

function makeEnv(rulesText, { assetPaths = new Set() } = {}) {
  return {
    ASSETS: {
      async fetch(req) {
        const assetPath = new URL(req.url).pathname;
        if (assetPath === "/_redirects") {
          return new Response(rulesText, { status: 200 });
        }
        // Mirrors Workers Assets html_handling: "drop-trailing-slash", which only
        // helps URLs that actually map to an asset.
        if (assetPath !== "/" && assetPath.endsWith("/") && assetPaths.has(assetPath.slice(0, -1))) {
          return new Response(null, { status: 308, headers: { location: assetPath.slice(0, -1) } });
        }
        return new Response(`asset:${assetPath}`, { status: 200 });
      },
    },
  };
}

const FIXTURE_RULES = [
  "/installation /en/installation 301",
  "/installation/console-first-steps /en/administration/console 301",
  "/management /en/administration 301",
  "/management/* /en/administration/:splat 301",
  "/old-page /new-page 302",
  "",
].join("\n");

async function request(env, pathAndQuery, { method = "GET" } = {}) {
  return worker.fetch(new Request(`https://docs.rustfs.com${pathAndQuery}`, { method }), env);
}

test("exact rule match redirects with the rule status", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/installation");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://docs.rustfs.com/en/installation");
});

test("REGRESSION: trailing slash reuses the exact rule instead of 404ing", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/installation/");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://docs.rustfs.com/en/installation");
});

test("trailing slash on a nested exact rule", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/installation/console-first-steps/");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://docs.rustfs.com/en/administration/console");
});

test("query string is preserved through a trailing-slash redirect", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/installation/?utm_source=newsletter");
  assert.equal(res.status, 301);
  assert.equal(
    res.headers.get("location"),
    "https://docs.rustfs.com/en/installation?utm_source=newsletter",
  );
});

test("HEAD requests follow the same redirect logic", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/installation/", { method: "HEAD" });
  assert.equal(res.status, 301);
});

test("non-GET/HEAD requests fall through to assets untouched", async () => {
  const env = makeEnv(FIXTURE_RULES);
  const res = await request(env, "/installation/", { method: "POST" });
  assert.equal(res.status, 200);
  assert.equal(await res.text(), "asset:/installation/"); // assets answered; the worker did not redirect
});

test("root path is left alone when no root rule exists", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/");
  assert.equal(res.status, 200);
  assert.equal(await res.text(), "asset:/");
});

test("root and /index.html redirect permanently to the default language", async () => {
  const rules = ["/ /en 301", "/index.html /en 301", FIXTURE_RULES].join("\n");
  const env = makeEnv(rules);

  const root = await request(env, "/");
  assert.equal(root.status, 301);
  assert.equal(root.headers.get("location"), "https://docs.rustfs.com/en");

  const withQuery = await request(env, "/?utm_source=docs");
  assert.equal(withQuery.status, 301);
  assert.equal(withQuery.headers.get("location"), "https://docs.rustfs.com/en?utm_source=docs");

  const index = await request(env, "/index.html");
  assert.equal(index.status, 301);
  assert.equal(index.headers.get("location"), "https://docs.rustfs.com/en");

  const head = await request(env, "/", { method: "HEAD" });
  assert.equal(head.status, 301);
  assert.equal(head.headers.get("location"), "https://docs.rustfs.com/en");
});

test("unknown paths fall through to assets (no crash, no bogus redirect)", async () => {
  const env = makeEnv(FIXTURE_RULES);
  for (const candidate of ["/never-heard-of-it", "/en/never-heard-of-it"]) {
    const res = await request(env, candidate);
    assert.equal(res.status, 200, candidate);
    assert.equal(await res.text(), `asset:${candidate}`, candidate);
  }
});

test("trailing slash on an unknown path is a permanent canonical redirect", async () => {
  const env = makeEnv(FIXTURE_RULES);
  for (const candidate of ["/never-heard-of-it/", "/en/never-heard-of-it/"]) {
    const res = await request(env, candidate);
    assert.equal(res.status, 301, candidate);
    assert.equal(res.headers.get("location"), `https://docs.rustfs.com${candidate.slice(0, -1)}`, candidate);
  }
});

test("localized page with trailing slash is a permanent redirect, not an asset 307", async () => {
  const env = makeEnv(FIXTURE_RULES, { assetPaths: new Set(["/en/installation"]) });
  const res = await request(env, "/en/installation/");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://docs.rustfs.com/en/installation");
});

test("locale fallback reuses the base rule and keeps the locale", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/en/management");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://docs.rustfs.com/en/administration");
});

test("REGRESSION: locale fallback also works with a trailing slash", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/en/management/");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://docs.rustfs.com/en/administration");
});

test("locale fallback prefixes the locale when the target is not localized", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/en/old-page/");
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("location"), "https://docs.rustfs.com/en/new-page");
});

test("splat rule behavior is unchanged (no trailing slash)", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/management/foo");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://docs.rustfs.com/en/administration/foo");
});

test("splat rule canonicalizes a trailing slash in one hop", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/management/foo/");
  assert.equal(res.status, 301);
  assert.equal(res.headers.get("location"), "https://docs.rustfs.com/en/administration/foo");
});

test("loop protection: a request that already equals its target falls through", async () => {
  const rules = "/a /b 301\n";
  const env = makeEnv(rules);
  assert.equal((await request(env, "/b")).status, 200);
  const slashed = await request(env, "/b/");
  assert.equal(slashed.status, 301);
  assert.equal(slashed.headers.get("location"), "https://docs.rustfs.com/b");
});

/** @param {string} text */
function productionRuleOrder(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  const exact = lines.filter((line) => {
    const source = line.split(/\s+/)[0];
    return Boolean(source && !source.includes("*"));
  });
  const dynamic = lines.filter((line) => {
    const source = line.split(/\s+/)[0];
    return Boolean(source && source.includes("*"));
  });
  return [...exact, ...dynamic].join("\n");
}

test("historical and migrated paths redirect permanently for every locale", async () => {
  const rules = productionRuleOrder(
    readFileSync(path.join(here, "..", "public", "_redirects"), "utf8"),
  );
  const env = makeEnv(rules);
  const cases = [
    ["/de/installation/docker/index", "/de/installation/container/docker"],
    ["/de/installation/docker/index/", "/de/installation/container/docker"],
    ["/de/installation/docker/index.html", "/de/installation/container/docker"],
    ["/zh/installation/docker", "/zh/installation/container/docker"],
    ["/fr/installation/docker/", "/fr/installation/container/docker"],
    ["/ja/upgrade-scale/upgrade", "/ja/operations/upgrade"],
    ["/de/upgrade-scale/upgrade/", "/de/operations/upgrade"],
    ["/en/upgrade-scale/upgrade", "/en/operations/upgrade"],
    ["/de/features/s3-compatibility", "/de/reference/s3-compatibility"],
    ["/de/features/s3-compatibility/", "/de/reference/s3-compatibility"],
    ["/fr/features/s3-compatibility?from=old", "/fr/reference/s3-compatibility?from=old"],
    ["/de/management/bucket/index", "/de/administration/data/bucket/creation"],
    ["/management/bucket/index", "/en/administration/data/bucket/creation"],
    ["/zh/management/bucket", "/zh/administration/data/bucket/creation"],
    ["/ja/developer/api", "/ja/administration/protocols/s3"],
    ["/developer/api/", "/en/administration/protocols/s3"],
    ["/en/developer/integration/big-data/duckdb", "/en/developer/integration/database/duckdb"],
    ["/zh/developer/integration/big-data/trino/", "/zh/developer/integration/database/trino"],
    ["/de/developer/integration/big-data/clickhouse", "/de/developer/integration/database/clickhouse"],
    ["/fr/developer/integration/big-data/doris", "/fr/developer/integration/database/doris"],
    ["/ja/developer/integration/big-data/influxdb", "/ja/developer/integration/database/influxdb"],
    ["/en/developer/integration/big-data/milvus", "/en/developer/integration/database/milvus"],
    ["/zh/developer/integration/big-data/vitess", "/zh/developer/integration/database/vitess"],
    ["/de/developer/integration/big-data/lakefs", "/de/developer/integration/storage/lakefs"],
    ["/fr/developer/integration/big-data/opendal", "/fr/developer/integration/storage/opendal"],
    ["/ja/developer/integration/big-data/zerofs", "/ja/developer/integration/storage/zerofs"],
    ["/en/developer/integration/big-data/mlflow", "/en/developer/integration/ai/mlflow"],
  ];

  for (const pair of cases) {
    const from = pair[0];
    const to = pair[1];
    if (!from || !to) throw new Error("incomplete redirect case");
    const res = await request(env, from);
    assert.equal(res.status, 301, from);
    assert.equal(res.headers.get("location"), `https://docs.rustfs.com${to}`, from);
  }

  const head = await request(env, "/de/developer/integration/big-data/duckdb", { method: "HEAD" });
  assert.equal(head.status, 301);
  assert.equal(
    head.headers.get("location"),
    "https://docs.rustfs.com/de/developer/integration/database/duckdb",
  );

  // English homepage dumps stay English-only. Other locales are not sent home.
  const enHome = await request(env, "/en/concepts/architecture");
  assert.equal(enHome.status, 301);
  assert.equal(enHome.headers.get("location"), "https://docs.rustfs.com/en");
  const deHome = await request(env, "/de/concepts/architecture");
  assert.equal(deHome.status, 200);

  // Splats stay English-only so /de/management/iam/users is not guessed.
  const enSplat = await request(env, "/en/management/iam/users");
  assert.equal(enSplat.status, 301);
  assert.equal(enSplat.headers.get("location"), "https://docs.rustfs.com/en/administration/iam/users");
  const deSplat = await request(env, "/de/management/iam/users");
  assert.equal(deSplat.status, 200);

  const pretty = await request(env, "/ja/installation/linux/quick-start.html");
  assert.equal(pretty.status, 301);
  assert.equal(pretty.headers.get("location"), "https://docs.rustfs.com/ja/installation/linux/quick-start");
  const index = await request(env, "/ja/installation/linux/index");
  assert.equal(index.status, 301);
  assert.equal(index.headers.get("location"), "https://docs.rustfs.com/ja/installation/linux");
  const root = await request(env, "/ja/");
  assert.equal(root.status, 301);
  assert.equal(root.headers.get("location"), "https://docs.rustfs.com/ja");
  const verify = await request(env, "/baidu_verify_codeva-Q10h8gcgwD.html");
  assert.equal(verify.status, 200);

  const canonical = await request(env, "/de/reference/s3-compatibility");
  assert.equal(canonical.status, 200);
  const duck = await request(env, "/de/developer/integration/database/duckdb");
  assert.equal(duck.status, 200);
});

test("language redirect rules pin the docs root to English", () => {
  const rules = collectLanguageRedirects();
  assert.equal(rules.get("/"), "/en 301");
  assert.equal(rules.get("/index.html"), "/en 301");
});

test("real build output (if present): /installation and /installation/ both 301", async (t) => {
  const redirectsPath = path.join(here, "..", "dist", "public", "_redirects");
  if (!existsSync(redirectsPath)) {
    t.skip("dist/public/_redirects not built; run `npm run build` to enable");
    return;
  }
  const env = makeEnv(readFileSync(redirectsPath, "utf8"));

  const bare = await request(env, "/installation");
  assert.equal(bare.status, 301);
  assert.equal(bare.headers.get("location"), "https://docs.rustfs.com/en/installation");

  const slashed = await request(env, "/installation/");
  assert.equal(slashed.status, 301);
  assert.equal(slashed.headers.get("location"), "https://docs.rustfs.com/en/installation");

  const splat = await request(env, "/management/iam/users");
  assert.equal(splat.status, 301);
  assert.equal(splat.headers.get("location"), "https://docs.rustfs.com/en/administration/iam/users");

  const splatSlashed = await request(env, "/management/iam/users/");
  assert.equal(splatSlashed.status, 301);
  assert.equal(splatSlashed.headers.get("location"), "https://docs.rustfs.com/en/administration/iam/users");

  const root = await request(env, "/");
  assert.equal(root.status, 301);
  assert.equal(root.headers.get("location"), "https://docs.rustfs.com/en");

  const index = await request(env, "/index.html");
  assert.equal(index.status, 301);
  assert.equal(index.headers.get("location"), "https://docs.rustfs.com/en");

  const sitemap = readFileSync(path.join(here, "..", "dist", "public", "sitemap.xml"), "utf8");
  assert.doesNotMatch(sitemap, /<loc>https:\/\/docs\.rustfs\.com\/?<\/loc>/);
  /** @param {string} loc */
  const urlBlock = (loc) => {
    const match = sitemap.match(new RegExp(`<url>(?:(?!</url>).)*<loc>${loc}</loc>(?:(?!</url>).)*</url>`));
    assert.ok(match, `missing sitemap entry ${loc}`);
    return match[0];
  };
  const enEntry = urlBlock("https://docs\\.rustfs\\.com/en");
  const zhEntry = urlBlock("https://docs\\.rustfs\\.com/zh");
  assert.match(enEntry, /<priority>1<\/priority>/);
  assert.match(zhEntry, /<priority>0\.9<\/priority>/);
  assert.match(enEntry, /hreflang="x-default" href="https:\/\/docs\.rustfs\.com\/en"/);

  const enHtml = readFileSync(path.join(here, "..", "dist", "public", "en", "index.html"), "utf8");
  const zhHtml = readFileSync(path.join(here, "..", "dist", "public", "zh", "index.html"), "utf8");
  const deDocker = readFileSync(
    path.join(here, "..", "dist", "public", "de", "installation", "container", "docker", "index.html"),
    "utf8",
  );
  assert.equal((enHtml.match(/<meta[^>]*name="description"/g) ?? []).length, 1);
  assert.match(deDocker, /<title>RustFS mit Docker installieren und konfigurieren<\/title>/);
  assert.equal(existsSync(path.join(here, "..", "dist", "public", "ja", "developer", "integration", "database", "trino", "index.html")), true);
  const built = await request(env, "/de/developer/integration/big-data/duckdb");
  assert.equal(built.status, 301);
  assert.equal(built.headers.get("location"), "https://docs.rustfs.com/de/developer/integration/database/duckdb");
  assert.match(enHtml, /<title>RustFS Documentation \| S3-Compatible Object Storage<\/title>/);
  assert.match(enHtml, /MinIO-compatible migration, and cluster operations\./);
  assert.match(zhHtml, /<title>RustFS 文档 \| 兼容 S3 的对象存储<\/title>/);
  assert.match(zhHtml, /兼容 MinIO 的迁移和集群运维。/);

  const fallback = readFileSync(path.join(here, "..", "dist", "public", "index.html"), "utf8");
  assert.match(fallback, /noindex, follow/);
  assert.match(fallback, /rel="canonical" href="https:\/\/docs\.rustfs\.com\/en"/);
});
