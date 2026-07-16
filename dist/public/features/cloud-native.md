# Hybrid/Multi-Cloud Object Storage (/features/cloud-native)





Hybrid/multi-cloud architecture enables consistent performance, security, and economics.

## Multi-Cloud Storage Strategies [#multi-cloud-storage-strategies]

### Public Cloud [#public-cloud]

Public cloud providers include AWS, Azure, GCP, IBM, Alibaba, Tencent, and government clouds. Hybrid/multi-cloud storage software must run wherever the application stack runs. RustFS provides consistent storage across public cloud providers, avoiding the need to rewrite applications when expanding to new clouds.

### Private Cloud [#private-cloud]

Kubernetes is the primary software architecture for modern private clouds (VMware Tanzu, RedHat OpenShift, Rancher, etc.). Multi-cloud Kubernetes requires software-defined, cloud-native object storage.

### Edge [#edge]

Edge computing moves computation to where data is generated. Edge storage solutions must be lightweight, powerful, cloud-native, and resilient.

## Multi-Cloud Architecture with RustFS [#multi-cloud-architecture-with-rustfs]

<img alt="Multi-Cloud Architecture" src="__img0" />

## Properties of Hybrid/Multi-Cloud Storage [#properties-of-hybridmulti-cloud-storage]

Multi-cloud storage adopts public cloud patterns. New applications are typically written for the AWS S3 API. To scale and perform like cloud-native technologies, applications should be compatible with the S3 API and refactored into microservices.

### Kubernetes-Native [#kubernetes-native]

Kubernetes-native design requires operator services to configure and manage multi-tenant object storage. Each tenant runs in an independent namespace while sharing underlying hardware resources. The operator pattern extends Kubernetes' declarative API model through Custom Resource Definitions (CRDs) for operations like resource orchestration, upgrades, and scaling.

RustFS is designed for Kubernetes. The lightweight RustFS binary allows the RustFS Operator to densely co-locate multiple tenants without exhausting resources.

### Consistent [#consistent]

Hybrid/multi-cloud storage must be consistent in API compatibility, performance, security, and compliance. RustFS enables non-disruptive updates across public, private, and edge environments, maintaining a consistent experience. RustFS abstracts differences in key management, identity management, access policies, and hardware/OS.

### Performance [#performance]

Object storage must deliver performance at scale for workloads ranging from mobile/web applications to AI/ML. RustFS delivers read/write speeds of 325 GiB/s and 171 GiB/s on NVMe, and 11 GiB/s and 9 GiB/s on HDD.

### Scalable [#scalable]

Many people think scale only refers to how large a system can become. However, this thinking ignores the importance of operational efficiency as environments evolve. Multi-cloud object storage solutions must scale efficiently and transparently regardless of underlying environment, with minimal human interaction and maximum automation. This can only be achieved through API-driven platforms built on simple architectures.

RustFS's relentless focus on simplicity means large-scale, multi-petabyte data infrastructure can be managed with minimal human resources. This is a function of APIs and automation, creating an environment on which scalable multi-cloud storage can be built.

### Software-Defined [#software-defined]

The only way to succeed in multi-cloud is with software-defined storage. The reason is straightforward. Hardware appliances don't run on public clouds or Kubernetes. Public cloud storage service offerings aren't designed to run on other public clouds, private clouds, or Kubernetes platforms. Even if they did, bandwidth costs would exceed storage costs because they weren't developed for cross-network replication. Admittedly, software-defined storage can run on public clouds, private clouds, and edge.

RustFS was born in software and is portable across various operating systems and hardware architectures. Evidence can be found in our 2M+ IPs running across AWS, GCP, and Azure.
