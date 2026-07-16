import { useEffect, useState } from "react";
//#region src/utils/use-media-query.ts
function useMediaQuery(query, disabled = false) {
	const [isMatch, setMatch] = useState(null);
	useEffect(() => {
		if (disabled) return;
		const mediaQueryList = window.matchMedia(query);
		const handleChange = () => {
			setMatch(mediaQueryList.matches);
		};
		handleChange();
		mediaQueryList.addEventListener("change", handleChange);
		return () => {
			mediaQueryList.removeEventListener("change", handleChange);
		};
	}, [disabled, query]);
	return isMatch;
}
//#endregion
export { useMediaQuery };
