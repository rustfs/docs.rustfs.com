---
title: "boto3 (Python)"
description: "Connect boto3 to RustFS and perform basic object operations from Python."
---

[boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) is the AWS SDK for Python and connects to RustFS through a custom endpoint.

## Install

```bash
pip install boto3
```

## Configure

Point the client at your RustFS endpoint. Replace `http://localhost:9000` with your server address, and use your own [access keys](../../security-compliance/iam/access-token.md). RustFS requires path-style addressing, set via botocore `Config`:

```python
import boto3
from botocore.config import Config

s3 = boto3.client(
    "s3",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="<your-access-key>",
    aws_secret_access_key="<your-secret-key>",
    region_name="us-east-1",
    config=Config(s3={"addressing_style": "path"}),
)
```

## Verify

Create a bucket, upload a file, and list the bucket:

```python
s3.create_bucket(Bucket="my-bucket")

s3.upload_file("/path/to/hello.txt", "my-bucket", "hello.txt")

for obj in s3.list_objects_v2(Bucket="my-bucket").get("Contents", []):
    print(obj["Key"], obj["Size"])
```

Expected output:

```text
hello.txt 12
```

## Next steps

See the [S3 SDK overview](../sdk/index.md) for more languages, or manage objects with [`rc`](/operations/rc).
