import { t as Awaitable } from "../../types-D89QoQR-.js";
import { t as HighlightHastOptions } from "../../index-BMEUQz-F.js";
import { DependencyList, ReactNode } from "react";
import { Components } from "hast-util-to-jsx-runtime";
import { HighlighterCore } from "shiki";
//#region src/highlight/shiki/react.d.ts
type UseShikiOptions = HighlightHastOptions & {
  components?: Partial<Components>;
};
/**
 * get highlighted results (uncached), use `useEffect` instead of React 19 APIs.
 */
declare function useShikiDynamic(highlighter: HighlighterCore | (() => Awaitable<HighlighterCore>), code: string, options: UseShikiOptions & {
  defaultValue?: ReactNode;
}, deps: DependencyList): ReactNode;
/**
 * get highlighted results, should be used with React Suspense API.
 *
 * note: results are cached with (lang, code) as keys, if this is not the desired behaviour, pass a `deps` instead.
 */
declare function useShiki(highlighter: HighlighterCore | (() => Awaitable<HighlighterCore>), code: string, options: UseShikiOptions, deps?: DependencyList): ReactNode;
//#endregion
export { UseShikiOptions, useShiki, useShikiDynamic };