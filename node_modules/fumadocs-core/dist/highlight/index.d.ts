import { ReactNode } from "react";
import { Components } from "hast-util-to-jsx-runtime";
import { Root } from "hast";
import { BundledLanguage, BundledTheme, CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptionsCommon, LanguageRegistration, ThemeRegistrationAny } from "shiki";
//#region src/highlight/index.d.ts
type HighlightOptions = HighlightHastOptions & {
  components?: Partial<Components>;
};
type HighlightHastOptions = CodeToHastOptionsCommon<BundledLanguage> & CodeOptionsMeta & {
  fallbackLanguage?: BundledLanguage | (string & {});
  /**
   * The Regex Engine for Shiki
   *
   * @defaultValue 'js'
   */
  engine?: 'js' | 'oniguruma';
} & (CodeOptionsThemes<BundledTheme> | Record<never, never>);
declare function highlightHast(code: string, options: HighlightHastOptions): Promise<Root>;
/**
 * Get Shiki highlighter instance of Fumadocs (mostly for internal use, you should use Shiki directly over this).
 *
 * @param engineType - Shiki Regex engine to use.
 * @param options - Shiki options.
 */
declare function getHighlighter(engineType: 'js' | 'oniguruma', options?: {
  langs?: (BundledLanguage | LanguageRegistration)[];
  themes?: (BundledTheme | ThemeRegistrationAny)[];
}): Promise<import("shiki").HighlighterCore>;
declare function highlight(code: string, options: HighlightOptions): Promise<ReactNode>;
//#endregion
export { HighlightHastOptions, HighlightOptions, getHighlighter, highlight, highlightHast };