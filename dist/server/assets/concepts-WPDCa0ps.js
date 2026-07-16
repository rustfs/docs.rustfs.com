import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/concepts/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS Architecture Design and Core Concepts Explained",
	"description": "This article introduces vocabulary frequently used in object storage, helping users quickly understand object storage"
};
var _markdown = "\n\nThis chapter contains the following content:\n\n* [RustFS Introduction](./introduction.md)\n* [RustFS Design Architecture](./architecture.md)\n* [Mainstream Storage Product Comparison](./comparison.md)\n* [Common Terminology](./glossary.md)\n* [Core Concepts](./principle/index.md)\n* [Usage Limitations](./limit.md)\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "This chapter contains the following content:"
		},
		{
			"heading": void 0,
			"content": "RustFS Introduction"
		},
		{
			"heading": void 0,
			"content": "RustFS Design Architecture"
		},
		{
			"heading": void 0,
			"content": "Mainstream Storage Product Comparison"
		},
		{
			"heading": void 0,
			"content": "Common Terminology"
		},
		{
			"heading": void 0,
			"content": "Core Concepts"
		},
		{
			"heading": void 0,
			"content": "Usage Limitations"
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
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This chapter contains the following content:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./introduction.md",
				children: "RustFS Introduction"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./architecture.md",
				children: "RustFS Design Architecture"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./comparison.md",
				children: "Mainstream Storage Product Comparison"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./glossary.md",
				children: "Common Terminology"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./principle/index.md",
				children: "Core Concepts"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./limit.md",
				children: "Usage Limitations"
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
