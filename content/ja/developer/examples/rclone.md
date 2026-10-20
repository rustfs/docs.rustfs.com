---
title: "rclone"
description: "rclone を RustFS に接続し、基本的なオブジェクト操作を行います。"
---

[rclone](https://rclone.org/) は、クラウドストレージとの間でファイルを同期するコマンドラインプログラムです。RustFS が実装する S3 プロトコルで通信します。

## インストール

```bash
curl https://rclone.org/install.sh | sudo bash
```

または、[公式のインストールガイド](https://rclone.org/install/)を参照します。

## 設定

`~/.config/rclone/rclone.conf` にリモートを追加します。`http://localhost:9000` を実際のサーバーアドレスに置き換え、独自の[アクセスキー](../../security-compliance/iam/access-token.md)を使います。RustFS はパススタイルアクセスを使うため、`force_path_style = true` が必要です。

```ini title="~/.config/rclone/rclone.conf"
[rustfs]
type = s3
provider = Other
access_key_id = <your-access-key>
secret_access_key = <your-secret-key>
endpoint = http://localhost:9000
region = us-east-1
force_path_style = true
```

## 検証

バケットを作成します。

```bash
rclone mkdir rustfs:my-bucket
```

ファイルをアップロードします。

```bash
rclone copy /path/to/hello.txt rustfs:my-bucket
```

バケットと内容を一覧表示します。

```bash
rclone lsd rustfs:
rclone ls rustfs:my-bucket
```

```text
          -1 2026-07-15 10:30:00        -1 my-bucket
       12 hello.txt
```

## 次のステップ

[S3 SDK](../sdk/index.md) を使って RustFS 向けのアプリケーションを作成するか、[`rc`](/ja/operations/rc) でオブジェクトを管理します。
