---
title: "Create a bucket"
description: "Create a bucket on the Console, with rc, or with the S3 API."
---

This guide explains how to create a bucket on the Console, with `rc`, or with the S3 API.

## Requirements

- A running RustFS instance (see [Installation Guide](../../../installation/index.md)).
- [`rc`](/operations/rc) installed and configured with an alias for the command-line workflow.

## Use the RustFS Console

1. Sign in to the RustFS Console.
2. On the Buckets page, in the top right corner, select **Create Bucket**.
3. Enter a bucket name and select **Create**.

![bucket creation](images/bucket-creation-by-ui.png)

## Using `rc`

See the [`rc` guide](/operations/rc) for installation and alias configuration.

Create a bucket:

```bash
rc bucket create rustfs/my-bucket
rc bucket list rustfs/
```

```text
✓ Bucket 'rustfs/my-bucket' created successfully.
```

## Using the API

Create a bucket via API:

```http
PUT /{bucketName} HTTP/1.1
```

S3 requests must be signed with AWS Signature V4, so use an S3 client rather than hand-crafting headers. With the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured for your access keys:

```bash
aws s3api create-bucket \
  --bucket bucket-creation-by-api \
  --endpoint-url http://localhost:9000
```

Confirm that the bucket appears in the RustFS Console.
