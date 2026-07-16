"use client";
import { Uncontrolled } from "../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/uncontrolled.js";
import "./image-zoom2.css";
import { Image } from "fumadocs-core/framework";
import { jsx } from "react/jsx-runtime";
//#region src/components/image-zoom.tsx
function getImageSrc(src) {
	if (typeof src === "string") return src;
	if (typeof src === "object") {
		if ("default" in src) return src.default.src;
		return src.src;
	}
	return "";
}
function ImageZoom({ zoomInProps, children, rmiz, ...props }) {
	return /* @__PURE__ */ jsx(Uncontrolled, {
		zoomMargin: 20,
		wrapElement: "span",
		...rmiz,
		zoomImg: {
			src: getImageSrc(props.src),
			sizes: void 0,
			...zoomInProps
		},
		children: children ?? /* @__PURE__ */ jsx(Image, {
			sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px",
			...props
		})
	});
}
//#endregion
export { ImageZoom };
