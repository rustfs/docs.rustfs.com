"use client";
import { usePathname } from "fumadocs-core/framework";
import { jsx } from "react/jsx-runtime";
import { createContext, use, useMemo, useRef } from "react";
import { searchPath } from "fumadocs-core/breadcrumb";
//#region src/contexts/tree.tsx
const TreeContext = createContext(null);
const PathContext = createContext([]);
function TreeContextProvider({ tree: rawTree, children }) {
	const nextIdRef = useRef(0);
	const pathname = usePathname();
	const tree = useMemo(() => rawTree, [rawTree.$id]);
	const path = useMemo(() => {
		return searchPath(tree.children, pathname) ?? (tree.fallback ? searchPath(tree.fallback.children, pathname) : null) ?? [];
	}, [tree, pathname]);
	const root = path.findLast((item) => item.type === "folder" && item.root) ?? tree;
	root.$id ??= String(nextIdRef.current++);
	return /* @__PURE__ */ jsx(TreeContext, {
		value: useMemo(() => ({
			root,
			full: tree
		}), [root, tree]),
		children: /* @__PURE__ */ jsx(PathContext, {
			value: path,
			children
		})
	});
}
function useTreePath() {
	return use(PathContext);
}
function useTreeContext() {
	const ctx = use(TreeContext);
	if (!ctx) throw new Error("You must wrap this component under <DocsLayout />");
	return ctx;
}
//#endregion
export { TreeContextProvider, useTreeContext, useTreePath };
