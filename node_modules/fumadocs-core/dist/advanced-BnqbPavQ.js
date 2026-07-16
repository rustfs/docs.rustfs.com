import { createContentHighlighter } from "./search/index.js";
import { t as removeUndefined } from "./remove-undefined-CzMSKybq.js";
import { getByID, search } from "@orama/orama";
//#region src/search/orama/search/simple.ts
async function searchSimple(db, query, params = {}) {
	const highlighter = createContentHighlighter(query);
	return (await search(db, {
		term: query,
		tolerance: 1,
		...params,
		boost: {
			title: 2,
			..."boost" in params ? params.boost : void 0
		}
	})).hits.map((hit) => ({
		type: "page",
		content: highlighter.highlightMarkdown(hit.document.title),
		breadcrumbs: hit.document.breadcrumbs,
		id: hit.document.url,
		url: hit.document.url
	}));
}
//#endregion
//#region src/search/orama/search/advanced.ts
async function searchAdvanced(db, query, tag = [], { mode = "fulltext", ...override } = {}) {
	if (typeof tag === "string") tag = [tag];
	const params = {
		limit: 60,
		mode,
		...override,
		where: removeUndefined({
			tags: tag.length > 0 ? { containsAll: tag } : void 0,
			...override.where
		}),
		groupBy: {
			properties: ["page_id"],
			maxResult: 8,
			...override.groupBy
		},
		properties: mode === "fulltext" ? ["content"] : ["content", "embeddings"]
	};
	if (query.length > 0) params.term = query;
	const highlighter = createContentHighlighter(query);
	const result = await search(db, params);
	const list = [];
	for (const item of result.groups ?? []) {
		const pageId = item.values[0];
		const page = getByID(db, pageId);
		if (!page) continue;
		list.push({
			id: pageId,
			type: "page",
			content: highlighter.highlightMarkdown(page.content),
			breadcrumbs: page.breadcrumbs,
			url: page.url
		});
		for (const hit of item.result) {
			if (hit.document.type === "page") continue;
			list.push({
				id: hit.document.id.toString(),
				content: highlighter.highlightMarkdown(hit.document.content),
				breadcrumbs: hit.document.breadcrumbs,
				type: hit.document.type,
				url: hit.document.url
			});
		}
	}
	if (typeof params.limit === "number" && list.length > params.limit) return list.slice(0, params.limit);
	return list;
}
//#endregion
export { searchSimple as n, searchAdvanced as t };
