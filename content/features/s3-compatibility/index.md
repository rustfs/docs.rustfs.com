---
title: "S3 Compatibility"
description: "The RustFS S3 compatibility matrix: which S3 APIs are implemented, which are planned, and which are intentionally out of scope, backed by the executable Ceph s3tests suites."
---

RustFS provides broad S3 API compatibility for supported features. It does not claim complete coverage of every standard or vendor-specific S3 behavior. This page reproduces the upstream [S3 compatibility matrix](https://github.com/rustfs/rustfs/blob/main/docs/architecture/s3-compatibility-matrix.md), which ties the compatibility claim to the executable Ceph s3tests lists under `scripts/s3-tests/` in the RustFS repository.

Legend: ✅ implemented and gated by tests · ❌ planned but not yet implemented · ⊘ intentionally excluded (out of scope).

## Test list sources

| List | Purpose | Count | Source |
| --- | --- | ---: | --- |
| Implemented tests | Standard S3 tests expected to pass; used by the default local s3tests run. | 452 | `scripts/s3-tests/implemented_tests.txt` |
| Lifecycle behavior tests | Expiration behavior cases gated by the dedicated lifecycle lane (debug-accelerated day + scanner enabled). | 5 | `scripts/s3-tests/lifecycle_behavior_tests.txt` |
| Unimplemented tests | Standard S3 features planned but not yet implemented. | 17 | `scripts/s3-tests/unimplemented_tests.txt` |
| Excluded tests | Vendor-specific or intentionally unsupported behavior excluded from compatibility gating. | 273 | `scripts/s3-tests/excluded_tests.txt` |

Counts ignore blank lines and comments.

## Supported coverage

The implemented test list currently covers the common object-storage surface:

### Bucket APIs

| Area | Status |
| --- | --- |
| Bucket create / delete / list / head | ✅ |
| Bucket and object tagging | ✅ |
| Bucket policy put / get / delete | ✅ |
| Public access block put / get / delete | ✅ |

### Object APIs

| Area | Status |
| --- | --- |
| Object put / get / delete / copy / head | ✅ |
| ListObjects / ListObjectsV2 with prefix, delimiter, marker, max-keys | ✅ |
| Presigned GET and PUT URLs | ✅ |
| Range and conditional reads | ✅ |
| User metadata | ✅ |
| SSE-C and selected SSE-KMS edge cases | ✅ |
| Selected versioning, object-lock, checksum, CORS, raw request, and conditional write behavior | ✅ |

### Multipart APIs

| Area | Status |
| --- | --- |
| Multipart upload create / upload / complete / abort | ✅ |
| Selected multipart copy, checksum, and object-attribute behavior | ✅ |

## Planned standard coverage

These are standard S3 areas that remain planned work and are not yet complete:

| Area | Status | Evidence |
| --- | --- | --- |
| Bucket access logging | ❌ | `unimplemented_tests.txt` |
| POST Object form upload checksum handling | ❌ | `unimplemented_tests.txt` |
| Bucket ownership controls | ❌ | `unimplemented_tests.txt` |
| IAM-account or multi-storage-class dependent cases | ❌ | `unimplemented_tests.txt` |
| Tenanted bucket policy edge cases | ❌ (needs investigation) | `unimplemented_tests.txt` |
| Multipart upload listing and part lookup compatibility edge cases | ⊘ (not part of default gate) | `excluded_tests.txt` |

## Intentional exclusions

The excluded list contains tests that do not block the RustFS compatibility gate. They fall into two classes:

- vendor-specific or non-portable behavior not required for RustFS S3 compatibility;
- intentionally unsupported product behavior, such as ACL authorization.

## Lifecycle behavior lane

The lifecycle behavior lane runs real Days-based expiration cases. It requires `RUSTFS_ILM_DEBUG_DAY_SECS` (the Ceph `lc_debug_interval` equivalent) and an enabled background scanner, and runs separately from the default single-server gate because a global debug day would also shrink the `x-amz-expiration` header asserted by other lifecycle header tests.

:::note
For the authoritative, always-current test lists and the update rule that moves entries from unimplemented to implemented, see the upstream matrix: [docs/architecture/s3-compatibility-matrix.md](https://github.com/rustfs/rustfs/blob/main/docs/architecture/s3-compatibility-matrix.md).
:::
