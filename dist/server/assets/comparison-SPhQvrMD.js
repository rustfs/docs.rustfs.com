import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/concepts/comparison.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "RustFS vs Other Storage Products",
	"description": "Comparison of RustFS with mainstream object storage products"
};
var _markdown = "\n\n| Parameter             | Ceph                        | MinIO                           | RustFS                          |\n| --------------------- | --------------------------- | ------------------------------- | ------------------------------- |\n| Development Language  | C++                         | Go                              | Rust                            |\n| Open Source License   | GPL-2.0, LGPL-2.1, LGPL-3.0 | AGPL-3.0                        | Apache-2.0                      |\n| Metadata Center       | √                           | x                               | x                               |\n| Block Storage         | √                           | x                               | x                               |\n| File Storage          | √                           | x                               | x                               |\n| Architecture          | Heavy architecture design   | Lightweight architecture design | Lightweight architecture design |\n| Community Activity    | √                           | √                               | √                               |\n| License Friendliness  | Medium                      | Restrictive (AGPL)              | Excellent (Permissive)          |\n| Performance           | Hardware dependent          | High performance, low latency   | High performance, low latency   |\n| File Protocol         | S3, RBD, CephFS, etc.       | S3                              | S3                              |\n| Ease of Use           | Low                         | High                            | High                            |\n| Scalability           | EB level                    | EB level                        | EB level                        |\n| Hardware Requirements | High                        | Medium                          | Low                             |\n| Memory Management     | Manual                      | GC-based                        | Ownership-based (No GC)         |\n| Scaling               | High difficulty             | Low difficulty                  | Low difficulty                  |\n| Rebalancing           | High resource consumption   | Low resource consumption        | Low resource consumption        |\n| Commercial Support    | √                           | √                               | √                               |\n\n## Global Object Storage Architectural Approaches [#global-object-storage-architectural-approaches]\n\nCurrently, distributed object storage products worldwide are mainly divided into two architectural approaches:\n\n1. **Centralized Metadata**: Represented by Ceph.\n\n2. **Decentralized Metadata**: Represented by RustFS and MinIO.\n\nComparison of advantages and disadvantages:\n\n| Feature                      | Centralized Metadata                                                                                | Decentralized Metadata                                                                              |\n| ---------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |\n| Architecture Characteristics | Dedicated metadata server or center for unified metadata management                                 | Metadata distributed across storage nodes, no dedicated metadata server                             |\n| Metadata Management          | Efficient centralized management, fast query and update                                             | Distributed metadata storage, avoiding single-point bottlenecks                                     |\n| Single Point of Failure      | Metadata server may become a single point of failure, requiring additional high-availability design | No single node failure risk                                                                         |\n| Deployment Complexity        | Complex deployment and maintenance, requires professional operations skills                         | Relatively simple deployment and maintenance, suitable for cloud-native and containerized scenarios |\n| Performance Issues           | Under high concurrency, metadata server may become a performance bottleneck                         | Small file support will consume more IOPS                                                           |\n| Typical Scenarios            | File systems (such as Lustre, CephFS) and scenarios requiring complex metadata                      | Object storage (RustFS, MinIO) and large-scale distributed systems                                  |\n\n## About Storage Speed [#about-storage-speed]\n\nRustFS and MinIO share similar design principles, with overall speed largely dependent on network bandwidth and disk I/O. Benchmarks indicate that RustFS can achieve read speeds of up to 323 GB/s and write speeds of 183 GB/s.\n\nRustFS and MinIO stand out as leaders in high-performance distributed object storage. Under comparable configurations, their throughput significantly exceeds that of traditional architectures like Ceph.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Parameter"
		},
		{
			"heading": void 0,
			"content": "Ceph"
		},
		{
			"heading": void 0,
			"content": "MinIO"
		},
		{
			"heading": void 0,
			"content": "RustFS"
		},
		{
			"heading": void 0,
			"content": "Development Language"
		},
		{
			"heading": void 0,
			"content": "C++"
		},
		{
			"heading": void 0,
			"content": "Go"
		},
		{
			"heading": void 0,
			"content": "Rust"
		},
		{
			"heading": void 0,
			"content": "Open Source License"
		},
		{
			"heading": void 0,
			"content": "GPL-2.0, LGPL-2.1, LGPL-3.0"
		},
		{
			"heading": void 0,
			"content": "AGPL-3.0"
		},
		{
			"heading": void 0,
			"content": "Apache-2.0"
		},
		{
			"heading": void 0,
			"content": "Metadata Center"
		},
		{
			"heading": void 0,
			"content": "√"
		},
		{
			"heading": void 0,
			"content": "x"
		},
		{
			"heading": void 0,
			"content": "x"
		},
		{
			"heading": void 0,
			"content": "Block Storage"
		},
		{
			"heading": void 0,
			"content": "√"
		},
		{
			"heading": void 0,
			"content": "x"
		},
		{
			"heading": void 0,
			"content": "x"
		},
		{
			"heading": void 0,
			"content": "File Storage"
		},
		{
			"heading": void 0,
			"content": "√"
		},
		{
			"heading": void 0,
			"content": "x"
		},
		{
			"heading": void 0,
			"content": "x"
		},
		{
			"heading": void 0,
			"content": "Architecture"
		},
		{
			"heading": void 0,
			"content": "Heavy architecture design"
		},
		{
			"heading": void 0,
			"content": "Lightweight architecture design"
		},
		{
			"heading": void 0,
			"content": "Lightweight architecture design"
		},
		{
			"heading": void 0,
			"content": "Community Activity"
		},
		{
			"heading": void 0,
			"content": "√"
		},
		{
			"heading": void 0,
			"content": "√"
		},
		{
			"heading": void 0,
			"content": "√"
		},
		{
			"heading": void 0,
			"content": "License Friendliness"
		},
		{
			"heading": void 0,
			"content": "Medium"
		},
		{
			"heading": void 0,
			"content": "Restrictive (AGPL)"
		},
		{
			"heading": void 0,
			"content": "Excellent (Permissive)"
		},
		{
			"heading": void 0,
			"content": "Performance"
		},
		{
			"heading": void 0,
			"content": "Hardware dependent"
		},
		{
			"heading": void 0,
			"content": "High performance, low latency"
		},
		{
			"heading": void 0,
			"content": "High performance, low latency"
		},
		{
			"heading": void 0,
			"content": "File Protocol"
		},
		{
			"heading": void 0,
			"content": "S3, RBD, CephFS, etc."
		},
		{
			"heading": void 0,
			"content": "S3"
		},
		{
			"heading": void 0,
			"content": "S3"
		},
		{
			"heading": void 0,
			"content": "Ease of Use"
		},
		{
			"heading": void 0,
			"content": "Low"
		},
		{
			"heading": void 0,
			"content": "High"
		},
		{
			"heading": void 0,
			"content": "High"
		},
		{
			"heading": void 0,
			"content": "Scalability"
		},
		{
			"heading": void 0,
			"content": "EB level"
		},
		{
			"heading": void 0,
			"content": "EB level"
		},
		{
			"heading": void 0,
			"content": "EB level"
		},
		{
			"heading": void 0,
			"content": "Hardware Requirements"
		},
		{
			"heading": void 0,
			"content": "High"
		},
		{
			"heading": void 0,
			"content": "Medium"
		},
		{
			"heading": void 0,
			"content": "Low"
		},
		{
			"heading": void 0,
			"content": "Memory Management"
		},
		{
			"heading": void 0,
			"content": "Manual"
		},
		{
			"heading": void 0,
			"content": "GC-based"
		},
		{
			"heading": void 0,
			"content": "Ownership-based (No GC)"
		},
		{
			"heading": void 0,
			"content": "Scaling"
		},
		{
			"heading": void 0,
			"content": "High difficulty"
		},
		{
			"heading": void 0,
			"content": "Low difficulty"
		},
		{
			"heading": void 0,
			"content": "Low difficulty"
		},
		{
			"heading": void 0,
			"content": "Rebalancing"
		},
		{
			"heading": void 0,
			"content": "High resource consumption"
		},
		{
			"heading": void 0,
			"content": "Low resource consumption"
		},
		{
			"heading": void 0,
			"content": "Low resource consumption"
		},
		{
			"heading": void 0,
			"content": "Commercial Support"
		},
		{
			"heading": void 0,
			"content": "√"
		},
		{
			"heading": void 0,
			"content": "√"
		},
		{
			"heading": void 0,
			"content": "√"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Currently, distributed object storage products worldwide are mainly divided into two architectural approaches:"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "**Centralized Metadata**: Represented by Ceph."
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "**Decentralized Metadata**: Represented by RustFS and MinIO."
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Comparison of advantages and disadvantages:"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Feature"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Centralized Metadata"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Decentralized Metadata"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Architecture Characteristics"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Dedicated metadata server or center for unified metadata management"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Metadata distributed across storage nodes, no dedicated metadata server"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Metadata Management"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Efficient centralized management, fast query and update"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Distributed metadata storage, avoiding single-point bottlenecks"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Single Point of Failure"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Metadata server may become a single point of failure, requiring additional high-availability design"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "No single node failure risk"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Deployment Complexity"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Complex deployment and maintenance, requires professional operations skills"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Relatively simple deployment and maintenance, suitable for cloud-native and containerized scenarios"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Performance Issues"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Under high concurrency, metadata server may become a performance bottleneck"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Small file support will consume more IOPS"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Typical Scenarios"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "File systems (such as Lustre, CephFS) and scenarios requiring complex metadata"
		},
		{
			"heading": "global-object-storage-architectural-approaches",
			"content": "Object storage (RustFS, MinIO) and large-scale distributed systems"
		},
		{
			"heading": "about-storage-speed",
			"content": "RustFS and MinIO share similar design principles, with overall speed largely dependent on network bandwidth and disk I/O. Benchmarks indicate that RustFS can achieve read speeds of up to 323 GB/s and write speeds of 183 GB/s."
		},
		{
			"heading": "about-storage-speed",
			"content": "RustFS and MinIO stand out as leaders in high-performance distributed object storage. Under comparable configurations, their throughput significantly exceeds that of traditional architectures like Ceph."
		}
	],
	"headings": [{
		"id": "global-object-storage-architectural-approaches",
		"content": "Global Object Storage Architectural Approaches"
	}, {
		"id": "about-storage-speed",
		"content": "About Storage Speed"
	}]
};
var toc = [{
	depth: 2,
	url: "#global-object-storage-architectural-approaches",
	title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Global Object Storage Architectural Approaches" })
}, {
	depth: 2,
	url: "#about-storage-speed",
	title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "About Storage Speed" })
}];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		li: "li",
		ol: "ol",
		p: "p",
		strong: "strong",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Parameter" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Ceph" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "MinIO" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "RustFS" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Development Language" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "C++" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Go" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Rust" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Open Source License" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "GPL-2.0, LGPL-2.1, LGPL-3.0" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "AGPL-3.0" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Apache-2.0" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Metadata Center" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "√" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "x" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "x" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Block Storage" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "√" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "x" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "x" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "File Storage" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "√" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "x" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "x" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Architecture" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Heavy architecture design" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Lightweight architecture design" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Lightweight architecture design" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Community Activity" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "√" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "√" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "√" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "License Friendliness" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Medium" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Restrictive (AGPL)" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Excellent (Permissive)" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Performance" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Hardware dependent" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "High performance, low latency" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "High performance, low latency" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "File Protocol" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "S3, RBD, CephFS, etc." }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "S3" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "S3" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Ease of Use" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Low" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "High" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "High" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Scalability" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "EB level" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "EB level" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "EB level" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Hardware Requirements" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "High" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Medium" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Low" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Memory Management" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Manual" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "GC-based" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Ownership-based (No GC)" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Scaling" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "High difficulty" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Low difficulty" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Low difficulty" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Rebalancing" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "High resource consumption" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Low resource consumption" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Low resource consumption" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Commercial Support" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "√" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "√" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "√" })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "global-object-storage-architectural-approaches",
			children: "Global Object Storage Architectural Approaches"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Currently, distributed object storage products worldwide are mainly divided into two architectural approaches:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Centralized Metadata" }), ": Represented by Ceph."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Decentralized Metadata" }), ": Represented by RustFS and MinIO."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Comparison of advantages and disadvantages:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Feature" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Centralized Metadata" }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: "Decentralized Metadata" })
		] }) }), (0, import_jsx_runtime_react_server.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Architecture Characteristics" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Dedicated metadata server or center for unified metadata management" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Metadata distributed across storage nodes, no dedicated metadata server" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Metadata Management" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Efficient centralized management, fast query and update" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Distributed metadata storage, avoiding single-point bottlenecks" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Single Point of Failure" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Metadata server may become a single point of failure, requiring additional high-availability design" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "No single node failure risk" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Deployment Complexity" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Complex deployment and maintenance, requires professional operations skills" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Relatively simple deployment and maintenance, suitable for cloud-native and containerized scenarios" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Performance Issues" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Under high concurrency, metadata server may become a performance bottleneck" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Small file support will consume more IOPS" })
			] }),
			(0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Typical Scenarios" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "File systems (such as Lustre, CephFS) and scenarios requiring complex metadata" }),
				(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: "Object storage (RustFS, MinIO) and large-scale distributed systems" })
			] })
		] })] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "about-storage-speed",
			children: "About Storage Speed"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS and MinIO share similar design principles, with overall speed largely dependent on network bandwidth and disk I/O. Benchmarks indicate that RustFS can achieve read speeds of up to 323 GB/s and write speeds of 183 GB/s." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS and MinIO stand out as leaders in high-performance distributed object storage. Under comparable configurations, their throughput significantly exceeds that of traditional architectures like Ceph." })
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
