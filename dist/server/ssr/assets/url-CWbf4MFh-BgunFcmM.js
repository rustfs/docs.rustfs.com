//#region node_modules/fumadocs-core/dist/url-CWbf4MFh.js
/**
* The base path (Vite), always ends with `/`.
*/
var BASE_PATH = "/";
if (!BASE_PATH.endsWith("/")) BASE_PATH += "/";
/**
* normalize URL into the Fumadocs standard form (`/slug-1/slug-2`).
*
* This includes URLs with trailing slashes.
*/
function normalizeUrl(url) {
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (!url.startsWith("/")) url = "/" + url;
	if (url.length > 1 && url.endsWith("/")) url = url.slice(0, -1);
	return url;
}
//#endregion
export { normalizeUrl as n, BASE_PATH as t };
