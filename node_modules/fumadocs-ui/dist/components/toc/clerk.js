"use client";
import { __exportAll } from "../../_virtual/_rolldown/runtime.js";
import { cn } from "../../utils/cn.js";
import { mergeRefs } from "../../utils/merge-refs.js";
import { useTOCItems } from "./index.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@fuma-translate/react";
import * as Primitive from "fumadocs-core/toc";
//#region src/components/toc/clerk.tsx
var clerk_exports = /* @__PURE__ */ __exportAll({
	TOCEmpty: () => TOCEmpty,
	TOCItem: () => TOCItem,
	TOCItems: () => TOCItems
});
function TOCItems({ ref, className, children, ...props }) {
	const containerRef = useRef(null);
	const items = useTOCItems();
	const [svg, setSvg] = useState(null);
	const onPrint = useCallback(() => {
		const container = containerRef.current;
		if (!container || container.clientHeight === 0) return;
		if (items.length === 0) {
			setSvg(null);
			return;
		}
		let w = 0;
		let h = 0;
		let d = "";
		const positions = [];
		const output = [];
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const element = container.querySelector(`a[href="${item.url}"]`);
			if (!element) continue;
			const styles = getComputedStyle(element);
			const x = getLineOffset(item.depth) + .5;
			const top = element.offsetTop + parseFloat(styles.paddingTop);
			const bottom = element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom);
			w = Math.max(x + 8, w);
			h = Math.max(h, bottom);
			if (i === 0) d += ` M${x} ${top} L${x} ${bottom}`;
			else {
				const [, upperBottom, upperX] = i > 0 ? positions[i - 1] : [
					0,
					0,
					0
				];
				d += ` L ${upperX} ${upperBottom} ${x} ${top} L${x} ${bottom}`;
			}
			if (item._step !== void 0) output.push(/* @__PURE__ */ jsxs("g", {
				transform: `translate(${x}, ${(top + bottom) / 2})`,
				children: [/* @__PURE__ */ jsx("circle", {
					cx: "0",
					cy: "0",
					r: "8",
					className: "fill-fd-primary"
				}), /* @__PURE__ */ jsx("text", {
					cx: "0",
					cy: "0",
					textAnchor: "middle",
					alignmentBaseline: "central",
					dominantBaseline: "middle",
					className: "fill-fd-primary-foreground font-medium text-xs leading-none font-mono rtl:-scale-x-100",
					children: item._step
				})]
			}, i));
			positions.push([
				top,
				bottom,
				x
			]);
		}
		output.unshift(/* @__PURE__ */ jsx("path", {
			d,
			className: "stroke-fd-primary",
			strokeWidth: "1",
			fill: "none"
		}, "path"));
		setSvg({
			content: output,
			width: w,
			height: h,
			d,
			itemLineLengths: [],
			positions
		});
	}, [items]);
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new ResizeObserver(onPrint);
		observer.observe(container);
		onPrint();
		return () => {
			observer.unobserve(container);
		};
	}, [onPrint]);
	return /* @__PURE__ */ jsxs("div", {
		ref: mergeRefs(containerRef, ref),
		className: cn("relative flex flex-col", className),
		...props,
		children: [svg && /* @__PURE__ */ jsx(ThumbTrack, { computed: svg }), children]
	});
}
function TOCEmpty() {
	return /* @__PURE__ */ jsx("div", {
		className: "rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground",
		children: useTranslations({ note: "table of contents" })("No Headings")
	});
}
function ThumbTrack({ computed }) {
	const ref = useRef(null);
	const tocInfo = Primitive.useTOC();
	function calculate(items) {
		const out = {};
		const startIdx = items.findIndex((item) => item.active);
		if (startIdx === -1) return out;
		const endIdx = items.findLastIndex((item) => item.active);
		out["--track-top"] = `${computed.positions[startIdx][0]}px`;
		out["--track-bottom"] = `${computed.positions[endIdx][1]}px`;
		return out;
	}
	Primitive.useTOCListener((items) => {
		const element = ref.current;
		if (!element) return;
		for (const [k, v] of Object.entries(calculate(items))) element.style.setProperty(k, v);
	});
	return /* @__PURE__ */ jsx("div", {
		ref,
		className: "absolute top-0 inset-s-0 origin-center rtl:-scale-x-100",
		style: {
			width: computed.width,
			height: computed.height,
			...calculate(tocInfo.get())
		},
		children: /* @__PURE__ */ jsx("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: `0 0 ${computed.width} ${computed.height}`,
			className: "absolute transition-[clip-path]",
			style: {
				width: computed.width,
				height: computed.height,
				clipPath: `polygon(0 var(--track-top,0), 100% var(--track-top,0), 100% var(--track-bottom,0), 0 var(--track-bottom,0))`
			},
			children: computed.content
		})
	});
}
const BASE = 8;
function getItemOffset(depth) {
	if (depth <= 2) return 20;
	if (depth === 3) return 32;
	return 44;
}
function getLineOffset(depth) {
	if (depth <= 2) return BASE;
	if (depth === 3) return 20;
	return 32;
}
function TOCItem({ item, ...props }) {
	const items = useTOCItems();
	const { isFirst, isLast, svg } = useMemo(() => {
		const index = items.indexOf(item);
		const isFirst = index === 0;
		const isLast = index === items.length - 1;
		const l1 = getLineOffset(item.depth);
		const l0 = isFirst ? l1 : getLineOffset(items[index - 1].depth);
		const l2 = isLast ? l1 : getLineOffset(items[index + 1].depth);
		return {
			isFirst,
			isLast,
			svg: /* @__PURE__ */ jsxs("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				className: cn("absolute -top-1.5 inset-s-0 bottom-0 h-[calc(100%+--spacing(1.5))] -z-1 rtl:-scale-x-100", l1 !== l2 && "h-full bottom-1.5"),
				style: { width: Math.max(l0, l1) + 9 },
				children: [
					l0 !== l1 && /* @__PURE__ */ jsx("path", {
						d: `M ${l0 + .5} 0 L ${l0 + .5} 0 ${l1 + .5} 12`,
						stroke: "black",
						strokeWidth: "1",
						fill: "none",
						className: "stroke-fd-foreground/10"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: l1 + .5,
						y1: l0 === l1 ? "6" : "12",
						x2: l1 + .5,
						y2: "100%",
						strokeWidth: "1",
						className: "stroke-fd-foreground/10"
					}),
					item._step !== void 0 && /* @__PURE__ */ jsxs("g", {
						transform: `translate(${l1 + .5}, ${l1 === l2 ? "3" : "6"})`,
						children: [/* @__PURE__ */ jsx("circle", {
							cx: "0",
							cy: "50%",
							r: "8",
							className: "fill-fd-muted"
						}), /* @__PURE__ */ jsx("text", {
							x: "0",
							y: "50%",
							textAnchor: "middle",
							alignmentBaseline: "central",
							dominantBaseline: "middle",
							className: "fill-fd-muted-foreground font-medium text-xs leading-none font-mono rtl:-scale-x-100",
							children: item._step
						})]
					})
				]
			})
		};
	}, [items, item]);
	return /* @__PURE__ */ jsxs(Primitive.TOCItem, {
		href: item.url,
		...props,
		className: cn("prose relative py-1.5 text-sm scroll-m-4 text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors wrap-anywhere data-[active=true]:text-fd-primary", isFirst && "pt-0", isLast && "pb-0", props.className),
		style: {
			paddingInlineStart: getItemOffset(item.depth),
			...props.style
		},
		children: [svg, item.title]
	});
}
//#endregion
export { TOCEmpty, TOCItem, TOCItems, clerk_exports };
