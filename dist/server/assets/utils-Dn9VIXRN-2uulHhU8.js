//#region node_modules/fumadocs-core/dist/path-B9zu5SjE.js
function basename(path, ext) {
	const idx = path.lastIndexOf("/");
	return path.substring(idx === -1 ? 0 : idx + 1, ext ? path.length - ext.length : path.length);
}
function extname(path) {
	for (let i = path.length - 1; i >= 0; i--) {
		const c = path[i];
		if (c === ".") return path.substring(i);
		if (c === "/") return "";
	}
	return "";
}
function dirname(path) {
	const idx = path.lastIndexOf("/");
	if (idx === -1) return "";
	return path.substring(0, idx);
}
/**
* Resolve paths, slashes within the path will be ignored
* @param paths - Paths to join
* @example
* ```
* ['a','b'] // 'a/b'
* ['/a'] // 'a'
* ['a', '/b'] // 'a/b'
* ['a', '../b/c'] // 'b/c'
* ```
*/
function joinPath(...paths) {
	const out = [];
	for (const path of paths) for (const seg of path.split("/")) switch (seg) {
		case "..":
			out.pop();
			break;
		case "":
		case ".": break;
		default: out.push(seg);
	}
	return out.join("/");
}
/**
* Convert (relative) file path to virtual file path.
*
* @param path - Relative path
* @returns Normalized path, with no trailing/leading slashes
* @throws Throws error if path starts with `./` or `../`
*/
function normalize(path) {
	const segments = path.split(/\/|\\/).filter((v) => v.length > 0);
	if (segments[0] === "." || segments[0] === "..") throw new Error("It must not start with './' or '../'");
	return segments.join("/");
}
//#endregion
//#region node_modules/fumadocs-core/dist/utils-Dn9VIXRN.js
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
var VisitBreak = Symbol("VisitBreak");
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
export { extname as a, dirname as i, visit as n, joinPath as o, basename as r, normalize as s, findPath as t };
