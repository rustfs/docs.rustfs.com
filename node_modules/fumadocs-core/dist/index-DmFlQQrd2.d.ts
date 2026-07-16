import { a as Separator, i as Root, n as Item, r as Node, t as Folder } from "./definitions-D8-KI7Uy.js";
import { t as Awaitable } from "./types-D89QoQR-.js";
import { i as StructuredData } from "./remark-structure-CnHwvNZr.js";
import "./index-DdWT_FjJ.js";
import { n as I18nConfig } from "./index-DydiXvgS.js";
import "./index-DZN5OrTa.js";
import { n as SerializedPageTree } from "./index-CdZGMKDG.js";
import { ReactNode } from "react";
//#region src/source/storage/file-system.d.ts
/**
 * In memory file system.
 */
declare class FileSystem<File> {
  files: Map<string, File>;
  folders: Map<string, string[]>;
  constructor(inherit?: FileSystem<File>);
  read(path: string): File | undefined;
  /**
   * get the direct children of folder (in virtual file path)
   */
  readDir(path: string): string[] | undefined;
  write(path: string, file: File): void;
  /**
   * Delete files at specified path.
   *
   * @param path - the target path.
   * @param [recursive=false] - if set to `true`, it will also delete directories.
   */
  delete(path: string, recursive?: boolean): boolean;
  getFiles(): string[];
  makeDir(path: string): void;
}
//#endregion
//#region src/source/storage/content.d.ts
type ContentStorage<P extends ContentStoragePageFile = ContentStoragePageFile, M extends ContentStorageMetaFile = ContentStorageMetaFile> = FileSystem<P | M> & {
  /** always `undefined`, for inferring types only */
  $inferPage: P;
  /** always `undefined`, for inferring types only */
  $inferMeta: M;
};
/** @internal */
interface ContentStorageMetaFile<Type extends string | undefined = string | undefined, Data extends MetaData = MetaData> {
  type: Type;
  path: string;
  absolutePath?: string;
  format: 'meta';
  data: Data;
}
/** @internal */
interface ContentStoragePageFile<Type extends string | undefined = string | undefined, Data extends PageData = PageData> {
  type: Type;
  path: string;
  absolutePath?: string;
  format: 'page';
  slugs: string[];
  data: Data;
}
//#endregion
//#region src/source/page-tree/builder.d.ts
interface PageTreeBuilderContext<S extends ContentStorage = ContentStorage> {
  transformers: PageTreeTransformer<S>[];
  builder: PageTreeBuilder;
  storage: S;
  storages?: Record<string, S>;
  locale?: string;
  custom?: Record<string, unknown>;
  options: PageTreeOptions<S>;
}
interface PageTreeTransformer<S extends ContentStorage = ContentStorage> {
  file?: (this: PageTreeBuilderContext<S>, node: Item, filePath?: string) => Item;
  folder?: (this: PageTreeBuilderContext<S>, node: Folder, folderPath: string, metaPath?: string) => Folder;
  separator?: (this: PageTreeBuilderContext<S>, node: Separator) => Separator;
  root?: (this: PageTreeBuilderContext<S>, node: Root) => Root;
}
interface PageTreeOptions<S extends ContentStorage = ContentStorage> {
  /** generate URL from page */
  url: ResolvedLoaderConfig['url'];
  idPrefix?: string;
  /**
   * Remove references to the file path of original nodes (`$ref`)
   *
   * @defaultValue false
   */
  noRef?: boolean;
  /**
   * generate fallback page tree
   *
   * @defaultValue true
   */
  generateFallback?: boolean;
  /**
   * Additional page tree transformers to apply
   */
  transformers?: PageTreeTransformer<S>[];
  /** custom context */
  context?: Record<string, unknown>;
  /** customize the default sorting behaviour (`localeCompare`) */
  sort?: {
    /** @default 'path' */
    by?: 'name' | 'path';
    locales?: Intl.LocalesArgument;
    options?: Intl.CollatorOptions;
  };
}
interface PageTreeBuilder {
  resolveFlattenPath(name: string, format: string): string;
  root(id?: string, path?: string): Root;
}
//#endregion
//#region src/source/plugins/slugs.d.ts
/**
 * a function to generate slugs, return `undefined` to fallback to default generation.
 */
