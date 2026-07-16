import { Processor, Transformer } from "unified";
import { Element, Root } from "hast";
//#region src/mdx-plugins/rehype-toc.d.ts
interface RehypeTocOptions {
  /**
   * Export the generated toc.
   *
   * - `true` (default): as an ESM export named `toc`.
   * - `false`: disable the plugin.
   */
  exportToc?: boolean | {
    /**
     * generate to `file.data.rehypeToc`.
     */
    as: 'data';
  } | {
    /**
     * generate as an ESM export.
     */
    as: 'esm';
    name: string;
  };
}
declare module 'vfile' {
  interface DataMap {
    /**
     * [Fumadocs: rehype-toc] output data.
     */
    rehypeToc?: RehypeTOCItemType[];
  }
}
interface RehypeTOCItemType {
  /**
   * the original heading tag
   */
  title: Element;
  url: string;
  depth: number;
  _step?: number;
}
declare function rehypeToc(this: Processor, { exportToc }?: RehypeTocOptions): Transformer<Root, Root>;
//#endregion
export { RehypeTocOptions as n, rehypeToc as r, RehypeTOCItemType as t };