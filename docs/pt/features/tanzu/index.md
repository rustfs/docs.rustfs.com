# RustFS para Amazon Elastic Kubernetes Service

## Três razões para executar RustFS no Amazon EKS

- Camada de armazenamento consistente em cenários híbridos/multicloud
- Produto cloud‑native de alto desempenho no Kubernetes (público/privado/edge)
- Controle total da pilha no EKS, evitando vendor lock‑in

Amazon Elastic Kubernetes Service (EKS) é um serviço gerido para executar Kubernetes na AWS sem gerir o control plane ou nós.

O RustFS oferece object storage portátil e de alto desempenho nas principais plataformas Kubernetes (ACK, Tanzu, Azure, GCP, etc.). Na AWS, integra‑se nativamente ao EKS para operar storage multi‑inquilino em escala, como alternativa completa ao S3.

![Arquitetura RustFS](images/sec1-1.png)

Diferente do S3, o RustFS permite escalar aplicações entre nuvens sem reescritas dispendiosas ou integrações proprietárias. Por ser contentorizado e cloud‑native, implanta‑se facilmente sem skills especializados em storage massivo.

## Integração nativa do RustFS Operator com VMware Tanzu

### Visão geral

- Classes de armazenamento e tiering
- Load balancer externo
- Gestão de chaves (KMS)
- Gestão de identidade
- Gestão de certificados
- Monitorização e alertas
- Logging e auditoria

## Classes de armazenamento e tiering

Requisito crítico em larga escala: tiering entre classes/mídias (NVMe, HDD, cloud). Permite gerenciar custo e performance simultaneamente.

O RustFS migra automaticamente objetos envelhecidos de NVMe para HDD e para camadas frias em cloud, mantendo namespace único e movimentos transparentes por política.

## Load balancer externo

Todo tráfego é HTTP/REST e suporta qualquer Ingress compatível com Kubernetes (hardware/software). NGINX é opção popular. Instale via OperatorHub/Marketplace e exponha tenants por anotações.

## Gestão de chaves (KMS)

Para produção, recomenda‑se encriptação por padrão em todos os buckets. RustFS suporta AES‑256‑GCM e ChaCha20‑Poly1305 com overhead desprezável e os modos SSE‑KMS, SSE‑S3 e SSE‑C. O KMS inicializa o KES por tenant para encriptação por objeto de alto desempenho.

## Gestão de identidade

SSO via IdPs compatíveis com OpenID Connect/LDAP (Keycloak, Okta/Auth0, Google, AD, OpenLDAP). RustFS fornece usuários/grupos/papéis/políticas/STS estilo AWS IAM, com IAM unificado independente de infra.

## Gestão de certificados

Tráfego app↔RustFS e inter‑nós com TLS. Integra‑se com gestores de certificados para provisionar/renovar automaticamente por tenant (isolados por namespace Kubernetes).

## Monitorização e alertas

Exponha métricas Prometheus (capacidade por bucket, acessos, etc.). Integre Grafana/monitoring do cluster; defina baselines e alertas (PagerDuty/Freshservice/SNMP).

## Logging e auditoria

Ative auditoria para registrar todas operações de objetos e erros de console para troubleshooting. Suporte a envio para Elastic Stack/terceiros.
