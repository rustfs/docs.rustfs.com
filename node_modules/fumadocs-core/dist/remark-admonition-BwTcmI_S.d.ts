import { Transformer } from "unified";
import { Root } from "mdast";
//#region src/mdx-plugins/remark-admonition.d.ts
interface RemarkAdmonitionOptions {
  tag?: string;
  /**
   * Map type to another type
   */
  typeMap?: Record<string, string>;
}
/**
 * Remark Plugin to support Admonition syntax
 *
 * Useful when Migrating from Docusaurus
 *
 * @deprecated Use `remarkDirectiveAdmonition` with `remark-directive` configured instead.
 */
declare function remarkAdmonition(options?: RemarkAdmonitionOptions): Transformer<Root, Root>;
//#endregion
export { remarkAdmonition as n, RemarkAdmonitionOptions as t };