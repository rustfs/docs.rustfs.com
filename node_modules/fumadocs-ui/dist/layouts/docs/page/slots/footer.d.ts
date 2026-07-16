import { ComponentProps } from "react";
import * as PageTree from "fumadocs-core/page-tree";
//#region src/layouts/docs/page/slots/footer.d.ts
type Item = Pick<PageTree.Item, 'name' | 'description' | 'url'>;
interface FooterProps extends ComponentProps<'div'> {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: Item;
    next?: Item;
  };
}
declare function Footer({ items, children, className, ...props }: FooterProps): import("react").JSX.Element;
//#endregion
export { Footer, FooterProps };