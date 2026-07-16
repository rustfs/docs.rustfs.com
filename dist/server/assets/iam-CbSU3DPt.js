import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/administration/iam/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS IAM Management",
	"description": "Comprehensive guide to Identity and Access Management (IAM), including Users, Groups, Policies, and Access Keys."
};
var _markdown = "\n\nThis section covers:\n\n* User Management\n* User Group Management\n* Policy Management\n* Bucket Policy\n* Access Keys (AK/SK)\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "This section covers:"
		},
		{
			"heading": void 0,
			"content": "User Management"
		},
		{
			"heading": void 0,
			"content": "User Group Management"
		},
		{
			"heading": void 0,
			"content": "Policy Management"
		},
		{
			"heading": void 0,
			"content": "Bucket Policy"
		},
		{
			"heading": void 0,
			"content": "Access Keys (AK/SK)"
		}
	],
	"headings": []
};
var toc = [];
function _createMdxContent(props) {
	const _components = {
		li: "li",
		p: "p",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This section covers:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "User Management" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "User Group Management" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Policy Management" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Bucket Policy" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Access Keys (AK/SK)" }),
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
