import { a as loadMissingTheme, r as getRequiredThemes } from "../../utils-D2T58c9w.js";
//#region src/highlight/shiki/index.ts
function createShikiFactory(config) {
	let instance;
	return {
		init(options) {
			return instance = config.init(options);
		},
		getOrInit() {
			return instance ?? this.init();
		}
	};
}
async function highlightHast(highlighter, code, options) {
	const { fallbackLanguage = "text", ...resolved } = options;
	const { isSpecialLang } = await import("shiki/core");
	if (!isSpecialLang(resolved.lang) && !(resolved.lang in highlighter.getBundledLanguages()) && !highlighter.getLoadedLanguages().includes(resolved.lang)) resolved.lang = fallbackLanguage;
	await Promise.all([loadMissingTheme(highlighter, getRequiredThemes(resolved)), highlighter.loadLanguage(resolved.lang)]);
	return highlighter.codeToHast(code, resolved);
}
//#endregion
export { createShikiFactory, highlightHast };
