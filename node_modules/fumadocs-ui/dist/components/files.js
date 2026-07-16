"use client";
import { cn } from "../utils/cn.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { FileIcon, FolderIcon, FolderOpen } from "lucide-react";
import { cva } from "class-variance-authority";
import { useState } from "react";
//#region src/components/files.tsx
const itemVariants = cva("flex flex-row items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4");
function Files({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("not-prose rounded-md border bg-fd-card p-2", className),
		...props,
		children: props.children
	});
}
function File({ name, icon = /* @__PURE__ */ jsx(FileIcon, {}), className, ...rest }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn(itemVariants({ className })),
		...rest,
		children: [icon, name]
	});
}
function Folder({ name, defaultOpen = false, ...props }) {
	const [open, setOpen] = useState(defaultOpen);
	return /* @__PURE__ */ jsxs(Collapsible, {
		open,
		onOpenChange: setOpen,
		...props,
		children: [/* @__PURE__ */ jsxs(CollapsibleTrigger, {
			className: cn(itemVariants({ className: "w-full" })),
			children: [open ? /* @__PURE__ */ jsx(FolderOpen, {}) : /* @__PURE__ */ jsx(FolderIcon, {}), name]
		}), /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx("div", {
			className: "ms-2 flex flex-col border-l ps-2",
			children: props.children
		}) })]
	});
}
//#endregion
export { File, Files, Folder };
