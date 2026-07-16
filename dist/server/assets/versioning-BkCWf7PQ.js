import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/versioning/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Bucket and Object Versioning",
	"description": "Object-level versioning improves data protection. Versioning serves as the foundation for object locking, immutability, tiering, and lifecycle management."
};
var _markdown = "\n\n## RustFS Object Storage Provides AWS S3 Versioning Compatibility [#rustfs-object-storage-provides-aws-s3-versioning-compatibility]\n\nObject-level versioning improves data protection. Versioning serves as the foundation for object locking, immutability, tiering, and lifecycle management.\n\nRustFS implements S3-compatible versioning. RustFS assigns a unique ID to each version of an object. Applications can specify a version ID to access a point-in-time snapshot.\n\nVersioning allows users to preserve multiple variants of an object in the same bucket, enabling retrieval and restoration of every version.\n\nVersioning is enabled at the bucket level. Once enabled, RustFS automatically creates a unique version ID for objects.\n\nVersioning prevents accidental overwrites and deletions. When a versioned object is deleted, a delete marker is created. The object can be restored by deleting the delete marker.\n\nIf a versioned object is overwritten, RustFS creates a new version. Old versions can be restored as needed.\n\n## RustFS Supports Object Versioning with Three Different Bucket States [#rustfs-supports-object-versioning-with-three-different-bucket-states]\n\n<Mermaid\n  chart=\"stateDiagram-v2\n    direction LR\n    state &#x22;Versioning Not Enabled&#x22; as Unversioned\n    state &#x22;Versioning Enabled&#x22; as Enabled\n    state &#x22;Versioning Suspended&#x22; as Suspended\n\n    [*] --> Unversioned\n    Unversioned --> Enabled: Enable\n    Enabled --> Suspended: Suspend\n    Suspended --> Enabled: Re-enable\"\n/>\n\nVersioning can be suspended but not disabled once enabled. Versioning is a global setting in the bucket.\n\nUsers with appropriate permissions can suspend versioning to stop accumulating object versions.\n\nManage versioning via Console, CLI (`mc`), or SDK.\n\nVersioning increases bucket size and may create object dependencies. Mitigate these factors through lifecycle management.\n\n## Features [#features]\n\n* **Bucket Replication** (Active-Active, Active-Passive)\n* **`mc undo`**: Rollback PUT/DELETE objects.\n* **Object Lock**\n* **Continuous Data Protection (CDP)**\n* **`mc rewind`**: View buckets or objects at any point in time.\n\n## Architecture [#architecture]\n\n<Mermaid\n  chart=\"flowchart LR\n    CLOUD([&#x22;Internet Cloud&#x22;]) --> GLB[&#x22;Global Load Balancer&#x22;]\n    GLB --> S1\n    GLB --> S2\n    GLB --> SN\n    subgraph S1[&#x22;Site 1 · US-WEST&#x22;]\n        A1[&#x22;Zone 1 · Erasure Sets 1-n&#x22;]\n        A2[&#x22;Zone 2 · Erasure Sets 1-n&#x22;]\n        A3[&#x22;Zone n · Erasure Sets 1-n&#x22;]\n    end\n    subgraph S2[&#x22;Site 2 · US-EAST&#x22;]\n        B1[&#x22;Zone 1 · Erasure Sets 1-n&#x22;]\n        B2[&#x22;Zone 2 · Erasure Sets 1-n&#x22;]\n        B3[&#x22;Zone n · Erasure Sets 1-n&#x22;]\n    end\n    subgraph SN[&#x22;Site n · EU-CENTRAL&#x22;]\n        D1[&#x22;Zone 1 · Erasure Sets 1-n&#x22;]\n        D2[&#x22;Zone 2 · Erasure Sets 1-n&#x22;]\n        D3[&#x22;Zone n · Erasure Sets 1-n&#x22;]\n    end\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    class CLOUD svc\n    class GLB accent\n    class A1,A2,A3,B1,B2,B3,D1,D2,D3 store\"\n/>\n\n### System Requirements [#system-requirements]\n\n> Versioning requires: Erasure coding and at least four disks.\n\n### Versioning States [#versioning-states]\n\nRustFS supports three different bucket versioning states:\n\n1. **🔴 Unversioned** - Default state, no versioning performed\n2. **🟢 Enabled** - Full versioning functionality, assigns unique ID to each object version\n3. **🟡 Suspended** - Stops accumulating new versions but retains existing versions\n\n### Key Features [#key-features]\n\n* 🆔 **Unique Version ID** - Each object version has a unique identifier\n* 🔄 **Point-in-Time Recovery** - Can access any historical version of an object\n* 🛡️ **Delete Protection** - Uses delete markers to prevent accidental deletion\n* 📊 **Lifecycle Management** - Automatically manages version count and storage costs\n* 🔐 **Permission Control** - Fine-grained access permission management\n";
var structuredData = {
	"contents": [
		{
			"heading": "rustfs-object-storage-provides-aws-s3-versioning-compatibility",
			"content": "Object-level versioning improves data protection. Versioning serves as the foundation for object locking, immutability, tiering, and lifecycle management."
		},
		{
			"heading": "rustfs-object-storage-provides-aws-s3-versioning-compatibility",
			"content": "RustFS implements S3-compatible versioning. RustFS assigns a unique ID to each version of an object. Applications can specify a version ID to access a point-in-time snapshot."
		},
		{
			"heading": "rustfs-object-storage-provides-aws-s3-versioning-compatibility",
			"content": "Versioning allows users to preserve multiple variants of an object in the same bucket, enabling retrieval and restoration of every version."
		},
		{
			"heading": "rustfs-object-storage-provides-aws-s3-versioning-compatibility",
			"content": "Versioning is enabled at the bucket level. Once enabled, RustFS automatically creates a unique version ID for objects."
		},
		{
			"heading": "rustfs-object-storage-provides-aws-s3-versioning-compatibility",
			"content": "Versioning prevents accidental overwrites and deletions. When a versioned object is deleted, a delete marker is created. The object can be restored by deleting the delete marker."
		},
		{
			"heading": "rustfs-object-storage-provides-aws-s3-versioning-compatibility",
			"content": "If a versioned object is overwritten, RustFS creates a new version. Old versions can be restored as needed."
		},
		{
			"heading": "rustfs-supports-object-versioning-with-three-different-bucket-states",
			"content": "Versioning can be suspended but not disabled once enabled. Versioning is a global setting in the bucket."
		},
		{
			"heading": "rustfs-supports-object-versioning-with-three-different-bucket-states",
			"content": "Users with appropriate permissions can suspend versioning to stop accumulating object versions."
		},
		{
			"heading": "rustfs-supports-object-versioning-with-three-different-bucket-states",
			"content": "Manage versioning via Console, CLI (`mc`), or SDK."
		},
		{
			"heading": "rustfs-supports-object-versioning-with-three-different-bucket-states",
			"content": "Versioning increases bucket size and may create object dependencies. Mitigate these factors through lifecycle management."
		},
		{
			"heading": "features",
			"content": "**Bucket Replication** (Active-Active, Active-Passive)"
		},
		{
			"heading": "features",
			"content": "**`mc undo`**: Rollback PUT/DELETE objects."
		},
		{
			"heading": "features",
			"content": "**Object Lock**"
		},
		{
			"heading": "features",
			"content": "**Continuous Data Protection (CDP)**"
		},
		{
			"heading": "features",
			"content": "**`mc rewind`**: View buckets or objects at any point in time."
		},
		{
			"heading": "system-requirements",
			"content": "> Versioning requires: Erasure coding and at least four disks."
		},
		{
			"heading": "versioning-states",
			"content": "RustFS supports three different bucket versioning states:"
		},
		{
			"heading": "versioning-states",
			"content": "**🔴 Unversioned** - Default state, no versioning performed"
		},
		{
			"heading": "versioning-states",
			"content": "**🟢 Enabled** - Full versioning functionality, assigns unique ID to each object version"
		},
		{
			"heading": "versioning-states",
			"content": "**🟡 Suspended** - Stops accumulating new versions but retains existing versions"
		},
		{
			"heading": "key-features",
			"content": "🆔 **Unique Version ID** - Each object version has a unique identifier"
		},
		{
			"heading": "key-features",
			"content": "🔄 **Point-in-Time Recovery** - Can access any historical version of an object"
		},
		{
			"heading": "key-features",
			"content": "🛡️ **Delete Protection** - Uses delete markers to prevent accidental deletion"
		},
		{
			"heading": "key-features",
			"content": "📊 **Lifecycle Management** - Automatically manages version count and storage costs"
		},
		{
			"heading": "key-features",
			"content": "🔐 **Permission Control** - Fine-grained access permission management"
		}
	],
	"headings": [
		{
			"id": "rustfs-object-storage-provides-aws-s3-versioning-compatibility",
			"content": "RustFS Object Storage Provides AWS S3 Versioning Compatibility"
		},
		{
			"id": "rustfs-supports-object-versioning-with-three-different-bucket-states",
			"content": "RustFS Supports Object Versioning with Three Different Bucket States"
		},
		{
			"id": "features",
			"content": "Features"
		},
		{
			"id": "architecture",
			"content": "Architecture"
		},
		{
			"id": "system-requirements",
			"content": "System Requirements"
		},
		{
			"id": "versioning-states",
			"content": "Versioning States"
		},
		{
			"id": "key-features",
			"content": "Key Features"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#rustfs-object-storage-provides-aws-s3-versioning-compatibility",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS Object Storage Provides AWS S3 Versioning Compatibility" })
	},
	{
		depth: 2,
		url: "#rustfs-supports-object-versioning-with-three-different-bucket-states",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS Supports Object Versioning with Three Different Bucket States" })
	},
	{
		depth: 2,
		url: "#features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Features" })
	},
	{
		depth: 2,
		url: "#architecture",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Architecture" })
	},
	{
		depth: 3,
		url: "#system-requirements",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "System Requirements" })
	},
	{
		depth: 3,
		url: "#versioning-states",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Versioning States" })
	},
	{
		depth: 3,
		url: "#key-features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Key Features" })
	}
];
function _createMdxContent(props) {
	const _components = {
		blockquote: "blockquote",
		code: "code",
		h2: "h2",
		h3: "h3",
		li: "li",
		ol: "ol",
		p: "p",
		strong: "strong",
		ul: "ul",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-object-storage-provides-aws-s3-versioning-compatibility",
			children: "RustFS Object Storage Provides AWS S3 Versioning Compatibility"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Object-level versioning improves data protection. Versioning serves as the foundation for object locking, immutability, tiering, and lifecycle management." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS implements S3-compatible versioning. RustFS assigns a unique ID to each version of an object. Applications can specify a version ID to access a point-in-time snapshot." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Versioning allows users to preserve multiple variants of an object in the same bucket, enabling retrieval and restoration of every version." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Versioning is enabled at the bucket level. Once enabled, RustFS automatically creates a unique version ID for objects." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Versioning prevents accidental overwrites and deletions. When a versioned object is deleted, a delete marker is created. The object can be restored by deleting the delete marker." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "If a versioned object is overwritten, RustFS creates a new version. Old versions can be restored as needed." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-supports-object-versioning-with-three-different-bucket-states",
			children: "RustFS Supports Object Versioning with Three Different Bucket States"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "stateDiagram-v2\n    direction LR\n    state \"Versioning Not Enabled\" as Unversioned\n    state \"Versioning Enabled\" as Enabled\n    state \"Versioning Suspended\" as Suspended\n\n    [*] --> Unversioned\n    Unversioned --> Enabled: Enable\n    Enabled --> Suspended: Suspend\n    Suspended --> Enabled: Re-enable" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Versioning can be suspended but not disabled once enabled. Versioning is a global setting in the bucket." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Users with appropriate permissions can suspend versioning to stop accumulating object versions." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Manage versioning via Console, CLI (",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "mc" }),
			"), or SDK."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Versioning increases bucket size and may create object dependencies. Mitigate these factors through lifecycle management." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "features",
			children: "Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Bucket Replication" }), " (Active-Active, Active-Passive)"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "mc undo" }) }), ": Rollback PUT/DELETE objects."] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Object Lock" }) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Continuous Data Protection (CDP)" }) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: (0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "mc rewind" }) }), ": View buckets or objects at any point in time."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "architecture",
			children: "Architecture"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n    CLOUD([\"Internet Cloud\"]) --> GLB[\"Global Load Balancer\"]\n    GLB --> S1\n    GLB --> S2\n    GLB --> SN\n    subgraph S1[\"Site 1 · US-WEST\"]\n        A1[\"Zone 1 · Erasure Sets 1-n\"]\n        A2[\"Zone 2 · Erasure Sets 1-n\"]\n        A3[\"Zone n · Erasure Sets 1-n\"]\n    end\n    subgraph S2[\"Site 2 · US-EAST\"]\n        B1[\"Zone 1 · Erasure Sets 1-n\"]\n        B2[\"Zone 2 · Erasure Sets 1-n\"]\n        B3[\"Zone n · Erasure Sets 1-n\"]\n    end\n    subgraph SN[\"Site n · EU-CENTRAL\"]\n        D1[\"Zone 1 · Erasure Sets 1-n\"]\n        D2[\"Zone 2 · Erasure Sets 1-n\"]\n        D3[\"Zone n · Erasure Sets 1-n\"]\n    end\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n    class CLOUD svc\n    class GLB accent\n    class A1,A2,A3,B1,B2,B3,D1,D2,D3 store" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "system-requirements",
			children: "System Requirements"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Versioning requires: Erasure coding and at least four disks." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "versioning-states",
			children: "Versioning States"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports three different bucket versioning states:" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "🔴 Unversioned" }), " - Default state, no versioning performed"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "🟢 Enabled" }), " - Full versioning functionality, assigns unique ID to each object version"] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "🟡 Suspended" }), " - Stops accumulating new versions but retains existing versions"] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "key-features",
			children: "Key Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"🆔 ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Unique Version ID" }),
				" - Each object version has a unique identifier"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"🔄 ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Point-in-Time Recovery" }),
				" - Can access any historical version of an object"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"🛡️ ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Delete Protection" }),
				" - Uses delete markers to prevent accidental deletion"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"📊 ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Lifecycle Management" }),
				" - Automatically manages version count and storage costs"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"🔐 ",
				(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Permission Control" }),
				" - Fine-grained access permission management"
			] }),
			"\n"
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
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
export { _markdown, MDXContent as default, frontmatter, structuredData, toc };
