import { t as initWasm } from "../wasm-init-DzwbPAKW.mjs";
import autoModule from "@takumi-rs/wasm/auto";
//#region src/backend/wasm.ts
const loadBackend = (module) => initWasm(module, autoModule);
//#endregion
export { loadBackend };
