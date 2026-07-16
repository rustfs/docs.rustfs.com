import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/developer/sdk/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS SDK Overview",
	"description": "Overview of supported S3 SDKs for RustFS."
};
var _markdown = "\n\nRustFS is a distributed object storage system fully compatible with the S3 protocol. Users can:\n\n* Manage RustFS through the Console management interface.\n* Manage RustFS through S3 clients.\n* Implement object storage operations and management on the business side through SDKs.\n\nCurrently, the SDKs provided by RustFS include:\n\n* [Java SDK](./java.md)\n* [JavaScript SDK](./javascript.md)\n* [Python SDK](./python.md)\n* [Rust SDK](./rust.md)\n* [TypeScript SDK](./typescript.md)\n* [Golang SDK](./go.md)\n\n## Terminology [#terminology]\n\nAmazon S3 (Simple Storage Service) was the first widely adopted object storage service. Its API has become the de facto standard for object storage. In this documentation, \"S3\" refers to the protocol.\n\n## SDK Recommendations [#sdk-recommendations]\n\nWe recommend using the official AWS S3 SDKs. These SDKs are mature, well-maintained, and highly optimized.\n\nIf you have a familiar and trusted SDK from a vendor, you can use it.\n\nSome third-party SDKs may have non-standard implementations. We recommend avoiding SDKs that are not strictly S3-compliant.\n\n## Compatibility with MinIO SDKs [#compatibility-with-minio-sdks]\n\nYes, RustFS is fully compatible with MinIO SDKs.\n\nIf you are using MinIO SDKs, you can modify the Endpoint, AK, and SK to be directly compatible with RustFS.\n\n## Handling Incompatible SDKs [#handling-incompatible-sdks]\n\nIf you encounter an SDK that does not support standard S3, MinIO, or RustFS:\n\nWe recommend switching to a standard AWS S3 SDK.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "RustFS is a distributed object storage system fully compatible with the S3 protocol. Users can:"
		},
		{
			"heading": void 0,
			"content": "Manage RustFS through the Console management interface."
		},
		{
			"heading": void 0,
			"content": "Manage RustFS through S3 clients."
		},
		{
			"heading": void 0,
			"content": "Implement object storage operations and management on the business side through SDKs."
		},
		{
			"heading": void 0,
			"content": "Currently, the SDKs provided by RustFS include:"
		},
		{
			"heading": void 0,
			"content": "Java SDK"
		},
		{
			"heading": void 0,
			"content": "JavaScript SDK"
		},
		{
			"heading": void 0,
			"content": "Python SDK"
		},
		{
			"heading": void 0,
			"content": "Rust SDK"
		},
		{
			"heading": void 0,
			"content": "TypeScript SDK"
		},
		{
			"heading": void 0,
			"content": "Golang SDK"
		},
		{
			"heading": "terminology",
			"content": "Amazon S3 (Simple Storage Service) was the first widely adopted object storage service. Its API has become the de facto standard for object storage. In this documentation, \"S3\" refers to the protocol."
		},
		{
			"heading": "sdk-recommendations",
			"content": "We recommend using the official AWS S3 SDKs. These SDKs are mature, well-maintained, and highly optimized."
		},
		{
			"heading": "sdk-recommendations",
			"content": "If you have a familiar and trusted SDK from a vendor, you can use it."
		},
		{
			"heading": "sdk-recommendations",
			"content": "Some third-party SDKs may have non-standard implementations. We recommend avoiding SDKs that are not strictly S3-compliant."
		},
		{
			"heading": "compatibility-with-minio-sdks",
			"content": "Yes, RustFS is fully compatible with MinIO SDKs."
		},
		{
			"heading": "compatibility-with-minio-sdks",
			"content": "If you are using MinIO SDKs, you can modify the Endpoint, AK, and SK to be directly compatible with RustFS."
		},
		{
			"heading": "handling-incompatible-sdks",
			"content": "If you encounter an SDK that does not support standard S3, MinIO, or RustFS:"
		},
		{
			"heading": "handling-incompatible-sdks",
			"content": "We recommend switching to a standard AWS S3 SDK."
		}
	],
	"headings": [
		{
			"id": "terminology",
			"content": "Terminology"
		},
		{
			"id": "sdk-recommendations",
			"content": "SDK Recommendations"
		},
		{
			"id": "compatibility-with-minio-sdks",
			"content": "Compatibility with MinIO SDKs"
		},
		{
			"id": "handling-incompatible-sdks",
			"content": "Handling Incompatible SDKs"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#terminology",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Terminology" })
	},
	{
		depth: 2,
		url: "#sdk-recommendations",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "SDK Recommendations" })
	},
	{
		depth: 2,
		url: "#compatibility-with-minio-sdks",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Compatibility with MinIO SDKs" })
	},
	{
		depth: 2,
		url: "#handling-incompatible-sdks",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Handling Incompatible SDKs" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		h2: "h2",
		li: "li",
		p: "p",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is a distributed object storage system fully compatible with the S3 protocol. Users can:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Manage RustFS through the Console management interface." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Manage RustFS through S3 clients." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Implement object storage operations and management on the business side through SDKs." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Currently, the SDKs provided by RustFS include:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./java.md",
				children: "Java SDK"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./javascript.md",
				children: "JavaScript SDK"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./python.md",
				children: "Python SDK"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./rust.md",
				children: "Rust SDK"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./typescript.md",
				children: "TypeScript SDK"
			}) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "./go.md",
				children: "Golang SDK"
			}) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "terminology",
			children: "Terminology"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Amazon S3 (Simple Storage Service) was the first widely adopted object storage service. Its API has become the de facto standard for object storage. In this documentation, \"S3\" refers to the protocol." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "sdk-recommendations",
			children: "SDK Recommendations"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "We recommend using the official AWS S3 SDKs. These SDKs are mature, well-maintained, and highly optimized." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If you have a familiar and trusted SDK from a vendor, you can use it." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Some third-party SDKs may have non-standard implementations. We recommend avoiding SDKs that are not strictly S3-compliant." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "compatibility-with-minio-sdks",
			children: "Compatibility with MinIO SDKs"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Yes, RustFS is fully compatible with MinIO SDKs." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If you are using MinIO SDKs, you can modify the Endpoint, AK, and SK to be directly compatible with RustFS." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "handling-incompatible-sdks",
			children: "Handling Incompatible SDKs"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If you encounter an SDK that does not support standard S3, MinIO, or RustFS:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "We recommend switching to a standard AWS S3 SDK." })
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
