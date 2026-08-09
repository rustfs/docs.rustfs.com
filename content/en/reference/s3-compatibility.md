---
title: "S3 Compatibility Matrix"
description: "Review the tested and intentionally excluded Amazon S3 behavior in the current RustFS compatibility gate."
---

RustFS implements a tested subset of the Amazon S3 API. This matrix summarizes the executable Ceph s3tests lists maintained in `rustfs/rustfs`; it does not claim complete coverage of every standard or vendor-specific S3 behavior.

The snapshot below was verified against RustFS commit [`1e6f5f1e`](https://github.com/rustfs/rustfs/commit/1e6f5f1e35f188f28844a7f81361ccca4d5d0c7b) on August 9, 2026.

## Status legend

| Status | Meaning |
| --- | --- |
| ✅ Tested | Covered by the default or lifecycle compatibility gate |
| ❌ Planned | Standard behavior tracked as not yet implemented |
| ⊘ Excluded | Vendor-specific, intentionally unsupported, or outside the default gate |

## Executable test lists

| List | Cases | Role |
| --- | ---: | --- |
| [Implemented tests](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/implemented_tests.txt) | 455 | Standard cases expected to pass in the default gate |
| [Lifecycle behavior tests](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/lifecycle_behavior_tests.txt) | 5 | Expiration cases run in the dedicated lifecycle gate |
| [Unimplemented tests](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/unimplemented_tests.txt) | 17 | Standard behavior that remains planned |
| [Excluded tests](https://github.com/rustfs/rustfs/blob/main/scripts/s3-tests/excluded_tests.txt) | 270 | Cases that do not block the RustFS compatibility gate |

Counts ignore blank lines and comments. They change as tests move between lists, so use the linked files for the latest result.

## Bucket operations

| Capability | Status | Scope |
| --- | --- | --- |
| Create, delete, list, and inspect buckets | ✅ Tested | Common bucket lifecycle operations |
| Bucket tagging | ✅ Tested | Put, get, and delete tagging |
| Bucket policies | ✅ Tested | Put, get, and delete policies |
| Public access block | ✅ Tested | Put, get, and delete configuration |
| Selected versioning, Object Lock, CORS, and lifecycle behavior | ✅ Tested | Only the cases present in the implemented lists |
| Bucket access logging | ❌ Planned | Tracked in the unimplemented list |
| Bucket ownership controls | ❌ Planned | Tracked in the unimplemented list |
| ACL authorization | ⊘ Excluded | Intentionally unsupported product behavior |

## Object operations

| Capability | Status | Scope |
| --- | --- | --- |
| Put, get, copy, inspect, and delete objects | ✅ Tested | Common object operations |
| Prefix, delimiter, marker, and `max-keys` listing behavior | ✅ Tested | `ListObjects` and `ListObjectsV2` |
| Range and conditional reads | ✅ Tested | Selected HTTP range and precondition cases |
| User metadata and object tagging | ✅ Tested | Metadata and tag round trips |
| Presigned GET and PUT URLs | ✅ Tested | Selected signature and request cases |
| SSE-C and selected SSE-KMS behavior | ✅ Tested | RustFS-managed object round trips only |
| POST Object form checksum handling | ❌ Planned | Tracked in the unimplemented list |

Encrypted object formats are not portable between RustFS and other S3 implementations. A passing encryption test means RustFS can read objects that RustFS encrypted; it does not guarantee that RustFS can read an encrypted object copied directly from another implementation.

## Multipart operations

| Capability | Status | Scope |
| --- | --- | --- |
| Create, upload parts, complete, and abort | ✅ Tested | Core multipart upload workflow |
| Selected multipart copy, checksum, and object-attribute behavior | ✅ Tested | Cases present in the implemented list |
| Multipart upload listing and part-lookup edge cases | ⊘ Excluded | Not part of the default compatibility gate |

## Source of truth

The repository [S3 compatibility matrix](https://github.com/rustfs/rustfs/blob/main/docs/architecture/s3-compatibility-matrix.md) explains the gate and its update rule. The executable files under [`scripts/s3-tests`](https://github.com/rustfs/rustfs/tree/main/scripts/s3-tests) determine the current result. When a feature changes, update the test lists and both published matrices together.
