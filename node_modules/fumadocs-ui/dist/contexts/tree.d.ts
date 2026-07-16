import { ReactNode } from "react";
import * as PageTree from "fumadocs-core/page-tree";
//#region src/contexts/tree.d.ts
type MakeRequired<O, K extends keyof O> = Omit<O, K> & Pick<Required<O>, K>;
interface TreeContextType {
  root: MakeRequired<PageTree.Root | PageTree.Folder, '$id'>;
  full: PageTree.Root;
}
declare function TreeContextProvider({ tree: rawTree, children }: {
  tree: PageTree.Root;
  children: ReactNode;
}): import("react").JSX.Element;
declare function useTreePath(): PageTree.Node[];
declare function useTreeContext(): TreeContextType;
//#endregion
export { TreeContextProvider, useTreeContext, useTreePath };