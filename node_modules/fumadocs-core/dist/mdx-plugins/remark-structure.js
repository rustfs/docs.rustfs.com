import { i as toMdxExport } from "../utils-Yx0IL9eW.js";
import { remarkHeading } from "./remark-heading.js";
import { defaultStringifier as defaultStringifier$1 } from "./stringifier.js";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import remarkGfm from "remark-gfm";
//#region src/mdx-plugins/remark-structure.ts
const remarkStructureDefaultOptions = {
	types: [
		"heading",
		"paragraph",
		"blockquote",
		"tableCell",
		"mdxJsxFlowElement"
	],
	mdxTypes(node) {
		return !node.children || node.children.length === 0;
	},
	exportAs: false
};
/**
* Extract content into structured data.
*
* By default, the output is stored into VFile (`vfile.data.structuredData`), you can specify `exportAs` to export it.
*/
function remarkStructure({ types = remarkStructureDefaultOptions.types, mdxTypes = remarkStructureDefaultOptions.mdxTypes, stringify: stringifyOptions, allowedMdxAttributes, exportAs = remarkStructureDefaultOptions.exportAs } = {}) {
	if (Array.isArray(types)) {
		const arr = types;
		types = (node) => arr.includes(node.type);
	}
	const stringify = typeof stringifyOptions === "function" ? stringifyOptions : defaultStringifier({
		filterMdxAttributes: Array.isArray(allowedMdxAttributes) ? (_node, attribute) => attribute.type === "mdxJsxAttribute" && allowedMdxAttributes.includes(attribute.name) : allowedMdxAttributes,
		...stringifyOptions
	});
	return (tree, file) => {
		const data = {
			contents: [],
			headings: []
		};
		let lastHeading;
		if (file.data.frontmatter) {
			const openapiData = file.data.frontmatter._openapi?.structuredData;
			if (openapiData) {
				data.headings.push(...openapiData.headings);
				data.contents.push(...openapiData.contents);
			}
		}
		const stringifierCtx = { addContent(...content) {
			for (const item of content) data.contents.push({
				...item,
				heading: item.heading ?? lastHeading
			});
		} };
		visit(tree, (element) => {
			if (!types(element)) return;
			switch (element.type) {
				case "root": return;
				case "mdxJsxFlowElement":
				case "mdxJsxTextElement":
					if (!mdxTypes(element)) return;
					break;
				case "heading": {
					element.data ||= {};
					element.data.hProperties ||= {};
					const id = element.data.hProperties.id;
					if (typeof id !== "string") {
						console.warn("[remark-structure] hProperties.id is missing in heading node, it is required to generate heading data. You can add remark-heading prior to remark-structure to generate heading IDs.");
						return "skip";
					}
					const content = stringify.call(this, element, stringifierCtx).trim();
					if (content.length > 0) data.headings.push({
						id,
						content
					});
					lastHeading = id;
					return "skip";
				}
			}
			const content = stringify.call(this, element, stringifierCtx).trim();
			if (content.length > 0) data.contents.push({
				heading: lastHeading,
				content
			});
			return "skip";
		});
		file.data.structuredData = data;
		if (exportAs) tree.children.unshift(toMdxExport(typeof exportAs === "string" ? exportAs : "structuredData", data));
	};
}
/**
* Extract data from markdown/mdx content
*/
function structure(content, remarkPlugins = [], options = {}) {
	return remark().use(remarkGfm).use(remarkPlugins).use(remarkHeading).use(remarkStructure, options).processSync(content).data.structuredData;
}
function defaultStringifier(config) {
	return defaultStringifier$1({
		...config,
		handlers: {
			link(node, _, state, info) {
				return state.containerPhrasing(node, info);
			},
			heading(node, _, state, info) {
				return state.containerPhrasing(node, info);
			},
			image() {
				return "";
			},
			...config.handlers
		},
		stringify(node, parent, state, info, ctx) {
			if (node.data?.structuredData) ctx.addContent(...node.data.structuredData.contents);
			return config.stringify?.(node, parent, state, info, ctx);
		}
	});
}
//#endregion
export { defaultStringifier, remarkStructure, remarkStructureDefaultOptions, structure };
