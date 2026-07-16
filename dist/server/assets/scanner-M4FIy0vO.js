import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/management/object/scanner.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Object Scanning",
	"description": "Guide to the RustFS object scanner, including design, implementation, and monitoring."
};
var _markdown = "\n\nThis guide covers the design and implementation of the RustFS object scanner, including its integration with Erasure Coding, Scrub & Repair mechanisms, scheduling strategies, monitoring metrics, and troubleshooting.\n\n## Overview [#overview]\n\nThe RustFS object scanner is built into the storage engine and is responsible for periodically checking object integrity and executing scheduled operations.\nScanning tasks include disk usage statistics, lifecycle management rule evaluation, object replication execution, and triggering corrupted object self-healing.\n\n## Architecture and Design Principles [#architecture-and-design-principles]\n\n### Scanner Architecture [#scanner-architecture]\n\nThe RustFS scanner uses a hash sampling mechanism, selecting one out of every 1024 objects for inspection based on object name hashing to minimize performance impact.\nThe scanner is deeply integrated with the Erasure Coding module, utilizing redundant shards for online reconstruction when detecting lost or corrupted shards, ensuring high data availability and consistency.\n\n## Data Verification and Recovery [#data-verification-and-recovery]\n\nThe RustFS data verification mechanism checks metadata consistency and performs bit-by-bit reading and verification to discover hidden bad blocks. The object scanner detects issues like bit rot and triggers repair processes when necessary.\n\n## Scanning Modes and Scheduling [#scanning-modes-and-scheduling]\n\nRustFS supports three scanning modes: online scanning during reads, background periodic scanning, and manual full scanning, balancing performance and reliability.\nSimilar to the `osd_scrub_begin_hour` configuration in Ceph, administrators can set scanning start times and frequency. For example, light verification is set to once daily by default.\n\n## Monitoring and Metrics [#monitoring-and-metrics]\n\nScanner statistics include total task count, failure count, and time distribution, exposing metrics through the Prometheus data model such as `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total`, and `rustfs_scanner_duration_seconds`.\nCombined with monitoring systems, alerts can be set based on scanning failure rates and duration to promptly discover and locate potential issues at the storage or network levels.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "This guide covers the design and implementation of the RustFS object scanner, including its integration with Erasure Coding, Scrub & Repair mechanisms, scheduling strategies, monitoring metrics, and troubleshooting."
		},
		{
			"heading": "overview",
			"content": "The RustFS object scanner is built into the storage engine and is responsible for periodically checking object integrity and executing scheduled operations.\nScanning tasks include disk usage statistics, lifecycle management rule evaluation, object replication execution, and triggering corrupted object self-healing."
		},
		{
			"heading": "scanner-architecture",
			"content": "The RustFS scanner uses a hash sampling mechanism, selecting one out of every 1024 objects for inspection based on object name hashing to minimize performance impact.\nThe scanner is deeply integrated with the Erasure Coding module, utilizing redundant shards for online reconstruction when detecting lost or corrupted shards, ensuring high data availability and consistency."
		},
		{
			"heading": "data-verification-and-recovery",
			"content": "The RustFS data verification mechanism checks metadata consistency and performs bit-by-bit reading and verification to discover hidden bad blocks. The object scanner detects issues like bit rot and triggers repair processes when necessary."
		},
		{
			"heading": "scanning-modes-and-scheduling",
			"content": "RustFS supports three scanning modes: online scanning during reads, background periodic scanning, and manual full scanning, balancing performance and reliability.\nSimilar to the `osd_scrub_begin_hour` configuration in Ceph, administrators can set scanning start times and frequency. For example, light verification is set to once daily by default."
		},
		{
			"heading": "monitoring-and-metrics",
			"content": "Scanner statistics include total task count, failure count, and time distribution, exposing metrics through the Prometheus data model such as `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total`, and `rustfs_scanner_duration_seconds`.\nCombined with monitoring systems, alerts can be set based on scanning failure rates and duration to promptly discover and locate potential issues at the storage or network levels."
		}
	],
	"headings": [
		{
			"id": "overview",
			"content": "Overview"
		},
		{
			"id": "architecture-and-design-principles",
			"content": "Architecture and Design Principles"
		},
		{
			"id": "scanner-architecture",
			"content": "Scanner Architecture"
		},
		{
			"id": "data-verification-and-recovery",
			"content": "Data Verification and Recovery"
		},
		{
			"id": "scanning-modes-and-scheduling",
			"content": "Scanning Modes and Scheduling"
		},
		{
			"id": "monitoring-and-metrics",
			"content": "Monitoring and Metrics"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#overview",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Overview" })
	},
	{
		depth: 2,
		url: "#architecture-and-design-principles",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Architecture and Design Principles" })
	},
	{
		depth: 3,
		url: "#scanner-architecture",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Scanner Architecture" })
	},
	{
		depth: 2,
		url: "#data-verification-and-recovery",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Data Verification and Recovery" })
	},
	{
		depth: 2,
		url: "#scanning-modes-and-scheduling",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Scanning Modes and Scheduling" })
	},
	{
		depth: 2,
		url: "#monitoring-and-metrics",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Monitoring and Metrics" })
	}
];
function _createMdxContent(props) {
	const _components = {
		code: "code",
		h2: "h2",
		h3: "h3",
		p: "p",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "This guide covers the design and implementation of the RustFS object scanner, including its integration with Erasure Coding, Scrub & Repair mechanisms, scheduling strategies, monitoring metrics, and troubleshooting." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "overview",
			children: "Overview"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The RustFS object scanner is built into the storage engine and is responsible for periodically checking object integrity and executing scheduled operations.\nScanning tasks include disk usage statistics, lifecycle management rule evaluation, object replication execution, and triggering corrupted object self-healing." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "architecture-and-design-principles",
			children: "Architecture and Design Principles"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "scanner-architecture",
			children: "Scanner Architecture"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The RustFS scanner uses a hash sampling mechanism, selecting one out of every 1024 objects for inspection based on object name hashing to minimize performance impact.\nThe scanner is deeply integrated with the Erasure Coding module, utilizing redundant shards for online reconstruction when detecting lost or corrupted shards, ensuring high data availability and consistency." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "data-verification-and-recovery",
			children: "Data Verification and Recovery"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The RustFS data verification mechanism checks metadata consistency and performs bit-by-bit reading and verification to discover hidden bad blocks. The object scanner detects issues like bit rot and triggers repair processes when necessary." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "scanning-modes-and-scheduling",
			children: "Scanning Modes and Scheduling"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"RustFS supports three scanning modes: online scanning during reads, background periodic scanning, and manual full scanning, balancing performance and reliability.\nSimilar to the ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "osd_scrub_begin_hour" }),
			" configuration in Ceph, administrators can set scanning start times and frequency. For example, light verification is set to once daily by default."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "monitoring-and-metrics",
			children: "Monitoring and Metrics"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Scanner statistics include total task count, failure count, and time distribution, exposing metrics through the Prometheus data model such as ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_scanner_jobs_total" }),
			", ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_scanner_failures_total" }),
			", and ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "rustfs_scanner_duration_seconds" }),
			".\nCombined with monitoring systems, alerts can be set based on scanning failure rates and duration to promptly discover and locate potential issues at the storage or network levels."
		] })
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
