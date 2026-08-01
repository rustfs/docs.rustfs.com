---
title: "Python SDK Guide"
description: "Use the official AWS SDK for Python (Boto3) with RustFS."
---

## 1. Overview

RustFS ships no first-party SDKs — it is S3-compatible, so you use the official AWS SDK for Python, [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html), configured to point at your RustFS server.

This guide covers:

* Bucket creation/deletion
* Object upload/download/deletion
* Listing objects
* Generating presigned URLs
* Multipart upload for large files

---

## 2. Prerequisites

* Python 3.8 or later
* A running RustFS instance (see the [Installation Guide](../../installation/index.md)) — the S3 API listens on port `9000`, the Console on port `9001`
* Access keys, set at install time via the `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` environment variables (see [Access Key Management](../../security-compliance/iam/access-token.md))

:::tip[Local test]

If you did not set credentials at install time, the server defaults to `rustfsadmin` / `rustfsadmin` — fine for a throwaway local trial, never for anything reachable by others.

:::

### 2.1 Install Boto3

We recommend using a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 depends on `botocore`, which will be installed automatically.

---

## 3. Connecting to RustFS

The following is a complete, runnable script. Replace `localhost` with your server's IP address if RustFS runs on another machine, and fill in your own access keys:

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

Run it:

```bash
python main.py
```

:::note[Client parameters explained]

- `endpoint_url` — points to your RustFS S3 API (port `9000`, not the Console port `9001`)
- `signature_version='s3v4'` — RustFS supports v4 signatures
- `region_name='us-east-1'` — RustFS's default region
- `addressing_style='path'` — RustFS uses path-style URLs by default; virtual-host style requires `RUSTFS_SERVER_DOMAINS`

:::

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

```text
Bucket my-bucket created.
```

---

### 4.2 Upload File

```python
s3.upload_file('/path/to/hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

```text
File uploaded.
```

---

### 4.3 Download File

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

```text
File downloaded.
```

---

### 4.4 List Objects

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

```text
- hello.txt (12 bytes)
```

---

### 4.5 Delete Object and Bucket

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

## 5. Advanced Features

### 5.1 Generate Presigned URLs

#### 5.1.1 Download Link (GET)

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

#### 5.1.2 Upload Link (PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600,
)

print('Presigned PUT URL:', url)
```

You can use the `curl` tool to upload:

```bash
curl -X PUT --upload-file /path/to/hello.txt "http://localhost:9000/my-bucket/upload-by-url.txt?X-Amz-Algorithm=..."
```

---

### 5.2 Multipart Upload

Suitable for files larger than 10 MB, allows manual control of each part.

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

## 6. Common Issue Troubleshooting

| Issue | Cause | Solution |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | Not using v4 signature | Set `signature_version='s3v4'` |
| `EndpointConnectionError` | Wrong RustFS address or service not started | Check endpoint and RustFS service status |
| `AccessDenied` | Wrong credentials or insufficient permissions | Check AccessKey/SecretKey or bucket policies |
| `PermanentRedirect` / wrong bucket URL | Path-style not enabled | Set `s3={'addressing_style': 'path'}` in the `Config` |

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

For other operations (object tagging, bucket policies, and more), see the [Boto3 S3 documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html) — every S3-compatible call works against RustFS the same way.
