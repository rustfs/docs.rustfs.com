import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/linux/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "What is RustFS and Installation Instructions",
	"description": "RustFS is an object storage solution, open-source distributed object storage released under Apache2 license."
};
var _markdown = "\n\n# What is RustFS? [#what-is-rustfs]\n\nRustFS is a simple, efficient, distributed object storage system, well suited for replacing MinIO and object storage scenarios for AI training and inference.\nAdditionally, RustFS is an efficient, open-source, free object storage solution. It is S3-compatible open-source software released under the Apache 2.0 license. RustFS is written in Rust, leveraging its industry-leading memory safety and zero-cost abstractions for high-performance storage. RustFS is a commercial-friendly distributed object storage product developed and contributed to by excellent engineers worldwide. RustFS can replace many object storage products with unfriendly open-source licenses.\n\nRustFS is about to transition from commercial applications to formal open-source release globally, helping the world reduce storage costs and improve data security.\n\n## Pre-Installation Reading [#pre-installation-reading]\n\nRustFS has three installation modes: single-node single-disk suitable mode, single-node multi-disk, and multi-node multi-disk modes. Among these, the multi-node multi-disk mode includes enterprise-grade available performance, security, and scalability. It also provides architecture diagrams needed for production workloads. Please read our startup modes and checklists before installation, as follows:\n\n1. Review the three installation startup modes:\n\n   * [Single Node Single Disk Mode (SNSD)](./single-node-single-disk.md)\n   * [Single Node Multiple Disk Mode (SNMD)](./single-node-multiple-disk.md)\n   * [Multiple Node Multiple Disk Mode (MNMD)](./multiple-node-multiple-disk.md)\n\n2. [Pre-installation checks](../checklists/index.md), ensure all items meet production guidance. If production standards are not needed, this guidance can be skipped.\n\n## Operating System and CPU Support [#operating-system-and-cpu-support]\n\nYou can run RustFS on almost any CPU and operating system, whether Linux, Unix, Windows, MacOS, FreeBSD, Docker, or even edge gateways.\nCPU architecture support: X86, ARM, and various other CPU architectures.\n\n## RustFS Features [#rustfs-features]\n\n* **S3 Compatible**: S3-compatible (see the [compatibility matrix](../../features/s3-compatibility/index.md)), working out of the box with big data, data lakes, backup software, image processing software, and industrial production software;\n* **Distributed**: RustFS is a distributed object storage, therefore, RustFS can meet various needs;\n* **Commercial-Friendly**: RustFS is 100% open-source software and released under Apache v2.0 license, therefore, RustFS is commercial-friendly;\n* **Fast**: The performance of Rust development language is infinitely close to C language speed. Therefore, RustFS performance is very strong;\n* **Secure**: RustFS is written in Rust, whose memory safety eliminates entire classes of common storage-security vulnerabilities;\n* **Cross-Platform**: RustFS works on Windows, macOS, and Linux;\n* **Extensible**: RustFS supports custom plugins, therefore, RustFS can meet various needs;\n* **Customizable**: Due to open-source characteristics, you can customize various plugins, therefore, RustFS can meet various needs;\n* **Cloud-Native**: RustFS supports deployment via Docker and other methods, enabling rapid deployment in cloud-native environments.\n\n## RustFS Values [#rustfs-values]\n\nHelp all humanity improve data security and reduce storage costs.\n\n## RustFS Vision [#rustfs-vision]\n\nEvery individual AI agent in the world can use RustFS to store data.\n";
var structuredData = {
	"contents": [
		{
			"heading": "what-is-rustfs",
			"content": "RustFS is a simple, efficient, distributed object storage system, well suited for replacing MinIO and object storage scenarios for AI training and inference.\nAdditionally, RustFS is an efficient, open-source, free object storage solution. It is S3-compatible open-source software released under the Apache 2.0 license. RustFS is written in Rust, leveraging its industry-leading memory safety and zero-cost abstractions for high-performance storage. RustFS is a commercial-friendly distributed object storage product developed and contributed to by excellent engineers worldwide. RustFS can replace many object storage products with unfriendly open-source licenses."
		},
		{
			"heading": "what-is-rustfs",
			"content": "RustFS is about to transition from commercial applications to formal open-source release globally, helping the world reduce storage costs and improve data security."
		},
		{
			"heading": "pre-installation-reading",
			"content": "RustFS has three installation modes: single-node single-disk suitable mode, single-node multi-disk, and multi-node multi-disk modes. Among these, the multi-node multi-disk mode includes enterprise-grade available performance, security, and scalability. It also provides architecture diagrams needed for production workloads. Please read our startup modes and checklists before installation, as follows:"
		},
		{
			"heading": "pre-installation-reading",
			"content": "Review the three installation startup modes:"
		},
		{
			"heading": "pre-installation-reading",
			"content": "Single Node Single Disk Mode (SNSD)"
		},
		{
			"heading": "pre-installation-reading",
			"content": "Single Node Multiple Disk Mode (SNMD)"
		},
		{
			"heading": "pre-installation-reading",
			"content": "Multiple Node Multiple Disk Mode (MNMD)"
		},
		{
			"heading": "pre-installation-reading",
			"content": "Pre-installation checks, ensure all items meet production guidance. If production standards are not needed, this guidance can be skipped."
		},
		{
			"heading": "operating-system-and-cpu-support",
			"content": "You can run RustFS on almost any CPU and operating system, whether Linux, Unix, Windows, MacOS, FreeBSD, Docker, or even edge gateways.\nCPU architecture support: X86, ARM, and various other CPU architectures."
		},
		{
			"heading": "rustfs-features",
			"content": "**S3 Compatible**: S3-compatible (see the compatibility matrix), working out of the box with big data, data lakes, backup software, image processing software, and industrial production software;"
		},
		{
			"heading": "rustfs-features",
			"content": "**Distributed**: RustFS is a distributed object storage, therefore, RustFS can meet various needs;"
		},
		{
			"heading": "rustfs-features",
			"content": "**Commercial-Friendly**: RustFS is 100% open-source software and released under Apache v2.0 license, therefore, RustFS is commercial-friendly;"
		},
		{
			"heading": "rustfs-features",
			"content": "**Fast**: The performance of Rust development language is infinitely close to C language speed. Therefore, RustFS performance is very strong;"
		},
		{
			"heading": "rustfs-features",
			"content": "**Secure**: RustFS is written in Rust, whose memory safety eliminates entire classes of common storage-security vulnerabilities;"
		},
		{
			"heading": "rustfs-features",
			"content": "**Cross-Platform**: RustFS works on Windows, macOS, and Linux;"
		},
		{
			"heading": "rustfs-features",
			"content": "**Extensible**: RustFS supports custom plugins, therefore, RustFS can meet various needs;"
		},
		{
			"heading": "rustfs-features",
			"content": "**Customizable**: Due to open-source characteristics, you can customize various plugins, therefore, RustFS can meet various needs;"
		},
		{
			"heading": "rustfs-features",
			"content": "**Cloud-Native**: RustFS supports deployment via Docker and other methods, enabling rapid deployment in cloud-native environments."
		},
		{
			"heading": "rustfs-values",
			"content": "Help all humanity improve data security and reduce storage costs."
		},
		{
			"heading": "rustfs-vision",
			"content": "Every individual AI agent in the world can use RustFS to store data."
		}
	],
	"headings": [
		{
			"id": "what-is-rustfs",
			"content": "What is RustFS?"
		},
		{
			"id": "pre-installation-reading",
			"content": "Pre-Installation Reading"
		},
		{
			"id": "operating-system-and-cpu-support",
			"content": "Operating System and CPU Support"
		},
		{
			"id": "rustfs-features",
			"content": "RustFS Features"
		},
		{
			"id": "rustfs-values",
			"content": "RustFS Values"
		},
		{
			"id": "rustfs-vision",
			"content": "RustFS Vision"
		}
	]
};
var toc = [
	{
		depth: 1,
		url: "#what-is-rustfs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "What is RustFS?" })
	},
	{
		depth: 2,
		url: "#pre-installation-reading",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Pre-Installation Reading" })
	},
	{
		depth: 2,
		url: "#operating-system-and-cpu-support",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Operating System and CPU Support" })
	},
	{
		depth: 2,
		url: "#rustfs-features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS Features" })
	},
	{
		depth: 2,
		url: "#rustfs-values",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS Values" })
	},
	{
		depth: 2,
		url: "#rustfs-vision",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS Vision" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		h1: "h1",
		h2: "h2",
		li: "li",
		ol: "ol",
		p: "p",
		strong: "strong",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h1, {
			id: "what-is-rustfs",
			children: "What is RustFS?"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is a simple, efficient, distributed object storage system, well suited for replacing MinIO and object storage scenarios for AI training and inference.\nAdditionally, RustFS is an efficient, open-source, free object storage solution. It is S3-compatible open-source software released under the Apache 2.0 license. RustFS is written in Rust, leveraging its industry-leading memory safety and zero-cost abstractions for high-performance storage. RustFS is a commercial-friendly distributed object storage product developed and contributed to by excellent engineers worldwide. RustFS can replace many object storage products with unfriendly open-source licenses." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is about to transition from commercial applications to formal open-source release globally, helping the world reduce storage costs and improve data security." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "pre-installation-reading",
			children: "Pre-Installation Reading"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS has three installation modes: single-node single-disk suitable mode, single-node multi-disk, and multi-node multi-disk modes. Among these, the multi-node multi-disk mode includes enterprise-grade available performance, security, and scalability. It also provides architecture diagrams needed for production workloads. Please read our startup modes and checklists before installation, as follows:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Review the three installation startup modes:" }),
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
					"\n",
					(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
						href: "./single-node-single-disk.md",
						children: "Single Node Single Disk Mode (SNSD)"
					}) }),
					"\n",
					(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
						href: "./single-node-multiple-disk.md",
						children: "Single Node Multiple Disk Mode (SNMD)"
					}) }),
					"\n",
					(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.a, {
						href: "./multiple-node-multiple-disk.md",
						children: "Multiple Node Multiple Disk Mode (MNMD)"
					}) }),
					"\n"
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.a, {
					href: "../checklists/index.md",
					children: "Pre-installation checks"
				}), ", ensure all items meet production guidance. If production standards are not needed, this guidance can be skipped."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "operating-system-and-cpu-support",
			children: "Operating System and CPU Support"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "You can run RustFS on almost any CPU and operating system, whether Linux, Unix, Windows, MacOS, FreeBSD, Docker, or even edge gateways.\nCPU architecture support: X86, ARM, and various other CPU architectures." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-features",
			children: "RustFS Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "S3 Compatible" }),
				": S3-compatible (see the ",
				(0, import_jsx_runtime_react_server.jsx)(_components.a, {
					href: "../../features/s3-compatibility/index.md",
					children: "compatibility matrix"
				}),
				"), working out of the box with big data, data lakes, backup software, image processing software, and industrial production software;"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Distributed" }), ": RustFS is a distributed object storage, therefore, RustFS can meet various needs;"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Commercial-Friendly" }), ": RustFS is 100% open-source software and released under Apache v2.0 license, therefore, RustFS is commercial-friendly;"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Fast" }), ": The performance of Rust development language is infinitely close to C language speed. Therefore, RustFS performance is very strong;"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Secure" }), ": RustFS is written in Rust, whose memory safety eliminates entire classes of common storage-security vulnerabilities;"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Cross-Platform" }), ": RustFS works on Windows, macOS, and Linux;"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Extensible" }), ": RustFS supports custom plugins, therefore, RustFS can meet various needs;"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Customizable" }), ": Due to open-source characteristics, you can customize various plugins, therefore, RustFS can meet various needs;"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Cloud-Native" }), ": RustFS supports deployment via Docker and other methods, enabling rapid deployment in cloud-native environments."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-values",
			children: "RustFS Values"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Help all humanity improve data security and reduce storage costs." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-vision",
			children: "RustFS Vision"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Every individual AI agent in the world can use RustFS to store data." })
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
