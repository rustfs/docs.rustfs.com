//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/get-modal-img-transform.js
const getModalImgTransform = ({ height, initialTransform, isZoomed, left, top, userTransform, width }) => {
	let centeredUserTransform = "";
	if (userTransform !== "none" && userTransform !== "") {
		const halfWidth = width / 2;
		const halfHeight = height / 2;
		centeredUserTransform = `translate(${halfWidth}px,${halfHeight}px) ${userTransform} translate(${-halfWidth}px,${-halfHeight}px)`;
	}
	if (!isZoomed) {
		if (centeredUserTransform === "") return initialTransform;
		return `${initialTransform} ${centeredUserTransform}`;
	}
	const viewportX = window.innerWidth / 2;
	const viewportY = window.innerHeight / 2;
	const childCenterX = left + width / 2;
	const childCenterY = top + height / 2;
	const base = `translate(${viewportX - childCenterX}px,${viewportY - childCenterY}px) scale(1)`;
	if (centeredUserTransform === "") return base;
	return `${base} ${centeredUserTransform}`;
};
//#endregion
export { getModalImgTransform };
