import { DynamicCodeblockProps as DynamicCodeblockProps$1 } from "./dynamic-codeblock.core.js";
//#region src/components/dynamic-codeblock.d.ts
type DynamicCodeblockProps = Omit<DynamicCodeblockProps$1, 'highlighter' | 'options'> & {
  options?: DynamicCodeblockProps$1['options'];
};
declare function DynamicCodeBlock(props: DynamicCodeblockProps): import("react").JSX.Element;
//#endregion
export { DynamicCodeBlock, DynamicCodeblockProps };