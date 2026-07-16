"use client";
import { RootProvider as RootProvider$1 } from "./base.js";
import { jsx } from "react/jsx-runtime";
import { ReactRouterProvider } from "fumadocs-core/framework/react-router";
//#region src/provider/react-router.tsx
function RootProvider({ components, ...props }) {
	return /* @__PURE__ */ jsx(ReactRouterProvider, {
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
