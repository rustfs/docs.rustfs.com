"use client";
import { cn } from "../../utils/cn.js";
import { TreeContextProvider } from "../../contexts/tree.js";
import { baseSlots } from "../shared/client.js";
import { isLayoutTabActive, useLinkItems } from "../shared/index.js";
import { useIsScrollTop } from "../../utils/use-is-scroll-top.js";
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar } from "./slots/sidebar.js";
import { Header } from "./slots/header.js";
import { Container } from "./slots/container.js";
import Link from "fumadocs-core/link";
import { usePathname } from "fumadocs-core/framework";
import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, use, useMemo } from "react";
//#region src/layouts/docs/client.tsx
const { useProvider } = baseSlots({ useProps() {
	return useDocsLayout().props;
} });
const LayoutContext = createContext(null);
function useIsDocsLayout() {
	return use(LayoutContext) !== null;
}
function useDocsLayout() {
	const context = use(LayoutContext);
	if (!context) throw new Error("Please use <DocsPage /> (`fumadocs-ui/layouts/docs/page`) under <DocsLayout /> (`fumadocs-ui/layouts/docs`).");
	return context;
}
function LayoutBody(props) {
	const { nav: { enabled: navEnabled = true, transparentMode: navTransparentMode = "none" } = {}, sidebar: { enabled: sidebarEnabled = true, defaultOpenLevel, prefetch, ...sidebarProps } = {}, slots: defaultSlots, tabs, tabMode = "auto", tree, containerProps, children } = props;
	const isTop = useIsScrollTop({ enabled: navTransparentMode === "top" }) ?? true;
	const isNavTransparent = navTransparentMode === "top" ? isTop : navTransparentMode === "always";
	const { baseSlots, baseProps } = useProvider(props);
	const linkItems = useLinkItems(props);
	const slots = {
		...baseSlots,
		header: defaultSlots?.header ?? Header,
		container: defaultSlots?.container ?? Container,
		sidebar: defaultSlots?.sidebar ?? {
			provider: SidebarProvider,
			root: Sidebar,
			trigger: SidebarTrigger,
			useSidebar
		}
	};
	return /* @__PURE__ */ jsx(TreeContextProvider, {
		tree,
		children: /* @__PURE__ */ jsx(LayoutContext, {
			value: {
				props: {
					tabMode,
					tabs,
					...baseProps
				},
				isNavTransparent,
				slots,
				...linkItems
			},
			children: /* @__PURE__ */ jsx(slots.sidebar.provider, {
				defaultOpenLevel,
				prefetch,
				children: /* @__PURE__ */ jsxs(slots.container, {
					...containerProps,
					children: [
						navEnabled && /* @__PURE__ */ jsx(slots.header, {}),
						sidebarEnabled && /* @__PURE__ */ jsx(slots.sidebar.root, { ...sidebarProps }),
						tabMode === "top" && tabs.length > 0 && /* @__PURE__ */ jsx(LayoutTabs, {
							tabs,
							className: "z-10 bg-fd-background border-b px-6 pt-3 xl:px-8 max-md:hidden"
						}),
						children
					]
				})
			})
		})
	});
}
function LayoutTabs({ tabs, ...props }) {
	const pathname = usePathname();
	const selected = useMemo(() => {
		return tabs.findLast((option) => isLayoutTabActive(option, pathname));
	}, [tabs, pathname]);
	return /* @__PURE__ */ jsx("div", {
		...props,
		className: cn("flex flex-row items-end gap-6 overflow-auto [grid-area:main]", props.className),
		children: tabs.map((tab, i) => /* @__PURE__ */ jsx(Link, {
			href: tab.url,
			className: cn("inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground", tab.unlisted && selected !== tab && "hidden", selected === tab && "border-fd-primary text-fd-primary"),
			children: tab.title
		}, i))
	});
}
//#endregion
export { LayoutBody, useDocsLayout, useIsDocsLayout };
