import { Transformer } from "unified";
import { Root } from "mdast";
//#region src/mdx-plugins/remark-directive-admonition.d.ts
interface RemarkDirectiveAdmonitionOptions {
  /**
   * the tag names of Callout component.
   */
  tags?: {
    CalloutContainer?: string;
    CalloutTitle?: string;
    CalloutDescription?: string;
  };
  /**
   * All supported admonition types and their linked Callout type.
   *
   * When specified, all defaults will be cleared.
   */
  types?: Record<string, string>;
}
/**
 * Remark Plugin to support Admonition syntax in Docusaurus, useful for migrating from Docusaurus.
 *
 * Requires [`remark-directive`](https://github.com/remarkjs/remark-directive) to be configured.
 */
declare function remarkDirectiveAdmonition({ tags: { CalloutContainer, CalloutTitle, CalloutDescription }, types }?: RemarkDirectiveAdmonitionOptions): Transformer<Root, Root>;
//#endregion
export { remarkDirectiveAdmonition as n, RemarkDirectiveAdmonitionOptions as t };