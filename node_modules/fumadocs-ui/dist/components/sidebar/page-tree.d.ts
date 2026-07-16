import { base_d_exports } from "./base.js";
import { FC, ReactNode } from "react";
import * as PageTree from "fumadocs-core/page-tree";
//#region src/components/sidebar/page-tree.d.ts
interface SidebarPageTreeComponents {
  Item: FC<{
    item: PageTree.Item;
  }>;
  Folder: FC<{
    item: PageTree.Folder;
    children: ReactNode;
  }>;
  Separator: FC<{
    item: PageTree.Separator;
  }>;
}
type InternalComponents = Pick<typeof base_d_exports, 'SidebarSeparator' | 'SidebarFolder' | 'SidebarFolderLink' | 'SidebarFolderContent' | 'SidebarFolderTrigger' | 'SidebarItem'>;
declare function createPageTreeRenderer({ SidebarFolder, SidebarFolderContent, SidebarFolderLink, SidebarFolderTrigger, SidebarSeparator, SidebarItem }: InternalComponents): (components: Partial<SidebarPageTreeComponents>) => import("react").JSX.Element;
//#endregion
export { SidebarPageTreeComponents, createPageTreeRenderer };