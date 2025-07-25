---
title: "SDK Overview"
description: "What S3 SDKs can be used with RustFS? This article provides detailed instructions."
---

# SDK Overview

RustFS is a distributed object storage software that is 100% compatible with the S3 protocol. Users can:

1. Manage RustFS through the Console management interface;
2. Manage RustFS through S3 clients;
3. Implement object storage operations and management on the business side through SDKs.

## Terminology Before Reading

S3 is the name of the object storage product first opened and launched by Amazon. And they opened all their protocols and specifications. Later, almost all object storage systems followed S3's protocols and specifications.
Sometimes people call S3 object storage, and sometimes they simply refer to S3 as the object storage protocol.

## 1. SDK Recommendations

Since there are already too many SDKs on the market that have been maintained for many years. For example, AWS S3 SDK has been debugged and optimized for years. Its performance and error rate are almost zero. Therefore, we recommend that you directly use the standard AWS S3 SDK to directly control RustFS and communicate with RustFS.

If you have familiar SDKs and trusted SDK vendor products, you can use them all.

Due to "modifications" made by Chinese cloud vendors in many places, many of the latest S3 technologies are not supported. Therefore, many object storage products worldwide do not recommend SDKs from many Chinese cloud vendors.

## 2. Can MinIO SDKs communicate directly with RustFS?

Yes.

We have conducted comprehensive adaptation and compatibility for MinIO SDKs.

If you are using MinIO SDKs, you can directly be compatible with RustFS by modifying the Endpoint, AK, and SK.

## 3. What to do if there are other incompatible SDKs?

What should we do if we use an SDK from a certain cloud vendor that doesn't support the latest S3, MinIO, and RustFS?
Please replace the SDK as soon as possible and re-match and upgrade on the business side.
