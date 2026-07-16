import { setRequireModule } from "./core/browser.js";
import { callServer, createFromFetch, createFromReadableStream, createServerReference, createTemporaryReferenceSet, encodeReply, findSourceMapURL, setServerCallback } from "./react/browser.js";
import * as clientReferences from "virtual:vite-rsc/client-references";
//#region src/browser.ts
initialize();
function initialize() {
	setRequireModule({ load: async (id) => {
		if (!import.meta.env.__vite_rsc_build__) return __vite_rsc_raw_import__(withTrailingSlash(import.meta.env.BASE_URL) + id.slice(1));
		else {
			const import_ = clientReferences.default[id];
			if (!import_) throw new Error(`client reference not found '${id}'`);
			return import_();
		}
	} });
}
function withTrailingSlash(path) {
	if (path[path.length - 1] !== "/") return `${path}/`;
	return path;
}
//#endregion
export { callServer, createFromFetch, createFromReadableStream, createServerReference, createTemporaryReferenceSet, encodeReply, findSourceMapURL, setRequireModule, setServerCallback };
