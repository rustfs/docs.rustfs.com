# Data Encryption (/features/encryption)















In the object storage field, robust encryption is a fundamental requirement for enterprise storage. RustFS provides more functionality through the highest level of encryption and extensive optimizations, minimizing the performance overhead typically associated with storage encryption operations.

<Mermaid
  chart="flowchart LR
  subgraph DATA[&#x22;Data&#x22;]
    SSES3[&#x22;SSE-S3&#x22;]
    SSEC[&#x22;SSE-C&#x22;]
  end
  R([&#x22;RustFS&#x22;])
  KMS[(&#x22;KMS&#x22;)]
  subgraph B1[&#x22;My Bucket&#x22;]
    OBJ1[&#x22;Object&#x22;]
  end
  subgraph META1[&#x22;Object Metadata&#x22;]
    M1A[&#x22;Random IV&#x22;]
    M1B[&#x22;Sealed Object Key&#x22;]
    M1C[&#x22;KMS Key ID&#x22;]
    M1D[&#x22;Sealed KMS Data Key&#x22;]
  end
  SSES3 --> R
  SSEC --> R
  KMS --- R
  R --> OBJ1
  OBJ1 --> META1
  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;
  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;
  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;
  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;
  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;
  class R server
  class KMS store
  class SSES3,SSEC muted
  class OBJ1 svc
  class M1A,M1B,M1C,M1D accent"
/>

RustFS encrypts data both when stored on disk and when transmitted over the network. RustFS's state-of-the-art encryption scheme supports fine-grained object-level encryption using modern industry-standard encryption algorithms such as AES-256-GCM, ChaCha20-Poly1305, and AES-CBC. RustFS is fully compatible with S3 encryption semantics and also extends S3 by supporting non-AWS key management services such as Hashicorp Vault, Gemalto KeySecure, and Google Secrets Manager.

## Network Encryption [#network-encryption]

When data is transmitted between object storage and applications, it may bounce between any number of unknown and/or untrusted networks. Encrypting data while it's transmitted over the network (also known as "in transit") successfully mitigates man-in-the-middle attacks and ensures data remains secure regardless of the routing path taken.

RustFS supports Transport Layer Security (TLS) v1.2+ between all components in the cluster. This approach ensures there are no weak links in encrypted traffic between or within clusters. TLS is a ubiquitous encryption framework: it's the same encryption protocol used by banks, e-commerce websites, and other enterprise-level systems that rely on data storage encryption.

RustFS's TLS implementation is optimized at the CPU instruction level with negligible performance overhead. It only requires specifying TLS private keys and public certificates for each RustFS server in the cluster. For Kubernetes environments, the RustFS Kubernetes Operator integrates/automatically generates and assigns TLS certificates during tenant deployment. RustFS supports multiple TLS certificates, where each certificate corresponds to a specific domain name. RustFS uses Server Name Indication (SNI) to determine which certificate to serve for any given request.

## Object Encryption [#object-encryption]

Data stored on disk relies entirely on the security of the disk and extends to the host system to ensure data security. RustFS server-side object encryption automatically encrypts data before it's stored on disk (encryption at rest). This approach guarantees that no data is written to unencrypted disks. This baseline security layer ensures the confidentiality, integrity, and authenticity of data at rest. RustFS supports both client-driven and automatic bucket default object encryption for maximum flexibility in data encryption.

RustFS server-side encryption is compatible with Amazon AWS-S3 semantics (SSE-S3). RustFS extends baseline support for AWS KMS to include common enterprise KMS systems such as Hashicorp Vault and Thales Ciphertrust (formerly Gemalto KeySecure). RustFS also supports client-driven encryption (SSE-C), where applications can specify the data key used to encrypt objects. For both SSE-S3 and SSE-C, the RustFS server performs all encryption operations, including key rotation and object re-encryption.

Through automatic server-side encryption, RustFS encrypts each object with a unique key and applies multiple layers of additional encryption using dynamic encryption keys and keys derived from external KMS or client-provided keys. This secure and sophisticated approach is performed within RustFS without the need to handle multiple independent kernel and userspace encryption utilities.

RustFS uses Authenticated Encryption with Associated Data (AEAD) schemes to encrypt/decrypt objects when objects are written to or read from object storage. RustFS AEAD encryption supports industry-standard encryption protocols such as AES-256-GCM and ChaCha20-Poly1305 to protect object data. RustFS's CPU-level optimizations (such as SIMD acceleration) ensure negligible performance overhead for encryption/decryption operations. Organizations can run automatic bucket-level encryption at any time rather than being forced to make suboptimal security choices.

## RustFS Key Encryption Service [#rustfs-key-encryption-service]

RustFS provides built-in options for key encryption. RustFS's Key Encryption Service (KES) is a stateless distributed key management system for high-performance applications. It's designed to run in Kubernetes and distribute encryption keys to applications. KES is a required component for RustFS server-side object encryption (SSE-S3).

KES supports encryption operations on RustFS clusters and is a key mechanism for ensuring scalable and high-performance encryption operations. KES acts as an intermediary between RustFS clusters and external KMS, generating encryption keys as needed and performing encryption operations without being limited by KMS constraints. Therefore, there's still a central KMS that protects master keys and serves as the root of trust in the infrastructure. KES simplifies deployment and management by eliminating the need to bootstrap KMS for each set of applications. Instead, applications can request data encryption keys (DEKs) from KES servers or ask KES servers to decrypt encrypted DEKs.

Since KES servers are completely stateless, they can be automatically scaled, such as through Kubernetes Horizontal Pod Autoscaler. Additionally, since KES independently handles the vast majority of application requests, the load on the central KMS doesn't increase significantly.

For Kubernetes environments, the RustFS Kubernetes Operator supports deploying and configuring KES for each tenant, enabling SSE-S3 as part of each tenant deployment.

<Mermaid
  chart="flowchart LR
  Client[&#x22;RustFS Server · KES Client&#x22;]
  KES[&#x22;RustFS KES Server&#x22;]
  ExtKMS[&#x22;External KMS&#x22;]
  Client <-->|TLS| KES
  KES <-->|TLS| ExtKMS
  subgraph FLOW[&#x22;Key Flow&#x22;]
    App[&#x22;Application&#x22;]
    NewKey[&#x22;Create / Fetch DEK&#x22;]
    App --> NewKey
  end
  subgraph AUTH[&#x22;Authentication&#x22;]
    Certs[&#x22;Key / Cert pairs&#x22;]
    Identity[&#x22;Identity = Hash of Cert&#x22;]
    Certs --> Identity
  end
  App -.->|API| KES
  Identity -.-> KES
  classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;
  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;
  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;
  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;
  class KES server
  class ExtKMS store
  class Client,App svc
  class NewKey,Certs,Identity muted"
/>

## Supported External Key Management Systems [#supported-external-key-management-systems]

| <img alt="AWS KMS" src="__img0" />         | <img alt="HashiCorp Vault" src="__img1" />    | <img alt="Google Secret Manager" src="__img2" /> |
| ------------------------------------------ | --------------------------------------------- | ------------------------------------------------ |
| <img alt="Azure Key Vault" src="__img3" /> | <img alt="Thales CipherTrust" src="__img4" /> | <img alt="Fortanix" src="__img5" />              |
