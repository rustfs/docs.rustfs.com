---
title: "RustFS on Kubernetes: Common Capabilities"
description: "Capabilities that RustFS provides on every Kubernetes platform, including storage tiering, load balancing, encryption, identity, TLS, monitoring, and logging."
---

RustFS runs on any CNCF-conformant Kubernetes distribution and is deployed with the official RustFS Helm chart. This page describes the capabilities that are common to every Kubernetes platform. For platform-specific prerequisites, see the individual platform pages: [Alibaba Cloud ACK](/features/aliyun), [Amazon EKS](/features/aws-elastic), [Huawei Cloud CCE](/features/huaweicloud), [Tencent Cloud TKE](/features/qcloud), [Red Hat OpenShift](/features/openshift), and [VMware Tanzu](/features/tanzu).

## Deployment Model

RustFS is a single lightweight binary distributed as a container image. On Kubernetes you deploy it with the RustFS Helm chart, which manages pods, services, persistent volume claims, and configuration. RustFS does not require an Operator or custom resource definitions (CRDs); standard Kubernetes primitives and Helm releases are all you need. See the [cloud-native installation guide](/installation/cloud-native) for deployment steps.

## Storage Classes and Tiering

A key requirement for running RustFS at scale is the ability to use different storage classes (NVMe, HDD, public cloud object storage) for different data temperatures, so you can manage cost and performance simultaneously.

RustFS supports transitioning aging objects from fast NVMe tiers to more cost-effective HDD tiers, and to cold public cloud storage tiers. When tiering, RustFS provides a unified namespace across tiers: movement is transparent to applications and triggered by policies you define.

Because RustFS encrypts objects at the source, you keep control of your data even when a cold tier lives in a public cloud.

## External Load Balancing

All RustFS communication is HTTP-based (S3 RESTful API), so any standard Kubernetes ingress controller or platform load balancer can front a RustFS deployment. NGINX Ingress is a common choice; managed platforms also provide native load balancer integrations. Expose the RustFS service through your platform's ingress or a `LoadBalancer` service.

## Encryption and Key Management

For production environments, we recommend enabling encryption on all buckets. RustFS uses AEAD ciphers (AES-256-GCM, ChaCha20-Poly1305) to protect data integrity and confidentiality with low performance overhead.

RustFS ships a built-in KMS subsystem, so no separate key-management component needs to be deployed alongside it. The KMS supports the following backends:

- `local` — keys stored locally, suitable for development and evaluation
- `vault` — HashiCorp Vault KV backend
- `vault-transit` — HashiCorp Vault Transit engine

For production we recommend a Vault-backed configuration so that master keys live outside the storage system. See [encryption](/features/encryption) for details on server-side encryption modes.

## Identity and Access Management

You can manage single sign-on (SSO) through external OpenID Connect-compatible identity providers such as Keycloak or Okta. External IdPs let administrators manage user and application identities centrally, while RustFS provides AWS IAM-style users, groups, policies, and access keys on top. An IAM layer that is independent of the underlying infrastructure gives you the same access model on every platform.

## TLS and Certificates

Traffic between applications and RustFS, including inter-node traffic, can be encrypted with TLS. On Kubernetes, you can issue and renew certificates with [cert-manager](https://cert-manager.io/) or bring your own certificates, and mount them into RustFS pods as Kubernetes secrets. Running separate RustFS deployments in separate namespaces with their own certificates keeps workloads isolated from each other.

## Monitoring and Alerting

RustFS observability is built on OpenTelemetry: the server exports metrics, logs, and traces through an OTLP endpoint. Deploy an OpenTelemetry Collector in your cluster to receive this telemetry, then forward it to Prometheus, Grafana, Jaeger, or any other OTLP-compatible backend you already run. Alerting thresholds can be defined in your monitoring stack and routed to notification platforms such as PagerDuty.

## Logging and Auditing

Enabling RustFS auditing generates logs for every operation on the object storage cluster. In addition to audit logs, RustFS logs server errors for troubleshooting. Logs can be shipped to Elastic Stack or another log analysis platform through your cluster's standard log collection pipeline.
