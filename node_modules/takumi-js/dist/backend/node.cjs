Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/backend/node.ts
const loadNative = () => import("@takumi-rs/core").catch((cause) => {
	throw new Error("Failed to load the native @takumi-rs/core backend. On a runtime without the native addon, pass a `module` (a WASM binary) to render with the WASM backend instead.", { cause });
});
const loadWasm = (module) => Promise.resolve().then(() => require("../wasm-node-CaSIdQS-.cjs")).then((backend) => backend.loadBackend(module));
const loadBackend = (module) => typeof process !== "undefined" && process.versions?.webcontainer ? loadWasm(module) : loadNative(module);
//#endregion
exports.loadBackend = loadBackend;
