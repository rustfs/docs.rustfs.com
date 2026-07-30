---
title: "Python SDK 指南"
description: "将官方 AWS SDK for Python（Boto3）与 RustFS 配合使用。"
---

## 1. 概述

RustFS 不提供第一方 SDK。RustFS 与 S3 兼容，因此你可以配置官方 AWS SDK for Python [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)，使其指向 RustFS 服务器。

本指南涵盖：

* 创建和删除存储桶
* 上传、下载和删除对象
* 列出对象
* 生成预签名 URL
* 对大文件执行分段上传

---

## 2. 前提条件

* Python 3.8 或更高版本
* 一个正在运行的 RustFS 实例（请参阅[安装指南](../../installation/index.md)）；S3 API 监听端口 `9000`，控制台监听端口 `9001`
* 安装时通过 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` 环境变量设置的访问密钥（请参阅[访问密钥管理](../../security-compliance/iam/access-token.md)）

:::tip[本地测试]

如果安装时未设置凭证，服务器默认使用 `rustfsadmin` / `rustfsadmin`。这仅适合一次性本地试用，切勿用于其他人可访问的环境。

:::

### 2.1 安装 Boto3

我们建议使用虚拟环境：

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 依赖 `botocore`，后者会自动安装。

---

## 3. 连接到 RustFS

以下是一个可直接运行的完整脚本。如果 RustFS 在另一台计算机上运行，请将 `localhost` 替换为服务器 IP 地址，并填写你自己的访问密钥：

```python title="main.py"
import boto3
from botocore.client import Config

s3 = boto3.client(
    's3',
    endpoint_url='http://localhost:9000',
    aws_access_key_id='<your-access-key>',
    aws_secret_access_key='<your-secret-key>',
    region_name='us-east-1',
    config=Config(
        signature_version='s3v4',
        s3={'addressing_style': 'path'},
    ),
)

response = s3.list_buckets()
for bucket in response['Buckets']:
    print(bucket['Name'])
```

运行该脚本：

```bash
python main.py
```

:::note[客户端参数说明]

- `endpoint_url`：指向 RustFS S3 API（端口 `9000`，而不是控制台端口 `9001`）
- `signature_version='s3v4'`：RustFS 支持 v4 签名
- `region_name='us-east-1'`：RustFS 的默认区域
- `addressing_style='path'`：RustFS 默认使用路径风格 URL；虚拟主机风格需要配置 `RUSTFS_SERVER_DOMAINS`

:::

---

## 4. 基本操作

### 4.1 创建存储桶

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'Bucket {bucket_name} already exists.')
```

```text
Bucket my-bucket created.
```

---

### 4.2 上传文件

```python
s3.upload_file('/path/to/hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

```text
File uploaded.
```

---

### 4.3 下载文件

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

```text
File downloaded.
```

---

### 4.4 列出对象

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

```text
- hello.txt (12 bytes)
```

---

### 4.5 删除对象和存储桶

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

```text
Object deleted.
Bucket deleted.
```

---

## 5. 高级功能

### 5.1 生成预签名 URL

#### 5.1.1 下载链接（GET）

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600,  # 10 minutes validity
)

print('Presigned GET URL:', url)
```

```text
Presigned GET URL: http://localhost:9000/my-bucket/hello.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&...
```

#### 5.1.2 上传链接（PUT）

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600,
)

print('Presigned PUT URL:', url)
```

你可以使用 `curl` 工具上传：

```bash
curl -X PUT --upload-file /path/to/hello.txt "http://localhost:9000/my-bucket/upload-by-url.txt?X-Amz-Algorithm=..."
```

---

### 5.2 分段上传

适用于大于 10 MB 的文件，并允许手动控制每个分段。

```python
file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024  # 5 MB

# 1. Start upload
response = s3.create_multipart_upload(Bucket=bucket_name, Key=key)
upload_id = response['UploadId']
parts = []

try:
    with open(file_path, 'rb') as f:
        part_number = 1
        while True:
            data = f.read(part_size)
            if not data:
                break

            part = s3.upload_part(
                Bucket=bucket_name,
                Key=key,
                PartNumber=part_number,
                UploadId=upload_id,
                Body=data,
            )

            parts.append({'ETag': part['ETag'], 'PartNumber': part_number})
            print(f'Uploaded part {part_number}')
            part_number += 1

    # 2. Complete upload
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts},
    )
    print('Multipart upload complete.')

except Exception as e:
    # Abort upload
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print('Multipart upload aborted due to error:', e)
```

```text
Uploaded part 1
Uploaded part 2
Uploaded part 3
Multipart upload complete.
```

---

## 6. 常见问题排查

| 问题 | 原因 | 解决方案 |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | 未使用 v4 签名 | 设置 `signature_version='s3v4'` |
| `EndpointConnectionError` | RustFS 地址错误或服务未启动 | 检查端点和 RustFS 服务状态 |
| `AccessDenied` | 凭证错误或权限不足 | 检查 AccessKey/SecretKey 或存储桶策略 |
| `PermanentRedirect` / 存储桶 URL 错误 | 未启用路径风格 | 在 `Config` 中设置 `s3={'addressing_style': 'path'}` |

---

## 7. 附录：快速上传/下载脚本模板

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")


def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

有关其他操作（对象标签、存储桶策略等），请参阅 [Boto3 S3 文档](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html)。所有 S3 兼容调用都能以相同方式用于 RustFS。