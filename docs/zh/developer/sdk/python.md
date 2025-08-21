---
title: "Python SDK"
description: "本文主要讲解 RustFS 中 Python SDK 的使用。"
---

以下是 **RustFS 使用 S3 Python SDK（Boto3）完整文档**，包含了安装、连接、基本操作、高级功能（Presigned URL 和分片上传）等内容，适用于开发者使用 Python 与 RustFS 对接。

---

# RustFS 使用 S3 Python SDK（Boto3）文档

## 一、概述

RustFS 是一款兼容 Amazon S3 协议的对象存储服务，支持通过 Python 的 [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK 接入。

本教程将讲解如何使用 Python 与 RustFS 进行集成，并通过 Boto3 完成如下操作：

* Bucket 创建/删除
* 对象上传/下载/删除
* 列举对象
* 生成预签名 URL
* 分片上传大文件

---

## 二、环境准备

### 2.1 RustFS 信息

假设 RustFS 部署如下：

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 安装 Boto3

推荐使用 `venv` 虚拟环境：

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 依赖 `botocore`，会自动安装。

---

## 三、连接 RustFS

```python
import boto3
from botocore.client import Config

s3 = boto3.client(
 's3',
 endpoint_url='http://192.168.1.100:9000',
 aws_access_key_id='rustfsadmin',
 aws_secret_access_key='rustfssecret',
 config=Config(signature_version='s3v4'),
 region_name='us-east-1'
)
```

> ✅ `endpoint_url`：指向 RustFS
> ✅ `signature_version='s3v4'`：RustFS 支持 v4 签名
> ✅ `region_name`：RustFS 不校验 region，填写任意值即可

---

## 四、基础操作

### 4.1 创建 Bucket

```python
bucket_name = 'my-bucket'

try:
 s3.create_bucket(Bucket=bucket_name)
 print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
 print(f'Bucket {bucket_name} already exists.')
```

---

### 4.2 上传文件

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

---

### 4.3 下载文件

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

---

### 4.4 列出对象

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
 print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

---

### 4.5 删除对象与 Bucket

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

---

## 五、高级功能

### 5.1 生成预签名 URL

#### 5.1.1 下载链接（GET）

```python
url = s3.generate_presigned_url(
 ClientMethod='get_object',
 Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
 ExpiresIn=600 # 10 分钟有效期
)

print('Presigned GET URL:', url)
```

#### 5.1.2 上传链接（PUT）

```python
url = s3.generate_presigned_url(
 ClientMethod='put_object',
 Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
 ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

你可以使用 `curl` 工具上传：

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

---

### 5.2 分片上传（Multipart Upload）

适合大于 10 MB 文件上传，可手动控制每个分片。

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024 # 5 MB

# 1. 启动上传
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
 Body=data
 )

 parts.append({'ETag': part['ETag'], 'PartNumber': part_number})
 print(f'Uploaded part {part_number}')
 part_number += 1

 # 2. 完成上传
 s3.complete_multipart_upload(
 Bucket=bucket_name,
 Key=key,
 UploadId=upload_id,
 MultipartUpload={'Parts': parts}
 )
 print('Multipart upload complete.')

except Exception as e:
 # 中止上传
 s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
 print('Multipart upload aborted due to error:', e)
```

---

## 六、常见问题排查

| 问题 | 原因 | 解决方法 |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | 未使用 v4 签名 | 设置 `signature_version='s3v4'` |
| `EndpointConnectionError` | RustFS 地址错误或服务未启动 | 检查 endpoint 与 RustFS 服务状态 |
| `AccessDenied` | 凭证错误或权限不足 | 检查 AccessKey/SecretKey 或桶策略 |
| `PermanentRedirect` | 未启用 path-style | Boto3 默认使用 virtual-host，RustFS 仅支持 path-style，但设置 endpoint 可绕过 |

---

## 七、附录：快速上传/下载脚本模板

```python
def upload_file(local_path, bucket, object_key):
 s3.upload_file(local_path, bucket, object_key)
 print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
 s3.download_file(bucket, object_key, local_path)
 print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

