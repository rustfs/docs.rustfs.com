import { n as normalizeUrl } from "./url-CWbf4MFh.js";
import { c as visit } from "./utils-Dn9VIXRN.js";
import { a as normalize, i as joinPath, n as dirname, r as extname, t as basename } from "./path-B9zu5SjE.js";
import { slugsPlugin } from "./source/plugins/slugs.js";
import { t as iconPlugin } from "./icon-BILaoXeg.js";
//#region src/source/storage/file-system.ts
/**
* In memory file system.
*/
var FileSystem = class {
	constructor(inherit) {
		this.files = /* @__PURE__ */ new Map();
		this.folders = /* @__PURE__ */ new Map();
		if (inherit) {
			for (const [k, v] of inherit.folders) this.folders.set(k, v);
			for (const [k, v] of inherit.files) this.files.set(k, v);
		} else this.folders.set("", []);
	}
	read(path) {
		return this.files.get(path);
	}
	/**
	* get the direct children of folder (in virtual file path)
	*/
	readDir(path) {
		return this.folders.get(path);
	}
	write(path, file) {
		if (!this.files.has(path)) {
			const dir = dirname(path);
			this.makeDir(dir);
			this.readDir(dir)?.push(path);
		}
		this.files.set(path, file);
	}
	/**
	* Delete files at specified path.
	*
	* @param path - the target path.
	* @param [recursive=false] - if set to `true`, it will also delete directories.
	*/
	delete(path, recursive = false) {
		if (this.files.delete(path)) return true;
		if (recursive) {
			const folder = this.folders.get(path);
			if (!folder) return false;
			this.folders.delete(path);
			for (const child of folder) this.delete(child);
			return true;
		}
		return false;
	}
	getFiles() {
		return Array.from(this.files.keys());
	}
	makeDir(path) {
		const cur = [];
		let parentPath = "";
		for (const seg of path.split("/")) {
			cur.push(seg);
			const curPath = cur.join("/");
			if (!this.folders.has(curPath)) {
				this.folders.set(curPath, []);
				this.folders.get(parentPath).push(curPath);
			}
			parentPath = curPath;
		}
	}
};
//#endregion
//#region src/source/source.ts
/**
* @deprecated you can directly pass a record of source objects to `loader()`.
*/
function multiple(sources) {
	const out = {};
	for (const k in sources) out[k] = { files: sources[k].files.map((file) => ({
		...file,
		data: {
			...file.data,
			type: k
		}
	})) };
	return out;
}
function source(config) {
	return { files: [...config.pages, ...config.metas] };
}
/**
* update a source object in-place.
*/
function update(source) {
	return {
		files(fn) {
			source.files = fn(source.files);
			return this;
		},
		page(fn) {
			for (let i = 0; i < source.files.length; i++) {
				const file = source.files[i];
				if (file.type === "page") source.files[i] = fn(file);
			}
			return this;
		},
		meta(fn) {
			for (let i = 0; i < source.files.length; i++) {
				const file = source.files[i];
				if (file.type === "meta") source.files[i] = fn(file);
			}
			return this;
		},
		build() {
			return source;
		}
	};
}
function isStaticSource(s) {
	return "files" in s && Array.isArray(s.files);
}
function isDynamicSource(s) {
	return "files" in s && typeof s.files === "function";
}
//#endregion
//#region src/source/storage/content.ts
const EmptyLang = Symbol();
/**
* convert input files into virtual file system.
*
* in the storage, locale codes are removed from file paths, hence the same file will have same file paths in every storage.
*/
function createContentStorageBuilder(loaderConfig) {
	const { input, plugins, i18n } = loaderConfig;
	let parser;
	if (!i18n) parser = (path) => [path];
	else if (i18n.parser === "dir") {
		const langSet = new Set(i18n.languages);
		parser = (path) => {
			const [locale, ...segs] = path.split("/");
			if (!locale || segs.length === 0) return [path];
			if (langSet.has(locale)) return [segs.join("/"), locale];
			if (locale === "$") return [segs.join("/"), i18n.languages];
			return [path];
		};
	} else {
		const langSet = new Set(i18n.languages);
		parser = (path) => {
			const segs = path.split("/");
			const base = segs.pop();
			if (!base) return [path];
			const parts = base.split(".");
			if (parts.length < 3) return [path];
			const [locale] = parts.splice(parts.length - 2, 1);
			segs.push(parts.join("."));
			if (langSet.has(locale)) return [segs.join("/"), locale];
			if (locale === "$") return [segs.join("/"), i18n.languages];
			return [path];
		};
	}
	const fileMap = /* @__PURE__ */ new Map();
	function scan(type, source) {
		for (const inputFile of source.files) {
			let file;
			if (inputFile.type === "page") file = {
				format: "page",
				type,
				path: normalize(inputFile.path),
				slugs: inputFile.slugs,
				data: inputFile.data,
				absolutePath: inputFile.absolutePath
			};
			else file = {
				format: "meta",
				type,
				path: normalize(inputFile.path),
				absolutePath: inputFile.absolutePath,
				data: inputFile.data
			};
			const [storageKey, locale = i18n ? i18n.defaultLanguage : EmptyLang] = parser(file.path);
			const entry = [storageKey, file];
			if (Array.isArray(locale)) for (const item of locale) pushMapList(fileMap, item, entry);
			else pushMapList(fileMap, locale, entry);
		}
	}
	if (isStaticSource(input)) scan(void 0, input);
	else for (const k in input) scan(k, input[k]);
	function makeStorage(locale, inherit) {
		const storage = new FileSystem(inherit);
		for (const [storageKey, file] of fileMap.get(locale) ?? []) storage.write(storageKey, file);
		const context = { storage };
		for (const plugin of plugins) plugin.transformStorage?.(context);
		return storage;
	}
	return {
		i18n() {
			const storages = {};
			if (!i18n) return storages;
			const fallbackLang = i18n.fallbackLanguage !== null ? i18n.fallbackLanguage ?? i18n.defaultLanguage : null;
			function scan(lang) {
				if (storages[lang]) return storages[lang];
				return storages[lang] = makeStorage(lang, fallbackLang && fallbackLang !== lang ? scan(fallbackLang) : void 0);
			}
			for (const lang of i18n.languages) scan(lang);
			return storages;
		},
		single() {
			return makeStorage(EmptyLang);
		}
	};
}
function pushMapList(map, k, v) {
	let list = map.get(k);
	if (!list) {
		list = [];
		map.set(k, list);
	}
	list.push(v);
}
//#endregion
//#region src/source/page-tree/transformer-fallback.ts
function transformerFallback() {
	const addedFiles = /* @__PURE__ */ new Set();
	function shouldIgnore(context) {
		return context.custom?._fallback === true;
	}
	return {
		root(root) {
			if (shouldIgnore(this)) return root;
			const isolatedStorage = new FileSystem();
			if (addedFiles.size === this.storage.files.size) return root;
			for (const file of this.storage.getFiles()) {
				if (addedFiles.has(file)) continue;
				isolatedStorage.write(file, this.storage.read(file));
			}
			root.fallback = createPageTreeBuilder(isolatedStorage, {
				...this.options,
				idPrefix: this.options.idPrefix ? `fallback:${this.options.idPrefix}` : "fallback",
				generateFallback: false,
				context: {
					...this.custom,
					_fallback: true
				}
			}).root();
			addedFiles.clear();
			return root;
		},
		file(node, file) {
			if (shouldIgnore(this)) return node;
			if (file) addedFiles.add(file);
			return node;
		},
		folder(node, _dir, metaPath) {
			if (shouldIgnore(this)) return node;
			if (metaPath) addedFiles.add(metaPath);
			return node;
		}
	};
}
//#endregion
//#region src/source/page-tree/builder.ts
const group = /^\((?<name>.+)\)$/;
const link = /^(?<external>external:)?(?:\[(?<icon>[^\]]+)])?\[(?<name>[^\]]+)]\((?<url>[^)]+)\)$/;
const separator = /^---(?:\[(?<icon>[^\]]+)])?(?<name>.+)---|^---$/;
const rest = "...";
const restReversed = "z...a";
const extractPrefix = "...";
const excludePrefix = "!";
const SymbolUnfinished = Symbol("unfinished");
const SymbolName = Symbol("name");
const SymbolOwner = Symbol("owner");
function createPageTreeBuilder(input, options) {
	const flattenPathToFullPath = /* @__PURE__ */ new Map();
	const transformers = [];
	/** virtual file path -> output page tree node (if cached) */
	const pathToNode = /* @__PURE__ */ new Map();
	let _nextId = 0;
	const { noRef = false, idPrefix, url: getUrl, generateFallback = true, sort: { by: sortBy = "path", locales: sortLocales, options: sortOptions } = {} } = options;
	/** passed as additional information to transformers */
	let ctx;
	if (options.transformers) transformers.push(...options.transformers);
	if (generateFallback) transformers.push(transformerFallback());
	if (Array.isArray(input)) {
		const [locale, storages] = input;
		ctx = {
			get builder() {
				return builder;
			},
			storage: storages[locale],
			storages,
			locale,
			transformers,
			custom: options.context,
			options
		};
	} else ctx = {
		get builder() {
			return builder;
		},
		storage: input,
		transformers,
		custom: options.context,
		options
	};
	const { storage, locale } = ctx;
	for (const file of storage.getFiles()) {
		const content = storage.read(file);
		const flattenPath = file.substring(0, file.length - extname(file).length);
		flattenPathToFullPath.set(flattenPath + "." + content.format, file);
	}
	function resolveFlattenPath(name, format) {
		return flattenPathToFullPath.get(name + "." + format) ?? name;
	}
	/**
	* try to register as the owner of `node`.
	*
	* when a node is referenced by multiple folders, this determines which folder they should belong to.
	*
	* @returns whether the owner owns the node.
	*/
	function own(ownerPath, node, priority) {
		if (node[SymbolUnfinished]) return false;
		const existing = node[SymbolOwner];
		if (!existing) {
			node[SymbolOwner] = {
				owner: ownerPath,
				priority
			};
			return true;
		}
		if (existing.owner === ownerPath) {
			existing.priority = Math.max(existing.priority, priority);
			return true;
		}
		if (existing.priority >= priority) return false;
		const folder = pathToNode.get(existing.owner);
		if (folder && folder.type === "folder") if (folder.index === node) delete folder.index;
		else {
			const idx = folder.children.indexOf(node);
			if (idx !== -1) folder.children.splice(idx, 1);
		}
		existing.owner = ownerPath;
		existing.priority = priority;
		return true;
	}
	function transferOwner(ownerPath, node) {
		const existing = node[SymbolOwner];
		if (existing) existing.owner = ownerPath;
	}
	function generateId(localId = `_${_nextId++}`) {
		let id = localId;
		if (locale) id = `${locale}:${id}`;
		if (idPrefix) id = `${idPrefix}:${id}`;
		return id;
	}
	function buildPaths(paths, filter, reversed = false) {
		const nodes = [];
		let indexNode;
		for (const path of paths) {
			if (filter && !filter(path)) continue;
			const fileNode = buildFile(path);
			if (fileNode) {
				nodes.push(fileNode);
				if (!indexNode && basename(path, extname(path)) === "index") indexNode = fileNode;
				continue;
			}
			const dirNode = buildFolder(path);
			if (dirNode) nodes.push(dirNode);
		}
		const factor = reversed ? -1 : 1;
		const useName = sortBy === "name";
		return nodes.sort((a, b) => {
			if (a === indexNode) return -100;
			if (b === indexNode) return 100;
			const aT = useName && a[SymbolName] || (a.type === "folder" ? a.$ref.folder : a.$ref);
			const bT = useName && b[SymbolName] || (b.type === "folder" ? b.$ref.folder : b.$ref);
			const aK = a.type === "folder" ? 10 : 0;
			const bK = b.type === "folder" ? 10 : 0;
			return factor * (aT.localeCompare(bT, sortLocales, sortOptions) + (aK - bK));
		});
	}
	function resolveLink(item) {
		const match = link.exec(item);
		if (!match?.groups) return;
		const { icon, url, name, external } = match.groups;
		let node = {
			$id: generateId(),
			type: "page",
			icon,
			name,
			url,
			external: external ? true : void 0
		};
		for (const transformer of transformers) {
			if (!transformer.file) continue;
			node = transformer.file.call(ctx, node);
		}
		return node;
	}
	function resolveSeparator(item) {
		const match = separator.exec(item);
		if (!match?.groups) return;
		let node = {
			$id: generateId(),
			type: "separator",
			icon: match.groups.icon,
			name: match.groups.name
		};
		for (const transformer of transformers) {
			if (!transformer.separator) continue;
			node = transformer.separator.call(ctx, node);
		}
		return node;
	}
	function resolveFolderItem(folderPath, item, outputArray, excludedPaths) {
		if (item === rest || item === restReversed) {
			outputArray.push(item);
			return;
		}
		const separator = resolveSeparator(item);
		if (separator) {
			outputArray.push(separator);
			return;
		}
		const link = resolveLink(item);
		if (link) {
			outputArray.push(link);
			return;
		}
		if (item.startsWith(excludePrefix)) {
			const path = joinPath(folderPath, item.slice(1));
			excludedPaths.add(path);
			excludedPaths.add(resolveFlattenPath(path, "page"));
			return;
		}
		if (item.startsWith(extractPrefix)) {
			const path = joinPath(folderPath, item.slice(3));
			const node = buildFolder(path);
			if (!node) return;
			const children = node.index ? [node.index, ...node.children] : node.children;
			if (own(folderPath, node, 2)) {
				for (const child of children) {
					transferOwner(folderPath, child);
					outputArray.push(child);
				}
				excludedPaths.add(path);
			} else for (const child of children) if (own(folderPath, child, 2)) outputArray.push(child);
			return;
		}
		let path = joinPath(folderPath, item);
		let node = buildFolder(path);
		if (!node) {
			path = resolveFlattenPath(path, "page");
			node = buildFile(path);
		}
		if (!node || !own(folderPath, node, 2)) return;
		outputArray.push(node);
		excludedPaths.add(path);
	}
	function buildFolder(folderPath, isGlobalRoot = false) {
		const cached = pathToNode.get(folderPath);
		if (cached) return cached;
		const files = storage.readDir(folderPath);
		if (!files) return;
		let metaPath = resolveFlattenPath(joinPath(folderPath, "meta"), "meta");
		let meta = storage.read(metaPath);
		if (!meta || meta.format !== "meta") {
			meta = void 0;
			metaPath = void 0;
		}
		const metadata = meta?.data ?? {};
		const isRoot = metadata.root ?? isGlobalRoot;
		let node = {
			type: "folder",
			name: null,
			root: metadata.root,
			defaultOpen: metadata.defaultOpen,
			description: metadata.description,
			collapsible: metadata.collapsible,
			children: [],
			$id: generateId(folderPath),
			$ref: {
				folder: folderPath,
				meta: metaPath
			},
			[SymbolUnfinished]: true
		};
		pathToNode.set(folderPath, node);
		let indexPath;
		if (metadata.pagesIndex) {
			const resolvedPath = resolveFlattenPath(joinPath(folderPath, metadata.pagesIndex), "page");
			const page = buildFile(resolvedPath);
			if (page && own(folderPath, page, 3)) {
				indexPath = resolvedPath;
				node.index = page;
			} else node.index = resolveLink(metadata.pagesIndex);
		} else if (!isRoot) {
			const defaultPath = resolveFlattenPath(joinPath(folderPath, "index"), "page");
			const page = buildFile(defaultPath);
			if (page && own(folderPath, page, 0)) {
				indexPath = defaultPath;
				node.index = page;
			}
		}
		if (metadata.pages) {
			const outputArray = [];
			const excludedPaths = /* @__PURE__ */ new Set();
			for (const item of metadata.pages) resolveFolderItem(folderPath, item, outputArray, excludedPaths);
			if (indexPath) if (excludedPaths.has(indexPath)) delete node.index;
			else excludedPaths.add(indexPath);
			for (const item of outputArray) {
				if (item !== rest && item !== restReversed) {
					node.children.push(item);
					continue;
				}
				const resolvedItem = buildPaths(files, (file) => !excludedPaths.has(file), item === restReversed);
				for (const child of resolvedItem) if (own(folderPath, child, 0)) node.children.push(child);
			}
		} else for (const item of buildPaths(files, indexPath ? (file) => file !== indexPath : void 0)) if (own(folderPath, item, 0)) node.children.push(item);
		node.icon = metadata.icon ?? node.index?.icon;
		node.name = metadata.title ?? node.index?.name;
		node[SymbolName] = metadata.title ?? node.index?.[SymbolName];
		if (!node.name) {
			const folderName = basename(folderPath);
			node.name = pathToName(group.exec(folderName)?.[1] ?? folderName);
		}
		for (const transformer of transformers) {
			if (!transformer.folder) continue;
			node = transformer.folder.call(ctx, node, folderPath, metaPath);
		}
		pathToNode.set(folderPath, node);
		delete node[SymbolUnfinished];
		return node;
	}
	function buildFile(path) {
		const cached = pathToNode.get(path);
		if (cached) return cached;
		const page = storage.read(path);
		if (!page || page.format !== "page") return;
		const { title, description, icon } = page.data;
		let item = {
			$id: generateId(path),
			type: "page",
			name: title ?? pathToName(basename(path, extname(path))),
			description,
			icon,
			url: getUrl(page.slugs, ctx.locale),
			$ref: path,
			[SymbolName]: title
		};
		for (const transformer of transformers) {
			if (!transformer.file) continue;
			item = transformer.file.call(ctx, item, path);
		}
		pathToNode.set(path, item);
		return item;
	}
	const builder = {
		resolveFlattenPath,
		root(id = "root", path = "") {
			const folder = buildFolder(path, true);
			for (const node of pathToNode.values()) {
				delete node[SymbolName];
				delete node[SymbolOwner];
				if (noRef && "$ref" in node) delete node.$ref;
			}
			let root = {
				type: "root",
				$ref: folder?.$ref,
				$id: generateId(id),
				name: folder?.name || "Docs",
				description: folder?.description,
				children: folder ? folder.children : []
			};
			for (const transformer of transformers) {
				if (!transformer.root) continue;
				root = transformer.root.call(ctx, root);
			}
			return root;
		}
	};
	return builder;
}
/**
* Get item name from file name
*
* @param name - file name
*/
function pathToName(name) {
	const result = [];
	for (const c of name) if (result.length === 0) result.push(c.toLocaleUpperCase());
	else if (c === "-") result.push(" ");
	else result.push(c);
	return result.join("");
}
//#endregion
//#region src/source/loader.ts
function createPageIndexer({ url }) {
	const pages = /* @__PURE__ */ new Map();
	const pathToMeta = /* @__PURE__ */ new Map();
	const pathToPage = /* @__PURE__ */ new Map();
	return {
		scan(storage, lang) {
			for (const filePath of storage.getFiles()) {
				const item = storage.read(filePath);
				const prefix = lang ? `${lang}.` : ".";
				const path = prefix + filePath;
				if (item.format === "meta") {
					pathToMeta.set(path, {
						type: item.type,
						path: item.path,
						absolutePath: item.absolutePath,
						data: item.data
					});
					continue;
				}
				const page = {
					type: item.type,
					path: item.path,
					absolutePath: item.absolutePath,
					url: url(item.slugs, lang),
					slugs: item.slugs,
					data: item.data,
					locale: lang
				};
				pathToPage.set(path, page);
				pages.set(prefix + page.slugs.join("/"), page);
			}
		},
		getPage(path, lang = "") {
			return pathToPage.get(`${lang}.${path}`);
		},
		getMeta(path, lang = "") {
			return pathToMeta.get(`${lang}.${path}`);
		},
		getPageBySlugs(slugs, lang = "") {
			let page = pages.get(`${lang}.${slugs.join("/")}`);
			if (page) return page;
			page = pages.get(`${lang}.${slugs.map(decodeURI).join("/")}`);
			if (page) return page;
		},
		/** do not filter by language if `lang` is not specified */
		getPages(lang) {
			const out = [];
			for (const [key, value] of pages.entries()) if (lang === void 0 || key.startsWith(`${lang}.`)) out.push(value);
			return out;
		}
	};
}
function createGetUrl(baseUrl, i18n) {
	const baseSlugs = baseUrl.split("/");
	return (slugs, locale) => {
		const hideLocale = i18n?.hideLocale ?? "never";
		let urlLocale;
		if (hideLocale === "never") urlLocale = locale;
		else if (hideLocale === "default-locale" && locale !== i18n?.defaultLanguage) urlLocale = locale;
		const paths = [...baseSlugs, ...slugs];
		if (urlLocale) paths.unshift(urlLocale);
		return `/${paths.filter((v) => v.length > 0).join("/")}`;
	};
}
function loader(...args) {
	const loaderConfig = args.length === 2 ? resolveConfig(args[0], args[1]) : resolveConfig(args[0].source, args[0]);
	const { i18n } = loaderConfig;
	const storage = i18n ? createContentStorageBuilder(loaderConfig).i18n() : createContentStorageBuilder(loaderConfig).single();
	const indexer = createPageIndexer(loaderConfig);
	if (storage instanceof FileSystem) indexer.scan(storage);
	else for (const locale in storage) indexer.scan(storage[locale], locale);
	let pageTrees;
	function getPageTrees() {
		if (pageTrees) return pageTrees;
		const { plugins, url, pageTree: pageTreeConfig } = loaderConfig;
		const transformers = [];
		if (pageTreeConfig?.transformers) transformers.push(...pageTreeConfig.transformers);
		for (const plugin of plugins) if (plugin.transformPageTree) transformers.push(plugin.transformPageTree);
		const options = {
			url,
			...pageTreeConfig,
			transformers
		};
		if (storage instanceof FileSystem) return pageTrees = createPageTreeBuilder(storage, options).root();
		else {
			const out = {};
			for (const locale in storage) out[locale] = createPageTreeBuilder([locale, storage], options).root();
			return pageTrees = out;
		}
	}
	return {
		_i18n: i18n,
		get pageTree() {
			return getPageTrees();
		},
		set pageTree(v) {
			pageTrees = v;
		},
		getPageByHref(href, { dir = "", language = i18n?.defaultLanguage } = {}) {
			const [value, hash] = href.split("#", 2);
			let target;
			if (value.startsWith("./") || value.startsWith("../")) {
				const path = joinPath(dir, value);
				target = indexer.getPage(path, language);
			} else target = this.getPages(language).find((item) => item.url === value);
			if (target) return {
				page: target,
				hash
			};
		},
		resolveHref(href, parent) {
			if (href.startsWith("./") || href.startsWith("../")) {
				const target = this.getPageByHref(href, {
					dir: dirname(parent.path),
					language: parent.locale
				});
				if (target) return target.hash ? `${target.page.url}#${target.hash}` : target.page.url;
			}
			return href;
		},
		getPages(language) {
			return indexer.getPages(language);
		},
		getLanguages() {
			const list = [];
			if (!i18n) return list;
			for (const language of i18n.languages) list.push({
				language,
				pages: this.getPages(language)
			});
			return list;
		},
		getPage(slugs = [], language = i18n?.defaultLanguage) {
			return indexer.getPageBySlugs(slugs, language);
		},
		getNodeMeta(node, language = i18n?.defaultLanguage) {
			const ref = node.$ref;
			if (!ref?.meta) return;
			return indexer.getMeta(ref.meta, language);
		},
		getNodePage(node, language = i18n?.defaultLanguage) {
			const ref = node.$ref;
			if (!ref) return;
			return indexer.getPage(ref, language);
		},
		getPageTree(locale) {
			if (i18n) {
				const trees = getPageTrees();
				if (locale && trees[locale]) return trees[locale];
				return trees[i18n.defaultLanguage];
			}
			return getPageTrees();
		},
		generateParams(slug, lang) {
			if (i18n) return this.getLanguages().flatMap((entry) => entry.pages.map((page) => ({
				[slug ?? "slug"]: page.slugs,
				[lang ?? "lang"]: entry.language
			})));
			return this.getPages().map((page) => ({ [slug ?? "slug"]: page.slugs }));
		},
		async serializePageTree(tree) {
			const { renderToString } = await import("react-dom/server.edge");
			return {
				$fumadocs_loader: "page-tree",
				data: visit(tree, (node) => {
					node = { ...node };
					if ("icon" in node && node.icon) node.icon = renderToString(node.icon);
					if (node.name) node.name = renderToString(node.name);
					if ("children" in node) node.children = [...node.children];
					return node;
				})
			};
		}
	};
}
function resolveConfig(input, { slugs, icon, plugins = [], baseUrl, url, ...base }) {
	let config = {
		...base,
		url: url ? (...args) => normalizeUrl(url(...args)) : createGetUrl(baseUrl, base.i18n),
		input,
		plugins: buildPlugins([
			icon && iconPlugin(icon),
			...typeof plugins === "function" ? plugins({ typedPlugin: (plugin) => plugin }) : plugins,
			slugsPlugin(slugs)
		])
	};
	for (const plugin of config.plugins) {
		const result = plugin.config?.(config);
		if (result) config = result;
	}
	return config;
}
const priorityMap = {
	pre: 1,
	default: 0,
	post: -1
};
function buildPlugins(plugins, sort = true) {
	const flatten = [];
	for (const plugin of plugins) if (Array.isArray(plugin)) flatten.push(...buildPlugins(plugin, false));
	else if (plugin) flatten.push(plugin);
	if (sort) return flatten.sort((a, b) => priorityMap[b.enforce ?? "default"] - priorityMap[a.enforce ?? "default"]);
	return flatten;
}
//#endregion
export { multiple as a, FileSystem as c, isStaticSource as i, loader as n, source as o, isDynamicSource as r, update as s, createGetUrl as t };
