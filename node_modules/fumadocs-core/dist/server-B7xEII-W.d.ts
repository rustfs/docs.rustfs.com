import { t as Awaitable } from "./types-D89QoQR-.js";
import { i as StructuredData } from "./remark-structure-CnHwvNZr.js";
import { n as I18nConfig } from "./index-DydiXvgS.js";
import { r as SortedResult } from "./index-BM36H-xw.js";
import { x as LoaderOutput, y as LoaderConfig } from "./index-DmFlQQrd2.js";
import { Language, Orama, RawData, SearchParams, TypedDocument, create } from "@orama/orama";
//#region src/search/orama/create-db.d.ts
type SimpleDocument = TypedDocument<Orama<typeof simpleSchema>>;
declare const simpleSchema: {
  readonly url: "string";
  readonly title: "string";
  readonly breadcrumbs: "string[]";
  readonly description: "string";
  readonly content: "string";
  readonly keywords: "string";
};
type AdvancedDocument = TypedDocument<Orama<typeof advancedSchema>>;
declare const advancedSchema: {
  readonly content: "string";
  readonly page_id: "string";
  readonly type: "string";
  readonly breadcrumbs: "string[]";
  readonly tags: "enum[]";
  readonly url: "string";
  readonly embeddings: "vector[512]";
};
//#endregion
//#region src/search/server/build-index.d.ts
interface SharedIndex {
  id: string;
  title: string;
  description?: string;
  breadcrumbs?: string[];
  /**
   * Required if tag filter is enabled
   */
  tag?: string | string[];
  /**
   * preprocess mdx content with `structure`
   */
  structuredData: StructuredData;
  url: string;
}
//#endregion
//#region src/search/orama/create-server.d.ts
type OramaInput = Parameters<typeof create>[0];
interface SharedOptions extends Pick<OramaInput, 'sort' | 'components' | 'plugins'> {
  language?: string;
  tokenizer?: Required<OramaInput>['components']['tokenizer'];
}
interface OramaQueryOptions extends QueryOptions {
  mode?: 'full' | 'vector';
}
/**
 * Resolve indexes dynamically
 */
type Dynamic<T> = () => Awaitable<T[]>;
interface SimpleOptions extends SharedOptions {
  indexes: Index[] | Dynamic<Index>;
  /**
   * Customize search options on server
   */
  search?: Partial<SearchParams<Orama<typeof simpleSchema>, SimpleDocument>>;
}
interface AdvancedOptions extends SharedOptions {
  indexes: AdvancedIndex[] | Dynamic<AdvancedIndex>;
  /**
   * Customize search options on server
   */
  search?: Partial<SearchParams<Orama<typeof advancedSchema>, AdvancedDocument>>;
}
interface Index {
  title: string;
  description?: string;
  breadcrumbs?: string[];
  content: string;
  url: string;
  keywords?: string;
}
type ExportedData = (RawData & {
  type: 'simple' | 'advanced';
}) | {
  type: 'i18n';
  data: Record<string, RawData & {
    type: 'simple' | 'advanced';
  }>;
};
declare function initSimpleSearch(options: SimpleOptions): SearchServer<OramaQueryOptions>;
type AdvancedIndex = SharedIndex;
declare function initAdvancedSearch(options: AdvancedOptions): SearchServer<OramaQueryOptions>;
declare function createSearchAPI(type: 'simple', options: SimpleOptions): SearchAPI<OramaQueryOptions>;
declare function createSearchAPI(type: 'advanced', options: AdvancedOptions): SearchAPI<OramaQueryOptions>;
type I18nOptions<O extends SimpleOptions | AdvancedOptions, Idx> = Omit<O, 'language' | 'indexes'> & {
  i18n: I18nConfig;
  /**
   * Map locale name from i18n config to Orama compatible `language` or options
   */
  localeMap?: Record<string, Language | Partial<O> | undefined>;
  indexes: WithLocale<Idx>[] | Dynamic<WithLocale<Idx>>;
};
type I18nSimpleOptions = I18nOptions<SimpleOptions, Index>;
type I18nAdvancedOptions = I18nOptions<AdvancedOptions, AdvancedIndex>;
type WithLocale<T> = T & {
  locale: string;
};
declare function createI18nSearchAPI(type: 'simple', options: I18nSimpleOptions): SearchAPI<OramaQueryOptions>;
declare function createI18nSearchAPI(type: 'advanced', options: I18nAdvancedOptions): SearchAPI<OramaQueryOptions>;
interface Options<C extends LoaderConfig> extends Omit<AdvancedOptions, 'indexes'> {
  localeMap?: { [K in C['i18n'] extends I18nConfig<infer Languages> ? Languages : string]?: Partial<AdvancedOptions> | Language; };
  buildIndex?: (page: C['page']) => Awaitable<AdvancedIndex>;
}
/**
 * create server from loader, if passed as function, the server will re-index all records once a different instance of loader is returned.
 */
declare function createFromSource<C extends LoaderConfig = LoaderConfig>(loader: LoaderOutput<C> | (() => Awaitable<LoaderOutput<C>>), options?: Options<C>): SearchAPI<OramaQueryOptions>;
//#endregion
//#region src/search/server/types.d.ts
interface QueryOptions {
  locale?: string | null;
  tag?: string | string[];
  limit?: number;
}
interface SearchServer<Q extends QueryOptions = QueryOptions> {
  search: (query: string, options?: Q) => Promise<SortedResult[]>;
  /**
   * Export the database
   *
   * You can reference the exported database to implement client-side search
   */
  export: () => Promise<unknown>;
}
interface SearchAPI<Q extends QueryOptions = QueryOptions> extends SearchServer<Q> {
  GET: (request: Request) => Promise<Response>;
  /**
   * `GET` route handler that exports search indexes for static search.
   */
  staticGET: () => Promise<Response>;
}
//#endregion
export { AdvancedOptions as a, SimpleOptions as c, createSearchAPI as d, initAdvancedSearch as f, AdvancedIndex as i, createFromSource as l, SharedIndex as m, SearchAPI as n, ExportedData as o, initSimpleSearch as p, SearchServer as r, Index as s, QueryOptions as t, createI18nSearchAPI as u };