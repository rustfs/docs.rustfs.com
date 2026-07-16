import { t as RehypeCodeOptions } from "../../rehype-code-D-RFJb9W.js";
import { t as RemarkImageOptions } from "../../remark-image-BI2S9LOb.js";
import { r as StructureOptions } from "../../remark-structure-CnHwvNZr.js";
import { t as RemarkHeadingOptions } from "../../remark-heading-BcV2W1fM.js";
import { t as RemarkCodeTabOptions } from "../../remark-code-tab-DE_4bdnu.js";
import { t as RemarkNpmOptions } from "../../remark-npm-BbpvkJaT.js";
import "../../index-DdWT_FjJ.js";
import { t as ResolvePlugins } from "../../util-BDsqOxh3.js";
import { ProcessorOptions } from "@mdx-js/mdx";
//#region src/content/mdx/preset-runtime.d.ts
type MDXRuntimePresetOptions = Omit<NonNullable<ProcessorOptions>, 'rehypePlugins' | 'remarkPlugins'> & {
  rehypePlugins?: ResolvePlugins;
  remarkPlugins?: ResolvePlugins;
  remarkStructureOptions?: StructureOptions | false;
  remarkHeadingOptions?: RemarkHeadingOptions | false;
  remarkImageOptions?: RemarkImageOptions | false;
  remarkCodeTabOptions?: RemarkCodeTabOptions | false;
  remarkNpmOptions?: RemarkNpmOptions | false;
  rehypeCodeOptions?: RehypeCodeOptions | false;
};
/**
 * apply MDX processor presets
 */
declare function mdxPreset(options?: MDXRuntimePresetOptions): Promise<ProcessorOptions>;
//#endregion
export { MDXRuntimePresetOptions, mdxPreset };