import { TOCItemsProps } from "../../../../components/toc/clerk.js";
import { TOCItemsProps as TOCItemsProps$1 } from "../../../../components/toc/default.js";
import { TOCProvider as TOCProvider$1, TOCProviderProps as TOCProviderProps$1 } from "../../../../components/toc/index.js";
import { ComponentProps, ReactNode } from "react";
//#region src/layouts/flux/page/slots/toc.d.ts
type TOCProviderProps = TOCProviderProps$1;
declare const TOCProvider: typeof TOCProvider$1;
type TOCProps = {
  container?: ComponentProps<'div'>;
  trigger?: ComponentProps<'button'>;
  content?: ComponentProps<'div'>;
  /**
   * Custom content in TOC container, before the main TOC
   */
  header?: ReactNode;
  /**
   * Custom content in TOC container, after the main TOC
   */
  footer?: ReactNode;
} & ({
  style?: 'normal';
  list?: TOCItemsProps$1;
} | {
  style: 'clerk';
  list?: TOCItemsProps;
});
declare function TOC({ container, trigger, content, header, footer, style, list }: TOCProps): import("react").JSX.Element | undefined;
//#endregion
export { TOC, TOCProps, TOCProvider, TOCProviderProps };