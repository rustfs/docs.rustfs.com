---
title: "Compatibilidade com Amazon S3"
description: "RustFS compatível com S3 para workloads multi‑cloud e bare metal"
---

# Compatibilidade com Amazon S3

A compatibilidade S3 é essencial para aplicações cloud‑native. Com uma comunidade vasta e foco em API, o RustFS oferece uma implementação S3 amplamente testada e adotada como alternativa ao AWS S3.

## RustFS e API S3 – desenhado para multi‑cloud

Desde o início, o RustFS definiu‑se pelo compromisso com o S3. Como um dos primeiros a adotar S3 V2/V4 e focado nesse protocolo, a comunidade assegura o mais alto nível de compatibilidade. Sendo o padrão de facto na cloud, o S3 permite operar e interoperar em público/privado/data center/multi‑cloud/híbrido/borda.

## S3 para híbrido e multi‑cloud

A compatibilidade multi/híbrida passa por S3. Como API RESTful, o S3 mudou a interação entre aplicações, dados e infraestrutura. O ecossistema cloud‑native (contentores/Kubernetes) é construído em torno de APIs RESTful, enquanto POSIX torna‑se legado.

Na prática, armazenamento e aplicações S3‑compatíveis correm em qualquer lugar: clouds públicas (Google/Azure/AWS), privadas (OpenShift, Tanzu) e bare metal. Com ILM via S3, as empresas otimizam operações entre ambientes.

## S3 para bare metal

Em arquiteturas híbridas, a cloud privada é um bloco fundamental; portanto, S3 é igualmente crítico para workloads locais (analytics, artefactos, arquivo, etc.). Com RustFS, a compatibilidade S3 é idêntica em qualquer localização, com a mesma performance.

## Vantagens do armazenamento de objetos escalável

Nem toda compatibilidade S3 é igual. Muitos fornecedores suportam apenas subconjuntos da API, causando falhas. Outros limitam por software proprietário/appliances. O RustFS valida a compatibilidade com base em milhares de utilizadores e combinações de HW/SW, com lançamentos semanais e correções rápidas.

Há relatos de que até a Amazon usa o RustFS para testar compatibilidade S3 de terceiros.

### S3 Select

![S3 Select](images/s1-4.png)

O desempenho requerido por consultas complexas do S3 Select é atendido pelas otimizações SIMD do RustFS, suportando CSV/Parquet/JSON em cargas de grande escala.

### Assinatura AWS V4

![Amazon Signature V4](images/s1-5.png)

Clientes e aplicações autenticam‑se para aceder às APIs do RustFS. O RustFS suporta AWS Signature V4 (mantendo V2 legado). A autorização usa políticas compatíveis com AWS IAM.

## API AWS S3 e RustFS

O RustFS é um dos armazenamentos de objetos mais rápidos, e com compatibilidade S3 cobre um amplo conjunto de casos: repositórios (GitHub/GitLab), analytics (MongoDB, ClickHouse, MariaDB, CockroachDB, Teradata), arquivo/backup/DR e workloads de IA/ML (KubeFlow/TensorFlow). Aplicações escritas para S3 correm em qualquer lugar, viabilizando verdadeira multi‑cloud e replicação eficiente.
