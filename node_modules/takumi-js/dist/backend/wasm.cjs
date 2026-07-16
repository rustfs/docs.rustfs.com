Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("../rolldown-runtime-DakpK96I.cjs");
const require_wasm_init = require("../wasm-init-H65IoN11.cjs");
let _takumi_rs_wasm_auto = require("@takumi-rs/wasm/auto");
_takumi_rs_wasm_auto = require_rolldown_runtime.__toESM(_takumi_rs_wasm_auto, 1);
//#region src/backend/wasm.ts
const loadBackend = (module) => require_wasm_init.initWasm(module, _takumi_rs_wasm_auto.default);
//#endregion
exports.loadBackend = loadBackend;
