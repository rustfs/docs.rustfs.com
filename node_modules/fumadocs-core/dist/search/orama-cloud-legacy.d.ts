import { i as StructuredData } from "../remark-structure-CnHwvNZr.js";
import "../index-DdWT_FjJ.js";
import { CloudManager } from "@oramacloud/client";
//#region src/search/orama-cloud-legacy.d.ts
interface SyncOptions {
  /**
   * Index name to sync
   */
  index: string;
  documents: OramaDocument[];
  /**
   * Deploy changes
   *
   * @defaultValue true
   */
  autoDeploy?: boolean;
}
interface I18nSyncOptions extends Omit<SyncOptions, 'index' | 'documents'> {
  /**
   * Indexes to sync.
   *
   * Pairs of `locale`-`index`.
   **/
  indexes: Record<string, string>;
  documents: {
    locale: string;
    items: OramaDocument[];
  }[];
}
interface OramaDocument {
  /**
   * The ID of document, must be unique
   */
  id: string;
  title: string;
  description?: string;
  /**
   * URL to the page
   */
  url: string;
  structured: StructuredData;
  /**
   * Tag to filter results
   */
  tag?: string;
  /**
   * Data to be added to each section index
   */
  extra_data?: object;
  breadcrumbs?: string[];
}
interface OramaIndex {
  id: string;
  title: string;
  url: string;
  tag?: string;
  /**
   * The id of page, used for `group by`
   */
  page_id: string;
  /**
   * Heading content
   */
  section?: string;
  breadcrumbs?: string[];
  /**
   * Heading (anchor) id
   */
  section_id?: string;
  content: string;
}
declare function sync(cloudManager: CloudManager, options: SyncOptions): Promise<void>;
declare function syncI18n(cloudManager: CloudManager, options: I18nSyncOptions): Promise<void>;
//#endregion
export { I18nSyncOptions, OramaDocument, OramaIndex, SyncOptions, sync, syncI18n };