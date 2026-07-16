"use client";
import { __exportAll } from "../../_virtual/_rolldown/runtime.js";
import { cn } from "../../utils/cn.js";
import { mergeRefs } from "../../utils/merge-refs.js";
import { useTOCItems } from "./index.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@fuma-translate/react";
import * as Primitive from "fumadocs-core/toc";
//#region src/components/toc/default.tsx
var default_exports = /* @__PURE__ */ __exportAll({
	TOCEmpty: () => TOCEmpty,
	TOCItem: () => TOCItem,
	TOCItems: () => TOCItems
});
function TOCItems({ ref, className, thumbBox = true, children, ...props }) {
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
				d += ` C ${upperX} ${top - 4} ${x} ${upperBottom + 4} ${x} ${top} L${x} ${bottom}`;
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
		const itemLineLengths = [];
		if (thumbBox) {
			const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			path.setAttribute("d", d);
			const n = path.getTotalLength();
			for (let i = 0; i < positions.length; i++) {
				const [top, bottom] = positions[i];
				let l = i > 0 ? itemLineLengths[i - 1][1] + (top - positions[i - 1][1]) : top;
				while (l < n && path.getPointAtLength(l).y < top) l++;
				itemLineLengths.push([l, l + bottom - top]);
			}
		}
		setSvg({
			content: output,
			width: w,
			height: h,
			d,
			itemLineLengths,
			positions
		});
	}, [items, thumbBox]);
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
		children: [svg && /* @__PURE__ */ jsx(ThumbTrack, {
			computed: svg,
			thumbBox
		}), children]
	});
}
function TOCEmpty() {
	return /* @__PURE__ */ jsx("div", {
		className: "rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground",
		children: useTranslations({ note: "table of contents" })("No Headings")
	});
}
function ThumbTrack({ computed, thumbBox }) {
	const ref = useRef(null);
	const previousRef = useRef(null);
	const tocInfo = Primitive.useTOC();
	function calculate(items) {
		const out = {};
		const startIdx = items.findIndex((item) => item.active);
		if (startIdx === -1) return out;
		const endIdx = items.findLastIndex((item) => item.active);
		out["--track-top"] = `${computed.positions[startIdx][0]}px`;
		out["--track-bottom"] = `${computed.positions[endIdx][1]}px`;
		if (thumbBox) {
			let isUp = false;
			if (previousRef.current) {
				const prev = previousRef.current;
				isUp = prev.startIdx > startIdx || prev.endIdx > endIdx || prev.startIdx === startIdx && prev.endIdx === endIdx && prev.isUp;
			}
			previousRef.current = {
				startIdx,
				endIdx,
				isUp
			};
			out["--offset-distance"] = isUp ? `${computed.itemLineLengths[startIdx][0]}px` : `${computed.itemLineLengths[endIdx][1]}px`;
			out["--opacity"] = items[isUp ? startIdx : endIdx].original._step !== void 0 ? "0" : "1";
		}
		return out;
	}
	Primitive.useTOCListener((items) => {
		const element = ref.current;
		if (!element) return;
		for (const [k, v] of Object.entries(calculate(items))) element.style.setProperty(k, v);
	});
	return /* @__PURE__ */ jsxs("div", {
		ref,
		className: "absolute top-0 inset-s-0 origin-center rtl:-scale-x-100",
		style: {
			width: computed.width,
			height: computed.height,
			...calculate(tocInfo.get())
		},
		children: [/* @__PURE__ */ jsx("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: `0 0 ${computed.width} ${computed.height}`,
			className: "absolute transition-[clip-path]",
			style: {
				width: computed.width,
				height: computed.height,
				clipPath: `polygon(0 var(--track-top,0), 100% var(--track-top,0), 100% var(--track-bottom,0), 0 var(--track-bottom,0))`
			},
			children: computed.content
		}), thumbBox && /* @__PURE__ */ jsx("div", {
			className: "absolute left-0 size-1 bg-fd-primary rounded-full [offset-distance:var(--offset-distance,0)] opacity-(--opacity,0) transition-[opacity,offset-distance]",
			style: { offsetPath: `path("${computed.d}")` }
		})]
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
	if (depth === 3) return 16;
	return 24;
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
						d: `M ${l0 + .5} 0 C ${l0 + .5} 8 ${l1 + .5} 4 ${l1 + .5} 12`,
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
export { TOCEmpty, TOCItem, TOCItems, default_exports };
