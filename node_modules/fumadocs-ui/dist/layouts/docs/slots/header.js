"use client";
import { cn } from "../../../utils/cn.js";
import { buttonVariants } from "../../../components/ui/button.js";
import { useDocsLayout } from "../client.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { SidebarIcon } from "lucide-react";
//#region src/layouts/docs/slots/header.tsx
function Header(props) {
	const { isNavTransparent, slots, props: { nav } } = useDocsLayout();
	if (nav?.component) return nav.component;
	return /* @__PURE__ */ jsxs("header", {
		id: "nd-subnav",
		"data-transparent": isNavTransparent,
		...props,
		className: cn("[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-(--fd-header-height) md:hidden max-md:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80", props.className),
		children: [
			slots.navTitle && /* @__PURE__ */ jsx(slots.navTitle, { className: "inline-flex items-center gap-2.5 font-semibold" }),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1",
				children: nav?.children
			}),
			slots.searchTrigger && /* @__PURE__ */ jsx(slots.searchTrigger.sm, {
				hideIfDisabled: true,
				className: "p-2"
			}),
			slots.sidebar && /* @__PURE__ */ jsx(slots.sidebar.trigger, {
				className: cn(buttonVariants({
					color: "ghost",
					size: "icon-sm",
					className: "p-2"
				})),
				children: /* @__PURE__ */ jsx(SidebarIcon, {})
			})
		]
	});
}
//#endregion
export { Header };
