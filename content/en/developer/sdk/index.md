---
title: "SDKs"
description: "Overview of supported S3 SDKs for RustFS."
---

RustFS is a distributed object storage system fully compatible with the S3 protocol. You can:

- Manage RustFS in the Console.
- Manage RustFS through S3 clients.
- Use an S3 SDK to manage buckets and objects from your application.

The following guides explain how to use S3 SDKs with RustFS:

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)
- [TypeScript SDK](./typescript.md)
- [Go SDK](./go.md)

## Terminology

Amazon Simple Storage Service (Amazon S3) was the first widely adopted object storage service. Its API has become the de facto standard for object storage. In this documentation, "S3" refers to the protocol.

## SDK Recommendations

We recommend using the official AWS S3 SDKs. These SDKs are mature, well-maintained, and highly optimized.

You can also use a vendor SDK you know and trust, provided it supports the S3 operations you need.

Some third-party SDKs may have non-standard implementations. We recommend avoiding SDKs that are not strictly S3-compliant.

## Compatibility with MinIO SDKs

RustFS is fully compatible with the MinIO SDKs.

To connect a MinIO SDK to RustFS, set the endpoint, access key, and secret key to your RustFS values.

## Handling Incompatible SDKs

If an SDK does not work with standard S3, MinIO, or RustFS, we recommend switching to a standard AWS S3 SDK.
