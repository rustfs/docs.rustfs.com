"use client";
import { useParams } from "./framework/index.js";
import { Link } from "./link.js";
import { useMemo } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/dynamic-link.tsx
/**
* Extends the default `Link` component
*
* It supports dynamic hrefs, which means you can use `/[lang]/my-page` with `dynamicHrefs` enabled
*/
function DynamicLink({ href, ref, ...props }) {
	const params = useParams();
	return /* @__PURE__ */ jsx(Link, {
		ref,
		href: useMemo(() => href ? updateHref(href, params) : href, [params, href]),
		...props
	});
}
function updateHref(href, params) {
	return href.replace(/\[(.*)]\/?/, (match, key) => {
		const hasEndingSlash = match[match.length - 1] === "/";
		const value = key in params ? params[key] : void 0;
		if (!value) return "";
		const replacement = typeof value === "string" ? value : value.join("/");
		return hasEndingSlash ? `${replacement}/` : replacement;
	});
}
//#endregion
export { DynamicLink, DynamicLink as default, updateHref };
