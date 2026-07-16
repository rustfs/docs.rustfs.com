import { a as toReferenceValidationVirtual } from "./shared-DeahDSXi.js";
import { createClientManifest, createServerManifest, loadServerAction, setRequireModule } from "./core/rsc.js";
import { createClientTemporaryReferenceSet, createFromReadableStream, createTemporaryReferenceSet, decodeAction, decodeFormState, decodeReply, encodeReply, registerClientReference, registerServerReference, renderToReadableStream as renderToReadableStream$1 } from "./react/rsc.js";
import { decryptActionBoundArgs, encryptActionBoundArgs } from "./utils/encryption-runtime.js";
import assetsManifest from "virtual:vite-rsc/assets-manifest";
import serverReferences from "virtual:vite-rsc/server-references";
//#region src/rsc.tsx
initialize();
function initialize() {
	setRequireModule({ load: async (id) => {
		if (!import.meta.env.__vite_rsc_build__) {
			await import(
				/* @vite-ignore */
				"/@id/__x00__" + toReferenceValidationVirtual({
					id,
					type: "server"
				})
);
			return import(
				/* @vite-ignore */
				id
);
		} else {
			const import_ = serverReferences[id];
			if (!import_) throw new Error(`server reference not found '${id}'`);
			return import_();
		}
	} });
}
function renderToReadableStream(data, options, extraOptions) {
	return renderToReadableStream$1(data, options, { onClientReference(metadata) {
		const deps = assetsManifest.clientReferenceDeps[metadata.id] ?? {
			js: [],
			css: []
		};
		extraOptions?.onClientReference?.({
			id: metadata.id,
			name: metadata.name,
			deps
		});
	} });
}
//#endregion
export { createClientManifest, createClientTemporaryReferenceSet, createFromReadableStream, createServerManifest, createTemporaryReferenceSet, decodeAction, decodeFormState, decodeReply, decryptActionBoundArgs, encodeReply, encryptActionBoundArgs, loadServerAction, registerClientReference, registerServerReference, renderToReadableStream, setRequireModule };
