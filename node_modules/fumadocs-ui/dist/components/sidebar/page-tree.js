import { useTreeContext, useTreePath } from "../../contexts/tree.js";
import { isActive } from "../../utils/urls.js";
import { usePathname } from "fumadocs-core/framework";
import { jsx, jsxs } from "react/jsx-runtime";
import { Fragment as Fragment$1, createContext, use, useMemo } from "react";
//#region src/components/sidebar/page-tree.tsx
const RendererContext = createContext(null);
function createPageTreeRenderer({ SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarFolderTrigger, SidebarSeparator, SidebarItem }) {
	function renderList(nodes) {
		return nodes.map((node, i) => /* @__PURE__ */ jsx(PageTreeNode, { node }, i));
	}
	function PageTreeNode({ node }) {
		const { Separator, Item, Folder, pathname } = use(RendererContext);
		if (node.type === "separator") {
			if (Separator) return /* @__PURE__ */ jsx(Separator, { item: node });
			return /* @__PURE__ */ jsxs(SidebarSeparator, { children: [node.icon, node.name] });
		}
		if (node.type === "folder") {
			const path = useTreePath();
			if (Folder) return /* @__PURE__ */ jsx(Folder, {
				item: node,
				children: renderList(node.children)
			});
			return /* @__PURE__ */ jsxs(SidebarFolder, {
				collapsible: node.collapsible,
				active: path.includes(node),
				defaultOpen: node.defaultOpen,
				children: [node.index ? /* @__PURE__ */ jsxs(SidebarFolderLink, {
					href: node.index.url,
					active: isActive(node.index.url, pathname),
					external: node.index.external,
					children: [node.icon, node.name]
				}) : /* @__PURE__ */ jsxs(SidebarFolderTrigger, { children: [node.icon, node.name] }), /* @__PURE__ */ jsx(SidebarFolderContent, { children: renderList(node.children) })]
			});
		}
		if (Item) return /* @__PURE__ */ jsx(Item, { item: node });
		return /* @__PURE__ */ jsx(SidebarItem, {
			href: node.url,
			external: node.external,
			active: isActive(node.url, pathname),
			icon: node.icon,
			children: node.name
		});
	}
	/**
	* Render sidebar items from page tree
	*/
	return function SidebarPageTree(components) {
		const { Folder, Item, Separator } = components;
		const { root } = useTreeContext();
		const pathname = usePathname();
		return /* @__PURE__ */ jsx(RendererContext, {
			value: useMemo(() => ({
				Folder,
				Item,
				Separator,
				pathname
			}), [
				Folder,
				Item,
				Separator,
				pathname
			]),
			children: /* @__PURE__ */ jsx(Fragment$1, { children: renderList(root.children) }, root.$id)
		});
	};
}
//#endregion
export { createPageTreeRenderer };
