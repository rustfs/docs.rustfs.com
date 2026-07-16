import { r as findPath } from "./utils-Dn9VIXRN.js";
import { r as extname, t as basename } from "./path-B9zu5SjE.js";
//#region src/search/server/build-index.ts
async function buildIndexDefault(page) {
	let structuredData;
	if (page.data.structuredData) structuredData = typeof page.data.structuredData === "function" ? await page.data.structuredData() : page.data.structuredData;
	else if ("load" in page.data && typeof page.data.load === "function") structuredData = (await page.data.load()).structuredData;
	if (!structuredData) throw new Error("Cannot find structured data from page, please define the page to index function.");
	return {
		title: page.data.title ?? basename(page.path, extname(page.path)),
		description: page.data.description,
		url: page.url,
		id: page.url,
		structuredData
	};
}
function isBreadcrumbItem(item) {
	return typeof item === "string" && item.length > 0;
}
function buildBreadcrumbs(source, page) {
	const pageTree = source.getPageTree(page.locale);
	const path = findPath(pageTree.children, (node) => node.type === "page" && node.url === page.url);
	if (path) {
		const breadcrumbs = [];
		path.pop();
		if (isBreadcrumbItem(pageTree.name)) breadcrumbs.push(pageTree.name);
		for (const segment of path) {
			if (!isBreadcrumbItem(segment.name)) continue;
			breadcrumbs.push(segment.name);
		}
		return breadcrumbs;
	}
}
//#endregion
//#region src/search/server/build-doc.ts
function buildDocuments(indexes) {
	const docs = [];
	for (const page of indexes) {
		const pageTag = page.tag ?? [];
		const tags = Array.isArray(pageTag) ? pageTag : [pageTag];
		const data = page.structuredData;
		let id = 0;
		docs.push({
			id: page.id,
			page_id: page.id,
			type: "page",
			content: page.title,
			breadcrumbs: page.breadcrumbs,
			tags,
			url: page.url
		});
		const nextId = () => `${page.id}-${id++}`;
		if (page.description) docs.push({
			id: nextId(),
			page_id: page.id,
			tags,
			type: "text",
			url: page.url,
			content: page.description
		});
		for (const heading of data.headings) docs.push({
			id: nextId(),
			page_id: page.id,
			type: "heading",
			tags,
			url: `${page.url}#${heading.id}`,
			content: heading.content
		});
		for (const content of data.contents) docs.push({
			id: nextId(),
			page_id: page.id,
			tags,
			type: "text",
			url: content.heading ? `${page.url}#${content.heading}` : page.url,
			content: content.content
		});
	}
	return docs;
}
//#endregion
export { buildBreadcrumbs as n, buildIndexDefault as r, buildDocuments as t };
