import { i as Root, n as Item, r as Node, t as Folder } from "./definitions-D8-KI7Uy.js";
//#region src/page-tree/utils.d.ts
/**
 * Flatten tree to an array of page nodes
 */
declare function flattenTree(nodes: Node[]): Item[];
/**
 * Get neighbours of a page, useful for implementing "previous & next" buttons
 */
declare function findNeighbour(tree: Root, url: string, options?: {
  separateRoot?: boolean;
}): {
  previous?: Item;
  next?: Item;
};
declare function getPageTreeRoots(pageTree: Root | Folder): (Root | Folder)[];
/**
 * Get other **page** nodes that lives under the same parent.
 *
 * note: folders & its index nodes are not considered, use `findSiblings()` for more control.
 */
declare function getPageTreePeers(treeOrTrees: Root | Record<string, Root>, url: string): Item[];
/**
 * Get other tree nodes that lives under the same parent.
 */
declare function findSiblings(treeOrTrees: Root | Record<string, Root>, url: string): Node[];
declare function findParent(from: Root | Folder, url: string): Root | Folder | undefined;
/**
 * Search the path of a node in the tree matched by the matcher.
 *
 * @returns The path to the target node (from starting root), or null if the page doesn't exist
 */
declare function findPath(nodes: Node[], matcher: (node: Node) => boolean, options?: {
  includeSeparator?: boolean;
}): Node[] | null;
/**
 * Perform a depth-first search on page tree visiting every node.
 *
 * @param root - the root of page tree to visit.
 * @param visitor - function to receive nodes, return `skip` to skip the children of current node, `break` to stop the search entirely.
 */
declare function visit<Root$1 extends Node | Root>(root: Root$1, visitor: <T extends Node | Root>(node: T, parent?: Root | Folder) => 'skip' | 'break' | T | void): Root$1;
//#endregion
export { flattenTree as a, visit as c, findSiblings as i, findParent as n, getPageTreePeers as o, findPath as r, getPageTreeRoots as s, findNeighbour as t };