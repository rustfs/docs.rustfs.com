import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/management/bucket/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS Bucket Management",
	"description": "Buckets are the fundamental containers for data in RustFS. This section covers bucket creation, deletion, and management."
};
var _markdown = "\n\nBuckets organize and manage data. Each bucket has a unique name and can contain multiple objects, providing logical grouping for easier access and management.\n\n* [Bucket Creation](./creation.md)\n* [Bucket Deletion](./deletion.md)\n* Bucket Copying\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Buckets organize and manage data. Each bucket has a unique name and can contain multiple objects, providing logical grouping for easier access and management."
		},
		{
			"heading": void 0,
			"content": "Bucket Creation"
		},
		{
			"heading": void 0,
			"content": "Bucket Deletion"
		},
		{
			"heading": void 0,
			"content": "Bucket Copying"
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
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Buckets organize and manage data. Each bucket has a unique name and can contain multiple objects, providing logical grouping for easier access and management." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./creation.md",
				children: "Bucket Creation"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./deletion.md",
				children: "Bucket Deletion"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Bucket Copying" }),
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
