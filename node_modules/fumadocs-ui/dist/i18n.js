import keys_default from "./.translations/keys.js";
//#region src/i18n.tsx
function uiTranslations() {
	return { keys: keys_default };
}
function i18nProvider(translations, lang) {
	const t = translations.extend(uiTranslations());
	if ("config" in t) {
		const { defaultLanguage, languages } = t.config;
		const locale = lang ?? defaultLanguage;
		return {
			locale: lang,
			translations: t.get(locale) ?? t.get(defaultLanguage),
			locales: languages.map((code) => ({
				locale: code,
				name: t.get(code).displayName ?? "English"
			}))
		};
	}
	return { translations: t.get() };
}
function defineI18nUI(config, localeTranslations = {}) {
	return {
		...config,
		provider(locale = config.defaultLanguage) {
			return {
				locale,
				translations: localeTranslations[locale],
				locales: config.languages.map((code) => ({
					locale: code,
					name: localeTranslations[code]?.displayName ?? code
				}))
			};
		}
	};
}
//#endregion
export { defineI18nUI, i18nProvider, uiTranslations };
