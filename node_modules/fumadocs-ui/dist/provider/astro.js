"use client";
import { RootProvider as RootProvider$1 } from "./base.js";
import { jsx } from "react/jsx-runtime";
import { AstroProvider } from "fumadocs-core/framework/astro";
//#region src/provider/astro.tsx
function RootProvider({ components, pathname, params, navigate, ...props }) {
	return /* @__PURE__ */ jsx(AstroProvider, {
		pathname,
		params,
		navigate,
		Link: components?.Link,
		Image: components?.Image,
		children: /* @__PURE__ */ jsx(RootProvider$1, {
			...props,
			children: props.children
		})
	});
}
//#endregion
export { RootProvider };
