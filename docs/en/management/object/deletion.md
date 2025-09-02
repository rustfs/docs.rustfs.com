---
title: "RustFS Object Deletion"
description: "Objects can be deleted on RustFS UI, or through MinIO Client and API."
---

# RustFS Objects

Objects are the basic storage units in RustFS, containing data, metadata, and unique identifiers (Object Key). Data is stored in the form of objects. This chapter uses file upload and deletion as examples to introduce object management.

> For concepts related to objects, you can refer to the [Core Concepts](../../concepts/glossary.md) chapter.

## Deleting Objects

Objects can also be deleted on the UI, using `mc`, or through API methods. For example, to delete the file created in the previous steps, you can complete object deletion.

## Deleting Files on RustFS UI

1. Log into the RustFS UI console.
1. Select the bucket containing the file to be deleted.
1. On the bucket page, select the file to be deleted.
1. Click **Delete Selected Items** in the upper right corner, then click **Confirm** in the popup dialog to complete file deletion.

![object deletion from ui](images/delete_file_from_ui.png)

### Deleting Files Using `mc`

Use the `mc rm` command to delete files:

```bash
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

You can confirm the file has been deleted on RustFS UI.

### Deleting Files Using API

Use the following API to delete files:

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Request example:

```bash
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```

You can confirm the file has been deleted on RustFS UI.
