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

test("root path is left alone", async () => {
  const res = await request(makeEnv(FIXTURE_RULES), "/");
  assert.equal(res.status, 200);
  assert.equal(await res.text(), "asset:/");
});

test("unknown paths fall through to assets (no crash, no bogus redirect)", async () => {
  const env = makeEnv(FIXTURE_RULES);
  for (const candidate of ["/never-heard-of-it/", "/never-heard-of-it", "/en/never-heard-of-it/"]) {
    const res = await request(env, candidate);
    assert.equal(res.status, 200, candidate);
    assert.equal(await res.text(), `asset:${candidate}`, candidate);
  }
});

test("localized page with trailing slash is deferred to the asset layer, no double redirect", async () => {
  const env = makeEnv(FIXTURE_RULES, { assetPaths: new Set(["/en/installation"]) });
  const res = await request(env, "/en/installation/");
  assert.equal(res.status, 308); // emitted by the (simulated) asset layer, not the worker
  assert.equal(res.headers.get("location"), "/en/installation");
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
  assert.equal((await request(env, "/b/")).status, 200);
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
});
