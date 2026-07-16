import { valueToEstree } from "estree-util-value-to-estree";
//#region src/mdx-plugins/utils.ts
function flattenNode(node) {
	if ("children" in node) return node.children.map(flattenNode).join("");
	if ("value" in node && typeof node.value === "string") return node.value;
	return "";
}
function flattenNodeHast(node) {
	if ("children" in node) return node.children.map(flattenNodeHast).join("");
	return "value" in node && typeof node.value === "string" ? node.value : "";
}
function toMdxExport(name, value) {
	return toMdxExportRaw(name, valueToEstree(value));
}
function toMdxExportRaw(name, expression) {
	return {
		type: "mdxjsEsm",
		value: "",
		data: { estree: {
			type: "Program",
			sourceType: "module",
			body: [{
				type: "ExportNamedDeclaration",
				attributes: [],
				specifiers: [],
				declaration: {
					type: "VariableDeclaration",
					kind: "let",
					declarations: [{
						type: "VariableDeclarator",
						id: {
							type: "Identifier",
							name
						},
						init: expression
					}]
				}
			}]
		} }
	};
}
function handleTag(value, tag) {
	const idx = value.indexOf(tag);
	if (idx !== -1) return value.slice(0, idx).trimEnd() + value.slice(idx + tag.length);
	return false;
}
//#endregion
export { toMdxExportRaw as a, toMdxExport as i, flattenNodeHast as n, handleTag as r, flattenNode as t };
