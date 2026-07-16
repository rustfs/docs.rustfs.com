import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/small-file/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Small File Optimization",
	"description": "Memory Object Storage for High Performance"
};
var _markdown = "\n\n> Memory Object Storage for High Performance\n\nUse server DRAM for distributed shared memory pools for workloads requiring massive IOPS and throughput performance.\n\n## Background [#background]\n\nSmall file optimization improves IOPS and throughput. In modern architectures, this is critical for AI/ML workloads. Without caching, I/O can become a bottleneck for GPUs.\n\nCaching accelerates access to training, validation, and test datasets.\n\n## Features [#features]\n\n### Dedicated Object Cache [#dedicated-object-cache]\n\nRustFS small file optimization is designed for caching file objects.\nIf an object is not found in the cache, RustFS retrieves it, caches it for future requests, and returns it to the caller.\n\n### Consistent Hashing [#consistent-hashing]\n\nRustFS uses consistent hashing algorithms to distribute cached object data across a cluster of cache nodes. Consistent hashing ensures objects can be easily found based on the object's key. This creates a one-to-one relationship between the object's key and the node holding the cached object. It ensures balanced data distribution and minimizes reshuffling when nodes are added or removed.\n\n### Rolling Cache [#rolling-cache]\n\nRustFS uses rolling cache for memory management. It keeps the total cache size within specified limits. If adding new objects would exceed the limit, objects are removed based on timestamps (LRU).\n\n### Automatic Version Updates [#automatic-version-updates]\n\nRustFS automatically updates the cache with new object versions when they are updated in storage.\n\n### Seamless API Integration [#seamless-api-integration]\n\nSmall file optimization is a seamlessly integrated extension of RustFS. Developers use the same APIs. If the requested object is in cache, RustFS fetches it from cache. If not, it fetches from storage and caches it.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "> Memory Object Storage for High Performance"
		},
		{
			"heading": void 0,
			"content": "Use server DRAM for distributed shared memory pools for workloads requiring massive IOPS and throughput performance."
		},
		{
			"heading": "background",
			"content": "Small file optimization improves IOPS and throughput. In modern architectures, this is critical for AI/ML workloads. Without caching, I/O can become a bottleneck for GPUs."
		},
		{
			"heading": "background",
			"content": "Caching accelerates access to training, validation, and test datasets."
		},
		{
			"heading": "dedicated-object-cache",
			"content": "RustFS small file optimization is designed for caching file objects.\nIf an object is not found in the cache, RustFS retrieves it, caches it for future requests, and returns it to the caller."
		},
		{
			"heading": "consistent-hashing",
			"content": "RustFS uses consistent hashing algorithms to distribute cached object data across a cluster of cache nodes. Consistent hashing ensures objects can be easily found based on the object's key. This creates a one-to-one relationship between the object's key and the node holding the cached object. It ensures balanced data distribution and minimizes reshuffling when nodes are added or removed."
		},
		{
			"heading": "rolling-cache",
			"content": "RustFS uses rolling cache for memory management. It keeps the total cache size within specified limits. If adding new objects would exceed the limit, objects are removed based on timestamps (LRU)."
		},
		{
			"heading": "automatic-version-updates",
			"content": "RustFS automatically updates the cache with new object versions when they are updated in storage."
		},
		{
			"heading": "seamless-api-integration",
			"content": "Small file optimization is a seamlessly integrated extension of RustFS. Developers use the same APIs. If the requested object is in cache, RustFS fetches it from cache. If not, it fetches from storage and caches it."
		}
	],
	"headings": [
		{
			"id": "background",
			"content": "Background"
		},
		{
			"id": "features",
			"content": "Features"
		},
		{
			"id": "dedicated-object-cache",
			"content": "Dedicated Object Cache"
		},
		{
			"id": "consistent-hashing",
			"content": "Consistent Hashing"
		},
		{
			"id": "rolling-cache",
			"content": "Rolling Cache"
		},
		{
			"id": "automatic-version-updates",
			"content": "Automatic Version Updates"
		},
		{
			"id": "seamless-api-integration",
			"content": "Seamless API Integration"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#background",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Background" })
	},
	{
		depth: 2,
		url: "#features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Features" })
	},
	{
		depth: 3,
		url: "#dedicated-object-cache",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Dedicated Object Cache" })
	},
	{
		depth: 3,
		url: "#consistent-hashing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Consistent Hashing" })
	},
	{
		depth: 3,
		url: "#rolling-cache",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Rolling Cache" })
	},
	{
		depth: 3,
		url: "#automatic-version-updates",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Automatic Version Updates" })
	},
	{
		depth: 3,
		url: "#seamless-api-integration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Seamless API Integration" })
	}
];
function _createMdxContent(props) {
	const _components = {
		blockquote: "blockquote",
		h2: "h2",
		h3: "h3",
		p: "p",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Memory Object Storage for High Performance" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Use server DRAM for distributed shared memory pools for workloads requiring massive IOPS and throughput performance." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "background",
			children: "Background"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Small file optimization improves IOPS and throughput. In modern architectures, this is critical for AI/ML workloads. Without caching, I/O can become a bottleneck for GPUs." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Caching accelerates access to training, validation, and test datasets." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "features",
			children: "Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "dedicated-object-cache",
			children: "Dedicated Object Cache"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS small file optimization is designed for caching file objects.\nIf an object is not found in the cache, RustFS retrieves it, caches it for future requests, and returns it to the caller." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "consistent-hashing",
			children: "Consistent Hashing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS uses consistent hashing algorithms to distribute cached object data across a cluster of cache nodes. Consistent hashing ensures objects can be easily found based on the object's key. This creates a one-to-one relationship between the object's key and the node holding the cached object. It ensures balanced data distribution and minimizes reshuffling when nodes are added or removed." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "rolling-cache",
			children: "Rolling Cache"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS uses rolling cache for memory management. It keeps the total cache size within specified limits. If adding new objects would exceed the limit, objects are removed based on timestamps (LRU)." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "automatic-version-updates",
			children: "Automatic Version Updates"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS automatically updates the cache with new object versions when they are updated in storage." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "seamless-api-integration",
			children: "Seamless API Integration"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Small file optimization is a seamlessly integrated extension of RustFS. Developers use the same APIs. If the requested object is in cache, RustFS fetches it from cache. If not, it fetches from storage and caches it." })
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
