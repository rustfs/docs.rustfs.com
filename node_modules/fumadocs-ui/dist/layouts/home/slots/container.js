"use client";
import { cn } from "../../../utils/cn.js";
import { jsx } from "react/jsx-runtime";
//#region src/layouts/home/slots/container.tsx
function Container(props) {
	return /* @__PURE__ */ jsx("main", {
		id: "nd-home-layout",
		...props,
		className: cn("flex flex-1 flex-col [--fd-layout-width:1400px]", props.className)
	});
}
//#endregion
export { Container };
