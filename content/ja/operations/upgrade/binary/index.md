---
title: "バイナリ"
description: "クラスターの可用性を維持したまま、RustFS のバイナリデプロイを 1 ノードずつアップグレードします。"
---

ローリングアップグレードにより、クラスター全体をオフラインにせず、各ノードの RustFS 実行ファイルを置き換えます。開始前に、対象リリースのリリースノートを読み、すべてのノードが正常であることを確認します。

## アップグレードの前に

すべてのノードで準備完了を確認します。

```bash
curl -fsS http://<node-hostname>:9000/health/ready
```

サービス設定をバックアップし、ロールバックに備えて、現在実行中の実行ファイルを残します。

```bash
sudo cp /etc/default/rustfs /etc/default/rustfs.bak
sudo cp /usr/local/bin/rustfs /usr/local/bin/rustfs.previous
```

## 各ノードをアップグレードする

一度に 1 ノードずつアップグレードします。再起動したノードが準備完了を報告するまで、次のノードには進みません。

```bash
sudo systemctl stop rustfs
sudo cp rustfs-new /usr/local/bin/rustfs
sudo chmod +x /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

残りの各ノードでも、同じ手順を繰り返します。

## ロールバック

新しいバージョンの検証に失敗した場合は、一度に 1 ノードずつ以前の実行ファイルを復元し、準備完了を待ってから続行します。

```bash
sudo systemctl stop rustfs
sudo cp /usr/local/bin/rustfs.previous /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

## 次のステップ

アップグレード後の追加の検証は、[状態の確認](/ja/operations/status-check) を参照します。
