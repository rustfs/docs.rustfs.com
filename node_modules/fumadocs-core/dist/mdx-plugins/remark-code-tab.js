import { generateCodeBlockTabs, parseCodeBlockAttributes } from "./codeblock-utils.js";
import { visit } from "unist-util-visit";
//#region src/mdx-plugins/remark-code-tab.ts
const Types = {
	CodeBlockTabs(processor, nodes, withMdx, withParent) {
		const tabs = processTabValue(nodes);
		let isFirstTab = true;
		const options = {
			triggers: [],
			tabs: []
		};
		for (const [value, list] of tabs) {
			if (isFirstTab) {
				const tagGroup = list[0].data?.tabGroup;
				options.defaultValue = value;
				if (tagGroup) options.persist = { id: tagGroup };
				isFirstTab = false;
			}
			options.triggers.push({
				value,
				children: withMdx ? mdxToAst(processor, value).children : [{
					type: "text",
					value
				}]
			});
			options.tabs.push({
				value,
				children: list
			});
		}
		const node = generateCodeBlockTabs(options);
		if (!withParent) return node.children;
		return [node];
	},
	Tabs(processor, nodes, withMdx, withParent) {
		const tabs = Array.from(processTabValue(nodes).entries());
		if (!withMdx) {
			const children = tabs.map(([name, codes]) => {
				return {
					type: "mdxJsxFlowElement",
					name: "Tab",
					attributes: [{
						type: "mdxJsxAttribute",
						name: "value",
						value: name
					}],
					children: codes
				};
			});
			if (!withParent) return children;
			return [{
				type: "mdxJsxFlowElement",
				name: "Tabs",
				attributes: [{
					type: "mdxJsxAttribute",
					name: "items",
					value: {
						type: "mdxJsxAttributeValueExpression",
						value: tabs.map(([name]) => name).join(", "),
						data: { estree: {
							type: "Program",
							sourceType: "module",
							comments: [],
							body: [{
								type: "ExpressionStatement",
								expression: {
									type: "ArrayExpression",
									elements: tabs.map(([name]) => ({
										type: "Literal",
										value: name
									}))
								}
							}]
						} }
					}
				}],
				children
			}];
		}
		const children = [{
			type: "mdxJsxFlowElement",
			name: "TabsList",
			attributes: [],
			children: tabs.map(([name]) => ({
				type: "mdxJsxFlowElement",
				name: "TabsTrigger",
				attributes: [{
					type: "mdxJsxAttribute",
					name: "value",
					value: name
				}],
				children: [mdxToAst(processor, name)]
			}))
		}, ...tabs.map(([name, codes]) => ({
			type: "mdxJsxFlowElement",
			name: "TabsContent",
			attributes: [{
				type: "mdxJsxAttribute",
				name: "value",
				value: name
			}],
			children: codes
		}))];
		if (!withParent) return children;
		return [{
			type: "mdxJsxFlowElement",
			name: "Tabs",
			attributes: [{
				type: "mdxJsxAttribute",
				name: "defaultValue",
				value: tabs[0][0]
			}],
			children
		}];
	}
};
function remarkCodeTab(options = {}) {
	const { parseMdx = false, Tabs = "CodeBlockTabs" } = options;
	return (tree) => {
		visit(tree, (node) => {
			if (!("children" in node) || node.data?._code_tab_visited) return "skip";
			let localTabs = Tabs;
			let localParseMdx = parseMdx;
			let withParent = true;
			if (node.type === "mdxJsxFlowElement" && node.name && node.name in Types) {
				withParent = false;
				localTabs = node.name;
				if (node.name === "Tabs" && localParseMdx) localParseMdx = node.attributes.every((attribute) => attribute.type !== "mdxJsxAttribute" || attribute.name !== "items");
			}
			let start = -1;
			let end = 0;
			const close = () => {
				if (start === -1 || start === end) return;
				const replacement = Types[localTabs](this, node.children.slice(start, end), localParseMdx, withParent);
				for (const element of replacement) {
					element.data ??= {};
					element.data._code_tab_visited = true;
				}
				node.children.splice(start, end - start, ...replacement);
				end = start;
				start = -1;
			};
			for (; end < node.children.length; end++) {
				const child = node.children[end];
				if (child.type !== "code" || !child.meta) {
					close();
					continue;
				}
				const meta = parseCodeBlockAttributes(child.meta, ["tab", "tab-group"]);
				if (typeof meta.attributes.tab !== "string") {
					close();
					continue;
				}
				if (start === -1) start = end;
				child.meta = meta.rest;
				child.data ??= {};
				child.data.tab = meta.attributes.tab;
				if (typeof meta.attributes["tab-group"] === "string") child.data.tabGroup = meta.attributes["tab-group"];
			}
			close();
		});
	};
}
function processTabValue(nodes) {
	const out = /* @__PURE__ */ new Map();
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		const name = node.data?.tab ?? `Tab ${i + 1}`;
		let li = out.get(name);
		if (!li) {
			li = [];
			out.set(name, li);
		}
		li.push(node);
	}
	return out;
}
/**
* MDX tab name to tab trigger node children
*/
function mdxToAst(processor, name) {
	const node = processor.parse(name);
	node.children = node.children.flatMap((child) => {
		if (child.type === "paragraph") return child.children;
		return child;
	});
	return node;
}
//#endregion
export { remarkCodeTab };
