import { cn } from "../utils/cn.js";
import { CodeBlock, Pre } from "./codeblock.js";
import { jsx } from "react/jsx-runtime";
import { highlight } from "fumadocs-core/highlight";
//#region src/components/codeblock.rsc.tsx
async function ServerCodeBlock({ code, codeblock, ...options }) {
	return await highlight(code, {
		defaultColor: false,
		...options,
		components: {
			pre: (props) => /* @__PURE__ */ jsx(CodeBlock, {
				...props,
				...codeblock,
				className: cn("my-0", props.className, codeblock?.className),
				children: /* @__PURE__ */ jsx(Pre, { children: props.children })
			}),
			...options.components
		}
	});
}
//#endregion
export { ServerCodeBlock };
