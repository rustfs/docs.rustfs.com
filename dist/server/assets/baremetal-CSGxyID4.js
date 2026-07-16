import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/baremetal/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Bare Metal and Virtualized Deployment",
	"description": "Open source, S3-compatible, and enterprise-hardened."
};
var _markdown = "\n\nOpen source, S3-compatible, and enterprise-hardened.\n\nRustFS is a high-performance distributed object storage system. It is software-defined, runs on industry-standard hardware, and is 100% open source (Apache V2.0).\n\nRustFS is designed for private/hybrid cloud object storage. Its single-layer architecture achieves all necessary functionality without compromising performance. RustFS is high-performance, scalable, and lightweight.\n\nRustFS supports traditional use cases (secondary storage, disaster recovery, archiving) and modern workloads (machine learning, analytics, cloud-native applications).\n\n## Core Features [#core-features]\n\n### Erasure Coding [#erasure-coding]\n\nRustFS uses inline erasure coding to protect data while providing high performance. RustFS uses Reed-Solomon codes to stripe objects into data and parity blocks with user-configurable redundancy levels.\n\nWith maximum parity of N/2, RustFS can ensure uninterrupted read and write operations using only ((N/2)+1) operational drives. For example, in a 12-drive setup (6 data + 6 parity), RustFS can reliably write new objects or rebuild existing objects with only 7 drives remaining.\n\n<Mermaid\n  chart=\"flowchart TD\n  EX([&#x22;export-xl&#x22;])\n  EX --> D1[(&#x22;Disk1&#x22;)]\n  EX --> D2[(&#x22;Disk2&#x22;)]\n  EX --> D3[(&#x22;Disk3&#x22;)]\n  EX --> D4[(&#x22;Disk4&#x22;)]\n  D1 --> B1[&#x22;MyBucket&#x22;]\n  D2 --> B2[&#x22;MyBucket&#x22;]\n  D3 --> B3[&#x22;MyBucket&#x22;]\n  D4 --> B4[&#x22;MyBucket&#x22;]\n  B1 --> O1[&#x22;MyObject&#x22;]\n  B2 --> O2[&#x22;MyObject&#x22;]\n  B3 --> O3[&#x22;MyObject&#x22;]\n  B4 --> O4[&#x22;MyObject&#x22;]\n  O1 --> F1[&#x22;xl.json part.1&#x22;]\n  O2 --> F2[&#x22;xl.json part.1&#x22;]\n  O3 --> F3[&#x22;xl.json part.1&#x22;]\n  O4 --> F4[&#x22;xl.json part.1&#x22;]\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class EX accent\n  class D1,D2,D3,D4 store\n  class B1,B2,B3,B4 server\n  class O1,O2,O3,O4 svc\n  class F1,F2,F3,F4 muted\"\n/>\n\n### Bitrot Protection [#bitrot-protection]\n\nBitrot (silent data corruption) is a serious problem for disk drives. RustFS uses HighwayHash to detect and repair corrupted data. By calculating hashes on READ and verifying them on WRITE, it ensures end-to-end integrity. The implementation achieves hash speeds exceeding 10 GB/s on a single core.\n\n<Mermaid\n  chart=\"flowchart TD\n  H[&#x22;Object · erasure-coded across 16 drives&#x22;]\n  S[&#x22;Tolerates 8 disk failures&#x22;]\n  H --> S\n  subgraph DATA[&#x22;Data Block&#x22;]\n    direction LR\n    d1[&#x22;1 checksum&#x22;]\n    d2[&#x22;2 checksum&#x22;]\n    d3[&#x22;3 checksum&#x22;]\n    de[&#x22;...&#x22;]\n    d8[&#x22;8 checksum&#x22;]\n    d1 -.- d2 -.- d3 -.- de -.- d8\n  end\n  subgraph PARITY[&#x22;Parity Block&#x22;]\n    direction LR\n    p1[&#x22;1P checksum&#x22;]\n    p2[&#x22;2P checksum&#x22;]\n    p3[&#x22;3P checksum&#x22;]\n    pe[&#x22;...&#x22;]\n    p8[&#x22;8P checksum&#x22;]\n    p1 -.- p2 -.- p3 -.- pe -.- p8\n  end\n  S --> DATA\n  S --> PARITY\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  class H svc\n  class d1,d2,d3,d8,de muted\n  class p1,p2,p3,p8,pe server\"\n/>\n\n### Server-Side Encryption [#server-side-encryption]\n\nRustFS supports multiple server-side encryption schemes to protect data at rest. RustFS ensures confidentiality, integrity, and authenticity with negligible performance overhead. Supported algorithms include AES-256-GCM, ChaCha20-Poly1305, and AES-CBC.\n\nEncrypted objects are tamper-proof using AEAD server-side encryption. RustFS is compatible with common key management solutions (e.g., HashiCorp Vault) and uses KMS to support SSE-S3.\n\nIf a client requests SSE-S3 or auto-encryption is enabled, the RustFS server encrypts each object with a unique object key protected by a master key managed by KMS.\n\n<Mermaid\n  chart=\"flowchart LR\n  D1[&#x22;Data · SSE-S3&#x22;]\n  D2[&#x22;Data · SSE-C&#x22;]\n  R([&#x22;RustFS&#x22;])\n  KMS[(&#x22;KMS&#x22;)]\n  B1[&#x22;My Bucket&#x22;]\n  B2[&#x22;My Bucket&#x22;]\n  O1[&#x22;Object&#x22;]\n  O2[&#x22;Object&#x22;]\n  O3[&#x22;Object&#x22;]\n  O4[&#x22;Object&#x22;]\n  O5[&#x22;Object&#x22;]\n  O6[&#x22;Object&#x22;]\n  D1 --> R\n  D2 --> R\n  R --> KMS\n  R --> B1\n  R --> B2\n  B1 --> O1\n  B1 --> O2\n  B1 --> O3\n  B2 --> O4\n  B2 --> O5\n  B2 --> O6\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class D1,D2 server\n  class R accent\n  class KMS store\n  class B1,B2 svc\n  class O1,O2,O3,O4,O5,O6 svc\"\n/>\n\n### WORM (Write Once Read Many) [#worm-write-once-read-many]\n\n#### Identity Management [#identity-management]\n\nRustFS supports advanced identity management standards and integrates with OpenID Connect providers and major external IDP vendors. Access is centralized, and passwords are temporary and rotated. Access policies are fine-grained and highly configurable.\n\n#### Continuous Replication [#continuous-replication]\n\nThe challenge with traditional replication methods is that they don't scale effectively beyond a few hundred TiB. That said, everyone needs a replication strategy to support disaster recovery, and that strategy needs to span geographic locations, data centers, and clouds.\n\nRustFS's continuous replication is designed for large-scale, cross-data center deployments. By leveraging Lambda compute notifications and object metadata, it can efficiently and quickly calculate increments. Lambda notifications ensure immediate propagation of changes rather than traditional batch modes.\n\nContinuous replication means that in case of failure, data loss remains minimal - even in the face of highly dynamic datasets. Finally, like other RustFS features, continuous replication is multi-vendor, meaning your backup location can be anywhere from NAS to public cloud.\n\n#### Global Federation [#global-federation]\n\nModern enterprise data is everywhere. RustFS allows these disparate instances to be combined to form a unified global namespace. Specifically, any number of RustFS servers can be combined into a distributed mode set, and multiple distributed mode sets can be combined into a RustFS server federation. Each RustFS server federation provides unified administration and namespace.\n\nRustFS federated servers support unlimited numbers of distributed mode sets. The impact of this approach is that object storage can scale massively for large enterprises with geographically dispersed locations while retaining the ability to accommodate various applications (Splunk, Teradata, Spark, Hive, Presto, TensorFlow, H20) from a single console.\n\n#### Multi-Cloud Gateway [#multi-cloud-gateway]\n\nAll enterprises are adopting multi-cloud strategies. This includes private clouds as well. Therefore, your bare metal virtualized containers and public cloud services (including non-S3 providers like Google, Microsoft, and Alibaba) must look the same. While modern applications are highly portable, the data supporting these applications is not.\n\nProviding access to this data regardless of where it resides is the primary challenge RustFS solves. RustFS runs on bare metal, network-attached storage, and every public cloud. More importantly, RustFS ensures that from an application and management perspective, the view of that data looks exactly the same through the Amazon S3 API.\n\nRustFS can go further, making your existing storage infrastructure Amazon S3 compatible. The implications are profound. Now organizations can truly unify their data infrastructure - from file to block, all data appears as objects accessible through the Amazon S3 API without migration.\n\nWhen WORM is enabled, RustFS disables all APIs that might alter object data and metadata. This means data becomes tamper-proof once written. This has practical applications in many different regulatory requirements.\n\n<Mermaid\n  chart=\"flowchart LR\n    APP[Applications] --> S3API([&#x22;S3 API&#x22;])\n\n    subgraph DIST[&#x22;Distributed RustFS&#x22;]\n        direction TB\n        subgraph N1[&#x22;Node 1&#x22;]\n            direction LR\n            S3a[S3]\n            subgraph OL1[&#x22;Object Layer&#x22;]\n                direction TB\n                C1[Cache]\n                K1[Compression]\n                E1[Encryption]\n                B1[&#x22;Erasure Code · Bitrot&#x22;]\n            end\n            SL1[&#x22;Storage Layer&#x22;]\n            J1[(&#x22;JBOD / FS disks&#x22;)]\n            S3a -->|Object API| OL1\n            OL1 -->|Storage API| SL1\n            SL1 <--> J1\n        end\n        subgraph N2[&#x22;Node 2&#x22;]\n            direction LR\n            S3b[S3]\n            subgraph OL2[&#x22;Object Layer&#x22;]\n                direction TB\n                C2[Cache]\n                K2[Compression]\n                E2[Encryption]\n                B2[&#x22;Erasure Code · Bitrot&#x22;]\n            end\n            SL2[&#x22;Storage Layer&#x22;]\n            J2[(&#x22;JBOD / FS disks&#x22;)]\n            S3b -->|Object API| OL2\n            OL2 -->|Storage API| SL2\n            SL2 <--> J2\n        end\n        NN[&#x22;Node n ...&#x22;]\n        N1 <-->|Internal RESTful API| N2\n        N2 <-->|Internal RESTful API| NN\n    end\n\n    S3API --> N1\n    S3API --> N2\n    S3API --> NN\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    class APP,NN muted\n    class S3API accent\n    class S3a,S3b,SL1,SL2 server\n    class C1,K1,E1,B1,C2,K2,E2,B2 svc\n    class J1,J2 store\"\n/>\n\n## System Architecture [#system-architecture]\n\nRustFS is designed to be cloud-native and can run as lightweight containers managed by external orchestration services like Kubernetes. The application is compiled into a single static binary (\\~100 MB) that efficiently uses CPU and memory resources even under high load. As a result, you can co-host a large number of tenants on shared hardware.\n\nRustFS runs on commodity servers with locally attached drives (JBOD/JBOF). All servers in the cluster are functionally equal (completely symmetric architecture). There are no name nodes or metadata servers.\n\nRustFS writes data and metadata together as objects, requiring no metadata database. Additionally, RustFS performs all functions (erasure coding, bitrot checking, encryption) as inline, strictly consistent operations. The result is that RustFS has extraordinary resilience.\n\nEach RustFS cluster is a collection of distributed RustFS servers with one process per node. RustFS runs as a single process in user space and uses lightweight coroutines to achieve high concurrency. Drives are grouped into erasure sets (16 drives per set by default) and objects are placed on these sets using deterministic hashing algorithms.\n\nRustFS is designed for large-scale, multi-data center cloud storage services. Each tenant runs their own RustFS cluster, completely isolated from other tenants, enabling them to protect against any disruptions from upgrades, updates, and security events. Each tenant scales independently by federating clusters across geographic locations.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Open source, S3-compatible, and enterprise-hardened."
		},
		{
			"heading": void 0,
			"content": "RustFS is a high-performance distributed object storage system. It is software-defined, runs on industry-standard hardware, and is 100% open source (Apache V2.0)."
		},
		{
			"heading": void 0,
			"content": "RustFS is designed for private/hybrid cloud object storage. Its single-layer architecture achieves all necessary functionality without compromising performance. RustFS is high-performance, scalable, and lightweight."
		},
		{
			"heading": void 0,
			"content": "RustFS supports traditional use cases (secondary storage, disaster recovery, archiving) and modern workloads (machine learning, analytics, cloud-native applications)."
		},
		{
			"heading": "erasure-coding",
			"content": "RustFS uses inline erasure coding to protect data while providing high performance. RustFS uses Reed-Solomon codes to stripe objects into data and parity blocks with user-configurable redundancy levels."
		},
		{
			"heading": "erasure-coding",
			"content": "With maximum parity of N/2, RustFS can ensure uninterrupted read and write operations using only ((N/2)+1) operational drives. For example, in a 12-drive setup (6 data + 6 parity), RustFS can reliably write new objects or rebuild existing objects with only 7 drives remaining."
		},
		{
			"heading": "bitrot-protection",
			"content": "Bitrot (silent data corruption) is a serious problem for disk drives. RustFS uses HighwayHash to detect and repair corrupted data. By calculating hashes on READ and verifying them on WRITE, it ensures end-to-end integrity. The implementation achieves hash speeds exceeding 10 GB/s on a single core."
		},
		{
			"heading": "server-side-encryption",
			"content": "RustFS supports multiple server-side encryption schemes to protect data at rest. RustFS ensures confidentiality, integrity, and authenticity with negligible performance overhead. Supported algorithms include AES-256-GCM, ChaCha20-Poly1305, and AES-CBC."
		},
		{
			"heading": "server-side-encryption",
			"content": "Encrypted objects are tamper-proof using AEAD server-side encryption. RustFS is compatible with common key management solutions (e.g., HashiCorp Vault) and uses KMS to support SSE-S3."
		},
		{
			"heading": "server-side-encryption",
			"content": "If a client requests SSE-S3 or auto-encryption is enabled, the RustFS server encrypts each object with a unique object key protected by a master key managed by KMS."
		},
		{
			"heading": "identity-management",
			"content": "RustFS supports advanced identity management standards and integrates with OpenID Connect providers and major external IDP vendors. Access is centralized, and passwords are temporary and rotated. Access policies are fine-grained and highly configurable."
		},
		{
			"heading": "continuous-replication",
			"content": "The challenge with traditional replication methods is that they don't scale effectively beyond a few hundred TiB. That said, everyone needs a replication strategy to support disaster recovery, and that strategy needs to span geographic locations, data centers, and clouds."
		},
		{
			"heading": "continuous-replication",
			"content": "RustFS's continuous replication is designed for large-scale, cross-data center deployments. By leveraging Lambda compute notifications and object metadata, it can efficiently and quickly calculate increments. Lambda notifications ensure immediate propagation of changes rather than traditional batch modes."
		},
		{
			"heading": "continuous-replication",
			"content": "Continuous replication means that in case of failure, data loss remains minimal - even in the face of highly dynamic datasets. Finally, like other RustFS features, continuous replication is multi-vendor, meaning your backup location can be anywhere from NAS to public cloud."
		},
		{
			"heading": "global-federation",
			"content": "Modern enterprise data is everywhere. RustFS allows these disparate instances to be combined to form a unified global namespace. Specifically, any number of RustFS servers can be combined into a distributed mode set, and multiple distributed mode sets can be combined into a RustFS server federation. Each RustFS server federation provides unified administration and namespace."
		},
		{
			"heading": "global-federation",
			"content": "RustFS federated servers support unlimited numbers of distributed mode sets. The impact of this approach is that object storage can scale massively for large enterprises with geographically dispersed locations while retaining the ability to accommodate various applications (Splunk, Teradata, Spark, Hive, Presto, TensorFlow, H20) from a single console."
		},
		{
			"heading": "multi-cloud-gateway",
			"content": "All enterprises are adopting multi-cloud strategies. This includes private clouds as well. Therefore, your bare metal virtualized containers and public cloud services (including non-S3 providers like Google, Microsoft, and Alibaba) must look the same. While modern applications are highly portable, the data supporting these applications is not."
		},
		{
			"heading": "multi-cloud-gateway",
			"content": "Providing access to this data regardless of where it resides is the primary challenge RustFS solves. RustFS runs on bare metal, network-attached storage, and every public cloud. More importantly, RustFS ensures that from an application and management perspective, the view of that data looks exactly the same through the Amazon S3 API."
		},
		{
			"heading": "multi-cloud-gateway",
			"content": "RustFS can go further, making your existing storage infrastructure Amazon S3 compatible. The implications are profound. Now organizations can truly unify their data infrastructure - from file to block, all data appears as objects accessible through the Amazon S3 API without migration."
		},
		{
			"heading": "multi-cloud-gateway",
			"content": "When WORM is enabled, RustFS disables all APIs that might alter object data and metadata. This means data becomes tamper-proof once written. This has practical applications in many different regulatory requirements."
		},
		{
			"heading": "system-architecture",
			"content": "RustFS is designed to be cloud-native and can run as lightweight containers managed by external orchestration services like Kubernetes. The application is compiled into a single static binary (\\~100 MB) that efficiently uses CPU and memory resources even under high load. As a result, you can co-host a large number of tenants on shared hardware."
		},
		{
			"heading": "system-architecture",
			"content": "RustFS runs on commodity servers with locally attached drives (JBOD/JBOF). All servers in the cluster are functionally equal (completely symmetric architecture). There are no name nodes or metadata servers."
		},
		{
			"heading": "system-architecture",
			"content": "RustFS writes data and metadata together as objects, requiring no metadata database. Additionally, RustFS performs all functions (erasure coding, bitrot checking, encryption) as inline, strictly consistent operations. The result is that RustFS has extraordinary resilience."
		},
		{
			"heading": "system-architecture",
			"content": "Each RustFS cluster is a collection of distributed RustFS servers with one process per node. RustFS runs as a single process in user space and uses lightweight coroutines to achieve high concurrency. Drives are grouped into erasure sets (16 drives per set by default) and objects are placed on these sets using deterministic hashing algorithms."
		},
		{
			"heading": "system-architecture",
			"content": "RustFS is designed for large-scale, multi-data center cloud storage services. Each tenant runs their own RustFS cluster, completely isolated from other tenants, enabling them to protect against any disruptions from upgrades, updates, and security events. Each tenant scales independently by federating clusters across geographic locations."
		}
	],
	"headings": [
		{
			"id": "core-features",
			"content": "Core Features"
		},
		{
			"id": "erasure-coding",
			"content": "Erasure Coding"
		},
		{
			"id": "bitrot-protection",
			"content": "Bitrot Protection"
		},
		{
			"id": "server-side-encryption",
			"content": "Server-Side Encryption"
		},
		{
			"id": "worm-write-once-read-many",
			"content": "WORM (Write Once Read Many)"
		},
		{
			"id": "identity-management",
			"content": "Identity Management"
		},
		{
			"id": "continuous-replication",
			"content": "Continuous Replication"
		},
		{
			"id": "global-federation",
			"content": "Global Federation"
		},
		{
			"id": "multi-cloud-gateway",
			"content": "Multi-Cloud Gateway"
		},
		{
			"id": "system-architecture",
			"content": "System Architecture"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#core-features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Core Features" })
	},
	{
		depth: 3,
		url: "#erasure-coding",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Erasure Coding" })
	},
	{
		depth: 3,
		url: "#bitrot-protection",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Bitrot Protection" })
	},
	{
		depth: 3,
		url: "#server-side-encryption",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Server-Side Encryption" })
	},
	{
		depth: 3,
		url: "#worm-write-once-read-many",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "WORM (Write Once Read Many)" })
	},
	{
		depth: 4,
		url: "#identity-management",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Identity Management" })
	},
	{
		depth: 4,
		url: "#continuous-replication",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Continuous Replication" })
	},
	{
		depth: 4,
		url: "#global-federation",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Global Federation" })
	},
	{
		depth: 4,
		url: "#multi-cloud-gateway",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Multi-Cloud Gateway" })
	},
	{
		depth: 2,
		url: "#system-architecture",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "System Architecture" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		h3: "h3",
		h4: "h4",
		p: "p",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Open source, S3-compatible, and enterprise-hardened." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is a high-performance distributed object storage system. It is software-defined, runs on industry-standard hardware, and is 100% open source (Apache V2.0)." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is designed for private/hybrid cloud object storage. Its single-layer architecture achieves all necessary functionality without compromising performance. RustFS is high-performance, scalable, and lightweight." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports traditional use cases (secondary storage, disaster recovery, archiving) and modern workloads (machine learning, analytics, cloud-native applications)." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "core-features",
			children: "Core Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "erasure-coding",
			children: "Erasure Coding"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS uses inline erasure coding to protect data while providing high performance. RustFS uses Reed-Solomon codes to stripe objects into data and parity blocks with user-configurable redundancy levels." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "With maximum parity of N/2, RustFS can ensure uninterrupted read and write operations using only ((N/2)+1) operational drives. For example, in a 12-drive setup (6 data + 6 parity), RustFS can reliably write new objects or rebuild existing objects with only 7 drives remaining." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart TD\n  EX([\"export-xl\"])\n  EX --> D1[(\"Disk1\")]\n  EX --> D2[(\"Disk2\")]\n  EX --> D3[(\"Disk3\")]\n  EX --> D4[(\"Disk4\")]\n  D1 --> B1[\"MyBucket\"]\n  D2 --> B2[\"MyBucket\"]\n  D3 --> B3[\"MyBucket\"]\n  D4 --> B4[\"MyBucket\"]\n  B1 --> O1[\"MyObject\"]\n  B2 --> O2[\"MyObject\"]\n  B3 --> O3[\"MyObject\"]\n  B4 --> O4[\"MyObject\"]\n  O1 --> F1[\"xl.json part.1\"]\n  O2 --> F2[\"xl.json part.1\"]\n  O3 --> F3[\"xl.json part.1\"]\n  O4 --> F4[\"xl.json part.1\"]\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class EX accent\n  class D1,D2,D3,D4 store\n  class B1,B2,B3,B4 server\n  class O1,O2,O3,O4 svc\n  class F1,F2,F3,F4 muted" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "bitrot-protection",
			children: "Bitrot Protection"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Bitrot (silent data corruption) is a serious problem for disk drives. RustFS uses HighwayHash to detect and repair corrupted data. By calculating hashes on READ and verifying them on WRITE, it ensures end-to-end integrity. The implementation achieves hash speeds exceeding 10 GB/s on a single core." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart TD\n  H[\"Object · erasure-coded across 16 drives\"]\n  S[\"Tolerates 8 disk failures\"]\n  H --> S\n  subgraph DATA[\"Data Block\"]\n    direction LR\n    d1[\"1 checksum\"]\n    d2[\"2 checksum\"]\n    d3[\"3 checksum\"]\n    de[\"...\"]\n    d8[\"8 checksum\"]\n    d1 -.- d2 -.- d3 -.- de -.- d8\n  end\n  subgraph PARITY[\"Parity Block\"]\n    direction LR\n    p1[\"1P checksum\"]\n    p2[\"2P checksum\"]\n    p3[\"3P checksum\"]\n    pe[\"...\"]\n    p8[\"8P checksum\"]\n    p1 -.- p2 -.- p3 -.- pe -.- p8\n  end\n  S --> DATA\n  S --> PARITY\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  class H svc\n  class d1,d2,d3,d8,de muted\n  class p1,p2,p3,p8,pe server" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "server-side-encryption",
			children: "Server-Side Encryption"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports multiple server-side encryption schemes to protect data at rest. RustFS ensures confidentiality, integrity, and authenticity with negligible performance overhead. Supported algorithms include AES-256-GCM, ChaCha20-Poly1305, and AES-CBC." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Encrypted objects are tamper-proof using AEAD server-side encryption. RustFS is compatible with common key management solutions (e.g., HashiCorp Vault) and uses KMS to support SSE-S3." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If a client requests SSE-S3 or auto-encryption is enabled, the RustFS server encrypts each object with a unique object key protected by a master key managed by KMS." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n  D1[\"Data · SSE-S3\"]\n  D2[\"Data · SSE-C\"]\n  R([\"RustFS\"])\n  KMS[(\"KMS\")]\n  B1[\"My Bucket\"]\n  B2[\"My Bucket\"]\n  O1[\"Object\"]\n  O2[\"Object\"]\n  O3[\"Object\"]\n  O4[\"Object\"]\n  O5[\"Object\"]\n  O6[\"Object\"]\n  D1 --> R\n  D2 --> R\n  R --> KMS\n  R --> B1\n  R --> B2\n  B1 --> O1\n  B1 --> O2\n  B1 --> O3\n  B2 --> O4\n  B2 --> O5\n  B2 --> O6\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class D1,D2 server\n  class R accent\n  class KMS store\n  class B1,B2 svc\n  class O1,O2,O3,O4,O5,O6 svc" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "worm-write-once-read-many",
			children: "WORM (Write Once Read Many)"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
			id: "identity-management",
			children: "Identity Management"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports advanced identity management standards and integrates with OpenID Connect providers and major external IDP vendors. Access is centralized, and passwords are temporary and rotated. Access policies are fine-grained and highly configurable." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
			id: "continuous-replication",
			children: "Continuous Replication"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The challenge with traditional replication methods is that they don't scale effectively beyond a few hundred TiB. That said, everyone needs a replication strategy to support disaster recovery, and that strategy needs to span geographic locations, data centers, and clouds." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS's continuous replication is designed for large-scale, cross-data center deployments. By leveraging Lambda compute notifications and object metadata, it can efficiently and quickly calculate increments. Lambda notifications ensure immediate propagation of changes rather than traditional batch modes." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Continuous replication means that in case of failure, data loss remains minimal - even in the face of highly dynamic datasets. Finally, like other RustFS features, continuous replication is multi-vendor, meaning your backup location can be anywhere from NAS to public cloud." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
			id: "global-federation",
			children: "Global Federation"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Modern enterprise data is everywhere. RustFS allows these disparate instances to be combined to form a unified global namespace. Specifically, any number of RustFS servers can be combined into a distributed mode set, and multiple distributed mode sets can be combined into a RustFS server federation. Each RustFS server federation provides unified administration and namespace." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS federated servers support unlimited numbers of distributed mode sets. The impact of this approach is that object storage can scale massively for large enterprises with geographically dispersed locations while retaining the ability to accommodate various applications (Splunk, Teradata, Spark, Hive, Presto, TensorFlow, H20) from a single console." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
			id: "multi-cloud-gateway",
			children: "Multi-Cloud Gateway"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "All enterprises are adopting multi-cloud strategies. This includes private clouds as well. Therefore, your bare metal virtualized containers and public cloud services (including non-S3 providers like Google, Microsoft, and Alibaba) must look the same. While modern applications are highly portable, the data supporting these applications is not." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Providing access to this data regardless of where it resides is the primary challenge RustFS solves. RustFS runs on bare metal, network-attached storage, and every public cloud. More importantly, RustFS ensures that from an application and management perspective, the view of that data looks exactly the same through the Amazon S3 API." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS can go further, making your existing storage infrastructure Amazon S3 compatible. The implications are profound. Now organizations can truly unify their data infrastructure - from file to block, all data appears as objects accessible through the Amazon S3 API without migration." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When WORM is enabled, RustFS disables all APIs that might alter object data and metadata. This means data becomes tamper-proof once written. This has practical applications in many different regulatory requirements." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n    APP[Applications] --> S3API([\"S3 API\"])\n\n    subgraph DIST[\"Distributed RustFS\"]\n        direction TB\n        subgraph N1[\"Node 1\"]\n            direction LR\n            S3a[S3]\n            subgraph OL1[\"Object Layer\"]\n                direction TB\n                C1[Cache]\n                K1[Compression]\n                E1[Encryption]\n                B1[\"Erasure Code · Bitrot\"]\n            end\n            SL1[\"Storage Layer\"]\n            J1[(\"JBOD / FS disks\")]\n            S3a -->|Object API| OL1\n            OL1 -->|Storage API| SL1\n            SL1 <--> J1\n        end\n        subgraph N2[\"Node 2\"]\n            direction LR\n            S3b[S3]\n            subgraph OL2[\"Object Layer\"]\n                direction TB\n                C2[Cache]\n                K2[Compression]\n                E2[Encryption]\n                B2[\"Erasure Code · Bitrot\"]\n            end\n            SL2[\"Storage Layer\"]\n            J2[(\"JBOD / FS disks\")]\n            S3b -->|Object API| OL2\n            OL2 -->|Storage API| SL2\n            SL2 <--> J2\n        end\n        NN[\"Node n ...\"]\n        N1 <-->|Internal RESTful API| N2\n        N2 <-->|Internal RESTful API| NN\n    end\n\n    S3API --> N1\n    S3API --> N2\n    S3API --> NN\n\n    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    class APP,NN muted\n    class S3API accent\n    class S3a,S3b,SL1,SL2 server\n    class C1,K1,E1,B1,C2,K2,E2,B2 svc\n    class J1,J2 store" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "system-architecture",
			children: "System Architecture"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is designed to be cloud-native and can run as lightweight containers managed by external orchestration services like Kubernetes. The application is compiled into a single static binary (~100 MB) that efficiently uses CPU and memory resources even under high load. As a result, you can co-host a large number of tenants on shared hardware." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS runs on commodity servers with locally attached drives (JBOD/JBOF). All servers in the cluster are functionally equal (completely symmetric architecture). There are no name nodes or metadata servers." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS writes data and metadata together as objects, requiring no metadata database. Additionally, RustFS performs all functions (erasure coding, bitrot checking, encryption) as inline, strictly consistent operations. The result is that RustFS has extraordinary resilience." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Each RustFS cluster is a collection of distributed RustFS servers with one process per node. RustFS runs as a single process in user space and uses lightweight coroutines to achieve high concurrency. Drives are grouped into erasure sets (16 drives per set by default) and objects are placed on these sets using deterministic hashing algorithms." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is designed for large-scale, multi-data center cloud storage services. Each tenant runs their own RustFS cluster, completely isolated from other tenants, enabling them to protect against any disruptions from upgrades, updates, and security events. Each tenant scales independently by federating clusters across geographic locations." })
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
