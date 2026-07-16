import { t as BASE_PATH } from "./url-CWbf4MFh-BgunFcmM.js";
//#region node_modules/fumadocs-core/dist/search/client/fetch.js
var globalCache = /* @__PURE__ */ new Map();
function fetchClient({ api = `${BASE_PATH}api/search`, locale, tag, cache = globalCache } = {}) {
	return {
		deps: [
			api,
			locale,
			tag
		],
		async search(query) {
			const url = new URL(api, window.location.origin);
			url.searchParams.set("query", query);
			if (locale) url.searchParams.set("locale", locale);
			if (tag) url.searchParams.set("tag", Array.isArray(tag) ? tag.join(",") : tag);
			const key = url.toString();
			const cached = cache.get(key);
			if (cached) return cached;
			const res = await fetch(url);
			if (!res.ok) throw new Error(await res.text());
			const result = await res.json();
			cache.set(key, result);
			return result;
		}
	};
}
//#endregion
export { fetchClient };
