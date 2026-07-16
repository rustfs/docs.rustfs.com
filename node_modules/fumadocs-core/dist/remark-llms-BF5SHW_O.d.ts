import { n as StringifyOptions } from "./stringifier-B_QUcUyo.js";
import { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx";
import { Info, State } from "mdast-util-to-markdown";
import { Processor, Transformer } from "unified";
import { Parents, Root } from "mdast";
//#region src/mdx-plugins/remark-llms.d.ts
interface LLMsOptions extends StringifyOptions {
  /**
   * export name for output Markdown.
   *
   * @default _markdown
   */
  as?: string;
  /**
   * Explicit heading IDs in output.
   *
   * @default true
   */
  headingIds?: boolean;
  /**
   * Filter the elements to be included in the output:
   *
   * - `true`: include element & its children.
   * - `children-only`: exclude element but keep its children.
   * - `false`: exclude element & its children.
   *
   * Default:
   *
   * ```ts
   * filterElement = (node) => {
   *   switch (node.type) {
   *     case 'mdxjsEsm':
   *       return false;
   *     default:
   *       return true;
   *   }
   * },
   * ```
   */
  filterElement?: StringifyOptions['filterElement'];
  /**
   * Tag names of MDX components to be stringified as `placeholder()`, you can also use `placeholder()` directly in `stringify` callback.
   */
  mdxAsPlaceholder?: string[];
  /**
   * @private output in file data
   */
  _data?: boolean;
}
/**
 * generate `llms.txt` for markdown.
 */
declare function remarkLLMs(this: Processor, { as, headingIds, _data, mdxAsPlaceholder, ...rest }?: LLMsOptions): Transformer<Root, Root>;
/**
 * Preserve AST data to render the MDX component at runtime, use `renderPlaceholder()` to render the placeholders.
 */
declare function placeholder(node: MdxJsxTextElement | MdxJsxFlowElement, _parent: Parents | undefined, state: State, info: Info): string;
//#endregion
export { placeholder as n, remarkLLMs as r, LLMsOptions as t };