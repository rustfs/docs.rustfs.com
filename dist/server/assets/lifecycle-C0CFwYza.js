import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/lifecycle/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Data Lifecycle Management and Tiering",
	"description": "Data growth requires efficient lifecycle management for access, security, and economics. RustFS provides features to protect data within and between clouds,…"
};
var _markdown = "\n\nData growth requires efficient lifecycle management for access, security, and economics. RustFS provides features to protect data within and between clouds, including versioning, object locking, and lifecycle management.\n\n## Object Expiration [#object-expiration]\n\nData Retention: RustFS lifecycle management tools allow you to define how long data remains on disk before deletion. Define retention periods as a specific date or number of days.\n\nLifecycle management rules are created per bucket and can be constructed using any combination of object and tag filters. Omitting filters applies the expiration rule to the entire bucket.\n\nRustFS object expiration rules also apply to versioned buckets. For example, you can specify expiration rules only for non-current versions to minimize storage costs.\n\nBucket expiration rules comply with RustFS WORM locking and legal holds. Objects in a locked state remain on disk until the lock expires or is explicitly released.\n\nRustFS object expiration lifecycle management rules are compatible with AWS Lifecycle Management. RustFS supports importing existing rules in JSON format.\n\n## Policy-Based Object Tiering [#policy-based-object-tiering]\n\nRustFS can be programmatically configured for object storage tiering. Objects transition from one state or class to another based on variables like time and frequency of access. Tiering allows users to optimize storage costs or functionality.\n\n## Cross-Media Tiering [#cross-media-tiering]\n\nRustFS abstracts the underlying media to optimize for performance and cost. For example, performance workloads might use NVMe or SSD, while older data is tiered to HDD.\n\n<Mermaid\n  chart=\"flowchart LR\n  subgraph Cloud[Storage Cluster]\n    HOT[RUSTFS Hot Tier]\n    WARM[RUSTFS Warm Tier]\n    NVME[(NVMe SSDs)]\n    SAS[(&#x22;SAS/SATA HDDs&#x22;)]\n    HOT -->|ILM Transition| WARM\n    HOT --- NVME\n    WARM --- SAS\n  end\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class HOT server\n  class WARM accent\n  class NVME,SAS store\"\n/>\n\n## Hybrid Cloud Tiering [#hybrid-cloud-tiering]\n\nPublic cloud storage can serve as a tier for private clouds. Performance-oriented workloads run on private cloud media. As data ages, enterprises can use public cloud cold storage to optimize costs.\n\nRustFS runs on both private and public clouds. Using replication, RustFS moves data to public cloud options and protects it. The public cloud serves as a storage tier.\n\n<Mermaid\n  chart=\"flowchart LR\n  subgraph Private[Private Cloud Storage]\n    HOT[RUSTFS Hot Tier]\n  end\n  subgraph Public[Public Cloud Storage]\n    subgraph Cold[&#x22;Warm / Cold Tier&#x22;]\n      S3[Amazon S3]\n      GCS[Google Cloud Storage]\n      AZ[Azure Blob Storage]\n    end\n  end\n  HOT -->|ILM Transition| Cold\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  class HOT server\n  class S3,GCS,AZ svc\"\n/>\n\n## In Public Clouds [#in-public-clouds]\n\nRustFS typically serves as the primary application storage tier in public clouds. RustFS determines which data belongs where based on management parameters.\n\nRustFS combines different storage tiering layers and determines appropriate media to provide better economics without compromising performance. Applications address objects through RustFS, while RustFS transparently applies policies to move objects between tiers.\n\n<Mermaid\n  chart=\"flowchart LR\n  subgraph Public[&#x22;Public Cloud Storage&#x22;]\n    HOT[&#x22;RustFS Hot Tier&#x22;]\n    subgraph Cold[&#x22;Warm / Cold Tier&#x22;]\n      S3[&#x22;Amazon S3&#x22;]\n      GCS[&#x22;Google Cloud Storage&#x22;]\n      AZ[&#x22;Azure Blob Storage&#x22;]\n    end\n    BS[(&#x22;Block Storage&#x22;)]\n    OS[(&#x22;Object Storage&#x22;)]\n    HOT -->|ILM Transition| Cold\n    HOT --- BS\n    Cold --- OS\n  end\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  class HOT server\n  class S3,GCS,AZ svc\n  class BS,OS store\"\n/>\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Data growth requires efficient lifecycle management for access, security, and economics. RustFS provides features to protect data within and between clouds, including versioning, object locking, and lifecycle management."
		},
		{
			"heading": "object-expiration",
			"content": "Data Retention: RustFS lifecycle management tools allow you to define how long data remains on disk before deletion. Define retention periods as a specific date or number of days."
		},
		{
			"heading": "object-expiration",
			"content": "Lifecycle management rules are created per bucket and can be constructed using any combination of object and tag filters. Omitting filters applies the expiration rule to the entire bucket."
		},
		{
			"heading": "object-expiration",
			"content": "RustFS object expiration rules also apply to versioned buckets. For example, you can specify expiration rules only for non-current versions to minimize storage costs."
		},
		{
			"heading": "object-expiration",
			"content": "Bucket expiration rules comply with RustFS WORM locking and legal holds. Objects in a locked state remain on disk until the lock expires or is explicitly released."
		},
		{
			"heading": "object-expiration",
			"content": "RustFS object expiration lifecycle management rules are compatible with AWS Lifecycle Management. RustFS supports importing existing rules in JSON format."
		},
		{
			"heading": "policy-based-object-tiering",
			"content": "RustFS can be programmatically configured for object storage tiering. Objects transition from one state or class to another based on variables like time and frequency of access. Tiering allows users to optimize storage costs or functionality."
		},
		{
			"heading": "cross-media-tiering",
			"content": "RustFS abstracts the underlying media to optimize for performance and cost. For example, performance workloads might use NVMe or SSD, while older data is tiered to HDD."
		},
		{
			"heading": "hybrid-cloud-tiering",
			"content": "Public cloud storage can serve as a tier for private clouds. Performance-oriented workloads run on private cloud media. As data ages, enterprises can use public cloud cold storage to optimize costs."
		},
		{
			"heading": "hybrid-cloud-tiering",
			"content": "RustFS runs on both private and public clouds. Using replication, RustFS moves data to public cloud options and protects it. The public cloud serves as a storage tier."
		},
		{
			"heading": "in-public-clouds",
			"content": "RustFS typically serves as the primary application storage tier in public clouds. RustFS determines which data belongs where based on management parameters."
		},
		{
			"heading": "in-public-clouds",
			"content": "RustFS combines different storage tiering layers and determines appropriate media to provide better economics without compromising performance. Applications address objects through RustFS, while RustFS transparently applies policies to move objects between tiers."
		}
	],
	"headings": [
		{
			"id": "object-expiration",
			"content": "Object Expiration"
		},
		{
			"id": "policy-based-object-tiering",
			"content": "Policy-Based Object Tiering"
		},
		{
			"id": "cross-media-tiering",
			"content": "Cross-Media Tiering"
		},
		{
			"id": "hybrid-cloud-tiering",
			"content": "Hybrid Cloud Tiering"
		},
		{
			"id": "in-public-clouds",
			"content": "In Public Clouds"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#object-expiration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Object Expiration" })
	},
	{
		depth: 2,
		url: "#policy-based-object-tiering",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Policy-Based Object Tiering" })
	},
	{
		depth: 2,
		url: "#cross-media-tiering",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Cross-Media Tiering" })
	},
	{
		depth: 2,
		url: "#hybrid-cloud-tiering",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Hybrid Cloud Tiering" })
	},
	{
		depth: 2,
		url: "#in-public-clouds",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "In Public Clouds" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		p: "p",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Data growth requires efficient lifecycle management for access, security, and economics. RustFS provides features to protect data within and between clouds, including versioning, object locking, and lifecycle management." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "object-expiration",
			children: "Object Expiration"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Data Retention: RustFS lifecycle management tools allow you to define how long data remains on disk before deletion. Define retention periods as a specific date or number of days." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Lifecycle management rules are created per bucket and can be constructed using any combination of object and tag filters. Omitting filters applies the expiration rule to the entire bucket." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS object expiration rules also apply to versioned buckets. For example, you can specify expiration rules only for non-current versions to minimize storage costs." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Bucket expiration rules comply with RustFS WORM locking and legal holds. Objects in a locked state remain on disk until the lock expires or is explicitly released." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS object expiration lifecycle management rules are compatible with AWS Lifecycle Management. RustFS supports importing existing rules in JSON format." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "policy-based-object-tiering",
			children: "Policy-Based Object Tiering"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS can be programmatically configured for object storage tiering. Objects transition from one state or class to another based on variables like time and frequency of access. Tiering allows users to optimize storage costs or functionality." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "cross-media-tiering",
			children: "Cross-Media Tiering"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS abstracts the underlying media to optimize for performance and cost. For example, performance workloads might use NVMe or SSD, while older data is tiered to HDD." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n  subgraph Cloud[Storage Cluster]\n    HOT[RUSTFS Hot Tier]\n    WARM[RUSTFS Warm Tier]\n    NVME[(NVMe SSDs)]\n    SAS[(\"SAS/SATA HDDs\")]\n    HOT -->|ILM Transition| WARM\n    HOT --- NVME\n    WARM --- SAS\n  end\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class HOT server\n  class WARM accent\n  class NVME,SAS store" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "hybrid-cloud-tiering",
			children: "Hybrid Cloud Tiering"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Public cloud storage can serve as a tier for private clouds. Performance-oriented workloads run on private cloud media. As data ages, enterprises can use public cloud cold storage to optimize costs." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS runs on both private and public clouds. Using replication, RustFS moves data to public cloud options and protects it. The public cloud serves as a storage tier." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n  subgraph Private[Private Cloud Storage]\n    HOT[RUSTFS Hot Tier]\n  end\n  subgraph Public[Public Cloud Storage]\n    subgraph Cold[\"Warm / Cold Tier\"]\n      S3[Amazon S3]\n      GCS[Google Cloud Storage]\n      AZ[Azure Blob Storage]\n    end\n  end\n  HOT -->|ILM Transition| Cold\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  class HOT server\n  class S3,GCS,AZ svc" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "in-public-clouds",
			children: "In Public Clouds"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS typically serves as the primary application storage tier in public clouds. RustFS determines which data belongs where based on management parameters." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS combines different storage tiering layers and determines appropriate media to provide better economics without compromising performance. Applications address objects through RustFS, while RustFS transparently applies policies to move objects between tiers." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n  subgraph Public[\"Public Cloud Storage\"]\n    HOT[\"RustFS Hot Tier\"]\n    subgraph Cold[\"Warm / Cold Tier\"]\n      S3[\"Amazon S3\"]\n      GCS[\"Google Cloud Storage\"]\n      AZ[\"Azure Blob Storage\"]\n    end\n    BS[(\"Block Storage\")]\n    OS[(\"Object Storage\")]\n    HOT -->|ILM Transition| Cold\n    HOT --- BS\n    Cold --- OS\n  end\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  class HOT server\n  class S3,GCS,AZ svc\n  class BS,OS store" })
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
