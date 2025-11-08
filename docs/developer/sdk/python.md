---
title: "Python SDK"
description: "This article mainly explains the usage of Python SDK in RustFS."
---

Below is the **Complete Documentation for Using S3 Python SDK (Boto3) with RustFS**, including installation, connection, basic operations, advanced features (Presigned URL and multipart upload), etc., suitable for developers using Python to integrate with RustFS.

---

# RustFS S3 Python SDK (Boto3) Documentation

## 1. Overview

RustFS is an object storage service compatible with Amazon S3 protocol, supporting integration through Python's [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK.

This tutorial will explain how to integrate Python with RustFS and complete the following operations through Boto3:

* Bucket creation/deletion
* Object upload/download/deletion
* List objects
* Generate presigned URLs
* Multipart upload for large files

---

## 2. Environment Preparation

### 2.1 RustFS Information

Assume RustFS is deployed as follows:

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Install Boto3

Recommended to use `venv` virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 depends on `botocore`, which will be installed automatically.

---

## 3. Connect to RustFS

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

> ✅ `endpoint_url`: Points to RustFS
> ✅ `signature_version='s3v4'`: RustFS supports v4 signatures
> ✅ `region_name`: RustFS doesn't validate region, any value can be filled

---

## 4. Basic Operations

### 4.1 Create Bucket

```python
bucket_name = 'my-bucket'

try:
 s3.create_bucket(Bucket=bucket_name)
 print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
 print(f'Bucket {bucket_name} already exists.')
```

---

### 4.2 Upload File

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

---

### 4.3 Download File

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

---

### 4.4 List Objects

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
 print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

---

### 4.5 Delete Object and Bucket

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

---

## 5. Advanced Features

### 5.1 Generate Presigned URLs

#### 5.1.1 Download Link (GET)

```python
url = s3.generate_presigned_url(
 ClientMethod='get_object',
 Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
 ExpiresIn=600 # 10 minutes validity
)

print('Presigned GET URL:', url)
```

#### 5.1.2 Upload Link (PUT)

```python
url = s3.generate_presigned_url(
 ClientMethod='put_object',
 Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
 ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

You can use `curl` tool to upload:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

---

### 5.2 Multipart Upload

Suitable for files larger than 10 MB, allows manual control of each part.

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024 # 5 MB

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
 Body=data
 )

 parts.append({'ETag': part['ETag'], 'PartNumber': part_number})
 print(f'Uploaded part {part_number}')
 part_number += 1

 # 2. Complete upload
 s3.complete_multipart_upload(
 Bucket=bucket_name,
 Key=key,
 UploadId=upload_id,
 MultipartUpload={'Parts': parts}
 )
 print('Multipart upload complete.')

except Exception as e:
 # Abort upload
 s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
 print('Multipart upload aborted due to error:', e)
```

---

## 6. Common Issue Troubleshooting

| Issue | Cause | Solution |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | Not using v4 signature | Set `signature_version='s3v4'` |
| `EndpointConnectionError` | Wrong RustFS address or service not started | Check endpoint and RustFS service status |
| `AccessDenied` | Wrong credentials or insufficient permissions | Check AccessKey/SecretKey or bucket policies |
| `PermanentRedirect` | Path-style not enabled | Boto3 defaults to virtual-host, RustFS only supports path-style, but setting endpoint can bypass |

---

## 7. Appendix: Quick Upload/Download Script Template

```python
def upload_file(local_path, bucket, object_key):
 s3.upload_file(local_path, bucket, object_key)
 print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
 s3.download_file(bucket, object_key, local_path)
 print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```
