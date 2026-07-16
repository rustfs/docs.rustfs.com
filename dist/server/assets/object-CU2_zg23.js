import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/management/object/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS Object Management",
	"description": "Guide to RustFS object management, including creation, deletion, versioning, locking, and scanning."
};
var _markdown = "\n\nObjects are the fundamental storage units in RustFS, consisting of data, metadata, and a unique key. This section covers:\n\n* [Object Upload](./creation.md)\n* [Object Deletion](./deletion.md)\n* Object Versioning\n* Object Locking\n* Object Sharing\n* [Object Scanning](./scanner.md)\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Objects are the fundamental storage units in RustFS, consisting of data, metadata, and a unique key. This section covers:"
		},
		{
			"heading": void 0,
			"content": "Object Upload"
		},
		{
			"heading": void 0,
			"content": "Object Deletion"
		},
		{
			"heading": void 0,
			"content": "Object Versioning"
		},
		{
			"heading": void 0,
			"content": "Object Locking"
		},
		{
			"heading": void 0,
			"content": "Object Sharing"
		},
		{
			"heading": void 0,
			"content": "Object Scanning"
		}
	],
	"headings": []
};
var toc = [];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		li: "li",
		p: "p",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Objects are the fundamental storage units in RustFS, consisting of data, metadata, and a unique key. This section covers:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./creation.md",
				children: "Object Upload"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./deletion.md",
				children: "Object Deletion"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Object Versioning" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Object Locking" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Object Sharing" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./scanner.md",
				children: "Object Scanning"
			}) }),
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
