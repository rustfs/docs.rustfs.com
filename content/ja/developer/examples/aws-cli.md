---
title: "AWS CLI"
description: "AWS CLI を RustFS に接続し、基本的なオブジェクト操作を行います。"
---

[AWS CLI](https://docs.aws.amazon.com/cli/) は、S3 向けの Amazon 公式コマンドラインツールです。`--endpoint-url` フラグを指定すると、RustFS でも動作します。

## インストール

[公式のインストールガイド](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)に従うか、macOS では次を実行します。

```bash
brew install awscli
```

## 設定

[アクセスキー](../../security-compliance/iam/access-token.md)とリージョンを設定します。

```bash
aws configure
```

```text
AWS Access Key ID [None]: <your-access-key>
AWS Secret Access Key [None]: <your-secret-key>
Default region name [None]: us-east-1
Default output format [None]: json
```

すべてのコマンドで、`--endpoint-url` に RustFS のアドレスを渡します。`http://localhost:9000` は、実際のサーバーアドレスに置き換えます。`--endpoint-url` を指定すると、AWS CLI はパススタイルアクセスを使います。RustFS では、このパススタイルアクセスが必要です。

:::note

インストール時に認証情報を設定していない場合、ローカル試験用の既定値は `rustfsadmin` / `rustfsadmin` です。使い捨てのローカル試用以外では使わないでください。

:::

## 検証

バケットを作成します。

```bash
aws s3 mb s3://my-bucket --endpoint-url http://localhost:9000
```

```text
make_bucket: my-bucket
```

ファイルをアップロードします。

```bash
aws s3 cp /path/to/hello.txt s3://my-bucket/ --endpoint-url http://localhost:9000
```

```text
upload: ../path/to/hello.txt to s3://my-bucket/hello.txt
```

バケットの内容を一覧表示します。

```bash
aws s3 ls s3://my-bucket --endpoint-url http://localhost:9000
```

```text
2026-07-15 10:30:00         12 hello.txt
```

## 次のステップ

[S3 SDK](../sdk/index.md) を使って RustFS 向けのアプリケーションを作成するか、[`rc`](/ja/operations/rc) でオブジェクトを管理します。
