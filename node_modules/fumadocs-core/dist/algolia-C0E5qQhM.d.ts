import { i as StructuredData } from "./remark-structure-CnHwvNZr.js";
import { Algoliasearch } from "algoliasearch";
//#region src/search/algolia.d.ts
interface DocumentRecord {
  /**
   * The ID of document, must be unique
   */
  _id: string;
  title: string;
  description?: string;
  breadcrumbs?: string[];
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
}
interface SyncOptions {
  /**
   * Index Name for documents.
   */
  indexName?: string;
  /**
   * Search indexes
   */
  documents: DocumentRecord[];
}
/**
 * Update index settings and replace all objects
 *
 * @param client - Algolia Admin Client
 * @param options - Index Options
 */
declare function sync(client: Algoliasearch, options: SyncOptions): Promise<void>;
declare function setIndexSettings(client: Algoliasearch, indexName: string): Promise<void>;
declare function updateDocuments(client: Algoliasearch, indexName: string, documents: DocumentRecord[]): Promise<void>;
interface BaseIndex {
  objectID: string;
  title: string;
  url: string;
  tag?: string;
  /**
   * The id of page, used for distinct
   */
  page_id: string;
  /**
   * Heading content
   */
  section?: string;
  /**
   * Heading (anchor) id
   */
  section_id?: string;
  breadcrumbs?: string[];
  content: string;
}
//#endregion
export { sync as a, setIndexSettings as i, DocumentRecord as n, updateDocuments as o, SyncOptions as r, BaseIndex as t };