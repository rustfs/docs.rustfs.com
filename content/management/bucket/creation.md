---
title: "RustFS Bucket Creation"
description: "Create buckets using the RustFS UI, MinIO Client, or API."
---

This guide explains how to create buckets using the RustFS UI, `mc` (MinIO Client), or API.

## Creating Buckets

Prerequisites:

- A running RustFS instance (see [Installation Guide](../../installation/index.md)).

## Using the RustFS UI

1. Log in to the RustFS Console.
2. On the Buckets page, in the top right corner, select **Create Bucket**.
3. Enter the bucket name and click **Create** to complete bucket creation.

![bucket creation](images/bucket-creation-by-ui.png)

### Using `mc`

> See the [`mc` Usage Guide](../../developer/mc.md) for installation and configuration.

Create a bucket:

```bash
# create rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### Using the API

Create a bucket via API:

```
PUT /{bucketName} HTTP/1.1
```

S3 requests must be signed with AWS Signature V4, so use an S3 client rather than hand-crafting headers. With the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured for your access keys:

```bash
aws s3api create-bucket \
  --bucket bucket-creation-by-api \
  --endpoint-url http://localhost:9000
```

Verify the bucket creation in the RustFS Console.
