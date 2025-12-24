# Infrastructure for Large-Scale Data

RustFS is designed for scale—technical, operational, and economic.

In the object storage field, robust encryption is a fundamental requirement for enterprise storage. RustFS provides more functionality through the highest level of encryption and extensive optimizations, minimizing the performance overhead typically associated with storage encryption operations.

![Data Encryption Architecture](images/s5-1.png)

RustFS encrypts data both when stored on disk and when transmitted over the network. RustFS's state-of-the-art encryption scheme supports fine-grained object-level encryption using modern industry-standard encryption algorithms such as AES-256-GCM, ChaCha20-Poly1305, and AES-CBC. RustFS is fully compatible with S3 encryption semantics and also extends S3 by supporting non-AWS key management services such as Hashicorp Vault, Gemalto KeySecure, and Google Secrets Manager.

## Network Encryption

When data is transmitted between object storage and applications, it may bounce between any number of unknown and/or untrusted networks. Encrypting data while it's transmitted over the network (also known as "in transit") successfully mitigates man-in-the-middle attacks and ensures data remains secure regardless of the routing path taken.

RustFS supports Transport Layer Security (TLS) v1.2+ between all components in the cluster. This approach ensures there are no weak links in encrypted traffic between or within clusters. TLS is a ubiquitous encryption framework: it's the same encryption protocol used by banks, e-commerce websites, and other enterprise-level systems that rely on data storage encryption.

RustFS's TLS implementation is optimized at the CPU instruction level with negligible performance overhead. It only requires specifying TLS private keys and public certificates for each RustFS server in the cluster. For Kubernetes environments, the RustFS Kubernetes Operator integrates/automatically generates and assigns TLS certificates during tenant deployment. RustFS supports multiple TLS certificates, where each certificate corresponds to a specific domain name. RustFS uses Server Name Indication (SNI) to determine which certificate to serve for any given request.

## Object Encryption

Data stored on disk relies entirely on the security of the disk and extends to the host system to ensure data security. RustFS server-side object encryption automatically encrypts data before it's stored on disk (encryption at rest). This approach guarantees that no data is written to unencrypted disks. This baseline security layer ensures the confidentiality, integrity, and authenticity of data at rest. RustFS supports both client-driven and automatic bucket default object encryption for maximum flexibility in data encryption.

RustFS server-side encryption is compatible with Amazon AWS-S3 semantics (SSE-S3). RustFS extends baseline support for AWS KMS to include common enterprise KMS systems such as Hashicorp Vault and Thales Ciphertrust (formerly Gemalto KeySecure). RustFS also supports client-driven encryption (SSE-C), where applications can specify the data key used to encrypt objects. For both SSE-S3 and SSE-C, the RustFS server performs all encryption operations, including key rotation and object re-encryption.

Through automatic server-side encryption, RustFS encrypts each object with a unique key and applies multiple layers of additional encryption using dynamic encryption keys and keys derived from external KMS or client-provided keys. This secure and sophisticated approach is performed within RustFS without the need to handle multiple independent kernel and userspace encryption utilities.

RustFS uses Authenticated Encryption with Associated Data (AEAD) schemes to encrypt/decrypt objects when objects are written to or read from object storage. RustFS AEAD encryption supports industry-standard encryption protocols such as AES-256-GCM and ChaCha20-Poly1305 to protect object data. RustFS's CPU-level optimizations (such as SIMD acceleration) ensure negligible performance overhead for encryption/decryption operations. Organizations can run automatic bucket-level encryption at any time rather than being forced to make suboptimal security choices.

## RustFS Key Encryption Service

RustFS provides built-in options for key encryption. RustFS's Key Encryption Service (KES) is a stateless distributed key management system for high-performance applications. It's designed to run in Kubernetes and distribute encryption keys to applications. KES is a required component for RustFS server-side object encryption (SSE-S3).

KES supports encryption operations on RustFS clusters and is a key mechanism for ensuring scalable and high-performance encryption operations. KES acts as an intermediary between RustFS clusters and external KMS, generating encryption keys as needed and performing encryption operations without being limited by KMS constraints. Therefore, there's still a central KMS that protects master keys and serves as the root of trust in the infrastructure. KES simplifies deployment and management by eliminating the need to bootstrap KMS for each set of applications. Instead, applications can request data encryption keys (DEKs) from KES servers or ask KES servers to decrypt encrypted DEKs.

Since KES servers are completely stateless, they can be automatically scaled, such as through Kubernetes Horizontal Pod Autoscaler. At the same time, since KES independently handles the vast majority of application requests, the load on the central KMS doesn't increase significantly.

For Kubernetes environments, the RustFS Kubernetes Operator supports deploying and configuring KES for each tenant, enabling SSE-S3 as part of each tenant deployment.

![KES Key Encryption Service Architecture](images/s5-2.png)

## Supported External Key Management Systems

| ![AWS KMS](images/s5i-1.png) | ![HashiCorp Vault](images/s5i-2.png) | ![Google Secret Manager](images/s5i-3.png) |
|-------------------------------|----------------------------------------|-------------------------------------------|
| ![Azure Key Vault](images/s5i-4.png) | ![Thales CipherTrust](images/s5i-5.png) | ![Fortanix](images/s5i-6.png) |
