import { frontmatter } from "fumadocs-core/content/md/frontmatter";
import * as fs$1 from "node:fs/promises";
import * as path$1 from "node:path";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { remarkHeading } from "fumadocs-core/mdx-plugins";
import { VFile } from "vfile";
//#region src/config/preset.ts
function pluginOption(def, options = []) {
	const list = def(Array.isArray(options) ? options : []).filter(Boolean);
	if (typeof options === "function") return options(list);
	return list;
}
/**
* apply MDX processor presets
*/
function applyMdxPreset(options = {}) {
	return async (environment = "bundler") => {
		if (options.preset === "minimal") return options;
		const plugins = await import("fumadocs-core/mdx-plugins");
		const { valueToExport = [], rehypeCodeOptions, remarkImageOptions, remarkHeadingOptions, remarkStructureOptions, remarkCodeTabOptions, remarkNpmOptions, ...mdxOptions } = options;
		const remarkPlugins = pluginOption((v) => [
			plugins.remarkGfm,
			[plugins.remarkHeading, {
				generateToc: false,
				...remarkHeadingOptions
			}],
			remarkImageOptions !== false && [plugins.remarkImage, {
				...remarkImageOptions,
				useImport: remarkImageOptions?.useImport ?? environment === "bundler"
			}],
			"remarkCodeTab" in plugins && remarkCodeTabOptions !== false && [plugins.remarkCodeTab, remarkCodeTabOptions],
			"remarkNpm" in plugins && remarkNpmOptions !== false && [plugins.remarkNpm, remarkNpmOptions],
			...v,
			remarkStructureOptions !== false && [plugins.remarkStructure, {
				exportAs: "structuredData",
				...remarkStructureOptions
			}],
			valueToExport.length > 0 && (() => {
				return (_, file) => {
					file.data["mdx-export"] ??= [];
					for (const name of valueToExport) {
						if (!(name in file.data)) continue;
						file.data["mdx-export"].push({
							name,
							value: file.data[name]
						});
					}
				};
			})
		], mdxOptions.remarkPlugins);
		const rehypePlugins = pluginOption((v) => [
			rehypeCodeOptions !== false && [plugins.rehypeCode, rehypeCodeOptions],
			...v,
			plugins.rehypeToc
		], mdxOptions.rehypePlugins);
		return {
			...mdxOptions,
			outputFormat: environment === "runtime" ? "function-body" : mdxOptions.outputFormat,
			remarkPlugins,
			rehypePlugins
		};
	};
}
//#endregion
//#region src/loaders/mdx/remark-unravel.ts
function remarkMarkAndUnravel() {
	return (tree) => {
		visit(tree, function(node, index, parent) {
			let offset = -1;
			let all = true;
			let oneOrMore = false;
			if (parent && typeof index === "number" && node.type === "paragraph") {
				const children = node.children;
				while (++offset < children.length) {
					const child = children[offset];
					if (child.type === "mdxJsxTextElement" || child.type === "mdxTextExpression") oneOrMore = true;
					else if (child.type === "text" && child.value.trim().length === 0) {} else {
						all = false;
						break;
					}
				}
				if (all && oneOrMore) {
					offset = -1;
					const newChildren = [];
					while (++offset < children.length) {
						const child = children[offset];
						if (child.type === "mdxJsxTextElement") child.type = "mdxJsxFlowElement";
						if (child.type === "mdxTextExpression") child.type = "mdxFlowExpression";
						if (child.type === "text" && /^[\t\r\n ]+$/.test(String(child.value))) {} else newChildren.push(child);
					}
					parent.children.splice(index, 1, ...newChildren);
					return index;
				}
			}
		});
	};
}
//#endregion
//#region src/loaders/mdx/mdast-utils.ts
function flattenNode(node) {
	if ("children" in node) return node.children.map((child) => flattenNode(child)).join("");
	if ("value" in node) return node.value;
	return "";
}
//#endregion
//#region src/loaders/mdx/remark-include.ts
/**
* VS Code–style region extraction
* Adapted from VitePress:
* https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/snippet.ts
*/
const REGION_MARKERS = [
	{
		start: /^\s*\/\/\s*#?region\b\s*(.*?)\s*$/,
		end: /^\s*\/\/\s*#?endregion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*<!--\s*#?region\b\s*(.*?)\s*-->/,
		end: /^\s*<!--\s*#?endregion\b\s*(.*?)\s*-->/
	},
	{
		start: /^\s*\/\*\s*#region\b\s*(.*?)\s*\*\//,
		end: /^\s*\/\*\s*#endregion\b\s*(.*?)\s*\*\//
	},
	{
		start: /^\s*#[rR]egion\b\s*(.*?)\s*$/,
		end: /^\s*#[eE]nd ?[rR]egion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*#\s*#?region\b\s*(.*?)\s*$/,
		end: /^\s*#\s*#?endregion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*(?:--|::|@?REM)\s*#region\b\s*(.*?)\s*$/,
		end: /^\s*(?:--|::|@?REM)\s*#endregion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*#pragma\s+region\b\s*(.*?)\s*$/,
		end: /^\s*#pragma\s+endregion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*\(\*\s*#region\b\s*(.*?)\s*\*\)/,
		end: /^\s*\(\*\s*#endregion\b\s*(.*?)\s*\*\)/
	}
];
function dedent(lines) {
	const minIndent = lines.reduce((min, line) => {
		const match = line.match(/^(\s*)\S/);
		return match ? Math.min(min, match[1].length) : min;
	}, Infinity);
	return minIndent === Infinity ? lines.join("\n") : lines.map((l) => l.slice(minIndent)).join("\n");
}
function extractCodeRegion(content, regionName) {
	const lines = content.split("\n");
	for (let i = 0; i < lines.length; i++) for (const re of REGION_MARKERS) {
		let match = re.start.exec(lines[i]);
		if (match?.[1] !== regionName) continue;
		let depth = 1;
		const extractedLines = [];
		for (let j = i + 1; j < lines.length; j++) {
			match = re.start.exec(lines[j]);
			if (match) {
				depth++;
				continue;
			}
			match = re.end.exec(lines[j]);
			if (match) {
				if (match[1] === regionName) depth = 0;
				else if (match[1] === "") depth--;
				else continue;
				if (depth > 0) continue;
				return dedent(extractedLines);
			} else extractedLines.push(lines[j]);
		}
	}
	throw new Error(`Region "${regionName}" not found`);
}
const ElementLikeTypes = [
	"mdxJsxFlowElement",
	"mdxJsxTextElement",
	"containerDirective",
	"textDirective",
	"leafDirective"
];
function isElementLike(node) {
	return ElementLikeTypes.includes(node.type);
}
function parseElementAttributes(element) {
	if (Array.isArray(element.attributes)) {
		const attributes = {};
		for (const attr of element.attributes) if (attr.type === "mdxJsxAttribute" && (typeof attr.value === "string" || attr.value === null)) attributes[attr.name] = attr.value;
		return attributes;
	}
	return element.attributes ?? {};
}
function parseSpecifier(specifier) {
	const idx = specifier.lastIndexOf("#");
	if (idx === -1) return { file: specifier };
	return {
		file: specifier.slice(0, idx),
		section: specifier.slice(idx + 1)
	};
}
function extractSection(root, section) {
	let nodes;
	let capturingHeadingContent = false;
	visit(root, (node) => {
		if (node.type === "heading") {
			if (capturingHeadingContent) return false;
			if (node.data?.hProperties?.id === section) {
				capturingHeadingContent = true;
				nodes = [node];
				return "skip";
			}
			return;
		}
		if (capturingHeadingContent) {
			nodes?.push(node);
			return "skip";
		}
		if (isElementLike(node) && node.name === "section") {
			if (parseElementAttributes(node).id === section) {
				nodes = node.children;
				return false;
			}
		}
	});
	if (nodes) return {
		type: "root",
		children: nodes
	};
}
function remarkInclude() {
	const TagName = "include";
	const embedContent = async (targetPath, heading, params, parent) => {
		const { _getProcessor = () => this, _compiler } = parent.data;
		let content;
		try {
			content = await fs$1.readFile(targetPath, "utf-8");
		} catch (e) {
			throw new Error(`failed to read file ${targetPath}\n${e instanceof Error ? e.message : String(e)}`, { cause: e });
		}
		const ext = path$1.extname(targetPath);
		_compiler?.addDependency(targetPath);
		if (params.lang || ext !== ".md" && ext !== ".mdx") {
			const lang = params.lang ?? ext.slice(1);
			let value = content;
			if (heading) value = extractCodeRegion(content, heading.trim());
			return {
				type: "code",
				lang,
				meta: params.meta,
				value,
				data: {}
			};
		}
		const parser = _getProcessor(ext === ".mdx" ? "mdx" : "md");
		const parsed = frontmatter(content);
		const targetFile = new VFile({
			path: targetPath,
			value: parsed.content,
			data: {
				...parent.data,
				frontmatter: parsed.data
			}
		});
		let mdast = parser.parse(targetFile);
		const baseProcessor = unified().use(remarkMarkAndUnravel);
		if (heading) {
			const extracted = extractSection(await baseProcessor.use(remarkHeading).run(mdast), heading);
			if (!extracted) throw new Error(`Cannot find section ${heading} in ${targetPath}, make sure you have encapsulated the section in a <section id="${heading}"> tag, or a :::section directive with remark-directive configured.`);
			mdast = extracted;
		} else mdast = await baseProcessor.run(mdast);
		await update(mdast, targetFile);
		return mdast;
	};
	async function update(tree, file) {
		const queue = [];
		visit(tree, ElementLikeTypes, (_node, _, parent) => {
			const node = _node;
			if (node.name !== TagName) return;
			const specifier = flattenNode(node);
			if (specifier.length === 0) return "skip";
			const attributes = parseElementAttributes(node);
			const { file: relativePath, section } = parseSpecifier(specifier);
			const targetPath = path$1.resolve("cwd" in attributes || !file.dirname ? file.cwd : file.dirname, relativePath);
			queue.push(embedContent(targetPath, section, attributes, file).then((replace) => {
				Object.assign(parent && parent.type === "paragraph" ? parent : node, replace);
			}));
			return "skip";
		});
		await Promise.all(queue);
	}
	return async (tree, file) => {
		await update(tree, file);
	};
}
//#endregion
export { flattenNode as n, applyMdxPreset as r, remarkInclude as t };
