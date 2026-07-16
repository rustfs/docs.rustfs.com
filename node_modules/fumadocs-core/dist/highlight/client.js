"use client";
import { t as applyDefaultThemes } from "../utils-D2T58c9w.js";
import { useShiki as useShiki$1 } from "./shiki/react.js";
import { defaultShikiFactory } from "./shiki/full.js";
//#region src/highlight/client.ts
/**
* get highlighted results, should be used with React Suspense API.
*
* note: results are cached with (lang, code) as keys, if this is not the desired behaviour, pass a `deps` instead.
*/
function useShiki(code, options, deps) {
	return useShiki$1(() => defaultShikiFactory.getOrInit(), code, applyDefaultThemes(options), deps);
}
//#endregion
export { useShiki };
