//#region src/i18n/index.d.ts
interface I18nConfig<Languages extends string = string> {
  /**
   * Supported locale codes.
   *
   * A page tree will be built for each language.
   */
  languages: Languages[];
  /**
   * Default locale if not specified
   */
  defaultLanguage: NoInfer<Languages>;
  /**
   * Don't show the locale prefix on URL.
   *
   * - `always`: Always hide the prefix
   * - `default-locale`: Only hide the default locale
   * - `never`: Never hide the prefix
   *
   * This API uses `NextResponse.rewrite`.
   *
   * @defaultValue 'never'
   */
  hideLocale?: 'always' | 'default-locale' | 'never';
  /**
   * Used by `loader()`, specify the way to parse i18n file structure.
   *
   * @defaultValue 'dot'
   */
  parser?: 'dot' | 'dir' | 'none';
  /**
   * the fallback language when the page has no translations available for a given locale.
   *
   * Default to `defaultLanguage`, no fallback when set to `null`.
   */
  fallbackLanguage?: NoInfer<Languages> | null;
}
interface TranslationExtension<Keys extends string = string> {
  keys: readonly Keys[];
}
interface TranslationPreset<Keys extends string = string> {
  name: string;
  value: Partial<Record<Keys, string>>;
}
interface TranslationsAPI<Languages extends string = string, Keys extends string = string> {
  /** for type inference only, always `undefined` in runtime */
  $inferLanguages: Languages;
  /** for type inference only, always `undefined` in runtime */
  $inferKeys: Keys;
  config: I18nConfig<Languages>;
  get: {
    (lang: Languages): Partial<Record<Keys, string>>;
    (lang: string): Partial<Record<Keys, string>> | undefined;
  };
  /** register allowed translation keys */
  extend<const NewKeys extends string>(extension: TranslationExtension<NewKeys>): TranslationsAPI<Languages, Keys | NewKeys>;
  /** add translations */
  add(overrides: { [Lang in Languages]?: Partial<Record<Keys, string>>; }): TranslationsAPI<Languages, Keys>;
  /** @deprecated the namespace parameter is now unnecessary  */
  add(unused: string, overrides: { [Lang in Languages]?: Partial<Record<Keys, string>> & {
    /** @deprecated the label is no longer used */
    [key: string]: string;
  }; }): TranslationsAPI<Languages, Keys>;
  /** add language pack */
  preset: (lang: Languages, preset: TranslationPreset<Keys>) => TranslationsAPI<Languages, Keys>;
}
interface I18nAPI<Languages extends string = string> extends I18nConfig<Languages> {
  translations: () => TranslationsAPI<Languages, never>;
}
interface SingularTranslationsAPI<Keys extends string = string> {
  /** for type inference only, always `undefined` in runtime */
  $inferKeys: Keys;
  get: () => Partial<Record<Keys, string>>;
  /** register allowed translation keys */
  extend<const NewKeys extends string>(extension: TranslationExtension<NewKeys>): SingularTranslationsAPI<Keys | NewKeys>;
  /** add translations */
  add(overrides: Partial<Record<Keys, string>>): SingularTranslationsAPI<Keys>;
  /** @deprecated the namespace parameter is now unnecessary  */
  add(unused: string, overrides: Partial<Record<Keys, string>> & {
    /** @deprecated the label is no longer used */
    [key: string]: string;
  }): SingularTranslationsAPI<Keys>;
  /** add language pack */
  preset: (preset: TranslationPreset<Keys>) => SingularTranslationsAPI<Keys>;
}
declare function defineI18n<const Languages extends string>(config: I18nConfig<Languages>): I18nAPI<Languages>;
/** create translations API without i18n */
declare function defineTranslations(): SingularTranslationsAPI<never>;
//#endregion
export { TranslationPreset as a, defineTranslations as c, TranslationExtension as i, I18nConfig as n, TranslationsAPI as o, SingularTranslationsAPI as r, defineI18n as s, I18nAPI as t };