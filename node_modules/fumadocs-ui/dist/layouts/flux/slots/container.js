"use client";
import { cn } from "../../../utils/cn.js";
import { jsx } from "react/jsx-runtime";
//#region src/layouts/flux/slots/container.tsx
function Container(props) {
	return /* @__PURE__ */ jsx("div", {
		id: "nd-flux-layout",
		...props,
		className: cn("flex flex-col items-center pb-24 overflow-x-clip", props.className)
	});
}
//#endregion
export { Container };
