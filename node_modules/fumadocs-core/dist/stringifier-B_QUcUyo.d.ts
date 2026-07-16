import { MdxJsxAttribute, MdxJsxExpressionAttribute, MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx";
import { Info, Options, State } from "mdast-util-to-markdown";
import { Processor } from "unified";
import { Nodes, Parents } from "mdast";
//#region src/mdx-plugins/stringifier.d.ts
declare module 'mdast' {
  interface Data {
    /**
     * [Fumadocs: stringify] Extra info for stringifying the node:
     * - `children-only`: only stringify its children.
     * - `{ node }`: stringify as another node.
     * - `{ text }`: the stringified form of node.
     */
    _stringify?: 'children-only' | {
      node: Nodes;
    } | {
      text: string;
    };
  }
}
type Stringifier<Context> = ((this: Processor, node: Nodes, ctx: Context) => string) | ((node: Nodes, ctx: Context) => string);
interface StringifyOptions<Context = undefined> extends Options {
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
   *     case 'mdxJsxFlowElement':
   *     case 'mdxJsxTextElement':
   *       switch (node.name) {
   *         case 'File':
   *         case 'TypeTable':
   *         case 'Callout':
   *         case 'Card':
   *           return true;
   *       }
   *       return 'children-only';
   *   }
   *
   *   return true;
   * },
   * ```
   */
  filterElement?: (node: Nodes) => boolean | 'children-only';
  /**
   * Filter the attributes to stringify.
   */
  filterMdxAttributes?: (node: MdxJsxFlowElement | MdxJsxTextElement, attribute: MdxJsxAttribute | MdxJsxExpressionAttribute) => boolean;
  /**
   * override default stringifier
   */
  stringify?: (node: Nodes, parent: Parents | undefined, state: State, info: Info, ctx: Context) => string | undefined;
}
declare function defaultStringifier<Context = undefined>(config?: StringifyOptions<Context>): Stringifier<Context>;
//#endregion
export { StringifyOptions as n, defaultStringifier as r, Stringifier as t };