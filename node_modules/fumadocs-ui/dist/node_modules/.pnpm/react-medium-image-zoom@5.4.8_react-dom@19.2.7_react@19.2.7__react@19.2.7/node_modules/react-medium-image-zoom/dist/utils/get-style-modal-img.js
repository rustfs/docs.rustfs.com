import { testDiv } from "./element-tests.js";
import { getImgRegularStyle } from "./get-img-regular-style.js";
import { getImgObjectFitStyle } from "./get-img-object-fit-style.js";
import { getDivImgStyle } from "./get-div-img-style.js";
import { getModalImgTransform } from "./get-modal-img-transform.js";
import { getTargetDimension } from "./get-target-dimension.js";
import { testHasScalableSrc } from "./test-has-scalable-src.js";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/get-style-modal-img.js
const getStyleModalImg = ({ hasZoomImg, imgSrc, isSvg, isZoomed, loadedImgEl, offset, shouldRefresh, targetEl }) => {
	const hasScalableSrc = testHasScalableSrc({
		hasZoomImg,
		imgSrc,
		isSvg
	});
	const imgRect = targetEl.getBoundingClientRect();
	const targetElComputedStyle = window.getComputedStyle(targetEl);
	const isDivImg = loadedImgEl != null && testDiv(targetEl);
	const isImgObjectFit = loadedImgEl != null && !isDivImg;
	const targetHeight = getTargetDimension({
		fallback: imgRect.height,
		natural: loadedImgEl?.naturalHeight
	});
	const targetWidth = getTargetDimension({
		fallback: imgRect.width,
		natural: loadedImgEl?.naturalWidth
	});
	const { height: containerHeight, left: containerLeft, top: containerTop, width: containerWidth } = imgRect;
	const position = isDivImg ? getDivImgStyle({
		backgroundPosition: targetElComputedStyle.backgroundPosition,
		backgroundSize: targetElComputedStyle.backgroundSize,
		containerHeight,
		containerLeft,
		containerTop,
		containerWidth,
		hasScalableSrc,
		offset,
		targetHeight,
		targetWidth
	}) : isImgObjectFit ? getImgObjectFitStyle({
		containerHeight,
		containerLeft,
		containerTop,
		containerWidth,
		hasScalableSrc,
		objectFit: targetElComputedStyle.objectFit,
		objectPosition: targetElComputedStyle.objectPosition,
		offset,
		targetHeight,
		targetWidth
	}) : getImgRegularStyle({
		containerHeight,
		containerLeft,
		containerTop,
		containerWidth,
		hasScalableSrc,
		offset,
		targetHeight,
		targetWidth
	});
	const result = {
		top: position.top,
		left: position.left,
		width: position.width,
		height: position.height,
		transform: getModalImgTransform({
			...position,
			isZoomed,
			userTransform: targetElComputedStyle.transform
		})
	};
	if (isZoomed && shouldRefresh) result.transitionDuration = "0.01ms";
	return result;
};
//#endregion
export { getStyleModalImg };
