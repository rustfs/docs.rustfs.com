import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/developer/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS Developer Guide",
	"description": "Guide to using STS, MCP, MinIO Client, SDKs, and APIs with RustFS."
};
var _markdown = "\n\nThis guide provides instructions for integrating and interacting with RustFS using STS, MCP (Model Context Protocol), MinIO Client (`mc`), SDKs, and APIs. It is designed to enable developers to build efficient and scalable applications on top of RustFS. This document covers the following topics:\n\n* STS\n* [MCP Usage Guide](./mcp.md)\n* [MinIO Client Usage Guide](./mc.md)\n* [SDK Usage Guide](./sdk/index.md)\n* API Usage Guide\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "This guide provides instructions for integrating and interacting with RustFS using STS, MCP (Model Context Protocol), MinIO Client (`mc`), SDKs, and APIs. It is designed to enable developers to build efficient and scalable applications on top of RustFS. This document covers the following topics:"
		},
		{
			"heading": void 0,
			"content": "STS"
		},
		{
			"heading": void 0,
			"content": "MCP Usage Guide"
		},
		{
			"heading": void 0,
			"content": "MinIO Client Usage Guide"
		},
		{
			"heading": void 0,
			"content": "SDK Usage Guide"
		},
		{
			"heading": void 0,
			"content": "API Usage Guide"
		}
	],
	"headings": []
};
var toc = [];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		li: "li",
		p: "p",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"This guide provides instructions for integrating and interacting with RustFS using STS, MCP (Model Context Protocol), MinIO Client (",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "mc" }),
			"), SDKs, and APIs. It is designed to enable developers to build efficient and scalable applications on top of RustFS. This document covers the following topics:"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "STS" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./mcp.md",
				children: "MCP Usage Guide"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./mc.md",
				children: "MinIO Client Usage Guide"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./sdk/index.md",
				children: "SDK Usage Guide"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "API Usage Guide" }),
			"\n"
		] })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime_react_server.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime_react_server.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
