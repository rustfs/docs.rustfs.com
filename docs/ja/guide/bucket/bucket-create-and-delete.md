---
title: "RustFS バケット管理"
description: "RustFS バケットの作成・削除"
---

# RustFS バケット

バケット（Bucket）は RustFS におけるデータの論理的なコンテナです。各バケットは一意の名前を持ち、複数のオブジェクト（Object）を格納できます。RustFS UI、`mc`（MinIO Client）、または API により、作成・削除・アップロード/ダウンロード等の操作が可能です。

## バケットの作成

前提条件：

- 利用可能な RustFS インスタンス（インストールは ../../installation/index.md を参照）

## RustFS UI で作成

1. RustFS UI コンソールにログイン
1. ホーム左上の「バケット作成」を選択
1. バケット名を入力し「作成」をクリック

![bucket creation](images/bucket-creation-by-ui.png)

### `mc` で作成

> `mc` のインストール/設定は「`mc` ガイド」（../mc.md）を参照

```
# creat rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### API で作成

```
PUT /{bucketName} HTTP/1.1
```

例：

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

RustFS UI で `bucket-creation-by-api` が作成されたことを確認できます。

## バケットの削除

注意：バケットは重要なコンポーネントです。削除により依存アプリがエラーとなる可能性があります。事前にデータのバックアップと不要確認を行ってください。

### RustFS UI で削除

1. RustFS UI コンソールにログイン
1. ホームで削除対象のバケットを選択
1. 右端の「削除」ボタンをクリック
1. ダイアログで「確認」をクリック

![bucket deletion](images/bucket-deletion-on-ui.png)

### `mc` で削除

> `mc` のインストール/設定は「`mc` ガイド」（../mc.md）を参照

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### API で削除

```
DELETE /{bucketName} HTTP/1.1
```

例：

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

RustFS UI で `bucket-creation-by-api` が削除されたことを確認できます。