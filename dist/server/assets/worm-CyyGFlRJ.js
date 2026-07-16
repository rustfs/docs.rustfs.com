import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/worm/index.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Object Immutability",
	"description": "Retention rules enforce WORM protection. Retention policies specify the retention period set on object versions, either explicitly or through bucket default…"
};
var _markdown = "\n\n## Object Retention [#object-retention]\n\nRetention rules enforce WORM protection. Retention policies specify the retention period set on object versions, either explicitly or through bucket default settings. Default lock configurations apply to subsequently created objects.\n\nWhen using bucket default settings, a duration in days or years defines the protection period. New objects inherit this duration.\n\nRetention periods can be explicitly set for object versions. Explicit retention periods specify a \"retain until date\".\n\nAfter the retention period expires, the object version can be deleted unless a legal hold is active.\n\nExplicit retention mode settings override default bucket settings.\n\nRetention periods can be extended by submitting a new lock request.\n\n## Governance Mode [#governance-mode]\n\nGovernance mode prevents objects from being deleted by standard users. Users with special permissions (e.g., `s3:BypassGovernanceRetention`) can modify retention settings or delete objects.\n\n## Compliance Mode [#compliance-mode]\n\nCompliance mode ensures that no one (including the root user) can delete objects during the retention period.\n\n## Legal Hold [#legal-hold]\n\nLegal hold provides indefinite WORM protection without an expiration date. It can only be removed by authorized users.\n\nWhen objects have retention or legal hold policies, they continue to be versioned. Replication operations do not transfer retention and legal hold settings.\n\n## RustFS Data Immutability Meets Cohasset Certification Standards [#rustfs-data-immutability-meets-cohasset-certification-standards]\n\nRustFS meets Cohasset Associates standards for object locking, retention, and legal hold, including SEC Rule 17a-4(f), FINRA Rule 4511, and CFTC Regulation 1.31.\n\nDownload the Cohasset Associates report for details on configuring RustFS to meet regulatory requirements.\n";
var structuredData = {
	"contents": [
		{
			"heading": "object-retention",
			"content": "Retention rules enforce WORM protection. Retention policies specify the retention period set on object versions, either explicitly or through bucket default settings. Default lock configurations apply to subsequently created objects."
		},
		{
			"heading": "object-retention",
			"content": "When using bucket default settings, a duration in days or years defines the protection period. New objects inherit this duration."
		},
		{
			"heading": "object-retention",
			"content": "Retention periods can be explicitly set for object versions. Explicit retention periods specify a \"retain until date\"."
		},
		{
			"heading": "object-retention",
			"content": "After the retention period expires, the object version can be deleted unless a legal hold is active."
		},
		{
			"heading": "object-retention",
			"content": "Explicit retention mode settings override default bucket settings."
		},
		{
			"heading": "object-retention",
			"content": "Retention periods can be extended by submitting a new lock request."
		},
		{
			"heading": "governance-mode",
			"content": "Governance mode prevents objects from being deleted by standard users. Users with special permissions (e.g., `s3:BypassGovernanceRetention`) can modify retention settings or delete objects."
		},
		{
			"heading": "compliance-mode",
			"content": "Compliance mode ensures that no one (including the root user) can delete objects during the retention period."
		},
		{
			"heading": "legal-hold",
			"content": "Legal hold provides indefinite WORM protection without an expiration date. It can only be removed by authorized users."
		},
		{
			"heading": "legal-hold",
			"content": "When objects have retention or legal hold policies, they continue to be versioned. Replication operations do not transfer retention and legal hold settings."
		},
		{
			"heading": "rustfs-data-immutability-meets-cohasset-certification-standards",
			"content": "RustFS meets Cohasset Associates standards for object locking, retention, and legal hold, including SEC Rule 17a-4(f), FINRA Rule 4511, and CFTC Regulation 1.31."
		},
		{
			"heading": "rustfs-data-immutability-meets-cohasset-certification-standards",
			"content": "Download the Cohasset Associates report for details on configuring RustFS to meet regulatory requirements."
		}
	],
	"headings": [
		{
			"id": "object-retention",
			"content": "Object Retention"
		},
		{
			"id": "governance-mode",
			"content": "Governance Mode"
		},
		{
			"id": "compliance-mode",
			"content": "Compliance Mode"
		},
		{
			"id": "legal-hold",
			"content": "Legal Hold"
		},
		{
			"id": "rustfs-data-immutability-meets-cohasset-certification-standards",
			"content": "RustFS Data Immutability Meets Cohasset Certification Standards"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#object-retention",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Object Retention" })
	},
	{
		depth: 2,
		url: "#governance-mode",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Governance Mode" })
	},
	{
		depth: 2,
		url: "#compliance-mode",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Compliance Mode" })
	},
	{
		depth: 2,
		url: "#legal-hold",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Legal Hold" })
	},
	{
		depth: 2,
		url: "#rustfs-data-immutability-meets-cohasset-certification-standards",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS Data Immutability Meets Cohasset Certification Standards" })
	}
];
function _createMdxContent(props) {
	const _components = {
		code: "code",
		h2: "h2",
		p: "p",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "object-retention",
			children: "Object Retention"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Retention rules enforce WORM protection. Retention policies specify the retention period set on object versions, either explicitly or through bucket default settings. Default lock configurations apply to subsequently created objects." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When using bucket default settings, a duration in days or years defines the protection period. New objects inherit this duration." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Retention periods can be explicitly set for object versions. Explicit retention periods specify a \"retain until date\"." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "After the retention period expires, the object version can be deleted unless a legal hold is active." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Explicit retention mode settings override default bucket settings." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Retention periods can be extended by submitting a new lock request." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "governance-mode",
			children: "Governance Mode"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
			"Governance mode prevents objects from being deleted by standard users. Users with special permissions (e.g., ",
			(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "s3:BypassGovernanceRetention" }),
			") can modify retention settings or delete objects."
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "compliance-mode",
			children: "Compliance Mode"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Compliance mode ensures that no one (including the root user) can delete objects during the retention period." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "legal-hold",
			children: "Legal Hold"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Legal hold provides indefinite WORM protection without an expiration date. It can only be removed by authorized users." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When objects have retention or legal hold policies, they continue to be versioned. Replication operations do not transfer retention and legal hold settings." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-data-immutability-meets-cohasset-certification-standards",
			children: "RustFS Data Immutability Meets Cohasset Certification Standards"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS meets Cohasset Associates standards for object locking, retention, and legal hold, including SEC Rule 17a-4(f), FINRA Rule 4511, and CFTC Regulation 1.31." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Download the Cohasset Associates report for details on configuring RustFS to meet regulatory requirements." })
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
