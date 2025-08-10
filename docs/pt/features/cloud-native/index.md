# Armazenamento de objetos híbrido/multicloud

Arquiteturas híbridas/multicloud alcançam consistência em performance, segurança e economia. “Multicloud” não é apenas um único provedor público + on‑prem.

## Estratégias vencedoras usam arquiteturas e ferramentas que executam em qualquer ambiente

### Nuvem pública

De AWS, Azure, GCP, IBM a Alibaba, Tencent e clouds governamentais. O seu storage precisa executar onde a pilha da aplicação está. Mesmo quem diz operar num único cloud invariavelmente usa outros. O RustFS oferece consistência entre provedores, evitando reescrita ao expandir para novas nuvens.

### Nuvem privada

Kubernetes é a base das nuvens privadas modernas (Tanzu, OpenShift, Rancher/SUSE, HP Ezmeral, Rafay). Multicloud K8s requer armazenamento de objetos cloud‑native e definido por software. Inclui bare‑metal tradicional, mas workloads empresariais migram para contentores e orquestração.

### Edge

Edge move computação para onde os dados são gerados, depois envia para centros. Soluções de edge storage devem ser leves, potentes, cloud‑native e resilientes para operar em multicloud – tarefa difícil, raramente resolvida até por grandes provedores.

## Arquitetura multicloud com RustFS

![Arquitetura multicloud](images/multi-cloud-architecture.png)

## Atributos de storage híbrido/multicloud

O padrão dominante em nuvem pública é o armazenamento de objetos cloud‑native. O sucesso dos clouds tornou file/block legados obsoletos. Novas apps usam S3 API, não POSIX. Apps legadas devem ser reescritas para S3 e refatoradas em microserviços para contentores.

### Kubernetes‑Native

Operadores gerem tenants multi‑inquilino via CRDs, com orquestração, upgrades sem downtime e scale‑out, mantendo alta disponibilidade. O RustFS tira partido do desenho K8s. Binários leves permitem alta densidade de co‑alojamento de tenants com Operator.

### Consistência

Consistência de API, performance, segurança e conformidade, independente do hardware. Alterações mínimas podem quebrar apps e elevar o ônus operacional.

Leveza do RustFS permite updates sem interrupção em minutos em público/privado/edge, abstraindo diferenças (KMS/Identidade/políticas/OS/hardware).

### Performance

Object storage é storage primário e secundário: precisa escalar performance. De mobile/web a AI/ML, workloads intensivos dependem de performance. Backups exigem dedupe/snapshot rápidos; ninguém tolera recuperação lenta. Antes exigiam bare‑metal; hoje podem ser contentorizados.

RustFS entrega topo de performance (ex.: NVMe leitura/escrita 325/171 GiB/s; HDD 11/9 GiB/s), viabilizando qualquer workload em qualquer infra, em qualquer multicloud.

### Escalável

Escala não é só “o quão grande”. Eficiência operacional é central. A solução deve escalar com automação máxima e intervenção mínima, via plataforma API‑driven sobre arquitetura simples.

O foco em simplicidade do RustFS permite gerir infra de múltiplos PB com equipa enxuta – produto de APIs/automação que sustentam storage multicloud escalável.

### Definido por software

Sucesso em multicloud exige SDS. Appliances não executam em clouds/K8s. Ofertas de storage de clouds não foram feitas para correr noutros clouds, privados ou K8s; e o custo de bandwidth supera o de storage. SDS corre em público/privado/edge.

RustFS nasce em software e é portátil em OS/arquiteturas, comprovado pelas 2M+ IPs a correr em AWS, GCP e Azure.
