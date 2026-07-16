import { n as __exportAll$1 } from "./rolldown-runtime-B4lejLz5.js";
import { n as s, t as o } from "./renderer-C4vFFkqN.js";
//#region node_modules/@takumi-rs/wasm/dist/export.mjs
var export_exports = /* @__PURE__ */ __exportAll$1({
	Renderer: () => Renderer,
	default: () => __wbg_init,
	initSync: () => initSync
});
/**
* The main renderer for Takumi image rendering engine.
*
* State lives behind a lock and every method takes `&self`, mirroring the
* napi bindings: a panic mid-call can't leave the wasm-bindgen borrow flag
* permanently set, which would otherwise fail all subsequent calls.
*/
var Renderer$1 = class {
	__destroy_into_raw() {
		const ptr = this.__wbg_ptr;
		this.__wbg_ptr = 0;
		RendererFinalization.unregister(this);
		return ptr;
	}
	free() {
		const ptr = this.__destroy_into_raw();
		wasm.__wbg_renderer_free(ptr, 0);
	}
	/**
	* Measures a node tree and returns layout information.
	* @param {Node} node
	* @param {RenderOptions | null} [options]
	* @returns {MeasuredNode}
	*/
	measure(node, options) {
		const ret = wasm.renderer_measure(this.__wbg_ptr, node, isLikeNone(options) ? 0 : addToExternrefTable0(options));
		if (ret[2]) throw takeFromExternrefTable0(ret[1]);
		return takeFromExternrefTable0(ret[0]);
	}
	/**
	* Creates a new Renderer instance.
	*/
	constructor() {
		const ret = wasm.renderer_new();
		if (ret[2]) throw takeFromExternrefTable0(ret[1]);
		this.__wbg_ptr = ret[0];
		RendererFinalization.register(this, this.__wbg_ptr, this);
		return this;
	}
	/**
	* Registers fonts into the renderer, returning the families each font produced.
	* @param {Font} font
	* @returns {RegisteredFamily[]}
	*/
	registerFont(font) {
		const ret = wasm.renderer_registerFont(this.__wbg_ptr, font);
		if (ret[2]) throw takeFromExternrefTable0(ret[1]);
		return takeFromExternrefTable0(ret[0]);
	}
	/**
	* Renders a node tree into an image buffer.
	* @param {Node} node
	* @param {RenderOptions | null} [options]
	* @returns {Uint8Array}
	*/
	render(node, options) {
		const ret = wasm.renderer_render(this.__wbg_ptr, node, isLikeNone(options) ? 0 : addToExternrefTable0(options));
		if (ret[3]) throw takeFromExternrefTable0(ret[2]);
		var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
		wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
		return v1;
	}
	/**
	* Renders a sequential animation timeline into a buffer.
	* @param {RenderAnimationOptions} options
	* @returns {Uint8Array}
	*/
	renderAnimation(options) {
		const ret = wasm.renderer_renderAnimation(this.__wbg_ptr, options);
		if (ret[3]) throw takeFromExternrefTable0(ret[2]);
		var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
		wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
		return v1;
	}
	/**
	* Renders a node tree into a data URL.
	*
	* `raw` format is not supported for data URL.
	* @param {Node} node
	* @param {RenderOptions} options
	* @returns {string}
	*/
	renderAsDataUrl(node, options) {
		let deferred2_0;
		let deferred2_1;
		try {
			const ret = wasm.renderer_renderAsDataUrl(this.__wbg_ptr, node, options);
			var ptr1 = ret[0];
			var len1 = ret[1];
			if (ret[3]) {
				ptr1 = 0;
				len1 = 0;
				throw takeFromExternrefTable0(ret[2]);
			}
			deferred2_0 = ptr1;
			deferred2_1 = len1;
			return getStringFromWasm0(ptr1, len1);
		} finally {
			wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
		}
	}
	/**
	* Renders a node tree into an SVG document string.
	* @param {Node} node
	* @param {SvgRenderOptions | null} [options]
	* @returns {string}
	*/
	renderSvg(node, options) {
		let deferred2_0;
		let deferred2_1;
		try {
			const ret = wasm.renderer_renderSvg(this.__wbg_ptr, node, isLikeNone(options) ? 0 : addToExternrefTable0(options));
			var ptr1 = ret[0];
			var len1 = ret[1];
			if (ret[3]) {
				ptr1 = 0;
				len1 = 0;
				throw takeFromExternrefTable0(ret[2]);
			}
			deferred2_0 = ptr1;
			deferred2_1 = len1;
			return getStringFromWasm0(ptr1, len1);
		} finally {
			wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
		}
	}
};
if (Symbol.dispose) Renderer$1.prototype[Symbol.dispose] = Renderer$1.prototype.free;
function __wbg_get_imports() {
	return {
		__proto__: null,
		"./takumi_wasm_bg.js": {
			__proto__: null,
			__wbg_Error_92b29b0548f8b746: function(arg0, arg1) {
				return Error(getStringFromWasm0(arg0, arg1));
			},
			__wbg_Number_9a4e0ecb0fa16705: function(arg0) {
				return Number(arg0);
			},
			__wbg_String_8564e559799eccda: function(arg0, arg1) {
				const ptr1 = passStringToWasm0(String(arg1), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_bigint_get_as_i64_d968e41184ae354f: function(arg0, arg1) {
				const v = arg1;
				const ret = typeof v === "bigint" ? v : void 0;
				getDataViewMemory0().setBigInt64(arg0 + 8, isLikeNone(ret) ? BigInt(0) : ret, true);
				getDataViewMemory0().setInt32(arg0 + 0, !isLikeNone(ret), true);
			},
			__wbg___wbindgen_boolean_get_fa956cfa2d1bd751: function(arg0) {
				const v = arg0;
				const ret = typeof v === "boolean" ? v : void 0;
				return isLikeNone(ret) ? 16777215 : ret ? 1 : 0;
			},
			__wbg___wbindgen_debug_string_c25d447a39f5578f: function(arg0, arg1) {
				const ptr1 = passStringToWasm0(debugString(arg1), wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				const len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_in_aca499c5de7ff5e5: function(arg0, arg1) {
				return arg0 in arg1;
			},
			__wbg___wbindgen_is_bigint_2f76dc55065b4273: function(arg0) {
				return typeof arg0 === "bigint";
			},
			__wbg___wbindgen_is_function_1ff95bcc5517c252: function(arg0) {
				return typeof arg0 === "function";
			},
			__wbg___wbindgen_is_object_a27215656b807791: function(arg0) {
				const val = arg0;
				return typeof val === "object" && val !== null;
			},
			__wbg___wbindgen_is_string_ea5e6cc2e4141dfe: function(arg0) {
				return typeof arg0 === "string";
			},
			__wbg___wbindgen_is_undefined_c05833b95a3cf397: function(arg0) {
				return arg0 === void 0;
			},
			__wbg___wbindgen_jsval_eq_e659fcf7b0e32763: function(arg0, arg1) {
				return arg0 === arg1;
			},
			__wbg___wbindgen_jsval_loose_eq_db4c3b15f63fc170: function(arg0, arg1) {
				return arg0 == arg1;
			},
			__wbg___wbindgen_number_get_394265ed1e1b84ee: function(arg0, arg1) {
				const obj = arg1;
				const ret = typeof obj === "number" ? obj : void 0;
				getDataViewMemory0().setFloat64(arg0 + 8, isLikeNone(ret) ? 0 : ret, true);
				getDataViewMemory0().setInt32(arg0 + 0, !isLikeNone(ret), true);
			},
			__wbg___wbindgen_string_get_b0ca35b86a603356: function(arg0, arg1) {
				const obj = arg1;
				const ret = typeof obj === "string" ? obj : void 0;
				var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
				var len1 = WASM_VECTOR_LEN;
				getDataViewMemory0().setInt32(arg0 + 4, len1, true);
				getDataViewMemory0().setInt32(arg0 + 0, ptr1, true);
			},
			__wbg___wbindgen_throw_344f42d3211c4765: function(arg0, arg1) {
				throw new Error(getStringFromWasm0(arg0, arg1));
			},
			__wbg_call_8a2dd23819f8a60a: function() {
				return handleError(function(arg0, arg1) {
					return arg0.call(arg1);
				}, arguments);
			},
			__wbg_done_89b2b13e91a60321: function(arg0) {
				return arg0.done;
			},
			__wbg_entries_015dc610cd81ede0: function(arg0) {
				return Object.entries(arg0);
			},
			__wbg_get_507a50627bffa49b: function(arg0, arg1) {
				return arg0[arg1 >>> 0];
			},
			__wbg_get_c7eb1f358a7654df: function() {
				return handleError(function(arg0, arg1) {
					return Reflect.get(arg0, arg1);
				}, arguments);
			},
			__wbg_get_unchecked_6e0ad6d2a41b06f6: function(arg0, arg1) {
				return arg0[arg1 >>> 0];
			},
			__wbg_get_with_ref_key_6412cf3094599694: function(arg0, arg1) {
				return arg0[arg1];
			},
			__wbg_instanceof_ArrayBuffer_4480b9e0068a8adb: function(arg0) {
				let result;
				try {
					result = arg0 instanceof ArrayBuffer;
				} catch (_) {
					result = false;
				}
				return result;
			},
			__wbg_instanceof_Map_e5b5e3db98422fcc: function(arg0) {
				let result;
				try {
					result = arg0 instanceof Map;
				} catch (_) {
					result = false;
				}
				return result;
			},
			__wbg_instanceof_Uint8Array_309b927aaf7a3fc7: function(arg0) {
				let result;
				try {
					result = arg0 instanceof Uint8Array;
				} catch (_) {
					result = false;
				}
				return result;
			},
			__wbg_isArray_0677c962b281d01a: function(arg0) {
				return Array.isArray(arg0);
			},
			__wbg_isSafeInteger_04f36e4056f1b851: function(arg0) {
				return Number.isSafeInteger(arg0);
			},
			__wbg_iterator_6f722e4a93058b71: function() {
				return Symbol.iterator;
			},
			__wbg_length_1f0964f4a5e2c6d8: function(arg0) {
				return arg0.length;
			},
			__wbg_length_370319915dc99107: function(arg0) {
				return arg0.length;
			},
			__wbg_new_32b398fb48b6d94a: function() {
				return new Array();
			},
			__wbg_new_b667d279fd5aa943: function(arg0, arg1) {
				return new Error(getStringFromWasm0(arg0, arg1));
			},
			__wbg_new_cd45aabdf6073e84: function(arg0) {
				return new Uint8Array(arg0);
			},
			__wbg_new_da52cf8fe3429cb2: function() {
				return /* @__PURE__ */ new Object();
			},
			__wbg_next_6dbf2c0ac8cde20f: function(arg0) {
				return arg0.next;
			},
			__wbg_next_71f2aa1cb3d1e37e: function() {
				return handleError(function(arg0) {
					return arg0.next();
				}, arguments);
			},
			__wbg_prototypesetcall_4770620bbe4688a0: function(arg0, arg1, arg2) {
				Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
			},
			__wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
				arg0[arg1] = arg2;
			},
			__wbg_set_8a16b38e4805b298: function(arg0, arg1, arg2) {
				arg0[arg1 >>> 0] = arg2;
			},
			__wbg_value_a5d5488a9589444a: function(arg0) {
				return arg0.value;
			},
			__wbindgen_cast_0000000000000001: function(arg0) {
				return arg0;
			},
			__wbindgen_cast_0000000000000002: function(arg0) {
				return arg0;
			},
			__wbindgen_cast_0000000000000003: function(arg0, arg1) {
				return getStringFromWasm0(arg0, arg1);
			},
			__wbindgen_cast_0000000000000004: function(arg0) {
				return BigInt.asUintN(64, arg0);
			},
			__wbindgen_init_externref_table: function() {
				const table = wasm.__wbindgen_externrefs;
				const offset = table.grow(4);
				table.set(0, void 0);
				table.set(offset + 0, void 0);
				table.set(offset + 1, null);
				table.set(offset + 2, true);
				table.set(offset + 3, false);
			}
		}
	};
}
var RendererFinalization = typeof FinalizationRegistry === "undefined" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((ptr) => wasm.__wbg_renderer_free(ptr, 1));
function addToExternrefTable0(obj) {
	const idx = wasm.__externref_table_alloc();
	wasm.__wbindgen_externrefs.set(idx, obj);
	return idx;
}
function debugString(val) {
	const type = typeof val;
	if (type == "number" || type == "boolean" || val == null) return `${val}`;
	if (type == "string") return `"${val}"`;
	if (type == "symbol") {
		const description = val.description;
		if (description == null) return "Symbol";
		else return `Symbol(${description})`;
	}
	if (type == "function") {
		const name = val.name;
		if (typeof name == "string" && name.length > 0) return `Function(${name})`;
		else return "Function";
	}
	if (Array.isArray(val)) {
		const length = val.length;
		let debug = "[";
		if (length > 0) debug += debugString(val[0]);
		for (let i = 1; i < length; i++) debug += ", " + debugString(val[i]);
		debug += "]";
		return debug;
	}
	const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
	let className;
	if (builtInMatches && builtInMatches.length > 1) className = builtInMatches[1];
	else return toString.call(val);
	if (className == "Object") try {
		return "Object(" + JSON.stringify(val) + ")";
	} catch (_) {
		return "Object";
	}
	if (val instanceof Error) return `${val.name}: ${val.message}\n${val.stack}`;
	return className;
}
function getArrayU8FromWasm0(ptr, len) {
	ptr = ptr >>> 0;
	return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
var cachedDataViewMemory0 = null;
function getDataViewMemory0() {
	if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
	return cachedDataViewMemory0;
}
function getStringFromWasm0(ptr, len) {
	return decodeText(ptr >>> 0, len);
}
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
	if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
	return cachedUint8ArrayMemory0;
}
function handleError(f, args) {
	try {
		return f.apply(this, args);
	} catch (e) {
		const idx = addToExternrefTable0(e);
		wasm.__wbindgen_exn_store(idx);
	}
}
function isLikeNone(x) {
	return x === void 0 || x === null;
}
function passStringToWasm0(arg, malloc, realloc) {
	if (realloc === void 0) {
		const buf = cachedTextEncoder.encode(arg);
		const ptr = malloc(buf.length, 1) >>> 0;
		getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
		WASM_VECTOR_LEN = buf.length;
		return ptr;
	}
	let len = arg.length;
	let ptr = malloc(len, 1) >>> 0;
	const mem = getUint8ArrayMemory0();
	let offset = 0;
	for (; offset < len; offset++) {
		const code = arg.charCodeAt(offset);
		if (code > 127) break;
		mem[ptr + offset] = code;
	}
	if (offset !== len) {
		if (offset !== 0) arg = arg.slice(offset);
		ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
		const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
		const ret = cachedTextEncoder.encodeInto(arg, view);
		offset += ret.written;
		ptr = realloc(ptr, len, offset, 1) >>> 0;
	}
	WASM_VECTOR_LEN = offset;
	return ptr;
}
function takeFromExternrefTable0(idx) {
	const value = wasm.__wbindgen_externrefs.get(idx);
	wasm.__externref_table_dealloc(idx);
	return value;
}
var cachedTextDecoder = new TextDecoder("utf-8", {
	ignoreBOM: true,
	fatal: true
});
cachedTextDecoder.decode();
var MAX_SAFARI_DECODE_BYTES = 2146435072;
var numBytesDecoded = 0;
function decodeText(ptr, len) {
	numBytesDecoded += len;
	if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
		cachedTextDecoder = new TextDecoder("utf-8", {
			ignoreBOM: true,
			fatal: true
		});
		cachedTextDecoder.decode();
		numBytesDecoded = len;
	}
	return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
var cachedTextEncoder = new TextEncoder();
if (!("encodeInto" in cachedTextEncoder)) cachedTextEncoder.encodeInto = function(arg, view) {
	const buf = cachedTextEncoder.encode(arg);
	view.set(buf);
	return {
		read: arg.length,
		written: buf.length
	};
};
var WASM_VECTOR_LEN = 0;
var wasm;
function __wbg_finalize_init(instance, module) {
	wasm = instance.exports;
	cachedDataViewMemory0 = null;
	cachedUint8ArrayMemory0 = null;
	wasm.__wbindgen_start();
	return wasm;
}
async function __wbg_load(module, imports) {
	if (typeof Response === "function" && module instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming === "function") try {
			return await WebAssembly.instantiateStreaming(module, imports);
		} catch (e) {
			if (module.ok && expectedResponseType(module.type) && module.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
			else throw e;
		}
		const bytes = await module.arrayBuffer();
		return await WebAssembly.instantiate(bytes, imports);
	} else {
		const instance = await WebAssembly.instantiate(module, imports);
		if (instance instanceof WebAssembly.Instance) return {
			instance,
			module
		};
		else return instance;
	}
	function expectedResponseType(type) {
		switch (type) {
			case "basic":
			case "cors":
			case "default": return true;
		}
		return false;
	}
}
function initSync(module) {
	if (wasm !== void 0) return wasm;
	if (module !== void 0) if (Object.getPrototypeOf(module) === Object.prototype) ({module} = module);
	else console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
	const imports = __wbg_get_imports();
	if (!(module instanceof WebAssembly.Module)) module = new WebAssembly.Module(module);
	return __wbg_finalize_init(new WebAssembly.Instance(module, imports), module);
}
async function __wbg_init(module_or_path) {
	if (wasm !== void 0) return wasm;
	if (module_or_path !== void 0) if (Object.getPrototypeOf(module_or_path) === Object.prototype) ({module_or_path} = module_or_path);
	else console.warn("using deprecated parameters for the initialization function; pass a single object instead");
	const imports = __wbg_get_imports();
	if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) module_or_path = fetch(module_or_path);
	const { instance, module } = await __wbg_load(await module_or_path, imports);
	return __wbg_finalize_init(instance, module);
}
var Renderer = class {
	inner = new Renderer$1();
	fonts = new o((font) => this.inner.registerFont(font));
	async render(node, options) {
		const { options: opts } = await s(this.fonts, options ?? {}, node);
		return this.inner.render(node, opts);
	}
	async renderAsDataUrl(node, options) {
		const { options: opts } = await s(this.fonts, options ?? {}, node);
		return this.inner.renderAsDataUrl(node, opts);
	}
	async renderSvg(node, options) {
		const { options: opts } = await s(this.fonts, options ?? {}, node);
		return this.inner.renderSvg(node, opts);
	}
	async measure(node, options) {
		const { options: opts } = await s(this.fonts, options ?? {}, node);
		return this.inner.measure(node, opts);
	}
	async renderAnimation(options) {
		const nodes = options.scenes.map((scene) => scene.node);
		const { options: opts } = await s(this.fonts, options, nodes);
		return this.inner.renderAnimation(opts);
	}
	registerFont(font) {
		return this.fonts.register(font);
	}
	/** Releases the underlying wasm renderer's memory. */
	free() {
		this.inner.free();
	}
};
//#endregion
//#region node_modules/takumi-js/dist/wasm-init-DzwbPAKW.mjs
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var wasm_init_exports = /* @__PURE__ */ __exportAll({ initWasm: () => initWasm });
/**
* Initializes the WASM bindings, preferring a caller-supplied `module` and
* falling back to the per-bundler binary picked by the import condition.
* `@takumi-rs/wasm` guards against double init, so a binary already loaded by
* `@takumi-rs/wasm/auto` (e.g. on Deno) makes this a no-op.
*/
async function initWasm(module, fallback) {
	const source = module ?? fallback;
	const resolved = typeof source === "function" ? await source() : await source;
	const input = resolved !== null && typeof resolved === "object" && "default" in resolved ? resolved.default : resolved;
	await __wbg_init(input ? { module_or_path: input } : void 0);
	return export_exports;
}
//#endregion
export { initSync as i, wasm_init_exports as n, __wbg_init as r, initWasm as t };
