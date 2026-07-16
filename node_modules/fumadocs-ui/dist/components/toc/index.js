"use client";
import { __exportAll } from "../../_virtual/_rolldown/runtime.js";
import { cn } from "../../utils/cn.js";
import { mergeRefs } from "../../utils/merge-refs.js";
import { jsx } from "react/jsx-runtime";
import { createContext, use, useRef } from "react";
import * as Primitive from "fumadocs-core/toc";
//#region src/components/toc/index.tsx
var toc_exports = /* @__PURE__ */ __exportAll({
	TOCProvider: () => TOCProvider,
	TOCScrollArea: () => TOCScrollArea,
	useActiveAnchor: () => useActiveAnchor,
	useActiveAnchors: () => useActiveAnchors,
	useItems: () => useItems,
	useTOCItems: () => useTOCItems
});
const TOCContext = createContext([]);
function useTOCItems() {
	return use(TOCContext);
}
const { useActiveAnchor, useActiveAnchors, useItems } = Primitive;
function TOCProvider({ toc, children, ...props }) {
	return /* @__PURE__ */ jsx(TOCContext, {
		value: toc,
		children: /* @__PURE__ */ jsx(Primitive.AnchorProvider, {
			toc,
			...props,
			children
		})
	});
}
function TOCScrollArea({ ref, className, ...props }) {
	const viewRef = useRef(null);
	return /* @__PURE__ */ jsx("div", {
		ref: mergeRefs(viewRef, ref),
		className: cn("relative min-h-0 text-sm ms-px overflow-auto [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3", className),
		...props,
		children: /* @__PURE__ */ jsx(Primitive.ScrollProvider, {
			containerRef: viewRef,
			children: props.children
		})
	});
}
//#endregion
export { TOCProvider, TOCScrollArea, toc_exports, useActiveAnchor, useActiveAnchors, useItems, useTOCItems };
