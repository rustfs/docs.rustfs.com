import { i as __toESM$1, n as __exportAll, r as __require, t as __commonJSMin$1 } from "./rolldown-runtime-B4lejLz5.js";
import { a as decodeReply, c as loadServerAction, i as decodeFormState, l as setRequireModule, n as createTemporaryReferenceSet, o as registerClientReference, r as decodeAction, s as renderToReadableStream$2, t as createFromReadableStream$1 } from "./rsc-tIp9KJt5.js";
import { t as require_react_react_server } from "./react.react-server-D_zJcm3W.js";
import { a as getLastModifiedDate, c as mergeLayoutConfigs, f as renderToc, i as getGitHubFileUrl, l as renderBody, n as baseLayoutProps, o as getPressContext, r as createTransformChildren, s as initApp, t as appContext, u as renderPageMeta } from "./shared-BTqrmQgS.js";
import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
import { n as c$3 } from "./fonts-B4N9qU8h-w8m3v4uG.js";
import { t as getLayoutTabs } from "./shared-CFt3wofn.js";
import { AsyncLocalStorage } from "node:async_hooks";
import assetsManifest from "../__vite_rsc_assets_manifest.js";
import { buildMetadata } from "../__waku_build_metadata.js";
import * as path$1 from "node:path";
//#region node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
	res;
	status;
	/**
	* Creates an instance of `HTTPException`.
	* @param status - HTTP status code for the exception. Defaults to 500.
	* @param options - Additional options for the exception.
	*/
	constructor(status = 500, options) {
		super(options?.message, { cause: options?.cause });
		this.res = options?.res;
		this.status = status;
	}
	/**
	* Returns the response object associated with the exception.
	* If a response object is not provided, a new response is created with the error message and status code.
	* @returns The response object.
	*/
	getResponse() {
		if (this.res) return new Response(this.res.body, {
			status: this.status,
			headers: this.res.headers
		});
		return new Response(this.message, { status: this.status });
	}
};
//#endregion
//#region node_modules/hono/dist/middleware/body-limit/index.js
var ERROR_MESSAGE = "Payload Too Large";
var bodyLimit = (options) => {
	const onError = options.onError || (() => {
		throw new HTTPException(413, { res: new Response(ERROR_MESSAGE, { status: 413 }) });
	});
	const maxSize = options.maxSize;
	return async function bodyLimit2(c, next) {
		if (!c.req.raw.body) return next();
		const hasTransferEncoding = c.req.raw.headers.has("transfer-encoding");
		if (c.req.raw.headers.has("content-length") && !hasTransferEncoding) return parseInt(c.req.raw.headers.get("content-length") || "0", 10) > maxSize ? onError(c) : next();
		let size = 0;
		const chunks = [];
		const rawReader = c.req.raw.body.getReader();
		for (;;) {
			const { done, value } = await rawReader.read();
			if (done) break;
			size += value.length;
			if (size > maxSize) return onError(c);
			chunks.push(value);
		}
		const requestInit = {
			body: new ReadableStream({ start(controller) {
				for (const chunk of chunks) controller.enqueue(chunk);
				controller.close();
			} }),
			duplex: "half"
		};
		c.req.raw = new Request(c.req.raw, requestInit);
		return next();
	};
};
//#endregion
//#region node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
	return (context, next) => {
		let index = -1;
		return dispatch(0);
		async function dispatch(i) {
			if (i <= index) throw new Error("next() called multiple times");
			index = i;
			let res;
			let isError = false;
			let handler;
			if (middleware[i]) {
				handler = middleware[i][0][0];
				context.req.routeIndex = i;
			} else handler = i === middleware.length && next || void 0;
			if (handler) try {
				res = await handler(context, () => dispatch(i + 1));
			} catch (err) {
				if (err instanceof Error && onError) {
					context.error = err;
					res = await onError(err, context);
					isError = true;
				} else throw err;
			}
			else if (context.finalized === false && onNotFound) res = await onNotFound(context);
			if (res && (context.finalized === false || isError)) context.res = res;
			return context;
		}
	};
};
//#endregion
//#region node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();
//#endregion
//#region node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
	return new Response(arrayBuffer, { headers: { "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase()) } }).formData();
};
//#endregion
//#region node_modules/hono/dist/utils/body.js
var isRawRequest = (request) => "headers" in request;
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
	const { all = false, dot = false } = options;
	const mediaType = (isRawRequest(request) ? request.headers : request.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
	if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") return parseFormData(request, {
		all,
		dot
	});
	return {};
};
async function parseFormData(request, options) {
	const headers = isRawRequest(request) ? request.headers : request.raw.headers;
	const formDataPromise = bufferToFormData(await request.arrayBuffer(), headers.get("Content-Type") || "");
	if (!isRawRequest(request)) request.bodyCache.formData = formDataPromise;
	const formData = await formDataPromise;
	if (formData) return convertFormDataToBodyData(formData, options);
	return {};
}
function convertFormDataToBodyData(formData, options) {
	const form = /* @__PURE__ */ Object.create(null);
	formData.forEach((value, key) => {
		if (!(options.all || key.endsWith("[]"))) form[key] = value;
		else handleParsingAllValues(form, key, value);
	});
	if (options.dot) Object.entries(form).forEach(([key, value]) => {
		if (key.includes(".")) {
			handleParsingNestedValues(form, key, value);
			delete form[key];
		}
	});
	return form;
}
var handleParsingAllValues = (form, key, value) => {
	if (form[key] !== void 0) if (Array.isArray(form[key])) form[key].push(value);
	else form[key] = [form[key], value];
	else if (!key.endsWith("[]")) form[key] = value;
	else form[key] = [value];
};
var handleParsingNestedValues = (form, key, value) => {
	if (/(?:^|\.)__proto__\./.test(key)) return;
	let nestedForm = form;
	const keys = key.split(".");
	keys.forEach((key2, index) => {
		if (index === keys.length - 1) nestedForm[key2] = value;
		else {
			if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) nestedForm[key2] = /* @__PURE__ */ Object.create(null);
			nestedForm = nestedForm[key2];
		}
	});
};
//#endregion
//#region node_modules/hono/dist/utils/url.js
var tryDecode = (str, decoder) => {
	try {
		return decoder(str);
	} catch {
		return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
			try {
				return decoder(match);
			} catch {
				return match;
			}
		});
	}
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
	const url = request.url;
	const start = url.indexOf("/", url.indexOf(":") + 4);
	let i = start;
	for (; i < url.length; i++) {
		const charCode = url.charCodeAt(i);
		if (charCode === 37) {
			const queryIndex = url.indexOf("?", i);
			const hashIndex = url.indexOf("#", i);
			const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
			const path = url.slice(start, end);
			return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
		} else if (charCode === 63 || charCode === 35) break;
	}
	return url.slice(start, i);
};
var getPathNoStrict = (request) => {
	const result = getPath(request);
	return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
	if (rest.length) sub = mergePath(sub, ...rest);
	return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var _decodeURI = (value) => {
	if (!/[%+]/.test(value)) return value;
	if (value.indexOf("+") !== -1) value = value.replace(/\+/g, " ");
	return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
	let encoded;
	if (!multiple && key && !/[%+]/.test(key)) {
		let keyIndex2 = url.indexOf("?", 8);
		if (keyIndex2 === -1) return;
		if (!url.startsWith(key, keyIndex2 + 1)) keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
		while (keyIndex2 !== -1) {
			const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
			if (trailingKeyCode === 61) {
				const valueIndex = keyIndex2 + key.length + 2;
				const endIndex = url.indexOf("&", valueIndex);
				return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
			} else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) return "";
			keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
		}
		encoded = /[%+]/.test(url);
		if (!encoded) return;
	}
	const results = {};
	encoded ??= /[%+]/.test(url);
	let keyIndex = url.indexOf("?", 8);
	while (keyIndex !== -1) {
		const nextKeyIndex = url.indexOf("&", keyIndex + 1);
		let valueIndex = url.indexOf("=", keyIndex);
		if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) valueIndex = -1;
		let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex);
		if (encoded) name = _decodeURI(name);
		keyIndex = nextKeyIndex;
		if (name === "") continue;
		let value;
		if (valueIndex === -1) value = "";
		else {
			value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
			if (encoded) value = _decodeURI(value);
		}
		if (multiple) {
			if (!(results[name] && Array.isArray(results[name]))) results[name] = [];
			results[name].push(value);
		} else results[name] ??= value;
	}
	return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
	return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;
//#endregion
//#region node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
	/**
	* `.raw` can get the raw Request object.
	*
	* @see {@link https://hono.dev/docs/api/request#raw}
	*
	* @example
	* ```ts
	* // For Cloudflare Workers
	* app.post('/', async (c) => {
	*   const metadata = c.req.raw.cf?.hostMetadata?
	*   ...
	* })
	* ```
	*/
	raw;
	#validatedData;
	#matchResult;
	routeIndex = 0;
	/**
	* `.path` can get the pathname of the request.
	*
	* @see {@link https://hono.dev/docs/api/request#path}
	*
	* @example
	* ```ts
	* app.get('/about/me', (c) => {
	*   const pathname = c.req.path // `/about/me`
	* })
	* ```
	*/
	path;
	bodyCache = {};
	constructor(request, path = "/", matchResult = [[]]) {
		this.raw = request;
		this.path = path;
		this.#matchResult = matchResult;
		this.#validatedData = {};
	}
	param(key) {
		return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
	}
	#getDecodedParam(key) {
		const paramKey = this.#matchResult[0][this.routeIndex][1][key];
		const param = this.#getParamValue(paramKey);
		return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
	}
	#getAllDecodedParams() {
		const decoded = {};
		const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
		for (const key of keys) {
			const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
			if (value !== void 0) decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
		}
		return decoded;
	}
	#getParamValue(paramKey) {
		return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
	}
	query(key) {
		return getQueryParam(this.url, key);
	}
	queries(key) {
		return getQueryParams(this.url, key);
	}
	header(name) {
		if (name) return this.raw.headers.get(name) ?? void 0;
		const headerData = {};
		this.raw.headers.forEach((value, key) => {
			headerData[key] = value;
		});
		return headerData;
	}
	async parseBody(options) {
		return parseBody(this, options);
	}
	#cachedBody = (key) => {
		const { bodyCache, raw } = this;
		const cachedBody = bodyCache[key];
		if (cachedBody) return cachedBody;
		const anyCachedKey = Object.keys(bodyCache)[0];
		if (anyCachedKey) return bodyCache[anyCachedKey].then((body) => {
			if (anyCachedKey === "json") body = JSON.stringify(body);
			return new Response(body)[key]();
		});
		return bodyCache[key] = raw[key]();
	};
	/**
	* `.json()` can parse Request body of type `application/json`
	*
	* @see {@link https://hono.dev/docs/api/request#json}
	*
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.json()
	* })
	* ```
	*/
	json() {
		return this.#cachedBody("text").then((text) => JSON.parse(text));
	}
	/**
	* `.text()` can parse Request body of type `text/plain`
	*
	* @see {@link https://hono.dev/docs/api/request#text}
	*
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.text()
	* })
	* ```
	*/
	text() {
		return this.#cachedBody("text");
	}
	/**
	* `.arrayBuffer()` parse Request body as an `ArrayBuffer`
	*
	* @see {@link https://hono.dev/docs/api/request#arraybuffer}
	*
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.arrayBuffer()
	* })
	* ```
	*/
	arrayBuffer() {
		return this.#cachedBody("arrayBuffer");
	}
	/**
	* `.bytes()` parses the request body as a `Uint8Array`.
	*
	* @see {@link https://hono.dev/docs/api/request#bytes}
	*
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.bytes()
	* })
	* ```
	*/
	bytes() {
		return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
	}
	/**
	* Parses the request body as a `Blob`.
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.blob();
	* });
	* ```
	* @see https://hono.dev/docs/api/request#blob
	*/
	blob() {
		return this.#cachedBody("blob");
	}
	/**
	* Parses the request body as `FormData`.
	* @example
	* ```ts
	* app.post('/entry', async (c) => {
	*   const body = await c.req.formData();
	* });
	* ```
	* @see https://hono.dev/docs/api/request#formdata
	*/
	formData() {
		return this.#cachedBody("formData");
	}
	/**
	* Adds validated data to the request.
	*
	* @param target - The target of the validation.
	* @param data - The validated data to add.
	*/
	addValidatedData(target, data) {
		this.#validatedData[target] = data;
	}
	valid(target) {
		return this.#validatedData[target];
	}
	/**
	* `.url()` can get the request url strings.
	*
	* @see {@link https://hono.dev/docs/api/request#url}
	*
	* @example
	* ```ts
	* app.get('/about/me', (c) => {
	*   const url = c.req.url // `http://localhost:8787/about/me`
	*   ...
	* })
	* ```
	*/
	get url() {
		return this.raw.url;
	}
	/**
	* `.method()` can get the method name of the request.
	*
	* @see {@link https://hono.dev/docs/api/request#method}
	*
	* @example
	* ```ts
	* app.get('/about/me', (c) => {
	*   const method = c.req.method // `GET`
	* })
	* ```
	*/
	get method() {
		return this.raw.method;
	}
	get [GET_MATCH_RESULT]() {
		return this.#matchResult;
	}
	/**
	* `.matchedRoutes()` can return a matched route in the handler
	*
	* @deprecated
	*
	* Use matchedRoutes helper defined in "hono/route" instead.
	*
	* @see {@link https://hono.dev/docs/api/request#matchedroutes}
	*
	* @example
	* ```ts
	* app.use('*', async function logger(c, next) {
	*   await next()
	*   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
	*     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
	*     console.log(
	*       method,
	*       ' ',
	*       path,
	*       ' '.repeat(Math.max(10 - path.length, 0)),
	*       name,
	*       i === c.req.routeIndex ? '<- respond from here' : ''
	*     )
	*   })
	* })
	* ```
	*/
	get matchedRoutes() {
		return this.#matchResult[0].map(([[, route]]) => route);
	}
	/**
	* `routePath()` can retrieve the path registered within the handler
	*
	* @deprecated
	*
	* Use routePath helper defined in "hono/route" instead.
	*
	* @see {@link https://hono.dev/docs/api/request#routepath}
	*
	* @example
	* ```ts
	* app.get('/posts/:id', (c) => {
	*   return c.json({ path: c.req.routePath })
	* })
	* ```
	*/
	get routePath() {
		return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
	}
};
//#endregion
//#region node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
	Stringify: 1,
	BeforeStream: 2,
	Stream: 3
};
var raw = (value, callbacks) => {
	const escapedString = new String(value);
	escapedString.isEscaped = true;
	escapedString.callbacks = callbacks;
	return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
	if (typeof str === "object" && !(str instanceof String)) {
		if (!(str instanceof Promise)) str = str.toString();
		if (str instanceof Promise) str = await str;
	}
	const callbacks = str.callbacks;
	if (!callbacks?.length) return Promise.resolve(str);
	if (buffer) buffer[0] += str;
	else buffer = [str];
	const resStr = Promise.all(callbacks.map((c) => c({
		phase,
		buffer,
		context
	}))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
	if (preserveCallbacks) return raw(await resStr, callbacks);
	else return resStr;
};
//#endregion
//#region node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
	return {
		"Content-Type": contentType,
		...headers
	};
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
	#rawRequest;
	#req;
	/**
	* `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
	*
	* @see {@link https://hono.dev/docs/api/context#env}
	*
	* @example
	* ```ts
	* // Environment object for Cloudflare Workers
	* app.get('*', async c => {
	*   const counter = c.env.COUNTER
	* })
	* ```
	*/
	env = {};
	#var;
	finalized = false;
	/**
	* `.error` can get the error object from the middleware if the Handler throws an error.
	*
	* @see {@link https://hono.dev/docs/api/context#error}
	*
	* @example
	* ```ts
	* app.use('*', async (c, next) => {
	*   await next()
	*   if (c.error) {
	*     // do something...
	*   }
	* })
	* ```
	*/
	error;
	#status;
	#executionCtx;
	#res;
	#layout;
	#renderer;
	#notFoundHandler;
	#preparedHeaders;
	#matchResult;
	#path;
	/**
	* Creates an instance of the Context class.
	*
	* @param req - The Request object.
	* @param options - Optional configuration options for the context.
	*/
	constructor(req, options) {
		this.#rawRequest = req;
		if (options) {
			this.#executionCtx = options.executionCtx;
			this.env = options.env;
			this.#notFoundHandler = options.notFoundHandler;
			this.#path = options.path;
			this.#matchResult = options.matchResult;
		}
	}
	/**
	* `.req` is the instance of {@link HonoRequest}.
	*/
	get req() {
		this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
		return this.#req;
	}
	/**
	* @see {@link https://hono.dev/docs/api/context#event}
	* The FetchEvent associated with the current request.
	*
	* @throws Will throw an error if the context does not have a FetchEvent.
	*/
	get event() {
		if (this.#executionCtx && "respondWith" in this.#executionCtx) return this.#executionCtx;
		else throw Error("This context has no FetchEvent");
	}
	/**
	* @see {@link https://hono.dev/docs/api/context#executionctx}
	* The ExecutionContext associated with the current request.
	*
	* @throws Will throw an error if the context does not have an ExecutionContext.
	*/
	get executionCtx() {
		if (this.#executionCtx) return this.#executionCtx;
		else throw Error("This context has no ExecutionContext");
	}
	/**
	* @see {@link https://hono.dev/docs/api/context#res}
	* The Response object for the current request.
	*/
	get res() {
		return this.#res ||= createResponseInstance(null, { headers: this.#preparedHeaders ??= new Headers() });
	}
	/**
	* Sets the Response object for the current request.
	*
	* @param _res - The Response object to set.
	*/
	set res(_res) {
		if (this.#res && _res) {
			_res = createResponseInstance(_res.body, _res);
			for (const [k, v] of this.#res.headers.entries()) {
				if (k === "content-type") continue;
				if (k === "set-cookie") {
					const cookies = this.#res.headers.getSetCookie();
					_res.headers.delete("set-cookie");
					for (const cookie of cookies) _res.headers.append("set-cookie", cookie);
				} else _res.headers.set(k, v);
			}
		}
		this.#res = _res;
		this.finalized = true;
	}
	/**
	* `.render()` can create a response within a layout.
	*
	* @see {@link https://hono.dev/docs/api/context#render-setrenderer}
	*
	* @example
	* ```ts
	* app.get('/', (c) => {
	*   return c.render('Hello!')
	* })
	* ```
	*/
	render = (...args) => {
		this.#renderer ??= (content) => this.html(content);
		return this.#renderer(...args);
	};
	/**
	* Sets the layout for the response.
	*
	* @param layout - The layout to set.
	* @returns The layout function.
	*/
	setLayout = (layout) => this.#layout = layout;
	/**
	* Gets the current layout for the response.
	*
	* @returns The current layout function.
	*/
	getLayout = () => this.#layout;
	/**
	* `.setRenderer()` can set the layout in the custom middleware.
	*
	* @see {@link https://hono.dev/docs/api/context#render-setrenderer}
	*
	* @example
	* ```tsx
	* app.use('*', async (c, next) => {
	*   c.setRenderer((content) => {
	*     return c.html(
	*       <html>
	*         <body>
	*           <p>{content}</p>
	*         </body>
	*       </html>
	*     )
	*   })
	*   await next()
	* })
	* ```
	*/
	setRenderer = (renderer) => {
		this.#renderer = renderer;
	};
	/**
	* `.header()` can set headers.
	*
	* @see {@link https://hono.dev/docs/api/context#header}
	*
	* @example
	* ```ts
	* app.get('/welcome', (c) => {
	*   // Set headers
	*   c.header('X-Message', 'Hello!')
	*   c.header('Content-Type', 'text/plain')
	*
	*   return c.body('Thank you for coming')
	* })
	* ```
	*/
	header = (name, value, options) => {
		if (this.finalized) this.#res = createResponseInstance(this.#res.body, this.#res);
		const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
		if (value === void 0) headers.delete(name);
		else if (options?.append) headers.append(name, value);
		else headers.set(name, value);
	};
	status = (status) => {
		this.#status = status;
	};
	/**
	* `.set()` can set the value specified by the key.
	*
	* @see {@link https://hono.dev/docs/api/context#set-get}
	*
	* @example
	* ```ts
	* app.use('*', async (c, next) => {
	*   c.set('message', 'Hono is hot!!')
	*   await next()
	* })
	* ```
	*/
	set = (key, value) => {
		this.#var ??= /* @__PURE__ */ new Map();
		this.#var.set(key, value);
	};
	/**
	* `.get()` can use the value specified by the key.
	*
	* @see {@link https://hono.dev/docs/api/context#set-get}
	*
	* @example
	* ```ts
	* app.get('/', (c) => {
	*   const message = c.get('message')
	*   return c.text(`The message is "${message}"`)
	* })
	* ```
	*/
	get = (key) => {
		return this.#var ? this.#var.get(key) : void 0;
	};
	/**
	* `.var` can access the value of a variable.
	*
	* @see {@link https://hono.dev/docs/api/context#var}
	*
	* @example
	* ```ts
	* const result = c.var.client.oneMethod()
	* ```
	*/
	get var() {
		if (!this.#var) return {};
		return Object.fromEntries(this.#var);
	}
	#newResponse(data, arg, headers) {
		const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
		if (typeof arg === "object" && "headers" in arg) {
			const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
			for (const [key, value] of argHeaders) if (key.toLowerCase() === "set-cookie") responseHeaders.append(key, value);
			else responseHeaders.set(key, value);
		}
		if (headers) for (const [k, v] of Object.entries(headers)) if (typeof v === "string") responseHeaders.set(k, v);
		else {
			responseHeaders.delete(k);
			for (const v2 of v) responseHeaders.append(k, v2);
		}
		return createResponseInstance(data, {
			status: typeof arg === "number" ? arg : arg?.status ?? this.#status,
			headers: responseHeaders
		});
	}
	newResponse = (...args) => this.#newResponse(...args);
	/**
	* `.body()` can return the HTTP response.
	* You can set headers with `.header()` and set HTTP status code with `.status`.
	* This can also be set in `.text()`, `.json()` and so on.
	*
	* @see {@link https://hono.dev/docs/api/context#body}
	*
	* @example
	* ```ts
	* app.get('/welcome', (c) => {
	*   // Set headers
	*   c.header('X-Message', 'Hello!')
	*   c.header('Content-Type', 'text/plain')
	*   // Set HTTP status code
	*   c.status(201)
	*
	*   // Return the response body
	*   return c.body('Thank you for coming')
	* })
	* ```
	*/
	body = (data, arg, headers) => this.#newResponse(data, arg, headers);
	/**
	* `.text()` can render text as `Content-Type:text/plain`.
	*
	* @see {@link https://hono.dev/docs/api/context#text}
	*
	* @example
	* ```ts
	* app.get('/say', (c) => {
	*   return c.text('Hello!')
	* })
	* ```
	*/
	text = (text, arg, headers) => {
		return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
	};
	/**
	* `.json()` can render JSON as `Content-Type:application/json`.
	*
	* @see {@link https://hono.dev/docs/api/context#json}
	*
	* @example
	* ```ts
	* app.get('/api', (c) => {
	*   return c.json({ message: 'Hello!' })
	* })
	* ```
	*/
	json = (object, arg, headers) => {
		return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
	};
	html = (html, arg, headers) => {
		const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
		return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
	};
	/**
	* `.redirect()` can Redirect, default status code is 302.
	*
	* @see {@link https://hono.dev/docs/api/context#redirect}
	*
	* @example
	* ```ts
	* app.get('/redirect', (c) => {
	*   return c.redirect('/')
	* })
	* app.get('/redirect-permanently', (c) => {
	*   return c.redirect('/', 301)
	* })
	* ```
	*/
	redirect = (location, status) => {
		const locationString = String(location);
		this.header("Location", !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString));
		return this.newResponse(null, status ?? 302);
	};
	/**
	* `.notFound()` can return the Not Found Response.
	*
	* @see {@link https://hono.dev/docs/api/context#notfound}
	*
	* @example
	* ```ts
	* app.get('/notfound', (c) => {
	*   return c.notFound()
	* })
	* ```
	*/
	notFound = () => {
		this.#notFoundHandler ??= () => createResponseInstance();
		return this.#notFoundHandler(this);
	};
};
//#endregion
//#region node_modules/hono/dist/router.js
var METHODS = [
	"get",
	"post",
	"put",
	"delete",
	"options",
	"patch"
];
var UnsupportedPathError = class extends Error {};
//#endregion
//#region node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";
//#endregion
//#region node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
	return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
	if ("getResponse" in err) {
		const res = err.getResponse();
		return c.newResponse(res.body, res);
	}
	console.error(err);
	return c.text("Internal Server Error", 500);
};
var Hono$1 = class _Hono {
	get;
	post;
	put;
	delete;
	options;
	patch;
	all;
	on;
	use;
	router;
	getPath;
	_basePath = "/";
	#path = "/";
	routes = [];
	constructor(options = {}) {
		[...METHODS, "all"].forEach((method) => {
			this[method] = (args1, ...args) => {
				if (typeof args1 === "string") this.#path = args1;
				else this.#addRoute(method, this.#path, args1);
				args.forEach((handler) => {
					this.#addRoute(method, this.#path, handler);
				});
				return this;
			};
		});
		this.on = (method, path, ...handlers) => {
			for (const p of [path].flat()) {
				this.#path = p;
				for (const m of [method].flat()) handlers.map((handler) => {
					this.#addRoute(m.toUpperCase(), this.#path, handler);
				});
			}
			return this;
		};
		this.use = (arg1, ...handlers) => {
			if (typeof arg1 === "string") this.#path = arg1;
			else {
				this.#path = "*";
				handlers.unshift(arg1);
			}
			handlers.forEach((handler) => {
				this.#addRoute("ALL", this.#path, handler);
			});
			return this;
		};
		const { strict, ...optionsWithoutStrict } = options;
		Object.assign(this, optionsWithoutStrict);
		this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
	}
	#clone() {
		const clone = new _Hono({
			router: this.router,
			getPath: this.getPath
		});
		clone.errorHandler = this.errorHandler;
		clone.#notFoundHandler = this.#notFoundHandler;
		clone.routes = this.routes;
		return clone;
	}
	#notFoundHandler = notFoundHandler;
	errorHandler = errorHandler;
	/**
	* `.route()` allows grouping other Hono instance in routes.
	*
	* @see {@link https://hono.dev/docs/api/routing#grouping}
	*
	* @param {string} path - base Path
	* @param {Hono} app - other Hono instance
	* @returns {Hono} routed Hono instance
	*
	* @example
	* ```ts
	* const app = new Hono()
	* const app2 = new Hono()
	*
	* app2.get("/user", (c) => c.text("user"))
	* app.route("/api", app2) // GET /api/user
	* ```
	*/
	route(path, app) {
		const subApp = this.basePath(path);
		app.routes.map((r) => {
			let handler;
			if (app.errorHandler === errorHandler) handler = r.handler;
			else {
				handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
				handler[COMPOSED_HANDLER] = r.handler;
			}
			subApp.#addRoute(r.method, r.path, handler, r.basePath);
		});
		return this;
	}
	/**
	* `.basePath()` allows base paths to be specified.
	*
	* @see {@link https://hono.dev/docs/api/routing#base-path}
	*
	* @param {string} path - base Path
	* @returns {Hono} changed Hono instance
	*
	* @example
	* ```ts
	* const api = new Hono().basePath('/api')
	* ```
	*/
	basePath(path) {
		const subApp = this.#clone();
		subApp._basePath = mergePath(this._basePath, path);
		return subApp;
	}
	/**
	* `.onError()` handles an error and returns a customized Response.
	*
	* @see {@link https://hono.dev/docs/api/hono#error-handling}
	*
	* @param {ErrorHandler} handler - request Handler for error
	* @returns {Hono} changed Hono instance
	*
	* @example
	* ```ts
	* app.onError((err, c) => {
	*   console.error(`${err}`)
	*   return c.text('Custom Error Message', 500)
	* })
	* ```
	*/
	onError = (handler) => {
		this.errorHandler = handler;
		return this;
	};
	/**
	* `.notFound()` allows you to customize a Not Found Response.
	*
	* @see {@link https://hono.dev/docs/api/hono#not-found}
	*
	* @param {NotFoundHandler} handler - request handler for not-found
	* @returns {Hono} changed Hono instance
	*
	* @example
	* ```ts
	* app.notFound((c) => {
	*   return c.text('Custom 404 Message', 404)
	* })
	* ```
	*/
	notFound = (handler) => {
		this.#notFoundHandler = handler;
		return this;
	};
	/**
	* `.mount()` allows you to mount applications built with other frameworks into your Hono application.
	*
	* @see {@link https://hono.dev/docs/api/hono#mount}
	*
	* @param {string} path - base Path
	* @param {Function} applicationHandler - other Request Handler
	* @param {MountOptions} [options] - options of `.mount()`
	* @returns {Hono} mounted Hono instance
	*
	* @example
	* ```ts
	* import { Router as IttyRouter } from 'itty-router'
	* import { Hono } from 'hono'
	* // Create itty-router application
	* const ittyRouter = IttyRouter()
	* // GET /itty-router/hello
	* ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
	*
	* const app = new Hono()
	* app.mount('/itty-router', ittyRouter.handle)
	* ```
	*
	* @example
	* ```ts
	* const app = new Hono()
	* // Send the request to another application without modification.
	* app.mount('/app', anotherApp, {
	*   replaceRequest: (req) => req,
	* })
	* ```
	*/
	mount(path, applicationHandler, options) {
		let replaceRequest;
		let optionHandler;
		if (options) if (typeof options === "function") optionHandler = options;
		else {
			optionHandler = options.optionHandler;
			if (options.replaceRequest === false) replaceRequest = (request) => request;
			else replaceRequest = options.replaceRequest;
		}
		const getOptions = optionHandler ? (c) => {
			const options2 = optionHandler(c);
			return Array.isArray(options2) ? options2 : [options2];
		} : (c) => {
			let executionContext = void 0;
			try {
				executionContext = c.executionCtx;
			} catch {}
			return [c.env, executionContext];
		};
		replaceRequest ||= (() => {
			const mergedPath = mergePath(this._basePath, path);
			const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
			return (request) => {
				const url = new URL(request.url);
				url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
				return new Request(url, request);
			};
		})();
		const handler = async (c, next) => {
			const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
			if (res) return res;
			await next();
		};
		this.#addRoute("ALL", mergePath(path, "*"), handler);
		return this;
	}
	#addRoute(method, path, handler, baseRoutePath) {
		method = method.toUpperCase();
		path = mergePath(this._basePath, path);
		const r = {
			basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
			path,
			method,
			handler
		};
		this.router.add(method, path, [handler, r]);
		this.routes.push(r);
	}
	#handleError(err, c) {
		if (err instanceof Error) return this.errorHandler(err, c);
		throw err;
	}
	#dispatch(request, executionCtx, env, method) {
		if (method === "HEAD") return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
		const path = this.getPath(request, { env });
		const matchResult = this.router.match(method, path);
		const c = new Context(request, {
			path,
			matchResult,
			env,
			executionCtx,
			notFoundHandler: this.#notFoundHandler
		});
		if (matchResult[0].length === 1) {
			let res;
			try {
				res = matchResult[0][0][0][0](c, async () => {
					c.res = await this.#notFoundHandler(c);
				});
			} catch (err) {
				return this.#handleError(err, c);
			}
			return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
		}
		const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
		return (async () => {
			try {
				const context = await composed(c);
				if (!context.finalized) throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
				return context.res;
			} catch (err) {
				return this.#handleError(err, c);
			}
		})();
	}
	/**
	* `.fetch()` will be entry point of your app.
	*
	* @see {@link https://hono.dev/docs/api/hono#fetch}
	*
	* @param {Request} request - request Object of request
	* @param {Env} Env - env Object
	* @param {ExecutionContext} - context of execution
	* @returns {Response | Promise<Response>} response of request
	*
	*/
	fetch = (request, ...rest) => {
		return this.#dispatch(request, rest[1], rest[0], request.method);
	};
	/**
	* `.request()` is a useful method for testing.
	* You can pass a URL or pathname to send a GET request.
	* app will return a Response object.
	* ```ts
	* test('GET /hello is ok', async () => {
	*   const res = await app.request('/hello')
	*   expect(res.status).toBe(200)
	* })
	* ```
	* @see https://hono.dev/docs/api/hono#request
	*/
	request = (input, requestInit, Env, executionCtx) => {
		if (input instanceof Request) return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
		input = input.toString();
		return this.fetch(new Request(/^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`, requestInit), Env, executionCtx);
	};
	/**
	* `.fire()` automatically adds a global fetch event listener.
	* This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
	* @deprecated
	* Use `fire` from `hono/service-worker` instead.
	* ```ts
	* import { Hono } from 'hono'
	* import { fire } from 'hono/service-worker'
	*
	* const app = new Hono()
	* // ...
	* fire(app)
	* ```
	* @see https://hono.dev/docs/api/hono#fire
	* @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
	* @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
	*/
	fire = () => {
		addEventListener("fetch", (event) => {
			event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
		});
	};
};
//#endregion
//#region node_modules/hono/dist/router/pattern-router/router.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var PatternRouter = class {
	name = "PatternRouter";
	#routes = [];
	add(method, path, handler) {
		const endsWithWildcard = path.at(-1) === "*";
		if (endsWithWildcard) path = path.slice(0, -2);
		if (path.at(-1) === "?") {
			path = path.slice(0, -1);
			this.add(method, path.replace(/\/[^/]+$/, ""), handler);
		}
		const parts = (path.match(/\/?(:\w+(?:{(?:(?:{[\d,]+})|[^}])+})?)|\/?[^\/\?]+/g) || []).map((part) => {
			const match = part.match(/^\/:([^{]+)(?:{(.*)})?/);
			return match ? `/(?<${match[1]}>${match[2] || "[^/]+"})` : part === "/*" ? "/[^/]+" : part.replace(/[.\\+*[^\]$()]/g, "\\$&");
		});
		try {
			this.#routes.push([
				new RegExp(`^${parts.join("")}${endsWithWildcard ? "" : "/?$"}`),
				method,
				handler
			]);
		} catch {
			throw new UnsupportedPathError();
		}
	}
	match(method, path) {
		const handlers = [];
		for (let i = 0, len = this.#routes.length; i < len; i++) {
			const [pattern, routeMethod, handler] = this.#routes[i];
			if (routeMethod === method || routeMethod === "ALL") {
				const match = pattern.exec(path);
				if (match) handlers.push([handler, match.groups || emptyParams]);
			}
		}
		return [handlers];
	}
};
//#endregion
//#region node_modules/hono/dist/preset/tiny.js
var Hono = class extends Hono$1 {
	constructor(options = {}) {
		super(options);
		this.router = new PatternRouter();
	}
};
//#endregion
//#region node_modules/@vitejs/plugin-rsc/dist/utils/encryption-runtime.js
var import_react_react_server = /* @__PURE__ */ __toESM$1(require_react_react_server(), 1);
//#endregion
//#region \0virtual:vite-rsc/server-references
var server_references_default = {};
//#endregion
//#region node_modules/@vitejs/plugin-rsc/dist/rsc.js
initialize();
function initialize() {
	setRequireModule({ load: async (id) => {
		{
			const import_ = server_references_default[id];
			if (!import_) throw new Error(`server reference not found '${id}'`);
			return import_();
		}
	} });
}
function renderToReadableStream$1(data, options, extraOptions) {
	return renderToReadableStream$2(data, options, { onClientReference(metadata) {
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
//#region \0virtual:vite-rsc-waku/config
var config$1 = {
	"basePath": "/",
	"srcDir": "src",
	"distDir": "dist",
	"privateDir": "private",
	"rscBase": "RSC",
	"unstable_adapter": "waku/adapters/cloudflare"
};
//#endregion
//#region node_modules/waku/dist/lib/constants.js
var constants_exports = /* @__PURE__ */ __exportAll({
	BUILD_METADATA_FILE: () => BUILD_METADATA_FILE,
	DIST_PUBLIC: () => DIST_PUBLIC$1,
	DIST_SERVER: () => DIST_SERVER,
	EXTENSIONS: () => EXTENSIONS,
	SRC_CLIENT_ENTRY: () => SRC_CLIENT_ENTRY,
	SRC_MIDDLEWARE: () => SRC_MIDDLEWARE,
	SRC_PAGES: () => SRC_PAGES,
	SRC_SERVER_ENTRY: () => SRC_SERVER_ENTRY
});
var EXTENSIONS = [
	".js",
	".ts",
	".tsx",
	".jsx",
	".mjs",
	".cjs"
];
var SRC_CLIENT_ENTRY = "waku.client";
var SRC_SERVER_ENTRY = "waku.server";
var SRC_PAGES = "pages";
var SRC_MIDDLEWARE = "middleware";
var DIST_PUBLIC$1 = "public";
var DIST_SERVER = "server";
var BUILD_METADATA_FILE = "__waku_build_metadata.js";
//#endregion
//#region node_modules/waku/dist/lib/env.js
/**
* This is an internal function and not for public use.
*/ function setAllEnv(newEnv) {
	const env = {};
	for (const [key, value] of Object.entries(newEnv)) if (typeof value === "string") env[key] = value;
	globalThis.__WAKU_SERVER_ENV__ = env;
}
//#endregion
//#region node_modules/waku/dist/lib/utils/custom-errors.js
var isErrorInfo = (x) => {
	if (typeof x !== "object" || x === null) return false;
	if ("status" in x && typeof x.status !== "number") return false;
	if ("location" in x && typeof x.location !== "string") return false;
	return true;
};
var prefix = "__WAKU_CUSTOM_ERROR__;";
var createCustomError = (message, errorInfo) => {
	const err = new Error(message);
	err.digest = prefix + JSON.stringify(errorInfo);
	return err;
};
var getErrorInfo = (err) => {
	const digest = err?.digest;
	if (typeof digest !== "string" || !digest.startsWith(prefix)) return null;
	try {
		const info = JSON.parse(digest.slice(22));
		if (isErrorInfo(info)) return info;
	} catch {}
	return null;
};
//#endregion
//#region node_modules/waku/dist/lib/utils/log.js
var sanitizeLog = (value) => {
	return (value instanceof Error ? value.stack ?? value.message : String(value)).replace(/\p{Cc}/gu, (char) => char === "\n" ? "\\n" : `\\x${char.charCodeAt(0).toString(16).padStart(2, "0")}`);
};
//#endregion
//#region node_modules/waku/dist/lib/utils/path.js
var joinPath = (...paths) => {
	const isAbsolute = paths[0]?.startsWith("/");
	const items = [].concat(...paths.map((path) => path.split("/")));
	const stack = [];
	for (const item of items) if (item === "..") {
		if (stack.length && stack[stack.length - 1] !== "..") stack.pop();
		else if (!isAbsolute) stack.push("..");
	} else if (item && item !== ".") stack.push(item);
	return (isAbsolute ? "/" : "") + stack.join("/") || ".";
};
var SLUG_PATTERN = /^(.*?)\[([^\]]+)\](.*)$/;
var parsePathWithSlug = (path) => path.split("/").filter(Boolean).map((name) => {
	const match = SLUG_PATTERN.exec(name);
	if (!match) return {
		type: "literal",
		name
	};
	const [, prefix, inner, suffix] = match;
	if (inner.startsWith("...")) return {
		type: "wildcard",
		name: inner.slice(3)
	};
	return {
		type: "group",
		name: inner,
		...prefix ? { prefix } : {},
		...suffix ? { suffix } : {}
	};
});
var parseExactPath = (path) => path.split("/").filter(Boolean).map((name) => ({
	type: "literal",
	name
}));
var escapeRegExp = (s) => s.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
/**
* Transform a path spec to a regular expression.
*/ var path2regexp = (path) => {
	return `^/${path.map((item) => {
		if (item.type === "literal") return escapeRegExp(item.name);
		else if (item.type === "group") return `${escapeRegExp(item.prefix ?? "")}([^/]+)${escapeRegExp(item.suffix ?? "")}`;
		else return `(.*)`;
	}).join("/")}$`;
};
/** Convert a path spec to a string for the path */ var pathSpecAsString = (path) => {
	return "/" + path.map((item) => {
		if (item.type === "literal") return item.name;
		else if (item.type === "group") {
			const prefix = item.prefix ?? "";
			const suffix = item.suffix ?? "";
			return `${prefix}[${item.name}]${suffix}`;
		} else return `[...${item.name}]`;
	}).join("/");
};
var matchSpecSegment = (spec, segment, mapping) => {
	if (spec.type === "literal") return spec.name === segment;
	if (segment === void 0) return false;
	const prefix = spec.prefix ?? "";
	const suffix = spec.suffix ?? "";
	if (prefix || suffix) {
		if (!segment.startsWith(prefix) || !segment.endsWith(suffix)) return false;
		const value = segment.slice(prefix.length, suffix ? -suffix.length : void 0);
		if (!value) return false;
		if (spec.name) mapping[spec.name] = value;
	} else if (spec.name) mapping[spec.name] = segment;
	return true;
};
/**
* Helper function to get the path mapping from the path spec and the pathname.
*
* @param pathSpec
* @param pathname - route as a string
* @example
* getPathMapping(
*   [
*     { type: 'literal', name: 'foo' },
*     { type: 'group', name: 'a' },
*   ],
*   '/foo/bar',
* );
* // => { a: 'bar' }
*/ var getPathMapping = (pathSpec, pathname) => {
	const actual = pathname.split("/").filter(Boolean);
	if (pathSpec.length > actual.length) {
		const wildcardIndex = pathSpec.findIndex((spec) => spec.type === "wildcard");
		if (wildcardIndex === -1) return null;
		if (wildcardIndex === pathSpec.length - 1) {
			if (actual.length > 0) return null;
		} else if (actual.length < pathSpec.length - 1) return null;
	}
	const mapping = {};
	let wildcardStartIndex = -1;
	for (let i = 0; i < pathSpec.length; i++) {
		const spec = pathSpec[i];
		if (spec.type === "wildcard") {
			wildcardStartIndex = i;
			break;
		}
		if (!matchSpecSegment(spec, actual[i], mapping)) return null;
	}
	if (wildcardStartIndex === -1) {
		if (pathSpec.length !== actual.length) return null;
		return mapping;
	}
	if (wildcardStartIndex === 0 && actual.length === 0) {
		const wildcardName = pathSpec[wildcardStartIndex].name;
		if (wildcardName) mapping[wildcardName] = [];
		return mapping;
	}
	let wildcardEndIndex = -1;
	for (let i = 0; i < pathSpec.length; i++) {
		const spec = pathSpec[pathSpec.length - i - 1];
		if (spec.type === "wildcard") {
			wildcardEndIndex = actual.length - i - 1;
			break;
		}
		if (!matchSpecSegment(spec, actual[actual.length - i - 1], mapping)) return null;
	}
	const wildcardName = pathSpec[wildcardStartIndex].name;
	if (wildcardName) mapping[wildcardName] = actual.slice(wildcardStartIndex, wildcardEndIndex + 1);
	return mapping;
};
function removeBase(url, base) {
	if (base !== "/") {
		if (!url.startsWith(base)) throw new Error("pathname must start with basePath: " + url);
		return url.slice(base.length - 1);
	}
	return url;
}
function addBase(url, base) {
	if (base !== "/" && url.startsWith("/")) return base.slice(0, -1) + url;
	return url;
}
function countSlugsAndWildcards(pathSpec) {
	let numSlugs = 0;
	let numWildcards = 0;
	for (const slug of pathSpec) {
		if (slug.type !== "literal") numSlugs++;
		if (slug.type === "wildcard") numWildcards++;
	}
	return {
		numSlugs,
		numWildcards
	};
}
//#endregion
//#region node_modules/waku/dist/lib/utils/base64-web.js
var bytesToBase64 = (bytes) => {
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
};
var base64ToBytes = (base64) => Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
//#endregion
//#region node_modules/waku/dist/lib/utils/render.js
var validateRscElementIds = (elements) => {
	for (const id of Object.keys(elements)) if (id.startsWith("_")) throw new Error(`RSC element IDs starting with "_" are reserved for Waku internals: ${id}`);
};
function createRenderUtils(temporaryReferences, renderToReadableStream, createFromReadableStream, loadSsrEntryModule, buildId, debugChannel, debugId) {
	const onError = (e) => {
		if (e && typeof e === "object" && "digest" in e && typeof e.digest === "string") return e.digest;
		console.error("Error during rendering:", sanitizeLog(e));
	};
	return {
		async renderRsc(elements, options) {
			validateRscElementIds(elements);
			const data = buildId ? {
				...elements,
				_buildId: buildId
			} : { ...elements };
			if (options && "value" in options) data._value = options.value;
			return renderToReadableStream(data, {
				temporaryReferences,
				onError,
				debugChannel
			}, { onClientReference(metadata) {
				options?.unstable_clientModuleCallback?.(metadata.deps.js);
			} });
		},
		async parseRsc(stream) {
			return createFromReadableStream(stream, {});
		},
		async renderHtml(elementsStream, html, options) {
			const { INTERNAL_renderHtmlStream: renderHtmlStream } = await loadSsrEntryModule();
			const htmlResult = await renderHtmlStream(elementsStream, renderToReadableStream(html, { onError }), {
				rscPath: options.rscPath,
				formState: options.formState,
				nonce: options.nonce,
				extraScriptContent: options.unstable_extraScriptContent,
				debugId
			});
			return new Response(htmlResult.stream, {
				status: htmlResult.status || options.status || 200,
				headers: { "content-type": "text/html; charset=utf-8" }
			});
		}
	};
}
//#endregion
//#region node_modules/waku/dist/lib/utils/rsc-path.js
var encodeRscPath = (rscPath) => {
	if (rscPath === "") rscPath = "_";
	else {
		if (rscPath.startsWith("_") || rscPath.startsWith("/")) rscPath = "_" + rscPath;
		if (rscPath.endsWith("_") || rscPath.endsWith("/")) rscPath += "_";
	}
	return rscPath + ".txt";
};
var decodeRscPath = (rscPath) => {
	if (!rscPath.endsWith(".txt")) throw new Error("Invalid encoded rscPath");
	rscPath = rscPath.slice(0, -4);
	if (rscPath.startsWith("_")) rscPath = rscPath.slice(1);
	if (rscPath.endsWith("_")) rscPath = rscPath.slice(0, -1);
	return rscPath;
};
var FUNC_PREFIX = "F/";
var decodeFuncId = (encoded) => {
	if (!encoded.startsWith(FUNC_PREFIX)) return null;
	const index = encoded.lastIndexOf("/");
	const file = encoded.slice(2, index);
	const name = encoded.slice(index + 1);
	if (file.startsWith("_")) return file.slice(1) + "#" + name;
	return file + "#" + name;
};
//#endregion
//#region node_modules/waku/dist/lib/utils/request.js
async function getInput(req, config, temporaryReferences, decodeReply, decodeAction, decodeFormState, loadServerAction) {
	const url = new URL(req.url);
	const pathname = removeBase(url.pathname, config.basePath);
	const rscPathPrefix = "/" + config.rscBase + "/";
	let rscPath;
	let input;
	if (pathname.startsWith(rscPathPrefix)) {
		rscPath = decodeRscPath(pathname.slice(rscPathPrefix.length));
		const actionId = decodeFuncId(rscPath);
		if (actionId) {
			validateServerActionRequest(req);
			const args = await decodeReply(await getActionBody(req), { temporaryReferences });
			input = {
				type: "function",
				fn: await loadServerAction(actionId),
				args,
				pathname,
				req
			};
		} else {
			let rscParams = url.searchParams;
			if (req.body) {
				validateServerActionRequest(req);
				rscParams = await decodeReply(await getActionBody(req), { temporaryReferences });
			}
			input = {
				type: "component",
				rscPath,
				rscParams,
				pathname,
				req
			};
		}
	} else if (req.method === "POST") {
		const contentType = req.headers.get("content-type");
		if (typeof contentType === "string" && contentType.startsWith("multipart/form-data")) {
			validateServerActionRequest(req);
			input = {
				type: "action",
				fn: async () => {
					const formData = await getActionBody(req);
					return await decodeFormState(await (await decodeAction(formData))(), formData);
				},
				pathname,
				req
			};
		} else input = {
			type: "custom",
			pathname,
			req
		};
	} else input = {
		type: "custom",
		pathname,
		req
	};
	return input;
}
function validateServerActionRequest(req) {
	if (req.method !== "POST") throw createCustomError("Method Not Allowed", { status: 405 });
	const origin = req.headers.get("origin");
	if (origin) {
		if (origin === "null") throw createCustomError("Forbidden", { status: 403 });
		const requestOrigin = new URL(req.url).origin;
		let originUrl;
		try {
			originUrl = new URL(origin);
		} catch {
			throw createCustomError("Forbidden", { status: 403 });
		}
		if (originUrl.origin !== requestOrigin) throw createCustomError("Forbidden", { status: 403 });
	} else if (req.headers.get("sec-fetch-site") === "cross-site") throw createCustomError("Forbidden", { status: 403 });
}
async function getActionBody(req) {
	if (!req.body) throw new Error("missing request body for server function");
	if (req.headers.get("content-type")?.startsWith("multipart/form-data")) return req.formData();
	else return req.text();
}
//#endregion
//#region node_modules/waku/dist/lib/utils/stream.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var stringToStream = (str) => {
	return new ReadableStream({ start(controller) {
		controller.enqueue(encoder.encode(str));
		controller.close();
	} });
};
var streamToBytes = async (stream) => {
	const reader = stream.getReader();
	const chunks = [];
	while (true) {
		const { value, done } = await reader.read();
		if (done) break;
		if (!(value instanceof Uint8Array)) throw new Error("Unexpected buffer type");
		chunks.push(value);
	}
	return concatUint8Array(chunks);
};
var bytesToStream = (bytes) => new ReadableStream({ start(controller) {
	controller.enqueue(bytes);
	controller.close();
} });
function concatUint8Array(chunks) {
	if (chunks.length === 1) return chunks[0];
	const total = chunks.reduce((n, chunk) => n + chunk.byteLength, 0);
	const out = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		out.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return out;
}
var FRAME_START = 1;
var FRAME_CHUNK = 2;
var FRAME_END = 3;
var FRAME_ERROR = 4;
function encodeStart(key) {
	const keyBytes = encoder.encode(key);
	const out = new Uint8Array(3 + keyBytes.length);
	out[0] = FRAME_START;
	new DataView(out.buffer).setUint16(1, keyBytes.length);
	out.set(keyBytes, 3);
	return out;
}
function encodeEnd(key) {
	const keyBytes = encoder.encode(key);
	const out = new Uint8Array(3 + keyBytes.length);
	out[0] = FRAME_END;
	new DataView(out.buffer).setUint16(1, keyBytes.length);
	out.set(keyBytes, 3);
	return out;
}
function encodeChunk(key, chunk) {
	const keyBytes = encoder.encode(key);
	const out = new Uint8Array(3 + keyBytes.length + 4 + chunk.length);
	let offset = 0;
	out[offset++] = FRAME_CHUNK;
	new DataView(out.buffer).setUint16(offset, keyBytes.length);
	offset += 2;
	out.set(keyBytes, offset);
	offset += keyBytes.length;
	new DataView(out.buffer).setUint32(offset, chunk.length);
	offset += 4;
	out.set(chunk, offset);
	return out;
}
function encodeError(key, error) {
	const keyBytes = encoder.encode(key);
	const payload = encoder.encode(String(error));
	const out = new Uint8Array(3 + keyBytes.length + 4 + payload.length);
	let offset = 0;
	out[offset++] = FRAME_ERROR;
	new DataView(out.buffer).setUint16(offset, keyBytes.length);
	offset += 2;
	out.set(keyBytes, offset);
	offset += keyBytes.length;
	new DataView(out.buffer).setUint32(offset, payload.length);
	offset += 4;
	out.set(payload, offset);
	return out;
}
function createFrameDispatcher(onStart, onChunk, onEnd, onError) {
	let buffer = /* @__PURE__ */ new Uint8Array(0);
	return (data) => {
		buffer = concatUint8Array([buffer, data]);
		while (buffer.length > 0) {
			const frameType = buffer[0];
			if (buffer.length < 3) break;
			const keyLen = new DataView(buffer.buffer, buffer.byteOffset).getUint16(1);
			const headerLen = 3 + keyLen;
			if (buffer.length < headerLen) break;
			const key = decoder.decode(buffer.slice(3, 3 + keyLen));
			if (frameType === FRAME_START) {
				onStart(key);
				buffer = buffer.slice(headerLen);
				continue;
			}
			if (frameType === FRAME_END) {
				onEnd(key);
				buffer = buffer.slice(headerLen);
				continue;
			}
			if (buffer.length < headerLen + 4) break;
			const payloadLen = new DataView(buffer.buffer, buffer.byteOffset).getUint32(headerLen);
			const totalLen = headerLen + 4 + payloadLen;
			if (buffer.length < totalLen) break;
			const payload = buffer.slice(headerLen + 4, totalLen);
			if (frameType === FRAME_CHUNK) onChunk(key, payload);
			else if (frameType === FRAME_ERROR) onError(key, decoder.decode(payload));
			else throw new Error(`Unknown frame type: ${frameType}`);
			buffer = buffer.slice(totalLen);
		}
	};
}
function produceMultiplexedStream(fn) {
	let controller;
	const frameStream = new ReadableStream({ start(c) {
		controller = c;
	} });
	const callback = async (key, stream) => {
		controller.enqueue(encodeStart(key));
		const reader = stream.getReader();
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				if (!(value instanceof Uint8Array)) throw new Error("Unexpected buffer type");
				controller.enqueue(encodeChunk(key, value));
			}
			controller.enqueue(encodeEnd(key));
		} catch (err) {
			controller.enqueue(encodeError(key, err));
		}
	};
	fn(callback).then(() => controller.close(), (err) => controller.error(err));
	return frameStream;
}
async function consumeMultiplexedStream(frameStream, callback) {
	const controllers = /* @__PURE__ */ new Map();
	const promises = [];
	const dispatchFrame = createFrameDispatcher((key) => {
		const stream = new ReadableStream({ start(c) {
			controllers.set(key, c);
		} });
		promises.push(callback(key, stream));
	}, (key, chunk) => {
		controllers.get(key)?.enqueue(chunk);
	}, (key) => {
		controllers.get(key)?.close();
		controllers.delete(key);
	}, (key, error) => {
		controllers.get(key)?.error(error);
		controllers.delete(key);
	});
	const reader = frameStream.getReader();
	while (true) {
		const { value, done } = await reader.read();
		if (done) break;
		dispatchFrame(value);
	}
	await Promise.all(promises);
}
//#endregion
//#region node_modules/waku/dist/lib/vite-rsc/handler.js
function loadSsrEntryModule() {
	return import("../ssr/index.js");
}
var toProcessRequest = (handleRequest) => async (req) => {
	const temporaryReferences = createTemporaryReferenceSet();
	const input = await getInput(req, config$1, temporaryReferences, decodeReply, decodeAction, decodeFormState, loadServerAction);
	const debugId = void 0;
	globalThis.__WAKU_DEBUG_CHANNELS__;
	const renderUtils = createRenderUtils(temporaryReferences, renderToReadableStream$1, createFromReadableStream$1, loadSsrEntryModule, "xdm5_1Q6", void 0, debugId);
	let res;
	try {
		res = await handleRequest(input, {
			...renderUtils,
			loadBuildMetadata: async (key) => buildMetadata.get(key)
		});
	} catch (e) {
		const info = getErrorInfo(e);
		const status = info?.status || 500;
		let message;
		if (info) message = e?.message || String(e);
		else {
			console.warn(sanitizeLog(e));
			message = "Internal Server Error";
		}
		const body = stringToStream(message);
		const headers = {};
		if (info?.location) headers.location = addBase(info.location, config$1.basePath);
		return new Response(body, {
			status,
			headers
		});
	}
	if (res instanceof ReadableStream) return new Response(res);
	else if (res && res !== "fallback") return res;
	const url = new URL(req.url);
	if (res === "fallback" || !res && url.pathname === "/") {
		const { INTERNAL_renderHtmlFallback } = await loadSsrEntryModule();
		const htmlFallbackStream = await INTERNAL_renderHtmlFallback();
		return new Response(htmlFallbackStream, { headers: { "content-type": "text/html; charset=utf-8" } });
	}
	return null;
};
var toProcessBuild = (handleBuild) => async ({ emitFile, unstable_registerPrunableFile }) => {
	const renderUtils = createRenderUtils(void 0, renderToReadableStream$1, createFromReadableStream$1, loadSsrEntryModule, "xdm5_1Q6");
	let fallbackHtml;
	const getFallbackHtml = async () => {
		if (!fallbackHtml) fallbackHtml = await (await loadSsrEntryModule()).INTERNAL_renderHtmlFallback();
		return fallbackHtml;
	};
	const getPublicFilePath = (fileName) => {
		const filePath = joinPath(DIST_PUBLIC$1, fileName);
		if (!filePath.startsWith("public/")) throw new Error("fileName escapes the public directory: " + fileName);
		return filePath;
	};
	await handleBuild({
		renderRsc: renderUtils.renderRsc,
		parseRsc: renderUtils.parseRsc,
		renderHtml: renderUtils.renderHtml,
		rscPath2pathname: (rscPath) => joinPath(config$1.rscBase, encodeRscPath(rscPath)),
		saveBuildMetadata: async (key, value) => {
			buildMetadata.set(key, value);
		},
		generateFile: async (fileName, body) => {
			await emitFile(getPublicFilePath(fileName), typeof body === "string" ? stringToStream(body) : body);
		},
		generateDefaultHtml: async (fileName) => {
			await emitFile(getPublicFilePath(fileName), stringToStream(await getFallbackHtml()));
		},
		unstable_registerPrunableFile
	});
	await emitFile(joinPath(DIST_SERVER, BUILD_METADATA_FILE), stringToStream(`export const buildMetadata = new Map(${JSON.stringify(Array.from(buildMetadata))});`));
};
var createServerEntryAdapter = (fn) => (handlers, options) => {
	return fn({
		handlers,
		processRequest: toProcessRequest(handlers.handleRequest),
		processBuild: toProcessBuild(handlers.handleBuild),
		setAllEnv,
		config: config$1,
		isBuild: true,
		notFoundHtml: void 0
	}, options);
};
//#endregion
//#region node_modules/waku/dist/lib/vite-rsc/preview.js
async function startPreviewServer() {
	const start = globalThis.__WAKU_START_PREVIEW_SERVER__;
	if (!start) throw new Error("Preview server is not available.");
	return start();
}
//#endregion
//#region node_modules/waku/dist/lib/hono/middleware.js
var middleware_exports = /* @__PURE__ */ __exportAll({
	middlewareRunner: () => middlewareRunner$1,
	rscMiddleware: () => rscMiddleware$1
});
function rscMiddleware$1({ processRequest }) {
	return async (c, next) => {
		const req = c.req.raw;
		const res = await processRequest(req);
		if (res) {
			c.res = res;
			return;
		}
		await next();
	};
}
function middlewareRunner$1(middlewareModules, opts) {
	let handlersPromise;
	return async (c, next) => {
		if (!handlersPromise) handlersPromise = Promise.all(Object.values(middlewareModules).map((m) => m().then((mod) => mod.default(opts))));
		const handlers = await handlersPromise;
		let response;
		const run = async (index) => {
			const handler = handlers[index];
			if (handler) {
				const result = await handler(c, () => run(index + 1));
				if (result && !response) response = result;
			} else await next();
		};
		await run(0);
		return response;
	};
}
//#endregion
//#region node_modules/waku/dist/adapters/cloudflare.js
var { DIST_PUBLIC } = constants_exports;
var { rscMiddleware, middlewareRunner } = middleware_exports;
var DEFAULT_BODY_LIMIT_MAX_SIZE = 100 * 1024 * 1024;
var PRUNABLE_KEY_PREFIX = "\0__prunable__/";
var emptyStream = () => new ReadableStream({ start(controller) {
	controller.close();
} });
function isProductionWorker(req) {
	return !!req.headers.get("cf-visitor");
}
function isLoopbackRequest(req) {
	const { hostname } = new URL(req.url);
	return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
}
function removeGzipEncoding(res) {
	const contentType = res.headers.get("content-type");
	if (!contentType || contentType.includes("text/html") || contentType.includes("text/plain")) {
		const headers = new Headers(res.headers);
		headers.set("content-encoding", "Identity");
		return new Response(res.body, {
			status: res.status,
			statusText: res.statusText,
			headers
		});
	}
	return res;
}
var cloudflare_default = createServerEntryAdapter(({ processRequest, processBuild, setAllEnv, config, notFoundHtml }, options) => {
	const { bodyLimit: bodyLimitOptions, middlewareFns = [], middlewareModules = {}, internalPathToBuildStaticFiles = "__waku_internal_build_static_files" } = options || {};
	const app = new Hono();
	app.notFound((c) => {
		if (notFoundHtml) return c.html(notFoundHtml, 404);
		return c.text("404 Not Found", 404);
	});
	if (bodyLimitOptions !== false) app.use(bodyLimit(bodyLimitOptions ?? { maxSize: DEFAULT_BODY_LIMIT_MAX_SIZE }));
	for (const middlewareFn of middlewareFns) app.use(middlewareFn({ app }));
	app.use(middlewareRunner(middlewareModules, { app }));
	app.use(rscMiddleware({ processRequest }));
	const buildOptions = {
		srcDir: config.srcDir,
		distDir: config.distDir,
		DIST_PUBLIC,
		serverless: !options?.static
	};
	const buildBody = () => produceMultiplexedStream(async (emitFile) => {
		await processBuild({
			emitFile,
			unstable_registerPrunableFile: (srcPath) => emitFile(PRUNABLE_KEY_PREFIX + srcPath, emptyStream())
		});
	});
	const fetchFn = async (req) => {
		if (new URL(req.url).pathname === `/${internalPathToBuildStaticFiles}` && isLoopbackRequest(req) && !isProductionWorker(req)) return new Response(buildBody());
		let cloudflareContext;
		try {
			cloudflareContext = await import(
				/* @vite-ignore */
				"cloudflare:workers"
);
		} catch {}
		let res;
		if (cloudflareContext) {
			const { env, waitUntil, passThroughOnException } = cloudflareContext;
			res = app.fetch(req, env, {
				waitUntil,
				passThroughOnException,
				props: void 0
			});
		} else res = app.fetch(req);
		if (!isProductionWorker(req)) if ("then" in res) res = res.then((res) => removeGzipEncoding(res));
		else res = removeGzipEncoding(res);
		return res;
	};
	return {
		fetch: fetchFn,
		build: async (utils) => {
			const server = await startPreviewServer();
			server.middlewares.use(async (_req, res, next) => {
				try {
					const { Readable } = await import(
						/* @vite-ignore */
						"node:stream"
);
					Readable.fromWeb(buildBody()).pipe(res);
				} catch (err) {
					next(err);
				}
			});
			await consumeMultiplexedStream((await fetch(server.baseUrl + internalPathToBuildStaticFiles, { headers: { connection: "close" } })).body, async (key, stream) => {
				if (key.startsWith(PRUNABLE_KEY_PREFIX)) {
					utils.unstable_registerPrunableFile(key.slice(14));
					return;
				}
				await utils.emitFile(key, stream);
			});
			await new Promise((resolve) => setTimeout(resolve, 100));
			await server.close();
		},
		buildOptions,
		buildEnhancers: ["waku/adapters/cloudflare-build-enhancer"],
		defaultExport: {
			...options?.handlers,
			fetch(req, env) {
				setAllEnv(env);
				return fetchFn(req);
			}
		}
	};
});
//#endregion
//#region node_modules/fumapress/dist/config.js
function defineConfig(config) {
	const plugins = [];
	const layouts = {};
	const adapters = [];
	return {
		$context: void 0,
		get() {
			return {
				...config,
				plugins,
				layouts,
				adapters
			};
		},
		plugins(...plugins) {
			return this.usePlugins(...plugins);
		},
		adapters(...adapters) {
			return this.useAdapters(...adapters);
		},
		layouts(layouts) {
			return this.useLayouts(layouts);
		},
		useAdapters(...values) {
			adapters.push(...values);
			return this;
		},
		useLayouts(overrides) {
			Object.assign(layouts, overrides);
			return this;
		},
		usePlugins(...values) {
			plugins.push(...values);
			return this;
		}
	};
}
//#endregion
//#region node_modules/fumadocs-core/dist/rolldown-runtime-B-1-B7_t.js
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region node_modules/fumadocs-core/dist/source/llms.js
function llms(loader, config = {}) {
	const { TAB = "  ", renderName = (node, ctx) => {
		if (node.type === "page") {
			const page = loader.getNodePage(node, ctx.lang);
			if (page?.data.title) return page.data.title;
		} else if (node.type !== "separator") {
			const meta = loader.getNodeMeta(node, ctx.lang);
			if (meta?.data.title) return meta.data.title;
		}
		return typeof node.name === "string" ? node.name : "";
	}, renderDescription = (node, ctx) => {
		if (node.type === "page") {
			const page = loader.getNodePage(node, ctx.lang);
			if (page?.data.description) return page.data.description;
		} else {
			const meta = loader.getNodeMeta(node, ctx.lang);
			if (meta?.data.description) return meta.data.description;
		}
		return typeof node.description === "string" ? node.description : "";
	} } = config;
	function formatListItem(name, description, indent) {
		const prefix = TAB.repeat(indent);
		description = description.trim();
		if (description.length > 0) return `${prefix}- ${name}: ${description}`;
		return `${prefix}- ${name}`;
	}
	function formatNode(node, indent, ctx) {
		switch (node.type) {
			case "page": return formatListItem(formatMarkdownLink(renderName(node, ctx), node.url), renderDescription(node, ctx), indent);
			case "folder": {
				const out = [];
				out.push(formatListItem(renderName(node, ctx), renderDescription(node, ctx), indent));
				if (node.index) out.push(formatNode(node.index, indent + 1, ctx));
				for (const child of node.children) out.push(formatNode(child, indent + 1, ctx));
				return out.join("\n");
			}
			case "separator": return "\n" + formatListItem(`**${renderName(node, ctx) || "Separator"}**`, "", indent);
		}
	}
	function index(lang) {
		if (loader._i18n && lang === void 0) {
			const { languages } = loader._i18n;
			return languages.map(index).join("\n\n");
		}
		const pageTree = loader.getPageTree(lang);
		const out = [];
		const ctx = { lang };
		out.push(`# ${renderName(pageTree, ctx)}`, "");
		const description = renderDescription(pageTree, ctx);
		if (description) out.push(`> ${description}`, "");
		for (const child of pageTree.children) out.push(formatNode(child, 0, ctx));
		return out.join("\n");
	}
	return {
		/**
		* generate `llms.txt` content in Markdown format.
		*
		* use `indexNode(node)` instead for more control (e.g. add extra sections to output).
		*/
		index,
		/**
		* generate `llms.txt` content for a single page tree node.
		*/
		indexNode(node, lang) {
			return formatNode(node, 0, { lang });
		}
	};
}
function formatMarkdownLink(title, url) {
	return `[${title.replace(/([[\]])/g, "\\$1")}](${url.replace(/([()])/g, "\\$1")})`;
}
//#endregion
//#region node_modules/cnfast/dist/index.mjs
var isArray = Array.isArray;
var resolveClassValue = (value) => {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number") return "" + value;
	let result = "";
	if (isArray(value)) {
		const length = value.length;
		for (let index = 0; index < length; index++) {
			const item = value[index];
			if (!item) continue;
			const resolved = typeof item === "string" ? item : resolveClassValue(item);
			if (resolved) {
				if (result) result += " ";
				result += resolved;
			}
		}
		return result;
	}
	if (typeof value === "object") {
		for (const key in value) if (value[key]) {
			if (result) result += " ";
			result += key;
		}
	}
	return result;
};
/**
* Concatenates two arrays faster than the array spread operator.
*/
var concatArrays = (array1, array2) => {
	const length1 = array1.length;
	const length2 = array2.length;
	const combinedArray = new Array(length1 + length2);
	for (let i = 0; i < length1; i++) combinedArray[i] = array1[i];
	for (let i = 0; i < length2; i++) combinedArray[length1 + i] = array2[i];
	return combinedArray;
};
var createClassValidatorObject = (classGroupId, validator) => ({
	classGroupId,
	validator
});
var createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators = null, classGroupId) => ({
	nextPart,
	validators,
	classGroupId
});
var CLASS_PART_SEPARATOR = "-";
var EMPTY_CONFLICTS = [];
var ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
var createClassGroupUtils = (config) => {
	const classMap = createClassMap(config);
	const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
	const getClassGroupId = (className) => {
		if (className[0] === "[" && className[className.length - 1] === "]") return getGroupIdForArbitraryProperty(className);
		const classParts = className.split(CLASS_PART_SEPARATOR);
		return getGroupRecursive(classParts, classParts[0] === "" && classParts.length > 1 ? 1 : 0, classMap);
	};
	const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
		if (hasPostfixModifier) {
			const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
			const baseConflicts = conflictingClassGroups[classGroupId];
			if (modifierConflicts) {
				if (baseConflicts) return concatArrays(baseConflicts, modifierConflicts);
				return modifierConflicts;
			}
			return baseConflicts || EMPTY_CONFLICTS;
		}
		return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
	};
	return {
		getClassGroupId,
		getConflictingClassGroupIds
	};
};
var getGroupRecursive = (classParts, startIndex, classPartObject) => {
	if (classParts.length - startIndex === 0) return classPartObject.classGroupId;
	const currentClassPart = classParts[startIndex];
	const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
	if (nextClassPartObject) {
		const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
		if (result) return result;
	}
	const validators = classPartObject.validators;
	if (validators === null) return;
	const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
	const validatorsLength = validators.length;
	for (let index = 0; index < validatorsLength; index++) {
		const validatorObject = validators[index];
		if (validatorObject.validator(classRest)) return validatorObject.classGroupId;
	}
};
/**
* Get the class group ID for an arbitrary property.
*
* @param className - The class name to get the group ID for. Is expected to be string starting with `[` and ending with `]`.
*/
var getGroupIdForArbitraryProperty = (className) => {
	const content = className.slice(1, -1);
	const colonIndex = content.indexOf(":");
	if (colonIndex === -1) return;
	const property = content.slice(0, colonIndex);
	return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
};
/**
* Exported for testing only
*/
var createClassMap = (config) => {
	const { theme, classGroups } = config;
	return processClassGroups(classGroups, theme);
};
var processClassGroups = (classGroups, theme) => {
	const classMap = createClassPartObject();
	for (const classGroupId in classGroups) {
		const group = classGroups[classGroupId];
		processClassesRecursively(group, classMap, classGroupId, theme);
	}
	return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
	const length = classGroup.length;
	for (let index = 0; index < length; index++) {
		const classDefinition = classGroup[index];
		processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
	}
};
var processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (typeof classDefinition === "string") {
		processStringDefinition(classDefinition, classPartObject, classGroupId);
		return;
	}
	if (typeof classDefinition === "function") {
		processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
		return;
	}
	processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
};
var processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
	const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
	classPartObjectToEdit.classGroupId = classGroupId;
};
var processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (isThemeGetter(classDefinition)) {
		processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
		return;
	}
	if (classPartObject.validators === null) classPartObject.validators = [];
	classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
};
var processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	const entries = Object.entries(classDefinition);
	const length = entries.length;
	for (let index = 0; index < length; index++) {
		const [key, value] = entries[index];
		processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
	}
};
var getPart = (classPartObject, path) => {
	let current = classPartObject;
	const parts = path.split(CLASS_PART_SEPARATOR);
	const length = parts.length;
	for (let index = 0; index < length; index++) {
		const part = parts[index];
		let next = current.nextPart.get(part);
		if (!next) {
			next = createClassPartObject();
			current.nextPart.set(part, next);
		}
		current = next;
	}
	return current;
};
var isThemeGetter = (classDefinition) => "isThemeGetter" in classDefinition && classDefinition.isThemeGetter === true;
var CHAR_MODIFIER_SEPARATOR = 58;
var CHAR_POSTFIX_SEPARATOR = 47;
var CHAR_OPEN_BRACKET = 91;
var CHAR_CLOSE_BRACKET = 93;
var CHAR_OPEN_PAREN = 40;
var CHAR_CLOSE_PAREN = 41;
var CHAR_IMPORTANT = 33;
var createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition) => ({
	modifiers,
	hasImportantModifier,
	baseClassName,
	maybePostfixModifierPosition,
	isExternal: void 0
});
/**
* Parse class name into parts.
*
* Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
* @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
*/
var parseClassName = (className) => {
	const modifiers = [];
	let bracketDepth = 0;
	let parenDepth = 0;
	let modifierStart = 0;
	let postfixModifierPosition;
	const len = className.length;
	for (let index = 0; index < len; index++) {
		const charCode = className.charCodeAt(index);
		if (bracketDepth === 0 && parenDepth === 0) {
			if (charCode === CHAR_MODIFIER_SEPARATOR) {
				modifiers.push(className.slice(modifierStart, index));
				modifierStart = index + 1;
				continue;
			}
			if (charCode === CHAR_POSTFIX_SEPARATOR) {
				postfixModifierPosition = index;
				continue;
			}
		}
		if (charCode === CHAR_OPEN_BRACKET) bracketDepth++;
		else if (charCode === CHAR_CLOSE_BRACKET) bracketDepth--;
		else if (charCode === CHAR_OPEN_PAREN) parenDepth++;
		else if (charCode === CHAR_CLOSE_PAREN) parenDepth--;
	}
	const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
	let baseClassName = baseClassNameWithImportantModifier;
	let hasImportantModifier = false;
	const lastIndex = baseClassNameWithImportantModifier.length - 1;
	if (baseClassNameWithImportantModifier.charCodeAt(lastIndex) === CHAR_IMPORTANT) {
		baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
		hasImportantModifier = true;
	} else if (baseClassNameWithImportantModifier.charCodeAt(0) === CHAR_IMPORTANT) {
		baseClassName = baseClassNameWithImportantModifier.slice(1);
		hasImportantModifier = true;
	}
	const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
	return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
};
/**
* Sorts modifiers according to following schema:
* - Predefined modifiers are sorted alphabetically
* - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
*/
var createSortModifiers = (config) => {
	const orderSensitiveModifiers = new Set(config.orderSensitiveModifiers);
	return (modifiers) => {
		const result = [];
		let currentSegment = [];
		for (let index = 0; index < modifiers.length; index++) {
			const modifier = modifiers[index];
			const isArbitrary = modifier[0] === "[";
			const isOrderSensitive = orderSensitiveModifiers.has(modifier);
			if (isArbitrary || isOrderSensitive) {
				if (currentSegment.length > 0) {
					currentSegment.sort();
					for (let segmentIndex = 0; segmentIndex < currentSegment.length; segmentIndex++) result.push(currentSegment[segmentIndex]);
					currentSegment = [];
				}
				result.push(modifier);
			} else currentSegment.push(modifier);
		}
		if (currentSegment.length > 0) {
			currentSegment.sort();
			for (let segmentIndex = 0; segmentIndex < currentSegment.length; segmentIndex++) result.push(currentSegment[segmentIndex]);
		}
		return result;
	};
};
var EXTERNAL_DESCRIPTOR = {
	isExternal: true,
	classId: -1,
	conflictIds: []
};
/**
* Per-token descriptor cache capacity (entries). Larger than the whole-string LRU because
* individual tokens are far more numerous but cheap to store; the LRU bound prevents
* unbounded growth when callers pass dynamically generated arbitrary values (e.g. `w-[123px]`).
*/
var DESCRIPTOR_CACHE_SIZE = 4096;
var createConfigUtils = (config) => {
	const sortModifiers = createSortModifiers(config);
	const postfixLookupClassGroupIds = createPostfixLookupClassGroupIds(config);
	const { getClassGroupId, getConflictingClassGroupIds } = createClassGroupUtils(config);
	let descriptorCache = Object.create(null);
	let previousDescriptorCache = Object.create(null);
	let descriptorCacheSize = 0;
	let claimedGeneration = /* @__PURE__ */ new Int32Array(256);
	let currentGeneration = 0;
	let keepFlags = /* @__PURE__ */ new Uint8Array(64);
	let splitSawNonSpaceWhitespace = false;
	const splitClassList = (classList) => {
		const tokens = [];
		const length = classList.length;
		let tokenStart = -1;
		splitSawNonSpaceWhitespace = false;
		for (let index = 0; index < length; index++) {
			const charCode = classList.charCodeAt(index);
			if (charCode === 32) {
				if (tokenStart !== -1) {
					tokens.push(classList.slice(tokenStart, index));
					tokenStart = -1;
				}
			} else if (charCode >= 9 && charCode <= 13) {
				splitSawNonSpaceWhitespace = true;
				if (tokenStart !== -1) {
					tokens.push(classList.slice(tokenStart, index));
					tokenStart = -1;
				}
			} else if (tokenStart === -1) tokenStart = index;
		}
		if (tokenStart !== -1) tokens.push(classList.slice(tokenStart));
		return tokens;
	};
	const conflictKeyIds = /* @__PURE__ */ new Map();
	let nextConflictKeyId = 0;
	const internConflictKey = (conflictKey) => {
		let id = conflictKeyIds.get(conflictKey);
		if (id === void 0) {
			id = nextConflictKeyId++;
			conflictKeyIds.set(conflictKey, id);
			if (id >= claimedGeneration.length) {
				const grown = new Int32Array(claimedGeneration.length * 2);
				grown.set(claimedGeneration);
				claimedGeneration = grown;
			}
		}
		return id;
	};
	const computeClassDescriptor = (originalClassName) => {
		const { isExternal, modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
		if (isExternal) return EXTERNAL_DESCRIPTOR;
		let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
		let classGroupId;
		if (hasPostfixModifier) {
			classGroupId = getClassGroupId(baseClassName.substring(0, maybePostfixModifierPosition));
			const classGroupIdWithPostfix = classGroupId && postfixLookupClassGroupIds[classGroupId] ? getClassGroupId(baseClassName) : void 0;
			if (classGroupIdWithPostfix && classGroupIdWithPostfix !== classGroupId) {
				classGroupId = classGroupIdWithPostfix;
				hasPostfixModifier = false;
			}
		} else classGroupId = getClassGroupId(baseClassName);
		if (!classGroupId) {
			if (!hasPostfixModifier) return EXTERNAL_DESCRIPTOR;
			classGroupId = getClassGroupId(baseClassName);
			if (!classGroupId) return EXTERNAL_DESCRIPTOR;
			hasPostfixModifier = false;
		}
		const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
		const modifierId = hasImportantModifier ? variantModifier + "!" : variantModifier;
		const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
		const conflictIds = [];
		for (let index = 0; index < conflictGroups.length; index++) conflictIds.push(internConflictKey(modifierId + conflictGroups[index]));
		return {
			isExternal: false,
			classId: internConflictKey(modifierId + classGroupId),
			conflictIds
		};
	};
	const getClassDescriptor = (originalClassName) => {
		let descriptor = descriptorCache[originalClassName];
		if (descriptor !== void 0) return descriptor;
		descriptor = previousDescriptorCache[originalClassName];
		if (descriptor === void 0) descriptor = computeClassDescriptor(originalClassName);
		descriptorCache[originalClassName] = descriptor;
		if (++descriptorCacheSize > DESCRIPTOR_CACHE_SIZE) {
			descriptorCacheSize = 0;
			previousDescriptorCache = descriptorCache;
			descriptorCache = Object.create(null);
		}
		return descriptor;
	};
	const mergeClassList = (classList) => {
		const classNames = splitClassList(classList);
		const classCount = classNames.length;
		if (classCount === 1) return classNames[0];
		currentGeneration = currentGeneration + 1 | 0;
		if (currentGeneration === 0) currentGeneration = 1;
		const generation = currentGeneration;
		if (classCount > keepFlags.length) {
			let capacity = keepFlags.length;
			while (capacity < classCount) capacity *= 2;
			keepFlags = new Uint8Array(capacity);
		}
		let didDrop = false;
		let tokenCharCount = 0;
		for (let index = classCount - 1; index >= 0; index -= 1) {
			const className = classNames[index];
			tokenCharCount += className.length;
			const descriptor = getClassDescriptor(className);
			if (descriptor.isExternal) {
				keepFlags[index] = 1;
				continue;
			}
			const classId = descriptor.classId;
			if (claimedGeneration[classId] === generation) {
				keepFlags[index] = 0;
				didDrop = true;
				continue;
			}
			claimedGeneration[classId] = generation;
			const conflictIds = descriptor.conflictIds;
			for (let conflictIndex = 0; conflictIndex < conflictIds.length; conflictIndex++) claimedGeneration[conflictIds[conflictIndex]] = generation;
			keepFlags[index] = 1;
		}
		if (!didDrop && !splitSawNonSpaceWhitespace && classList.length === tokenCharCount + classCount - 1) return classList;
		let result = "";
		for (let index = 0; index < classCount; index++) if (keepFlags[index] === 1) {
			if (result) result += " ";
			result += classNames[index];
		}
		return result;
	};
	return {
		parseClassName,
		sortModifiers,
		postfixLookupClassGroupIds,
		getClassGroupId,
		getConflictingClassGroupIds,
		getClassDescriptor,
		mergeClassList
	};
};
var createPostfixLookupClassGroupIds = (config) => {
	const lookup = Object.create(null);
	const classGroupIds = config.postfixLookupClassGroups;
	if (classGroupIds) for (let index = 0; index < classGroupIds.length; index++) lookup[classGroupIds[index]] = true;
	return lookup;
};
var twJoin = (...classLists) => {
	let index = 0;
	let argument;
	let resolvedValue;
	let string = "";
	while (index < classLists.length) if (argument = classLists[index++]) {
		if (resolvedValue = toValue(argument)) {
			if (string) string += " ";
			string += resolvedValue;
		}
	}
	return string;
};
var toValue = (value) => {
	if (typeof value === "string") return value;
	let resolvedValue;
	let string = "";
	for (let index = 0; index < value.length; index++) if (value[index]) {
		if (resolvedValue = toValue(value[index])) {
			if (string) string += " ";
			string += resolvedValue;
		}
	}
	return string;
};
/**
* Whole-string result cache capacity. Matches tailwind-merge's default; cnfast ships a single,
* non-configurable config so it is baked in rather than exposed as an option.
*/
var MERGE_CACHE_SIZE = 500;
var createTailwindMerge = (createConfig) => {
	let configUtils;
	let mergeClassList;
	let cache = Object.create(null);
	let previousCache = Object.create(null);
	let cacheSize = 0;
	const initTailwindMerge = (classList) => {
		configUtils = createConfigUtils(createConfig());
		mergeClassList = configUtils.mergeClassList;
		merge.mergeString = tailwindMerge;
		return tailwindMerge(classList);
	};
	const tailwindMerge = (classList) => {
		let result = cache[classList];
		if (result !== void 0) return result;
		result = previousCache[classList];
		if (result === void 0) result = mergeClassList(classList);
		cache[classList] = result;
		if (++cacheSize > MERGE_CACHE_SIZE) {
			cacheSize = 0;
			previousCache = cache;
			cache = Object.create(null);
		}
		return result;
	};
	const merge = (...args) => merge.mergeString(twJoin(...args));
	merge.mergeString = initTailwindMerge;
	return merge;
};
var fallbackThemeArr = [];
var fromTheme = (key) => {
	const themeGetter = (theme) => theme[key] || fallbackThemeArr;
	themeGetter.isThemeGetter = true;
	return themeGetter;
};
var arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
var arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
var fractionRegex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var toNumber = Number;
var numberIsNaN = Number.isNaN;
var numberIsInteger = Number.isInteger;
var isFraction = (value) => fractionRegex.test(value);
var isNumber = (value) => Boolean(value) && !numberIsNaN(toNumber(value));
var isInteger = (value) => Boolean(value) && numberIsInteger(toNumber(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var isAny = () => true;
var isLengthOnly = (value) => lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
var isNamedContainerQuery = (value) => value.startsWith("@container") && (value[10] === "/" && value[11] !== void 0 || value[11] === "s" && value[16] !== void 0 && value.startsWith("-size/", 10) || value[11] === "n" && value[18] !== void 0 && value.startsWith("-normal/", 10));
var isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
var isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
var isArbitraryWeight = (value) => getIsArbitraryValue(value, isLabelWeight, isAny);
var isArbitraryFamilyName = (value) => getIsArbitraryValue(value, isLabelFamilyName, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
var isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
var isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
var isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
var isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
var isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
var isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
var isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
var isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
var isArbitraryVariableWeight = (value) => getIsArbitraryVariable(value, isLabelWeight, true);
var getIsArbitraryValue = (value, testLabel, testValue) => {
	const result = arbitraryValueRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return testValue(result[2]);
	}
	return false;
};
var getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
	const result = arbitraryVariableRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return shouldMatchNoLabel;
	}
	return false;
};
var isLabelPosition = (label) => label === "position" || label === "percentage";
var isLabelImage = (label) => label === "image" || label === "url";
var isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
var isLabelLength = (label) => label === "length";
var isLabelNumber = (label) => label === "number";
var isLabelFamilyName = (label) => label === "family-name";
var isLabelWeight = (label) => label === "number" || label === "weight";
var isLabelShadow = (label) => label === "shadow";
var getDefaultConfig = () => {
	/**
	* Theme getters for theme variable namespaces
	* @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
	*/
	const themeColor = fromTheme("color");
	const themeFont = fromTheme("font");
	const themeText = fromTheme("text");
	const themeFontWeight = fromTheme("font-weight");
	const themeTracking = fromTheme("tracking");
	const themeLeading = fromTheme("leading");
	const themeBreakpoint = fromTheme("breakpoint");
	const themeContainer = fromTheme("container");
	const themeSpacing = fromTheme("spacing");
	const themeRadius = fromTheme("radius");
	const themeShadow = fromTheme("shadow");
	const themeInsetShadow = fromTheme("inset-shadow");
	const themeTextShadow = fromTheme("text-shadow");
	const themeDropShadow = fromTheme("drop-shadow");
	const themeBlur = fromTheme("blur");
	const themePerspective = fromTheme("perspective");
	const themeAspect = fromTheme("aspect");
	const themeEase = fromTheme("ease");
	const themeAnimate = fromTheme("animate");
	/**
	* Helpers to avoid repeating the same scales
	*
	* We use functions that create a new array every time they're called instead of static arrays.
	* This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
	*/
	const scaleBreak = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	];
	const scalePosition = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	];
	const scalePositionWithArbitrary = () => [
		...scalePosition(),
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleOverflow = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	];
	const scaleOverscroll = () => [
		"auto",
		"contain",
		"none"
	];
	const scaleUnambiguousSpacing = () => [
		isArbitraryVariable,
		isArbitraryValue,
		themeSpacing
	];
	const scaleInset = () => [
		isFraction,
		"full",
		"auto",
		...scaleUnambiguousSpacing()
	];
	const scaleGridTemplateColsRows = () => [
		isInteger,
		"none",
		"subgrid",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartAndEnd = () => [
		"auto",
		{ span: [
			"full",
			isInteger,
			isArbitraryVariable,
			isArbitraryValue
		] },
		isInteger,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartOrEnd = () => [
		isInteger,
		"auto",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridAutoColsRows = () => [
		"auto",
		"min",
		"max",
		"fr",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleAlignPrimaryAxis = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	];
	const scaleAlignSecondaryAxis = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	];
	const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
	const scaleSizing = () => [
		isFraction,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingInline = () => [
		isFraction,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingBlock = () => [
		isFraction,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleColor = () => [
		themeColor,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBgPosition = () => [
		...scalePosition(),
		isArbitraryVariablePosition,
		isArbitraryPosition,
		{ position: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleBgRepeat = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }];
	const scaleBgSize = () => [
		"auto",
		"cover",
		"contain",
		isArbitraryVariableSize,
		isArbitrarySize,
		{ size: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleGradientStopPosition = () => [
		isPercent,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleRadius = () => [
		"",
		"none",
		"full",
		themeRadius,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBorderWidth = () => [
		"",
		isNumber,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleLineStyle = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	];
	const scaleBlendMode = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	];
	const scaleMaskImagePosition = () => [
		isNumber,
		isPercent,
		isArbitraryVariablePosition,
		isArbitraryPosition
	];
	const scaleBlur = () => [
		"",
		"none",
		themeBlur,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleRotate = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleScale = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleSkew = () => [
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleTranslate = () => [
		isFraction,
		"full",
		...scaleUnambiguousSpacing()
	];
	return {
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [isTshirtSize],
			breakpoint: [isTshirtSize],
			color: [isAny],
			container: [isTshirtSize],
			"drop-shadow": [isTshirtSize],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [isAnyNonArbitrary],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [isTshirtSize],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [isTshirtSize],
			shadow: [isTshirtSize],
			spacing: ["px", isNumber],
			text: [isTshirtSize],
			"text-shadow": [isTshirtSize],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			/**
			* Aspect Ratio
			* @see https://tailwindcss.com/docs/aspect-ratio
			*/
			aspect: [{ aspect: [
				"auto",
				"square",
				isFraction,
				isArbitraryValue,
				isArbitraryVariable,
				themeAspect
			] }],
			/**
			* Container
			* @see https://tailwindcss.com/docs/container
			* @deprecated since Tailwind CSS v4.0.0
			*/
			container: ["container"],
			/**
			* Container Type
			* @see https://tailwindcss.com/docs/responsive-design#container-queries
			*/
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Container Name
			* @see https://tailwindcss.com/docs/responsive-design#named-containers
			*/
			"container-named": [isNamedContainerQuery],
			/**
			* Columns
			* @see https://tailwindcss.com/docs/columns
			*/
			columns: [{ columns: [
				isNumber,
				isArbitraryValue,
				isArbitraryVariable,
				themeContainer
			] }],
			/**
			* Break After
			* @see https://tailwindcss.com/docs/break-after
			*/
			"break-after": [{ "break-after": scaleBreak() }],
			/**
			* Break Before
			* @see https://tailwindcss.com/docs/break-before
			*/
			"break-before": [{ "break-before": scaleBreak() }],
			/**
			* Break Inside
			* @see https://tailwindcss.com/docs/break-inside
			*/
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			/**
			* Box Decoration Break
			* @see https://tailwindcss.com/docs/box-decoration-break
			*/
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			/**
			* Box Sizing
			* @see https://tailwindcss.com/docs/box-sizing
			*/
			box: [{ box: ["border", "content"] }],
			/**
			* Display
			* @see https://tailwindcss.com/docs/display
			*/
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			/**
			* Screen Reader Only
			* @see https://tailwindcss.com/docs/display#screen-reader-only
			*/
			sr: ["sr-only", "not-sr-only"],
			/**
			* Floats
			* @see https://tailwindcss.com/docs/float
			*/
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			/**
			* Clear
			* @see https://tailwindcss.com/docs/clear
			*/
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			/**
			* Isolation
			* @see https://tailwindcss.com/docs/isolation
			*/
			isolation: ["isolate", "isolation-auto"],
			/**
			* Object Fit
			* @see https://tailwindcss.com/docs/object-fit
			*/
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			/**
			* Object Position
			* @see https://tailwindcss.com/docs/object-position
			*/
			"object-position": [{ object: scalePositionWithArbitrary() }],
			/**
			* Overflow
			* @see https://tailwindcss.com/docs/overflow
			*/
			overflow: [{ overflow: scaleOverflow() }],
			/**
			* Overflow X
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-x": [{ "overflow-x": scaleOverflow() }],
			/**
			* Overflow Y
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-y": [{ "overflow-y": scaleOverflow() }],
			/**
			* Overscroll Behavior
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			overscroll: [{ overscroll: scaleOverscroll() }],
			/**
			* Overscroll Behavior X
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-x": [{ "overscroll-x": scaleOverscroll() }],
			/**
			* Overscroll Behavior Y
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-y": [{ "overscroll-y": scaleOverscroll() }],
			/**
			* Position
			* @see https://tailwindcss.com/docs/position
			*/
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			/**
			* Inset
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			inset: [{ inset: scaleInset() }],
			/**
			* Inset Inline
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-x": [{ "inset-x": scaleInset() }],
			/**
			* Inset Block
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-y": [{ "inset-y": scaleInset() }],
			/**
			* Inset Inline Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-s` in next major release
			*/
			start: [{
				"inset-s": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				start: scaleInset()
			}],
			/**
			* Inset Inline End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-e` in next major release
			*/
			end: [{
				"inset-e": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				end: scaleInset()
			}],
			/**
			* Inset Block Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-bs": [{ "inset-bs": scaleInset() }],
			/**
			* Inset Block End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-be": [{ "inset-be": scaleInset() }],
			/**
			* Top
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			top: [{ top: scaleInset() }],
			/**
			* Right
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			right: [{ right: scaleInset() }],
			/**
			* Bottom
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			bottom: [{ bottom: scaleInset() }],
			/**
			* Left
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			left: [{ left: scaleInset() }],
			/**
			* Visibility
			* @see https://tailwindcss.com/docs/visibility
			*/
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			/**
			* Z-Index
			* @see https://tailwindcss.com/docs/z-index
			*/
			z: [{ z: [
				isInteger,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Basis
			* @see https://tailwindcss.com/docs/flex-basis
			*/
			basis: [{ basis: [
				isFraction,
				"full",
				"auto",
				themeContainer,
				...scaleUnambiguousSpacing()
			] }],
			/**
			* Flex Direction
			* @see https://tailwindcss.com/docs/flex-direction
			*/
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			/**
			* Flex Wrap
			* @see https://tailwindcss.com/docs/flex-wrap
			*/
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			/**
			* Flex
			* @see https://tailwindcss.com/docs/flex
			*/
			flex: [{ flex: [
				isNumber,
				isFraction,
				"auto",
				"initial",
				"none",
				isArbitraryValue
			] }],
			/**
			* Flex Grow
			* @see https://tailwindcss.com/docs/flex-grow
			*/
			grow: [{ grow: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Shrink
			* @see https://tailwindcss.com/docs/flex-shrink
			*/
			shrink: [{ shrink: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Order
			* @see https://tailwindcss.com/docs/order
			*/
			order: [{ order: [
				isInteger,
				"first",
				"last",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Grid Template Columns
			* @see https://tailwindcss.com/docs/grid-template-columns
			*/
			"grid-cols": [{ "grid-cols": scaleGridTemplateColsRows() }],
			/**
			* Grid Column Start / End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start-end": [{ col: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Column Start
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start": [{ "col-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Column End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-end": [{ "col-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Template Rows
			* @see https://tailwindcss.com/docs/grid-template-rows
			*/
			"grid-rows": [{ "grid-rows": scaleGridTemplateColsRows() }],
			/**
			* Grid Row Start / End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start-end": [{ row: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Row Start
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start": [{ "row-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Row End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-end": [{ "row-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Auto Flow
			* @see https://tailwindcss.com/docs/grid-auto-flow
			*/
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			/**
			* Grid Auto Columns
			* @see https://tailwindcss.com/docs/grid-auto-columns
			*/
			"auto-cols": [{ "auto-cols": scaleGridAutoColsRows() }],
			/**
			* Grid Auto Rows
			* @see https://tailwindcss.com/docs/grid-auto-rows
			*/
			"auto-rows": [{ "auto-rows": scaleGridAutoColsRows() }],
			/**
			* Gap
			* @see https://tailwindcss.com/docs/gap
			*/
			gap: [{ gap: scaleUnambiguousSpacing() }],
			/**
			* Gap X
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-x": [{ "gap-x": scaleUnambiguousSpacing() }],
			/**
			* Gap Y
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-y": [{ "gap-y": scaleUnambiguousSpacing() }],
			/**
			* Justify Content
			* @see https://tailwindcss.com/docs/justify-content
			*/
			"justify-content": [{ justify: [...scaleAlignPrimaryAxis(), "normal"] }],
			/**
			* Justify Items
			* @see https://tailwindcss.com/docs/justify-items
			*/
			"justify-items": [{ "justify-items": [...scaleAlignSecondaryAxis(), "normal"] }],
			/**
			* Justify Self
			* @see https://tailwindcss.com/docs/justify-self
			*/
			"justify-self": [{ "justify-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Align Content
			* @see https://tailwindcss.com/docs/align-content
			*/
			"align-content": [{ content: ["normal", ...scaleAlignPrimaryAxis()] }],
			/**
			* Align Items
			* @see https://tailwindcss.com/docs/align-items
			*/
			"align-items": [{ items: [...scaleAlignSecondaryAxis(), { baseline: ["", "last"] }] }],
			/**
			* Align Self
			* @see https://tailwindcss.com/docs/align-self
			*/
			"align-self": [{ self: [
				"auto",
				...scaleAlignSecondaryAxis(),
				{ baseline: ["", "last"] }
			] }],
			/**
			* Place Content
			* @see https://tailwindcss.com/docs/place-content
			*/
			"place-content": [{ "place-content": scaleAlignPrimaryAxis() }],
			/**
			* Place Items
			* @see https://tailwindcss.com/docs/place-items
			*/
			"place-items": [{ "place-items": [...scaleAlignSecondaryAxis(), "baseline"] }],
			/**
			* Place Self
			* @see https://tailwindcss.com/docs/place-self
			*/
			"place-self": [{ "place-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Padding
			* @see https://tailwindcss.com/docs/padding
			*/
			p: [{ p: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline
			* @see https://tailwindcss.com/docs/padding
			*/
			px: [{ px: scaleUnambiguousSpacing() }],
			/**
			* Padding Block
			* @see https://tailwindcss.com/docs/padding
			*/
			py: [{ py: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline Start
			* @see https://tailwindcss.com/docs/padding
			*/
			ps: [{ ps: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline End
			* @see https://tailwindcss.com/docs/padding
			*/
			pe: [{ pe: scaleUnambiguousSpacing() }],
			/**
			* Padding Block Start
			* @see https://tailwindcss.com/docs/padding
			*/
			pbs: [{ pbs: scaleUnambiguousSpacing() }],
			/**
			* Padding Block End
			* @see https://tailwindcss.com/docs/padding
			*/
			pbe: [{ pbe: scaleUnambiguousSpacing() }],
			/**
			* Padding Top
			* @see https://tailwindcss.com/docs/padding
			*/
			pt: [{ pt: scaleUnambiguousSpacing() }],
			/**
			* Padding Right
			* @see https://tailwindcss.com/docs/padding
			*/
			pr: [{ pr: scaleUnambiguousSpacing() }],
			/**
			* Padding Bottom
			* @see https://tailwindcss.com/docs/padding
			*/
			pb: [{ pb: scaleUnambiguousSpacing() }],
			/**
			* Padding Left
			* @see https://tailwindcss.com/docs/padding
			*/
			pl: [{ pl: scaleUnambiguousSpacing() }],
			/**
			* Margin
			* @see https://tailwindcss.com/docs/margin
			*/
			m: [{ m: scaleMargin() }],
			/**
			* Margin Inline
			* @see https://tailwindcss.com/docs/margin
			*/
			mx: [{ mx: scaleMargin() }],
			/**
			* Margin Block
			* @see https://tailwindcss.com/docs/margin
			*/
			my: [{ my: scaleMargin() }],
			/**
			* Margin Inline Start
			* @see https://tailwindcss.com/docs/margin
			*/
			ms: [{ ms: scaleMargin() }],
			/**
			* Margin Inline End
			* @see https://tailwindcss.com/docs/margin
			*/
			me: [{ me: scaleMargin() }],
			/**
			* Margin Block Start
			* @see https://tailwindcss.com/docs/margin
			*/
			mbs: [{ mbs: scaleMargin() }],
			/**
			* Margin Block End
			* @see https://tailwindcss.com/docs/margin
			*/
			mbe: [{ mbe: scaleMargin() }],
			/**
			* Margin Top
			* @see https://tailwindcss.com/docs/margin
			*/
			mt: [{ mt: scaleMargin() }],
			/**
			* Margin Right
			* @see https://tailwindcss.com/docs/margin
			*/
			mr: [{ mr: scaleMargin() }],
			/**
			* Margin Bottom
			* @see https://tailwindcss.com/docs/margin
			*/
			mb: [{ mb: scaleMargin() }],
			/**
			* Margin Left
			* @see https://tailwindcss.com/docs/margin
			*/
			ml: [{ ml: scaleMargin() }],
			/**
			* Space Between X
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x": [{ "space-x": scaleUnambiguousSpacing() }],
			/**
			* Space Between X Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x-reverse": ["space-x-reverse"],
			/**
			* Space Between Y
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y": [{ "space-y": scaleUnambiguousSpacing() }],
			/**
			* Space Between Y Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y-reverse": ["space-y-reverse"],
			/**
			* Size
			* @see https://tailwindcss.com/docs/width#setting-both-width-and-height
			*/
			size: [{ size: scaleSizing() }],
			/**
			* Inline Size
			* @see https://tailwindcss.com/docs/width
			*/
			"inline-size": [{ inline: ["auto", ...scaleSizingInline()] }],
			/**
			* Min-Inline Size
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-inline-size": [{ "min-inline": ["auto", ...scaleSizingInline()] }],
			/**
			* Max-Inline Size
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-inline-size": [{ "max-inline": ["none", ...scaleSizingInline()] }],
			/**
			* Block Size
			* @see https://tailwindcss.com/docs/height
			*/
			"block-size": [{ block: ["auto", ...scaleSizingBlock()] }],
			/**
			* Min-Block Size
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-block-size": [{ "min-block": ["auto", ...scaleSizingBlock()] }],
			/**
			* Max-Block Size
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-block-size": [{ "max-block": ["none", ...scaleSizingBlock()] }],
			/**
			* Width
			* @see https://tailwindcss.com/docs/width
			*/
			w: [{ w: [
				themeContainer,
				"screen",
				...scaleSizing()
			] }],
			/**
			* Min-Width
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-w": [{ "min-w": [
				themeContainer,
				"screen",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Width
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-w": [{ "max-w": [
				themeContainer,
				"screen",
				"none",
				"prose",
				(
				/** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
				{ screen: [themeBreakpoint] }),
				...scaleSizing()
			] }],
			/**
			* Height
			* @see https://tailwindcss.com/docs/height
			*/
			h: [{ h: [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Min-Height
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Height
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Font Size
			* @see https://tailwindcss.com/docs/font-size
			*/
			"font-size": [{ text: [
				"base",
				themeText,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Font Smoothing
			* @see https://tailwindcss.com/docs/font-smoothing
			*/
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			/**
			* Font Style
			* @see https://tailwindcss.com/docs/font-style
			*/
			"font-style": ["italic", "not-italic"],
			/**
			* Font Weight
			* @see https://tailwindcss.com/docs/font-weight
			*/
			"font-weight": [{ font: [
				themeFontWeight,
				isArbitraryVariableWeight,
				isArbitraryWeight
			] }],
			/**
			* Font Stretch
			* @see https://tailwindcss.com/docs/font-stretch
			*/
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				isPercent,
				isArbitraryValue
			] }],
			/**
			* Font Family
			* @see https://tailwindcss.com/docs/font-family
			*/
			"font-family": [{ font: [
				isArbitraryVariableFamilyName,
				isArbitraryFamilyName,
				themeFont
			] }],
			/**
			* Font Feature Settings
			* @see https://tailwindcss.com/docs/font-feature-settings
			*/
			"font-features": [{ "font-features": [isArbitraryValue] }],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-normal": ["normal-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-ordinal": ["ordinal"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-slashed-zero": ["slashed-zero"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			/**
			* Letter Spacing
			* @see https://tailwindcss.com/docs/letter-spacing
			*/
			tracking: [{ tracking: [
				themeTracking,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Line Clamp
			* @see https://tailwindcss.com/docs/line-clamp
			*/
			"line-clamp": [{ "line-clamp": [
				isNumber,
				"none",
				isArbitraryVariable,
				isArbitraryNumber
			] }],
			/**
			* Line Height
			* @see https://tailwindcss.com/docs/line-height
			*/
			leading: [{ leading: [themeLeading, ...scaleUnambiguousSpacing()] }],
			/**
			* List Style Image
			* @see https://tailwindcss.com/docs/list-style-image
			*/
			"list-image": [{ "list-image": [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* List Style Position
			* @see https://tailwindcss.com/docs/list-style-position
			*/
			"list-style-position": [{ list: ["inside", "outside"] }],
			/**
			* List Style Type
			* @see https://tailwindcss.com/docs/list-style-type
			*/
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Alignment
			* @see https://tailwindcss.com/docs/text-align
			*/
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			/**
			* Placeholder Color
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://v3.tailwindcss.com/docs/placeholder-color
			*/
			"placeholder-color": [{ placeholder: scaleColor() }],
			/**
			* Text Color
			* @see https://tailwindcss.com/docs/text-color
			*/
			"text-color": [{ text: scaleColor() }],
			/**
			* Text Decoration
			* @see https://tailwindcss.com/docs/text-decoration
			*/
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			/**
			* Text Decoration Style
			* @see https://tailwindcss.com/docs/text-decoration-style
			*/
			"text-decoration-style": [{ decoration: [...scaleLineStyle(), "wavy"] }],
			/**
			* Text Decoration Thickness
			* @see https://tailwindcss.com/docs/text-decoration-thickness
			*/
			"text-decoration-thickness": [{ decoration: [
				isNumber,
				"from-font",
				"auto",
				isArbitraryVariable,
				isArbitraryLength
			] }],
			/**
			* Text Decoration Color
			* @see https://tailwindcss.com/docs/text-decoration-color
			*/
			"text-decoration-color": [{ decoration: scaleColor() }],
			/**
			* Text Underline Offset
			* @see https://tailwindcss.com/docs/text-underline-offset
			*/
			"underline-offset": [{ "underline-offset": [
				isNumber,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Transform
			* @see https://tailwindcss.com/docs/text-transform
			*/
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			/**
			* Text Overflow
			* @see https://tailwindcss.com/docs/text-overflow
			*/
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			/**
			* Text Wrap
			* @see https://tailwindcss.com/docs/text-wrap
			*/
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			/**
			* Text Indent
			* @see https://tailwindcss.com/docs/text-indent
			*/
			indent: [{ indent: scaleUnambiguousSpacing() }],
			/**
			* Tab Size
			* @see https://tailwindcss.com/docs/tab-size
			*/
			"tab-size": [{ tab: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Vertical Alignment
			* @see https://tailwindcss.com/docs/vertical-align
			*/
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Whitespace
			* @see https://tailwindcss.com/docs/whitespace
			*/
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			/**
			* Word Break
			* @see https://tailwindcss.com/docs/word-break
			*/
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			/**
			* Overflow Wrap
			* @see https://tailwindcss.com/docs/overflow-wrap
			*/
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			/**
			* Hyphens
			* @see https://tailwindcss.com/docs/hyphens
			*/
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			/**
			* Content
			* @see https://tailwindcss.com/docs/content
			*/
			content: [{ content: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Background Attachment
			* @see https://tailwindcss.com/docs/background-attachment
			*/
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			/**
			* Background Clip
			* @see https://tailwindcss.com/docs/background-clip
			*/
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			/**
			* Background Origin
			* @see https://tailwindcss.com/docs/background-origin
			*/
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			/**
			* Background Position
			* @see https://tailwindcss.com/docs/background-position
			*/
			"bg-position": [{ bg: scaleBgPosition() }],
			/**
			* Background Repeat
			* @see https://tailwindcss.com/docs/background-repeat
			*/
			"bg-repeat": [{ bg: scaleBgRepeat() }],
			/**
			* Background Size
			* @see https://tailwindcss.com/docs/background-size
			*/
			"bg-size": [{ bg: scaleBgSize() }],
			/**
			* Background Image
			* @see https://tailwindcss.com/docs/background-image
			*/
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					],
					radial: [
						"",
						isArbitraryVariable,
						isArbitraryValue
					],
					conic: [
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					]
				},
				isArbitraryVariableImage,
				isArbitraryImage
			] }],
			/**
			* Background Color
			* @see https://tailwindcss.com/docs/background-color
			*/
			"bg-color": [{ bg: scaleColor() }],
			/**
			* Gradient Color Stops From Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from-pos": [{ from: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops Via Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via-pos": [{ via: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops To Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to-pos": [{ to: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops From
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from": [{ from: scaleColor() }],
			/**
			* Gradient Color Stops Via
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via": [{ via: scaleColor() }],
			/**
			* Gradient Color Stops To
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to": [{ to: scaleColor() }],
			/**
			* Border Radius
			* @see https://tailwindcss.com/docs/border-radius
			*/
			rounded: [{ rounded: scaleRadius() }],
			/**
			* Border Radius Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-s": [{ "rounded-s": scaleRadius() }],
			/**
			* Border Radius End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-e": [{ "rounded-e": scaleRadius() }],
			/**
			* Border Radius Top
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-t": [{ "rounded-t": scaleRadius() }],
			/**
			* Border Radius Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-r": [{ "rounded-r": scaleRadius() }],
			/**
			* Border Radius Bottom
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-b": [{ "rounded-b": scaleRadius() }],
			/**
			* Border Radius Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-l": [{ "rounded-l": scaleRadius() }],
			/**
			* Border Radius Start Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ss": [{ "rounded-ss": scaleRadius() }],
			/**
			* Border Radius Start End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-se": [{ "rounded-se": scaleRadius() }],
			/**
			* Border Radius End End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ee": [{ "rounded-ee": scaleRadius() }],
			/**
			* Border Radius End Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-es": [{ "rounded-es": scaleRadius() }],
			/**
			* Border Radius Top Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tl": [{ "rounded-tl": scaleRadius() }],
			/**
			* Border Radius Top Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tr": [{ "rounded-tr": scaleRadius() }],
			/**
			* Border Radius Bottom Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-br": [{ "rounded-br": scaleRadius() }],
			/**
			* Border Radius Bottom Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-bl": [{ "rounded-bl": scaleRadius() }],
			/**
			* Border Width
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w": [{ border: scaleBorderWidth() }],
			/**
			* Border Width Inline
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-x": [{ "border-x": scaleBorderWidth() }],
			/**
			* Border Width Block
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-y": [{ "border-y": scaleBorderWidth() }],
			/**
			* Border Width Inline Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-s": [{ "border-s": scaleBorderWidth() }],
			/**
			* Border Width Inline End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-e": [{ "border-e": scaleBorderWidth() }],
			/**
			* Border Width Block Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-bs": [{ "border-bs": scaleBorderWidth() }],
			/**
			* Border Width Block End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-be": [{ "border-be": scaleBorderWidth() }],
			/**
			* Border Width Top
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-t": [{ "border-t": scaleBorderWidth() }],
			/**
			* Border Width Right
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-r": [{ "border-r": scaleBorderWidth() }],
			/**
			* Border Width Bottom
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-b": [{ "border-b": scaleBorderWidth() }],
			/**
			* Border Width Left
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-l": [{ "border-l": scaleBorderWidth() }],
			/**
			* Divide Width X
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x": [{ "divide-x": scaleBorderWidth() }],
			/**
			* Divide Width X Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x-reverse": ["divide-x-reverse"],
			/**
			* Divide Width Y
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y": [{ "divide-y": scaleBorderWidth() }],
			/**
			* Divide Width Y Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y-reverse": ["divide-y-reverse"],
			/**
			* Border Style
			* @see https://tailwindcss.com/docs/border-style
			*/
			"border-style": [{ border: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Divide Style
			* @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
			*/
			"divide-style": [{ divide: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Border Color
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color": [{ border: scaleColor() }],
			/**
			* Border Color Inline
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-x": [{ "border-x": scaleColor() }],
			/**
			* Border Color Block
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-y": [{ "border-y": scaleColor() }],
			/**
			* Border Color Inline Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-s": [{ "border-s": scaleColor() }],
			/**
			* Border Color Inline End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-e": [{ "border-e": scaleColor() }],
			/**
			* Border Color Block Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-bs": [{ "border-bs": scaleColor() }],
			/**
			* Border Color Block End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-be": [{ "border-be": scaleColor() }],
			/**
			* Border Color Top
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-t": [{ "border-t": scaleColor() }],
			/**
			* Border Color Right
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-r": [{ "border-r": scaleColor() }],
			/**
			* Border Color Bottom
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-b": [{ "border-b": scaleColor() }],
			/**
			* Border Color Left
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-l": [{ "border-l": scaleColor() }],
			/**
			* Divide Color
			* @see https://tailwindcss.com/docs/divide-color
			*/
			"divide-color": [{ divide: scaleColor() }],
			/**
			* Outline Style
			* @see https://tailwindcss.com/docs/outline-style
			*/
			"outline-style": [{ outline: [
				...scaleLineStyle(),
				"none",
				"hidden"
			] }],
			/**
			* Outline Offset
			* @see https://tailwindcss.com/docs/outline-offset
			*/
			"outline-offset": [{ "outline-offset": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Outline Width
			* @see https://tailwindcss.com/docs/outline-width
			*/
			"outline-w": [{ outline: [
				"",
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Outline Color
			* @see https://tailwindcss.com/docs/outline-color
			*/
			"outline-color": [{ outline: scaleColor() }],
			/**
			* Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow
			*/
			shadow: [{ shadow: [
				"",
				"none",
				themeShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
			*/
			"shadow-color": [{ shadow: scaleColor() }],
			/**
			* Inset Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
			*/
			"inset-shadow": [{ "inset-shadow": [
				"none",
				themeInsetShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Inset Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
			*/
			"inset-shadow-color": [{ "inset-shadow": scaleColor() }],
			/**
			* Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
			*/
			"ring-w": [{ ring: scaleBorderWidth() }],
			/**
			* Ring Width Inset
			* @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-w-inset": ["ring-inset"],
			/**
			* Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
			*/
			"ring-color": [{ ring: scaleColor() }],
			/**
			* Ring Offset Width
			* @see https://v3.tailwindcss.com/docs/ring-offset-width
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-w": [{ "ring-offset": [isNumber, isArbitraryLength] }],
			/**
			* Ring Offset Color
			* @see https://v3.tailwindcss.com/docs/ring-offset-color
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-color": [{ "ring-offset": scaleColor() }],
			/**
			* Inset Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
			*/
			"inset-ring-w": [{ "inset-ring": scaleBorderWidth() }],
			/**
			* Inset Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
			*/
			"inset-ring-color": [{ "inset-ring": scaleColor() }],
			/**
			* Text Shadow
			* @see https://tailwindcss.com/docs/text-shadow
			*/
			"text-shadow": [{ "text-shadow": [
				"none",
				themeTextShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Text Shadow Color
			* @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
			*/
			"text-shadow-color": [{ "text-shadow": scaleColor() }],
			/**
			* Opacity
			* @see https://tailwindcss.com/docs/opacity
			*/
			opacity: [{ opacity: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Mix Blend Mode
			* @see https://tailwindcss.com/docs/mix-blend-mode
			*/
			"mix-blend": [{ "mix-blend": [
				...scaleBlendMode(),
				"plus-darker",
				"plus-lighter"
			] }],
			/**
			* Background Blend Mode
			* @see https://tailwindcss.com/docs/background-blend-mode
			*/
			"bg-blend": [{ "bg-blend": scaleBlendMode() }],
			/**
			* Mask Clip
			* @see https://tailwindcss.com/docs/mask-clip
			*/
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			/**
			* Mask Composite
			* @see https://tailwindcss.com/docs/mask-composite
			*/
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image-linear-pos": [{ "mask-linear": [isNumber] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": scaleMaskImagePosition() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": scaleMaskImagePosition() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": scaleColor() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": scaleColor() }],
			"mask-image-t-from-pos": [{ "mask-t-from": scaleMaskImagePosition() }],
			"mask-image-t-to-pos": [{ "mask-t-to": scaleMaskImagePosition() }],
			"mask-image-t-from-color": [{ "mask-t-from": scaleColor() }],
			"mask-image-t-to-color": [{ "mask-t-to": scaleColor() }],
			"mask-image-r-from-pos": [{ "mask-r-from": scaleMaskImagePosition() }],
			"mask-image-r-to-pos": [{ "mask-r-to": scaleMaskImagePosition() }],
			"mask-image-r-from-color": [{ "mask-r-from": scaleColor() }],
			"mask-image-r-to-color": [{ "mask-r-to": scaleColor() }],
			"mask-image-b-from-pos": [{ "mask-b-from": scaleMaskImagePosition() }],
			"mask-image-b-to-pos": [{ "mask-b-to": scaleMaskImagePosition() }],
			"mask-image-b-from-color": [{ "mask-b-from": scaleColor() }],
			"mask-image-b-to-color": [{ "mask-b-to": scaleColor() }],
			"mask-image-l-from-pos": [{ "mask-l-from": scaleMaskImagePosition() }],
			"mask-image-l-to-pos": [{ "mask-l-to": scaleMaskImagePosition() }],
			"mask-image-l-from-color": [{ "mask-l-from": scaleColor() }],
			"mask-image-l-to-color": [{ "mask-l-to": scaleColor() }],
			"mask-image-x-from-pos": [{ "mask-x-from": scaleMaskImagePosition() }],
			"mask-image-x-to-pos": [{ "mask-x-to": scaleMaskImagePosition() }],
			"mask-image-x-from-color": [{ "mask-x-from": scaleColor() }],
			"mask-image-x-to-color": [{ "mask-x-to": scaleColor() }],
			"mask-image-y-from-pos": [{ "mask-y-from": scaleMaskImagePosition() }],
			"mask-image-y-to-pos": [{ "mask-y-to": scaleMaskImagePosition() }],
			"mask-image-y-from-color": [{ "mask-y-from": scaleColor() }],
			"mask-image-y-to-color": [{ "mask-y-to": scaleColor() }],
			"mask-image-radial": [{ "mask-radial": [isArbitraryVariable, isArbitraryValue] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": scaleMaskImagePosition() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": scaleMaskImagePosition() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": scaleColor() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": scaleColor() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": scalePosition() }],
			"mask-image-conic-pos": [{ "mask-conic": [isNumber] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": scaleMaskImagePosition() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": scaleMaskImagePosition() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": scaleColor() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": scaleColor() }],
			/**
			* Mask Mode
			* @see https://tailwindcss.com/docs/mask-mode
			*/
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			/**
			* Mask Origin
			* @see https://tailwindcss.com/docs/mask-origin
			*/
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			/**
			* Mask Position
			* @see https://tailwindcss.com/docs/mask-position
			*/
			"mask-position": [{ mask: scaleBgPosition() }],
			/**
			* Mask Repeat
			* @see https://tailwindcss.com/docs/mask-repeat
			*/
			"mask-repeat": [{ mask: scaleBgRepeat() }],
			/**
			* Mask Size
			* @see https://tailwindcss.com/docs/mask-size
			*/
			"mask-size": [{ mask: scaleBgSize() }],
			/**
			* Mask Type
			* @see https://tailwindcss.com/docs/mask-type
			*/
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image": [{ mask: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Filter
			* @see https://tailwindcss.com/docs/filter
			*/
			filter: [{ filter: [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Blur
			* @see https://tailwindcss.com/docs/blur
			*/
			blur: [{ blur: scaleBlur() }],
			/**
			* Brightness
			* @see https://tailwindcss.com/docs/brightness
			*/
			brightness: [{ brightness: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Contrast
			* @see https://tailwindcss.com/docs/contrast
			*/
			contrast: [{ contrast: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Drop Shadow
			* @see https://tailwindcss.com/docs/drop-shadow
			*/
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				themeDropShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Drop Shadow Color
			* @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
			*/
			"drop-shadow-color": [{ "drop-shadow": scaleColor() }],
			/**
			* Grayscale
			* @see https://tailwindcss.com/docs/grayscale
			*/
			grayscale: [{ grayscale: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Hue Rotate
			* @see https://tailwindcss.com/docs/hue-rotate
			*/
			"hue-rotate": [{ "hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Invert
			* @see https://tailwindcss.com/docs/invert
			*/
			invert: [{ invert: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Saturate
			* @see https://tailwindcss.com/docs/saturate
			*/
			saturate: [{ saturate: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Sepia
			* @see https://tailwindcss.com/docs/sepia
			*/
			sepia: [{ sepia: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Filter
			* @see https://tailwindcss.com/docs/backdrop-filter
			*/
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Blur
			* @see https://tailwindcss.com/docs/backdrop-blur
			*/
			"backdrop-blur": [{ "backdrop-blur": scaleBlur() }],
			/**
			* Backdrop Brightness
			* @see https://tailwindcss.com/docs/backdrop-brightness
			*/
			"backdrop-brightness": [{ "backdrop-brightness": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Contrast
			* @see https://tailwindcss.com/docs/backdrop-contrast
			*/
			"backdrop-contrast": [{ "backdrop-contrast": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Grayscale
			* @see https://tailwindcss.com/docs/backdrop-grayscale
			*/
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Hue Rotate
			* @see https://tailwindcss.com/docs/backdrop-hue-rotate
			*/
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Invert
			* @see https://tailwindcss.com/docs/backdrop-invert
			*/
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Opacity
			* @see https://tailwindcss.com/docs/backdrop-opacity
			*/
			"backdrop-opacity": [{ "backdrop-opacity": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Saturate
			* @see https://tailwindcss.com/docs/backdrop-saturate
			*/
			"backdrop-saturate": [{ "backdrop-saturate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Sepia
			* @see https://tailwindcss.com/docs/backdrop-sepia
			*/
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Border Collapse
			* @see https://tailwindcss.com/docs/border-collapse
			*/
			"border-collapse": [{ border: ["collapse", "separate"] }],
			/**
			* Border Spacing
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing": [{ "border-spacing": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing X
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-x": [{ "border-spacing-x": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing Y
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-y": [{ "border-spacing-y": scaleUnambiguousSpacing() }],
			/**
			* Table Layout
			* @see https://tailwindcss.com/docs/table-layout
			*/
			"table-layout": [{ table: ["auto", "fixed"] }],
			/**
			* Caption Side
			* @see https://tailwindcss.com/docs/caption-side
			*/
			caption: [{ caption: ["top", "bottom"] }],
			/**
			* Transition Property
			* @see https://tailwindcss.com/docs/transition-property
			*/
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Behavior
			* @see https://tailwindcss.com/docs/transition-behavior
			*/
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			/**
			* Transition Duration
			* @see https://tailwindcss.com/docs/transition-duration
			*/
			duration: [{ duration: [
				isNumber,
				"initial",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Timing Function
			* @see https://tailwindcss.com/docs/transition-timing-function
			*/
			ease: [{ ease: [
				"linear",
				"initial",
				themeEase,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Delay
			* @see https://tailwindcss.com/docs/transition-delay
			*/
			delay: [{ delay: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Animation
			* @see https://tailwindcss.com/docs/animation
			*/
			animate: [{ animate: [
				"none",
				themeAnimate,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backface Visibility
			* @see https://tailwindcss.com/docs/backface-visibility
			*/
			backface: [{ backface: ["hidden", "visible"] }],
			/**
			* Perspective
			* @see https://tailwindcss.com/docs/perspective
			*/
			perspective: [{ perspective: [
				themePerspective,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Perspective Origin
			* @see https://tailwindcss.com/docs/perspective-origin
			*/
			"perspective-origin": [{ "perspective-origin": scalePositionWithArbitrary() }],
			/**
			* Rotate
			* @see https://tailwindcss.com/docs/rotate
			*/
			rotate: [{ rotate: scaleRotate() }],
			/**
			* Rotate X
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-x": [{ "rotate-x": scaleRotate() }],
			/**
			* Rotate Y
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-y": [{ "rotate-y": scaleRotate() }],
			/**
			* Rotate Z
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-z": [{ "rotate-z": scaleRotate() }],
			/**
			* Scale
			* @see https://tailwindcss.com/docs/scale
			*/
			scale: [{ scale: scaleScale() }],
			/**
			* Scale X
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-x": [{ "scale-x": scaleScale() }],
			/**
			* Scale Y
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-y": [{ "scale-y": scaleScale() }],
			/**
			* Scale Z
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-z": [{ "scale-z": scaleScale() }],
			/**
			* Scale 3D
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-3d": ["scale-3d"],
			/**
			* Skew
			* @see https://tailwindcss.com/docs/skew
			*/
			skew: [{ skew: scaleSkew() }],
			/**
			* Skew X
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-x": [{ "skew-x": scaleSkew() }],
			/**
			* Skew Y
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-y": [{ "skew-y": scaleSkew() }],
			/**
			* Transform
			* @see https://tailwindcss.com/docs/transform
			*/
			transform: [{ transform: [
				isArbitraryVariable,
				isArbitraryValue,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			/**
			* Transform Origin
			* @see https://tailwindcss.com/docs/transform-origin
			*/
			"transform-origin": [{ origin: scalePositionWithArbitrary() }],
			/**
			* Transform Style
			* @see https://tailwindcss.com/docs/transform-style
			*/
			"transform-style": [{ transform: ["3d", "flat"] }],
			/**
			* Translate
			* @see https://tailwindcss.com/docs/translate
			*/
			translate: [{ translate: scaleTranslate() }],
			/**
			* Translate X
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-x": [{ "translate-x": scaleTranslate() }],
			/**
			* Translate Y
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-y": [{ "translate-y": scaleTranslate() }],
			/**
			* Translate Z
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-z": [{ "translate-z": scaleTranslate() }],
			/**
			* Translate None
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-none": ["translate-none"],
			/**
			* Zoom
			* @see https://tailwindcss.com/docs/zoom
			*/
			zoom: [{ zoom: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Accent Color
			* @see https://tailwindcss.com/docs/accent-color
			*/
			accent: [{ accent: scaleColor() }],
			/**
			* Appearance
			* @see https://tailwindcss.com/docs/appearance
			*/
			appearance: [{ appearance: ["none", "auto"] }],
			/**
			* Caret Color
			* @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
			*/
			"caret-color": [{ caret: scaleColor() }],
			/**
			* Color Scheme
			* @see https://tailwindcss.com/docs/color-scheme
			*/
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			/**
			* Cursor
			* @see https://tailwindcss.com/docs/cursor
			*/
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Field Sizing
			* @see https://tailwindcss.com/docs/field-sizing
			*/
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			/**
			* Pointer Events
			* @see https://tailwindcss.com/docs/pointer-events
			*/
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			/**
			* Resize
			* @see https://tailwindcss.com/docs/resize
			*/
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			/**
			* Scroll Behavior
			* @see https://tailwindcss.com/docs/scroll-behavior
			*/
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			/**
			* Scrollbar Thumb Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-thumb-color": [{ "scrollbar-thumb": scaleColor() }],
			/**
			* Scrollbar Track Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-track-color": [{ "scrollbar-track": scaleColor() }],
			/**
			* Scrollbar Gutter
			* @see https://tailwindcss.com/docs/scrollbar-gutter
			*/
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			/**
			* Scrollbar Width
			* @see https://tailwindcss.com/docs/scrollbar-width
			*/
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			/**
			* Scroll Margin
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-m": [{ "scroll-m": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mx": [{ "scroll-mx": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-my": [{ "scroll-my": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ms": [{ "scroll-ms": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-me": [{ "scroll-me": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbs": [{ "scroll-mbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbe": [{ "scroll-mbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Top
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mt": [{ "scroll-mt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Right
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mr": [{ "scroll-mr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Bottom
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mb": [{ "scroll-mb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Left
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ml": [{ "scroll-ml": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-p": [{ "scroll-p": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-px": [{ "scroll-px": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-py": [{ "scroll-py": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-ps": [{ "scroll-ps": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pe": [{ "scroll-pe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbs": [{ "scroll-pbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbe": [{ "scroll-pbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Top
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pt": [{ "scroll-pt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Right
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pr": [{ "scroll-pr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Bottom
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pb": [{ "scroll-pb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Left
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pl": [{ "scroll-pl": scaleUnambiguousSpacing() }],
			/**
			* Scroll Snap Align
			* @see https://tailwindcss.com/docs/scroll-snap-align
			*/
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			/**
			* Scroll Snap Stop
			* @see https://tailwindcss.com/docs/scroll-snap-stop
			*/
			"snap-stop": [{ snap: ["normal", "always"] }],
			/**
			* Scroll Snap Type
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			/**
			* Scroll Snap Type Strictness
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			/**
			* Touch Action
			* @see https://tailwindcss.com/docs/touch-action
			*/
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			/**
			* Touch Action X
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			/**
			* Touch Action Y
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			/**
			* Touch Action Pinch Zoom
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-pz": ["touch-pinch-zoom"],
			/**
			* User Select
			* @see https://tailwindcss.com/docs/user-select
			*/
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			/**
			* Will Change
			* @see https://tailwindcss.com/docs/will-change
			*/
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Fill
			* @see https://tailwindcss.com/docs/fill
			*/
			fill: [{ fill: ["none", ...scaleColor()] }],
			/**
			* Stroke Width
			* @see https://tailwindcss.com/docs/stroke-width
			*/
			"stroke-w": [{ stroke: [
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength,
				isArbitraryNumber
			] }],
			/**
			* Stroke
			* @see https://tailwindcss.com/docs/stroke
			*/
			stroke: [{ stroke: ["none", ...scaleColor()] }],
			/**
			* Forced Color Adjust
			* @see https://tailwindcss.com/docs/forced-color-adjust
			*/
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
};
var twMerge = createTailwindMerge(getDefaultConfig);
/**
* Max distinct interpolation tuples remembered per call site. Real tagged-template sites cycle
* through a tiny set of dynamic values (a boolean toggling one class, a small variant union), so
* this stays small; the bound only guards a site that interpolates high-cardinality values (e.g. a
* live color) from growing its per-site list without limit.
*/
var TEMPLATE_SITE_CACHE = 8;
var templateCache = /* @__PURE__ */ new WeakMap();
var mergeTemplate = (strings, values) => {
	const valueCount = values.length;
	let isCacheable = true;
	for (let index = 0; index < valueCount; index++) {
		const value = values[index];
		if (value && typeof value !== "string") {
			isCacheable = false;
			break;
		}
	}
	if (isCacheable) {
		const entries = templateCache.get(strings);
		if (entries !== void 0) for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
			const entry = entries[entryIndex];
			const entryValues = entry.values;
			let isMatch = true;
			for (let index = 0; index < valueCount; index++) if (entryValues[index] !== values[index]) {
				isMatch = false;
				break;
			}
			if (isMatch) return entry.result;
		}
	}
	let joined = strings[0];
	for (let index = 0; index < valueCount; index++) {
		const value = values[index];
		if (value) joined += typeof value === "string" ? value : resolveClassValue(value);
		joined += strings[index + 1];
	}
	const result = twMerge.mergeString(joined);
	if (isCacheable) {
		let entries = templateCache.get(strings);
		if (entries === void 0) {
			entries = [];
			templateCache.set(strings, entries);
		}
		if (entries.length >= TEMPLATE_SITE_CACHE) entries.shift();
		entries.push({
			values,
			result
		});
	}
	return result;
};
var IS_V8 = (() => {
	const error = /* @__PURE__ */ new Error();
	return !("line" in error) && !("lineNumber" in error);
})();
var ARG_CACHE_BUCKET_SIZE = 64;
/** First-arg buckets kept before a generation rotates into `previousArgCache`. */
var ARG_CACHE_SIZE = 500;
var argCache = /* @__PURE__ */ new Map();
var previousArgCache = /* @__PURE__ */ new Map();
var argCacheCount = 0;
var mergeVariadicCached = (inputs) => {
	const length = inputs.length;
	let firstKey = "";
	let firstKeyIndex = -1;
	let truthyStringCount = 0;
	let everyTruthyIsString = true;
	for (let index = 0; index < length; index++) {
		const item = inputs[index];
		if (!item) continue;
		if (typeof item !== "string") {
			everyTruthyIsString = false;
			break;
		}
		if (firstKeyIndex === -1) {
			firstKey = item;
			firstKeyIndex = index;
		}
		truthyStringCount++;
	}
	if (everyTruthyIsString) {
		if (truthyStringCount === 0) return "";
		if (truthyStringCount === 1) return twMerge.mergeString(firstKey);
		let bucket = argCache.get(firstKey);
		if (bucket === void 0) bucket = previousArgCache.get(firstKey);
		if (bucket !== void 0) for (let entryIndex = 0; entryIndex < bucket.length; entryIndex++) {
			const entry = bucket[entryIndex];
			const rest = entry.rest;
			if (rest.length !== truthyStringCount - 1) continue;
			let restIndex = 0;
			let isMatch = true;
			for (let index = firstKeyIndex + 1; index < length; index++) {
				const item = inputs[index];
				if (!item) continue;
				if (item !== rest[restIndex++]) {
					isMatch = false;
					break;
				}
			}
			if (isMatch) return entry.result;
		}
		let joined = firstKey;
		const rest = [];
		for (let index = firstKeyIndex + 1; index < length; index++) {
			const item = inputs[index];
			if (!item) continue;
			joined += " " + item;
			rest.push(item);
		}
		const result = twMerge.mergeString(joined);
		let target = argCache.get(firstKey);
		if (target === void 0) {
			target = [];
			argCache.set(firstKey, target);
		}
		if (target.length >= ARG_CACHE_BUCKET_SIZE) target.shift();
		target.push({
			rest,
			result
		});
		if (++argCacheCount > ARG_CACHE_SIZE) {
			argCacheCount = 0;
			previousArgCache = argCache;
			argCache = /* @__PURE__ */ new Map();
		}
		return result;
	}
	let result = "";
	for (let index = 0; index < length; index++) {
		const item = inputs[index];
		if (!item) continue;
		const resolved = typeof item === "string" ? item : resolveClassValue(item);
		if (resolved) {
			if (result) result += " ";
			result += resolved;
		}
	}
	return twMerge.mergeString(result);
};
var cn = function() {
	const first = arguments[0];
	if (Array.isArray(first) && "raw" in first) {
		const strings = first;
		const length = arguments.length;
		const values = [];
		for (let index = 1; index < length; index++) values.push(arguments[index]);
		return mergeTemplate(strings, values);
	}
	const length = arguments.length;
	if (length === 1) return typeof first === "string" ? twMerge.mergeString(first) : twMerge.mergeString(resolveClassValue(first));
	if (IS_V8) {
		const inputs = [];
		for (let index = 0; index < length; index++) inputs.push(arguments[index]);
		return mergeVariadicCached(inputs);
	}
	let result = "";
	for (let index = 0; index < length; index++) {
		const item = arguments[index];
		if (!item) continue;
		const resolved = typeof item === "string" ? item : resolveClassValue(item);
		if (resolved) {
			if (result) result += " ";
			result += resolved;
		}
	}
	return twMerge.mergeString(result);
};
//#endregion
//#region node_modules/fumadocs-core/dist/link.js
var link_default = /* #__PURE__ */ registerClientReference(() => {
	throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "0817f5b3b49f", "default");
//#endregion
//#region node_modules/fumadocs-ui/dist/components/card.js
function Cards(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("div", {
		...props,
		className: cn("grid grid-cols-2 gap-3 @container", props.className),
		children: props.children
	});
}
function Card({ icon, title, description, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(props.href ? link_default : "div", {
		...props,
		"data-card": true,
		className: cn("block rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors @max-lg:col-span-full", props.href && "hover:bg-fd-accent/80", props.className),
		children: [
			icon ? /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("div", {
				className: "not-prose mb-2 w-fit shadow-md rounded-lg border bg-fd-muted p-1.5 text-fd-muted-foreground [&_svg]:size-4",
				children: icon
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("h3", {
				className: "not-prose mb-1 text-sm font-medium",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("p", {
				className: "my-0! text-sm text-fd-muted-foreground",
				children: description
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("div", {
				className: "text-sm text-fd-muted-foreground prose-no-margin empty:hidden",
				children: props.children
			})
		]
	});
}
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toPascalCase = (string) => {
	const camelCase = toCamelCase(string);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
//#endregion
//#region node_modules/lucide-react/dist/esm/Icon.mjs
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Icon_default = /* #__PURE__ */ registerClientReference(() => {
	throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "339f946bc456", "default");
//#endregion
//#region node_modules/lucide-react/dist/esm/createLucideIcon.mjs
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createLucideIcon = (iconName, iconNode) => {
	const Component = (0, import_react_react_server.forwardRef)(({ className, ...props }, ref) => (0, import_react_react_server.createElement)(Icon_default, {
		ref,
		iconNode,
		className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
		...props
	}));
	Component.displayName = toPascalCase(iconName);
	return Component;
};
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleCheck = createLucideIcon("circle-check", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleX = createLucideIcon("circle-x", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "m15 9-6 6",
		key: "1uzhvr"
	}],
	["path", {
		d: "m9 9 6 6",
		key: "z0biqf"
	}]
]);
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Info = createLucideIcon("info", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 16v-4",
		key: "1dtifu"
	}],
	["path", {
		d: "M12 8h.01",
		key: "e9boi3"
	}]
]);
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Lightbulb = createLucideIcon("lightbulb", [
	["path", {
		d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
		key: "1gvzjb"
	}],
	["path", {
		d: "M9 18h6",
		key: "x1upvd"
	}],
	["path", {
		d: "M10 22h4",
		key: "ceow96"
	}]
]);
/**
* @license lucide-react v1.24.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TriangleAlert = createLucideIcon("triangle-alert", [
	["path", {
		d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
		key: "wmoenq"
	}],
	["path", {
		d: "M12 9v4",
		key: "juzpu7"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]);
//#endregion
//#region node_modules/fumadocs-ui/dist/components/callout.js
var iconClass = "size-5 -me-0.5 fill-(--callout-color) text-fd-card";
function Callout({ children, title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(CalloutContainer, {
		...props,
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(CalloutTitle, { children: title }), /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(CalloutDescription, { children })]
	});
}
function resolveAlias(type) {
	if (type === "warn") return "warning";
	if (type === "tip") return "info";
	return type;
}
function CalloutContainer({ type: inputType = "info", icon, children, className, style, ...props }) {
	const type = resolveAlias(inputType);
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)("div", {
		className: cn("flex gap-2 my-4 rounded-xl border bg-fd-card p-3 ps-1 text-sm text-fd-card-foreground shadow-md", className),
		style: {
			"--callout-color": `var(--color-fd-${type}, var(--color-fd-muted))`,
			...style
		},
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("div", {
				role: "none",
				className: "w-0.5 bg-(--callout-color)/50 rounded-sm"
			}),
			icon ?? {
				info: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Info, { className: iconClass }),
				warning: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(TriangleAlert, { className: iconClass }),
				error: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(CircleX, { className: iconClass }),
				success: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(CircleCheck, { className: iconClass }),
				idea: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Lightbulb, { className: "size-5 -me-0.5 fill-(--callout-color) text-(--callout-color)" })
			}[type],
			/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("div", {
				className: "flex flex-col gap-2 min-w-0 flex-1",
				children
			})
		]
	});
}
function CalloutTitle({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("p", {
		className: cn("font-medium my-0!", className),
		...props,
		children
	});
}
function CalloutDescription({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("div", {
		className: cn("text-fd-muted-foreground prose-no-margin empty:hidden", className),
		...props,
		children
	});
}
//#endregion
//#region node_modules/fumadocs-ui/dist/components/heading.js
var Heading = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"Heading\"");
}), "e70dc53bce46", "Heading");
//#endregion
//#region node_modules/fumadocs-ui/dist/components/codeblock.js
var CodeBlock = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"CodeBlock\"");
}), "327bb606fa81", "CodeBlock");
var CodeBlockTab = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"CodeBlockTab\"");
}), "327bb606fa81", "CodeBlockTab");
var CodeBlockTabs = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"CodeBlockTabs\"");
}), "327bb606fa81", "CodeBlockTabs");
var CodeBlockTabsList = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"CodeBlockTabsList\"");
}), "327bb606fa81", "CodeBlockTabsList");
var CodeBlockTabsTrigger = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"CodeBlockTabsTrigger\"");
}), "327bb606fa81", "CodeBlockTabsTrigger");
var Pre = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"Pre\"");
}), "327bb606fa81", "Pre");
//#endregion
//#region node_modules/fumadocs-core/dist/framework/index.js
var Image = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"Image\"");
}), "becc1a081aff", "Image");
//#endregion
//#region node_modules/fumadocs-ui/dist/mdx.js
function Image$1(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Image, {
		sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px",
		...props,
		className: cn("rounded-lg", props.className)
	});
}
function Table(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("div", {
		className: "relative overflow-auto prose-no-margin my-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("table", { ...props })
	});
}
var defaultMdxComponents = {
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
	pre: (props) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(CodeBlock, {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Pre, { children: props.children })
	}),
	Card,
	Cards,
	a: link_default,
	img: Image$1,
	h1: (props) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Heading, {
		as: "h1",
		...props
	}),
	h2: (props) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Heading, {
		as: "h2",
		...props
	}),
	h3: (props) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Heading, {
		as: "h3",
		...props
	}),
	h4: (props) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Heading, {
		as: "h4",
		...props
	}),
	h5: (props) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Heading, {
		as: "h5",
		...props
	}),
	h6: (props) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(Heading, {
		as: "h6",
		...props
	}),
	table: Table,
	Callout,
	CalloutContainer,
	CalloutTitle,
	CalloutDescription
};
//#endregion
//#region node_modules/fumadocs-ui/dist/mdx.server.js
/**
* Extend the default Link component to resolve relative file paths in `href`.
*
* @param page the current page
* @param source the source object
* @param OverrideLink The component to override from
*/
function createRelativeLink(source, page, OverrideLink = defaultMdxComponents.a) {
	return async function RelativeLink({ href, ...props }) {
		return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(OverrideLink, {
			href: href ? source.resolveHref(href, page) : href,
			...props
		});
	};
}
//#endregion
//#region node_modules/zod/v4/core/core.js
var _a;
function $constructor(name, initializer, params) {
	function init(inst, def) {
		if (!inst._zod) Object.defineProperty(inst, "_zod", {
			value: {
				def,
				constr: _,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: false
		});
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		const proto = _.prototype;
		const keys = Object.keys(proto);
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		var _a;
		const inst = params?.Parent ? new Definition() : this;
		init(inst, def);
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		for (const fn of inst._zod.deferred) fn();
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
//#endregion
//#region node_modules/zod/v4/core/util.js
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	return { get value() {
		{
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
		throw new Error("cached value already set");
	} };
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
var EVALUATING = /* @__PURE__*/ Symbol("evaluating");
function defineLazy(object, key, getter) {
	let value = void 0;
	Object.defineProperty(object, key, {
		get() {
			if (value === EVALUATING) return;
			if (value === void 0) {
				value = EVALUATING;
				value = getter();
			}
			return value;
		},
		set(v) {
			Object.defineProperty(object, key, { value: v });
		},
		configurable: true
	});
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	});
}
Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, -Number.MAX_VALUE, Number.MAX_VALUE;
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
	rest.path ?? (rest.path = []);
	rest.message = message;
	if (ctx?.reportInput) rest.input = _input;
	return rest;
}
//#endregion
//#region node_modules/zod/v4/core/errors.js
var initializer = (inst, def) => {
	inst.name = "$ZodError";
	Object.defineProperty(inst, "_zod", {
		value: inst._zod,
		enumerable: false
	});
	Object.defineProperty(inst, "issues", {
		value: def,
		enumerable: false
	});
	inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
	Object.defineProperty(inst, "toString", {
		value: () => inst.message,
		enumerable: false
	});
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
//#endregion
//#region node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	if (result.issues.length) {
		const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, _params?.callee);
		throw e;
	}
	return result.value;
};
var parse = /* @__PURE__*/ _parse($ZodRealError);
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	if (result.issues.length) {
		const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, params?.callee);
		throw e;
	}
	return result.value;
};
var parseAsync = /* @__PURE__*/ _parseAsync($ZodRealError);
var _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
var safeParse = /* @__PURE__*/ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
var safeParseAsync = /* @__PURE__*/ _safeParseAsync($ZodRealError);
var string$1 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
//#endregion
//#region node_modules/zod/v4/core/versions.js
var version = {
	major: 4,
	minor: 4,
	patch: 3
};
//#endregion
//#region node_modules/zod/v4/core/schemas.js
var $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const checks = [...inst._zod.def.checks ?? []];
	if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
	defineLazy(inst, "~standard", () => ({
		validate: (value) => {
			try {
				const r = safeParse(inst, value);
				return r.success ? { value: r.data } : { issues: r.error?.issues };
			} catch (_) {
				return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
});
var $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
var $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
var $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
	const isPresent = key in input;
	if (result.issues.length) {
		if (isOptionalIn && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && !isOptionalIn) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		keys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const isOptionalIn = _catchall.optin === "optional";
	const isOptionalOut = _catchall.optout === "optional";
	for (const key in input) {
		if (key === "__proto__") continue;
		if (keySet.has(key)) continue;
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
		else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
var $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
		const sh = def.shape;
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			return newSh;
		} });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazy(inst._zod, "propValues", () => {
		const shape = def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
			}
		}
		return propValues;
	});
	const isObject$2 = isObject;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$2(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.keys) {
			const el = shape[key];
			const isOptionalIn = el._zod.optin === "optional";
			const isOptionalOut = el._zod.optout === "optional";
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
			else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	};
});
function handleOptionalResult(result, input) {
	if (input === void 0 && (result.issues.length || result.fallback)) return {
		issues: [],
		value: void 0
	};
	return result;
}
var $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.optout = "optional";
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (def.innerType._zod.optin === "optional") {
			const input = payload.value;
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
			return handleOptionalResult(result, input);
		}
		if (payload.value === void 0) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
//#endregion
//#region node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
//#endregion
//#region node_modules/zod/v4/mini/schemas.js
var ZodMiniType = /*@__PURE__*/ $constructor("ZodMiniType", (inst, def) => {
	if (!inst._zod) throw new Error("Uninitialized schema in ZodMiniType.");
	$ZodType.init(inst, def);
	inst.def = def;
	inst.type = def.type;
	inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	inst.safeParse = (data, params) => safeParse(inst, data, params);
	inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
	inst.check = (...checks) => {
		return inst.clone({
			...def,
			checks: [...def.checks ?? [], ...checks.map((ch) => typeof ch === "function" ? { _zod: {
				check: ch,
				def: { check: "custom" },
				onattach: []
			} } : ch)]
		}, { parent: true });
	};
	inst.with = inst.check;
	inst.clone = (_def, params) => clone(inst, _def, params);
	inst.brand = () => inst;
	inst.register = ((reg, meta) => {
		reg.add(inst, meta);
		return inst;
	});
	inst.apply = (fn) => fn(inst);
});
var ZodMiniString = /*@__PURE__*/ $constructor("ZodMiniString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodMiniType.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function string(params) {
	return /* @__PURE__ */ _string(ZodMiniString, params);
}
var ZodMiniUnknown = /*@__PURE__*/ $constructor("ZodMiniUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodMiniType.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function unknown() {
	return /* @__PURE__ */ _unknown(ZodMiniUnknown);
}
var ZodMiniArray = /*@__PURE__*/ $constructor("ZodMiniArray", (inst, def) => {
	$ZodArray.init(inst, def);
	ZodMiniType.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function array(element, params) {
	return new ZodMiniArray({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
var ZodMiniObject = /*@__PURE__*/ $constructor("ZodMiniObject", (inst, def) => {
	$ZodObject.init(inst, def);
	ZodMiniType.init(inst, def);
	defineLazy(inst, "shape", () => def.shape);
});
// @__NO_SIDE_EFFECTS__
function looseObject(shape, params) {
	return new ZodMiniObject({
		type: "object",
		shape,
		catchall: /* @__PURE__ */ unknown(),
		...normalizeParams(params)
	});
}
var ZodMiniOptional = /*@__PURE__*/ $constructor("ZodMiniOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodMiniType.init(inst, def);
});
// @__NO_SIDE_EFFECTS__
function optional(innerType) {
	return new ZodMiniOptional({
		type: "optional",
		innerType
	});
}
//#endregion
//#region node_modules/fumapress/dist/adapters/mdx.js
function fumadocsMdx(options) {
	const getMdxComponents = options?.getMdxComponents ?? async function(page) {
		return {
			...defaultMdxComponents,
			a: createRelativeLink(await this.getLoader(), page)
		};
	};
	return {
		async "core:get-text"(page) {
			if (isAsyncEntry(page.data) || isSyncEntry(page.data)) return page.data.getText("processed");
		},
		async "core:get-structured-data"(page) {
			if (isSyncEntry(page.data)) return page.data.structuredData;
			if (isAsyncEntry(page.data)) return (await page.data.load()).structuredData;
		},
		async "core:render-body"(page) {
			let body;
			if (isSyncEntry(page.data)) body = page.data.body;
			else if (isAsyncEntry(page.data)) body = (await page.data.load()).body;
			else return;
			return (0, import_react_react_server.createElement)(body, { components: await getMdxComponents.call(this, page) });
		},
		async "core:render-toc"(page) {
			if (isSyncEntry(page.data)) return page.data.toc;
			if (isAsyncEntry(page.data)) return (await page.data.load()).toc;
		},
		"core:get-creation-date"(page) {
			if (isSyncEntry(page.data) || isAsyncEntry(page.data)) return "date" in page.data && page.data.date instanceof Date ? page.data.date : void 0;
		},
		async "core:get-modified-date"(page) {
			let data;
			if (isSyncEntry(page.data)) data = page.data;
			else if (isAsyncEntry(page.data)) data = await page.data.load();
			else return;
			return "lastModified" in data && data.lastModified instanceof Date ? data.lastModified : void 0;
		},
		"blog:get-tags"(page) {
			if (isSyncEntry(page.data) || isAsyncEntry(page.data)) {
				const parsed = tagsSchema.safeParse(page.data);
				return parsed.success ? parsed.data.tags : void 0;
			}
		},
		"tegami:get-date"(page) {
			if ((isSyncEntry(page.data) || isAsyncEntry(page.data)) && "date" in page.data) {
				if (page.data.date instanceof Date) return page.data.date;
				if (typeof page.data.date === "string") return new Date(page.data.date);
			}
		}
	};
}
var tagsSchema = /* @__PURE__ */ looseObject({ tags: /* @__PURE__ */ optional(/* @__PURE__ */ array(/* @__PURE__ */ string())) });
function isSyncEntry(v) {
	return "info" in v && typeof v.info === "object" && "_exports" in v && typeof v._exports === "object";
}
function isAsyncEntry(v) {
	return "info" in v && typeof v.info === "object" && "load" in v && typeof v.load === "function";
}
//#endregion
//#region node_modules/fumapress/dist/plugins/flexsearch.js
function flexsearchPlugin({ buildIndex = async function buildIndexDefault(page) {
	for (const adapter of this.adapters) {
		const structuredData = await adapter["core:get-structured-data"]?.call(this, page);
		if (structuredData !== void 0) return {
			id: page.url,
			title: page.data.title ?? page.path,
			description: page.data.description,
			url: page.url,
			structuredData
		};
	}
	throw new Error("[Fumapress] Please specify the `buildIndex` option to flexsearchPlugin()");
} } = {}) {
	return {
		name: "core:flexsearch",
		init() {
			(this.data["core:provider"] ??= []).push(async (props) => {
				props.search ??= { enabled: true };
				if (this.mode === "static") props.search.SearchDialog ??= (await import("./flexsearch-static-C8iKmxFt.js")).default;
				return props;
			});
		},
		async createPages({ createApiIsomorphic }) {
			const { flexsearchFromSource } = await import("./flexsearch-C2Ev-xTJ.js");
			const render = this.mode === "default" ? "dynamic" : this.mode;
			const server = flexsearchFromSource(this.getLoader, { buildIndex: buildIndex.bind(this) });
			createApiIsomorphic({
				render,
				path: "/api/search",
				handler: render === "static" ? server.staticGET : server.GET
			});
		}
	};
}
//#endregion
//#region node_modules/fumapress/dist/lib/pathname.js
/** Join multiple (full) pathnames */
function joinPathname(...paths) {
	const segs = [];
	for (let p of paths) {
		if (p.startsWith("/")) p = p.slice(1);
		if (p.endsWith("/")) p = p.slice(0, -1);
		if (p.length > 0) segs.push(p);
	}
	return "/" + segs.join("/");
}
//#endregion
//#region node_modules/waku/dist/lib/utils/task-runner.js
var createTaskRunner = (limit) => {
	let running = 0;
	const waiting = [];
	const scheduleTask = async (task) => {
		while (running >= limit) await new Promise((resolve) => waiting.push(resolve));
		running++;
		try {
			await task();
		} finally {
			running--;
			waiting.shift()?.();
		}
	};
	const tasks = [];
	const runTask = (task) => {
		tasks.push(scheduleTask(task));
	};
	const waitForTasks = async () => {
		await Promise.all(tasks);
	};
	return {
		runTask,
		waitForTasks
	};
};
//#endregion
//#region node_modules/waku/dist/minimal/server.js
function unstable_defineHandlers(handlers) {
	return handlers;
}
//#endregion
//#region \0react-server-dom-webpack/client.edge
function createFromReadableStream(stream) {
	return createFromReadableStream$1(stream);
}
//#endregion
//#region \0react-server-dom-webpack/server.edge
function renderToReadableStream(model, _webpackMap, options) {
	return renderToReadableStream$2(model, options);
}
//#endregion
//#region node_modules/waku/dist/server.js
async function serializeRsc(element) {
	return streamToBytes(renderToReadableStream(element, {}));
}
async function deserializeRsc(bytes) {
	return createFromReadableStream(bytesToStream(bytes));
}
//#endregion
//#region node_modules/waku/dist/router/client.js
var ErrorBoundary = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"ErrorBoundary\"");
}), "6d786e16fc6b", "ErrorBoundary");
var INTERNAL_ServerRouter = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"INTERNAL_ServerRouter\"");
}), "6d786e16fc6b", "INTERNAL_ServerRouter");
//#endregion
//#region node_modules/waku/dist/lib/utils/create-pages.js
/** Remove (group)s from path. Like /(group)/foo => /foo */ var getGrouplessPath = (path) => {
	if (path.includes("(")) {
		const withoutGroups = path.split("/").filter((part) => !part.startsWith("("));
		path = withoutGroups.length > 1 ? withoutGroups.join("/") : "/";
	}
	return path;
};
//#endregion
//#region node_modules/waku/dist/router/isomorphic-utils/build-route-href.js
/**
* Build an href string from a route path, params, search, and hash.
*
* Route groups in the path are removed, path params are URL-encoded, and the
* result is validated against the route matcher; building a pathname that the
* path would not match (e.g. an empty array for a prefixed catch-all) throws.
*/ var buildRouteHref = (target, resolveCodec) => {
	const { to, search, hash, params } = target;
	const pathSpec = parsePathWithSlug(getGrouplessPath(to));
	const segments = [];
	for (const item of pathSpec) if (item.type === "literal") segments.push(item.name);
	else if (item.type === "wildcard") {
		const value = item.name ? params?.[item.name] : void 0;
		if (!Array.isArray(value)) throw new Error(`Missing catch-all param "${item.name}" for "${to}"`);
		for (const part of value) segments.push(encodeURIComponent(part));
	} else {
		const value = item.name ? params?.[item.name] : void 0;
		if (typeof value !== "string") throw new Error(`Missing param "${item.name}" for "${to}"`);
		const prefix = item.prefix ?? "";
		const suffix = item.suffix ?? "";
		segments.push(prefix + encodeURIComponent(value) + suffix);
	}
	const pathname = "/" + segments.join("/");
	if (!getPathMapping(pathSpec, pathname)) throw new Error(`Cannot build "${to}" with the given params`);
	let query = "";
	if (search !== void 0) {
		const codec = resolveCodec?.(to);
		if (!codec) throw new Error(`Cannot serialize "search" for "${to}": no search codec resolved. Provide it via <Unstable_SearchCodecsProvider> in a module rendered on every page (e.g. your root layout) so navigation can serialize it.`);
		query = codec.serialize(search);
	}
	return pathname + (query ? "?" + query : "") + (hash ? "#" + (hash.startsWith("#") ? hash.slice(1) : hash) : "");
};
//#endregion
//#region node_modules/waku/dist/router/isomorphic-utils/route-path.js
function pathnameToRoutePath(pathname) {
	if (!pathname.startsWith("/")) throw new Error("Pathname must start with `/`: " + pathname);
	if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
	if (pathname.endsWith("/index.html")) pathname = pathname.slice(0, -11) || "/";
	if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
	return pathname || "/";
}
var ROUTE_PREFIX = "R";
var SLICE_PREFIX = "S/";
function encodeRoutePath(routePath) {
	if (!routePath.startsWith("/")) throw new Error("Route path must start with `/`: " + routePath);
	if (routePath.length > 1 && routePath.endsWith("/")) throw new Error("Route path must not end with `/`: " + routePath);
	if (routePath.endsWith("/index.html")) throw new Error("Route path must not end with `/index.html`: " + routePath);
	if (routePath === "/") return "R/_root";
	if (routePath.startsWith("/_")) return "R/__" + routePath.slice(2);
	return ROUTE_PREFIX + routePath;
}
function decodeRoutePath(rscPath) {
	if (!rscPath.startsWith(ROUTE_PREFIX)) throw new Error("rscPath should start with: R");
	if (rscPath === "R/_root") return "/";
	if (rscPath.startsWith("R/__")) return "/_" + rscPath.slice(4);
	return rscPath.slice(1);
}
function encodeSliceId(sliceId) {
	if (sliceId.startsWith("/")) throw new Error("Slice id must not start with `/`: " + sliceId);
	return SLICE_PREFIX + sliceId;
}
function decodeSliceId(rscPath) {
	if (!rscPath.startsWith(SLICE_PREFIX)) return null;
	return rscPath.slice(2);
}
var ROUTE_ID = "ROUTE";
var IS_STATIC_ID = "IS_STATIC";
var HAS404_ID = "HAS404";
var ETAG_ID_PREFIX = "ETAG:";
//#endregion
//#region node_modules/waku/dist/router/define-router.js
var isEtagRecord = (x) => typeof x === "object" && x !== null && !Array.isArray(x) && Object.values(x).every((v) => typeof v === "string" || v === 1);
var safeJsonParse = (text) => {
	try {
		return JSON.parse(text);
	} catch {
		return;
	}
};
var parseRscParams = (rscParams) => {
	if (rscParams instanceof URLSearchParams) return { query: rscParams.get("query") || "" };
	if (typeof rscParams?.query === "string") return { query: rscParams.query };
	return { query: "" };
};
var routerStorage = new AsyncLocalStorage();
var setRscPath = (rscPath) => {
	const store = routerStorage.getStore();
	if (store) store.rscPath = rscPath;
};
var setRscParams = (rscParams) => {
	const store = routerStorage.getStore();
	if (store) store.rscParams = rscParams;
};
var setRerender = (rerender) => {
	const store = routerStorage.getStore();
	if (store) store.rerender = rerender;
};
var getNonce = () => routerStorage.getStore()?.nonce;
var is404 = (pathSpec) => pathSpec.length === 1 && pathSpec[0].type === "literal" && pathSpec[0].name === "404";
var pathSpecToRoutePath = (pathSpec) => {
	if (pathSpec.some(({ type }) => type !== "literal")) return;
	return "/" + pathSpec.map(({ name }) => name).join("/");
};
var routePathToHtmlFilePath = (routePath) => routePath === "/404" ? "404.html" : routePath + "/index.html";
function unstable_notFound() {
	throw createCustomError("Not Found", { status: 404 });
}
/**
* Redirect within the current application. Accepts the same target as
* `router.push` / `router.replace`: a typed route href or a structured
* `{ to, params, search, hash }`. The resolved location must start with a
* single `/`.
*/ function unstable_redirect(to, status = 307) {
	const location = typeof to === "string" ? to : buildRouteHref(to, routerStorage.getStore()?.resolveSearchCodec);
	if (!location.startsWith("/") || location.startsWith("//")) throw new Error(`Invalid redirect location: ${JSON.stringify(location)}`);
	for (let i = 0; i < location.length; ++i) {
		const charCode = location.charCodeAt(i);
		if (charCode < 32 || charCode === 127 || charCode === 92) throw new Error(`Invalid redirect location: ${JSON.stringify(location)}`);
	}
	throw createCustomError("Redirect", {
		status,
		location
	});
}
var ROOT_SLOT_ID = "root";
var ROUTE_SLOT_ID_PREFIX = "route:";
var SLICE_SLOT_ID_PREFIX = "slice:";
var createElementCache = (onSerialize) => {
	const cache = /* @__PURE__ */ new Map();
	return {
		preload: (cacheId, bytes) => {
			cache.set(cacheId, Promise.resolve(bytes));
		},
		get: (cacheId) => {
			const cachedBytes = cache.get(cacheId);
			if (!cachedBytes) return;
			return cachedBytes.then((bytes) => deserializeRsc(bytes));
		},
		set: (cacheId, element) => {
			if (cache.has(cacheId)) return;
			const bytesPromise = serializeRsc(element);
			cache.set(cacheId, bytesPromise);
			if (onSerialize) return bytesPromise.then((bytes) => {
				onSerialize(cacheId, bytesToBase64(bytes));
			});
		}
	};
};
var getSlotCacheId = (slotId) => `slot/${slotId}`;
var getPathSpecCacheId = (pathSpec) => `pathSpec/${pathSpecKey(pathSpec)}`;
var assertNonReservedSlotId = (slotId) => {
	if (slotId === ROOT_SLOT_ID || slotId.startsWith(ROUTE_SLOT_ID_PREFIX) || slotId.startsWith(SLICE_SLOT_ID_PREFIX) || /^[A-Z]/.test(slotId)) throw new Error("Element ID cannot be \"root\", \"route:*\", \"slice:*\", or start with a capital letter");
};
var toSerializable = (c) => {
	if (c.type === "route") {
		const { rootElement, routeElement, elements, searchCodec: _searchCodec, ...rest } = c;
		const { renderer: _rootRenderer, getEtagFromOption: _rootGetEtag, ...rootElementRest } = rootElement;
		const { renderer: _routeRenderer, getEtagFromOption: _routeGetEtag, ...routeElementRest } = routeElement;
		return {
			...rest,
			rootElement: rootElementRest,
			routeElement: routeElementRest,
			elements: Object.fromEntries(Object.entries(elements).map(([id, { renderer: _r, getEtagFromOption: _g, ...elRest }]) => [id, elRest]))
		};
	}
	if (c.type === "api") {
		const { handler: _handler, ...rest } = c;
		return rest;
	}
	const { renderer: _r, getEtagFromParams: _g, ...rest } = c;
	return rest;
};
var pathSpecKey = (p) => JSON.stringify(p);
var noRuntimeFn = (what) => {
	throw new Error(`defineRouter: no runtime function found for ${what}; rebuild required`);
};
var mergeWithRuntimeConfigs = (serializableConfigs, runtimeConfigs) => {
	const runtimeRouteByPath = /* @__PURE__ */ new Map();
	const runtimeApiByPath = /* @__PURE__ */ new Map();
	const runtimeSliceById = /* @__PURE__ */ new Map();
	for (const c of runtimeConfigs) if (c.type === "route") runtimeRouteByPath.set(pathSpecKey(c.path), c);
	else if (c.type === "api") runtimeApiByPath.set(pathSpecKey(c.path), c);
	else runtimeSliceById.set(c.id, c);
	const sharedRootRenderer = runtimeConfigs.find((c) => c.type === "route")?.rootElement.renderer;
	const sharedElementRenderers = /* @__PURE__ */ new Map();
	for (const c of runtimeConfigs) {
		if (c.type !== "route") continue;
		for (const [id, el] of Object.entries(c.elements)) if (!sharedElementRenderers.has(id)) sharedElementRenderers.set(id, el.renderer);
	}
	return serializableConfigs.map((c) => {
		if (c.type === "route") {
			const runtimeItem = runtimeRouteByPath.get(pathSpecKey(c.path));
			const label = `route ${pathSpecAsString(c.path)}`;
			const elements = {};
			for (const [id, val] of Object.entries(c.elements)) {
				const elementSpec = runtimeItem?.elements[id];
				elements[id] = {
					isStatic: val.isStatic,
					renderer: elementSpec?.renderer ?? sharedElementRenderers.get(id) ?? (() => noRuntimeFn(`element "${id}" of ${label}`)),
					...elementSpec?.getEtagFromOption ? { getEtagFromOption: elementSpec.getEtagFromOption } : {},
					...val.sourceFile ? { sourceFile: val.sourceFile } : {}
				};
			}
			return {
				type: "route",
				path: c.path,
				isStatic: c.isStatic,
				...c.pathPattern !== void 0 ? { pathPattern: c.pathPattern } : {},
				rootElement: {
					isStatic: c.rootElement.isStatic,
					renderer: runtimeItem?.rootElement.renderer ?? sharedRootRenderer ?? (() => noRuntimeFn(`rootElement of ${label}`)),
					...runtimeItem?.rootElement.getEtagFromOption ? { getEtagFromOption: runtimeItem.rootElement.getEtagFromOption } : {},
					...c.rootElement.sourceFile ? { sourceFile: c.rootElement.sourceFile } : {}
				},
				routeElement: {
					isStatic: c.routeElement.isStatic,
					renderer: runtimeItem?.routeElement.renderer ?? (() => noRuntimeFn(`routeElement of ${label}`)),
					...runtimeItem?.routeElement.getEtagFromOption ? { getEtagFromOption: runtimeItem.routeElement.getEtagFromOption } : {}
				},
				elements,
				...c.noSsr !== void 0 ? { noSsr: c.noSsr } : {},
				...c.slices !== void 0 ? { slices: c.slices } : {},
				...runtimeItem?.searchCodec !== void 0 ? { searchCodec: runtimeItem.searchCodec } : {}
			};
		}
		if (c.type === "api") {
			const runtimeItem = runtimeApiByPath.get(pathSpecKey(c.path));
			return {
				type: "api",
				path: c.path,
				isStatic: c.isStatic,
				handler: runtimeItem?.handler ?? (async () => noRuntimeFn(`api ${pathSpecAsString(c.path)}`)),
				...c.sourceFile ? { sourceFile: c.sourceFile } : {}
			};
		}
		const runtimeItem = runtimeSliceById.get(c.id);
		return {
			type: "slice",
			id: c.id,
			...c.pathSpec !== void 0 ? { pathSpec: c.pathSpec } : {},
			isStatic: c.isStatic,
			renderer: runtimeItem?.renderer ?? (async () => noRuntimeFn(`slice ${c.id}`)),
			...runtimeItem?.getEtagFromParams ? { getEtagFromParams: runtimeItem.getEtagFromParams } : {},
			...c.sourceFile ? { sourceFile: c.sourceFile } : {}
		};
	});
};
var getRouterPrefetchCode = (path2moduleIds) => {
	const moduleIdSet = /* @__PURE__ */ new Set();
	Object.values(path2moduleIds).forEach((ids) => ids.forEach((id) => moduleIdSet.add(id)));
	const ids = Array.from(moduleIdSet);
	const path2idxs = {};
	Object.entries(path2moduleIds).forEach(([path, pathIds]) => {
		path2idxs[path] = pathIds.map((id) => ids.indexOf(id));
	});
	return `
globalThis.__WAKU_ROUTER_PREFETCH__ = (path, callback) => {
  const ids = ${JSON.stringify(ids)};
  const path2idxs = ${JSON.stringify(path2idxs)};
  const key = Object.keys(path2idxs).find((key) => new RegExp(key).test(path));
  for (const idx of path2idxs[key] || []) {
    callback(ids[idx]);
  }
};
`;
};
var buildRoutePath2searchCodecId = (configs) => {
	const routePath2searchCodecId = {};
	for (const item of configs) if (item.type === "route" && item.searchCodec !== void 0) routePath2searchCodecId[pathSpecAsString(item.pathPattern ?? item.path)] = item.searchCodec.id;
	return routePath2searchCodecId;
};
var setupRouterSearchCodecs = (configs) => {
	const routePath2searchCodecId = buildRoutePath2searchCodecId(configs);
	if (Object.keys(routePath2searchCodecId).length === 0) return "";
	globalThis.__WAKU_ROUTER_SEARCH_CODECS__ = routePath2searchCodecId;
	return `
globalThis.__WAKU_ROUTER_SEARCH_CODECS__ = ${JSON.stringify(routePath2searchCodecId).replace(/</g, "\\u003c")};
`;
};
function unstable_defineRouter(fns) {
	const runHandled = (req, fn) => routerStorage.run({
		req,
		resolveSearchCodec
	}, (fns.unstable_interceptors ?? []).reduceRight((next, interceptor) => () => interceptor(next), fn));
	let cachedConfigs;
	let cachedHas404 = false;
	const initConfigs = async (loadBuildMetadata) => {
		if (cachedConfigs) return;
		const runtimeConfigs = Array.from(await fns.getConfigs());
		let configs = runtimeConfigs;
		if (loadBuildMetadata) {
			const raw = await loadBuildMetadata("defineRouter:serializableConfigs");
			if (raw) configs = mergeWithRuntimeConfigs(JSON.parse(raw), runtimeConfigs);
		}
		configs.forEach((item) => {
			if (item.type === "route") Object.keys(item.elements).forEach(assertNonReservedSlotId);
			else if (item.type === "slice") {
				if (item.isStatic && item.pathSpec) throw new Error(`defineRouter: static slice "${item.id}" cannot have a pathSpec`);
			}
		});
		cachedConfigs = configs;
		cachedHas404 = configs.some((item) => item.type === "route" && is404(item.path));
	};
	const getCachedConfigs = () => {
		if (!cachedConfigs) throw new Error("defineRouter: configs not initialized");
		return cachedConfigs;
	};
	let cachedRoutePath2searchCodec;
	const resolveSearchCodec = (routePath) => {
		if (!cachedRoutePath2searchCodec) {
			cachedRoutePath2searchCodec = /* @__PURE__ */ new Map();
			for (const item of getCachedConfigs()) if (item.type === "route" && item.searchCodec) cachedRoutePath2searchCodec.set(pathSpecAsString(item.pathPattern ?? item.path), item.searchCodec);
		}
		return cachedRoutePath2searchCodec.get(routePath);
	};
	const has404 = () => {
		if (!cachedConfigs) throw new Error("defineRouter: configs not initialized");
		return cachedHas404;
	};
	const getPathConfigItem = (pathname) => {
		const routePath = pathnameToRoutePath(pathname);
		return getCachedConfigs().find((item) => (item.type === "route" || item.type === "api") && !!getPathMapping(item.path, routePath));
	};
	const findSliceConfig = (sliceId) => {
		const slicePath = "/" + sliceId;
		for (const item of getCachedConfigs()) {
			if (item.type !== "slice") continue;
			if (item.id === sliceId) return { sliceConfig: item };
			if (item.pathSpec) {
				const params = getPathMapping(item.pathSpec, slicePath);
				if (params) return {
					sliceConfig: item,
					params
				};
			}
		}
	};
	const getSliceElement = async (sliceConfig, elementCache, concreteId, params) => {
		const cacheId = getSlotCacheId(SLICE_SLOT_ID_PREFIX + (concreteId ?? sliceConfig.id));
		const cached = elementCache.get(cacheId);
		if (cached) return cached;
		const element = await sliceConfig.renderer(params);
		if (sliceConfig.isStatic) {
			await elementCache.set(cacheId, element);
			return elementCache.get(cacheId);
		}
		return element;
	};
	const getEntriesForRoute = async (rscPath, rscParams, headers, elementCache) => {
		setRscPath(rscPath);
		setRscParams(rscParams);
		const routePath = decodeRoutePath(rscPath);
		const pathConfigItem = getPathConfigItem(routePath);
		if (pathConfigItem?.type !== "route") return null;
		const parsedEtags = safeJsonParse(headers["X-Waku-Router-Skip".toLowerCase()] || "{}");
		const clientEtags = isEtagRecord(parsedEtags) ? parsedEtags : {};
		const { query } = parseRscParams(rscParams);
		const routeId = ROUTE_SLOT_ID_PREFIX + routePath;
		const routeTemplateCacheId = getPathSpecCacheId(pathConfigItem.path);
		const option = {
			routePath,
			query: pathConfigItem.isStatic ? void 0 : query
		};
		const slices = pathConfigItem.slices || [];
		const sliceConfigMap = /* @__PURE__ */ new Map();
		slices.forEach((sliceId) => {
			const found = findSliceConfig(sliceId);
			if (found) sliceConfigMap.set(sliceId, {
				...found.sliceConfig,
				...found.params ? { params: found.params } : {}
			});
		});
		const entries = {};
		const addEntry = async (slotId, isStatic, cacheId, render, getEtag) => {
			if (isStatic) {
				if (clientEtags[slotId] === 1) return;
				if (!elementCache.get(cacheId)) await elementCache.set(cacheId, await render());
				entries[slotId] = await elementCache.get(cacheId);
				entries[ETAG_ID_PREFIX + slotId] = 1;
			} else {
				const etag = await getEtag();
				if (etag !== void 0 && etag === clientEtags[slotId]) return;
				entries[slotId] = await render();
				if (etag !== void 0) entries[ETAG_ID_PREFIX + slotId] = etag;
				else if (clientEtags[slotId] !== void 0) entries[ETAG_ID_PREFIX + slotId] = "";
			}
		};
		await Promise.all([
			addEntry(ROOT_SLOT_ID, pathConfigItem.rootElement.isStatic, getSlotCacheId(ROOT_SLOT_ID), () => pathConfigItem.rootElement.renderer(option), () => pathConfigItem.rootElement.getEtagFromOption?.(option)),
			addEntry(routeId, pathConfigItem.routeElement.isStatic, routeTemplateCacheId, () => pathConfigItem.routeElement.renderer(option), () => pathConfigItem.routeElement.getEtagFromOption?.(option)),
			...Object.entries(pathConfigItem.elements).map(([id, el]) => addEntry(id, el.isStatic, getSlotCacheId(id), () => el.renderer(option), () => el.getEtagFromOption?.(option))),
			...slices.map((sliceId) => {
				const sliceConfig = sliceConfigMap.get(sliceId);
				if (!sliceConfig) throw new Error(`Slice not found: ${sliceId}`);
				return addEntry(SLICE_SLOT_ID_PREFIX + sliceId, sliceConfig.isStatic, getSlotCacheId(SLICE_SLOT_ID_PREFIX + sliceId), () => sliceConfig.renderer(sliceConfig.params), () => sliceConfig.getEtagFromParams?.(sliceConfig.params));
			})
		]);
		entries[ROUTE_ID] = [routePath, query];
		entries[IS_STATIC_ID] = pathConfigItem.isStatic;
		if (has404()) entries[HAS404_ID] = true;
		return entries;
	};
	const requestElementCache = createElementCache();
	let requestElementCacheInit;
	let cachedPath2moduleIds;
	const handleRequest = async (input, { renderRsc, renderHtml, loadBuildMetadata }) => {
		await initConfigs(loadBuildMetadata);
		return runHandled(input.req, async () => {
			requestElementCacheInit ??= (async () => {
				const cachedElementsMetadata = await loadBuildMetadata("defineRouter:cachedElements");
				if (cachedElementsMetadata) Object.entries(JSON.parse(cachedElementsMetadata)).forEach(([cacheId, str]) => {
					requestElementCache.preload(cacheId, base64ToBytes(str));
				});
			})();
			await requestElementCacheInit;
			const getPath2moduleIds = async () => {
				if (!cachedPath2moduleIds) cachedPath2moduleIds = JSON.parse(await loadBuildMetadata("defineRouter:path2moduleIds") || "{}");
				return cachedPath2moduleIds;
			};
			const headers = Object.fromEntries(input.req.headers.entries());
			const withRerender = async (fn) => {
				let elementsPromise = Promise.resolve({});
				let rendered = false;
				const rerender = (rscPath, rscParams) => {
					if (rendered) throw new Error("already rendered");
					elementsPromise = Promise.all([elementsPromise, getEntriesForRoute(rscPath, rscParams, headers, requestElementCache)]).then(([oldElements, newElements]) => {
						if (newElements === null) console.warn("getEntries returned null");
						return {
							...oldElements,
							...newElements
						};
					});
				};
				setRerender(rerender);
				try {
					return {
						value: await fn(),
						elements: await elementsPromise
					};
				} finally {
					rendered = true;
				}
			};
			if (input.type === "component") {
				const sliceId = decodeSliceId(input.rscPath);
				if (sliceId !== null) {
					const found = findSliceConfig(sliceId);
					if (!found) return null;
					const { sliceConfig, params: sliceParams } = found;
					const sliceEtag = sliceConfig.isStatic ? 1 : await sliceConfig.getEtagFromParams?.(sliceParams);
					const sliceElement = await getSliceElement(sliceConfig, requestElementCache, sliceId, sliceParams);
					return renderRsc({
						[SLICE_SLOT_ID_PREFIX + sliceId]: sliceElement,
						...sliceEtag !== void 0 ? { [ETAG_ID_PREFIX + SLICE_SLOT_ID_PREFIX + sliceId]: sliceEtag } : {}
					});
				}
				const entries = await getEntriesForRoute(input.rscPath, input.rscParams, headers, requestElementCache);
				if (!entries) return null;
				return renderRsc(entries);
			}
			if (input.type === "function") try {
				const { value, elements } = await withRerender(() => input.fn(...input.args));
				return renderRsc(elements, { value });
			} catch (e) {
				const info = getErrorInfo(e);
				if (info?.location) {
					const rscPath = encodeRoutePath(pathnameToRoutePath(info.location));
					const entries = await getEntriesForRoute(rscPath, void 0, headers, requestElementCache);
					if (!entries) unstable_notFound();
					return renderRsc(entries);
				}
				throw e;
			}
			if (input.type === "action" || input.type === "custom") {
				const pathConfigItem = getPathConfigItem(input.pathname);
				if (pathConfigItem?.type === "api") {
					const url = new URL(input.req.url);
					url.pathname = input.pathname;
					const req = new Request(url, input.req);
					const params = getPathMapping(pathConfigItem.path, input.pathname) ?? {};
					return pathConfigItem.handler(req, { params });
				}
				const renderIt = async (pathname, query, status = 200) => {
					const routePath = pathnameToRoutePath(pathname);
					const rscPath = encodeRoutePath(routePath);
					const rscParams = new URLSearchParams({ query });
					let entries = await getEntriesForRoute(rscPath, rscParams, headers, requestElementCache);
					if (!entries) return null;
					const path2moduleIds = await getPath2moduleIds();
					const route = {
						path: routePath,
						query,
						hash: ""
					};
					const nonce = getNonce();
					const html = /*#__PURE__*/ (0, import_jsx_runtime_react_server.jsx)(INTERNAL_ServerRouter, { route });
					let formState;
					if (input.type === "action") {
						const { value, elements } = await withRerender(() => input.fn());
						formState = value;
						entries = {
							...entries,
							...elements
						};
					}
					return renderHtml(await renderRsc(entries), html, {
						rscPath,
						formState,
						status,
						...nonce ? { nonce } : {},
						unstable_extraScriptContent: getRouterPrefetchCode(path2moduleIds) + setupRouterSearchCodecs(getCachedConfigs())
					});
				};
				const query = new URL(input.req.url).searchParams.toString();
				if (pathConfigItem?.noSsr) return "fallback";
				try {
					if (pathConfigItem) return await renderIt(input.pathname, query);
				} catch (e) {
					if (getErrorInfo(e)?.status !== 404) throw e;
				}
				if (has404()) return renderIt("/404", "", 404);
				else return null;
			}
		});
	};
	const handleBuild = async ({ renderRsc, renderHtml, rscPath2pathname, saveBuildMetadata, generateFile, generateDefaultHtml, unstable_registerPrunableFile }) => {
		await initConfigs();
		const configs = getCachedConfigs();
		const allSourceFiles = /* @__PURE__ */ new Set();
		const dynamicSourceFiles = /* @__PURE__ */ new Set();
		const recordSourceFile = (isStatic, sourceFile) => {
			if (!sourceFile) return;
			allSourceFiles.add(sourceFile);
			if (!isStatic) dynamicSourceFiles.add(sourceFile);
		};
		for (const c of configs) if (c.type === "route") {
			recordSourceFile(c.rootElement.isStatic, c.rootElement.sourceFile);
			for (const el of Object.values(c.elements)) recordSourceFile(el.isStatic, el.sourceFile);
		} else recordSourceFile(c.isStatic, c.sourceFile);
		for (const srcPath of allSourceFiles) if (!dynamicSourceFiles.has(srcPath)) unstable_registerPrunableFile(srcPath);
		const serializedCachedElements = /* @__PURE__ */ new Map();
		const buildElementCache = createElementCache((cacheId, serialized) => {
			serializedCachedElements.set(cacheId, serialized);
		});
		const { runTask, waitForTasks } = createTaskRunner(500);
		const skipBuild = fns.unstable_skipBuild;
		for (const item of configs) {
			if (item.type !== "api") continue;
			if (!item.isStatic) continue;
			const routePath = pathSpecToRoutePath(item.path);
			if (!routePath) continue;
			if (skipBuild?.(routePath)) continue;
			const req = new Request(new URL(routePath, "http://localhost:3000"));
			runTask(async () => {
				await runHandled(req, async () => {
					const res = await item.handler(req, { params: {} });
					await generateFile(routePath, res.body || "").catch((e) => {
						if (e instanceof Error && "code" in e && e.code === "EEXIST") throw new Error(`the API route ${pathSpecAsString(item.path)} faced file-system conflicts when writing static responses, this often happens because of empty segments in "staticPaths".`, { cause: e });
						throw e;
					});
				});
			});
		}
		const path2moduleIds = {};
		const htmlRenderTasks = /* @__PURE__ */ new Set();
		const cacheStaticElementsOfRoute = async (item, routePath) => {
			const option = {
				routePath: routePath ?? pathSpecAsString(item.path),
				query: void 0
			};
			const tasks = [];
			const cache = (cacheId, el) => {
				if (!el.isStatic || buildElementCache.get(cacheId)) return;
				const result = buildElementCache.set(cacheId, el.renderer(option));
				if (result instanceof Promise) tasks.push(result);
			};
			cache(getSlotCacheId(ROOT_SLOT_ID), item.rootElement);
			cache(getPathSpecCacheId(item.path), item.routeElement);
			for (const [id, el] of Object.entries(item.elements)) cache(getSlotCacheId(id), el);
			await Promise.all(tasks);
		};
		for (const item of configs) {
			if (item.type !== "route") continue;
			const routePath = pathSpecToRoutePath(item.path);
			if (routePath && skipBuild?.(routePath)) continue;
			if (!routePath || !item.isStatic) {
				const req = new Request(new URL(routePath ?? pathSpecAsString(item.path), "http://localhost:3000"));
				runTask(() => runHandled(req, () => cacheStaticElementsOfRoute(item, routePath)));
				continue;
			}
			const rscPath = encodeRoutePath(routePath);
			const req = new Request(new URL(routePath, "http://localhost:3000"));
			runTask(async () => {
				await runHandled(req, async () => {
					const entries = await getEntriesForRoute(rscPath, void 0, {}, buildElementCache);
					if (!entries) return;
					for (const id of Object.keys(entries)) {
						const cached = buildElementCache.get(id);
						entries[id] = cached ? await cached : entries[id];
					}
					const moduleIds = /* @__PURE__ */ new Set();
					const [stream1, stream2] = (await renderRsc(entries, { unstable_clientModuleCallback: (ids) => ids.forEach((id) => moduleIds.add(id)) })).tee();
					await generateFile(rscPath2pathname(rscPath), stream1);
					path2moduleIds[path2regexp(item.pathPattern || item.path)] = Array.from(moduleIds);
					htmlRenderTasks.add(() => runHandled(req, async () => {
						const res = await renderHtml(stream2, /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(INTERNAL_ServerRouter, { route: {
							path: routePath,
							query: "",
							hash: ""
						} }), {
							rscPath,
							unstable_extraScriptContent: getRouterPrefetchCode(path2moduleIds) + setupRouterSearchCodecs(configs)
						});
						await generateFile(routePathToHtmlFilePath(routePath), res.body || "");
					}));
				});
			});
		}
		await waitForTasks();
		htmlRenderTasks.forEach(runTask);
		for (const item of configs) {
			if (item.type !== "route") continue;
			if (item.noSsr) {
				const routePath = pathSpecToRoutePath(item.path);
				if (!routePath) throw new Error("Pathname is required for noSsr routes on build");
				if (skipBuild?.(routePath)) continue;
				runTask(async () => {
					await generateDefaultHtml(routePathToHtmlFilePath(routePath));
				});
			}
		}
		for (const item of configs) {
			if (item.type !== "slice") continue;
			if (!item.isStatic) continue;
			if (item.pathSpec) continue;
			const rscPath = encodeSliceId(item.id);
			const req = new Request(new URL("http://localhost:3000"));
			runTask(async () => {
				await runHandled(req, async () => {
					const sliceElement = await getSliceElement(item, buildElementCache);
					const body = await renderRsc({
						[SLICE_SLOT_ID_PREFIX + item.id]: sliceElement,
						[ETAG_ID_PREFIX + SLICE_SLOT_ID_PREFIX + item.id]: 1
					});
					await generateFile(rscPath2pathname(rscPath), body);
				});
			});
		}
		await waitForTasks();
		await saveBuildMetadata("defineRouter:cachedElements", JSON.stringify(Object.fromEntries(serializedCachedElements)));
		await saveBuildMetadata("defineRouter:path2moduleIds", JSON.stringify(path2moduleIds));
		await saveBuildMetadata("defineRouter:serializableConfigs", JSON.stringify(configs.map(toSerializable)));
	};
	return Object.assign(unstable_defineHandlers({
		handleRequest,
		handleBuild
	}), { unstable_getRouterConfigs: async () => getCachedConfigs() });
}
//#endregion
//#region node_modules/waku/dist/minimal/client.js
var Children = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"Children\"");
}), "847a2b1045ef", "Children");
var Slot = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"Slot\"");
}), "847a2b1045ef", "Slot");
//#endregion
//#region node_modules/waku/dist/router/create-pages.js
var pathMappingWithoutGroups = (pathSpec, pathname) => {
	return getPathMapping(pathSpec.filter((spec) => !(spec.type === "literal" && spec.name.startsWith("("))), pathname);
};
var sanitizeSlug = (slug) => slug.replace(/ /g, "-");
var normalizeStaticPaths = (staticPaths) => staticPaths.map((item) => (Array.isArray(item) ? item : [item]).map(sanitizeSlug));
var assertStaticPathArity = (staticSegments, slugCount, wildcardCount) => {
	if (staticSegments.length !== slugCount && wildcardCount === 0) throw new Error("staticPaths does not match with slug pattern");
};
var getPageSlotId = (routePath) => `page:${routePath}`;
var getLayoutSlotId = (layoutIdPath) => `layout:${layoutIdPath}`;
var parseSearchOrThrow = (codec, query) => {
	try {
		return codec.parse(query);
	} catch (cause) {
		const err = createCustomError("Bad Request", { status: 400 });
		err.cause = cause;
		throw err;
	}
};
var forEachConcreteStaticPath = (routePathSpec, staticPathsInput, fn) => {
	const { numSlugs, numWildcards } = countSlugsAndWildcards(routePathSpec);
	for (const staticSegments of normalizeStaticPaths(staticPathsInput)) {
		assertStaticPathArity(staticSegments, numSlugs, numWildcards);
		fn(expandStaticRoutePath(routePathSpec, staticSegments));
	}
};
/**
* Root component for all pages
* ```tsx
*   <html>
*     <head></head>
*     <body>{children}</body>
*   </html>
* ```
*/ var DefaultRoot = ({ children }) => /*#__PURE__*/ (0, import_jsx_runtime_react_server.jsx)(ErrorBoundary, { children: /*#__PURE__*/ (0, import_jsx_runtime_react_server.jsxs)("html", { children: [/*#__PURE__*/ (0, import_jsx_runtime_react_server.jsx)("head", {}), /*#__PURE__*/ (0, import_jsx_runtime_react_server.jsx)("body", { children })] }) });
var createNestedElements = (elements, children) => elements.reduceRight((result, element) => /*#__PURE__*/ (0, import_react_react_server.createElement)(element.component, element.props, result), children);
var routePriorityComparator = (a, b) => {
	const aPath = a.path;
	const bPath = b.path;
	const aPathLength = aPath.length;
	const bPathLength = bPath.length;
	const aHasWildcard = aPath.at(-1)?.type === "wildcard";
	const bHasWildcard = bPath.at(-1)?.type === "wildcard";
	if (aPathLength === 0 && bHasWildcard) return -1;
	if (bPathLength === 0 && aHasWildcard) return 1;
	if (aPathLength !== bPathLength) return aPathLength > bPathLength ? -1 : 1;
	const minLength = Math.min(aPathLength, bPathLength);
	for (let i = 0; i < minLength; i++) {
		const aIsLiteral = aPath[i]?.type === "literal";
		if (aIsLiteral !== (bPath[i]?.type === "literal")) return aIsLiteral ? -1 : 1;
	}
	if (aHasWildcard !== bHasWildcard) return aHasWildcard ? 1 : -1;
	return 0;
};
var createPages = (fn, options) => {
	let configured = false;
	const groupedRoutePathByRoutePath = /* @__PURE__ */ new Map();
	const staticPageEntryByRoutePath = /* @__PURE__ */ new Map();
	const dynamicPageEntryByRoutePath = /* @__PURE__ */ new Map();
	const wildcardPageEntryByRoutePath = /* @__PURE__ */ new Map();
	const dynamicLayoutEntryByRoutePath = /* @__PURE__ */ new Map();
	const apiEntryByRoutePath = /* @__PURE__ */ new Map();
	const staticComponentById = /* @__PURE__ */ new Map();
	const getStaticComponentId = (routePath, kind) => joinPath(routePath, kind).slice(1);
	const getStaticLayout = (id) => staticComponentById.get(getStaticComponentId(id, "layout"))?.component;
	const sliceIdsByRoutePath = /* @__PURE__ */ new Map();
	const sliceEntryById = /* @__PURE__ */ new Map();
	let rootItem = void 0;
	const pagePathExists = (path) => apiEntryByRoutePath.has(path) || staticPageEntryByRoutePath.has(path) || dynamicPageEntryByRoutePath.has(path) || wildcardPageEntryByRoutePath.has(path);
	/** Creates a function to map pathname to component props */ const createPathPropsMapper = (path) => {
		const routePathSpec = parsePathWithSlug(groupedRoutePathByRoutePath.get(path) ?? path);
		return (pathname) => pathMappingWithoutGroups(routePathSpec, pathname);
	};
	const createLayoutPropsMapper = (layoutPath) => {
		const routePathSpec = parsePathWithSlug(layoutPath);
		const numSegments = routePathSpec.filter((segment) => !(segment.type === "literal" && segment.name.startsWith("("))).length;
		return (routePath) => {
			const layoutRoutePath = "/" + routePath.split("/").filter(Boolean).slice(0, numSegments).join("/");
			return pathMappingWithoutGroups(routePathSpec, layoutRoutePath) ?? {};
		};
	};
	const getLayoutIdPath = (layoutPath, routePath) => {
		const numSegments = parsePathWithSlug(layoutPath).length;
		return "/" + routePath.split("/").filter(Boolean).slice(0, numSegments).join("/");
	};
	/** Builds the routeElement renderer from layouts and page slots */ const buildRouteElement = (layouts, path) => {
		const layoutElements = layouts.map(({ layoutIdPath }) => ({
			component: Slot,
			props: { id: getLayoutSlotId(layoutIdPath) }
		}));
		return () => createNestedElements(layoutElements, /*#__PURE__*/ (0, import_jsx_runtime_react_server.jsx)(Slot, { id: getPageSlotId(path) }));
	};
	/** Renders the root component */ const renderRoot = () => /*#__PURE__*/ (0, import_react_react_server.createElement)(rootItem ? rootItem.component : DefaultRoot, null, /*#__PURE__*/ (0, import_jsx_runtime_react_server.jsx)(Children, {}));
	const registerStaticComponent = (id, component, sourceFile) => {
		const existing = staticComponentById.get(id);
		if (existing && existing.component !== component) throw new Error(`Duplicated component for: ${id}`);
		staticComponentById.set(id, {
			component,
			sourceFile
		});
	};
	const isAllElementsStatic = (elements) => Object.values(elements).every((element) => element.isStatic);
	const isAllSlicesStatic = (path) => sliceIdsByRoutePath.get(path).every((sliceId) => sliceEntryById.get(sliceId)?.isStatic);
	const createPage = (page) => {
		if (configured) throw new Error("createPage no longer available");
		if (!page.component) return page;
		const pageRoutePath = pathnameToRoutePath(page.path);
		if (pagePathExists(pageRoutePath)) throw new Error(`Duplicated path: ${page.path}`);
		const routePathSpec = parsePathWithSlug(pageRoutePath);
		const { numSlugs, numWildcards } = countSlugsAndWildcards(routePathSpec);
		const noSsr = page.unstable_disableSSR ?? false;
		const slices = page.slices || [];
		const sourceFile = page.unstable_sourceFile;
		const getEtag = page.unstable_getEtag;
		const searchCodec = page.unstable_searchCodec;
		if (searchCodec && page.render === "static") throw new Error(`unstable_searchCodec is not supported on a static route (${page.path}); search params need a per-request query, so use render: 'dynamic'.`);
		const registerPageWithExactPath = () => {
			const routePath = pageRoutePath;
			const spec = parseExactPath(routePath);
			if (page.render === "static") {
				staticPageEntryByRoutePath.set(routePath, {
					concretePathSpec: spec,
					noSsr,
					sourceFile
				});
				const id = getStaticComponentId(routePath, "page");
				registerStaticComponent(id, page.component, sourceFile);
			} else dynamicPageEntryByRoutePath.set(routePath, {
				routePathSpec: spec,
				component: page.component,
				noSsr,
				sourceFile,
				getEtag,
				searchCodec
			});
			sliceIdsByRoutePath.set(routePath, slices);
		};
		const registerStaticPageWithoutSlugs = () => {
			const routePath = pathnameToRoutePath(getGrouplessPath(page.path));
			staticPageEntryByRoutePath.set(routePath, {
				concretePathSpec: routePathSpec,
				noSsr,
				sourceFile
			});
			const id = getStaticComponentId(routePath, "page");
			if (routePath !== pageRoutePath) groupedRoutePathByRoutePath.set(routePath, pageRoutePath);
			registerStaticComponent(id, page.component, sourceFile);
			sliceIdsByRoutePath.set(routePath, slices);
		};
		const registerStaticPageWithSlugs = (staticPathsInput) => {
			forEachConcreteStaticPath(routePathSpec, staticPathsInput, ({ concretePath, pathItems, mapping }) => {
				const routePath = pathnameToRoutePath(getGrouplessPath(concretePath));
				const concretePathSpec = pathItems.map((name) => ({
					type: "literal",
					name
				}));
				staticPageEntryByRoutePath.set(routePath, {
					concretePathSpec,
					pathPatternSpec: routePathSpec,
					noSsr,
					sourceFile
				});
				const concreteRoutePath = pathnameToRoutePath(concretePath);
				if (routePath !== concreteRoutePath) groupedRoutePathByRoutePath.set(routePath, concreteRoutePath);
				const id = getStaticComponentId(routePath, "page");
				const WrappedComponent = (props) => /*#__PURE__*/ (0, import_react_react_server.createElement)(page.component, {
					...props,
					...mapping
				});
				registerStaticComponent(id, WrappedComponent, sourceFile);
				sliceIdsByRoutePath.set(routePath, slices);
			});
		};
		const registerDynamicPageWithoutWildcard = () => {
			const routePath = pathnameToRoutePath(getGrouplessPath(page.path));
			if (routePath !== pageRoutePath) groupedRoutePathByRoutePath.set(routePath, pageRoutePath);
			dynamicPageEntryByRoutePath.set(routePath, {
				routePathSpec,
				component: page.component,
				noSsr,
				sourceFile,
				getEtag,
				searchCodec
			});
			sliceIdsByRoutePath.set(routePath, slices);
		};
		const registerDynamicPageWithWildcard = () => {
			const routePath = pathnameToRoutePath(getGrouplessPath(page.path));
			if (routePath !== pageRoutePath) groupedRoutePathByRoutePath.set(routePath, pageRoutePath);
			wildcardPageEntryByRoutePath.set(routePath, {
				routePathSpec,
				component: page.component,
				noSsr,
				sourceFile,
				getEtag,
				searchCodec
			});
			sliceIdsByRoutePath.set(routePath, slices);
		};
		if (page.exactPath) registerPageWithExactPath();
		else if (page.render === "static" && numSlugs === 0) registerStaticPageWithoutSlugs();
		else if (page.render === "static" && numSlugs > 0 && "staticPaths" in page) registerStaticPageWithSlugs(page.staticPaths);
		else if (page.render === "dynamic" && numWildcards === 0) registerDynamicPageWithoutWildcard();
		else if (page.render === "dynamic" && numWildcards === 1) registerDynamicPageWithWildcard();
		else throw new Error("Invalid page configuration " + JSON.stringify(page));
		return page;
	};
	const createLayout = (layout) => {
		if (configured) throw new Error("createLayout no longer available");
		if (!layout.component) return;
		const routePath = pathnameToRoutePath(layout.path);
		const sourceFile = layout.unstable_sourceFile;
		const getEtag = layout.unstable_getEtag;
		if (layout.render === "static") {
			const id = getStaticComponentId(routePath, "layout");
			registerStaticComponent(id, layout.component, sourceFile);
		} else if (layout.render === "dynamic") {
			if (dynamicLayoutEntryByRoutePath.has(routePath)) throw new Error(`Duplicated dynamic path: ${layout.path}`);
			const routePathSpec = parsePathWithSlug(routePath);
			dynamicLayoutEntryByRoutePath.set(routePath, {
				routePathSpec,
				component: layout.component,
				sourceFile,
				getEtag
			});
		} else throw new Error("Invalid layout configuration");
	};
	const createApi = (options) => {
		if (configured) throw new Error("createApi no longer available");
		if (options.render === "static") {
			if (!options.handler) return;
		} else if (!options.handlers || !Object.values(options.handlers).some(Boolean)) return;
		const routePath = pathnameToRoutePath(options.path);
		const sourceFile = options.unstable_sourceFile;
		if (pagePathExists(routePath)) throw new Error(`Duplicated api path: ${options.path}`);
		const routePathSpec = parsePathWithSlug(routePath);
		if (options.render === "static") {
			const { numSlugs } = countSlugsAndWildcards(routePathSpec);
			if (numSlugs > 0 && options.staticPaths) forEachConcreteStaticPath(routePathSpec, options.staticPaths, ({ concretePath, pathItems, mapping }) => {
				const concreteRoutePath = pathnameToRoutePath(concretePath);
				if (pagePathExists(concreteRoutePath)) throw new Error(`Duplicated api path: ${concretePath}`);
				apiEntryByRoutePath.set(concreteRoutePath, {
					render: "static",
					routePathSpec: pathItems.map((name) => ({
						type: "literal",
						name
					})),
					handlers: { GET: options.handler },
					staticParams: mapping,
					sourceFile
				});
			});
			else apiEntryByRoutePath.set(routePath, {
				render: "static",
				routePathSpec,
				handlers: { GET: options.handler },
				sourceFile
			});
		} else apiEntryByRoutePath.set(routePath, {
			render: "dynamic",
			routePathSpec,
			handlers: options.handlers,
			sourceFile
		});
	};
	const createRoot = (root) => {
		if (configured) throw new Error("createRoot no longer available");
		if (!root.component) return;
		if (rootItem) throw new Error(`Duplicated root component`);
		if (root.render === "static" || root.render === "dynamic") rootItem = root;
		else throw new Error("Invalid root configuration");
	};
	const createSlice = (slice) => {
		if (configured) throw new Error("createSlice no longer available");
		if (!slice.component) return;
		const slicePathSpec = parsePathWithSlug(slice.id);
		const { numSlugs } = countSlugsAndWildcards(slicePathSpec);
		const sourceFile = slice.unstable_sourceFile;
		const getEtag = slice.unstable_getEtag;
		if (slice.render === "static" && numSlugs > 0) {
			if (!("staticPaths" in slice) || !slice.staticPaths) throw new Error(`Static slice with slug requires staticPaths: ${slice.id}`);
			forEachConcreteStaticPath(slicePathSpec, slice.staticPaths, ({ concretePath, mapping }) => {
				const concreteId = concretePath.replace(/^\//, "");
				if (sliceEntryById.has(concreteId)) throw new Error(`Duplicated slice id: ${concreteId}`);
				const WrappedComponent = (props) => /*#__PURE__*/ (0, import_react_react_server.createElement)(slice.component, {
					...props,
					...mapping
				});
				sliceEntryById.set(concreteId, {
					component: WrappedComponent,
					isStatic: true,
					sourceFile
				});
			});
			return;
		}
		if (sliceEntryById.has(slice.id)) throw new Error(`Duplicated slice id: ${slice.id}`);
		sliceEntryById.set(slice.id, {
			component: slice.component,
			isStatic: slice.render === "static",
			sourceFile,
			getEtag
		});
	};
	const interceptors = [];
	const createInterceptor = (interceptor) => {
		if (configured) throw new Error("createInterceptor no longer available");
		interceptors.push(interceptor);
	};
	let ready;
	const configure = async () => {
		if (!configured && !ready) {
			ready = fn({
				createPage,
				createLayout,
				createRoot,
				createApi,
				createSlice,
				createInterceptor
			});
			await ready;
			configured = true;
		}
		await ready;
	};
	const getLayouts = (routePathSpec) => {
		return routePathSpec.reduce((acc, _segment, index) => {
			acc.push(pathSpecAsString(routePathSpec.slice(0, index + 1)));
			return acc;
		}, ["/"]).filter((segment) => dynamicLayoutEntryByRoutePath.has(segment) || getStaticLayout(segment));
	};
	return unstable_defineRouter({
		getConfigs: async () => {
			await configure();
			const collectLayoutMatches = (spec, routePath) => getLayouts(spec).map((layoutPath) => ({
				layoutPath,
				layoutIdPath: routePath ? getLayoutIdPath(layoutPath, routePath) : layoutPath
			}));
			const buildElementSpec = (component, buildProps, isStatic, sourceFile, getEtag) => {
				const propsCache = /* @__PURE__ */ new WeakMap();
				const toProps = (option) => {
					if (!propsCache.has(option)) propsCache.set(option, buildProps(option));
					return propsCache.get(option);
				};
				return {
					isStatic,
					renderer: (option) => /*#__PURE__*/ (0, import_react_react_server.createElement)(component, toProps(option), /*#__PURE__*/ (0, import_jsx_runtime_react_server.jsx)(Children, {})),
					...sourceFile ? { sourceFile } : {},
					...getEtag ? { getEtagFromOption: (option) => getEtag(toProps(option)) } : {}
				};
			};
			const buildLayoutElement = (layoutPath) => {
				const dynamicEntry = dynamicLayoutEntryByRoutePath.get(layoutPath);
				const staticEntry = dynamicEntry ? void 0 : staticComponentById.get(getStaticComponentId(layoutPath, "layout"));
				const layout = dynamicEntry?.component ?? staticEntry?.component;
				if (!layout) throw new Error("Invalid layout " + layoutPath);
				const sourceFile = dynamicEntry?.sourceFile ?? staticEntry?.sourceFile;
				const getLayoutPropsMapping = createLayoutPropsMapper(layoutPath);
				return buildElementSpec(layout, (option) => getLayoutPropsMapping(option.routePath), !dynamicEntry, sourceFile, dynamicEntry?.getEtag);
			};
			const buildLayoutElements = (matches) => Object.fromEntries(matches.map(({ layoutPath, layoutIdPath }) => [getLayoutSlotId(layoutIdPath), buildLayoutElement(layoutPath)]));
			const buildPageElement = (component, getPropsMapping, isStatic, sourceFile, getEtag, searchCodec) => buildElementSpec(component, (option) => ({
				...getPropsMapping(option.routePath),
				...option.query ? { query: option.query } : {},
				...searchCodec ? { search: parseSearchOrThrow(searchCodec, option.query ?? "") } : {},
				path: option.routePath
			}), isStatic, sourceFile, getEtag);
			const rootIsStatic = !rootItem || rootItem.render === "static";
			const rootSourceFile = rootItem?.unstable_sourceFile;
			const rootGetEtag = rootItem?.unstable_getEtag;
			const buildRootElement = () => ({
				isStatic: rootIsStatic,
				renderer: renderRoot,
				...rootSourceFile ? { sourceFile: rootSourceFile } : {},
				...rootGetEtag ? { getEtagFromOption: () => rootGetEtag() } : {}
			});
			const buildRouteConfigBase = (routePath, pathSpec, layouts, elements, noSsr) => ({
				type: "route",
				path: pathSpec.filter((part) => !part.name?.startsWith("(")),
				isStatic: rootIsStatic && isAllElementsStatic(elements) && isAllSlicesStatic(routePath),
				rootElement: buildRootElement(),
				routeElement: {
					isStatic: true,
					renderer: buildRouteElement(layouts, routePath)
				},
				elements,
				noSsr,
				slices: sliceIdsByRoutePath.get(routePath)
			});
			const buildStaticRouteConfigs = () => Array.from(staticPageEntryByRoutePath, ([routePath, { concretePathSpec, pathPatternSpec, noSsr }]) => {
				const groupedRoutePath = groupedRoutePathByRoutePath.get(routePath) ?? routePath;
				const layouts = collectLayoutMatches(pathPatternSpec ?? concretePathSpec, groupedRoutePath);
				const pageEntry = staticComponentById.get(getStaticComponentId(routePath, "page"));
				const getPropsMapping = createPathPropsMapper(routePath);
				const elements = buildLayoutElements(layouts);
				elements[getPageSlotId(routePath)] = buildPageElement(pageEntry.component, getPropsMapping, true, pageEntry.sourceFile);
				return {
					...buildRouteConfigBase(routePath, concretePathSpec, layouts, elements, noSsr),
					...pathPatternSpec && { pathPattern: pathPatternSpec }
				};
			});
			const buildDynamicLikeRouteConfig = (routePath, { routePathSpec, component, noSsr, sourceFile, getEtag, searchCodec }) => {
				const layouts = collectLayoutMatches(routePathSpec);
				const getPropsMapping = createPathPropsMapper(routePath);
				const elements = buildLayoutElements(layouts);
				elements[getPageSlotId(routePath)] = buildPageElement(component, getPropsMapping, false, sourceFile, getEtag, searchCodec);
				return {
					...buildRouteConfigBase(routePath, routePathSpec, layouts, elements, noSsr),
					...searchCodec ? { searchCodec } : {}
				};
			};
			const buildDynamicRouteConfigs = () => Array.from(dynamicPageEntryByRoutePath, ([routePath, entry]) => buildDynamicLikeRouteConfig(routePath, entry));
			const buildWildcardRouteConfigs = () => Array.from(wildcardPageEntryByRoutePath, ([routePath, entry]) => buildDynamicLikeRouteConfig(routePath, entry));
			const buildApiConfigs = () => Array.from(apiEntryByRoutePath.values(), ({ routePathSpec, render, handlers, staticParams, sourceFile }) => ({
				type: "api",
				path: routePathSpec,
				isStatic: render === "static",
				handler: async (req, apiContext) => {
					const path = new URL(req.url).pathname;
					const method = req.method;
					const handler = handlers[method] ?? handlers.all;
					if (!handler) throw new Error("API method not found: " + method + "for path: " + path);
					return handler(req, staticParams ? { params: staticParams } : apiContext);
				},
				...sourceFile ? { sourceFile } : {}
			}));
			const buildSliceConfigs = () => Array.from(sliceEntryById, ([id, { isStatic, sourceFile, getEtag }]) => {
				const slicePathSpec = parsePathWithSlug(id);
				return {
					type: "slice",
					id,
					...slicePathSpec.some((s) => s.type !== "literal") ? { pathSpec: slicePathSpec } : {},
					isStatic,
					renderer: async (params) => {
						const slice = sliceEntryById.get(id);
						if (!slice) throw new Error("Slice not found: " + id);
						return /*#__PURE__*/ (0, import_react_react_server.createElement)(slice.component, params, /*#__PURE__*/ (0, import_jsx_runtime_react_server.jsx)(Children, {}));
					},
					...sourceFile ? { sourceFile } : {},
					...getEtag ? { getEtagFromParams: getEtag } : {}
				};
			});
			return [...[...[
				...buildStaticRouteConfigs(),
				...buildDynamicRouteConfigs(),
				...buildWildcardRouteConfigs()
			], ...buildApiConfigs()].sort((configA, configB) => routePriorityComparator(configA, configB)), ...buildSliceConfigs()];
		},
		...options?.unstable_skipBuild && { unstable_skipBuild: options.unstable_skipBuild },
		unstable_interceptors: interceptors
	});
};
function expandStaticRoutePath(routePathSpec, staticSegments) {
	const mapping = {};
	let slugIndex = 0;
	const pathItems = [];
	routePathSpec.forEach((spec) => {
		switch (spec.type) {
			case "literal":
				pathItems.push(spec.name);
				break;
			case "wildcard":
				mapping[spec.name] = staticSegments.slice(slugIndex);
				staticSegments.slice(slugIndex++).forEach((slug) => {
					pathItems.push(slug);
				});
				break;
			case "group": {
				const slug = staticSegments[slugIndex++];
				const prefix = spec.prefix ?? "";
				const suffix = spec.suffix ?? "";
				pathItems.push(`${prefix}${slug}${suffix}`);
				mapping[spec.name] = slug;
				break;
			}
		}
	});
	return {
		concretePath: "/" + pathItems.join("/"),
		pathItems,
		mapping
	};
}
//#endregion
//#region node_modules/fumadocs-core/dist/negotiation-D7x4zl2m.js
/**
* negotiator
* Copyright(c) 2012 Isaac Z. Schlueter
* Copyright(c) 2014 Federico Romero
* Copyright(c) 2014-2015 Douglas Christopher Wilson
* MIT Licensed
*/
var require_charset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module exports.
	* @public
	*/
	module.exports = preferredCharsets;
	module.exports.preferredCharsets = preferredCharsets;
	/**
	* Module variables.
	* @private
	*/
	var simpleCharsetRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
	/**
	* Parse the Accept-Charset header.
	* @private
	*/
	function parseAcceptCharset(accept) {
		var accepts = accept.split(",");
		for (var i = 0, j = 0; i < accepts.length; i++) {
			var charset = parseCharset(accepts[i].trim(), i);
			if (charset) accepts[j++] = charset;
		}
		accepts.length = j;
		return accepts;
	}
	/**
	* Parse a charset from the Accept-Charset header.
	* @private
	*/
	function parseCharset(str, i) {
		var match = simpleCharsetRegExp.exec(str);
		if (!match) return null;
		var charset = match[1];
		var q = 1;
		if (match[2]) {
			var params = match[2].split(";");
			for (var j = 0; j < params.length; j++) {
				var p = params[j].trim().split("=");
				if (p[0] === "q") {
					q = parseFloat(p[1]);
					break;
				}
			}
		}
		return {
			charset,
			q,
			i
		};
	}
	/**
	* Get the priority of a charset.
	* @private
	*/
	function getCharsetPriority(charset, accepted, index) {
		var priority = {
			o: -1,
			q: 0,
			s: 0
		};
		for (var i = 0; i < accepted.length; i++) {
			var spec = specify(charset, accepted[i], index);
			if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) priority = spec;
		}
		return priority;
	}
	/**
	* Get the specificity of the charset.
	* @private
	*/
	function specify(charset, spec, index) {
		var s = 0;
		if (spec.charset.toLowerCase() === charset.toLowerCase()) s |= 1;
		else if (spec.charset !== "*") return null;
		return {
			i: index,
			o: spec.i,
			q: spec.q,
			s
		};
	}
	/**
	* Get the preferred charsets from an Accept-Charset header.
	* @public
	*/
	function preferredCharsets(accept, provided) {
		var accepts = parseAcceptCharset(accept === void 0 ? "*" : accept || "");
		if (!provided) return accepts.filter(isQuality).sort(compareSpecs).map(getFullCharset);
		var priorities = provided.map(function getPriority(type, index) {
			return getCharsetPriority(type, accepts, index);
		});
		return priorities.filter(isQuality).sort(compareSpecs).map(function getCharset(priority) {
			return provided[priorities.indexOf(priority)];
		});
	}
	/**
	* Compare two specs.
	* @private
	*/
	function compareSpecs(a, b) {
		return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
	}
	/**
	* Get full charset string.
	* @private
	*/
	function getFullCharset(spec) {
		return spec.charset;
	}
	/**
	* Check if a spec has any quality.
	* @private
	*/
	function isQuality(spec) {
		return spec.q > 0;
	}
}));
/**
* negotiator
* Copyright(c) 2012 Isaac Z. Schlueter
* Copyright(c) 2014 Federico Romero
* Copyright(c) 2014-2015 Douglas Christopher Wilson
* MIT Licensed
*/
var require_encoding = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module exports.
	* @public
	*/
	module.exports = preferredEncodings;
	module.exports.preferredEncodings = preferredEncodings;
	/**
	* Module variables.
	* @private
	*/
	var simpleEncodingRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
	/**
	* Parse the Accept-Encoding header.
	* @private
	*/
	function parseAcceptEncoding(accept) {
		var accepts = accept.split(",");
		var hasIdentity = false;
		var minQuality = 1;
		for (var i = 0, j = 0; i < accepts.length; i++) {
			var encoding = parseEncoding(accepts[i].trim(), i);
			if (encoding) {
				accepts[j++] = encoding;
				hasIdentity = hasIdentity || specify("identity", encoding);
				minQuality = Math.min(minQuality, encoding.q || 1);
			}
		}
		if (!hasIdentity) accepts[j++] = {
			encoding: "identity",
			q: minQuality,
			i
		};
		accepts.length = j;
		return accepts;
	}
	/**
	* Parse an encoding from the Accept-Encoding header.
	* @private
	*/
	function parseEncoding(str, i) {
		var match = simpleEncodingRegExp.exec(str);
		if (!match) return null;
		var encoding = match[1];
		var q = 1;
		if (match[2]) {
			var params = match[2].split(";");
			for (var j = 0; j < params.length; j++) {
				var p = params[j].trim().split("=");
				if (p[0] === "q") {
					q = parseFloat(p[1]);
					break;
				}
			}
		}
		return {
			encoding,
			q,
			i
		};
	}
	/**
	* Get the priority of an encoding.
	* @private
	*/
	function getEncodingPriority(encoding, accepted, index) {
		var priority = {
			encoding,
			o: -1,
			q: 0,
			s: 0
		};
		for (var i = 0; i < accepted.length; i++) {
			var spec = specify(encoding, accepted[i], index);
			if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) priority = spec;
		}
		return priority;
	}
	/**
	* Get the specificity of the encoding.
	* @private
	*/
	function specify(encoding, spec, index) {
		var s = 0;
		if (spec.encoding.toLowerCase() === encoding.toLowerCase()) s |= 1;
		else if (spec.encoding !== "*") return null;
		return {
			encoding,
			i: index,
			o: spec.i,
			q: spec.q,
			s
		};
	}
	/**
	* Get the preferred encodings from an Accept-Encoding header.
	* @public
	*/
	function preferredEncodings(accept, provided, preferred) {
		var accepts = parseAcceptEncoding(accept || "");
		var comparator = preferred ? function comparator(a, b) {
			if (a.q !== b.q) return b.q - a.q;
			var aPreferred = preferred.indexOf(a.encoding);
			var bPreferred = preferred.indexOf(b.encoding);
			if (aPreferred === -1 && bPreferred === -1) return b.s - a.s || a.o - b.o || a.i - b.i;
			if (aPreferred !== -1 && bPreferred !== -1) return aPreferred - bPreferred;
			return aPreferred === -1 ? 1 : -1;
		} : compareSpecs;
		if (!provided) return accepts.filter(isQuality).sort(comparator).map(getFullEncoding);
		var priorities = provided.map(function getPriority(type, index) {
			return getEncodingPriority(type, accepts, index);
		});
		return priorities.filter(isQuality).sort(comparator).map(function getEncoding(priority) {
			return provided[priorities.indexOf(priority)];
		});
	}
	/**
	* Compare two specs.
	* @private
	*/
	function compareSpecs(a, b) {
		return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i;
	}
	/**
	* Get full encoding string.
	* @private
	*/
	function getFullEncoding(spec) {
		return spec.encoding;
	}
	/**
	* Check if a spec has any quality.
	* @private
	*/
	function isQuality(spec) {
		return spec.q > 0;
	}
}));
/**
* negotiator
* Copyright(c) 2012 Isaac Z. Schlueter
* Copyright(c) 2014 Federico Romero
* Copyright(c) 2014-2015 Douglas Christopher Wilson
* MIT Licensed
*/
var require_language = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module exports.
	* @public
	*/
	module.exports = preferredLanguages;
	module.exports.preferredLanguages = preferredLanguages;
	/**
	* Module variables.
	* @private
	*/
	var simpleLanguageRegExp = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;
	/**
	* Parse the Accept-Language header.
	* @private
	*/
	function parseAcceptLanguage(accept) {
		var accepts = accept.split(",");
		for (var i = 0, j = 0; i < accepts.length; i++) {
			var language = parseLanguage(accepts[i].trim(), i);
			if (language) accepts[j++] = language;
		}
		accepts.length = j;
		return accepts;
	}
	/**
	* Parse a language from the Accept-Language header.
	* @private
	*/
	function parseLanguage(str, i) {
		var match = simpleLanguageRegExp.exec(str);
		if (!match) return null;
		var prefix = match[1];
		var suffix = match[2];
		var full = prefix;
		if (suffix) full += "-" + suffix;
		var q = 1;
		if (match[3]) {
			var params = match[3].split(";");
			for (var j = 0; j < params.length; j++) {
				var p = params[j].split("=");
				if (p[0] === "q") q = parseFloat(p[1]);
			}
		}
		return {
			prefix,
			suffix,
			q,
			i,
			full
		};
	}
	/**
	* Get the priority of a language.
	* @private
	*/
	function getLanguagePriority(language, accepted, index) {
		var priority = {
			o: -1,
			q: 0,
			s: 0
		};
		for (var i = 0; i < accepted.length; i++) {
			var spec = specify(language, accepted[i], index);
			if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) priority = spec;
		}
		return priority;
	}
	/**
	* Get the specificity of the language.
	* @private
	*/
	function specify(language, spec, index) {
		var p = parseLanguage(language);
		if (!p) return null;
		var s = 0;
		if (spec.full.toLowerCase() === p.full.toLowerCase()) s |= 4;
		else if (spec.prefix.toLowerCase() === p.full.toLowerCase()) s |= 2;
		else if (spec.full.toLowerCase() === p.prefix.toLowerCase()) s |= 1;
		else if (spec.full !== "*") return null;
		return {
			i: index,
			o: spec.i,
			q: spec.q,
			s
		};
	}
	/**
	* Get the preferred languages from an Accept-Language header.
	* @public
	*/
	function preferredLanguages(accept, provided) {
		var accepts = parseAcceptLanguage(accept === void 0 ? "*" : accept || "");
		if (!provided) return accepts.filter(isQuality).sort(compareSpecs).map(getFullLanguage);
		var priorities = provided.map(function getPriority(type, index) {
			return getLanguagePriority(type, accepts, index);
		});
		return priorities.filter(isQuality).sort(compareSpecs).map(function getLanguage(priority) {
			return provided[priorities.indexOf(priority)];
		});
	}
	/**
	* Compare two specs.
	* @private
	*/
	function compareSpecs(a, b) {
		return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
	}
	/**
	* Get full language string.
	* @private
	*/
	function getFullLanguage(spec) {
		return spec.full;
	}
	/**
	* Check if a spec has any quality.
	* @private
	*/
	function isQuality(spec) {
		return spec.q > 0;
	}
}));
/**
* negotiator
* Copyright(c) 2012 Isaac Z. Schlueter
* Copyright(c) 2014 Federico Romero
* Copyright(c) 2014-2015 Douglas Christopher Wilson
* MIT Licensed
*/
var require_mediaType = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module exports.
	* @public
	*/
	module.exports = preferredMediaTypes;
	module.exports.preferredMediaTypes = preferredMediaTypes;
	/**
	* Module variables.
	* @private
	*/
	var simpleMediaTypeRegExp = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;
	/**
	* Parse the Accept header.
	* @private
	*/
	function parseAccept(accept) {
		var accepts = splitMediaTypes(accept);
		for (var i = 0, j = 0; i < accepts.length; i++) {
			var mediaType = parseMediaType(accepts[i].trim(), i);
			if (mediaType) accepts[j++] = mediaType;
		}
		accepts.length = j;
		return accepts;
	}
	/**
	* Parse a media type from the Accept header.
	* @private
	*/
	function parseMediaType(str, i) {
		var match = simpleMediaTypeRegExp.exec(str);
		if (!match) return null;
		var params = Object.create(null);
		var q = 1;
		var subtype = match[2];
		var type = match[1];
		if (match[3]) {
			var kvps = splitParameters(match[3]).map(splitKeyValuePair);
			for (var j = 0; j < kvps.length; j++) {
				var pair = kvps[j];
				var key = pair[0].toLowerCase();
				var val = pair[1];
				var value = val && val[0] === "\"" && val[val.length - 1] === "\"" ? val.slice(1, -1) : val;
				if (key === "q") {
					q = parseFloat(value);
					break;
				}
				params[key] = value;
			}
		}
		return {
			type,
			subtype,
			params,
			q,
			i
		};
	}
	/**
	* Get the priority of a media type.
	* @private
	*/
	function getMediaTypePriority(type, accepted, index) {
		var priority = {
			o: -1,
			q: 0,
			s: 0
		};
		for (var i = 0; i < accepted.length; i++) {
			var spec = specify(type, accepted[i], index);
			if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) priority = spec;
		}
		return priority;
	}
	/**
	* Get the specificity of the media type.
	* @private
	*/
	function specify(type, spec, index) {
		var p = parseMediaType(type);
		var s = 0;
		if (!p) return null;
		if (spec.type.toLowerCase() == p.type.toLowerCase()) s |= 4;
		else if (spec.type != "*") return null;
		if (spec.subtype.toLowerCase() == p.subtype.toLowerCase()) s |= 2;
		else if (spec.subtype != "*") return null;
		var keys = Object.keys(spec.params);
		if (keys.length > 0) if (keys.every(function(k) {
			return spec.params[k] == "*" || (spec.params[k] || "").toLowerCase() == (p.params[k] || "").toLowerCase();
		})) s |= 1;
		else return null;
		return {
			i: index,
			o: spec.i,
			q: spec.q,
			s
		};
	}
	/**
	* Get the preferred media types from an Accept header.
	* @public
	*/
	function preferredMediaTypes(accept, provided) {
		var accepts = parseAccept(accept === void 0 ? "*/*" : accept || "");
		if (!provided) return accepts.filter(isQuality).sort(compareSpecs).map(getFullType);
		var priorities = provided.map(function getPriority(type, index) {
			return getMediaTypePriority(type, accepts, index);
		});
		return priorities.filter(isQuality).sort(compareSpecs).map(function getType(priority) {
			return provided[priorities.indexOf(priority)];
		});
	}
	/**
	* Compare two specs.
	* @private
	*/
	function compareSpecs(a, b) {
		return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
	}
	/**
	* Get full type string.
	* @private
	*/
	function getFullType(spec) {
		return spec.type + "/" + spec.subtype;
	}
	/**
	* Check if a spec has any quality.
	* @private
	*/
	function isQuality(spec) {
		return spec.q > 0;
	}
	/**
	* Count the number of quotes in a string.
	* @private
	*/
	function quoteCount(string) {
		var count = 0;
		var index = 0;
		while ((index = string.indexOf("\"", index)) !== -1) {
			count++;
			index++;
		}
		return count;
	}
	/**
	* Split a key value pair.
	* @private
	*/
	function splitKeyValuePair(str) {
		var index = str.indexOf("=");
		var key;
		var val;
		if (index === -1) key = str;
		else {
			key = str.slice(0, index);
			val = str.slice(index + 1);
		}
		return [key, val];
	}
	/**
	* Split an Accept header into media types.
	* @private
	*/
	function splitMediaTypes(accept) {
		var accepts = accept.split(",");
		for (var i = 1, j = 0; i < accepts.length; i++) if (quoteCount(accepts[j]) % 2 == 0) accepts[++j] = accepts[i];
		else accepts[j] += "," + accepts[i];
		accepts.length = j + 1;
		return accepts;
	}
	/**
	* Split a string of parameters.
	* @private
	*/
	function splitParameters(str) {
		var parameters = str.split(";");
		for (var i = 1, j = 0; i < parameters.length; i++) if (quoteCount(parameters[j]) % 2 == 0) parameters[++j] = parameters[i];
		else parameters[j] += ";" + parameters[i];
		parameters.length = j + 1;
		for (var i = 0; i < parameters.length; i++) parameters[i] = parameters[i].trim();
		return parameters;
	}
}));
/*!
* negotiator
* Copyright(c) 2012 Federico Romero
* Copyright(c) 2012-2014 Isaac Z. Schlueter
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*/
var require_negotiator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var preferredCharsets = require_charset();
	var preferredEncodings = require_encoding();
	var preferredLanguages = require_language();
	var preferredMediaTypes = require_mediaType();
	/**
	* Module exports.
	* @public
	*/
	module.exports = Negotiator;
	module.exports.Negotiator = Negotiator;
	/**
	* Create a Negotiator instance from a request.
	* @param {object} request
	* @public
	*/
	function Negotiator(request) {
		if (!(this instanceof Negotiator)) return new Negotiator(request);
		this.request = request;
	}
	Negotiator.prototype.charset = function charset(available) {
		var set = this.charsets(available);
		return set && set[0];
	};
	Negotiator.prototype.charsets = function charsets(available) {
		return preferredCharsets(this.request.headers["accept-charset"], available);
	};
	Negotiator.prototype.encoding = function encoding(available, opts) {
		var set = this.encodings(available, opts);
		return set && set[0];
	};
	Negotiator.prototype.encodings = function encodings(available, options) {
		var opts = options || {};
		return preferredEncodings(this.request.headers["accept-encoding"], available, opts.preferred);
	};
	Negotiator.prototype.language = function language(available) {
		var set = this.languages(available);
		return set && set[0];
	};
	Negotiator.prototype.languages = function languages(available) {
		return preferredLanguages(this.request.headers["accept-language"], available);
	};
	Negotiator.prototype.mediaType = function mediaType(available) {
		var set = this.mediaTypes(available);
		return set && set[0];
	};
	Negotiator.prototype.mediaTypes = function mediaTypes(available) {
		return preferredMediaTypes(this.request.headers.accept, available);
	};
	Negotiator.prototype.preferredCharset = Negotiator.prototype.charset;
	Negotiator.prototype.preferredCharsets = Negotiator.prototype.charsets;
	Negotiator.prototype.preferredEncoding = Negotiator.prototype.encoding;
	Negotiator.prototype.preferredEncodings = Negotiator.prototype.encodings;
	Negotiator.prototype.preferredLanguage = Negotiator.prototype.language;
	Negotiator.prototype.preferredLanguages = Negotiator.prototype.languages;
	Negotiator.prototype.preferredMediaType = Negotiator.prototype.mediaType;
	Negotiator.prototype.preferredMediaTypes = Negotiator.prototype.mediaTypes;
}));
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PathError = exports.TokenData = void 0;
	exports.compile = compile;
	exports.match = match;
	const DEFAULT_DELIMITER = "/";
	const NOOP_VALUE = (value) => value;
	const ID_START = /^[$_\p{ID_Start}]$/u;
	const ID_CONTINUE = /^[$\u200c\u200d\p{ID_Continue}]$/u;
	/**
	* Escape a regular expression string.
	*/
	function escape(str) {
		return str.replace(/[.+*?^${}()[\]|/\\]/g, "\\$&");
	}
	/**
	* Tokenized path instance.
	*/
	var TokenData = class {
		constructor(tokens, originalPath) {
			this.tokens = tokens;
			this.originalPath = originalPath;
		}
	};
	exports.TokenData = TokenData;
	/**
	* ParseError is thrown when there is an error processing the path.
	*/
	var PathError = class extends TypeError {
		constructor(message, originalPath) {
			let text = message;
			if (originalPath) text += `: ${originalPath}`;
			text += `; visit https://git.new/pathToRegexpError for info`;
			super(text);
			this.originalPath = originalPath;
		}
	};
	exports.PathError = PathError;
	/**
	* Parse a string for the raw tokens.
	*/
	function parse(str, options = {}) {
		const { encodePath = NOOP_VALUE } = options;
		const chars = [...str];
		let index = 0;
		function consumeUntil(end) {
			const output = [];
			let path = "";
			function writePath() {
				if (!path) return;
				output.push({
					type: "text",
					value: encodePath(path)
				});
				path = "";
			}
			while (index < chars.length) {
				const value = chars[index++];
				if (value === end) {
					writePath();
					return output;
				}
				if (value === "\\") {
					if (index === chars.length) throw new PathError(`Unexpected end after \\ at index ${index}`, str);
					path += chars[index++];
					continue;
				}
				if (value === ":" || value === "*") {
					const type = value === ":" ? "param" : "wildcard";
					let name = "";
					if (ID_START.test(chars[index])) do
						name += chars[index++];
					while (ID_CONTINUE.test(chars[index]));
					else if (chars[index] === "\"") {
						let quoteStart = index;
						while (index < chars.length) {
							if (chars[++index] === "\"") {
								index++;
								quoteStart = 0;
								break;
							}
							if (chars[index] === "\\") index++;
							name += chars[index];
						}
						if (quoteStart) throw new PathError(`Unterminated quote at index ${quoteStart}`, str);
					}
					if (!name) throw new PathError(`Missing parameter name at index ${index}`, str);
					writePath();
					output.push({
						type,
						name
					});
					continue;
				}
				if (value === "{") {
					writePath();
					output.push({
						type: "group",
						tokens: consumeUntil("}")
					});
					continue;
				}
				if (value === "}" || value === "(" || value === ")" || value === "[" || value === "]" || value === "+" || value === "?" || value === "!") throw new PathError(`Unexpected ${value} at index ${index - 1}`, str);
				path += value;
			}
			if (end) throw new PathError(`Unexpected end at index ${index}, expected ${end}`, str);
			writePath();
			return output;
		}
		return new TokenData(consumeUntil(""), str);
	}
	/**
	* Compile a string to a template function for the path.
	*/
	function compile(path, options = {}) {
		const { encode = encodeURIComponent, delimiter = DEFAULT_DELIMITER } = options;
		const fn = tokensToFunction((typeof path === "object" ? path : parse(path, options)).tokens, delimiter, encode);
		return function path(params = {}) {
			const missing = [];
			const path = fn(params, missing);
			if (missing.length) throw new TypeError(`Missing parameters: ${missing.join(", ")}`);
			return path;
		};
	}
	function tokensToFunction(tokens, delimiter, encode) {
		const encoders = tokens.map((token) => tokenToFunction(token, delimiter, encode));
		return (data, missing) => {
			let result = "";
			for (const encoder of encoders) result += encoder(data, missing);
			return result;
		};
	}
	/**
	* Convert a single token into a path building function.
	*/
	function tokenToFunction(token, delimiter, encode) {
		if (token.type === "text") return () => token.value;
		if (token.type === "group") {
			const fn = tokensToFunction(token.tokens, delimiter, encode);
			return (data, missing) => {
				const len = missing.length;
				const value = fn(data, missing);
				if (missing.length === len) return value;
				missing.length = len;
				return "";
			};
		}
		const encodeValue = encode || NOOP_VALUE;
		if (token.type === "wildcard" && encode !== false) return (data, missing) => {
			const value = data[token.name];
			if (value == null) {
				missing.push(token.name);
				return "";
			}
			if (!Array.isArray(value) || value.length === 0) throw new TypeError(`Expected "${token.name}" to be a non-empty array`);
			let result = "";
			for (let i = 0; i < value.length; i++) {
				if (typeof value[i] !== "string") throw new TypeError(`Expected "${token.name}/${i}" to be a string`);
				if (i > 0) result += delimiter;
				result += encodeValue(value[i]);
			}
			return result;
		};
		return (data, missing) => {
			const value = data[token.name];
			if (value == null) {
				missing.push(token.name);
				return "";
			}
			if (typeof value !== "string") throw new TypeError(`Expected "${token.name}" to be a string`);
			return encodeValue(value);
		};
	}
	/**
	* Transform a path into a match function.
	*/
	function match(path, options = {}) {
		const { decode = decodeURIComponent, delimiter = DEFAULT_DELIMITER } = options;
		const { regexp, keys } = pathToRegexp(path, options);
		const decoders = keys.map((key) => {
			if (decode === false) return NOOP_VALUE;
			if (key.type === "param") return decode;
			return (value) => value.split(delimiter).map(decode);
		});
		return function match(input) {
			const m = regexp.exec(input);
			if (!m) return false;
			const path = m[0];
			const params = Object.create(null);
			for (let i = 1; i < m.length; i++) {
				if (m[i] === void 0) continue;
				const key = keys[i - 1];
				const decoder = decoders[i - 1];
				params[key.name] = decoder(m[i]);
			}
			return {
				path,
				params
			};
		};
	}
	/**
	* Transform a path into a regular expression and capture keys.
	*/
	function pathToRegexp(path, options = {}) {
		const { delimiter = DEFAULT_DELIMITER, end = true, sensitive = false, trailing = true } = options;
		const keys = [];
		let source = "";
		let combinations = 0;
		function process(path) {
			if (Array.isArray(path)) {
				for (const p of path) process(p);
				return;
			}
			const data = typeof path === "object" ? path : parse(path, options);
			flatten(data.tokens, 0, [], (tokens) => {
				if (combinations >= 256) throw new PathError("Too many path combinations", data.originalPath);
				if (combinations > 0) source += "|";
				source += toRegExpSource(tokens, delimiter, keys, data.originalPath);
				combinations++;
			});
		}
		process(path);
		let pattern = `^(?:${source})`;
		if (trailing) pattern += "(?:" + escape(delimiter) + "$)?";
		pattern += end ? "$" : "(?=" + escape(delimiter) + "|$)";
		return {
			regexp: new RegExp(pattern, sensitive ? "" : "i"),
			keys
		};
	}
	/**
	* Generate a flat list of sequence tokens from the given tokens.
	*/
	function flatten(tokens, index, result, callback) {
		while (index < tokens.length) {
			const token = tokens[index++];
			if (token.type === "group") {
				const len = result.length;
				flatten(token.tokens, 0, result, (seq) => flatten(tokens, index, seq, callback));
				result.length = len;
				continue;
			}
			result.push(token);
		}
		callback(result);
	}
	/**
	* Transform a flat sequence of tokens into a regular expression.
	*/
	function toRegExpSource(tokens, delimiter, keys, originalPath) {
		let result = "";
		let backtrack = "";
		let wildcardBacktrack = "";
		let prevCaptureType = 0;
		let hasSegmentCapture = 0;
		let index = 0;
		function hasInSegment(index, type) {
			while (index < tokens.length) {
				const token = tokens[index++];
				if (token.type === type) return true;
				if (token.type === "text") {
					if (token.value.includes(delimiter)) break;
				}
			}
			return false;
		}
		function peekText(index) {
			let result = "";
			while (index < tokens.length) {
				const token = tokens[index++];
				if (token.type !== "text") break;
				result += token.value;
			}
			return result;
		}
		while (index < tokens.length) {
			const token = tokens[index++];
			if (token.type === "text") {
				result += escape(token.value);
				backtrack += token.value;
				if (prevCaptureType === 2) wildcardBacktrack += token.value;
				if (token.value.includes(delimiter)) hasSegmentCapture = 0;
				continue;
			}
			if (token.type === "param" || token.type === "wildcard") {
				if (prevCaptureType && !backtrack) throw new PathError(`Missing text before "${token.name}" ${token.type}`, originalPath);
				if (token.type === "param") {
					result += hasSegmentCapture & 2 ? `(${negate(delimiter, backtrack)}+)` : hasInSegment(index, "wildcard") ? `(${negate(delimiter, peekText(index))}+)` : hasSegmentCapture & 1 ? `(${negate(delimiter, backtrack)}+|${escape(backtrack)})` : `(${negate(delimiter, "")}+)`;
					hasSegmentCapture |= prevCaptureType = 1;
				} else {
					result += hasSegmentCapture & 2 ? `(${negate(backtrack, "")}+)` : wildcardBacktrack ? `(${negate(wildcardBacktrack, "")}+|${negate(delimiter, "")}+)` : `([^]+)`;
					wildcardBacktrack = "";
					hasSegmentCapture |= prevCaptureType = 2;
				}
				keys.push(token);
				backtrack = "";
				continue;
			}
			throw new TypeError(`Unknown token type: ${token.type}`);
		}
		return result;
	}
	/**
	* Block backtracking on previous text/delimiter.
	*/
	function negate(a, b) {
		if (b.length > a.length) return negate(b, a);
		if (a === b) b = "";
		if (b.length > 1) return `(?:(?!${escape(a)}|${escape(b)})[^])`;
		if (a.length > 1) return `(?:(?!${escape(a)})[^${escape(b)}])`;
		return `[^${escape(a + b)}]`;
	}
}));
var import_negotiator = /* @__PURE__ */ __toESM(require_negotiator(), 1);
require_dist();
function getNegotiator(request) {
	const headers = {};
	request.headers.forEach((value, key) => {
		headers[key] = value;
	});
	return new import_negotiator.default({ headers });
}
function isMarkdownPreferred(request, options) {
	const { markdownMediaTypes = [
		"text/plain",
		"text/markdown",
		"text/x-markdown"
	] } = options ?? {};
	const mediaTypes = getNegotiator(request).mediaTypes();
	return markdownMediaTypes.some((type) => mediaTypes.includes(type));
}
//#endregion
//#region node_modules/fumapress/dist/plugins/llms.txt.js
function llmsPlugin(options = {}) {
	let basePath = "/";
	const { autoRedirect = true, getLLMText: _getLLMText = async function getLLMTextDefault(page) {
		for (const adapter of this.adapters) {
			const txt = await adapter["core:get-text"]?.call(this, page);
			if (txt !== void 0) return `# ${page.data.title} (${page.url})\n\n${txt}`;
		}
	} } = options;
	function markdownPathToSlugs(segs) {
		if (segs.length === 0) return segs;
		const slugs = [...segs];
		slugs[slugs.length - 1] = slugs[slugs.length - 1].replace(/\.md$/, "");
		if (slugs.length === 1 && slugs[0] === "index") slugs.pop();
		return slugs;
	}
	function slugsToMarkdownPath(slugs, lang) {
		const segments = [...slugs];
		if (segments.length === 0) segments.push("index.md");
		else segments[segments.length - 1] += ".md";
		return {
			staticPath: lang ? [lang, ...segments] : segments,
			pathname: joinPathname(lang ?? "", basePath, ...segments)
		};
	}
	function initRenderers(data) {
		data.renderers ??= [];
		data.renderers.push(function(res) {
			res.markdownUrl ??= slugsToMarkdownPath(this.page.slugs, this.page.locale).pathname;
			return res;
		});
	}
	return {
		name: "core:llms.txt",
		init() {
			if (this.mode === "dynamic") basePath = "/_llms.txt";
			initRenderers(this.data["core:docs-layout"] ??= {});
			initRenderers(this.data["core:notebook-layout"] ??= {});
		},
		createMiddlewares({ app }) {
			if (this.mode === "static") return;
			const middlewares = [];
			const parsePathname = (pathname) => {
				const slugs = pathname.split("/").filter((v) => v.length > 0);
				if (this.i18nConfig) return slugs.length > 0 ? {
					lang: slugs.shift(),
					slugs
				} : void 0;
				return { slugs };
			};
			if (autoRedirect) middlewares.push(async ({ req }, next) => {
				if (req.path.endsWith(".md") || !isMarkdownPreferred(req.raw)) return next();
				const parsed = parsePathname(req.path);
				if (!parsed) return next();
				const { lang, slugs } = parsed;
				const url = new URL(slugsToMarkdownPath(slugs, lang).pathname, req.url);
				const res = await app.fetch(new Request(url));
				if (!res.ok) return next();
				return res;
			});
			if (this.mode === "dynamic") middlewares.push(async ({ req }, next) => {
				if (!req.path.endsWith(".md")) return next();
				const parsed = parsePathname(req.path);
				if (!parsed || parsed.slugs[0] === "_llms.txt") return next();
				const { lang, slugs } = parsed;
				slugs[slugs.length - 1] = slugs[slugs.length - 1].replace(/\.md$/, "");
				const url = new URL(slugsToMarkdownPath(slugs, lang).pathname, req.url);
				const res = await app.fetch(new Request(url));
				if (!res.ok) return next();
				return res;
			});
			return middlewares;
		},
		async createPages({ createApiIsomorphic }) {
			const renderMode = this.mode === "default" ? "static" : this.mode;
			const getLLMText = _getLLMText.bind(this);
			createApiIsomorphic({
				render: renderMode,
				path: "/llms.txt",
				handler: async () => {
					const source = await this.getLoader();
					return new Response(llms(source).index());
				}
			});
			createApiIsomorphic({
				render: renderMode,
				path: "/llms-full.txt",
				handler: async () => {
					const source = await this.getLoader();
					const scanned = await Promise.all(source.getPages().map(getLLMText));
					return new Response(scanned.filter((item) => item !== void 0).join("\n\n"));
				}
			});
			createApiIsomorphic({
				render: renderMode,
				path: joinPathname(this.i18nConfig ? "[lang]" : "", basePath, "[...slugs]"),
				staticPaths: (await this.getLoader()).getPages().map((page) => slugsToMarkdownPath(page.slugs, page.locale).staticPath),
				handler: async (_req, { params }) => {
					const page = (await this.getLoader()).getPage(markdownPathToSlugs(params.slugs), params.lang);
					if (!page) unstable_notFound();
					const txt = await getLLMText(page);
					return new Response(txt ?? "", { headers: { "Content-Type": "text/markdown" } });
				}
			});
		}
	};
}
//#endregion
//#region node_modules/sax/lib/sax.js
var require_sax = /* @__PURE__ */ __commonJSMin$1(((exports) => {
	(function(sax) {
		sax.parser = function(strict, opt) {
			return new SAXParser(strict, opt);
		};
		sax.SAXParser = SAXParser;
		sax.SAXStream = SAXStream;
		sax.createStream = createStream;
		sax.MAX_BUFFER_LENGTH = 64 * 1024;
		var buffers = [
			"comment",
			"sgmlDecl",
			"textNode",
			"tagName",
			"doctype",
			"procInstName",
			"procInstBody",
			"entity",
			"attribName",
			"attribValue",
			"cdata",
			"script"
		];
		sax.EVENTS = [
			"text",
			"processinginstruction",
			"sgmldeclaration",
			"doctype",
			"comment",
			"opentagstart",
			"attribute",
			"opentag",
			"closetag",
			"opencdata",
			"cdata",
			"closecdata",
			"error",
			"end",
			"ready",
			"script",
			"opennamespace",
			"closenamespace"
		];
		function SAXParser(strict, opt) {
			if (!(this instanceof SAXParser)) return new SAXParser(strict, opt);
			var parser = this;
			clearBuffers(parser);
			parser.q = parser.c = "";
			parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
			parser.encoding = null;
			parser.opt = opt || {};
			parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
			parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
			parser.opt.maxEntityCount = parser.opt.maxEntityCount || 512;
			parser.opt.maxEntityDepth = parser.opt.maxEntityDepth || 4;
			parser.entityCount = parser.entityDepth = 0;
			parser.tags = [];
			parser.closed = parser.closedRoot = parser.sawRoot = false;
			parser.tag = parser.error = null;
			parser.strict = !!strict;
			parser.noscript = !!(strict || parser.opt.noscript);
			parser.state = S.BEGIN;
			parser.strictEntities = parser.opt.strictEntities;
			parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
			parser.attribList = [];
			if (parser.opt.xmlns) parser.ns = Object.create(rootNS);
			if (parser.opt.unquotedAttributeValues === void 0) parser.opt.unquotedAttributeValues = !strict;
			parser.trackPosition = parser.opt.position !== false;
			if (parser.trackPosition) parser.position = parser.line = parser.column = 0;
			emit(parser, "onready");
		}
		if (!Object.create) Object.create = function(o) {
			function F() {}
			F.prototype = o;
			return new F();
		};
		if (!Object.keys) Object.keys = function(o) {
			var a = [];
			for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
			return a;
		};
		function checkBufferLength(parser) {
			var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
			var maxActual = 0;
			for (var i = 0, l = buffers.length; i < l; i++) {
				var len = parser[buffers[i]].length;
				if (len > maxAllowed) switch (buffers[i]) {
					case "textNode":
						closeText(parser);
						break;
					case "cdata":
						emitNode(parser, "oncdata", parser.cdata);
						parser.cdata = "";
						break;
					case "script":
						emitNode(parser, "onscript", parser.script);
						parser.script = "";
						break;
					default: error(parser, "Max buffer length exceeded: " + buffers[i]);
				}
				maxActual = Math.max(maxActual, len);
			}
			parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH - maxActual + parser.position;
		}
		function clearBuffers(parser) {
			for (var i = 0, l = buffers.length; i < l; i++) parser[buffers[i]] = "";
		}
		function flushBuffers(parser) {
			closeText(parser);
			if (parser.cdata !== "") {
				emitNode(parser, "oncdata", parser.cdata);
				parser.cdata = "";
			}
			if (parser.script !== "") {
				emitNode(parser, "onscript", parser.script);
				parser.script = "";
			}
		}
		SAXParser.prototype = {
			end: function() {
				end(this);
			},
			write,
			resume: function() {
				this.error = null;
				return this;
			},
			close: function() {
				return this.write(null);
			},
			flush: function() {
				flushBuffers(this);
			}
		};
		var Stream;
		try {
			Stream = __require("stream").Stream;
		} catch (ex) {
			Stream = function() {};
		}
		if (!Stream) Stream = function() {};
		var streamWraps = sax.EVENTS.filter(function(ev) {
			return ev !== "error" && ev !== "end";
		});
		function createStream(strict, opt) {
			return new SAXStream(strict, opt);
		}
		function determineBufferEncoding(data, isEnd) {
			if (data.length >= 2) {
				if (data[0] === 255 && data[1] === 254) return "utf-16le";
				if (data[0] === 254 && data[1] === 255) return "utf-16be";
			}
			if (data.length >= 3 && data[0] === 239 && data[1] === 187 && data[2] === 191) return "utf8";
			if (data.length >= 4) {
				if (data[0] === 60 && data[1] === 0 && data[2] === 63 && data[3] === 0) return "utf-16le";
				if (data[0] === 0 && data[1] === 60 && data[2] === 0 && data[3] === 63) return "utf-16be";
				return "utf8";
			}
			return isEnd ? "utf8" : null;
		}
		function SAXStream(strict, opt) {
			if (!(this instanceof SAXStream)) return new SAXStream(strict, opt);
			Stream.apply(this);
			this._parser = new SAXParser(strict, opt);
			this.writable = true;
			this.readable = true;
			var me = this;
			this._parser.onend = function() {
				me.emit("end");
			};
			this._parser.onerror = function(er) {
				me.emit("error", er);
				me._parser.error = null;
			};
			this._decoder = null;
			this._decoderBuffer = null;
			streamWraps.forEach(function(ev) {
				Object.defineProperty(me, "on" + ev, {
					get: function() {
						return me._parser["on" + ev];
					},
					set: function(h) {
						if (!h) {
							me.removeAllListeners(ev);
							me._parser["on" + ev] = h;
							return h;
						}
						me.on(ev, h);
					},
					enumerable: true,
					configurable: false
				});
			});
		}
		SAXStream.prototype = Object.create(Stream.prototype, { constructor: { value: SAXStream } });
		SAXStream.prototype._decodeBuffer = function(data, isEnd) {
			if (this._decoderBuffer) {
				data = Buffer.concat([this._decoderBuffer, data]);
				this._decoderBuffer = null;
			}
			if (!this._decoder) {
				var encoding = determineBufferEncoding(data, isEnd);
				if (!encoding) {
					this._decoderBuffer = data;
					return "";
				}
				this._parser.encoding = encoding;
				this._decoder = new TextDecoder(encoding);
			}
			return this._decoder.decode(data, { stream: !isEnd });
		};
		SAXStream.prototype.write = function(data) {
			if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) data = this._decodeBuffer(data, false);
			else if (this._decoderBuffer) {
				var remaining = this._decodeBuffer(Buffer.alloc(0), true);
				if (remaining) {
					this._parser.write(remaining);
					this.emit("data", remaining);
				}
			}
			this._parser.write(data.toString());
			this.emit("data", data);
			return true;
		};
		SAXStream.prototype.end = function(chunk) {
			if (chunk && chunk.length) this.write(chunk);
			if (this._decoderBuffer) {
				var finalChunk = this._decodeBuffer(Buffer.alloc(0), true);
				if (finalChunk) {
					this._parser.write(finalChunk);
					this.emit("data", finalChunk);
				}
			} else if (this._decoder) {
				var remaining = this._decoder.decode();
				if (remaining) {
					this._parser.write(remaining);
					this.emit("data", remaining);
				}
			}
			this._parser.end();
			return true;
		};
		SAXStream.prototype.on = function(ev, handler) {
			var me = this;
			if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) me._parser["on" + ev] = function() {
				var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
				args.splice(0, 0, ev);
				me.emit.apply(me, args);
			};
			return Stream.prototype.on.call(me, ev, handler);
		};
		var CDATA = "[CDATA[";
		var DOCTYPE = "DOCTYPE";
		var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
		var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
		var rootNS = {
			xml: XML_NAMESPACE,
			xmlns: XMLNS_NAMESPACE
		};
		var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
		var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
		var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
		var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
		function isWhitespace(c) {
			return c === " " || c === "\n" || c === "\r" || c === "	";
		}
		function isQuote(c) {
			return c === "\"" || c === "'";
		}
		function isAttribEnd(c) {
			return c === ">" || isWhitespace(c);
		}
		function isMatch(regex, c) {
			return regex.test(c);
		}
		function notMatch(regex, c) {
			return !isMatch(regex, c);
		}
		var S = 0;
		sax.STATE = {
			BEGIN: S++,
			BEGIN_WHITESPACE: S++,
			TEXT: S++,
			TEXT_ENTITY: S++,
			OPEN_WAKA: S++,
			SGML_DECL: S++,
			SGML_DECL_QUOTED: S++,
			DOCTYPE: S++,
			DOCTYPE_QUOTED: S++,
			DOCTYPE_DTD: S++,
			DOCTYPE_DTD_QUOTED: S++,
			COMMENT_STARTING: S++,
			COMMENT: S++,
			COMMENT_ENDING: S++,
			COMMENT_ENDED: S++,
			CDATA: S++,
			CDATA_ENDING: S++,
			CDATA_ENDING_2: S++,
			PROC_INST: S++,
			PROC_INST_BODY: S++,
			PROC_INST_ENDING: S++,
			OPEN_TAG: S++,
			OPEN_TAG_SLASH: S++,
			ATTRIB: S++,
			ATTRIB_NAME: S++,
			ATTRIB_NAME_SAW_WHITE: S++,
			ATTRIB_VALUE: S++,
			ATTRIB_VALUE_QUOTED: S++,
			ATTRIB_VALUE_CLOSED: S++,
			ATTRIB_VALUE_UNQUOTED: S++,
			ATTRIB_VALUE_ENTITY_Q: S++,
			ATTRIB_VALUE_ENTITY_U: S++,
			CLOSE_TAG: S++,
			CLOSE_TAG_SAW_WHITE: S++,
			SCRIPT: S++,
			SCRIPT_ENDING: S++
		};
		sax.XML_ENTITIES = {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'"
		};
		sax.ENTITIES = {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'",
			AElig: 198,
			Aacute: 193,
			Acirc: 194,
			Agrave: 192,
			Aring: 197,
			Atilde: 195,
			Auml: 196,
			Ccedil: 199,
			ETH: 208,
			Eacute: 201,
			Ecirc: 202,
			Egrave: 200,
			Euml: 203,
			Iacute: 205,
			Icirc: 206,
			Igrave: 204,
			Iuml: 207,
			Ntilde: 209,
			Oacute: 211,
			Ocirc: 212,
			Ograve: 210,
			Oslash: 216,
			Otilde: 213,
			Ouml: 214,
			THORN: 222,
			Uacute: 218,
			Ucirc: 219,
			Ugrave: 217,
			Uuml: 220,
			Yacute: 221,
			aacute: 225,
			acirc: 226,
			aelig: 230,
			agrave: 224,
			aring: 229,
			atilde: 227,
			auml: 228,
			ccedil: 231,
			eacute: 233,
			ecirc: 234,
			egrave: 232,
			eth: 240,
			euml: 235,
			iacute: 237,
			icirc: 238,
			igrave: 236,
			iuml: 239,
			ntilde: 241,
			oacute: 243,
			ocirc: 244,
			ograve: 242,
			oslash: 248,
			otilde: 245,
			ouml: 246,
			szlig: 223,
			thorn: 254,
			uacute: 250,
			ucirc: 251,
			ugrave: 249,
			uuml: 252,
			yacute: 253,
			yuml: 255,
			copy: 169,
			reg: 174,
			nbsp: 160,
			iexcl: 161,
			cent: 162,
			pound: 163,
			curren: 164,
			yen: 165,
			brvbar: 166,
			sect: 167,
			uml: 168,
			ordf: 170,
			laquo: 171,
			not: 172,
			shy: 173,
			macr: 175,
			deg: 176,
			plusmn: 177,
			sup1: 185,
			sup2: 178,
			sup3: 179,
			acute: 180,
			micro: 181,
			para: 182,
			middot: 183,
			cedil: 184,
			ordm: 186,
			raquo: 187,
			frac14: 188,
			frac12: 189,
			frac34: 190,
			iquest: 191,
			times: 215,
			divide: 247,
			OElig: 338,
			oelig: 339,
			Scaron: 352,
			scaron: 353,
			Yuml: 376,
			fnof: 402,
			circ: 710,
			tilde: 732,
			Alpha: 913,
			Beta: 914,
			Gamma: 915,
			Delta: 916,
			Epsilon: 917,
			Zeta: 918,
			Eta: 919,
			Theta: 920,
			Iota: 921,
			Kappa: 922,
			Lambda: 923,
			Mu: 924,
			Nu: 925,
			Xi: 926,
			Omicron: 927,
			Pi: 928,
			Rho: 929,
			Sigma: 931,
			Tau: 932,
			Upsilon: 933,
			Phi: 934,
			Chi: 935,
			Psi: 936,
			Omega: 937,
			alpha: 945,
			beta: 946,
			gamma: 947,
			delta: 948,
			epsilon: 949,
			zeta: 950,
			eta: 951,
			theta: 952,
			iota: 953,
			kappa: 954,
			lambda: 955,
			mu: 956,
			nu: 957,
			xi: 958,
			omicron: 959,
			pi: 960,
			rho: 961,
			sigmaf: 962,
			sigma: 963,
			tau: 964,
			upsilon: 965,
			phi: 966,
			chi: 967,
			psi: 968,
			omega: 969,
			thetasym: 977,
			upsih: 978,
			piv: 982,
			ensp: 8194,
			emsp: 8195,
			thinsp: 8201,
			zwnj: 8204,
			zwj: 8205,
			lrm: 8206,
			rlm: 8207,
			ndash: 8211,
			mdash: 8212,
			lsquo: 8216,
			rsquo: 8217,
			sbquo: 8218,
			ldquo: 8220,
			rdquo: 8221,
			bdquo: 8222,
			dagger: 8224,
			Dagger: 8225,
			bull: 8226,
			hellip: 8230,
			permil: 8240,
			prime: 8242,
			Prime: 8243,
			lsaquo: 8249,
			rsaquo: 8250,
			oline: 8254,
			frasl: 8260,
			euro: 8364,
			image: 8465,
			weierp: 8472,
			real: 8476,
			trade: 8482,
			alefsym: 8501,
			larr: 8592,
			uarr: 8593,
			rarr: 8594,
			darr: 8595,
			harr: 8596,
			crarr: 8629,
			lArr: 8656,
			uArr: 8657,
			rArr: 8658,
			dArr: 8659,
			hArr: 8660,
			forall: 8704,
			part: 8706,
			exist: 8707,
			empty: 8709,
			nabla: 8711,
			isin: 8712,
			notin: 8713,
			ni: 8715,
			prod: 8719,
			sum: 8721,
			minus: 8722,
			lowast: 8727,
			radic: 8730,
			prop: 8733,
			infin: 8734,
			ang: 8736,
			and: 8743,
			or: 8744,
			cap: 8745,
			cup: 8746,
			int: 8747,
			there4: 8756,
			sim: 8764,
			cong: 8773,
			asymp: 8776,
			ne: 8800,
			equiv: 8801,
			le: 8804,
			ge: 8805,
			sub: 8834,
			sup: 8835,
			nsub: 8836,
			sube: 8838,
			supe: 8839,
			oplus: 8853,
			otimes: 8855,
			perp: 8869,
			sdot: 8901,
			lceil: 8968,
			rceil: 8969,
			lfloor: 8970,
			rfloor: 8971,
			lang: 9001,
			rang: 9002,
			loz: 9674,
			spades: 9824,
			clubs: 9827,
			hearts: 9829,
			diams: 9830
		};
		Object.keys(sax.ENTITIES).forEach(function(key) {
			var e = sax.ENTITIES[key];
			var s = typeof e === "number" ? String.fromCharCode(e) : e;
			sax.ENTITIES[key] = s;
		});
		for (var s in sax.STATE) sax.STATE[sax.STATE[s]] = s;
		S = sax.STATE;
		function emit(parser, event, data) {
			parser[event] && parser[event](data);
		}
		function getDeclaredEncoding(body) {
			var match = body && body.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
			return match ? match[2] : null;
		}
		function normalizeEncodingName(encoding) {
			if (!encoding) return null;
			return encoding.toLowerCase().replace(/[^a-z0-9]/g, "");
		}
		function encodingsMatch(detectedEncoding, declaredEncoding) {
			const detected = normalizeEncodingName(detectedEncoding);
			const declared = normalizeEncodingName(declaredEncoding);
			if (!detected || !declared) return true;
			if (declared === "utf16") return detected === "utf16le" || detected === "utf16be";
			return detected === declared;
		}
		function validateXmlDeclarationEncoding(parser, data) {
			if (!parser.strict || !parser.encoding || !data || data.name !== "xml") return;
			var declaredEncoding = getDeclaredEncoding(data.body);
			if (declaredEncoding && !encodingsMatch(parser.encoding, declaredEncoding)) strictFail(parser, "XML declaration encoding " + declaredEncoding + " does not match detected stream encoding " + parser.encoding.toUpperCase());
		}
		function emitNode(parser, nodeType, data) {
			if (parser.textNode) closeText(parser);
			emit(parser, nodeType, data);
		}
		function closeText(parser) {
			parser.textNode = textopts(parser.opt, parser.textNode);
			if (parser.textNode) emit(parser, "ontext", parser.textNode);
			parser.textNode = "";
		}
		function textopts(opt, text) {
			if (opt.trim) text = text.trim();
			if (opt.normalize) text = text.replace(/\s+/g, " ");
			return text;
		}
		function error(parser, er) {
			closeText(parser);
			if (parser.trackPosition) er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
			er = new Error(er);
			parser.error = er;
			emit(parser, "onerror", er);
			return parser;
		}
		function end(parser) {
			if (parser.sawRoot && !parser.closedRoot) strictFail(parser, "Unclosed root tag");
			if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) error(parser, "Unexpected end");
			closeText(parser);
			parser.c = "";
			parser.closed = true;
			emit(parser, "onend");
			SAXParser.call(parser, parser.strict, parser.opt);
			return parser;
		}
		function strictFail(parser, message) {
			if (typeof parser !== "object" || !(parser instanceof SAXParser)) throw new Error("bad call to strictFail");
			if (parser.strict) error(parser, message);
		}
		function newTag(parser) {
			if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
			var parent = parser.tags[parser.tags.length - 1] || parser;
			var tag = parser.tag = {
				name: parser.tagName,
				attributes: {}
			};
			if (parser.opt.xmlns) tag.ns = parent.ns;
			parser.attribList.length = 0;
			emitNode(parser, "onopentagstart", tag);
		}
		function qname(name, attribute) {
			var qualName = name.indexOf(":") < 0 ? ["", name] : name.split(":");
			var prefix = qualName[0];
			var local = qualName[1];
			if (attribute && name === "xmlns") {
				prefix = "xmlns";
				local = "";
			}
			return {
				prefix,
				local
			};
		}
		function attrib(parser) {
			if (!parser.strict) parser.attribName = parser.attribName[parser.looseCase]();
			if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
				parser.attribName = parser.attribValue = "";
				return;
			}
			if (parser.opt.xmlns) {
				var qn = qname(parser.attribName, true);
				var prefix = qn.prefix;
				var local = qn.local;
				if (prefix === "xmlns") if (local === "xml" && parser.attribValue !== XML_NAMESPACE) strictFail(parser, "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue);
				else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) strictFail(parser, "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue);
				else {
					var tag = parser.tag;
					var parent = parser.tags[parser.tags.length - 1] || parser;
					if (tag.ns === parent.ns) tag.ns = Object.create(parent.ns);
					tag.ns[local] = parser.attribValue;
				}
				parser.attribList.push([parser.attribName, parser.attribValue]);
			} else {
				parser.tag.attributes[parser.attribName] = parser.attribValue;
				emitNode(parser, "onattribute", {
					name: parser.attribName,
					value: parser.attribValue
				});
			}
			parser.attribName = parser.attribValue = "";
		}
		function openTag(parser, selfClosing) {
			if (parser.opt.xmlns) {
				var tag = parser.tag;
				var qn = qname(parser.tagName);
				tag.prefix = qn.prefix;
				tag.local = qn.local;
				tag.uri = tag.ns[qn.prefix] || "";
				if (tag.prefix && !tag.uri) {
					strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
					tag.uri = qn.prefix;
				}
				var parent = parser.tags[parser.tags.length - 1] || parser;
				if (tag.ns && parent.ns !== tag.ns) Object.keys(tag.ns).forEach(function(p) {
					emitNode(parser, "onopennamespace", {
						prefix: p,
						uri: tag.ns[p]
					});
				});
				for (var i = 0, l = parser.attribList.length; i < l; i++) {
					var nv = parser.attribList[i];
					var name = nv[0];
					var value = nv[1];
					var qualName = qname(name, true);
					var prefix = qualName.prefix;
					var local = qualName.local;
					var uri = prefix === "" ? "" : tag.ns[prefix] || "";
					var a = {
						name,
						value,
						prefix,
						local,
						uri
					};
					if (prefix && prefix !== "xmlns" && !uri) {
						strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
						a.uri = prefix;
					}
					parser.tag.attributes[name] = a;
					emitNode(parser, "onattribute", a);
				}
				parser.attribList.length = 0;
			}
			parser.tag.isSelfClosing = !!selfClosing;
			parser.sawRoot = true;
			parser.tags.push(parser.tag);
			emitNode(parser, "onopentag", parser.tag);
			if (!selfClosing) {
				if (!parser.noscript && parser.tagName.toLowerCase() === "script") parser.state = S.SCRIPT;
				else parser.state = S.TEXT;
				parser.tag = null;
				parser.tagName = "";
			}
			parser.attribName = parser.attribValue = "";
			parser.attribList.length = 0;
		}
		function closeTag(parser) {
			if (!parser.tagName) {
				strictFail(parser, "Weird empty close tag.");
				parser.textNode += "</>";
				parser.state = S.TEXT;
				return;
			}
			if (parser.script) {
				if (parser.tagName !== "script") {
					parser.script += "</" + parser.tagName + ">";
					parser.tagName = "";
					parser.state = S.SCRIPT;
					return;
				}
				emitNode(parser, "onscript", parser.script);
				parser.script = "";
			}
			var t = parser.tags.length;
			var tagName = parser.tagName;
			if (!parser.strict) tagName = tagName[parser.looseCase]();
			var closeTo = tagName;
			while (t--) if (parser.tags[t].name !== closeTo) strictFail(parser, "Unexpected close tag");
			else break;
			if (t < 0) {
				strictFail(parser, "Unmatched closing tag: " + parser.tagName);
				parser.textNode += "</" + parser.tagName + ">";
				parser.state = S.TEXT;
				return;
			}
			parser.tagName = tagName;
			var s = parser.tags.length;
			while (s-- > t) {
				var tag = parser.tag = parser.tags.pop();
				parser.tagName = parser.tag.name;
				emitNode(parser, "onclosetag", parser.tagName);
				var x = {};
				for (var i in tag.ns) x[i] = tag.ns[i];
				var parent = parser.tags[parser.tags.length - 1] || parser;
				if (parser.opt.xmlns && tag.ns !== parent.ns) Object.keys(tag.ns).forEach(function(p) {
					var n = tag.ns[p];
					emitNode(parser, "onclosenamespace", {
						prefix: p,
						uri: n
					});
				});
			}
			if (t === 0) parser.closedRoot = true;
			parser.tagName = parser.attribValue = parser.attribName = "";
			parser.attribList.length = 0;
			parser.state = S.TEXT;
		}
		function parseEntity(parser) {
			var entity = parser.entity;
			var entityLC = entity.toLowerCase();
			var num;
			var numStr = "";
			if (parser.ENTITIES[entity]) return parser.ENTITIES[entity];
			if (parser.ENTITIES[entityLC]) return parser.ENTITIES[entityLC];
			entity = entityLC;
			if (entity.charAt(0) === "#") if (entity.charAt(1) === "x") {
				entity = entity.slice(2);
				num = parseInt(entity, 16);
				numStr = num.toString(16);
			} else {
				entity = entity.slice(1);
				num = parseInt(entity, 10);
				numStr = num.toString(10);
			}
			entity = entity.replace(/^0+/, "");
			if (isNaN(num) || numStr.toLowerCase() !== entity || num < 0 || num > 1114111) {
				strictFail(parser, "Invalid character entity");
				return "&" + parser.entity + ";";
			}
			return String.fromCodePoint(num);
		}
		function beginWhiteSpace(parser, c) {
			if (c === "<") {
				parser.state = S.OPEN_WAKA;
				parser.startTagPosition = parser.position;
			} else if (!isWhitespace(c)) {
				strictFail(parser, "Non-whitespace before first tag.");
				parser.textNode = c;
				parser.state = S.TEXT;
			}
		}
		function charAt(chunk, i) {
			var result = "";
			if (i < chunk.length) result = chunk.charAt(i);
			return result;
		}
		function write(chunk) {
			var parser = this;
			if (this.error) throw this.error;
			if (parser.closed) return error(parser, "Cannot write after close. Assign an onready handler.");
			if (chunk === null) return end(parser);
			if (typeof chunk === "object") chunk = chunk.toString();
			var i = 0;
			var c = "";
			while (true) {
				c = charAt(chunk, i++);
				parser.c = c;
				if (!c) break;
				if (parser.trackPosition) {
					parser.position++;
					if (c === "\n") {
						parser.line++;
						parser.column = 0;
					} else parser.column++;
				}
				switch (parser.state) {
					case S.BEGIN:
						parser.state = S.BEGIN_WHITESPACE;
						if (c === "﻿") continue;
						beginWhiteSpace(parser, c);
						continue;
					case S.BEGIN_WHITESPACE:
						beginWhiteSpace(parser, c);
						continue;
					case S.TEXT:
						if (parser.sawRoot && !parser.closedRoot) {
							var starti = i - 1;
							while (c && c !== "<" && c !== "&") {
								c = charAt(chunk, i++);
								if (c && parser.trackPosition) {
									parser.position++;
									if (c === "\n") {
										parser.line++;
										parser.column = 0;
									} else parser.column++;
								}
							}
							parser.textNode += chunk.substring(starti, i - 1);
						}
						if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
							parser.state = S.OPEN_WAKA;
							parser.startTagPosition = parser.position;
						} else {
							if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) strictFail(parser, "Text data outside of root node.");
							if (c === "&") parser.state = S.TEXT_ENTITY;
							else parser.textNode += c;
						}
						continue;
					case S.SCRIPT:
						if (c === "<") parser.state = S.SCRIPT_ENDING;
						else parser.script += c;
						continue;
					case S.SCRIPT_ENDING:
						if (c === "/") parser.state = S.CLOSE_TAG;
						else {
							parser.script += "<" + c;
							parser.state = S.SCRIPT;
						}
						continue;
					case S.OPEN_WAKA:
						if (c === "!") {
							parser.state = S.SGML_DECL;
							parser.sgmlDecl = "";
						} else if (isWhitespace(c)) {} else if (isMatch(nameStart, c)) {
							parser.state = S.OPEN_TAG;
							parser.tagName = c;
						} else if (c === "/") {
							parser.state = S.CLOSE_TAG;
							parser.tagName = "";
						} else if (c === "?") {
							parser.state = S.PROC_INST;
							parser.procInstName = parser.procInstBody = "";
						} else {
							strictFail(parser, "Unencoded <");
							if (parser.startTagPosition + 1 < parser.position) {
								var pad = parser.position - parser.startTagPosition;
								c = new Array(pad).join(" ") + c;
							}
							parser.textNode += "<" + c;
							parser.state = S.TEXT;
						}
						continue;
					case S.SGML_DECL:
						if (parser.sgmlDecl + c === "--") {
							parser.state = S.COMMENT;
							parser.comment = "";
							parser.sgmlDecl = "";
							continue;
						}
						if (parser.doctype && parser.doctype !== true && parser.sgmlDecl) {
							parser.state = S.DOCTYPE_DTD;
							parser.doctype += "<!" + parser.sgmlDecl + c;
							parser.sgmlDecl = "";
						} else if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
							emitNode(parser, "onopencdata");
							parser.state = S.CDATA;
							parser.sgmlDecl = "";
							parser.cdata = "";
						} else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
							parser.state = S.DOCTYPE;
							if (parser.doctype || parser.sawRoot) strictFail(parser, "Inappropriately located doctype declaration");
							parser.doctype = "";
							parser.sgmlDecl = "";
						} else if (c === ">") {
							emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
							parser.sgmlDecl = "";
							parser.state = S.TEXT;
						} else if (isQuote(c)) {
							parser.state = S.SGML_DECL_QUOTED;
							parser.sgmlDecl += c;
						} else parser.sgmlDecl += c;
						continue;
					case S.SGML_DECL_QUOTED:
						if (c === parser.q) {
							parser.state = S.SGML_DECL;
							parser.q = "";
						}
						parser.sgmlDecl += c;
						continue;
					case S.DOCTYPE:
						if (c === ">") {
							parser.state = S.TEXT;
							emitNode(parser, "ondoctype", parser.doctype);
							parser.doctype = true;
						} else {
							parser.doctype += c;
							if (c === "[") parser.state = S.DOCTYPE_DTD;
							else if (isQuote(c)) {
								parser.state = S.DOCTYPE_QUOTED;
								parser.q = c;
							}
						}
						continue;
					case S.DOCTYPE_QUOTED:
						parser.doctype += c;
						if (c === parser.q) {
							parser.q = "";
							parser.state = S.DOCTYPE;
						}
						continue;
					case S.DOCTYPE_DTD:
						if (c === "]") {
							parser.doctype += c;
							parser.state = S.DOCTYPE;
						} else if (c === "<") {
							parser.state = S.OPEN_WAKA;
							parser.startTagPosition = parser.position;
						} else if (isQuote(c)) {
							parser.doctype += c;
							parser.state = S.DOCTYPE_DTD_QUOTED;
							parser.q = c;
						} else parser.doctype += c;
						continue;
					case S.DOCTYPE_DTD_QUOTED:
						parser.doctype += c;
						if (c === parser.q) {
							parser.state = S.DOCTYPE_DTD;
							parser.q = "";
						}
						continue;
					case S.COMMENT:
						if (c === "-") parser.state = S.COMMENT_ENDING;
						else parser.comment += c;
						continue;
					case S.COMMENT_ENDING:
						if (c === "-") {
							parser.state = S.COMMENT_ENDED;
							parser.comment = textopts(parser.opt, parser.comment);
							if (parser.comment) emitNode(parser, "oncomment", parser.comment);
							parser.comment = "";
						} else {
							parser.comment += "-" + c;
							parser.state = S.COMMENT;
						}
						continue;
					case S.COMMENT_ENDED:
						if (c !== ">") {
							strictFail(parser, "Malformed comment");
							parser.comment += "--" + c;
							parser.state = S.COMMENT;
						} else if (parser.doctype && parser.doctype !== true) parser.state = S.DOCTYPE_DTD;
						else parser.state = S.TEXT;
						continue;
					case S.CDATA:
						var starti = i - 1;
						while (c && c !== "]") {
							c = charAt(chunk, i++);
							if (c && parser.trackPosition) {
								parser.position++;
								if (c === "\n") {
									parser.line++;
									parser.column = 0;
								} else parser.column++;
							}
						}
						parser.cdata += chunk.substring(starti, i - 1);
						if (c === "]") parser.state = S.CDATA_ENDING;
						continue;
					case S.CDATA_ENDING:
						if (c === "]") parser.state = S.CDATA_ENDING_2;
						else {
							parser.cdata += "]" + c;
							parser.state = S.CDATA;
						}
						continue;
					case S.CDATA_ENDING_2:
						if (c === ">") {
							if (parser.cdata) emitNode(parser, "oncdata", parser.cdata);
							emitNode(parser, "onclosecdata");
							parser.cdata = "";
							parser.state = S.TEXT;
						} else if (c === "]") parser.cdata += "]";
						else {
							parser.cdata += "]]" + c;
							parser.state = S.CDATA;
						}
						continue;
					case S.PROC_INST:
						if (c === "?") parser.state = S.PROC_INST_ENDING;
						else if (isWhitespace(c)) parser.state = S.PROC_INST_BODY;
						else parser.procInstName += c;
						continue;
					case S.PROC_INST_BODY:
						if (!parser.procInstBody && isWhitespace(c)) continue;
						else if (c === "?") parser.state = S.PROC_INST_ENDING;
						else parser.procInstBody += c;
						continue;
					case S.PROC_INST_ENDING:
						if (c === ">") {
							const procInstEndData = {
								name: parser.procInstName,
								body: parser.procInstBody
							};
							validateXmlDeclarationEncoding(parser, procInstEndData);
							emitNode(parser, "onprocessinginstruction", procInstEndData);
							parser.procInstName = parser.procInstBody = "";
							parser.state = S.TEXT;
						} else {
							parser.procInstBody += "?" + c;
							parser.state = S.PROC_INST_BODY;
						}
						continue;
					case S.OPEN_TAG:
						if (isMatch(nameBody, c)) parser.tagName += c;
						else {
							newTag(parser);
							if (c === ">") openTag(parser);
							else if (c === "/") parser.state = S.OPEN_TAG_SLASH;
							else {
								if (!isWhitespace(c)) strictFail(parser, "Invalid character in tag name");
								parser.state = S.ATTRIB;
							}
						}
						continue;
					case S.OPEN_TAG_SLASH:
						if (c === ">") {
							openTag(parser, true);
							closeTag(parser);
						} else {
							strictFail(parser, "Forward-slash in opening tag not followed by >");
							parser.state = S.ATTRIB;
						}
						continue;
					case S.ATTRIB:
						if (isWhitespace(c)) continue;
						else if (c === ">") openTag(parser);
						else if (c === "/") parser.state = S.OPEN_TAG_SLASH;
						else if (isMatch(nameStart, c)) {
							parser.attribName = c;
							parser.attribValue = "";
							parser.state = S.ATTRIB_NAME;
						} else strictFail(parser, "Invalid attribute name");
						continue;
					case S.ATTRIB_NAME:
						if (c === "=") parser.state = S.ATTRIB_VALUE;
						else if (c === ">") {
							strictFail(parser, "Attribute without value");
							parser.attribValue = parser.attribName;
							attrib(parser);
							openTag(parser);
						} else if (isWhitespace(c)) parser.state = S.ATTRIB_NAME_SAW_WHITE;
						else if (isMatch(nameBody, c)) parser.attribName += c;
						else strictFail(parser, "Invalid attribute name");
						continue;
					case S.ATTRIB_NAME_SAW_WHITE:
						if (c === "=") parser.state = S.ATTRIB_VALUE;
						else if (isWhitespace(c)) continue;
						else {
							strictFail(parser, "Attribute without value");
							parser.tag.attributes[parser.attribName] = "";
							parser.attribValue = "";
							emitNode(parser, "onattribute", {
								name: parser.attribName,
								value: ""
							});
							parser.attribName = "";
							if (c === ">") openTag(parser);
							else if (isMatch(nameStart, c)) {
								parser.attribName = c;
								parser.state = S.ATTRIB_NAME;
							} else {
								strictFail(parser, "Invalid attribute name");
								parser.state = S.ATTRIB;
							}
						}
						continue;
					case S.ATTRIB_VALUE:
						if (isWhitespace(c)) continue;
						else if (isQuote(c)) {
							parser.q = c;
							parser.state = S.ATTRIB_VALUE_QUOTED;
						} else {
							if (!parser.opt.unquotedAttributeValues) error(parser, "Unquoted attribute value");
							parser.state = S.ATTRIB_VALUE_UNQUOTED;
							parser.attribValue = c;
						}
						continue;
					case S.ATTRIB_VALUE_QUOTED:
						if (c !== parser.q) {
							if (c === "&") parser.state = S.ATTRIB_VALUE_ENTITY_Q;
							else parser.attribValue += c;
							continue;
						}
						attrib(parser);
						parser.q = "";
						parser.state = S.ATTRIB_VALUE_CLOSED;
						continue;
					case S.ATTRIB_VALUE_CLOSED:
						if (isWhitespace(c)) parser.state = S.ATTRIB;
						else if (c === ">") openTag(parser);
						else if (c === "/") parser.state = S.OPEN_TAG_SLASH;
						else if (isMatch(nameStart, c)) {
							strictFail(parser, "No whitespace between attributes");
							parser.attribName = c;
							parser.attribValue = "";
							parser.state = S.ATTRIB_NAME;
						} else strictFail(parser, "Invalid attribute name");
						continue;
					case S.ATTRIB_VALUE_UNQUOTED:
						if (!isAttribEnd(c)) {
							if (c === "&") parser.state = S.ATTRIB_VALUE_ENTITY_U;
							else parser.attribValue += c;
							continue;
						}
						attrib(parser);
						if (c === ">") openTag(parser);
						else parser.state = S.ATTRIB;
						continue;
					case S.CLOSE_TAG:
						if (!parser.tagName) if (isWhitespace(c)) continue;
						else if (notMatch(nameStart, c)) if (parser.script) {
							parser.script += "</" + c;
							parser.state = S.SCRIPT;
						} else strictFail(parser, "Invalid tagname in closing tag.");
						else parser.tagName = c;
						else if (c === ">") closeTag(parser);
						else if (isMatch(nameBody, c)) parser.tagName += c;
						else if (parser.script) {
							parser.script += "</" + parser.tagName + c;
							parser.tagName = "";
							parser.state = S.SCRIPT;
						} else {
							if (!isWhitespace(c)) strictFail(parser, "Invalid tagname in closing tag");
							parser.state = S.CLOSE_TAG_SAW_WHITE;
						}
						continue;
					case S.CLOSE_TAG_SAW_WHITE:
						if (isWhitespace(c)) continue;
						if (c === ">") closeTag(parser);
						else strictFail(parser, "Invalid characters in closing tag");
						continue;
					case S.TEXT_ENTITY:
					case S.ATTRIB_VALUE_ENTITY_Q:
					case S.ATTRIB_VALUE_ENTITY_U:
						var returnState;
						var buffer;
						switch (parser.state) {
							case S.TEXT_ENTITY:
								returnState = S.TEXT;
								buffer = "textNode";
								break;
							case S.ATTRIB_VALUE_ENTITY_Q:
								returnState = S.ATTRIB_VALUE_QUOTED;
								buffer = "attribValue";
								break;
							case S.ATTRIB_VALUE_ENTITY_U:
								returnState = S.ATTRIB_VALUE_UNQUOTED;
								buffer = "attribValue";
								break;
						}
						if (c === ";") {
							var parsedEntity = parseEntity(parser);
							if (parser.opt.unparsedEntities && !Object.values(sax.XML_ENTITIES).includes(parsedEntity)) {
								if ((parser.entityCount += 1) > parser.opt.maxEntityCount) error(parser, "Parsed entity count exceeds max entity count");
								if ((parser.entityDepth += 1) > parser.opt.maxEntityDepth) error(parser, "Parsed entity depth exceeds max entity depth");
								parser.entity = "";
								parser.state = returnState;
								parser.write(parsedEntity);
								parser.entityDepth -= 1;
							} else {
								parser[buffer] += parsedEntity;
								parser.entity = "";
								parser.state = returnState;
							}
						} else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) parser.entity += c;
						else {
							strictFail(parser, "Invalid character in entity name");
							parser[buffer] += "&" + parser.entity + c;
							parser.entity = "";
							parser.state = returnState;
						}
						continue;
					default: throw new Error(parser, "Unknown state: " + parser.state);
				}
			}
			if (parser.position >= parser.bufferCheckPosition) checkBufferLength(parser);
			return parser;
		}
		/*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
		/* istanbul ignore next */
		if (!String.fromCodePoint) (function() {
			var stringFromCharCode = String.fromCharCode;
			var floor = Math.floor;
			var fromCodePoint = function() {
				var MAX_SIZE = 16384;
				var codeUnits = [];
				var highSurrogate;
				var lowSurrogate;
				var index = -1;
				var length = arguments.length;
				if (!length) return "";
				var result = "";
				while (++index < length) {
					var codePoint = Number(arguments[index]);
					if (!isFinite(codePoint) || codePoint < 0 || codePoint > 1114111 || floor(codePoint) !== codePoint) throw RangeError("Invalid code point: " + codePoint);
					if (codePoint <= 65535) codeUnits.push(codePoint);
					else {
						codePoint -= 65536;
						highSurrogate = (codePoint >> 10) + 55296;
						lowSurrogate = codePoint % 1024 + 56320;
						codeUnits.push(highSurrogate, lowSurrogate);
					}
					if (index + 1 === length || codeUnits.length > MAX_SIZE) {
						result += stringFromCharCode.apply(null, codeUnits);
						codeUnits.length = 0;
					}
				}
				return result;
			};
			/* istanbul ignore next */
			if (Object.defineProperty) Object.defineProperty(String, "fromCodePoint", {
				value: fromCodePoint,
				configurable: true,
				writable: true
			});
			else String.fromCodePoint = fromCodePoint;
		})();
	})(typeof exports === "undefined" ? exports.sax = {} : exports);
}));
//#endregion
//#region node_modules/xml-js/lib/array-helper.js
var require_array_helper = /* @__PURE__ */ __commonJSMin$1(((exports, module) => {
	module.exports = { isArray: function(value) {
		if (Array.isArray) return Array.isArray(value);
		return Object.prototype.toString.call(value) === "[object Array]";
	} };
}));
//#endregion
//#region node_modules/xml-js/lib/options-helper.js
var require_options_helper = /* @__PURE__ */ __commonJSMin$1(((exports, module) => {
	var isArray = require_array_helper().isArray;
	module.exports = {
		copyOptions: function(options) {
			var key, copy = {};
			for (key in options) if (options.hasOwnProperty(key)) copy[key] = options[key];
			return copy;
		},
		ensureFlagExists: function(item, options) {
			if (!(item in options) || typeof options[item] !== "boolean") options[item] = false;
		},
		ensureSpacesExists: function(options) {
			if (!("spaces" in options) || typeof options.spaces !== "number" && typeof options.spaces !== "string") options.spaces = 0;
		},
		ensureAlwaysArrayExists: function(options) {
			if (!("alwaysArray" in options) || typeof options.alwaysArray !== "boolean" && !isArray(options.alwaysArray)) options.alwaysArray = false;
		},
		ensureKeyExists: function(key, options) {
			if (!(key + "Key" in options) || typeof options[key + "Key"] !== "string") options[key + "Key"] = options.compact ? "_" + key : key;
		},
		checkFnExists: function(key, options) {
			return key + "Fn" in options;
		}
	};
}));
//#endregion
//#region node_modules/xml-js/lib/xml2js.js
var require_xml2js = /* @__PURE__ */ __commonJSMin$1(((exports, module) => {
	var sax = require_sax();
	var expat = {
		on: function() {},
		parse: function() {}
	};
	var helper = require_options_helper();
	var isArray = require_array_helper().isArray;
	var options;
	var pureJsParser = true;
	var currentElement;
	function validateOptions(userOptions) {
		options = helper.copyOptions(userOptions);
		helper.ensureFlagExists("ignoreDeclaration", options);
		helper.ensureFlagExists("ignoreInstruction", options);
		helper.ensureFlagExists("ignoreAttributes", options);
		helper.ensureFlagExists("ignoreText", options);
		helper.ensureFlagExists("ignoreComment", options);
		helper.ensureFlagExists("ignoreCdata", options);
		helper.ensureFlagExists("ignoreDoctype", options);
		helper.ensureFlagExists("compact", options);
		helper.ensureFlagExists("alwaysChildren", options);
		helper.ensureFlagExists("addParent", options);
		helper.ensureFlagExists("trim", options);
		helper.ensureFlagExists("nativeType", options);
		helper.ensureFlagExists("nativeTypeAttributes", options);
		helper.ensureFlagExists("sanitize", options);
		helper.ensureFlagExists("instructionHasAttributes", options);
		helper.ensureFlagExists("captureSpacesBetweenElements", options);
		helper.ensureAlwaysArrayExists(options);
		helper.ensureKeyExists("declaration", options);
		helper.ensureKeyExists("instruction", options);
		helper.ensureKeyExists("attributes", options);
		helper.ensureKeyExists("text", options);
		helper.ensureKeyExists("comment", options);
		helper.ensureKeyExists("cdata", options);
		helper.ensureKeyExists("doctype", options);
		helper.ensureKeyExists("type", options);
		helper.ensureKeyExists("name", options);
		helper.ensureKeyExists("elements", options);
		helper.ensureKeyExists("parent", options);
		helper.checkFnExists("doctype", options);
		helper.checkFnExists("instruction", options);
		helper.checkFnExists("cdata", options);
		helper.checkFnExists("comment", options);
		helper.checkFnExists("text", options);
		helper.checkFnExists("instructionName", options);
		helper.checkFnExists("elementName", options);
		helper.checkFnExists("attributeName", options);
		helper.checkFnExists("attributeValue", options);
		helper.checkFnExists("attributes", options);
		return options;
	}
	function nativeType(value) {
		var nValue = Number(value);
		if (!isNaN(nValue)) return nValue;
		var bValue = value.toLowerCase();
		if (bValue === "true") return true;
		else if (bValue === "false") return false;
		return value;
	}
	function addField(type, value) {
		var key;
		if (options.compact) {
			if (!currentElement[options[type + "Key"]] && (isArray(options.alwaysArray) ? options.alwaysArray.indexOf(options[type + "Key"]) !== -1 : options.alwaysArray)) currentElement[options[type + "Key"]] = [];
			if (currentElement[options[type + "Key"]] && !isArray(currentElement[options[type + "Key"]])) currentElement[options[type + "Key"]] = [currentElement[options[type + "Key"]]];
			if (type + "Fn" in options && typeof value === "string") value = options[type + "Fn"](value, currentElement);
			if (type === "instruction" && ("instructionFn" in options || "instructionNameFn" in options)) {
				for (key in value) if (value.hasOwnProperty(key)) if ("instructionFn" in options) value[key] = options.instructionFn(value[key], key, currentElement);
				else {
					var temp = value[key];
					delete value[key];
					value[options.instructionNameFn(key, temp, currentElement)] = temp;
				}
			}
			if (isArray(currentElement[options[type + "Key"]])) currentElement[options[type + "Key"]].push(value);
			else currentElement[options[type + "Key"]] = value;
		} else {
			if (!currentElement[options.elementsKey]) currentElement[options.elementsKey] = [];
			var element = {};
			element[options.typeKey] = type;
			if (type === "instruction") {
				for (key in value) if (value.hasOwnProperty(key)) break;
				element[options.nameKey] = "instructionNameFn" in options ? options.instructionNameFn(key, value, currentElement) : key;
				if (options.instructionHasAttributes) {
					element[options.attributesKey] = value[key][options.attributesKey];
					if ("instructionFn" in options) element[options.attributesKey] = options.instructionFn(element[options.attributesKey], key, currentElement);
				} else {
					if ("instructionFn" in options) value[key] = options.instructionFn(value[key], key, currentElement);
					element[options.instructionKey] = value[key];
				}
			} else {
				if (type + "Fn" in options) value = options[type + "Fn"](value, currentElement);
				element[options[type + "Key"]] = value;
			}
			if (options.addParent) element[options.parentKey] = currentElement;
			currentElement[options.elementsKey].push(element);
		}
	}
	function manipulateAttributes(attributes) {
		if ("attributesFn" in options && attributes) attributes = options.attributesFn(attributes, currentElement);
		if ((options.trim || "attributeValueFn" in options || "attributeNameFn" in options || options.nativeTypeAttributes) && attributes) {
			var key;
			for (key in attributes) if (attributes.hasOwnProperty(key)) {
				if (options.trim) attributes[key] = attributes[key].trim();
				if (options.nativeTypeAttributes) attributes[key] = nativeType(attributes[key]);
				if ("attributeValueFn" in options) attributes[key] = options.attributeValueFn(attributes[key], key, currentElement);
				if ("attributeNameFn" in options) {
					var temp = attributes[key];
					delete attributes[key];
					attributes[options.attributeNameFn(key, attributes[key], currentElement)] = temp;
				}
			}
		}
		return attributes;
	}
	function onInstruction(instruction) {
		var attributes = {};
		if (instruction.body && (instruction.name.toLowerCase() === "xml" || options.instructionHasAttributes)) {
			var attrsRegExp = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))\s*/g;
			var match;
			while ((match = attrsRegExp.exec(instruction.body)) !== null) attributes[match[1]] = match[2] || match[3] || match[4];
			attributes = manipulateAttributes(attributes);
		}
		if (instruction.name.toLowerCase() === "xml") {
			if (options.ignoreDeclaration) return;
			currentElement[options.declarationKey] = {};
			if (Object.keys(attributes).length) currentElement[options.declarationKey][options.attributesKey] = attributes;
			if (options.addParent) currentElement[options.declarationKey][options.parentKey] = currentElement;
		} else {
			if (options.ignoreInstruction) return;
			if (options.trim) instruction.body = instruction.body.trim();
			var value = {};
			if (options.instructionHasAttributes && Object.keys(attributes).length) {
				value[instruction.name] = {};
				value[instruction.name][options.attributesKey] = attributes;
			} else value[instruction.name] = instruction.body;
			addField("instruction", value);
		}
	}
	function onStartElement(name, attributes) {
		var element;
		if (typeof name === "object") {
			attributes = name.attributes;
			name = name.name;
		}
		attributes = manipulateAttributes(attributes);
		if ("elementNameFn" in options) name = options.elementNameFn(name, currentElement);
		if (options.compact) {
			element = {};
			if (!options.ignoreAttributes && attributes && Object.keys(attributes).length) {
				element[options.attributesKey] = {};
				var key;
				for (key in attributes) if (attributes.hasOwnProperty(key)) element[options.attributesKey][key] = attributes[key];
			}
			if (!(name in currentElement) && (isArray(options.alwaysArray) ? options.alwaysArray.indexOf(name) !== -1 : options.alwaysArray)) currentElement[name] = [];
			if (currentElement[name] && !isArray(currentElement[name])) currentElement[name] = [currentElement[name]];
			if (isArray(currentElement[name])) currentElement[name].push(element);
			else currentElement[name] = element;
		} else {
			if (!currentElement[options.elementsKey]) currentElement[options.elementsKey] = [];
			element = {};
			element[options.typeKey] = "element";
			element[options.nameKey] = name;
			if (!options.ignoreAttributes && attributes && Object.keys(attributes).length) element[options.attributesKey] = attributes;
			if (options.alwaysChildren) element[options.elementsKey] = [];
			currentElement[options.elementsKey].push(element);
		}
		element[options.parentKey] = currentElement;
		currentElement = element;
	}
	function onText(text) {
		if (options.ignoreText) return;
		if (!text.trim() && !options.captureSpacesBetweenElements) return;
		if (options.trim) text = text.trim();
		if (options.nativeType) text = nativeType(text);
		if (options.sanitize) text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		addField("text", text);
	}
	function onComment(comment) {
		if (options.ignoreComment) return;
		if (options.trim) comment = comment.trim();
		addField("comment", comment);
	}
	function onEndElement(name) {
		var parentElement = currentElement[options.parentKey];
		if (!options.addParent) delete currentElement[options.parentKey];
		currentElement = parentElement;
	}
	function onCdata(cdata) {
		if (options.ignoreCdata) return;
		if (options.trim) cdata = cdata.trim();
		addField("cdata", cdata);
	}
	function onDoctype(doctype) {
		if (options.ignoreDoctype) return;
		doctype = doctype.replace(/^ /, "");
		if (options.trim) doctype = doctype.trim();
		addField("doctype", doctype);
	}
	function onError(error) {
		error.note = error;
	}
	module.exports = function(xml, userOptions) {
		var parser = pureJsParser ? sax.parser(true, {}) : parser = new expat.Parser("UTF-8");
		var result = {};
		currentElement = result;
		options = validateOptions(userOptions);
		if (pureJsParser) {
			parser.opt = { strictEntities: true };
			parser.onopentag = onStartElement;
			parser.ontext = onText;
			parser.oncomment = onComment;
			parser.onclosetag = onEndElement;
			parser.onerror = onError;
			parser.oncdata = onCdata;
			parser.ondoctype = onDoctype;
			parser.onprocessinginstruction = onInstruction;
		} else {
			parser.on("startElement", onStartElement);
			parser.on("text", onText);
			parser.on("comment", onComment);
			parser.on("endElement", onEndElement);
			parser.on("error", onError);
		}
		if (pureJsParser) parser.write(xml).close();
		else if (!parser.parse(xml)) throw new Error("XML parsing error: " + parser.getError());
		if (result[options.elementsKey]) {
			var temp = result[options.elementsKey];
			delete result[options.elementsKey];
			result[options.elementsKey] = temp;
			delete result.text;
		}
		return result;
	};
}));
//#endregion
//#region node_modules/xml-js/lib/xml2json.js
var require_xml2json = /* @__PURE__ */ __commonJSMin$1(((exports, module) => {
	var helper = require_options_helper();
	var xml2js = require_xml2js();
	function validateOptions(userOptions) {
		var options = helper.copyOptions(userOptions);
		helper.ensureSpacesExists(options);
		return options;
	}
	module.exports = function(xml, userOptions) {
		var options = validateOptions(userOptions), js = xml2js(xml, options), json, parentKey = "compact" in options && options.compact ? "_parent" : "parent";
		if ("addParent" in options && options.addParent) json = JSON.stringify(js, function(k, v) {
			return k === parentKey ? "_" : v;
		}, options.spaces);
		else json = JSON.stringify(js, null, options.spaces);
		return json.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
	};
}));
//#endregion
//#region node_modules/xml-js/lib/js2xml.js
var require_js2xml = /* @__PURE__ */ __commonJSMin$1(((exports, module) => {
	var helper = require_options_helper();
	var isArray = require_array_helper().isArray;
	var currentElement;
	var currentElementName;
	function validateOptions(userOptions) {
		var options = helper.copyOptions(userOptions);
		helper.ensureFlagExists("ignoreDeclaration", options);
		helper.ensureFlagExists("ignoreInstruction", options);
		helper.ensureFlagExists("ignoreAttributes", options);
		helper.ensureFlagExists("ignoreText", options);
		helper.ensureFlagExists("ignoreComment", options);
		helper.ensureFlagExists("ignoreCdata", options);
		helper.ensureFlagExists("ignoreDoctype", options);
		helper.ensureFlagExists("compact", options);
		helper.ensureFlagExists("indentText", options);
		helper.ensureFlagExists("indentCdata", options);
		helper.ensureFlagExists("indentAttributes", options);
		helper.ensureFlagExists("indentInstruction", options);
		helper.ensureFlagExists("fullTagEmptyElement", options);
		helper.ensureFlagExists("noQuotesForNativeAttributes", options);
		helper.ensureSpacesExists(options);
		if (typeof options.spaces === "number") options.spaces = Array(options.spaces + 1).join(" ");
		helper.ensureKeyExists("declaration", options);
		helper.ensureKeyExists("instruction", options);
		helper.ensureKeyExists("attributes", options);
		helper.ensureKeyExists("text", options);
		helper.ensureKeyExists("comment", options);
		helper.ensureKeyExists("cdata", options);
		helper.ensureKeyExists("doctype", options);
		helper.ensureKeyExists("type", options);
		helper.ensureKeyExists("name", options);
		helper.ensureKeyExists("elements", options);
		helper.checkFnExists("doctype", options);
		helper.checkFnExists("instruction", options);
		helper.checkFnExists("cdata", options);
		helper.checkFnExists("comment", options);
		helper.checkFnExists("text", options);
		helper.checkFnExists("instructionName", options);
		helper.checkFnExists("elementName", options);
		helper.checkFnExists("attributeName", options);
		helper.checkFnExists("attributeValue", options);
		helper.checkFnExists("attributes", options);
		helper.checkFnExists("fullTagEmptyElement", options);
		return options;
	}
	function writeIndentation(options, depth, firstLine) {
		return (!firstLine && options.spaces ? "\n" : "") + Array(depth + 1).join(options.spaces);
	}
	function writeAttributes(attributes, options, depth) {
		if (options.ignoreAttributes) return "";
		if ("attributesFn" in options) attributes = options.attributesFn(attributes, currentElementName, currentElement);
		var key, attr, attrName, quote, result = [];
		for (key in attributes) if (attributes.hasOwnProperty(key) && attributes[key] !== null && attributes[key] !== void 0) {
			quote = options.noQuotesForNativeAttributes && typeof attributes[key] !== "string" ? "" : "\"";
			attr = "" + attributes[key];
			attr = attr.replace(/"/g, "&quot;");
			attrName = "attributeNameFn" in options ? options.attributeNameFn(key, attr, currentElementName, currentElement) : key;
			result.push(options.spaces && options.indentAttributes ? writeIndentation(options, depth + 1, false) : " ");
			result.push(attrName + "=" + quote + ("attributeValueFn" in options ? options.attributeValueFn(attr, key, currentElementName, currentElement) : attr) + quote);
		}
		if (attributes && Object.keys(attributes).length && options.spaces && options.indentAttributes) result.push(writeIndentation(options, depth, false));
		return result.join("");
	}
	function writeDeclaration(declaration, options, depth) {
		currentElement = declaration;
		currentElementName = "xml";
		return options.ignoreDeclaration ? "" : "<?xml" + writeAttributes(declaration[options.attributesKey], options, depth) + "?>";
	}
	function writeInstruction(instruction, options, depth) {
		if (options.ignoreInstruction) return "";
		var key;
		for (key in instruction) if (instruction.hasOwnProperty(key)) break;
		var instructionName = "instructionNameFn" in options ? options.instructionNameFn(key, instruction[key], currentElementName, currentElement) : key;
		if (typeof instruction[key] === "object") {
			currentElement = instruction;
			currentElementName = instructionName;
			return "<?" + instructionName + writeAttributes(instruction[key][options.attributesKey], options, depth) + "?>";
		} else {
			var instructionValue = instruction[key] ? instruction[key] : "";
			if ("instructionFn" in options) instructionValue = options.instructionFn(instructionValue, key, currentElementName, currentElement);
			return "<?" + instructionName + (instructionValue ? " " + instructionValue : "") + "?>";
		}
	}
	function writeComment(comment, options) {
		return options.ignoreComment ? "" : "<!--" + ("commentFn" in options ? options.commentFn(comment, currentElementName, currentElement) : comment) + "-->";
	}
	function writeCdata(cdata, options) {
		return options.ignoreCdata ? "" : "<![CDATA[" + ("cdataFn" in options ? options.cdataFn(cdata, currentElementName, currentElement) : cdata.replace("]]>", "]]]]><![CDATA[>")) + "]]>";
	}
	function writeDoctype(doctype, options) {
		return options.ignoreDoctype ? "" : "<!DOCTYPE " + ("doctypeFn" in options ? options.doctypeFn(doctype, currentElementName, currentElement) : doctype) + ">";
	}
	function writeText(text, options) {
		if (options.ignoreText) return "";
		text = "" + text;
		text = text.replace(/&amp;/g, "&");
		text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		return "textFn" in options ? options.textFn(text, currentElementName, currentElement) : text;
	}
	function hasContent(element, options) {
		var i;
		if (element.elements && element.elements.length) for (i = 0; i < element.elements.length; ++i) switch (element.elements[i][options.typeKey]) {
			case "text":
				if (options.indentText) return true;
				break;
			case "cdata":
				if (options.indentCdata) return true;
				break;
			case "instruction":
				if (options.indentInstruction) return true;
				break;
			case "doctype":
			case "comment":
			case "element": return true;
			default: return true;
		}
		return false;
	}
	function writeElement(element, options, depth) {
		currentElement = element;
		currentElementName = element.name;
		var xml = [], elementName = "elementNameFn" in options ? options.elementNameFn(element.name, element) : element.name;
		xml.push("<" + elementName);
		if (element[options.attributesKey]) xml.push(writeAttributes(element[options.attributesKey], options, depth));
		var withClosingTag = element[options.elementsKey] && element[options.elementsKey].length || element[options.attributesKey] && element[options.attributesKey]["xml:space"] === "preserve";
		if (!withClosingTag) if ("fullTagEmptyElementFn" in options) withClosingTag = options.fullTagEmptyElementFn(element.name, element);
		else withClosingTag = options.fullTagEmptyElement;
		if (withClosingTag) {
			xml.push(">");
			if (element[options.elementsKey] && element[options.elementsKey].length) {
				xml.push(writeElements(element[options.elementsKey], options, depth + 1));
				currentElement = element;
				currentElementName = element.name;
			}
			xml.push(options.spaces && hasContent(element, options) ? "\n" + Array(depth + 1).join(options.spaces) : "");
			xml.push("</" + elementName + ">");
		} else xml.push("/>");
		return xml.join("");
	}
	function writeElements(elements, options, depth, firstLine) {
		return elements.reduce(function(xml, element) {
			var indent = writeIndentation(options, depth, firstLine && !xml);
			switch (element.type) {
				case "element": return xml + indent + writeElement(element, options, depth);
				case "comment": return xml + indent + writeComment(element[options.commentKey], options);
				case "doctype": return xml + indent + writeDoctype(element[options.doctypeKey], options);
				case "cdata": return xml + (options.indentCdata ? indent : "") + writeCdata(element[options.cdataKey], options);
				case "text": return xml + (options.indentText ? indent : "") + writeText(element[options.textKey], options);
				case "instruction":
					var instruction = {};
					instruction[element[options.nameKey]] = element[options.attributesKey] ? element : element[options.instructionKey];
					return xml + (options.indentInstruction ? indent : "") + writeInstruction(instruction, options, depth);
			}
		}, "");
	}
	function hasContentCompact(element, options, anyContent) {
		var key;
		for (key in element) if (element.hasOwnProperty(key)) switch (key) {
			case options.parentKey:
			case options.attributesKey: break;
			case options.textKey:
				if (options.indentText || anyContent) return true;
				break;
			case options.cdataKey:
				if (options.indentCdata || anyContent) return true;
				break;
			case options.instructionKey:
				if (options.indentInstruction || anyContent) return true;
				break;
			case options.doctypeKey:
			case options.commentKey: return true;
			default: return true;
		}
		return false;
	}
	function writeElementCompact(element, name, options, depth, indent) {
		currentElement = element;
		currentElementName = name;
		var elementName = "elementNameFn" in options ? options.elementNameFn(name, element) : name;
		if (typeof element === "undefined" || element === null || element === "") return "fullTagEmptyElementFn" in options && options.fullTagEmptyElementFn(name, element) || options.fullTagEmptyElement ? "<" + elementName + "></" + elementName + ">" : "<" + elementName + "/>";
		var xml = [];
		if (name) {
			xml.push("<" + elementName);
			if (typeof element !== "object") {
				xml.push(">" + writeText(element, options) + "</" + elementName + ">");
				return xml.join("");
			}
			if (element[options.attributesKey]) xml.push(writeAttributes(element[options.attributesKey], options, depth));
			var withClosingTag = hasContentCompact(element, options, true) || element[options.attributesKey] && element[options.attributesKey]["xml:space"] === "preserve";
			if (!withClosingTag) if ("fullTagEmptyElementFn" in options) withClosingTag = options.fullTagEmptyElementFn(name, element);
			else withClosingTag = options.fullTagEmptyElement;
			if (withClosingTag) xml.push(">");
			else {
				xml.push("/>");
				return xml.join("");
			}
		}
		xml.push(writeElementsCompact(element, options, depth + 1, false));
		currentElement = element;
		currentElementName = name;
		if (name) xml.push((indent ? writeIndentation(options, depth, false) : "") + "</" + elementName + ">");
		return xml.join("");
	}
	function writeElementsCompact(element, options, depth, firstLine) {
		var i, key, nodes, xml = [];
		for (key in element) if (element.hasOwnProperty(key)) {
			nodes = isArray(element[key]) ? element[key] : [element[key]];
			for (i = 0; i < nodes.length; ++i) {
				switch (key) {
					case options.declarationKey:
						xml.push(writeDeclaration(nodes[i], options, depth));
						break;
					case options.instructionKey:
						xml.push((options.indentInstruction ? writeIndentation(options, depth, firstLine) : "") + writeInstruction(nodes[i], options, depth));
						break;
					case options.attributesKey:
					case options.parentKey: break;
					case options.textKey:
						xml.push((options.indentText ? writeIndentation(options, depth, firstLine) : "") + writeText(nodes[i], options));
						break;
					case options.cdataKey:
						xml.push((options.indentCdata ? writeIndentation(options, depth, firstLine) : "") + writeCdata(nodes[i], options));
						break;
					case options.doctypeKey:
						xml.push(writeIndentation(options, depth, firstLine) + writeDoctype(nodes[i], options));
						break;
					case options.commentKey:
						xml.push(writeIndentation(options, depth, firstLine) + writeComment(nodes[i], options));
						break;
					default: xml.push(writeIndentation(options, depth, firstLine) + writeElementCompact(nodes[i], key, options, depth, hasContentCompact(nodes[i], options)));
				}
				firstLine = firstLine && !xml.length;
			}
		}
		return xml.join("");
	}
	module.exports = function(js, options) {
		options = validateOptions(options);
		var xml = [];
		currentElement = js;
		currentElementName = "_root_";
		if (options.compact) xml.push(writeElementsCompact(js, options, 0, true));
		else {
			if (js[options.declarationKey]) xml.push(writeDeclaration(js[options.declarationKey], options, 0));
			if (js[options.elementsKey] && js[options.elementsKey].length) xml.push(writeElements(js[options.elementsKey], options, 0, !xml.length));
		}
		return xml.join("");
	};
}));
//#endregion
//#region node_modules/xml-js/lib/json2xml.js
var require_json2xml = /* @__PURE__ */ __commonJSMin$1(((exports, module) => {
	var js2xml = require_js2xml();
	module.exports = function(json, options) {
		if (json instanceof Buffer) json = json.toString();
		var js = null;
		if (typeof json === "string") try {
			js = JSON.parse(json);
		} catch (e) {
			throw new Error("The JSON structure is invalid");
		}
		else js = json;
		return js2xml(js, options);
	};
}));
//#endregion
//#region node_modules/fumapress/dist/plugins/sitemap.js
var import_lib = (/* @__PURE__ */ __commonJSMin$1(((exports, module) => {
	module.exports = {
		xml2js: require_xml2js(),
		xml2json: require_xml2json(),
		js2xml: require_js2xml(),
		json2xml: require_json2xml()
	};
})))();
function formatLastmod(value) {
	return (value instanceof Date ? value : new Date(value)).toISOString();
}
function imageToElement(image) {
	const element = { "image:loc": { _text: image.loc } };
	if (image.caption) element["image:caption"] = { _text: image.caption };
	if (image.geo_location) element["image:geo_location"] = { _text: image.geo_location };
	if (image.title) element["image:title"] = { _text: image.title };
	if (image.license) element["image:license"] = { _text: image.license };
	return element;
}
function entryToUrlElement(entry) {
	const url = { loc: { _text: entry.loc } };
	if (entry.lastmod) url.lastmod = { _text: formatLastmod(entry.lastmod) };
	if (entry.changefreq) url.changefreq = { _text: entry.changefreq };
	if (entry.priority !== void 0) url.priority = { _text: String(entry.priority) };
	if (entry.alternates?.length) url["xhtml:link"] = entry.alternates.map((alternate) => ({ _attributes: {
		rel: alternate.rel,
		hreflang: alternate.hreflang,
		href: alternate.href
	} }));
	if (entry.images?.length) url["image:image"] = entry.images.map(imageToElement);
	return url;
}
function buildSitemap(entries) {
	return (0, import_lib.js2xml)({
		_declaration: { _attributes: {
			version: "1.0",
			encoding: "UTF-8"
		} },
		urlset: {
			_attributes: {
				xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
				"xmlns:xhtml": "http://www.w3.org/1999/xhtml",
				"xmlns:image": "http://www.google.com/schemas/sitemap-image/1.1"
			},
			url: entries.map(entryToUrlElement)
		}
	}, {
		compact: true,
		spaces: 0
	});
}
function sitemapPlugin(options = {}) {
	const { path = "/sitemap.xml", getEntry: _getEntry = async function getEntryDefault(page) {
		return {
			loc: new URL(page.url, this.siteConfig.baseUrl).href,
			lastmod: await getLastModifiedDate(this, page),
			priority: .8
		};
	}, additionalEntries } = options;
	return {
		name: "core:sitemap",
		async createPages({ createApiIsomorphic, unstable_getCreated }) {
			const renderMode = this.mode === "default" ? "static" : this.mode;
			const getEntry = _getEntry.bind(this);
			createApiIsomorphic({
				render: renderMode,
				path,
				handler: async () => {
					const source = await this.getLoader();
					const entries = [];
					const pageLocs = /* @__PURE__ */ new Set();
					for (const entry of await Promise.all(source.getPages().map(getEntry))) {
						if (!entry) continue;
						pageLocs.add(entry.loc);
						entries.push(entry);
					}
					for (const route of await unstable_getCreated().unstable_getRouterConfigs()) if (route.isStatic && route.type === "route") {
						const segments = route.path.map((v) => v.name);
						if (segments.at(-1) === "404") continue;
						const loc = new URL("/" + segments.join("/"), this.siteConfig.baseUrl).href;
						if (pageLocs.has(loc)) continue;
						entries.push({
							loc,
							priority: 1
						});
					}
					if (additionalEntries) entries.push(...typeof additionalEntries === "function" ? await additionalEntries.call(this) : additionalEntries);
					return new Response(buildSitemap(entries), { headers: { "Content-Type": "application/xml" } });
				}
			});
		}
	};
}
//#endregion
//#region node_modules/@takumi-rs/helpers/dist/helpers-CVQCT1Rh.mjs
function e$1(e, t) {
	t && Object.keys(t).length > 0 && (e.style = t);
}
function t$1(e, t) {
	t && Object.keys(t).length > 0 && (e.preset = t);
}
function n$1(e, t) {
	t.tagName !== void 0 && (e.tagName = t.tagName), t.className !== void 0 && (e.className = t.className), t.id !== void 0 && (e.id = t.id), t.dir !== void 0 && (e.dir = t.dir), t.lang !== void 0 && (e.lang = t.lang), t.attributes !== void 0 && (e.attributes = t.attributes);
}
function r$2(r) {
	let i = {
		type: `container`,
		children: r.children
	};
	return r.tw && (i.tw = r.tw), n$1(i, r), t$1(i, r.preset), e$1(i, r.style), i;
}
function i$2(r, i) {
	if (typeof r == `string`) {
		let t = {
			type: `text`,
			text: r
		};
		return e$1(t, i), t;
	}
	let a = {
		type: `text`,
		text: r.text
	};
	return r.tw && (a.tw = r.tw), n$1(a, r), t$1(a, r.preset), e$1(a, i ?? r.style), a;
}
function a$2(r) {
	let i = {
		type: `image`,
		src: r.src,
		width: r.width,
		height: r.height
	};
	return r.tw && (i.tw = r.tw), n$1(i, r), t$1(i, r.preset), e$1(i, r.style), i;
}
function s$3(e) {
	return `${e}%`;
}
//#endregion
//#region node_modules/@takumi-rs/helpers/dist/emoji.mjs
var r$1 = /\uFE0F/g;
var i$1 = /\p{Extended_Pictographic}/u;
var a$1 = /^(?:\p{Regional_Indicator}){2}$/u;
var o$1 = /^[#*0-9]\uFE0F?\u20E3$/u;
function s$2(e) {
	let t = e.indexOf(`‍`) < 0 ? e.replace(r$1, ``) : e, n = ``;
	for (let e = 0, r = 0; e < t.length; e++) {
		let i = t.charCodeAt(e);
		if (r) {
			let e = (65536 + (r - 55296 << 10) + (i - 56320)).toString(16);
			n += (n ? `-` : ``) + e, r = 0;
		} else 55296 <= i && i <= 56319 ? r = i : n += (n ? `-` : ``) + i.toString(16);
	}
	return n;
}
var c$2 = {
	twemoji: (e) => `https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.2/assets/svg/${e.toLowerCase()}.svg`,
	openmoji: `https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@2.0.0/svg/`,
	blobmoji: `https://cdn.jsdelivr.net/npm/@svgmoji/blob@2.0.0/svg/`,
	noto: (e) => `https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@v2.051/svg/emoji_u${e.toLowerCase().replaceAll(`-`, `_`)}.svg`,
	fluent: (e) => `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${e.toLowerCase()}_color.svg`,
	fluentFlat: (e) => `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${e.toLowerCase()}_flat.svg`
};
function l$2(e, t) {
	let n = s$2(e), r = c$2[t];
	return typeof r == `function` ? r(n) : `${r}${n.toUpperCase()}.svg`;
}
var u$2;
function d$2() {
	return u$2 === void 0 && (u$2 = typeof Intl < `u` && typeof Intl.Segmenter == `function` ? new Intl.Segmenter(`en`, { granularity: `grapheme` }) : null), u$2;
}
function f$2(e) {
	let t = d$2();
	return t ? Array.from(t.segment(e)) : Array.from(e).map((e) => ({ segment: e }));
}
function p$2(e) {
	return i$1.test(e) || a$1.test(e) || o$1.test(e);
}
function m$2(n, r) {
	let i = [], a = ``, o = f$2(n.text);
	for (let { segment: n } of o) p$2(n) ? (a &&= (i.push(i$2({ text: a })), ``), i.push(a$2({
		src: l$2(n, r),
		style: {
			display: `inline-block`,
			width: `1em`,
			height: `1em`,
			margin: `0 0.05em 0 0.1em`,
			verticalAlign: `-0.1em`
		}
	}))) : a += n;
	return a && i.push(i$2({ text: a })), i;
}
function h$2(e, t) {
	if (e.type === `text`) {
		if (f$2(e.text).some(({ segment: e }) => p$2(e))) {
			let { type: r, ...i } = e;
			return r$2({
				...i,
				children: m$2(e, t)
			});
		}
	} else if (e.type === `container` && e.children) return {
		...e,
		children: e.children.map((e) => e && h$2(e, t))
	};
	return e;
}
//#endregion
//#region node_modules/@takumi-rs/helpers/dist/utils-hT_pgw3g.mjs
var e = {
	html: { display: `block` },
	head: { display: `none` },
	meta: { display: `none` },
	title: { display: `none` },
	link: { display: `none` },
	style: { display: `none` },
	script: { display: `none` },
	noscript: { display: `none` },
	datalist: { display: `none` },
	template: { display: `none` },
	body: {
		margin: 8,
		display: `block`
	},
	p: {
		marginTop: `1em`,
		marginBottom: `1em`,
		display: `block`
	},
	blockquote: {
		marginTop: `1em`,
		marginBottom: `1em`,
		marginLeft: 40,
		marginRight: 40,
		display: `block`
	},
	figure: {
		marginTop: `1em`,
		marginBottom: `1em`,
		marginLeft: 40,
		marginRight: 40,
		display: `block`
	},
	figcaption: { display: `block` },
	address: {
		fontStyle: `italic`,
		display: `block`
	},
	article: { display: `block` },
	aside: { display: `block` },
	footer: { display: `block` },
	header: { display: `block` },
	hgroup: { display: `block` },
	main: { display: `block` },
	nav: { display: `block` },
	section: { display: `block` },
	center: {
		textAlign: `center`,
		display: `block`
	},
	hr: {
		marginTop: `0.5em`,
		marginBottom: `0.5em`,
		marginLeft: `auto`,
		marginRight: `auto`,
		borderWidth: 1,
		display: `block`
	},
	ul: {
		marginTop: `1em`,
		marginBottom: `1em`,
		paddingLeft: 40,
		display: `block`
	},
	ol: {
		marginTop: `1em`,
		marginBottom: `1em`,
		paddingLeft: 40,
		display: `block`
	},
	menu: {
		marginTop: `1em`,
		marginBottom: `1em`,
		paddingLeft: 40,
		display: `block`
	},
	li: { display: `block` },
	dl: {
		marginTop: `1em`,
		marginBottom: `1em`,
		display: `block`
	},
	dt: { display: `block` },
	dd: {
		marginLeft: 40,
		display: `block`
	},
	form: { display: `block` },
	fieldset: {
		marginLeft: 2,
		marginRight: 2,
		paddingTop: `0.35em`,
		paddingRight: `0.75em`,
		paddingBottom: `0.625em`,
		paddingLeft: `0.75em`,
		borderWidth: 2,
		display: `block`
	},
	legend: {
		paddingLeft: 2,
		paddingRight: 2,
		display: `block`
	},
	details: { display: `block` },
	summary: { display: `block` },
	search: { display: `block` },
	h1: {
		fontSize: `2em`,
		marginTop: `0.67em`,
		marginBottom: `0.67em`,
		marginLeft: 0,
		marginRight: 0,
		fontWeight: `bold`,
		display: `block`
	},
	h2: {
		fontSize: `1.5em`,
		marginTop: `0.83em`,
		marginBottom: `0.83em`,
		marginLeft: 0,
		marginRight: 0,
		fontWeight: `bold`,
		display: `block`
	},
	h3: {
		fontSize: `1.17em`,
		marginTop: `1em`,
		marginBottom: `1em`,
		marginLeft: 0,
		marginRight: 0,
		fontWeight: `bold`,
		display: `block`
	},
	h4: {
		marginTop: `1.33em`,
		marginBottom: `1.33em`,
		marginLeft: 0,
		marginRight: 0,
		fontWeight: `bold`,
		display: `block`
	},
	h5: {
		fontSize: `0.83em`,
		marginTop: `1.67em`,
		marginBottom: `1.67em`,
		marginLeft: 0,
		marginRight: 0,
		fontWeight: `bold`,
		display: `block`
	},
	h6: {
		fontSize: `0.67em`,
		marginTop: `2.33em`,
		marginBottom: `2.33em`,
		marginLeft: 0,
		marginRight: 0,
		fontWeight: `bold`,
		display: `block`
	},
	u: { textDecoration: `underline` },
	ins: { textDecoration: `underline` },
	strong: { fontWeight: `bolder` },
	b: { fontWeight: `bolder` },
	i: { fontStyle: `italic` },
	em: { fontStyle: `italic` },
	cite: { fontStyle: `italic` },
	dfn: { fontStyle: `italic` },
	code: { fontFamily: `monospace` },
	kbd: { fontFamily: `monospace` },
	samp: { fontFamily: `monospace` },
	pre: {
		fontFamily: `monospace`,
		whiteSpace: `pre`,
		margin: `1em 0`,
		display: `block`
	},
	mark: {
		backgroundColor: `yellow`,
		color: `black`
	},
	big: { fontSize: `larger` },
	small: { fontSize: `smaller` },
	s: { textDecoration: `line-through` },
	del: { textDecoration: `line-through` },
	sub: {
		fontSize: `smaller`,
		verticalAlign: `sub`
	},
	sup: {
		fontSize: `smaller`,
		verticalAlign: `super`
	},
	div: { display: `block` }
};
function t(t) {
	if (t !== !1) return t ?? e;
}
function n(e, t) {
	let n;
	for (let r in e) {
		if (!Object.hasOwn(e, r)) continue;
		let i = e[r];
		r === `children` || r === `className` || r === `class` || r === `id` || r === `style` || r === t || r === `ref` || r === `key` || r === `dangerouslySetInnerHTML` || r === `suppressHydrationWarning` || i == null || i === !1 || typeof i == `function` || typeof i == `symbol` || typeof i != `object` && (n ??= {}, n[r] = i === !0 ? `` : String(i));
	}
	return n;
}
var r = /* @__PURE__ */ new Set([
	`head`,
	`meta`,
	`link`,
	`style`,
	`script`
]);
function i(e) {
	return r.has(e);
}
function a(e, t) {
	return e.type === t && `props` in e;
}
function o(e) {
	return e.replace(/([A-Z])/g, `-$1`).toLowerCase();
}
function s$1(e) {
	return typeof e == `object` && !!e && `type` in e;
}
function c$1(e) {
	return typeof e == `function`;
}
var l$1 = Symbol.for(`react.forward_ref`);
var u$1 = Symbol.for(`react.memo`);
var d$1 = Symbol.for(`react.fragment`);
function f$1(e) {
	return e.$$typeof === l$1;
}
function p$1(e) {
	return e.$$typeof === u$1;
}
function m$1(e) {
	return e.type === d$1;
}
//#endregion
//#region node_modules/@takumi-rs/helpers/dist/jsx.mjs
var h$1;
function g$1(e, t) {
	return typeof e == `object` && e && t in e ? e[t] : void 0;
}
function _$1(e) {
	return typeof e == `object` && !!e && `then` in e && typeof e.then == `function`;
}
function v$1(e) {
	let t = g$1(e, `__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`);
	if (typeof t == `object` && t && `H` in t) {
		let e = t;
		return {
			get: () => e.H,
			set: (t) => {
				e.H = t;
			}
		};
	}
	let n = g$1(g$1(e, `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`), `ReactCurrentDispatcher`);
	if (typeof n == `object` && n && `current` in n) {
		let e = n;
		return {
			get: () => e.current,
			set: (t) => {
				e.current = t;
			}
		};
	}
	return null;
}
function y$1() {
	return h$1 ??= import("./react.react-server-CbcymVbA.js").then((m) => /* @__PURE__ */ __toESM$1(m.default, 1)).then((e) => v$1(e.default ?? e)).catch(() => null), h$1;
}
function b$1(e, t) {
	return e.contexts.has(t) ? e.contexts.get(t) : g$1(t, `_currentValue`);
}
var x$1 = () => {};
function ee(e, t) {
	let n = (t) => b$1(e, t), r = 0;
	return {
		readContext: n,
		useContext: n,
		use: (e) => {
			if (_$1(e)) {
				if (e.status === `fulfilled`) return e.value;
				throw e.status === `rejected` ? e.reason : e;
			}
			return n(e);
		},
		useState: (e) => [typeof e == `function` ? e() : e, x$1],
		useReducer: (e, t, n) => [n ? n(t) : t, x$1],
		useMemo: (e) => e(),
		useCallback: (e) => e,
		useRef: (e) => ({ current: e }),
		useEffect: x$1,
		useLayoutEffect: x$1,
		useInsertionEffect: x$1,
		useImperativeHandle: x$1,
		useDebugValue: x$1,
		useDeferredValue: (e) => e,
		useTransition: () => [!1, x$1],
		useOptimistic: (e) => [e, x$1],
		useActionState: (e, t) => [
			t,
			x$1,
			!1
		],
		useSyncExternalStore: (e, t, n) => (n ?? t)(),
		useId: () => `:t${t}-${r++}:`,
		useCacheRefresh: () => x$1,
		useHostTransitionStatus: () => ({
			pending: !1,
			data: null,
			method: null,
			action: null
		})
	};
}
async function te(e, t, n) {
	let r = await y$1();
	if (!r) return e(t);
	let i = n.ids.current++;
	for (let a = 0;; a++) {
		let o = r.get();
		r.set(ee(n, i));
		let s;
		try {
			return e(t);
		} catch (e) {
			s = e;
		} finally {
			r.set(o);
		}
		if (!_$1(s) || a >= 64) throw s;
		await S$1(s);
	}
}
async function S$1(e) {
	try {
		e.value = await e, e.status = `fulfilled`;
	} catch (t) {
		e.reason = t, e.status = `rejected`;
	}
}
function C$1(e) {
	return typeof e == `string` || typeof e == `number`;
}
function w$1(e) {
	return e.replace(/&/g, `&amp;`).replace(/"/g, `&quot;`).replace(/</g, `&lt;`).replace(/>/g, `&gt;`);
}
function T$1(e) {
	let t = [];
	for (let n in e) Object.hasOwn(e, n) && t.push(`${o(n)}:${String(e[n]).trim()}`);
	return t.join(`;`);
}
var E$1 = new Set(`stopColor.stopOpacity.strokeWidth.strokeDasharray.strokeDashoffset.strokeLinecap.strokeLinejoin.fillRule.clipRule.colorInterpolationFilters.floodColor.floodOpacity.accentHeight.alignmentBaseline.arabicForm.baselineShift.capHeight.clipPath.clipPathUnits.colorInterpolation.colorProfile.colorRendering.enableBackground.fillOpacity.fontFamily.fontSize.fontSizeAdjust.fontStretch.fontStyle.fontVariant.fontWeight.glyphName.glyphOrientationHorizontal.glyphOrientationVertical.horizAdvX.horizOriginX.imageRendering.letterSpacing.lightingColor.markerEnd.markerMid.markerStart.overlinePosition.overlineThickness.paintOrder.preserveAspectRatio.pointerEvents.shapeRendering.strokeMiterlimit.strokeOpacity.textAnchor.textDecoration.textRendering.transformOrigin.underlinePosition.underlineThickness.unicodeBidi.unicodeRange.unitsPerEm.vectorEffect.vertAdvY.vertOriginX.vertOriginY.vAlphabetic.vHanging.vIdeographic.vMathematical.wordSpacing.writingMode`.split(`.`));
function D$1(e, t) {
	if (e === `children` || t == null) return;
	let n;
	if (n = e === `className` ? `class` : E$1.has(e) ? o(e) : e, typeof t == `boolean`) return `${n}="${String(t)}"`;
	if (e === `style` && typeof t == `object`) {
		let e = T$1(t);
		if (e) return `style="${w$1(e)}"`;
	}
	return `${n}="${w$1(String(t))}"`;
}
function O$1(e, t, n) {
	let r = !1;
	for (let n in e) {
		if (!Object.hasOwn(e, n)) continue;
		let i = D$1(n, e[n]);
		i !== void 0 && (t.push(` `, i), n === `xmlns` && (r = !0));
	}
	n && !r && t.push(` xmlns="http://www.w3.org/2000/svg"`);
}
var k$1 = (e, t, n) => {
	let r = e.props || {};
	if (c$1(e.type)) {
		A$1(e.type(e.props), t, !1);
		return;
	}
	if (typeof e.type == `symbol` || typeof e.type != `string`) return;
	t.push(`<`, e.type), O$1(r, t, n && e.type === `svg`);
	let i = r.children;
	t.push(`>`), A$1(i, t, !1), t.push(`</`, e.type, `>`);
};
function A$1(e, t, n) {
	if (!(e == null || e === !1)) {
		if (C$1(e)) {
			t.push(String(e));
			return;
		}
		if (Array.isArray(e)) {
			for (let n of e) A$1(n, t, !1);
			return;
		}
		s$1(e) && k$1(e, t, n);
	}
}
function j$1(e) {
	let t = [];
	return A$1(e, t, !0), t.join(``);
}
function M$1() {
	return {
		nodes: [],
		stylesheets: []
	};
}
async function N$1(t$3, n) {
	let i = await P$1(t$3, {
		defaultStyles: F(n),
		presets: t(n?.defaultStyles),
		tailwindClassesProperty: n?.tailwindClassesProperty ?? `tw`,
		contexts: /* @__PURE__ */ new Map(),
		ids: { current: 0 }
	}), a = i.nodes, o;
	return o = a.length === 0 ? r$2({}) : a.length === 1 && a[0] !== void 0 ? a[0] : r$2({
		children: a,
		style: {
			width: s$3(100),
			height: s$3(100)
		}
	}), {
		node: o,
		stylesheets: i.stylesheets
	};
}
async function P$1(e, t) {
	return e == null || e === !1 ? M$1() : e instanceof Promise ? P$1(await e, t) : typeof e == `object` && Symbol.iterator in e ? ae(e, t) : s$1(e) ? await X(e, t) : {
		nodes: [i$2({
			text: String(e),
			preset: t.presets?.span
		})],
		stylesheets: []
	};
}
function F(e$2) {
	return e$2 && `defaultStyles` in e$2 ? e$2.defaultStyles ?? e : e;
}
var I = Symbol.for(`react.context`);
var L = Symbol.for(`react.provider`);
var R = Symbol.for(`react.consumer`);
function z(e, t) {
	let n = e.type;
	if (typeof n != `object` || !n) return;
	let r = g$1(n, `$$typeof`);
	if (r === L) return B(e, g$1(n, `_context`), t);
	if (r === R) return H(e, g$1(n, `_context`) ?? n, t);
	if (r === I) return typeof G(e) == `function` ? H(e, n, t) : B(e, n, t);
}
function B(e, t, n) {
	let r = new Map(n.contexts);
	return r.set(t, g$1(e.props, `value`)), $(e, {
		...n,
		contexts: r
	});
}
function V(e) {
	return typeof e == `function`;
}
function H(e, t, n) {
	let r = G(e);
	return V(r) ? P$1(r(b$1(n, t)), n) : $(e, n);
}
async function U(e, t, n) {
	return P$1(await te(e, t, n), n);
}
function W(e, t) {
	if (!(typeof e.type != `object` || e.type === null)) {
		if (f$1(e.type) && `render` in e.type) {
			let n = e.type;
			return U((e) => n.render(e, null), e.props, t);
		}
		if (p$1(e.type) && `type` in e.type) {
			let n = e.type.type;
			return c$1(n) ? U(n, e.props, t) : X({
				...e,
				type: n
			}, t);
		}
	}
}
function G(e) {
	if (typeof e.props == `object` && e.props !== null && `children` in e.props) return e.props.children;
}
function K(e) {
	if (!s$1(e)) return;
	let t = G(e);
	if (typeof t == `string`) return t;
	if (typeof t == `number`) return String(t);
	if (Array.isArray(t) || typeof t == `object` && t && Symbol.iterator in t) return Y(t);
	if (s$1(t) && m$1(t)) return K(t);
}
function q(e) {
	let t = [];
	for (let n of e) {
		let e = J(n);
		if (e === void 0) return;
		t.push(e);
	}
	return t.join(``);
}
function J(e) {
	if (typeof e == `string`) return e;
	if (typeof e == `number`) return String(e);
	if (e == null || typeof e == `boolean` || typeof e == `symbol`) return ``;
	if (typeof e == `object` && Symbol.iterator in e) return q(e);
	if (!s$1(e)) return;
	if (m$1(e)) return J(G(e));
	let t = G(e);
	return t === void 0 ? `` : typeof t == `object` && t && Symbol.iterator in t ? q(t) : J(t);
}
function Y(e) {
	let t = [], n = !1;
	for (let r of e) {
		if (s$1(r)) return;
		if (typeof r == `string`) {
			n = !0, t.push(r);
			continue;
		}
		if (typeof r == `number`) {
			n = !0, t.push(String(r));
			continue;
		}
		return;
	}
	if (n) return t.join(``);
}
async function X(e, t) {
	let i$3 = z(e, t);
	if (i$3 !== void 0) return i$3;
	if (c$1(e.type)) return U(e.type, e.props, t);
	let a$3 = W(e, t);
	if (a$3 !== void 0) return a$3;
	if (m$1(e)) return $(e, t);
	if (a(e, `style`)) {
		let t = J(G(e));
		return {
			nodes: [],
			stylesheets: t && t.length > 0 ? [t] : []
		};
	}
	if (typeof e.type != `string` || i(e.type)) return M$1();
	let o = Q(e, t);
	if (a(e, `br`)) return {
		nodes: [i$2({
			text: `
`,
			preset: t.presets?.span,
			...o
		})],
		stylesheets: []
	};
	if (a(e, `img`)) return {
		nodes: [Z(e, t)],
		stylesheets: []
	};
	if (a(e, `svg`)) return {
		nodes: [ne(e, t)],
		stylesheets: []
	};
	let c = K(e);
	if (c !== void 0) return {
		nodes: [i$2({
			text: c,
			...o
		})],
		stylesheets: []
	};
	let f = await $(e, t);
	return {
		nodes: [r$2({
			children: f.nodes,
			...o
		})],
		stylesheets: f.stylesheets
	};
}
function Z(e, n) {
	if (!e.props.src) throw Error(`Image element must have a 'src' prop.`);
	let r = Q(e, n), i = e.props.width === void 0 ? void 0 : Number(e.props.width), a = e.props.height === void 0 ? void 0 : Number(e.props.height);
	return a$2({
		src: e.props.src,
		width: i,
		height: a,
		...r
	});
}
function ne(e, n) {
	let r = Q(e, n);
	return a$2({
		src: j$1(e),
		width: e.props.width === void 0 ? void 0 : Number(e.props.width),
		height: e.props.height === void 0 ? void 0 : Number(e.props.height),
		...r
	});
}
function re(e, t) {
	let n = t.presets, r = n && typeof e.type == `string` && e.type in n ? n[e.type] : void 0, i = typeof e.props == `object` && e.props !== null && `style` in e.props && typeof e.props.style == `object` && e.props.style !== null ? e.props.style : void 0;
	if (!i) return { preset: r };
	for (let e in i) if (Object.hasOwn(i, e)) return {
		preset: r,
		style: i
	};
	return { preset: r };
}
function ie(e, t) {
	let n = t.tailwindClassesProperty;
	if (typeof e.props != `object` || e.props === null || !(n in e.props)) return;
	let r = e.props[n];
	if (typeof r == `string`) return r;
}
function Q(e, t) {
	let n$3 = e.props, { preset: r, style: i } = re(e, t), a = ie(e, t), o = n(n$3, t.tailwindClassesProperty);
	return {
		tagName: typeof e.type == `string` ? e.type : void 0,
		className: n$3.className ?? n$3.class,
		id: n$3.id,
		dir: n$3.dir,
		lang: n$3.lang,
		attributes: o,
		tw: a,
		style: i,
		preset: r
	};
}
function $(e, t) {
	let n = G(e);
	return n === void 0 ? Promise.resolve(M$1()) : P$1(n, t);
}
async function ae(e, t) {
	let n = [], r = /* @__PURE__ */ new Set(), i = 0;
	for (let a of e) {
		let e = i;
		i += 1;
		let o = P$1(a, t).then((t) => {
			n[e] = t;
		}).finally(() => r.delete(o));
		r.add(o), r.size >= 8 && await Promise.race(r);
	}
	await Promise.all(r);
	let a = [], o = [];
	for (let e of n) e && (a.push(...e.nodes), o.push(...e.stylesheets));
	return {
		nodes: a,
		stylesheets: o
	};
}
//#endregion
//#region node_modules/takumi-js/dist/backend/node.mjs
var loadNative = () => import("./export-D5LC-e7L.js").catch((cause) => {
	throw new Error("Failed to load the native @takumi-rs/core backend. On a runtime without the native addon, pass a `module` (a WASM binary) to render with the WASM backend instead.", { cause });
});
var loadWasm = (module) => import("./wasm-node-BsD8jxba-BEHK2BSb.js").then((backend) => backend.loadBackend(module));
var loadBackend = (module) => typeof process !== "undefined" && process.versions?.webcontainer ? loadWasm(module) : loadNative(module);
//#endregion
//#region node_modules/@takumi-rs/helpers/dist/html.mjs
var s = Symbol(`Fragment`);
var c = /* @__PURE__ */ new Set([
	`area`,
	`base`,
	`br`,
	`col`,
	`embed`,
	`hr`,
	`img`,
	`input`,
	`keygen`,
	`link`,
	`meta`,
	`param`,
	`source`,
	`track`,
	`wbr`
]);
var l = /* @__PURE__ */ new Set([`script`, `style`]);
var u = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:-]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!)([\s\S]*?)(>))/gm;
var d = /[\@\.a-z0-9_\:\-]/i;
function f(e) {
	let t = {};
	if (e) {
		let n = `none`, r, i = ``, a, o;
		for (let s = 0; s < e.length; s++) {
			let c = e[s];
			n === `none` ? d.test(c) ? (r && (t[r] = i, r = void 0, i = ``), a = s, n = `key`) : c === `=` && r && (n = `value`) : n === `key` ? d.test(c) || (r = e.substring(a, s), n = c === `=` ? `value` : `none`) : c === o && s > 0 && e[s - 1] !== `\\` ? o && (i = e.substring(a, s), o = void 0, n = `none`) : (c === `"` || c === `'`) && !o && (a = s + 1, o = c);
		}
		n === `key` && a != null && a < e.length && (r = e.substring(a, e.length)), r && (t[r] = i);
	}
	return t;
}
function p(e) {
	let t = typeof e == `string` ? e : e.value, n, r, i, a, o, s, d, p, m, h = [];
	u.lastIndex = 0, r = n = {
		type: 0,
		children: []
	};
	let g = 0;
	function _() {
		a = t.substring(g, u.lastIndex - i[0].length), a && r.children.push({
			type: 2,
			value: a,
			parent: r
		});
	}
	for (; i = u.exec(t);) {
		if (s = i[5] || i[8], d = i[6] || i[9], p = i[7] || i[10], l.has(r.name) && i[2] !== r.name) {
			o = u.lastIndex - i[0].length, r.children.length > 0 && (r.children[0].value += i[0]);
			continue;
		} else if (s === `<!--`) {
			if (o = u.lastIndex - i[0].length, l.has(r.name)) continue;
			m = {
				type: 3,
				value: d,
				parent: r,
				loc: [{
					start: o,
					end: o + s.length
				}, {
					start: u.lastIndex - p.length,
					end: u.lastIndex
				}]
			}, h.push(m), m.parent.children.push(m);
		} else if (s === `<!`) o = u.lastIndex - i[0].length, m = {
			type: 4,
			value: d,
			parent: r,
			loc: [{
				start: o,
				end: o + s.length
			}, {
				start: u.lastIndex - p.length,
				end: u.lastIndex
			}]
		}, h.push(m), m.parent.children.push(m);
		else if (i[1] !== `/`) if (_(), l.has(r.name)) {
			g = u.lastIndex, _();
			continue;
		} else m = {
			type: 1,
			name: i[2] + ``,
			attributes: f(i[3]),
			parent: r,
			children: [],
			loc: [{
				start: u.lastIndex - i[0].length,
				end: u.lastIndex
			}]
		}, h.push(m), m.parent.children.push(m), i[4] && i[4].indexOf(`/`) > -1 || c.has(m.name) ? (m.loc[1] = m.loc[0], m.isSelfClosingTag = !0) : r = m;
		else _(), i[2] + `` === r.name ? (m = r, r = m.parent, m.loc.push({
			start: u.lastIndex - i[0].length,
			end: u.lastIndex
		}), a = t.substring(m.loc[0].end, m.loc[1].start), m.children.length === 0 && m.children.push({
			type: 2,
			value: a,
			parent: r
		})) : i[2] + `` === h[h.length - 1].name && h[h.length - 1].isSelfClosingTag === !0 && (m = h[h.length - 1], m.loc.push({
			start: u.lastIndex - i[0].length,
			end: u.lastIndex
		}));
		g = u.lastIndex;
	}
	return a = t.slice(g), r.children.push({
		type: 2,
		value: a,
		parent: r
	}), n;
}
var m = Symbol(`HTMLString`);
var h = Symbol(`AttrString`);
var g = Symbol(`RenderFn`);
function _(e, t = [m]) {
	let n = { value: e };
	for (let e of t) Object.defineProperty(n, e, {
		value: !0,
		enumerable: !1,
		writable: !1
	});
	return n;
}
var v = {
	"&": `&amp;`,
	"<": `&lt;`,
	">": `&gt;`
};
function y(e) {
	return e.replace(/[&<>]/g, (e) => v[e] || e);
}
function b(e) {
	let t = ``;
	for (let [n, r] of Object.entries(e)) t += ` ${n}="${r}"`;
	return _(t, [m, h]);
}
function x(e) {
	if (e.children.length === 0) {
		let t = e;
		for (; t = t.parent;) if (t.name === `svg`) return !0;
	}
	return !1;
}
function S(e) {
	let { name: t, attributes: n = {} } = e, r = e.children.map((e) => C(e)).join(``);
	if (g in e) {
		let t = e[g](n, _(r));
		return t && t[m] ? t.value : y(String(t));
	}
	if (t === s) return r;
	let i = x(e);
	return i || c.has(t) ? `<${e.name}${b(n).value}${i ? ` /` : ``}>` : `<${e.name}${b(n).value}>${r}</${e.name}>`;
}
function C(e) {
	switch (e.type) {
		case 0: return e.children.map((e) => C(e)).join(``);
		case 1: return S(e);
		case 2: return `${e.value}`;
		case 3: return `<!--${e.value}-->`;
		case 4: return `<!${e.value}>`;
	}
}
function w(e, t$2) {
	let n = p(e), r = {
		nodes: [],
		stylesheets: []
	}, i = t(t$2?.defaultStyles), a = t$2?.tailwindClassesProperty ?? `tw`;
	for (let e of n.children) T(e, i, a, r.nodes, r.stylesheets);
	return r;
}
function T(e, a, o, s, c) {
	if (e.type === 3) return;
	if (e.type === 2) {
		let t = e.value ?? ``;
		t && s.push(i$2({
			text: t,
			preset: a?.span
		}));
		return;
	}
	if (e.type === 0) {
		for (let t of e.children) T(t, a, o, s, c);
		return;
	}
	if (e.type !== 1) return;
	let l = e;
	if (l.name === `style`) {
		let e = ``;
		for (let t of l.children) t.type === 2 && typeof t.value == `string` && (e += t.value);
		e && c.push(e);
		return;
	}
	let u = E(l, a, o);
	if (l.name === `br`) {
		s.push(i$2({
			text: `
`,
			preset: a?.span,
			...u
		}));
		return;
	}
	if (l.name === `img`) {
		let e = l.attributes?.src;
		if (!e) throw Error(`Image element must have a 'src' prop.`);
		s.push(a$2({
			src: e,
			width: N(l.attributes?.width),
			height: N(l.attributes?.height),
			...u
		}));
		return;
	}
	if (i(l.name)) return;
	if (l.name === `svg`) {
		s.push(a$2({
			src: C(l),
			width: N(l.attributes?.width),
			height: N(l.attributes?.height),
			...u
		}));
		return;
	}
	let d = !0, f = ``;
	for (let e of l.children) if (e.type !== 3) {
		if (e.type !== 2) {
			d = !1;
			break;
		}
		f += e.value ?? ``;
	}
	if (d && f) {
		s.push(i$2({
			text: f,
			...u
		}));
		return;
	}
	let p = [];
	for (let e of l.children) T(e, a, o, p, c);
	s.push(r$2({
		children: p,
		...u
	}));
}
function E(e, t, n$2) {
	let r = e.attributes ? D(e.attributes) : {}, i = typeof r.style == `string` ? j(r.style) : void 0, o = n(r, n$2), s = typeof r[n$2] == `string` ? r[n$2] : void 0, c = t && e.name in t ? t[e.name] : void 0;
	return {
		tagName: e.name,
		className: r.class,
		id: r.id,
		dir: r.dir,
		lang: r.lang,
		attributes: o,
		tw: s,
		style: i,
		preset: c
	};
}
function D(e) {
	let t = {};
	for (let n in e) {
		let r = e[n];
		r !== void 0 && (t[n] = O(r));
	}
	return t;
}
function O(e) {
	return e.includes(`&`) ? e.replace(/&(?:#(\d+)|#x([\da-fA-F]+)|([a-zA-Z][\w-]+));/g, (e, t, n, r) => t ? k(Number(t)) ?? e : n ? k(Number.parseInt(n, 16)) ?? e : A[r] ?? e) : e;
}
function k(e) {
	if (!(!Number.isInteger(e) || e < 0 || e > 1114111)) try {
		return String.fromCodePoint(e);
	} catch {
		return;
	}
}
var A = {
	amp: `&`,
	apos: `'`,
	gt: `>`,
	lt: `<`,
	nbsp: `\xA0`,
	quot: `"`
};
function j(e) {
	let t = {};
	for (let n of e.split(`;`)) {
		let [e, ...r] = n.split(`:`);
		if (!e || r.length === 0) continue;
		let i = e.trim(), a = r.join(`:`).trim();
		!i || !a || (t[M(i)] = a);
	}
	return Object.keys(t).length > 0 ? t : void 0;
}
function M(e) {
	return e.startsWith(`--`) ? e : e.replace(/-([a-z])/g, (e, t) => t.toUpperCase());
}
function N(e) {
	if (!e) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function P(t) {
	let { nodes: n, stylesheets: i } = w(t);
	return n.length === 0 ? {
		node: r$2({}),
		stylesheets: i
	} : n.length === 1 && n[0] ? {
		node: n[0],
		stylesheets: i
	} : {
		node: r$2({
			style: {
				width: s$3(100),
				height: s$3(100)
			},
			children: n
		}),
		stylesheets: i
	};
}
//#endregion
//#region node_modules/takumi-js/dist/render-dwxU78no.mjs
var importPromise = null;
/**
* Resolves the rendering backend once and caches it. With no `module`, the
* `#backend` import conditions pick it (napi on Node/Bun, WASM elsewhere). An
* explicit `module` is a WASM binary, so it forces WASM — the escape hatch for a
* Node target that can't load the native addon. A failed load clears the cache.
*/
function getImports(module) {
	importPromise ??= (module === void 0 ? loadBackend() : import("./wasm-init-DzwbPAKW-HE29nVRc.js").then((n) => n.n).then(({ initWasm }) => initWasm(module))).catch((error) => {
		importPromise = null;
		throw error;
	});
	return importPromise;
}
var globalRenderer;
function isTakumiNode(element) {
	if (typeof element !== "object" || element === null || !("type" in element)) return false;
	return element.type === "container" || element.type === "text" || element.type === "image";
}
async function transformElement(element, options) {
	if (isTakumiNode(element)) return {
		node: element,
		stylesheets: []
	};
	if (typeof element === "string") return P(element);
	return N$1(element, options?.jsx);
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
		node: emojiType !== "from-font" ? h$2(originalNode, emojiType) : originalNode,
		stylesheets
	};
}
/** Resolves the render's `images` option into concrete entries via {@link prepareImages}. */
async function collectImages(node, options) {
	const images = options?.images;
	const { sources, fetchCache, fetch, timeout, maxBytes, allowUrl, cache } = Array.isArray(images) ? { sources: images } : images ?? {};
	const prepared = await c$3({
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
//#endregion
//#region node_modules/takumi-js/dist/response.mjs
var contentTypeMap = {
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
			const image = await render(element, options);
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
//#region node_modules/fumapress/dist/plugins/takumi.js
function takumiPlugin(options = {}) {
	const { width = 1200, height = 630, generate = function fn(page) {
		return { node: generateDefault({
			title: page.data.title,
			description: page.data.description,
			site: this.siteConfig.name
		}) };
	} } = options;
	let basePath;
	function slugsToImagePath(slugs, lang) {
		const segments = [...slugs];
		if (segments.length === 0) segments.push("index.webp");
		else segments[segments.length - 1] += ".webp";
		return {
			staticPath: lang ? [lang, ...segments] : segments,
			pathname: joinPathname(lang ?? "", basePath, ...segments)
		};
	}
	function imagePathToSlugs(segs) {
		if (segs.length === 0) return segs;
		const slugs = [...segs];
		slugs[slugs.length - 1] = slugs[slugs.length - 1].replace(/\.webp$/, "");
		if (slugs.length === 1 && slugs[0] === "index") slugs.pop();
		return slugs;
	}
	return {
		name: "core:takumi",
		init() {
			const renderMode = this.mode === "default" ? "static" : this.mode;
			basePath = options.basePath ?? (renderMode === "dynamic" ? "/_takumi" : "/");
			(this.data["core:page-meta"] ??= []).push((page) => {
				const pathname = slugsToImagePath(page.slugs, page.locale).pathname;
				return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
						property: "og:image",
						content: this.siteConfig.baseUrl ? new URL(pathname, this.siteConfig.baseUrl).href : pathname
					}),
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
						property: "og:image:width",
						content: `${width}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
						property: "og:image:height",
						content: `${height}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
						property: "twitter:card",
						content: "summary_large_image"
					})
				] });
			});
		},
		async createPages({ createApiIsomorphic }) {
			createApiIsomorphic({
				render: this.mode === "default" ? "static" : this.mode,
				path: joinPathname(this.i18nConfig ? "[lang]" : "", basePath, "[...slugs]"),
				staticPaths: (await this.getLoader()).getPages().map((page) => slugsToImagePath(page.slugs, page.locale).staticPath),
				handler: async (_, { params }) => {
					const page = (await this.getLoader()).getPage(imagePathToSlugs(params.slugs), params.lang);
					if (!page) unstable_notFound();
					const { node, options } = await generate.call(this, page);
					return new ImageResponse(node, {
						width,
						height,
						...options,
						format: "webp"
					});
				}
			});
		}
	};
}
function generateDefault({ site, title, description }) {
	const primaryColor = "rgba(255,150,255,0.3)";
	const primaryTextColor = "rgb(255,150,255)";
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			width: "100%",
			height: "100%",
			color: "white",
			padding: "4rem",
			backgroundColor: "#0c0c0c",
			borderBottom: `18px solid ${primaryColor}`
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("p", {
				style: {
					fontWeight: 800,
					fontSize: "82px",
					margin: 0
				},
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("p", {
				style: {
					fontSize: "52px",
					color: "rgba(240,240,240,0.8)",
					margin: 0,
					marginTop: "16px",
					paddingBottom: "28px",
					borderBottom: `10px dashed ${primaryColor}`
				},
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: "20px",
					marginTop: "auto",
					color: primaryTextColor
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("svg", {
					xmlns: "http://www.w3.org/2000/svg",
					width: "56",
					height: "56",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					className: "lucide lucide-book-icon lucide-book",
					children: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "11",
						stroke: primaryTextColor,
						strokeWidth: "2"
					})
				}), site && /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("p", {
					style: {
						fontSize: "56px",
						fontWeight: 600,
						margin: 0
					},
					children: site
				})]
			})
		]
	});
}
//#endregion
//#region node_modules/fumadocs-ui/dist/layouts/notebook/client.js
var LayoutBody = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"LayoutBody\"");
}), "859200a8131f", "LayoutBody");
//#endregion
//#region node_modules/fumadocs-ui/dist/layouts/notebook/index.js
function DocsLayout({ tree, tabMode = "sidebar", sidebar: { tabs: defaultTabs, ...sidebarProps } = {}, children, tabs = defaultTabs, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(LayoutBody, {
		tree,
		tabs: (0, import_react_react_server.useMemo)(() => {
			if (Array.isArray(tabs)) return tabs;
			if (typeof tabs === "object") return getLayoutTabs(tree, tabs);
			if (tabs !== false) return getLayoutTabs(tree);
			return [];
		}, [tabs, tree]),
		tabMode,
		sidebar: sidebarProps,
		...props,
		children
	});
}
//#endregion
//#region node_modules/fumadocs-ui/dist/layouts/notebook/page/index.js
/**
* Add typography styles
*/
var DocsBody = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"DocsBody\"");
}), "4e8efe524788", "DocsBody");
var DocsDescription = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"DocsDescription\"");
}), "4e8efe524788", "DocsDescription");
var DocsPage = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"DocsPage\"");
}), "4e8efe524788", "DocsPage");
var DocsTitle = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"DocsTitle\"");
}), "4e8efe524788", "DocsTitle");
var MarkdownCopyButton = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"MarkdownCopyButton\"");
}), "4e8efe524788", "MarkdownCopyButton");
var PageLastUpdate = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"PageLastUpdate\"");
}), "4e8efe524788", "PageLastUpdate");
var ViewOptionsPopover = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"ViewOptionsPopover\"");
}), "4e8efe524788", "ViewOptionsPopover");
//#endregion
//#region node_modules/fumapress/dist/layouts/notebook.js
function createNotebookLayoutPage({ render, renderBody: renderDocsBody, inherit: { layoutProps: inheritLayoutProps = true } = {} } = {}) {
	const TDocsLayout = createTransformChildren(DocsLayout);
	const TDocsPage = createTransformChildren(DocsPage);
	return async function Layout({ lang, page }) {
		const ctx = getPressContext();
		const { getLoader, layouts, data: { "core:notebook-layout": layoutData } } = ctx;
		const source = await getLoader();
		const inherited = inheritLayoutProps ? await layouts.defaultProps?.call(ctx, { lang }) : void 0;
		const _raw = await render?.call(ctx, page);
		const layoutProps = mergeLayoutConfigs(baseLayoutProps(ctx), inherited, _raw?.layoutProps);
		layoutProps.tree ??= source.getPageTree(lang);
		let result = {
			..._raw,
			lastModified: _raw?.lastModified ?? await getLastModifiedDate(ctx, page),
			pageProps: {
				..._raw?.pageProps,
				toc: _raw?.pageProps?.toc ?? await renderToc(ctx, page)
			},
			body: _raw?.body ?? await renderBody(ctx, page, "[Fumapress] Please specify the `render` option in createNotebookLayoutPage()"),
			layoutProps
		};
		if (layoutData?.renderers) {
			const renderCtx = { page };
			for (const r of layoutData.renderers) result = await r.call(renderCtx, result);
		}
		let dynamicDocsBody = (props) => /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(DocsBody, { ...props });
		if (renderDocsBody) dynamicDocsBody = (props) => renderDocsBody.call(ctx, {
			lang,
			page,
			props,
			default: dynamicDocsBody
		});
		return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(TDocsLayout, {
			props: result.layoutProps,
			children: [renderPageMeta(page, ctx), /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(TDocsPage, {
				props: result.pageProps,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(DocsTitle, { children: page.data.title }),
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(DocsDescription, {
						className: "mb-0",
						children: page.data.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)("div", {
						className: "flex flex-row gap-2 items-center border-b pt-2 pb-6",
						children: [result.markdownUrl && /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(MarkdownCopyButton, { markdownUrl: result.markdownUrl }), /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(ViewOptionsPopover, {
							markdownUrl: result.markdownUrl,
							githubUrl: page.absolutePath ? getGitHubFileUrl(ctx, page.absolutePath) : void 0
						})]
					}),
					dynamicDocsBody({ children: result.body }),
					result.lastModified && /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(PageLastUpdate, { date: result.lastModified })
				]
			})]
		});
	};
}
var meta_default$6 = {
	title: "IAM Management",
	pages: ["[Access Token](/administration/iam/access-token)"]
};
var meta_default$5 = {
	title: "Core Concepts",
	pages: ["[Erasure Coding](/concepts/principle/erasure-coding)"]
};
var meta_default$4 = {
	title: "SDK",
	pages: [
		"[Java](/developer/sdk/java)",
		"[Python](/developer/sdk/python)",
		"[Rust](/developer/sdk/rust)",
		"[JavaScript](/developer/sdk/javascript)",
		"[TypeScript](/developer/sdk/typescript)",
		"[Golang](/developer/sdk/go)",
		"[Other SDKs](/developer/sdk/other)"
	]
};
var meta_default$3 = {
	title: "Linux Installation",
	pages: [
		"[Linux Quick Installation](/installation/linux/quick-start)",
		"[Single Node Single Disk Installation](/installation/linux/single-node-single-disk)",
		"[Single Node Multiple Disk Installation](/installation/linux/single-node-multiple-disk)",
		"[Multiple Node Multiple Disk Installation](/installation/linux/multiple-node-multiple-disk)"
	]
};
var meta_default$2 = {
	title: "Bucket Management",
	pages: ["[Bucket Creation](/management/bucket/creation)", "[Bucket Deletion](/management/bucket/deletion)"]
};
var meta_default$1 = {
	title: "Object Management",
	pages: ["[Object Upload](/management/object/creation)", "[Object Deletion](/management/object/deletion)"]
};
var meta_default = {
	pages: [
		"---RustFS Installation Guide---",
		"installation/linux",
		"[Windows Installation](/installation/windows)",
		"[macOS Installation](/installation/macos)",
		"[Docker Installation](/installation/docker)",
		"---Installation Checklist---",
		"[Hardware Requirements](/installation/checklists/hardware-checklists)",
		"[Hardware Selection](/installation/checklists/hardware-selection)",
		"[Network Check](/installation/checklists/network-checklists)",
		"[Software Check](/installation/checklists/software-checklists)",
		"[Security Check](/installation/checklists/security-checklists)",
		"---RustFS Performance and Framework---",
		"[RustFS Performance Comparison](/concepts/comparison)",
		"[RustFS Design Architecture](/concepts/architecture)",
		"[Terminology Explanation](/concepts/glossary)",
		"[Usage Limitations](/concepts/limit)",
		"concepts/principle",
		"---Manage RustFS---",
		"management/bucket",
		"management/object",
		"[Object Scanner](/management/object/scanner)",
		"---Upgrade, Expansion and Uninstallation---",
		"[Overview](/upgrade-scale)",
		"[Availability and Expansion Explanation](/upgrade-scale/availability-and-resiliency)",
		"---Troubleshooting---",
		"[Overview](/troubleshooting)",
		"[Disk Failure](/troubleshooting/driver)",
		"[Object Inspection and Automatic Recovery](/troubleshooting/healing)",
		"[Node Failure](/troubleshooting/node)",
		"---System Administration---",
		"administration/iam",
		"---Integration---",
		"[Nginx Reverse Proxy Configuration](/integration/nginx)",
		"[Virtual Host Mode Configuration](/integration/virtual)",
		"[TLS Configuration](/integration/tls-configured)",
		"---Developer---",
		"[MCP](/developer/mcp)",
		"[MinIO Client](/developer/mc)",
		"developer/sdk",
		"[Open Source License](/developer/license)",
		"---Product Features---",
		"[Distributed](/features/distributed)",
		"[Log Management](/features/logging)",
		"[Version Control](/features/versioning)",
		"[S3 Compatibility](/features/s3-compatibility)",
		"[Object Level and Read-Only](/features/worm)",
		"[Cross-Region Replication](/features/replication)",
		"[Encryption](/features/encryption)",
		"[Lifecycle Management](/features/lifecycle)",
		"---Solutions---",
		"[Modern Data Lake](/features/data-lake)",
		"[AI and Machine Learning](/features/ai)",
		"[Cloud Native](/features/cloud-native)",
		"[Big Data Computing Storage Separation](/features/hdfs)",
		"[SQL Support](/features/sql-server)",
		"[Quantitative Trading](/features/quantitative-trading)",
		"[Manufacturing Cost Reduction](/features/industry)",
		"[Cold Archive Storage](/features/cold-archiving)",
		"[Video Storage Solution](/features/video)",
		"[Domestic Innovation and SM Solution](/features/domestic)"
	],
	root: true
};
//#endregion
//#region content/about/index.md?collection=docs&only=frontmatter
var frontmatter$86 = {
	"title": "About Us",
	"description": "RustFS is a cutting-edge open-source infrastructure solution for distributed object storage. It is a project driven by a global community of talented…"
};
//#endregion
//#region content/administration/iam/access-token.md?collection=docs&only=frontmatter
var frontmatter$85 = {
	"title": "RustFS Access Key Management",
	"description": "Creation, usage, and deletion of RustFS access keys."
};
//#endregion
//#region content/administration/iam/index.md?collection=docs&only=frontmatter
var frontmatter$84 = {
	"title": "RustFS IAM Management",
	"description": "Comprehensive guide to Identity and Access Management (IAM), including Users, Groups, Policies, and Access Keys."
};
//#endregion
//#region content/concepts/architecture.md?collection=docs&only=frontmatter
var frontmatter$83 = {
	"title": "RustFS Architecture",
	"description": "Introduction to RustFS Architecture"
};
//#endregion
//#region content/concepts/comparison.md?collection=docs&only=frontmatter
var frontmatter$82 = {
	"title": "RustFS vs Other Storage Products",
	"description": "Comparison of RustFS with mainstream object storage products"
};
//#endregion
//#region content/concepts/glossary.md?collection=docs&only=frontmatter
var frontmatter$81 = {
	"title": "Glossary",
	"description": "This article introduces commonly used vocabulary in object storage to help users quickly understand object storage"
};
//#endregion
//#region content/concepts/index.md?collection=docs&only=frontmatter
var frontmatter$80 = {
	"title": "RustFS Architecture Design and Core Concepts Explained",
	"description": "This article introduces vocabulary frequently used in object storage, helping users quickly understand object storage"
};
//#endregion
//#region content/concepts/introduction.md?collection=docs&only=frontmatter
var frontmatter$79 = {
	"title": "What is RustFS?",
	"description": "RustFS is an open-source, distributed object storage solution released under the Apache 2.0 license."
};
//#endregion
//#region content/concepts/limit.md?collection=docs&only=frontmatter
var frontmatter$78 = {
	"title": "Usage Limits",
	"description": "RustFS is a simple, efficient, distributed object storage. It is fully S3 compatible, open source software released under the Apache2 license."
};
//#endregion
//#region content/concepts/principle/erasure-coding.md?collection=docs&only=frontmatter
var frontmatter$77 = {
	"title": "Erasure Coding Principles",
	"description": "RustFS, as a new-generation distributed object storage system, demonstrates unique advantages in cloud storage through innovative architectural design and memory safety features. One of its core innovations is the deep application of Reed-Solomon Erasure Coding."
};
//#endregion
//#region content/concepts/principle/index.md?collection=docs&only=frontmatter
var frontmatter$76 = {
	"title": "RustFS Core Concepts Explained",
	"description": "Detailed explanation of RustFS core concepts, including erasure coding, stripes, Data Scanner, data self-healing, etc. Allows users to have a deeper understanding of RustFS."
};
//#endregion
//#region content/developer/index.md?collection=docs&only=frontmatter
var frontmatter$75 = {
	"title": "RustFS Developer Guide",
	"description": "Guide to using STS, MCP, MinIO Client, SDKs, and APIs with RustFS."
};
//#endregion
//#region content/developer/license.md?collection=docs&only=frontmatter
var frontmatter$74 = {
	"title": "RustFS Open Source License",
	"description": "RustFS is released under the Apache 2.0 license."
};
//#endregion
//#region content/developer/mc.md?collection=docs&only=frontmatter
var frontmatter$73 = {
	"title": "Manage RustFS Objects with MinIO Client",
	"description": "Manage RustFS objects using the MinIO Client."
};
//#endregion
//#region content/developer/mcp.md?collection=docs&only=frontmatter
var frontmatter$72 = {
	"title": "RustFS MCP",
	"description": "RustFS MCP Usage Guide"
};
//#endregion
//#region content/developer/sdk/go.md?collection=docs&only=frontmatter
var frontmatter$71 = {
	"title": "Golang SDK Guide",
	"description": "Use the Golang SDK to operate on RustFS instances, including creating and deleting buckets and objects."
};
//#endregion
//#region content/developer/sdk/index.md?collection=docs&only=frontmatter
var frontmatter$70 = {
	"title": "RustFS SDK Overview",
	"description": "Overview of supported S3 SDKs for RustFS."
};
//#endregion
//#region content/developer/sdk/java.md?collection=docs&only=frontmatter
var frontmatter$69 = {
	"title": "Java SDK Guide",
	"description": "Guide to using the Java SDK with RustFS."
};
//#endregion
//#region content/developer/sdk/javascript.md?collection=docs&only=frontmatter
var frontmatter$68 = {
	"title": "JavaScript SDK Guide",
	"description": "Guide to using the JavaScript SDK with RustFS."
};
//#endregion
//#region content/developer/sdk/other.md?collection=docs&only=frontmatter
var frontmatter$67 = {
	"title": "Other SDKs",
	"description": "This article mainly explains the usage of various other language SDKs in RustFS."
};
//#endregion
//#region content/developer/sdk/python.md?collection=docs&only=frontmatter
var frontmatter$66 = {
	"title": "Python SDK Guide",
	"description": "Guide to using the Python SDK with RustFS."
};
//#endregion
//#region content/developer/sdk/rust.md?collection=docs&only=frontmatter
var frontmatter$65 = {
	"title": "Rust SDK Guide",
	"description": "Operating RustFS instances through Rust SDK, including creation and deletion of buckets and objects."
};
//#endregion
//#region content/developer/sdk/typescript.md?collection=docs&only=frontmatter
var frontmatter$64 = {
	"title": "RustFS TypeScript SDK Usage Guide",
	"description": "Operating RustFS instances through TypeScript SDK, including creation and deletion of buckets and objects."
};
//#endregion
//#region content/features/ai/index.md?collection=docs&only=frontmatter
var frontmatter$63 = {
	"title": "AI Revolution Powered by GPUs and High-Performance Object Storage",
	"description": "The High-Performance Object Storage for AI"
};
//#endregion
//#region content/features/aliyun/index.md?collection=docs&only=frontmatter
var frontmatter$62 = {
	"title": "RustFS for Alibaba Cloud Kubernetes Service",
	"description": "RustFS provides high-performance object storage for Alibaba Cloud ACK with hybrid cloud capabilities and enterprise features."
};
//#endregion
//#region content/features/aws-elastic/index.md?collection=docs&only=frontmatter
var frontmatter$61 = {
	"title": "RustFS for Amazon Elastic Kubernetes Service (EKS)",
	"description": "RustFS provides high-performance object storage for Amazon EKS with enterprise-grade features and multi-cloud capabilities."
};
//#endregion
//#region content/features/baremetal/index.md?collection=docs&only=frontmatter
var frontmatter$60 = {
	"title": "Bare Metal and Virtualized Deployment",
	"description": "Open source, S3-compatible, and enterprise-hardened."
};
//#endregion
//#region content/features/cloud-native/index.md?collection=docs&only=frontmatter
var frontmatter$59 = {
	"title": "Hybrid/Multi-Cloud Object Storage",
	"description": "Hybrid/multi-cloud architecture enables consistent performance, security, and economics across different environments."
};
//#endregion
//#region content/features/cold-archiving/index.md?collection=docs&only=frontmatter
var frontmatter$58 = {
	"title": "Object Storage Cold Archiving Solution",
	"description": "Built for century-long data storage, constructing secure, intelligent, and sustainable cold data infrastructure"
};
//#endregion
//#region content/features/commvault/index.md?collection=docs&only=frontmatter
var frontmatter$57 = {
	"title": "High-Performance Object Storage for Commvault Backup, Recovery and Replication",
	"description": "Simple. Scalable. Fast. Ransomware-resistant. In other words, exactly what you want."
};
//#endregion
//#region content/features/data-lake/index.md?collection=docs&only=frontmatter
var frontmatter$56 = {
	"title": "RustFS for Modern Data Lakes",
	"description": "Modern data lakes and lakehouse architectures rely on object storage. RustFS provides a unified storage solution for modern data lakes/lakehouses that can…"
};
//#endregion
//#region content/features/distributed/index.md?collection=docs&only=frontmatter
var frontmatter$55 = {
	"title": "Infrastructure for Large-Scale Data",
	"description": "RustFS is designed for scaling - technical scale, operational scale, and economic scale."
};
//#endregion
//#region content/features/domestic/index.md?collection=docs&only=frontmatter
var frontmatter$54 = {
	"title": "Sovereign Cloud & Compliance Solutions",
	"description": "We provide complete storage compliance and innovation solutions from hardware and operating systems to classified and encryption systems."
};
//#endregion
//#region content/features/encryption/index.md?collection=docs&only=frontmatter
var frontmatter$53 = {
	"title": "Data Encryption",
	"description": "Server-side encryption in RustFS with SSE-S3 and SSE-C, designed to minimize performance overhead."
};
//#endregion
//#region content/features/hdfs/index.md?collection=docs&only=frontmatter
var frontmatter$52 = {
	"title": "HDFS Replacement",
	"description": "RustFS provides a modern, high-performance alternative to traditional Hadoop HDFS."
};
//#endregion
//#region content/features/huaweicloud/index.md?collection=docs&only=frontmatter
var frontmatter$51 = {
	"title": "RustFS for Huawei Cloud CCE Kubernetes Service",
	"description": "RustFS provides high-performance object storage for Huawei Cloud CCE with enterprise-grade features and multi-cloud capabilities."
};
//#endregion
//#region content/features/industry/index.md?collection=docs&only=frontmatter
var frontmatter$50 = {
	"title": "Industrial Production Solutions",
	"description": "Storage, quality inspection, tracking and long-term preservation of massive data in industrial production, reducing costs and increasing efficiency"
};
//#endregion
//#region content/features/integration/index.md?collection=docs&only=frontmatter
var frontmatter$49 = {
	"title": "Integrating with RustFS",
	"description": "Modern data stacks are connected data stacks. Browse our extensive integration list with links to relevant documentation."
};
//#endregion
//#region content/features/lifecycle/index.md?collection=docs&only=frontmatter
var frontmatter$48 = {
	"title": "Data Lifecycle Management and Tiering",
	"description": "Data growth requires efficient lifecycle management for access, security, and economics. RustFS provides features to protect data within and between clouds,…"
};
//#endregion
//#region content/features/logging/index.md?collection=docs&only=frontmatter
var frontmatter$47 = {
	"title": "Logging and Auditing",
	"description": "RustFS observability: OpenTelemetry metrics, audit logging, and event notifications to external targets."
};
//#endregion
//#region content/features/openshift/index.md?collection=docs&only=frontmatter
var frontmatter$46 = {
	"title": "RustFS for Red Hat OpenShift Container Platform",
	"description": "RustFS provides high-performance object storage for Red Hat OpenShift with enterprise-grade features and multi-cloud capabilities."
};
//#endregion
//#region content/features/qcloud/index.md?collection=docs&only=frontmatter
var frontmatter$45 = {
	"title": "RustFS for Tencent Cloud TKE Kubernetes Service",
	"description": "RustFS provides high-performance object storage for Tencent Cloud TKE with enterprise-grade features and multi-cloud capabilities."
};
//#endregion
//#region content/features/quantitative-trading/index.md?collection=docs&only=frontmatter
var frontmatter$44 = {
	"title": "Quantitative Trading File Storage Solutions",
	"description": "Intelligent storage architecture designed for high-frequency trading and quantitative strategy backtesting, supporting millions of IOPS per second for order flow processing."
};
//#endregion
//#region content/features/replication/index.md?collection=docs&only=frontmatter
var frontmatter$43 = {
	"title": "Multi-Site, Active-Active Replication for Object Storage",
	"description": "Active replication ensures data availability. RustFS supports active-active replication. It operates at the bucket level."
};
//#endregion
//#region content/features/s3-compatibility/index.md?collection=docs&only=frontmatter
var frontmatter$42 = {
	"title": "Amazon S3 Compatibility",
	"description": "S3 compatibility is essential for cloud-native applications. RustFS strictly adheres to S3 API standards. RustFS offers a widely tested S3 alternative."
};
//#endregion
//#region content/features/small-file/index.md?collection=docs&only=frontmatter
var frontmatter$41 = {
	"title": "Small File Optimization",
	"description": "Memory Object Storage for High Performance"
};
//#endregion
//#region content/features/sql-server/index.md?collection=docs&only=frontmatter
var frontmatter$40 = {
	"title": "Running SQL Server 2022 Anywhere",
	"description": "Leverage the power of RustFS to run SQL Server 2022 on any cloud (public, private, or edge) using external table functions and PolyBase."
};
//#endregion
//#region content/features/tanzu/index.md?collection=docs&only=frontmatter
var frontmatter$39 = {
	"title": "RustFS for VMware Tanzu Container Platform",
	"description": "RustFS provides high-performance object storage for VMware Tanzu with enterprise-grade features and multi-cloud capabilities."
};
//#endregion
//#region content/features/veeam/index.md?collection=docs&only=frontmatter
var frontmatter$38 = {
	"title": "High-Performance Object Storage for Veeam Backup and Replication",
	"description": "Using RustFS to extend your v12 instances and significantly improve Veeam storage capacity and performance."
};
//#endregion
//#region content/features/versioning/index.md?collection=docs&only=frontmatter
var frontmatter$37 = {
	"title": "Bucket and Object Versioning",
	"description": "Object-level versioning improves data protection. Versioning serves as the foundation for object locking, immutability, tiering, and lifecycle management."
};
//#endregion
//#region content/features/video/index.md?collection=docs&only=frontmatter
var frontmatter$36 = {
	"title": "Cost-Effective Video Storage Solutions",
	"description": "Achieve dramatic cost reductions in video storage through object storage and hybrid cloud approaches."
};
//#endregion
//#region content/features/worm/index.md?collection=docs&only=frontmatter
var frontmatter$35 = {
	"title": "Object Immutability",
	"description": "Retention rules enforce WORM protection. Retention policies specify the retention period set on object versions, either explicitly or through bucket default…"
};
//#endregion
//#region content/index.md?collection=docs&only=frontmatter
var frontmatter$34 = {
	"title": "RustFS Documentation",
	"description": "RustFS is a high-performance, distributed, S3-compatible object storage system written in Rust."
};
//#endregion
//#region content/installation/checklists/hardware-checklists.md?collection=docs&only=frontmatter
var frontmatter$33 = {
	"title": "Production Environment Hardware Configuration Guide",
	"description": "RustFS is a high-performance distributed object storage system developed in Rust, suitable for massive unstructured data storage scenarios. This document provides comprehensive hardware selection and configuration guidance for production environment deployment."
};
//#endregion
//#region content/installation/checklists/hardware-selection.md?collection=docs&only=frontmatter
var frontmatter$32 = {
	"title": "Hardware Selection",
	"description": "Hardware requirements for RustFS."
};
//#endregion
//#region content/installation/checklists/index.md?collection=docs&only=frontmatter
var frontmatter$31 = {
	"title": "Checklists",
	"description": "Pre-installation checklists."
};
//#endregion
//#region content/installation/checklists/network-checklists.md?collection=docs&only=frontmatter
var frontmatter$30 = {
	"title": "Network Checklist",
	"description": "Network checklist for enterprise deployments."
};
//#endregion
//#region content/installation/checklists/security-checklists.md?collection=docs&only=frontmatter
var frontmatter$29 = {
	"title": "Security Checklist",
	"description": "Security checklist for enterprise deployments."
};
//#endregion
//#region content/installation/checklists/software-checklists.md?collection=docs&only=frontmatter
var frontmatter$28 = {
	"title": "Software Checklist",
	"description": "Software requirements and considerations."
};
//#endregion
//#region content/installation/cloud-native/index.md?collection=docs&only=frontmatter
var frontmatter$27 = {
	"title": "English Documentation",
	"description": "This documentation is being translated from Chinese to English"
};
//#endregion
//#region content/installation/docker/index.md?collection=docs&only=frontmatter
var frontmatter$26 = {
	"title": "Installing RustFS with Docker",
	"description": "RustFS Docker deployment."
};
//#endregion
//#region content/installation/index.md?collection=docs&only=frontmatter
var frontmatter$25 = {
	"title": "RustFS Installation Guide",
	"description": "Installation guide for RustFS on different operating systems and deployment methods."
};
//#endregion
//#region content/installation/linux/index.md?collection=docs&only=frontmatter
var frontmatter$24 = {
	"title": "What is RustFS and Installation Instructions",
	"description": "RustFS is an object storage solution, open-source distributed object storage released under Apache2 license."
};
//#endregion
//#region content/installation/linux/multiple-node-multiple-disk.md?collection=docs&only=frontmatter
var frontmatter$23 = {
	"title": "RustFS Multiple Node Multiple Disk Installation",
	"description": "Install RustFS on multiple servers with multiple disks, data will be stored on multiple disks across multiple servers."
};
//#endregion
//#region content/installation/linux/quick-start.md?collection=docs&only=frontmatter
var frontmatter$22 = {
	"title": "Quick Start Guide for Linux",
	"description": "Quick deployment and installation in Linux environment using RustFS one-click installation package"
};
//#endregion
//#region content/installation/linux/single-node-multiple-disk.md?collection=docs&only=frontmatter
var frontmatter$21 = {
	"title": "RustFS Single Node Multiple Disk Installation",
	"description": "Install RustFS on a single server with multiple disks, data will be stored on multiple disks."
};
//#endregion
//#region content/installation/linux/single-node-single-disk.md?collection=docs&only=frontmatter
var frontmatter$20 = {
	"title": "RustFS Single Node Single Disk Installation",
	"description": "Install RustFS on a single disk of a single server, data will be stored on this one disk."
};
//#endregion
//#region content/installation/macos/index.md?collection=docs&only=frontmatter
var frontmatter$19 = {
	"title": "Installing RustFS on macOS",
	"description": "Quick ways to start RustFS on macOS, using the graphical one-click startup package."
};
//#endregion
//#region content/installation/windows/index.md?collection=docs&only=frontmatter
var frontmatter$18 = {
	"title": "Installing RustFS on Windows",
	"description": "Use Windows one-click startup for RustFS."
};
//#endregion
//#region content/integration/nginx.md?collection=docs&only=frontmatter
var frontmatter$17 = {
	"title": "Nginx Reverse Proxy",
	"description": "Configuration for implementing Nginx reverse proxy with RustFS."
};
//#endregion
//#region content/integration/tls-configured.md?collection=docs&only=frontmatter
var frontmatter$16 = {
	"title": "TLS Configuration",
	"description": "Configure TLS for secure access."
};
//#endregion
//#region content/integration/virtual.md?collection=docs&only=frontmatter
var frontmatter$15 = {
	"title": "Virtual Host Style",
	"description": "RustFS S3 Virtual Host Style and Path Style configuration."
};
//#endregion
//#region content/management/bucket/creation.md?collection=docs&only=frontmatter
var frontmatter$14 = {
	"title": "RustFS Bucket Creation",
	"description": "Create buckets using the RustFS UI, MinIO Client, or API."
};
//#endregion
//#region content/management/bucket/deletion.md?collection=docs&only=frontmatter
var frontmatter$13 = {
	"title": "RustFS Bucket Deletion",
	"description": "Delete buckets using the RustFS UI, MinIO Client, or API."
};
//#endregion
//#region content/management/bucket/index.md?collection=docs&only=frontmatter
var frontmatter$12 = {
	"title": "RustFS Bucket Management",
	"description": "Buckets are the fundamental containers for data in RustFS. This section covers bucket creation, deletion, and management."
};
//#endregion
//#region content/management/index.md?collection=docs&only=frontmatter
var frontmatter$11 = {
	"title": "Management Guide",
	"description": "Guide to managing RustFS buckets, objects, and permissions."
};
//#endregion
//#region content/management/object/creation.md?collection=docs&only=frontmatter
var frontmatter$10 = {
	"title": "Object Creation",
	"description": "Create objects using the RustFS UI, MinIO Client, or API."
};
//#endregion
//#region content/management/object/deletion.md?collection=docs&only=frontmatter
var frontmatter$9 = {
	"title": "Object Deletion",
	"description": "Delete objects using the RustFS UI, MinIO Client, or API."
};
//#endregion
//#region content/management/object/index.md?collection=docs&only=frontmatter
var frontmatter$8 = {
	"title": "RustFS Object Management",
	"description": "Guide to RustFS object management, including creation, deletion, versioning, locking, and scanning."
};
//#endregion
//#region content/management/object/scanner.md?collection=docs&only=frontmatter
var frontmatter$7 = {
	"title": "Object Scanning",
	"description": "Guide to the RustFS object scanner, including design, implementation, and monitoring."
};
//#endregion
//#region content/trademark/index.md?collection=docs&only=frontmatter
var frontmatter$6 = {
	"title": "Trademark Download and Usage",
	"description": "All images on this page are provided for your use only when representing RustFS in your product architecture diagrams or support lists. When using the…"
};
//#endregion
//#region content/troubleshooting/driver.md?collection=docs&only=frontmatter
var frontmatter$5 = {
	"title": "Hard Drive Failures",
	"description": "RustFS ensures read/write access can still be provided when some disks fail through mechanisms similar to erasure coding, and automatically heals data after replacing disks."
};
//#endregion
//#region content/troubleshooting/healing.md?collection=docs&only=frontmatter
var frontmatter$4 = {
	"title": "Object Inspection and Auto-Recovery",
	"description": "How RustFS object self-healing works: design principles, trigger paths, scrub and repair process, and usage notes."
};
//#endregion
//#region content/troubleshooting/index.md?collection=docs&only=frontmatter
var frontmatter$3 = {
	"title": "Troubleshooting",
	"description": "Diagnose and resolve RustFS issues."
};
//#endregion
//#region content/troubleshooting/node.md?collection=docs&only=frontmatter
var frontmatter$2 = {
	"title": "Node Failures",
	"description": "Complete steps for handling node failures in RustFS clusters. Mainly includes: replacement node hardware preparation, configuration updates, service deployment, rejoining the cluster, data healing, and subsequent checks and best practices."
};
//#endregion
//#region content/upgrade-scale/availability-and-resiliency.md?collection=docs&only=frontmatter
var frontmatter$1 = {
	"title": "Availability and Scalability Description",
	"description": "This article will detail the technology and description related to RustFS scaling."
};
//#endregion
//#region content/upgrade-scale/index.md?collection=docs&only=frontmatter
var frontmatter = {
	"title": "Availability and Scalability",
	"description": "Learn about RustFS upgrades and scaling."
};
//#endregion
//#region node_modules/fumadocs-mdx/dist/runtime/server.js
function server(options = {}) {
	const { doc: { passthroughs: docPassthroughs = [] } = {} } = options;
	function fileInfo(file, base) {
		if (file.startsWith("./")) file = file.slice(2);
		return {
			path: file,
			fullPath: path$1.join(base, file)
		};
	}
	function mapDocData(entry) {
		const data = {
			body: entry.default,
			toc: entry.toc,
			structuredData: entry.structuredData,
			_exports: entry
		};
		for (const key of docPassthroughs) data[key] = entry[key];
		return data;
	}
	return {
		async doc(_name, base, glob) {
			return await Promise.all(Object.entries(glob).map(async ([k, v]) => {
				const data = typeof v === "function" ? await v() : v;
				return {
					...mapDocData(data),
					...data.frontmatter,
					...createDocMethods(fileInfo(k, base), () => data)
				};
			}));
		},
		async docLazy(_name, base, head, body) {
			return await Promise.all(Object.entries(head).map(async ([k, v]) => {
				const data = typeof v === "function" ? await v() : v;
				const content = body[k];
				return {
					...data,
					...createDocMethods(fileInfo(k, base), content),
					async load() {
						return mapDocData(await content());
					},
					async structuredData() {
						return (await content()).structuredData;
					}
				};
			}));
		},
		async meta(_name, base, glob) {
			return await Promise.all(Object.entries(glob).map(async ([k, v]) => {
				const data = typeof v === "function" ? await v() : v;
				return {
					info: fileInfo(k, base),
					...data
				};
			}));
		},
		async docs(name, base, metaGlob, docGlob) {
			return {
				docs: await this.doc(name, base, docGlob),
				meta: await this.meta(name, base, metaGlob),
				toFumadocsSource(options) {
					return toFumadocsSource(this.docs, this.meta, options);
				}
			};
		},
		async docsLazy(name, base, metaGlob, docHeadGlob, docBodyGlob) {
			return {
				docs: await this.docLazy(name, base, docHeadGlob, docBodyGlob),
				meta: await this.meta(name, base, metaGlob),
				toFumadocsSource(options) {
					return toFumadocsSource(this.docs, this.meta, options);
				}
			};
		}
	};
}
function toFumadocsSource(pages, metas, options) {
	const baseDir = options?.baseDir;
	const files = [];
	for (const entry of pages) files.push({
		type: "page",
		path: baseDir ? path$1.join(baseDir, entry.info.path) : entry.info.path,
		absolutePath: entry.info.fullPath,
		data: entry
	});
	for (const entry of metas) files.push({
		type: "meta",
		path: baseDir ? path$1.join(baseDir, entry.info.path) : entry.info.path,
		absolutePath: entry.info.fullPath,
		data: entry
	});
	return { files };
}
function createDocMethods(info, load) {
	return {
		info,
		async getText(type) {
			if (type === "raw") return await (await import("node:fs/promises")).readFile(info.fullPath, "utf-8");
			const data = await load();
			const markdown = data._markdown ?? data._exports?._markdown;
			if (typeof markdown !== "string") throw new Error("getText('processed') requires `includeProcessedMarkdown` to be enabled in your collection config.");
			return markdown;
		},
		async getMDAST() {
			const data = await load();
			if (!data._mdast) throw new Error("getMDAST() requires `includeMDAST` to be enabled in your collection config.");
			return JSON.parse(data._mdast);
		}
	};
}
var docs = await server({ "doc": { "passthroughs": ["extractedReferences"] } }).docsLazy("docs", "content", /* #__PURE__ */ Object.assign({
	"./administration/iam/meta.json": meta_default$6,
	"./concepts/principle/meta.json": meta_default$5,
	"./developer/sdk/meta.json": meta_default$4,
	"./installation/linux/meta.json": meta_default$3,
	"./management/bucket/meta.json": meta_default$2,
	"./management/object/meta.json": meta_default$1,
	"./meta.json": meta_default
}), /* #__PURE__ */ Object.assign({
	"./about/index.md": frontmatter$86,
	"./administration/iam/access-token.md": frontmatter$85,
	"./administration/iam/index.md": frontmatter$84,
	"./concepts/architecture.md": frontmatter$83,
	"./concepts/comparison.md": frontmatter$82,
	"./concepts/glossary.md": frontmatter$81,
	"./concepts/index.md": frontmatter$80,
	"./concepts/introduction.md": frontmatter$79,
	"./concepts/limit.md": frontmatter$78,
	"./concepts/principle/erasure-coding.md": frontmatter$77,
	"./concepts/principle/index.md": frontmatter$76,
	"./developer/index.md": frontmatter$75,
	"./developer/license.md": frontmatter$74,
	"./developer/mc.md": frontmatter$73,
	"./developer/mcp.md": frontmatter$72,
	"./developer/sdk/go.md": frontmatter$71,
	"./developer/sdk/index.md": frontmatter$70,
	"./developer/sdk/java.md": frontmatter$69,
	"./developer/sdk/javascript.md": frontmatter$68,
	"./developer/sdk/other.md": frontmatter$67,
	"./developer/sdk/python.md": frontmatter$66,
	"./developer/sdk/rust.md": frontmatter$65,
	"./developer/sdk/typescript.md": frontmatter$64,
	"./features/ai/index.md": frontmatter$63,
	"./features/aliyun/index.md": frontmatter$62,
	"./features/aws-elastic/index.md": frontmatter$61,
	"./features/baremetal/index.md": frontmatter$60,
	"./features/cloud-native/index.md": frontmatter$59,
	"./features/cold-archiving/index.md": frontmatter$58,
	"./features/commvault/index.md": frontmatter$57,
	"./features/data-lake/index.md": frontmatter$56,
	"./features/distributed/index.md": frontmatter$55,
	"./features/domestic/index.md": frontmatter$54,
	"./features/encryption/index.md": frontmatter$53,
	"./features/hdfs/index.md": frontmatter$52,
	"./features/huaweicloud/index.md": frontmatter$51,
	"./features/industry/index.md": frontmatter$50,
	"./features/integration/index.md": frontmatter$49,
	"./features/lifecycle/index.md": frontmatter$48,
	"./features/logging/index.md": frontmatter$47,
	"./features/openshift/index.md": frontmatter$46,
	"./features/qcloud/index.md": frontmatter$45,
	"./features/quantitative-trading/index.md": frontmatter$44,
	"./features/replication/index.md": frontmatter$43,
	"./features/s3-compatibility/index.md": frontmatter$42,
	"./features/small-file/index.md": frontmatter$41,
	"./features/sql-server/index.md": frontmatter$40,
	"./features/tanzu/index.md": frontmatter$39,
	"./features/veeam/index.md": frontmatter$38,
	"./features/versioning/index.md": frontmatter$37,
	"./features/video/index.md": frontmatter$36,
	"./features/worm/index.md": frontmatter$35,
	"./index.md": frontmatter$34,
	"./installation/checklists/hardware-checklists.md": frontmatter$33,
	"./installation/checklists/hardware-selection.md": frontmatter$32,
	"./installation/checklists/index.md": frontmatter$31,
	"./installation/checklists/network-checklists.md": frontmatter$30,
	"./installation/checklists/security-checklists.md": frontmatter$29,
	"./installation/checklists/software-checklists.md": frontmatter$28,
	"./installation/cloud-native/index.md": frontmatter$27,
	"./installation/docker/index.md": frontmatter$26,
	"./installation/index.md": frontmatter$25,
	"./installation/linux/index.md": frontmatter$24,
	"./installation/linux/multiple-node-multiple-disk.md": frontmatter$23,
	"./installation/linux/quick-start.md": frontmatter$22,
	"./installation/linux/single-node-multiple-disk.md": frontmatter$21,
	"./installation/linux/single-node-single-disk.md": frontmatter$20,
	"./installation/macos/index.md": frontmatter$19,
	"./installation/windows/index.md": frontmatter$18,
	"./integration/nginx.md": frontmatter$17,
	"./integration/tls-configured.md": frontmatter$16,
	"./integration/virtual.md": frontmatter$15,
	"./management/bucket/creation.md": frontmatter$14,
	"./management/bucket/deletion.md": frontmatter$13,
	"./management/bucket/index.md": frontmatter$12,
	"./management/index.md": frontmatter$11,
	"./management/object/creation.md": frontmatter$10,
	"./management/object/deletion.md": frontmatter$9,
	"./management/object/index.md": frontmatter$8,
	"./management/object/scanner.md": frontmatter$7,
	"./trademark/index.md": frontmatter$6,
	"./troubleshooting/driver.md": frontmatter$5,
	"./troubleshooting/healing.md": frontmatter$4,
	"./troubleshooting/index.md": frontmatter$3,
	"./troubleshooting/node.md": frontmatter$2,
	"./upgrade-scale/availability-and-resiliency.md": frontmatter$1,
	"./upgrade-scale/index.md": frontmatter
}), /* #__PURE__ */ Object.assign({
	"./about/index.md": () => import("./about-C_zXXIk4.js"),
	"./administration/iam/access-token.md": () => import("./access-token-BooEjIfE.js"),
	"./administration/iam/index.md": () => import("./iam-CbSU3DPt.js"),
	"./concepts/architecture.md": () => import("./architecture-B4gLCU9b.js"),
	"./concepts/comparison.md": () => import("./comparison-SPhQvrMD.js"),
	"./concepts/glossary.md": () => import("./glossary-DeAAtZwq.js"),
	"./concepts/index.md": () => import("./concepts-WPDCa0ps.js"),
	"./concepts/introduction.md": () => import("./introduction-CzzlQFNI.js"),
	"./concepts/limit.md": () => import("./limit-Bz_ReZVZ.js"),
	"./concepts/principle/erasure-coding.md": () => import("./erasure-coding--0vzNZBS.js"),
	"./concepts/principle/index.md": () => import("./principle-CU0vQ6A_.js"),
	"./developer/index.md": () => import("./developer-qaiGKJlU.js"),
	"./developer/license.md": () => import("./license-PcFRTdjc.js"),
	"./developer/mc.md": () => import("./mc-DUxBZ9zS.js"),
	"./developer/mcp.md": () => import("./mcp-B-D4sIsK.js"),
	"./developer/sdk/go.md": () => import("./go-Dmys-4Iq.js"),
	"./developer/sdk/index.md": () => import("./sdk-CP2V4Am0.js"),
	"./developer/sdk/java.md": () => import("./java-B4qmi6cr.js"),
	"./developer/sdk/javascript.md": () => import("./javascript-nuCCAP0k.js"),
	"./developer/sdk/other.md": () => import("./other-DAsZgdDh.js"),
	"./developer/sdk/python.md": () => import("./python-DOKfuudt.js"),
	"./developer/sdk/rust.md": () => import("./rust-c2dwLzuh.js"),
	"./developer/sdk/typescript.md": () => import("./typescript-Cgh8oITS.js"),
	"./features/ai/index.md": () => import("./ai-C87LW4Vg.js"),
	"./features/aliyun/index.md": () => import("./aliyun-zj-WOS5I.js"),
	"./features/aws-elastic/index.md": () => import("./aws-elastic-CB_J0sbg.js"),
	"./features/baremetal/index.md": () => import("./baremetal-CSGxyID4.js"),
	"./features/cloud-native/index.md": () => import("./cloud-native-DCq8NNx9.js"),
	"./features/cold-archiving/index.md": () => import("./cold-archiving-3ZC0LAKT.js"),
	"./features/commvault/index.md": () => import("./commvault-2x2sJeer.js"),
	"./features/data-lake/index.md": () => import("./data-lake-DclTAOMD.js"),
	"./features/distributed/index.md": () => import("./distributed-D_hX4P-i.js"),
	"./features/domestic/index.md": () => import("./domestic-DUgcJDXf.js"),
	"./features/encryption/index.md": () => import("./encryption-DpJcuJx2.js"),
	"./features/hdfs/index.md": () => import("./hdfs-DiVPavlH.js"),
	"./features/huaweicloud/index.md": () => import("./huaweicloud-BOf3cgyU.js"),
	"./features/industry/index.md": () => import("./industry-BzOdgr6D.js"),
	"./features/integration/index.md": () => import("./integration-BJd8xaOX.js"),
	"./features/lifecycle/index.md": () => import("./lifecycle-C0CFwYza.js"),
	"./features/logging/index.md": () => import("./logging-BUMWqz2g.js"),
	"./features/openshift/index.md": () => import("./openshift-CdE29TAT.js"),
	"./features/qcloud/index.md": () => import("./qcloud-CSdsdMWu.js"),
	"./features/quantitative-trading/index.md": () => import("./quantitative-trading-CsmUkLQK.js"),
	"./features/replication/index.md": () => import("./replication-BZQzT7s2.js"),
	"./features/s3-compatibility/index.md": () => import("./s3-compatibility-DyWBOGba.js"),
	"./features/small-file/index.md": () => import("./small-file-DfsYQeiP.js"),
	"./features/sql-server/index.md": () => import("./sql-server-CWNmRLZL.js"),
	"./features/tanzu/index.md": () => import("./tanzu-CAIYEH-b.js"),
	"./features/veeam/index.md": () => import("./veeam-FSPZEpLM.js"),
	"./features/versioning/index.md": () => import("./versioning-BkCWf7PQ.js"),
	"./features/video/index.md": () => import("./video-BTEzTeuo.js"),
	"./features/worm/index.md": () => import("./worm-CyyGFlRJ.js"),
	"./index.md": () => import("./content-fSXgzET2.js"),
	"./installation/checklists/hardware-checklists.md": () => import("./hardware-checklists-ClsCzllj.js"),
	"./installation/checklists/hardware-selection.md": () => import("./hardware-selection-Cll-5ADG.js"),
	"./installation/checklists/index.md": () => import("./checklists-CGZXDcqQ.js"),
	"./installation/checklists/network-checklists.md": () => import("./network-checklists-27QOSXMw.js"),
	"./installation/checklists/security-checklists.md": () => import("./security-checklists-DZBLaaib.js"),
	"./installation/checklists/software-checklists.md": () => import("./software-checklists-Bn_qE7WF.js"),
	"./installation/cloud-native/index.md": () => import("./cloud-native-Cmg6GBy8.js"),
	"./installation/docker/index.md": () => import("./docker-KH4XoqSp.js"),
	"./installation/index.md": () => import("./installation-RSC47vb5.js"),
	"./installation/linux/index.md": () => import("./linux-CKA6dGV5.js"),
	"./installation/linux/multiple-node-multiple-disk.md": () => import("./multiple-node-multiple-disk-CZcTWB1_.js"),
	"./installation/linux/quick-start.md": () => import("./quick-start-Cf0Pqhw1.js"),
	"./installation/linux/single-node-multiple-disk.md": () => import("./single-node-multiple-disk-DlHgv2cD.js"),
	"./installation/linux/single-node-single-disk.md": () => import("./single-node-single-disk-363i4Xji.js"),
	"./installation/macos/index.md": () => import("./macos-fr5I9vyB.js"),
	"./installation/windows/index.md": () => import("./windows-BPWSUnCZ.js"),
	"./integration/nginx.md": () => import("./nginx-B6ImlGdn.js"),
	"./integration/tls-configured.md": () => import("./tls-configured-Dl9V6zT6.js"),
	"./integration/virtual.md": () => import("./virtual-BbDklwxK.js"),
	"./management/bucket/creation.md": () => import("./creation-BUtfJ2BS.js"),
	"./management/bucket/deletion.md": () => import("./deletion-B_mXEytG.js"),
	"./management/bucket/index.md": () => import("./bucket-Cvh0uZYu.js"),
	"./management/index.md": () => import("./management-Cnj3hRGA.js"),
	"./management/object/creation.md": () => import("./creation-C3wPkghC.js"),
	"./management/object/deletion.md": () => import("./deletion-IqYO9lGI.js"),
	"./management/object/index.md": () => import("./object-CU2_zg23.js"),
	"./management/object/scanner.md": () => import("./scanner-M4FIy0vO.js"),
	"./trademark/index.md": () => import("./trademark-BgcEfgvB.js"),
	"./troubleshooting/driver.md": () => import("./driver-CGLu_6TV.js"),
	"./troubleshooting/healing.md": () => import("./healing-DZDFMhnQ.js"),
	"./troubleshooting/index.md": () => import("./troubleshooting-BWrQCuEB.js"),
	"./troubleshooting/node.md": () => import("./node-D2ab5yi4.js"),
	"./upgrade-scale/availability-and-resiliency.md": () => import("./availability-and-resiliency-DLv37WDr.js"),
	"./upgrade-scale/index.md": () => import("./upgrade-scale-BW-WwT3n.js")
}));
//#endregion
//#region src/components/mermaid.tsx
var Mermaid = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"Mermaid\"");
}), "d29067c5123b", "Mermaid");
//#endregion
//#region src/components/tabs.tsx
var Tab = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"Tab\"");
}), "0555c9fe9bc1", "Tab");
var Tabs = /* #__PURE__ */ registerClientReference((() => {
	throw new Error("It is not possible to invoke a client function from the server: \"Tabs\"");
}), "0555c9fe9bc1", "Tabs");
//#endregion
//#region press.config.tsx
var siteDescription = "RustFS is an S3-compatible distributed object storage engine written in Rust.";
var TwitterIcon = /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("svg", {
	role: "img",
	viewBox: "0 0 24 24",
	width: "18",
	height: "18",
	fill: "currentColor",
	children: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
});
var SidebarFooter = /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)("div", {
	className: "flex flex-col gap-0.5 px-2 py-3 text-xs text-fd-muted-foreground",
	children: [/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("p", { children: "Released under the Apache License 2.0." }), /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("p", { children: "Copyright © 2025 RustFS" })]
});
var press_config_default = defineConfig({
	content: docs.toFumadocsSource(),
	site: {
		name: "RustFS Documentation",
		baseUrl: "https://docs.rustfs.com",
		git: {
			user: "rustfs",
			repo: "docs.rustfs.com",
			branch: "main"
		}
	},
	mode: "static",
	meta: {
		root() {
			return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					rel: "preconnect",
					href: "https://fonts.googleapis.com"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossOrigin: ""
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					href: "https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
					rel: "stylesheet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/favicon-32x32.png"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					rel: "icon",
					type: "image/png",
					sizes: "16x16",
					href: "/favicon-16x16.png"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					rel: "manifest",
					href: "/site.webmanifest"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
					name: "author",
					content: "RustFS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
					name: "robots",
					content: "index, follow"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
					name: "googlebot",
					content: "index, follow"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
					name: "bingbot",
					content: "index, follow"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
					name: "yandexbot",
					content: "index, follow"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
					property: "og:type",
					content: "article"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
					name: "twitter:card",
					content: "summary_large_image"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
					name: "twitter:site",
					content: "@rustfs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
					name: "twitter:creator",
					content: "@rustfs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					rel: "alternate",
					hrefLang: "x-default",
					href: "https://docs.rustfs.com"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					rel: "alternate",
					hrefLang: "en-US",
					href: "https://docs.rustfs.com"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("link", {
					rel: "alternate",
					hrefLang: "zh-CN",
					href: "https://docs.rustfs.com.cn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("script", {
						async: true,
						src: "https://www.googletagmanager.com/gtag/js?id=G-TWW7WMTWL9"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("script", { dangerouslySetInnerHTML: { __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-TWW7WMTWL9');` } }),
					/* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("script", { dangerouslySetInnerHTML: { __html: `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?968e7103a8e28fb30f7d69e42b7c82bc";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();` } })
				] })
			] });
		},
		page(page) {
			return /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("meta", {
				name: "description",
				content: page.data.description ?? siteDescription
			});
		}
	}
}).plugins(flexsearchPlugin(), llmsPlugin(), takumiPlugin(), sitemapPlugin()).layouts({
	page: createNotebookLayoutPage(),
	defaultProps() {
		return {
			nav: {
				title: /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)("img", {
					src: "/images/logo.svg",
					alt: "RustFS",
					width: 96,
					height: 24,
					style: {
						height: 24,
						width: "auto"
					}
				}),
				url: "https://rustfs.com"
			},
			githubUrl: "https://github.com/rustfs/rustfs",
			links: [
				{
					text: "Home",
					url: "https://rustfs.com",
					external: true
				},
				{
					text: "Docs",
					url: "/"
				},
				{
					text: "Installation",
					url: "/installation/linux"
				},
				{
					text: "MCP",
					url: "/developer/mcp"
				},
				{
					text: "SDK",
					url: "/developer/sdk"
				},
				{
					text: "Demo",
					url: "https://play.rustfs.com",
					external: true
				},
				{
					text: "Community",
					url: "https://github.com/rustfs/rustfs/discussions",
					external: true
				},
				{
					text: "Blog",
					url: "https://rustfs.dev",
					external: true
				},
				{
					type: "icon",
					label: "Twitter",
					icon: TwitterIcon,
					text: "Twitter",
					url: "https://twitter.com/rustfsofficial",
					external: true
				}
			],
			sidebar: { footer: SidebarFooter }
		};
	}
}).adapters(fumadocsMdx({ async getMdxComponents(page) {
	return {
		...defaultMdxComponents,
		a: createRelativeLink(await this.getLoader(), page),
		Mermaid,
		Tab,
		Tabs
	};
} }));
//#endregion
//#region node_modules/fumapress/dist/router/index.js
async function createRouter(userConfig) {
	const context = await initApp(userConfig);
	function createPages$2(base, createPagesOptions) {
		const result = createPages(async (_fns) => {
			const layouts = context.layouts;
			const fns = {
				..._fns,
				unstable_getCreated() {
					return result;
				},
				createApiIsomorphic(config) {
					if (config.render === "static") _fns.createApi({
						render: "static",
						method: "GET",
						staticPaths: config.staticPaths,
						path: config.path,
						handler: config.handler
					});
					else _fns.createApi({
						render: "dynamic",
						path: config.path,
						handlers: { GET: config.handler }
					});
				}
			};
			async function resolvePage(slugs, lang) {
				let page = (await context.getLoader()).getPage(slugs, lang);
				if (!page) unstable_notFound();
				for (const plugin of context.plugins) {
					const resolved = await plugin.resolvePage?.call(context, page);
					if (typeof resolved === "object") page = resolved;
					else if (resolved === false) unstable_notFound();
				}
				return page;
			}
			fns.createInterceptor((next) => appContext.run(context, next));
			await base?.call(context, fns);
			for (const plugin of context.plugins) await plugin.createPages?.call(context, fns);
			const staticPaths = [];
			const defaultRenderMode = context.mode === "default" ? "static" : context.mode;
			outer: for (const page of (await context.getLoader()).getPages()) {
				for (const plugin of context.plugins) if (await plugin.resolvePage?.call(context, page) === false) continue outer;
				staticPaths.push(page.locale ? [page.locale, ...page.slugs] : page.slugs);
			}
			if (context.i18nConfig) {
				fns.createRoot({
					render: defaultRenderMode,
					component: import_react_react_server.Fragment
				});
				fns.createLayout({
					render: defaultRenderMode,
					path: "/[lang]",
					component: layouts.root
				});
				fns.createPage({
					render: defaultRenderMode,
					path: "/[lang]/[...slugs]",
					staticPaths,
					async component({ slugs, lang }) {
						const page = await resolvePage(slugs, lang);
						let fallback = /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(layouts.page, {
							lang,
							slugs,
							page
						});
						for (const plugin of context.plugins) {
							const res = await plugin.renderPage?.call(context, {
								fallback,
								page,
								slugs,
								lang
							});
							if (res !== void 0) fallback = res;
						}
						return fallback;
					}
				});
				fns.createPage({
					render: defaultRenderMode,
					path: "/[lang]/404",
					staticPaths: context.i18nConfig.languages,
					component: layouts.notFound
				});
				if (context.mode !== "static") fns.createPage({
					render: "dynamic",
					path: "/404",
					component: () => unstable_redirect(`/${context.i18nConfig.defaultLanguage}`)
				});
			} else {
				fns.createRoot({
					render: defaultRenderMode,
					component: layouts.root
				});
				fns.createPage({
					render: defaultRenderMode,
					path: "/[...slugs]",
					staticPaths,
					async component({ slugs }) {
						const page = await resolvePage(slugs);
						let fallback = /* @__PURE__ */ (0, import_jsx_runtime_react_server.jsx)(layouts.page, {
							slugs,
							page
						});
						for (const plugin of context.plugins) {
							const res = await plugin.renderPage?.call(context, {
								fallback,
								page,
								slugs
							});
							if (res !== void 0) fallback = res;
						}
						return fallback;
					}
				});
				fns.createPage({
					render: defaultRenderMode,
					staticPaths: [],
					path: "/404",
					component: layouts.notFound
				});
			}
			return null;
		}, createPagesOptions);
		return result;
	}
	function pluginsMiddleware(opts) {
		async function init() {
			const out = [];
			const resolved = await Promise.all(context.plugins.map((plugin) => plugin.createMiddlewares?.call(context, opts)));
			for (const v of resolved) if (v) out.push(...v);
			return out;
		}
		const middlewaresPromise = init();
		return async (c, next) => {
			const middlewares = await middlewaresPromise;
			if (middlewares.length === 0) return next();
			let response;
			const run = async (index) => {
				const handler = middlewares[index];
				if (handler) {
					const result = await handler(c, () => run(index + 1));
					if (result && !response) response = result;
				} else await next();
			};
			await run(0);
			return response;
		};
	}
	function patchAdapter(adapter) {
		return (handlers, options) => {
			let entry = adapter(handlers, options);
			for (const plugin of context.plugins) if (plugin.unstable_onServerEntry) entry = plugin.unstable_onServerEntry(entry);
			return entry;
		};
	}
	return {
		createPages: createPages$2,
		patchAdapter,
		createMiddlewares() {
			return [pluginsMiddleware];
		}
	};
}
//#endregion
//#region node_modules/fumapress/dist/router/fs.js
var Methods = [
	"GET",
	"POST",
	"HEAD",
	"PUT",
	"DELETE",
	"PATCH",
	"OPTIONS"
];
var ValidMethods = new Set(Methods);
var IGNORED_PATH_PARTS = /* @__PURE__ */ new Set(["_components", "_hooks"]);
var SPECIAL_BASENAME = /* @__PURE__ */ new Set([
	"_layout",
	"index",
	"_root"
]);
/** Ignore paths like `_components` and `_hooks` in pages dir */
var isIgnoredPath = (paths) => paths.some((p) => IGNORED_PATH_PARTS.has(p));
function fsRouterFn(modules, options = {}) {
	return async function(fns) {
		const { createPage, createLayout, createRoot, createApi, createSlice } = fns;
		const { pagesDir = "pages", apiDir = "_api", slicesDir = "_slices" } = options;
		const pagesDirPrefix = pagesDir + "/";
		for (const file in modules) {
			const srcPath = new URL(file, "http://localhost:3000").pathname.slice(1);
			if (!srcPath.startsWith(pagesDirPrefix)) continue;
			const pathItems = srcPath.slice(pagesDirPrefix.length).replace(/\.\w+$/, "").split("/").filter(Boolean);
			if (isIgnoredPath(pathItems)) continue;
			const path = "/" + (SPECIAL_BASENAME.has(pathItems.at(-1)) ? pathItems.slice(0, -1) : pathItems).join("/");
			const mod = await modules[file]();
			const config = await mod.getConfig?.call(this);
			if (pathItems.at(-1) === "[path]") throw new Error("Page file cannot be named [path]. This will conflict with the path prop of the page component.");
			if (pathItems[0] === apiDir) {
				const apiPath = "/" + pathItems.slice(1).join("/");
				const renderMode = config?.render ?? (this.mode === "default" ? "dynamic" : this.mode);
				if (renderMode === "static") {
					if (Object.keys(mod).length !== 2 || !mod.GET) console.warn(`API ${path} is invalid. For static API routes, only a single GET handler is supported.`);
					createApi({
						path: apiPath,
						render: renderMode,
						method: "GET",
						handler: mod.GET.bind(this),
						unstable_sourceFile: srcPath
					});
				} else {
					const entries = [];
					for (const [exportName, handler] of Object.entries(mod)) {
						if (!(exportName === "getConfig" || exportName === "default" || ValidMethods.has(exportName))) {
							console.warn(`API ${path} has an invalid export: ${exportName}. Valid exports are: ${Methods.join(", ")}`);
							continue;
						}
						if (exportName === "default") entries.push(["all", handler.bind(this)]);
						else entries.push([exportName, handler.bind(this)]);
					}
					createApi({
						path: apiPath,
						render: renderMode,
						handlers: Object.fromEntries(entries),
						unstable_sourceFile: srcPath
					});
				}
				continue;
			}
			const component = mod.default;
			const renderMode = config?.render ?? (this.mode === "default" ? "static" : this.mode);
			if (pathItems[0] === slicesDir) {
				createSlice({
					component,
					render: renderMode,
					id: pathItems.slice(1).join("/"),
					unstable_sourceFile: srcPath
				});
				continue;
			}
			if (pathItems.at(-1) === "_root") {
				createRoot({
					component,
					render: renderMode,
					unstable_sourceFile: srcPath
				});
				continue;
			}
			const autoI18n = config?.autoI18n ?? true;
			const routePath = this.i18nConfig && autoI18n ? joinPathname("[lang]/(fs)", path) : joinPathname("(fs)", path);
			if (pathItems.at(-1) === "_layout") {
				createLayout({
					path: routePath,
					component,
					render: renderMode,
					unstable_sourceFile: srcPath
				});
				continue;
			}
			createPage({
				path: routePath,
				component,
				render: renderMode,
				unstable_sourceFile: srcPath
			});
		}
	};
}
//#endregion
//#region src/waku.server.tsx
var modules = /* #__PURE__ */ Object.assign({});
var router = await createRouter(press_config_default);
var pages = router.createPages(fsRouterFn(modules));
var middlewareFns = router.createMiddlewares();
var waku_server_default = router.patchAdapter(cloudflare_default)(pages, {
	middlewareFns,
	static: true
});
//#endregion
export { joinPath as n, setAllEnv as r, waku_server_default as t };
