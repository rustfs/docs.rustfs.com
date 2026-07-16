import { ReactNode } from "react";
//#region src/page-tree/definitions.d.ts
interface ID {
  /**
   * ID for the node, unique in all page trees (even across different locales)
   */
  $id?: string;
}
interface Root extends ID {
  /**
   * @internal folder `$ref`
   */
  $ref?: Folder['$ref'];
  type?: 'root';
  name: ReactNode;
  description?: ReactNode;
  children: Node[];
  /**
   * Another page tree that won't be displayed unless being opened.
   */
  fallback?: Root;
}
type Node = Item | Separator | Folder;
interface Item extends ID {
  /**
   * @internal page file path
   */
  $ref?: string;
  type: 'page';
  name: ReactNode;
  url: string;
  /**
   * Whether the link should be treated as external (e.g. use HTML <a> tag).
   *
   * When unspecified, it depends on the value of `url`.
   */
  external?: boolean;
  description?: ReactNode;
  icon?: ReactNode;
}
interface Separator extends ID {
  type: 'separator';
  name?: ReactNode;
  icon?: ReactNode;
}
interface Folder extends ID {
  /**
   * @internal paths of meta file & folder
   */
  $ref?: {
    meta?: string;
    folder: string;
  };
  type: 'folder';
  name: ReactNode;
  description?: ReactNode;
  root?: boolean;
  defaultOpen?: boolean;
  collapsible?: boolean;
  index?: Item;
  icon?: ReactNode;
  children: Node[];
}
//#endregion
export { Separator as a, Root as i, Item as n, Node as r, Folder as t };