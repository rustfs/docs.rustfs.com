---
title: "オブジェクトの作成"
description: "RustFS UI、rc、または S3 API を使ってオブジェクトを作成する方法を説明します。"
---

オブジェクトは RustFS の基本的な保存単位であり、データ、メタデータ、一意のキーを含みます。このガイドでは、オブジェクトの作成（アップロード）を扱います。

## 要件

- 稼働中の RustFS インスタンス（[インストールガイド](../../../installation/index.md)を参照）。
- コマンドラインの手順を使う前に、[`rc`](/ja/operations/rc) をインストールし、エイリアスを設定します。
- 保存先のバケット。[バケットの作成](../bucket/creation.md)に従って作成します。

## オブジェクトの作成

### RustFS UI を使う

1. RustFS Console にログインします。
2. 対象のバケットを選択します。
3. バケットページの右上で、**New Directory**（新しいディレクトリ）、**New File**（新しいファイル）、または **Upload File/Folder**（ファイルまたはフォルダーのアップロード）を選択します。
4. ローカルマシンからアップロードする場合は、**Upload File/Folder** をクリックし、ファイルを選択して **Start Upload**（アップロード開始）をクリックします。

![Console からのオブジェクト作成](images/upload_file_from_ui.png)

オブジェクトを選択すると、詳細を表示できます。

![オブジェクトの詳細情報](images/object_details_info.png)

### `rc` を使う

インストールとエイリアスの設定は、[`rc` ガイド](/ja/operations/rc)を参照します。

ファイルをアップロードします。

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object list rustfs/my-bucket
```

RustFS Console でアップロードを確認します。

### API を使う

API でファイルをアップロードします。

```http
PUT /{bucketName}/{objectName} HTTP/1.1
```

S3 リクエストは AWS Signature V4 で署名する必要があります。ヘッダーを手作業で組み立てず、S3 クライアントを使います。アクセスキーを設定した [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) では、次のように実行します。

```bash
aws s3api put-object \
  --bucket bucket-creation-by-api \
  --key hello.txt \
  --body /path/to/hello.txt \
  --endpoint-url http://localhost:9000
```

RustFS Console でアップロードを確認します。

## オブジェクトの削除

[オブジェクトの削除](./deletion.md)を参照します。

S3 API でオブジェクトを削除するには、次を使います。

```http
DELETE /{bucketName}/{objectName} HTTP/1.1
```

リクエストの例です。

```bash
aws s3api delete-object \
  --bucket bucket-creation-by-api \
  --key hello.txt \
  --endpoint-url http://localhost:9000
```

RustFS Console で、そのオブジェクトが表示されなくなったことを確認します。
