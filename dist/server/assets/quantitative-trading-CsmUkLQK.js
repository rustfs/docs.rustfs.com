import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/quantitative-trading/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Quantitative Trading File Storage Solutions",
	"description": "Intelligent storage architecture designed for high-frequency trading and quantitative strategy backtesting, supporting millions of IOPS per second for order flow processing."
};
var _markdown = "\n\nIntelligent storage architecture designed specifically for high-frequency trading and quantitative strategy backtesting, supporting million-level IOPS order flow processing per second, meeting millisecond access requirements for Tick-level data\n\n## Industry Challenges and Pain Points [#industry-challenges-and-pain-points]\n\n| Category                | Traditional Solution Defects                 | Quantitative Requirements                    | Business Impact                          |\n| ----------------------- | -------------------------------------------- | -------------------------------------------- | ---------------------------------------- |\n| **Data Management**     | Single protocol storage (S3 only/POSIX only) | Cross-protocol unified access (S3+POSIX+NFS) | Strategy iteration cycle ↑20%            |\n| **Performance Metrics** | ≤500k IOPS (small file random read)          | 3M+ IOPS \\<0.5ms latency                     | High-frequency strategy slippage ↓0.3bps |\n| **Storage Cost**        | Cold data > \\$0.05/GB/month                  | Intelligent tiering ≤\\$0.015/GB/month        | Annual storage budget growth ↓65%        |\n\n## Why Choose Us [#why-choose-us]\n\n### Ultra-Fast Response [#ultra-fast-response]\n\n* Adopts RDMA network acceleration and GPU direct storage, latency ≤500μs, throughput up to 200 Gbps\n* High-frequency trading backtesting speed improved by 300%\n\n### Massive File Support [#massive-file-support]\n\n* Intelligently aggregates small files into logical large objects, single cluster supports 400 billion files\n* Metadata retrieval efficiency improved by 40%\n\n### Elastic Scaling [#elastic-scaling]\n\n* Supports hybrid cloud deployment, hot data local SSD acceleration, cold data automatic cloud archiving\n* Capacity can linearly scale to EB level\n\n### Financial Security [#financial-security]\n\n* Enterprise-grade encryption (e.g., AES-256), performance loss \\<3%\n* Supports multi-region, multi-zone disaster recovery, RTO \\<1 minute\n\n## Scenario-Based Solutions [#scenario-based-solutions]\n\n### High-Frequency Strategy Development [#high-frequency-strategy-development]\n\nProvides memory-mapped file interface (mmap), supporting C++/Python strategy code direct access to raw trading data\n\n#### Measured Metrics [#measured-metrics]\n\nSingle strategy backtesting of 1 billion order data takes only 4 hours (traditional solutions require 24+ hours)\n\n### AI Factor Mining [#ai-factor-mining]\n\nIntegrates TensorFlow/PyTorch plugins, automatically mapping feature datasets to S3 object storage paths\n\n#### Case Study [#case-study]\n\nJufund achieved 3000+ factor parallel computing, storage throughput improved 8x\n\n### Regulatory Compliance Storage [#regulatory-compliance-storage]\n\nBuilt-in WORM (Write Once Read Many) mode, meeting non-tamperable trading record requirements\n\nAutomatically generates CFCA-compatible audit logs (processing 100k+ operation records per second)\n\n## Industry Compliance and Security [#industry-compliance-and-security]\n\n### Financial-Grade Encryption &#x2A;*(Required)** [#financial-grade-encryption-required]\n\nFIPS 140-2 certified national security dual algorithm support\n\n### Cross-Regional Synchronization &#x2A;*(Required)** [#cross-regional-synchronization-required]\n\nMeets SEC 17a-4 off-site disaster recovery specifications\n\n### Audit Interface &#x2A;*(Required)** [#audit-interface-required]\n\nDirect integration with Splunk, Elastic regulatory modules\n\n## Core Advantage Comparison [#core-advantage-comparison]\n\n| Dimension                  | Traditional Solutions | rustFS Solutions                | Business Value Manifestation                             |\n| -------------------------- | --------------------- | ------------------------------- | -------------------------------------------------------- |\n| **Order Flow Processing**  | ≤500k IOPS            | ✅ 2.3M IOPS                     | Eliminates order accumulation risk during market peaks   |\n| **Data Compression Ratio** | 3:1                   | ✅ 11:1 (ZSTD+FPGA acceleration) | PB-level backtesting data storage cost reduced by 67%    |\n| **Failover Time**          | 15–30 seconds         | ✅ 82ms                          | Avoids SEC regulation penalties for system interruptions |\n\n## Service Guarantee System [#service-guarantee-system]\n\n### Deployment Services [#deployment-services]\n\nProvides storage-computing integrated machines (pre-installed RustFS) or pure software delivery\n\n### Performance Optimization [#performance-optimization]\n\nFree provision of \"Quantitative Data Lake Design White Paper\" and data governance consulting services\n\n### Ecosystem Cooperation [#ecosystem-cooperation]\n\nAlready completed certification with 20+ quantitative platforms (including JoinQuant, Nuggets Quantitative, etc.)\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Intelligent storage architecture designed specifically for high-frequency trading and quantitative strategy backtesting, supporting million-level IOPS order flow processing per second, meeting millisecond access requirements for Tick-level data"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Category"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Traditional Solution Defects"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Quantitative Requirements"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Business Impact"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "**Data Management**"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Single protocol storage (S3 only/POSIX only)"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Cross-protocol unified access (S3+POSIX+NFS)"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Strategy iteration cycle ↑20%"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "**Performance Metrics**"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "≤500k IOPS (small file random read)"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "3M+ IOPS \\<0.5ms latency"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "High-frequency strategy slippage ↓0.3bps"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "**Storage Cost**"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Cold data > \\$0.05/GB/month"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Intelligent tiering ≤\\$0.015/GB/month"
		},
		{
			"heading": "industry-challenges-and-pain-points",
			"content": "Annual storage budget growth ↓65%"
		},
		{
			"heading": "ultra-fast-response",
			"content": "Adopts RDMA network acceleration and GPU direct storage, latency ≤500μs, throughput up to 200 Gbps"
		},
		{
			"heading": "ultra-fast-response",
			"content": "High-frequency trading backtesting speed improved by 300%"
		},
		{
			"heading": "massive-file-support",
			"content": "Intelligently aggregates small files into logical large objects, single cluster supports 400 billion files"
		},
		{
			"heading": "massive-file-support",
			"content": "Metadata retrieval efficiency improved by 40%"
		},
		{
			"heading": "elastic-scaling",
			"content": "Supports hybrid cloud deployment, hot data local SSD acceleration, cold data automatic cloud archiving"
		},
		{
			"heading": "elastic-scaling",
			"content": "Capacity can linearly scale to EB level"
		},
		{
			"heading": "financial-security",
			"content": "Enterprise-grade encryption (e.g., AES-256), performance loss \\<3%"
		},
		{
			"heading": "financial-security",
			"content": "Supports multi-region, multi-zone disaster recovery, RTO \\<1 minute"
		},
		{
			"heading": "high-frequency-strategy-development",
			"content": "Provides memory-mapped file interface (mmap), supporting C++/Python strategy code direct access to raw trading data"
		},
		{
			"heading": "measured-metrics",
			"content": "Single strategy backtesting of 1 billion order data takes only 4 hours (traditional solutions require 24+ hours)"
		},
		{
			"heading": "ai-factor-mining",
			"content": "Integrates TensorFlow/PyTorch plugins, automatically mapping feature datasets to S3 object storage paths"
		},
		{
			"heading": "case-study",
			"content": "Jufund achieved 3000+ factor parallel computing, storage throughput improved 8x"
		},
		{
			"heading": "regulatory-compliance-storage",
			"content": "Built-in WORM (Write Once Read Many) mode, meeting non-tamperable trading record requirements"
		},
		{
			"heading": "regulatory-compliance-storage",
			"content": "Automatically generates CFCA-compatible audit logs (processing 100k+ operation records per second)"
		},
		{
			"heading": "financial-grade-encryption-required",
			"content": "FIPS 140-2 certified national security dual algorithm support"
		},
		{
			"heading": "cross-regional-synchronization-required",
			"content": "Meets SEC 17a-4 off-site disaster recovery specifications"
		},
		{
			"heading": "audit-interface-required",
			"content": "Direct integration with Splunk, Elastic regulatory modules"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "Dimension"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "Traditional Solutions"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "rustFS Solutions"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "Business Value Manifestation"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "**Order Flow Processing**"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "≤500k IOPS"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "✅ 2.3M IOPS"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "Eliminates order accumulation risk during market peaks"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "**Data Compression Ratio**"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "3:1"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "✅ 11:1 (ZSTD+FPGA acceleration)"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "PB-level backtesting data storage cost reduced by 67%"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "**Failover Time**"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "15–30 seconds"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "✅ 82ms"
		},
		{
			"heading": "core-advantage-comparison",
			"content": "Avoids SEC regulation penalties for system interruptions"
		},
		{
			"heading": "deployment-services",
			"content": "Provides storage-computing integrated machines (pre-installed RustFS) or pure software delivery"
		},
		{
			"heading": "performance-optimization",
			"content": "Free provision of \"Quantitative Data Lake Design White Paper\" and data governance consulting services"
		},
		{
			"heading": "ecosystem-cooperation",
			"content": "Already completed certification with 20+ quantitative platforms (including JoinQuant, Nuggets Quantitative, etc.)"
		}
	],
	"headings": [
		{
			"id": "industry-challenges-and-pain-points",
			"content": "Industry Challenges and Pain Points"
		},
		{
			"id": "why-choose-us",
			"content": "Why Choose Us"
		},
		{
			"id": "ultra-fast-response",
			"content": "Ultra-Fast Response"
		},
		{
			"id": "massive-file-support",
			"content": "Massive File Support"
		},
		{
			"id": "elastic-scaling",
			"content": "Elastic Scaling"
		},
		{
			"id": "financial-security",
			"content": "Financial Security"
		},
		{
			"id": "scenario-based-solutions",
			"content": "Scenario-Based Solutions"
		},
		{
			"id": "high-frequency-strategy-development",
			"content": "High-Frequency Strategy Development"
		},
		{
			"id": "measured-metrics",
			"content": "Measured Metrics"
		},
		{
			"id": "ai-factor-mining",
			"content": "AI Factor Mining"
		},
		{
			"id": "case-study",
			"content": "Case Study"
		},
		{
			"id": "regulatory-compliance-storage",
			"content": "Regulatory Compliance Storage"
		},
		{
			"id": "industry-compliance-and-security",
			"content": "Industry Compliance and Security"
		},
		{
			"id": "financial-grade-encryption-required",
			"content": "Financial-Grade Encryption &#x2A;*(Required)**"
		},
		{
			"id": "cross-regional-synchronization-required",
			"content": "Cross-Regional Synchronization &#x2A;*(Required)**"
		},
		{
			"id": "audit-interface-required",
			"content": "Audit Interface &#x2A;*(Required)**"
		},
		{
			"id": "core-advantage-comparison",
			"content": "Core Advantage Comparison"
		},
		{
			"id": "service-guarantee-system",
			"content": "Service Guarantee System"
		},
		{
			"id": "deployment-services",
			"content": "Deployment Services"
		},
		{
			"id": "performance-optimization",
			"content": "Performance Optimization"
		},
		{
			"id": "ecosystem-cooperation",
			"content": "Ecosystem Cooperation"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#industry-challenges-and-pain-points",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Industry Challenges and Pain Points" })
	},
	{
		depth: 2,
		url: "#why-choose-us",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Why Choose Us" })
	},
	{
		depth: 3,
		url: "#ultra-fast-response",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Ultra-Fast Response" })
	},
	{
		depth: 3,
		url: "#massive-file-support",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Massive File Support" })
	},
	{
		depth: 3,
		url: "#elastic-scaling",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Elastic Scaling" })
	},
	{
		depth: 3,
		url: "#financial-security",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Financial Security" })
	},
	{
		depth: 2,
		url: "#scenario-based-solutions",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Scenario-Based Solutions" })
	},
	{
		depth: 3,
		url: "#high-frequency-strategy-development",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "High-Frequency Strategy Development" })
	},
	{
		depth: 4,
		url: "#measured-metrics",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Measured Metrics" })
	},
	{
		depth: 3,
		url: "#ai-factor-mining",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "AI Factor Mining" })
	},
	{
		depth: 4,
		url: "#case-study",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Case Study" })
	},
	{
		depth: 3,
		url: "#regulatory-compliance-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Regulatory Compliance Storage" })
	},
	{
		depth: 2,
		url: "#industry-compliance-and-security",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Industry Compliance and Security" })
	},
	{
		depth: 3,
		url: "#financial-grade-encryption-required",
		title: (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: ["Financial-Grade Encryption ", (0, import_jsx_runtime_react_server.jsx)("strong", { children: "(Required)" })] })
	},
	{
		depth: 3,
		url: "#cross-regional-synchronization-required",
		title: (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: ["Cross-Regional Synchronization ", (0, import_jsx_runtime_react_server.jsx)("strong", { children: "(Required)" })] })
	},
	{
		depth: 3,
		url: "#audit-interface-required",
		title: (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: ["Audit Interface ", (0, import_jsx_runtime_react_server.jsx)("strong", { children: "(Required)" })] })
	},
	{
		depth: 2,
		url: "#core-advantage-comparison",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Core Advantage Comparison" })
	},
	{
		depth: 2,
		url: "#service-guarantee-system",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Service Guarantee System" })
	},
	{
		depth: 3,
		url: "#deployment-services",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Deployment Services" })
	},
	{
		depth: 3,
		url: "#performance-optimization",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Performance Optimization" })
	},
	{
		depth: 3,
		url: "#ecosystem-cooperation",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Ecosystem Cooperation" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		h3: "h3",
		h4: "h4",
		li: "li",
		p: "p",
		strong: "strong",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Intelligent storage architecture designed specifically for high-frequency trading and quantitative strategy backtesting, supporting million-level IOPS order flow processing per second, meeting millisecond access requirements for Tick-level data" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "industry-challenges-and-pain-points",
			children: "Industry Challenges and Pain Points"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Category" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Traditional Solution Defects" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Quantitative Requirements" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Business Impact" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Data Management" }) }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Single protocol storage (S3 only/POSIX only)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Cross-protocol unified access (S3+POSIX+NFS)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Strategy iteration cycle ↑20%" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Performance Metrics" }) }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "≤500k IOPS (small file random read)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "3M+ IOPS <0.5ms latency" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "High-frequency strategy slippage ↓0.3bps" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Storage Cost" }) }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Cold data > $0.05/GB/month" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Intelligent tiering ≤$0.015/GB/month" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Annual storage budget growth ↓65%" })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "why-choose-us",
			children: "Why Choose Us"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "ultra-fast-response",
			children: "Ultra-Fast Response"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Adopts RDMA network acceleration and GPU direct storage, latency ≤500μs, throughput up to 200 Gbps" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "High-frequency trading backtesting speed improved by 300%" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "massive-file-support",
			children: "Massive File Support"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Intelligently aggregates small files into logical large objects, single cluster supports 400 billion files" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Metadata retrieval efficiency improved by 40%" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "elastic-scaling",
			children: "Elastic Scaling"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Supports hybrid cloud deployment, hot data local SSD acceleration, cold data automatic cloud archiving" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Capacity can linearly scale to EB level" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "financial-security",
			children: "Financial Security"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Enterprise-grade encryption (e.g., AES-256), performance loss <3%" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Supports multi-region, multi-zone disaster recovery, RTO <1 minute" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "scenario-based-solutions",
			children: "Scenario-Based Solutions"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "high-frequency-strategy-development",
			children: "High-Frequency Strategy Development"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Provides memory-mapped file interface (mmap), supporting C++/Python strategy code direct access to raw trading data" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
			id: "measured-metrics",
			children: "Measured Metrics"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Single strategy backtesting of 1 billion order data takes only 4 hours (traditional solutions require 24+ hours)" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "ai-factor-mining",
			children: "AI Factor Mining"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Integrates TensorFlow/PyTorch plugins, automatically mapping feature datasets to S3 object storage paths" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h4, {
			id: "case-study",
			children: "Case Study"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Jufund achieved 3000+ factor parallel computing, storage throughput improved 8x" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "regulatory-compliance-storage",
			children: "Regulatory Compliance Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Built-in WORM (Write Once Read Many) mode, meeting non-tamperable trading record requirements" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Automatically generates CFCA-compatible audit logs (processing 100k+ operation records per second)" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "industry-compliance-and-security",
			children: "Industry Compliance and Security"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.h3, {
			id: "financial-grade-encryption-required",
			children: ["Financial-Grade Encryption ", (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "(Required)" })]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "FIPS 140-2 certified national security dual algorithm support" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.h3, {
			id: "cross-regional-synchronization-required",
			children: ["Cross-Regional Synchronization ", (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "(Required)" })]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Meets SEC 17a-4 off-site disaster recovery specifications" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.h3, {
			id: "audit-interface-required",
			children: ["Audit Interface ", (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "(Required)" })]
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Direct integration with Splunk, Elastic regulatory modules" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "core-advantage-comparison",
			children: "Core Advantage Comparison"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Dimension" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Traditional Solutions" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "rustFS Solutions" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Business Value Manifestation" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Order Flow Processing" }) }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "≤500k IOPS" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "✅ 2.3M IOPS" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Eliminates order accumulation risk during market peaks" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Data Compression Ratio" }) }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "3:1" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "✅ 11:1 (ZSTD+FPGA acceleration)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "PB-level backtesting data storage cost reduced by 67%" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Failover Time" }) }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "15–30 seconds" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "✅ 82ms" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Avoids SEC regulation penalties for system interruptions" })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "service-guarantee-system",
			children: "Service Guarantee System"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "deployment-services",
			children: "Deployment Services"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Provides storage-computing integrated machines (pre-installed RustFS) or pure software delivery" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "performance-optimization",
			children: "Performance Optimization"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Free provision of \"Quantitative Data Lake Design White Paper\" and data governance consulting services" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "ecosystem-cooperation",
			children: "Ecosystem Cooperation"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Already completed certification with 20+ quantitative platforms (including JoinQuant, Nuggets Quantitative, etc.)" })
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
