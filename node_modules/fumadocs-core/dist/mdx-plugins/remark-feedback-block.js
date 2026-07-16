import { t as flattenNode } from "../utils-Yx0IL9eW.js";
import { visit } from "unist-util-visit";
import { createHash } from "node:crypto";
//#region src/mdx-plugins/remark-feedback-block.ts
/**
* Generate MDX `<FeedbackBlock />` elements with an unique `id` for every block-like element.
*
* Note: the uniqueness is only guaranteed per MDX file/page.
*/
function remarkFeedbackBlock({ generateHash = ({ body }) => createHash("md5").update(body).digest("hex").substring(0, 16), tagName = "FeedbackBlock", resolve = (node) => {
	switch (node.type) {
		case "mdxJsxFlowElement": return "skip";
		case "paragraph":
		case "image":
		case "listItem": return true;
		default: return false;
	}
}, generateBody = true } = {}) {
	return (tree) => {
		const counts = /* @__PURE__ */ new Map();
		visit(tree, (node, index, parent) => {
			if (node.type === "root" || !parent || typeof index !== "number") return;
			const resolved = resolve(node);
			if (resolved === false) return;
			if (resolved === "skip") return "skip";
			const text = flattenNode(node).trim();
			if (text.length === 0) return;
			let id = generateHash({ body: text });
			const count = counts.get(id) ?? 0;
			if (count > 0) id = `${id}-${count}`;
			counts.set(id, count + 1);
			const wrapper = {
				type: "mdxJsxFlowElement",
				name: tagName,
				attributes: [{
					type: "mdxJsxAttribute",
					name: "id",
					value: id
				}],
				data: { _stringify: "children-only" },
				children: [node]
			};
			if (generateBody) wrapper.attributes.push({
				type: "mdxJsxAttribute",
				name: "body",
				value: text
			});
			parent.children[index] = wrapper;
			return "skip";
		});
	};
}
//#endregion
export { remarkFeedbackBlock };
