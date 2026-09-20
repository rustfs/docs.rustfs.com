---
title: "capo (Python)"
description: "Connect capo to RustFS and perform basic object operations from Python with synchronous or asynchronous clients."
---

[capo](https://github.com/kap-sh/capo) is a community-driven AWS SDK for Python offering fully typed clients with both synchronous and asynchronous support out of the box. The S3 client ships as the [`capo-s3`](https://pypi.org/project/capo-s3/) package and connects to RustFS through a custom endpoint.

## Install

capo requires Python 3.10 or later:

```bash
pip install capo-s3
```

## Configure

Point the client at your RustFS endpoint. Replace `http://localhost:9000` with your server address, and use your own [access keys](../../../security-compliance/iam/access-token.md). RustFS requires path-style addressing, which capo enables natively through `force_path_style`:

```python
from capo_s3 import Credentials, S3Client

s3 = S3Client(
    region="us-east-1",
    endpoint="http://localhost:9000",
    credentials=Credentials(
        access_key="<your-access-key>",
        secret_key="<your-secret-key>",
    ),
    force_path_style=True,
)
```

## Verify

Create a bucket, upload an object, and list the bucket:

```python
s3.create_bucket(bucket="my-bucket")

s3.put_object(bucket="my-bucket", key="hello.txt", body=b"hello RustFS\n")

for obj in s3.list_objects_v2(bucket="my-bucket").get("contents", []):
    print(obj["key"], obj["size"])
```

Expected output:

```text
hello.txt 13
```

Read the object back — `get_object` returns a streaming response, used as a context manager:

```python
with s3.get_object(bucket="my-bucket", key="hello.txt") as response:
    content = b"".join(response["body"])

print(content.decode())
```

You can also generate presigned URLs that grant time-limited access without credentials:

```python
url = s3.presigned_get_object(bucket="my-bucket", key="hello.txt", expire_in=3600)
print(url)
```

## Async client

The asynchronous client accepts the same arguments and mirrors every operation. Await each call and use async context managers for the client and for streaming responses:

```python
import asyncio

from capo_s3 import AsyncS3Client, Body, Credentials


async def main() -> None:
    async with AsyncS3Client(
        region="us-east-1",
        endpoint="http://localhost:9000",
        credentials=Credentials(
            access_key="<your-access-key>",
            secret_key="<your-secret-key>",
        ),
        force_path_style=True,
    ) as s3:
        await s3.create_bucket(bucket="my-bucket")

        await s3.put_object(
            bucket="my-bucket",
            key="hello.txt",
            body=Body.async_from_path("/path/to/hello.txt"),
        )

        async with s3.get_object(bucket="my-bucket", key="hello.txt") as response:
            content = b"".join([chunk async for chunk in response["body"]])

        print(content.decode())


asyncio.run(main())
```

## Next steps

Paginated listing follows the same convention — `iter_list_objects_v2` iterates over results. For the official AWS SDK alternative, see [boto3 (Python)](../../examples/boto3.md), or see the [S3 SDK overview](../../sdk/index.md) for more languages.
