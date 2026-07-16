import { r as SortedResult } from "../index-BM36H-xw.js";
import { n as SearchAPI } from "../server-B7xEII-W.js";
import Mixedbread from "@mixedbread/sdk";
import { StoreSearchResponse } from "@mixedbread/sdk/resources/stores";
//#region src/search/mixedbread.d.ts
interface SearchMetadata {
  title?: string;
  description?: string;
  url?: string;
  tag?: string;
}
type StoreSearchResult = StoreSearchResponse['data'][number] & {
  generated_metadata: SearchMetadata;
};
interface MixedbreadSearchOptions {
  /**
   * The Mixedbread SDK client instance
   */
  client: Mixedbread;
  /**
   * The identifier of the store to search in
   */
  storeIdentifier: string;
  /**
   * Maximum number of results to return
   *
   * @defaultValue 10
   */
  topK?: number;
  /**
   * Re-rank search results for improved relevance (this adds latency to the search)
   */
  rerank?: boolean;
  /**
   * Rewrite the query for better search results (this adds latency to the search)
   */
  rewriteQuery?: boolean;
  /**
   * Minimum score threshold for results
   */
  scoreThreshold?: number;
  /**
   * Custom transform function for search results
   */
  transform?: (results: StoreSearchResult[], query: string) => SortedResult[];
}
declare function createMixedbreadSearchAPI(options: MixedbreadSearchOptions): SearchAPI;
//#endregion
export { MixedbreadSearchOptions, SearchMetadata, createMixedbreadSearchAPI };