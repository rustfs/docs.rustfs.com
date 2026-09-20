import { readFile } from "node:fs/promises";
import { algoliasearch } from "algoliasearch";
import { sync } from "fumadocs-core/search/algolia";

const appId = "L2SE8QG99N";
const indexName = "docs_rustfs_com_l2se8qg99n_articles";
const adminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;

if (!adminApiKey) {
  console.log("Algolia sync skipped: ALGOLIA_ADMIN_API_KEY is not configured");
  process.exit(0);
}

// Preview builds (pull requests) re-index the whole site on every push and
// burn through the Algolia operation quota; only sync production deploys.
const branch = process.env.CF_PAGES_BRANCH;
if (branch && branch !== "main") {
  console.log(`Algolia sync skipped: preview build (branch ${branch})`);
  process.exit(0);
}

const content = await readFile("dist/public/algolia-index.json", "utf8");
const documents = JSON.parse(content);
const client = algoliasearch(appId, adminApiKey);

// A search-index hiccup must never block publishing the docs themselves.
try {
  await sync(client, { indexName, documents });
  console.log(`Algolia sync: wrote ${documents.length} documents to ${indexName}`);
} catch (error) {
  console.warn(`Algolia sync failed, deploying without re-indexing search: ${error}`);
  process.exit(0);
}
