import { SidebarProviderProps as SidebarProviderProps$1, useSidebar as useSidebar$1 } from "../../../components/sidebar/base.js";
import { SidebarPageTreeComponents } from "../../../components/sidebar/page-tree.js";
import { ComponentProps, ReactNode } from "react";
//#region src/layouts/flux/slots/sidebar.d.ts
interface SidebarProps extends ComponentProps<'aside'> {
  components?: Partial<SidebarPageTreeComponents>;
  banner?: ReactNode;
  footer?: ReactNode;
}
type SidebarProviderProps = SidebarProviderProps$1;
declare const useSidebar: typeof useSidebar$1;
declare function SidebarProvider(props: SidebarProviderProps): import("react").JSX.Element;
declare function Sidebar({ footer, banner, components, ...rest }: SidebarProps): import("react").JSX.Element;
declare function SidebarTrigger(props: ComponentProps<'button'>): import("react").JSX.Element;
//#endregion
export { Sidebar, SidebarProps, SidebarProvider, SidebarProviderProps, SidebarTrigger, useSidebar };