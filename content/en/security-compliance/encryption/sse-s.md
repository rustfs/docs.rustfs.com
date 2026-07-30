---
title: "SSE-S3"
description: "Configure server-managed SSE-S3 encryption for RustFS buckets and object writes."
---

SSE-S3 uses the S3 `AES256` encryption mode. RustFS generates a unique data encryption key for each encrypted object and uses the configured KMS service to wrap that key. Clients do not provide or retain the encryption key.

## Requirements

- Configure and start [KMS](./kms.md), create its default key, and verify the key is available before enabling SSE-S3.
- Install and configure [`rc`](/operations/rc).
- Create the target bucket and verify that normal object writes succeed.

:::warning[KMS availability is required]

RustFS accepts an SSE-S3 bucket default even when KMS is unavailable, but encrypted object writes then fail. Verify an encrypted write and read before using the bucket for production data.

:::

## Set bucket default encryption

Apply SSE-S3 to new writes that do not specify an object-level encryption mode:

```bash
rc bucket encryption set rustfs/my-bucket --mode sse-s3
rc bucket encryption info rustfs/my-bucket
```

The reported mode should be `SSE-S3`.

Upload and read a test object:

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

## Encrypt one object explicitly

Apply SSE-S3 to a single destination without changing the bucket default:

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-s3 rustfs/my-bucket/hello.txt
```

For recursive writes, the encryption selector must exactly match the destination prefix:

```bash
rc object copy ./reports/ rustfs/my-bucket/reports/ --recursive \
	--enc-s3 rustfs/my-bucket/reports/
```

## Clear the bucket default

Remove the default rule:

```bash
rc bucket encryption clear rustfs/my-bucket
rc bucket encryption info rustfs/my-bucket
```

Clearing or changing the bucket default affects only later writes. It does not decrypt or rewrite existing objects.

## Request contract

S3 clients request SSE-S3 with:

```http
x-amz-server-side-encryption: AES256
```

An object-level request overrides the bucket default for that write. If no object-level mode is supplied, RustFS resolves the effective mode from the bucket encryption configuration.

## Next steps

Use [SSE-KMS](./kms.md#verify-kms-backed-encryption) when you need an explicit KMS key ID, or compare [SSE-C](./sse-c.md) for client-held keys.