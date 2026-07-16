# Object Creation (/management/object/creation)







Objects are the fundamental storage units in RustFS, containing data, metadata, and a unique key. This guide covers object creation (upload).

> For concepts related to Objects, see [Core Concepts](../../concepts/glossary.md).

## Creating Objects [#creating-objects]

Prerequisites:

* A running RustFS instance (see [Installation Guide](../../installation/index.md)).

[Create a bucket](../bucket/creation.md), then upload files to it.

### Using the RustFS UI [#using-the-rustfs-ui]

1. Log in to the RustFS Console.
2. Select the target bucket.
3. On the bucket page, in the top right corner, select **New Directory**, **New File**, or **Upload File/Folder**.
4. To upload from your local machine, click **Upload File/Folder**, select the files, and click **Start Upload**.

<img alt="object creation from ui" src="__img0" />

Click on an object to view its details.

<img alt="object details info" src="__img1" />

### Using `mc` [#using-mc]

> See the [`mc` Usage Guide](../../developer/mc.md) for installation and configuration.

Upload a file:

```bash
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm file uploaded
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

Verify the upload in the RustFS Console.

### Using the API [#using-the-api]

Upload a file via API:

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

S3 requests must be signed with AWS Signature V4, so use an S3 client rather than hand-crafting headers. With the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured for your access keys:

```bash
aws s3api put-object \
  --bucket bucket-creation-by-api \
  --key hello.txt \
  --body /path/to/hello.txt \
  --endpoint-url http://localhost:9000
```

Verify the upload in the RustFS Console.

## Deleting Objects [#deleting-objects]

See [Object Deletion](./deletion.md).

Use the following API for file deletion:

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Request example:

```bash
aws s3api delete-object \
  --bucket bucket-creation-by-api \
  --key hello.txt \
  --endpoint-url http://localhost:9000
```

You can confirm the file has been deleted on the RustFS UI.
