import { parsePosition } from "./parse-position.js";
import { computePositionedStyle } from "./compute-positioned-style.js";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/get-div-img-style.js
const getDivImgStyle = ({ backgroundPosition, backgroundSize, containerHeight, containerLeft, containerTop, containerWidth, hasScalableSrc, offset, targetHeight, targetWidth }) => {
	const base = {
		containerHeight,
		containerLeft,
		containerTop,
		containerWidth,
		hasScalableSrc,
		offset,
		position: backgroundPosition,
		targetHeight,
		targetWidth
	};
	if (backgroundSize === "cover" || backgroundSize === "contain") {
		const widthRatio = containerWidth / targetWidth;
		const heightRatio = containerHeight / targetHeight;
		const ratio = backgroundSize === "cover" ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio);
		return computePositionedStyle({
			...base,
			visibleWidth: targetWidth * ratio,
			visibleHeight: targetHeight * ratio
		});
	} else if (backgroundSize === "auto") return computePositionedStyle({
		...base,
		visibleWidth: targetWidth,
		visibleHeight: targetHeight
	});
	else {
		const [sizeW = "50%", sizeH = "50%"] = backgroundSize.split(" ");
		const sizeWidth = parsePosition(sizeW, containerWidth);
		const sizeHeight = parsePosition(sizeH, containerHeight);
		const widthRatio = sizeWidth / targetWidth;
		const heightRatio = sizeHeight / targetHeight;
		const ratio = Math.min(widthRatio, heightRatio);
		return computePositionedStyle({
			...base,
			visibleWidth: targetWidth * ratio,
			visibleHeight: targetHeight * ratio
		});
	}
};
//#endregion
export { getDivImgStyle };
