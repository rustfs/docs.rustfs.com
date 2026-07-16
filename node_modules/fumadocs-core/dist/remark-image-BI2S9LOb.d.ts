import { Transformer } from "unified";
import { Root } from "mdast";
//#region src/mdx-plugins/remark-image.d.ts
type ExternalImageOptions = {
  /**
   * timeout for fetching remote images (in milliseconds)
   */
  timeout?: number;
} | boolean;
interface RemarkImageOptions {
  /**
   * Directory or base URL to resolve absolute image paths
   */
  publicDir?: string;
  /**
   * Preferred placeholder type, only available with `useImport` + local images.
   *
   * @defaultValue 'none'
   */
  placeholder?: 'blur' | 'none';
  /**
   * Define how to handle errors when fetching image size.
   *
   * - `error` (default): throw an error.
   * - `ignore`: do absolutely nothing (Next.js Image component may complain).
   * - `hide`: remove that image element.
   *
   * @defaultValue 'error'
   */
  onError?: 'error' | 'hide' | 'ignore' | ((error: Error) => void);
  /**
   * Import images in the file, and let bundlers handle it.
   *
   * ```tsx
   * import MyImage from "./public/img.png";
   *
   * <img src={MyImage} />
   * ```
   *
   * When disabled, `placeholder` will be ignored.
   *
   * @defaultValue true
   */
  useImport?: boolean;
  /**
   * Fetch image size of external URLs
   *
   * @defaultValue true
   */
  external?: ExternalImageOptions;
}
/**
 * Turn images into Next.js Image compatible usage.
 */
declare function remarkImage({ placeholder, external, useImport, onError, publicDir }?: RemarkImageOptions): Transformer<Root, Root>;
//#endregion
export { remarkImage as n, RemarkImageOptions as t };