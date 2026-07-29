---
title: "rclone"
description: "Connect rclone to RustFS and perform basic object operations."
---

[rclone](https://rclone.org/) is a command-line program for syncing files with cloud storage and speaks the S3 protocol that RustFS implements.

## Install

```bash
curl https://rclone.org/install.sh | sudo bash
```

Or see the [official install guide](https://rclone.org/install/).

## Configure

Add a remote to `~/.config/rclone/rclone.conf`. Replace `http://localhost:9000` with your server address, and use your own [access keys](../../security-compliance/iam/access-token.md). `force_path_style = true` is required because RustFS uses path-style addressing:

```ini title="~/.config/rclone/rclone.conf"
[rustfs]
type = s3
provider = Other
access_key_id = <your-access-key>
secret_access_key = <your-secret-key>
endpoint = http://localhost:9000
region = us-east-1
force_path_style = true
```

## Verify

Create a bucket:

```bash
rclone mkdir rustfs:my-bucket
```

Upload a file:

```bash
rclone copy /path/to/hello.txt rustfs:my-bucket
```

List buckets and contents:

```bash
rclone lsd rustfs:
rclone ls rustfs:my-bucket
```

```text
          -1 2026-07-15 10:30:00        -1 my-bucket
       12 hello.txt
```

## Next steps

Build applications against RustFS with an [S3 SDK](../sdk/index.md), or manage objects with [`rc`](/operations/rc).
