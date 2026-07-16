//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/element-tests.js
function isElement(el) {
	if (typeof Element === "undefined") return false;
	return el instanceof Element;
}
const testElType = (type, el) => isElement(el) && el.tagName.toUpperCase() === type;
const testDiv = (el) => testElType("DIV", el) || testElType("SPAN", el);
const testImg = (el) => testElType("IMG", el);
const testImgLoaded = (el) => el.complete && el.naturalHeight !== 0;
const testSvg = (el) => testElType("SVG", el);
//#endregion
export { testDiv, testImg, testImgLoaded, testSvg };
