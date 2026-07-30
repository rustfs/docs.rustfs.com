---
title: 概述
description: 了解 RustFS Helm chart 如何在 Kubernetes 上部署单机和分布式集群。
---

官方 **RustFS Helm chart** 可将一个 RustFS 集群直接部署到 Kubernetes 中。Helm 根据单个 values 文件渲染工作负载、Service、凭证、配置、PersistentVolumeClaim（PVC）、Ingress 以及可选的证书资源。

该 chart 支持两种部署模式：

- **单机模式**会创建一个包含一个数据 PVC 的 Pod，适用于评估和开发。
- **分布式模式**会创建包含多个 Pod 和数据 PVC 的 StatefulSet。`replicaCount` 控制 Pod 数量，`drivesPerNode` 控制每个 Pod 挂载的数据 PVC 数量。

默认启用分布式模式。该 chart 还支持多个仅追加的服务器池，但对于首次部署，明确使用单一拓扑更易于运维。必须通过 chart values 或现有 Secret 提供凭证；除非明确启用不安全的开发默认值，否则 chart 会拒绝空凭证和众所周知的默认凭证。

需要使用 Helm 管理一个 RustFS 集群时，请使用 Helm chart。需要 Kubernetes 自定义资源、多租户或由 Operator 管理存储池时，请使用 [RustFS Operator](../operator/index.md)。

## Helm chart 工作流

- [安装](./installation.mdx)介绍环境要求以及单机或分布式部署。
- [mTLS](./mtls.md)用于加密 RustFS Pod 之间的流量并验证通信双方身份。
- [cert-manager](./cert-manager.md)为 RustFS Ingress 和 mTLS 签发并续订证书。