"use client";
import { cn } from "../../../../utils/cn.js";
import { TOCScrollArea, toc_exports, useItems, useTOCItems } from "../../../../components/toc/index.js";
import { default_exports } from "../../../../components/toc/default.js";
import { clerk_exports } from "../../../../components/toc/clerk.js";
import { useTreePath } from "../../../../contexts/tree.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../../components/ui/collapsible.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown } from "lucide-react";
import { createContext, use, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useTranslations } from "@fuma-translate/react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
//#region src/layouts/flux/page/slots/toc.tsx
const TocPopoverContext = createContext(null);
const { TOCProvider } = toc_exports;
function TOC({ container, trigger, content, header, footer, style = "normal", list }) {
	const items = useTOCItems();
	const { TOCItems, TOCEmpty, TOCItem } = style === "clerk" ? clerk_exports : default_exports;
	if (items.length === 0 && !header && !footer) return;
	return /* @__PURE__ */ jsxs(PageTOCPopover, {
		...container,
		children: [/* @__PURE__ */ jsxs(PageTOCPopoverContent, {
			...content,
			children: [
				header,
				/* @__PURE__ */ jsx(TOCScrollArea, { children: /* @__PURE__ */ jsxs(TOCItems, {
					...list,
					children: [items.length === 0 && /* @__PURE__ */ jsx(TOCEmpty, {}), items.map((item) => /* @__PURE__ */ jsx(TOCItem, { item }, item.url))]
				}) }),
				footer
			]
		}), /* @__PURE__ */ jsx(PageTOCPopoverTrigger, { ...trigger })]
	});
}
function PageTOCPopover(props) {
	const [container, setContainer] = useState(null);
	useEffect(() => {
		const element = document.getElementById("flux-layout-slot");
		if (!element) return;
		setContainer(element);
	}, []);
	if (!container) return;
	return createPortal(/* @__PURE__ */ jsx(PageTOCPopoverPhysical, { ...props }), container);
}
function PageTOCPopoverPhysical({ className, children, ...rest }) {
	const ref = useRef(null);
	const [open, setOpen] = useState(false);
	const onClick = useEffectEvent((e) => {
		if (!open) return;
		if (ref.current && !ref.current.contains(e.target)) setOpen(false);
	});
	useEffect(() => {
		window.addEventListener("click", onClick);
		return () => {
			window.removeEventListener("click", onClick);
		};
	}, []);
	return /* @__PURE__ */ jsx(TocPopoverContext, {
		value: useMemo(() => ({
			open,
			setOpen
		}), [setOpen, open]),
		children: /* @__PURE__ */ jsx(Collapsible, {
			open,
			onOpenChange: setOpen,
			"data-toc-popover": "",
			className: cn("relative h-9 animate-fd-fade-in", className),
			...rest,
			children: /* @__PURE__ */ jsx("header", {
				ref,
				className: cn("absolute w-full bottom-0 border rounded-xl transition-colors bg-fd-secondary text-fd-secondary-foreground backdrop-blur-sm", open && "shadow-lg bg-fd-popover/80 text-fd-popover-foreground"),
				children
			})
		})
	});
}
function PageTOCPopoverTrigger({ className, ...props }) {
	const t = useTranslations({ note: "table of contents" });
	const { open } = use(TocPopoverContext);
	const items = useItems();
	const selectedIdx = items.findIndex((item) => item.active);
	const path = useTreePath().at(-1);
	const spanProps = {
		transition: { duration: .1 },
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -10
		},
		className: cn(open && "text-fd-popover-foreground")
	};
	return /* @__PURE__ */ jsxs(CollapsibleTrigger, {
		className: cn("flex w-full h-8.5 items-center text-sm text-fd-muted-foreground gap-2.5 px-2 text-start focus-visible:outline-none [&_svg]:size-4", className),
		"data-toc-popover-trigger": "",
		...props,
		children: [
			/* @__PURE__ */ jsx(ProgressCircle, {
				value: (items.findLastIndex((item) => item.active) + 1) / Math.max(1, items.length),
				max: 1,
				className: cn("shrink-0", open && "text-fd-primary")
			}),
			/* @__PURE__ */ jsx(AnimatePresence, {
				mode: "wait",
				children: items[selectedIdx] && !open ? /* @__PURE__ */ jsx(motion.span, {
					...spanProps,
					children: items[selectedIdx].original.title
				}, selectedIdx) : path ? /* @__PURE__ */ jsx(motion.span, {
					...spanProps,
					children: path.name
				}, path.$id ?? ":pathId") : /* @__PURE__ */ jsx(motion.span, {
					...spanProps,
					children: t("On this page")
				}, ":toc")
			}),
			/* @__PURE__ */ jsx(ChevronDown, { className: cn("ms-auto shrink-0 transition-transform", open && "rotate-180") })
		]
	});
}
function clamp(input, min, max) {
	if (input < min) return min;
	if (input > max) return max;
	return input;
}
function ProgressCircle({ value, strokeWidth = 1.5, size = 18, min = 0, max = 100, style, ...restSvgProps }) {
	const normalizedValue = clamp(value, min, max);
	const radius = size / 2 - strokeWidth;
	const circumference = 2 * Math.PI * radius;
	const progress = normalizedValue / max * circumference;
	const circleProps = {
		cx: size / 2,
		cy: size / 2,
		r: radius,
		fill: "none",
		strokeWidth
	};
	return /* @__PURE__ */ jsxs("svg", {
		role: "progressbar",
		viewBox: `0 0 ${size} ${size}`,
		"aria-valuenow": normalizedValue,
		"aria-valuemin": min,
		"aria-valuemax": max,
		style: {
			width: size,
			height: size,
			...style
		},
		...restSvgProps,
		children: [/* @__PURE__ */ jsx("circle", {
			...circleProps,
			className: "stroke-current/25"
		}), /* @__PURE__ */ jsx("circle", {
			...circleProps,
			stroke: "currentColor",
			strokeDasharray: circumference,
			strokeDashoffset: circumference - progress,
			strokeLinecap: "round",
			transform: `rotate(-90 ${size / 2} ${size / 2})`,
			className: "transition-all"
		})]
	});
}
function PageTOCPopoverContent(props) {
	return /* @__PURE__ */ jsx(CollapsibleContent, {
		"data-toc-popover-content": "",
		...props,
		children: /* @__PURE__ */ jsx("div", {
			className: "flex flex-col px-2 max-h-[50vh]",
			children: props.children
		})
	});
}
//#endregion
export { TOC, TOCProvider };
