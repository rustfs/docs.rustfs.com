"use client";
import { isLinkItemActive } from "../../layouts/shared/index.js";
import { usePathname } from "fumadocs-core/framework";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/sidebar/link-item.tsx
function createLinkItemRenderer({ SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarFolderTrigger, SidebarItem }) {
	/**
	* Render sidebar items from page tree
	*/
	return function SidebarLinkItem({ item, ...props }) {
		const active = isLinkItemActive(item, usePathname());
		if (item.type === "custom") return /* @__PURE__ */ jsx("div", {
			...props,
			children: item.children
		});
		if (item.type === "menu") return /* @__PURE__ */ jsxs(SidebarFolder, {
			...props,
			children: [item.url ? /* @__PURE__ */ jsxs(SidebarFolderLink, {
				href: item.url,
				active,
				external: item.external,
				children: [item.icon, item.text]
			}) : /* @__PURE__ */ jsxs(SidebarFolderTrigger, { children: [item.icon, item.text] }), /* @__PURE__ */ jsx(SidebarFolderContent, { children: item.items.map((child, i) => /* @__PURE__ */ jsx(SidebarLinkItem, { item: child }, i)) })]
		});
		return /* @__PURE__ */ jsx(SidebarItem, {
			href: item.url,
			icon: item.icon,
			external: item.external,
			active,
			...props,
			children: item.text
		});
	};
}
//#endregion
export { createLinkItemRenderer };
