---
title: "RustFS Object Management"
description: "Manage RustFS objects, including creation and deletion."
---

# RustFS Objects

An object is the basic storage unit in RustFS. It includes data, metadata, and a unique identifier (Object Key). This section uses file upload and deletion to illustrate object management.

> For object-related concepts, see [Core Concepts](/concepts/glossary.md).

## Create an Object

Prerequisites:

- An available RustFS instance. See the [Installation Guide](/installation/index) to deploy one.

[Create a bucket](bucket-create-and-delete.md) first, then upload a file into the bucket to create an object. You can upload via the RustFS UI, `mc`, or the S3-compatible API.

### Upload a file via RustFS UI

1. Sign in to the RustFS UI console.
2. Select the target bucket.
3. On the bucket page, use **New Directory**, **New File**, or **Upload Files/Folders** to create content.
4. To upload from local, click **Upload Files/Folders**, choose local files/folders, then click **Start Upload**.

![object creation from ui](./images/upload_file_from_ui.png)

After the upload completes, click the object to view its details.

![object details info](./images/object_details_info.png)

### Upload a file with `mc`

> For `mc` installation and configuration, see the [`mc` Guide](../mc.md).

Use `mc cp` to upload:

```
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm upload
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

You can also verify in the RustFS console.

### Upload a file via API

Use the following API to upload:

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

Example:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

Verify the upload in the RustFS console.

## Delete an Object

You can delete objects via the UI, `mc`, or API. For example, remove the file created in the steps above.

## Delete a file via RustFS UI

1. Sign in to the RustFS UI console.
2. Select the bucket containing the file.
3. On the bucket page, select the file to delete.
4. Click **Delete Selected** in the upper right, then click **Confirm** in the dialog.

![object deletion from ui](./images/delete_file_from_ui.png)

### Delete a file with `mc`

Use `mc rm` to delete:

```
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

You can confirm the deletion in the RustFS UI.

### Delete a file via API

Use the following API:

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Example:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a'
```

Verify the deletion in the RustFS UI.