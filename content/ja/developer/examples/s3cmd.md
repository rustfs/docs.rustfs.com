---
title: "s3cmd"
description: "s3cmd を RustFS に接続し、コマンドラインから基本的なオブジェクト操作を行います。"
---

[s3cmd](https://s3tools.org/s3cmd) は、S3 互換ストレージ向けのコマンドラインクライアントです。小さな設定ファイルで、RustFS のエンドポイントを指定します。

## インストール

```bash
# macOS
brew install s3cmd
# Debian/Ubuntu
sudo apt install s3cmd
# or via pip
pip install s3cmd
```

## 設定

`~/.s3cfg` を作成します。`localhost:9000` を実際のサーバーアドレスに置き換え、独自の[アクセスキー](../../security-compliance/iam/access-token.md)を使います。RustFS はパススタイルアクセスを使うため、バケットのホストを同じエンドポイントに設定します。

```ini title="~/.s3cfg"
[default]
access_key = <your-access-key>
secret_key = <your-secret-key>
host_base = localhost:9000
host_bucket = localhost:9000
use_https = False
signature_v2 = False
```

:::note

[TLS を設定している](../../integration/tls-configured.md)場合は、`use_https = True` にし、ポート `9000` を指定します。

:::

## 検証

バケットを作成し、ファイルをアップロードして、一覧表示します。

```bash
s3cmd mb s3://my-bucket
s3cmd put /path/to/hello.txt s3://my-bucket/hello.txt
s3cmd ls s3://my-bucket
```

```text
upload: '/path/to/hello.txt' -> 's3://my-bucket/hello.txt'  [1 of 1]
2026-07-16 10:00        12   s3://my-bucket/hello.txt
```

## 次のステップ

アプリケーションを接続するには [SDK の概要](../sdk/index.md)を参照するか、[`rc`](/ja/operations/rc) でオブジェクトを管理します。
