import { Transformer } from "unified";
import { Root, RootContent } from "mdast";
//#region src/mdx-plugins/remark-block-id.d.ts
interface RemarkBlockIdOptions {
  /**
   * generate block ID.
   */
  generateId?: (ctx: {
    node: RootContent;
    text: string;
  }) => string;
  /**
   * determine whether an ID should be generated for a given node.
   *
   * default: `true` for block nodes, otherwise `false`.
   *
   * @returns
   * - `true`: generate an ID for the node.
   * - `false`: skip the current node and look into its children.
   * - `skip`: skip the current node and its children.
   */
  shouldGenerate?: (node: RootContent) => boolean | 'skip';
  /**
   * Add `data-block="<value>"` to updated nodes, pass `null` to disable.
   *
   * @default "default"
   */
  addDataAttribute?: string | null;
}
/**
 * Generate ID for each block node in Markdown/MDX.
 *
 * Note: the uniqueness is only guaranteed per file.
 */
declare function remarkBlockId({ generateId, addDataAttribute, shouldGenerate }?: RemarkBlockIdOptions): Transformer<Root, Root>;
//#endregion
export { RemarkBlockIdOptions, remarkBlockId };