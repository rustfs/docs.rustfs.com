import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/cloud-native/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "English Documentation",
	"description": "This documentation is being translated from Chinese to English"
};
var _markdown = "\n\nThis section contains the RustFS documentation translated into English.\n";
var structuredData = {
	"contents": [{
		"heading": void 0,
		"content": "This section contains the RustFS documentation translated into English."
	}],
	"headings": []
};
var toc = [];
function _createMdxContent(props) {
	return (0, import_jsx_runtime_react_server.jsx)({
		p: "p",
		...props.components
	}.p, { children: "This section contains the RustFS documentation translated into English." });
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
