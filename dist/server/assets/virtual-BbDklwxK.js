import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/integration/virtual.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Virtual Host Style",
	"description": "RustFS S3 Virtual Host Style and Path Style configuration."
};
var _markdown = "\n\nRustFS complies with S3 protocols. S3 supports two request modes:\n\n1. Virtual Host Style\n2. Path Style\n\nThe difference lies in the bucket name placement.\n\n## Path Style [#path-style]\n\nPath Style is the default. In Path Style, the bucket name follows the endpoint.\n\nExample (Bucket: `test`, Host: `rustfs.yourdomain.com`):\n\n```\nhttp://rustfs.yourdomain.com/test\n```\n\n**Note**: No configuration is required for Path Style.\n\n## Virtual Host Style [#virtual-host-style]\n\nIn Virtual Host Style, the bucket name is part of the domain.\n\nExample (Bucket: `test`, Host: `rustfs.yourdomain.com`):\n\n```\nhttp://test.rustfs.yourdomain.com/\n```\n\n### Configuration [#configuration]\n\n1. **DNS**: Configure wildcard DNS resolution (e.g., `*.rustfs.yourdomain.com` -> Server IP).\n2. **Configuration**: Modify the configuration file (Linux: `/etc/default/rustfs`, Docker/K8s: env vars).\n3. **Set Domain**: Set `RUSTFS_SERVER_DOMAINS = \"rustfs.yourdomain.com\"`.\n4. **Restart**: Restart the service (`systemctl restart rustfs`).\n\n### Port in Domain (Optional) [#port-in-domain-optional]\n\nVirtual-host routing applies to the S3 API listener (port 9000 by default); RustFS automatically matches `Host` headers that carry the S3 listener's own port. Only when clients reach RustFS through a **different** port (for example via a proxy) do you need to include that port in `RUSTFS_SERVER_DOMAINS`.\n\nExample (`rustfs.yourdomain.com:8000`):\n\n```ini\nRUSTFS_SERVER_DOMAINS = \"rustfs.yourdomain.com:8000\"\n```\n\nThis ensures that requests like:\n\n```\nhttp://my-bucket.rustfs.yourdomain.com:8000/\n```\n\ncan be correctly resolved in Virtual Host Style mode.\n\n> ⚠️ Note: The value of `RUSTFS_SERVER_DOMAINS` must exactly match the **Host header** (including the port, if present) used by the client request\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "RustFS complies with S3 protocols. S3 supports two request modes:"
		},
		{
			"heading": void 0,
			"content": "Virtual Host Style"
		},
		{
			"heading": void 0,
			"content": "Path Style"
		},
		{
			"heading": void 0,
			"content": "The difference lies in the bucket name placement."
		},
		{
			"heading": "path-style",
			"content": "Path Style is the default. In Path Style, the bucket name follows the endpoint."
		},
		{
			"heading": "path-style",
			"content": "Example (Bucket: `test`, Host: `rustfs.yourdomain.com`):"
		},
		{
			"heading": "path-style",
			"content": "**Note**: No configuration is required for Path Style."
		},
		{
			"heading": "virtual-host-style",
			"content": "In Virtual Host Style, the bucket name is part of the domain."
		},
		{
			"heading": "virtual-host-style",
			"content": "Example (Bucket: `test`, Host: `rustfs.yourdomain.com`):"
		},
		{
			"heading": "configuration",
			"content": "**DNS**: Configure wildcard DNS resolution (e.g., `*.rustfs.yourdomain.com` -> Server IP)."
		},
		{
			"heading": "configuration",
			"content": "**Configuration**: Modify the configuration file (Linux: `/etc/default/rustfs`, Docker/K8s: env vars)."
		},
		{
			"heading": "configuration",
			"content": "**Set Domain**: Set `RUSTFS_SERVER_DOMAINS = \"rustfs.yourdomain.com\"`."
		},
		{
			"heading": "configuration",
			"content": "**Restart**: Restart the service (`systemctl restart rustfs`)."
		},
		{
			"heading": "port-in-domain-optional",
			"content": "Virtual-host routing applies to the S3 API listener (port 9000 by default); RustFS automatically matches `Host` headers that carry the S3 listener's own port. Only when clients reach RustFS through a **different** port (for example via a proxy) do you need to include that port in `RUSTFS_SERVER_DOMAINS`."
		},
		{
			"heading": "port-in-domain-optional",
			"content": "Example (`rustfs.yourdomain.com:8000`):"
		},
		{
			"heading": "port-in-domain-optional",
			"content": "This ensures that requests like:"
		},
		{
			"heading": "port-in-domain-optional",
			"content": "can be correctly resolved in Virtual Host Style mode."
		},
		{
			"heading": "port-in-domain-optional",
			"content": "> ⚠️ Note: The value of `RUSTFS_SERVER_DOMAINS` must exactly match the **Host header** (including the port, if present) used by the client request"
		}
	],
	"headings": [
		{
			"id": "path-style",
			"content": "Path Style"
		},
		{
			"id": "virtual-host-style",
			"content": "Virtual Host Style"
		},
		{
			"id": "configuration",
			"content": "Configuration"
		},
		{
			"id": "port-in-domain-optional",
			"content": "Port in Domain (Optional)"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#path-style",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Path Style" })
	},
	{
		depth: 2,
		url: "#virtual-host-style",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Virtual Host Style" })
	},
	{
		depth: 3,
		url: "#configuration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Configuration" })
	},
	{
		depth: 3,
		url: "#port-in-domain-optional",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Port in Domain (Optional)" })
	}
];
function _createMdxContent(props) {
	const _components = {
		blockquote: "blockquote",
		code: "code",
		h2: "h2",
		h3: "h3",
		li: "li",
		ol: "ol",
		p: "p",
		pre: "pre",
		span: "span",
		strong: "strong",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS complies with S3 protocols. S3 supports two request modes:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Virtual Host Style" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Path Style" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The difference lies in the bucket name placement." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "path-style",
			children: "Path Style"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Path Style is the default. In Path Style, the bucket name follows the endpoint." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Example (Bucket: ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "test" }),
			", Host: ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs.yourdomain.com" }),
			"):"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "http://rustfs.yourdomain.com/test" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Note" }), ": No configuration is required for Path Style."] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "virtual-host-style",
			children: "Virtual Host Style"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "In Virtual Host Style, the bucket name is part of the domain." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Example (Bucket: ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "test" }),
			", Host: ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs.yourdomain.com" }),
			"):"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "http://test.rustfs.yourdomain.com/" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "configuration",
			children: "Configuration"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "DNS" }),
				": Configure wildcard DNS resolution (e.g., ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "*.rustfs.yourdomain.com" }),
				" -> Server IP)."
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Configuration" }),
				": Modify the configuration file (Linux: ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "/etc/default/rustfs" }),
				", Docker/K8s: env vars)."
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Set Domain" }),
				": Set ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_SERVER_DOMAINS = \"rustfs.yourdomain.com\"" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Restart" }),
				": Restart the service (",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "systemctl restart rustfs" }),
				")."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "port-in-domain-optional",
			children: "Port in Domain (Optional)"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Virtual-host routing applies to the S3 API listener (port 9000 by default); RustFS automatically matches ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "Host" }),
			" headers that carry the S3 listener's own port. Only when clients reach RustFS through a ",
			(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "different" }),
			" port (for example via a proxy) do you need to include that port in ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_SERVER_DOMAINS" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Example (",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs.yourdomain.com:8000" }),
			"):"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.span, {
				className: "line",
				children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#D73A49",
							"--shiki-dark": "#F97583"
						},
						children: "RUSTFS_SERVER_DOMAINS"
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: " = "
					}),
					(0, import_jsx_runtime_react_server.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: "\"rustfs.yourdomain.com:8000\""
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This ensures that requests like:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: (0, import_jsx_runtime_react_server.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: (0, import_jsx_runtime_react_server.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime_react_server.jsx)(_components.span, { children: "http://my-bucket.rustfs.yourdomain.com:8000/" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "can be correctly resolved in Virtual Host Style mode." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
				"⚠️ Note: The value of ",
				(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "RUSTFS_SERVER_DOMAINS" }),
				" must exactly match the ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Host header" }),
				" (including the port, if present) used by the client request"
			] }),
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
