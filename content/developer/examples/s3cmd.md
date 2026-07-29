---
title: "s3cmd"
description: "Connect s3cmd to RustFS and perform basic object operations from the command line."
---

[s3cmd](https://s3tools.org/s3cmd) is a command-line client for S3-compatible storage. Point it at your RustFS endpoint with a small config file.

## Install

```bash
# macOS
brew install s3cmd
# Debian/Ubuntu
sudo apt install s3cmd
# or via pip
pip install s3cmd
```

## Configure

Create `~/.s3cfg`. Replace `localhost:9000` with your server address and use your own [access keys](../../security-compliance/iam/access-token.md). RustFS uses path-style addressing, so set the bucket host to the same endpoint:

```ini title="~/.s3cfg"
[default]
access_key = <your-access-key>
secret_key = <your-secret-key>
host_base = localhost:9000
host_bucket = localhost:9000
use_https = False
signature_v2 = False
```

:::note

Set `use_https = True` and point at port `9000` if you have [configured TLS](../../integration/tls-configured.md).

:::

## Verify

Create a bucket, upload a file, and list it:

```bash
s3cmd mb s3://my-bucket
s3cmd put /path/to/hello.txt s3://my-bucket/hello.txt
s3cmd ls s3://my-bucket
```

```text
upload: '/path/to/hello.txt' -> 's3://my-bucket/hello.txt'  [1 of 1]
2026-07-16 10:00        12   s3://my-bucket/hello.txt
```

## Next steps

See the [SDK overview](../sdk/index.md) to connect an application, or manage objects with [`rc`](/operations/rc).
