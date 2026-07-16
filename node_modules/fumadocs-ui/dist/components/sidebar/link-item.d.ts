import { base_d_exports } from "./base.js";
import { LinkItemType } from "../../layouts/shared/index.js";
import { HTMLAttributes } from "react";
//#region src/components/sidebar/link-item.d.ts
type InternalComponents = Pick<typeof base_d_exports, 'SidebarFolder' | 'SidebarFolderLink' | 'SidebarFolderContent' | 'SidebarFolderTrigger' | 'SidebarItem'>;
declare function createLinkItemRenderer({ SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarFolderTrigger, SidebarItem }: InternalComponents): ({ item, ...props }: HTMLAttributes<HTMLElement> & {
  item: Exclude<LinkItemType, {
    type: "icon";
  }>;
}) => import("react").JSX.Element;
//#endregion
export { createLinkItemRenderer };