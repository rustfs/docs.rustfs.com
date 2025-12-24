---
title: "RustFS SDK Overview"
description: "Overview of supported S3 SDKs for RustFS."
---

# SDK Overview

RustFS is a distributed object storage system fully compatible with the S3 protocol. Users can:

- Manage RustFS through the Console management interface.
- Manage RustFS through S3 clients.
- Implement object storage operations and management on the business side through SDKs.

Currently, the SDKs provided by RustFS include:

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)
- [TypeScript SDK](./typescript.md)
- [Golang SDK](./go.md)

## Terminology

Amazon S3 (Simple Storage Service) was the first widely adopted object storage service. Its API has become the de facto standard for object storage. In this documentation, "S3" refers to the protocol.

## 1. SDK Recommendations

We recommend using the official AWS S3 SDKs. These SDKs are mature, well-maintained, and highly optimized.

If you have a familiar and trusted SDK from a vendor, you can use it.

Some third-party SDKs may have non-standard implementations. We recommend avoiding SDKs that are not strictly S3-compliant.

## 2. Compatibility with MinIO SDKs

Yes, RustFS is fully compatible with MinIO SDKs.

If you are using MinIO SDKs, you can modify the Endpoint, AK, and SK to be directly compatible with RustFS.

## 3. Handling Incompatible SDKs

If you encounter an SDK that does not support standard S3, MinIO, or RustFS:

We recommend switching to a standard AWS S3 SDK.
