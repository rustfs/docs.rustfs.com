import { HighlightOptions } from "./index.js";
import { DependencyList, ReactNode } from "react";
//#region src/highlight/client.d.ts
/**
 * get highlighted results, should be used with React Suspense API.
 *
 * note: results are cached with (lang, code) as keys, if this is not the desired behaviour, pass a `deps` instead.
 */
declare function useShiki(code: string, options: HighlightOptions, deps?: DependencyList): ReactNode;
//#endregion
export { useShiki };