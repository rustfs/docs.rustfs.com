---
title: "Python SDK"
description: "본 문서는 주로 RustFS에서 Python SDK 사용법을 설명합니다."
---

# RustFS Python SDK (Boto3) 문서

## 개요

RustFS는 Amazon S3 프로토콜과 호환되는 객체 스토리지 서비스로, Python의 [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK를 통해 연결할 수 있습니다.

## 환경 준비

### Boto3 설치

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3은 `botocore`에 의존하며, 자동으로 설치됩니다.

---

## III. RustFS 연결

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

> ✅ `endpoint_url`: RustFS를 가리킵니다
> ✅ `signature_version='s3v4'`: RustFS는 v4 서명을 지원합니다
> ✅ `region_name`: RustFS는 리전을 검증하지 않으며, 임의의 값 사용 가능

---

## IV. 기본 작업

### 4.1 버킷 생성

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'Bucket {bucket_name} already exists.')
```

### 4.2 파일 업로드

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

### 4.3 파일 다운로드

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

### 4.4 객체 나열

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

### 4.5 객체 및 버킷 삭제

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

---

## V. 고급 기능

### 5.1 사전 서명된 URL 생성

#### 5.1.1 다운로드 링크(GET)

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600  # 10분 유효기간
)

print('Presigned GET URL:', url)
```

#### 5.1.2 업로드 링크(PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

`curl` 도구로 업로드 가능:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

### 5.2 멀티파트 업로드

10MB보다 큰 파일에 적합하며, 각 파트의 수동 제어가 가능합니다.

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024  # 5 MB

# 1. 업로드 시작
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

    # 2. 업로드 완료
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts}
    )
    print('Multipart upload complete.')

except Exception as e:
    # 업로드 중단
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print('Multipart upload aborted due to error:', e)
```

---

## VI. 일반적인 문제 해결

| 문제 | 원인 | 해결 방법 |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | v4 서명 미사용 | `signature_version='s3v4'` 설정 |
| `EndpointConnectionError` | RustFS 주소 오류 또는 서비스 미시작 | 엔드포인트 및 RustFS 서비스 상태 확인 |
| `AccessDenied` | 자격 증명 오류 또는 권한 부족 | AccessKey/SecretKey 또는 버킷 정책 확인 |
| `PermanentRedirect` | Path-style 미활성화 | Boto3은 기본적으로 virtual-host 사용, RustFS는 path-style만 지원하지만 엔드포인트 설정으로 우회 가능 |

---

## VII. 부록: 빠른 업로드/다운로드 스크립트 템플릿

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```
