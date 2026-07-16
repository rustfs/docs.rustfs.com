import { cn } from "../utils/cn.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { CircleCheck, CircleX, Info, Lightbulb, TriangleAlert } from "lucide-react";
//#region src/components/callout.tsx
const iconClass = "size-5 -me-0.5 fill-(--callout-color) text-fd-card";
function Callout({ children, title, ...props }) {
	return /* @__PURE__ */ jsxs(CalloutContainer, {
		...props,
		children: [title && /* @__PURE__ */ jsx(CalloutTitle, { children: title }), /* @__PURE__ */ jsx(CalloutDescription, { children })]
	});
}
function resolveAlias(type) {
	if (type === "warn") return "warning";
	if (type === "tip") return "info";
	return type;
}
function CalloutContainer({ type: inputType = "info", icon, children, className, style, ...props }) {
	const type = resolveAlias(inputType);
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex gap-2 my-4 rounded-xl border bg-fd-card p-3 ps-1 text-sm text-fd-card-foreground shadow-md", className),
		style: {
			"--callout-color": `var(--color-fd-${type}, var(--color-fd-muted))`,
			...style
		},
		...props,
		children: [
			/* @__PURE__ */ jsx("div", {
				role: "none",
				className: "w-0.5 bg-(--callout-color)/50 rounded-sm"
			}),
			icon ?? {
				info: /* @__PURE__ */ jsx(Info, { className: iconClass }),
				warning: /* @__PURE__ */ jsx(TriangleAlert, { className: iconClass }),
				error: /* @__PURE__ */ jsx(CircleX, { className: iconClass }),
				success: /* @__PURE__ */ jsx(CircleCheck, { className: iconClass }),
				idea: /* @__PURE__ */ jsx(Lightbulb, { className: "size-5 -me-0.5 fill-(--callout-color) text-(--callout-color)" })
			}[type],
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-col gap-2 min-w-0 flex-1",
				children
			})
		]
	});
}
function CalloutTitle({ children, className, ...props }) {
	return /* @__PURE__ */ jsx("p", {
		className: cn("font-medium my-0!", className),
		...props,
		children
	});
}
function CalloutDescription({ children, className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("text-fd-muted-foreground prose-no-margin empty:hidden", className),
		...props,
		children
	});
}
//#endregion
export { Callout, CalloutContainer, CalloutDescription, CalloutTitle };
