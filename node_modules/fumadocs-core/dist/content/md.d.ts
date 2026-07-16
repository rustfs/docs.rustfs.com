import { FC } from "react";
import { Options } from "remark-rehype";
import { Compatible } from "vfile";
import { Components } from "hast-util-to-jsx-runtime";
import { PluggableList } from "unified";
//#region src/content/md.d.ts
interface MarkdownRendererOptions {
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  remarkRehypeOptions?: Options;
}
interface MarkdownRenderer {
  Markdown: FC<MarkdownProps>;
  MarkdownServer: FC<Omit<MarkdownProps, 'async'>>;
}
interface MarkdownProps {
  async?: boolean;
  components?: Components;
  children: Compatible;
}
declare function createMarkdownRenderer({ rehypePlugins, remarkPlugins, remarkRehypeOptions }?: MarkdownRendererOptions): MarkdownRenderer;
declare function Markdown(props: MarkdownProps & MarkdownRendererOptions): import("react").ReactNode | Promise<import("react").ReactNode>;
//#endregion
export { Markdown, MarkdownProps, MarkdownRenderer, MarkdownRendererOptions, createMarkdownRenderer };