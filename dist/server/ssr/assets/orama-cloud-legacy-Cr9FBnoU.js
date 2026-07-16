import { t as createContentHighlighter } from "./search-D0uXjHTg.js";
import { t as removeUndefined } from "./remove-undefined-CzMSKybq-wawLFuP2.js";
//#region node_modules/fumadocs-core/dist/search/client/orama-cloud-legacy.js
function oramaCloudLegacyClient(options) {
	const { index = "default", client, params: extraParams = {}, tag } = options;
	return {
		deps: [
			index,
			client,
			tag
		],
		async search(query) {
			const highlighter = createContentHighlighter(query);
			const list = [];
			if (index === "crawler") {
				const result = await client.search({
					...extraParams,
					term: query,
					where: {
						category: tag ? { eq: tag.slice(0, 1).toUpperCase() + tag.slice(1) } : void 0,
						...extraParams.where
					},
					limit: 10
				});
				if (!result) return list;
				for (const hit of result.hits) {
					const doc = hit.document;
					list.push({
						id: hit.id,
						type: "page",
						content: highlighter.highlightMarkdown(doc.title),
						url: doc.path
					}, {
						id: "page" + hit.id,
						type: "text",
						content: highlighter.highlightMarkdown(doc.content),
						url: doc.path
					});
				}
				return list;
			}
			const params = {
				...extraParams,
				term: query,
				where: removeUndefined({
					tag,
					...extraParams.where
				}),
				groupBy: {
					properties: ["page_id"],
					maxResult: 7,
					...extraParams.groupBy
				}
			};
			const result = await client.search(params);
			if (!result || !result.groups) return list;
			for (const item of result.groups) {
				let addedHead = false;
				for (const hit of item.result) {
					const doc = hit.document;
					if (!addedHead) {
						list.push({
							id: doc.page_id,
							type: "page",
							content: highlighter.highlightMarkdown(doc.title),
							breadcrumbs: doc.breadcrumbs,
							url: doc.url
						});
						addedHead = true;
					}
					list.push({
						id: doc.id,
						content: highlighter.highlightMarkdown(doc.content),
						type: doc.content === doc.section ? "heading" : "text",
						url: doc.section_id ? `${doc.url}#${doc.section_id}` : doc.url
					});
				}
			}
			return list;
		}
	};
}
//#endregion
export { oramaCloudLegacyClient };
