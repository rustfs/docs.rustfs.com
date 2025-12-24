---
title: "Managing RustFS Objects with MinIO Client"
description: "Managing RustFS objects with MinIO Client"
---

# MinIO Client (`mc`)

MinIO Client (`mc`) is an official command-line tool provided by MinIO for managing MinIO object storage services. `mc` can interact with MinIO, Amazon S3, and other S3-compatible object storage services, providing a simple and efficient way to manage data in object storage services. Since MinIO is S3-compatible, `mc` can also be used to manage RustFS objects.

Prerequisites:

- An available RustFS instance. Refer to the [Installation Guide](../installation/index.md) for installation.
- `mc` tool is installed.
- Available [access keys](../administration/iam/access-token.md).

## Using `mc` to Operate RustFS

First, you need to use the `mc alias` command to configure an alias for RustFS:

```bash
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Output:

```bash
Added `rustfs` successfully.
```

Next, you can use `mc` to operate on the alias `rustfs` to create/delete buckets, upload/download files, etc.

### List Buckets

Use `mc ls` to list all buckets under the current RustFS instance:

```bash
mc ls rustfs
```

Output:

```bash
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Create Bucket

Use `mc mb` command to create a bucket:

```bash
mc mb rustfs/bucket-creation-by-mc
```

Output:

```bash
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Delete Bucket

Use `mc rb` command to delete a bucket:

```bash
mc rb rustfs/bucket-creation-by-mc
```

Output:

```bash
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Upload File to Bucket

Use `mc cp` command to upload a file to a bucket:

```bash
mc cp file_name rustfs/bucket-creation-by-mc
```

Output:

```bash
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Delete File in Bucket

Use `mc rm` command to delete a file in a bucket:

```bash
mc rm rustfs/bucket-creation-by-mc/file_name
```

Output:

```bash
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Download File from Storage

Use `mc get` command to download a file from a bucket:

```bash
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Response:

```bash
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```
