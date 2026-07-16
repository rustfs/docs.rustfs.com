//#region src/mdx-plugins/codeblock-utils.ts
function generateCodeBlockTabs({ persist = false, defaultValue, triggers, tabs, ...options }) {
	const attributes = [];
	if (options.attributes) attributes.push(...options.attributes);
	if (defaultValue) attributes.push({
		type: "mdxJsxAttribute",
		name: "defaultValue",
		value: defaultValue
	});
	if (typeof persist === "object") attributes.push({
		type: "mdxJsxAttribute",
		name: "groupId",
		value: persist.id
	}, {
		type: "mdxJsxAttribute",
		name: "persist",
		value: null
	});
	const children = [{
		type: "mdxJsxFlowElement",
		name: "CodeBlockTabsList",
		attributes: [],
		children: triggers.map((trigger) => ({
			type: "mdxJsxFlowElement",
			attributes: [{
				type: "mdxJsxAttribute",
				name: "value",
				value: trigger.value
			}],
			name: "CodeBlockTabsTrigger",
			children: trigger.children
		}))
	}];
	for (const tab of tabs) children.push({
		type: "mdxJsxFlowElement",
		name: "CodeBlockTab",
		attributes: [{
			type: "mdxJsxAttribute",
			name: "value",
			value: tab.value
		}],
		children: tab.children
	});
	return {
		type: "mdxJsxFlowElement",
		name: "CodeBlockTabs",
		attributes,
		children
	};
}
const AttributeRegex = /(?<=^|\s)(?<name>[a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|(\d+)))?/g;
/**
* Parse Fumadocs-style code block attributes from meta string, like `title="hello world"`
*/
function parseCodeBlockAttributes(meta, allowedNames) {
	const attributes = {};
	return {
		rest: meta.replaceAll(AttributeRegex, (match, name, value_1, value_2, value_3) => {
			if (allowedNames && !allowedNames.includes(name)) return match;
			if (typeof value_3 === "string") attributes[name] = Number(value_3);
			else attributes[name] = value_1 ?? value_2 ?? null;
			return "";
		}),
		attributes
	};
}
//#endregion
export { generateCodeBlockTabs, parseCodeBlockAttributes };
