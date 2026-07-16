import { c as visit } from "../../utils-Dn9VIXRN.js";
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/source/client/index.tsx
function deserializePageTree(serialized) {
	const root = serialized.data;
	visit(root, (item) => {
		if ("icon" in item && typeof item.icon === "string") item.icon = /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: { __html: item.icon } });
		if (typeof item.name === "string") item.name = /* @__PURE__ */ jsx("span", {
			className: "fd-page-tree-item-name",
			dangerouslySetInnerHTML: { __html: item.name }
		});
	});
	return root;
}
/**
* Deserialize loader data that is serialized by the server-side Fumadocs `loader()`, supported:
* - Page Tree
*
* other unrelated properties are kept in the output.
*/
function useFumadocsLoader(serialized) {
	return useMemo(() => {
		const out = {};
		for (const k in serialized) {
			const v = serialized[k];
			if (isSerializedPageTree(v)) out[k] = deserializePageTree(v);
			else out[k] = v;
		}
		return out;
	}, [serialized]);
}
function isSerializedPageTree(v) {
	return typeof v === "object" && v !== null && "$fumadocs_loader" in v && v.$fumadocs_loader === "page-tree";
}
//#endregion
export { deserializePageTree, useFumadocsLoader };
