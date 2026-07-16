import { I18nProviderProps } from "./contexts/i18n.js";
import { Translations } from "./.translations/index.js";
import { I18nConfig, SingularTranslationsAPI, TranslationExtension, TranslationsAPI } from "fumadocs-core/i18n";
//#region src/i18n.d.ts
declare function uiTranslations(): TranslationExtension<keyof Translations>;
declare function i18nProvider(translations: SingularTranslationsAPI): I18nProviderProps;
declare function i18nProvider<Languages extends string>(translations: TranslationsAPI<Languages>, lang?: NoInfer<Languages> | (string & {})): I18nProviderProps;
interface I18nUIConfig<Languages extends string> extends I18nConfig<Languages> {
  provider: (locale?: Languages | (string & {})) => I18nProviderProps;
}
declare function defineI18nUI<Languages extends string>(config: I18nConfig<Languages>, localeTranslations?: Partial<Record<Languages, Record<string, string> & {
  displayName?: string;
}>>): I18nUIConfig<Languages>;
//#endregion
export { I18nUIConfig, type Translations, defineI18nUI, i18nProvider, uiTranslations };