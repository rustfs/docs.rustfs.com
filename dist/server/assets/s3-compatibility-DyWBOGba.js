import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/s3-compatibility/images/s1-4.png
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var s1_4_default = "/assets/s1-4-vDi-3WLw.png";
//#endregion
//#region content/features/s3-compatibility/index.md?collection=docs
var frontmatter = {
	"title": "Amazon S3 Compatibility",
	"description": "S3 compatibility is essential for cloud-native applications. RustFS strictly adheres to S3 API standards. RustFS offers a widely tested S3 alternative."
};
var _markdown = "\n\n\n\nS3 compatibility is essential for cloud-native applications. RustFS strictly adheres to S3 API standards. RustFS offers a widely tested S3 alternative.\n\n## RustFS and S3 API - Designed for Multi-Cloud Storage [#rustfs-and-s3-api---designed-for-multi-cloud-storage]\n\nRustFS prioritizes S3 compatibility. As an early adopter of the S3 API (V2 and V4), RustFS ensures compatibility across public cloud, private cloud, data center, multi-cloud, hybrid cloud, and edge environments.\n\n## S3 Enables Hybrid and Multi-Cloud Computing [#s3-enables-hybrid-and-multi-cloud-computing]\n\nS3 is the standard for multi-cloud compatibility. As a RESTful API standard, S3 facilitates interactions between applications, data, and infrastructure.\n\nKubernetes-native, S3-compatible object storage and applications can run anywhere - from public cloud instances (Google, Azure, AWS) to private clouds (Red Hat OpenShift, VMware Tanzu) and bare metal.\n\n## S3 Compatibility for Bare Metal Workloads [#s3-compatibility-for-bare-metal-workloads]\n\nPrivate cloud is a fundamental building block of hybrid cloud architecture. S3 compatibility is crucial for all applications, from analytics to archiving.\n\nWith RustFS, S3 compatibility is location-independent. RustFS bare metal instances have the same S3 compatibility and performance as public cloud or edge instances.\n\n## Advantages of RustFS Scalable Object Storage [#advantages-of-rustfs-scalable-object-storage]\n\nCloud-native applications use the S3 API to communicate with object storage. Many vendors only support a subset of functionality.\n\nRustFS has a proven track record of S3 compatibility. We test millions of hardware, software, and application combinations. RustFS releases software weekly, and community-reported defects are promptly addressed.\n\nComprehensive S3 API support means applications can leverage data stored in RustFS on any hardware, location, or cloud.\n\n## Core Features [#core-features]\n\n### S3 Select [#s3-select]\n\n<img alt=\"S3 Select\" src=\"__img0\" />\n\nS3 Select relies on performance for complex queries. RustFS leverages SIMD instruction sets to optimize performance, running complex S3 Select queries on CSV, Parquet, JSON, and more.\n\n### Amazon Signature V4 [#amazon-signature-v4]\n\n<Mermaid\n  chart=\"flowchart LR\n    A1[&#x22;1. Create canonical request&#x22;]\n    A2[&#x22;2. Create string to sign&#x22;]\n    A3[&#x22;3. Calculate signature&#x22;]\n    A4[&#x22;4. Add signature to request&#x22;]\n    A1 --> A2 --> A3 --> A4\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    class A1,A2,A3,A4 svc\"\n/>\n\nApplications and clients must authenticate to access RustFS management APIs. RustFS supports AWS Signature Version 4. After authentication, RustFS uses policy-based access control compatible with AWS IAM to authorize operations.\n\n## AWS S3 API and RustFS [#aws-s3-api-and-rustfs]\n\nRustFS is a high-performance object storage. Combined with S3 compatibility, it supports a wide set of use cases, including code repositories (GitHub, GitLab), analytics (MongoDB, ClickHouse, MariaDB, CockroachDB, Teradata), and archiving/backup.\n\nRustFS is ideal for AI/ML and data science workloads. KubeFlow and TensorFlow require high-performance S3-compatible object storage. RustFS provides multi-cloud object storage and efficient replication.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "S3 compatibility is essential for cloud-native applications. RustFS strictly adheres to S3 API standards. RustFS offers a widely tested S3 alternative."
		},
		{
			"heading": "rustfs-and-s3-api---designed-for-multi-cloud-storage",
			"content": "RustFS prioritizes S3 compatibility. As an early adopter of the S3 API (V2 and V4), RustFS ensures compatibility across public cloud, private cloud, data center, multi-cloud, hybrid cloud, and edge environments."
		},
		{
			"heading": "s3-enables-hybrid-and-multi-cloud-computing",
			"content": "S3 is the standard for multi-cloud compatibility. As a RESTful API standard, S3 facilitates interactions between applications, data, and infrastructure."
		},
		{
			"heading": "s3-enables-hybrid-and-multi-cloud-computing",
			"content": "Kubernetes-native, S3-compatible object storage and applications can run anywhere - from public cloud instances (Google, Azure, AWS) to private clouds (Red Hat OpenShift, VMware Tanzu) and bare metal."
		},
		{
			"heading": "s3-compatibility-for-bare-metal-workloads",
			"content": "Private cloud is a fundamental building block of hybrid cloud architecture. S3 compatibility is crucial for all applications, from analytics to archiving."
		},
		{
			"heading": "s3-compatibility-for-bare-metal-workloads",
			"content": "With RustFS, S3 compatibility is location-independent. RustFS bare metal instances have the same S3 compatibility and performance as public cloud or edge instances."
		},
		{
			"heading": "advantages-of-rustfs-scalable-object-storage",
			"content": "Cloud-native applications use the S3 API to communicate with object storage. Many vendors only support a subset of functionality."
		},
		{
			"heading": "advantages-of-rustfs-scalable-object-storage",
			"content": "RustFS has a proven track record of S3 compatibility. We test millions of hardware, software, and application combinations. RustFS releases software weekly, and community-reported defects are promptly addressed."
		},
		{
			"heading": "advantages-of-rustfs-scalable-object-storage",
			"content": "Comprehensive S3 API support means applications can leverage data stored in RustFS on any hardware, location, or cloud."
		},
		{
			"heading": "s3-select",
			"content": "S3 Select relies on performance for complex queries. RustFS leverages SIMD instruction sets to optimize performance, running complex S3 Select queries on CSV, Parquet, JSON, and more."
		},
		{
			"heading": "amazon-signature-v4",
			"content": "Applications and clients must authenticate to access RustFS management APIs. RustFS supports AWS Signature Version 4. After authentication, RustFS uses policy-based access control compatible with AWS IAM to authorize operations."
		},
		{
			"heading": "aws-s3-api-and-rustfs",
			"content": "RustFS is a high-performance object storage. Combined with S3 compatibility, it supports a wide set of use cases, including code repositories (GitHub, GitLab), analytics (MongoDB, ClickHouse, MariaDB, CockroachDB, Teradata), and archiving/backup."
		},
		{
			"heading": "aws-s3-api-and-rustfs",
			"content": "RustFS is ideal for AI/ML and data science workloads. KubeFlow and TensorFlow require high-performance S3-compatible object storage. RustFS provides multi-cloud object storage and efficient replication."
		}
	],
	"headings": [
		{
			"id": "rustfs-and-s3-api---designed-for-multi-cloud-storage",
			"content": "RustFS and S3 API - Designed for Multi-Cloud Storage"
		},
		{
			"id": "s3-enables-hybrid-and-multi-cloud-computing",
			"content": "S3 Enables Hybrid and Multi-Cloud Computing"
		},
		{
			"id": "s3-compatibility-for-bare-metal-workloads",
			"content": "S3 Compatibility for Bare Metal Workloads"
		},
		{
			"id": "advantages-of-rustfs-scalable-object-storage",
			"content": "Advantages of RustFS Scalable Object Storage"
		},
		{
			"id": "core-features",
			"content": "Core Features"
		},
		{
			"id": "s3-select",
			"content": "S3 Select"
		},
		{
			"id": "amazon-signature-v4",
			"content": "Amazon Signature V4"
		},
		{
			"id": "aws-s3-api-and-rustfs",
			"content": "AWS S3 API and RustFS"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#rustfs-and-s3-api---designed-for-multi-cloud-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS and S3 API - Designed for Multi-Cloud Storage" })
	},
	{
		depth: 2,
		url: "#s3-enables-hybrid-and-multi-cloud-computing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "S3 Enables Hybrid and Multi-Cloud Computing" })
	},
	{
		depth: 2,
		url: "#s3-compatibility-for-bare-metal-workloads",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "S3 Compatibility for Bare Metal Workloads" })
	},
	{
		depth: 2,
		url: "#advantages-of-rustfs-scalable-object-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Advantages of RustFS Scalable Object Storage" })
	},
	{
		depth: 2,
		url: "#core-features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Core Features" })
	},
	{
		depth: 3,
		url: "#s3-select",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "S3 Select" })
	},
	{
		depth: 3,
		url: "#amazon-signature-v4",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Amazon Signature V4" })
	},
	{
		depth: 2,
		url: "#aws-s3-api-and-rustfs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "AWS S3 API and RustFS" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		h3: "h3",
		img: "img",
		p: "p",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "S3 compatibility is essential for cloud-native applications. RustFS strictly adheres to S3 API standards. RustFS offers a widely tested S3 alternative." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-and-s3-api---designed-for-multi-cloud-storage",
			children: "RustFS and S3 API - Designed for Multi-Cloud Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS prioritizes S3 compatibility. As an early adopter of the S3 API (V2 and V4), RustFS ensures compatibility across public cloud, private cloud, data center, multi-cloud, hybrid cloud, and edge environments." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "s3-enables-hybrid-and-multi-cloud-computing",
			children: "S3 Enables Hybrid and Multi-Cloud Computing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "S3 is the standard for multi-cloud compatibility. As a RESTful API standard, S3 facilitates interactions between applications, data, and infrastructure." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Kubernetes-native, S3-compatible object storage and applications can run anywhere - from public cloud instances (Google, Azure, AWS) to private clouds (Red Hat OpenShift, VMware Tanzu) and bare metal." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "s3-compatibility-for-bare-metal-workloads",
			children: "S3 Compatibility for Bare Metal Workloads"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Private cloud is a fundamental building block of hybrid cloud architecture. S3 compatibility is crucial for all applications, from analytics to archiving." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "With RustFS, S3 compatibility is location-independent. RustFS bare metal instances have the same S3 compatibility and performance as public cloud or edge instances." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "advantages-of-rustfs-scalable-object-storage",
			children: "Advantages of RustFS Scalable Object Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Cloud-native applications use the S3 API to communicate with object storage. Many vendors only support a subset of functionality." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS has a proven track record of S3 compatibility. We test millions of hardware, software, and application combinations. RustFS releases software weekly, and community-reported defects are promptly addressed." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Comprehensive S3 API support means applications can leverage data stored in RustFS on any hardware, location, or cloud." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "core-features",
			children: "Core Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "s3-select",
			children: "S3 Select"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
			alt: "S3 Select",
			src: s1_4_default
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "S3 Select relies on performance for complex queries. RustFS leverages SIMD instruction sets to optimize performance, running complex S3 Select queries on CSV, Parquet, JSON, and more." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "amazon-signature-v4",
			children: "Amazon Signature V4"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n    A1[\"1. Create canonical request\"]\n    A2[\"2. Create string to sign\"]\n    A3[\"3. Calculate signature\"]\n    A4[\"4. Add signature to request\"]\n    A1 --> A2 --> A3 --> A4\n    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n    class A1,A2,A3,A4 svc" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Applications and clients must authenticate to access RustFS management APIs. RustFS supports AWS Signature Version 4. After authentication, RustFS uses policy-based access control compatible with AWS IAM to authorize operations." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "aws-s3-api-and-rustfs",
			children: "AWS S3 API and RustFS"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is a high-performance object storage. Combined with S3 compatibility, it supports a wide set of use cases, including code repositories (GitHub, GitLab), analytics (MongoDB, ClickHouse, MariaDB, CockroachDB, Teradata), and archiving/backup." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is ideal for AI/ML and data science workloads. KubeFlow and TensorFlow require high-performance S3-compatible object storage. RustFS provides multi-cloud object storage and efficient replication." })
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
