import { i as toMdxExport } from "../utils-Yx0IL9eW.js";
import { defaultStringifier } from "./stringifier.js";
import { defaultHandlers } from "mdast-util-to-markdown";
//#region src/mdx-plugins/remark-llms.ts
/**
* generate `llms.txt` for markdown.
*/
function remarkLLMs({ as = "_markdown", headingIds = true, _data = false, mdxAsPlaceholder, ...rest } = {}) {
	const stringifier = defaultStringifier({
		...rest,
		filterElement(node) {
			switch (node.type) {
				case "mdxjsEsm": return false;
				default: return true;
			}
		},
		stringify(node, parent, state, info, ctx) {
			if (mdxAsPlaceholder) switch (node.type) {
				case "mdxJsxFlowElement":
				case "mdxJsxTextElement": if (node.name && mdxAsPlaceholder.includes(node.name)) return placeholder(node, parent, state, info);
			}
			return rest.stringify?.(node, parent, state, info, ctx);
		},
		handlers: {
			heading(node, _p, state, info) {
				const id = node.data?.hProperties?.id;
				const defaultValue = defaultHandlers.heading(node, _p, state, info);
				return headingIds && id ? `${defaultValue} [#${id}]` : defaultValue;
			},
			...rest.handlers
		}
	});
	return (node, file) => {
		const value = stringifier.call(this, node, void 0);
		node.children.unshift(toMdxExport(as, value));
		if (_data) file.data.markdown = value;
	};
}
/**
* Preserve AST data to render the MDX component at runtime, use `renderPlaceholder()` to render the placeholders.
*/
function placeholder(node, _parent, state, info) {
	const attributes = {};
	for (const attr of node.attributes) {
		if (attr.type === "mdxJsxExpressionAttribute") continue;
		attributes[attr.name] = attr.value;
	}
	return `\0${JSON.stringify({
		name: node.name,
		children: state.containerPhrasing(node, info),
		attributes
	})}\0`;
}
//#endregion
export { placeholder, remarkLLMs };
