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

const content = await readFile("dist/public/algolia-index.json", "utf8");
const documents = JSON.parse(content);
const client = algoliasearch(appId, adminApiKey);

await sync(client, { indexName, documents });
console.log(`Algolia sync: wrote ${documents.length} documents to ${indexName}`);
