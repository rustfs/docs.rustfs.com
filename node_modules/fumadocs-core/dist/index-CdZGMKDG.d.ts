import { i as Root } from "./definitions-D8-KI7Uy.js";
import "./index-DZN5OrTa.js";
//#region src/source/client/index.d.ts
interface SerializedPageTree {
  $fumadocs_loader: 'page-tree';
  data: object;
}
type Serialized<Data> = { [K in keyof Data]: Data[K] extends SerializedPageTree ? Root : Data[K]; };
declare function deserializePageTree(serialized: SerializedPageTree): Root;
/**
 * Deserialize loader data that is serialized by the server-side Fumadocs `loader()`, supported:
 * - Page Tree
 *
 * other unrelated properties are kept in the output.
 */
declare function useFumadocsLoader<V>(serialized: V): Serialized<V>;
//#endregion
export { useFumadocsLoader as i, SerializedPageTree as n, deserializePageTree as r, Serialized as t };