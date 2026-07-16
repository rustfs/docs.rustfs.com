# Multi-Site, Active-Active Replication for Object Storage (/features/replication)





## Active Replication for Object Storage [#active-replication-for-object-storage]

<img alt="Object Storage Replication" src="__img0" />

Active replication ensures data availability. RustFS supports active-active replication. It operates at the bucket level.

RustFS supports synchronous and near-synchronous replication, depending on architectural choices and data change rates. Replication aims for strict consistency within data centers and eventual consistency between data centers.

## Resilience Features [#resilience-features]

* **Encrypted/Unencrypted Objects**: Replicates objects and metadata.
* **Object Versions**: Preserves version history.
* **Object Tags**: Replicates tags.
* **S3 Object Lock**: Maintains retention information.

## Core Features [#core-features]

### Identical Bucket Naming [#identical-bucket-naming]

Enables transparent failover to remote sites without interruption.

### Object Lock Replication [#object-lock-replication]

Ensures data integrity and compliance requirements are maintained during replication.

### Near-Synchronous Replication [#near-synchronous-replication]

Updates objects immediately after mutation.

### Notifications [#notifications]

Pushes replication failure events for operations teams.

## Implementation Considerations [#implementation-considerations]

Key factors include:

### Infrastructure [#infrastructure]

RustFS recommends using the same hardware at both ends of the replication endpoints to simplify troubleshooting.

### Bandwidth [#bandwidth]

Bandwidth is critical for synchronization. If bandwidth is insufficient to handle peaks, changes will queue to the remote site.

### Latency [#latency]

After bandwidth, latency is the most important consideration when designing an active-active model. Latency represents the round-trip time (RTT) between two RustFS clusters. The goal is to reduce latency to the smallest possible number within the budget constraints imposed by bandwidth. RustFS recommends RTT thresholds not exceeding 20 milliseconds for Ethernet links and networks, with packet loss rates not exceeding 0.01%.

### Architecture [#architecture]

Currently, RustFS only recommends replication across two data centers. Replication across multiple data centers is possible, however, the complexity involved and the trade-offs required make this quite difficult.

## Large-Scale Deployment Architecture [#large-scale-deployment-architecture]

RustFS supports very large deployments in each data center, including source and target, with the above considerations determining scale.

<Mermaid
  chart="flowchart TB
  WAN([&#x22;WAN · 10 Gbps&#x22;])
  subgraph DC1[&#x22;Data Center 1&#x22;]
    LB1[&#x22;Spine / Leaf Switches&#x22;]
    KES1[&#x22;RustFS KES Encryption&#x22;]
    REP1[&#x22;RustFS Replication&#x22;]
    subgraph C1[&#x22;Object Storage Cluster&#x22;]
      A1[(&#x22;Storage&#x22;)]
      A2[(&#x22;Storage&#x22;)]
      A3[(&#x22;Storage&#x22;)]
      A4[(&#x22;Storage&#x22;)]
    end
    LB1 -->|100 Gbps| C1
    KES1 -->|Secret Keys| REP1
    REP1 --- C1
  end
  subgraph DC2[&#x22;Data Center 2&#x22;]
    LB2[&#x22;Spine / Leaf Switches&#x22;]
    KES2[&#x22;RustFS KES Encryption&#x22;]
    REP2[&#x22;RustFS Replication&#x22;]
    subgraph C2[&#x22;Object Storage Cluster&#x22;]
      B1[(&#x22;Storage&#x22;)]
      B2[(&#x22;Storage&#x22;)]
      B3[(&#x22;Storage&#x22;)]
      B4[(&#x22;Storage&#x22;)]
    end
    LB2 -->|100 Gbps| C2
    KES2 -->|Secret Keys| REP2
    REP2 --- C2
  end
  WAN --> LB1
  WAN --> LB2
  REP1 <-->|Async Replication| REP2
  classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;
  classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;
  classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;
  classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;
  class WAN,LB1,LB2 muted
  class KES1,KES2 accent
  class REP1,REP2 svc
  class A1,A2,A3,A4,B1,B2,B3,B4 store"
/>

## Frequently Asked Questions [#frequently-asked-questions]

### What happens when the replication target fails? [#what-happens-when-the-replication-target-fails]

If the target goes down, the source will cache changes and begin synchronizing after the replication target recovers. There may be some delay in reaching full synchronization, depending on the duration, number of changes, bandwidth, and latency.

### What are the parameters for immutability? [#what-are-the-parameters-for-immutability]

Immutability is supported. Key concepts can be found in this article. In active-active replication mode, immutability can only be guaranteed when objects are versioned. Versioning cannot be disabled on the source. If versioning is suspended on the target, RustFS will begin failing replication.

### What other impacts are there if versioning is suspended or there's a mismatch? [#what-other-impacts-are-there-if-versioning-is-suspended-or-theres-a-mismatch]

In these cases, replication may fail. For example, if you try to disable versioning on the source bucket, an error will be returned. You must first remove the replication configuration before you can disable versioning on the source bucket. Additionally, if versioning is disabled on the target bucket, replication will fail.

### How is it handled if object locking is not enabled on both ends? [#how-is-it-handled-if-object-locking-is-not-enabled-on-both-ends]

Object locking must be enabled on both source and target. There's an edge case where after setting up bucket replication, the target bucket can be deleted and recreated but without object locking enabled, and replication may fail. If object locking settings are not configured on both ends, inconsistent situations may occur. In this case, RustFS will fail silently.
