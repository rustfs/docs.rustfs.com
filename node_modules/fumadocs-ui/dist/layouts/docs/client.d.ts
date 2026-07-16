import { BaseSlots, BaseSlotsProps } from "../shared/client.js";
import { LayoutTab, LinkItemType } from "../shared/index.js";
import { SidebarProps, SidebarProviderProps } from "./slots/sidebar.js";
import { DocsLayoutProps } from "./index.js";
import { ComponentProps, FC } from "react";
//#region src/layouts/docs/client.d.ts
interface DocsSlots extends BaseSlots {
  container: FC<ComponentProps<'div'>>;
  header: FC<ComponentProps<'header'>>;
  sidebar: {
    provider: FC<SidebarProviderProps>;
    root: FC<SidebarProps>;
    trigger: FC<ComponentProps<'button'>>;
    useSidebar: () => {
      collapsed: boolean;
      open: boolean;
      setOpen: (v: boolean) => void;
    };
  };
}
interface SlotsProps extends BaseSlotsProps<DocsLayoutProps> {
  tabs: LayoutTab[];
  tabMode: NonNullable<DocsLayoutProps['tabMode']>;
}
declare function useDocsLayout(): {
  props: SlotsProps;
  isNavTransparent: boolean;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: DocsSlots;
};
//#endregion
export { DocsSlots, useDocsLayout };