type SlugFn<S extends ContentStorage = ContentStorage> = (file: S['$inferPage']) => string[] | undefined;
/**
 * Generate slugs for pages if missing
 */
declare function slugsPlugin(slugFn?: SlugFn): LoaderPlugin;
/**
 * Generate slugs from file data (e.g. frontmatter).
 *
 * @param key - the property name in file data to generate slugs, default to `slug`.
 */
declare function slugsFromData(key?: string): SlugFn;
/**
 * Convert file path into slugs, also encode non-ASCII characters, so they can work in pathname
 */
declare function getSlugs(file: string): string[];
//#endregion
//#region src/source/plugins/icon.d.ts
type IconResolver = (icon: string | undefined) => ReactNode;
declare namespace types_d_exports {
  export { AnyInput, GenerateMeta, GenerateMetaFile, GeneratePage, GeneratePageFile, GenerateStorage };
}
type AnyInput = SourceUnion | Record<string, SourceUnion>;
type GeneratePage<T extends AnyInput> = T extends Record<infer K extends string, SourceUnion> ? { [k in K]: T[k] extends SourceUnion<infer D> ? Page<k, D['pageData']> : never; }[K] : T extends SourceUnion<infer D> ? Page<undefined, D['pageData']> : never;
type GenerateMeta<T extends AnyInput> = T extends Record<infer K extends string, SourceUnion> ? { [k in K]: T[k] extends SourceUnion<infer D> ? Meta<k, D['metaData']> : never; }[K] : T extends SourceUnion<infer D> ? Meta<undefined, D['metaData']> : never;
type GeneratePageFile<T extends AnyInput> = T extends Record<infer K extends string, SourceUnion> ? { [k in K]: T[k] extends SourceUnion<infer D> ? ContentStoragePageFile<k, D['pageData']> : never; }[K] : T extends SourceUnion<infer D> ? ContentStoragePageFile<undefined, D['pageData']> : never;
type GenerateMetaFile<T extends AnyInput> = T extends Record<infer K extends string, SourceUnion> ? { [k in K]: T[k] extends SourceUnion<infer D> ? ContentStorageMetaFile<k, D['metaData']> : never; }[K] : T extends SourceUnion<infer D> ? ContentStorageMetaFile<undefined, D['metaData']> : never;
type GenerateStorage<T extends AnyInput> = ContentStorage<GeneratePageFile<T>, GenerateMetaFile<T>>;
//#endregion
//#region src/source/loader.d.ts
type ResolvedInput = StaticSource | Record<string, StaticSource>;
interface LoaderConfig {
  page: Page;
  meta: Meta;
  i18n: I18nConfig | undefined;
}
interface LoaderOptions<S extends ContentStorage = ContentStorage, I18n extends I18nConfig | undefined = I18nConfig | undefined> {
  baseUrl: string;
  i18n?: I18n;
  url?: (slugs: string[], locale?: string) => string;
  /**
   * Additional options for page tree builder
   */
  pageTree?: Partial<PageTreeOptions<S>>;
  plugins?: LoaderPluginOption[] | ((context: {
    typedPlugin: (plugin: LoaderPlugin<S>) => LoaderPlugin;
  }) => LoaderPluginOption[]);
  icon?: IconResolver;
  slugs?: SlugFn<S>;
}
interface ResolvedLoaderConfig {
  input: ResolvedInput;
  url: (slugs: string[], locale?: string) => string;
  plugins: LoaderPlugin[];
  pageTree?: Partial<PageTreeOptions>;
  i18n?: I18nConfig | undefined;
}
interface SharedFileInfo {
  /**
   * Virtualized file path (relative to content directory)
   *
   * @example `docs/page.mdx`
   */
  path: string;
  /**
   * Absolute path of the file
   */
  absolutePath?: string;
}
interface Page<Type extends string | undefined = string | undefined, Data extends PageData = PageData> extends SharedFileInfo {
  type: Type;
  slugs: string[];
  url: string;
  data: Data;
  locale?: string | undefined;
}
interface Meta<Type extends string | undefined = string | undefined, Data extends MetaData = MetaData> extends SharedFileInfo {
  type: Type;
  data: Data;
}
interface LoaderOutput<Config extends LoaderConfig = LoaderConfig> {
  readonly $inferPage: Config['page'];
  readonly $inferMeta: Config['meta'];
  readonly $infer: Config;
  pageTree: Config['i18n'] extends I18nConfig ? Record<string, Root> : Root;
  getPageTree: (locale?: string) => Root;
  /**
   * get referenced page from href, supported:
   *
   * - relative file paths, like `./my/page.mdx`.
   * - generated page pathname, like `/docs/my/page`.
   */
  getPageByHref: (href: string, options?: {
    language?: string;
    /**
     * resolve relative file paths in `href` from specified dirname, must be a virtual path.
     */
    dir?: string;
  }) => {
    page: Config['page'];
    hash?: string;
  } | undefined;
  /**
   * resolve special hrefs in a page, including:
   *
   * - relative file paths, like `./my/page.mdx`.
   */
  resolveHref: (href: string, parent: Config['page']) => string;
  /**
   * @internal
   */
  _i18n?: I18nConfig;
  /**
   * Get a list of pages from specified language
   *
   * @param language - If unspecified, list pages from all languages.
   */
  getPages: (language?: string) => Config['page'][];
  /**
   * get each language and its pages, empty if i18n is not enabled.
   */
  getLanguages: () => {
    language: string;
    pages: Config['page'][];
  }[];
  /**
   * Get page with slugs, the slugs can also be URI encoded.
   *
   * @param language - If unspecified, the default language will be used.
   */
  getPage: (slugs: string[] | undefined, language?: string) => Config['page'] | undefined;
  getNodePage: (node: Item, language?: string) => Config['page'] | undefined;
  getNodeMeta: (node: Folder | Root, language?: string) => Config['meta'] | undefined;
  /**
   * generate static params for Next.js SSG
   *
   * @param slug - customize parameter name for slugs
   * @param lang - customize parameter name for lang
   */
  generateParams: <TSlug extends string = 'slug', TLang extends string = 'lang'>(slug?: TSlug, lang?: TLang) => (Record<TSlug, string[]> & Record<TLang, string>)[];
  /**
   * serialize page tree for non-RSC environments
   */
  serializePageTree: (tree: Root) => Promise<SerializedPageTree>;
}
declare function createGetUrl(baseUrl: string, i18n?: I18nConfig): ResolvedLoaderConfig['url'];
declare function loader<I extends ResolvedInput, I18n extends I18nConfig | undefined = undefined>(source: I, options: LoaderOptions<NoInfer<GenerateStorage<I>>, I18n>): LoaderOutput<{
  meta: GenerateMeta<I>;
  page: GeneratePage<I>;
  i18n: I18n;
}>;
declare function loader<I extends ResolvedInput, I18n extends I18nConfig | undefined = undefined>(options: LoaderOptions<NoInfer<GenerateStorage<I>>, I18n> & {
  source: I;
}): LoaderOutput<{
  meta: GenerateMeta<I>;
  page: GeneratePage<I>;
  i18n: I18n;
}>;
interface LoaderPlugin<S extends ContentStorage = ContentStorage> {
  name?: string;
  /**
   * Change the order of plugin:
   * - `pre`: before normal plugins
   * - `post`: after normal plugins
   */
  enforce?: 'pre' | 'post';
  /**
   * receive & replace loader options
   */
  config?: (config: ResolvedLoaderConfig) => ResolvedLoaderConfig | void | undefined;
  /**
   * transform the storage after loading
   */
  transformStorage?: (context: {
    storage: S;
  }) => void;
  /**
   * transform the generated page tree
   */
  transformPageTree?: PageTreeTransformer<S>;
}
type LoaderPluginOption<S extends ContentStorage = ContentStorage> = LoaderPlugin<S> | LoaderPluginOption<S>[] | undefined;
type InferPageType<Utils extends LoaderOutput<any>> = Utils['$inferPage'];
type InferMetaType<Utils extends LoaderOutput<any>> = Utils['$inferMeta'];
//#endregion
//#region src/source/dynamic.d.ts
type Input = SourceUnion | Record<string, SourceUnion>;
interface DynamicLoaderConfig extends LoaderConfig {
  source: string | undefined;
}
interface DynamicLoader<Config extends DynamicLoaderConfig = DynamicLoaderConfig> {
  get: () => Promise<LoaderOutput<Config>>;
  /** update & re-compute dynamic sources */
  revalidate: (source?: Config['source']) => Promise<void>;
  /** remove computed cache of dynamic sources */
  invalidate: (source?: Config['source']) => void;
  get $inferPage(): Config['page'];
  get $inferMeta(): Config['meta'];
}
declare function dynamicLoader<I extends Input, I18n extends I18nConfig | undefined = undefined>(input: I, options: LoaderOptions<NoInfer<GenerateStorage<I>>, I18n>): DynamicLoader<{
  i18n: I18n;
  meta: NoInfer<GenerateMeta<I>>;
  page: NoInfer<GeneratePage<I>>;
  source: I extends Record<infer K, SourceUnion> ? K : undefined;
}>;
//#endregion
//#region src/source/source.d.ts
type SourceUnion<Config extends SourceConfig = SourceConfig> = StaticSource<Config> | DynamicSource<Config>;
/**
 * @deprecated use `StaticSource<Config>` instead
 */
