---
title: "RustFS SDK Overview"
description: "Which S3 SDKs can be used with RustFS? This article provides a detailed explanation."
---

# SDK Overview

RustFS is a distributed object storage software that is 100% compatible with the S3 protocol. Users can:

1. Manage RustFS through the Console management interface;
2. Manage RustFS through S3 clients;
3. Implement object storage operations and management on the business side through SDKs.

Currently, the SDKs provided by RustFS include:

- [Java SDK](./java.md)
- [JavaScript SDK](./javascript.md)
- [Python SDK](./python.md)
- [Rust SDK](./rust.md)
- [TypeScript SDK](./typescript.md)
- [Golang SDK](./go.md)

## Terminology Explanation Before Reading

S3 is the name of the first object storage product opened and launched by Amazon. It opened all its protocols and specifications. Later, almost all object storage systems followed the S3 protocols and specifications. Sometimes people call S3 object storage, and sometimes they simply call S3 the object storage protocol.

## 1. SDK Recommendations

Since there are already too many SDKs on the market that have been maintained for many years, such as AWS S3 SDK which has been debugged and optimized for many years. Its performance and errors are almost zero. Therefore, we recommend that you directly use the standard AWS S3 SDK to directly control and communicate with RustFS.

If you have a familiar and trusted SDK from a vendor, you can use it.

Because many Chinese cloud providers have made "modifications" in many places and do not support many of the latest S3 technologies, many object storage products around the world do not recommend the SDKs of many Chinese cloud providers.

## 2. Can MinIO SDKs communicate directly with RustFS?

Yes.

We have conducted comprehensive adaptation and compatibility for MinIO SDKs.

If you are using MinIO SDKs, you can modify the Endpoint, AK, and SK to be directly compatible with RustFS.

## 3. What to do if there are other incompatible SDKs?

If we use an SDK from a cloud provider that does not support the latest S3, MinIO, or RustFS, how should we handle it?
Please replace the SDK as soon as possible and re-match and upgrade on the business side.
