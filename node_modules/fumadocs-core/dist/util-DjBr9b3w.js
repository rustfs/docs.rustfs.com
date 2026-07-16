//#region src/content/mdx/util.ts
async function resolvePlugins(def, options = []) {
	const list = (await Promise.all(def(Array.isArray(options) ? options : []))).filter((v) => v !== false);
	if (typeof options === "function") return Promise.all(options(list));
	return list;
}
//#endregion
export { resolvePlugins as t };
