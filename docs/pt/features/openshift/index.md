# RustFS para Red Hat OpenShift Container Platform

## Três razões para executar RustFS no OpenShift

- Camada de armazenamento consistente em cenários híbridos/multicloud
- Produto cloud‑native de alto desempenho no Kubernetes (público/privado/edge)
- No OpenShift, mantém controlo da pilha e evita lock‑in

O Red Hat OpenShift é uma plataforma Kubernetes empresarial com operações automatizadas de pilha completa para gerir implantações híbridas, multicloud e edge. Inclui SO empresarial Linux, runtime de contentores, rede, monitorização, registo e soluções de identidade/autorização.

O RustFS integra‑se nativamente ao OpenShift para operar armazenamento de objetos multi‑inquilino em grande escala. O RustFS Operator funciona com OpenShift Cluster Manager CLI, registo Quay e restante toolchain.

![Arquitetura RustFS](images/sec1-1.png)

Por ser Kubernetes‑native e compatível com S3 desde a origem, o RustFS oferece armazenamento de objetos consistente, performante e escalável. Os developers obtêm storage persistente compatível com S3 para apps cloud‑native no OpenShift. Diferente do S3, o RustFS escala entre infraestruturas híbridas/multicloud mantendo gestão no ecossistema OpenShift, sem lock‑in de cloud pública.

## Integração nativa do RustFS Operator com OpenShift

### Visão geral

- Classes de armazenamento e tiering
- Load balancer externo
- Gestão de chaves (KMS)
- Gestão de identidade
- Gestão de certificados
- Monitorização e alertas
- Logging e auditoria

## Classes de armazenamento e tiering

Tiering entre NVMe/HDD/cloud para equilibrar custo e performance. O RustFS migra objetos envelhecidos para camadas mais económicas mantendo namespace único e movimentos transparentes por políticas.

## Load balancer externo

Tráfego HTTP/REST com suporte a Ingress compatível com Kubernetes (hardware/software). NGINX é opção popular. Instale via OperatorHub/Marketplace e exponha tenants com anotações.

## Gestão de chaves (KMS)

Recomenda‑se encriptação por padrão em todos os buckets. RustFS suporta AES‑256‑GCM/ChaCha20‑Poly1305 com overhead mínimo e modos SSE‑KMS/SSE‑S3/SSE‑C. O KMS inicializa KES por tenant para encriptação por objeto.

## Gestão de identidade

SSO via OpenID Connect/LDAP (Keycloak, Okta/Auth0, Google, Facebook, AD, OpenLDAP). RustFS fornece utilizadores/grupos/papéis/políticas/STS ao estilo AWS IAM, criando uma camada de IAM unificada.

## Gestão de certificados

Todo tráfego app↔RustFS e inter‑nós usa TLS. Integração com gestor de certificados do OpenShift para provisionar/renovar automaticamente por tenant (isolado por namespace).

## Monitorização e alertas

Exponha métricas Prometheus (capacidade, acessos, etc.). Use Grafana ou o monitoring do projeto openshift‑user‑workload. Defina baselines e alertas (PagerDuty/Freshservice/SNMP).

## Logging e auditoria

A auditoria regista todas as operações de objetos; erros de console ajudam no troubleshooting. Suporta envio para Elastic Stack ou terceiros.
