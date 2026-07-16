"use client";
import { useCallback, useEffect, useRef, useState } from "react";
//#region src/utils/use-copy-button.ts
function useCopyButton(onCopy) {
	const [checked, setChecked] = useState(false);
	const callbackRef = useRef(onCopy);
	const timeoutRef = useRef(null);
	callbackRef.current = onCopy;
	const onClick = useCallback(() => {
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		Promise.resolve(callbackRef.current()).then(() => {
			setChecked(true);
			timeoutRef.current = window.setTimeout(() => {
				setChecked(false);
			}, 1500);
		});
	}, []);
	useEffect(() => {
		return () => {
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		};
	}, []);
	return [checked, onClick];
}
//#endregion
export { useCopyButton };
