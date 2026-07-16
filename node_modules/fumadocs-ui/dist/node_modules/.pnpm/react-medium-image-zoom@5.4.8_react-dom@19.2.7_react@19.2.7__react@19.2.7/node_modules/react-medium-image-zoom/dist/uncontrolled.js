import { Controlled } from "./controlled.js";
import React from "react";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/uncontrolled.js
function Uncontrolled({ onZoomChange, ...props }) {
	const [isZoomed, setIsZoomed] = React.useState(false);
	const handleZoomChange = React.useCallback((value, { event }) => {
		setIsZoomed(value);
		onZoomChange?.(value, { event });
	}, [onZoomChange]);
	return React.createElement(Controlled, {
		...props,
		isZoomed,
		onZoomChange: handleZoomChange
	});
}
//#endregion
export { Uncontrolled };
