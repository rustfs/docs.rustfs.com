import { c as TOCItemType } from "./toc-17DPqBrN.js";
import { Transformer } from "unified";
import { Heading, Root } from "mdast";
//#region src/mdx-plugins/remark-heading.d.ts
declare module 'mdast' {
  interface HeadingData extends Data {
    hProperties?: {
      id?: string;
    } & Record<string, unknown>;
  }
}
interface RemarkHeadingOptions {
  slug?: (root: Root, heading: Heading, text: string) => string;
  /**
   * Allow custom headings ids
   *
   * @defaultValue true
   */
  customId?: boolean;
  /**
   * Attach an array of `TOCItemType` to `file.data.toc`
   *
   * @defaultValue true
   */
  generateToc?: boolean;
}
declare module 'vfile' {
  interface DataMap {
    /**
     * [Fumadocs: remark-heading] output data.
     */
    toc?: TOCItemType[];
  }
}
/**
 * Add heading ids and extract TOC
 */
declare function remarkHeading({ slug, customId, generateToc }?: RemarkHeadingOptions): Transformer<Root, Root>;
//#endregion
export { remarkHeading as n, RemarkHeadingOptions as t };