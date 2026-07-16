import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/checklists/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Checklists",
	"description": "Pre-installation checklists."
};
var _markdown = "\n\nThese checklists cover the necessary preparations for a production environment.\n\n<Callout type=\"info\">\n  These are general guidelines. Adjust them based on your specific architecture and requirements.\n</Callout>\n\nFor professional support, contact us at [hello@rustfs.com](mailto:hello@rustfs.com).\n\nFor community support, submit an issue on GitHub.\n\n## Checklists [#checklists]\n\n* [Hardware Checklist](./hardware-checklists.md)\n* [Hardware Selection](./hardware-selection.md)\n* [Security Checklist](./security-checklists.md)\n* [Software Checklist](./software-checklists.md)\n* [Network Checklist](./network-checklists.md)\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "These checklists cover the necessary preparations for a production environment."
		},
		{
			"heading": void 0,
			"content": ":::note"
		},
		{
			"heading": void 0,
			"content": "These are general guidelines. Adjust them based on your specific architecture and requirements."
		},
		{
			"heading": void 0,
			"content": ":::"
		},
		{
			"heading": void 0,
			"content": "For professional support, contact us at hello\\@rustfs.com."
		},
		{
			"heading": void 0,
			"content": "For community support, submit an issue on GitHub."
		},
		{
			"heading": "checklists",
			"content": "Hardware Checklist"
		},
		{
			"heading": "checklists",
			"content": "Hardware Selection"
		},
		{
			"heading": "checklists",
			"content": "Security Checklist"
		},
		{
			"heading": "checklists",
			"content": "Software Checklist"
		},
		{
			"heading": "checklists",
			"content": "Network Checklist"
		}
	],
	"headings": [{
		"id": "checklists",
		"content": "Checklists"
	}]
};
var toc = [{
	depth: 2,
	url: "#checklists",
	title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Checklists" })
}];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		h2: "h2",
		li: "li",
		p: "p",
		ul: "ul",
		...props.components
	}, { Callout } = _components;
	if (!Callout) _missingMdxReference("Callout", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "These checklists cover the necessary preparations for a production environment." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Callout, {
			type: "info",
			children: (0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "These are general guidelines. Adjust them based on your specific architecture and requirements." })
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"For professional support, contact us at ",
			(0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "mailto:hello@rustfs.com",
				children: "hello@rustfs.com"
			}),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "For community support, submit an issue on GitHub." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "checklists",
			children: "Checklists"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./hardware-checklists.md",
				children: "Hardware Checklist"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./hardware-selection.md",
				children: "Hardware Selection"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./security-checklists.md",
				children: "Security Checklist"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./software-checklists.md",
				children: "Software Checklist"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./network-checklists.md",
				children: "Network Checklist"
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
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
