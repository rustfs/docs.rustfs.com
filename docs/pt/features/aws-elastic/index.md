# RustFS para Amazon Elastic Kubernetes Service (EKS)

## Três razões para executar RustFS no Amazon EKS

- Camada de armazenamento consistente em cenários híbridos/multicloud
- Produto cloud‑native de alto desempenho no Kubernetes (público/privado/edge)
- Controle total da pilha no EKS, evitando lock‑in

Amazon Elastic Kubernetes Service (EKS) é um serviço gerido para executar Kubernetes na AWS sem gerir o control plane ou nós.

O RustFS integra‑se nativamente ao EKS para operar armazenamento de objetos multi‑inquilino em escala, como alternativa compatível com S3.

![Arquitetura RustFS](images/sec1-1.png)

Diferente do S3, o RustFS permite escalar aplicações entre nuvens sem reescritas dispendiosas ou integrações proprietárias. Por ser contentorizado e cloud‑native, implanta‑se facilmente sem skills especializados.

## Integração nativa do RustFS Operator com EKS

### Visão geral

- Classes de armazenamento e tiering
- Load balancer externo
- Gestão de chaves (KMS)
- Gestão de identidade
- Gestão de certificados
- Monitorização e alertas
- Logging e auditoria

## Classes de armazenamento e tiering

Tiering entre classes/mídias (NVMe, HDD, cloud) com namespace único e políticas transparentes.

## Load balancer externo

Suporte a Ingress compatível com Kubernetes (inclui NGINX). Instale via marketplace e exponha tenants.

## Gestão de chaves (KMS)

Encriptação por padrão recomendada; suporta AES‑256‑GCM/ChaCha20‑Poly1305 e SSE‑KMS/SSE‑S3/SSE‑C. KMS inicializa KES por tenant.

## Gestão de identidade

SSO via OpenID Connect/LDAP (Keycloak, Okta/Auth0, Google, AD, OpenLDAP). IAM estilo AWS.

## Gestão de certificados

TLS fim‑a‑fim; integração com gestor de certificados.

## Monitorização e alertas

Métricas Prometheus; Grafana/monitoring; alertas.

## Logging e auditoria

Auditoria de operações e erros; exportação para Elastic Stack/terceiros.
