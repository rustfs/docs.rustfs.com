---
title: "boto3 (Python)"
description: "将 boto3 连接到 RustFS，并通过 Python 执行基本对象操作。"
---

[boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) 是适用于 Python 的 AWS SDK，可通过自定义端点连接到 RustFS。

## 安装

```bash
pip install boto3
```

## 配置

将客户端指向您的 RustFS 端点。请将 `http://localhost:9000` 替换为您的服务器地址，并使用您自己的[访问密钥](../../security-compliance/iam/access-token.md)。RustFS 要求使用路径样式寻址，可通过 botocore `Config` 进行设置：

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

## 验证

创建存储桶、上传文件并列出存储桶中的对象：

```python
s3.create_bucket(Bucket="my-bucket")

s3.upload_file("/path/to/hello.txt", "my-bucket", "hello.txt")

for obj in s3.list_objects_v2(Bucket="my-bucket").get("Contents", []):
    print(obj["Key"], obj["Size"])
```

预期输出：

```text
hello.txt 12
```

## 后续步骤

有关更多编程语言，请参阅 [S3 SDK 概述](../sdk/index.md)；也可以使用 [`rc`](/operations/rc) 管理对象。