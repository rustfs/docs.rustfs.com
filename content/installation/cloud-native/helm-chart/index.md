---
title: Overview
description: Understand how the RustFS Helm chart deploys standalone and distributed clusters on Kubernetes.
---

The official **RustFS Helm chart** deploys one RustFS cluster directly into Kubernetes. Helm renders the workload, Services, credentials, configuration, PersistentVolumeClaims (PVCs), Ingress, and optional certificate resources from a single values file.

The chart supports two deployment modes:

- **Standalone** creates one Pod with one data PVC. Use it for evaluation and development.
- **Distributed** creates a StatefulSet with multiple Pods and data PVCs. `replicaCount` controls the number of Pods and `drivesPerNode` controls the number of data PVCs mounted by each Pod.

Distributed mode is enabled by default. The chart also supports multiple append-only server pools, but a single explicit topology is easier to operate for an initial deployment. Credentials must be supplied through chart values or an existing Secret; the chart rejects empty and well-known default credentials unless insecure development defaults are explicitly enabled.

Use the Helm chart when you want Helm to manage one RustFS cluster. Use the [RustFS Operator](../operator/index.md) when you need Kubernetes custom resources, multiple Tenants, or Operator-driven pool management.

## Helm chart workflows

- [Install](./installation.md) covers requirements and standalone or distributed deployment.
- [mTLS](./mtls.md) encrypts and authenticates traffic between RustFS Pods.
- [cert-manager](./cert-manager.md) issues and renews certificates for RustFS Ingress and mTLS.