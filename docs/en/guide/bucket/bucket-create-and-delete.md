---
title: "RustFS Bucket Management"
description: "Manage RustFS buckets, including creation and deletion."
---

# RustFS Buckets

A bucket is the fundamental container for organizing and managing data in RustFS. Each bucket has a unique name and can contain multiple objects. Buckets provide logical grouping to simplify data management and access. You can operate on buckets via the RustFS UI, `mc` (MinIO Client), or the S3-compatible API (create, delete, upload, download, etc.).

## Create a Bucket

Prerequisites:

- An available RustFS instance. See the [Installation Guide](/installation/index) to deploy one.

## Create a bucket in the RustFS UI

1. Sign in to the RustFS UI console.
2. On the home page, click **Create Bucket** in the upper-left corner.
3. Enter a bucket name and click **Create**.

![bucket creation](./images/bucket-creation-by-ui.png)

### Create a bucket with `mc`

> For `mc` installation and configuration, see the [`mc` Guide](../mc.md).

Use `mc mb` to create a bucket:

```
# create a RustFS bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm the bucket exists
mc ls rustfs/bucket-creation-by-mc
```

### Create a bucket via API

Use the following API to create a bucket:

```
PUT /{bucketName} HTTP/1.1
```

Example:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

You can confirm in the RustFS UI that the `bucket-creation-by-api` bucket has been created.

## Delete a Bucket

Note: Buckets are critical for storing data. Deleting a bucket may break applications that depend on it. Before deletion, back up any required data and ensure the bucket is no longer needed.

### Delete a bucket in the RustFS UI

1. Sign in to the RustFS UI console.
2. On the home page, select the bucket to delete.
3. Click **Delete** on the far right.
4. In the confirmation dialog, click **Confirm**.

![bucket deletion](./images/bucket-deletion-on-ui.png)

### Delete a bucket with `mc`

For `mc` installation and configuration, see the [`mc` Guide](../mc.md).

Use `mc rb` to delete a bucket:

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### Delete a bucket via API

Use the following API to delete a bucket:

```
DELETE /{bucketName} HTTP/1.1
```

Example:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

You can confirm in the RustFS UI that the `bucket-creation-by-api` bucket has been deleted.