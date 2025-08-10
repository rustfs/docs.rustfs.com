# RustFS para Tencent Cloud TKE Kubernetes Service

## Três razões para executar RustFS na Tencent Cloud

- Camada de armazenamento consistente em cenários híbridos/multicloud
- Produto cloud‑native de alto desempenho no Kubernetes (público/privado/edge)
- Controle da pilha no TKE, evitando lock‑in

O TKE é um serviço gerido para executar Kubernetes na Tencent Cloud sem gerir control plane ou nós.

O RustFS oferece armazenamento de objetos portátil e performante nas principais plataformas Kubernetes (ACK, Tanzu, Azure, GCP, TKE). No TKE, integra‑se nativamente para operar storage multi‑inquilino em escala, como alternativa ao S3.

![Arquitetura RustFS](images/sec1-1.png)

Diferente do S3, o RustFS permite escalar aplicações entre nuvens sem reescritas dispendiosas. Cloud‑native e contentorizado, implanta‑se facilmente sem skills especializados.

## Integração nativa do RustFS Operator com TKE

### Visão geral

- Classes de armazenamento e tiering
- Load balancer externo
- Gestão de chaves (KMS)
- Gestão de identidade
- Gestão de certificados
- Monitorização e alertas
- Logging e auditoria

## Classes de armazenamento e tiering

Tiering entre NVMe/HDD/cloud com namespace único e políticas de movimentação.

## Load balancer externo

Suporte a Ingress compatível com Kubernetes (inclui NGINX). Instale via marketplace e exponha tenants com anotações.

## Gestão de chaves (KMS)

Encriptação por padrão recomendada; suporta AES‑256‑GCM/ChaCha20‑Poly1305 e SSE‑KMS/SSE‑S3/SSE‑C. KMS inicializa KES por tenant.

## Gestão de identidade

SSO via OpenID Connect/LDAP (Keycloak, Okta/Auth0, Google, AD, OpenLDAP). IAM ao estilo AWS (utilizadores/grupos/papéis/políticas/STS).

## Gestão de certificados

TLS para todo tráfego; integração com gestor de certificados para provisionamento/renovação automático por tenant.

## Monitorização e alertas

Métricas Prometheus; visualize com Grafana/monitoring do cluster; configure alertas.

## Logging e auditoria

Registo de operações e erros de console; exportação para Elastic Stack/terceiros.
