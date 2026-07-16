import { TOCPopoverProps, TOCProps, TOCProviderProps } from "./slots/toc.js";
import { Footer, FooterProps } from "./slots/footer.js";
import { Breadcrumb, BreadcrumbProps } from "./slots/breadcrumb.js";
import { MarkdownCopyButton, ViewOptionsPopover } from "../../shared/page-actions.js";
import { ComponentProps, FC, ReactNode } from "react";
import { TOCItemType } from "fumadocs-core/toc";
//#region src/layouts/docs/page/index.d.ts
interface DocsPageProps extends ComponentProps<'article'> {
  toc?: TOCItemType[];
  /**
   * Extend the page to fill all available space
   *
   * @defaultValue false
   */
  full?: boolean | undefined;
  slots?: Partial<DocsPageSlots>;
  footer?: FooterOptions;
  breadcrumb?: BreadcrumbOptions;
  tableOfContent?: TableOfContentOptions;
  tableOfContentPopover?: TableOfContentPopoverOptions;
}
interface BreadcrumbOptions extends BreadcrumbProps {
  enabled?: boolean;
  /**
   * @deprecated use `slots.breadcrumb` instead.
   */
  component?: ReactNode;
}
interface FooterOptions extends FooterProps {
  enabled?: boolean;
  /**
   * @deprecated use `slots.footer` instead.
   */
  component?: ReactNode;
}
type TableOfContentOptions = Pick<TOCProviderProps, 'single'> & TOCProps & {
  enabled?: boolean;
  /**
   * @deprecated use `slots.toc` instead.
   */
  component?: ReactNode;
};
type TableOfContentPopoverOptions = TOCPopoverProps & {
  enabled?: boolean;
  /**
   * @deprecated use `slots.tocPopover` instead.
   */
  component?: ReactNode;
};
interface DocsPageSlots {
  toc: {
    provider: FC<TOCProviderProps>;
    main: FC<TOCProps>;
    popover: FC<TOCPopoverProps>;
  };
  container: FC<ComponentProps<'article'>>;
  footer: FC<FooterProps>;
  breadcrumb: FC<BreadcrumbProps>;
}
declare function useDocsPage(): {
  full: NonNullable<DocsPageProps["full"]>;
  slots: DocsPageSlots;
};
declare function DocsPage({ full, tableOfContent: { enabled: tocEnabled, single, ...tocProps }, tableOfContentPopover: { enabled: tocPopoverEnabled, ...tocPopoverProps }, breadcrumb: { enabled: breadcrumbEnabled, ...breadcrumb }, footer: { enabled: footerEnabled, ...footer }, toc, slots: defaultSlots, children, ...containerProps }: DocsPageProps): import("react").JSX.Element;
declare function EditOnGitHub(props: ComponentProps<'a'>): import("react").JSX.Element;
/**
 * Add typography styles
 */
declare function DocsBody({ children, className, ...props }: ComponentProps<'div'>): import("react").JSX.Element;
declare function DocsDescription({ children, className, ...props }: ComponentProps<'p'>): import("react").JSX.Element | null;
declare function DocsTitle({ children, className, ...props }: ComponentProps<'h1'>): import("react").JSX.Element;
declare function PageLastUpdate({ date: value, ...props }: Omit<ComponentProps<'p'>, 'children'> & {
  date: Date;
}): import("react").JSX.Element;
//#endregion
export { type BreadcrumbProps, DocsBody, DocsDescription, DocsPage, DocsPageProps, DocsTitle, EditOnGitHub, type FooterProps, MarkdownCopyButton, Breadcrumb as PageBreadcrumb, Footer as PageFooter, PageLastUpdate, ViewOptionsPopover, useDocsPage };