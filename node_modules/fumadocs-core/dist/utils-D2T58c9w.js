//#region src/highlight/utils.ts
async function loadMissingTheme(highlighter, themes) {
	const bundled = highlighter.getBundledThemes();
	const missingThemes = themes.filter((theme) => {
		if (typeof theme === "string" && !(theme in bundled)) return false;
		try {
			highlighter.getTheme(theme);
			return false;
		} catch {
			return true;
		}
	});
	if (missingThemes.length > 0) await highlighter.loadTheme(...missingThemes);
}
async function loadMissingLanguage(highlighter, langs) {
	const bundled = highlighter.getBundledLanguages();
	const missingLangs = langs.filter((lang) => {
		if (typeof lang === "string" && !(lang in bundled)) return false;
		try {
			highlighter.getLanguage(lang);
			return false;
		} catch {
			return true;
		}
	});
	if (missingLangs.length > 0) await highlighter.loadLanguage(...missingLangs);
}
function getRequiredThemes(options) {
	if ("theme" in options) return [options.theme];
	else return Object.values(options.themes).filter((v) => v !== void 0);
}
function applyDefaultThemes(options, defaultValue = defaultThemes) {
	if (!("theme" in options) && !("themes" in options)) return {
		...defaultValue,
		...options
	};
	else return options;
}
const defaultThemes = {
	themes: {
		light: "github-light",
		dark: "github-dark"
	},
	defaultColor: false
};
//#endregion
export { loadMissingTheme as a, loadMissingLanguage as i, defaultThemes as n, getRequiredThemes as r, applyDefaultThemes as t };
