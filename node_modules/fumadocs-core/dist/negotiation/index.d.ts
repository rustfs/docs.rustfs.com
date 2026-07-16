import Negotiator from "negotiator";
//#region src/negotiation/index.d.ts
declare function getNegotiator(request: Request): Negotiator;
/**
 * Rewrite incoming path matching the `source` pattern into the `destination` pattern.
 *
 * See [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) for accepted pattern formats.
 *
 * @param source - the original pattern of incoming paths
 * @param destination - the target pattern to convert into
 */
declare function rewritePath(source: string, destination: string): {
  rewrite(pathname: string): string | false;
};
declare function isMarkdownPreferred(request: Request, options?: {
  markdownMediaTypes?: string[];
}): boolean;
//#endregion
export { getNegotiator, isMarkdownPreferred, rewritePath };