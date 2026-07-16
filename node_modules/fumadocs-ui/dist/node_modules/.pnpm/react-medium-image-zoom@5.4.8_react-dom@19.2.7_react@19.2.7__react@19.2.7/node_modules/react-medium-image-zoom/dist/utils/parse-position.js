//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/utils/parse-position.js
const parsePosition = (position, relativeNum) => {
	const positionNum = parseFloat(position);
	return position.endsWith("%") ? relativeNum * positionNum / 100 : positionNum;
};
//#endregion
export { parsePosition };
