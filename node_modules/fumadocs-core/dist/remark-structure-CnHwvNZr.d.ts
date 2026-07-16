import { n as StringifyOptions$1, t as Stringifier$1 } from "./stringifier-B_QUcUyo.js";
import { MdxJsxAttribute, MdxJsxExpressionAttribute, MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx";
import { PluggableList, Processor, Transformer } from "unified";
import { Nodes, Root } from "mdast";
//#region src/mdx-plugins/remark-structure.d.ts
interface StructuredDataHeading {
  id: string;
  content: string;
}
interface StructuredDataContent {
  heading: string | undefined;
  content: string;
}
interface StructuredData {
  headings: StructuredDataHeading[];
  /**
   * Refer to paragraphs, a heading may contain multiple contents as well
   */
  contents: StructuredDataContent[];
}
interface StructureOptions {
  /**
   * MDAST node types to be scanned as a content block.
   *
   * If a node's type is listed in this array, it will be converted into a single content block.
   *
   * @defaultValue ['heading', 'paragraph', 'blockquote', 'tableCell', 'mdxJsxFlowElement']
   */
  types?: string[] | ((node: Nodes) => boolean);
  /**
   * stringify text content from a MDAST node.
   */
  stringify?: Stringifier | StringifyOptions;
  /**
   * Whether the MDX element should be treated as a single content block, only effective if `types` has `mdxJsxFlowElement`.
   *
   * Default: return `true` if the element is a leaf node, otherwise `false`.
   */
  mdxTypes?: (node: MdxJsxFlowElement | MdxJsxTextElement) => boolean;
  /** @deprecated use `stringify.filterMdxAttributes` instead */
  allowedMdxAttributes?: string[] | ((node: MdxJsxFlowElement | MdxJsxTextElement, attribute: MdxJsxAttribute | MdxJsxExpressionAttribute) => boolean);
  /**
   * export as `structuredData` (if true) or specified variable name.
   */
  exportAs?: string | boolean;
}
declare module 'mdast' {
  interface Data {
    /**
     * [Fumadocs: remark-structure] Items to add to the structured data.
     */
    structuredData?: {
      contents: StructuredDataContent[];
    };
  }
}
declare module 'vfile' {
  interface DataMap {
    /**
     * [Fumadocs: remark-structure] output data.
     */
    structuredData: StructuredData;
  }
}
declare const remarkStructureDefaultOptions: {
  types: string[];
  mdxTypes(node: MdxJsxFlowElement | MdxJsxTextElement): boolean;
  exportAs: false;
};
/**
 * Extract content into structured data.
 *
 * By default, the output is stored into VFile (`vfile.data.structuredData`), you can specify `exportAs` to export it.
 */
declare function remarkStructure(this: Processor, { types, mdxTypes, stringify: stringifyOptions, allowedMdxAttributes, exportAs }?: StructureOptions): Transformer<Root, Root>;
/**
 * Extract data from markdown/mdx content
 */
declare function structure(content: string, remarkPlugins?: PluggableList, options?: StructureOptions): StructuredData;
interface StringifierContext {
  addContent: (...content: StructuredDataContent[]) => void;
}
type Stringifier = Stringifier$1<StringifierContext>;
type StringifyOptions = StringifyOptions$1<StringifierContext>;
declare function defaultStringifier(config: StringifyOptions): Stringifier;
//#endregion
export { defaultStringifier as a, structure as c, StructuredData as i, StringifyOptions as n, remarkStructure as o, StructureOptions as r, remarkStructureDefaultOptions as s, Stringifier as t };