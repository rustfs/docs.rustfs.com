---
title: "RustFS for Tencent Cloud TKE Kubernetes Service"
description: "RustFS provides high-performance object storage for Tencent Cloud TKE with enterprise-grade features and multi-cloud capabilities."
---

Tencent Kubernetes Engine (TKE) is a fully managed Kubernetes service that provides high-performance, highly available container clusters and integrates with Tencent Cloud infrastructure and services.

Three reasons customers run RustFS on TKE:

- RustFS serves as a consistent storage layer in hybrid cloud or multi-cloud deployment scenarios.
- RustFS is a Kubernetes-native, high-performance product that delivers predictable performance across public cloud, private cloud, and edge environments.
- Running RustFS on TKE gives you flexible control over the software stack and avoids cloud lock-in.

RustFS deploys on TKE with the official Helm chart, making it easier to operate your own large-scale, multi-tenant object storage as a service. Because RustFS is S3-compatible from the start, applications built for the S3 API run against RustFS on TKE without changes.

![RustFS Architecture Diagram](images/sec1-1.png)

## Prerequisites

Before deploying RustFS on TKE, you need:

- A TKE cluster with worker nodes sized for your storage workload
- A block-storage `StorageClass` backed by the Tencent Cloud CSI driver (for example, CBS disks) for RustFS persistent volumes
- A load balancer for external access, typically a Tencent Cloud CLB provisioned through a `LoadBalancer` service or an ingress controller such as NGINX
- `kubectl` and Helm configured against your cluster

## Deploy RustFS on TKE

RustFS is deployed with its official Helm chart; no Operator or CRDs are required. Follow the [cloud-native installation guide](/installation/cloud-native) for the deployment steps.

## Common Capabilities

Storage tiering, external load balancing, encryption and built-in KMS, identity management, TLS certificates, OpenTelemetry-based monitoring, and audit logging work the same on every Kubernetes platform. See [RustFS on Kubernetes: Common Capabilities](/features/kubernetes-common).
