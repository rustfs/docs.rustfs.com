import { createClientManifest, createServerDecodeClientManifest, createServerManifest, loadServerAction, setRequireModule } from "../core/rsc.js";
import * as ReactClient from "@vitejs/plugin-rsc/vendor/react-server-dom/client.edge";
import * as ReactServer from "@vitejs/plugin-rsc/vendor/react-server-dom/server.edge";
//#region src/react/rsc.ts
function renderToReadableStream(data, options, extraOptions) {
	return ReactServer.renderToReadableStream(data, createClientManifest({ onClientReference: extraOptions?.onClientReference }), options);
}
function createFromReadableStream(stream, options = {}) {
	return ReactClient.createFromReadableStream(stream, {
		serverConsumerManifest: {
			serverModuleMap: createServerManifest(),
			moduleMap: createServerDecodeClientManifest()
		},
		...options
	});
}
function registerClientReference(proxy, id, name) {
	return ReactServer.registerClientReference(proxy, id, name);
}
const registerServerReference = ReactServer.registerServerReference;
const decodeReply = (body, options) => ReactServer.decodeReply(body, createServerManifest(), options);
function decodeAction(body) {
	return ReactServer.decodeAction(body, createServerManifest());
}
function decodeFormState(actionResult, body) {
	return ReactServer.decodeFormState(actionResult, body, createServerManifest());
}
const createTemporaryReferenceSet = ReactServer.createTemporaryReferenceSet;
const encodeReply = ReactClient.encodeReply;
const createClientTemporaryReferenceSet = ReactClient.createTemporaryReferenceSet;
//#endregion
export { createClientTemporaryReferenceSet, createFromReadableStream, createTemporaryReferenceSet, decodeAction, decodeFormState, decodeReply, encodeReply, loadServerAction, registerClientReference, registerServerReference, renderToReadableStream, setRequireModule };
