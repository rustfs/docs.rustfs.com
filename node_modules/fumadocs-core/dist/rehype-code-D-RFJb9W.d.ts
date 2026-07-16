import { t as RehypeCodeOptionsCommon } from "./rehype-code.core-BjH1uHWj.js";
//#region src/mdx-plugins/rehype-code.d.ts
type RehypeCodeOptions = RehypeCodeOptionsCommon & {
  /**
   * The regex engine to use.
   *
   * @defaultValue 'js'
   */
  engine?: 'js' | 'oniguruma';
};
declare const rehypeCodeDefaultOptions: RehypeCodeOptions;
declare const rehypeCode: (this: import("unified").Processor, _options?: Partial<RehypeCodeOptions> | undefined) => import("unified").Transformer<import("hast").Root, import("hast").Root>;
//#endregion
export { rehypeCode as n, rehypeCodeDefaultOptions as r, RehypeCodeOptions as t };