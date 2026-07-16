import { BaseSlots, BaseSlotsProps } from "../shared/client.js";
import { LayoutTab, LinkItemType } from "../shared/index.js";
import { SidebarProps, SidebarProviderProps } from "./slots/sidebar.js";
import { DocsLayoutProps } from "./index.js";
import { ComponentProps, FC } from "react";
//#region src/layouts/notebook/client.d.ts
interface DocsSlots extends BaseSlots {
  container: FC<ComponentProps<'div'>>;
  header: FC<ComponentProps<'header'>>;
  sidebar: {
    provider: FC<SidebarProviderProps>;
    root: FC<SidebarProps>;
    trigger: FC<ComponentProps<'button'>>;
    collapseTrigger: FC<ComponentProps<'button'>>;
    useSidebar: () => {
      collapsed: boolean;
      open: boolean;
      setOpen: (V: boolean) => void;
    };
  };
}
interface SlotsProps extends BaseSlotsProps<DocsLayoutProps> {
  sidebar: SidebarProps;
  tabMode: NonNullable<DocsLayoutProps['tabMode']>;
  tabs: LayoutTab[];
}
declare function useNotebookLayout(): {
  props: SlotsProps;
  isNavTransparent: boolean;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: DocsSlots;
};
//#endregion
export { DocsSlots, useNotebookLayout };