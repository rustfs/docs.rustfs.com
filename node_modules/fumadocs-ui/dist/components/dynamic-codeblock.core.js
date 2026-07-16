"use client";
import { cn } from "../utils/cn.js";
import { CodeBlock, Pre } from "./codeblock.js";
import { jsx } from "react/jsx-runtime";
import { createContext, use, useId } from "react";
import { useShikiDynamic } from "fumadocs-core/highlight/shiki/react";
//#region src/components/dynamic-codeblock.core.tsx
const PropsContext = createContext(void 0);
function DefaultPre(props) {
	const extraProps = use(PropsContext);
	return /* @__PURE__ */ jsx(CodeBlock, {
		...props,
		...extraProps,
		className: cn("my-0", props.className, extraProps?.className),
		children: /* @__PURE__ */ jsx(Pre, { children: props.children })
	});
}
function DynamicCodeBlock({ lang, code, codeblock, options, wrapInSuspense = true, highlighter }) {
	const id = useId();
	const shikiOptions = {
		lang,
		defaultColor: false,
		...options,
		components: {
			pre: DefaultPre,
			...options.components
		}
	};
	let node = useShikiDynamic(highlighter, code, shikiOptions, [
		id,
		lang,
		code
	]);
	if (wrapInSuspense) node ??= /* @__PURE__ */ jsx(Placeholder, {
		code,
		components: shikiOptions.components
	});
	return /* @__PURE__ */ jsx(PropsContext, {
		value: codeblock,
		children: node
	});
}
function Placeholder({ code, components = {} }) {
	const { pre: Pre = "pre", code: Code = "code" } = components;
	return /* @__PURE__ */ jsx(Pre, { children: /* @__PURE__ */ jsx(Code, { children: code.split("\n").map((line, i) => /* @__PURE__ */ jsx("span", {
		className: "line",
		children: line
	}, i)) }) });
}
//#endregion
export { DynamicCodeBlock };
