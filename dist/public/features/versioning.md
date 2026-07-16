# Bucket and Object Versioning (/features/versioning)



## RustFS Object Storage Provides AWS S3 Versioning Compatibility [#rustfs-object-storage-provides-aws-s3-versioning-compatibility]

Object-level versioning improves data protection. Versioning serves as the foundation for object locking, immutability, tiering, and lifecycle management.

RustFS implements S3-compatible versioning. RustFS assigns a unique ID to each version of an object. Applications can specify a version ID to access a point-in-time snapshot.

Versioning allows users to preserve multiple variants of an object in the same bucket, enabling retrieval and restoration of every version.

Versioning is enabled at the bucket level. Once enabled, RustFS automatically creates a unique version ID for objects.

Versioning prevents accidental overwrites and deletions. When a versioned object is deleted, a delete marker is created. The object can be restored by deleting the delete marker.

If a versioned object is overwritten, RustFS creates a new version. Old versions can be restored as needed.

## RustFS Supports Object Versioning with Three Different Bucket States [#rustfs-supports-object-versioning-with-three-different-bucket-states]

<Mermaid
  chart="stateDiagram-v2
    direction LR
    state &#x22;Versioning Not Enabled&#x22; as Unversioned
    state &#x22;Versioning Enabled&#x22; as Enabled
    state &#x22;Versioning Suspended&#x22; as Suspended

    [*] --> Unversioned
    Unversioned --> Enabled: Enable
    Enabled --> Suspended: Suspend
    Suspended --> Enabled: Re-enable"
/>

Versioning can be suspended but not disabled once enabled. Versioning is a global setting in the bucket.

Users with appropriate permissions can suspend versioning to stop accumulating object versions.

Manage versioning via Console, CLI (`mc`), or SDK.

Versioning increases bucket size and may create object dependencies. Mitigate these factors through lifecycle management.

## Features [#features]

* **Bucket Replication** (Active-Active, Active-Passive)
* **`mc undo`**: Rollback PUT/DELETE objects.
* **Object Lock**
* **Continuous Data Protection (CDP)**
* **`mc rewind`**: View buckets or objects at any point in time.

## Architecture [#architecture]

<Mermaid
  chart="flowchart LR
    CLOUD([&#x22;Internet Cloud&#x22;]) --> GLB[&#x22;Global Load Balancer&#x22;]
    GLB --> S1
    GLB --> S2
    GLB --> SN
    subgraph S1[&#x22;Site 1 · US-WEST&#x22;]
        A1[&#x22;Zone 1 · Erasure Sets 1-n&#x22;]
        A2[&#x22;Zone 2 · Erasure Sets 1-n&#x22;]
        A3[&#x22;Zone n · Erasure Sets 1-n&#x22;]
    end
    subgraph S2[&#x22;Site 2 · US-EAST&#x22;]
        B1[&#x22;Zone 1 · Erasure Sets 1-n&#x22;]
        B2[&#x22;Zone 2 · Erasure Sets 1-n&#x22;]
        B3[&#x22;Zone n · Erasure Sets 1-n&#x22;]
    end
    subgraph SN[&#x22;Site n · EU-CENTRAL&#x22;]
        D1[&#x22;Zone 1 · Erasure Sets 1-n&#x22;]
        D2[&#x22;Zone 2 · Erasure Sets 1-n&#x22;]
        D3[&#x22;Zone n · Erasure Sets 1-n&#x22;]
    end
    classDef svc fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#1e293b;
    classDef accent fill:#fae8ff,stroke:#c026d3,stroke-width:2px,color:#1e293b;
    classDef store fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#1e293b;
    class CLOUD svc
    class GLB accent
    class A1,A2,A3,B1,B2,B3,D1,D2,D3 store"
/>

### System Requirements [#system-requirements]

> Versioning requires: Erasure coding and at least four disks.

### Versioning States [#versioning-states]

RustFS supports three different bucket versioning states:

1. **🔴 Unversioned** - Default state, no versioning performed
2. **🟢 Enabled** - Full versioning functionality, assigns unique ID to each object version
3. **🟡 Suspended** - Stops accumulating new versions but retains existing versions

### Key Features [#key-features]

* 🆔 **Unique Version ID** - Each object version has a unique identifier
* 🔄 **Point-in-Time Recovery** - Can access any historical version of an object
* 🛡️ **Delete Protection** - Uses delete markers to prevent accidental deletion
* 📊 **Lifecycle Management** - Automatically manages version count and storage costs
* 🔐 **Permission Control** - Fine-grained access permission management
