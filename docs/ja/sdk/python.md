---
title: "Python SDK"
description: "この記事では、RustFS での Python SDK の使用について主に説明します。"
---

以下は **RustFS で S3 Python SDK（Boto3）を使用する完全なドキュメント**で、インストール、接続、基本操作、高度な機能（Presigned URL とマルチパートアップロード）などの内容を含み、開発者が Python で RustFS と連携するのに適用されます。

---

# RustFS で S3 Python SDK（Boto3）を使用するドキュメント

## 一、概要

RustFS は Amazon S3 プロトコル互換のオブジェクトストレージサービスで、Python の [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) SDK を通じてアクセスできます。

このチュートリアルでは、Python と RustFS の統合方法について説明し、Boto3 を通じて以下の操作を完成させます：

* バケット作成/削除
* オブジェクトアップロード/ダウンロード/削除
* オブジェクト列挙
* 事前署名 URL 生成
* 大容量ファイルのマルチパートアップロード

---

## 二、環境準備

### 2.1 RustFS 情報

RustFS が以下のようにデプロイされていると仮定：

```
Endpoint: http://192.168.1.100:9000
AccessKey: rustfsadmin
SecretKey: rustfssecret
```

### 2.2 Boto3 インストール

`venv` 仮想環境の使用を推奨：

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 は `botocore` に依存しており、自動的にインストールされます。

---

## 三、基本設定

### 3.1 クライアント作成

```python
import boto3
from botocore.client import Config

# RustFS 接続設定
ENDPOINT_URL = 'http://192.168.1.100:9000'
ACCESS_KEY = 'rustfsadmin'
SECRET_KEY = 'rustfssecret'

# S3 クライアント作成
s3_client = boto3.client(
    's3',
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    config=Config(signature_version='s3v4'),
    region_name='us-east-1'  # 任意のリージョン名
)

print("RustFS 接続成功！")
```

### 3.2 リソースインターフェース使用

```python
# S3 リソースインターフェース（高レベル API）
s3_resource = boto3.resource(
    's3',
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    config=Config(signature_version='s3v4'),
    region_name='us-east-1'
)
```

---

## 四、バケット操作

### 4.1 バケット作成

```python
def create_bucket(bucket_name):
    try:
        s3_client.create_bucket(Bucket=bucket_name)
        print(f"バケット '{bucket_name}' 作成成功")
    except Exception as e:
        print(f"バケット作成エラー: {e}")

# 使用例
create_bucket('my-test-bucket')
```

### 4.2 バケット一覧

```python
def list_buckets():
    try:
        response = s3_client.list_buckets()
        print("存在するバケット:")
        for bucket in response['Buckets']:
            print(f"  - {bucket['Name']} (作成日: {bucket['CreationDate']})")
    except Exception as e:
        print(f"バケット一覧取得エラー: {e}")

# 使用例
list_buckets()
```

### 4.3 バケット削除

```python
def delete_bucket(bucket_name):
    try:
        s3_client.delete_bucket(Bucket=bucket_name)
        print(f"バケット '{bucket_name}' 削除成功")
    except Exception as e:
        print(f"バケット削除エラー: {e}")

# 使用例
delete_bucket('my-test-bucket')
```

---

## 五、オブジェクト操作

### 5.1 オブジェクトアップロード

```python
def upload_file(bucket_name, object_key, file_path):
    try:
        s3_client.upload_file(file_path, bucket_name, object_key)
        print(f"ファイル '{file_path}' を '{bucket_name}/{object_key}' にアップロード成功")
    except Exception as e:
        print(f"ファイルアップロードエラー: {e}")

# 使用例
upload_file('my-bucket', 'data/test.txt', '/local/path/test.txt')
```

### 5.2 オブジェクトダウンロード

```python
def download_file(bucket_name, object_key, download_path):
    try:
        s3_client.download_file(bucket_name, object_key, download_path)
        print(f"ファイル '{bucket_name}/{object_key}' を '{download_path}' にダウンロード成功")
    except Exception as e:
        print(f"ファイルダウンロードエラー: {e}")

# 使用例
download_file('my-bucket', 'data/test.txt', '/local/downloaded/test.txt')
```

