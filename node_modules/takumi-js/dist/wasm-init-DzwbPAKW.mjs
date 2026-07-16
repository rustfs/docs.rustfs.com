import * as wasm from "@takumi-rs/wasm";
//#region \0rolldown/runtime.js
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
//#endregion
//#region src/backend/wasm-init.ts
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
	await wasm.default(input ? { module_or_path: input } : void 0);
	return wasm;
}
//#endregion
export { wasm_init_exports as n, initWasm as t };
