let _takumi_rs_helpers_emoji = require("@takumi-rs/helpers/emoji");
let _takumi_rs_helpers = require("@takumi-rs/helpers");
let _takumi_rs_helpers_jsx = require("@takumi-rs/helpers/jsx");
let _backend = require("#backend");
let _takumi_rs_helpers_html = require("@takumi-rs/helpers/html");
//#region src/import.ts
let importPromise = null;
/**
* Resolves the rendering backend once and caches it. With no `module`, the
* `#backend` import conditions pick it (napi on Node/Bun, WASM elsewhere). An
* explicit `module` is a WASM binary, so it forces WASM — the escape hatch for a
* Node target that can't load the native addon. A failed load clears the cache.
*/
function getImports(module) {
	importPromise ??= (module === void 0 ? (0, _backend.loadBackend)() : Promise.resolve().then(() => require("./wasm-init-H65IoN11.cjs")).then((n) => n.wasm_init_exports).then(({ initWasm }) => initWasm(module))).catch((error) => {
		importPromise = null;
		throw error;
	});
	return importPromise;
}
//#endregion
//#region src/render.ts
let globalRenderer;
function isTakumiNode(element) {
	if (typeof element !== "object" || element === null || !("type" in element)) return false;
	return element.type === "container" || element.type === "text" || element.type === "image";
}
async function transformElement(element, options) {
	if (isTakumiNode(element)) return {
		node: element,
		stylesheets: []
	};
	if (typeof element === "string") return (0, _takumi_rs_helpers_html.fromHtml)(element);
	return (0, _takumi_rs_helpers_jsx.fromJsx)(element, options?.jsx);
}
/** Resolves the renderer to use: a caller-supplied one, or the shared global. */
async function resolveRenderer(options) {
	if (options && "renderer" in options && options.renderer) return options.renderer;
	const imports = await getImports(options?.module);
	return globalRenderer ??= new imports.Renderer();
}
/** Transforms an input into a node tree and extracts its emojis. */
async function resolveContent(element, options) {
	const { node: originalNode, stylesheets } = await transformElement(element, options);
	const emojiType = options?.emoji ?? "twemoji";
	return {
		node: emojiType !== "from-font" ? (0, _takumi_rs_helpers_emoji.extractEmojis)(originalNode, emojiType) : originalNode,
		stylesheets
	};
}
/** Resolves the render's `images` option into concrete entries via {@link prepareImages}. */
async function collectImages(node, options) {
	const images = options?.images;
	const { sources, fetchCache, fetch, timeout, maxBytes, allowUrl, cache } = Array.isArray(images) ? { sources: images } : images ?? {};
	const prepared = await (0, _takumi_rs_helpers.prepareImages)({
		node,
		sources,
		fetchCache,
		fetch,
		timeout,
		maxBytes,
		allowUrl,
		signal: options?.signal
	});
	return cache ? prepared.map((image) => ({
		...image,
		cache: ("cache" in image ? image.cache : void 0) ?? cache
	})) : prepared;
}
function mergeStylesheets(options, extra) {
	return [...options?.stylesheets ?? [], ...extra];
}
/**
* Renders a React element, HTML string, or Takumi node tree into an image.
*
* This function automatically detects the best renderer for your environment (native Rust on Node.js,
* WASM on Edge/Workers) and handles fetching fonts and images, and emoji extraction.
*
* @example
* ```tsx
* import { render } from "takumi-js";
*
* const buffer = await render(
*   <div tw="bg-blue-500 text-white p-4">Hello World</div>,
*   { width: 1200, height: 630 }
* );
* ```
*
* @param element - The content to render. Can be a JSX element (React-like), an HTML string, or a pre-constructed node tree.
* @param options - Configuration for rendering, including dimensions, format, fonts, and more.
* @returns A promise that resolves to the rendered image data (Buffer/Uint8Array).
*/
async function render(element, options) {
	options?.signal?.throwIfAborted();
	const renderer = await resolveRenderer(options);
	const { node, stylesheets } = await resolveContent(element, options);
	const images = await collectImages(node, options);
	options?.signal?.throwIfAborted();
	return renderer.render(node, {
		...options,
		images,
		stylesheets: mergeStylesheets(options, stylesheets)
	});
}
/**
* Renders a React element, HTML string, or Takumi node tree into a vector SVG
* document string.
*
* Same input handling and image pipeline as {@link render}, but emits real SVG
* (`<rect>`, `<path>`, gradients, glyph outlines, embedded images) instead of a
* raster bitmap.
*
* @example
* ```tsx
* import { renderSvg } from "takumi-js";
*
* const svg = await renderSvg(
*   <div tw="bg-blue-500 text-white p-4">Hello World</div>,
*   { width: 1200, height: 630 }
* );
* ```
*
* @returns A promise that resolves to the SVG document string.
*/
async function renderSvg(element, options) {
	options?.signal?.throwIfAborted();
	const renderer = await resolveRenderer(options);
	const { node, stylesheets } = await resolveContent(element, options);
	const images = await collectImages(node, options);
	options?.signal?.throwIfAborted();
	return renderer.renderSvg(node, {
		...options,
		images,
		stylesheets: mergeStylesheets(options, stylesheets)
	});
}
/**
* Renders a sequence of scenes into an animated image (WebP / APNG / GIF).
*
* Each scene's content goes through the same input handling and image pipeline
* as {@link render}; images are fetched once across all scenes.
*
* @example
* ```tsx
* import { renderAnimation } from "takumi-js";
*
* const webp = await renderAnimation({
*   width: 600,
*   height: 400,
*   fps: 30,
*   format: "webp",
*   scenes: [
*     { node: <div tw="bg-red-500 w-full h-full" />, durationMs: 500 },
*     { node: <div tw="bg-blue-500 w-full h-full" />, durationMs: 500 },
*   ],
* });
* ```
*
* @returns A promise that resolves to the encoded animation (Buffer/Uint8Array).
*/
async function renderAnimation(options) {
	options.signal?.throwIfAborted();
	const renderer = await resolveRenderer(options);
	const scenes = await Promise.all(options.scenes.map(async (scene) => {
		const { node, stylesheets } = await resolveContent(scene.node, options);
		return {
			node,
			durationMs: scene.durationMs,
			stylesheets
		};
	}));
	const images = await collectImages(scenes.map((scene) => scene.node), options);
	const stylesheets = mergeStylesheets(options, scenes.flatMap((scene) => scene.stylesheets));
	options.signal?.throwIfAborted();
	return renderer.renderAnimation({
		...options,
		scenes: scenes.map(({ node, durationMs }) => ({
			node,
			durationMs
		})),
		images,
		stylesheets
	});
}
//#endregion
Object.defineProperty(exports, "render", {
	enumerable: true,
	get: function() {
		return render;
	}
});
Object.defineProperty(exports, "renderAnimation", {
	enumerable: true,
	get: function() {
		return renderAnimation;
	}
});
Object.defineProperty(exports, "renderSvg", {
	enumerable: true,
	get: function() {
		return renderSvg;
	}
});
