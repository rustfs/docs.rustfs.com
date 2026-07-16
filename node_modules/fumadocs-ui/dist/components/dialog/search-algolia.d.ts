import { SearchLink, SharedProps, TagItem } from "../../contexts/search.js";
import "./search.js";
import { ReactNode } from "react";
import { AlgoliaOptions } from "fumadocs-core/search/client";
//#region src/components/dialog/search-algolia.d.ts
interface AlgoliaSearchDialogProps extends SharedProps {
  searchOptions: AlgoliaOptions;
  links?: SearchLink[];
  footer?: ReactNode;
  defaultTag?: string;
  tags?: TagItem[];
  /**
   * Add the "Powered by Algolia" label, this is useful for free tier users
   *
   * @defaultValue false
   */
  showAlgolia?: boolean;
  /**
   * Allow to clear tag filters
   *
   * @defaultValue false
   */
  allowClear?: boolean;
}
declare function AlgoliaSearchDialog({ searchOptions, tags, defaultTag, showAlgolia, allowClear, links, footer, ...props }: AlgoliaSearchDialogProps): import("react").JSX.Element;
//#endregion
export { AlgoliaSearchDialogProps, AlgoliaSearchDialog as default };