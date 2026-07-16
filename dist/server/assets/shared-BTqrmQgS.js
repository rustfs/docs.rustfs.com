import { i as __toESM$1 } from "./rolldown-runtime-B4lejLz5.js";
import { t as require_react_react_server } from "./react.react-server-D_zJcm3W.js";
import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
import { a as extname, i as dirname$1, n as visit, o as joinPath, r as basename, s as normalize } from "./utils-Dn9VIXRN-2uulHhU8.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { existsSync } from "node:fs";
import path, { dirname, join } from "node:path";
//#region node_modules/fumapress/dist/_virtual/_rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region node_modules/fumapress/dist/lib/fs.js
/**
* Returns the absolute path to the root directory of the current git repository.
*/
function getGitRootDir(startDir = process.cwd()) {
	let dir = startDir;
	while (true) {
		if (existsSync(join(dir, ".git"))) return dir;
		const parent = dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return null;
}
//#endregion
//#region node_modules/fumapress/dist/node_modules/.pnpm/@fastify_deepmerge@3.2.1/node_modules/@fastify/deepmerge/index.js
var require_deepmerge = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const JSON_PROTO = Object.getPrototypeOf({});
	function defaultIsMergeableObjectFactory() {
		return function defaultIsMergeableObject(value) {
			return typeof value === "object" && value !== null && !(value instanceof RegExp) && !(value instanceof Date);
		};
	}
	function deepmergeConstructor(options) {
		function isNotPrototypeKey(value) {
			return value !== "constructor" && value !== "prototype" && value !== "__proto__";
		}
		function cloneArray(value) {
			let i = 0;
			const il = value.length;
			const result = new Array(il);
			for (; i < il; ++i) result[i] = clone(value[i]);
			return result;
		}
		function cloneObject(target) {
			const result = {};
			if (cloneProtoObject && Object.getPrototypeOf(target) !== JSON_PROTO) return cloneProtoObject(target);
			const targetKeys = getKeys(target);
			let i, il, key;
			for (i = 0, il = targetKeys.length; i < il; ++i) isNotPrototypeKey(key = targetKeys[i]) && (result[key] = clone(target[key]));
			return result;
		}
		function concatArrays(target, source) {
			const tl = target.length;
			const sl = source.length;
			let i = 0;
			const result = new Array(tl + sl);
			for (; i < tl; ++i) result[i] = clone(target[i]);
			for (i = 0; i < sl; ++i) result[i + tl] = clone(source[i]);
			return result;
		}
		const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
		function getSymbolsAndKeys(value) {
			const result = Object.keys(value);
			const keys = Object.getOwnPropertySymbols(value);
			for (let i = 0, il = keys.length; i < il; ++i) propertyIsEnumerable.call(value, keys[i]) && result.push(keys[i]);
			return result;
		}
		const getKeys = options?.symbols ? getSymbolsAndKeys : Object.keys;
		const cloneProtoObject = typeof options?.cloneProtoObject === "function" ? options.cloneProtoObject : void 0;
		const isMergeableObject = typeof options?.isMergeableObject === "function" ? options.isMergeableObject : defaultIsMergeableObjectFactory();
		const onlyDefinedProperties = options?.onlyDefinedProperties === true;
		function isPrimitive(value) {
			return typeof value !== "object" || value === null;
		}
		const mergeArray = options && typeof options.mergeArray === "function" ? options.mergeArray({
			clone,
			deepmerge: _deepmerge,
			getKeys,
			isMergeableObject
		}) : concatArrays;
		function clone(entry) {
			return isMergeableObject(entry) ? Array.isArray(entry) ? cloneArray(entry) : cloneObject(entry) : entry;
		}
		function mergeObject(target, source) {
			const result = {};
			const targetKeys = getKeys(target);
			const sourceKeys = getKeys(source);
			let i, il, key;
			for (i = 0, il = targetKeys.length; i < il; ++i) isNotPrototypeKey(key = targetKeys[i]) && sourceKeys.indexOf(key) === -1 && (result[key] = clone(target[key]));
			for (i = 0, il = sourceKeys.length; i < il; ++i) {
				if (!isNotPrototypeKey(key = sourceKeys[i])) continue;
				if (key in target) {
					if (targetKeys.indexOf(key) !== -1) if (cloneProtoObject && isMergeableObject(source[key]) && Object.getPrototypeOf(source[key]) !== JSON_PROTO) result[key] = cloneProtoObject(source[key]);
					else result[key] = _deepmerge(target[key], source[key]);
				} else {
					if (onlyDefinedProperties && typeof source[key] === "undefined") continue;
					result[key] = clone(source[key]);
				}
			}
			return result;
		}
		function _deepmerge(target, source) {
			if (onlyDefinedProperties && typeof source === "undefined") return clone(target);
			const sourceIsArray = Array.isArray(source);
			const targetIsArray = Array.isArray(target);
			if (isPrimitive(source)) return source;
			else if (!isMergeableObject(target)) return clone(source);
			else if (sourceIsArray && targetIsArray) return mergeArray(target, source);
			else if (sourceIsArray !== targetIsArray) return clone(source);
			else return mergeObject(target, source);
		}
		function _deepmergeAll() {
			switch (arguments.length) {
				case 0: return {};
				case 1: return clone(arguments[0]);
				case 2: return _deepmerge(arguments[0], arguments[1]);
			}
			let result;
			for (let i = 0, il = arguments.length; i < il; ++i) result = _deepmerge(result, arguments[i]);
			return result;
		}
		return options?.all ? _deepmergeAll : _deepmerge;
	}
	module.exports = deepmergeConstructor;
	module.exports.default = deepmergeConstructor;
	module.exports.deepmerge = deepmergeConstructor;
	Object.defineProperty(module.exports, "isMergeableObject", { get: defaultIsMergeableObjectFactory });
}));
require_deepmerge();
//#endregion
//#region node_modules/fumapress/dist/.translations/keys.js
var keys_default = [
	"All Tags(blog tags page)",
	"Back to Home(blog)",
	"Blog(blog)",
	"Copied(blog panel)",
	"Share(blog panel)",
	"Table of Contents(blog panel)",
	"Tag \"{tag}\"(blog tag page)",
	"{count} matching blog posts.(blog tag page)",
	"{count} tags in total.(blog tags page)"
];
//#endregion
//#region node_modules/fumapress/dist/i18n.js
function fumapressTranslations() {
	return { keys: keys_default };
}
//#endregion
//#region node_modules/fumapress/dist/plugins/internal/defaults.js
function applyDefaultsPlugin() {
	return [{
		name: "core:i18n",
		init() {
			if (this.translationsConfig) this.translationsConfig.extend(fumapressTranslations());
		}
	}, {
		name: "core:disable-search-if-needed",
		enforce: "post",
		init() {
			(this.data["core:provider"] ??= []).push((data) => {
				data.search ??= { enabled: false };
				return data;
			});
		}
	}];
}
//#endregion
//#region node_modules/fumadocs-core/dist/url-CWbf4MFh.js
var import_react_react_server = /* @__PURE__ */ __toESM$1(require_react_react_server(), 1);
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
/**
* The base path (Vite), always ends with `/`.
*/
var BASE_PATH = "/";
if (!BASE_PATH.endsWith("/")) BASE_PATH += "/";
/**
* normalize URL into the Fumadocs standard form (`/slug-1/slug-2`).
*
* This includes URLs with trailing slashes.
*/
function normalizeUrl(url) {
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (!url.startsWith("/")) url = "/" + url;
	if (url.length > 1 && url.endsWith("/")) url = url.slice(0, -1);
	return url;
}
//#endregion
//#region node_modules/fumadocs-core/dist/source/plugins/slugs.js
/**
* Generate slugs for pages if missing
*/
function slugsPlugin(slugFn) {
	function isIndex(file) {
		return basename(file, extname(file)) === "index";
	}
	return {
		name: "fumadocs:slugs",
		transformStorage({ storage }) {
			const indexFiles = [];
			const taken = /* @__PURE__ */ new Set();
			for (const path of storage.getFiles()) {
				const file = storage.read(path);
				if (!file || file.format !== "page" || file.slugs) continue;
				const customSlugs = slugFn?.(file);
				if (customSlugs === void 0 && isIndex(path)) {
					indexFiles.push(path);
					continue;
				}
				file.slugs = customSlugs ?? getSlugs(path);
				const key = file.slugs.join("/");
				if (taken.has(key)) throw new Error(`Duplicated slugs: ${key}`);
				taken.add(key);
			}
			for (const path of indexFiles) {
				const file = storage.read(path);
				if (file?.format !== "page") continue;
				file.slugs = getSlugs(path);
				if (taken.has(file.slugs.join("/"))) file.slugs.push("index");
			}
		}
	};
}
var GroupRegex = /^\(.+\)$/;
/**
* Convert file path into slugs, also encode non-ASCII characters, so they can work in pathname
*/
function getSlugs(file) {
	const dir = dirname$1(file);
	const name = basename(file, extname(file));
	const slugs = [];
	for (const seg of dir.split("/")) if (seg.length > 0 && !GroupRegex.test(seg)) slugs.push(encodeURI(seg));
	if (GroupRegex.test(name)) throw new Error(`Cannot use folder group in file names: ${file}`);
	if (name !== "index") slugs.push(encodeURI(name));
	return slugs;
}
//#endregion
//#region node_modules/fumadocs-core/dist/icon-BILaoXeg.js
function iconPlugin(resolveIcon) {
	function replaceIcon(node) {
		if (node.icon === void 0 || typeof node.icon === "string") node.icon = resolveIcon(node.icon);
		return node;
	}
	return {
		name: "fumadocs:icon",
		transformPageTree: {
			file: replaceIcon,
			folder: replaceIcon,
			separator: replaceIcon
		}
	};
}
//#endregion
//#region node_modules/fumadocs-core/dist/loader-CoSFINvo.js
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
			const dir = dirname$1(path);
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
function isStaticSource(s) {
	return "files" in s && Array.isArray(s.files);
}
function isDynamicSource(s) {
	return "files" in s && typeof s.files === "function";
}
var EmptyLang = Symbol();
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
var group = /^\((?<name>.+)\)$/;
var link = /^(?<external>external:)?(?:\[(?<icon>[^\]]+)])?\[(?<name>[^\]]+)]\((?<url>[^)]+)\)$/;
var separator = /^---(?:\[(?<icon>[^\]]+)])?(?<name>.+)---|^---$/;
var rest = "...";
var restReversed = "z...a";
var extractPrefix = "...";
var excludePrefix = "!";
var SymbolUnfinished = Symbol("unfinished");
var SymbolName = Symbol("name");
var SymbolOwner = Symbol("owner");
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
					dir: dirname$1(parent.path),
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
			const { renderToString } = await import("./server.react-server-nej6avlA.js");
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
var priorityMap = {
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
//#region node_modules/fumadocs-core/dist/source/dynamic.js
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
		get: (0, import_react_react_server.cache)(async () => {
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
//#region node_modules/fumapress/dist/lib/shared.js
var import_deepmerge = /* @__PURE__ */ __toESM(require_deepmerge(), 1);
var appContext = new AsyncLocalStorage({ name: "fumapress:core" });
function getPressContext() {
	const store = appContext.getStore();
	if (!store) throw new Error("[Fumapress] Missing server context for Fumapress, make sure to use the middlewares from createRouter()");
	return store;
}
var PLUGIN_ORDER = {
	pre: -1,
	post: 1,
	_: 0
};
function flattenPlugins(plugins) {
	const out = [];
	for (const plugin of plugins) {
		if (!plugin) continue;
		if (Array.isArray(plugin)) out.push(...flattenPlugins(plugin));
		else out.push(plugin);
	}
	return out;
}
function resolvePlugins(plugins) {
	return flattenPlugins(plugins).sort((a, b) => PLUGIN_ORDER[a.enforce ?? "_"] - PLUGIN_ORDER[b.enforce ?? "_"]);
}
async function initApp(builder) {
	const config = builder.get();
	const { translations, site, mode = "default", layouts } = config;
	const plugins = resolvePlugins([...config.plugins, ...applyDefaultsPlugin()]);
	const ctx = {
		$context: void 0,
		getLoader() {
			throw new Error("[Fumapress] Content loader is not initialized yet, please access it after init()");
		},
		revalidateLoader: () => Promise.resolve(void 0),
		invalidateLoader: () => void 0,
		i18nConfig: translations && "config" in translations ? translations.config : void 0,
		layouts: {
			...layouts,
			root: layouts.root ?? (await import("./root-ClcYYN4B.js")).createRootLayout(),
			page: layouts.page ?? (await import("./docs-BCKBA2wI.js")).createDocsLayoutPage(),
			notFound: layouts.notFound ?? (await import("./not-found-2p3_Y67r.js")).DefaultNotFound
		},
		plugins,
		adapters: config.adapters,
		data: {},
		translationsConfig: translations,
		mode,
		metaConfig: config.meta,
		siteConfig: {
			name: site?.name ?? "Fumapress",
			baseUrl: site?.baseUrl ?? getDefaultBaseUrl(),
			git: site?.git ? {
				...site.git,
				rootDir: site.git.rootDir ?? getGitRootDir() ?? process.cwd()
			} : void 0
		}
	};
	if ("loader" in config && config.loader) {
		ctx.i18nConfig ??= config.loader._i18n;
		ctx.getLoader = () => config.loader;
	} else if ("content" in config) ctx.i18nConfig ??= config.i18n;
	else {
		console.warn("[Fumapress] loader is not specified in your config, is it a mistake?");
		const emptyLoader = loader({}, { baseUrl: "/" });
		ctx.getLoader = () => emptyLoader;
	}
	for (const plugin of plugins) await plugin.init?.call(ctx);
	if ("content" in config) {
		let loaderOptions = {
			baseUrl: "/",
			i18n: ctx.i18nConfig,
			...config.loaderOptions
		};
		for (const plugin of plugins) {
			if (!plugin.configureLoader) continue;
			loaderOptions = await plugin.configureLoader.call(ctx, loaderOptions);
		}
		const source = dynamicLoader(config.content, loaderOptions);
		ctx.revalidateLoader = source.revalidate.bind(source);
		ctx.invalidateLoader = source.invalidate.bind(source);
		ctx.getLoader = () => {
			if (config.loaderOptions?.alwaysRevalidate) source.invalidate();
			return source.get();
		};
	}
	return ctx;
}
function getDefaultBaseUrl() {
	console.warn("[Fumapress] It is recommended to specify \"site.baseUrl\" in your config for better SEO.");
}
function renderRootMeta(context) {
	return context.metaConfig?.root?.call(context);
}
function renderPageMeta(page, context) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("title", { children: page.data.title }),
		/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
			property: "og:title",
			content: page.data.title
		}),
		page.data.description && /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
			property: "og:description",
			content: page.data.description
		}),
		context.metaConfig?.page?.call(context, page),
		context.data["core:page-meta"]?.map((hook, i) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(import_react_react_server.Fragment, { children: hook(page) }, i))
	] });
}
function getGitHubFileUrl(ctx, absolutePath) {
	const { git } = ctx.siteConfig;
	if (!git) return;
	const p = path.relative(git.rootDir, absolutePath).replaceAll(path.sep, "/");
	if (p.startsWith("../")) return;
	return `https://github.com/${git.user}/${git.repo}/blob/${git.branch}/${p}`;
}
function baseLayoutProps(ctx) {
	const { name, git } = ctx.siteConfig;
	return {
		githubUrl: git ? `https://github.com/${git.user}/${git.repo}` : void 0,
		nav: { title: name }
	};
}
function createTransformChildren(Component) {
	return function({ props, children }) {
		if (props.children) for (const transformer of props.children) children = transformer(children);
		return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Component, {
			...props,
			children
		});
	};
}
async function renderBody(ctx, page, errorMessage) {
	for (const adapter of ctx.adapters) {
		const body = await adapter["core:render-body"]?.call(ctx, page);
		if (body !== void 0) return body;
	}
	throw new Error(errorMessage);
}
async function renderToc(ctx, page) {
	for (const adapter of ctx.adapters) {
		const toc = await adapter["core:render-toc"]?.call(ctx, page);
		if (toc !== void 0) return toc;
	}
}
async function getLastModifiedDate(ctx, page) {
	for (const adapter of ctx.adapters) {
		const date = await adapter["core:get-modified-date"]?.call(ctx, page);
		if (date !== void 0) return date;
	}
}
var mergeLayoutConfigs = (0, import_deepmerge.default)({
	all: true,
	onlyDefinedProperties: true,
	isMergeableObject(value) {
		if ((0, import_react_react_server.isValidElement)(value)) return false;
		return import_deepmerge.default.isMergeableObject(value);
	}
});
//#endregion
export { getLastModifiedDate as a, mergeLayoutConfigs as c, renderRootMeta as d, renderToc as f, getGitHubFileUrl as i, renderBody as l, baseLayoutProps as n, getPressContext as o, createTransformChildren as r, initApp as s, appContext as t, renderPageMeta as u };
