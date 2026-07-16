import { i as initSync, r as __wbg_init, t as initWasm } from "./wasm-init-DzwbPAKW-CfEpZcQM.js";
import { readFileSync } from "node:fs";
initSync({ module: readFileSync(new URL("../pkg/takumi_wasm_bg.wasm", import.meta.url)) });
var node_default = __wbg_init;
//#endregion
//#region node_modules/takumi-js/dist/wasm-node-BsD8jxba.mjs
var loadBackend = (module) => initWasm(module, node_default);
//#endregion
export { loadBackend };
