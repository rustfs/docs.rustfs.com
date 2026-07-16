//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/get-scale.js
const getScaleToWindow = ({ height, offset, width }) => Math.min((window.innerWidth - offset * 2) / width, (window.innerHeight - offset * 2) / height);
const getScaleToWindowMax = ({ containerHeight, containerWidth, offset, targetHeight, targetWidth }) => {
	const scale = getScaleToWindow({
		height: targetHeight,
		offset,
		width: targetWidth
	});
	const ratio = targetWidth > targetHeight ? targetWidth / containerWidth : targetHeight / containerHeight;
	return scale > 1 ? ratio : scale * ratio;
};
const getScale = ({ containerHeight, containerWidth, hasScalableSrc, offset, targetHeight, targetWidth }) => {
	if (containerHeight === 0 || containerWidth === 0) return 1;
	return !hasScalableSrc && targetHeight !== 0 && targetWidth !== 0 ? getScaleToWindowMax({
		containerHeight,
		containerWidth,
		offset,
		targetHeight,
		targetWidth
	}) : getScaleToWindow({
		height: containerHeight,
		offset,
		width: containerWidth
	});
};
//#endregion
export { getScale };
