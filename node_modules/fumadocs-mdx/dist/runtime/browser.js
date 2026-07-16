import { use } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/runtime/browser.tsx
function browser() {
	return { doc(_name, glob) {
		return {
			raw: glob,
			createClientLoader({ id = _name, ...options }) {
				return createClientLoader(this.raw, {
					id,
					...options
				});
			}
		};
	} };
}
const loaderStore = /* @__PURE__ */ new Map();
function createClientLoader(globEntries, options) {
	const { id = "", component: useRenderer } = options;
	const renderers = {};
	const loaders = /* @__PURE__ */ new Map();
	const store = loaderStore.get(id) ?? { preloaded: /* @__PURE__ */ new Map() };
	loaderStore.set(id, store);
	for (const k in globEntries) loaders.set(k.startsWith("./") ? k.slice(2) : k, globEntries[k]);
	function getLoader(path) {
		const loader = loaders.get(path);
		if (!loader) throw new Error(`[createClientLoader] ${path} does not exist in available entries`);
		return loader;
	}
	function getRenderer(path) {
		if (path in renderers) return renderers[path];
		let promise;
		function Renderer(props) {
			let doc = store.preloaded.get(path);
			doc ??= use(promise ??= getLoader(path)());
			return useRenderer(doc, props);
		}
		return renderers[path] = Renderer;
	}
	return {
		async preload(path) {
			const loaded = await getLoader(path)();
			store.preloaded.set(path, loaded);
			return loaded;
		},
		getComponent(path) {
			return getRenderer(path);
		},
		useContent(path, props) {
			return /* @__PURE__ */ jsx(getRenderer(path), { ...props });
		}
	};
}
//#endregion
export { browser, createClientLoader };
