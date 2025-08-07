---
title: "Manage RustFS Objects with MinIO Client"
description: "Use MinIO Client to manage RustFS objects."
---

# MinIO Client (`mc`)

MinIO Client (`mc`) is MinIO's official command-line tool for managing MinIO object storage. `mc` can interact with MinIO, Amazon S3, and other S3-compatible object storage services, providing a simple and efficient way to manage data. Since RustFS is S3-compatible, `mc` can also be used to manage RustFS objects.

Prerequisites:

- An available RustFS instance. See the [Installation Guide](/installation/index) to deploy one.
- `mc` installed.
- A valid [Access Key](access-token.md).

## Operate RustFS via `mc`

First, configure an alias for RustFS using `mc alias`:

```
mc alias set rustfs http://12.34.56.78:9000 ACCESS_KEY SECRET_KEY
```

Response:

```
Added `rustfs` successfully.
```

You can then use `mc` with the `rustfs` alias to create/delete buckets and upload/download objects.

### List buckets

Use `mc ls` to list all buckets under the current RustFS instance:

```
mc ls rustfs
```

Response:

```
[2025-08-01 10:46:24 CST]     0B bucket-creation-by-api/
[2025-07-29 09:15:35 CST]     0B rustfs-demo/
[2025-08-03 09:44:45 CST]     0B bucket-creation-by-ui/
```

### Create a bucket

Use `mc mb` to create a bucket:

```
mc mb rustfs/bucket-creation-by-mc
```

Response:

```
Bucket created successfully `rustfs/bucket-creation-by-mc`.
```

### Remove a bucket

Use `mc rb` to remove a bucket:

```
mc rb rustfs/bucket-creation-by-mc
```

Response:

```
Removed `rustfs/bucket-creation-by-mc` successfully.
```

### Upload a file to a bucket

Use `mc cp` to upload a file to a bucket:

```
mc cp file_name rustfs/bucket-creation-by-mc
```

Response:

```
...path/to/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12 B/s 0s%
```

### Delete an object in a bucket

Use `mc rm` to delete an object in a bucket:

```
mc rm rustfs/bucket-creation-by-mc/file_name
```

Response:

```
Removed `rustfs/bucket-creation-by-mc/1.txt`.
```

### Download an object

Use `mc get` to download an object:

```
mc get rustfs/bucket-creation-by-mc/file_name ./file_name
```

Response:

```
...eation-by-mc/file_name: 4 B / 4 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  18 B/s 0s%
```