type Source<Config extends SourceConfig = SourceConfig> = StaticSource<Config>;
interface StaticSource<Config extends SourceConfig = SourceConfig> {
  files: VirtualFile<Config>[];
}
interface DynamicSource<Config extends SourceConfig = SourceConfig> {
  files: () => Awaitable<VirtualFile<Config>[]>;
  configure?: (loader: DynamicLoader) => void;
}
type SourceConfig = {
  pageData: PageData;
  metaData: MetaData;
};
interface MetaData {
  icon?: string | undefined;
  title?: string | undefined;
  root?: boolean | undefined;
  pages?: string[] | undefined;
  pagesIndex?: string | undefined;
  defaultOpen?: boolean | undefined;
  collapsible?: boolean | undefined;
  description?: string | undefined;
}
interface PageData {
  icon?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  structuredData?: StructuredData | (() => Awaitable<StructuredData>) | undefined;
}
type VirtualFile<Config extends SourceConfig = SourceConfig> = VirtualPage<Config['pageData']> | VirtualMeta<Config['metaData']>;
interface BaseVirtualFile {
  /**
   * Virtualized path (relative to content directory)
   *
   * @example `docs/page.mdx`
   */
  path: string;
  /**
   * Absolute path of the file
   */
  absolutePath?: string;
}
interface VirtualPage<Data extends PageData> extends BaseVirtualFile {
  type: 'page';
  /**
   * Specified Slugs for page
   */
  slugs?: string[];
  data: Data;
}
interface VirtualMeta<Data extends MetaData> extends BaseVirtualFile {
  type: 'meta';
  data: Data;
}
/**
 * @deprecated you can directly pass a record of source objects to `loader()`.
 */
