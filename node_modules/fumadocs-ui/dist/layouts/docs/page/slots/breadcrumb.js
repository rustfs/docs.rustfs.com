"use client";
import { cn } from "../../../../utils/cn.js";
import { useTreeContext, useTreePath } from "../../../../contexts/tree.js";
import Link from "fumadocs-core/link";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronRight } from "lucide-react";
import { Fragment as Fragment$1, useMemo } from "react";
import { getBreadcrumbItemsFromPath } from "fumadocs-core/breadcrumb";
//#region src/layouts/docs/page/slots/breadcrumb.tsx
function Breadcrumb({ includeRoot, includeSeparator, includePage, ...props }) {
	const path = useTreePath();
	const { root } = useTreeContext();
	const items = useMemo(() => {
		return getBreadcrumbItemsFromPath(root, path, {
			includePage,
			includeSeparator,
			includeRoot
		});
	}, [
		includePage,
		includeRoot,
		includeSeparator,
		path,
		root
	]);
	if (items.length === 0) return null;
	return /* @__PURE__ */ jsx("div", {
		...props,
		className: cn("flex items-center gap-1.5 text-sm text-fd-muted-foreground", props.className),
		children: items.map((item, i) => {
			const className = cn("truncate", i === items.length - 1 && "text-fd-primary font-medium");
			return /* @__PURE__ */ jsxs(Fragment$1, { children: [i !== 0 && /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 shrink-0" }), item.url ? /* @__PURE__ */ jsx(Link, {
				href: item.url,
				className: cn(className, "transition-opacity hover:opacity-80"),
				children: item.name
			}) : /* @__PURE__ */ jsx("span", {
				className,
				children: item.name
			})] }, i);
		})
	});
}
//#endregion
export { Breadcrumb };
