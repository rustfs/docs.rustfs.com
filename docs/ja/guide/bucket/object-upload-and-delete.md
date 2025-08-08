---
title: "RustFS オブジェクト管理"
description: "オブジェクトの作成と削除"
---

# RustFS オブジェクト

オブジェクト（Object）は RustFS における最小単位で、データ・メタデータ・一意キー（Object Key）を含みます。本章ではファイルのアップロード/削除を例に管理方法を説明します。

> 関連概念は「[コア概念](../../concepts/glossary.md)」を参照してください。

## オブジェクトの作成

前提条件：

- 利用可能な RustFS インスタンス（../../installation/index.md を参照）

[バケットを作成](bucket-create-and-delete.md)し、当該バケットにファイルをアップロードするとオブジェクトが作成されます。RustFS UI、`mc`、API のいずれでも可能です。

### RustFS UI でアップロード

1. RustFS UI コンソールにログイン
1. 対象バケットを選択
1. 右上の「新規ディレクトリ」「新規ファイル」「ファイル/フォルダをアップロード」を選択
1. ローカルからアップロードする場合は「ファイル/フォルダをアップロード」→対象を選択→「アップロード開始」

![object creation from ui](images/upload_file_from_ui.png)

アップロード後、当該オブジェクトをクリックして詳細を確認できます。

![object details info](images/object_details_info.png)

### `mc` でアップロード

> `mc` のインストール/設定は「`mc` ガイド」（../mc.md）を参照

```
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm file uploaded
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

### API でアップロード

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

例：

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

## オブジェクトの削除

UI、`mc`、API のいずれでも削除できます。上記で作成したファイルを削除すれば完了です。

## RustFS UI で削除

1. RustFS UI コンソールにログイン
1. 対象バケットを選択
1. 対象ファイルを選択
1. 右上の「選択項目を削除」→ダイアログで「確認」

![object deletion from ui](images/delete_file_from_ui.png)

### `mc` で削除

```
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

### API で削除

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

例：

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```