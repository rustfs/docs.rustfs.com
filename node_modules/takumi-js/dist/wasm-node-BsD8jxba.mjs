import { t as initWasm } from "./wasm-init-DzwbPAKW.mjs";
import wasmModule from "@takumi-rs/wasm/node";
//#region src/backend/wasm-node.ts
const loadBackend = (module) => initWasm(module, wasmModule);
//#endregion
export { loadBackend };
