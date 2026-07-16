import { Processor, Transformer } from "unified";
import { Root } from "mdast";
//#region src/mdx-plugins/remark-code-tab.d.ts
type TabType = 'CodeBlockTabs' | 'Tabs';
interface RemarkCodeTabOptions {
  Tabs?: TabType;
  /**
   * Parse MDX in tab values
   *
   * @defaultValue false
   */
  parseMdx?: boolean;
}
declare module 'mdast' {
  interface CodeData {
    /**
     * [Fumadocs: remark-code-tab] the associated tab value
     */
    tab?: string;
    /**
     * [Fumadocs: remark-code-tab] the associated tab group ID
     */
    tabGroup?: string;
  }
  interface Data {
    /**
     * [Fumadocs: remark-code-tab] internal
     */
    _code_tab_visited?: true;
  }
}
declare function remarkCodeTab(this: Processor, options?: RemarkCodeTabOptions): Transformer<Root, Root>;
//#endregion
export { remarkCodeTab as n, RemarkCodeTabOptions as t };