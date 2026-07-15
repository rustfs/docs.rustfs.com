---
title: "RustFS for Alibaba Cloud Kubernetes Service (ACK)"
description: "RustFS provides high-performance object storage for Alibaba Cloud ACK with hybrid cloud capabilities and enterprise features."
---

Alibaba Cloud Container Service for Kubernetes (ACK) is a managed service for running Kubernetes on Alibaba Cloud without needing to install, operate, and maintain your own Kubernetes control plane or nodes.

Three reasons customers run RustFS on ACK:

- RustFS serves as a consistent storage layer in hybrid cloud or multi-cloud deployment scenarios.
- RustFS is a Kubernetes-native, high-performance product that delivers predictable performance across public cloud, private cloud, and edge environments.
- Running RustFS on ACK gives you control over the software stack and the flexibility to avoid cloud lock-in.

RustFS runs on all major Kubernetes platforms and deploys on ACK with the official Helm chart, making it easier to run your own large-scale, multi-tenant object storage as a service. Unlike a managed cloud storage service, RustFS lets applications scale across multi-cloud and hybrid cloud infrastructure without expensive software rewrites or proprietary integrations.

![RustFS Architecture Diagram](images/sec1-1.png)

## Prerequisites

Before deploying RustFS on ACK, you need:

- An ACK cluster (ACK managed or ACK dedicated) with worker nodes sized for your storage workload
- A block-storage `StorageClass` backed by the Alibaba Cloud CSI driver (for example, ESSD cloud disks) for RustFS persistent volumes
- A load balancer for external access, typically an Alibaba Cloud CLB/NLB provisioned through a `LoadBalancer` service or an ingress controller
- `kubectl` and Helm configured against your cluster

## Deploy RustFS on ACK

RustFS is deployed with its official Helm chart; no Operator or CRDs are required. Follow the [cloud-native installation guide](/installation/cloud-native) for the deployment steps.

## Common Capabilities

Storage tiering, external load balancing, encryption and built-in KMS, identity management, TLS certificates, OpenTelemetry-based monitoring, and audit logging work the same on every Kubernetes platform. See [RustFS on Kubernetes: Common Capabilities](/features/kubernetes-common).
