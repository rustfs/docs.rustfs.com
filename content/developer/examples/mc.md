---
title: "mc (MinIO Client)"
description: "Connect the MinIO Client (mc) to RustFS and perform basic object operations."
---

[mc](https://min.io/docs/minio/linux/reference/minio-mc.html) is the MinIO command-line client for S3-compatible object storage, and it works with RustFS out of the box.

## Install

```bash
brew install minio/stable/mc
```

Or download a binary from the [official install guide](https://min.io/docs/minio/linux/reference/minio-mc.html#install-mc).

## Configure

Create an alias pointing at your RustFS endpoint. Replace `http://localhost:9000` with your server address, and use your own [access keys](../../administration/iam/access-token.md):

```bash
mc alias set rustfs http://localhost:9000 <your-access-key> <your-secret-key>
```

```text
Added `rustfs` successfully.
```

`mc` uses path-style requests by default, which is what RustFS expects. The default region is `us-east-1`.

## Verify

Create a bucket:

```bash
mc mb rustfs/my-bucket
```

```text
Bucket created successfully `rustfs/my-bucket`.
```

Upload a file:

```bash
mc cp /path/to/hello.txt rustfs/my-bucket/
```

```text
/path/to/hello.txt: 12 B / 12 B  100.00% 1.2 KiB/s 0s
```

List the bucket:

```bash
mc ls rustfs/my-bucket
```

```text
[2026-07-15 10:30:00 UTC]    12B STANDARD hello.txt
```

## Next steps

See the [full mc guide](../mc.md) for bucket policies, mirroring, and more operations.
