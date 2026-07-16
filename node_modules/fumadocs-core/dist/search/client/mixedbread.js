import { r as __toESM } from "../../rolldown-runtime-B-1-B7_t.js";
import { t as require_remove_markdown } from "../../remove-markdown-BoY2F4bc.js";
import Slugger from "github-slugger";
//#region src/search/client/mixedbread.ts
var import_remove_markdown = /* @__PURE__ */ __toESM(require_remove_markdown(), 1);
const slugger = new Slugger();
function extractHeadingTitle(text) {
	const trimmedText = text.trim();
	if (!trimmedText.startsWith("#")) return "";
	const firstLine = trimmedText.split("\n")[0]?.trim();
	if (firstLine) return (0, import_remove_markdown.default)(firstLine, { useImgAltText: false });
	return "";
}
/**
* @deprecated Use `createMixedbreadSearchAPI` from `fumadocs-core/search/mixedbread` instead.
* This client-side approach exposes your API key in the browser.
* The server-side approach keeps the key secure and uses `client: fetchClient(...)` on the client.
*/
function mixedbreadClient(options) {
	const { client, storeIdentifier, tag } = options;
	return {
		deps: [
			client,
			storeIdentifier,
			tag
		],
		async search(query) {
			if (!query.trim()) return [];
			return (await client.stores.search({
				query,
				store_identifiers: [storeIdentifier],
				top_k: 10,
				filters: {
					key: "generated_metadata.tag",
					operator: "eq",
					value: tag
				},
				search_options: { return_metadata: true }
			})).data.flatMap((item) => {
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
	};
}
//#endregion
export { mixedbreadClient };
