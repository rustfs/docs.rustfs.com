import { c as TOCItemType } from "../toc-17DPqBrN.js";
import { Compatible } from "vfile";
import { PluggableList } from "unified";
//#region src/content/toc.d.ts
/**
 * Get Table of Contents from markdown/mdx document (using remark)
 *
 * @param content - Markdown content or file
 */
declare function getTableOfContents(content: Compatible): TOCItemType[];
/**
 * Get Table of Contents from markdown/mdx document (using remark)
 *
 * @param content - Markdown content or file
 * @param remarkPlugins - remark plugins to be applied first
 */
declare function getTableOfContents(content: Compatible, remarkPlugins: PluggableList): Promise<TOCItemType[]>;
//#endregion
export { getTableOfContents };