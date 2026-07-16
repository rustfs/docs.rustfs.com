"use client";
import { Link as Link$1 } from "./framework/index.js";
import { jsx } from "react/jsx-runtime";
//#region src/link.tsx
function Link({ ref, href = "#", external = !!(href.match(/^\w+:/) || href.startsWith("//")), prefetch, children, ...props }) {
	if (external) return /* @__PURE__ */ jsx("a", {
		ref,
		href,
		rel: "noreferrer noopener",
		target: "_blank",
		...props,
		children
	});
	return /* @__PURE__ */ jsx(Link$1, {
		ref,
		href,
		prefetch,
		...props,
		children
	});
}
//#endregion
export { Link, Link as default };
