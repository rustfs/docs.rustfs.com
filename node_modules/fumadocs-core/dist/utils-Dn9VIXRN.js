//#region src/page-tree/utils.ts
/**
* Flatten tree to an array of page nodes
*/
function flattenTree(nodes) {
	const out = [];
	for (const node of nodes) if (node.type === "folder") {
		if (node.index) out.push(node.index);
		out.push(...flattenTree(node.children));
	} else if (node.type === "page") out.push(node);
	return out;
}
/**
* Get neighbours of a page, useful for implementing "previous & next" buttons
*/
function findNeighbour(tree, url, options) {
	const { separateRoot = true } = options ?? {};
	const roots = separateRoot ? getPageTreeRoots(tree) : [tree];
	if (tree.fallback) roots.push(tree.fallback);
	for (const root of roots) {
		const list = flattenTree(root.children);
		const idx = list.findIndex((item) => item.url === url);
		if (idx === -1) continue;
		return {
			previous: list[idx - 1],
			next: list[idx + 1]
		};
	}
	return {};
}
function getPageTreeRoots(pageTree) {
	const result = pageTree.children.flatMap((child) => {
		if (child.type !== "folder") return [];
		const roots = getPageTreeRoots(child);
		if (child.root) roots.push(child);
		return roots;
	});
	if (!pageTree.type || pageTree.type === "root") result.push(pageTree);
	return result;
}
/**
* Get other **page** nodes that lives under the same parent.
*
* note: folders & its index nodes are not considered, use `findSiblings()` for more control.
*/
function getPageTreePeers(treeOrTrees, url) {
	return findSiblings(treeOrTrees, url).filter((item) => item.type === "page");
}
/**
* Get other tree nodes that lives under the same parent.
*/
function findSiblings(treeOrTrees, url) {
	if ("children" in treeOrTrees) {
		const parent = findParent(treeOrTrees, url);
		if (!parent) return [];
		return parent.children.filter((item) => item.type !== "page" || item.url !== url);
	}
	for (const lang in treeOrTrees) {
		const result = findSiblings(treeOrTrees[lang], url);
		if (result.length > 0) return result;
	}
	return [];
}
function findParent(from, url) {
	let result;
	visit(from, (node, parent) => {
		if (node.type === "page" && node.url === url) {
			result = parent;
			return "break";
		}
	});
	return result;
}
/**
* Search the path of a node in the tree matched by the matcher.
*
* @returns The path to the target node (from starting root), or null if the page doesn't exist
*/
function findPath(nodes, matcher, options = {}) {
	const { includeSeparator = true } = options;
	function run(nodes) {
		let separator;
		for (const node of nodes) {
			if (matcher(node)) {
				const items = [];
				if (separator) items.push(separator);
				items.push(node);
				return items;
			}
			if (node.type === "separator" && includeSeparator) {
				separator = node;
				continue;
			}
			if (node.type === "folder") {
				const items = node.index && matcher(node.index) ? [node.index] : run(node.children);
				if (items) {
					items.unshift(node);
					if (separator) items.unshift(separator);
					return items;
				}
			}
		}
	}
	return run(nodes) ?? null;
}
const VisitBreak = Symbol("VisitBreak");
/**
* Perform a depth-first search on page tree visiting every node.
*
* @param root - the root of page tree to visit.
* @param visitor - function to receive nodes, return `skip` to skip the children of current node, `break` to stop the search entirely.
*/
function visit(root, visitor) {
	function onNode(node, parent) {
		const result = visitor(node, parent);
		switch (result) {
			case "skip": return node;
			case "break": throw VisitBreak;
			default: if (result) node = result;
		}
		if ("index" in node && node.index) node.index = onNode(node.index, node);
		if ("fallback" in node && node.fallback) node.fallback = onNode(node.fallback, node);
		if ("children" in node) for (let i = 0; i < node.children.length; i++) node.children[i] = onNode(node.children[i], node);
		return node;
	}
	try {
		return onNode(root);
	} catch (e) {
		if (e === VisitBreak) return root;
		throw e;
	}
}
//#endregion
export { flattenTree as a, visit as c, findSiblings as i, findParent as n, getPageTreePeers as o, findPath as r, getPageTreeRoots as s, findNeighbour as t };
