"use client";
import { cn } from "../../../../utils/cn.js";
import { useDocsPage } from "../index.js";
import { jsx } from "react/jsx-runtime";
//#region src/layouts/docs/page/slots/container.tsx
function Container(props) {
	const { full } = useDocsPage();
	return /* @__PURE__ */ jsx("article", {
		id: "nd-page",
		"data-full": full,
		...props,
		className: cn("flex flex-col w-full max-w-[900px] mx-auto [grid-area:main] px-4 py-6 gap-4 md:px-6 md:pt-8 xl:px-8 xl:pt-14", full && "max-w-[1168px]", props.className),
		children: props.children
	});
}
//#endregion
export { Container };
