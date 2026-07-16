import { i as __toESM } from "./rolldown-runtime-B4lejLz5.js";
import { n as require_jsx_runtime, t as require_react } from "./react-BKYDRtZ1.js";
//#region \0react-server-dom-webpack/client
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region node_modules/waku/dist/minimal/client.js
var { createFromFetch, encodeReply, createTemporaryReferenceSet } = {};
var DEFAULT_HTML_HEAD = [
	/*#__PURE__*/ (0, import_jsx_runtime.jsx)("meta", { charSet: "utf-8" }, "charset"),
	/*#__PURE__*/ (0, import_jsx_runtime.jsx)("meta", {
		name: "viewport",
		content: "width=device-width, initial-scale=1"
	}, "viewport"),
	/*#__PURE__*/ (0, import_jsx_runtime.jsx)("meta", {
		name: "generator",
		content: "Waku"
	}, "generator")
];
var RefetchContext = /*#__PURE__*/ (0, import_react.createContext)(() => {
	throw new Error("Missing Root component");
});
var ElementsContext = /*#__PURE__*/ (0, import_react.createContext)(null);
var ChildrenContext = /*#__PURE__*/ (0, import_react.createContext)(void 0);
var ChildrenContextProvider = /*#__PURE__*/ (0, import_react.memo)(ChildrenContext);
/**
* This API is technically unstable and may change or be removed,
* even though it does not carry the `unstable_` prefix.
*/ var Children = () => (0, import_react.use)(ChildrenContext);
var useElementsPromise_UNSTABLE = () => {
	const elementsPromise = (0, import_react.use)(ElementsContext);
	if (!elementsPromise) throw new Error("Missing Root component");
	return elementsPromise;
};
/**
* Slot component
* This is used under the Root component.
* Slot id is the key of elements returned by the server.
*
* If the server returns this
* ```
*   { 'foo': <div>foo</div>, 'bar': <div>bar</div> }
* ```
* then you can use this component like this
* ```
*   <Root><Slot id="foo" /><Slot id="bar" /></Root>
* ```
*
* This API is technically unstable and may change or be removed,
* even though it does not carry the `unstable_` prefix.
*/ var Slot = ({ id, children }) => {
	const elements = (0, import_react.use)(useElementsPromise_UNSTABLE());
	if (id in elements && elements[id] === void 0) throw new Error("Element cannot be undefined, use null instead: " + id);
	const element = elements[id];
	if (!(element !== void 0)) throw new Error("Invalid element: " + id);
	return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(ChildrenContextProvider, {
		value: children,
		children: element
	});
};
/**
* ServerRoot for SSR
* This is not a public API.
*/ var INTERNAL_ServerRoot = ({ elementsPromise, children }) => /*#__PURE__*/ (0, import_jsx_runtime.jsx)(RefetchContext, {
	value: async () => ({}),
	children: /*#__PURE__*/ (0, import_jsx_runtime.jsxs)(ElementsContext, {
		value: elementsPromise,
		children: [DEFAULT_HTML_HEAD, children]
	})
});
//#endregion
export { INTERNAL_ServerRoot as n, Slot as r, Children as t };
