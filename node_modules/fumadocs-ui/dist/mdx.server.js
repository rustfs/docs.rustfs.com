import defaultMdxComponents from "./mdx.js";
import { jsx } from "react/jsx-runtime";
//#region src/mdx.server.tsx
/**
* Extend the default Link component to resolve relative file paths in `href`.
*
* @param page the current page
* @param source the source object
* @param OverrideLink The component to override from
*/
function createRelativeLink(source, page, OverrideLink = defaultMdxComponents.a) {
	return async function RelativeLink({ href, ...props }) {
		return /* @__PURE__ */ jsx(OverrideLink, {
			href: href ? source.resolveHref(href, page) : href,
			...props
		});
	};
}
//#endregion
export { createRelativeLink, defaultMdxComponents as default };
