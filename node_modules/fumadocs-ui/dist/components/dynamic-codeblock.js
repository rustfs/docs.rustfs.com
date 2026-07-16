"use client";
import { DynamicCodeBlock as DynamicCodeBlock$1 } from "./dynamic-codeblock.core.js";
import { jsx } from "react/jsx-runtime";
import { defaultShikiFactory } from "fumadocs-core/highlight/shiki/full";
//#region src/components/dynamic-codeblock.tsx
function DynamicCodeBlock(props) {
	return /* @__PURE__ */ jsx(DynamicCodeBlock$1, {
		highlighter: () => defaultShikiFactory.getOrInit(),
		options: { themes: {
			light: "github-light",
			dark: "github-dark"
		} },
		...props
	});
}
//#endregion
export { DynamicCodeBlock };
