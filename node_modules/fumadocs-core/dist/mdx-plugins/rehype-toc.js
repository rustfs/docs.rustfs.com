import { a as toMdxExportRaw, r as handleTag } from "../utils-Yx0IL9eW.js";
import { visit } from "unist-util-visit";
import { toEstree } from "hast-util-to-estree";
//#region src/mdx-plugins/rehype-toc.ts
const TocOnlyTag = "[toc]";
const NoTocTag = "[!toc]";
const HeadingTags = /* @__PURE__ */ new Set([
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6"
]);
function rehypeToc({ exportToc = true } = {}) {
	if (exportToc === true) exportToc = {
		as: "esm",
		name: "toc"
	};
	if (exportToc === false) return () => void 0;
	return (tree, file) => {
		const items = [];
		visit(tree, "element", (element, idx, parent) => {
			if (!HeadingTags.has(element.tagName) || element.children.length === 0) return;
			const id = element.properties.id;
			if (typeof id !== "string") return "skip";
			let isTocOnly = false;
			const last = element.children[element.children.length - 1];
			if (last.type === "text") {
				const noToc = handleTag(last.value, NoTocTag);
				if (noToc !== false) {
					last.value = noToc;
					return "skip";
				}
				const tocOnly = handleTag(last.value, TocOnlyTag);
				if (tocOnly !== false) {
					isTocOnly = true;
					last.value = tocOnly;
				}
			}
			items.push({
				title: element,
				depth: Number(element.tagName[1]),
				url: `#${id}`,
				_step: typeof element.properties["data-fd-step"] === "number" ? element.properties["data-fd-step"] : void 0
			});
			if (isTocOnly && parent && typeof idx === "number") parent.children.splice(idx, 1);
			return "skip";
		});
		if (exportToc.as === "esm") {
			const esmItems = [];
			for (const item of items) {
				const root = toEstree(item.title, {
					elementAttributeNameCase: "react",
					stylePropertyNameCase: "dom"
				}).body[0];
				if (root.type === "ExpressionStatement" && root.expression.type === "JSXElement") esmItems.push({
					...item,
					title: root.expression
				});
			}
			tree.children.push(toMdxExportRaw(exportToc.name, {
				type: "ArrayExpression",
				elements: esmItems.map((item) => {
					const obj = {
						type: "ObjectExpression",
						properties: [
							{
								type: "Property",
								method: false,
								shorthand: false,
								computed: false,
								key: {
									type: "Identifier",
									name: "depth"
								},
								value: {
									type: "Literal",
									value: item.depth
								},
								kind: "init"
							},
							{
								type: "Property",
								method: false,
								shorthand: false,
								computed: false,
								key: {
									type: "Identifier",
									name: "url"
								},
								value: {
									type: "Literal",
									value: item.url
								},
								kind: "init"
							},
							{
								type: "Property",
								method: false,
								shorthand: false,
								computed: false,
								key: {
									type: "Identifier",
									name: "title"
								},
								value: {
									type: "JSXFragment",
									openingFragment: { type: "JSXOpeningFragment" },
									closingFragment: { type: "JSXClosingFragment" },
									children: item.title.children
								},
								kind: "init"
							}
						]
					};
					if (typeof item._step === "number") obj.properties.push({
						type: "Property",
						method: false,
						shorthand: false,
						computed: false,
						key: {
							type: "Identifier",
							name: "_step"
						},
						value: {
							type: "Literal",
							value: item._step
						},
						kind: "init"
					});
					return obj;
				})
			}));
		} else file.data.rehypeToc = items;
	};
}
//#endregion
export { rehypeToc };
