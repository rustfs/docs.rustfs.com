import { createShikiFactory } from "./index.js";
//#region src/highlight/shiki/full.ts
const defaultShikiFactory = createShikiFactory({ async init(options) {
	const { createHighlighter, createJavaScriptRegexEngine } = await import("shiki");
	return createHighlighter({
		langs: [],
		themes: [],
		langAlias: options?.langAlias,
		engine: createJavaScriptRegexEngine()
	});
} });
/** factory using the WASM powered Regex engine */
const wasmShikiFactory = createShikiFactory({ async init(options) {
	const { createHighlighter, createOnigurumaEngine } = await import("shiki");
	return createHighlighter({
		langs: [],
		themes: [],
		langAlias: options?.langAlias,
		engine: createOnigurumaEngine(import("shiki/wasm"))
	});
} });
//#endregion
export { defaultShikiFactory, wasmShikiFactory };
