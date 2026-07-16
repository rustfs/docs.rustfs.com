import { getScale } from "./get-scale.js";
import { computePositionedStyle } from "./compute-positioned-style.js";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/get-img-object-fit-style.js
const getImgObjectFitStyle = ({ containerHeight, containerLeft, containerTop, containerWidth, hasScalableSrc, objectFit: objectFitParam, objectPosition, offset, targetHeight, targetWidth }) => {
	let resolvedObjectFit = objectFitParam;
	if (resolvedObjectFit === "scale-down") if (targetWidth <= containerWidth && targetHeight <= containerHeight) resolvedObjectFit = "none";
	else resolvedObjectFit = "contain";
	const base = {
		containerHeight,
		containerLeft,
		containerTop,
		containerWidth,
		hasScalableSrc,
		offset,
		position: objectPosition,
		targetHeight,
		targetWidth
	};
	if (resolvedObjectFit === "cover" || resolvedObjectFit === "contain") {
		const widthRatio = containerWidth / targetWidth;
		const heightRatio = containerHeight / targetHeight;
		const ratio = resolvedObjectFit === "cover" ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio);
		return computePositionedStyle({
			...base,
			visibleWidth: targetWidth * ratio,
			visibleHeight: targetHeight * ratio
		});
	} else if (resolvedObjectFit === "none") return computePositionedStyle({
		...base,
		visibleWidth: targetWidth,
		visibleHeight: targetHeight
	});
	else {
		const widthRatio = containerWidth / targetWidth;
		const heightRatio = containerHeight / targetHeight;
		const ratio = Math.max(widthRatio, heightRatio);
		const scale = getScale({
			containerHeight: targetHeight * ratio,
			containerWidth: targetWidth * ratio,
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
	}
};
//#endregion
export { getImgObjectFitStyle };
