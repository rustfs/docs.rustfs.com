import { t as Awaitable } from "../types-D89QoQR-.js";
import { n as I18nConfig } from "../index-DydiXvgS.js";
import "../index-BM36H-xw.js";
import { m as SharedIndex, n as SearchAPI, t as QueryOptions } from "../server-B7xEII-W.js";
import { x as LoaderOutput, y as LoaderConfig } from "../index-DmFlQQrd2.js";
import { DocumentData, DocumentOptions } from "flexsearch";
//#region src/search/server/build-doc.d.ts
interface SharedDocument {
  id: string;
  content: string;
  page_id: string;
  type: 'page' | 'heading' | 'text';
  breadcrumbs?: string[];
  tags: string[];
  url: string;
}
//#endregion
//#region src/search/flexsearch/utils.d.ts
type Doc = SharedDocument & DocumentData;
//#endregion
//#region src/search/flexsearch.d.ts
type Index = SharedIndex;
interface IndexWithLocale extends Index {
  locale: string;
}
interface Options {
  indexes: Index[] | (() => Awaitable<Index[]>);
  document?: DocumentOptions<Doc>;
}
type ExportedData = {
  type: 'default';
  raw: Record<string, string>;
} | {
  type: 'i18n';
  raw: Record<string, Record<string, string>>;
};
interface I18nOptions extends Omit<Options, 'indexes'> {
  i18n: I18nConfig;
  indexes: IndexWithLocale[] | (() => Awaitable<IndexWithLocale[]>);
  /**
   * options for each locale, see https://github.com/nextapps-de/flexsearch/blob/master/doc/encoder.md.
   */
  localeMap?: Record<string, Partial<DocumentOptions<Doc>> | 'cjk'>;
}
declare function flexsearch(options: Options): SearchAPI;
declare function flexsearchI18n(options: I18nOptions): SearchAPI;
interface FromSourceOptions<C extends LoaderConfig> extends Pick<I18nOptions, 'localeMap' | 'document'> {
  buildIndex?: (page: C['page']) => Awaitable<Index>;
}
/**
 * create server from loader, if passed as function, the server will re-index all records once a different instance of loader is returned.
 */
declare function flexsearchFromSource<C extends LoaderConfig>(loader: LoaderOutput<C> | (() => Awaitable<LoaderOutput<C>>), options?: FromSourceOptions<NoInfer<C>>): SearchAPI<QueryOptions>;
//#endregion
export { ExportedData, FromSourceOptions, I18nOptions, Index, IndexWithLocale, Options, flexsearch, flexsearchFromSource, flexsearchI18n };