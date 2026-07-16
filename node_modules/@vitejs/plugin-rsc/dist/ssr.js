import { a as toReferenceValidationVirtual, i as toCssVirtual } from "./shared-DeahDSXi.js";
import { createServerConsumerManifest, setRequireModule } from "./core/ssr.js";
import { callServer, createFromReadableStream, createServerReference, findSourceMapURL } from "./react/ssr.js";
import * as clientReferences from "virtual:vite-rsc/client-references";
import * as ReactDOM from "react-dom";
import assetsManifest from "virtual:vite-rsc/assets-manifest";
//#region src/ssr.tsx
let onClientReference;
/**
* Register a callback to be notified when client reference dependencies are loaded.
* Called during SSR when a client component is accessed.
* @experimental
*/
function setOnClientReference(callback) {
	onClientReference = callback;
}
initialize();
function initialize() {
	setRequireModule({ load: async (id) => {
		if (!import.meta.env.__vite_rsc_build__) {
			await import(
				/* @vite-ignore */
				"/@id/__x00__" + toReferenceValidationVirtual({
					id,
					type: "client"
				})
);
			return wrapResourceProxy(await import(
				/* @vite-ignore */
				id
), id, {
				js: [],
				css: (await import(
					/* @vite-ignore */
					"/@id/__x00__" + toCssVirtual({
						id,
						type: "ssr"
					})
)).default
			});
		} else {
			const import_ = clientReferences.default[id];
			if (!import_) throw new Error(`client reference not found '${id}'`);
			const deps = assetsManifest.clientReferenceDeps[id] ?? {
				js: [],
				css: []
			};
			preloadDeps(deps);
			onClientReference?.({
				id,
				deps
			});
			return wrapResourceProxy(await import_(), id, deps);
		}
	} });
}
function wrapResourceProxy(mod, id, deps) {
	return new Proxy(mod, { get(target, p, receiver) {
		if (p in mod) {
			preloadDeps(deps);
			onClientReference?.({
				id,
				deps
			});
		}
		return Reflect.get(target, p, receiver);
	} });
}
function preloadDeps(deps) {
	for (const href of deps.js) ReactDOM.preloadModule(href, {
		as: "script",
		crossOrigin: ""
	});
	for (const href of deps.css) ReactDOM.preinit(href, {
		as: "style",
		precedence: assetsManifest.cssLinkPrecedence !== false ? "vite-rsc/client-reference" : void 0
	});
}
//#endregion
export { callServer, createFromReadableStream, createServerConsumerManifest, createServerReference, findSourceMapURL, setOnClientReference, setRequireModule };
