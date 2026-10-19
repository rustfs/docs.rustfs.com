import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { gzipSync } from "node:zlib";
import { after, before, test } from "node:test";
import { localSearchClient } from "../src/lib/local-search.mjs";

const output = new URL("../dist/public/", import.meta.url);
// Exercise the actual exported bytes and the same client used by FumaPress's
// dialog. This server only serves a file: there is no search API/backend.
const languages = ["en", "zh", "de", "fr", "ja"];
const indexes = new Map(await Promise.all(languages.map(/** @returns {Promise<[string, Buffer]>} */ async (locale) => {
  const path = `api/search/${locale}.json`;
  const bytes = await readFile(new URL(path, output)).catch((cause) => {
    throw new Error("Build the static site with `npm run build` before testing search.", { cause });
  });
  return [`/${path}`, bytes];
})));
/** @type {(string | undefined)[]} */
const requests = [];
let failNextRequest = false;
const server = createServer((request, response) => {
  requests.push(request.url);
  if (failNextRequest) {
    failNextRequest = false;
    response.writeHead(503).end();
    return;
  }
  const index = indexes.get(new URL(request.url ?? "/", "http://localhost").pathname);
  if (!index) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader("Content-Type", "application/json");
  response.end(index);
});
let endpoint = "";

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(undefined)));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  endpoint = `http://127.0.0.1:${address.port}`;
});
after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve(undefined))));

/** @param {string} locale @param {string} query */
async function search(locale, query) {
  const result = await localSearchClient({ baseUrl: endpoint, locale }).search(query);
  assert.ok(result.length > 0, `No ${locale} results for ${query}`);
  for (const item of result) {
    assert.ok(item.url === `/${locale}` || item.url.startsWith(`/${locale}/`),
      `${query} leaked a result outside ${locale}: ${item.url}`);
  }
  return result;
}

/** @param {string} url */
async function assertDestination(url) {
  const { pathname, hash } = new URL(url, "https://docs.rustfs.com");
  const path = `${pathname.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
  const html = await readFile(new URL(path, output), "utf8");
  if (hash) assert.ok(html.includes(`id="${decodeURIComponent(hash.slice(1))}"`), `Missing anchor: ${url}`);
}

test("the build exports a deployable static index for every locale", async (t) => {
  assert.equal(indexes.size, languages.length);
  for (const [path, index] of indexes) {
    const data = JSON.parse(index.toString());
    assert.equal(data.type, "advanced");
    assert.equal(data.i18n, true);
    const locale = path.slice("/api/search/".length, -".json".length);
    const records = /** @type {{ locale: string, url: string }[]} */ (Object.values(data.docs.docs));
    assert.ok(records.length > 0);
    for (const record of records) {
      assert.equal(record.locale, locale, `${path} includes another language`);
      assert.ok(record.url === `/${locale}` || record.url.startsWith(`/${locale}/`));
    }
    // Cloudflare Static Assets limits each file to 25 MiB. Keep the same output
    // deployable there as well as on the primary Aliyun OSS static host.
    assert.ok(index.length < 25 * 1024 * 1024, `${path} exceeds the static asset limit`);
    t.diagnostic(`${path}: ${index.length.toLocaleString()} bytes; gzip: ${gzipSync(index).length.toLocaleString()} bytes`);
  }
  assert.ok((await stat(new URL("api/search", output))).isDirectory(), "Do not emit a combined index");
  await assert.rejects(stat(new URL("algolia-index.json", output)), { code: "ENOENT" });
});

test("a cold Chinese search downloads only the Chinese index", async () => {
  await search("zh", "环境变量");
  assert.deepEqual(requests, ["/api/search/zh.json"]);
});

/** @type {[string, string, string][]} */
const localizedCases = [
  ["zh", "环境变量", "/zh/reference/environment-variables"],
  ["zh", "创建 RustFS 存储桶", "/zh/administration/data/bucket/creation"],
  ["de", "RustFS-Dokumentation", "/de"],
  ["fr", "Documentation de RustFS", "/fr"],
  ["ja", "ドキュメント", "/ja"],
];
for (const [locale, query, path] of localizedCases) {
  test(`${locale}: localized query ${query}`, async () => {
    const result = await search(locale, query);
    assert.ok(result.some((item) => item.url.split("#")[0] === path), `Expected ${path}`);
    await assertDestination(path);
  });
}

/** @type {[string, string][]} */
const technicalCases = [
  ["RUSTFS_VOLUMES", "reference/environment-variables"],
  ["ListObjectsV2", "reference/s3-compatibility"],
];
for (const locale of ["en", "zh", "de", "fr", "ja"]) {
  for (const [query, path] of technicalCases) {
    test(`${locale}: technical identifier ${query} stays in its locale`, async () => {
      const result = await search(locale, query);
      const match = result.find((item) => item.url.startsWith(`/${locale}/${path}#`));
      assert.ok(match, `Expected a section result on /${locale}/${path}`);
      await assertDestination(match.url);
    });
  }
}

test("Chinese heading results link to existing section anchors", async () => {
  const result = await search("zh", "存储桶操作");
  const heading = result.find((item) => item.type === "heading" && item.url.startsWith("/zh/reference/s3-compatibility#"));
  assert.ok(heading, "Expected the bucket operations heading");
  await assertDestination(heading.url);
});

test("no-match queries return an empty result", async () => {
  assert.deepEqual(await localSearchClient({ baseUrl: endpoint, locale: "zh" }).search("zzqvwxjnomatch987654321"), []);
});

test("repeated searches and locale switches reuse each locale download", async () => {
  await search("zh", "环境变量");
  await search("en", "RUSTFS_VOLUMES");
  await search("zh", "环境变量");
  assert.equal(requests.length, languages.length);
  assert.deepEqual(new Set(requests), new Set(languages.map((locale) => `/api/search/${locale}.json`)));
});

test("a failed download can be retried without reloading the page", async () => {
  const before = requests.length;
  failNextRequest = true;
  await assert.rejects(async () => localSearchClient({ baseUrl: endpoint, locale: "zh", attempt: 1 }).search("环境变量"));
  const client = localSearchClient({ baseUrl: endpoint, locale: "zh", attempt: 2 });
  const result = await client.search("环境变量");
  assert.ok(result.some((item) => item.url === "/zh/reference/environment-variables"));
  await client.search("RUSTFS_VOLUMES");
  assert.deepEqual(requests.slice(before), ["/api/search/zh.json?retry=1", "/api/search/zh.json?retry=2"]);
  assert.deepEqual(client.deps, ["zh", 2]);
});
