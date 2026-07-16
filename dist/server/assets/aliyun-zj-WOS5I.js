import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/aliyun/images/sec1-1.png
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var sec1_1_default = "/assets/sec1-1-Cy36oRiV.png";
//#endregion
//#region content/features/aliyun/index.md?collection=docs
var frontmatter = {
	"title": "RustFS for Alibaba Cloud Kubernetes Service",
	"description": "RustFS provides high-performance object storage for Alibaba Cloud ACK with hybrid cloud capabilities and enterprise features."
};
var _markdown = "\n\n\n\n## Three Reasons Customers Run RustFS on Alibaba Cloud [#three-reasons-customers-run-rustfs-on-alibaba-cloud]\n\n* RustFS serves as a consistent storage layer in hybrid cloud or multi-cloud deployment scenarios\n* RustFS is a Kubernetes-native high-performance product that delivers predictable performance across public cloud, private cloud, and edge environments.\n* Running RustFS on ACK provides control over the software stack with the flexibility needed to avoid cloud lock-in.\n\nAlibaba Cloud ACK is a managed service for running Kubernetes on Alibaba Cloud without needing to install, operate, and maintain your own Kubernetes control plane or nodes.\n\nRustFS provides portable high-performance object storage systems on all major Kubernetes platforms (Alibaba Cloud ACK, Tanzu, Azure, GCP, Alibaba Cloud ACK). On Alibaba Cloud, RustFS integrates natively with Alibaba Cloud ACK services, making it easier to run your own large-scale multi-tenant object storage as a service. RustFS is a complete alternative to AWS S3 storage as a service.\n\n<img alt=\"RustFS Architecture Diagram\" src=\"__img0\" />\n\nUnlike AWS S3, RustFS enables applications to scale across multi-cloud and hybrid cloud infrastructure without expensive software rewrites or proprietary integrations. Because RustFS is containerized and Kubernetes-native, it can be deployed on these platforms without specialized skills to operate large-scale storage infrastructure.\n\n## RustFS Operator Natively Integrates with Alibaba Cloud ACK Features [#rustfs-operator-natively-integrates-with-alibaba-cloud-ack-features]\n\n### Feature Overview [#feature-overview]\n\n* **Storage Classes and Tiering**\n* **External Load Balancing**\n* **Encryption Key Management**\n* **Identity Management**\n* **Certificate Management**\n* **Monitoring and Alerting**\n* **Logging and Auditing**\n\n## Storage Classes and Tiering [#storage-classes-and-tiering]\n\nA key requirement for deploying RustFS at scale on Alibaba Cloud ACK is capability tiers across storage classes (NVMe, HDD, public cloud). This enables enterprises to manage both cost and performance simultaneously.\n\nRustFS supports automatic transition of aging objects from fast NVMe tiers to more cost-effective HDD tiers, and even to cost-optimized cold public cloud storage tiers.\n\nWhen tiering, RustFS provides a unified namespace across tiers. Movement across tiers is transparent to applications and triggered by customer-defined policies.\n\nRustFS provides secure storage in Alibaba Cloud ACK hybrid clouds by encrypting objects at the source, ensuring customers always have complete control over data. When Alibaba Cloud ACK is deployed in public clouds, tiering capabilities help Alibaba Cloud ACK effectively manage data across persistent block storage and cheaper object storage tiers.\n\n**Learn More:**\n\n## External Load Balancing [#external-load-balancing]\n\nAll RustFS communication is based on HTTP, RESTful APIs, and supports any standard Kubernetes-compatible ingress controller. This includes hardware and software-defined solutions. The most popular choice is NGINX. Install using OperatorHub or OpenShift Marketplace, then expose RustFS tenants using annotations.\n\n## Encryption Key Management [#encryption-key-management]\n\nAlibaba Cloud ACK does not provide native key management capabilities. RustFS recommends using HashiCorp Vault to store keys outside the object storage system. This is a best practice for cloud-native applications.\n\nFor all production environments, we recommend enabling encryption on all buckets by default. RustFS uses AES-256-GCM or ChaCha20-Poly1305 encryption to protect data integrity and confidentiality with negligible performance impact.\n\nRustFS supports all three server-side encryption (SSE-KMS, SSE-S3, and SSE-C) modes. SSE-S3 and SSE-KMS integrate with server-side KMS, while SSE-C uses client-provided keys.\n\nRustFS will use this KMS to bootstrap its internal key encryption server (KES service) for high-performance per-object encryption. Each tenant runs its own KES server in an isolated namespace.\n\n## Identity Management [#identity-management]\n\nWhen running RustFS on Alibaba Cloud ACK, customers can manage single sign-on (SSO) through third-party OpenID Connect/LDAP compatible identity providers (such as Keycloak, Okta/Auth0, Google, Facebook, ActiveDirectory, and OpenLDAP). RustFS recommends OpenID Connect-compatible Keycloak IDP.\n\nExternal IDPs allow administrators to centrally manage user/application identities. RustFS builds on top of IDPs to provide AWS IAM-style user, group, role, policy, and token service APIs. The ability to have a unified identity and access management (IAM) layer independent of infrastructure provides significant architectural flexibility.\n\n## Certificate Management [#certificate-management]\n\nAll traffic from applications to RustFS, including inter-node traffic, is encrypted using TLS. TLS certificates are used to secure network communications and establish the identity of network connection resources, such as RustFS server domains.\n\nRustFS integrates with OpenShift certificate manager, so you can use the RustFS operator to automatically provision, configure, manage, and update certificates for RustFS tenants. Tenants are completely isolated from each other in their own Kubernetes namespaces with their own certificates for enhanced security.\n\n## Monitoring and Alerting [#monitoring-and-alerting]\n\nRustFS recommends using Grafana, platform monitoring components installed in the OpenShift-user-workload-monitoring project, or any other OpenShift container monitoring tools to connect to RustFS. RustFS publishes a comprehensive set of storage-related Prometheus metrics, from bucket capacity to access metrics. These metrics can be collected and visualized in any Prometheus-compatible tool or RustFS console.\n\nExternal monitoring solutions periodically scrape RustFS Prometheus endpoints. RustFS recommends using Grafana or platform monitoring components installed in the openshift-user-workload-monitoring project to connect to RustFS. These same tools can also be used to establish baselines and set notification alert thresholds, which can then be routed to notification platforms like PagerDuty, Freshservice, or even SNMP.\n\n## Logging and Auditing [#logging-and-auditing]\n\nEnabling RustFS auditing generates logs for every operation on the object storage cluster. In addition to audit logs, RustFS also logs console errors for troubleshooting.\n\nRustFS supports sending logs to Elastic Stack (or third-party) for analysis and alerting.\n";
var structuredData = {
	"contents": [
		{
			"heading": "three-reasons-customers-run-rustfs-on-alibaba-cloud",
			"content": "RustFS serves as a consistent storage layer in hybrid cloud or multi-cloud deployment scenarios"
		},
		{
			"heading": "three-reasons-customers-run-rustfs-on-alibaba-cloud",
			"content": "RustFS is a Kubernetes-native high-performance product that delivers predictable performance across public cloud, private cloud, and edge environments."
		},
		{
			"heading": "three-reasons-customers-run-rustfs-on-alibaba-cloud",
			"content": "Running RustFS on ACK provides control over the software stack with the flexibility needed to avoid cloud lock-in."
		},
		{
			"heading": "three-reasons-customers-run-rustfs-on-alibaba-cloud",
			"content": "Alibaba Cloud ACK is a managed service for running Kubernetes on Alibaba Cloud without needing to install, operate, and maintain your own Kubernetes control plane or nodes."
		},
		{
			"heading": "three-reasons-customers-run-rustfs-on-alibaba-cloud",
			"content": "RustFS provides portable high-performance object storage systems on all major Kubernetes platforms (Alibaba Cloud ACK, Tanzu, Azure, GCP, Alibaba Cloud ACK). On Alibaba Cloud, RustFS integrates natively with Alibaba Cloud ACK services, making it easier to run your own large-scale multi-tenant object storage as a service. RustFS is a complete alternative to AWS S3 storage as a service."
		},
		{
			"heading": "three-reasons-customers-run-rustfs-on-alibaba-cloud",
			"content": "Unlike AWS S3, RustFS enables applications to scale across multi-cloud and hybrid cloud infrastructure without expensive software rewrites or proprietary integrations. Because RustFS is containerized and Kubernetes-native, it can be deployed on these platforms without specialized skills to operate large-scale storage infrastructure."
		},
		{
			"heading": "feature-overview",
			"content": "**Storage Classes and Tiering**"
		},
		{
			"heading": "feature-overview",
			"content": "**External Load Balancing**"
		},
		{
			"heading": "feature-overview",
			"content": "**Encryption Key Management**"
		},
		{
			"heading": "feature-overview",
			"content": "**Identity Management**"
		},
		{
			"heading": "feature-overview",
			"content": "**Certificate Management**"
		},
		{
			"heading": "feature-overview",
			"content": "**Monitoring and Alerting**"
		},
		{
			"heading": "feature-overview",
			"content": "**Logging and Auditing**"
		},
		{
			"heading": "storage-classes-and-tiering",
			"content": "A key requirement for deploying RustFS at scale on Alibaba Cloud ACK is capability tiers across storage classes (NVMe, HDD, public cloud). This enables enterprises to manage both cost and performance simultaneously."
		},
		{
			"heading": "storage-classes-and-tiering",
			"content": "RustFS supports automatic transition of aging objects from fast NVMe tiers to more cost-effective HDD tiers, and even to cost-optimized cold public cloud storage tiers."
		},
		{
			"heading": "storage-classes-and-tiering",
			"content": "When tiering, RustFS provides a unified namespace across tiers. Movement across tiers is transparent to applications and triggered by customer-defined policies."
		},
		{
			"heading": "storage-classes-and-tiering",
			"content": "RustFS provides secure storage in Alibaba Cloud ACK hybrid clouds by encrypting objects at the source, ensuring customers always have complete control over data. When Alibaba Cloud ACK is deployed in public clouds, tiering capabilities help Alibaba Cloud ACK effectively manage data across persistent block storage and cheaper object storage tiers."
		},
		{
			"heading": "storage-classes-and-tiering",
			"content": "**Learn More:**"
		},
		{
			"heading": "external-load-balancing",
			"content": "All RustFS communication is based on HTTP, RESTful APIs, and supports any standard Kubernetes-compatible ingress controller. This includes hardware and software-defined solutions. The most popular choice is NGINX. Install using OperatorHub or OpenShift Marketplace, then expose RustFS tenants using annotations."
		},
		{
			"heading": "encryption-key-management",
			"content": "Alibaba Cloud ACK does not provide native key management capabilities. RustFS recommends using HashiCorp Vault to store keys outside the object storage system. This is a best practice for cloud-native applications."
		},
		{
			"heading": "encryption-key-management",
			"content": "For all production environments, we recommend enabling encryption on all buckets by default. RustFS uses AES-256-GCM or ChaCha20-Poly1305 encryption to protect data integrity and confidentiality with negligible performance impact."
		},
		{
			"heading": "encryption-key-management",
			"content": "RustFS supports all three server-side encryption (SSE-KMS, SSE-S3, and SSE-C) modes. SSE-S3 and SSE-KMS integrate with server-side KMS, while SSE-C uses client-provided keys."
		},
		{
			"heading": "encryption-key-management",
			"content": "RustFS will use this KMS to bootstrap its internal key encryption server (KES service) for high-performance per-object encryption. Each tenant runs its own KES server in an isolated namespace."
		},
		{
			"heading": "identity-management",
			"content": "When running RustFS on Alibaba Cloud ACK, customers can manage single sign-on (SSO) through third-party OpenID Connect/LDAP compatible identity providers (such as Keycloak, Okta/Auth0, Google, Facebook, ActiveDirectory, and OpenLDAP). RustFS recommends OpenID Connect-compatible Keycloak IDP."
		},
		{
			"heading": "identity-management",
			"content": "External IDPs allow administrators to centrally manage user/application identities. RustFS builds on top of IDPs to provide AWS IAM-style user, group, role, policy, and token service APIs. The ability to have a unified identity and access management (IAM) layer independent of infrastructure provides significant architectural flexibility."
		},
		{
			"heading": "certificate-management",
			"content": "All traffic from applications to RustFS, including inter-node traffic, is encrypted using TLS. TLS certificates are used to secure network communications and establish the identity of network connection resources, such as RustFS server domains."
		},
		{
			"heading": "certificate-management",
			"content": "RustFS integrates with OpenShift certificate manager, so you can use the RustFS operator to automatically provision, configure, manage, and update certificates for RustFS tenants. Tenants are completely isolated from each other in their own Kubernetes namespaces with their own certificates for enhanced security."
		},
		{
			"heading": "monitoring-and-alerting",
			"content": "RustFS recommends using Grafana, platform monitoring components installed in the OpenShift-user-workload-monitoring project, or any other OpenShift container monitoring tools to connect to RustFS. RustFS publishes a comprehensive set of storage-related Prometheus metrics, from bucket capacity to access metrics. These metrics can be collected and visualized in any Prometheus-compatible tool or RustFS console."
		},
		{
			"heading": "monitoring-and-alerting",
			"content": "External monitoring solutions periodically scrape RustFS Prometheus endpoints. RustFS recommends using Grafana or platform monitoring components installed in the openshift-user-workload-monitoring project to connect to RustFS. These same tools can also be used to establish baselines and set notification alert thresholds, which can then be routed to notification platforms like PagerDuty, Freshservice, or even SNMP."
		},
		{
			"heading": "logging-and-auditing",
			"content": "Enabling RustFS auditing generates logs for every operation on the object storage cluster. In addition to audit logs, RustFS also logs console errors for troubleshooting."
		},
		{
			"heading": "logging-and-auditing",
			"content": "RustFS supports sending logs to Elastic Stack (or third-party) for analysis and alerting."
		}
	],
	"headings": [
		{
			"id": "three-reasons-customers-run-rustfs-on-alibaba-cloud",
			"content": "Three Reasons Customers Run RustFS on Alibaba Cloud"
		},
		{
			"id": "rustfs-operator-natively-integrates-with-alibaba-cloud-ack-features",
			"content": "RustFS Operator Natively Integrates with Alibaba Cloud ACK Features"
		},
		{
			"id": "feature-overview",
			"content": "Feature Overview"
		},
		{
			"id": "storage-classes-and-tiering",
			"content": "Storage Classes and Tiering"
		},
		{
			"id": "external-load-balancing",
			"content": "External Load Balancing"
		},
		{
			"id": "encryption-key-management",
			"content": "Encryption Key Management"
		},
		{
			"id": "identity-management",
			"content": "Identity Management"
		},
		{
			"id": "certificate-management",
			"content": "Certificate Management"
		},
		{
			"id": "monitoring-and-alerting",
			"content": "Monitoring and Alerting"
		},
		{
			"id": "logging-and-auditing",
			"content": "Logging and Auditing"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#three-reasons-customers-run-rustfs-on-alibaba-cloud",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Three Reasons Customers Run RustFS on Alibaba Cloud" })
	},
	{
		depth: 2,
		url: "#rustfs-operator-natively-integrates-with-alibaba-cloud-ack-features",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS Operator Natively Integrates with Alibaba Cloud ACK Features" })
	},
	{
		depth: 3,
		url: "#feature-overview",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Feature Overview" })
	},
	{
		depth: 2,
		url: "#storage-classes-and-tiering",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Storage Classes and Tiering" })
	},
	{
		depth: 2,
		url: "#external-load-balancing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "External Load Balancing" })
	},
	{
		depth: 2,
		url: "#encryption-key-management",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Encryption Key Management" })
	},
	{
		depth: 2,
		url: "#identity-management",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Identity Management" })
	},
	{
		depth: 2,
		url: "#certificate-management",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Certificate Management" })
	},
	{
		depth: 2,
		url: "#monitoring-and-alerting",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Monitoring and Alerting" })
	},
	{
		depth: 2,
		url: "#logging-and-auditing",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Logging and Auditing" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		h3: "h3",
		img: "img",
		li: "li",
		p: "p",
		strong: "strong",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "three-reasons-customers-run-rustfs-on-alibaba-cloud",
			children: "Three Reasons Customers Run RustFS on Alibaba Cloud"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "RustFS serves as a consistent storage layer in hybrid cloud or multi-cloud deployment scenarios" }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "RustFS is a Kubernetes-native high-performance product that delivers predictable performance across public cloud, private cloud, and edge environments." }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: "Running RustFS on ACK provides control over the software stack with the flexibility needed to avoid cloud lock-in." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Alibaba Cloud ACK is a managed service for running Kubernetes on Alibaba Cloud without needing to install, operate, and maintain your own Kubernetes control plane or nodes." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS provides portable high-performance object storage systems on all major Kubernetes platforms (Alibaba Cloud ACK, Tanzu, Azure, GCP, Alibaba Cloud ACK). On Alibaba Cloud, RustFS integrates natively with Alibaba Cloud ACK services, making it easier to run your own large-scale multi-tenant object storage as a service. RustFS is a complete alternative to AWS S3 storage as a service." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
			alt: "RustFS Architecture Diagram",
			src: sec1_1_default
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Unlike AWS S3, RustFS enables applications to scale across multi-cloud and hybrid cloud infrastructure without expensive software rewrites or proprietary integrations. Because RustFS is containerized and Kubernetes-native, it can be deployed on these platforms without specialized skills to operate large-scale storage infrastructure." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-operator-natively-integrates-with-alibaba-cloud-ack-features",
			children: "RustFS Operator Natively Integrates with Alibaba Cloud ACK Features"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h3, {
			id: "feature-overview",
			children: "Feature Overview"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Storage Classes and Tiering" }) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "External Load Balancing" }) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Encryption Key Management" }) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Identity Management" }) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Certificate Management" }) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Monitoring and Alerting" }) }),
			"\n",
			(0, import_jsx_runtime_react_server.jsx)(_components.li, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Logging and Auditing" }) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "storage-classes-and-tiering",
			children: "Storage Classes and Tiering"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "A key requirement for deploying RustFS at scale on Alibaba Cloud ACK is capability tiers across storage classes (NVMe, HDD, public cloud). This enables enterprises to manage both cost and performance simultaneously." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports automatic transition of aging objects from fast NVMe tiers to more cost-effective HDD tiers, and even to cost-optimized cold public cloud storage tiers." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When tiering, RustFS provides a unified namespace across tiers. Movement across tiers is transparent to applications and triggered by customer-defined policies." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS provides secure storage in Alibaba Cloud ACK hybrid clouds by encrypting objects at the source, ensuring customers always have complete control over data. When Alibaba Cloud ACK is deployed in public clouds, tiering capabilities help Alibaba Cloud ACK effectively manage data across persistent block storage and cheaper object storage tiers." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.strong, { children: "Learn More:" }) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "external-load-balancing",
			children: "External Load Balancing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "All RustFS communication is based on HTTP, RESTful APIs, and supports any standard Kubernetes-compatible ingress controller. This includes hardware and software-defined solutions. The most popular choice is NGINX. Install using OperatorHub or OpenShift Marketplace, then expose RustFS tenants using annotations." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "encryption-key-management",
			children: "Encryption Key Management"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Alibaba Cloud ACK does not provide native key management capabilities. RustFS recommends using HashiCorp Vault to store keys outside the object storage system. This is a best practice for cloud-native applications." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "For all production environments, we recommend enabling encryption on all buckets by default. RustFS uses AES-256-GCM or ChaCha20-Poly1305 encryption to protect data integrity and confidentiality with negligible performance impact." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports all three server-side encryption (SSE-KMS, SSE-S3, and SSE-C) modes. SSE-S3 and SSE-KMS integrate with server-side KMS, while SSE-C uses client-provided keys." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS will use this KMS to bootstrap its internal key encryption server (KES service) for high-performance per-object encryption. Each tenant runs its own KES server in an isolated namespace." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "identity-management",
			children: "Identity Management"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When running RustFS on Alibaba Cloud ACK, customers can manage single sign-on (SSO) through third-party OpenID Connect/LDAP compatible identity providers (such as Keycloak, Okta/Auth0, Google, Facebook, ActiveDirectory, and OpenLDAP). RustFS recommends OpenID Connect-compatible Keycloak IDP." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "External IDPs allow administrators to centrally manage user/application identities. RustFS builds on top of IDPs to provide AWS IAM-style user, group, role, policy, and token service APIs. The ability to have a unified identity and access management (IAM) layer independent of infrastructure provides significant architectural flexibility." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "certificate-management",
			children: "Certificate Management"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "All traffic from applications to RustFS, including inter-node traffic, is encrypted using TLS. TLS certificates are used to secure network communications and establish the identity of network connection resources, such as RustFS server domains." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS integrates with OpenShift certificate manager, so you can use the RustFS operator to automatically provision, configure, manage, and update certificates for RustFS tenants. Tenants are completely isolated from each other in their own Kubernetes namespaces with their own certificates for enhanced security." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "monitoring-and-alerting",
			children: "Monitoring and Alerting"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS recommends using Grafana, platform monitoring components installed in the OpenShift-user-workload-monitoring project, or any other OpenShift container monitoring tools to connect to RustFS. RustFS publishes a comprehensive set of storage-related Prometheus metrics, from bucket capacity to access metrics. These metrics can be collected and visualized in any Prometheus-compatible tool or RustFS console." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "External monitoring solutions periodically scrape RustFS Prometheus endpoints. RustFS recommends using Grafana or platform monitoring components installed in the openshift-user-workload-monitoring project to connect to RustFS. These same tools can also be used to establish baselines and set notification alert thresholds, which can then be routed to notification platforms like PagerDuty, Freshservice, or even SNMP." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "logging-and-auditing",
			children: "Logging and Auditing"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Enabling RustFS auditing generates logs for every operation on the object storage cluster. In addition to audit logs, RustFS also logs console errors for troubleshooting." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports sending logs to Elastic Stack (or third-party) for analysis and alerting." })
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
