//#region src/content/md/frontmatter.d.ts
interface Output {
  /**
   * The matter section, including the delimiter.
   */
  matter: string;
  content: string;
  data: unknown;
}
/**
 * parse frontmatter, it supports only yaml format
 */
declare function frontmatter(input: string): Output;
//#endregion
export { frontmatter };