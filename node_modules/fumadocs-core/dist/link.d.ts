import { ComponentProps } from "react";
//#region src/link.d.ts
interface LinkProps extends ComponentProps<'a'> {
  /**
   * If the href is an external URL
   *
   * automatically determined by default
   */
  external?: boolean;
  /**
   * Prefetch links
   */
  prefetch?: boolean;
}
declare function Link({ ref, href, external, prefetch, children, ...props }: LinkProps): import("react").JSX.Element;
//#endregion
export { Link, Link as default, LinkProps };