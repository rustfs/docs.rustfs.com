import { getLayoutTabs } from "../shared/index.js";
import { LayoutBody, useDocsLayout } from "./client.js";
import { jsx } from "react/jsx-runtime";
import { useMemo } from "react";
//#region src/layouts/docs/index.tsx
function DocsLayout({ tree, sidebar: { tabs: _tabs, tabMode: _tabMode, ...sidebarProps } = {}, tabs: layoutTabs = _tabs, tabMode = _tabMode, children, ...props }) {
	return /* @__PURE__ */ jsx(LayoutBody, {
		tree,
		tabs: useMemo(() => {
			if (Array.isArray(layoutTabs)) return layoutTabs;
			if (typeof layoutTabs === "object") return getLayoutTabs(tree, layoutTabs);
			if (layoutTabs !== false) return getLayoutTabs(tree);
			return [];
		}, [tree, layoutTabs]),
		tabMode,
		sidebar: sidebarProps,
		...props,
		children
	});
}
//#endregion
export { DocsLayout, useDocsLayout };
