---
title: "Data Encryption"
description: "Find the verified RustFS server-side encryption and key management references."
---

RustFS provides server-side encryption options for data stored in the object storage service. Use this section to choose the key-management model that matches your security requirements.

## Encryption options

- [SSE-S3](./sse-s.md) covers server-managed server-side encryption with the S3 `AES256` mode.
- [SSE-C](./sse-c.md) covers server-side encryption with customer-provided keys.
- [SSE-KMS](./kms.md) covers Local, Vault KV2, and Vault Transit key-management backends.

For the currently verified KMS configuration surface, see the [CLI reference](/reference/cli) and [environment variable reference](/reference/environment-variables).