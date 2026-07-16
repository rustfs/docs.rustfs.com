"use client";
import { cn } from "../utils/cn.js";
import { buttonVariants } from "./ui/button.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "@fuma-translate/react";
//#region src/components/banner.tsx
function Banner({ id, variant = "normal", changeLayout = true, height = "3rem", rainbowColors = [
	"rgba(0,149,255,0.56)",
	"rgba(231,77,255,0.77)",
	"rgba(255,0,0,0.73)",
	"rgba(131,255,166,0.66)"
], ...props }) {
	const t = useTranslations({ note: "banner" });
	const [open, setOpen] = useState(true);
	const globalKey = id ? `nd-banner-${encodeBase32(id)}` : null;
	useEffect(() => {
		if (globalKey && localStorage.getItem(globalKey) === "true") setOpen(false);
	}, [globalKey]);
	function onClose() {
		setOpen(false);
		if (globalKey) localStorage.setItem(globalKey, "true");
	}
	if (!open) return null;
	return /* @__PURE__ */ jsxs("div", {
		id,
		...props,
		className: cn("sticky top-0 z-40 flex flex-row items-center justify-center px-4 text-center text-sm font-medium", variant === "normal" && "bg-fd-secondary", variant === "rainbow" && "bg-fd-background", !open && "hidden", props.className),
		style: { height },
		children: [
			changeLayout && open ? /* @__PURE__ */ jsx("style", { children: globalKey ? `:root:not(.${globalKey}) { --fd-banner-height: ${height}; }` : `:root { --fd-banner-height: ${height}; }` }) : null,
			globalKey ? /* @__PURE__ */ jsx("style", { children: `.${globalKey} #${id} { display: none; }` }) : null,
			globalKey ? /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `if (localStorage.getItem('${globalKey}') === 'true') document.documentElement.classList.add('${globalKey}');` } }) : null,
			variant === "rainbow" ? flow({ colors: rainbowColors }) : null,
			props.children,
			id ? /* @__PURE__ */ jsx("button", {
				type: "button",
				"aria-label": t("Close Banner", { note: "aria-label" }),
				onClick: onClose,
				className: cn(buttonVariants({
					color: "ghost",
					className: "absolute inset-e-2 top-1/2 -translate-y-1/2 text-fd-muted-foreground/50",
					size: "icon-sm"
				})),
				children: /* @__PURE__ */ jsx(X, {})
			}) : null
		]
	});
}
const maskImage = "linear-gradient(to bottom,white,transparent), radial-gradient(circle at top center, white, transparent)";
function flow({ colors }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		className: "absolute inset-0 -z-1",
		style: {
			maskImage,
			maskComposite: "intersect",
			animation: "fd-moving-banner 20s linear infinite",
			backgroundImage: `repeating-linear-gradient(70deg, ${[...colors, colors[0]].map((color, i) => `${color} ${i * 50 / colors.length}%`).join(", ")})`,
			backgroundSize: "200% 100%",
			filter: "saturate(2)"
		}
	}), /* @__PURE__ */ jsx("style", { children: `@keyframes fd-moving-banner {
            from { background-position: 0% 0;  }
            to { background-position: 100% 0;  }
         }` })] });
}
function encodeBase32(str) {
	const alphabet = "abcdefghijklmnopqrstuvwxyz234567";
	let encoded = "";
	let buffer = 0;
	let bitsLeft = 0;
	for (let i = 0; i < str.length; i++) {
		buffer = buffer << 8 | str.charCodeAt(i);
		bitsLeft += 8;
		while (bitsLeft >= 5) {
			bitsLeft -= 5;
			encoded += alphabet[buffer >> bitsLeft & 31];
		}
	}
	if (bitsLeft > 0) encoded += alphabet[buffer << 5 - bitsLeft & 31];
	return encoded;
}
//#endregion
export { Banner };
