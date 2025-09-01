---
title: "Python SDK"
description: "この文書は主にRustFSでのPython SDKの使用について説明します。"
---

以下は**RustFS S3 Python SDK（Boto3）の完全なドキュメント**で、インストール、接続、基本操作、高度な機能（事前署名URLとマルチパート アップロード）などを含み、PythonでRustFSと統合する開発者に適用されます。

---

# RustFS S3 Python SDK（Boto3）ドキュメント

## I. 概要

RustFSはAmazon S3プロトコル互換のオブジェクトストレージサービスで、Python [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDKを通じてアクセスできます。

このチュートリアルでは、PythonをRustFSと統合し、Boto3を通じて以下の操作を実行する方法を説明します：

* バケットの作成/削除
* オブジェクトのアップロード/ダウンロード/削除
* オブジェクトの一覧表示
* 事前署名URL生成
* 大容量ファイルのマルチパートアップロード

---

## II. 環境準備

### 2.1 RustFS情報

RustFSが以下のようにデプロイされていると仮定します：

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Boto3のインストール

`venv`仮想環境の使用を推奨します：

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3は`botocore`に依存しており、自動的にインストールされます。

---

## III. RustFSに接続

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

> ✅ `endpoint_url`：RustFSを指します
> ✅ `signature_version='s3v4'`：RustFSはv4署名をサポート
> ✅ `region_name`：RustFSはリージョンを検証しません、任意の値で可能

---

## IV. 基本操作

### 4.1 バケット作成

```python
bucket_name = 'my-bucket'

try:
    s3.create_bucket(Bucket=bucket_name)
    print(f'Bucket {bucket_name} created.')
except s3.exceptions.BucketAlreadyOwnedByYou:
    print(f'Bucket {bucket_name} already exists.')
```

### 4.2 ファイルアップロード

```python
s3.upload_file('hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

### 4.3 ファイルダウンロード

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

### 4.4 オブジェクト一覧

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

### 4.5 オブジェクトとバケットの削除

```python
s3.delete_object(Bucket=bucket_name, Key='hello.txt')
print('Object deleted.')

s3.delete_bucket(Bucket=bucket_name)
print('Bucket deleted.')
```

---

## V. 高度な機能

### 5.1 事前署名URL生成

#### 5.1.1 ダウンロードリンク（GET）

```python
url = s3.generate_presigned_url(
    ClientMethod='get_object',
    Params={'Bucket': bucket_name, 'Key': 'hello.txt'},
    ExpiresIn=600  # 10分間有効
)

print('Presigned GET URL:', url)
```

#### 5.1.2 アップロードリンク（PUT）

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600
)

print('Presigned PUT URL:', url)
```

`curl`ツールでアップロード可能：

```bash
curl -X PUT --upload-file hello.txt "http://..."
```

### 5.2 マルチパートアップロード

10MBより大きなファイルに適用、各パートの手動制御が可能。

```python
import os

file_path = 'largefile.bin'
key = 'largefile.bin'
part_size = 5 * 1024 * 1024  # 5 MB

# 1. アップロード開始
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

    # 2. アップロード完了
    s3.complete_multipart_upload(
        Bucket=bucket_name,
        Key=key,
        UploadId=upload_id,
        MultipartUpload={'Parts': parts}
    )
    print('Multipart upload complete.')

except Exception as e:
    # アップロード中止
    s3.abort_multipart_upload(Bucket=bucket_name, Key=key, UploadId=upload_id)
    print('Multipart upload aborted due to error:', e)
```

---

## VI. 一般的なトラブルシューティング

| 問題 | 原因 | 解決方法 |
| ------------------------- | ----------------- | -------------------------------------------------------------- |
| `SignatureDoesNotMatch` | v4署名を使用していない | `signature_version='s3v4'`を設定 |
| `EndpointConnectionError` | RustFSアドレス間違いまたはサービス未起動 | エンドポイントとRustFSサービス状態を確認 |
| `AccessDenied` | 認証情報間違いまたは権限不足 | AccessKey/SecretKeyまたはバケットポリシーを確認 |
| `PermanentRedirect` | Path-styleが無効 | Boto3はデフォルトでvirtual-hostを使用、RustFSはpath-styleのみサポート、しかしエンドポイント設定で回避可能 |

---

## VII. 付録：クイックアップロード/ダウンロードスクリプトテンプレート

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")

def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

