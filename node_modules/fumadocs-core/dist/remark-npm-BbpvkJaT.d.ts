import { Transformer } from "unified";
import { Root } from "mdast";
//#region src/mdx-plugins/remark-npm.d.ts
interface PackageManager {
  name: string;
  /**
   * Default to `name`
   */
  value?: string;
  /**
   * Convert from npm to another package manager
   */
  command: (command: string) => string | undefined;
}
interface RemarkNpmOptions {
  /**
   * Persist Tab value (Fumadocs UI only)
   *
   * @defaultValue false
   */
  persist?: {
    id: string;
  } | false;
  packageManagers?: PackageManager[];
}
/**
 * It generates multiple tabs of codeblocks for different package managers from a npm command codeblock.
 */
declare function remarkNpm({ persist, packageManagers }?: RemarkNpmOptions): Transformer<Root, Root>;
//#endregion
export { remarkNpm as n, RemarkNpmOptions as t };