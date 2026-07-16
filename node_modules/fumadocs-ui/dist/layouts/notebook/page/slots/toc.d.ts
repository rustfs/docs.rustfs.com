import { TOCItemsProps } from "../../../../components/toc/clerk.js";
import { TOCItemsProps as TOCItemsProps$1 } from "../../../../components/toc/default.js";
import { TOCProviderProps as TOCProviderProps$1 } from "../../../../components/toc/index.js";
import { ComponentProps, ReactNode } from "react";
//#region src/layouts/notebook/page/slots/toc.d.ts
type TOCProviderProps = TOCProviderProps$1;
declare function TOCProvider(props: TOCProviderProps): import("react").JSX.Element;
type TOCProps = {
  container?: ComponentProps<'div'>;
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
declare function TOC({ container, header, footer, style, list }: TOCProps): import("react").JSX.Element;
type TOCPopoverProps = {
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
declare function TOCPopover({ container, trigger, content, header, footer, style, list }: TOCPopoverProps): import("react").JSX.Element;
//#endregion
export { TOC, TOCPopover, TOCPopoverProps, TOCProps, TOCProvider, TOCProviderProps };