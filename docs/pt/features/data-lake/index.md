# RustFS para data lakes modernos

Data lakes e lakehouses modernos assentam em armazenamento de objetos moderno – isto é, sobre RustFS.

**RustFS fornece armazenamento unificado para data lakes/lakehouses modernos, executando em qualquer ambiente: privado, público, colocation, bare‑metal e edge – rápido, escalável, cloud‑native e pronto para uso.**

![Arquitetura do data lake](images/data-lake-architecture.png)

## Pronto para formatos de tabela abertos

![Formatos de tabela](images/table-formats.png)

Data lakes modernos são multi‑engine (Spark, Flink, Trino, Arrow, Dask, etc.) e requerem armazenamento de tabelas central, portabilidade, controlo de acesso e estruturas persistentes. Formatos como Iceberg, Hudi e Delta Lake atendem a essas necessidades e são suportados pelo RustFS.

## Cloud‑native

Nascido na cloud e aderente a contentores, orquestração, microserviços, APIs, IaC e automação. Ecossistemas cloud‑native “funcionam juntos” com o RustFS: de Spark a Trino, de Snowflake a Dremio, de NiFi a Kafka, de Prometheus a OpenObserve, de Istio a Linkerd, de HashiCorp Vault a Keycloak.

## Multi‑engine

Compatível com todos os motores que falam S3. Se faltar algum, fale connosco.

![Multi‑engine](images/multi-engine-1.svg)

![Multi‑engine](images/multi-engine-2.svg)

## Performance

Data lakes exigem performance maciça e consistente. O RustFS supera arquiteturas legadas e tem caminhos de migração claros. Isso beneficia motores de consulta (Spark, Presto/Trino, Snowflake, SQL Server, Teradata, etc.) e plataformas AI/ML (MLflow, Kubeflow).

Publicamos benchmarks reproduzíveis.

## Leve

Binário de servidor <100 MB. Potente no data center, pequeno o suficiente para o edge. Aplicações S3 usam as mesmas APIs em qualquer lugar. Com replicação, capturamos/filtramos dados no edge e enviamos ao cluster central para agregação e análise.

## Desacoplado

Processamento de consulta e storage desacoplados: motores focam em otimização de query e o RustFS em throughput. Com subsets em memória, S3 Select/predicate pushdown e tabelas externas, os motores ganham flexibilidade.

## Open source

Empresas que adotaram Hadoop valorizam open source. Como sucessor lógico, esperam data lakes abertos. O RustFS é 100% open source, oferecendo verificabilidade e sem lock‑in.

## Ingestão contínua

Dados são gerados continuamente. RustFS integra‑se com Kafka, Flink, RabbitMQ e mais, para que o lake/lakehouse seja a fonte única de verdade e escale até EB.

## Simples

Simplicidade exige disciplina e compromisso. Nosso objetivo é tornar o RustFS fácil de instalar, usar, atualizar e escalar, reduzindo as partes móveis para acelerar a adoção.
