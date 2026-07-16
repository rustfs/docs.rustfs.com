import { visit } from "unist-util-visit";
//#region src/mdx-plugins/remark-directive-admonition.ts
/**
* Remark Plugin to support Admonition syntax in Docusaurus, useful for migrating from Docusaurus.
*
* Requires [`remark-directive`](https://github.com/remarkjs/remark-directive) to be configured.
*/
function remarkDirectiveAdmonition({ tags: { CalloutContainer = "CalloutContainer", CalloutTitle = "CalloutTitle", CalloutDescription = "CalloutDescription" } = {}, types = {
	note: "info",
	tip: "info",
	info: "info",
	warn: "warning",
	warning: "warning",
	danger: "error",
	success: "success"
} } = {}) {
	return (tree) => {
		visit(tree, "containerDirective", (node) => {
			if (!(node.name in types)) return;
			const attributes = [{
				type: "mdxJsxAttribute",
				name: "type",
				value: types[node.name]
			}];
			for (const [k, v] of Object.entries(node.attributes ?? {})) attributes.push({
				type: "mdxJsxAttribute",
				name: k,
				value: v
			});
			const titleNodes = [];
			const descriptionNodes = [];
			for (const item of node.children) if (item.type === "paragraph" && item.data?.directiveLabel) titleNodes.push(...item.children);
			else descriptionNodes.push(item);
			const children = [];
			if (titleNodes.length > 0) children.push({
				type: "mdxJsxFlowElement",
				name: CalloutTitle,
				attributes: [],
				children: titleNodes
			});
			if (descriptionNodes.length > 0) children.push({
				type: "mdxJsxFlowElement",
				name: CalloutDescription,
				attributes: [],
				children: descriptionNodes
			});
			Object.assign(node, {
				type: "mdxJsxFlowElement",
				attributes,
				name: CalloutContainer,
				children
			});
		});
	};
}
//#endregion
export { remarkDirectiveAdmonition };
