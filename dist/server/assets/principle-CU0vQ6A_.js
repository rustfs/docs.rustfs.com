import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/concepts/principle/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS Core Concepts Explained",
	"description": "Detailed explanation of RustFS core concepts, including erasure coding, stripes, Data Scanner, data self-healing, etc. Allows users to have a deeper understanding of RustFS."
};
var _markdown = "\n\nThis chapter contains the following content:\n\n* [Erasure Coding](./erasure-coding.md)\n* Stripes\n* Data Scanner\n* Data Self-healing\n* Stripes\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "This chapter contains the following content:"
		},
		{
			"heading": void 0,
			"content": "Erasure Coding"
		},
		{
			"heading": void 0,
			"content": "Stripes"
		},
		{
			"heading": void 0,
			"content": "Data Scanner"
		},
		{
			"heading": void 0,
			"content": "Data Self-healing"
		},
		{
			"heading": void 0,
			"content": "Stripes"
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
				href: "./erasure-coding.md",
				children: "Erasure Coding"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Stripes" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Data Scanner" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Data Self-healing" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Stripes" }),
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
