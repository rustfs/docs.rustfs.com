---
title: "boto3（Python）"
description: "boto3 を RustFS に接続し、Python から基本的なオブジェクト操作を行います。"
---

[boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) は Python 向けの AWS SDK であり、カスタムエンドポイントを通じて RustFS に接続します。

## インストール

```bash
pip install boto3
```

## 設定

クライアントを RustFS のエンドポイントに向けます。`http://localhost:9000` を実際のサーバーアドレスに置き換え、独自の[アクセスキー](../../security-compliance/iam/access-token.md)を使います。RustFS ではパススタイルアクセスが必要です。botocore の `Config` で設定します。

```python
import boto3
from botocore.config import Config

s3 = boto3.client(
    "s3",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="<your-access-key>",
    aws_secret_access_key="<your-secret-key>",
    region_name="us-east-1",
    config=Config(s3={"addressing_style": "path"}),
)
```

## 検証

バケットを作成し、ファイルをアップロードして、バケットを一覧表示します。

```python
s3.create_bucket(Bucket="my-bucket")

s3.upload_file("/path/to/hello.txt", "my-bucket", "hello.txt")

for obj in s3.list_objects_v2(Bucket="my-bucket").get("Contents", []):
    print(obj["Key"], obj["Size"])
```

予想される出力は次のとおりです。

```text
hello.txt 12
```

## 次のステップ

他の言語については [S3 SDK の概要](../sdk/index.md)を参照するか、[`rc`](/ja/operations/rc) でオブジェクトを管理します。ネイティブの非同期処理と完全な型付けを備えた、コミュニティ主導の SDK を使う場合は、[capo（Python）](../integration/others/capo.md)を参照します。
