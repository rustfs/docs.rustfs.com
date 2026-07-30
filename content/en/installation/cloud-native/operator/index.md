---
title: Overview
description: Understand how RustFS Operator manages RustFS clusters on Kubernetes.
---

**RustFS Operator** applies the Kubernetes Operator pattern to RustFS clusters. Instead of creating StatefulSets, Services, PersistentVolumeClaims (PVCs), and configuration by hand, you declare the required storage cluster as a Kubernetes custom resource. The controller watches that resource and continuously reconciles the running cluster with the declared state.

The Operator installs two Custom Resource Definitions (CRDs):

- `Tenant` (`rustfs.com/v1alpha1`) represents one RustFS cluster. It defines storage pools, credentials, scheduling, Transport Layer Security (TLS), and Key Management Service (KMS) settings.
- `PolicyBinding` (`sts.rustfs.com/v1alpha1`) maps a Kubernetes ServiceAccount to RustFS policies when workloads request temporary credentials from the Operator Security Token Service (STS).

One Operator can manage multiple Tenants across namespaces. Each Tenant has independent storage, credentials, S3 and Console services, and lifecycle. The Operator creates one StatefulSet for each pool, so you can add capacity by appending a pool without rebuilding the cluster. It also reports `Ready`, `Progressing`, or `Degraded` conditions and Kubernetes Events, and exposes health and metrics endpoints for cluster monitoring.

The same API covers small test clusters and distributed deployments. Sensitive credentials and KMS material stay in Kubernetes Secrets, while version-controlled Tenant manifests hold only Secret references. This makes deployments repeatable, supports GitOps workflows, and keeps routine operations such as multi-tenant management, pool expansion, TLS, and encryption within Kubernetes-native tools.

## Operator workflows

- [Install](./installation.md) covers requirements, Helm installation, Console access, and TLS configuration.
- [Multi-Tenant](./tenant.md) creates isolated RustFS clusters for different teams or workloads.
- [Pool Expansion](./pool-expansion.md) adds storage capacity by appending a pool to an existing Tenant.
- [KMS Integration](./kms.md) configures local or HashiCorp Vault key management for encrypted data.

:::warning[Pre-release software]

RustFS Operator is currently `v0.1.0` pre-release software under active development. Validate upgrades and Tenant changes in a non-production cluster first.

:::