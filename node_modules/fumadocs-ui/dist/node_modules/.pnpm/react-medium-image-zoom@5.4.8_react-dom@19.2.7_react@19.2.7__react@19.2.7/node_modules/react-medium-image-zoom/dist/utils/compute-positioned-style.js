import { getScale } from "./get-scale.js";
import { parsePosition } from "./parse-position.js";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/compute-positioned-style.js
const computePositionedStyle = ({ containerHeight, containerLeft, containerTop, containerWidth, hasScalableSrc, offset, position, targetHeight, targetWidth, visibleHeight, visibleWidth }) => {
	const [posLeft = "50%", posTop = "50%"] = position.split(" ");
	const posX = parsePosition(posLeft, containerWidth - visibleWidth);
	const posY = parsePosition(posTop, containerHeight - visibleHeight);
	const scale = getScale({
		containerHeight: visibleHeight,
		containerWidth: visibleWidth,
		hasScalableSrc,
		offset,
		targetHeight,
		targetWidth
	});
	return {
		top: containerTop + posY,
		left: containerLeft + posX,
		width: visibleWidth * scale,
		height: visibleHeight * scale,
		initialTransform: `translate(0,0) scale(${1 / scale})`
	};
};
//#endregion
export { computePositionedStyle };
