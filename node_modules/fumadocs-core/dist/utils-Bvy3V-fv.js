import { createContentHighlighter } from "./search/index.js";
import Search from "flexsearch";
//#region src/search/flexsearch/utils.ts
async function search(index, query, tag, limit = 60) {
	const arr = await index.searchAsync(query, {
		index: "content",
		limit,
		tag: tag ? { tags: tag } : void 0
	});
	const out = [];
	if (arr.length === 0) return out;
	const results = arr[0].result;
	const highlighter = createContentHighlighter(query);
	const grouped = /* @__PURE__ */ new Map();
	for (const id of results) {
		const doc = index.get(id);
		if (!doc) continue;
		let list = grouped.get(doc.page_id);
		if (!list) {
			list = [];
			grouped.set(doc.page_id, list);
		}
		if (doc.type !== "page") list.push(doc);
	}
	for (const [page_id, items] of grouped) {
		const page = index.get(page_id);
		if (!page) continue;
		out.push({
			id: page_id,
			type: "page",
			content: highlighter.highlightMarkdown(page.content),
			breadcrumbs: page.breadcrumbs,
			url: page.url
		});
		for (const item of items) out.push({
			id: item.id,
			content: highlighter.highlightMarkdown(item.content),
			breadcrumbs: item.breadcrumbs,
			type: item.type,
			url: item.url
		});
	}
	return out;
}
function createDocument(options) {
	return new Search.Document({
		tokenize: "full",
		...options,
		document: {
			id: "id",
			index: ["content"],
			tag: ["tags"],
			store: true,
			...options?.document
		}
	});
}
//#endregion
export { search as n, createDocument as t };
