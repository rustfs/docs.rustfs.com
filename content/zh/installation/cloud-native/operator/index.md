---
title: 概述
description: 了解 RustFS Operator 如何在 Kubernetes 上管理 RustFS 集群。
---

**RustFS Operator** 将 Kubernetes Operator 模式应用于 RustFS 集群。你无需手动创建 StatefulSet、Service、PersistentVolumeClaim（PVC）和配置，只需将所需的存储集群声明为 Kubernetes 自定义资源。控制器会监视该资源，并持续协调运行中集群与声明状态，使二者保持一致。

Operator 会安装两个 Custom Resource Definition（CRD）：

- `Tenant`（`rustfs.com/v1alpha1`）表示一个 RustFS 集群。它定义存储池、凭证、调度、传输层安全性（TLS）和密钥管理服务（KMS）设置。
- `PolicyBinding`（`sts.rustfs.com/v1alpha1`）在工作负载从 Operator Security Token Service（STS）请求临时凭证时，将 Kubernetes ServiceAccount 映射到 RustFS 策略。

一个 Operator 可以跨命名空间管理多个租户。每个租户都有独立的存储、凭证、S3 和控制台服务以及生命周期。Operator 为每个存储池创建一个 StatefulSet，因此你可以通过追加存储池来扩容，而无需重建集群。它还会报告 `Ready`、`Progressing` 或 `Degraded` 状况以及 Kubernetes Event，并公开用于集群监控的健康检查和指标端点。

同一套 API 同时适用于小型测试集群和分布式部署。敏感凭证和 KMS 材料保存在 Kubernetes Secret 中，纳入版本控制的 Tenant manifest 仅包含 Secret 引用。这让部署可重复执行，支持 GitOps 工作流，并可通过 Kubernetes 原生工具完成多租户管理、存储池扩容、TLS 和加密等日常操作。

## Operator 工作流

- [安装](./installation.md)介绍环境要求、Helm 安装、控制台访问和 TLS 配置。
- [多租户](./tenant.md)为不同团队或工作负载创建相互隔离的 RustFS 集群。
- [存储池扩容](./pool-expansion.md)通过向现有租户追加存储池来增加存储容量。
- [KMS 集成](./kms.md)为加密数据配置本地或 HashiCorp Vault 密钥管理。

:::warning[预发布软件]

RustFS Operator 目前是正在积极开发的 `v0.1.0` 预发布软件。请先在非生产集群中验证升级和租户变更。

:::