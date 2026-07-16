import { jsx, jsxs } from "react/jsx-runtime";
import { ImageResponse } from "next/og.js";
//#region src/og.tsx
function generateOGImage(options) {
	const { title, description, icon, site, primaryColor, primaryTextColor, ...rest } = options;
	return new ImageResponse(generate({
		title,
		description,
		icon,
		site,
		primaryTextColor,
		primaryColor
	}), {
		width: 1200,
		height: 630,
		...rest
	});
}
function generate({ primaryColor = "rgba(255,150,255,0.3)", primaryTextColor = "rgb(255,150,255)", icon = /* @__PURE__ */ jsx("svg", {
	xmlns: "http://www.w3.org/2000/svg",
	width: "56",
	height: "56",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	className: "lucide lucide-book-icon lucide-book",
	children: /* @__PURE__ */ jsx("circle", {
		cx: "12",
		cy: "12",
		r: "11",
		stroke: primaryTextColor,
		strokeWidth: "2"
	})
}), ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			width: "100%",
			height: "100%",
			color: "white",
			padding: "4rem",
			backgroundColor: "#0c0c0c",
			borderBottom: `18px solid ${primaryColor}`
		},
		children: [
			/* @__PURE__ */ jsx("p", {
				style: {
					fontWeight: 800,
					fontSize: "82px",
					margin: 0
				},
				children: props.title
			}),
			/* @__PURE__ */ jsx("p", {
				style: {
					fontSize: "52px",
					color: "rgba(240,240,240,0.8)",
					margin: 0,
					marginTop: "16px",
					paddingBottom: "28px",
					borderBottom: `10px dashed ${primaryColor}`
				},
				children: props.description
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: "20px",
					marginTop: "auto",
					color: primaryTextColor
				},
				children: [icon, props.site && /* @__PURE__ */ jsx("p", {
					style: {
						fontSize: "56px",
						fontWeight: 600,
						margin: 0
					},
					children: props.site
				})]
			})
		]
	});
}
//#endregion
export { generate, generateOGImage };
