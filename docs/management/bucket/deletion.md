---
title: "RustFS Bucket Deletion"
description: "Buckets can be deleted through RustFS UI, MinIO Client, or API."
---

# RustFS Bucket Deletion

This chapter shares how to delete buckets through RustFS UI, `mc` (MinIO Client), or API.

**Note**: Buckets are important components for storing data. Deleting a bucket may cause errors in applications using this bucket. Before deleting a bucket, please ensure you have backed up all data in the bucket and you no longer need to use this bucket.

## Deleting Buckets on RustFS UI

1. Log into the RustFS UI console.
2. On the homepage, select the bucket you want to delete.
3. On the far right, select the **Delete** button.
4. In the popup dialog, click **Confirm** to complete bucket deletion.

![bucket deletion](images/bucket-deletion-on-ui.png)

## Deleting Buckets Using `mc`

For `mc` installation and configuration, see the [`mc` Usage Guide](../../developer/mc.md) chapter.

Use the `mc rb` command to delete buckets:

```bash
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

## Deleting Buckets Using API

Use the following API to delete buckets:

```
DELETE /{bucketName} HTTP/1.1
```

Request example:

```bash
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

You can confirm on the RustFS UI that the `bucket-creation-by-api` bucket has been deleted.
