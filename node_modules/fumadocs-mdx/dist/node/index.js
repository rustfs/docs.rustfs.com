import * as module from "node:module";
//#region src/node/index.ts
function register(options = {}) {
	module.register("./_loader.js", import.meta.url, { data: options });
}
//#endregion
export { register };
