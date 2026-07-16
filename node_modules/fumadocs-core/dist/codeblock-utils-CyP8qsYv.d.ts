import { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx";
import { BlockContent, Text } from "mdast";
//#region src/mdx-plugins/codeblock-utils.d.ts
interface CodeBlockTabsOptions {
  attributes?: MdxJsxAttribute[];
  defaultValue?: string;
  persist?: {
    id: string;
  } | false;
  triggers: {
    value: string;
    children: (BlockContent | Text)[];
  }[];
  tabs: {
    value: string;
    children: BlockContent[];
  }[];
}
declare function generateCodeBlockTabs({ persist, defaultValue, triggers, tabs, ...options }: CodeBlockTabsOptions): MdxJsxFlowElement;
interface CodeBlockAttributes<Name extends string = string> {
  attributes: Partial<Record<Name, string | number | null>>;
  rest: string;
}
/**
 * Parse Fumadocs-style code block attributes from meta string, like `title="hello world"`
 */
declare function parseCodeBlockAttributes<const Name extends string = string>(meta: string, allowedNames?: Name[]): CodeBlockAttributes<Name>;
//#endregion
export { parseCodeBlockAttributes as i, CodeBlockTabsOptions as n, generateCodeBlockTabs as r, CodeBlockAttributes as t };