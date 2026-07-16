import { isActive, normalize } from "../../utils/urls.js";
import { LinkItem, baseSlots } from "./client.js";
import { jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import * as PageTree from "fumadocs-core/page-tree";
//#region src/layouts/shared/index.tsx
const defaultTransform = (option, node) => {
	if (!node.icon) return option;
	return {
		...option,
		icon: /* @__PURE__ */ jsx("div", {
			className: "size-full [&_svg]:size-full max-md:p-1.5 max-md:rounded-md max-md:border max-md:bg-fd-secondary",
			children: node.icon
		})
	};
};
function getLayoutTabs(tree, { transform = defaultTransform } = {}) {
	const results = [];
	function next(node, unlisted) {
		if ("root" in node && node.root) {
			const url = node.index?.url ?? node.children.find((node) => node.type === "page")?.url;
			if (url) {
				const option = {
					title: node.name,
					icon: node.icon,
					description: node.description,
					url,
					unlisted,
					$folder: node
				};
				const mapped = transform ? transform(option, node) : option;
				if (mapped) results.push(mapped);
			}
		}
		for (const child of node.children) if (child.type === "folder") next(child, unlisted);
	}
	next(tree);
	if (tree.fallback) next(tree.fallback, true);
	return results;
}
function isLayoutTabActive(tab, pathname) {
	if (tab.$folder) return PageTree.findPath(tab.$folder.children, (node) => node.type === "page" && isActive(node.url, pathname)) !== null;
	if (tab.urls) return tab.urls.has(normalize(pathname));
	return isActive(tab.url, pathname, true);
}
/**
* Get link items with shortcuts
*/
function resolveLinkItems({ links = [], githubUrl }) {
	const result = [...links];
	if (githubUrl) result.push({
		type: "icon",
		url: githubUrl,
		text: "Github",
		label: "GitHub",
		icon: /* @__PURE__ */ jsx("svg", {
			role: "img",
			viewBox: "0 0 24 24",
			fill: "currentColor",
			children: /* @__PURE__ */ jsx("path", { d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" })
		}),
		external: true
	});
	return result;
}
function useLinkItems({ githubUrl, links }) {
	return useMemo(() => {
		const all = resolveLinkItems({
			links,
			githubUrl
		});
		const navItems = [];
		const menuItems = [];
		for (const item of all) switch (item.on) {
			case "menu":
				menuItems.push(item);
				break;
			case "nav":
				navItems.push(item);
				break;
			default:
				navItems.push(item);
				menuItems.push(item);
		}
		return {
			navItems,
			menuItems,
			all
		};
	}, [links, githubUrl]);
}
function isLinkItemActive(link, pathname) {
	if (link.type === "custom" || !link.url) return false;
	if (link.active === "none") return false;
	return isActive(link.url, pathname, link.active === "nested-url");
}
//#endregion
export { LinkItem, baseSlots, getLayoutTabs, isLayoutTabActive, isLinkItemActive, resolveLinkItems, useLinkItems };
