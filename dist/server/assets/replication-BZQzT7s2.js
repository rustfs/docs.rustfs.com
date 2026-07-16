import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/replication/images/s6-1.png
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var s6_1_default = "/assets/s6-1-kC2YW4xm.png";
//#endregion
//#region content/features/replication/index.md?collection=docs
var frontmatter = {
	"title": "Multi-Site, Active-Active Replication for Object Storage",
	"description": "Active replication ensures data availability. RustFS supports active-active replication. It operates at the bucket level."
};
var _markdown = "\n\n\n\n## Active Replication for Object Storage [#active-replication-for-object-storage]\n\n<img alt=\"Object Storage Replication\" src=\"__img0\" />\n\nActive replication ensures data availability. RustFS supports active-active replication. It operates at the bucket level.\n\nRustFS supports synchronous and near-synchronous replication, depending on architectural choices and data change rates. Replication aims for strict consistency within data centers and eventual consistency between data centers.\n\n## Resilience Features [#resilience-features]\n\n* **Encrypted/Unencrypted Objects**: Replicates objects and metadata.\n* **Object Versions**: Preserves version history.\n* **Object Tags**: Replicates tags.\n* **S3 Object Lock**: Maintains retention information.\n\n## Core Features [#core-features]\n\n### Identical Bucket Naming [#identical-bucket-naming]\n\nEnables transparent failover to remote sites without interruption.\n\n### Object Lock Replication [#object-lock-replication]\n\nEnsures data integrity and compliance requirements are maintained during replication.\n\n### Near-Synchronous Replication [#near-synchronous-replication]\n\nUpdates objects immediately after mutation.\n\n### Notifications [#notifications]\n\nPushes replication failure events for operations teams.\n\n## Implementation Considerations [#implementation-considerations]\n\nKey factors include:\n\n### Infrastructure [#infrastructure]\n\nRustFS recommends using the same hardware at both ends of the replication endpoints to simplify troubleshooting.\n\n### Bandwidth [#bandwidth]\n\nBandwidth is critical for synchronization. If bandwidth is insufficient to handle peaks, changes will queue to the remote site.\n\n### Latency [#latency]\n\nAfter bandwidth, latency is the most important consideration when designing an active-active model. Latency represents the round-trip time (RTT) between two RustFS clusters. The goal is to reduce latency to the smallest possible number within the budget constraints imposed by bandwidth. RustFS recommends RTT thresholds not exceeding 20 milliseconds for Ethernet links and networks, with packet loss rates not exceeding 0.01%.\n\n### Architecture [#architecture]\n\nCurrently, RustFS only recommends replication across two data centers. Replication across multiple data centers is possible, however, the complexity involved and the trade-offs required make this quite difficult.\n\n## Large-Scale Deployment Architecture [#large-scale-deployment-architecture]\n\nRustFS supports very large deployments in each data center, including source and target, with the above considerations determining scale.\n\n<Mermaid\n  chart=\"flowchart TB\n  WAN([&#x22;WAN · 10 Gbps&#x22;])\n  subgraph DC1[&#x22;Data Center 1&#x22;]\n    LB1[&#x22;Spine / Leaf Switches&#x22;]\n    KES1[&#x22;RustFS KES Encryption&#x22;]\n    REP1[&#x22;RustFS Replication&#x22;]\n    subgraph C1[&#x22;Object Storage Cluster&#x22;]\n      A1[(&#x22;Storage&#x22;)]\n      A2[(&#x22;Storage&#x22;)]\n      A3[(&#x22;Storage&#x22;)]\n      A4[(&#x22;Storage&#x22;)]\n    end\n    LB1 -->|100 Gbps| C1\n    KES1 -->|Secret Keys| REP1\n    REP1 --- C1\n  end\n  subgraph DC2[&#x22;Data Center 2&#x22;]\n    LB2[&#x22;Spine / Leaf Switches&#x22;]\n    KES2[&#x22;RustFS KES Encryption&#x22;]\n    REP2[&#x22;RustFS Replication&#x22;]\n    subgraph C2[&#x22;Object Storage Cluster&#x22;]\n      B1[(&#x22;Storage&#x22;)]\n      B2[(&#x22;Storage&#x22;)]\n      B3[(&#x22;Storage&#x22;)]\n      B4[(&#x22;Storage&#x22;)]\n    end\n    LB2 -->|100 Gbps| C2\n    KES2 -->|Secret Keys| REP2\n    REP2 --- C2\n  end\n  WAN --> LB1\n  WAN --> LB2\n  REP1 <-->|Async Replication| REP2\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  class WAN,LB1,LB2 muted\n  class KES1,KES2 accent\n  class REP1,REP2 svc\n  class A1,A2,A3,A4,B1,B2,B3,B4 store\"\n/>\n\n## Frequently Asked Questions [#frequently-asked-questions]\n\n### What happens when the replication target fails? [#what-happens-when-the-replication-target-fails]\n\nIf the target goes down, the source will cache changes and begin synchronizing after the replication target recovers. There may be some delay in reaching full synchronization, depending on the duration, number of changes, bandwidth, and latency.\n\n### What are the parameters for immutability? [#what-are-the-parameters-for-immutability]\n\nImmutability is supported. Key concepts can be found in this article. In active-active replication mode, immutability can only be guaranteed when objects are versioned. Versioning cannot be disabled on the source. If versioning is suspended on the target, RustFS will begin failing replication.\n\n### What other impacts are there if versioning is suspended or there's a mismatch? [#what-other-impacts-are-there-if-versioning-is-suspended-or-theres-a-mismatch]\n\nIn these cases, replication may fail. For example, if you try to disable versioning on the source bucket, an error will be returned. You must first remove the replication configuration before you can disable versioning on the source bucket. Additionally, if versioning is disabled on the target bucket, replication will fail.\n\n### How is it handled if object locking is not enabled on both ends? [#how-is-it-handled-if-object-locking-is-not-enabled-on-both-ends]\n\nObject locking must be enabled on both source and target. There's an edge case where after setting up bucket replication, the target bucket can be deleted and recreated but without object locking enabled, and replication may fail. If object locking settings are not configured on both ends, inconsistent situations may occur. In this case, RustFS will fail silently.\n";
var structuredData = {
	"contents": [
		{
			"heading": "active-replication-for-object-storage",
			"content": "Active replication ensures data availability. RustFS supports active-active replication. It operates at the bucket level."
		},
		{
			"heading": "active-replication-for-object-storage",
			"content": "RustFS supports synchronous and near-synchronous replication, depending on architectural choices and data change rates. Replication aims for strict consistency within data centers and eventual consistency between data centers."
		},
		{
			"heading": "resilience-features",
			"content": "**Encrypted/Unencrypted Objects**: Replicates objects and metadata."
		},
		{
			"heading": "resilience-features",
			"content": "**Object Versions**: Preserves version history."
		},
		{
			"heading": "resilience-features",
			"content": "**Object Tags**: Replicates tags."
		},
		{
			"heading": "resilience-features",
			"content": "**S3 Object Lock**: Maintains retention information."
		},
		{
			"heading": "identical-bucket-naming",
			"content": "Enables transparent failover to remote sites without interruption."
		},
		{
			"heading": "object-lock-replication",
			"content": "Ensures data integrity and compliance requirements are maintained during replication."
		},
		{
			"heading": "near-synchronous-replication",
			"content": "Updates objects immediately after mutation."
		},
		{
			"heading": "notifications",
			"content": "Pushes replication failure events for operations teams."
		},
		{
			"heading": "implementation-considerations",
			"content": "Key factors include:"
		},
		{
			"heading": "infrastructure",
			"content": "RustFS recommends using the same hardware at both ends of the replication endpoints to simplify troubleshooting."
		},
		{
			"heading": "bandwidth",
			"content": "Bandwidth is critical for synchronization. If bandwidth is insufficient to handle peaks, changes will queue to the remote site."
		},
		{
			"heading": "latency",
			"content": "After bandwidth, latency is the most important consideration when designing an active-active model. Latency represents the round-trip time (RTT) between two RustFS clusters. The goal is to reduce latency to the smallest possible number within the budget constraints imposed by bandwidth. RustFS recommends RTT thresholds not exceeding 20 milliseconds for Ethernet links and networks, with packet loss rates not exceeding 0.01%."
		},
		{
			"heading": "architecture",
			"content": "Currently, RustFS only recommends replication across two data centers. Replication across multiple data centers is possible, however, the complexity involved and the trade-offs required make this quite difficult."
		},
		{
			"heading": "large-scale-deployment-architecture",
			"content": "RustFS supports very large deployments in each data center, including source and target, with the above considerations determining scale."
		},
		{
			"heading": "what-happens-when-the-replication-target-fails",
			"content": "If the target goes down, the source will cache changes and begin synchronizing after the replication target recovers. There may be some delay in reaching full synchronization, depending on the duration, number of changes, bandwidth, and latency."
		},
		{
			"heading": "what-are-the-parameters-for-immutability",
			"content": "Immutability is supported. Key concepts can be found in this article. In active-active replication mode, immutability can only be guaranteed when objects are versioned. Versioning cannot be disabled on the source. If versioning is suspended on the target, RustFS will begin failing replication."
		},
		{
			"heading": "what-other-impacts-are-there-if-versioning-is-suspended-or-theres-a-mismatch",
			"content": "In these cases, replication may fail. For example, if you try to disable versioning on the source bucket, an error will be returned. You must first remove the replication configuration before you can disable versioning on the source bucket. Additionally, if versioning is disabled on the target bucket, replication will fail."
		},
		{
			"heading": "how-is-it-handled-if-object-locking-is-not-enabled-on-both-ends",
			"content": "Object locking must be enabled on both source and target. There's an edge case where after setting up bucket replication, the target bucket can be deleted and recreated but without object locking enabled, and replication may fail. If object locking settings are not configured on both ends, inconsistent situations may occur. In this case, RustFS will fail silently."
		}
	],
	"headings": [
		{
			"id": "active-replication-for-object-storage",
			"content": "Active Replication for Object Storage"
		},
		{
			"id": "resilience-features",
			"content": "Resilience Features"
		},
		{
			"id": "core-features",
			"content": "Core Features"
		},
		{
			"id": "identical-bucket-naming",
			"content": "Identical Bucket Naming"
		},
		{
			"id": "object-lock-replication",
			"content": "Object Lock Replication"
		},
		{
			"id": "near-synchronous-replication",
			"content": "Near-Synchronous Replication"
		},
		{
			"id": "notifications",
			"content": "Notifications"
		},
		{
			"id": "implementation-considerations",
			"content": "Implementation Considerations"
		},
		{
			"id": "infrastructure",
			"content": "Infrastructure"
		},
		{
			"id": "bandwidth",
			"content": "Bandwidth"
		},
		{
			"id": "latency",
			"content": "Latency"
		},
		{
			"id": "architecture",
			"content": "Architecture"
		},
		{
			"id": "large-scale-deployment-architecture",
			"content": "Large-Scale Deployment Architecture"
		},
		{
			"id": "frequently-asked-questions",
			"content": "Frequently Asked Questions"
		},
		{
			"id": "what-happens-when-the-replication-target-fails",
			"content": "What happens when the replication target fails?"
		},
		{
			"id": "what-are-the-parameters-for-immutability",
			"content": "What are the parameters for immutability?"
		},
		{
			"id": "what-other-impacts-are-there-if-versioning-is-suspended-or-theres-a-mismatch",
			"content": "What other impacts are there if versioning is suspended or there's a mismatch?"
		},
		{
			"id": "how-is-it-handled-if-object-locking-is-not-enabled-on-both-ends",
			"content": "How is it handled if object locking is not enabled on both ends?"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#active-replication-for-object-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Active Replication for Object Storage" })
	},
	{
		depth: 2,
		url: "#resilience-features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Resilience Features" })
	},
	{
		depth: 2,
		url: "#core-features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Core Features" })
	},
	{
		depth: 3,
		url: "#identical-bucket-naming",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Identical Bucket Naming" })
	},
	{
		depth: 3,
		url: "#object-lock-replication",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Object Lock Replication" })
	},
	{
		depth: 3,
		url: "#near-synchronous-replication",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Near-Synchronous Replication" })
	},
	{
		depth: 3,
		url: "#notifications",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Notifications" })
	},
	{
		depth: 2,
		url: "#implementation-considerations",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Implementation Considerations" })
	},
	{
		depth: 3,
		url: "#infrastructure",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Infrastructure" })
	},
	{
		depth: 3,
		url: "#bandwidth",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Bandwidth" })
	},
	{
		depth: 3,
		url: "#latency",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Latency" })
	},
	{
		depth: 3,
		url: "#architecture",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Architecture" })
	},
	{
		depth: 2,
		url: "#large-scale-deployment-architecture",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Large-Scale Deployment Architecture" })
	},
	{
		depth: 2,
		url: "#frequently-asked-questions",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Frequently Asked Questions" })
	},
	{
		depth: 3,
		url: "#what-happens-when-the-replication-target-fails",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "What happens when the replication target fails?" })
	},
	{
		depth: 3,
		url: "#what-are-the-parameters-for-immutability",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "What are the parameters for immutability?" })
	},
	{
		depth: 3,
		url: "#what-other-impacts-are-there-if-versioning-is-suspended-or-theres-a-mismatch",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "What other impacts are there if versioning is suspended or there's a mismatch?" })
	},
	{
		depth: 3,
		url: "#how-is-it-handled-if-object-locking-is-not-enabled-on-both-ends",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "How is it handled if object locking is not enabled on both ends?" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		h3: "h3",
		img: "img",
		li: "li",
		p: "p",
		strong: "strong",
		ul: "ul",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "active-replication-for-object-storage",
			children: "Active Replication for Object Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
			alt: "Object Storage Replication",
			src: s6_1_default
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Active replication ensures data availability. RustFS supports active-active replication. It operates at the bucket level." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports synchronous and near-synchronous replication, depending on architectural choices and data change rates. Replication aims for strict consistency within data centers and eventual consistency between data centers." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "resilience-features",
			children: "Resilience Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Encrypted/Unencrypted Objects" }), ": Replicates objects and metadata."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Object Versions" }), ": Preserves version history."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Object Tags" }), ": Replicates tags."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "S3 Object Lock" }), ": Maintains retention information."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "core-features",
			children: "Core Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "identical-bucket-naming",
			children: "Identical Bucket Naming"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Enables transparent failover to remote sites without interruption." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "object-lock-replication",
			children: "Object Lock Replication"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Ensures data integrity and compliance requirements are maintained during replication." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "near-synchronous-replication",
			children: "Near-Synchronous Replication"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Updates objects immediately after mutation." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "notifications",
			children: "Notifications"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Pushes replication failure events for operations teams." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "implementation-considerations",
			children: "Implementation Considerations"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Key factors include:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "infrastructure",
			children: "Infrastructure"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS recommends using the same hardware at both ends of the replication endpoints to simplify troubleshooting." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "bandwidth",
			children: "Bandwidth"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Bandwidth is critical for synchronization. If bandwidth is insufficient to handle peaks, changes will queue to the remote site." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "latency",
			children: "Latency"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "After bandwidth, latency is the most important consideration when designing an active-active model. Latency represents the round-trip time (RTT) between two RustFS clusters. The goal is to reduce latency to the smallest possible number within the budget constraints imposed by bandwidth. RustFS recommends RTT thresholds not exceeding 20 milliseconds for Ethernet links and networks, with packet loss rates not exceeding 0.01%." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "architecture",
			children: "Architecture"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Currently, RustFS only recommends replication across two data centers. Replication across multiple data centers is possible, however, the complexity involved and the trade-offs required make this quite difficult." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "large-scale-deployment-architecture",
			children: "Large-Scale Deployment Architecture"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports very large deployments in each data center, including source and target, with the above considerations determining scale." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart TB\n  WAN([\"WAN · 10 Gbps\"])\n  subgraph DC1[\"Data Center 1\"]\n    LB1[\"Spine / Leaf Switches\"]\n    KES1[\"RustFS KES Encryption\"]\n    REP1[\"RustFS Replication\"]\n    subgraph C1[\"Object Storage Cluster\"]\n      A1[(\"Storage\")]\n      A2[(\"Storage\")]\n      A3[(\"Storage\")]\n      A4[(\"Storage\")]\n    end\n    LB1 -->|100 Gbps| C1\n    KES1 -->|Secret Keys| REP1\n    REP1 --- C1\n  end\n  subgraph DC2[\"Data Center 2\"]\n    LB2[\"Spine / Leaf Switches\"]\n    KES2[\"RustFS KES Encryption\"]\n    REP2[\"RustFS Replication\"]\n    subgraph C2[\"Object Storage Cluster\"]\n      B1[(\"Storage\")]\n      B2[(\"Storage\")]\n      B3[(\"Storage\")]\n      B4[(\"Storage\")]\n    end\n    LB2 -->|100 Gbps| C2\n    KES2 -->|Secret Keys| REP2\n    REP2 --- C2\n  end\n  WAN --> LB1\n  WAN --> LB2\n  REP1 <-->|Async Replication| REP2\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  class WAN,LB1,LB2 muted\n  class KES1,KES2 accent\n  class REP1,REP2 svc\n  class A1,A2,A3,A4,B1,B2,B3,B4 store" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "frequently-asked-questions",
			children: "Frequently Asked Questions"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "what-happens-when-the-replication-target-fails",
			children: "What happens when the replication target fails?"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If the target goes down, the source will cache changes and begin synchronizing after the replication target recovers. There may be some delay in reaching full synchronization, depending on the duration, number of changes, bandwidth, and latency." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "what-are-the-parameters-for-immutability",
			children: "What are the parameters for immutability?"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Immutability is supported. Key concepts can be found in this article. In active-active replication mode, immutability can only be guaranteed when objects are versioned. Versioning cannot be disabled on the source. If versioning is suspended on the target, RustFS will begin failing replication." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "what-other-impacts-are-there-if-versioning-is-suspended-or-theres-a-mismatch",
			children: "What other impacts are there if versioning is suspended or there's a mismatch?"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "In these cases, replication may fail. For example, if you try to disable versioning on the source bucket, an error will be returned. You must first remove the replication configuration before you can disable versioning on the source bucket. Additionally, if versioning is disabled on the target bucket, replication will fail." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "how-is-it-handled-if-object-locking-is-not-enabled-on-both-ends",
			children: "How is it handled if object locking is not enabled on both ends?"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Object locking must be enabled on both source and target. There's an edge case where after setting up bucket replication, the target bucket can be deleted and recreated but without object locking enabled, and replication may fail. If object locking settings are not configured on both ends, inconsistent situations may occur. In this case, RustFS will fail silently." })
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
