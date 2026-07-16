import { t as BASE_PATH } from "../../url-CWbf4MFh.js";
import { n as search, t as createDocument } from "../../utils-Bvy3V-fv.js";
//#region src/search/client/flexsearch-static.ts
function initDocument(data) {
	const document = createDocument();
	for (const [k, v] of Object.entries(data)) document.import(k, v);
	return document;
}
const cacheMap = /* @__PURE__ */ new Map();
function flexsearchStaticClient(options = {}) {
	const { from = `${BASE_PATH}api/search`, locale = "", tag } = options;
	let dbs = cacheMap.get(from);
	if (!dbs && typeof window !== "undefined") {
		dbs = init(from);
		cacheMap.set(from, dbs);
	}
	return {
		deps: [
			from,
			locale,
			tag
		],
		async search(query) {
			const db = (await dbs).get(locale);
			if (!db) return [];
			return search(db, query, tag);
		}
	};
}
async function init(from) {
	const res = await fetch(from);
	if (!res.ok) throw new Error(`failed to fetch exported search indexes from ${from}, make sure the search database is exported and available for client.`);
	const data = await res.json();
	const dbs = /* @__PURE__ */ new Map();
	if (data.type === "i18n") {
		for (const [locale, map] of Object.entries(data.raw)) dbs.set(locale, initDocument(map));
		return dbs;
	} else dbs.set("", initDocument(data.raw));
	return dbs;
}
//#endregion
export { flexsearchStaticClient };
