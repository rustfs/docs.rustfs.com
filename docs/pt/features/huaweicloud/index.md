# RustFS para Huawei Cloud CCE Kubernetes Service

## Três razões para executar RustFS na Huawei Cloud

- Camada de armazenamento consistente em cenários híbridos/multicloud
- Produto cloud‑native de alto desempenho no Kubernetes (público/privado/edge)
- Controle da pilha no CCE, evitando lock‑in

O CCE é um serviço gerido para executar Kubernetes na Huawei Cloud sem gerir control plane ou nós.

O RustFS oferece armazenamento de objetos portátil e performante nas principais plataformas Kubernetes (ACK, Tanzu, Azure, GCP, CCE). No CCE, integra‑se nativamente para operar storage multi‑inquilino em escala, como alternativa ao S3.

![Arquitetura RustFS](images/sec1-1.png)

Diferente do S3, o RustFS permite escalar aplicações entre nuvens sem reescritas dispendiosas. Cloud‑native e contentorizado, implanta‑se facilmente.

## Integração nativa do RustFS Operator com CCE

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

Ingress compatível com Kubernetes (ex.: NGINX). Exponha tenants com anotações.

## Gestão de chaves (KMS)

Encriptação por padrão; AES‑256‑GCM/ChaCha20‑Poly1305; SSE‑KMS/SSE‑S3/SSE‑C; KMS inicializa KES por tenant.

## Gestão de identidade

SSO via OpenID Connect/LDAP (Keycloak, Okta/Auth0, Google, AD, OpenLDAP). IAM estilo AWS.

## Gestão de certificados

TLS fim‑a‑fim; integração com gestor de certificados do CCE.

## Monitorização e alertas

Métricas Prometheus; Grafana/monitoring; alertas.

## Logging e auditoria

Auditoria de operações e erros; exportação para Elastic Stack/terceiros.
