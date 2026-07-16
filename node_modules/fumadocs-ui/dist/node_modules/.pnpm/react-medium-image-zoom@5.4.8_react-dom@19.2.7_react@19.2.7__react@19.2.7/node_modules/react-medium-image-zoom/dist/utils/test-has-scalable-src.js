//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/test-has-scalable-src.js
const SRC_SVG_REGEX = /\.svg$/i;
const testHasScalableSrc = ({ hasZoomImg, imgSrc, isSvg }) => isSvg || imgSrc?.slice(0, 18) === "data:image/svg+xml" || hasZoomImg || imgSrc !== void 0 && SRC_SVG_REGEX.test(imgSrc);
//#endregion
export { testHasScalableSrc };
