import { visit } from "unist-util-visit";
//#region src/mdx-plugins/remark-mdx-mermaid.ts
function toMDX(code) {
	return {
		type: "mdxJsxFlowElement",
		name: "Mermaid",
		attributes: [{
			type: "mdxJsxAttribute",
			name: "chart",
			value: code.trim()
		}],
		children: []
	};
}
/**
* Convert `mermaid` codeblocks into `<Mermaid />` MDX component
*/
function remarkMdxMermaid(options = {}) {
	const { lang = "mermaid" } = options;
	return (tree) => {
		visit(tree, "code", (node, idx, parent) => {
			if (node.lang !== lang || !node.value || typeof idx !== "number" || !parent) return;
			parent.children[idx] = toMDX(node.value);
		});
	};
}
//#endregion
export { remarkMdxMermaid };
