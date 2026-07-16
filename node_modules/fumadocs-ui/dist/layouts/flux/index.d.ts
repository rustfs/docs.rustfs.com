import { BaseSlots, BaseSlotsProps } from "../shared/client.js";
import { BaseLayoutProps, GetLayoutTabsOptions, LayoutTab, LinkItemType } from "../shared/index.js";
import { TabDropdownProps } from "./slots/tab-dropdown.js";
import { SidebarProps, SidebarProviderProps } from "./slots/sidebar.js";
import { ComponentProps, FC, ReactNode } from "react";
import * as PageTree from "fumadocs-core/page-tree";
import { motion } from "motion/react";
//#region src/layouts/flux/index.d.ts
interface DocsSlots extends BaseSlots {
  container: FC<ComponentProps<'div'>>;
  tabDropdown: FC<TabDropdownProps>;
  sidebar: {
    provider: FC<SidebarProviderProps>;
    trigger: FC<ComponentProps<'button'>>;
    root: FC<SidebarProps>;
    useSidebar: () => {
      collapsed: boolean;
      open: boolean;
      setOpen: (v: boolean) => void;
    };
  };
}
interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
  sidebar?: SidebarOptions;
  tabs?: LayoutTab[] | GetLayoutTabsOptions | false;
  slots?: Partial<DocsSlots>;
  renderNavigationPanel?: (props: NavigationPanelProps) => ReactNode;
  containerProps?: ComponentProps<'div'>;
}
interface SidebarOptions extends SidebarProps, SidebarProviderProps {
  enabled?: boolean;
  /**
   * @deprecated use layout-level `tabs` instead.
   */
  tabs?: LayoutTab[] | GetLayoutTabsOptions | false;
}
declare function useFluxLayout(): {
  props: BaseSlotsProps;
  menuItems: LinkItemType[];
  navItems: LinkItemType[];
  slots: DocsSlots;
};
declare function DocsLayout(props: DocsLayoutProps): import("react").JSX.Element;
interface NavigationPanelProps {
  head: ReactNode;
  tabDropdown: ReactNode;
  tool: ReactNode;
  link: ReactNode;
}
declare function NavigationPanel({ head, tabDropdown, tool, link, children, ...props }: NavigationPanelProps & Omit<ComponentProps<typeof motion.div>, 'children'> & {
  /**
   * replace default children
   */
  children?: (defaultChildren: ReactNode) => ReactNode;
}): import("react").JSX.Element;
declare function NavigationPanelOverlay({ enabled, className, ...props }: ComponentProps<typeof motion.div> & {
  enabled?: boolean;
}): import("react").JSX.Element;
//#endregion
export { DocsLayout, DocsLayoutProps, DocsSlots, NavigationPanel, NavigationPanelOverlay, NavigationPanelProps, useFluxLayout };