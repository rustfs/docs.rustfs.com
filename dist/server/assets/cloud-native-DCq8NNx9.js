import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/cloud-native/images/multi-cloud-architecture.png
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var multi_cloud_architecture_default = "/assets/multi-cloud-architecture-BtkKOOcW.png";
//#endregion
//#region content/features/cloud-native/index.md?collection=docs
var frontmatter = {
	"title": "Hybrid/Multi-Cloud Object Storage",
	"description": "Hybrid/multi-cloud architecture enables consistent performance, security, and economics across different environments."
};
var _markdown = "\n\n\n\nHybrid/multi-cloud architecture enables consistent performance, security, and economics.\n\n## Multi-Cloud Storage Strategies [#multi-cloud-storage-strategies]\n\n### Public Cloud [#public-cloud]\n\nPublic cloud providers include AWS, Azure, GCP, IBM, Alibaba, Tencent, and government clouds. Hybrid/multi-cloud storage software must run wherever the application stack runs. RustFS provides consistent storage across public cloud providers, avoiding the need to rewrite applications when expanding to new clouds.\n\n### Private Cloud [#private-cloud]\n\nKubernetes is the primary software architecture for modern private clouds (VMware Tanzu, RedHat OpenShift, Rancher, etc.). Multi-cloud Kubernetes requires software-defined, cloud-native object storage.\n\n### Edge [#edge]\n\nEdge computing moves computation to where data is generated. Edge storage solutions must be lightweight, powerful, cloud-native, and resilient.\n\n## Multi-Cloud Architecture with RustFS [#multi-cloud-architecture-with-rustfs]\n\n<img alt=\"Multi-Cloud Architecture\" src=\"__img0\" />\n\n## Properties of Hybrid/Multi-Cloud Storage [#properties-of-hybridmulti-cloud-storage]\n\nMulti-cloud storage adopts public cloud patterns. New applications are typically written for the AWS S3 API. To scale and perform like cloud-native technologies, applications should be compatible with the S3 API and refactored into microservices.\n\n### Kubernetes-Native [#kubernetes-native]\n\nKubernetes-native design requires operator services to configure and manage multi-tenant object storage. Each tenant runs in an independent namespace while sharing underlying hardware resources. The operator pattern extends Kubernetes' declarative API model through Custom Resource Definitions (CRDs) for operations like resource orchestration, upgrades, and scaling.\n\nRustFS is designed for Kubernetes. The lightweight RustFS binary allows the RustFS Operator to densely co-locate multiple tenants without exhausting resources.\n\n### Consistent [#consistent]\n\nHybrid/multi-cloud storage must be consistent in API compatibility, performance, security, and compliance. RustFS enables non-disruptive updates across public, private, and edge environments, maintaining a consistent experience. RustFS abstracts differences in key management, identity management, access policies, and hardware/OS.\n\n### Performance [#performance]\n\nObject storage must deliver performance at scale for workloads ranging from mobile/web applications to AI/ML. RustFS delivers read/write speeds of 325 GiB/s and 171 GiB/s on NVMe, and 11 GiB/s and 9 GiB/s on HDD.\n\n### Scalable [#scalable]\n\nMany people think scale only refers to how large a system can become. However, this thinking ignores the importance of operational efficiency as environments evolve. Multi-cloud object storage solutions must scale efficiently and transparently regardless of underlying environment, with minimal human interaction and maximum automation. This can only be achieved through API-driven platforms built on simple architectures.\n\nRustFS's relentless focus on simplicity means large-scale, multi-petabyte data infrastructure can be managed with minimal human resources. This is a function of APIs and automation, creating an environment on which scalable multi-cloud storage can be built.\n\n### Software-Defined [#software-defined]\n\nThe only way to succeed in multi-cloud is with software-defined storage. The reason is straightforward. Hardware appliances don't run on public clouds or Kubernetes. Public cloud storage service offerings aren't designed to run on other public clouds, private clouds, or Kubernetes platforms. Even if they did, bandwidth costs would exceed storage costs because they weren't developed for cross-network replication. Admittedly, software-defined storage can run on public clouds, private clouds, and edge.\n\nRustFS was born in software and is portable across various operating systems and hardware architectures. Evidence can be found in our 2M+ IPs running across AWS, GCP, and Azure.\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Hybrid/multi-cloud architecture enables consistent performance, security, and economics."
		},
		{
			"heading": "public-cloud",
			"content": "Public cloud providers include AWS, Azure, GCP, IBM, Alibaba, Tencent, and government clouds. Hybrid/multi-cloud storage software must run wherever the application stack runs. RustFS provides consistent storage across public cloud providers, avoiding the need to rewrite applications when expanding to new clouds."
		},
		{
			"heading": "private-cloud",
			"content": "Kubernetes is the primary software architecture for modern private clouds (VMware Tanzu, RedHat OpenShift, Rancher, etc.). Multi-cloud Kubernetes requires software-defined, cloud-native object storage."
		},
		{
			"heading": "edge",
			"content": "Edge computing moves computation to where data is generated. Edge storage solutions must be lightweight, powerful, cloud-native, and resilient."
		},
		{
			"heading": "properties-of-hybridmulti-cloud-storage",
			"content": "Multi-cloud storage adopts public cloud patterns. New applications are typically written for the AWS S3 API. To scale and perform like cloud-native technologies, applications should be compatible with the S3 API and refactored into microservices."
		},
		{
			"heading": "kubernetes-native",
			"content": "Kubernetes-native design requires operator services to configure and manage multi-tenant object storage. Each tenant runs in an independent namespace while sharing underlying hardware resources. The operator pattern extends Kubernetes' declarative API model through Custom Resource Definitions (CRDs) for operations like resource orchestration, upgrades, and scaling."
		},
		{
			"heading": "kubernetes-native",
			"content": "RustFS is designed for Kubernetes. The lightweight RustFS binary allows the RustFS Operator to densely co-locate multiple tenants without exhausting resources."
		},
		{
			"heading": "consistent",
			"content": "Hybrid/multi-cloud storage must be consistent in API compatibility, performance, security, and compliance. RustFS enables non-disruptive updates across public, private, and edge environments, maintaining a consistent experience. RustFS abstracts differences in key management, identity management, access policies, and hardware/OS."
		},
		{
			"heading": "performance",
			"content": "Object storage must deliver performance at scale for workloads ranging from mobile/web applications to AI/ML. RustFS delivers read/write speeds of 325 GiB/s and 171 GiB/s on NVMe, and 11 GiB/s and 9 GiB/s on HDD."
		},
		{
			"heading": "scalable",
			"content": "Many people think scale only refers to how large a system can become. However, this thinking ignores the importance of operational efficiency as environments evolve. Multi-cloud object storage solutions must scale efficiently and transparently regardless of underlying environment, with minimal human interaction and maximum automation. This can only be achieved through API-driven platforms built on simple architectures."
		},
		{
			"heading": "scalable",
			"content": "RustFS's relentless focus on simplicity means large-scale, multi-petabyte data infrastructure can be managed with minimal human resources. This is a function of APIs and automation, creating an environment on which scalable multi-cloud storage can be built."
		},
		{
			"heading": "software-defined",
			"content": "The only way to succeed in multi-cloud is with software-defined storage. The reason is straightforward. Hardware appliances don't run on public clouds or Kubernetes. Public cloud storage service offerings aren't designed to run on other public clouds, private clouds, or Kubernetes platforms. Even if they did, bandwidth costs would exceed storage costs because they weren't developed for cross-network replication. Admittedly, software-defined storage can run on public clouds, private clouds, and edge."
		},
		{
			"heading": "software-defined",
			"content": "RustFS was born in software and is portable across various operating systems and hardware architectures. Evidence can be found in our 2M+ IPs running across AWS, GCP, and Azure."
		}
	],
	"headings": [
		{
			"id": "multi-cloud-storage-strategies",
			"content": "Multi-Cloud Storage Strategies"
		},
		{
			"id": "public-cloud",
			"content": "Public Cloud"
		},
		{
			"id": "private-cloud",
			"content": "Private Cloud"
		},
		{
			"id": "edge",
			"content": "Edge"
		},
		{
			"id": "multi-cloud-architecture-with-rustfs",
			"content": "Multi-Cloud Architecture with RustFS"
		},
		{
			"id": "properties-of-hybridmulti-cloud-storage",
			"content": "Properties of Hybrid/Multi-Cloud Storage"
		},
		{
			"id": "kubernetes-native",
			"content": "Kubernetes-Native"
		},
		{
			"id": "consistent",
			"content": "Consistent"
		},
		{
			"id": "performance",
			"content": "Performance"
		},
		{
			"id": "scalable",
			"content": "Scalable"
		},
		{
			"id": "software-defined",
			"content": "Software-Defined"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#multi-cloud-storage-strategies",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Multi-Cloud Storage Strategies" })
	},
	{
		depth: 3,
		url: "#public-cloud",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Public Cloud" })
	},
	{
		depth: 3,
		url: "#private-cloud",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Private Cloud" })
	},
	{
		depth: 3,
		url: "#edge",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Edge" })
	},
	{
		depth: 2,
		url: "#multi-cloud-architecture-with-rustfs",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Multi-Cloud Architecture with RustFS" })
	},
	{
		depth: 2,
		url: "#properties-of-hybridmulti-cloud-storage",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Properties of Hybrid/Multi-Cloud Storage" })
	},
	{
		depth: 3,
		url: "#kubernetes-native",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Kubernetes-Native" })
	},
	{
		depth: 3,
		url: "#consistent",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Consistent" })
	},
	{
		depth: 3,
		url: "#performance",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Performance" })
	},
	{
		depth: 3,
		url: "#scalable",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Scalable" })
	},
	{
		depth: 3,
		url: "#software-defined",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Software-Defined" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		h3: "h3",
		img: "img",
		p: "p",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Hybrid/multi-cloud architecture enables consistent performance, security, and economics." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "multi-cloud-storage-strategies",
			children: "Multi-Cloud Storage Strategies"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "public-cloud",
			children: "Public Cloud"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Public cloud providers include AWS, Azure, GCP, IBM, Alibaba, Tencent, and government clouds. Hybrid/multi-cloud storage software must run wherever the application stack runs. RustFS provides consistent storage across public cloud providers, avoiding the need to rewrite applications when expanding to new clouds." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "private-cloud",
			children: "Private Cloud"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Kubernetes is the primary software architecture for modern private clouds (VMware Tanzu, RedHat OpenShift, Rancher, etc.). Multi-cloud Kubernetes requires software-defined, cloud-native object storage." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "edge",
			children: "Edge"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Edge computing moves computation to where data is generated. Edge storage solutions must be lightweight, powerful, cloud-native, and resilient." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "multi-cloud-architecture-with-rustfs",
			children: "Multi-Cloud Architecture with RustFS"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
			alt: "Multi-Cloud Architecture",
			src: multi_cloud_architecture_default
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "properties-of-hybridmulti-cloud-storage",
			children: "Properties of Hybrid/Multi-Cloud Storage"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Multi-cloud storage adopts public cloud patterns. New applications are typically written for the AWS S3 API. To scale and perform like cloud-native technologies, applications should be compatible with the S3 API and refactored into microservices." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "kubernetes-native",
			children: "Kubernetes-Native"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Kubernetes-native design requires operator services to configure and manage multi-tenant object storage. Each tenant runs in an independent namespace while sharing underlying hardware resources. The operator pattern extends Kubernetes' declarative API model through Custom Resource Definitions (CRDs) for operations like resource orchestration, upgrades, and scaling." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS is designed for Kubernetes. The lightweight RustFS binary allows the RustFS Operator to densely co-locate multiple tenants without exhausting resources." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "consistent",
			children: "Consistent"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Hybrid/multi-cloud storage must be consistent in API compatibility, performance, security, and compliance. RustFS enables non-disruptive updates across public, private, and edge environments, maintaining a consistent experience. RustFS abstracts differences in key management, identity management, access policies, and hardware/OS." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "performance",
			children: "Performance"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Object storage must deliver performance at scale for workloads ranging from mobile/web applications to AI/ML. RustFS delivers read/write speeds of 325 GiB/s and 171 GiB/s on NVMe, and 11 GiB/s and 9 GiB/s on HDD." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "scalable",
			children: "Scalable"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Many people think scale only refers to how large a system can become. However, this thinking ignores the importance of operational efficiency as environments evolve. Multi-cloud object storage solutions must scale efficiently and transparently regardless of underlying environment, with minimal human interaction and maximum automation. This can only be achieved through API-driven platforms built on simple architectures." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS's relentless focus on simplicity means large-scale, multi-petabyte data infrastructure can be managed with minimal human resources. This is a function of APIs and automation, creating an environment on which scalable multi-cloud storage can be built." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "software-defined",
			children: "Software-Defined"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The only way to succeed in multi-cloud is with software-defined storage. The reason is straightforward. Hardware appliances don't run on public clouds or Kubernetes. Public cloud storage service offerings aren't designed to run on other public clouds, private clouds, or Kubernetes platforms. Even if they did, bandwidth costs would exceed storage costs because they weren't developed for cross-network replication. Admittedly, software-defined storage can run on public clouds, private clouds, and edge." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS was born in software and is portable across various operating systems and hardware architectures. Evidence can be found in our 2M+ IPs running across AWS, GCP, and Azure." })
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
