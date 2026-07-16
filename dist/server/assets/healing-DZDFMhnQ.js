import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/troubleshooting/healing.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Object Inspection and Auto-Recovery",
	"description": "How RustFS object self-healing works: design principles, trigger paths, scrub and repair process, and usage notes."
};
var _markdown = "\n\n## RustFS Architecture and Self-Healing Design [#rustfs-architecture-and-self-healing-design]\n\n### Erasure-Coded Storage Pools [#erasure-coded-storage-pools]\n\nRustFS organizes disks — on a single node or across nodes — into erasure-set storage pools. Each object is split into data shards and parity shards when written, and distributed across different disks (and nodes) to improve reliability and performance.\n\n### Self-Healing Design Principles [#self-healing-design-principles]\n\n1. **Data Integrity Verification**: Combines checksum mechanisms to ensure object shard data consistency during reads, for example, ZFS validates each data block's checksum during reads and repairs when validation fails.\n2. **Shard Redundancy and Erasure Coding**: Generates redundant shards through erasure coding. When some data shards are lost or corrupted, original objects can be reconstructed using redundant shards.\n3. **Multi-Level Self-Healing Triggers**: Includes online self-healing during reads, background scanning self-healing, and manual trigger self-healing to balance performance and data reliability.\n\n## Object Self-Healing Principles [#object-self-healing-principles]\n\n### Verification and Erasure Coding [#verification-and-erasure-coding]\n\nDuring object write phase, RustFS splits objects into *k* data shards and *m* redundant shards, distributed across *n=k+m* block devices according to specified erasure parameters. During reads, if shard corruption or loss is detected, reconstruction can be performed from other intact shards.\n\n### Data Verification and Repair (Scrub & Repair) [#data-verification-and-repair-scrub--repair]\n\nRustFS periodically performs lightweight verification (light scrub) and deep verification (deep scrub) on storage pools:\n\n* **Lightweight Verification**: Compares object metadata and shard sizes, marking corruption when discovered.\n* **Deep Verification**: Reads shard data bit by bit and verifies checksums, detecting and repairing hidden bad blocks or bit rot issues.\n\nWhen data scanning discovers inconsistencies, RustFS automatically calls the Repair process, reconstructing corrupted shards using redundant shards, and writes repaired shards back to original disks or backup disks, ensuring data integrity for next access.\n\n## Self-Healing Process [#self-healing-process]\n\n### Online Self-Healing During Reads [#online-self-healing-during-reads]\n\nWhen a client executes a `GET` or `HEAD` request, RustFS reads the data shards required to serve the object (a read quorum, not every shard):\n\n1. If enough shards are intact, data is returned directly.\n2. If shards are lost or corrupted, the system reconstructs the missing shards from parity shards, repairs them, then returns the complete object to the client.\n   This enables transparent data repair without affecting client requests.\n\n### Background Scanning Self-Healing [#background-scanning-self-healing]\n\nRustFS has a built-in object scanner that traverses 1/1024 of objects in the storage pool using hash methods for integrity checks:\n\n* Object scanner runs lightweight verification periodically (configurable frequency);\n* If corruption is discovered, self-healing reconstruction process is immediately triggered.\n  Deep bit-rot verification runs on its own cycle (30 days by default) and can be tuned or disabled to trade thoroughness against resource overhead.\n\n### Manual Trigger Self-Healing [#manual-trigger-self-healing]\n\nAdministrators can trigger a full heal through the RustFS Console or the admin API. A full heal scans the entire storage pool and performs complete verification and repair on all objects, consuming significant resources, so it should be used cautiously during low-peak periods.\n\n## Summary [#summary]\n\nRustFS's object self-healing combines mature designs from systems like MinIO, Ceph, and ZFS. Through multi-level triggered verification and repair processes, it can effectively handle shard corruption, disk failures, and bit rot issues in both single-machine multi-disk and multi-machine multi-disk environments, ensuring high reliability and high availability of object storage.\n";
var structuredData = {
	"contents": [
		{
			"heading": "erasure-coded-storage-pools",
			"content": "RustFS organizes disks — on a single node or across nodes — into erasure-set storage pools. Each object is split into data shards and parity shards when written, and distributed across different disks (and nodes) to improve reliability and performance."
		},
		{
			"heading": "self-healing-design-principles",
			"content": "**Data Integrity Verification**: Combines checksum mechanisms to ensure object shard data consistency during reads, for example, ZFS validates each data block's checksum during reads and repairs when validation fails."
		},
		{
			"heading": "self-healing-design-principles",
			"content": "**Shard Redundancy and Erasure Coding**: Generates redundant shards through erasure coding. When some data shards are lost or corrupted, original objects can be reconstructed using redundant shards."
		},
		{
			"heading": "self-healing-design-principles",
			"content": "**Multi-Level Self-Healing Triggers**: Includes online self-healing during reads, background scanning self-healing, and manual trigger self-healing to balance performance and data reliability."
		},
		{
			"heading": "verification-and-erasure-coding",
			"content": "During object write phase, RustFS splits objects into *k* data shards and *m* redundant shards, distributed across *n=k+m* block devices according to specified erasure parameters. During reads, if shard corruption or loss is detected, reconstruction can be performed from other intact shards."
		},
		{
			"heading": "data-verification-and-repair-scrub--repair",
			"content": "RustFS periodically performs lightweight verification (light scrub) and deep verification (deep scrub) on storage pools:"
		},
		{
			"heading": "data-verification-and-repair-scrub--repair",
			"content": "**Lightweight Verification**: Compares object metadata and shard sizes, marking corruption when discovered."
		},
		{
			"heading": "data-verification-and-repair-scrub--repair",
			"content": "**Deep Verification**: Reads shard data bit by bit and verifies checksums, detecting and repairing hidden bad blocks or bit rot issues."
		},
		{
			"heading": "data-verification-and-repair-scrub--repair",
			"content": "When data scanning discovers inconsistencies, RustFS automatically calls the Repair process, reconstructing corrupted shards using redundant shards, and writes repaired shards back to original disks or backup disks, ensuring data integrity for next access."
		},
		{
			"heading": "online-self-healing-during-reads",
			"content": "When a client executes a `GET` or `HEAD` request, RustFS reads the data shards required to serve the object (a read quorum, not every shard):"
		},
		{
			"heading": "online-self-healing-during-reads",
			"content": "If enough shards are intact, data is returned directly."
		},
		{
			"heading": "online-self-healing-during-reads",
			"content": "If shards are lost or corrupted, the system reconstructs the missing shards from parity shards, repairs them, then returns the complete object to the client.\nThis enables transparent data repair without affecting client requests."
		},
		{
			"heading": "background-scanning-self-healing",
			"content": "RustFS has a built-in object scanner that traverses 1/1024 of objects in the storage pool using hash methods for integrity checks:"
		},
		{
			"heading": "background-scanning-self-healing",
			"content": "Object scanner runs lightweight verification periodically (configurable frequency);"
		},
		{
			"heading": "background-scanning-self-healing",
			"content": "If corruption is discovered, self-healing reconstruction process is immediately triggered.\nDeep bit-rot verification runs on its own cycle (30 days by default) and can be tuned or disabled to trade thoroughness against resource overhead."
		},
		{
			"heading": "manual-trigger-self-healing",
			"content": "Administrators can trigger a full heal through the RustFS Console or the admin API. A full heal scans the entire storage pool and performs complete verification and repair on all objects, consuming significant resources, so it should be used cautiously during low-peak periods."
		},
		{
			"heading": "summary",
			"content": "RustFS's object self-healing combines mature designs from systems like MinIO, Ceph, and ZFS. Through multi-level triggered verification and repair processes, it can effectively handle shard corruption, disk failures, and bit rot issues in both single-machine multi-disk and multi-machine multi-disk environments, ensuring high reliability and high availability of object storage."
		}
	],
	"headings": [
		{
			"id": "rustfs-architecture-and-self-healing-design",
			"content": "RustFS Architecture and Self-Healing Design"
		},
		{
			"id": "erasure-coded-storage-pools",
			"content": "Erasure-Coded Storage Pools"
		},
		{
			"id": "self-healing-design-principles",
			"content": "Self-Healing Design Principles"
		},
		{
			"id": "object-self-healing-principles",
			"content": "Object Self-Healing Principles"
		},
		{
			"id": "verification-and-erasure-coding",
			"content": "Verification and Erasure Coding"
		},
		{
			"id": "data-verification-and-repair-scrub--repair",
			"content": "Data Verification and Repair (Scrub & Repair)"
		},
		{
			"id": "self-healing-process",
			"content": "Self-Healing Process"
		},
		{
			"id": "online-self-healing-during-reads",
			"content": "Online Self-Healing During Reads"
		},
		{
			"id": "background-scanning-self-healing",
			"content": "Background Scanning Self-Healing"
		},
		{
			"id": "manual-trigger-self-healing",
			"content": "Manual Trigger Self-Healing"
		},
		{
			"id": "summary",
			"content": "Summary"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#rustfs-architecture-and-self-healing-design",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS Architecture and Self-Healing Design" })
	},
	{
		depth: 3,
		url: "#erasure-coded-storage-pools",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Erasure-Coded Storage Pools" })
	},
	{
		depth: 3,
		url: "#self-healing-design-principles",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Self-Healing Design Principles" })
	},
	{
		depth: 2,
		url: "#object-self-healing-principles",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Object Self-Healing Principles" })
	},
	{
		depth: 3,
		url: "#verification-and-erasure-coding",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Verification and Erasure Coding" })
	},
	{
		depth: 3,
		url: "#data-verification-and-repair-scrub--repair",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Data Verification and Repair (Scrub & Repair)" })
	},
	{
		depth: 2,
		url: "#self-healing-process",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Self-Healing Process" })
	},
	{
		depth: 3,
		url: "#online-self-healing-during-reads",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Online Self-Healing During Reads" })
	},
	{
		depth: 3,
		url: "#background-scanning-self-healing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Background Scanning Self-Healing" })
	},
	{
		depth: 3,
		url: "#manual-trigger-self-healing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Manual Trigger Self-Healing" })
	},
	{
		depth: 2,
		url: "#summary",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Summary" })
	}
];
function _createMdxContent(props) {
	const _components = {
		code: "code",
		em: "em",
		h2: "h2",
		h3: "h3",
		li: "li",
		ol: "ol",
		p: "p",
		strong: "strong",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-architecture-and-self-healing-design",
			children: "RustFS Architecture and Self-Healing Design"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "erasure-coded-storage-pools",
			children: "Erasure-Coded Storage Pools"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS organizes disks — on a single node or across nodes — into erasure-set storage pools. Each object is split into data shards and parity shards when written, and distributed across different disks (and nodes) to improve reliability and performance." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "self-healing-design-principles",
			children: "Self-Healing Design Principles"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Data Integrity Verification" }), ": Combines checksum mechanisms to ensure object shard data consistency during reads, for example, ZFS validates each data block's checksum during reads and repairs when validation fails."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Shard Redundancy and Erasure Coding" }), ": Generates redundant shards through erasure coding. When some data shards are lost or corrupted, original objects can be reconstructed using redundant shards."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Multi-Level Self-Healing Triggers" }), ": Includes online self-healing during reads, background scanning self-healing, and manual trigger self-healing to balance performance and data reliability."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "object-self-healing-principles",
			children: "Object Self-Healing Principles"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "verification-and-erasure-coding",
			children: "Verification and Erasure Coding"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"During object write phase, RustFS splits objects into ",
			(0, import_jsx_runtime_react_server.jsx)(_components.em, { children: "k" }),
			" data shards and ",
			(0, import_jsx_runtime_react_server.jsx)(_components.em, { children: "m" }),
			" redundant shards, distributed across ",
			(0, import_jsx_runtime_react_server.jsx)(_components.em, { children: "n=k+m" }),
			" block devices according to specified erasure parameters. During reads, if shard corruption or loss is detected, reconstruction can be performed from other intact shards."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "data-verification-and-repair-scrub--repair",
			children: "Data Verification and Repair (Scrub & Repair)"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS periodically performs lightweight verification (light scrub) and deep verification (deep scrub) on storage pools:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Lightweight Verification" }), ": Compares object metadata and shard sizes, marking corruption when discovered."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Deep Verification" }), ": Reads shard data bit by bit and verifies checksums, detecting and repairing hidden bad blocks or bit rot issues."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When data scanning discovers inconsistencies, RustFS automatically calls the Repair process, reconstructing corrupted shards using redundant shards, and writes repaired shards back to original disks or backup disks, ensuring data integrity for next access." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "self-healing-process",
			children: "Self-Healing Process"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "online-self-healing-during-reads",
			children: "Online Self-Healing During Reads"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"When a client executes a ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "GET" }),
			" or ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "HEAD" }),
			" request, RustFS reads the data shards required to serve the object (a read quorum, not every shard):"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "If enough shards are intact, data is returned directly." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "If shards are lost or corrupted, the system reconstructs the missing shards from parity shards, repairs them, then returns the complete object to the client.\nThis enables transparent data repair without affecting client requests." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "background-scanning-self-healing",
			children: "Background Scanning Self-Healing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS has a built-in object scanner that traverses 1/1024 of objects in the storage pool using hash methods for integrity checks:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Object scanner runs lightweight verification periodically (configurable frequency);" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "If corruption is discovered, self-healing reconstruction process is immediately triggered.\nDeep bit-rot verification runs on its own cycle (30 days by default) and can be tuned or disabled to trade thoroughness against resource overhead." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "manual-trigger-self-healing",
			children: "Manual Trigger Self-Healing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Administrators can trigger a full heal through the RustFS Console or the admin API. A full heal scans the entire storage pool and performs complete verification and repair on all objects, consuming significant resources, so it should be used cautiously during low-peak periods." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "summary",
			children: "Summary"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS's object self-healing combines mature designs from systems like MinIO, Ceph, and ZFS. Through multi-level triggered verification and repair processes, it can effectively handle shard corruption, disk failures, and bit rot issues in both single-machine multi-disk and multi-machine multi-disk environments, ensuring high reliability and high availability of object storage." })
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
