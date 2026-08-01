---
title: "SSE-C"
description: "Use customer-provided AES-256 keys for RustFS object encryption and decryption."
---

SSE-C encrypts an object with a 256-bit key supplied by the client on every write and read request. RustFS validates and uses the key for the request but does not persist the plaintext customer key. SSE-C does not use the RustFS KMS backend.

## Requirements

- Install and configure [`rc`](/operations/rc).
- Install OpenSSL for the key-generation example.
- Use HTTPS so customer keys are encrypted in transit.
- Store the customer key in a secret manager and maintain a mapping between each object and its key.

:::warning[The same key is required for every read]

If you lose an SSE-C key, RustFS cannot recover it and the object becomes unreadable. Never log, commit, or send the key over an unencrypted connection.

:::

## Prepare a customer key

Generate 32 random bytes through a hexadecimal intermediate, then derive the Base64 key and its Base64-encoded MD5 checksum:

```bash
SSE_C_KEY_HEX=$(openssl rand -hex 32)
SSE_C_KEY_B64=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p | openssl base64 -A)
SSE_C_KEY_MD5=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p \
	| openssl dgst -md5 -binary | openssl base64 -A)
```

Move these values into your approved secret-management workflow. Do not print them to the terminal or shell history.

## Upload an encrypted object

`rc 0.1.29` has no dedicated SSE-C option. Its signed custom-header option can send the three S3 SSE-C headers:

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

The required request headers are:

| Header | Value |
| --- | --- |
| `x-amz-server-side-encryption-customer-algorithm` | `AES256` |
| `x-amz-server-side-encryption-customer-key` | Base64-encoded 32-byte key |
| `x-amz-server-side-encryption-customer-key-md5` | Base64-encoded MD5 digest of the raw key |

## Read the encrypted object

Supply the same three headers on reads and metadata requests:

```bash
rc object show rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

The same workflow was validated with `rc 0.1.29` against RustFS by uploading an object, reading it with the original key, and comparing the returned bytes with the source.

:::warning[Protect command arguments]

The generic `-H` method places expanded header values in the `rc` process arguments, which may be visible to other processes on the host. For production automation, prefer an S3 SDK that accepts SSE-C key material through protected memory or a credential provider instead of command-line arguments.

:::

## Clear shell variables

After the operation, remove key material from the shell environment:

```bash
unset SSE_C_KEY_HEX SSE_C_KEY_B64 SSE_C_KEY_MD5
```

Changing a bucket's SSE-S3 or SSE-KMS default does not alter SSE-C objects. SSE-C is selected by the customer-key headers on each individual request and takes precedence for that request.

## Next steps

Compare [SSE-S3](./sse-s.md) for server-managed encryption and [KMS](./kms.md) for explicit KMS-backed key management.