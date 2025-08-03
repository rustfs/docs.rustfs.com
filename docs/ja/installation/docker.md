---
title: "Docker で RustFS をインストール"
description: "RustFS Docker デプロイメント。"
---

# Docker で RustFS をインストール

RustFS は、高性能で100% S3互換のオープンソース分散オブジェクトストレージシステムです。単一ノード単一ディスク（SNSD）デプロイメントモードでは、バックエンドはゼロ消去検証を採用し、追加のデータ冗長性を提供せず、ローカルテストと小規模シナリオに適しています。
この記事は RustFS 公式 Linux バイナリパッケージを基に、カスタム Dockerfile を通じて RustFS とその実行時環境をコンテナにパッケージ化し、データボリュームと環境変数を設定してワンクリックでサービスを開始できます。

---

## 一、前提準備

1. **ホスト要件**
   * Docker（≥ 20.10）がインストールされ、正常にイメージをプルしてコンテナを実行できること
   * ローカルパス `/mnt/rustfs/data`（またはカスタムパス）をオブジェクトデータのマウントに使用

2. **ネットワークとファイアウォール**
   * ホストマシンの9000ポートが外部に開放されていること（またはカスタムポートが一致していること）

3. **設定ファイル準備**
   * ホストマシンの `/etc/rustfs/config.toml` で、リスニングポート、管理者アカウント、データパスなどを定義（第四節で詳細説明）

---

## 二、RustFS 公式イメージの高速プル

公式 Ubuntu ベースイメージを使用して、RustFS 公式イメージを高速プル：

```bash
docker pull quay.io/rustfs/rustfs
```

または docker を使用してプル：
```bash
docker pull rustfs/rustfs
```

---

## 三、環境設定の作成

ホストマシンで設定ファイル `/etc/rustfs/config.toml` を作成、サンプル内容：

```toml
[server]
address = ":9000"
console_address = ":9001"

[credentials]
root_user = "rustfsadmin"
root_password = "rustfspassword"

[storage]
data_dir = "/data"
```

---

## 四、コンテナ起動

```bash
# RustFS コンテナを起動
docker run -d \
  --name rustfs \
  -p 9000:9000 \
  -p 9001:9001 \
  -v /mnt/rustfs/data:/data \
  -v /etc/rustfs:/etc/rustfs \
  -e RUSTFS_ROOT_USER=rustfsadmin \
  -e RUSTFS_ROOT_PASSWORD=rustfspassword \
  rustfs/rustfs server /data
```

---

## 五、サービス検証

1. **サービス状態確認**
```bash
docker ps | grep rustfs
curl http://localhost:9000/minio/health/live
```

2. **ウェブコンソールアクセス**
ブラウザで `http://localhost:9001` を開き、設定した認証情報でログイン。

3. **S3 API テスト**
```bash
# AWS CLI を使用してテスト
aws configure set aws_access_key_id rustfsadmin
aws configure set aws_secret_access_key rustfspassword
aws --endpoint-url http://localhost:9000 s3 mb s3://test-bucket
```

---

## 六、トラブルシューティング

| 問題 | 解決方法 |
|------|----------|
| コンテナ起動失敗 | `docker logs rustfs` でログを確認 |
| ポート競合 | `-p` パラメータを調整 |
| データ永続化問題 | ボリュームマウントパスを確認 |

> **注意**: この記事は RustFS 最新版に基づいて書かれています。本番環境での使用前は、データのバックアップを取ることをお勧めします。

