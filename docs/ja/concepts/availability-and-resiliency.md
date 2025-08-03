---
title: "可用性とスケーラビリティの説明"
description: "この記事では、RustFS のスケーリングに関する技術と説明について詳しく説明します。"
---

# 可用性とスケーラビリティの説明

## スケーリング方案概要

RustFS は新しいストレージプール（Server Pool）を追加することで水平スケーリングをサポートします。新しく追加される各ストレージプールは以下を満たす必要があります：

1. ストレージプール内のノードは**連続したホスト名**を使用する必要があります（node5-node8など）
2. 単一ストレージプール内では**同じ仕様**のディスク（タイプ/容量/数量）を使用する必要があります
3. 新しいストレージプールは既存クラスターと**時間同期**と**ネットワーク接続**を維持する必要があります

---

## 一、スケーリング前の準備

### 1.1 ハードウェア計画要件

| 項目 | 最低要件 | 推奨本番設定 |
|---------------|---------------------------|---------------------------|
| ノード数 | 4ノード/ストレージプール | 4 - 8ノード/ストレージプール |
| 単一ノードメモリ | 128 GB | 128 GB |
| ディスクタイプ | SSD | NVMe SSD |
| 単一ディスク容量 | ≥1 TB | ≥4 TB |
| ネットワーク帯域幅 | 10 Gbps | 25 Gbps |

### 1.2 システム環境チェック

```bash
# ホスト名の連続性チェック（新ノード例）
cat /etc/hosts
192.168.10.5 node5
192.168.10.6 node6
192.168.10.7 node7
192.168.10.8 node8

# 時間同期ステータス検証
timedatectl status | grep synchronized

# ファイアウォールルールチェック（全ノードで7000/7001ポートを開放）
firewall-cmd --list-ports | grep 7000
```

---

## 二、スケーリング実施手順

### 2.1 新ノード基本設定

```bash
# 専用ユーザー作成（全新ノードで実行）
groupadd rustfs-user
useradd -M -r -g rustfs-user rustfs-user

# ストレージディレクトリ作成（8ディスク例）
mkdir -p /data/rustfs{0..7}
chown -R rustfs-user:rustfs-user /data/rustfs*
```

### 2.2 RustFS サービスインストール

```bash
# 最新バイナリパッケージダウンロード（バージョン番号は既存クラスターと一致させる）
wget https://dl.rustfs.com/rustfs/v2.3.0/rustfs -O /usr/local/bin/rustfs
chmod +x /usr/local/bin/rustfs

# 設定ファイル作成（/etc/default/rustfs）
cat <<EOF > /etc/default/rustfs
RUSTFS_ROOT_USER=admin
RUSTFS_ROOT_PASSWORD=YourSecurePassword
RUSTFS_VOLUMES="/data/rustfs{0...7}"
RUSTFS_ADDRESS=":7000"
RUSTFS_CONSOLE_ADDRESS=":7001"
