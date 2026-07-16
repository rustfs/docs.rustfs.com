"use client";
import { RootProvider as RootProvider$1 } from "./base.js";
import { jsx } from "react/jsx-runtime";
import { WakuProvider } from "fumadocs-core/framework/waku";
//#region src/provider/waku.tsx
function RootProvider({ components, ...props }) {
	return /* @__PURE__ */ jsx(WakuProvider, {
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
