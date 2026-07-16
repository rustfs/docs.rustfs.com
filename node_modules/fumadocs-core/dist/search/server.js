import { n as defaultReadOptions, t as createEndpoint } from "../endpoint-MyoBU5IC.js";
import { n as buildBreadcrumbs, r as buildIndexDefault, t as buildDocuments } from "../build-doc-CTQdPLc0.js";
import { n as searchSimple, t as searchAdvanced } from "../advanced-BnqbPavQ.js";
import { create, insertMultiple, save } from "@orama/orama";
//#region src/search/orama/_stemmers.ts
const STEMMERS = {
	arabic: "ar",
	armenian: "am",
	bulgarian: "bg",
	czech: "cz",
	danish: "dk",
	dutch: "nl",
	english: "en",
	finnish: "fi",
	french: "fr",
	german: "de",
	greek: "gr",
	hungarian: "hu",
	indian: "in",
	indonesian: "id",
	irish: "ie",
	italian: "it",
	lithuanian: "lt",
	nepali: "np",
	norwegian: "no",
	portuguese: "pt",
	romanian: "ro",
	russian: "ru",
	serbian: "rs",
	slovenian: "ru",
	spanish: "es",
	swedish: "se",
	tamil: "ta",
	turkish: "tr",
	ukrainian: "uk",
	vietnamese: "vi",
	sanskrit: "sk"
};
//#endregion
//#region src/search/orama/create-db.ts
const simpleSchema = {
	url: "string",
	title: "string",
	breadcrumbs: "string[]",
	description: "string",
	content: "string",
	keywords: "string"
};
const advancedSchema = {
	content: "string",
	page_id: "string",
	type: "string",
	breadcrumbs: "string[]",
	tags: "enum[]",
	url: "string",
	embeddings: "vector[512]"
};
async function createDB({ indexes, tokenizer, search: _, ...rest }) {
	const items = typeof indexes === "function" ? await indexes() : indexes;
	const db = create({
		schema: advancedSchema,
		...rest,
		components: {
			...rest.components,
			tokenizer: tokenizer ?? rest.components?.tokenizer
		}
	});
	await insertMultiple(db, buildDocuments(items));
	return db;
}
async function createDBSimple({ indexes, tokenizer, ...rest }) {
	const items = typeof indexes === "function" ? await indexes() : indexes;
	const db = create({
		schema: simpleSchema,
		...rest,
		components: {
			...rest.components,
			tokenizer: tokenizer ?? rest.components?.tokenizer
		}
	});
	await insertMultiple(db, items.map((page) => ({
		title: page.title,
		description: page.description,
		breadcrumbs: page.breadcrumbs,
		url: page.url,
		content: page.content,
		keywords: page.keywords
	})));
	return db;
}
//#endregion
//#region src/search/orama/create-server.ts
function initSimpleSearch(options) {
	const doc = createDBSimple(options);
	return {
		async export() {
			return {
				type: "simple",
				...save(await doc)
			};
		},
		async search(query, searchOptions = {}) {
			const db = await doc;
			const { limit } = searchOptions;
			return searchSimple(db, query, {
				limit,
				...options.search
			});
		}
	};
}
function initAdvancedSearch(options) {
	const get = createDB(options);
	return {
		async export() {
			return {
				type: "advanced",
				...save(await get)
			};
		},
		async search(query, searchOptions = {}) {
			const db = await get;
			const { limit, tag, mode } = searchOptions;
			return searchAdvanced(db, query, tag, {
				...options.search,
				limit,
				mode: mode === "vector" ? "vector" : "fulltext"
			}).catch((err) => {
				if (mode === "vector") throw new Error("failed to search, make sure you have installed `@orama/plugin-embeddings` according to their docs.", { cause: err });
				throw err;
			});
		}
	};
}
function createSearchAPI(...args) {
	return toAPI(args[0] === "simple" ? initSimpleSearch(args[1]) : initAdvancedSearch(args[1]));
}
function getTokenizer(locale) {
	return { language: Object.keys(STEMMERS).find((lang) => STEMMERS[lang] === locale) ?? locale };
}
function createI18nSearchAPI(...[type, options]) {
	async function initSearchServers() {
		const map = /* @__PURE__ */ new Map();
		if (options.i18n.languages.length === 0) return map;
		const indexes = typeof options.indexes === "function" ? await options.indexes() : options.indexes;
		for (const locale of options.i18n.languages) {
			const localeIndexes = indexes.filter((index) => index.locale === locale);
			const mapped = options.localeMap?.[locale] ?? getTokenizer(locale);
			if (type === "simple") map.set(locale, typeof mapped === "object" ? initSimpleSearch({
				...options,
				...mapped,
				indexes: localeIndexes
			}) : initSimpleSearch({
				...options,
				language: mapped,
				indexes: localeIndexes
			}));
			else map.set(locale, typeof mapped === "object" ? initAdvancedSearch({
				...options,
				indexes: localeIndexes,
				...mapped
			}) : initAdvancedSearch({
				...options,
				language: mapped,
				indexes: localeIndexes
			}));
		}
		return map;
	}
	const get = initSearchServers();
	return toAPI({
		async export() {
			const map = await get;
			const entries = Array.from(map.entries()).map(async ([k, v]) => [k, await v.export()]);
			return {
				type: "i18n",
				data: Object.fromEntries(await Promise.all(entries))
			};
		},
		async search(query, searchOptions) {
			const map = await get;
			const locale = searchOptions?.locale ?? options.i18n.defaultLanguage;
			const handler = map.get(locale);
			if (handler) return handler.search(query, searchOptions);
			return [];
		}
	});
}
/**
* create server from loader, if passed as function, the server will re-index all records once a different instance of loader is returned.
*/
function createFromSource(loader, options = {}) {
	const { buildIndex = buildIndexDefault } = options;
	const cache = /* @__PURE__ */ new WeakMap();
	async function initServer(loader) {
		const indexes = await Promise.all(loader.getPages().map(async (page) => {
			const index = await buildIndex(page);
			return {
				...index,
				breadcrumbs: index.breadcrumbs ?? buildBreadcrumbs(loader, page),
				locale: page.locale
			};
		}));
		if (loader._i18n) return createI18nSearchAPI("advanced", {
			...options,
			indexes,
			i18n: loader._i18n
		});
		return initAdvancedSearch({
			indexes,
			...options
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
	return toAPI({
		async export() {
			return (await getCurrentServer()).export();
		},
		async search(query, options) {
			return (await getCurrentServer()).search(query, options);
		}
	});
}
function toAPI(server) {
	return createEndpoint(server, { readOptions(url) {
		return {
			...defaultReadOptions(url),
			mode: url.searchParams.get("mode") === "vector" ? "vector" : "full"
		};
	} });
}
//#endregion
export { createFromSource, createI18nSearchAPI, createSearchAPI, initAdvancedSearch, initSimpleSearch };
