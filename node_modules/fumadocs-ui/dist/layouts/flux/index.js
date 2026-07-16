"use client";
import { cn } from "../../utils/cn.js";
import { buttonVariants } from "../../components/ui/button.js";
import { TreeContextProvider } from "../../contexts/tree.js";
import { useSearchContext } from "../../contexts/search.js";
import { LinkItem, baseSlots } from "../shared/client.js";
import { getLayoutTabs, useLinkItems } from "../shared/index.js";
import { TabDropdown } from "./slots/tab-dropdown.js";
import { Sidebar as Sidebar$1, SidebarProvider, SidebarTrigger, useSidebar } from "./slots/sidebar.js";
import { Container } from "./slots/container.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Languages } from "lucide-react";
import { createContext, use, useMemo } from "react";
import { motion } from "motion/react";
import { RemoveScroll } from "react-remove-scroll";
//#region src/layouts/flux/index.tsx
const LayoutContext = createContext(null);
function useFluxLayout() {
	const context = use(LayoutContext);
	if (!context) throw new Error("Please use Flux layout components under <DocsLayout /> (`fumadocs-ui/layouts/flux`).");
	return context;
}
const { useProvider } = baseSlots({ useProps() {
	return useFluxLayout().props;
} });
function DocsLayout(props) {
	const { tree, nav = {}, sidebar: { enabled: sidebarEnabled = true, tabs: _tabs, defaultOpenLevel, prefetch, ...sidebarProps } = {}, tabs: defaultTabs = _tabs, children, containerProps, renderNavigationPanel = (props) => /* @__PURE__ */ jsx(NavigationPanel, { ...props }), slots: defaultSlots = {} } = props;
	const linkItems = useLinkItems(props);
	const { baseSlots, baseProps } = useProvider(props);
	const tabs = useMemo(() => {
		if (Array.isArray(defaultTabs)) return defaultTabs;
		if (typeof defaultTabs === "object") return getLayoutTabs(tree, defaultTabs);
		if (defaultTabs !== false) return getLayoutTabs(tree);
		return [];
	}, [tree, defaultTabs]);
	const slots = {
		...baseSlots,
		container: defaultSlots.container ?? Container,
		tabDropdown: defaultSlots.tabDropdown ?? TabDropdown,
		sidebar: defaultSlots.sidebar ?? {
			root: Sidebar$1,
			provider: SidebarProvider,
			trigger: SidebarTrigger,
			useSidebar
		}
	};
	return /* @__PURE__ */ jsx(LayoutContext, {
		value: {
			props: baseProps,
			slots,
			...linkItems
		},
		children: /* @__PURE__ */ jsxs(TreeContextProvider, {
			tree,
			children: [/* @__PURE__ */ jsx(slots.sidebar.provider, {
				defaultOpenLevel,
				prefetch,
				children: /* @__PURE__ */ jsxs(slots.container, {
					...containerProps,
					children: [sidebarEnabled && /* @__PURE__ */ jsx(slots.sidebar.root, { ...sidebarProps }), children]
				})
			}), renderNavigationPanel({
				head: /* @__PURE__ */ jsxs(Fragment, { children: [slots.navTitle && /* @__PURE__ */ jsx(slots.navTitle, { className: "inline-flex items-center gap-2.5 text-sm font-semibold" }), nav.children] }),
				tabDropdown: slots.tabDropdown && tabs.length > 0 && /* @__PURE__ */ jsx(slots.tabDropdown, {
					className: "flex-1",
					tabs
				}),
				tool: /* @__PURE__ */ jsxs(Fragment, { children: [
					slots.languageSelect && /* @__PURE__ */ jsx(slots.languageSelect.root, { children: /* @__PURE__ */ jsx(Languages, { className: "size-4.5" }) }),
					slots.searchTrigger && /* @__PURE__ */ jsx(slots.searchTrigger.sm, {
						hideIfDisabled: true,
						className: "rounded-lg"
					}),
					slots.sidebar && /* @__PURE__ */ jsx(slots.sidebar.trigger, { className: cn(buttonVariants({
						variant: "ghost",
						size: "icon-sm",
						className: "overflow-hidden"
					})) }),
					slots.themeSwitch && /* @__PURE__ */ jsx(slots.themeSwitch, { className: "p-1 h-full ms-1 rounded-xl bg-fd-muted *:rounded-lg" })
				] }),
				link: linkItems.menuItems.filter((item) => item.type === "icon").map((item, i) => /* @__PURE__ */ jsx(LinkItem, {
					item,
					className: cn(buttonVariants({
						size: "icon-sm",
						color: "ghost"
					})),
					"aria-label": item.label,
					children: item.icon
				}, i))
			})]
		})
	});
}
function NavigationPanel({ head, tabDropdown, tool, link, children = (v) => v, ...props }) {
	const { open } = useSearchContext();
	return /* @__PURE__ */ jsx(motion.div, {
		...props,
		className: cn("fixed left-1/2 w-[calc(100%-var(--removed-body-scroll-bar-size,0px))] translate-x-[calc(-50%-var(--removed-body-scroll-bar-size,0px)/2)] bottom-0 z-40 bg-fd-popover text-fd-popover-foreground border-t shadow-lg sm:bottom-6 sm:rounded-2xl sm:border sm:max-w-[380px]", props.className),
		animate: props.animate ?? {
			scale: open ? .9 : 1,
			translateY: open ? 20 : 0,
			opacity: open ? .8 : 1
		},
		children: children(/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-row items-center ps-2.5 p-1 gap-2 min-h-11",
			children: [head, /* @__PURE__ */ jsx("div", {
				id: "flux-layout-slot",
				className: "flex-1"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-row gap-1.5 overflow-x-auto overflow-y-hidden p-2 sm:p-1",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-row items-center gap-2 min-w-0 flex-1",
					children: tabDropdown
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-row items-center text-fd-muted-foreground border-x px-0.5 empty:hidden",
					children: link
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-row items-center text-fd-muted-foreground empty:hidden",
					children: tool
				})
			]
		})] }))
	});
}
function NavigationPanelOverlay({ enabled = false, className, ...props }) {
	return /* @__PURE__ */ jsx(RemoveScroll, {
		enabled,
		children: /* @__PURE__ */ jsx(motion.div, {
			className: cn("fixed inset-0 z-30 pr-(--removed-body-scroll-bar-size,0) backdrop-blur-md bg-fd-background/60", !enabled && "pointer-events-none", className),
			initial: "hide",
			variants: {
				show: { opacity: 1 },
				hide: { opacity: 0 }
			},
			animate: enabled ? "show" : "hide",
			exit: "hide",
			...props
		})
	});
}
//#endregion
export { DocsLayout, NavigationPanel, NavigationPanelOverlay, useFluxLayout };
