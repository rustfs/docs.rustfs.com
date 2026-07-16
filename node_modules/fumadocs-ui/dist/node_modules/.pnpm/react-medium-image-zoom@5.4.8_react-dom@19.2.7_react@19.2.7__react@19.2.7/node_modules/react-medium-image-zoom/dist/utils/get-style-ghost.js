import { testSvg } from "./element-tests.js";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/get-style-ghost.js
const getStyleGhost = (imgEl) => {
	if (imgEl == null) return {};
	if (testSvg(imgEl)) {
		const { parentElement: parentEl } = imgEl;
		const rect = imgEl.getBoundingClientRect();
		if (parentEl == null) return {
			height: rect.height,
			left: rect.left,
			width: rect.width,
			top: rect.top
		};
		else {
			const parentRect = parentEl.getBoundingClientRect();
			return {
				height: rect.height,
				left: parentRect.left - rect.left,
				top: parentRect.top - rect.top,
				width: rect.width
			};
		}
	} else return {
		height: imgEl.offsetHeight,
		left: imgEl.offsetLeft,
		width: imgEl.offsetWidth,
		top: imgEl.offsetTop
	};
};
//#endregion
export { getStyleGhost };
