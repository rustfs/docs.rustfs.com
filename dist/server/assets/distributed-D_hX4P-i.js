import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/distributed/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Infrastructure for Large-Scale Data",
	"description": "RustFS is designed for scaling - technical scale, operational scale, and economic scale."
};
var _markdown = "\n\nRustFS is engineered for scalability across all dimensions: technical, operational, and economic.\n\nRustFS is designed to be cloud-native and can run as lightweight containers managed by external orchestration services like Kubernetes. The entire application is compiled into a single static binary (\\~100 MB) that efficiently uses CPU and memory resources even under high load. As a result, you can co-host large numbers of tenants on shared hardware.\n\n<Mermaid\n  chart=\"flowchart LR\n    APP[Applications] --> S3API([&#x22;S3 API&#x22;])\n\n    subgraph DIST[&#x22;Distributed RustFS&#x22;]\n        direction TB\n        subgraph N1[&#x22;Node 1&#x22;]\n            direction LR\n            S3a[S3]\n            subgraph OL1[&#x22;Object Layer&#x22;]\n                direction TB\n                C1[Cache]\n                K1[Compression]\n                E1[Encryption]\n                B1[&#x22;Erasure Code · Bitrot&#x22;]\n            end\n            SL1[&#x22;Storage Layer&#x22;]\n            J1[(&#x22;JBOD / FS disks&#x22;)]\n            S3a -->|Object API| OL1\n            OL1 -->|Storage API| SL1\n            SL1 <--> J1\n        end\n        subgraph N2[&#x22;Node 2&#x22;]\n            direction LR\n            S3b[S3]\n            subgraph OL2[&#x22;Object Layer&#x22;]\n                direction TB\n                C2[Cache]\n                K2[Compression]\n                E2[Encryption]\n                B2[&#x22;Erasure Code · Bitrot&#x22;]\n            end\n            SL2[&#x22;Storage Layer&#x22;]\n            J2[(&#x22;JBOD / FS disks&#x22;)]\n            S3b -->|Object API| OL2\n            OL2 -->|Storage API| SL2\n            SL2 <--> J2\n        end\n        NN[&#x22;Node n ...&#x22;]\n        N1 <-->|Internal RESTful API| N2\n        N2 <-->|Internal RESTful API| NN\n    end\n\n    S3API --> N1\n    S3API --> N2\n    S3API --> NN\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    class APP,NN muted\n    class S3API accent\n    class S3a,S3b,SL1,SL2 server\n    class C1,K1,E1,B1,C2,K2,E2,B2 svc\n    class J1,J2 store\"\n/>\n\nRustFS can run anywhere and on any cloud, but typically runs on commodity servers with locally attached drives (JBOD/JBOF). All servers in the cluster are functionally equal (fully symmetric architecture). There are no name nodes or metadata servers.\n\nRustFS atomically writes data and metadata, eliminating the need for a separate metadata database. Additionally, RustFS performs all functionality (erasure coding, bitrot checking, encryption) as inline, strictly consistent operations. This results in extraordinary resilience.\n\nEach RustFS cluster is a collection of distributed RustFS servers, with one process per node. RustFS runs as a single process in user space and uses lightweight coroutines to achieve high concurrency. Drives are grouped into erasure sets (see the [erasure code calculator](https://rustfs.com/erasure-code-calculator/)), and objects are placed on these sets using a deterministic hashing algorithm.\n\nRustFS is designed for large-scale, multi-datacenter cloud storage services. Each tenant runs their own RustFS cluster, completely isolated from other tenants, enabling them to protect themselves from any disruption due to upgrades, updates, and security events. Each tenant scales independently by federating clusters across geographies.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "RustFS is engineered for scalability across all dimensions: technical, operational, and economic."
		},
		{
			"heading": void 0,
			"content": "RustFS is designed to be cloud-native and can run as lightweight containers managed by external orchestration services like Kubernetes. The entire application is compiled into a single static binary (\\~100 MB) that efficiently uses CPU and memory resources even under high load. As a result, you can co-host large numbers of tenants on shared hardware."
		},
		{
			"heading": void 0,
			"content": "RustFS can run anywhere and on any cloud, but typically runs on commodity servers with locally attached drives (JBOD/JBOF). All servers in the cluster are functionally equal (fully symmetric architecture). There are no name nodes or metadata servers."
		},
		{
			"heading": void 0,
			"content": "RustFS atomically writes data and metadata, eliminating the need for a separate metadata database. Additionally, RustFS performs all functionality (erasure coding, bitrot checking, encryption) as inline, strictly consistent operations. This results in extraordinary resilience."
		},
		{
			"heading": void 0,
			"content": "Each RustFS cluster is a collection of distributed RustFS servers, with one process per node. RustFS runs as a single process in user space and uses lightweight coroutines to achieve high concurrency. Drives are grouped into erasure sets (see the erasure code calculator), and objects are placed on these sets using a deterministic hashing algorithm."
		},
		{
			"heading": void 0,
			"content": "RustFS is designed for large-scale, multi-datacenter cloud storage services. Each tenant runs their own RustFS cluster, completely isolated from other tenants, enabling them to protect themselves from any disruption due to upgrades, updates, and security events. Each tenant scales independently by federating clusters across geographies."
		}
	],
	"headings": []
};
var toc = [];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		p: "p",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is engineered for scalability across all dimensions: technical, operational, and economic." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is designed to be cloud-native and can run as lightweight containers managed by external orchestration services like Kubernetes. The entire application is compiled into a single static binary (~100 MB) that efficiently uses CPU and memory resources even under high load. As a result, you can co-host large numbers of tenants on shared hardware." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n    APP[Applications] --> S3API([\"S3 API\"])\n\n    subgraph DIST[\"Distributed RustFS\"]\n        direction TB\n        subgraph N1[\"Node 1\"]\n            direction LR\n            S3a[S3]\n            subgraph OL1[\"Object Layer\"]\n                direction TB\n                C1[Cache]\n                K1[Compression]\n                E1[Encryption]\n                B1[\"Erasure Code · Bitrot\"]\n            end\n            SL1[\"Storage Layer\"]\n            J1[(\"JBOD / FS disks\")]\n            S3a -->|Object API| OL1\n            OL1 -->|Storage API| SL1\n            SL1 <--> J1\n        end\n        subgraph N2[\"Node 2\"]\n            direction LR\n            S3b[S3]\n            subgraph OL2[\"Object Layer\"]\n                direction TB\n                C2[Cache]\n                K2[Compression]\n                E2[Encryption]\n                B2[\"Erasure Code · Bitrot\"]\n            end\n            SL2[\"Storage Layer\"]\n            J2[(\"JBOD / FS disks\")]\n            S3b -->|Object API| OL2\n            OL2 -->|Storage API| SL2\n            SL2 <--> J2\n        end\n        NN[\"Node n ...\"]\n        N1 <-->|Internal RESTful API| N2\n        N2 <-->|Internal RESTful API| NN\n    end\n\n    S3API --> N1\n    S3API --> N2\n    S3API --> NN\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    class APP,NN muted\n    class S3API accent\n    class S3a,S3b,SL1,SL2 server\n    class C1,K1,E1,B1,C2,K2,E2,B2 svc\n    class J1,J2 store" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS can run anywhere and on any cloud, but typically runs on commodity servers with locally attached drives (JBOD/JBOF). All servers in the cluster are functionally equal (fully symmetric architecture). There are no name nodes or metadata servers." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS atomically writes data and metadata, eliminating the need for a separate metadata database. Additionally, RustFS performs all functionality (erasure coding, bitrot checking, encryption) as inline, strictly consistent operations. This results in extraordinary resilience." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Each RustFS cluster is a collection of distributed RustFS servers, with one process per node. RustFS runs as a single process in user space and uses lightweight coroutines to achieve high concurrency. Drives are grouped into erasure sets (see the ",
			(0, import_jsx_runtime_react_server.jsx)(_components.a, {
				href: "https://rustfs.com/erasure-code-calculator/",
				children: "erasure code calculator"
			}),
			"), and objects are placed on these sets using a deterministic hashing algorithm."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is designed for large-scale, multi-datacenter cloud storage services. Each tenant runs their own RustFS cluster, completely isolated from other tenants, enabling them to protect themselves from any disruption due to upgrades, updates, and security events. Each tenant scales independently by federating clusters across geographies." })
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
