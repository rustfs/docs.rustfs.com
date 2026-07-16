---
title: "RustFS Bucket Deletion"
description: "Delete buckets using the RustFS UI, MinIO Client, or API."
---

This guide explains how to delete buckets using the RustFS UI, `mc` (MinIO Client), or API.

**Warning**: Deleting a bucket is irreversible and may break applications relying on it. Ensure you have backed up any necessary data before proceeding.

## Using the RustFS UI

1. Log in to the RustFS Console.
2. On the homepage, select the bucket you want to delete.
3. On the far right, select the **Delete** button.
4. In the popup dialog, click **Confirm** to complete bucket deletion.

![bucket deletion](images/bucket-deletion-on-ui.png)

## Using `mc`

See the [`mc` Usage Guide](../../developer/mc.md) for installation and configuration.

Delete a bucket:

```bash
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

## Using the API

Delete a bucket via API:

```
DELETE /{bucketName} HTTP/1.1
```

S3 requests must be signed with AWS Signature V4, so use an S3 client rather than hand-crafting headers. With the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured for your access keys:

```bash
aws s3api delete-bucket \
  --bucket bucket-creation-by-api \
  --endpoint-url http://localhost:9000
```

Verify the bucket deletion in the RustFS Console.
