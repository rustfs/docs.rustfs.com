---
title: "RustFS for Huawei Cloud CCE Kubernetes Service"
description: "RustFS provides high-performance object storage for Huawei Cloud CCE with enterprise-grade features and multi-cloud capabilities."
---

Huawei Cloud Cloud Container Engine (CCE) is a fully managed Kubernetes service that provides high-performance, highly available container clusters and integrates with Huawei Cloud infrastructure and services.

Three reasons customers run RustFS on CCE:

- RustFS serves as a consistent storage layer in hybrid cloud or multi-cloud deployment scenarios.
- RustFS is a Kubernetes-native, high-performance product that delivers predictable performance across public cloud, private cloud, and edge environments.
- Running RustFS on CCE gives you flexible control over the software stack and avoids cloud lock-in.

RustFS deploys on CCE with the official Helm chart, making it easier to operate your own large-scale, multi-tenant object storage as a service. Because RustFS is S3-compatible from the start, applications built for the S3 API run against RustFS on CCE without changes.

![RustFS Architecture Diagram](images/sec1-1.png)

## Prerequisites

Before deploying RustFS on CCE, you need:

- A CCE cluster with worker nodes sized for your storage workload
- A block-storage `StorageClass` backed by the Huawei Cloud CSI driver (for example, EVS disks) for RustFS persistent volumes
- A load balancer for external access, typically a Huawei Cloud ELB provisioned through a `LoadBalancer` service or an ingress controller such as NGINX
- `kubectl` and Helm configured against your cluster

## Deploy RustFS on CCE

RustFS is deployed with its official Helm chart; no Operator or CRDs are required. Follow the [cloud-native installation guide](/installation/cloud-native) for the deployment steps.

## Common Capabilities

Storage tiering, external load balancing, encryption and built-in KMS, identity management, TLS certificates, OpenTelemetry-based monitoring, and audit logging work the same on every Kubernetes platform. See [RustFS on Kubernetes: Common Capabilities](/features/kubernetes-common).
