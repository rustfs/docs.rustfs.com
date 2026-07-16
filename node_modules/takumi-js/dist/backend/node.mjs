//#region src/backend/node.ts
const loadNative = () => import("@takumi-rs/core").catch((cause) => {
	throw new Error("Failed to load the native @takumi-rs/core backend. On a runtime without the native addon, pass a `module` (a WASM binary) to render with the WASM backend instead.", { cause });
});
const loadWasm = (module) => import("../wasm-node-BsD8jxba.mjs").then((backend) => backend.loadBackend(module));
const loadBackend = (module) => typeof process !== "undefined" && process.versions?.webcontainer ? loadWasm(module) : loadNative(module);
//#endregion
export { loadBackend };
