import { ShikiTransformer } from "shiki";
//#region src/mdx-plugins/transformer-icon.d.ts
type CodeBlockIcon = {
  viewBox: string;
  fill: string;
  d: string;
} | string;
interface IconOptions {
  shortcuts?: Record<string, string>;
  extend?: Record<string, CodeBlockIcon>;
}
/**
 * Inject icons to `icon` property (as HTML)
 */
declare function transformerIcon(options?: IconOptions): ShikiTransformer;
//#endregion
export { IconOptions as n, transformerIcon as r, CodeBlockIcon as t };