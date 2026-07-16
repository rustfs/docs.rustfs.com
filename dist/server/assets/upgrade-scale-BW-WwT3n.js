import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/upgrade-scale/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Availability and Scalability",
	"description": "Learn about RustFS upgrades and scaling."
};
var _markdown = "\n\nContents:\n\n* [Availability and Resiliency Description](./availability-and-resiliency.md)\n* Upgrade\n* Scaling\n* Retirement\n* Rebalancing\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Contents:"
		},
		{
			"heading": void 0,
			"content": "Availability and Resiliency Description"
		},
		{
			"heading": void 0,
			"content": "Upgrade"
		},
		{
			"heading": void 0,
			"content": "Scaling"
		},
		{
			"heading": void 0,
			"content": "Retirement"
		},
		{
			"heading": void 0,
			"content": "Rebalancing"
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
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Contents:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./availability-and-resiliency.md",
				children: "Availability and Resiliency Description"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Upgrade" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Scaling" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Retirement" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Rebalancing" }),
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
