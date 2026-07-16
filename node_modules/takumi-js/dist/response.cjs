Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_render = require("./render-B-wtWqlt.cjs");
//#region src/response/index.ts
const contentTypeMap = {
	png: "image/png",
	jpeg: "image/jpeg",
	webp: "image/webp",
	ico: "image/x-icon",
	raw: "application/octet-stream"
};
function defaultErrorHandler(error) {
	console.error("Failed to render image.");
	console.error(error);
}
function buildImageResponse(element, options) {
	let resolveReady;
	let rejectReady;
	const ready = new Promise((resolve, reject) => {
		resolveReady = resolve;
		rejectReady = reject;
	});
	ready.catch(() => {});
	const stream = new ReadableStream({ async start(controller) {
		try {
			const image = await require_render.render(element, options);
			controller.enqueue(image);
			controller.close();
			resolveReady();
		} catch (error) {
			controller.error(error);
			rejectReady(error);
			await (options?.onError ?? defaultErrorHandler)(error);
		}
	} });
	const headers = new Headers(options?.headers);
	if (!headers.get("content-type")) headers.set("content-type", contentTypeMap[options?.format ?? "png"]);
	const response = new Response(stream, {
		headers,
		status: options?.status,
		statusText: options?.statusText
	});
	return Object.defineProperty(response, "ready", {
		enumerable: false,
		value: ready,
		writable: false
	});
}
/**
* A universal ImageResponse class for generating images in API routes.
*
* Drop-in compatible with `next/og`'s `ImageResponse`. It supports React elements,
* custom fonts, Tailwind CSS (via `tw` prop), and various image formats.
*
* @example
* ```tsx
* import { ImageResponse } from "takumi-js/response";
*
* export function GET() {
*   return new ImageResponse(
*     <div tw="flex h-full w-full items-center justify-center bg-white">
*       <h1 tw="text-6xl font-bold">Hello World</h1>
*     </div>,
*     { width: 1200, height: 630 }
*   );
* }
* ```
*
* @param component - The JSX element to render.
* @param options - Rendering and response options.
*/
var ImageResponse = class extends Response {
	ready;
	constructor(component, options) {
		const response = buildImageResponse(component, options);
		super(response.body, response);
		this.ready = response.ready;
	}
};
//#endregion
exports.ImageResponse = ImageResponse;
exports.default = ImageResponse;
