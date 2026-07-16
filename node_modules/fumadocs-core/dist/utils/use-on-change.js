import { t as isEqualShallow } from "../is-equal-LdLqRs0o.js";
import { useState } from "react";
//#region src/utils/use-on-change.ts
/**
* @param value - state to watch
* @param onChange - when the state changed
* @param isUpdated - a function that determines if the state is updated
*/
function useOnChange(value, onChange, isUpdated = (a, b) => !isEqualShallow(a, b)) {
	const [prev, setPrev] = useState(value);
	if (isUpdated(prev, value)) {
		onChange(value, prev);
		setPrev(value);
	}
}
//#endregion
export { useOnChange };
