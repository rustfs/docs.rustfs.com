import { a as loadMissingTheme, i as loadMissingLanguage, t as applyDefaultThemes } from "../utils-D2T58c9w.js";
import { highlightHast as highlightHast$1 } from "./shiki/index.js";
import { defaultShikiFactory, wasmShikiFactory } from "./shiki/full.js";
import * as JsxRuntime from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
//#region src/highlight/index.ts
async function highlightHast(code, options) {
	return highlightHast$1(await ((options.engine ?? "js") === "js" ? defaultShikiFactory : wasmShikiFactory).getOrInit(), code, applyDefaultThemes(options));
}
/**
* Get Shiki highlighter instance of Fumadocs (mostly for internal use, you should use Shiki directly over this).
*
* @param engineType - Shiki Regex engine to use.
* @param options - Shiki options.
*/
async function getHighlighter(engineType, options = {}) {
	const instance = await (engineType === "js" ? defaultShikiFactory : wasmShikiFactory).getOrInit();
	await Promise.all([options.langs && loadMissingLanguage(instance, options.langs), options.themes && loadMissingTheme(instance, options.themes)]);
	return instance;
}
async function highlight(code, options) {
	return toJsxRuntime(await highlightHast(code, options), {
		...JsxRuntime,
		development: false,
		components: options.components
	});
}
//#endregion
export { getHighlighter, highlight, highlightHast };
