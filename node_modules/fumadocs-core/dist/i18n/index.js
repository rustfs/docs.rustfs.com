//#region src/i18n/index.ts
function pickTranslations(full, keys) {
	const result = {};
	for (const k in full) if (keys.has(k)) result[k] = full[k];
	return result;
}
function defineI18n(config) {
	return {
		...config,
		translations() {
			const translations = {};
			const registeredKeys = /* @__PURE__ */ new Set();
			for (const lang of config.languages) translations[lang] = {};
			return {
				config,
				$inferLanguages: void 0,
				$inferKeys: void 0,
				get(lang) {
					if (!translations[lang]) return void 0;
					return pickTranslations(translations[lang], registeredKeys);
				},
				extend(extension) {
					for (const key of extension.keys) registeredKeys.add(key);
					return this;
				},
				add(...args) {
					const overrides = args.length === 2 ? args[1] : args[0];
					for (const [lang, values] of Object.entries(overrides)) Object.assign(translations[lang] ??= {}, values);
					return this;
				},
				preset(lang, preset) {
					Object.assign(translations[lang], preset.value);
					return this;
				}
			};
		}
	};
}
/** create translations API without i18n */
function defineTranslations() {
	const translations = {};
	const registeredKeys = /* @__PURE__ */ new Set();
	return {
		$inferKeys: void 0,
		get() {
			return pickTranslations(translations, registeredKeys);
		},
		extend(extension) {
			for (const key of extension.keys) registeredKeys.add(key);
			return this;
		},
		add(...args) {
			Object.assign(translations, args.length === 2 ? args[1] : args[0]);
			return this;
		},
		preset(preset) {
			Object.assign(translations, preset.value);
			return this;
		}
	};
}
//#endregion
export { defineI18n, defineTranslations };