declare function multiple<T extends Record<string, StaticSource>>(sources: T): T extends Record<infer K extends string, StaticSource> ? { [k in K]: T[k] extends StaticSource<infer C> ? StaticSource<{
  metaData: C['metaData'] & {
    type: k;
  };
  pageData: C['pageData'] & {
    type: k;
  };
}> : never; } : never;
declare function source<Page extends PageData, Meta extends MetaData>(config: {
  pages: VirtualPage<Page>[];
  metas: VirtualMeta<Meta>[];
}): StaticSource<{
  pageData: Page;
  metaData: Meta;
}>;
interface SourceUpdater<Config extends SourceConfig> {
  files: <Page extends PageData, Meta extends MetaData>(fn: (files: VirtualFile<Config>[]) => (VirtualPage<Page> | VirtualMeta<Meta>)[]) => SourceUpdater<{
    pageData: Page;
    metaData: Meta;
  }>;
  page: <V extends PageData>(fn: (page: VirtualPage<Config['pageData']>) => VirtualPage<V>) => SourceUpdater<{
    pageData: V;
    metaData: Config['metaData'];
  }>;
  meta: <V extends MetaData>(fn: (meta: VirtualMeta<Config['metaData']>) => VirtualMeta<V>) => SourceUpdater<{
    pageData: Config['pageData'];
    metaData: V;
  }>;
  build: () => StaticSource<Config>;
}
/**
 * update a source object in-place.
 */
