# Bucket and Object Versioning

## RustFS Object Storage Provides AWS S3 Versioning Compatibility

Object-level versioning improves data protection. Versioning serves as the foundation for object locking, immutability, tiering, and lifecycle management.

RustFS implements S3-compatible versioning. RustFS assigns a unique ID to each version of an object. Applications can specify a version ID to access a point-in-time snapshot.

Versioning allows users to preserve multiple variants of an object in the same bucket, enabling retrieval and restoration of every version.

Versioning is enabled at the bucket level. Once enabled, RustFS automatically creates a unique version ID for objects.

Versioning prevents accidental overwrites and deletions. When a versioned object is deleted, a delete marker is created. The object can be restored by deleting the delete marker.

If a versioned object is overwritten, RustFS creates a new version. Old versions can be restored as needed.

## RustFS Supports Object Versioning with Three Different Bucket States

![Bucket States](./images/bucket-states.png)

Versioning can be suspended but not disabled once enabled. Versioning is a global setting in the bucket.

Users with appropriate permissions can suspend versioning to stop accumulating object versions.

Manage versioning via Console, CLI (`mc`), or SDK.

Versioning increases bucket size and may create object dependencies. Mitigate these factors through lifecycle management.

## Features

- **Bucket Replication** (Active-Active, Active-Passive)
- **`mc undo`**: Rollback PUT/DELETE objects.
- **Object Lock**
- **Continuous Data Protection (CDP)**
- **`mc rewind`**: View buckets or objects at any point in time.

## Architecture

![Architecture Diagram](./images/architecture.png)

### System Requirements

> Versioning requires: Erasure coding and at least four disks.

### Versioning States

RustFS supports three different bucket versioning states:

1. **🔴 Unversioned** - Default state, no versioning performed
2. **🟢 Enabled** - Full versioning functionality, assigns unique ID to each object version
3. **🟡 Suspended** - Stops accumulating new versions but retains existing versions

### Key Features

- 🆔 **Unique Version ID** - Each object version has a unique identifier
- 🔄 **Point-in-Time Recovery** - Can access any historical version of an object
- 🛡️ **Delete Protection** - Uses delete markers to prevent accidental deletion
- 📊 **Lifecycle Management** - Automatically manages version count and storage costs
- 🔐 **Permission Control** - Fine-grained access permission management
