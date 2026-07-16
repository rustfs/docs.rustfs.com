---
title: "Object Deletion"
description: "Delete objects using the RustFS UI, MinIO Client, or API."
---

This guide covers object deletion.

> For concepts related to objects, see [Core Concepts](../../concepts/glossary.md).

## Using the RustFS UI

1. Log in to the RustFS Console.
2. Select the bucket containing the file to be deleted.
3. On the bucket page, select the file to be deleted.
4. Click **Delete Selected Items** in the upper right corner, then click **Confirm** in the popup dialog.

![object deletion from ui](images/delete_file_from_ui.png)

### Using `mc`

Delete a file:

```bash
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

Verify the deletion in the RustFS Console.

### Using the API

Delete a file via API:

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

S3 requests must be signed with AWS Signature V4, so use an S3 client rather than hand-crafting headers. With the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured for your access keys:

```bash
aws s3api delete-object \
  --bucket bucket-creation-by-api \
  --key hello.txt \
  --endpoint-url http://localhost:9000
```

Verify the deletion in the RustFS Console.