declare function update<Config extends SourceConfig>(source: StaticSource<Config>): SourceUpdater<Config>;
declare namespace path_d_exports {
  export { basename, dirname, extname, joinPath, normalize, slash, splitPath };
}
declare function basename(path: string, ext?: string): string;
declare function extname(path: string): string;
declare function dirname(path: string): string;
/**
 * Split path into segments, trailing/leading slashes are removed
 */
declare function splitPath(path: string): string[];
/**
 * Resolve paths, slashes within the path will be ignored
 * @param paths - Paths to join
 * @example
 * ```
 * ['a','b'] // 'a/b'
 * ['/a'] // 'a'
 * ['a', '/b'] // 'a/b'
 * ['a', '../b/c'] // 'b/c'
 * ```
 */
declare function joinPath(...paths: string[]): string;
declare function slash(path: string): string;
/**
 * Convert (relative) file path to virtual file path.
 *
 * @param path - Relative path
 * @returns Normalized path, with no trailing/leading slashes
 * @throws Throws error if path starts with `./` or `../`
 */
declare function normalize(path: string): string;
//#endregion
//#region src/source/llms.d.ts
interface Context {
  lang?: string;
}
interface LLMsConfig {
  TAB?: string;
  renderName?: (item: Node | Root, ctx: Context) => string;
  renderDescription?: (item: Root | Item | Folder, ctx: Context) => string;
}
declare function llms<C extends LoaderConfig = LoaderConfig>(loader: LoaderOutput<C>, config?: LLMsConfig): {
  /**
   * generate `llms.txt` content in Markdown format.
   *
   * use `indexNode(node)` instead for more control (e.g. add extra sections to output).
   */
  index: (lang?: string) => string;
  /**
   * generate `llms.txt` content for a single page tree node.
   */
  indexNode(node: Node, lang?: string): string;
};
//#endregion
export { SlugFn as A, ContentStoragePageFile as B, LoaderPluginOption as C, createGetUrl as D, ResolvedLoaderConfig as E, PageTreeBuilderContext as F, PageTreeOptions as I, PageTreeTransformer as L, slugsFromData as M, slugsPlugin as N, loader as O, PageTreeBuilder as P, ContentStorage as R, LoaderPlugin as S, Page as T, FileSystem as V, InferMetaType as _, MetaData as a, LoaderOptions as b, SourceUnion as c, multiple as d, source as f, dynamicLoader as g, DynamicLoaderConfig as h, DynamicSource as i, getSlugs as j, types_d_exports as k, StaticSource as l, DynamicLoader as m, llms as n, PageData as o, update as p, path_d_exports as r, Source as s, LLMsConfig as t, VirtualFile as u, InferPageType as v, Meta as w, LoaderOutput as x, LoaderConfig as y, ContentStorageMetaFile as z };