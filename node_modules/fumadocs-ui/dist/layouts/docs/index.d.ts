import { BaseLayoutProps, GetLayoutTabsOptions, LayoutTab } from "../shared/index.js";
import { SidebarProps, SidebarProviderProps } from "./slots/sidebar.js";
import { DocsSlots, useDocsLayout } from "./client.js";
import { HTMLAttributes, ReactNode } from "react";
import * as PageTree from "fumadocs-core/page-tree";
//#region src/layouts/docs/index.d.ts
interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
  sidebar?: SidebarOptions;
  tabMode?: 'top' | 'auto';
  tabs?: LayoutTab[] | GetLayoutTabsOptions | false;
  containerProps?: HTMLAttributes<HTMLDivElement>;
  slots?: Partial<DocsSlots>;
}
interface SidebarOptions extends SidebarProps, SidebarProviderProps {
  enabled?: boolean;
  /**
   * @deprecated use `slots.sidebar` instead.
   */
  component?: ReactNode;
  /**
   * @deprecated use layout-level `tabMode` option instead.
   */
  tabMode?: 'auto' | 'top';
  /**
   * @deprecated use layout-level `tabs` option instead.
   */
  tabs?: LayoutTab[] | GetLayoutTabsOptions | false;
}
declare function DocsLayout({ tree, sidebar: { tabs: _tabs, tabMode: _tabMode, ...sidebarProps }, tabs: layoutTabs, tabMode, children, ...props }: DocsLayoutProps): import("react").JSX.Element;
//#endregion
export { DocsLayout, DocsLayoutProps, type DocsSlots, useDocsLayout };