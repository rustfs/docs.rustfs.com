import { r as setAllEnv, t as waku_server_default } from "./assets/waku.server-coGNr6v3.js";
//#region node_modules/waku/dist/lib/vite-entries/entry.server.js
async function INTERNAL_runFetch(env, req, ...args) {
	setAllEnv(env);
	return waku_server_default.fetch(req, ...args);
}
var entry_server_default = waku_server_default.defaultExport;
//#endregion
export { INTERNAL_runFetch, entry_server_default as default, waku_server_default as unstable_serverEntry };
