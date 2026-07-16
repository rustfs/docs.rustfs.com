import { ReactNode } from "react";
//#region src/search/index.d.ts
interface SortedResult<Content = string> {
  id: string;
  url: string;
  type: 'page' | 'heading' | 'text';
  content: Content;
  /**
   * breadcrumbs to be displayed on UI
   */
  breadcrumbs?: Content[];
  /**
   * @deprecated it is now included in `content` as Markdown using `<mark />`.
   */
  contentWithHighlights?: HighlightedText<Content>[];
}
type ReactSortedResult = SortedResult<ReactNode>;
interface HighlightedText<Content = string> {
  type: 'text';
  content: Content;
  styles?: {
    highlight?: boolean;
  };
}
declare function createContentHighlighter(query: string | RegExp): {
  /**
   * @deprecated use `highlightMarkdown()` instead.
   */
  highlight(content: string): HighlightedText[];
  /**
   * @param content - Markdown, it assumes the content is already sanitized & safe, no escape is performed.
   */
  highlightMarkdown(content: string): string;
};
//#endregion
export { createContentHighlighter as i, ReactSortedResult as n, SortedResult as r, HighlightedText as t };