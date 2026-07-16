# RustFS for Modern Data Lakes (/features/data-lake)











Modern data lakes and lakehouse architectures rely on object storage. RustFS provides a unified storage solution for modern data lakes/lakehouses that can run anywhere: private cloud, public cloud, colos, bare metal, and edge.

<img alt="Data Lake Architecture" src="__img0" />

## Open Table Format Ready [#open-table-format-ready]

<img alt="Table Formats" src="__img1" />

Modern data lakes are multi-engine. They require central table storage, portable metadata, access control, and persistent structure. RustFS supports all major table formats, including Iceberg, Hudi, and Delta Lake.

## Cloud Native [#cloud-native]

RustFS operates on cloud principles: containerization, orchestration, microservices, APIs, infrastructure as code, and automation. The cloud-native ecosystem integrates seamlessly with RustFS, including Spark, Presto/Trino, Snowflake, Dremio, NiFi, Kafka, Prometheus, OpenObserve, Istio, Linkerd, Hashicorp Vault, and Keycloak.

## Multi-Engine [#multi-engine]

RustFS supports all S3-compatible query engines.

<img alt="Multi-Engine Support" src="__img2" />

<img alt="Multi-Engine Support" src="__img3" />

## Performance [#performance]

Modern data lakes require high performance. RustFS benchmarks demonstrate superior performance compared to legacy Hadoop systems, improving query engine (Spark, Presto, Trino, Snowflake, SQL Server, Teradata) and AI/ML platform (MLflow, Kubeflow) efficiency.

Benchmarks show 325 GiB/s (349 GB/s) on GET and 165 GiB/s (177 GB/s) on PUT with 32 NVMe SSD nodes.

## Lightweight [#lightweight]

The RustFS server binary is \< 100 MB. It is robust enough for data centers and lightweight enough for the edge. Enterprises can access data anywhere with the same S3 API. RustFS edge locations and replication capabilities allow data capture and filtering at the edge before aggregation.

## Decomposition [#decomposition]

Modern data lakes separate compute and storage. High-speed query processing engines outsource storage to high-throughput object storage like RustFS. By keeping subsets of data in memory and leveraging features like predicate pushdown (S3 Select) and external tables, query engines gain flexibility.

## Open Source [#open-source]

Open source is a key driver for data lake adoption. RustFS is 100% open source, ensuring freedom from lock-in.

## Rapid Growth [#rapid-growth]

Data is constantly being generated, which means it must be constantly ingested - without causing indigestion. RustFS is built for this world and works out of the box with Kafka, Flink, RabbitMQ, and numerous other solutions. The result is that the data lake/lakehouse becomes a single source of truth that can seamlessly scale to exabytes and beyond.

RustFS has multiple customers with daily data ingestion exceeding 250PB.

## Simplicity [#simplicity]

Simplicity is hard. It requires work, discipline, and most importantly, commitment. RustFS prioritizes simplicity in design and operation and is a philosophical commitment that makes our software easy to deploy, use, upgrade, and scale. Modern data lakes don't have to be complex. There are a few parts, and we're committed to ensuring RustFS is the easiest to adopt and deploy.

## ELT or ETL - It Just Works [#elt-or-etl---it-just-works]

RustFS doesn't just work with every data streaming protocol, but every data pipeline - every data streaming protocol and data pipeline works with RustFS. Every vendor has been extensively tested, and typically, data pipelines have resilience and performance.

## Resilience [#resilience]

RustFS protects data using inline erasure coding for each object, which is far more efficient than the HDFS replication alternatives that were never adopted. Additionally, RustFS's bitrot detection ensures it never reads corrupted data - capturing and repairing corrupted data dynamically for objects. RustFS also supports cross-region, active-active replication. Finally, RustFS supports a complete object locking framework providing legal hold and retention (with governance and compliance modes).

## Software Defined [#software-defined]

The successor to Hadoop HDFS is not a hardware appliance but software running on commodity hardware. This is the essence of RustFS - software. Like Hadoop HDFS, RustFS is designed to take full advantage of commodity servers. By leveraging NVMe drives and 100 GbE networks, RustFS can shrink data centers, thereby improving operational efficiency and manageability. In fact, companies building alternative data lakes reduce their hardware footprint by 60% or more while improving performance and reducing the FTEs required to manage it.

## Security [#security]

RustFS supports multiple sophisticated server-side encryption schemes to protect data wherever it resides, whether in flight or at rest. RustFS's approach ensures confidentiality, integrity, and authenticity with negligible performance overhead. Server-side and client-side encryption support using AES-256-GCM, ChaCha20-Poly1305, and AES-CBC ensures application compatibility. Additionally, RustFS supports industry-leading key management systems (KMS).
