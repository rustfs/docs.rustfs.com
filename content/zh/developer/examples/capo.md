---
title: "capo (Python)"
description: "将 capo 连接到 RustFS，并通过 Python 的同步或异步客户端执行基本对象操作。"
---

[capo](https://github.com/kap-sh/capo) 是一个社区驱动的 Python AWS SDK，开箱即用地提供完全类型标注的客户端，同时支持同步与异步调用。其 S3 客户端以 [`capo-s3`](https://pypi.org/project/capo-s3/) 包的形式发布，可通过自定义端点连接到 RustFS。

## 安装

capo 要求 Python 3.10 或更高版本：

```bash
pip install capo-s3
```

## 配置

将客户端指向您的 RustFS 端点。请将 `http://localhost:9000` 替换为您的服务器地址，并使用您自己的[访问密钥](../../security-compliance/iam/access-token.md)。RustFS 要求使用路径样式寻址，capo 可通过 `force_path_style` 原生开启：

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

## 验证

创建存储桶、上传对象并列出存储桶中的内容：

```python
s3.create_bucket(bucket="my-bucket")

s3.put_object(bucket="my-bucket", key="hello.txt", body=b"hello RustFS\n")

for obj in s3.list_objects_v2(bucket="my-bucket").get("contents", []):
    print(obj["key"], obj["size"])
```

预期输出：

```text
hello.txt 13
```

读取对象时，`get_object` 会返回流式响应，需作为上下文管理器使用：

```python
with s3.get_object(bucket="my-bucket", key="hello.txt") as response:
    content = b"".join(response["body"])

print(content.decode())
```

您还可以生成预签名 URL，在无需凭据的情况下授予限时访问权限：

```python
url = s3.presigned_get_object(bucket="my-bucket", key="hello.txt", expire_in=3600)
print(url)
```

## 异步客户端

异步客户端接受相同的参数，并镜像提供所有操作。调用时使用 `await`，客户端与流式响应则使用异步上下文管理器：

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

## 后续步骤

分页列举遵循相同的约定——使用 `iter_list_objects_v2` 迭代结果。如需官方 AWS SDK 替代方案，请参阅 [boto3 (Python)](./boto3.md)；更多编程语言请参阅 [S3 SDK 概述](../sdk/index.md)。
