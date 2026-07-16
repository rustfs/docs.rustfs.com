import { mdxToMarkdown } from "mdast-util-mdx";
import { toMarkdown } from "mdast-util-to-markdown";
//#region src/mdx-plugins/stringifier.ts
function defaultStringifier(config = {}) {
	const { filterMdxAttributes, filterElement = (node) => {
		switch (node.type) {
			case "mdxJsxFlowElement":
			case "mdxJsxTextElement":
				switch (node.name) {
					case "File":
					case "TypeTable":
					case "Callout":
					case "Card": return true;
				}
				return "children-only";
		}
		return true;
	}, stringify, ...customExtension } = config;
	function modHandler(handler, ctx) {
		return function(node, parent, state, info) {
			let visibility = filterElement(node);
			if (visibility === false) return "";
			if (stringify) {
				const v = stringify(node, parent, state, info, ctx);
				if (v) return v;
			}
			const extraInfo = node.data?._stringify;
			if (extraInfo) if (extraInfo === "children-only") visibility = "children-only";
			else if ("text" in extraInfo) return extraInfo.text;
			else node = extraInfo.node;
			if (visibility === "children-only") {
				if (!("children" in node)) return "";
				switch (node.type) {
					case "mdxJsxTextElement":
					case "paragraph": return state.containerPhrasing(node, info);
					case "mdxJsxFlowElement": return state.containerFlow(node, info);
					default: return state.containerFlow({
						type: "root",
						children: node.children
					}, info);
				}
			}
			switch (node.type) {
				case "mdxJsxFlowElement":
				case "mdxJsxTextElement": {
					const stringifiedAttributes = [];
					for (const attr of node.attributes) {
						if (attr.type === "mdxJsxExpressionAttribute") continue;
						if (filterMdxAttributes && !filterMdxAttributes(node, attr)) continue;
						const str = typeof attr.value === "string" ? attr.value : attr.value?.value;
						if (!str) continue;
						stringifiedAttributes.push({
							type: "mdxJsxAttribute",
							name: attr.name,
							value: str
						});
					}
					return handler({
						...node,
						attributes: stringifiedAttributes
					}, parent, state, info);
				}
				default: return handler(node, parent, state, info);
			}
		};
	}
	const customToMarkdown = { handlers: { _custom(node, _, state, info) {
		const handlers = state.handlers;
		for (const k in handlers) handlers[k] = modHandler(handlers[k], node.ctx);
		return state.handle(node.root, void 0, state, info);
	} } };
	return function(root, ctx) {
		return toMarkdown({
			type: "_custom",
			root,
			ctx
		}, {
			...this?.data("settings"),
			extensions: [
				mdxToMarkdown(),
				...this?.data("toMarkdownExtensions") ?? [],
				customToMarkdown,
				customExtension
			]
		});
	};
}
//#endregion
export { defaultStringifier };