### 5.3 オブジェクト削除

```python
def delete_object(bucket_name, object_key):
    try:
        s3_client.delete_object(Bucket=bucket_name, Key=object_key)
        print(f"オブジェクト '{bucket_name}/{object_key}' 削除成功")
    except Exception as e:
        print(f"オブジェクト削除エラー: {e}")

# 使用例
delete_object('my-bucket', 'data/test.txt')
```

---

## 六、高度な機能

### 6.1 事前署名 URL 生成

```python
def generate_presigned_url(bucket_name, object_key, expiration=3600):
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_key},
            ExpiresIn=expiration
        )
        print(f"事前署名 URL: {url}")
        return url
    except Exception as e:
        print(f"URL 生成エラー: {e}")
        return None

# 使用例
generate_presigned_url('my-bucket', 'data/test.txt', 3600)
```

### 6.2 マルチパートアップロード

```python
def multipart_upload(bucket_name, object_key, file_path):
    try:
        # マルチパートアップロード開始
        response = s3_client.create_multipart_upload(
            Bucket=bucket_name,
            Key=object_key
        )
        upload_id = response['UploadId']
        
        # ファイル分割アップロード
        parts = []
        part_size = 5 * 1024 * 1024  # 5MB
        part_number = 1
        
        with open(file_path, 'rb') as f:
            while True:
                data = f.read(part_size)
                if not data:
                    break
                    
                part_response = s3_client.upload_part(
                    Bucket=bucket_name,
                    Key=object_key,
                    PartNumber=part_number,
                    UploadId=upload_id,
                    Body=data
                )
                
                parts.append({
                    'ETag': part_response['ETag'],
                    'PartNumber': part_number
                })
                part_number += 1
        
        # マルチパートアップロード完了
        s3_client.complete_multipart_upload(
            Bucket=bucket_name,
            Key=object_key,
            UploadId=upload_id,
            MultipartUpload={'Parts': parts}
        )
        
        print(f"マルチパートアップロード成功: {bucket_name}/{object_key}")
        
    except Exception as e:
        print(f"マルチパートアップロードエラー: {e}")
        # 失敗時はマルチパートアップロードを中止
        s3_client.abort_multipart_upload(
            Bucket=bucket_name,
            Key=object_key,
            UploadId=upload_id
        )

# 使用例
multipart_upload('my-bucket', 'large-file.zip', '/path/to/large-file.zip')
```

---

## 七、エラーハンドリング

```python
from botocore.exceptions import ClientError

def safe_operation(bucket_name, object_key):
    try:
        response = s3_client.head_object(Bucket=bucket_name, Key=object_key)
        print(f"オブジェクト存在: {bucket_name}/{object_key}")
        return True
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == '404':
            print(f"オブジェクト未発見: {bucket_name}/{object_key}")
        else:
            print(f"その他のエラー: {e}")
        return False
```

---

## 八、ベストプラクティス

1. **接続プール**: 本番環境では接続プールを使用
2. **リトライ機能**: 自動リトライ設定を有効に
3. **ログ記録**: 適切なログ記録を実装
4. **認証情報セキュリティ**: 環境変数や設定ファイルで管理

```python
import os
import logging

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 環境変数から認証情報取得
ENDPOINT_URL = os.getenv('RUSTFS_ENDPOINT', 'http://localhost:9000')
ACCESS_KEY = os.getenv('RUSTFS_ACCESS_KEY')
SECRET_KEY = os.getenv('RUSTFS_SECRET_KEY')

# 設定検証
if not ACCESS_KEY or not SECRET_KEY:
    raise ValueError("RUSTFS_ACCESS_KEY と RUSTFS_SECRET_KEY 環境変数を設定してください")
```

この Python SDK ガイドにより、RustFS と Python アプリケーションを効果的に統合できます。

