const require_rolldown_runtime = require("./rolldown-runtime-DakpK96I.cjs");
const require_wasm_init = require("./wasm-init-H65IoN11.cjs");
let _takumi_rs_wasm_node = require("@takumi-rs/wasm/node");
_takumi_rs_wasm_node = require_rolldown_runtime.__toESM(_takumi_rs_wasm_node, 1);
//#region src/backend/wasm-node.ts
const loadBackend = (module) => require_wasm_init.initWasm(module, _takumi_rs_wasm_node.default);
//#endregion
exports.loadBackend = loadBackend;
