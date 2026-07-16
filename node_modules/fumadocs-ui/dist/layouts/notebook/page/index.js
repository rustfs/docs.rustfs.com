"use client";
import { __exportAll } from "../../../_virtual/_rolldown/runtime.js";
import { cn } from "../../../utils/cn.js";
import { buttonVariants } from "../../../components/ui/button.js";
import { MarkdownCopyButton, ViewOptionsPopover } from "../../shared/page-actions.js";
import { TOC, TOCPopover, TOCProvider } from "./slots/toc.js";
import { Footer } from "./slots/footer.js";
import { Breadcrumb } from "./slots/breadcrumb.js";
import { Container } from "./slots/container.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Edit } from "lucide-react";
import { createContext, use, useEffect, useState } from "react";
import { useTranslations } from "@fuma-translate/react";
//#region src/layouts/notebook/page/index.tsx
var page_exports = /* @__PURE__ */ __exportAll({
	DocsBody: () => DocsBody,
	DocsDescription: () => DocsDescription,
	DocsPage: () => DocsPage,
	DocsTitle: () => DocsTitle,
	EditOnGitHub: () => EditOnGitHub,
	MarkdownCopyButton: () => MarkdownCopyButton,
	PageBreadcrumb: () => Breadcrumb,
	PageFooter: () => Footer,
	PageLastUpdate: () => PageLastUpdate,
	ViewOptionsPopover: () => ViewOptionsPopover,
	useDocsPage: () => useDocsPage
});
const PageContext = createContext(null);
function useDocsPage() {
	const context = use(PageContext);
	if (!context) throw new Error("Please use page components under <DocsPage /> (`fumadocs-ui/layouts/notebook/page`).");
	return context;
}
function DocsPage({ full = false, tableOfContent: { enabled: tocEnabled = !full, single, ...tocProps } = {}, tableOfContentPopover: { enabled: tocPopoverEnabled, ...tocPopoverProps } = {}, breadcrumb: { enabled: breadcrumbEnabled = true, ...breadcrumb } = {}, footer: { enabled: footerEnabled = true, ...footer } = {}, toc = [], slots: defaultSlots = {}, children, ...containerProps }) {
	tocPopoverEnabled ??= Boolean(toc.length > 0 || tocPopoverProps.header || tocPopoverProps.footer);
	const slots = {
		breadcrumb: defaultSlots.breadcrumb ?? Breadcrumb,
		footer: defaultSlots.footer ?? Footer,
		toc: defaultSlots.toc ?? {
			provider: TOCProvider,
			main: TOC,
			popover: TOCPopover
		},
		container: defaultSlots.container ?? Container
	};
	return /* @__PURE__ */ jsx(PageContext, {
		value: {
			full,
			slots
		},
		children: /* @__PURE__ */ jsxs(slots.toc.provider, {
			single,
			toc: tocEnabled || tocPopoverEnabled ? toc : [],
			children: [
				tocPopoverEnabled && (tocPopoverProps.component ?? /* @__PURE__ */ jsx(slots.toc.popover, { ...tocPopoverProps })),
				/* @__PURE__ */ jsxs(slots.container, {
					...containerProps,
					children: [
						breadcrumbEnabled && (breadcrumb.component ?? /* @__PURE__ */ jsx(slots.breadcrumb, { ...breadcrumb })),
						children,
						footerEnabled && (footer.component ?? /* @__PURE__ */ jsx(slots.footer, { ...footer }))
					]
				}),
				tocEnabled && (tocProps.component ?? /* @__PURE__ */ jsx(slots.toc.main, { ...tocProps }))
			]
		})
	});
}
function EditOnGitHub(props) {
	const t = useTranslations({ note: "edit page" });
	return /* @__PURE__ */ jsx("a", {
		target: "_blank",
		rel: "noreferrer noopener",
		...props,
		className: cn(buttonVariants({
			color: "secondary",
			size: "sm"
		}), "gap-1.5 not-prose", props.className),
		children: props.children ?? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Edit, { className: "size-3.5" }), t("Edit on GitHub")] })
	});
}
/**
* Add typography styles
*/
function DocsBody({ children, className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		...props,
		className: cn("prose flex-1", className),
		children
	});
}
function DocsDescription({ children, className, ...props }) {
	if (children === void 0) return null;
	return /* @__PURE__ */ jsx("p", {
		...props,
		className: cn("mb-8 text-lg text-fd-muted-foreground", className),
		children
	});
}
function DocsTitle({ children, className, ...props }) {
	return /* @__PURE__ */ jsx("h1", {
		...props,
		className: cn("text-[1.75em] font-semibold", className),
		children
	});
}
function PageLastUpdate({ date: value, ...props }) {
	const t = useTranslations({ note: "page footer" });
	const [date, setDate] = useState("");
	useEffect(() => {
		setDate(value.toLocaleDateString());
	}, [value]);
	return /* @__PURE__ */ jsxs("p", {
		...props,
		className: cn("text-sm text-fd-muted-foreground", props.className),
		children: [
			t("Last updated on"),
			" ",
			date
		]
	});
}
//#endregion
export { DocsBody, DocsDescription, DocsPage, DocsTitle, EditOnGitHub, MarkdownCopyButton, Breadcrumb as PageBreadcrumb, Footer as PageFooter, PageLastUpdate, ViewOptionsPopover, page_exports, useDocsPage };
