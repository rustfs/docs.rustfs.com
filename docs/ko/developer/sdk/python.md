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

## RustFS 연결

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

## 기본 작업

### 버킷 생성
```python
bucket_name = 'my-bucket'
s3.create_bucket(Bucket=bucket_name)
```

### 파일 업로드
```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
```

### 파일 다운로드
```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
```

### 객체 목록
```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
 print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

더 자세한 내용과 고급 기능은 원본 문서를 참조하세요.