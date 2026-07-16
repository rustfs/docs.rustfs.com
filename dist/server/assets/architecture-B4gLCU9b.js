import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/concepts/architecture.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS Architecture",
	"description": "Introduction to RustFS Architecture"
};
var _markdown = "\n\nRustFS is a high-performance object storage system compatible with the AWS S3 API. It features a concise, lightweight, scalable, and decentralized architecture.\n\nObjects can be documents, videos, PDF files, or any other unstructured data. RustFS provides a scalable, flexible, and efficient solution for storing, accessing, and managing this data. Its compatibility with the AWS S3 API enables seamless integration with existing S3-based applications.\n\nThe following diagram illustrates the architecture:\n\n<Mermaid\n  chart=\"flowchart LR\n    APP[Applications] --> S3API([&#x22;S3 API&#x22;])\n\n    subgraph DIST[&#x22;Distributed RustFS&#x22;]\n        direction TB\n        subgraph N1[&#x22;Node 1&#x22;]\n            direction LR\n            S3a[S3]\n            subgraph OL1[&#x22;Object Layer&#x22;]\n                direction TB\n                C1[Cache]\n                K1[Compression]\n                E1[Encryption]\n                B1[&#x22;Erasure Code · Bitrot&#x22;]\n            end\n            SL1[&#x22;Storage Layer&#x22;]\n            J1[(&#x22;JBOD / FS disks&#x22;)]\n            S3a -->|Object API| OL1\n            OL1 -->|Storage API| SL1\n            SL1 <--> J1\n        end\n        subgraph N2[&#x22;Node 2&#x22;]\n            direction LR\n            S3b[S3]\n            subgraph OL2[&#x22;Object Layer&#x22;]\n                direction TB\n                C2[Cache]\n                K2[Compression]\n                E2[Encryption]\n                B2[&#x22;Erasure Code · Bitrot&#x22;]\n            end\n            SL2[&#x22;Storage Layer&#x22;]\n            J2[(&#x22;JBOD / FS disks&#x22;)]\n            S3b -->|Object API| OL2\n            OL2 -->|Storage API| SL2\n            SL2 <--> J2\n        end\n        NN[&#x22;Node n ...&#x22;]\n        N1 <-->|Internal RESTful API| N2\n        N2 <-->|Internal RESTful API| NN\n    end\n\n    S3API --> N1\n    S3API --> N2\n    S3API --> NN\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    class APP,NN muted\n    class S3API accent\n    class S3a,S3b,SL1,SL2 server\n    class C1,K1,E1,B1,C2,K2,E2,B2 svc\n    class J1,J2 store\"\n/>\n\nThis diagram represents the basic architecture of RustFS. A distributed grid uses multiple nodes to execute a single task, connected via a network to enable communication.\n\n## Consistency Design [#consistency-design]\n\nIn both distributed and single-machine modes, all read and write operations strictly follow the **read-after-write** consistency model.\n\n## Key Concepts [#key-concepts]\n\n**Object**: The fundamental unit of storage in RustFS, representing files, byte streams, or any unstructured data.\n\n**Bucket**: A logical container for storing objects. Data is isolated between buckets. For clients, it functions similarly to a top-level directory.\n\n**Drive**: The physical disk that stores data, passed as a parameter when RustFS starts. All object data in RustFS is stored on these drives.\n\n**Set**: A group of drives. Distributed deployment automatically divides the cluster into one or more sets based on scale. Drives in each set are distributed across different locations. An object is stored within a single set. (Sometimes referred to as **Stripes**).\n\nConsider the following when designing the architecture and deploying devices:\n\n* One object is stored on one set.\n* One cluster is divided into multiple sets.\n* The number of drives in a set is fixed, defaulting to automatic calculation by the system based on cluster scale.\n* Drives in a set should be distributed across different nodes as much as possible.\n\n## Architectural Design [#architectural-design]\n\nTraditional distributed storage architectures often rely on distinct Master nodes, Metadata nodes, and Data nodes. This complexity can make deployment challenging and introduces single points of failure—if metadata is lost, data integrity is at risk.\n\nRustFS adopts a decentralized, peer-to-peer architecture where all nodes are equal. This design greatly simplifies deployment and eliminates metadata bottlenecks. A single command is sufficient to start the system.\n\nRustFS draws inspiration from the elegant and scalable architecture of MinIO, adopting a similar design philosophy that prioritizes simplicity and reliability without compromising on features. We acknowledge MinIO's contribution to promoting the S3 protocol and setting a high standard for object storage architecture.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "RustFS is a high-performance object storage system compatible with the AWS S3 API. It features a concise, lightweight, scalable, and decentralized architecture."
		},
		{
			"heading": void 0,
			"content": "Objects can be documents, videos, PDF files, or any other unstructured data. RustFS provides a scalable, flexible, and efficient solution for storing, accessing, and managing this data. Its compatibility with the AWS S3 API enables seamless integration with existing S3-based applications."
		},
		{
			"heading": void 0,
			"content": "The following diagram illustrates the architecture:"
		},
		{
			"heading": void 0,
			"content": "This diagram represents the basic architecture of RustFS. A distributed grid uses multiple nodes to execute a single task, connected via a network to enable communication."
		},
		{
			"heading": "consistency-design",
			"content": "In both distributed and single-machine modes, all read and write operations strictly follow the **read-after-write** consistency model."
		},
		{
			"heading": "key-concepts",
			"content": "**Object**: The fundamental unit of storage in RustFS, representing files, byte streams, or any unstructured data."
		},
		{
			"heading": "key-concepts",
			"content": "**Bucket**: A logical container for storing objects. Data is isolated between buckets. For clients, it functions similarly to a top-level directory."
		},
		{
			"heading": "key-concepts",
			"content": "**Drive**: The physical disk that stores data, passed as a parameter when RustFS starts. All object data in RustFS is stored on these drives."
		},
		{
			"heading": "key-concepts",
			"content": "**Set**: A group of drives. Distributed deployment automatically divides the cluster into one or more sets based on scale. Drives in each set are distributed across different locations. An object is stored within a single set. (Sometimes referred to as **Stripes**)."
		},
		{
			"heading": "key-concepts",
			"content": "Consider the following when designing the architecture and deploying devices:"
		},
		{
			"heading": "key-concepts",
			"content": "One object is stored on one set."
		},
		{
			"heading": "key-concepts",
			"content": "One cluster is divided into multiple sets."
		},
		{
			"heading": "key-concepts",
			"content": "The number of drives in a set is fixed, defaulting to automatic calculation by the system based on cluster scale."
		},
		{
			"heading": "key-concepts",
			"content": "Drives in a set should be distributed across different nodes as much as possible."
		},
		{
			"heading": "architectural-design",
			"content": "Traditional distributed storage architectures often rely on distinct Master nodes, Metadata nodes, and Data nodes. This complexity can make deployment challenging and introduces single points of failure—if metadata is lost, data integrity is at risk."
		},
		{
			"heading": "architectural-design",
			"content": "RustFS adopts a decentralized, peer-to-peer architecture where all nodes are equal. This design greatly simplifies deployment and eliminates metadata bottlenecks. A single command is sufficient to start the system."
		},
		{
			"heading": "architectural-design",
			"content": "RustFS draws inspiration from the elegant and scalable architecture of MinIO, adopting a similar design philosophy that prioritizes simplicity and reliability without compromising on features. We acknowledge MinIO's contribution to promoting the S3 protocol and setting a high standard for object storage architecture."
		}
	],
	"headings": [
		{
			"id": "consistency-design",
			"content": "Consistency Design"
		},
		{
			"id": "key-concepts",
			"content": "Key Concepts"
		},
		{
			"id": "architectural-design",
			"content": "Architectural Design"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#consistency-design",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Consistency Design" })
	},
	{
		depth: 2,
		url: "#key-concepts",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Key Concepts" })
	},
	{
		depth: 2,
		url: "#architectural-design",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Architectural Design" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		li: "li",
		p: "p",
		strong: "strong",
		ul: "ul",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is a high-performance object storage system compatible with the AWS S3 API. It features a concise, lightweight, scalable, and decentralized architecture." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Objects can be documents, videos, PDF files, or any other unstructured data. RustFS provides a scalable, flexible, and efficient solution for storing, accessing, and managing this data. Its compatibility with the AWS S3 API enables seamless integration with existing S3-based applications." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The following diagram illustrates the architecture:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n    APP[Applications] --> S3API([\"S3 API\"])\n\n    subgraph DIST[\"Distributed RustFS\"]\n        direction TB\n        subgraph N1[\"Node 1\"]\n            direction LR\n            S3a[S3]\n            subgraph OL1[\"Object Layer\"]\n                direction TB\n                C1[Cache]\n                K1[Compression]\n                E1[Encryption]\n                B1[\"Erasure Code · Bitrot\"]\n            end\n            SL1[\"Storage Layer\"]\n            J1[(\"JBOD / FS disks\")]\n            S3a -->|Object API| OL1\n            OL1 -->|Storage API| SL1\n            SL1 <--> J1\n        end\n        subgraph N2[\"Node 2\"]\n            direction LR\n            S3b[S3]\n            subgraph OL2[\"Object Layer\"]\n                direction TB\n                C2[Cache]\n                K2[Compression]\n                E2[Encryption]\n                B2[\"Erasure Code · Bitrot\"]\n            end\n            SL2[\"Storage Layer\"]\n            J2[(\"JBOD / FS disks\")]\n            S3b -->|Object API| OL2\n            OL2 -->|Storage API| SL2\n            SL2 <--> J2\n        end\n        NN[\"Node n ...\"]\n        N1 <-->|Internal RESTful API| N2\n        N2 <-->|Internal RESTful API| NN\n    end\n\n    S3API --> N1\n    S3API --> N2\n    S3API --> NN\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    class APP,NN muted\n    class S3API accent\n    class S3a,S3b,SL1,SL2 server\n    class C1,K1,E1,B1,C2,K2,E2,B2 svc\n    class J1,J2 store" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This diagram represents the basic architecture of RustFS. A distributed grid uses multiple nodes to execute a single task, connected via a network to enable communication." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "consistency-design",
			children: "Consistency Design"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"In both distributed and single-machine modes, all read and write operations strictly follow the ",
			(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "read-after-write" }),
			" consistency model."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "key-concepts",
			children: "Key Concepts"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Object" }), ": The fundamental unit of storage in RustFS, representing files, byte streams, or any unstructured data."] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Bucket" }), ": A logical container for storing objects. Data is isolated between buckets. For clients, it functions similarly to a top-level directory."] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Drive" }), ": The physical disk that stores data, passed as a parameter when RustFS starts. All object data in RustFS is stored on these drives."] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Set" }),
			": A group of drives. Distributed deployment automatically divides the cluster into one or more sets based on scale. Drives in each set are distributed across different locations. An object is stored within a single set. (Sometimes referred to as ",
			(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Stripes" }),
			")."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Consider the following when designing the architecture and deploying devices:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "One object is stored on one set." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "One cluster is divided into multiple sets." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "The number of drives in a set is fixed, defaulting to automatic calculation by the system based on cluster scale." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Drives in a set should be distributed across different nodes as much as possible." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "architectural-design",
			children: "Architectural Design"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Traditional distributed storage architectures often rely on distinct Master nodes, Metadata nodes, and Data nodes. This complexity can make deployment challenging and introduces single points of failure—if metadata is lost, data integrity is at risk." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS adopts a decentralized, peer-to-peer architecture where all nodes are equal. This design greatly simplifies deployment and eliminates metadata bottlenecks. A single command is sufficient to start the system." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS draws inspiration from the elegant and scalable architecture of MinIO, adopting a similar design philosophy that prioritizes simplicity and reliability without compromising on features. We acknowledge MinIO's contribution to promoting the S3 protocol and setting a high standard for object storage architecture." })
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
