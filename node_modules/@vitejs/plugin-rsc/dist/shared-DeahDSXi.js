//#region src/plugins/shared.ts
function toCssVirtual({ id, type }) {
	return `virtual:vite-rsc/css?type=${type}&id=${encodeURIComponent(id)}&lang.js`;
}
function parseCssVirtual(id) {
	if (id.startsWith("\0virtual:vite-rsc/css?")) return parseIdQuery(id).query;
}
function parseIdQuery(id) {
	if (!id.includes("?")) return {
		filename: id,
		query: {}
	};
	const [filename, rawQuery] = id.split(`?`, 2);
	return {
		filename,
		query: Object.fromEntries(new URLSearchParams(rawQuery))
	};
}
function toReferenceValidationVirtual({ id, type }) {
	return `virtual:vite-rsc/reference-validation?type=${type}&id=${encodeURIComponent(id)}&lang.js`;
}
function parseReferenceValidationVirtual(id) {
	if (id.startsWith("\0virtual:vite-rsc/reference-validation?")) return parseIdQuery(id).query;
}
//#endregion
export { toReferenceValidationVirtual as a, toCssVirtual as i, parseIdQuery as n, parseReferenceValidationVirtual as r, parseCssVirtual as t };
