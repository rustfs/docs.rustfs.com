import { createServerConsumerManifest, setRequireModule } from "../core/ssr.js";
import * as ReactClient from "@vitejs/plugin-rsc/vendor/react-server-dom/client.edge";
//#region src/react/ssr.ts
function createFromReadableStream(stream, options = {}) {
	return ReactClient.createFromReadableStream(stream, {
		serverConsumerManifest: createServerConsumerManifest(),
		...options
	});
}
function createServerReference(id) {
	return ReactClient.createServerReference(id);
}
const callServer = null;
const findSourceMapURL = null;
//#endregion
export { callServer, createFromReadableStream, createServerReference, findSourceMapURL, setRequireModule };
