import { Pluggable } from "unified";
//#region src/content/mdx/util.d.ts
type Thenable<T> = T | PromiseLike<T>;
type ResolvePlugins = Thenable<Pluggable>[] | ((v: Pluggable[]) => Thenable<Pluggable>[]);
//#endregion
export { ResolvePlugins as t };