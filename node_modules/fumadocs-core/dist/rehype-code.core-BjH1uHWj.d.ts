import { n as IconOptions } from "./transformer-icon-DlrneIS3.js";
import { t as Awaitable } from "./types-D89QoQR-.js";
import { n as ShikiFactory } from "./index-BMEUQz-F.js";
import { Processor, Transformer } from "unified";
import { Element, Root } from "hast";
import { BuiltinLanguage, BuiltinTheme, CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptionsCommon, HighlighterCore, LanguageInput, ShikiTransformer, TransformerOptions } from "shiki";
//#region src/mdx-plugins/rehype-code/parsers.d.ts
type InlineCodeParser = 'tailing-curly-colon';
//#endregion
//#region src/mdx-plugins/rehype-code/shiki.d.ts
interface MapLike<K = unknown, V = unknown> {
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => this;
}
interface RehypeShikiExtraOptions {
  /**
   * Add `language-*` class to code element
   *
   * @default false
   */
  addLanguageClass?: boolean;
  /**
   * The default language to use when is not specified
   */
  defaultLanguage?: string;
  /**
   * The fallback language to use when specified language is not loaded, or not included in the bundle
   */
  fallbackLanguage?: string;
  /**
   * Load languages and themes on-demand.
   *
   * @default true
   */
  lazy?: boolean;
  /**
   * `mdast-util-to-hast` adds a newline to the end of code blocks
   *
   * This option strips that newline from the code block
   *
   * @default true
   * @see https://github.com/syntax-tree/mdast-util-to-hast/blob/f511a93817b131fb73419bf7d24d73a5b8b0f0c2/lib/handlers/code.js#L22
   */
  stripEndNewline?: boolean;
  /**
   * Custom meta string parser
   * Return an object to merge with `meta`
   */
  parseMetaString?: (metaString: string, node: Element, tree: Root) => Record<string, unknown> | undefined | null;
  /**
   * Filter meta string before processing
   */
  filterMetaString?: (metaString: string) => string;
  /**
   * Highlight inline code blocks
   *
   * - `false`: disable inline code block highlighting
   * - `tailing-curly-colon`: highlight with `\`code{:lang}\``
   *
   * @see https://shiki.style/packages/rehype#inline-code
   * @default false
   */
  inline?: InlineCodeParser | false;
  /**
   * Custom map to cache transformed codeToHast result
   *
   * @default undefined
   */
  cache?: MapLike<string, Root>;
  /**
   * Chance to handle the error
   * If not provided, the error will be thrown
   */
  onError?: (error: unknown) => void;
}
type RehypeShikiCoreOptions = CodeOptionsThemes<BuiltinTheme> & TransformerOptions & CodeOptionsMeta & RehypeShikiExtraOptions & Omit<CodeToHastOptionsCommon, 'lang'>;
declare module 'shiki' {
  interface ShikiTransformerContextMeta {
    /** [Fumadocs: rehype-code] run async tasks after process */
    _fd_postprocess?: ((ctx: {
      highlighter: HighlighterCore;
    }) => Promise<void>)[];
  }
}
//#endregion
//#region src/mdx-plugins/rehype-code.core.d.ts
declare function rehypeCodeDefaultOptions(): RehypeCodeOptionsCommon;
type RehypeCodeOptionsCommon = RehypeShikiCoreOptions & {
  /**
   * Language names to include & preload.
   */
  langs?: Array<LanguageInput | BuiltinLanguage>;
  /**
   * Alias of languages
   * @example { 'my-lang': 'javascript' }
   */
  langAlias?: Record<string, string>;
  /**
   * Add icon to code blocks
   */
  icon?: IconOptions | false;
  /**
   * Wrap code blocks in `<Tab>` component when "tab" meta string presents
   *
   * @defaultValue true
   */
  tab?: boolean;
};
declare function createRehypeCode<Options extends Partial<RehypeCodeOptionsCommon> = Partial<RehypeCodeOptionsCommon>>(highlighterFactory: ShikiFactory | ((options?: Options) => Awaitable<{
  highlighter: HighlighterCore;
  options: RehypeCodeOptionsCommon;
}>)): (this: Processor, _options?: Options) => Transformer<Root, Root>;
declare function transformerTab(): ShikiTransformer;
//#endregion
export { transformerTab as i, createRehypeCode as n, rehypeCodeDefaultOptions as r, RehypeCodeOptionsCommon as t };