---
title: "Python SDK"
description: "이 문서는 주로 RustFS에서 Python SDK 사용법에 대해 설명합니다."
---

다음은 설치, 연결, 기본 작업, 고급 기능(Presigned URL 및 멀티파트 업로드) 등을 포함한 **RustFS에서 S3 Python SDK (Boto3) 사용을 위한 완전한 문서**로, Python을 사용하여 RustFS와 통합하는 개발자에게 적합합니다.

---

# RustFS S3 Python SDK (Boto3) 문서

## I. 개요

RustFS는 Amazon S3 프로토콜과 호환되는 객체 저장소 서비스로, Python의 [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK를 통해 접근할 수 있습니다.

이 튜토리얼은 Python을 RustFS와 통합하고 Boto3를 통해 다음 작업을 수행하는 방법을 설명합니다:

* 버킷 생성/삭제
* 객체 업로드/다운로드/삭제
* 객체 목록 조회
* Presigned URL 생성
* 대용량 파일의 멀티파트 업로드

---

## II. 환경 준비

### 2.1 RustFS 정보

RustFS가 다음과 같이 배포되었다고 가정합니다:

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Boto3 설치

`venv` 가상 환경 사용을 권장합니다:

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3는 `botocore`에 의존하며, 자동으로 설치됩니다.

---

## III. RustFS에 연결

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
> ✅ `region_name`: RustFS는 region을 검증하지 않으므로 어떤 값이든 작동합니다

---

## IV. 기본 작업

### 4.1 버킷 생성

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'버킷 {bucket_name}이(가) 생성되었습니다.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'버킷 {bucket_name}이(가) 이미 존재합니다.')
```

### 4.2 파일 업로드

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('파일이 업로드되었습니다.')
```

### 4.3 파일 다운로드

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('파일이 다운로드되었습니다.')
```

### 4.4 객체 목록 조회

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

### 4.5 객체 및 버킷 삭제

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('객체가 삭제되었습니다.')

s3.delete_bucket(Bucket=bucket_name)
print('버킷이 삭제되었습니다.')
```

---

## V. 고급 기능

### 5.1 Presigned URL 생성

#### 5.1.1 다운로드 링크 (GET)

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600  # 10분간 유효
)

print('Presigned GET URL:', url)
```

#### 5.1.2 업로드 링크 (PUT)

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

`curl` 도구를 사용하여 업로드할 수 있습니다:

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

### 5.2 멀티파트 업로드

10MB보다 큰 파일에 적합하며, 각 파트를 수동으로 제어할 수 있습니다.

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
            print(f'파트 {part_number} 업로드 완료')
            part_number += 1

    # 2. 업로드 완료
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts}
    )
    print('멀티파트 업로드가 완료되었습니다.')

except Exception as e:
    # 업로드 중단
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print('오류로 인해 멀티파트 업로드가 중단되었습니다:', e)
```

---

## VI. 일반적인 문제 해결

| 문제 | 원인 | 해결책 |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | v4 서명 미사용 | `signature_version='s3v4'` 설정 |
| `EndpointConnectionError` | RustFS 주소가 잘못되었거나 서비스가 시작되지 않음 | endpoint 및 RustFS 서비스 상태 확인 |
| `AccessDenied` | 자격증명이 잘못되었거나 권한 부족 | AccessKey/SecretKey 또는 버킷 정책 확인 |
| `PermanentRedirect` | path-style이 활성화되지 않음 | Boto3는 기본적으로 virtual-host를 사용하지만, RustFS는 path-style만 지원합니다. endpoint 설정으로 우회 가능 |

---

## VII. 부록: 빠른 업로드/다운로드 스크립트 템플릿

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"{local_path}를 s3://{bucket}/{object_key}에 업로드했습니다")

def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"s3://{bucket}/{object_key}를 {local_path}에 다운로드했습니다")
```