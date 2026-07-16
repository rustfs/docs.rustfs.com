import { CodeBlockProps } from "./codeblock.js";
import { UseShikiOptions } from "fumadocs-core/highlight/shiki/react";
import { HighlighterCore } from "shiki";
//#region src/components/dynamic-codeblock.core.d.ts
interface DynamicCodeblockProps {
  highlighter: HighlighterCore | (() => HighlighterCore | PromiseLike<HighlighterCore>);
  lang: string;
  code: string;
  /**
   * Extra props for the underlying `<CodeBlock />` component.
   *
   * Ignored if you defined your own `pre` component in `options.components`.
   */
  codeblock?: CodeBlockProps;
  /**
   * Wrap in React `<Suspense />` and provide a fallback.
   *
   * @defaultValue true
   */
  wrapInSuspense?: boolean;
  options: DistributiveOmit<UseShikiOptions, 'lang'>;
}
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
declare function DynamicCodeBlock({ lang, code, codeblock, options, wrapInSuspense, highlighter }: DynamicCodeblockProps): import("react").JSX.Element;
//#endregion
export { DynamicCodeBlock, DynamicCodeblockProps };