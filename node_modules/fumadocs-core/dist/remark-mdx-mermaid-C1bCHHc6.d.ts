import { Transformer } from "unified";
import { Root } from "mdast";
//#region src/mdx-plugins/remark-mdx-mermaid.d.ts
interface RemarkMdxMermaidOptions {
  /**
   * @defaultValue mermaid
   */
  lang?: string;
}
/**
 * Convert `mermaid` codeblocks into `<Mermaid />` MDX component
 */
declare function remarkMdxMermaid(options?: RemarkMdxMermaidOptions): Transformer<Root, Root>;
//#endregion
export { remarkMdxMermaid as n, RemarkMdxMermaidOptions as t };