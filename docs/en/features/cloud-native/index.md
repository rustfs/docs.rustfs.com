---
title: "待翻译"
description: "此页面待翻译"
source: "features/cloud-native/index.md"
---

# Hybrid/Multi-Cloud Object Storage

Hybrid/multi-cloud architecture enables consistent performance, security, and economics. Any discussion of multi-cloud needs to start with a definition. It's not just a single public cloud and on-premises.

## Successful multi-cloud storage strategies leverage architectures and tools that can run in various environments

### Public Cloud

This is an increasingly large field, but start with AWS, Azure, GCP, IBM, Alibaba, Tencent, and government clouds. Your hybrid/multi-cloud storage software needs to run wherever the application stack runs. Even companies claiming to run on a single cloud don't - there are always other clouds. RustFS provides storage consistency for each public cloud provider, avoiding the need to rewrite applications when expanding to new clouds.

### Private Cloud

Kubernetes is the primary software architecture for modern private clouds. This includes all Kubernetes distributions such as VMware (Tanzu), RedHat (OpenShift), Rancher/SUSE, HP (Ezmeral), and Rafay. Multi-cloud Kubernetes requires software-defined and cloud-native object storage. Private clouds also include more traditional bare metal instances, but enterprise workloads are increasingly containerized and orchestrated.

### Edge

Edge is about moving computation to where data is generated. After processing, data moves to more centralized locations. Edge storage solutions must be lightweight, powerful, cloud-native, and resilient to operate in such multi-cloud architectures. This is very difficult to achieve, which is why few vendors discuss it - they don't have a good answer, not even Amazon.

## Multi-Cloud Architecture with RustFS

![Multi-Cloud Architecture](images/multi-cloud-architecture.png)

## Properties of Hybrid/Multi-Cloud Storage

Multi-cloud storage follows patterns established by public clouds, where public cloud providers consistently adopt cloud-native object storage. The success of public clouds has effectively made file and block storage obsolete. Every new application is written for AWS S3 API, not POSIX. To scale and perform like cloud-native technologies, older applications must be rewritten for S3 API and refactored into microservices to be container-compatible.

### Kubernetes-Native

Kubernetes-native design requires operator services to configure and manage multi-tenant object storage as a service infrastructure. Each of these tenants runs in their own independent namespace while sharing underlying hardware resources. The operator pattern extends Kubernetes' familiar declarative API model through Custom Resource Definitions (CRDs) to perform common operations like resource orchestration, non-disruptive upgrades, cluster scaling, etc., and maintain high availability.

RustFS is built to fully leverage Kubernetes architecture. Due to fast and lightweight server binaries, RustFS Operator can densely co-locate multiple tenants without exhausting resources. Leverage the advantages of Kubernetes and related ecosystems to gain multi-cloud benefits with portable Kubernetes-native storage.

### Consistent

Hybrid/multi-cloud storage must be consistent in API compatibility, performance, security, and compliance. It needs to execute consistently and independently of underlying hardware. Any variation, even small ones, can break applications, creating enormous operational burden.

Since RustFS is very lightweight, we can roll out non-disruptive updates across public, private, and edge in minutes, maintaining consistent experience. RustFS abstracts fundamental differences between these architectures, including key management, identity management, access policies, and hardware/OS differences.

### Performance

Since object storage serves as both primary and secondary storage, it needs to deliver performance at scale. From mobile/web applications to AI/ML, data-intensive workloads require exceptional performance from underlying object storage. Even data protection workloads need high-performance deduplication and snapshot access. No enterprise can afford slow recovery processes. Traditionally, these workloads required bare metal performance. Now, all these workloads can be containerized - as proven by public cloud providers' success.

RustFS is the world's fastest object storage, with read/write speeds of 325 GiB/s and 171 GiB/s on NVMe, and 11 GiB/s and 9 GiB/s on HDD. At such speeds, every workload can be achieved in any multi-cloud architecture running on any infrastructure.

### Scalable

Many people think scale only refers to how large a system can become. However, this thinking ignores the importance of operational efficiency as environments evolve. Multi-cloud object storage solutions must scale efficiently and transparently regardless of underlying environment, with minimal human interaction and maximum automation. This can only be achieved through API-driven platforms built on simple architectures.

RustFS's relentless focus on simplicity means large-scale, multi-petabyte data infrastructure can be managed with minimal human resources. This is a function of APIs and automation, creating an environment on which scalable multi-cloud storage can be built.

### Software-Defined

The only way to succeed in multi-cloud is with software-defined storage. The reason is simple. Hardware appliances don't run on public clouds or Kubernetes. Public cloud storage service offerings aren't designed to run on other public clouds, private clouds, or Kubernetes platforms. Even if they did, bandwidth costs would exceed storage costs because they weren't developed for cross-network replication. Admittedly, software-defined storage can run on public clouds, private clouds, and edge.

RustFS was born in software and is portable across various operating systems and hardware architectures. Evidence can be found in our 2M+ IPs running across AWS, GCP, and Azure.
