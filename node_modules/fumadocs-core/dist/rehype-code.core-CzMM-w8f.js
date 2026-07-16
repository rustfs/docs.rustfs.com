import { n as flattenNodeHast } from "./utils-Yx0IL9eW.js";
import { n as defaultThemes, r as getRequiredThemes } from "./utils-D2T58c9w.js";
import { parseCodeBlockAttributes } from "./mdx-plugins/codeblock-utils.js";
import { transformerIcon } from "./mdx-plugins/transformer-icon.js";
import { visit } from "unist-util-visit";
import { isSpecialLang } from "shiki/core";
//#region src/mdx-plugins/rehype-code/parsers.ts
const RE_TAILING_CURLY_COLON = /(.+)\{:([\w-]+)\}$/;
const InlineCodeParsers = { "tailing-curly-colon": (_tree, node) => {
	const raw = flattenNodeHast(node);
	const match = raw.match(RE_TAILING_CURLY_COLON);
	if (!match) return;
	return {
		structure: "inline",
		code: match[1] ?? raw,
		lang: match.at(2)
	};
} };
const languagePrefix = "language-";
const PreParser = (_tree, node) => {
	const head = node.children[0];
	if (!head || head.type !== "element" || head.tagName !== "code" || !head.properties) return;
	const classes = head.properties.className;
	const languageClass = Array.isArray(classes) ? classes.find((d) => typeof d === "string" && d.startsWith(languagePrefix)) : void 0;
	return {
		structure: "classic",
		lang: typeof languageClass === "string" ? languageClass.slice(9) : void 0,
		code: flattenNodeHast(head),
		meta: head.data?.meta ?? head.properties.metastring?.toString() ?? ""
	};
};
//#endregion
//#region src/mdx-plugins/rehype-code/shiki.ts
function rehypeShikiFromHighlighter(highlighter, options) {
	const { addLanguageClass = false, parseMetaString, filterMetaString, cache, defaultLanguage, fallbackLanguage, onError, stripEndNewline = true, inline = false, lazy = true, ...rest } = options;
	function isLanguageLoaded(lang) {
		return isSpecialLang(lang) || highlighter.getLoadedLanguages().includes(lang);
	}
	async function onNode(tree, node, parsed) {
		let { meta: metaString = "", lang = defaultLanguage, code } = parsed;
		if (!lang) return;
		if (!isLanguageLoaded(lang)) {
			if (lazy && lang in highlighter.getBundledLanguages()) await highlighter.loadLanguage(lang);
			else if (fallbackLanguage) {
				lang = fallbackLanguage;
				if (!isLanguageLoaded(fallbackLanguage)) await highlighter.loadLanguage(fallbackLanguage);
			}
		}
		if (filterMetaString) metaString = filterMetaString(metaString);
		const cacheKey = `${lang}:${metaString}:${code}`;
		const cachedValue = cache?.get(cacheKey);
		if (cachedValue) return cachedValue;
		const transformers = rest.transformers ? [...rest.transformers] : [];
		let _fd_postprocess;
		transformers.push({
			enforce: "post",
			root() {
				_fd_postprocess = this.meta._fd_postprocess;
			}
		});
		if (addLanguageClass) transformers.push(transformerAddLanguage(lang));
		const codeOptions = {
			...rest,
			lang,
			structure: parsed.structure,
			transformers,
			meta: {
				...rest.meta,
				__raw: metaString,
				...parseMetaString?.(metaString, node, tree)
			}
		};
		if (stripEndNewline && code.endsWith("\n")) code = code.slice(0, -1);
		const fragment = highlighter.codeToHast(code, codeOptions);
		if (_fd_postprocess && _fd_postprocess.length > 0) {
			const ctx = { highlighter };
			await Promise.all(_fd_postprocess.map((v) => v(ctx)));
		}
		cache?.set(cacheKey, fragment);
		if (parsed.structure === "classic") return fragment;
		return {
			type: "element",
			tagName: "code",
			properties: { class: "shiki" },
			children: fragment.children
		};
	}
	return async (tree) => {
		const queue = [];
		visit(tree, "element", (node, index, parent) => {
			let parsed;
			if (!parent || index == null) return;
			if (node.tagName === "pre") parsed = PreParser(tree, node);
			else if (node.tagName === "code" && inline) parsed = InlineCodeParsers[inline](tree, node);
			else return;
			if (!parsed) return "skip";
			queue.push(onNode(tree, node, parsed).then((fragment) => {
				if (fragment) parent.children[index] = fragment;
			}).catch((error) => {
				if (onError) onError(error);
				else throw error;
			}));
			return "skip";
		});
		if (queue.length > 0) await Promise.all(queue);
	};
}
function transformerAddLanguage(lang) {
	return {
		name: "rehype-shiki:code-language-class",
		code(node) {
			this.addClassToHast(node, `language-${lang}`);
			return node;
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@shikijs+transformers@4.3.1/node_modules/@shikijs/transformers/dist/index.mjs
const RE_SPLIT_COMMENT = /(\s+\/\/)/;
const RE_V1_END_COMMENT_PREFIX = /(?:\/\/|["'#]|;{1,2}|%{1,2}|--)(\s*)$/;
const RE_V3_END_COMMENT_PREFIX = /(?:\/\/|#|;{1,2}|%{1,2}|--)(\s*)$/;
/**
* some comment formats have to be located at the end of line
* hence we can skip matching them for other tokens
*/
const matchers = [
	[/^(<!--)(.+)(-->)$/, false],
	[/^(\/\*)(.+)(\*\/)$/, false],
	[/^(\/\/|["'#]|;{1,2}|%{1,2}|--)(.*)$/, true],
	[/^(\*)(.+)$/, true]
];
/**
* @param lines line tokens
* @param jsx enable JSX parsing
* @param matchAlgorithm matching algorithm
*/
function parseComments(lines, jsx, matchAlgorithm) {
	const out = [];
	for (const line of lines) {
		if (matchAlgorithm === "v3") {
			const splittedElements = line.children.flatMap((element, idx) => {
				if (element.type !== "element") return element;
				const token = element.children[0];
				if (token.type !== "text") return element;
				const isLast = idx === line.children.length - 1;
				if (!matchToken(token.value, isLast)) return element;
				const rawSplits = token.value.split(RE_SPLIT_COMMENT);
				if (rawSplits.length <= 1) return element;
				let splits = [rawSplits[0]];
				for (let i = 1; i < rawSplits.length; i += 2) splits.push(rawSplits[i] + (rawSplits[i + 1] || ""));
				splits = splits.filter(Boolean);
				if (splits.length <= 1) return element;
				return splits.map((split) => {
					return {
						...element,
						children: [{
							type: "text",
							value: split
						}]
					};
				});
			});
			if (splittedElements.length !== line.children.length) line.children = splittedElements;
		}
		const elements = line.children;
		let start = elements.length - 1;
		if (matchAlgorithm === "v1") start = 0;
		else if (jsx) start = elements.length - 2;
		for (let i = Math.max(start, 0); i < elements.length; i++) {
			const token = elements[i];
			if (token.type !== "element") continue;
			const head = token.children.at(0);
			if (head?.type !== "text") continue;
			const isLast = i === elements.length - 1;
			let match = matchToken(head.value, isLast);
			let additionalTokens;
			if (!match && i > 0 && head.value.trim().startsWith("[!code")) {
				const prevToken = elements[i - 1];
				if (prevToken?.type === "element") {
					const prevHead = prevToken.children.at(0);
					if (prevHead?.type === "text" && prevHead.value.includes("//")) {
						const combinedMatch = matchToken(prevHead.value + head.value, isLast);
						if (combinedMatch) {
							match = combinedMatch;
							out.push({
								info: combinedMatch,
								line,
								token: prevToken,
								isLineCommentOnly: elements.length === 2 && prevToken.children.length === 1 && token.children.length === 1,
								isJsxStyle: false,
								additionalTokens: [token]
							});
							continue;
						}
					}
				}
			}
			if (!match) continue;
			if (jsx && !isLast && i !== 0) {
				const isJsxStyle = isValue(elements[i - 1], "{") && isValue(elements[i + 1], "}");
				out.push({
					info: match,
					line,
					token,
					isLineCommentOnly: elements.length === 3 && token.children.length === 1,
					isJsxStyle,
					additionalTokens
				});
			} else out.push({
				info: match,
				line,
				token,
				isLineCommentOnly: elements.length === 1 && token.children.length === 1,
				isJsxStyle: false,
				additionalTokens
			});
		}
	}
	return out;
}
function isValue(element, value) {
	if (element.type !== "element") return false;
	const text = element.children[0];
	if (text.type !== "text") return false;
	return text.value.trim() === value;
}
/**
* @param text text value of comment node
* @param isLast whether the token is located at the end of line
*/
function matchToken(text, isLast) {
	let trimmed = text.trimStart();
	const spaceFront = text.length - trimmed.length;
	trimmed = trimmed.trimEnd();
	const spaceEnd = text.length - trimmed.length - spaceFront;
	for (const [matcher, endOfLine] of matchers) {
		if (endOfLine && !isLast) continue;
		const result = matcher.exec(trimmed);
		if (!result) continue;
		return [
			" ".repeat(spaceFront) + result[1],
			result[2],
			result[3] ? result[3] + " ".repeat(spaceEnd) : void 0
		];
	}
}
/**
* Remove empty comment prefixes at line end, e.g. `// `
*
* For matchAlgorithm v1
*/
function v1ClearEndCommentPrefix(text) {
	const match = text.match(RE_V1_END_COMMENT_PREFIX);
	if (match && match[1].trim().length === 0) return text.slice(0, match.index);
	return text;
}
/**
* Remove empty comment prefixes at line end, e.g. `// `
*
* For matchAlgorithm v3
*/
function v3ClearEndCommentPrefix(text) {
	const match = text.match(RE_V3_END_COMMENT_PREFIX);
	if (match && match[1].trim().length === 0) return text.slice(0, match.index).trimEnd();
	return text;
}
function createCommentNotationTransformer(name, regex, onMatch, matchAlgorithm) {
	matchAlgorithm ??= "v3";
	return {
		name,
		code(code) {
			const lines = code.children.filter((i) => i.type === "element");
			const linesToRemove = [];
			code.data ??= {};
			const data = code.data;
			data._shiki_notation ??= parseComments(lines, ["jsx", "tsx"].includes(this.options.lang), matchAlgorithm);
			const parsed = data._shiki_notation;
			for (const comment of parsed) {
				if (comment.info[1].length === 0) continue;
				let lineIdx = lines.indexOf(comment.line);
				if (comment.isLineCommentOnly && matchAlgorithm !== "v1") lineIdx++;
				let replaced = false;
				comment.info[1] = comment.info[1].replace(regex, (...match) => {
					if (onMatch.call(this, match, comment.line, comment.token, lines, lineIdx)) {
						replaced = true;
						return "";
					}
					return match[0];
				});
				if (!replaced) continue;
				if (matchAlgorithm === "v1") comment.info[1] = v1ClearEndCommentPrefix(comment.info[1]);
				else if (matchAlgorithm === "v3") comment.info[1] = v3ClearEndCommentPrefix(comment.info[1]);
				const isEmpty = comment.info[1].trim().length === 0;
				if (isEmpty) comment.info[1] = "";
				if (isEmpty && comment.isLineCommentOnly) linesToRemove.push(comment.line);
				else if (isEmpty && comment.isJsxStyle) comment.line.children.splice(comment.line.children.indexOf(comment.token) - 1, 3);
				else if (isEmpty) {
					if (comment.additionalTokens) for (let j = comment.additionalTokens.length - 1; j >= 0; j--) {
						const additionalToken = comment.additionalTokens[j];
						const tokenIndex = comment.line.children.indexOf(additionalToken);
						if (tokenIndex !== -1) comment.line.children.splice(tokenIndex, 1);
					}
					comment.line.children.splice(comment.line.children.indexOf(comment.token), 1);
				} else {
					const head = comment.token.children[0];
					if (head.type === "text") {
						head.value = comment.info.join("");
						if (comment.additionalTokens) for (const additionalToken of comment.additionalTokens) {
							const additionalHead = additionalToken.children[0];
							if (additionalHead?.type === "text") additionalHead.value = "";
						}
					}
				}
			}
			for (const line of linesToRemove) {
				const index = code.children.indexOf(line);
				const nextLine = code.children[index + 1];
				let removeLength = 1;
				if (nextLine?.type === "text" && nextLine?.value === "\n") removeLength = 2;
				code.children.splice(index, removeLength);
			}
		}
	};
}
const RE_ESCAPE_SPECIAL = /[.*+?^${}()|[\]\\]/g;
function escapeRegExp(str) {
	return str.replace(RE_ESCAPE_SPECIAL, "\\$&");
}
function transformerNotationMap(options = {}, name = "@shikijs/transformers:notation-map") {
	const { classMap = {}, classActivePre = void 0, classActiveCode = void 0 } = options;
	return createCommentNotationTransformer(name, new RegExp(`#?\\s*\\[!code (${Object.keys(classMap).map(escapeRegExp).join("|")})(:\\d+)?\\]`, "gi"), function([_, match, range = ":1"], _line, _comment, lines, index) {
		const lineNum = Number.parseInt(range.slice(1), 10);
		for (let i = index; i < Math.min(index + lineNum, lines.length); i++) this.addClassToHast(lines[i], classMap[match]);
		if (classActivePre) this.addClassToHast(this.pre, classActivePre);
		if (classActiveCode) this.addClassToHast(this.code, classActiveCode);
		return true;
	}, options.matchAlgorithm);
}
/**
* Use `[!code ++]` and `[!code --]` to mark added and removed lines.
*/
function transformerNotationDiff(options = {}) {
	const { classLineAdd = "diff add", classLineRemove = "diff remove", classActivePre = "has-diff", classActiveCode } = options;
	return transformerNotationMap({
		classMap: {
			"++": classLineAdd,
			"--": classLineRemove
		},
		classActivePre,
		classActiveCode,
		matchAlgorithm: options.matchAlgorithm
	}, "@shikijs/transformers:notation-diff");
}
/**
* Allow using `[!code focus]` notation in code to mark focused lines.
*/
function transformerNotationFocus(options = {}) {
	const { classActiveLine = "focused", classActivePre = "has-focused", classActiveCode } = options;
	return transformerNotationMap({
		classMap: { focus: classActiveLine },
		classActivePre,
		classActiveCode,
		matchAlgorithm: options.matchAlgorithm
	}, "@shikijs/transformers:notation-focus");
}
/**
* Allow using `[!code highlight]` notation in code to mark highlighted lines.
*/
function transformerNotationHighlight(options = {}) {
	const { classActiveLine = "highlighted", classActivePre = "has-highlighted", classActiveCode } = options;
	return transformerNotationMap({
		classMap: {
			highlight: classActiveLine,
			hl: classActiveLine
		},
		classActivePre,
		classActiveCode,
		matchAlgorithm: options.matchAlgorithm
	}, "@shikijs/transformers:notation-highlight");
}
function highlightWordInLine(line, ignoredElement, word, className) {
	const content = getTextContent(line);
	let index = content.indexOf(word);
	while (index !== -1) {
		highlightRange.call(this, line.children, ignoredElement, index, word.length, className);
		index = content.indexOf(word, index + 1);
	}
}
function getTextContent(element) {
	if (element.type === "text") return element.value;
	if (element.type === "element" && element.tagName === "span") return element.children.map(getTextContent).join("");
	return "";
}
/**
* @param elements
* @param ignoredElement
* @param index highlight beginning index
* @param len highlight length
* @param className class name to add to highlighted nodes
*/
function highlightRange(elements, ignoredElement, index, len, className) {
	let currentIdx = 0;
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		if (element.type !== "element" || element.tagName !== "span" || element === ignoredElement) continue;
		const textNode = element.children[0];
		if (textNode.type !== "text") continue;
		if (hasOverlap([currentIdx, currentIdx + textNode.value.length - 1], [index, index + len])) {
			const start = Math.max(0, index - currentIdx);
			const length = len - Math.max(0, currentIdx - index);
			if (length === 0) continue;
			const separated = separateToken(element, textNode, start, length);
			this.addClassToHast(separated[1], className);
			const output = separated.filter(Boolean);
			elements.splice(i, 1, ...output);
			i += output.length - 1;
		}
		currentIdx += textNode.value.length;
	}
}
function hasOverlap(range1, range2) {
	return range1[0] <= range2[1] && range1[1] >= range2[0];
}
function separateToken(span, textNode, index, len) {
	const text = textNode.value;
	const createNode = (value) => inheritElement(span, { children: [{
		type: "text",
		value
	}] });
	return [
		index > 0 ? createNode(text.slice(0, index)) : void 0,
		createNode(text.slice(index, index + len)),
		index + len < text.length ? createNode(text.slice(index + len)) : void 0
	];
}
function inheritElement(original, overrides) {
	return {
		...original,
		properties: { ...original.properties },
		...overrides
	};
}
const RE_CODE_WORD = /\s*\[!code word:((?:\\.|[^:\]])+)(:\d+)?\]/;
const RE_UNESCAPE = /\\(.)/g;
function transformerNotationWordHighlight(options = {}) {
	const { classActiveWord = "highlighted-word", classActivePre = void 0 } = options;
	return createCommentNotationTransformer("@shikijs/transformers:notation-highlight-word", RE_CODE_WORD, function([_, word, range], _line, comment, lines, index) {
		const lineNum = range ? Number.parseInt(range.slice(1), 10) : lines.length;
		word = word.replace(RE_UNESCAPE, "$1");
		for (let i = index; i < Math.min(index + lineNum, lines.length); i++) highlightWordInLine.call(this, lines[i], comment, word, classActiveWord);
		if (classActivePre) this.addClassToHast(this.pre, classActivePre);
		return true;
	}, options.matchAlgorithm);
}
//#endregion
//#region src/mdx-plugins/rehype-code.core.ts
function rehypeCodeDefaultOptions() {
	return {
		...defaultThemes,
		defaultLanguage: "plaintext",
		transformers: [
			transformerNotationHighlight({ matchAlgorithm: "v3" }),
			transformerNotationWordHighlight({ matchAlgorithm: "v3" }),
			transformerNotationDiff({ matchAlgorithm: "v3" }),
			transformerNotationFocus({ matchAlgorithm: "v3" })
		],
		parseMetaString(meta) {
			const parsed = parseCodeBlockAttributes(meta, [
				"title",
				"tab",
				"noCopy",
				"lineNumbers"
			]);
			const data = {};
			for (const [k, v] of Object.entries(parsed.attributes)) {
				if (k === "noCopy") {
					data.allowCopy = "false";
					continue;
				}
				if (k === "lineNumbers") {
					data["data-line-numbers"] = true;
					if (typeof v === "number") data["data-line-numbers-start"] = v;
					continue;
				}
				data[k] = v;
			}
			data.__raw = parsed.rest;
			return data;
		}
	};
}
function createRehypeCode(highlighterFactory) {
	async function initTransformer(_options) {
		let highlighter;
		let options;
		if (typeof highlighterFactory === "function") {
			const out = await highlighterFactory(_options);
			highlighter = out.highlighter;
			options = out.options;
		} else {
			highlighter = _options?.langAlias ? await highlighterFactory.init(_options) : await highlighterFactory.getOrInit();
			options = _options ?? {};
		}
		const transformers = options.transformers ? [...options.transformers] : [];
		if (options.icon !== false) transformers.push(transformerIcon(options.icon));
		if (options.tab !== false) transformers.push(transformerTab());
		const lazy = options.lazy ?? true;
		let preloadLangs = options.langs;
		if (!lazy) preloadLangs ??= Object.keys(highlighter.getBundledLanguages());
		await Promise.all([highlighter.loadTheme(...getRequiredThemes(options)), preloadLangs && highlighter.loadLanguage(...preloadLangs)]);
		return rehypeShikiFromHighlighter(highlighter, {
			...options,
			transformers
		});
	}
	return function rehypeCode(_options) {
		const transformer = initTransformer(_options);
		return async (tree, file) => {
			await (await transformer)(tree, file, () => void 0);
		};
	};
}
function transformerTab() {
	return {
		name: "rehype-code:tab",
		root(root) {
			const value = this.options.meta?.tab;
			if (typeof value !== "string") return root;
			console.warn("[Fumadocs] For `tab=\"value\" in codeblocks, please use `remarkCodeTab` plugin instead.");
			return {
				type: "root",
				children: [{
					type: "mdxJsxFlowElement",
					name: "Tab",
					data: { _codeblock: true },
					attributes: [{
						type: "mdxJsxAttribute",
						name: "value",
						value
					}],
					children: root.children
				}]
			};
		}
	};
}
//#endregion
export { rehypeCodeDefaultOptions as n, transformerTab as r, createRehypeCode as t };
