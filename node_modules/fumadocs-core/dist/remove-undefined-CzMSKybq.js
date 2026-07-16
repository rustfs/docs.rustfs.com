//#region src/utils/remove-undefined.ts
function removeUndefined(value, deep = false) {
	const obj = value;
	for (const key in obj) {
		if (obj[key] === void 0) delete obj[key];
		if (!deep) continue;
		const entry = obj[key];
		if (isPlainObject(entry)) {
			removeUndefined(entry, deep);
			continue;
		}
		if (Array.isArray(entry)) {
			for (const item of entry) if (isPlainObject(item)) removeUndefined(item, deep);
		}
	}
	return value;
}
function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null;
}
//#endregion
export { removeUndefined as t };
