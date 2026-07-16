---
title: "RustFS for Amazon Elastic Kubernetes Service (EKS)"
description: "RustFS provides high-performance object storage for Amazon EKS with enterprise-grade features and multi-cloud capabilities."
---

Amazon Elastic Kubernetes Service (EKS) is a managed service that makes it easy for you to run Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane or nodes.

Three reasons customers run RustFS on EKS:

- RustFS serves as a consistent storage layer in hybrid cloud or multi-cloud deployment scenarios.
- RustFS is a Kubernetes-native, high-performance product that delivers predictable performance across public cloud, private cloud, and edge environments.
- Running RustFS on EKS gives you control over the software stack and the flexibility to avoid cloud lock-in.

RustFS deploys on EKS with the official Helm chart and works with the EKS toolchain, making it easier to operate your own large-scale, multi-tenant object storage as a service. Because RustFS is S3-compatible from the start, applications built for the S3 API run against RustFS on EKS without changes — and can later move to any other cloud or on-premises environment.

![RustFS Architecture Diagram](images/sec1-1.png)

## Prerequisites

Before deploying RustFS on EKS, you need:

- An EKS cluster with worker nodes sized for your storage workload
- A block-storage `StorageClass` backed by the Amazon EBS CSI driver (for example, `gp3`) for RustFS persistent volumes
- A load balancer for external access, typically an NLB/ALB provisioned through the AWS Load Balancer Controller or an ingress controller such as NGINX
- `kubectl` and Helm configured against your cluster

## Deploy RustFS on EKS

RustFS is deployed with its official Helm chart; no Operator or CRDs are required. Follow the [cloud-native installation guide](/installation/cloud-native) for the deployment steps.

## Common Capabilities

Storage tiering (including transition to cold tiers such as S3 Glacier), external load balancing, encryption and built-in KMS, identity management, TLS certificates, OpenTelemetry-based monitoring, and audit logging work the same on every Kubernetes platform. See [RustFS on Kubernetes: Common Capabilities](/features/kubernetes-common).
