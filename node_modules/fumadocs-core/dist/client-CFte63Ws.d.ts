import { t as Awaitable } from "./types-D89QoQR-.js";
import { t as BaseIndex } from "./algolia-C0E5qQhM.js";
import { r as SortedResult } from "./index-BM36H-xw.js";
import { DependencyList } from "react";
import { AnyOrama, Orama, SearchParams } from "@orama/orama";
import { LiteClient, SearchResponse } from "algoliasearch/lite";
import { OramaCloud, OramaCloudSearchParams } from "@orama/core";
import { ClientSearchParams, OramaClient } from "@oramacloud/client";
import Mixedbread from "@mixedbread/sdk";
//#region src/search/client/fetch.d.ts
interface FetchOptions {
  /**
   * API route for search endpoint, support absolute URLs.
   *
   * @defaultValue '/api/search'
   */
  api?: string;
  /**
   * Filter results with specific tag(s).
   */
  tag?: string | string[];
  /**
   * Filter by locale
   */
  locale?: string;
  cache?: Map<string, SortedResult[]>;
}
declare function fetchClient({ api, locale, tag, cache }?: FetchOptions): SearchClient;
//#endregion
//#region src/search/client/orama-static.d.ts
interface StaticOptions {
  /**
   * Where to download exported search indexes (URL)
   *
   * @defaultValue '/api/search'
   */
  from?: string;
  initOrama?: (locale?: string) => AnyOrama | Promise<AnyOrama>;
  /**
   * Filter results with specific tag(s).
   */
  tag?: string | string[];
  /**
   * Filter by locale (unsupported at the moment)
   */
  locale?: string;
  /**
   * extra options for search
   */
  search?: Partial<SearchParams<Orama<unknown>>>;
}
declare function oramaStaticClient(options?: StaticOptions): SearchClient;
//#endregion
//#region src/search/client/algolia.d.ts
interface AlgoliaOptions {
  indexName: string;
  client: LiteClient;
  /**
   * Filter results with specific tag.
   */
  tag?: string;
  locale?: string;
  onSearch?: (query: string, tag?: string, locale?: string) => Promise<{
    results: SearchResponse<BaseIndex>[];
  }>;
}
declare function algoliaClient(options: AlgoliaOptions): SearchClient;
//#endregion
//#region src/search/client/orama-cloud.d.ts
interface OramaCloudOptions {
  client: OramaCloud;
  /**
   * The type of your index.
   *
   * You can set it to `crawler` if you use crawler instead of the JSON index with schema provided by Fumadocs
   */
  index?: 'default' | 'crawler';
  /**
   * Note: not included in dependency list.
   */
  params?: Partial<OramaCloudSearchParams>;
  /**
   * Filter results with specific tag.
   */
  tag?: string;
  /**
   * Filter by locale (unsupported at the moment)
   */
  locale?: string;
}
declare function oramaCloudClient(options: OramaCloudOptions): SearchClient;
//#endregion
//#region src/search/client/orama-cloud-legacy.d.ts
interface OramaCloudLegacyOptions {
  client: OramaClient;
  /**
   * The type of your index.
   *
   * You can set it to `crawler` if you use crawler instead of the JSON index with schema provided by Fumadocs.
   */
  index?: 'default' | 'crawler';
  /**
   * Note: not included into dependency list.
   */
  params?: ClientSearchParams;
  /**
   * Filter results with specific tag.
   */
  tag?: string;
  /**
   * Filter by locale (unsupported at the moment)
   */
  locale?: string;
}
declare function oramaCloudLegacyClient(options: OramaCloudLegacyOptions): SearchClient;
//#endregion
//#region src/search/client/mixedbread.d.ts
interface MixedbreadOptions {
  /**
   * The identifier of the store to search in
   */
  storeIdentifier: string;
  /**
   * The Mixedbread SDK client instance
   */
  client: Mixedbread;
  /**
   * Filter results with specific tag.
   */
  tag?: string;
  /**
   * Filter by locale (unsupported at the moment)
   */
  locale?: string;
}
interface SearchMetadata {
  title?: string;
  description?: string;
  url?: string;
  tag?: string;
}
/**
 * @deprecated Use `createMixedbreadSearchAPI` from `fumadocs-core/search/mixedbread` instead.
 * This client-side approach exposes your API key in the browser.
 * The server-side approach keeps the key secure and uses `client: fetchClient(...)` on the client.
 */
declare function mixedbreadClient(options: MixedbreadOptions): SearchClient;
//#endregion
//#region src/search/client/flexsearch-static.d.ts
interface FlexsearchStaticOptions {
  /**
   * @defaultValue `/api/search`
   */
  from?: string;
  locale?: string;
  tag?: string | string[];
}
declare function flexsearchStaticClient(options?: FlexsearchStaticOptions): SearchClient;
//#endregion
//#region src/search/client.d.ts
interface UseDocsSearch {
  search: string;
  setSearch: (v: string) => void;
  query: {
    isLoading: boolean;
    data?: SortedResult[] | 'empty';
    error?: Error;
  };
}
type ClientPreset = ({
  /**
   * @deprecated Pass `client: fetchClient(...)` instead.
   */
  type: 'fetch';
} & FetchOptions) | ({
  /**
   * @deprecated Pass `client: oramaStaticClient(...)` instead.
   */
  type: 'static';
} & StaticOptions) | ({
  /**
   * @deprecated Pass `client: algoliaClient(...)` instead.
   */
  type: 'algolia';
} & AlgoliaOptions) | ({
  /**
   * @deprecated Pass `client: oramaCloudClient(...)` instead.
   */
  type: 'orama-cloud';
} & OramaCloudOptions) | ({
  /**
   * @deprecated Pass `client: oramaCloudLegacyClient(...)` instead.
   */
  type: 'orama-cloud-legacy';
} & OramaCloudLegacyOptions) | ({
  /**
   * @deprecated Pass `client: flexsearchStaticClient(...)` instead.
   */
  type: 'flexsearch-static';
} & FlexsearchStaticOptions) | ({
  /**
   * @deprecated Use `createMixedbreadSearchAPI` from `fumadocs-core/search/mixedbread` instead.
   * This client-side approach exposes your API key in the browser.
   * The server-side approach keeps the key secure and uses `client: fetchClient(...)` on the client.
   */
  type: 'mixedbread';
} & MixedbreadOptions) | {
  client: SearchClient;
};
interface SearchClient {
  search: (query: string) => Awaitable<SortedResult[]>;
  deps?: DependencyList;
}
/**
 * Provide a hook to query different official search clients.
 *
 * Note: it will re-query when its parameters changed, make sure to define `deps` array if you encounter rendering issues.
 */
declare function useDocsSearch(clientOptions: ClientPreset & {
  /**
   * The debounced delay for performing a search (in ms).
   * .
   * @defaultValue 100
   */
  delayMs?: number;
  /**
   * still perform search even if query is empty.
   *
   * @defaultValue false
   */
  allowEmpty?: boolean;
}, customDeps?: DependencyList): UseDocsSearch;
//#endregion
export { FetchOptions as _, flexsearchStaticClient as a, mixedbreadClient as c, OramaCloudOptions as d, oramaCloudClient as f, oramaStaticClient as g, StaticOptions as h, FlexsearchStaticOptions as i, OramaCloudLegacyOptions as l, algoliaClient as m, SearchClient as n, MixedbreadOptions as o, AlgoliaOptions as p, useDocsSearch as r, SearchMetadata as s, ClientPreset as t, oramaCloudLegacyClient as u, fetchClient as v };