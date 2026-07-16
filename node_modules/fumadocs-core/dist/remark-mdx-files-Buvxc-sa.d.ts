import { MdxJsxFlowElement } from "mdast-util-mdx";
import { Transformer } from "unified";
import { Root } from "mdast";
//#region src/mdx-plugins/remark-mdx-files.d.ts
interface FileNode {
  depth: number;
  type: 'file';
  name: string;
}
interface FolderNode {
  depth: number;
  type: 'folder';
  name: string;
  children: Node[];
}
interface ToMdxOptions {
  defaultOpenAll: boolean;
}
type Node = FileNode | FolderNode;
interface RemarkMdxFilesOptions {
  /**
   * @defaultValue files
   */
  lang?: string;
  toMdx?: (node: Node, options: ToMdxOptions) => MdxJsxFlowElement;
}
/**
 *
 * **Files CodeBlock:**
 *
 * Convert codeblocks with `files` as lang, like:
 *
 * ```files
 * project
 * ├── src
 * │   ├── index.js
 * │   └── utils
 * │       └── helper.js
 * ├── package.json
 * ```
 *
 * into MDX `<Files />` component.
 *
 * **Auto Files:**
 *
 * Generates MDX `<Files />` component from file system.
 *
 * ```mdx
 * <auto-files dir="scripts" pattern="my-dir/*" defaultOpenAll />
 * ```
 */
declare function remarkMdxFiles(options?: RemarkMdxFilesOptions): Transformer<Root, Root>;
//#endregion
export { remarkMdxFiles as a, ToMdxOptions as i, FolderNode as n, RemarkMdxFilesOptions as r, FileNode as t };