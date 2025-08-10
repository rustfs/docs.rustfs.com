# RustFS para VMware Tanzu Kubernetes Platform

## Três razões para executar RustFS no VMware Tanzu

- Camada de armazenamento consistente em cenários híbridos/multicloud
- Produto cloud‑native de alto desempenho no Kubernetes (público/privado/edge)
- Controle da pilha no Tanzu, evitando lock‑in

O VMware Tanzu é uma plataforma Kubernetes empresarial com operações automatizadas de pilha completa para gerir implantações híbridas, multicloud e edge.

O RustFS integra‑se nativamente ao Tanzu para operar armazenamento de objetos multi‑inquilino em grande escala, com toolchain do ecossistema Tanzu.

![Arquitetura RustFS](images/sec1-1.png)

Sendo Kubernetes‑native e compatível com S3 desde a origem, o RustFS oferece armazenamento de objetos consistente, performante e escalável. Diferente do S3, escala entre infraestruturas híbridas/multicloud sem lock‑in.

## Integração nativa do RustFS Operator com Tanzu

### Visão geral

- Classes de armazenamento e tiering
- Load balancer externo
- Gestão de chaves (KMS)
- Gestão de identidade
- Gestão de certificados
- Monitorização e alertas
- Logging e auditoria

## Classes de armazenamento e tiering

Tiering entre NVMe/HDD/cloud com namespace único e políticas.

## Load balancer externo

Ingress compatível com Kubernetes (inclui NGINX). Exponha tenants com anotações.

## Gestão de chaves (KMS)

Encriptação por padrão; AES‑256‑GCM/ChaCha20‑Poly1305; SSE‑KMS/SSE‑S3/SSE‑C; KMS inicializa KES por tenant.

## Gestão de identidade

SSO via OpenID Connect/LDAP (Keycloak, Okta/Auth0, Google, AD, OpenLDAP). IAM estilo AWS (utilizadores/grupos/papéis/políticas/STS).

## Gestão de certificados

TLS fim‑a‑fim; integração com gestor de certificados.

## Monitorização e alertas

Métricas Prometheus; Grafana/monitoring; alertas.

## Logging e auditoria

Auditoria de operações e erros; exportação para Elastic Stack/terceiros.
