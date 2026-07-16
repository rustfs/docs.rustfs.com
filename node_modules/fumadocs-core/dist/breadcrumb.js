import { n as normalizeUrl } from "./url-CWbf4MFh.js";
import { r as findPath } from "./utils-Dn9VIXRN.js";
import { useMemo } from "react";
//#region src/breadcrumb.tsx
function useBreadcrumb(url, tree, options) {
	return useMemo(() => getBreadcrumbItems(url, tree, options), [
		tree,
		url,
		options
	]);
}
function getBreadcrumbItems(url, tree, options = {}) {
	return getBreadcrumbItemsFromPath(tree, searchPath(tree.children, url) ?? [], options);
}
function getBreadcrumbItemsFromPath(tree, path, options) {
	const { includePage = false, includeSeparator = false, includeRoot = false } = options;
	let items = [];
	for (let i = 0; i < path.length; i++) {
		const item = path[i];
		switch (item.type) {
			case "page":
				if (includePage) items.push({
					name: item.name,
					url: item.url
				});
				break;
			case "folder":
				if (item.root) {
					items = [];
					if (includeRoot) items.push({
						name: tree.name,
						url: typeof includeRoot === "object" ? includeRoot.url : item.index?.url
					});
					break;
				}
				if (i === path.length - 1 || item.index !== path[i + 1]) items.push({
					name: item.name,
					url: item.index?.url
				});
				break;
			case "separator":
				if (item.name && includeSeparator) items.push({ name: item.name });
				break;
		}
	}
	return items;
}
/**
* Search the path of a node in the tree by a specified url
*
* - When the page doesn't exist, return null
*
* @returns The path to the target node from root
* @internal Don't use this on your own
*/
function searchPath(nodes, url) {
	const normalizedUrl = normalizeUrl(url);
	return findPath(nodes, (node) => node.type === "page" && node.url === normalizedUrl);
}
//#endregion
export { getBreadcrumbItems, getBreadcrumbItemsFromPath, searchPath, useBreadcrumb };
