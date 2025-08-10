# RustFS para Alibaba Cloud Container Service for Kubernetes (ACK)

## Três razões para executar RustFS no Alibaba Cloud

- Camada de armazenamento consistente em cenários híbridos/multicloud
- Produto cloud‑native de alto desempenho no Kubernetes (público/privado/edge)
- Controle da pilha no ACK, evitando lock‑in

O ACK é um serviço gerido para executar Kubernetes no Alibaba Cloud sem gerir control plane ou nós.

O RustFS oferece object storage portátil e performante nas principais plataformas Kubernetes (ACK, Tanzu, Azure, GCP, etc.). No Alibaba Cloud, integra‑se nativamente ao ACK para operar storage multi‑inquilino em escala, como alternativa completa ao S3.

![Arquitetura RustFS](images/sec1-1.png)

Diferente do S3, o RustFS permite escalar aplicações entre nuvens sem reescritas dispendiosas ou integrações proprietárias. Por ser contentorizado e cloud‑native, implanta‑se facilmente sem skills especializados em storage massivo.

## Integração nativa do RustFS Operator com ACK

### Visão geral

- Classes de armazenamento e tiering
- Load balancer externo
- Gestão de chaves (KMS)
- Gestão de identidade
- Gestão de certificados
- Monitorização e alertas
- Logging e auditoria

## Classes de armazenamento e tiering

Tiering entre classes/mídias (NVMe, HDD, cloud) para equilibrar custo e performance. Namespace único e movimentos transparentes por políticas.

## Load balancer externo

Tráfego HTTP/REST com suporte a Ingress compatível com Kubernetes (hardware/software). NGINX é opção popular.

## Gestão de chaves (KMS)

Recomenda‑se encriptação por padrão em todos os buckets. Suporte a AES‑256‑GCM/ChaCha20‑Poly1305 com overhead mínimo e modos SSE‑KMS/SSE‑S3/SSE‑C. KMS inicializa KES por tenant para encriptação por objeto.

## Gestão de identidade

SSO via OpenID Connect/LDAP (Keycloak, Okta/Auth0, Google, AD, OpenLDAP). RustFS fornece utilizadores/grupos/papéis/políticas/STS ao estilo AWS IAM.

## Gestão de certificados

Todo tráfego app↔RustFS e inter‑nós usa TLS. Integração com gestor de certificados para provisionamento/renovação automático por tenant.

## Monitorização e alertas

Métricas Prometheus (capacidade, acessos etc.), visualização via Grafana/stack de monitoring; defina baselines e alertas.

## Logging e auditoria

A auditoria regista todas as operações de objetos e erros de console; suporte a envio para Elastic Stack/terceiros.
