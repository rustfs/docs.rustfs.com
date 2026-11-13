---
title: "クイックスタート"
description: "インストールスクリプトで RustFS を導入し、Console にログインして最初のオブジェクトを保存するまでの手順を、約 10 分で説明します。"
---

このガイドでは、空の Linux サーバーから動作する RustFS インスタンスまで進めます。インストールし、Console にログインし、バケットを作成して、最初のオブジェクトをアップロードします。本番の計画（マルチノード構成、ハードウェアのサイジング）は、意図的に [次のステップ](#next-steps) に残しています。

**前提条件**

- `systemd` を備えた Linux サーバー（x86_64 または aarch64）と、root または sudo の権限
- `unzip` がインストール済みで、パッケージをダウンロードできる外向きのネットワークアクセスがあること
- 手元のマシンからポート `9000`（S3 API）と `9001`（Console）に到達できること
- コマンドラインでの確認に使う [`rc`](/ja/operations/rc) がワークステーションにインストール済みであること

## 1. RustFS をインストールして起動する

公式のインストールスクリプトを実行します。

```bash
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
```

スクリプトはバイナリを `/usr/local/bin/rustfs` にインストールし、`rustfs` の systemd サービスを登録して起動します。既定ではデータを `/data/rustfs0` に保存し、ポート `9000`（S3 API）と `9001`（Console）で待ち受けます。データパスとポートはインストール中に変更できます。成功すると、次のような要約が表示されます。

```text
RustFS has been installed and started successfully!
Service port: 9000,  Console port: 9001,  Data directory: /data/rustfs0

[SECURITY WARNING] Please change the default value for RUSTFS_ACCESS_KEY/RUSTFS_SECRET_KEY immediately ...
  Config file: /etc/default/rustfs
```

## 2. 認証情報を設定する

生成された設定ファイルには、プレースホルダーの認証情報が入っています。独自のアクセスキーとシークレットキーを設定し、サービスを再起動します。

```ini title="/etc/default/rustfs" {1,2}
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>   ; e.g. output of: openssl rand -base64 24
```

アクセスキーには大文字の英数字を使います。`RUSTFS_ACCESS_KEY` に、加工していない Base64 の出力を使わないでください。Base64 には `/` が含まれることがあり、AWS Signature Version 4 の認証情報スコープと衝突します。詳細は [認証情報の管理](/ja/operations/credentials) を参照してください。

```bash
sudo systemctl restart rustfs
sudo systemctl status rustfs --no-pager   # should report: active (running)
```

:::warning[既定の認証情報を残さない]

`RUSTFS_ACCESS_KEY` と `RUSTFS_SECRET_KEY` が未設定の場合、サーバーは組み込みの既定値 `rustfsadmin` / `rustfsadmin` を使います。使い捨てのローカルテストでは許容できますが、ほかの人から到達できる環境では使わないでください。

:::

## 3. Console にサインインする

ブラウザーで `http://<server-ip>:9001` を開き、手順 2 のアクセスキーとシークレットキーでサインインします。

![RustFS Console のログイン画面](./images/console.jpg)

## 4. バケットを作成してファイルをアップロードする

1. Console のホーム画面で **Create Bucket**（バケットの作成）を選び、名前（例: `my-bucket`）を付けて確定します。
2. バケットを開き、アップロード操作で任意のローカルファイルを追加します。
3. アップロードしたオブジェクトをクリックして詳細を確認します。これでオブジェクトストレージが動作しています。

コマンドラインを使う場合は、[`rc`](/ja/operations/rc) を設定してから同じ操作を行います。

```bash
rc alias set rustfs http://<server-ip>:9000 <your-access-key> <your-secret-key>
rc bucket create rustfs/my-bucket
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object list rustfs/my-bucket
```

```text
✓ Bucket 'rustfs/my-bucket' created successfully.
/path/to/hello.txt -> rustfs/my-bucket/hello.txt
```

<a id="mode"></a>
<a id="next-steps"></a>

## 次のステップ [#next-steps]

クイックインストールでは、RustFS を **シングルノード・シングルディスク（SNSD）** モードで実行します。冗長性はなく、評価と開発に適しています。ここからの進め方は次のとおりです。

- **本番デプロイを計画する**: トポロジーを選び、対応するガイドに従います。
  - [シングルノード・シングルディスク（SNSD）](./single-node-single-disk.md): 開発と小規模ワークロード
  - [シングルノード・マルチディスク（SNMD）](./single-node-multiple-disk.md): 1 台のマシンでのディスク単位の耐障害性
  - [マルチノード・マルチディスク（MNMD）](./multiple-node-multiple-disk.md): 本番向けの可用性とスケール。[インストール前チェックリスト](../requirement/checklists/index.md) とあわせて確認します
- **コンテナを使う場合**: [コンテナでインストールする](../container/index.md)
- **アプリケーションを接続する**: [SDK とサンプル](../../developer/sdk/index.md)
