import { SearchLink, SharedProps, TagItem } from "../../contexts/search.js";
import "./search.js";
import { ReactNode } from "react";
//#region src/components/dialog/search-default.d.ts
interface DefaultSearchDialogProps extends SharedProps {
  /** @deprecated re-create the dialog instead for other clients, see https://fumadocs.dev/docs/search/orama */
  type?: 'static';
  links?: SearchLink[];
  defaultTag?: string;
  tags?: TagItem[];
  /**
   * Search API URL
   */
  api?: string;
  /**
   * The debounced delay for performing a search.
   */
  delayMs?: number;
  footer?: ReactNode;
  /**
   * Allow to clear tag filters
   *
   * @defaultValue false
   */
  allowClear?: boolean;
}
declare function DefaultSearchDialog({ type, defaultTag, tags, api, delayMs, allowClear, links, footer, ...props }: DefaultSearchDialogProps): import("react").JSX.Element;
//#endregion
export { DefaultSearchDialogProps, DefaultSearchDialog as default };