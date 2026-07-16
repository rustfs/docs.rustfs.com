import { a as Separator$1, n as Item$1, t as Folder$1 } from "../../definitions-D8-KI7Uy.js";
import { S as LoaderPlugin } from "../../index-DmFlQQrd2.js";
import { ReactNode } from "react";
//#region src/source/plugins/status-badges.d.ts
interface Item extends Item$1 {
  /**
   * Status badge to display in the sidebar (e.g., "new", "beta", "deprecated", "experimental").
   */
  status?: string;
}
interface Folder extends Omit<Folder$1, 'children' | 'index'> {
  index?: Item;
  children: Node[];
}
type Separator = Separator$1;
type Node = Item | Folder | Separator;
/**
 * Plugin to add status badges to pages in the sidebar.
 *
 * This reads the `status` field from page frontmatter and adds it to the page tree item.
 * Define the `renderBadge` option to render it.
 *
 * @example
 * ```tsx
 * import { loader } from 'fumadocs-core/source';
 * import { statusBadgesPlugin } from 'fumadocs-core/source/status-badges';
 *
 * export const source = loader({
 *   plugins: [
 *     statusBadgesPlugin({
 *       renderBadge: (status) => <span>{status}</span>,
 *     }),
 *   ],
 *   // ...
 * });
 * ```
 *
 * Then in your frontmatter:
 * ```yaml
 * ---
 * title: My Page
 * status: new
 * ---
 * ```
 */
declare function statusBadgesPlugin(options?: {
  renderBadge?: (status: string) => ReactNode;
}): LoaderPlugin;
//#endregion
export { Folder, Item, Node, Separator, statusBadgesPlugin };