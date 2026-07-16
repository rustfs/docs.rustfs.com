import { createRequire } from "node:module";
import plugin from "tailwindcss/plugin";
//#region \0rolldown/runtime.js
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
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
//#endregion
//#region src/typography/styles.ts
function round(num) {
	return num.toFixed(7).replace(/(\.[0-9]+?)0+$/, "$1").replace(/\.0$/, "");
}
function scaled(value) {
	return `calc(${value} * var(--tw-prose-size))`;
}
function scaledPx(value) {
	return scaled(`${round(value)}px`);
}
function rem(px) {
	return `${round(px / 16)}rem`;
}
function scaledRem(px) {
	return scaled(rem(px));
}
function em(px, base) {
	return `${round(px / base)}em`;
}
const colors = {
	"--tw-prose-body": "color-mix(in oklab, var(--color-fd-foreground) 90%, transparent)",
	"--tw-prose-headings": "var(--color-fd-foreground)",
	"--tw-prose-lead": `var(--color-fd-foreground)`,
	"--tw-prose-links": `var(--color-fd-foreground)`,
	"--tw-prose-bold": `var(--color-fd-foreground)`,
	"--tw-prose-counters": `var(--color-fd-muted-foreground)`,
	"--tw-prose-bullets": `var(--color-fd-muted-foreground)`,
	"--tw-prose-hr": `var(--color-fd-border)`,
	"--tw-prose-quotes": `var(--color-fd-foreground)`,
	"--tw-prose-quote-borders": `var(--color-fd-border)`,
	"--tw-prose-captions": `var(--color-fd-foreground)`,
	"--tw-prose-code": `var(--color-fd-foreground)`,
	"--tw-prose-th-borders": `var(--color-fd-border)`,
	"--tw-prose-td-borders": `var(--color-fd-border)`,
	"--tw-prose-kbd": `var(--color-fd-foreground)`,
	"--tw-prose-kbd-shadows": `color-mix(in oklab, var(--color-fd-primary) 50%, transparent)`
};
const roundedTable = {
	table: {
		borderCollapse: "separate",
		borderSpacing: "0",
		background: "var(--color-fd-card)",
		borderRadius: "var(--radius-lg)",
		border: "1px solid var(--color-fd-border)",
		overflow: "hidden"
	},
	th: {
		textAlign: "start",
		padding: scaled("var(--spacing) * 2.5"),
		"border-inline-start": "1px solid var(--color-fd-border)",
		background: "var(--color-fd-muted)"
	},
	"th:first-child": { "border-inline-start": "none" },
	"th:not(tr:last-child *), td:not(tr:last-child *)": { "border-bottom": "1px solid var(--color-fd-border)" },
	td: {
		textAlign: "start",
		"border-inline-start": "1px solid var(--color-fd-border)",
		padding: scaled("var(--spacing) * 2.5")
	},
	"td:first-child": { "border-inline-start": "none" },
	"tfoot th, tfoot td": {
		borderTopWidth: "1px",
		borderTopColor: "var(--tw-prose-th-borders)"
	},
	"thead th, thead td": {
		borderBottomWidth: "1px",
		borderBottomColor: "var(--tw-prose-th-borders)"
	}
};
const normalTable = {
	thead: {
		borderBottomWidth: "1px",
		borderBottomColor: "var(--tw-prose-th-borders)"
	},
	"thead th": {
		verticalAlign: "bottom",
		paddingInlineEnd: em(8, 14),
		paddingBottom: em(8, 14),
		paddingInlineStart: em(8, 14)
	},
	"thead th:first-child": { paddingInlineStart: "0" },
	"thead th:last-child": { paddingInlineEnd: "0" },
	"tbody td, tfoot td": {
		paddingTop: em(8, 14),
		paddingInlineEnd: em(8, 14),
		paddingBottom: em(8, 14),
		paddingInlineStart: em(8, 14)
	},
	"tbody td:first-child, tfoot td:first-child": { paddingInlineStart: "0" },
	"tbody td:last-child, tfoot td:last-child": { paddingInlineEnd: "0" },
	"tbody tr": {
		borderBottomWidth: "1px",
		borderBottomColor: "var(--tw-prose-td-borders)"
	},
	"tbody tr:last-child": { borderBottomWidth: "0" },
	"tbody td": { verticalAlign: "baseline" },
	tfoot: {
		borderTopWidth: "1px",
		borderTopColor: "var(--tw-prose-th-borders)"
	},
	"tfoot td": { verticalAlign: "top" },
	"th, td": { textAlign: "start" }
};
const DEFAULT = { css: [
	{
		"--tw-prose-size": "1",
		color: "var(--tw-prose-body)",
		maxWidth: "none",
		fontSize: scaledRem(16),
		lineHeight: scaledRem(28),
		"[class~=\"lead\"]": {
			fontSize: em(20, 16),
			lineHeight: round(32 / 20),
			marginTop: em(24, 20),
			marginBottom: em(24, 20),
			color: "var(--tw-prose-lead)"
		},
		ul: {
			paddingInlineStart: scaledRem(16),
			listStyleType: "disc",
			marginTop: em(20, 16),
			marginBottom: em(20, 16)
		},
		li: {
			marginTop: em(8, 16),
			marginBottom: em(8, 16)
		},
		"ol > li": { paddingInlineStart: em(6, 16) },
		"ul > li": { paddingInlineStart: "0" },
		"> ul > li p": {
			marginTop: em(12, 16),
			marginBottom: em(12, 16)
		},
		"> ul > li > p:first-child": { marginTop: em(20, 16) },
		"> ul > li > p:last-child": { marginBottom: em(20, 16) },
		"> ol > li > p:first-child": { marginTop: em(20, 16) },
		"> ol > li > p:last-child": { marginBottom: em(20, 16) },
		"ul ul, ul ol, ol ul, ol ol": {
			marginTop: em(12, 16),
			marginBottom: em(12, 16)
		},
		dl: {
			marginTop: em(20, 16),
			marginBottom: em(20, 16)
		},
		dt: {
			color: "var(--tw-prose-headings)",
			fontWeight: "600",
			marginTop: em(20, 16)
		},
		dd: {
			marginTop: em(8, 16),
			paddingInlineStart: em(26, 16)
		},
		hr: {
			borderColor: "var(--tw-prose-hr)",
			borderTopWidth: "1px",
			marginTop: em(48, 16),
			marginBottom: em(48, 16)
		},
		p: {
			marginTop: em(20, 16),
			marginBottom: em(20, 16)
		},
		strong: {
			color: "var(--tw-prose-bold)",
			fontWeight: "500"
		},
		"a strong": { color: "inherit" },
		"blockquote strong": { color: "inherit" },
		"thead th strong": { color: "inherit" },
		ol: {
			listStyleType: "decimal",
			marginTop: em(20, 16),
			marginBottom: em(20, 16),
			paddingInlineStart: em(26, 16)
		},
		"ol[type=\"A\"]": { listStyleType: "upper-alpha" },
		"ol[type=\"a\"]": { listStyleType: "lower-alpha" },
		"ol[type=\"A\" s]": { listStyleType: "upper-alpha" },
		"ol[type=\"a\" s]": { listStyleType: "lower-alpha" },
		"ol[type=\"I\"]": { listStyleType: "upper-roman" },
		"ol[type=\"i\"]": { listStyleType: "lower-roman" },
		"ol[type=\"I\" s]": { listStyleType: "upper-roman" },
		"ol[type=\"i\" s]": { listStyleType: "lower-roman" },
		"ol[type=\"1\"]": { listStyleType: "decimal" },
		"ol > li::marker": {
			fontWeight: "400",
			color: "var(--tw-prose-counters)"
		},
		"ul > li::marker": { color: "var(--tw-prose-bullets)" },
		blockquote: {
			marginTop: em(32, 20),
			marginBottom: em(32, 20),
			paddingInlineStart: em(20, 20),
			fontWeight: "500",
			fontStyle: "italic",
			color: "var(--tw-prose-quotes)",
			borderInlineStartWidth: "0.25rem",
			borderInlineStartColor: "var(--tw-prose-quote-borders)",
			quotes: "\"\\201C\"\"\\201D\"\"\\2018\"\"\\2019\""
		},
		"blockquote p:first-of-type::before": { content: "open-quote" },
		"blockquote p:last-of-type::after": { content: "close-quote" },
		h1: {
			color: "var(--tw-prose-headings)",
			fontWeight: "800",
			fontSize: scaled("var(--text-3xl)"),
			marginTop: "0",
			marginBottom: em(32, 36),
			lineHeight: round(40 / 36)
		},
		"h1 strong": {
			fontWeight: "900",
			color: "inherit"
		},
		h2: {
			color: "var(--tw-prose-headings)",
			fontSize: em(24, 16),
			marginTop: em(48, 24),
			marginBottom: em(24, 24),
			lineHeight: round(32 / 24),
			fontWeight: "600"
		},
		"h2 strong": {
			fontWeight: "800",
			color: "inherit"
		},
		h3: {
			color: "var(--tw-prose-headings)",
			fontWeight: "600",
			fontSize: em(20, 16),
			marginTop: em(32, 20),
			marginBottom: em(12, 20),
			lineHeight: round(32 / 20)
		},
		"h3 strong": {
			fontWeight: "700",
			color: "inherit"
		},
		h4: {
			color: "var(--tw-prose-headings)",
			fontWeight: "600",
			marginTop: em(24, 16),
			marginBottom: em(8, 16),
			lineHeight: round(24 / 16)
		},
		"h4 strong": {
			fontWeight: "700",
			color: "inherit"
		},
		"hr + *": { marginTop: "0" },
		"h2 + *": { marginTop: "0" },
		"h3 + *": { marginTop: "0" },
		"h4 + *": { marginTop: "0" },
		img: {
			marginTop: em(32, 16),
			marginBottom: em(32, 16)
		},
		picture: {
			display: "block",
			marginTop: em(32, 16),
			marginBottom: em(32, 16)
		},
		"picture > img": {
			marginTop: "0",
			marginBottom: "0"
		},
		video: {
			marginTop: em(32, 16),
			marginBottom: em(32, 16)
		},
		kbd: {
			fontSize: em(14, 16),
			borderRadius: rem(5),
			paddingTop: em(3, 16),
			paddingInlineEnd: em(6, 16),
			paddingBottom: em(3, 16),
			paddingInlineStart: em(6, 16),
			fontWeight: "500",
			fontFamily: "inherit",
			color: "var(--tw-prose-kbd)",
			boxShadow: "0 0 0 1px var(--tw-prose-kbd-shadows),0 3px 0 var(--tw-prose-kbd-shadows)"
		},
		code: {
			padding: scaledPx(3),
			border: "solid 1px",
			fontSize: scaledPx(13),
			borderColor: `var(--color-fd-border)`,
			borderRadius: "5px",
			fontWeight: "400",
			background: `var(--color-fd-muted)`,
			color: "var(--tw-prose-code)"
		},
		"a code": { color: "inherit" },
		"h1 code": {
			color: "inherit",
			fontSize: scaled("var(--text-2xl)")
		},
		"h2 code": {
			color: "inherit",
			fontSize: em(21, 24)
		},
		"h3 code": {
			color: "inherit",
			fontSize: em(18, 20)
		},
		"h4 code": { color: "inherit" },
		"blockquote code": { color: "inherit" },
		"thead th code": { color: "inherit" },
		table: {
			fontSize: em(14, 16),
			lineHeight: round(24 / 14),
			width: "100%",
			tableLayout: "auto",
			marginTop: em(32, 16),
			marginBottom: em(32, 16)
		},
		"thead th": {
			color: "var(--tw-prose-headings)",
			fontWeight: "600"
		},
		figure: {
			marginTop: em(32, 16),
			marginBottom: em(32, 16)
		},
		"figure > *": {
			marginTop: "0",
			marginBottom: "0"
		},
		figcaption: {
			color: "var(--tw-prose-captions)",
			fontSize: em(14, 16),
			lineHeight: round(20 / 14),
			marginTop: em(12, 14)
		},
		"a:not([data-card])": {
			color: "var(--tw-prose-links)",
			transition: "opacity .2s",
			fontWeight: "500",
			textDecoration: "underline",
			textUnderlineOffset: "3.5px",
			textDecorationColor: "var(--color-fd-primary)",
			textDecorationThickness: "1.5px"
		},
		"a:not([data-card]):hover": { opacity: "80%" }
	},
	colors,
	{
		"> :first-child": { marginTop: "0" },
		"> :last-child": { marginBottom: "0" }
	}
] };
const SMALL = { css: [{
	"--tw-prose-size": "0.875",
	"dt, strong, blockquote, h1, h2, h3, h4, kbd, thead th, a:not([data-card])": { fontWeight: "450" }
}] };
//#endregion
//#region ../../node_modules/.pnpm/@fastify+deepmerge@3.2.1/node_modules/@fastify/deepmerge/index.js
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
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/util/unesc.js
var require_unesc = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = unesc;
	/**
	*
	* @param {string} str
	* @returns {[string, number]|undefined}
	*/
	function gobbleHex(str) {
		var lower = str.toLowerCase();
		var hex = "";
		var spaceTerminated = false;
		for (var i = 0; i < 6 && lower[i] !== void 0; i++) {
			var code = lower.charCodeAt(i);
			var valid = code >= 97 && code <= 102 || code >= 48 && code <= 57;
			spaceTerminated = code === 32;
			if (!valid) break;
			hex += lower[i];
		}
		if (hex.length === 0) return;
		var codePoint = parseInt(hex, 16);
		if (codePoint >= 55296 && codePoint <= 57343 || codePoint === 0 || codePoint > 1114111) return ["�", hex.length + (spaceTerminated ? 1 : 0)];
		return [String.fromCodePoint(codePoint), hex.length + (spaceTerminated ? 1 : 0)];
	}
	var CONTAINS_ESCAPE = /\\/;
	function unesc(str) {
		if (!CONTAINS_ESCAPE.test(str)) return str;
		var ret = "";
		for (var i = 0; i < str.length; i++) {
			if (str[i] === "\\") {
				var gobbled = gobbleHex(str.slice(i + 1, i + 7));
				if (gobbled !== void 0) {
					ret += gobbled[0];
					i += gobbled[1];
					continue;
				}
				if (str[i + 1] === "\\") {
					ret += "\\";
					i++;
					continue;
				}
				if (str.length === i + 1) ret += str[i];
				continue;
			}
			ret += str[i];
		}
		return ret;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/util/getProp.js
var require_getProp = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = getProp;
	function getProp(obj) {
		var props = [];
		for (var _i = 1; _i < arguments.length; _i++) props[_i - 1] = arguments[_i];
		while (props.length > 0) {
			var prop = props.shift();
			if (!obj[prop]) return;
			obj = obj[prop];
		}
		return obj;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/util/ensureObject.js
var require_ensureObject = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ensureObject;
	function ensureObject(obj) {
		var props = [];
		for (var _i = 1; _i < arguments.length; _i++) props[_i - 1] = arguments[_i];
		while (props.length > 0) {
			var prop = props.shift();
			if (!obj[prop]) obj[prop] = {};
			obj = obj[prop];
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/util/stripComments.js
var require_stripComments = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = stripComments;
	function stripComments(str) {
		var s = "";
		var commentStart = str.indexOf("/*");
		var lastEnd = 0;
		while (commentStart >= 0) {
			s = s + str.slice(lastEnd, commentStart);
			var commentEnd = str.indexOf("*/", commentStart + 2);
			if (commentEnd < 0) return s;
			lastEnd = commentEnd + 2;
			commentStart = str.indexOf("/*", lastEnd);
		}
		s = s + str.slice(lastEnd);
		return s;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/util/maxNestingDepth.js
var require_maxNestingDepth = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MAX_NESTING_DEPTH = void 0;
	exports.default = resolveMaxNestingDepth;
	/**
	* The default maximum selector nesting depth allowed when parsing or
	* serializing a selector. Going beyond this would otherwise recurse deeply
	* enough to overflow the call stack (CVE-2026-9358 / CWE-674). Real-world
	* selectors never get anywhere near this, so it acts purely as a safety net
	* that turns an uncatchable stack overflow into a catchable error.
	*/
	exports.MAX_NESTING_DEPTH = 256;
	/**
	* Coerce a user-supplied nesting-depth limit into a safe value. Anything that
	* is not a non-negative safe integer (NaN, Infinity, negative numbers, or a
	* non-number) would disable or break the guard, so it falls back to the
	* default.
	*
	* @param {unknown} value the limit provided through the `maxNestingDepth` option
	* @returns {number} a safe, non-negative integer limit
	*/
	function resolveMaxNestingDepth(value) {
		return Number.isSafeInteger(value) && value >= 0 ? value : exports.MAX_NESTING_DEPTH;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/util/index.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MAX_NESTING_DEPTH = exports.resolveMaxNestingDepth = exports.stripComments = exports.ensureObject = exports.getProp = exports.unesc = void 0;
	var unesc_1 = require_unesc();
	Object.defineProperty(exports, "unesc", {
		enumerable: true,
		get: function() {
			return __importDefault(unesc_1).default;
		}
	});
	var getProp_1 = require_getProp();
	Object.defineProperty(exports, "getProp", {
		enumerable: true,
		get: function() {
			return __importDefault(getProp_1).default;
		}
	});
	var ensureObject_1 = require_ensureObject();
	Object.defineProperty(exports, "ensureObject", {
		enumerable: true,
		get: function() {
			return __importDefault(ensureObject_1).default;
		}
	});
	var stripComments_1 = require_stripComments();
	Object.defineProperty(exports, "stripComments", {
		enumerable: true,
		get: function() {
			return __importDefault(stripComments_1).default;
		}
	});
	var maxNestingDepth_1 = require_maxNestingDepth();
	Object.defineProperty(exports, "resolveMaxNestingDepth", {
		enumerable: true,
		get: function() {
			return __importDefault(maxNestingDepth_1).default;
		}
	});
	Object.defineProperty(exports, "MAX_NESTING_DEPTH", {
		enumerable: true,
		get: function() {
			return maxNestingDepth_1.MAX_NESTING_DEPTH;
		}
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/node.js
var require_node$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	var cloneNode = function(obj, parent, depth) {
		if (depth === void 0) depth = 0;
		if (depth > util_1.MAX_NESTING_DEPTH) throw new Error("Cannot clone selector: nesting depth exceeds the maximum of ".concat(util_1.MAX_NESTING_DEPTH, "."));
		if (typeof obj !== "object" || obj === null) return obj;
		var cloned = new obj.constructor();
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			var value = obj[i];
			if (i === "parent" && typeof value === "object") {
				if (parent) cloned[i] = parent;
			} else if (value instanceof Array) cloned[i] = value.map(function(j) {
				return cloneNode(j, cloned, depth + 1);
			});
			else cloned[i] = cloneNode(value, cloned, depth + 1);
		}
		return cloned;
	};
	exports.default = function() {
		function Node(opts) {
			if (opts === void 0) opts = {};
			Object.assign(this, opts);
			this.spaces = this.spaces || {};
			this.spaces.before = this.spaces.before || "";
			this.spaces.after = this.spaces.after || "";
		}
		Node.prototype.remove = function() {
			if (this.parent) this.parent.removeChild(this);
			this.parent = void 0;
			return this;
		};
		Node.prototype.replaceWith = function() {
			if (this.parent) {
				for (var index in arguments) this.parent.insertBefore(this, arguments[index]);
				this.remove();
			}
			return this;
		};
		Node.prototype.next = function() {
			return this.parent.at(this.parent.index(this) + 1);
		};
		Node.prototype.prev = function() {
			return this.parent.at(this.parent.index(this) - 1);
		};
		Node.prototype.clone = function(overrides) {
			if (overrides === void 0) overrides = {};
			var cloned = cloneNode(this);
			for (var name in overrides) cloned[name] = overrides[name];
			return cloned;
		};
		/**
		* Some non-standard syntax doesn't follow normal escaping rules for css.
		* This allows non standard syntax to be appended to an existing property
		* by specifying the escaped value. By specifying the escaped value,
		* illegal characters are allowed to be directly inserted into css output.
		* @param {string} name the property to set
		* @param {any} value the unescaped value of the property
		* @param {string} valueEscaped optional. the escaped value of the property.
		*/
		Node.prototype.appendToPropertyAndEscape = function(name, value, valueEscaped) {
			if (!this.raws) this.raws = {};
			var originalValue = this[name];
			var originalEscaped = this.raws[name];
			this[name] = originalValue + value;
			if (originalEscaped || valueEscaped !== value) this.raws[name] = (originalEscaped || originalValue) + valueEscaped;
			else delete this.raws[name];
		};
		/**
		* Some non-standard syntax doesn't follow normal escaping rules for css.
		* This allows the escaped value to be specified directly, allowing illegal
		* characters to be directly inserted into css output.
		* @param {string} name the property to set
		* @param {any} value the unescaped value of the property
		* @param {string} valueEscaped the escaped value of the property.
		*/
		Node.prototype.setPropertyAndEscape = function(name, value, valueEscaped) {
			if (!this.raws) this.raws = {};
			this[name] = value;
			this.raws[name] = valueEscaped;
		};
		/**
		* When you want a value to passed through to CSS directly. This method
		* deletes the corresponding raw value causing the stringifier to fallback
		* to the unescaped value.
		* @param {string} name the property to set.
		* @param {any} value The value that is both escaped and unescaped.
		*/
		Node.prototype.setPropertyWithoutEscape = function(name, value) {
			this[name] = value;
			if (this.raws) delete this.raws[name];
		};
		/**
		*
		* @param {number} line The number (starting with 1)
		* @param {number} column The column number (starting with 1)
		*/
		Node.prototype.isAtPosition = function(line, column) {
			if (this.source && this.source.start && this.source.end) {
				if (this.source.start.line > line) return false;
				if (this.source.end.line < line) return false;
				if (this.source.start.line === line && this.source.start.column > column) return false;
				if (this.source.end.line === line && this.source.end.column < column) return false;
				return true;
			}
		};
		Node.prototype.stringifyProperty = function(name) {
			return this.raws && this.raws[name] || this[name];
		};
		Object.defineProperty(Node.prototype, "rawSpaceBefore", {
			get: function() {
				var rawSpace = this.raws && this.raws.spaces && this.raws.spaces.before;
				if (rawSpace === void 0) rawSpace = this.spaces && this.spaces.before;
				return rawSpace || "";
			},
			set: function(raw) {
				(0, util_1.ensureObject)(this, "raws", "spaces");
				this.raws.spaces.before = raw;
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Node.prototype, "rawSpaceAfter", {
			get: function() {
				var rawSpace = this.raws && this.raws.spaces && this.raws.spaces.after;
				if (rawSpace === void 0) rawSpace = this.spaces.after;
				return rawSpace || "";
			},
			set: function(raw) {
				(0, util_1.ensureObject)(this, "raws", "spaces");
				this.raws.spaces.after = raw;
			},
			enumerable: false,
			configurable: true
		});
		Node.prototype.valueToString = function() {
			return String(this.stringifyProperty("value"));
		};
		Node.prototype.toString = function() {
			return [
				this.rawSpaceBefore,
				this.valueToString(),
				this.rawSpaceAfter
			].join("");
		};
		Node.prototype._stringify = function() {
			return this.toString();
		};
		return Node;
	}();
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UNIVERSAL = exports.ATTRIBUTE = exports.CLASS = exports.COMBINATOR = exports.COMMENT = exports.ID = exports.NESTING = exports.PSEUDO = exports.ROOT = exports.SELECTOR = exports.STRING = exports.TAG = void 0;
	exports.TAG = "tag";
	exports.STRING = "string";
	exports.SELECTOR = "selector";
	exports.ROOT = "root";
	exports.PSEUDO = "pseudo";
	exports.NESTING = "nesting";
	exports.ID = "id";
	exports.COMMENT = "comment";
	exports.COMBINATOR = "combinator";
	exports.CLASS = "class";
	exports.ATTRIBUTE = "attribute";
	exports.UNIVERSAL = "universal";
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/container.js
var require_container = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __values = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var __read = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
		if (pack || arguments.length === 2) {
			for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
				if (!ar) ar = Array.prototype.slice.call(from, 0, i);
				ar[i] = from[i];
			}
		}
		return to.concat(ar || Array.prototype.slice.call(from));
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	var node_1 = __importDefault(require_node$1());
	var types = __importStar(require_types());
	exports.default = function(_super) {
		__extends(Container, _super);
		function Container(opts) {
			var _this = _super.call(this, opts) || this;
			if (!_this.nodes) _this.nodes = [];
			return _this;
		}
		Container.prototype.append = function(selector) {
			selector.parent = this;
			this.nodes.push(selector);
			return this;
		};
		Container.prototype.prepend = function(selector) {
			selector.parent = this;
			this.nodes.unshift(selector);
			for (var id in this.indexes) this.indexes[id]++;
			return this;
		};
		Container.prototype.at = function(index) {
			return this.nodes[index];
		};
		Container.prototype.index = function(child) {
			if (typeof child === "number") return child;
			return this.nodes.indexOf(child);
		};
		Object.defineProperty(Container.prototype, "first", {
			get: function() {
				return this.at(0);
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Container.prototype, "last", {
			get: function() {
				return this.at(this.length - 1);
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Container.prototype, "length", {
			get: function() {
				return this.nodes.length;
			},
			enumerable: false,
			configurable: true
		});
		Container.prototype.removeChild = function(child) {
			child = this.index(child);
			this.at(child).parent = void 0;
			this.nodes.splice(child, 1);
			var index;
			for (var id in this.indexes) {
				index = this.indexes[id];
				if (index >= child) this.indexes[id] = index - 1;
			}
			return this;
		};
		Container.prototype.removeAll = function() {
			var e_1, _a;
			try {
				for (var _b = __values(this.nodes), _c = _b.next(); !_c.done; _c = _b.next()) {
					var node = _c.value;
					node.parent = void 0;
				}
			} catch (e_1_1) {
				e_1 = { error: e_1_1 };
			} finally {
				try {
					if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
				} finally {
					if (e_1) throw e_1.error;
				}
			}
			this.nodes = [];
			return this;
		};
		Container.prototype.empty = function() {
			return this.removeAll();
		};
		Container.prototype.insertAfter = function(oldNode, newNode) {
			var _a;
			newNode.parent = this;
			var oldIndex = this.index(oldNode);
			var resetNode = [];
			for (var i = 2; i < arguments.length; i++) resetNode.push(arguments[i]);
			(_a = this.nodes).splice.apply(_a, __spreadArray([
				oldIndex + 1,
				0,
				newNode
			], __read(resetNode), false));
			newNode.parent = this;
			var index;
			for (var id in this.indexes) {
				index = this.indexes[id];
				if (oldIndex < index) this.indexes[id] = index + arguments.length - 1;
			}
			return this;
		};
		Container.prototype.insertBefore = function(oldNode, newNode) {
			var _a;
			newNode.parent = this;
			var oldIndex = this.index(oldNode);
			var resetNode = [];
			for (var i = 2; i < arguments.length; i++) resetNode.push(arguments[i]);
			(_a = this.nodes).splice.apply(_a, __spreadArray([
				oldIndex,
				0,
				newNode
			], __read(resetNode), false));
			newNode.parent = this;
			var index;
			for (var id in this.indexes) {
				index = this.indexes[id];
				if (index >= oldIndex) this.indexes[id] = index + arguments.length - 1;
			}
			return this;
		};
		Container.prototype._findChildAtPosition = function(line, col) {
			var found = void 0;
			this.each(function(node) {
				if (node.atPosition) {
					var foundChild = node.atPosition(line, col);
					if (foundChild) {
						found = foundChild;
						return false;
					}
				} else if (node.isAtPosition(line, col)) {
					found = node;
					return false;
				}
			});
			return found;
		};
		/**
		* Return the most specific node at the line and column number given.
		* The source location is based on the original parsed location, locations aren't
		* updated as selector nodes are mutated.
		*
		* Note that this location is relative to the location of the first character
		* of the selector, and not the location of the selector in the overall document
		* when used in conjunction with postcss.
		*
		* If not found, returns undefined.
		* @param {number} line The line number of the node to find. (1-based index)
		* @param {number} col  The column number of the node to find. (1-based index)
		*/
		Container.prototype.atPosition = function(line, col) {
			if (this.isAtPosition(line, col)) return this._findChildAtPosition(line, col) || this;
			else return;
		};
		Container.prototype._inferEndPosition = function() {
			if (this.last && this.last.source && this.last.source.end) {
				this.source = this.source || {};
				this.source.end = this.source.end || {};
				Object.assign(this.source.end, this.last.source.end);
			}
		};
		Container.prototype.each = function(callback) {
			if (!this.lastEach) this.lastEach = 0;
			if (!this.indexes) this.indexes = {};
			this.lastEach++;
			var id = this.lastEach;
			this.indexes[id] = 0;
			if (!this.length) return;
			var index, result;
			while (this.indexes[id] < this.length) {
				index = this.indexes[id];
				result = callback(this.at(index), index);
				if (result === false) break;
				this.indexes[id] += 1;
			}
			delete this.indexes[id];
			if (result === false) return false;
		};
		Container.prototype.walk = function(callback, depth) {
			if (depth === void 0) depth = 0;
			if (depth > util_1.MAX_NESTING_DEPTH) throw new Error("Cannot walk selector: nesting depth exceeds the maximum of ".concat(util_1.MAX_NESTING_DEPTH, "."));
			return this.each(function(node, i) {
				var result = callback(node, i);
				if (result !== false && node.length) result = node.walk(callback, depth + 1);
				if (result === false) return false;
			});
		};
		Container.prototype.walkAttributes = function(callback) {
			var _this = this;
			return this.walk(function(selector) {
				if (selector.type === types.ATTRIBUTE) return callback.call(_this, selector);
			});
		};
		Container.prototype.walkClasses = function(callback) {
			var _this = this;
			return this.walk(function(selector) {
				if (selector.type === types.CLASS) return callback.call(_this, selector);
			});
		};
		Container.prototype.walkCombinators = function(callback) {
			var _this = this;
			return this.walk(function(selector) {
				if (selector.type === types.COMBINATOR) return callback.call(_this, selector);
			});
		};
		Container.prototype.walkComments = function(callback) {
			var _this = this;
			return this.walk(function(selector) {
				if (selector.type === types.COMMENT) return callback.call(_this, selector);
			});
		};
		Container.prototype.walkIds = function(callback) {
			var _this = this;
			return this.walk(function(selector) {
				if (selector.type === types.ID) return callback.call(_this, selector);
			});
		};
		Container.prototype.walkNesting = function(callback) {
			var _this = this;
			return this.walk(function(selector) {
				if (selector.type === types.NESTING) return callback.call(_this, selector);
			});
		};
		Container.prototype.walkPseudos = function(callback) {
			var _this = this;
			return this.walk(function(selector) {
				if (selector.type === types.PSEUDO) return callback.call(_this, selector);
			});
		};
		Container.prototype.walkTags = function(callback) {
			var _this = this;
			return this.walk(function(selector) {
				if (selector.type === types.TAG) return callback.call(_this, selector);
			});
		};
		Container.prototype.walkUniversals = function(callback) {
			var _this = this;
			return this.walk(function(selector) {
				if (selector.type === types.UNIVERSAL) return callback.call(_this, selector);
			});
		};
		Container.prototype.split = function(callback) {
			var _this = this;
			var current = [];
			return this.reduce(function(memo, node, index) {
				var split = callback.call(_this, node);
				current.push(node);
				if (split) {
					memo.push(current);
					current = [];
				} else if (index === _this.length - 1) memo.push(current);
				return memo;
			}, []);
		};
		Container.prototype.map = function(callback) {
			return this.nodes.map(callback);
		};
		Container.prototype.reduce = function(callback, memo) {
			return this.nodes.reduce(callback, memo);
		};
		Container.prototype.every = function(callback) {
			return this.nodes.every(callback);
		};
		Container.prototype.some = function(callback) {
			return this.nodes.some(callback);
		};
		Container.prototype.filter = function(callback) {
			return this.nodes.filter(callback);
		};
		Container.prototype.sort = function(callback) {
			return this.nodes.sort(callback);
		};
		Container.prototype.toString = function(options) {
			if (options === void 0) options = {};
			return this._stringify(options, 0, (0, util_1.resolveMaxNestingDepth)(options.maxNestingDepth));
		};
		Container.prototype._stringify = function(options, depth, max) {
			var _this = this;
			return this.map(function(child) {
				return _this._stringifyChild(child, options, depth, max);
			}).join("");
		};
		Container.prototype._stringifyChild = function(child, options, depth, max) {
			return typeof child._stringify === "function" ? child._stringify(options, depth, max) : String(child);
		};
		return Container;
	}(node_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/root.js
var require_root = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var container_1 = __importDefault(require_container());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(Root, _super);
		function Root(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.ROOT;
			return _this;
		}
		Root.prototype._stringify = function(options, depth, max) {
			var _this = this;
			var str = this.reduce(function(memo, selector) {
				memo.push(_this._stringifyChild(selector, options, depth, max));
				return memo;
			}, []).join(",");
			return this.trailingComma ? str + "," : str;
		};
		Root.prototype.error = function(message, options) {
			if (this._error) return this._error(message, options);
			else return new Error(message);
		};
		Object.defineProperty(Root.prototype, "errorGenerator", {
			set: function(handler) {
				this._error = handler;
			},
			enumerable: false,
			configurable: true
		});
		return Root;
	}(container_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/selector.js
var require_selector = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var container_1 = __importDefault(require_container());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(Selector, _super);
		function Selector(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.SELECTOR;
			return _this;
		}
		return Selector;
	}(container_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/cssesc@3.0.0/node_modules/cssesc/cssesc.js
/*! https://mths.be/cssesc v3.0.0 by @mathias */
var require_cssesc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasOwnProperty = {}.hasOwnProperty;
	var merge = function merge(options, defaults) {
		if (!options) return defaults;
		var result = {};
		for (var key in defaults) result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
		return result;
	};
	var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
	var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
	var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
	var cssesc = function cssesc(string, options) {
		options = merge(options, cssesc.options);
		if (options.quotes != "single" && options.quotes != "double") options.quotes = "single";
		var quote = options.quotes == "double" ? "\"" : "'";
		var isIdentifier = options.isIdentifier;
		var firstChar = string.charAt(0);
		var output = "";
		var counter = 0;
		var length = string.length;
		while (counter < length) {
			var character = string.charAt(counter++);
			var codePoint = character.charCodeAt();
			var value = void 0;
			if (codePoint < 32 || codePoint > 126) {
				if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
					var extra = string.charCodeAt(counter++);
					if ((extra & 64512) == 56320) codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
					else counter--;
				}
				value = "\\" + codePoint.toString(16).toUpperCase() + " ";
			} else if (options.escapeEverything) if (regexAnySingleEscape.test(character)) value = "\\" + character;
			else value = "\\" + codePoint.toString(16).toUpperCase() + " ";
			else if (/[\t\n\f\r\x0B]/.test(character)) value = "\\" + codePoint.toString(16).toUpperCase() + " ";
			else if (character == "\\" || !isIdentifier && (character == "\"" && quote == character || character == "'" && quote == character) || isIdentifier && regexSingleEscape.test(character)) value = "\\" + character;
			else value = character;
			output += value;
		}
		if (isIdentifier) {
			if (/^-[-\d]/.test(output)) output = "\\-" + output.slice(1);
			else if (/\d/.test(firstChar)) output = "\\3" + firstChar + " " + output.slice(1);
		}
		output = output.replace(regexExcessiveSpaces, function($0, $1, $2) {
			if ($1 && $1.length % 2) return $0;
			return ($1 || "") + $2;
		});
		if (!isIdentifier && options.wrap) return quote + output + quote;
		return output;
	};
	cssesc.options = {
		"escapeEverything": false,
		"isIdentifier": false,
		"quotes": "single",
		"wrap": false
	};
	cssesc.version = "3.0.0";
	module.exports = cssesc;
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/className.js
var require_className = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var cssesc_1 = __importDefault(require_cssesc());
	var util_1 = require_util();
	var node_1 = __importDefault(require_node$1());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(ClassName, _super);
		function ClassName(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.CLASS;
			_this._constructed = true;
			return _this;
		}
		Object.defineProperty(ClassName.prototype, "value", {
			get: function() {
				return this._value;
			},
			set: function(v) {
				if (this._constructed) {
					var escaped = (0, cssesc_1.default)(v, { isIdentifier: true });
					if (escaped !== v) {
						(0, util_1.ensureObject)(this, "raws");
						this.raws.value = escaped;
					} else if (this.raws) delete this.raws.value;
				}
				this._value = v;
			},
			enumerable: false,
			configurable: true
		});
		ClassName.prototype.valueToString = function() {
			return "." + _super.prototype.valueToString.call(this);
		};
		return ClassName;
	}(node_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/comment.js
var require_comment = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var node_1 = __importDefault(require_node$1());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(Comment, _super);
		function Comment(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.COMMENT;
			return _this;
		}
		return Comment;
	}(node_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/id.js
var require_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var node_1 = __importDefault(require_node$1());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(ID, _super);
		function ID(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.ID;
			return _this;
		}
		ID.prototype.valueToString = function() {
			return "#" + _super.prototype.valueToString.call(this);
		};
		return ID;
	}(node_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/namespace.js
var require_namespace = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var cssesc_1 = __importDefault(require_cssesc());
	var util_1 = require_util();
	exports.default = function(_super) {
		__extends(Namespace, _super);
		function Namespace() {
			return _super !== null && _super.apply(this, arguments) || this;
		}
		Object.defineProperty(Namespace.prototype, "namespace", {
			get: function() {
				return this._namespace;
			},
			set: function(namespace) {
				if (namespace === true || namespace === "*" || namespace === "&") {
					this._namespace = namespace;
					if (this.raws) delete this.raws.namespace;
					return;
				}
				var escaped = (0, cssesc_1.default)(namespace, { isIdentifier: true });
				this._namespace = namespace;
				if (escaped !== namespace) {
					(0, util_1.ensureObject)(this, "raws");
					this.raws.namespace = escaped;
				} else if (this.raws) delete this.raws.namespace;
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Namespace.prototype, "ns", {
			get: function() {
				return this._namespace;
			},
			set: function(namespace) {
				this.namespace = namespace;
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Namespace.prototype, "namespaceString", {
			get: function() {
				if (this.namespace) {
					var ns = this.stringifyProperty("namespace");
					if (ns === true) return "";
					else return ns;
				} else return "";
			},
			enumerable: false,
			configurable: true
		});
		Namespace.prototype.qualifiedName = function(value) {
			if (this.namespace) return "".concat(this.namespaceString, "|").concat(value);
			else return value;
		};
		Namespace.prototype.valueToString = function() {
			return this.qualifiedName(_super.prototype.valueToString.call(this));
		};
		return Namespace;
	}(__importDefault(require_node$1()).default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/tag.js
var require_tag = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var namespace_1 = __importDefault(require_namespace());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(Tag, _super);
		function Tag(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.TAG;
			return _this;
		}
		return Tag;
	}(namespace_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/string.js
var require_string = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var node_1 = __importDefault(require_node$1());
	var types_1 = require_types();
	var String = function(_super) {
		__extends(String, _super);
		function String(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.STRING;
			return _this;
		}
		return String;
	}(node_1.default);
	exports.default = String;
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/pseudo.js
var require_pseudo = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var container_1 = __importDefault(require_container());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(Pseudo, _super);
		function Pseudo(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.PSEUDO;
			return _this;
		}
		Pseudo.prototype._stringify = function(options, depth, max) {
			var _this = this;
			if (depth >= max) throw new Error("Cannot serialize selector: nesting depth exceeds the maximum of ".concat(max, "."));
			var params = this.length ? "(" + this.map(function(child) {
				return _this._stringifyChild(child, options, depth + 1, max);
			}).join(",") + ")" : "";
			return [
				this.rawSpaceBefore,
				this.stringifyProperty("value"),
				params,
				this.rawSpaceAfter
			].join("");
		};
		return Pseudo;
	}(container_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/util-deprecate@1.0.2/node_modules/util-deprecate/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* For Node.js, simply re-export the core `util.deprecate` function.
	*/
	module.exports = __require("util").deprecate;
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/attribute.js
var require_attribute = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	var _a;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.unescapeValue = unescapeValue;
	var cssesc_1 = __importDefault(require_cssesc());
	var unesc_1 = __importDefault(require_unesc());
	var namespace_1 = __importDefault(require_namespace());
	var types_1 = require_types();
	var deprecate = require_node();
	var WRAPPED_IN_QUOTES = /^('|")([^]*)\1$/;
	var warnOfDeprecatedValueAssignment = deprecate(function() {}, "Assigning an attribute a value containing characters that might need to be escaped is deprecated. Call attribute.setValue() instead.");
	var warnOfDeprecatedQuotedAssignment = deprecate(function() {}, "Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead.");
	var warnOfDeprecatedConstructor = deprecate(function() {}, "Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.");
	function unescapeValue(value) {
		var deprecatedUsage = false;
		var quoteMark = null;
		var unescaped = value;
		var m = unescaped.match(WRAPPED_IN_QUOTES);
		if (m) {
			quoteMark = m[1];
			unescaped = m[2];
		}
		unescaped = (0, unesc_1.default)(unescaped);
		if (unescaped !== value) deprecatedUsage = true;
		return {
			deprecatedUsage,
			unescaped,
			quoteMark
		};
	}
	function handleDeprecatedContructorOpts(opts) {
		if (opts.quoteMark !== void 0) return opts;
		if (opts.value === void 0) return opts;
		warnOfDeprecatedConstructor();
		var _a = unescapeValue(opts.value), quoteMark = _a.quoteMark, unescaped = _a.unescaped;
		if (!opts.raws) opts.raws = {};
		if (opts.raws.value === void 0) opts.raws.value = opts.value;
		opts.value = unescaped;
		opts.quoteMark = quoteMark;
		return opts;
	}
	exports.default = function(_super) {
		__extends(Attribute, _super);
		function Attribute(opts) {
			if (opts === void 0) opts = {};
			var _this = _super.call(this, handleDeprecatedContructorOpts(opts)) || this;
			_this.type = types_1.ATTRIBUTE;
			_this.raws = _this.raws || {};
			Object.defineProperty(_this.raws, "unquoted", {
				get: deprecate(function() {
					return _this.value;
				}, "attr.raws.unquoted is deprecated. Call attr.value instead."),
				set: deprecate(function() {
					return _this.value;
				}, "Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now.")
			});
			_this._constructed = true;
			return _this;
		}
		/**
		* Returns the Attribute's value quoted such that it would be legal to use
		* in the value of a css file. The original value's quotation setting
		* used for stringification is left unchanged. See `setValue(value, options)`
		* if you want to control the quote settings of a new value for the attribute.
		*
		* You can also change the quotation used for the current value by setting quoteMark.
		*
		* Options:
		*   * quoteMark {'"' | "'" | null} - Use this value to quote the value. If this
		*     option is not set, the original value for quoteMark will be used. If
		*     indeterminate, a double quote is used. The legal values are:
		*     * `null` - the value will be unquoted and characters will be escaped as necessary.
		*     * `'` - the value will be quoted with a single quote and single quotes are escaped.
		*     * `"` - the value will be quoted with a double quote and double quotes are escaped.
		*   * preferCurrentQuoteMark {boolean} - if true, prefer the source quote mark
		*     over the quoteMark option value.
		*   * smart {boolean} - if true, will select a quote mark based on the value
		*     and the other options specified here. See the `smartQuoteMark()`
		*     method.
		**/
		Attribute.prototype.getQuotedValue = function(options) {
			if (options === void 0) options = {};
			var cssescopts = CSSESC_QUOTE_OPTIONS[this._determineQuoteMark(options)];
			return (0, cssesc_1.default)(this._value, cssescopts);
		};
		Attribute.prototype._determineQuoteMark = function(options) {
			return options.smart ? this.smartQuoteMark(options) : this.preferredQuoteMark(options);
		};
		/**
		* Set the unescaped value with the specified quotation options. The value
		* provided must not include any wrapping quote marks -- those quotes will
		* be interpreted as part of the value and escaped accordingly.
		*/
		Attribute.prototype.setValue = function(value, options) {
			if (options === void 0) options = {};
			this._value = value;
			this._quoteMark = this._determineQuoteMark(options);
			this._syncRawValue();
		};
		/**
		* Intelligently select a quoteMark value based on the value's contents. If
		* the value is a legal CSS ident, it will not be quoted. Otherwise a quote
		* mark will be picked that minimizes the number of escapes.
		*
		* If there's no clear winner, the quote mark from these options is used,
		* then the source quote mark (this is inverted if `preferCurrentQuoteMark` is
		* true). If the quoteMark is unspecified, a double quote is used.
		*
		* @param options This takes the quoteMark and preferCurrentQuoteMark options
		* from the quoteValue method.
		*/
		Attribute.prototype.smartQuoteMark = function(options) {
			var v = this.value;
			var numSingleQuotes = v.replace(/[^']/g, "").length;
			var numDoubleQuotes = v.replace(/[^"]/g, "").length;
			if (numSingleQuotes + numDoubleQuotes === 0) {
				var escaped = (0, cssesc_1.default)(v, { isIdentifier: true });
				if (escaped === v) return Attribute.NO_QUOTE;
				else {
					var pref = this.preferredQuoteMark(options);
					if (pref === Attribute.NO_QUOTE) {
						var quote = this.quoteMark || options.quoteMark || Attribute.DOUBLE_QUOTE;
						var opts = CSSESC_QUOTE_OPTIONS[quote];
						if ((0, cssesc_1.default)(v, opts).length < escaped.length) return quote;
					}
					return pref;
				}
			} else if (numDoubleQuotes === numSingleQuotes) return this.preferredQuoteMark(options);
			else if (numDoubleQuotes < numSingleQuotes) return Attribute.DOUBLE_QUOTE;
			else return Attribute.SINGLE_QUOTE;
		};
		/**
		* Selects the preferred quote mark based on the options and the current quote mark value.
		* If you want the quote mark to depend on the attribute value, call `smartQuoteMark(opts)`
		* instead.
		*/
		Attribute.prototype.preferredQuoteMark = function(options) {
			var quoteMark = options.preferCurrentQuoteMark ? this.quoteMark : options.quoteMark;
			if (quoteMark === void 0) quoteMark = options.preferCurrentQuoteMark ? options.quoteMark : this.quoteMark;
			if (quoteMark === void 0) quoteMark = Attribute.DOUBLE_QUOTE;
			return quoteMark;
		};
		Object.defineProperty(Attribute.prototype, "quoted", {
			get: function() {
				var qm = this.quoteMark;
				return qm === "'" || qm === "\"";
			},
			set: function(value) {
				warnOfDeprecatedQuotedAssignment();
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Attribute.prototype, "quoteMark", {
			/**
			* returns a single (`'`) or double (`"`) quote character if the value is quoted.
			* returns `null` if the value is not quoted.
			* returns `undefined` if the quotation state is unknown (this can happen when
			* the attribute is constructed without specifying a quote mark.)
			*/
			get: function() {
				return this._quoteMark;
			},
			/**
			* Set the quote mark to be used by this attribute's value.
			* If the quote mark changes, the raw (escaped) value at `attr.raws.value` of the attribute
			* value is updated accordingly.
			*
			* @param {"'" | '"' | null} quoteMark The quote mark or `null` if the value should be unquoted.
			*/
			set: function(quoteMark) {
				if (!this._constructed) {
					this._quoteMark = quoteMark;
					return;
				}
				if (this._quoteMark !== quoteMark) {
					this._quoteMark = quoteMark;
					this._syncRawValue();
				}
			},
			enumerable: false,
			configurable: true
		});
		Attribute.prototype._syncRawValue = function() {
			var rawValue = (0, cssesc_1.default)(this._value, CSSESC_QUOTE_OPTIONS[this.quoteMark]);
			if (rawValue === this._value) {
				if (this.raws) delete this.raws.value;
			} else this.raws.value = rawValue;
		};
		Object.defineProperty(Attribute.prototype, "qualifiedAttribute", {
			get: function() {
				return this.qualifiedName(this.raws.attribute || this.attribute);
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Attribute.prototype, "insensitiveFlag", {
			get: function() {
				return this.insensitive ? "i" : "";
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Attribute.prototype, "value", {
			get: function() {
				return this._value;
			},
			/**
			* Before 3.0, the value had to be set to an escaped value including any wrapped
			* quote marks. In 3.0, the semantics of `Attribute.value` changed so that the value
			* is unescaped during parsing and any quote marks are removed.
			*
			* Because the ambiguity of this semantic change, if you set `attr.value = newValue`,
			* a deprecation warning is raised when the new value contains any characters that would
			* require escaping (including if it contains wrapped quotes).
			*
			* Instead, you should call `attr.setValue(newValue, opts)` and pass options that describe
			* how the new value is quoted.
			*/
			set: function(v) {
				if (this._constructed) {
					var _a = unescapeValue(v), deprecatedUsage = _a.deprecatedUsage, unescaped = _a.unescaped, quoteMark = _a.quoteMark;
					if (deprecatedUsage) warnOfDeprecatedValueAssignment();
					if (unescaped === this._value && quoteMark === this._quoteMark) return;
					this._value = unescaped;
					this._quoteMark = quoteMark;
					this._syncRawValue();
				} else this._value = v;
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Attribute.prototype, "insensitive", {
			get: function() {
				return this._insensitive;
			},
			/**
			* Set the case insensitive flag.
			* If the case insensitive flag changes, the raw (escaped) value at `attr.raws.insensitiveFlag`
			* of the attribute is updated accordingly.
			*
			* @param {true | false} insensitive true if the attribute should match case-insensitively.
			*/
			set: function(insensitive) {
				if (!insensitive) {
					this._insensitive = false;
					if (this.raws && (this.raws.insensitiveFlag === "I" || this.raws.insensitiveFlag === "i")) this.raws.insensitiveFlag = void 0;
				}
				this._insensitive = insensitive;
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Attribute.prototype, "attribute", {
			get: function() {
				return this._attribute;
			},
			set: function(name) {
				this._handleEscapes("attribute", name);
				this._attribute = name;
			},
			enumerable: false,
			configurable: true
		});
		Attribute.prototype._handleEscapes = function(prop, value) {
			if (this._constructed) {
				var escaped = (0, cssesc_1.default)(value, { isIdentifier: true });
				if (escaped !== value) this.raws[prop] = escaped;
				else delete this.raws[prop];
			}
		};
		Attribute.prototype._spacesFor = function(name) {
			var attrSpaces = {
				before: "",
				after: ""
			};
			var spaces = this.spaces[name] || {};
			var rawSpaces = this.raws.spaces && this.raws.spaces[name] || {};
			return Object.assign(attrSpaces, spaces, rawSpaces);
		};
		Attribute.prototype._stringFor = function(name, spaceName, concat) {
			if (spaceName === void 0) spaceName = name;
			if (concat === void 0) concat = defaultAttrConcat;
			var attrSpaces = this._spacesFor(spaceName);
			return concat(this.stringifyProperty(name), attrSpaces);
		};
		/**
		* returns the offset of the attribute part specified relative to the
		* start of the node of the output string.
		*
		* * "ns" - alias for "namespace"
		* * "namespace" - the namespace if it exists.
		* * "attribute" - the attribute name
		* * "attributeNS" - the start of the attribute or its namespace
		* * "operator" - the match operator of the attribute
		* * "value" - The value (string or identifier)
		* * "insensitive" - the case insensitivity flag;
		* @param part One of the possible values inside an attribute.
		* @returns -1 if the name is invalid or the value doesn't exist in this attribute.
		*/
		Attribute.prototype.offsetOf = function(name) {
			var count = 1;
			var attributeSpaces = this._spacesFor("attribute");
			count += attributeSpaces.before.length;
			if (name === "namespace" || name === "ns") return this.namespace ? count : -1;
			if (name === "attributeNS") return count;
			count += this.namespaceString.length;
			if (this.namespace) count += 1;
			if (name === "attribute") return count;
			count += this.stringifyProperty("attribute").length;
			count += attributeSpaces.after.length;
			var operatorSpaces = this._spacesFor("operator");
			count += operatorSpaces.before.length;
			var operator = this.stringifyProperty("operator");
			if (name === "operator") return operator ? count : -1;
			count += operator.length;
			count += operatorSpaces.after.length;
			var valueSpaces = this._spacesFor("value");
			count += valueSpaces.before.length;
			var value = this.stringifyProperty("value");
			if (name === "value") return value ? count : -1;
			count += value.length;
			count += valueSpaces.after.length;
			var insensitiveSpaces = this._spacesFor("insensitive");
			count += insensitiveSpaces.before.length;
			if (name === "insensitive") return this.insensitive ? count : -1;
			return -1;
		};
		Attribute.prototype.toString = function() {
			var _this = this;
			var selector = [this.rawSpaceBefore, "["];
			selector.push(this._stringFor("qualifiedAttribute", "attribute"));
			if (this.operator && (this.value || this.value === "")) {
				selector.push(this._stringFor("operator"));
				selector.push(this._stringFor("value"));
				selector.push(this._stringFor("insensitiveFlag", "insensitive", function(attrValue, attrSpaces) {
					if (attrValue.length > 0 && !_this.quoted && attrSpaces.before.length === 0 && !(_this.spaces.value && _this.spaces.value.after)) attrSpaces.before = " ";
					return defaultAttrConcat(attrValue, attrSpaces);
				}));
			}
			selector.push("]");
			selector.push(this.rawSpaceAfter);
			return selector.join("");
		};
		Attribute.NO_QUOTE = null;
		Attribute.SINGLE_QUOTE = "'";
		Attribute.DOUBLE_QUOTE = "\"";
		return Attribute;
	}(namespace_1.default);
	var CSSESC_QUOTE_OPTIONS = (_a = {
		"'": {
			quotes: "single",
			wrap: true
		},
		"\"": {
			quotes: "double",
			wrap: true
		}
	}, _a[null] = { isIdentifier: true }, _a);
	function defaultAttrConcat(attrValue, attrSpaces) {
		return "".concat(attrSpaces.before).concat(attrValue).concat(attrSpaces.after);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/universal.js
var require_universal = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var namespace_1 = __importDefault(require_namespace());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(Universal, _super);
		function Universal(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.UNIVERSAL;
			_this.value = "*";
			return _this;
		}
		return Universal;
	}(namespace_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/combinator.js
var require_combinator = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var node_1 = __importDefault(require_node$1());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(Combinator, _super);
		function Combinator(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.COMBINATOR;
			return _this;
		}
		return Combinator;
	}(node_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/nesting.js
var require_nesting = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
				d.__proto__ = b;
			} || function(d, b) {
				for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var node_1 = __importDefault(require_node$1());
	var types_1 = require_types();
	exports.default = function(_super) {
		__extends(Nesting, _super);
		function Nesting(opts) {
			var _this = _super.call(this, opts) || this;
			_this.type = types_1.NESTING;
			_this.value = "&";
			return _this;
		}
		return Nesting;
	}(node_1.default);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/sortAscending.js
var require_sortAscending = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = sortAscending;
	function sortAscending(list) {
		return list.sort(function(a, b) {
			return a - b;
		});
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/tokenTypes.js
var require_tokenTypes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.combinator = exports.word = exports.comment = exports.str = exports.tab = exports.newline = exports.feed = exports.cr = exports.backslash = exports.bang = exports.slash = exports.doubleQuote = exports.singleQuote = exports.space = exports.greaterThan = exports.pipe = exports.equals = exports.plus = exports.caret = exports.tilde = exports.dollar = exports.closeSquare = exports.openSquare = exports.closeParenthesis = exports.openParenthesis = exports.semicolon = exports.colon = exports.comma = exports.at = exports.asterisk = exports.ampersand = void 0;
	exports.ampersand = 38;
	exports.asterisk = 42;
	exports.at = 64;
	exports.comma = 44;
	exports.colon = 58;
	exports.semicolon = 59;
	exports.openParenthesis = 40;
	exports.closeParenthesis = 41;
	exports.openSquare = 91;
	exports.closeSquare = 93;
	exports.dollar = 36;
	exports.tilde = 126;
	exports.caret = 94;
	exports.plus = 43;
	exports.equals = 61;
	exports.pipe = 124;
	exports.greaterThan = 62;
	exports.space = 32;
	exports.singleQuote = 39;
	exports.doubleQuote = 34;
	exports.slash = 47;
	exports.bang = 33;
	exports.backslash = 92;
	exports.cr = 13;
	exports.feed = 12;
	exports.newline = 10;
	exports.tab = 9;
	exports.str = exports.singleQuote;
	exports.comment = -1;
	exports.word = -2;
	exports.combinator = -3;
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/tokenize.js
var require_tokenize = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var _a;
	var _b;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FIELDS = void 0;
	exports.default = tokenize;
	var t = __importStar(require_tokenTypes());
	var unescapable = (_a = {}, _a[t.tab] = true, _a[t.newline] = true, _a[t.cr] = true, _a[t.feed] = true, _a);
	var wordDelimiters = (_b = {}, _b[t.space] = true, _b[t.tab] = true, _b[t.newline] = true, _b[t.cr] = true, _b[t.feed] = true, _b[t.ampersand] = true, _b[t.asterisk] = true, _b[t.bang] = true, _b[t.comma] = true, _b[t.colon] = true, _b[t.semicolon] = true, _b[t.openParenthesis] = true, _b[t.closeParenthesis] = true, _b[t.openSquare] = true, _b[t.closeSquare] = true, _b[t.singleQuote] = true, _b[t.doubleQuote] = true, _b[t.plus] = true, _b[t.pipe] = true, _b[t.tilde] = true, _b[t.greaterThan] = true, _b[t.equals] = true, _b[t.dollar] = true, _b[t.caret] = true, _b[t.slash] = true, _b);
	var hex = {};
	var hexChars = "0123456789abcdefABCDEF";
	for (var i = 0; i < hexChars.length; i++) hex[hexChars.charCodeAt(i)] = true;
	/**
	*  Returns the last index of the bar css word
	* @param {string} css The string in which the word begins
	* @param {number} start The index into the string where word's first letter occurs
	*/
	function consumeWord(css, start) {
		var next = start;
		var code;
		do {
			code = css.charCodeAt(next);
			if (wordDelimiters[code]) return next - 1;
			else if (code === t.backslash) next = consumeEscape(css, next) + 1;
			else next++;
		} while (next < css.length);
		return next - 1;
	}
	/**
	*  Returns the last index of the escape sequence
	* @param {string} css The string in which the sequence begins
	* @param {number} start The index into the string where escape character (`\`) occurs.
	*/
	function consumeEscape(css, start) {
		var next = start;
		var code = css.charCodeAt(next + 1);
		if (unescapable[code]) {} else if (hex[code]) {
			var hexDigits = 0;
			do {
				next++;
				hexDigits++;
				code = css.charCodeAt(next + 1);
			} while (hex[code] && hexDigits < 6);
			if (hexDigits < 6 && code === t.space) next++;
		} else next++;
		return next;
	}
	exports.FIELDS = {
		TYPE: 0,
		START_LINE: 1,
		START_COL: 2,
		END_LINE: 3,
		END_COL: 4,
		START_POS: 5,
		END_POS: 6
	};
	function tokenize(input) {
		var tokens = [];
		var css = input.css.valueOf();
		var length = css.length;
		var offset = -1;
		var line = 1;
		var start = 0;
		var end = 0;
		var code, content, endColumn, endLine, escaped, escapePos, last, lines, next, nextLine, nextOffset, quote, tokenType;
		function unclosed(what, fix) {
			if (input.safe) {
				css += fix;
				next = css.length - 1;
			} else throw input.error("Unclosed " + what, line, start - offset, start);
		}
		while (start < length) {
			code = css.charCodeAt(start);
			if (code === t.newline) {
				offset = start;
				line += 1;
			}
			switch (code) {
				case t.space:
				case t.tab:
				case t.newline:
				case t.cr:
				case t.feed:
					next = start;
					do {
						next += 1;
						code = css.charCodeAt(next);
						if (code === t.newline) {
							offset = next;
							line += 1;
						}
					} while (code === t.space || code === t.newline || code === t.tab || code === t.cr || code === t.feed);
					tokenType = t.space;
					endLine = line;
					endColumn = next - offset - 1;
					end = next;
					break;
				case t.plus:
				case t.greaterThan:
				case t.tilde:
				case t.pipe:
					next = start;
					do {
						next += 1;
						code = css.charCodeAt(next);
					} while (code === t.plus || code === t.greaterThan || code === t.tilde || code === t.pipe);
					tokenType = t.combinator;
					endLine = line;
					endColumn = start - offset;
					end = next;
					break;
				case t.asterisk:
				case t.ampersand:
				case t.bang:
				case t.comma:
				case t.equals:
				case t.dollar:
				case t.caret:
				case t.openSquare:
				case t.closeSquare:
				case t.colon:
				case t.semicolon:
				case t.openParenthesis:
				case t.closeParenthesis:
					next = start;
					tokenType = code;
					endLine = line;
					endColumn = start - offset;
					end = next + 1;
					break;
				case t.singleQuote:
				case t.doubleQuote:
					quote = code === t.singleQuote ? "'" : "\"";
					next = start;
					do {
						escaped = false;
						next = css.indexOf(quote, next + 1);
						if (next === -1) unclosed("quote", quote);
						escapePos = next;
						while (css.charCodeAt(escapePos - 1) === t.backslash) {
							escapePos -= 1;
							escaped = !escaped;
						}
					} while (escaped);
					tokenType = t.str;
					endLine = line;
					endColumn = start - offset;
					end = next + 1;
					break;
				default:
					if (code === t.slash && css.charCodeAt(start + 1) === t.asterisk) {
						next = css.indexOf("*/", start + 2) + 1;
						if (next === 0) unclosed("comment", "*/");
						content = css.slice(start, next + 1);
						lines = content.split("\n");
						last = lines.length - 1;
						if (last > 0) {
							nextLine = line + last;
							nextOffset = next - lines[last].length;
						} else {
							nextLine = line;
							nextOffset = offset;
						}
						tokenType = t.comment;
						line = nextLine;
						endLine = nextLine;
						endColumn = next - nextOffset;
					} else if (code === t.slash) {
						next = start;
						tokenType = code;
						endLine = line;
						endColumn = start - offset;
						end = next + 1;
					} else {
						next = consumeWord(css, start);
						tokenType = t.word;
						endLine = line;
						endColumn = next - offset;
					}
					end = next + 1;
					break;
			}
			tokens.push([
				tokenType,
				line,
				start - offset,
				endLine,
				endColumn,
				start,
				end
			]);
			if (nextOffset) {
				offset = nextOffset;
				nextOffset = null;
			}
			start = end;
		}
		return tokens;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __assign = exports && exports.__assign || function() {
		__assign = Object.assign || function(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __read = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
		if (pack || arguments.length === 2) {
			for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
				if (!ar) ar = Array.prototype.slice.call(from, 0, i);
				ar[i] = from[i];
			}
		}
		return to.concat(ar || Array.prototype.slice.call(from));
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	var _a;
	var _b;
	Object.defineProperty(exports, "__esModule", { value: true });
	var root_1 = __importDefault(require_root());
	var selector_1 = __importDefault(require_selector());
	var className_1 = __importDefault(require_className());
	var comment_1 = __importDefault(require_comment());
	var id_1 = __importDefault(require_id());
	var tag_1 = __importDefault(require_tag());
	var string_1 = __importDefault(require_string());
	var pseudo_1 = __importDefault(require_pseudo());
	var attribute_1 = __importStar(require_attribute());
	var universal_1 = __importDefault(require_universal());
	var combinator_1 = __importDefault(require_combinator());
	var nesting_1 = __importDefault(require_nesting());
	var sortAscending_1 = __importDefault(require_sortAscending());
	var tokenize_1 = __importStar(require_tokenize());
	var tokens = __importStar(require_tokenTypes());
	var types = __importStar(require_types());
	var util_1 = require_util();
	var WHITESPACE_TOKENS = (_a = {}, _a[tokens.space] = true, _a[tokens.cr] = true, _a[tokens.feed] = true, _a[tokens.newline] = true, _a[tokens.tab] = true, _a);
	var WHITESPACE_EQUIV_TOKENS = __assign(__assign({}, WHITESPACE_TOKENS), (_b = {}, _b[tokens.comment] = true, _b));
	function tokenStart(token) {
		return {
			line: token[tokenize_1.FIELDS.START_LINE],
			column: token[tokenize_1.FIELDS.START_COL]
		};
	}
	function tokenEnd(token) {
		return {
			line: token[tokenize_1.FIELDS.END_LINE],
			column: token[tokenize_1.FIELDS.END_COL]
		};
	}
	function getSource(startLine, startColumn, endLine, endColumn) {
		return {
			start: {
				line: startLine,
				column: startColumn
			},
			end: {
				line: endLine,
				column: endColumn
			}
		};
	}
	function getTokenSource(token) {
		return getSource(token[tokenize_1.FIELDS.START_LINE], token[tokenize_1.FIELDS.START_COL], token[tokenize_1.FIELDS.END_LINE], token[tokenize_1.FIELDS.END_COL]);
	}
	function getTokenSourceSpan(startToken, endToken) {
		if (!startToken) return;
		return getSource(startToken[tokenize_1.FIELDS.START_LINE], startToken[tokenize_1.FIELDS.START_COL], endToken[tokenize_1.FIELDS.END_LINE], endToken[tokenize_1.FIELDS.END_COL]);
	}
	function unescapeProp(node, prop) {
		var value = node[prop];
		if (typeof value !== "string") return;
		if (value.indexOf("\\") !== -1) {
			(0, util_1.ensureObject)(node, "raws");
			node[prop] = (0, util_1.unesc)(value);
			if (node.raws[prop] === void 0) node.raws[prop] = value;
		}
		return node;
	}
	function indexesOf(array, item) {
		var i = -1;
		var indexes = [];
		while ((i = array.indexOf(item, i + 1)) !== -1) indexes.push(i);
		return indexes;
	}
	function uniqs() {
		var list = Array.prototype.concat.apply([], arguments);
		return list.filter(function(item, i) {
			return i === list.indexOf(item);
		});
	}
	exports.default = function() {
		function Parser(rule, options) {
			if (options === void 0) options = {};
			this.rule = rule;
			this.options = Object.assign({
				lossy: false,
				safe: false
			}, options);
			this.position = 0;
			this.nestingDepth = 0;
			this.maxNestingDepth = (0, util_1.resolveMaxNestingDepth)(this.options.maxNestingDepth);
			this.css = typeof this.rule === "string" ? this.rule : this.rule.selector;
			this.tokens = (0, tokenize_1.default)({
				css: this.css,
				error: this._errorGenerator(),
				safe: this.options.safe
			});
			var rootSource = getTokenSourceSpan(this.tokens[0], this.tokens[this.tokens.length - 1]);
			this.root = new root_1.default({ source: rootSource });
			this.root.errorGenerator = this._errorGenerator();
			var selector = new selector_1.default({
				source: { start: {
					line: 1,
					column: 1
				} },
				sourceIndex: 0
			});
			this.root.append(selector);
			this.current = selector;
			this.loop();
		}
		Parser.prototype._errorGenerator = function() {
			var _this = this;
			return function(message, errorOptions) {
				if (typeof _this.rule === "string") return new Error(message);
				return _this.rule.error(message, errorOptions);
			};
		};
		Parser.prototype.attribute = function() {
			var attr = [];
			var startingToken = this.currToken;
			this.position++;
			while (this.position < this.tokens.length && this.currToken[tokenize_1.FIELDS.TYPE] !== tokens.closeSquare) {
				attr.push(this.currToken);
				this.position++;
			}
			if (this.currToken[tokenize_1.FIELDS.TYPE] !== tokens.closeSquare) return this.expected("closing square bracket", this.currToken[tokenize_1.FIELDS.START_POS]);
			var len = attr.length;
			var node = {
				source: getSource(startingToken[1], startingToken[2], this.currToken[3], this.currToken[4]),
				sourceIndex: startingToken[tokenize_1.FIELDS.START_POS]
			};
			if (len === 1 && !~[tokens.word].indexOf(attr[0][tokenize_1.FIELDS.TYPE])) return this.expected("attribute", attr[0][tokenize_1.FIELDS.START_POS]);
			var pos = 0;
			var spaceBefore = "";
			var commentBefore = "";
			var lastAdded = null;
			var spaceAfterMeaningfulToken = false;
			while (pos < len) {
				var token = attr[pos];
				var content = this.content(token);
				var next = attr[pos + 1];
				switch (token[tokenize_1.FIELDS.TYPE]) {
					case tokens.space:
						spaceAfterMeaningfulToken = true;
						if (this.options.lossy) break;
						if (lastAdded) {
							(0, util_1.ensureObject)(node, "spaces", lastAdded);
							var prevContent = node.spaces[lastAdded].after || "";
							node.spaces[lastAdded].after = prevContent + content;
							var existingComment = (0, util_1.getProp)(node, "raws", "spaces", lastAdded, "after") || null;
							if (existingComment) node.raws.spaces[lastAdded].after = existingComment + content;
						} else {
							spaceBefore = spaceBefore + content;
							commentBefore = commentBefore + content;
						}
						break;
					case tokens.asterisk:
						if (next[tokenize_1.FIELDS.TYPE] === tokens.equals) {
							node.operator = content;
							lastAdded = "operator";
						} else if ((!node.namespace || lastAdded === "namespace" && !spaceAfterMeaningfulToken) && next) {
							if (spaceBefore) {
								(0, util_1.ensureObject)(node, "spaces", "attribute");
								node.spaces.attribute.before = spaceBefore;
								spaceBefore = "";
							}
							if (commentBefore) {
								(0, util_1.ensureObject)(node, "raws", "spaces", "attribute");
								node.raws.spaces.attribute.before = spaceBefore;
								commentBefore = "";
							}
							node.namespace = (node.namespace || "") + content;
							var rawValue = (0, util_1.getProp)(node, "raws", "namespace") || null;
							if (rawValue) node.raws.namespace += content;
							lastAdded = "namespace";
						}
						spaceAfterMeaningfulToken = false;
						break;
					case tokens.dollar: if (lastAdded === "value") {
						var oldRawValue = (0, util_1.getProp)(node, "raws", "value");
						node.value += "$";
						if (oldRawValue) node.raws.value = oldRawValue + "$";
						break;
					}
					case tokens.caret:
						if (next[tokenize_1.FIELDS.TYPE] === tokens.equals) {
							node.operator = content;
							lastAdded = "operator";
						}
						spaceAfterMeaningfulToken = false;
						break;
					case tokens.combinator:
						if (content === "~" && next[tokenize_1.FIELDS.TYPE] === tokens.equals) {
							node.operator = content;
							lastAdded = "operator";
						}
						if (content !== "|") {
							spaceAfterMeaningfulToken = false;
							break;
						}
						if (next[tokenize_1.FIELDS.TYPE] === tokens.equals) {
							node.operator = content;
							lastAdded = "operator";
						} else if (!node.namespace && !node.attribute) node.namespace = true;
						spaceAfterMeaningfulToken = false;
						break;
					case tokens.word:
						if (next && this.content(next) === "|" && attr[pos + 2] && attr[pos + 2][tokenize_1.FIELDS.TYPE] !== tokens.equals && !node.operator && !node.namespace) {
							node.namespace = content;
							lastAdded = "namespace";
						} else if (!node.attribute || lastAdded === "attribute" && !spaceAfterMeaningfulToken) {
							if (spaceBefore) {
								(0, util_1.ensureObject)(node, "spaces", "attribute");
								node.spaces.attribute.before = spaceBefore;
								spaceBefore = "";
							}
							if (commentBefore) {
								(0, util_1.ensureObject)(node, "raws", "spaces", "attribute");
								node.raws.spaces.attribute.before = commentBefore;
								commentBefore = "";
							}
							node.attribute = (node.attribute || "") + content;
							var rawValue = (0, util_1.getProp)(node, "raws", "attribute") || null;
							if (rawValue) node.raws.attribute += content;
							lastAdded = "attribute";
						} else if (!node.value && node.value !== "" || lastAdded === "value" && !(spaceAfterMeaningfulToken || node.quoteMark)) {
							var unescaped_1 = (0, util_1.unesc)(content);
							var oldRawValue = (0, util_1.getProp)(node, "raws", "value") || "";
							var oldValue = node.value || "";
							node.value = oldValue + unescaped_1;
							node.quoteMark = null;
							if (unescaped_1 !== content || oldRawValue) {
								(0, util_1.ensureObject)(node, "raws");
								node.raws.value = (oldRawValue || oldValue) + content;
							}
							lastAdded = "value";
						} else {
							var insensitive = content === "i" || content === "I";
							if ((node.value || node.value === "") && (node.quoteMark || spaceAfterMeaningfulToken)) {
								node.insensitive = insensitive;
								if (!insensitive || content === "I") {
									(0, util_1.ensureObject)(node, "raws");
									node.raws.insensitiveFlag = content;
								}
								lastAdded = "insensitive";
								if (spaceBefore) {
									(0, util_1.ensureObject)(node, "spaces", "insensitive");
									node.spaces.insensitive.before = spaceBefore;
									spaceBefore = "";
								}
								if (commentBefore) {
									(0, util_1.ensureObject)(node, "raws", "spaces", "insensitive");
									node.raws.spaces.insensitive.before = commentBefore;
									commentBefore = "";
								}
							} else if (node.value || node.value === "") {
								lastAdded = "value";
								node.value += content;
								if (node.raws.value) node.raws.value += content;
							}
						}
						spaceAfterMeaningfulToken = false;
						break;
					case tokens.str:
						if (!node.attribute || !node.operator) return this.error("Expected an attribute followed by an operator preceding the string.", { index: token[tokenize_1.FIELDS.START_POS] });
						var _a = (0, attribute_1.unescapeValue)(content), unescaped = _a.unescaped, quoteMark = _a.quoteMark;
						node.value = unescaped;
						node.quoteMark = quoteMark;
						lastAdded = "value";
						(0, util_1.ensureObject)(node, "raws");
						node.raws.value = content;
						spaceAfterMeaningfulToken = false;
						break;
					case tokens.equals:
						if (!node.attribute) return this.expected("attribute", token[tokenize_1.FIELDS.START_POS], content);
						if (node.value) return this.error("Unexpected \"=\" found; an operator was already defined.", { index: token[tokenize_1.FIELDS.START_POS] });
						node.operator = node.operator ? node.operator + content : content;
						lastAdded = "operator";
						spaceAfterMeaningfulToken = false;
						break;
					case tokens.comment:
						if (lastAdded) if (spaceAfterMeaningfulToken || next && next[tokenize_1.FIELDS.TYPE] === tokens.space || lastAdded === "insensitive") {
							var lastComment = (0, util_1.getProp)(node, "spaces", lastAdded, "after") || "";
							var rawLastComment = (0, util_1.getProp)(node, "raws", "spaces", lastAdded, "after") || lastComment;
							(0, util_1.ensureObject)(node, "raws", "spaces", lastAdded);
							node.raws.spaces[lastAdded].after = rawLastComment + content;
						} else {
							var lastValue = node[lastAdded] || "";
							var rawLastValue = (0, util_1.getProp)(node, "raws", lastAdded) || lastValue;
							(0, util_1.ensureObject)(node, "raws");
							node.raws[lastAdded] = rawLastValue + content;
						}
						else commentBefore = commentBefore + content;
						break;
					default: return this.error("Unexpected \"".concat(content, "\" found."), { index: token[tokenize_1.FIELDS.START_POS] });
				}
				pos++;
			}
			unescapeProp(node, "attribute");
			unescapeProp(node, "namespace");
			this.newNode(new attribute_1.default(node));
			this.position++;
		};
		/**
		* return a node containing meaningless garbage up to (but not including) the specified token position.
		* if the token position is negative, all remaining tokens are consumed.
		*
		* This returns an array containing a single string node if all whitespace,
		* otherwise an array of comment nodes with space before and after.
		*
		* These tokens are not added to the current selector, the caller can add them or use them to amend
		* a previous node's space metadata.
		*
		* In lossy mode, this returns only comments.
		*/
		Parser.prototype.parseWhitespaceEquivalentTokens = function(stopPosition) {
			if (stopPosition < 0) stopPosition = this.tokens.length;
			var startPosition = this.position;
			var nodes = [];
			var space = "";
			var lastComment = void 0;
			do
				if (WHITESPACE_TOKENS[this.currToken[tokenize_1.FIELDS.TYPE]]) {
					if (!this.options.lossy) space += this.content();
				} else if (this.currToken[tokenize_1.FIELDS.TYPE] === tokens.comment) {
					var spaces = {};
					if (space) {
						spaces.before = space;
						space = "";
					}
					lastComment = new comment_1.default({
						value: this.content(),
						source: getTokenSource(this.currToken),
						sourceIndex: this.currToken[tokenize_1.FIELDS.START_POS],
						spaces
					});
					nodes.push(lastComment);
				}
			while (++this.position < stopPosition);
			if (space) {
				if (lastComment) lastComment.spaces.after = space;
				else if (!this.options.lossy) {
					var firstToken = this.tokens[startPosition];
					var lastToken = this.tokens[this.position - 1];
					nodes.push(new string_1.default({
						value: "",
						source: getSource(firstToken[tokenize_1.FIELDS.START_LINE], firstToken[tokenize_1.FIELDS.START_COL], lastToken[tokenize_1.FIELDS.END_LINE], lastToken[tokenize_1.FIELDS.END_COL]),
						sourceIndex: firstToken[tokenize_1.FIELDS.START_POS],
						spaces: {
							before: space,
							after: ""
						}
					}));
				}
			}
			return nodes;
		};
		/**
		*
		* @param {*} nodes
		*/
		Parser.prototype.convertWhitespaceNodesToSpace = function(nodes, requiredSpace) {
			var _this = this;
			if (requiredSpace === void 0) requiredSpace = false;
			var space = "";
			var rawSpace = "";
			nodes.forEach(function(n) {
				var spaceBefore = _this.lossySpace(n.spaces.before, requiredSpace);
				var rawSpaceBefore = _this.lossySpace(n.rawSpaceBefore, requiredSpace);
				space += spaceBefore + _this.lossySpace(n.spaces.after, requiredSpace && spaceBefore.length === 0);
				rawSpace += spaceBefore + n.value + _this.lossySpace(n.rawSpaceAfter, requiredSpace && rawSpaceBefore.length === 0);
			});
			if (rawSpace === space) rawSpace = void 0;
			return {
				space,
				rawSpace
			};
		};
		Parser.prototype.isNamedCombinator = function(position) {
			if (position === void 0) position = this.position;
			return this.tokens[position + 0] && this.tokens[position + 0][tokenize_1.FIELDS.TYPE] === tokens.slash && this.tokens[position + 1] && this.tokens[position + 1][tokenize_1.FIELDS.TYPE] === tokens.word && this.tokens[position + 2] && this.tokens[position + 2][tokenize_1.FIELDS.TYPE] === tokens.slash;
		};
		Parser.prototype.namedCombinator = function() {
			if (this.isNamedCombinator()) {
				var nameRaw = this.content(this.tokens[this.position + 1]);
				var name = (0, util_1.unesc)(nameRaw).toLowerCase();
				var raws = {};
				if (name !== nameRaw) raws.value = "/".concat(nameRaw, "/");
				var node = new combinator_1.default({
					value: "/".concat(name, "/"),
					source: getSource(this.currToken[tokenize_1.FIELDS.START_LINE], this.currToken[tokenize_1.FIELDS.START_COL], this.tokens[this.position + 2][tokenize_1.FIELDS.END_LINE], this.tokens[this.position + 2][tokenize_1.FIELDS.END_COL]),
					sourceIndex: this.currToken[tokenize_1.FIELDS.START_POS],
					raws
				});
				this.position = this.position + 3;
				return node;
			} else this.unexpected();
		};
		Parser.prototype.combinator = function() {
			var _this = this;
			if (this.content() === "|") return this.namespace();
			var nextSigTokenPos = this.locateNextMeaningfulToken(this.position);
			if (nextSigTokenPos < 0 || this.tokens[nextSigTokenPos][tokenize_1.FIELDS.TYPE] === tokens.comma || this.tokens[nextSigTokenPos][tokenize_1.FIELDS.TYPE] === tokens.closeParenthesis) {
				var nodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
				if (nodes.length > 0) {
					var last = this.current.last;
					if (last) {
						var _a = this.convertWhitespaceNodesToSpace(nodes), space = _a.space, rawSpace = _a.rawSpace;
						if (rawSpace !== void 0) last.rawSpaceAfter += rawSpace;
						last.spaces.after += space;
					} else nodes.forEach(function(n) {
						return _this.newNode(n);
					});
				}
				return;
			}
			var firstToken = this.currToken;
			var spaceOrDescendantSelectorNodes = void 0;
			if (nextSigTokenPos > this.position) spaceOrDescendantSelectorNodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
			var node;
			if (this.isNamedCombinator()) node = this.namedCombinator();
			else if (this.currToken[tokenize_1.FIELDS.TYPE] === tokens.combinator) {
				node = new combinator_1.default({
					value: this.content(),
					source: getTokenSource(this.currToken),
					sourceIndex: this.currToken[tokenize_1.FIELDS.START_POS]
				});
				this.position++;
			} else if (WHITESPACE_TOKENS[this.currToken[tokenize_1.FIELDS.TYPE]]) {} else if (!spaceOrDescendantSelectorNodes) this.unexpected();
			if (node) {
				if (spaceOrDescendantSelectorNodes) {
					var _b = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes), space = _b.space, rawSpace = _b.rawSpace;
					node.spaces.before = space;
					node.rawSpaceBefore = rawSpace;
				}
			} else {
				var _c = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes, true), space = _c.space, rawSpace = _c.rawSpace;
				if (!rawSpace) rawSpace = space;
				var spaces = {};
				var raws = { spaces: {} };
				if (space.endsWith(" ") && rawSpace.endsWith(" ")) {
					spaces.before = space.slice(0, space.length - 1);
					raws.spaces.before = rawSpace.slice(0, rawSpace.length - 1);
				} else if (space[0] === " " && rawSpace[0] === " ") {
					spaces.after = space.slice(1);
					raws.spaces.after = rawSpace.slice(1);
				} else raws.value = rawSpace;
				node = new combinator_1.default({
					value: " ",
					source: getTokenSourceSpan(firstToken, this.tokens[this.position - 1]),
					sourceIndex: firstToken[tokenize_1.FIELDS.START_POS],
					spaces,
					raws
				});
			}
			if (this.currToken && this.currToken[tokenize_1.FIELDS.TYPE] === tokens.space) {
				node.spaces.after = this.optionalSpace(this.content());
				this.position++;
			}
			return this.newNode(node);
		};
		Parser.prototype.comma = function() {
			if (this.position === this.tokens.length - 1) {
				this.root.trailingComma = true;
				this.position++;
				return;
			}
			this.current._inferEndPosition();
			var selector = new selector_1.default({
				source: { start: tokenStart(this.tokens[this.position + 1]) },
				sourceIndex: this.tokens[this.position + 1][tokenize_1.FIELDS.START_POS]
			});
			this.current.parent.append(selector);
			this.current = selector;
			this.position++;
		};
		Parser.prototype.comment = function() {
			var current = this.currToken;
			this.newNode(new comment_1.default({
				value: this.content(),
				source: getTokenSource(current),
				sourceIndex: current[tokenize_1.FIELDS.START_POS]
			}));
			this.position++;
		};
		Parser.prototype.error = function(message, opts) {
			throw this.root.error(message, opts);
		};
		Parser.prototype.missingBackslash = function() {
			return this.error("Expected a backslash preceding the semicolon.", { index: this.currToken[tokenize_1.FIELDS.START_POS] });
		};
		Parser.prototype.missingParenthesis = function() {
			return this.expected("opening parenthesis", this.currToken[tokenize_1.FIELDS.START_POS]);
		};
		Parser.prototype.missingSquareBracket = function() {
			return this.expected("opening square bracket", this.currToken[tokenize_1.FIELDS.START_POS]);
		};
		Parser.prototype.unexpected = function() {
			return this.error("Unexpected '".concat(this.content(), "'. Escaping special characters with \\ may help."), this.currToken[tokenize_1.FIELDS.START_POS]);
		};
		Parser.prototype.unexpectedPipe = function() {
			return this.error("Unexpected '|'.", this.currToken[tokenize_1.FIELDS.START_POS]);
		};
		Parser.prototype.namespace = function() {
			var before = this.prevToken && this.content(this.prevToken) || true;
			if (this.nextToken[tokenize_1.FIELDS.TYPE] === tokens.word) {
				this.position++;
				return this.word(before);
			} else if (this.nextToken[tokenize_1.FIELDS.TYPE] === tokens.asterisk) {
				this.position++;
				return this.universal(before);
			}
			this.unexpectedPipe();
		};
		Parser.prototype.nesting = function() {
			if (this.nextToken) {
				if (this.content(this.nextToken) === "|") {
					this.position++;
					return;
				}
			}
			var current = this.currToken;
			this.newNode(new nesting_1.default({
				value: this.content(),
				source: getTokenSource(current),
				sourceIndex: current[tokenize_1.FIELDS.START_POS]
			}));
			this.position++;
		};
		Parser.prototype.parentheses = function() {
			var last = this.current.last;
			var unbalanced = 1;
			this.position++;
			if (last && last.type === types.PSEUDO) {
				var selector = new selector_1.default({
					source: { start: tokenStart(this.tokens[this.position]) },
					sourceIndex: this.tokens[this.position][tokenize_1.FIELDS.START_POS]
				});
				var cache = this.current;
				last.append(selector);
				this.current = selector;
				this.nestingDepth++;
				try {
					if (this.nestingDepth > this.maxNestingDepth) this.error("Cannot parse selector: nesting depth exceeds the maximum of ".concat(this.maxNestingDepth, "."), { index: this.currToken[tokenize_1.FIELDS.START_POS] });
					while (this.position < this.tokens.length && unbalanced) {
						if (this.currToken[tokenize_1.FIELDS.TYPE] === tokens.openParenthesis) unbalanced++;
						if (this.currToken[tokenize_1.FIELDS.TYPE] === tokens.closeParenthesis) unbalanced--;
						if (unbalanced) this.parse();
						else {
							this.current.source.end = tokenEnd(this.currToken);
							this.current.parent.source.end = tokenEnd(this.currToken);
							this.position++;
						}
					}
				} finally {
					this.nestingDepth--;
				}
				this.current = cache;
			} else {
				var parenStart = this.currToken;
				var parenValue = "(";
				var parenEnd = void 0;
				while (this.position < this.tokens.length && unbalanced) {
					if (this.currToken[tokenize_1.FIELDS.TYPE] === tokens.openParenthesis) unbalanced++;
					if (this.currToken[tokenize_1.FIELDS.TYPE] === tokens.closeParenthesis) unbalanced--;
					parenEnd = this.currToken;
					parenValue += this.parseParenthesisToken(this.currToken);
					this.position++;
				}
				if (last) last.appendToPropertyAndEscape("value", parenValue, parenValue);
				else this.newNode(new string_1.default({
					value: parenValue,
					source: getSource(parenStart[tokenize_1.FIELDS.START_LINE], parenStart[tokenize_1.FIELDS.START_COL], parenEnd[tokenize_1.FIELDS.END_LINE], parenEnd[tokenize_1.FIELDS.END_COL]),
					sourceIndex: parenStart[tokenize_1.FIELDS.START_POS]
				}));
			}
			if (unbalanced) return this.expected("closing parenthesis", this.currToken[tokenize_1.FIELDS.START_POS]);
		};
		Parser.prototype.pseudo = function() {
			var _this = this;
			var pseudoStr = "";
			var startingToken = this.currToken;
			while (this.currToken && this.currToken[tokenize_1.FIELDS.TYPE] === tokens.colon) {
				pseudoStr += this.content();
				this.position++;
			}
			if (!this.currToken) return this.expected(["pseudo-class", "pseudo-element"], this.position - 1);
			if (this.currToken[tokenize_1.FIELDS.TYPE] === tokens.word) this.splitWord(false, function(first, length) {
				pseudoStr += first;
				_this.newNode(new pseudo_1.default({
					value: pseudoStr,
					source: getTokenSourceSpan(startingToken, _this.currToken),
					sourceIndex: startingToken[tokenize_1.FIELDS.START_POS]
				}));
				if (length > 1 && _this.nextToken && _this.nextToken[tokenize_1.FIELDS.TYPE] === tokens.openParenthesis) _this.error("Misplaced parenthesis.", { index: _this.nextToken[tokenize_1.FIELDS.START_POS] });
			});
			else return this.expected(["pseudo-class", "pseudo-element"], this.currToken[tokenize_1.FIELDS.START_POS]);
		};
		Parser.prototype.space = function() {
			var content = this.content();
			if (this.position === 0 || this.prevToken[tokenize_1.FIELDS.TYPE] === tokens.comma || this.prevToken[tokenize_1.FIELDS.TYPE] === tokens.openParenthesis || this.current.nodes.every(function(node) {
				return node.type === "comment";
			})) {
				this.spaces = this.optionalSpace(content);
				this.position++;
			} else if (this.position === this.tokens.length - 1 || this.nextToken[tokenize_1.FIELDS.TYPE] === tokens.comma || this.nextToken[tokenize_1.FIELDS.TYPE] === tokens.closeParenthesis) {
				this.current.last.spaces.after = this.optionalSpace(content);
				this.position++;
			} else this.combinator();
		};
		Parser.prototype.string = function() {
			var current = this.currToken;
			this.newNode(new string_1.default({
				value: this.content(),
				source: getTokenSource(current),
				sourceIndex: current[tokenize_1.FIELDS.START_POS]
			}));
			this.position++;
		};
		Parser.prototype.universal = function(namespace) {
			var nextToken = this.nextToken;
			if (nextToken && this.content(nextToken) === "|") {
				this.position++;
				return this.namespace();
			}
			var current = this.currToken;
			this.newNode(new universal_1.default({
				value: this.content(),
				source: getTokenSource(current),
				sourceIndex: current[tokenize_1.FIELDS.START_POS]
			}), namespace);
			this.position++;
		};
		Parser.prototype.splitWord = function(namespace, firstCallback) {
			var _this = this;
			var nextToken = this.nextToken;
			var word = this.content();
			while (nextToken && ~[
				tokens.dollar,
				tokens.caret,
				tokens.equals,
				tokens.word
			].indexOf(nextToken[tokenize_1.FIELDS.TYPE])) {
				this.position++;
				var current = this.content();
				word += current;
				if (current.lastIndexOf("\\") === current.length - 1) {
					var next = this.nextToken;
					if (next && next[tokenize_1.FIELDS.TYPE] === tokens.space) {
						word += this.requiredSpace(this.content(next));
						this.position++;
					}
				}
				nextToken = this.nextToken;
			}
			var hasClass = indexesOf(word, ".").filter(function(i) {
				var escapedDot = word[i - 1] === "\\";
				var isKeyframesPercent = /^\d+\.\d+%$/.test(word);
				return !escapedDot && !isKeyframesPercent;
			});
			var hasId = indexesOf(word, "#").filter(function(i) {
				return word[i - 1] !== "\\";
			});
			var interpolations = indexesOf(word, "#{");
			if (interpolations.length) hasId = hasId.filter(function(hashIndex) {
				return !~interpolations.indexOf(hashIndex);
			});
			var indices = (0, sortAscending_1.default)(uniqs(__spreadArray(__spreadArray([0], __read(hasClass), false), __read(hasId), false)));
			indices.forEach(function(ind, i) {
				var index = indices[i + 1] || word.length;
				var value = word.slice(ind, index);
				if (i === 0 && firstCallback) return firstCallback.call(_this, value, indices.length);
				var node;
				var current = _this.currToken;
				var sourceIndex = current[tokenize_1.FIELDS.START_POS] + indices[i];
				var source = getSource(current[1], current[2] + ind, current[3], current[2] + (index - 1));
				if (~hasClass.indexOf(ind)) {
					var classNameOpts = {
						value: value.slice(1),
						source,
						sourceIndex
					};
					node = new className_1.default(unescapeProp(classNameOpts, "value"));
				} else if (~hasId.indexOf(ind)) {
					var idOpts = {
						value: value.slice(1),
						source,
						sourceIndex
					};
					node = new id_1.default(unescapeProp(idOpts, "value"));
				} else {
					var tagOpts = {
						value,
						source,
						sourceIndex
					};
					unescapeProp(tagOpts, "value");
					node = new tag_1.default(tagOpts);
				}
				_this.newNode(node, namespace);
				namespace = null;
			});
			this.position++;
		};
		Parser.prototype.word = function(namespace) {
			var nextToken = this.nextToken;
			if (nextToken && this.content(nextToken) === "|") {
				this.position++;
				return this.namespace();
			}
			return this.splitWord(namespace);
		};
		Parser.prototype.loop = function() {
			while (this.position < this.tokens.length) this.parse(true);
			this.current._inferEndPosition();
			return this.root;
		};
		Parser.prototype.parse = function(throwOnParenthesis) {
			switch (this.currToken[tokenize_1.FIELDS.TYPE]) {
				case tokens.space:
					this.space();
					break;
				case tokens.comment:
					this.comment();
					break;
				case tokens.openParenthesis:
					this.parentheses();
					break;
				case tokens.closeParenthesis:
					if (throwOnParenthesis) this.missingParenthesis();
					break;
				case tokens.openSquare:
					this.attribute();
					break;
				case tokens.dollar:
				case tokens.caret:
				case tokens.equals:
				case tokens.word:
					this.word();
					break;
				case tokens.colon:
					this.pseudo();
					break;
				case tokens.comma:
					this.comma();
					break;
				case tokens.asterisk:
					this.universal();
					break;
				case tokens.ampersand:
					this.nesting();
					break;
				case tokens.slash:
				case tokens.combinator:
					this.combinator();
					break;
				case tokens.str:
					this.string();
					break;
				case tokens.closeSquare: this.missingSquareBracket();
				case tokens.semicolon: this.missingBackslash();
				default: this.unexpected();
			}
		};
		/**
		* Helpers
		*/
		Parser.prototype.expected = function(description, index, found) {
			if (Array.isArray(description)) {
				var last = description.pop();
				description = "".concat(description.join(", "), " or ").concat(last);
			}
			var an = /^[aeiou]/.test(description[0]) ? "an" : "a";
			if (!found) return this.error("Expected ".concat(an, " ").concat(description, "."), { index });
			return this.error("Expected ".concat(an, " ").concat(description, ", found \"").concat(found, "\" instead."), { index });
		};
		Parser.prototype.requiredSpace = function(space) {
			return this.options.lossy ? " " : space;
		};
		Parser.prototype.optionalSpace = function(space) {
			return this.options.lossy ? "" : space;
		};
		Parser.prototype.lossySpace = function(space, required) {
			if (this.options.lossy) return required ? " " : "";
			else return space;
		};
		Parser.prototype.parseParenthesisToken = function(token) {
			var content = this.content(token);
			if (token[tokenize_1.FIELDS.TYPE] === tokens.space) return this.requiredSpace(content);
			else return content;
		};
		Parser.prototype.newNode = function(node, namespace) {
			if (namespace) {
				if (/^ +$/.test(namespace)) {
					if (!this.options.lossy) this.spaces = (this.spaces || "") + namespace;
					namespace = true;
				}
				node.namespace = namespace;
				unescapeProp(node, "namespace");
			}
			if (this.spaces) {
				node.spaces.before = this.spaces;
				this.spaces = "";
			}
			return this.current.append(node);
		};
		Parser.prototype.content = function(token) {
			if (token === void 0) token = this.currToken;
			return this.css.slice(token[tokenize_1.FIELDS.START_POS], token[tokenize_1.FIELDS.END_POS]);
		};
		Object.defineProperty(Parser.prototype, "currToken", {
			get: function() {
				return this.tokens[this.position];
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Parser.prototype, "nextToken", {
			get: function() {
				return this.tokens[this.position + 1];
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(Parser.prototype, "prevToken", {
			get: function() {
				return this.tokens[this.position - 1];
			},
			enumerable: false,
			configurable: true
		});
		/**
		* returns the index of the next non-whitespace, non-comment token.
		* returns -1 if no meaningful token is found.
		*/
		Parser.prototype.locateNextMeaningfulToken = function(startPosition) {
			if (startPosition === void 0) startPosition = this.position + 1;
			var searchPosition = startPosition;
			while (searchPosition < this.tokens.length) if (WHITESPACE_EQUIV_TOKENS[this.tokens[searchPosition][tokenize_1.FIELDS.TYPE]]) {
				searchPosition++;
				continue;
			} else return searchPosition;
			return -1;
		};
		return Parser;
	}();
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/processor.js
var require_processor = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var parser_1 = __importDefault(require_parser());
	exports.default = function() {
		function Processor(func, options) {
			this.func = func || function noop() {};
			this.funcRes = null;
			this.options = options;
		}
		Processor.prototype._shouldUpdateSelector = function(rule, options) {
			if (options === void 0) options = {};
			if (Object.assign({}, this.options, options).updateSelector === false) return false;
			else return typeof rule !== "string";
		};
		Processor.prototype._isLossy = function(options) {
			if (options === void 0) options = {};
			if (Object.assign({}, this.options, options).lossless === false) return true;
			else return false;
		};
		Processor.prototype._root = function(rule, options) {
			if (options === void 0) options = {};
			return new parser_1.default(rule, this._parseOptions(options)).root;
		};
		Processor.prototype._parseOptions = function(options) {
			var merged = Object.assign({}, this.options, options);
			return {
				lossy: this._isLossy(merged),
				maxNestingDepth: merged.maxNestingDepth
			};
		};
		Processor.prototype._stringifyOptions = function(options) {
			return { maxNestingDepth: Object.assign({}, this.options, options).maxNestingDepth };
		};
		Processor.prototype._run = function(rule, options) {
			var _this = this;
			if (options === void 0) options = {};
			return new Promise(function(resolve, reject) {
				try {
					var root_1 = _this._root(rule, options);
					Promise.resolve(_this.func(root_1)).then(function(transform) {
						var string = void 0;
						if (_this._shouldUpdateSelector(rule, options)) {
							string = root_1.toString(_this._stringifyOptions(options));
							rule.selector = string;
						}
						return {
							transform,
							root: root_1,
							string
						};
					}).then(resolve, reject);
				} catch (e) {
					reject(e);
					return;
				}
			});
		};
		Processor.prototype._runSync = function(rule, options) {
			if (options === void 0) options = {};
			var root = this._root(rule, options);
			var transform = this.func(root);
			if (transform && typeof transform.then === "function") throw new Error("Selector processor returned a promise to a synchronous call.");
			var string = void 0;
			if (options.updateSelector && typeof rule !== "string") {
				string = root.toString(this._stringifyOptions(options));
				rule.selector = string;
			}
			return {
				transform,
				root,
				string
			};
		};
		/**
		* Process rule into a selector AST.
		*
		* @param rule {postcss.Rule | string} The css selector to be processed
		* @param options The options for processing
		* @returns {Promise<parser.Root>} The AST of the selector after processing it.
		*/
		Processor.prototype.ast = function(rule, options) {
			return this._run(rule, options).then(function(result) {
				return result.root;
			});
		};
		/**
		* Process rule into a selector AST synchronously.
		*
		* @param rule {postcss.Rule | string} The css selector to be processed
		* @param options The options for processing
		* @returns {parser.Root} The AST of the selector after processing it.
		*/
		Processor.prototype.astSync = function(rule, options) {
			return this._runSync(rule, options).root;
		};
		/**
		* Process a selector into a transformed value asynchronously
		*
		* @param rule {postcss.Rule | string} The css selector to be processed
		* @param options The options for processing
		* @returns {Promise<any>} The value returned by the processor.
		*/
		Processor.prototype.transform = function(rule, options) {
			return this._run(rule, options).then(function(result) {
				return result.transform;
			});
		};
		/**
		* Process a selector into a transformed value synchronously.
		*
		* @param rule {postcss.Rule | string} The css selector to be processed
		* @param options The options for processing
		* @returns {any} The value returned by the processor.
		*/
		Processor.prototype.transformSync = function(rule, options) {
			return this._runSync(rule, options).transform;
		};
		/**
		* Process a selector into a new selector string asynchronously.
		*
		* @param rule {postcss.Rule | string} The css selector to be processed
		* @param options The options for processing
		* @returns {string} the selector after processing.
		*/
		Processor.prototype.process = function(rule, options) {
			var _this = this;
			return this._run(rule, options).then(function(result) {
				return result.string || result.root.toString(_this._stringifyOptions(options));
			});
		};
		/**
		* Process a selector into a new selector string synchronously.
		*
		* @param rule {postcss.Rule | string} The css selector to be processed
		* @param options The options for processing
		* @returns {string} the selector after processing.
		*/
		Processor.prototype.processSync = function(rule, options) {
			var result = this._runSync(rule, options);
			return result.string || result.root.toString(this._stringifyOptions(options));
		};
		return Processor;
	}();
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/constructors.js
var require_constructors = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.universal = exports.tag = exports.string = exports.selector = exports.root = exports.pseudo = exports.nesting = exports.id = exports.comment = exports.combinator = exports.className = exports.attribute = void 0;
	var attribute_1 = __importDefault(require_attribute());
	var className_1 = __importDefault(require_className());
	var combinator_1 = __importDefault(require_combinator());
	var comment_1 = __importDefault(require_comment());
	var id_1 = __importDefault(require_id());
	var nesting_1 = __importDefault(require_nesting());
	var pseudo_1 = __importDefault(require_pseudo());
	var root_1 = __importDefault(require_root());
	var selector_1 = __importDefault(require_selector());
	var string_1 = __importDefault(require_string());
	var tag_1 = __importDefault(require_tag());
	var universal_1 = __importDefault(require_universal());
	var attribute = function(opts) {
		return new attribute_1.default(opts);
	};
	exports.attribute = attribute;
	var className = function(opts) {
		return new className_1.default(opts);
	};
	exports.className = className;
	var combinator = function(opts) {
		return new combinator_1.default(opts);
	};
	exports.combinator = combinator;
	var comment = function(opts) {
		return new comment_1.default(opts);
	};
	exports.comment = comment;
	var id = function(opts) {
		return new id_1.default(opts);
	};
	exports.id = id;
	var nesting = function(opts) {
		return new nesting_1.default(opts);
	};
	exports.nesting = nesting;
	var pseudo = function(opts) {
		return new pseudo_1.default(opts);
	};
	exports.pseudo = pseudo;
	var root = function(opts) {
		return new root_1.default(opts);
	};
	exports.root = root;
	var selector = function(opts) {
		return new selector_1.default(opts);
	};
	exports.selector = selector;
	var string = function(opts) {
		return new string_1.default(opts);
	};
	exports.string = string;
	var tag = function(opts) {
		return new tag_1.default(opts);
	};
	exports.tag = tag;
	var universal = function(opts) {
		return new universal_1.default(opts);
	};
	exports.universal = universal;
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/guards.js
var require_guards = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _a;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isUniversal = exports.isTag = exports.isString = exports.isSelector = exports.isRoot = exports.isPseudo = exports.isNesting = exports.isIdentifier = exports.isComment = exports.isCombinator = exports.isClassName = exports.isAttribute = void 0;
	exports.isNode = isNode;
	exports.isPseudoElement = isPseudoElement;
	exports.isPseudoClass = isPseudoClass;
	exports.isContainer = isContainer;
	exports.isNamespace = isNamespace;
	var types_1 = require_types();
	var IS_TYPE = (_a = {}, _a[types_1.ATTRIBUTE] = true, _a[types_1.CLASS] = true, _a[types_1.COMBINATOR] = true, _a[types_1.COMMENT] = true, _a[types_1.ID] = true, _a[types_1.NESTING] = true, _a[types_1.PSEUDO] = true, _a[types_1.ROOT] = true, _a[types_1.SELECTOR] = true, _a[types_1.STRING] = true, _a[types_1.TAG] = true, _a[types_1.UNIVERSAL] = true, _a);
	function isNode(node) {
		return typeof node === "object" && IS_TYPE[node.type];
	}
	function isNodeType(type, node) {
		return isNode(node) && node.type === type;
	}
	exports.isAttribute = isNodeType.bind(null, types_1.ATTRIBUTE);
	exports.isClassName = isNodeType.bind(null, types_1.CLASS);
	exports.isCombinator = isNodeType.bind(null, types_1.COMBINATOR);
	exports.isComment = isNodeType.bind(null, types_1.COMMENT);
	exports.isIdentifier = isNodeType.bind(null, types_1.ID);
	exports.isNesting = isNodeType.bind(null, types_1.NESTING);
	exports.isPseudo = isNodeType.bind(null, types_1.PSEUDO);
	exports.isRoot = isNodeType.bind(null, types_1.ROOT);
	exports.isSelector = isNodeType.bind(null, types_1.SELECTOR);
	exports.isString = isNodeType.bind(null, types_1.STRING);
	exports.isTag = isNodeType.bind(null, types_1.TAG);
	exports.isUniversal = isNodeType.bind(null, types_1.UNIVERSAL);
	function isPseudoElement(node) {
		return (0, exports.isPseudo)(node) && node.value && (node.value.startsWith("::") || node.value.toLowerCase() === ":before" || node.value.toLowerCase() === ":after" || node.value.toLowerCase() === ":first-letter" || node.value.toLowerCase() === ":first-line");
	}
	function isPseudoClass(node) {
		return (0, exports.isPseudo)(node) && !isPseudoElement(node);
	}
	function isContainer(node) {
		return !!(isNode(node) && node.walk);
	}
	function isNamespace(node) {
		return (0, exports.isAttribute)(node) || (0, exports.isTag)(node);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/selectors/index.js
var require_selectors = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_types(), exports);
	__exportStar(require_constructors(), exports);
	__exportStar(require_guards(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/postcss-selector-parser@7.1.4/node_modules/postcss-selector-parser/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var processor_1 = (exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	})(require_processor());
	var selectors = __importStar(require_selectors());
	var parser = function(processor) {
		return new processor_1.default(processor);
	};
	Object.assign(parser, selectors);
	delete parser.__esModule;
	module.exports = parser;
}));
//#endregion
//#region src/typography/index.ts
var import_deepmerge = require_deepmerge();
var import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
function inWhere(selector, { className, prefix, modifier }) {
	const prefixedNot = prefix(`.not-${className}`).slice(1);
	const selectorPrefix = selector.startsWith(">") ? `${modifier === "DEFAULT" ? `.${className}` : `.${className}-${modifier}`} ` : "";
	const [trailingPseudo, rebuiltSelector] = commonTrailingPseudos(selector);
	if (trailingPseudo) return `:where(${selectorPrefix}${rebuiltSelector}):not(:where([class~="${prefixedNot}"],[class~="${prefixedNot}"] *))${trailingPseudo}`;
	return `:where(${selectorPrefix}${selector}):not(:where([class~="${prefixedNot}"],[class~="${prefixedNot}"] *))`;
}
function configToCss(config = {}, { className, modifier, prefix }) {
	function updateSelector(k, v) {
		if (Array.isArray(v)) return [k, v];
		if (typeof v === "object" && v !== null) {
			if (Object.values(v).some((prop) => typeof prop === "object")) return [
				inWhere(k, {
					className,
					modifier,
					prefix
				}),
				v,
				Object.fromEntries(Object.entries(v).map(([k, v]) => updateSelector(k, v)))
			];
			return [inWhere(k, {
				className,
				modifier,
				prefix
			}), v];
		}
		return [k, v];
	}
	const css = config.css ?? [];
	const mergedCss = Array.isArray(css) ? dm(...css) : css;
	return Object.fromEntries(Object.entries(mergedCss).map(([k, v]) => updateSelector(k, v)));
}
const dm = (0, import_deepmerge.deepmerge)({ all: true });
const parseSelector = (0, import_dist.default)();
function commonTrailingPseudos(selector) {
	const ast = parseSelector.astSync(selector);
	const matrix = [];
	for (const [i, sel] of ast.nodes.entries()) for (const [j, child] of [...sel.nodes].reverse().entries()) {
		if (child.type !== "pseudo" || !child.value.startsWith("::")) break;
		matrix[j] = matrix[j] || [];
		matrix[j][i] = child;
	}
	const trailingPseudos = import_dist.default.selector({ value: "" });
	for (const pseudos of matrix) {
		if (!pseudos) continue;
		if (new Set(pseudos.map((p) => p.value)).size > 1) break;
		pseudos.forEach((pseudo) => pseudo.remove());
		trailingPseudos.prepend(pseudos[0]);
	}
	if (trailingPseudos.nodes.length) return [trailingPseudos.toString(), ast.toString()];
	return [null, selector];
}
const SELECTORS = [
	[
		"headings",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"th"
	],
	["h1"],
	["h2"],
	["h3"],
	["h4"],
	["h5"],
	["h6"],
	["p"],
	["a"],
	["blockquote"],
	["figure"],
	["figcaption"],
	["strong"],
	["em"],
	["kbd"],
	["code"],
	["pre"],
	["ol"],
	["ul"],
	["li"],
	["table"],
	["thead"],
	["tr"],
	["th"],
	["td"],
	["img"],
	["video"],
	["hr"],
	["lead", "[class~=\"lead\"]"]
];
const typography = plugin.withOptions(({ className = "prose", ...styleOptions } = {}) => {
	return ({ addVariant, addComponents, ...rest }) => {
		const prefix = rest.prefix;
		for (const [name, ...values] of SELECTORS) {
			const selector = (values.length === 0 ? [name] : values).join(", ");
			addVariant(`${className}-${name}`, `& :is(${inWhere(selector, {
				prefix,
				className
			})})`);
		}
		addComponents({
			[`.${className}`]: configToCss({
				...DEFAULT,
				css: [...DEFAULT.css ?? [], styleOptions.disableRoundedTable ? normalTable : roundedTable]
			}, {
				className,
				modifier: "DEFAULT",
				prefix
			}),
			[`.${className}-sm`]: configToCss(SMALL, {
				className,
				modifier: "sm",
				prefix
			})
		});
	};
});
//#endregion
export { typography as default, typography };
