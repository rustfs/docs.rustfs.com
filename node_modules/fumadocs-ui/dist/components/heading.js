"use client";
import { cn } from "../utils/cn.js";
import { buttonVariants } from "./ui/button.js";
import { useCopyButton } from "../utils/use-copy-button.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { CopyCheckIcon, LinkIcon } from "lucide-react";
import { useTranslations } from "@fuma-translate/react";
//#region src/components/heading.tsx
function Heading({ as, ...props }) {
	const As = as ?? "h1";
	const t = useTranslations({ note: "heading anchor" });
	const [isChecked, onCopy] = useCopyButton(() => {
		if (!props.id) return;
		const url = new URL(window.location.href);
		url.hash = props.id;
		return navigator.clipboard.writeText(url.href);
	});
	if (!props.id) return /* @__PURE__ */ jsx(As, { ...props });
	return /* @__PURE__ */ jsxs(As, {
		...props,
		className: cn("group/heading flex scroll-m-28 flex-row items-center gap-1", props.className),
		children: [/* @__PURE__ */ jsx("a", {
			"data-card": "",
			href: `#${props.id}`,
			children: props.children
		}), /* @__PURE__ */ jsx("button", {
			"aria-label": t("Copy Anchor Link", { note: "aria-label" }),
			className: cn(buttonVariants({
				variant: "ghost",
				size: "icon-xs"
			}), "not-prose shrink-0 text-fd-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100"),
			onClick: onCopy,
			children: isChecked ? /* @__PURE__ */ jsx(CopyCheckIcon, {}) : /* @__PURE__ */ jsx(LinkIcon, {})
		})]
	});
}
//#endregion
export { Heading };
