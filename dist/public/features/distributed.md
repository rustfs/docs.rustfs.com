# Infrastructure for Large-Scale Data (/features/distributed)



RustFS is engineered for scalability across all dimensions: technical, operational, and economic.

RustFS is designed to be cloud-native and can run as lightweight containers managed by external orchestration services like Kubernetes. The entire application is compiled into a single static binary (\~100 MB) that efficiently uses CPU and memory resources even under high load. As a result, you can co-host large numbers of tenants on shared hardware.

<Mermaid
  chart="flowchart LR
    APP[Applications] --> S3API([&#x22;S3 API&#x22;])

    subgraph DIST[&#x22;Distributed RustFS&#x22;]
        direction TB
        subgraph N1[&#x22;Node 1&#x22;]
            direction LR
            S3a[S3]
            subgraph OL1[&#x22;Object Layer&#x22;]
                direction TB
                C1[Cache]
                K1[Compression]
                E1[Encryption]
                B1[&#x22;Erasure Code · Bitrot&#x22;]
            end
            SL1[&#x22;Storage Layer&#x22;]
            J1[(&#x22;JBOD / FS disks&#x22;)]
            S3a -->|Object API| OL1
            OL1 -->|Storage API| SL1
            SL1 <--> J1
        end
        subgraph N2[&#x22;Node 2&#x22;]
            direction LR
            S3b[S3]
            subgraph OL2[&#x22;Object Layer&#x22;]
                direction TB
                C2[Cache]
                K2[Compression]
                E2[Encryption]
                B2[&#x22;Erasure Code · Bitrot&#x22;]
            end
            SL2[&#x22;Storage Layer&#x22;]
            J2[(&#x22;JBOD / FS disks&#x22;)]
            S3b -->|Object API| OL2
            OL2 -->|Storage API| SL2
            SL2 <--> J2
        end
        NN[&#x22;Node n ...&#x22;]
        N1 <-->|Internal RESTful API| N2
        N2 <-->|Internal RESTful API| NN
    end

    S3API --> N1
    S3API --> N2
    S3API --> NN

    classDef server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e293b;
    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;
    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;
    classDef muted fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,color:#1e293b;
    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;
    class APP,NN muted
    class S3API accent
    class S3a,S3b,SL1,SL2 server
    class C1,K1,E1,B1,C2,K2,E2,B2 svc
    class J1,J2 store"
/>

RustFS can run anywhere and on any cloud, but typically runs on commodity servers with locally attached drives (JBOD/JBOF). All servers in the cluster are functionally equal (fully symmetric architecture). There are no name nodes or metadata servers.

RustFS atomically writes data and metadata, eliminating the need for a separate metadata database. Additionally, RustFS performs all functionality (erasure coding, bitrot checking, encryption) as inline, strictly consistent operations. This results in extraordinary resilience.

Each RustFS cluster is a collection of distributed RustFS servers, with one process per node. RustFS runs as a single process in user space and uses lightweight coroutines to achieve high concurrency. Drives are grouped into erasure sets (see the [erasure code calculator](https://rustfs.com/erasure-code-calculator/)), and objects are placed on these sets using a deterministic hashing algorithm.

RustFS is designed for large-scale, multi-datacenter cloud storage services. Each tenant runs their own RustFS cluster, completely isolated from other tenants, enabling them to protect themselves from any disruption due to upgrades, updates, and security events. Each tenant scales independently by federating clusters across geographies.
