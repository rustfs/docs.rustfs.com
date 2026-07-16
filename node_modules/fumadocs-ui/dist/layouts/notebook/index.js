import { getLayoutTabs } from "../shared/index.js";
import { LayoutBody, useNotebookLayout } from "./client.js";
import { jsx } from "react/jsx-runtime";
import { useMemo } from "react";
//#region src/layouts/notebook/index.tsx
function DocsLayout({ tree, tabMode = "sidebar", sidebar: { tabs: defaultTabs, ...sidebarProps } = {}, children, tabs = defaultTabs, ...props }) {
	return /* @__PURE__ */ jsx(LayoutBody, {
		tree,
		tabs: useMemo(() => {
			if (Array.isArray(tabs)) return tabs;
			if (typeof tabs === "object") return getLayoutTabs(tree, tabs);
			if (tabs !== false) return getLayoutTabs(tree);
			return [];
		}, [tabs, tree]),
		tabMode,
		sidebar: sidebarProps,
		...props,
		children
	});
}
//#endregion
export { DocsLayout, useNotebookLayout };
