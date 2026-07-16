import { SearchLink, SharedProps, TagItem } from "../../contexts/search.js";
import "./search.js";
import { ReactNode } from "react";
import { OramaCloudOptions } from "fumadocs-core/search/client";
//#region src/components/dialog/search-orama.d.ts
interface OramaSearchDialogProps extends SharedProps {
  links?: SearchLink[];
  client: OramaCloudOptions['client'];
  searchOptions?: OramaCloudOptions['params'];
  index?: OramaCloudOptions['index'];
  footer?: ReactNode;
  defaultTag?: string;
  tags?: TagItem[];
  /**
   * Add the "Powered by Orama" label
   *
   * @defaultValue true
   */
  showOrama?: boolean;
  /**
   * Allow to clear tag filters
   *
   * @defaultValue false
   */
  allowClear?: boolean;
}
/**
 * Orama Cloud integration
 */
declare function OramaSearchDialog({ client, searchOptions, tags, defaultTag, showOrama, allowClear, index, footer, links, ...props }: OramaSearchDialogProps): import("react").JSX.Element;
//#endregion
export { OramaSearchDialogProps, OramaSearchDialog as default };