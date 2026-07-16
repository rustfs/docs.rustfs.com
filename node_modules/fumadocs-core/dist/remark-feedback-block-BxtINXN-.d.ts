import { Transformer } from "unified";
import { Root, RootContent } from "mdast";
//#region src/mdx-plugins/remark-feedback-block.d.ts
interface RemarkFeedbackBlockOptions {
  /**
   * generate block ID, default to using MD5.
   */
  generateHash?: (ctx: {
    body: string;
  }) => string;
  /**
   * @defaultValue FeedbackBlock
   */
  tagName?: string;
  /**
   * determine how the node should be resolved into a feedback block.
   *
   * default: skip MDX elements, convert paragraph, list item, and image nodes.
   *
   * @returns
   * - `true`: convert the node into a feedback block.
   * - `false`: skip the current node and look into its children.
   * - `skip`: skip the current node and its children.
   */
  resolve?: (node: RootContent) => boolean | 'skip';
  /**
   * generate & include the block body to `<FeedbackBlock body="..." />` as string
   *
   * @defaultValue true
   */
  generateBody?: boolean;
}
interface FeedbackBlockProps {
  id: string;
  /** the text body of block, only exists when `generateBody` is enabled. */
  body?: string;
}
/**
 * Generate MDX `<FeedbackBlock />` elements with an unique `id` for every block-like element.
 *
 * Note: the uniqueness is only guaranteed per MDX file/page.
 */
declare function remarkFeedbackBlock({ generateHash, tagName, resolve, generateBody }?: RemarkFeedbackBlockOptions): Transformer<Root, Root>;
//#endregion
export { RemarkFeedbackBlockOptions as n, remarkFeedbackBlock as r, FeedbackBlockProps as t };