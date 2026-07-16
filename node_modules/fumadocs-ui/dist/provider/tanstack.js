"use client";
import { RootProvider as RootProvider$1 } from "./base.js";
import { jsx } from "react/jsx-runtime";
import { TanstackProvider } from "fumadocs-core/framework/tanstack";
//#region src/provider/tanstack.tsx
function RootProvider({ components, ...props }) {
	return /* @__PURE__ */ jsx(TanstackProvider, {
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
