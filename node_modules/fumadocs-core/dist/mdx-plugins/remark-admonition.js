import { t as flattenNode } from "../utils-Yx0IL9eW.js";
import { visit } from "unist-util-visit";
//#region src/mdx-plugins/remark-admonition.ts
/**
* Remark Plugin to support Admonition syntax
*
* Useful when Migrating from Docusaurus
*
* @deprecated Use `remarkDirectiveAdmonition` with `remark-directive` configured instead.
*/
function remarkAdmonition(options = {}) {
	const tag = options.tag ?? ":::";
	const typeMap = options.typeMap ?? {
		info: "info",
		warn: "warn",
		note: "info",
		tip: "info",
		warning: "warn",
		danger: "error"
	};
	function replaceNodes(nodes) {
		if (nodes.length === 0) return;
		let open = -1;
		let attributes = [];
		let hasIntercept = false;
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].type !== "paragraph") continue;
			const text = flattenNode(nodes[i]);
			const typeName = Object.keys(typeMap).find((type) => text.startsWith(`${tag}${type}`));
			if (typeName) {
				if (open !== -1) {
					hasIntercept = true;
					continue;
				}
				open = i;
				attributes.push({
					type: "mdxJsxAttribute",
					name: "type",
					value: typeMap[typeName]
				});
				const meta = text.slice(`${tag}${typeName}`.length);
				if (meta.startsWith("[") && meta.endsWith("]")) attributes.push({
					type: "mdxJsxAttribute",
					name: "title",
					value: meta.slice(1, -1)
				});
			}
			if (open !== -1 && text === tag) {
				const children = nodes.slice(open + 1, i);
				nodes.splice(open, i - open + 1, {
					type: "mdxJsxFlowElement",
					name: "Callout",
					attributes,
					children: hasIntercept ? replaceNodes(children) : children
				});
				open = -1;
				hasIntercept = false;
				attributes = [];
				i = open;
			}
		}
	}
	return (tree) => {
		visit(tree, (node) => {
			if (!("children" in node)) return;
			replaceNodes(node.children);
		});
	};
}
//#endregion
export { remarkAdmonition };
