import { getScale } from "./get-scale.js";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/get-img-regular-style.js
const getImgRegularStyle = ({ containerHeight, containerLeft, containerTop, containerWidth, hasScalableSrc, offset, targetHeight, targetWidth }) => {
	const scale = getScale({
		containerHeight,
		containerWidth,
		hasScalableSrc,
		offset,
		targetHeight,
		targetWidth
	});
	return {
		top: containerTop,
		left: containerLeft,
		width: containerWidth * scale,
		height: containerHeight * scale,
		initialTransform: `translate(0,0) scale(${1 / scale})`
	};
};
//#endregion
export { getImgRegularStyle };
