---
title: "Python SDK"
description: "This article mainly explains the use of Python SDK in RustFS."
---

# RustFS Using S3 Python SDK (Boto3) Documentation

## 1. Overview

RustFS is an object storage service compatible with the Amazon S3 protocol, supporting integration through Python's [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK.

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

> Boto3 depends on `botocore`, which will be automatically installed.

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
> ✅ `region_name`: RustFS doesn't validate region, any value works

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
    ExpiresIn=600  # 10 minutes validity
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

You can use the `curl` tool to upload:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

---

### 5.2 Multipart Upload

Suitable for files larger than 10 MB, allowing manual control of each part.

```python
import os

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
    print('Multipart upload completed.')

except Exception as e:
    # Abort upload on error
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print(f'Upload aborted: {e}')
```

---

## 6. Error Handling

### 6.1 Common Exception Types

```python
from botocore.exceptions import ClientError

try:
    s3.head_object(Bucket=bucket_name, Key='nonexistent.txt')
except ClientError as e:
    error_code = e.response['Error']['Code']
    if error_code == '404':
        print('Object not found')
    elif error_code == 'NoSuchBucket':
        print('Bucket not found')
    else:
        print(f'Error: {error_code}')
```

### 6.2 Connection Issues

```python
import socket

try:
    response = s3.list_buckets()
except socket.timeout:
    print('Connection timeout')
except ConnectionError:
    print('Connection failed')
```

---

## 7. Best Practices

1. **Use Connection Pooling**: Boto3 automatically manages connection pooling
2. **Error Retry**: Configure retry policies using `Config`
3. **Async Operations**: Use `aioboto3` for high-concurrency scenarios
4. **Resource Management**: Use context managers when possible

```python
# Configure retry policy
from botocore.config import Config

config = Config(
    retries={'max_attempts': 3, 'mode': 'adaptive'},
    max_pool_connections=50
)

s3 = boto3.client('s3', config=config, ...)
```

---

## 8. Complete Example

```python
#!/usr/bin/env python3
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

def main():
    # Initialize client
    s3 = boto3.client(
        's3',
        endpoint_url='http://192.168.1.100:9000',
        aws_access_key_id='rustfsadmin',
        aws_secret_access_key='rustfssecret',
        config=Config(signature_version='s3v4'),
        region_name='us-east-1'
    )

    bucket_name = 'test-bucket'

    try:
        # Create bucket
        s3.create_bucket(Bucket=bucket_name)
        print(f'Created bucket: {bucket_name}')

        # Upload file
        with open('test.txt', 'w') as f:
            f.write('Hello RustFS!')

        s3.upload_file('test.txt', bucket_name, 'test.txt')
        print('File uploaded successfully')

        # List objects
        response = s3.list_objects_v2(Bucket=bucket_name)
        print('Objects in bucket:')
        for obj in response.get('Contents', []):
            print(f"  - {obj['Key']}")

        # Generate presigned URL
        url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': 'test.txt'},
            ExpiresIn=3600
        )
        print(f'Presigned URL: {url}')

    except ClientError as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    main()
```
