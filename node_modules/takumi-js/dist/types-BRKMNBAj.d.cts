import * as napi from "@takumi-rs/core";
import * as wasm from "@takumi-rs/wasm";
//#region src/backend/types.d.ts
/** The bindings namespace, whichever backend the import conditions selected. */
type Backend = typeof napi | typeof wasm;
/** A WASM binary, or something that resolves to one, for manual initialization. */
type BackendModule = wasm.InitInput | {
  default: wasm.InitInput;
} | Promise<wasm.InitInput | {
  default: wasm.InitInput;
}> | (() => Promise<wasm.InitInput | {
  default: wasm.InitInput;
}>);
type LoadBackend = (module?: BackendModule) => Promise<Backend>;
//#endregion
export { LoadBackend as t };