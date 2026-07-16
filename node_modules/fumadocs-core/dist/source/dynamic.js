import { i as isStaticSource, n as loader, r as isDynamicSource } from "../loader-CoSFINvo.js";
import { cache } from "react";
//#region src/source/dynamic.ts
function dynamicLoader(input, options) {
	let loaderCacheKey;
	let loaderCache;
	const sourceCache = /* @__PURE__ */ new Map();
	function configureSources() {
		if (isStaticSource(input)) return;
		if (isDynamicSource(input)) {
			input.configure?.(dynamicLoader);
			return;
		}
		for (const v of Object.values(input)) if (isDynamicSource(v)) v.configure?.(dynamicLoader);
	}
	async function resolveSources(skipCache = false) {
		if (isStaticSource(input) || isDynamicSource(input)) return resolveSource(input, skipCache);
		const entries = await Promise.all(Object.entries(input).map(async ([k, v]) => [k, await resolveSource(v, skipCache)]));
		return Object.fromEntries(entries);
	}
	function resolveSource(v, skipCache = false) {
		if (isStaticSource(v)) return v;
		let resolved = skipCache ? void 0 : sourceCache.get(v);
		if (resolved) return resolved;
		const files = v.files();
		if ("then" in files) resolved = files.then((res) => ({ files: res }));
		else resolved = { files };
		sourceCache.set(v, resolved);
		return resolved;
	}
	const dynamicLoader = {
		get: cache(async () => {
			const resolved = await resolveSources();
			if (loaderCacheKey && isEqual(loaderCacheKey, resolved)) return loaderCache;
			loaderCacheKey = resolved;
			loaderCache = loader(resolved, options);
			return loaderCache;
		}),
		$inferPage: void 0,
		$inferMeta: void 0,
		async revalidate(name) {
			if (name === void 0) await resolveSources(true);
			else if (!isStaticSource(input) && !isDynamicSource(input)) await resolveSource(input[name], true);
		},
		invalidate(name) {
			if (name === void 0) sourceCache.clear();
			else if (!isStaticSource(input) && !isDynamicSource(input)) {
				const s = input[name];
				if (isDynamicSource(s)) sourceCache.delete(s);
			}
		}
	};
	configureSources();
	return dynamicLoader;
}
function isEqual(a, b) {
	if (isStaticSource(a) && isStaticSource(b)) return a === b;
	if (!isStaticSource(a) && !isStaticSource(b)) {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);
		return aKeys.length === bKeys.length && aKeys.every((k) => a[k] === b[k]);
	}
	return false;
}
//#endregion
export { dynamicLoader };
