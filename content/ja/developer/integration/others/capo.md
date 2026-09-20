---
title: "capo (Python)"
description: "capo を RustFS に接続し、同期または非同期クライアントを使って Python から基本的なオブジェクト操作を行います。"
---

[capo](https://github.com/kap-sh/capo) は、完全な型付けを持つクライアントを同期・非同期の両方で提供するコミュニティ主導の Python 用 AWS SDK です。S3 クライアントは [`capo-s3`](https://pypi.org/project/capo-s3/) パッケージとして提供され、カスタムエンドポイント経由で RustFS に接続します。

## インストール

capo には Python 3.10 以降が必要です：

```bash
pip install capo-s3
```

## 設定

クライアントを RustFS エンドポイントに向けます。`http://localhost:9000` を実際のサーバーアドレスに置き換え、独自の[アクセスキー](../../../security-compliance/iam/access-token.md)を使用してください。RustFS はパス形式のアドレス指定を必要とします。capo では `force_path_style` でネイティブに有効化できます：

```python
from capo_s3 import Credentials, S3Client

s3 = S3Client(
    region="us-east-1",
    endpoint="http://localhost:9000",
    credentials=Credentials(
        access_key="<your-access-key>",
        secret_key="<your-secret-key>",
    ),
    force_path_style=True,
)
```

## 検証

バケットを作成し、オブジェクトをアップロードして、バケットの内容を一覧表示します：

```python
s3.create_bucket(bucket="my-bucket")

s3.put_object(bucket="my-bucket", key="hello.txt", body=b"hello RustFS\n")

for obj in s3.list_objects_v2(bucket="my-bucket").get("contents", []):
    print(obj["key"], obj["size"])
```

予想される出力：

```text
hello.txt 13
```

オブジェクトの読み戻しでは、`get_object` がストリーミングレスポンスを返します。コンテキストマネージャーとして使用してください：

```python
with s3.get_object(bucket="my-bucket", key="hello.txt") as response:
    content = b"".join(response["body"])

print(content.decode())
```

認証情報なしで期間限定のアクセスを許可する署名付き URL を生成することもできます：

```python
url = s3.presigned_get_object(bucket="my-bucket", key="hello.txt", expire_in=3600)
print(url)
```

## 非同期クライアント

非同期クライアントは同じ引数を受け入れ、すべての操作に対応します。各呼び出しには `await` を使用し、クライアントとストリーミングレスポンスには非同期コンテキストマネージャーを使用します：

```python
import asyncio

from capo_s3 import AsyncS3Client, Body, Credentials


async def main() -> None:
    async with AsyncS3Client(
        region="us-east-1",
        endpoint="http://localhost:9000",
        credentials=Credentials(
            access_key="<your-access-key>",
            secret_key="<your-secret-key>",
        ),
        force_path_style=True,
    ) as s3:
        await s3.create_bucket(bucket="my-bucket")

        await s3.put_object(
            bucket="my-bucket",
            key="hello.txt",
            body=Body.async_from_path("/path/to/hello.txt"),
        )

        async with s3.get_object(bucket="my-bucket", key="hello.txt") as response:
            content = b"".join([chunk async for chunk in response["body"]])

        print(content.decode())


asyncio.run(main())
```

## 次のステップ

ページネーション付きの一覧表示も同じ規則に従います。`iter_list_objects_v2` が結果を反復処理します。公式の AWS SDK による代替としては [boto3 (Python)](../../examples/boto3.md) を、他の言語については [S3 SDK の概要](../../sdk/index.md) を参照してください。
