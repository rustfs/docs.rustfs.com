---
title: "RustFS for Red Hat OpenShift Container Platform"
description: "RustFS provides high-performance object storage for Red Hat OpenShift with enterprise-grade features and multi-cloud capabilities."
---

Red Hat OpenShift is an enterprise Kubernetes container platform with full-stack automated operations that can manage hybrid cloud, multi-cloud, and edge deployments. OpenShift includes an enterprise Linux operating system, container runtime, networking, monitoring, registry, and authentication and authorization solutions.

Three reasons customers run RustFS on OpenShift:

- RustFS serves as a consistent storage layer in hybrid cloud or multi-cloud deployment scenarios.
- RustFS is a Kubernetes-native, high-performance product that delivers predictable performance across public cloud, private cloud, and edge environments.
- Running RustFS on OpenShift gives you flexible control over the software stack and avoids cloud lock-in.

RustFS deploys on OpenShift with the official Helm chart and works alongside the OpenShift toolchain, making it easier to operate your own large-scale, multi-tenant object storage as a service. Because RustFS is S3-compatible from the start, applications built for the S3 API run against RustFS on OpenShift without changes.

![RustFS Architecture Diagram](images/sec1-1.png)

## Prerequisites

Before deploying RustFS on OpenShift, you need:

- An OpenShift cluster with worker nodes sized for your storage workload
- A block-storage `StorageClass` (for example, one provided by your platform's CSI driver or local storage) for RustFS persistent volumes
- External access through OpenShift Routes, an ingress controller, or a `LoadBalancer` service
- The `oc`/`kubectl` CLI and Helm configured against your cluster, with any security context constraints (SCCs) your policies require

## Deploy RustFS on OpenShift

RustFS is deployed with its official Helm chart; no Operator or CRDs are required. Follow the [cloud-native installation guide](/installation/cloud-native) for the deployment steps.

## Common Capabilities

Storage tiering, external load balancing, encryption and built-in KMS, identity management, TLS certificates, OpenTelemetry-based monitoring, and audit logging work the same on every Kubernetes platform. See [RustFS on Kubernetes: Common Capabilities](/features/kubernetes-common).
