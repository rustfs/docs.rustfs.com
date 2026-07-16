import { CodeBlockProps } from "./codeblock.js";
import { HighlightOptions } from "fumadocs-core/highlight";
//#region src/components/codeblock.rsc.d.ts
type ServerCodeBlockProps = HighlightOptions & {
  code: string;
  /**
   * Extra props for the underlying `<CodeBlock />` component.
   *
   * Ignored if you defined your own `pre` component in `components`.
   */
  codeblock?: CodeBlockProps;
};
declare function ServerCodeBlock({ code, codeblock, ...options }: ServerCodeBlockProps): Promise<import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | (string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<import("react").ReactNode> | null | undefined)>;
//#endregion
export { ServerCodeBlock, ServerCodeBlockProps };