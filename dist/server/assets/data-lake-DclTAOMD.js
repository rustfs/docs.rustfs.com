import { t as require_jsx_runtime_react_server } from "./jsx-runtime.react-server-QbbOnoNG.js";
//#region content/features/data-lake/images/data-lake-architecture.png
var import_jsx_runtime_react_server = require_jsx_runtime_react_server();
var data_lake_architecture_default = "/assets/data-lake-architecture-Cc_htHYl.png";
//#endregion
//#region content/features/data-lake/images/table-formats.png
var table_formats_default = "/assets/table-formats-caZbqkhY.png";
//#endregion
//#region content/features/data-lake/images/multi-engine-1.svg
var multi_engine_1_default = "/assets/multi-engine-1-acHL8KNV.svg";
//#endregion
//#region content/features/data-lake/images/multi-engine-2.svg
var multi_engine_2_default = "/assets/multi-engine-2-C6g2MNQf.svg";
//#endregion
//#region content/features/data-lake/index.md?collection=docs
var frontmatter = {
	"title": "RustFS for Modern Data Lakes",
	"description": "Modern data lakes and lakehouse architectures rely on object storage. RustFS provides a unified storage solution for modern data lakes/lakehouses that can…"
};
var _markdown = "\n\n\n\n\n\n\n\n\n\nModern data lakes and lakehouse architectures rely on object storage. RustFS provides a unified storage solution for modern data lakes/lakehouses that can run anywhere: private cloud, public cloud, colos, bare metal, and edge.\n\n<img alt=\"Data Lake Architecture\" src=\"__img0\" />\n\n## Open Table Format Ready [#open-table-format-ready]\n\n<img alt=\"Table Formats\" src=\"__img1\" />\n\nModern data lakes are multi-engine. They require central table storage, portable metadata, access control, and persistent structure. RustFS supports all major table formats, including Iceberg, Hudi, and Delta Lake.\n\n## Cloud Native [#cloud-native]\n\nRustFS operates on cloud principles: containerization, orchestration, microservices, APIs, infrastructure as code, and automation. The cloud-native ecosystem integrates seamlessly with RustFS, including Spark, Presto/Trino, Snowflake, Dremio, NiFi, Kafka, Prometheus, OpenObserve, Istio, Linkerd, Hashicorp Vault, and Keycloak.\n\n## Multi-Engine [#multi-engine]\n\nRustFS supports all S3-compatible query engines.\n\n<img alt=\"Multi-Engine Support\" src=\"__img2\" />\n\n<img alt=\"Multi-Engine Support\" src=\"__img3\" />\n\n## Performance [#performance]\n\nModern data lakes require high performance. RustFS benchmarks demonstrate superior performance compared to legacy Hadoop systems, improving query engine (Spark, Presto, Trino, Snowflake, SQL Server, Teradata) and AI/ML platform (MLflow, Kubeflow) efficiency.\n\nBenchmarks show 325 GiB/s (349 GB/s) on GET and 165 GiB/s (177 GB/s) on PUT with 32 NVMe SSD nodes.\n\n## Lightweight [#lightweight]\n\nThe RustFS server binary is \\< 100 MB. It is robust enough for data centers and lightweight enough for the edge. Enterprises can access data anywhere with the same S3 API. RustFS edge locations and replication capabilities allow data capture and filtering at the edge before aggregation.\n\n## Decomposition [#decomposition]\n\nModern data lakes separate compute and storage. High-speed query processing engines outsource storage to high-throughput object storage like RustFS. By keeping subsets of data in memory and leveraging features like predicate pushdown (S3 Select) and external tables, query engines gain flexibility.\n\n## Open Source [#open-source]\n\nOpen source is a key driver for data lake adoption. RustFS is 100% open source, ensuring freedom from lock-in.\n\n## Rapid Growth [#rapid-growth]\n\nData is constantly being generated, which means it must be constantly ingested - without causing indigestion. RustFS is built for this world and works out of the box with Kafka, Flink, RabbitMQ, and numerous other solutions. The result is that the data lake/lakehouse becomes a single source of truth that can seamlessly scale to exabytes and beyond.\n\nRustFS has multiple customers with daily data ingestion exceeding 250PB.\n\n## Simplicity [#simplicity]\n\nSimplicity is hard. It requires work, discipline, and most importantly, commitment. RustFS prioritizes simplicity in design and operation and is a philosophical commitment that makes our software easy to deploy, use, upgrade, and scale. Modern data lakes don't have to be complex. There are a few parts, and we're committed to ensuring RustFS is the easiest to adopt and deploy.\n\n## ELT or ETL - It Just Works [#elt-or-etl---it-just-works]\n\nRustFS doesn't just work with every data streaming protocol, but every data pipeline - every data streaming protocol and data pipeline works with RustFS. Every vendor has been extensively tested, and typically, data pipelines have resilience and performance.\n\n## Resilience [#resilience]\n\nRustFS protects data using inline erasure coding for each object, which is far more efficient than the HDFS replication alternatives that were never adopted. Additionally, RustFS's bitrot detection ensures it never reads corrupted data - capturing and repairing corrupted data dynamically for objects. RustFS also supports cross-region, active-active replication. Finally, RustFS supports a complete object locking framework providing legal hold and retention (with governance and compliance modes).\n\n## Software Defined [#software-defined]\n\nThe successor to Hadoop HDFS is not a hardware appliance but software running on commodity hardware. This is the essence of RustFS - software. Like Hadoop HDFS, RustFS is designed to take full advantage of commodity servers. By leveraging NVMe drives and 100 GbE networks, RustFS can shrink data centers, thereby improving operational efficiency and manageability. In fact, companies building alternative data lakes reduce their hardware footprint by 60% or more while improving performance and reducing the FTEs required to manage it.\n\n## Security [#security]\n\nRustFS supports multiple sophisticated server-side encryption schemes to protect data wherever it resides, whether in flight or at rest. RustFS's approach ensures confidentiality, integrity, and authenticity with negligible performance overhead. Server-side and client-side encryption support using AES-256-GCM, ChaCha20-Poly1305, and AES-CBC ensures application compatibility. Additionally, RustFS supports industry-leading key management systems (KMS).\n";
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Modern data lakes and lakehouse architectures rely on object storage. RustFS provides a unified storage solution for modern data lakes/lakehouses that can run anywhere: private cloud, public cloud, colos, bare metal, and edge."
		},
		{
			"heading": "open-table-format-ready",
			"content": "Modern data lakes are multi-engine. They require central table storage, portable metadata, access control, and persistent structure. RustFS supports all major table formats, including Iceberg, Hudi, and Delta Lake."
		},
		{
			"heading": "cloud-native",
			"content": "RustFS operates on cloud principles: containerization, orchestration, microservices, APIs, infrastructure as code, and automation. The cloud-native ecosystem integrates seamlessly with RustFS, including Spark, Presto/Trino, Snowflake, Dremio, NiFi, Kafka, Prometheus, OpenObserve, Istio, Linkerd, Hashicorp Vault, and Keycloak."
		},
		{
			"heading": "multi-engine",
			"content": "RustFS supports all S3-compatible query engines."
		},
		{
			"heading": "performance",
			"content": "Modern data lakes require high performance. RustFS benchmarks demonstrate superior performance compared to legacy Hadoop systems, improving query engine (Spark, Presto, Trino, Snowflake, SQL Server, Teradata) and AI/ML platform (MLflow, Kubeflow) efficiency."
		},
		{
			"heading": "performance",
			"content": "Benchmarks show 325 GiB/s (349 GB/s) on GET and 165 GiB/s (177 GB/s) on PUT with 32 NVMe SSD nodes."
		},
		{
			"heading": "lightweight",
			"content": "The RustFS server binary is \\< 100 MB. It is robust enough for data centers and lightweight enough for the edge. Enterprises can access data anywhere with the same S3 API. RustFS edge locations and replication capabilities allow data capture and filtering at the edge before aggregation."
		},
		{
			"heading": "decomposition",
			"content": "Modern data lakes separate compute and storage. High-speed query processing engines outsource storage to high-throughput object storage like RustFS. By keeping subsets of data in memory and leveraging features like predicate pushdown (S3 Select) and external tables, query engines gain flexibility."
		},
		{
			"heading": "open-source",
			"content": "Open source is a key driver for data lake adoption. RustFS is 100% open source, ensuring freedom from lock-in."
		},
		{
			"heading": "rapid-growth",
			"content": "Data is constantly being generated, which means it must be constantly ingested - without causing indigestion. RustFS is built for this world and works out of the box with Kafka, Flink, RabbitMQ, and numerous other solutions. The result is that the data lake/lakehouse becomes a single source of truth that can seamlessly scale to exabytes and beyond."
		},
		{
			"heading": "rapid-growth",
			"content": "RustFS has multiple customers with daily data ingestion exceeding 250PB."
		},
		{
			"heading": "simplicity",
			"content": "Simplicity is hard. It requires work, discipline, and most importantly, commitment. RustFS prioritizes simplicity in design and operation and is a philosophical commitment that makes our software easy to deploy, use, upgrade, and scale. Modern data lakes don't have to be complex. There are a few parts, and we're committed to ensuring RustFS is the easiest to adopt and deploy."
		},
		{
			"heading": "elt-or-etl---it-just-works",
			"content": "RustFS doesn't just work with every data streaming protocol, but every data pipeline - every data streaming protocol and data pipeline works with RustFS. Every vendor has been extensively tested, and typically, data pipelines have resilience and performance."
		},
		{
			"heading": "resilience",
			"content": "RustFS protects data using inline erasure coding for each object, which is far more efficient than the HDFS replication alternatives that were never adopted. Additionally, RustFS's bitrot detection ensures it never reads corrupted data - capturing and repairing corrupted data dynamically for objects. RustFS also supports cross-region, active-active replication. Finally, RustFS supports a complete object locking framework providing legal hold and retention (with governance and compliance modes)."
		},
		{
			"heading": "software-defined",
			"content": "The successor to Hadoop HDFS is not a hardware appliance but software running on commodity hardware. This is the essence of RustFS - software. Like Hadoop HDFS, RustFS is designed to take full advantage of commodity servers. By leveraging NVMe drives and 100 GbE networks, RustFS can shrink data centers, thereby improving operational efficiency and manageability. In fact, companies building alternative data lakes reduce their hardware footprint by 60% or more while improving performance and reducing the FTEs required to manage it."
		},
		{
			"heading": "security",
			"content": "RustFS supports multiple sophisticated server-side encryption schemes to protect data wherever it resides, whether in flight or at rest. RustFS's approach ensures confidentiality, integrity, and authenticity with negligible performance overhead. Server-side and client-side encryption support using AES-256-GCM, ChaCha20-Poly1305, and AES-CBC ensures application compatibility. Additionally, RustFS supports industry-leading key management systems (KMS)."
		}
	],
	"headings": [
		{
			"id": "open-table-format-ready",
			"content": "Open Table Format Ready"
		},
		{
			"id": "cloud-native",
			"content": "Cloud Native"
		},
		{
			"id": "multi-engine",
			"content": "Multi-Engine"
		},
		{
			"id": "performance",
			"content": "Performance"
		},
		{
			"id": "lightweight",
			"content": "Lightweight"
		},
		{
			"id": "decomposition",
			"content": "Decomposition"
		},
		{
			"id": "open-source",
			"content": "Open Source"
		},
		{
			"id": "rapid-growth",
			"content": "Rapid Growth"
		},
		{
			"id": "simplicity",
			"content": "Simplicity"
		},
		{
			"id": "elt-or-etl---it-just-works",
			"content": "ELT or ETL - It Just Works"
		},
		{
			"id": "resilience",
			"content": "Resilience"
		},
		{
			"id": "software-defined",
			"content": "Software Defined"
		},
		{
			"id": "security",
			"content": "Security"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#open-table-format-ready",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Open Table Format Ready" })
	},
	{
		depth: 2,
		url: "#cloud-native",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Cloud Native" })
	},
	{
		depth: 2,
		url: "#multi-engine",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Multi-Engine" })
	},
	{
		depth: 2,
		url: "#performance",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Performance" })
	},
	{
		depth: 2,
		url: "#lightweight",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Lightweight" })
	},
	{
		depth: 2,
		url: "#decomposition",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Decomposition" })
	},
	{
		depth: 2,
		url: "#open-source",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Open Source" })
	},
	{
		depth: 2,
		url: "#rapid-growth",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Rapid Growth" })
	},
	{
		depth: 2,
		url: "#simplicity",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Simplicity" })
	},
	{
		depth: 2,
		url: "#elt-or-etl---it-just-works",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "ELT or ETL - It Just Works" })
	},
	{
		depth: 2,
		url: "#resilience",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Resilience" })
	},
	{
		depth: 2,
		url: "#software-defined",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Software Defined" })
	},
	{
		depth: 2,
		url: "#security",
		title: (0, import_jsx_runtime_react_server.jsx)(import_jsx_runtime_react_server.Fragment, { children: "Security" })
	}
];
function _createMdxContent(props) {
	const _components = {
		h2: "h2",
		img: "img",
		p: "p",
		...props.components
	};
	return (0, import_jsx_runtime_react_server.jsxs)(import_jsx_runtime_react_server.Fragment, { children: [
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Modern data lakes and lakehouse architectures rely on object storage. RustFS provides a unified storage solution for modern data lakes/lakehouses that can run anywhere: private cloud, public cloud, colos, bare metal, and edge." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
			alt: "Data Lake Architecture",
			src: data_lake_architecture_default
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "open-table-format-ready",
			children: "Open Table Format Ready"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
			alt: "Table Formats",
			src: table_formats_default
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Modern data lakes are multi-engine. They require central table storage, portable metadata, access control, and persistent structure. RustFS supports all major table formats, including Iceberg, Hudi, and Delta Lake." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "cloud-native",
			children: "Cloud Native"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS operates on cloud principles: containerization, orchestration, microservices, APIs, infrastructure as code, and automation. The cloud-native ecosystem integrates seamlessly with RustFS, including Spark, Presto/Trino, Snowflake, Dremio, NiFi, Kafka, Prometheus, OpenObserve, Istio, Linkerd, Hashicorp Vault, and Keycloak." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "multi-engine",
			children: "Multi-Engine"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports all S3-compatible query engines." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
			alt: "Multi-Engine Support",
			src: multi_engine_1_default
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: (0, import_jsx_runtime_react_server.jsx)(_components.img, {
			alt: "Multi-Engine Support",
			src: multi_engine_2_default
		}) }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "performance",
			children: "Performance"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Modern data lakes require high performance. RustFS benchmarks demonstrate superior performance compared to legacy Hadoop systems, improving query engine (Spark, Presto, Trino, Snowflake, SQL Server, Teradata) and AI/ML platform (MLflow, Kubeflow) efficiency." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Benchmarks show 325 GiB/s (349 GB/s) on GET and 165 GiB/s (177 GB/s) on PUT with 32 NVMe SSD nodes." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "lightweight",
			children: "Lightweight"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The RustFS server binary is < 100 MB. It is robust enough for data centers and lightweight enough for the edge. Enterprises can access data anywhere with the same S3 API. RustFS edge locations and replication capabilities allow data capture and filtering at the edge before aggregation." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "decomposition",
			children: "Decomposition"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Modern data lakes separate compute and storage. High-speed query processing engines outsource storage to high-throughput object storage like RustFS. By keeping subsets of data in memory and leveraging features like predicate pushdown (S3 Select) and external tables, query engines gain flexibility." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "open-source",
			children: "Open Source"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Open source is a key driver for data lake adoption. RustFS is 100% open source, ensuring freedom from lock-in." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "rapid-growth",
			children: "Rapid Growth"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Data is constantly being generated, which means it must be constantly ingested - without causing indigestion. RustFS is built for this world and works out of the box with Kafka, Flink, RabbitMQ, and numerous other solutions. The result is that the data lake/lakehouse becomes a single source of truth that can seamlessly scale to exabytes and beyond." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS has multiple customers with daily data ingestion exceeding 250PB." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "simplicity",
			children: "Simplicity"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "Simplicity is hard. It requires work, discipline, and most importantly, commitment. RustFS prioritizes simplicity in design and operation and is a philosophical commitment that makes our software easy to deploy, use, upgrade, and scale. Modern data lakes don't have to be complex. There are a few parts, and we're committed to ensuring RustFS is the easiest to adopt and deploy." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "elt-or-etl---it-just-works",
			children: "ELT or ETL - It Just Works"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS doesn't just work with every data streaming protocol, but every data pipeline - every data streaming protocol and data pipeline works with RustFS. Every vendor has been extensively tested, and typically, data pipelines have resilience and performance." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "resilience",
			children: "Resilience"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS protects data using inline erasure coding for each object, which is far more efficient than the HDFS replication alternatives that were never adopted. Additionally, RustFS's bitrot detection ensures it never reads corrupted data - capturing and repairing corrupted data dynamically for objects. RustFS also supports cross-region, active-active replication. Finally, RustFS supports a complete object locking framework providing legal hold and retention (with governance and compliance modes)." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "software-defined",
			children: "Software Defined"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "The successor to Hadoop HDFS is not a hardware appliance but software running on commodity hardware. This is the essence of RustFS - software. Like Hadoop HDFS, RustFS is designed to take full advantage of commodity servers. By leveraging NVMe drives and 100 GbE networks, RustFS can shrink data centers, thereby improving operational efficiency and manageability. In fact, companies building alternative data lakes reduce their hardware footprint by 60% or more while improving performance and reducing the FTEs required to manage it." }),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.h2, {
			id: "security",
			children: "Security"
		}),
		"\n",
		(0, import_jsx_runtime_react_server.jsx)(_components.p, { children: "RustFS supports multiple sophisticated server-side encryption schemes to protect data wherever it resides, whether in flight or at rest. RustFS's approach ensures confidentiality, integrity, and authenticity with negligible performance overhead. Server-side and client-side encryption support using AES-256-GCM, ChaCha20-Poly1305, and AES-CBC ensures application compatibility. Additionally, RustFS supports industry-leading key management systems (KMS)." })
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
