import { BaseSlots, BaseSlotsProps } from "../shared/client.js";
import { BaseLayoutProps, LinkItemType, NavOptions } from "../shared/index.js";
import { ComponentProps, FC } from "react";
//#region src/layouts/home/index.d.ts
interface HomeLayoutProps extends BaseLayoutProps, ComponentProps<'main'> {
  nav?: Nav;
  slots?: Partial<HomeSlots>;
}
interface Nav extends NavOptions {
  /**
   * Open mobile menu when hovering the trigger
   */
  enableHoverToOpen?: boolean;
}
interface HomeSlots extends BaseSlots {
  header: FC<ComponentProps<'header'>>;
  container: FC<ComponentProps<'main'>>;
}
declare function useHomeLayout(): {
  props: BaseSlotsProps<HomeLayoutProps>;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: HomeSlots;
};
declare function HomeLayout(props: HomeLayoutProps): import("react").JSX.Element;
//#endregion
export { HomeLayout, HomeLayoutProps, HomeSlots, useHomeLayout };