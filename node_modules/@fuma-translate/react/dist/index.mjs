"use client";
import { cloneElement, createContext, isValidElement, use, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/index.tsx
const Context = createContext({});
/** add translations, you can stack multiple <TranslationProvider /> to override/extend translations */
function TranslationProvider({ translations, children }) {
	const parent = use(Context);
	return /* @__PURE__ */ jsx(Context, {
		value: useMemo(() => ({
			...parent,
			...translations
		}), [parent, translations]),
		children
	});
}
const REGEX_VAR = /\\?\{([^}]+)\}/g;
function useTranslations({ note } = {}) {
	const translations = use(Context);
	return useMemo(() => fromTranslations(translations, { note }), [translations, note]);
}
/** create a translation function from a translations object (e.g. outside React) */
function fromTranslations(translations, { note: hookNote } = {}) {
	const res = (rawText, opts = {}) => {
		const { note, variables } = opts;
		const notes = [];
		if (hookNote) notes.push(hookNote);
		if (note) notes.push(note);
		let text = translations[encodeKey(rawText, notes)] ?? rawText;
		if (variables) text = text.replaceAll(REGEX_VAR, (m, name) => {
			if (m[0] === "\\") return m.slice(1);
			if (name in variables) return variables[name];
			return m;
		});
		return text;
	};
	res.jsx = (rawText, opts = {}) => {
		const { note, variables, tags } = opts;
		const notes = [];
		if (hookNote) notes.push(hookNote);
		if (note) notes.push(note);
		const text = translations[encodeKey(rawText, notes)] ?? rawText;
		if (tags) return onJsx(text, variables, tags);
		if (variables) return onJsxVariables(text, variables);
		return text;
	};
	res.translations = translations;
	return res;
}
function encodeKey(text, notes) {
	return text + notes.map((n) => `(${n})`).join("");
}
function onJsxVariables(text, variables) {
	let idx = 0;
	const out = [];
	for (const match of text.matchAll(REGEX_VAR)) {
		const [s, name] = match;
		if (idx < match.index) out.push(text.slice(idx, match.index));
		idx = match.index + s.length;
		if (s[0] === "\\") out.push(s.slice(1));
		else if (name in variables) out.push(enforceElementKey(variables[name], idx));
		else out.push(s);
	}
	out.push(text.slice(idx));
	return out;
}
const REGEX_TAG = /\\?<([^>]+)>/g;
function onJsx(text, variables, tags) {
	const stack = [{ children: [] }];
	let idx = 0;
	const closeTag = () => {
		const current = stack.pop();
		stack[stack.length - 1].children.push(enforceElementKey(current.tag && tags[current.tag] ? renderTag(tags[current.tag], current.children) : current.children, idx));
	};
	for (const match of text.matchAll(REGEX_TAG)) {
		const current = stack[stack.length - 1];
		const [s, content] = match;
		if (idx < match.index) {
			const str = text.slice(idx, match.index);
			current.children.push(variables ? onJsxVariables(str, variables) : str);
		}
		idx = match.index + s.length;
		if (s[0] === "\\") {
			const str = s.slice(1);
			current.children.push(variables ? onJsxVariables(str, variables) : str);
		} else if (content[0] === "/") {
			const name = content.slice(1);
			if (current.tag !== name) current.children.push(variables ? onJsxVariables(s, variables) : s);
			else closeTag();
		} else if (content.at(-1) === "/") {
			const name = content.slice(0, -1);
			if (tags[name]) current.children.push(enforceElementKey(renderTag(tags[name]), idx));
		} else stack.push({
			children: [],
			tag: content
		});
	}
	if (idx < text.length) {
		const str = text.slice(idx);
		stack[stack.length - 1].children.push(variables ? onJsxVariables(str, variables) : str);
	}
	while (stack.length > 1) closeTag();
	return stack[0].children;
}
function T({ text, note, variables, tags }) {
	const translations = use(Context);
	return useMemo(() => fromTranslations(translations).jsx(text, {
		note,
		variables,
		tags
	}), [
		translations,
		text,
		note,
		variables,
		tags
	]);
}
function renderTag(renderer, child) {
	if (isValidElement(renderer)) return child === void 0 ? renderer : cloneElement(renderer, void 0, child);
	return renderer(child);
}
function enforceElementKey(value, key) {
	if (isValidElement(value)) return cloneElement(value, { key });
	return value;
}
//#endregion
export { T, TranslationProvider, fromTranslations, useTranslations };

//# sourceMappingURL=index.mjs.map