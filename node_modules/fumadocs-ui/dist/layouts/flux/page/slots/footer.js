"use client";
import { cn } from "../../../../utils/cn.js";
import { isActive } from "../../../../utils/urls.js";
import { useFooterItems } from "../../../../utils/use-footer-items.js";
import Link from "fumadocs-core/link";
import { usePathname } from "fumadocs-core/framework";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "@fuma-translate/react";
//#region src/layouts/flux/page/slots/footer.tsx
function Footer({ items, children, className, ...props }) {
	const footerList = useFooterItems();
	const pathname = usePathname();
	const { previous, next } = useMemo(() => {
		if (items) return items;
		const idx = footerList.findIndex((item) => isActive(item.url, pathname));
		if (idx === -1) return {};
		return {
			previous: footerList[idx - 1],
			next: footerList[idx + 1]
		};
	}, [
		footerList,
		items,
		pathname
	]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: cn("@container grid gap-4", previous && next ? "grid-cols-2" : "grid-cols-1", className),
		...props,
		children: [previous && /* @__PURE__ */ jsx(FooterItem, {
			item: previous,
			index: 0
		}), next && /* @__PURE__ */ jsx(FooterItem, {
			item: next,
			index: 1
		})]
	}), children] });
}
function FooterItem({ item, index }) {
	const t = useTranslations({ note: "pagination" });
	const Icon = index === 0 ? ChevronLeft : ChevronRight;
	return /* @__PURE__ */ jsxs(Link, {
		href: item.url,
		className: cn("flex flex-col gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground @max-lg:col-span-full", index === 1 && "text-end"),
		children: [/* @__PURE__ */ jsxs("div", {
			className: cn("inline-flex items-center gap-1.5 font-medium", index === 1 && "flex-row-reverse"),
			children: [/* @__PURE__ */ jsx(Icon, { className: "-mx-1 size-4 shrink-0 rtl:rotate-180" }), /* @__PURE__ */ jsx("p", { children: item.name })]
		}), /* @__PURE__ */ jsx("p", {
			className: "text-fd-muted-foreground truncate",
			children: item.description ?? (index === 0 ? t("Previous Page") : t("Next Page"))
		})]
	});
}
//#endregion
export { Footer };
