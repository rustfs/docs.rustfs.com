import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/video/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Cost-Effective Video Storage Solutions",
	"description": "Achieve dramatic cost reductions in video storage through object storage and hybrid cloud approaches."
};
var _markdown = "\n\nAchieve dramatic cost reductions in video storage through object storage and hybrid cloud approaches.\n\n## Core Pain Points of Video Storage [#core-pain-points-of-video-storage]\n\n### Challenges with Traditional Solutions [#challenges-with-traditional-solutions]\n\n* Linear storage architecture causes read/write speeds to decline as capacity increases.\n* Original videos occupy space; cold data occupies high-performance storage long-term.\n* Single replica storage + periodic backup mechanism.\n* Storage expansion requires downtime maintenance and lacks intelligent management tools.\n\n### Business Impact [#business-impact]\n\n* Key frame retrieval delays exceed 5 seconds; emergency response efficiency reduced by 30%.\n* Storage costs increase 47% annually; 80% of storage resources are occupied by low-frequency access videos.\n* Hardware failures lead to 72-hour data recovery cycles and risk of critical evidence loss.\n* Manual operations cost \\$3.2/TB/month; system availability is below 99%.\n\n## Five Core Cost Reduction Capabilities [#five-core-cost-reduction-capabilities]\n\n### Reduce Storage Costs by 68% [#reduce-storage-costs-by-68]\n\n* Original video frame-level compression algorithm (VFC-3 patent technology).\n* Intelligent hot-cold separation: automatically identifies videos not accessed for 30 days and transfers them to glacier storage.\n* Supports EB-level storage expansion; single TB cost as low as \\$0.015/month.\n\n### Instant Data Access [#instant-data-access]\n\n* Global deployment of 128 edge nodes; transmission speed improved 5x.\n* Supports 2000+ device concurrent writing; read/write latency less than 300ms.\n* Intelligent preloading technology: high-frequency access videos automatically cached to edge nodes.\n\n### Enterprise-Grade Data Protection [#enterprise-grade-data-protection]\n\n* Three-replica storage + remote disaster recovery (compliant with ISO 27001).\n* Blockchain evidence storage: key videos generate timestamp hashes, judicial-level trusted evidence.\n* Version rollback: video recovery at any time point within 120 days.\n\n### Seamless Integration [#seamless-integration]\n\n* Compatible with 14 protocols including ONVIF/RTSP/GB28181.\n* Provides SDK/API/RESTful access methods.\n* One-click migration tool for existing data (supports NAS/SAN/Ceph).\n\n### Intelligent Operations Dashboard [#intelligent-operations-dashboard]\n\n* Real-time monitoring of storage health, cost distribution, and access hotspots.\n* Capacity prediction algorithm: 3-day advance warning of storage bottlenecks.\n* Automatically generates monthly optimization recommendation reports.\n\n## Solutions [#solutions]\n\nVideo feeds can be uploaded to the cloud through three methods:\n\n### Hybrid Cloud Tiered Storage [#hybrid-cloud-tiered-storage]\n\nApplicable scenarios: Large parks, smart cities (1000+ cameras).\n\n#### Core Capabilities [#core-capabilities]\n\n* Intelligent tiering: hot data stored locally on SSD (response \\<100ms), full data automatically synced to cloud.\n* Direct cost reduction: cloud storage cost \\$0.021/GB-month, bandwidth usage reduced 80%.\n* Seamless disaster recovery: real-time active-active between local and cloud data.\n\n### Direct Cloud Storage [#direct-cloud-storage]\n\nApplicable scenarios: Shops, communities, homes (50-200 cameras).\n\n#### Core Advantages [#core-advantages]\n\n* Rapid 5-minute deployment: scan-to-connect, automatically adapts H.265 compression.\n* Intelligent management: motion detection automatically generates 30-second event clips.\n* Zero maintenance: fully managed cloud storage, data durability 99.9999999%.\n\n### Server Relay Storage [#server-relay-storage]\n\nApplicable scenarios: Educational parks, cross-regional enterprises.\n\n#### Key Technologies [#key-technologies]\n\n* Edge preprocessing: video frame extraction analysis (saves 90% traffic).\n* Intelligent routing: automatically switches TCP/UDP protocols to ensure transmission.\n* Tiered archiving: original videos stored 30 days, low-bitrate copies stored 180 days.\n\n<Mermaid\n  chart=\"flowchart LR\n  subgraph Ingest[&#x22;Camera Ingest&#x22;]\n    C1[&#x22;Cameras → Surveillance Platform&#x22;]\n    C2[&#x22;Cameras → VPN&#x22;]\n    C3[&#x22;Cameras → HTTPS&#x22;]\n  end\n  GW[&#x22;Hybrid Array / S3 Gateway&#x22;]\n  NET([&#x22;Dedicated Line · VPN · HTTPS&#x22;])\n  subgraph OSS[&#x22;RustFS Object Storage&#x22;]\n    PROC[&#x22;Transcode · Capture · Playback&#x22;]\n    STD[&#x22;Standard Storage&#x22;]\n    IA[&#x22;Infrequent Storage&#x22;]\n    ARC[&#x22;Archive Storage&#x22;]\n    PROC --- STD\n    PROC --- IA\n    PROC --- ARC\n  end\n  C1 --> GW\n  GW --> NET\n  C2 --> NET\n  C3 --> NET\n  NET -->|Record / Playback| OSS\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  class C1,C2,C3 muted\n  class GW server\n  class NET svc\n  class PROC svc\n  class STD,IA,ARC store\"\n/>\n\n## Why Choose Us [#why-choose-us]\n\n### Controllable Costs [#controllable-costs]\n\nEB-level elastic expansion, cold data storage cost as low as \\$0.015/GB·month.\n\n### Ultra-Fast Response [#ultra-fast-response]\n\nGlobal 128 edge nodes, video transmission speed improved 5x.\n\n### Automatic Video Upload Encryption [#automatic-video-upload-encryption]\n\nAutomatic video encryption ensures upload storage security, prevents data leakage and illegal distribution, while helping platforms meet privacy protection regulations and reduce legal risks\n\n### Version Protection [#version-protection]\n\nPlatform-provided original video automatic encryption service effectively prevents piracy and tampering, protects intellectual property, while improving user trust and satisfaction\n\n## Technical Parameter Comparison Table [#technical-parameter-comparison-table]\n\n| Metric               | Traditional Solution | RustFS Solution               | Improvement      |\n| -------------------- | -------------------- | ----------------------------- | ---------------- |\n| Storage density      | 1.2× raw size        | ✓ 0.6× (lossless compression) | 2× ↑             |\n| Concurrent writes    | ≤ 500 streams        | ✓ 2000+ streams               | 4× ↑             |\n| Storage availability | 99%                  | ✓ 99.999%                     | 100× reliability |\n| TCO (5 years)        | \\$580K               | ✓ \\$190K                      | 76% cost savings |\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Achieve dramatic cost reductions in video storage through object storage and hybrid cloud approaches."
		},
		{
			"heading": "challenges-with-traditional-solutions",
			"content": "Linear storage architecture causes read/write speeds to decline as capacity increases."
		},
		{
			"heading": "challenges-with-traditional-solutions",
			"content": "Original videos occupy space; cold data occupies high-performance storage long-term."
		},
		{
			"heading": "challenges-with-traditional-solutions",
			"content": "Single replica storage + periodic backup mechanism."
		},
		{
			"heading": "challenges-with-traditional-solutions",
			"content": "Storage expansion requires downtime maintenance and lacks intelligent management tools."
		},
		{
			"heading": "business-impact",
			"content": "Key frame retrieval delays exceed 5 seconds; emergency response efficiency reduced by 30%."
		},
		{
			"heading": "business-impact",
			"content": "Storage costs increase 47% annually; 80% of storage resources are occupied by low-frequency access videos."
		},
		{
			"heading": "business-impact",
			"content": "Hardware failures lead to 72-hour data recovery cycles and risk of critical evidence loss."
		},
		{
			"heading": "business-impact",
			"content": "Manual operations cost \\$3.2/TB/month; system availability is below 99%."
		},
		{
			"heading": "reduce-storage-costs-by-68",
			"content": "Original video frame-level compression algorithm (VFC-3 patent technology)."
		},
		{
			"heading": "reduce-storage-costs-by-68",
			"content": "Intelligent hot-cold separation: automatically identifies videos not accessed for 30 days and transfers them to glacier storage."
		},
		{
			"heading": "reduce-storage-costs-by-68",
			"content": "Supports EB-level storage expansion; single TB cost as low as \\$0.015/month."
		},
		{
			"heading": "instant-data-access",
			"content": "Global deployment of 128 edge nodes; transmission speed improved 5x."
		},
		{
			"heading": "instant-data-access",
			"content": "Supports 2000+ device concurrent writing; read/write latency less than 300ms."
		},
		{
			"heading": "instant-data-access",
			"content": "Intelligent preloading technology: high-frequency access videos automatically cached to edge nodes."
		},
		{
			"heading": "enterprise-grade-data-protection",
			"content": "Three-replica storage + remote disaster recovery (compliant with ISO 27001)."
		},
		{
			"heading": "enterprise-grade-data-protection",
			"content": "Blockchain evidence storage: key videos generate timestamp hashes, judicial-level trusted evidence."
		},
		{
			"heading": "enterprise-grade-data-protection",
			"content": "Version rollback: video recovery at any time point within 120 days."
		},
		{
			"heading": "seamless-integration",
			"content": "Compatible with 14 protocols including ONVIF/RTSP/GB28181."
		},
		{
			"heading": "seamless-integration",
			"content": "Provides SDK/API/RESTful access methods."
		},
		{
			"heading": "seamless-integration",
			"content": "One-click migration tool for existing data (supports NAS/SAN/Ceph)."
		},
		{
			"heading": "intelligent-operations-dashboard",
			"content": "Real-time monitoring of storage health, cost distribution, and access hotspots."
		},
		{
			"heading": "intelligent-operations-dashboard",
			"content": "Capacity prediction algorithm: 3-day advance warning of storage bottlenecks."
		},
		{
			"heading": "intelligent-operations-dashboard",
			"content": "Automatically generates monthly optimization recommendation reports."
		},
		{
			"heading": "solutions",
			"content": "Video feeds can be uploaded to the cloud through three methods:"
		},
		{
			"heading": "hybrid-cloud-tiered-storage",
			"content": "Applicable scenarios: Large parks, smart cities (1000+ cameras)."
		},
		{
			"heading": "core-capabilities",
			"content": "Intelligent tiering: hot data stored locally on SSD (response \\<100ms), full data automatically synced to cloud."
		},
		{
			"heading": "core-capabilities",
			"content": "Direct cost reduction: cloud storage cost \\$0.021/GB-month, bandwidth usage reduced 80%."
		},
		{
			"heading": "core-capabilities",
			"content": "Seamless disaster recovery: real-time active-active between local and cloud data."
		},
		{
			"heading": "direct-cloud-storage",
			"content": "Applicable scenarios: Shops, communities, homes (50-200 cameras)."
		},
		{
			"heading": "core-advantages",
			"content": "Rapid 5-minute deployment: scan-to-connect, automatically adapts H.265 compression."
		},
		{
			"heading": "core-advantages",
			"content": "Intelligent management: motion detection automatically generates 30-second event clips."
		},
		{
			"heading": "core-advantages",
			"content": "Zero maintenance: fully managed cloud storage, data durability 99.9999999%."
		},
		{
			"heading": "server-relay-storage",
			"content": "Applicable scenarios: Educational parks, cross-regional enterprises."
		},
		{
			"heading": "key-technologies",
			"content": "Edge preprocessing: video frame extraction analysis (saves 90% traffic)."
		},
		{
			"heading": "key-technologies",
			"content": "Intelligent routing: automatically switches TCP/UDP protocols to ensure transmission."
		},
		{
			"heading": "key-technologies",
			"content": "Tiered archiving: original videos stored 30 days, low-bitrate copies stored 180 days."
		},
		{
			"heading": "controllable-costs",
			"content": "EB-level elastic expansion, cold data storage cost as low as \\$0.015/GB·month."
		},
		{
			"heading": "ultra-fast-response",
			"content": "Global 128 edge nodes, video transmission speed improved 5x."
		},
		{
			"heading": "automatic-video-upload-encryption",
			"content": "Automatic video encryption ensures upload storage security, prevents data leakage and illegal distribution, while helping platforms meet privacy protection regulations and reduce legal risks"
		},
		{
			"heading": "version-protection",
			"content": "Platform-provided original video automatic encryption service effectively prevents piracy and tampering, protects intellectual property, while improving user trust and satisfaction"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "Metric"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "Traditional Solution"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "RustFS Solution"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "Improvement"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "Storage density"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "1.2× raw size"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "✓ 0.6× (lossless compression)"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "2× ↑"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "Concurrent writes"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "≤ 500 streams"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "✓ 2000+ streams"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "4× ↑"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "Storage availability"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "99%"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "✓ 99.999%"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "100× reliability"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "TCO (5 years)"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "\\$580K"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "✓ \\$190K"
		},
		{
			"heading": "technical-parameter-comparison-table",
			"content": "76% cost savings"
		}
	],
	"headings": [
		{
			"id": "core-pain-points-of-video-storage",
			"content": "Core Pain Points of Video Storage"
		},
		{
			"id": "challenges-with-traditional-solutions",
			"content": "Challenges with Traditional Solutions"
		},
		{
			"id": "business-impact",
			"content": "Business Impact"
		},
		{
			"id": "five-core-cost-reduction-capabilities",
			"content": "Five Core Cost Reduction Capabilities"
		},
		{
			"id": "reduce-storage-costs-by-68",
			"content": "Reduce Storage Costs by 68%"
		},
		{
			"id": "instant-data-access",
			"content": "Instant Data Access"
		},
		{
			"id": "enterprise-grade-data-protection",
			"content": "Enterprise-Grade Data Protection"
		},
		{
			"id": "seamless-integration",
			"content": "Seamless Integration"
		},
		{
			"id": "intelligent-operations-dashboard",
			"content": "Intelligent Operations Dashboard"
		},
		{
			"id": "solutions",
			"content": "Solutions"
		},
		{
			"id": "hybrid-cloud-tiered-storage",
			"content": "Hybrid Cloud Tiered Storage"
		},
		{
			"id": "core-capabilities",
			"content": "Core Capabilities"
		},
		{
			"id": "direct-cloud-storage",
			"content": "Direct Cloud Storage"
		},
		{
			"id": "core-advantages",
			"content": "Core Advantages"
		},
		{
			"id": "server-relay-storage",
			"content": "Server Relay Storage"
		},
		{
			"id": "key-technologies",
			"content": "Key Technologies"
		},
		{
			"id": "why-choose-us",
			"content": "Why Choose Us"
		},
		{
			"id": "controllable-costs",
			"content": "Controllable Costs"
		},
		{
			"id": "ultra-fast-response",
			"content": "Ultra-Fast Response"
		},
		{
			"id": "automatic-video-upload-encryption",
			"content": "Automatic Video Upload Encryption"
		},
		{
			"id": "version-protection",
			"content": "Version Protection"
		},
		{
			"id": "technical-parameter-comparison-table",
			"content": "Technical Parameter Comparison Table"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#core-pain-points-of-video-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Core Pain Points of Video Storage" })
	},
	{
		depth: 3,
		url: "#challenges-with-traditional-solutions",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Challenges with Traditional Solutions" })
	},
	{
		depth: 3,
		url: "#business-impact",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Business Impact" })
	},
	{
		depth: 2,
		url: "#five-core-cost-reduction-capabilities",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Five Core Cost Reduction Capabilities" })
	},
	{
		depth: 3,
		url: "#reduce-storage-costs-by-68",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Reduce Storage Costs by 68%" })
	},
	{
		depth: 3,
		url: "#instant-data-access",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Instant Data Access" })
	},
	{
		depth: 3,
		url: "#enterprise-grade-data-protection",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Enterprise-Grade Data Protection" })
	},
	{
		depth: 3,
		url: "#seamless-integration",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Seamless Integration" })
	},
	{
		depth: 3,
		url: "#intelligent-operations-dashboard",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Intelligent Operations Dashboard" })
	},
	{
		depth: 2,
		url: "#solutions",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Solutions" })
	},
	{
		depth: 3,
		url: "#hybrid-cloud-tiered-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Hybrid Cloud Tiered Storage" })
	},
	{
		depth: 4,
		url: "#core-capabilities",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Core Capabilities" })
	},
	{
		depth: 3,
		url: "#direct-cloud-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Direct Cloud Storage" })
	},
	{
		depth: 4,
		url: "#core-advantages",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Core Advantages" })
	},
	{
		depth: 3,
		url: "#server-relay-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Server Relay Storage" })
	},
	{
		depth: 4,
		url: "#key-technologies",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Key Technologies" })
	},
	{
		depth: 2,
		url: "#why-choose-us",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Why Choose Us" })
	},
	{
		depth: 3,
		url: "#controllable-costs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Controllable Costs" })
	},
	{
		depth: 3,
		url: "#ultra-fast-response",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Ultra-Fast Response" })
	},
	{
		depth: 3,
		url: "#automatic-video-upload-encryption",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Automatic Video Upload Encryption" })
	},
	{
		depth: 3,
		url: "#version-protection",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Version Protection" })
	},
	{
		depth: 2,
		url: "#technical-parameter-comparison-table",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Technical Parameter Comparison Table" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		h3: "h3",
		h4: "h4",
		li: "li",
		p: "p",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Achieve dramatic cost reductions in video storage through object storage and hybrid cloud approaches." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "core-pain-points-of-video-storage",
			children: "Core Pain Points of Video Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "challenges-with-traditional-solutions",
			children: "Challenges with Traditional Solutions"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Linear storage architecture causes read/write speeds to decline as capacity increases." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Original videos occupy space; cold data occupies high-performance storage long-term." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Single replica storage + periodic backup mechanism." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Storage expansion requires downtime maintenance and lacks intelligent management tools." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "business-impact",
			children: "Business Impact"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Key frame retrieval delays exceed 5 seconds; emergency response efficiency reduced by 30%." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Storage costs increase 47% annually; 80% of storage resources are occupied by low-frequency access videos." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Hardware failures lead to 72-hour data recovery cycles and risk of critical evidence loss." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Manual operations cost $3.2/TB/month; system availability is below 99%." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "five-core-cost-reduction-capabilities",
			children: "Five Core Cost Reduction Capabilities"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "reduce-storage-costs-by-68",
			children: "Reduce Storage Costs by 68%"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Original video frame-level compression algorithm (VFC-3 patent technology)." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Intelligent hot-cold separation: automatically identifies videos not accessed for 30 days and transfers them to glacier storage." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Supports EB-level storage expansion; single TB cost as low as $0.015/month." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "instant-data-access",
			children: "Instant Data Access"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Global deployment of 128 edge nodes; transmission speed improved 5x." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Supports 2000+ device concurrent writing; read/write latency less than 300ms." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Intelligent preloading technology: high-frequency access videos automatically cached to edge nodes." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "enterprise-grade-data-protection",
			children: "Enterprise-Grade Data Protection"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Three-replica storage + remote disaster recovery (compliant with ISO 27001)." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Blockchain evidence storage: key videos generate timestamp hashes, judicial-level trusted evidence." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Version rollback: video recovery at any time point within 120 days." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "seamless-integration",
			children: "Seamless Integration"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Compatible with 14 protocols including ONVIF/RTSP/GB28181." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Provides SDK/API/RESTful access methods." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "One-click migration tool for existing data (supports NAS/SAN/Ceph)." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "intelligent-operations-dashboard",
			children: "Intelligent Operations Dashboard"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Real-time monitoring of storage health, cost distribution, and access hotspots." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Capacity prediction algorithm: 3-day advance warning of storage bottlenecks." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Automatically generates monthly optimization recommendation reports." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "solutions",
			children: "Solutions"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Video feeds can be uploaded to the cloud through three methods:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "hybrid-cloud-tiered-storage",
			children: "Hybrid Cloud Tiered Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Applicable scenarios: Large parks, smart cities (1000+ cameras)." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
			id: "core-capabilities",
			children: "Core Capabilities"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Intelligent tiering: hot data stored locally on SSD (response <100ms), full data automatically synced to cloud." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Direct cost reduction: cloud storage cost $0.021/GB-month, bandwidth usage reduced 80%." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Seamless disaster recovery: real-time active-active between local and cloud data." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "direct-cloud-storage",
			children: "Direct Cloud Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Applicable scenarios: Shops, communities, homes (50-200 cameras)." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
			id: "core-advantages",
			children: "Core Advantages"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Rapid 5-minute deployment: scan-to-connect, automatically adapts H.265 compression." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Intelligent management: motion detection automatically generates 30-second event clips." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Zero maintenance: fully managed cloud storage, data durability 99.9999999%." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "server-relay-storage",
			children: "Server Relay Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Applicable scenarios: Educational parks, cross-regional enterprises." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
			id: "key-technologies",
			children: "Key Technologies"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Edge preprocessing: video frame extraction analysis (saves 90% traffic)." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Intelligent routing: automatically switches TCP/UDP protocols to ensure transmission." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Tiered archiving: original videos stored 30 days, low-bitrate copies stored 180 days." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n  subgraph Ingest[\"Camera Ingest\"]\n    C1[\"Cameras → Surveillance Platform\"]\n    C2[\"Cameras → VPN\"]\n    C3[\"Cameras → HTTPS\"]\n  end\n  GW[\"Hybrid Array / S3 Gateway\"]\n  NET([\"Dedicated Line · VPN · HTTPS\"])\n  subgraph OSS[\"RustFS Object Storage\"]\n    PROC[\"Transcode · Capture · Playback\"]\n    STD[\"Standard Storage\"]\n    IA[\"Infrequent Storage\"]\n    ARC[\"Archive Storage\"]\n    PROC --- STD\n    PROC --- IA\n    PROC --- ARC\n  end\n  C1 --> GW\n  GW --> NET\n  C2 --> NET\n  C3 --> NET\n  NET -->|Record / Playback| OSS\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  class C1,C2,C3 muted\n  class GW server\n  class NET svc\n  class PROC svc\n  class STD,IA,ARC store" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "why-choose-us",
			children: "Why Choose Us"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "controllable-costs",
			children: "Controllable Costs"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "EB-level elastic expansion, cold data storage cost as low as $0.015/GB·month." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "ultra-fast-response",
			children: "Ultra-Fast Response"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Global 128 edge nodes, video transmission speed improved 5x." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "automatic-video-upload-encryption",
			children: "Automatic Video Upload Encryption"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Automatic video encryption ensures upload storage security, prevents data leakage and illegal distribution, while helping platforms meet privacy protection regulations and reduce legal risks" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "version-protection",
			children: "Version Protection"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Platform-provided original video automatic encryption service effectively prevents piracy and tampering, protects intellectual property, while improving user trust and satisfaction" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "technical-parameter-comparison-table",
			children: "Technical Parameter Comparison Table"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Metric" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Traditional Solution" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "RustFS Solution" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Improvement" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage density" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "1.2× raw size" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "✓ 0.6× (lossless compression)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "2× ↑" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Concurrent writes" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "≤ 500 streams" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "✓ 2000+ streams" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "4× ↑" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Storage availability" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "99%" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "✓ 99.999%" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "100× reliability" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "TCO (5 years)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "$580K" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "✓ $190K" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "76% cost savings" })
			] })
		] })] })
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
