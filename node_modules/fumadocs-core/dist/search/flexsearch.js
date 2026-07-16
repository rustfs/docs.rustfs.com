import { t as createEndpoint } from "../endpoint-MyoBU5IC.js";
import { n as buildBreadcrumbs, r as buildIndexDefault, t as buildDocuments } from "../build-doc-CTQdPLc0.js";
import { n as search, t as createDocument } from "../utils-Bvy3V-fv.js";
import Search from "flexsearch";
//#region src/search/flexsearch.ts
function server(options) {
	function initIndex(indexes) {
		const index = createDocument(options.document);
		for (const doc of buildDocuments(indexes)) index.add(doc.id, doc);
		return index;
	}
	const indexPromise = typeof options.indexes === "function" ? Promise.resolve(options.indexes()).then(initIndex) : initIndex(options.indexes);
	return {
		async export() {
			const index = await indexPromise;
			const raw = {};
			index.export((key, data) => {
				raw[key] = data;
			});
			return {
				type: "default",
				raw
			};
		},
		async search(query, searchOptions) {
			return search(await indexPromise, query, searchOptions?.tag, searchOptions?.limit);
		}
	};
}
function serverI18n(options) {
	const { indexes: inputIndexes, localeMap } = options;
	async function initSearchServers() {
		const map = /* @__PURE__ */ new Map();
		const indexMap = /* @__PURE__ */ new Map();
		const indexes = typeof inputIndexes === "function" ? await inputIndexes() : inputIndexes;
		for (const index of indexes) {
			let list = indexMap.get(index.locale);
			if (!list) {
				list = [];
				indexMap.set(index.locale, list);
			}
			list.push(index);
		}
		for (const [locale, list] of indexMap) {
			const override = localeMap?.[locale];
			map.set(locale, server({
				indexes: list,
				document: override === "cjk" ? {
					...options.document,
					encoder: Search.Charset.CJK
				} : {
					...options.document,
					...override
				}
			}));
		}
		return map;
	}
	const get = initSearchServers();
	return {
		async export() {
			const map = await get;
			const entries = Array.from(map.entries()).map(async ([k, v]) => {
				return [k, (await v.export()).raw];
			});
			return {
				type: "i18n",
				raw: Object.fromEntries(await Promise.all(entries))
			};
		},
		async search(query, searchOptions) {
			const handler = (await get).get(searchOptions?.locale ?? options.i18n.defaultLanguage);
			if (handler) return handler.search(query, searchOptions);
			return [];
		}
	};
}
function flexsearch(options) {
	return createEndpoint(server(options));
}
function flexsearchI18n(options) {
	return createEndpoint(serverI18n(options));
}
/**
* create server from loader, if passed as function, the server will re-index all records once a different instance of loader is returned.
*/
function flexsearchFromSource(loader, options = {}) {
	const cache = /* @__PURE__ */ new WeakMap();
	const { buildIndex = buildIndexDefault, ...rest } = options;
	async function initServer(loader) {
		const indexes = await Promise.all(loader.getPages().map(async (page) => {
			const index = await buildIndex(page);
			return {
				...index,
				locale: page.locale,
				breadcrumbs: index.breadcrumbs ?? buildBreadcrumbs(loader, page)
			};
		}));
		if (loader._i18n) return serverI18n({
			indexes,
			i18n: loader._i18n,
			...rest
		});
		return server({
			indexes,
			...rest
		});
	}
	async function getCurrentServer() {
		const l = typeof loader === "function" ? await loader() : loader;
		let server = cache.get(l);
		if (!server) {
			server = initServer(l);
			cache.set(l, server);
		}
		return await server;
	}
	return createEndpoint({
		async export() {
			return (await getCurrentServer()).export();
		},
		async search(query, options) {
			return (await getCurrentServer()).search(query, options);
		}
	});
}
//#endregion
export { flexsearch, flexsearchFromSource, flexsearchI18n };
