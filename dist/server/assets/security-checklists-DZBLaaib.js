import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/installation/checklists/security-checklists.md?collection=docs
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var frontmatter = {
	"title": "Security Checklist",
	"description": "Security checklist for enterprise deployments."
};
var _markdown = "\n\n> Security best practices for RustFS. Review this checklist during deployment to ensure system security and reliability.\n\n## Authentication & Access Control [#authentication--access-control]\n\n* **Use S3-Compatible Key Authentication**\n  RustFS uses AWS Signature V4. Ensure all requests are authenticated with valid Access Keys and Secret Keys.\n\n* **Policy-Based Access Control**\n  Define access policies based on the principle of least privilege. Explicitly define allowed operations; deny all others by default.\n\n## Encryption (TLS/SSL) [#encryption-tlsssl]\n\n* **Enable TLS/SSL**\n  Configure valid SSL certificates. We recommend using different certificates for external and internal access, and enforcing TLS 1.2+.\n\n* **Certificate Management**\n  Use certificates from trusted CAs. Protect private keys with strict file permissions.\n\n* **Multi-Domain and Cipher Suites**\n  Configure independent certificates for multiple domains. Use strong encryption algorithms (e.g., 2048-bit RSA or 256-bit ECC).\n\n## Credential Protection [#credential-protection]\n\n* **Change Default Credentials**\n  Never keep the example placeholders (`<your-access-key>` / `<your-secret-key>`) in production. Set a unique access key and a strong, random secret — e.g. generate one with `openssl rand -base64 24` — immediately after initialization.\n\n* **Secure Storage**\n  Do not hardcode credentials. Use environment variables or secrets management systems (e.g., Kubernetes Secrets).\n\n## Logging & Auditing [#logging--auditing]\n\n* **Enable Audit Logs**\n  Export audit logs to external systems (HTTP Webhook, Kafka, ELK, Splunk).\n\n* **Log Collection**\n  Collect logs using standard tools (systemd, Docker, K8s) and analyze with ELK or Grafana Loki.\n\n* **Monitoring and Alerts**\n  Set alerts for abnormal behavior (login failures, unusual access patterns, mass deletions).\n\n* **Observability**\n  Monitor function execution times to optimize performance.\n\n## API Security [#api-security]\n\n* **Restrict Network Access**\n  Restrict access to the S3 API (port 9000) and Console (port 9001) using firewalls or security groups.\n\n* **Network Isolation**\n  Use reverse proxies (e.g., Nginx) instead of exposing storage nodes directly.\n\n* **Close Unnecessary Ports**\n  Disable unused ports and do not expose management interfaces to the public internet.\n\n## WORM Compliance [#worm-compliance]\n\n* **Version Control and Object Locking**\n  Enable versioning and object locking to meet regulatory requirements.\n\n## Updates [#updates]\n\n* **Apply Patches**\n  Regularly check for and apply RustFS updates.\n\n* **Non-Disruptive Upgrades**\n  Use the rolling restart process for zero-downtime upgrades.\n\n* **OS and Dependencies**\n  Keep the operating system and dependencies (e.g., OpenSSL) updated.\n\n***\n\nReview this checklist regularly to maintain a secure RustFS deployment.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "> Security best practices for RustFS. Review this checklist during deployment to ensure system security and reliability."
		},
		{
			"heading": "authentication--access-control",
			"content": "**Use S3-Compatible Key Authentication**\nRustFS uses AWS Signature V4. Ensure all requests are authenticated with valid Access Keys and Secret Keys."
		},
		{
			"heading": "authentication--access-control",
			"content": "**Policy-Based Access Control**\nDefine access policies based on the principle of least privilege. Explicitly define allowed operations; deny all others by default."
		},
		{
			"heading": "encryption-tlsssl",
			"content": "**Enable TLS/SSL**\nConfigure valid SSL certificates. We recommend using different certificates for external and internal access, and enforcing TLS 1.2+."
		},
		{
			"heading": "encryption-tlsssl",
			"content": "**Certificate Management**\nUse certificates from trusted CAs. Protect private keys with strict file permissions."
		},
		{
			"heading": "encryption-tlsssl",
			"content": "**Multi-Domain and Cipher Suites**\nConfigure independent certificates for multiple domains. Use strong encryption algorithms (e.g., 2048-bit RSA or 256-bit ECC)."
		},
		{
			"heading": "credential-protection",
			"content": "**Change Default Credentials**\nNever keep the example placeholders (`<your-access-key>` / `<your-secret-key>`) in production. Set a unique access key and a strong, random secret — e.g. generate one with `openssl rand -base64 24` — immediately after initialization."
		},
		{
			"heading": "credential-protection",
			"content": "**Secure Storage**\nDo not hardcode credentials. Use environment variables or secrets management systems (e.g., Kubernetes Secrets)."
		},
		{
			"heading": "logging--auditing",
			"content": "**Enable Audit Logs**\nExport audit logs to external systems (HTTP Webhook, Kafka, ELK, Splunk)."
		},
		{
			"heading": "logging--auditing",
			"content": "**Log Collection**\nCollect logs using standard tools (systemd, Docker, K8s) and analyze with ELK or Grafana Loki."
		},
		{
			"heading": "logging--auditing",
			"content": "**Monitoring and Alerts**\nSet alerts for abnormal behavior (login failures, unusual access patterns, mass deletions)."
		},
		{
			"heading": "logging--auditing",
			"content": "**Observability**\nMonitor function execution times to optimize performance."
		},
		{
			"heading": "api-security",
			"content": "**Restrict Network Access**\nRestrict access to the S3 API (port 9000) and Console (port 9001) using firewalls or security groups."
		},
		{
			"heading": "api-security",
			"content": "**Network Isolation**\nUse reverse proxies (e.g., Nginx) instead of exposing storage nodes directly."
		},
		{
			"heading": "api-security",
			"content": "**Close Unnecessary Ports**\nDisable unused ports and do not expose management interfaces to the public internet."
		},
		{
			"heading": "worm-compliance",
			"content": "**Version Control and Object Locking**\nEnable versioning and object locking to meet regulatory requirements."
		},
		{
			"heading": "updates",
			"content": "**Apply Patches**\nRegularly check for and apply RustFS updates."
		},
		{
			"heading": "updates",
			"content": "**Non-Disruptive Upgrades**\nUse the rolling restart process for zero-downtime upgrades."
		},
		{
			"heading": "updates",
			"content": "**OS and Dependencies**\nKeep the operating system and dependencies (e.g., OpenSSL) updated."
		},
		{
			"heading": "updates",
			"content": "Review this checklist regularly to maintain a secure RustFS deployment."
		}
	],
	"headings": [
		{
			"id": "authentication--access-control",
			"content": "Authentication & Access Control"
		},
		{
			"id": "encryption-tlsssl",
			"content": "Encryption (TLS/SSL)"
		},
		{
			"id": "credential-protection",
			"content": "Credential Protection"
		},
		{
			"id": "logging--auditing",
			"content": "Logging & Auditing"
		},
		{
			"id": "api-security",
			"content": "API Security"
		},
		{
			"id": "worm-compliance",
			"content": "WORM Compliance"
		},
		{
			"id": "updates",
			"content": "Updates"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#authentication--access-control",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Authentication & Access Control" })
	},
	{
		depth: 2,
		url: "#encryption-tlsssl",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Encryption (TLS/SSL)" })
	},
	{
		depth: 2,
		url: "#credential-protection",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Credential Protection" })
	},
	{
		depth: 2,
		url: "#logging--auditing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Logging & Auditing" })
	},
	{
		depth: 2,
		url: "#api-security",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "API Security" })
	},
	{
		depth: 2,
		url: "#worm-compliance",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "WORM Compliance" })
	},
	{
		depth: 2,
		url: "#updates",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Updates" })
	}
];
function _createMdxContent(props) {
	const _components = {
		blockquote: "blockquote",
		code: "code",
		h2: "h2",
		hr: "hr",
		li: "li",
		p: "p",
		strong: "strong",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsxs)(_components.blockquote, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Security best practices for RustFS. Review this checklist during deployment to ensure system security and reliability." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "authentication--access-control",
			children: "Authentication & Access Control"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Use S3-Compatible Key Authentication" }), "\nRustFS uses AWS Signature V4. Ensure all requests are authenticated with valid Access Keys and Secret Keys."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Policy-Based Access Control" }), "\nDefine access policies based on the principle of least privilege. Explicitly define allowed operations; deny all others by default."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "encryption-tlsssl",
			children: "Encryption (TLS/SSL)"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Enable TLS/SSL" }), "\nConfigure valid SSL certificates. We recommend using different certificates for external and internal access, and enforcing TLS 1.2+."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Certificate Management" }), "\nUse certificates from trusted CAs. Protect private keys with strict file permissions."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Multi-Domain and Cipher Suites" }), "\nConfigure independent certificates for multiple domains. Use strong encryption algorithms (e.g., 2048-bit RSA or 256-bit ECC)."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "credential-protection",
			children: "Credential Protection"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [
					(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Change Default Credentials" }),
					"\nNever keep the example placeholders (",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "<your-access-key>" }),
					" / ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "<your-secret-key>" }),
					") in production. Set a unique access key and a strong, random secret — e.g. generate one with ",
					(0, import_jsx_runtime_react_server.jsx)(_components.code, { children: "openssl rand -base64 24" }),
					" — immediately after initialization."
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Secure Storage" }), "\nDo not hardcode credentials. Use environment variables or secrets management systems (e.g., Kubernetes Secrets)."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "logging--auditing",
			children: "Logging & Auditing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Enable Audit Logs" }), "\nExport audit logs to external systems (HTTP Webhook, Kafka, ELK, Splunk)."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Log Collection" }), "\nCollect logs using standard tools (systemd, Docker, K8s) and analyze with ELK or Grafana Loki."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Monitoring and Alerts" }), "\nSet alerts for abnormal behavior (login failures, unusual access patterns, mass deletions)."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Observability" }), "\nMonitor function execution times to optimize performance."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "api-security",
			children: "API Security"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Restrict Network Access" }), "\nRestrict access to the S3 API (port 9000) and Console (port 9001) using firewalls or security groups."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Network Isolation" }), "\nUse reverse proxies (e.g., Nginx) instead of exposing storage nodes directly."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Close Unnecessary Ports" }), "\nDisable unused ports and do not expose management interfaces to the public internet."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "worm-compliance",
			children: "WORM Compliance"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Version Control and Object Locking" }), "\nEnable versioning and object locking to meet regulatory requirements."] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "updates",
			children: "Updates"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Apply Patches" }), "\nRegularly check for and apply RustFS updates."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Non-Disruptive Upgrades" }), "\nUse the rolling restart process for zero-downtime upgrades."] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime_react_server.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime_react_server.jsxs)(_components.p, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "OS and Dependencies" }), "\nKeep the operating system and dependencies (e.g., OpenSSL) updated."] }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.hr, {}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Review this checklist regularly to maintain a secure RustFS deployment." })
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
