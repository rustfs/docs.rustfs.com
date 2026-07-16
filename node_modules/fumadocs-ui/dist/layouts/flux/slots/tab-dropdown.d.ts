import { LayoutTab } from "../../shared/index.js";
import { ComponentProps, ReactNode } from "react";
//#region src/layouts/flux/slots/tab-dropdown.d.ts
interface TabDropdownProps extends ComponentProps<'button'> {
  placeholder?: ReactNode;
  tabs: LayoutTab[];
}
declare function TabDropdown({ tabs, placeholder, className, ...props }: TabDropdownProps): import("react").JSX.Element;
//#endregion
export { TabDropdown, TabDropdownProps };