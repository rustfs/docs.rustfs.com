import { n as __exportAll } from "./rolldown-runtime-B-1-B7_t.js";
//#region src/source/path.ts
var path_exports = /* @__PURE__ */ __exportAll({
	basename: () => basename,
	dirname: () => dirname,
	extname: () => extname,
	joinPath: () => joinPath,
	normalize: () => normalize,
	slash: () => slash,
	splitPath: () => splitPath
});
function basename(path, ext) {
	const idx = path.lastIndexOf("/");
	return path.substring(idx === -1 ? 0 : idx + 1, ext ? path.length - ext.length : path.length);
}
function extname(path) {
	for (let i = path.length - 1; i >= 0; i--) {
		const c = path[i];
		if (c === ".") return path.substring(i);
		if (c === "/") return "";
	}
	return "";
}
function dirname(path) {
	const idx = path.lastIndexOf("/");
	if (idx === -1) return "";
	return path.substring(0, idx);
}
/**
* Split path into segments, trailing/leading slashes are removed
*/
function splitPath(path) {
	return path.split("/").filter((p) => p.length > 0);
}
/**
* Resolve paths, slashes within the path will be ignored
* @param paths - Paths to join
* @example
* ```
* ['a','b'] // 'a/b'
* ['/a'] // 'a'
* ['a', '/b'] // 'a/b'
* ['a', '../b/c'] // 'b/c'
* ```
*/
function joinPath(...paths) {
	const out = [];
	for (const path of paths) for (const seg of path.split("/")) switch (seg) {
		case "..":
			out.pop();
			break;
		case "":
		case ".": break;
		default: out.push(seg);
	}
	return out.join("/");
}
function slash(path) {
	if (path.startsWith("\\\\?\\")) return path;
	return path.replaceAll("\\", "/");
}
/**
* Convert (relative) file path to virtual file path.
*
* @param path - Relative path
* @returns Normalized path, with no trailing/leading slashes
* @throws Throws error if path starts with `./` or `../`
*/
function normalize(path) {
	const segments = path.split(/\/|\\/).filter((v) => v.length > 0);
	if (segments[0] === "." || segments[0] === "..") throw new Error("It must not start with './' or '../'");
	return segments.join("/");
}
//#endregion
export { normalize as a, joinPath as i, dirname as n, path_exports as o, extname as r, basename as t };
