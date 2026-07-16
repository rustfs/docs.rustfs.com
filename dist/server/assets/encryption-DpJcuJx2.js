import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/encryption/images/s5i-1.png
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var s5i_1_default = "/assets/s5i-1-BlLzxRzm.png";
//#endregion
//#region content/features/encryption/images/s5i-2.png
var s5i_2_default = "/assets/s5i-2-BE3rc_gX.png";
//#endregion
//#region content/features/encryption/images/s5i-3.png
var s5i_3_default = "/assets/s5i-3-B4ZOfRBU.png";
//#endregion
//#region content/features/encryption/images/s5i-4.png
var s5i_4_default = "/assets/s5i-4-B2oXwCFc.png";
//#endregion
//#region content/features/encryption/images/s5i-5.png
var s5i_5_default = "/assets/kms-2-Bz_IVkDN.png";
//#endregion
//#region content/features/encryption/images/s5i-6.png
var s5i_6_default = "/assets/s5i-6-BOGbZvOb.png";
//#endregion
//#region content/features/encryption/index.md?collection=docs
var frontmatter = {
	"title": "Data Encryption",
	"description": "Server-side encryption in RustFS with SSE-S3 and SSE-C, designed to minimize performance overhead."
};
var _markdown = "\n\n\n\n\n\n\n\n\n\n\n\n\n\nIn the object storage field, robust encryption is a fundamental requirement for enterprise storage. RustFS provides more functionality through the highest level of encryption and extensive optimizations, minimizing the performance overhead typically associated with storage encryption operations.\n\n<Mermaid\n  chart=\"flowchart LR\n  subgraph DATA[&#x22;Data&#x22;]\n    SSES3[&#x22;SSE-S3&#x22;]\n    SSEC[&#x22;SSE-C&#x22;]\n  end\n  R([&#x22;RustFS&#x22;])\n  KMS[(&#x22;KMS&#x22;)]\n  subgraph B1[&#x22;My Bucket&#x22;]\n    OBJ1[&#x22;Object&#x22;]\n  end\n  subgraph META1[&#x22;Object Metadata&#x22;]\n    M1A[&#x22;Random IV&#x22;]\n    M1B[&#x22;Sealed Object Key&#x22;]\n    M1C[&#x22;KMS Key ID&#x22;]\n    M1D[&#x22;Sealed KMS Data Key&#x22;]\n  end\n  SSES3 --> R\n  SSEC --> R\n  KMS --- R\n  R --> OBJ1\n  OBJ1 --> META1\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class R server\n  class KMS store\n  class SSES3,SSEC muted\n  class OBJ1 svc\n  class M1A,M1B,M1C,M1D accent\"\n/>\n\nRustFS encrypts data both when stored on disk and when transmitted over the network. RustFS's state-of-the-art encryption scheme supports fine-grained object-level encryption using modern industry-standard encryption algorithms such as AES-256-GCM, ChaCha20-Poly1305, and AES-CBC. RustFS is fully compatible with S3 encryption semantics and also extends S3 by supporting non-AWS key management services such as Hashicorp Vault, Gemalto KeySecure, and Google Secrets Manager.\n\n## Network Encryption [#network-encryption]\n\nWhen data is transmitted between object storage and applications, it may bounce between any number of unknown and/or untrusted networks. Encrypting data while it's transmitted over the network (also known as \"in transit\") successfully mitigates man-in-the-middle attacks and ensures data remains secure regardless of the routing path taken.\n\nRustFS supports Transport Layer Security (TLS) v1.2+ between all components in the cluster. This approach ensures there are no weak links in encrypted traffic between or within clusters. TLS is a ubiquitous encryption framework: it's the same encryption protocol used by banks, e-commerce websites, and other enterprise-level systems that rely on data storage encryption.\n\nRustFS's TLS implementation is optimized at the CPU instruction level with negligible performance overhead. It only requires specifying TLS private keys and public certificates for each RustFS server in the cluster. For Kubernetes environments, the RustFS Kubernetes Operator integrates/automatically generates and assigns TLS certificates during tenant deployment. RustFS supports multiple TLS certificates, where each certificate corresponds to a specific domain name. RustFS uses Server Name Indication (SNI) to determine which certificate to serve for any given request.\n\n## Object Encryption [#object-encryption]\n\nData stored on disk relies entirely on the security of the disk and extends to the host system to ensure data security. RustFS server-side object encryption automatically encrypts data before it's stored on disk (encryption at rest). This approach guarantees that no data is written to unencrypted disks. This baseline security layer ensures the confidentiality, integrity, and authenticity of data at rest. RustFS supports both client-driven and automatic bucket default object encryption for maximum flexibility in data encryption.\n\nRustFS server-side encryption is compatible with Amazon AWS-S3 semantics (SSE-S3). RustFS extends baseline support for AWS KMS to include common enterprise KMS systems such as Hashicorp Vault and Thales Ciphertrust (formerly Gemalto KeySecure). RustFS also supports client-driven encryption (SSE-C), where applications can specify the data key used to encrypt objects. For both SSE-S3 and SSE-C, the RustFS server performs all encryption operations, including key rotation and object re-encryption.\n\nThrough automatic server-side encryption, RustFS encrypts each object with a unique key and applies multiple layers of additional encryption using dynamic encryption keys and keys derived from external KMS or client-provided keys. This secure and sophisticated approach is performed within RustFS without the need to handle multiple independent kernel and userspace encryption utilities.\n\nRustFS uses Authenticated Encryption with Associated Data (AEAD) schemes to encrypt/decrypt objects when objects are written to or read from object storage. RustFS AEAD encryption supports industry-standard encryption protocols such as AES-256-GCM and ChaCha20-Poly1305 to protect object data. RustFS's CPU-level optimizations (such as SIMD acceleration) ensure negligible performance overhead for encryption/decryption operations. Organizations can run automatic bucket-level encryption at any time rather than being forced to make suboptimal security choices.\n\n## RustFS Key Encryption Service [#rustfs-key-encryption-service]\n\nRustFS provides built-in options for key encryption. RustFS's Key Encryption Service (KES) is a stateless distributed key management system for high-performance applications. It's designed to run in Kubernetes and distribute encryption keys to applications. KES is a required component for RustFS server-side object encryption (SSE-S3).\n\nKES supports encryption operations on RustFS clusters and is a key mechanism for ensuring scalable and high-performance encryption operations. KES acts as an intermediary between RustFS clusters and external KMS, generating encryption keys as needed and performing encryption operations without being limited by KMS constraints. Therefore, there's still a central KMS that protects master keys and serves as the root of trust in the infrastructure. KES simplifies deployment and management by eliminating the need to bootstrap KMS for each set of applications. Instead, applications can request data encryption keys (DEKs) from KES servers or ask KES servers to decrypt encrypted DEKs.\n\nSince KES servers are completely stateless, they can be automatically scaled, such as through Kubernetes Horizontal Pod Autoscaler. Additionally, since KES independently handles the vast majority of application requests, the load on the central KMS doesn't increase significantly.\n\nFor Kubernetes environments, the RustFS Kubernetes Operator supports deploying and configuring KES for each tenant, enabling SSE-S3 as part of each tenant deployment.\n\n<Mermaid\n  chart=\"flowchart LR\n  Client[&#x22;RustFS Server · KES Client&#x22;]\n  KES[&#x22;RustFS KES Server&#x22;]\n  ExtKMS[&#x22;External KMS&#x22;]\n  Client <-->|TLS| KES\n  KES <-->|TLS| ExtKMS\n  subgraph FLOW[&#x22;Key Flow&#x22;]\n    App[&#x22;Application&#x22;]\n    NewKey[&#x22;Create / Fetch DEK&#x22;]\n    App --> NewKey\n  end\n  subgraph AUTH[&#x22;Authentication&#x22;]\n    Certs[&#x22;Key / Cert pairs&#x22;]\n    Identity[&#x22;Identity = Hash of Cert&#x22;]\n    Certs --> Identity\n  end\n  App -.->|API| KES\n  Identity -.-> KES\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  class KES server\n  class ExtKMS store\n  class Client,App svc\n  class NewKey,Certs,Identity muted\"\n/>\n\n## Supported External Key Management Systems [#supported-external-key-management-systems]\n\n| <img alt=\"AWS KMS\" src=\"__img0\" />         | <img alt=\"HashiCorp Vault\" src=\"__img1\" />    | <img alt=\"Google Secret Manager\" src=\"__img2\" /> |\n| ------------------------------------------ | --------------------------------------------- | ------------------------------------------------ |\n| <img alt=\"Azure Key Vault\" src=\"__img3\" /> | <img alt=\"Thales CipherTrust\" src=\"__img4\" /> | <img alt=\"Fortanix\" src=\"__img5\" />              |\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "In the object storage field, robust encryption is a fundamental requirement for enterprise storage. RustFS provides more functionality through the highest level of encryption and extensive optimizations, minimizing the performance overhead typically associated with storage encryption operations."
		},
		{
			"heading": void 0,
			"content": "RustFS encrypts data both when stored on disk and when transmitted over the network. RustFS's state-of-the-art encryption scheme supports fine-grained object-level encryption using modern industry-standard encryption algorithms such as AES-256-GCM, ChaCha20-Poly1305, and AES-CBC. RustFS is fully compatible with S3 encryption semantics and also extends S3 by supporting non-AWS key management services such as Hashicorp Vault, Gemalto KeySecure, and Google Secrets Manager."
		},
		{
			"heading": "network-encryption",
			"content": "When data is transmitted between object storage and applications, it may bounce between any number of unknown and/or untrusted networks. Encrypting data while it's transmitted over the network (also known as \"in transit\") successfully mitigates man-in-the-middle attacks and ensures data remains secure regardless of the routing path taken."
		},
		{
			"heading": "network-encryption",
			"content": "RustFS supports Transport Layer Security (TLS) v1.2+ between all components in the cluster. This approach ensures there are no weak links in encrypted traffic between or within clusters. TLS is a ubiquitous encryption framework: it's the same encryption protocol used by banks, e-commerce websites, and other enterprise-level systems that rely on data storage encryption."
		},
		{
			"heading": "network-encryption",
			"content": "RustFS's TLS implementation is optimized at the CPU instruction level with negligible performance overhead. It only requires specifying TLS private keys and public certificates for each RustFS server in the cluster. For Kubernetes environments, the RustFS Kubernetes Operator integrates/automatically generates and assigns TLS certificates during tenant deployment. RustFS supports multiple TLS certificates, where each certificate corresponds to a specific domain name. RustFS uses Server Name Indication (SNI) to determine which certificate to serve for any given request."
		},
		{
			"heading": "object-encryption",
			"content": "Data stored on disk relies entirely on the security of the disk and extends to the host system to ensure data security. RustFS server-side object encryption automatically encrypts data before it's stored on disk (encryption at rest). This approach guarantees that no data is written to unencrypted disks. This baseline security layer ensures the confidentiality, integrity, and authenticity of data at rest. RustFS supports both client-driven and automatic bucket default object encryption for maximum flexibility in data encryption."
		},
		{
			"heading": "object-encryption",
			"content": "RustFS server-side encryption is compatible with Amazon AWS-S3 semantics (SSE-S3). RustFS extends baseline support for AWS KMS to include common enterprise KMS systems such as Hashicorp Vault and Thales Ciphertrust (formerly Gemalto KeySecure). RustFS also supports client-driven encryption (SSE-C), where applications can specify the data key used to encrypt objects. For both SSE-S3 and SSE-C, the RustFS server performs all encryption operations, including key rotation and object re-encryption."
		},
		{
			"heading": "object-encryption",
			"content": "Through automatic server-side encryption, RustFS encrypts each object with a unique key and applies multiple layers of additional encryption using dynamic encryption keys and keys derived from external KMS or client-provided keys. This secure and sophisticated approach is performed within RustFS without the need to handle multiple independent kernel and userspace encryption utilities."
		},
		{
			"heading": "object-encryption",
			"content": "RustFS uses Authenticated Encryption with Associated Data (AEAD) schemes to encrypt/decrypt objects when objects are written to or read from object storage. RustFS AEAD encryption supports industry-standard encryption protocols such as AES-256-GCM and ChaCha20-Poly1305 to protect object data. RustFS's CPU-level optimizations (such as SIMD acceleration) ensure negligible performance overhead for encryption/decryption operations. Organizations can run automatic bucket-level encryption at any time rather than being forced to make suboptimal security choices."
		},
		{
			"heading": "rustfs-key-encryption-service",
			"content": "RustFS provides built-in options for key encryption. RustFS's Key Encryption Service (KES) is a stateless distributed key management system for high-performance applications. It's designed to run in Kubernetes and distribute encryption keys to applications. KES is a required component for RustFS server-side object encryption (SSE-S3)."
		},
		{
			"heading": "rustfs-key-encryption-service",
			"content": "KES supports encryption operations on RustFS clusters and is a key mechanism for ensuring scalable and high-performance encryption operations. KES acts as an intermediary between RustFS clusters and external KMS, generating encryption keys as needed and performing encryption operations without being limited by KMS constraints. Therefore, there's still a central KMS that protects master keys and serves as the root of trust in the infrastructure. KES simplifies deployment and management by eliminating the need to bootstrap KMS for each set of applications. Instead, applications can request data encryption keys (DEKs) from KES servers or ask KES servers to decrypt encrypted DEKs."
		},
		{
			"heading": "rustfs-key-encryption-service",
			"content": "Since KES servers are completely stateless, they can be automatically scaled, such as through Kubernetes Horizontal Pod Autoscaler. Additionally, since KES independently handles the vast majority of application requests, the load on the central KMS doesn't increase significantly."
		},
		{
			"heading": "rustfs-key-encryption-service",
			"content": "For Kubernetes environments, the RustFS Kubernetes Operator supports deploying and configuring KES for each tenant, enabling SSE-S3 as part of each tenant deployment."
		}
	],
	"headings": [
		{
			"id": "network-encryption",
			"content": "Network Encryption"
		},
		{
			"id": "object-encryption",
			"content": "Object Encryption"
		},
		{
			"id": "rustfs-key-encryption-service",
			"content": "RustFS Key Encryption Service"
		},
		{
			"id": "supported-external-key-management-systems",
			"content": "Supported External Key Management Systems"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#network-encryption",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Network Encryption" })
	},
	{
		depth: 2,
		url: "#object-encryption",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Object Encryption" })
	},
	{
		depth: 2,
		url: "#rustfs-key-encryption-service",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "RustFS Key Encryption Service" })
	},
	{
		depth: 2,
		url: "#supported-external-key-management-systems",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Supported External Key Management Systems" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		img: "img",
		p: "p",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		...props.components
	}, { Mermaid } = _components;
	if (!Mermaid) _missingMdxReference("Mermaid", true);
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "In the object storage field, robust encryption is a fundamental requirement for enterprise storage. RustFS provides more functionality through the highest level of encryption and extensive optimizations, minimizing the performance overhead typically associated with storage encryption operations." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n  subgraph DATA[\"Data\"]\n    SSES3[\"SSE-S3\"]\n    SSEC[\"SSE-C\"]\n  end\n  R([\"RustFS\"])\n  KMS[(\"KMS\")]\n  subgraph B1[\"My Bucket\"]\n    OBJ1[\"Object\"]\n  end\n  subgraph META1[\"Object Metadata\"]\n    M1A[\"Random IV\"]\n    M1B[\"Sealed Object Key\"]\n    M1C[\"KMS Key ID\"]\n    M1D[\"Sealed KMS Data Key\"]\n  end\n  SSES3 --> R\n  SSEC --> R\n  KMS --- R\n  R --> OBJ1\n  OBJ1 --> META1\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;\n  class R server\n  class KMS store\n  class SSES3,SSEC muted\n  class OBJ1 svc\n  class M1A,M1B,M1C,M1D accent" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS encrypts data both when stored on disk and when transmitted over the network. RustFS's state-of-the-art encryption scheme supports fine-grained object-level encryption using modern industry-standard encryption algorithms such as AES-256-GCM, ChaCha20-Poly1305, and AES-CBC. RustFS is fully compatible with S3 encryption semantics and also extends S3 by supporting non-AWS key management services such as Hashicorp Vault, Gemalto KeySecure, and Google Secrets Manager." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "network-encryption",
			children: "Network Encryption"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "When data is transmitted between object storage and applications, it may bounce between any number of unknown and/or untrusted networks. Encrypting data while it's transmitted over the network (also known as \"in transit\") successfully mitigates man-in-the-middle attacks and ensures data remains secure regardless of the routing path taken." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports Transport Layer Security (TLS) v1.2+ between all components in the cluster. This approach ensures there are no weak links in encrypted traffic between or within clusters. TLS is a ubiquitous encryption framework: it's the same encryption protocol used by banks, e-commerce websites, and other enterprise-level systems that rely on data storage encryption." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS's TLS implementation is optimized at the CPU instruction level with negligible performance overhead. It only requires specifying TLS private keys and public certificates for each RustFS server in the cluster. For Kubernetes environments, the RustFS Kubernetes Operator integrates/automatically generates and assigns TLS certificates during tenant deployment. RustFS supports multiple TLS certificates, where each certificate corresponds to a specific domain name. RustFS uses Server Name Indication (SNI) to determine which certificate to serve for any given request." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "object-encryption",
			children: "Object Encryption"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Data stored on disk relies entirely on the security of the disk and extends to the host system to ensure data security. RustFS server-side object encryption automatically encrypts data before it's stored on disk (encryption at rest). This approach guarantees that no data is written to unencrypted disks. This baseline security layer ensures the confidentiality, integrity, and authenticity of data at rest. RustFS supports both client-driven and automatic bucket default object encryption for maximum flexibility in data encryption." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS server-side encryption is compatible with Amazon AWS-S3 semantics (SSE-S3). RustFS extends baseline support for AWS KMS to include common enterprise KMS systems such as Hashicorp Vault and Thales Ciphertrust (formerly Gemalto KeySecure). RustFS also supports client-driven encryption (SSE-C), where applications can specify the data key used to encrypt objects. For both SSE-S3 and SSE-C, the RustFS server performs all encryption operations, including key rotation and object re-encryption." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Through automatic server-side encryption, RustFS encrypts each object with a unique key and applies multiple layers of additional encryption using dynamic encryption keys and keys derived from external KMS or client-provided keys. This secure and sophisticated approach is performed within RustFS without the need to handle multiple independent kernel and userspace encryption utilities." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS uses Authenticated Encryption with Associated Data (AEAD) schemes to encrypt/decrypt objects when objects are written to or read from object storage. RustFS AEAD encryption supports industry-standard encryption protocols such as AES-256-GCM and ChaCha20-Poly1305 to protect object data. RustFS's CPU-level optimizations (such as SIMD acceleration) ensure negligible performance overhead for encryption/decryption operations. Organizations can run automatic bucket-level encryption at any time rather than being forced to make suboptimal security choices." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rustfs-key-encryption-service",
			children: "RustFS Key Encryption Service"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS provides built-in options for key encryption. RustFS's Key Encryption Service (KES) is a stateless distributed key management system for high-performance applications. It's designed to run in Kubernetes and distribute encryption keys to applications. KES is a required component for RustFS server-side object encryption (SSE-S3)." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "KES supports encryption operations on RustFS clusters and is a key mechanism for ensuring scalable and high-performance encryption operations. KES acts as an intermediary between RustFS clusters and external KMS, generating encryption keys as needed and performing encryption operations without being limited by KMS constraints. Therefore, there's still a central KMS that protects master keys and serves as the root of trust in the infrastructure. KES simplifies deployment and management by eliminating the need to bootstrap KMS for each set of applications. Instead, applications can request data encryption keys (DEKs) from KES servers or ask KES servers to decrypt encrypted DEKs." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Since KES servers are completely stateless, they can be automatically scaled, such as through Kubernetes Horizontal Pod Autoscaler. Additionally, since KES independently handles the vast majority of application requests, the load on the central KMS doesn't increase significantly." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "For Kubernetes environments, the RustFS Kubernetes Operator supports deploying and configuring KES for each tenant, enabling SSE-S3 as part of each tenant deployment." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(Mermaid, { chart: "flowchart LR\n  Client[\"RustFS Server · KES Client\"]\n  KES[\"RustFS KES Server\"]\n  ExtKMS[\"External KMS\"]\n  Client <-->|TLS| KES\n  KES <-->|TLS| ExtKMS\n  subgraph FLOW[\"Key Flow\"]\n    App[\"Application\"]\n    NewKey[\"Create / Fetch DEK\"]\n    App --> NewKey\n  end\n  subgraph AUTH[\"Authentication\"]\n    Certs[\"Key / Cert pairs\"]\n    Identity[\"Identity = Hash of Cert\"]\n    Certs --> Identity\n  end\n  App -.->|API| KES\n  Identity -.-> KES\n  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;\n  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;\n  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;\n  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;\n  class KES server\n  class ExtKMS store\n  class Client,App svc\n  class NewKey,Certs,Identity muted" }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "supported-external-key-management-systems",
			children: "Supported External Key Management Systems"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsxs)(_components.table, { children: [(0, import_jsx_runtime_react_server.jsx)(_components.thead, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
				alt: "AWS KMS",
				src: s5i_1_default
			}) }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
				alt: "HashiCorp Vault",
				src: s5i_2_default
			}) }),
			(0, import_jsx_runtime_react_server.jsx)(_components.th, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
				alt: "Google Secret Manager",
				src: s5i_3_default
			}) })
		] }) }), (0, import_jsx_runtime_react_server.jsx)(_components.tbody, { children: (0, import_jsx_runtime_react_server.jsxs)(_components.tr, { children: [
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
				alt: "Azure Key Vault",
				src: s5i_4_default
			}) }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
				alt: "Thales CipherTrust",
				src: s5i_5_default
			}) }),
			(0, import_jsx_runtime_react_server.jsx)(_components.td, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
				alt: "Fortanix",
				src: s5i_6_default
			}) })
		] }) })] })
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
