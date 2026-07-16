import { testImg } from "./element-tests.js";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/get-img-alt.js
const getImgAlt = (imgEl) => {
	if (imgEl !== null) if (testImg(imgEl)) return imgEl.alt;
	else return imgEl.getAttribute("aria-label") ?? void 0;
};
//#endregion
export { getImgAlt };
