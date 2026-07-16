import { t as flattenNode } from "../utils-Yx0IL9eW.js";
import Slugger from "github-slugger";
import { visit } from "unist-util-visit";
import { createHash } from "node:crypto";
//#region src/mdx-plugins/remark-block-id.ts
/**
* Generate ID for each block node in Markdown/MDX.
*
* Note: the uniqueness is only guaranteed per file.
*/
function remarkBlockId({ generateId, addDataAttribute = "default", shouldGenerate = (node) => {
	switch (node.type) {
		case "mdxJsxFlowElement": return "skip";
		case "paragraph":
		case "image":
		case "listItem": return true;
		default: return false;
	}
} } = {}) {
	return (tree) => {
		const slugger = new Slugger();
		visit(tree, (node) => {
			if (node.type === "root" || node.data?.hProperties?.id) return;
			const resolved = shouldGenerate(node);
			if (resolved === false) return;
			if (resolved === "skip") return "skip";
			const text = flattenNode(node).trim();
			if (text.length === 0) return;
			const id = generateId ? slugger.slug(generateId({
				node,
				text
			})) : slugger.slug(createHash("sha256").update(text).digest("base64url"));
			node.data ??= {};
			node.data.hProperties ??= {};
			node.data.hProperties.id = id;
			if (addDataAttribute) node.data.hProperties["data-block"] = addDataAttribute;
		});
	};
}
//#endregion
export { remarkBlockId };
