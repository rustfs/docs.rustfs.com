import { t as Awaitable } from "./types-D89QoQR-.js";
import { Root } from "hast";
import { BundledLanguage, BundledTheme, CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptionsCommon, HighlighterCore } from "shiki";
//#region src/highlight/shiki/index.d.ts
interface InitOptions {
  langAlias?: Record<string, string>;
}
/**
 * A factory for Fumadocs to manage Shiki instances.
 */
interface ShikiFactory {
  init: (options?: InitOptions) => Awaitable<HighlighterCore>;
  getOrInit: () => Awaitable<HighlighterCore>;
}
declare function createShikiFactory(config: Pick<ShikiFactory, 'init'>): ShikiFactory;
type HighlightHastOptions = CodeToHastOptionsCommon<BundledLanguage> & CodeOptionsMeta & CodeOptionsThemes<BundledTheme> & {
  fallbackLanguage?: BundledLanguage | (string & {});
};
declare function highlightHast(highlighter: HighlighterCore, code: string, options: HighlightHastOptions): Promise<Root>;
//#endregion
export { highlightHast as i, ShikiFactory as n, createShikiFactory as r, HighlightHastOptions as t };