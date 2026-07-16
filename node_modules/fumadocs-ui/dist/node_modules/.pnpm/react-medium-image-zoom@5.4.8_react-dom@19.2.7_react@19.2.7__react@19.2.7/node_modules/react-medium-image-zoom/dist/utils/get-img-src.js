import { testDiv, testImg } from "./element-tests.js";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/get-img-src.js
const URL_REGEX = /url(?:\(['"]?)(?<url>.*?)(?:['"]?\))/;
const getImgSrc = (imgEl) => {
	if (imgEl !== null) {
		if (testImg(imgEl)) return imgEl.currentSrc === "" ? void 0 : imgEl.currentSrc;
		else if (testDiv(imgEl)) {
			const { backgroundImage: bgImg } = window.getComputedStyle(imgEl);
			if (bgImg !== "") return URL_REGEX.exec(bgImg)?.[1];
		}
	}
};
//#endregion
export { getImgSrc };
