"use client";
import { TreeContextProvider } from "../../contexts/tree.js";
import { baseSlots } from "../shared/client.js";
import { useLinkItems } from "../shared/index.js";
import { useIsScrollTop } from "../../utils/use-is-scroll-top.js";
import { Container } from "./slots/container.js";
import { Sidebar, SidebarCollapseTrigger, SidebarProvider, SidebarTrigger, useSidebar } from "./slots/sidebar.js";
import { Header } from "./slots/header.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { createContext, use } from "react";
//#region src/layouts/notebook/client.tsx
const { useProvider } = baseSlots({ useProps() {
	return useNotebookLayout().props;
} });
const LayoutContext = createContext(null);
function useNotebookLayout() {
	const context = use(LayoutContext);
	if (!context) throw new Error("Please use <DocsPage /> (`fumadocs-ui/layouts/notebook/page`) under <DocsLayout /> (`fumadocs-ui/layouts/notebook`).");
	return context;
}
function LayoutBody(props) {
	const { nav: { enabled: navEnabled = true, transparentMode: navTransparentMode = "none" } = {}, sidebar: { defaultOpenLevel, prefetch, ...sidebarProps } = {}, slots: defaultSlots, tabMode = "sidebar", tabs, tree, containerProps, children } = props;
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
			collapseTrigger: SidebarCollapseTrigger,
			useSidebar
		}
	};
	return /* @__PURE__ */ jsx(TreeContextProvider, {
		tree,
		children: /* @__PURE__ */ jsx(LayoutContext, {
			value: {
				props: {
					tabs,
					tabMode,
					sidebar: sidebarProps,
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
						/* @__PURE__ */ jsx(slots.sidebar.root, { ...sidebarProps }),
						children
					]
				})
			})
		})
	});
}
//#endregion
export { LayoutBody, useNotebookLayout };
