---
title: "Python"
description: "公式の AWS SDK for Python（Boto3）を RustFS で使います。"
---

## 1. 概要

RustFS は独自の SDK を提供していません。S3 互換であるため、公式の AWS SDK for Python である [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) を、RustFS サーバーを指すように設定して使います。

このガイドでは、次の内容を扱います。

* バケットの作成と削除
* オブジェクトのアップロード、ダウンロード、削除
* オブジェクトの一覧
* 署名付き URL の生成
* 大きなファイルのマルチパートアップロード

---

## 2. 前提条件

* Python 3.8 以降
* 稼働している RustFS インスタンス（[インストールガイド](../../installation/index.md)を参照）。S3 API はポート `9000`、Console はポート `9001` で待ち受けます
* インストール時に環境変数 `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` で設定するアクセスキー（[アクセスキーの管理](../../security-compliance/iam/access-token.md)を参照）

:::tip[ローカル検証]

インストール時に認証情報を設定しなかった場合、サーバーの既定値は `rustfsadmin` / `rustfsadmin` です。使い捨てのローカル検証であれば問題ありませんが、外部から到達できる環境では使わないでください。

:::

### 2.1 Boto3 のインストール

仮想環境の使用を推奨します。

```bash
python3 -m venv venv
source venv/bin/activate
pip install boto3
```

> Boto3 は `botocore` に依存しており、自動的にインストールされます。

---

## 3. RustFS への接続

次のスクリプトは、そのまま実行できます。RustFS が別のマシンで動作している場合は `localhost` をサーバーの IP アドレスに置き換え、アクセスキーも自分の値にします。

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

実行します。

```bash
python main.py
```

:::note[クライアントパラメータの説明]

- `endpoint_url` — RustFS の S3 API を指します（ポート `9000`。Console のポート `9001` ではありません）
- `signature_version='s3v4'` — RustFS は v4 署名に対応しています
- `region_name='us-east-1'` — RustFS の既定リージョンです
- `addressing_style='path'` — RustFS は既定でパススタイルアクセスを使います。仮想ホスト形式には `RUSTFS_SERVER_DOMAINS` が必要です

:::

---

## 4. 基本操作

### 4.1 バケットの作成

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

### 4.2 ファイルのアップロード

```python
s3.upload_file('/path/to/hello.txt', bucket_name, 'hello.txt')
print('File uploaded.')
```

```text
File uploaded.
```

---

### 4.3 ファイルのダウンロード

```python
s3.download_file(bucket_name, 'hello.txt', 'hello-downloaded.txt')
print('File downloaded.')
```

```text
File downloaded.
```

---

### 4.4 オブジェクトの一覧

```python
response = s3.list_objects_v2(Bucket=bucket_name)
for obj in response.get('Contents', []):
    print(f"- {obj['Key']} ({obj['Size']} bytes)")
```

```text
- hello.txt (12 bytes)
```

---

### 4.5 オブジェクトとバケットの削除

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

## 5. 高度な機能

### 5.1 署名付き URL の生成

#### 5.1.1 ダウンロードリンク（GET）

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

#### 5.1.2 アップロードリンク（PUT）

```python
url = s3.generate_presigned_url(
    ClientMethod='put_object',
    Params={'Bucket': bucket_name, 'Key': 'upload-by-url.txt'},
    ExpiresIn=600,
)

print('Presigned PUT URL:', url)
```

`curl` でアップロードできます。

```bash
curl -X PUT --upload-file /path/to/hello.txt "http://localhost:9000/my-bucket/upload-by-url.txt?X-Amz-Algorithm=..."
```

---

### 5.2 マルチパートアップロード

各パートを制御する必要がある場合は、10 MB を超えるファイルにマルチパートアップロードを使います。

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

## 6. トラブルシューティング

| 問題 | 原因 | 対処 |
| --- | --- | --- |
| `SignatureDoesNotMatch` | v4 署名を使っていない | `signature_version='s3v4'` を設定します |
| `EndpointConnectionError` | RustFS のアドレスが誤っている、またはサービスが起動していない | エンドポイントと RustFS のサービス状態を確認します |
| `AccessDenied` | 認証情報が誤っている、または権限が不足している | アクセスキー、シークレットキー、バケットポリシーを確認します |
| `PermanentRedirect`、または誤ったバケット URL | パススタイルアクセスが有効になっていない | `Config` で `s3={'addressing_style': 'path'}` を設定します |

---

## 7. 付録: アップロードとダウンロードの簡易スクリプトテンプレート

```python
def upload_file(local_path, bucket, object_key):
    s3.upload_file(local_path, bucket, object_key)
    print(f"Uploaded {local_path} to s3://{bucket}/{object_key}")


def download_file(bucket, object_key, local_path):
    s3.download_file(bucket, object_key, local_path)
    print(f"Downloaded s3://{bucket}/{object_key} to {local_path}")
```

オブジェクトのタグ付けやバケットポリシーなどの操作については、[Boto3 S3 のドキュメント](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html)を参照します。ほとんどの S3 操作は、RustFS に対しても同じように動作します。例外は [S3 互換性](/ja/reference/s3-compatibility) を参照します。

ネイティブな非同期と、一通りの型ヒントを重視する場合は、コミュニティ主導の [capo](https://github.com/kap-sh/capo) SDK も RustFS で動作します。[capo（Python）連携ガイド](../integration/others/capo.md)を参照します。
