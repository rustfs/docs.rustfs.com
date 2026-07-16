const require_rolldown_runtime = require("./rolldown-runtime-DakpK96I.cjs");
let _takumi_rs_wasm = require("@takumi-rs/wasm");
_takumi_rs_wasm = require_rolldown_runtime.__toESM(_takumi_rs_wasm, 1);
//#region src/backend/wasm-init.ts
var wasm_init_exports = /* @__PURE__ */ require_rolldown_runtime.__exportAll({ initWasm: () => initWasm });
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
	await _takumi_rs_wasm.default(input ? { module_or_path: input } : void 0);
	return _takumi_rs_wasm;
}
//#endregion
Object.defineProperty(exports, "initWasm", {
	enumerable: true,
	get: function() {
		return initWasm;
	}
});
Object.defineProperty(exports, "wasm_init_exports", {
	enumerable: true,
	get: function() {
		return wasm_init_exports;
	}
});
