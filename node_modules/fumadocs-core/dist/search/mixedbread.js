import { r as __toESM } from "../rolldown-runtime-B-1-B7_t.js";
import { t as createEndpoint } from "../endpoint-MyoBU5IC.js";
import { t as require_remove_markdown } from "../remove-markdown-BoY2F4bc.js";
import Slugger from "github-slugger";
//#region src/search/mixedbread.ts
var import_remove_markdown = /* @__PURE__ */ __toESM(require_remove_markdown(), 1);
const slugger = new Slugger();
function extractHeadingTitle(text) {
	const trimmedText = text.trim();
	if (!trimmedText.startsWith("#")) return "";
	const firstLine = trimmedText.split("\n")[0]?.trim();
	if (firstLine) return (0, import_remove_markdown.default)(firstLine, { useImgAltText: false });
	return "";
}
function defaultTransform(results) {
	return results.flatMap((item) => {
		const metadata = item.generated_metadata;
		const url = metadata.url || "#";
		const title = metadata.title || "Untitled";
		const chunkResults = [{
			id: `${item.file_id}-${item.chunk_index}-page`,
			type: "page",
			content: title,
			url
		}];
		const headingTitle = item.type === "text" && item.text ? extractHeadingTitle(item.text) : "";
		if (headingTitle) {
			slugger.reset();
			chunkResults.push({
				id: `${item.file_id}-${item.chunk_index}-heading`,
				type: "heading",
				content: headingTitle,
				url: `${url}#${slugger.slug(headingTitle)}`
			});
		}
		return chunkResults;
	});
}
function createMixedbreadSearchAPI(options) {
	const { client, storeIdentifier, topK = 10, rerank, rewriteQuery, scoreThreshold, transform } = options;
	return createEndpoint({
		async search(query, searchOptions = {}) {
			if (!query.trim()) return [];
			const { tag, limit } = searchOptions;
			let filters;
			if (Array.isArray(tag) && tag.length > 0) filters = {
				key: "generated_metadata.tag",
				operator: "in",
				value: tag
			};
			else if (typeof tag === "string") filters = {
				key: "generated_metadata.tag",
				operator: "eq",
				value: tag
			};
			const results = (await client.stores.search({
				query,
				store_identifiers: [storeIdentifier],
				top_k: limit ?? topK,
				filters,
				search_options: {
					return_metadata: true,
					rerank,
					rewrite_query: rewriteQuery,
					score_threshold: scoreThreshold
				}
			})).data;
			if (transform) return transform(results, query);
			return defaultTransform(results);
		},
		async export() {
			throw new Error("Mixedbread search does not support exporting indexes. Use the Mixedbread dashboard to manage your store.");
		}
	});
}
//#endregion
export { createMixedbreadSearchAPI };
