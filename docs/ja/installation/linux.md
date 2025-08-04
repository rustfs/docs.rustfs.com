---
title: "Linux で RustFS をインストール"
description: "Linux オペレーティングシステムで RustFS をインストールするためのクイックガイド"
---

# Linux で RustFS をインストール

## 一、インストール前の必読事項

このページには、RustFS の3つのインストールモードのすべてのドキュメントと説明が含まれています。その中で、マルチマシンマルチディスクモードは、エンタープライズグレードの使用可能な性能、セキュリティ、および拡張性を含んでいます。

インストール前に以下をお読みください：

1. 起動モード - Linux 起動モードを明確にしてください
2. チェックリスト - 各指標が本番ガイダンス機能に適合しているかを確認

## 二、前提条件

1. オペレーティングシステムバージョン
2. ファイアウォール
3. ホスト名
4. メモリ条件
5. 時間同期
6. 容量計画
7. ディスク計画

### 2.1. オペレーティングシステムバージョン

Linux カーネル 4.x 以上のバージョンを推奨しますが、5.x 以上のバージョンでより良い IO スループットとネットワークパフォーマンスを得られます。

Ubuntu 22.04 と RHEL8.x を使用して RustFS をインストールできます。

### 2.2 ファイアウォール

Linux システムはデフォルトでファイアウォールが有効になっています。以下のコマンドでファイアウォール状態を確認できます：

```bash
systemctl status firewalld
```

ファイアウォール状態が "active" の場合、以下のコマンドでファイアウォールを無効にできます：

```bash
systemctl stop firewalld
systemctl disable firewalld
```

または RustFS の 9000 ポートを開放：

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```

### 2.3 ホスト名

RustFS クラスター作成には**同じで連続性のある**ホスト名を使用する必要があります：

```bash
vim /etc/hosts
127.0.0.1 localhost localhost.localdomain localhost4 localhost4.localdomain4
::1 localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

### 2.4 メモリ条件

RustFS はテスト環境で実行するのに最低 2 GB のメモリが必要で、本番環境では最低 64 GB のメモリが必要です。

### 2.5 時間同期

マルチノードの一貫性には時間サーバーで時間の一貫性を維持する必要があります：

```bash
timedatectl status
```

## 三、ユーザー名設定

RustFS 起動には、専用の非ログイン権限ユーザーで RustFS サービスを起動することをお勧めします。

## 四、インストールパッケージのダウンロード

まず wget または curl をインストールして rustfs インストールパッケージをダウンロードしてください：

```bash
# ダウンロードアドレス
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-latest.zip
unzip rustfs-linux-x86_64-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

## 五、環境変数設定

1. 設定ファイル作成

```bash
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_ENDPOINT=""
RUSTFS_TLS_PATH="/opt/tls"
EOF
```

2. ストレージディレクトリ作成

```bash
sudo mkdir -p /data/rustfs{0..3} /var/logs/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/logs/rustfs
```

## 六、システムサービス設定

1. systemd サービスファイル作成

```bash
sudo tee /etc/systemd/system/rustfs.service <<EOF
[Unit]
Description=RustFS Object Storage Server
Documentation=https://rustfs.com/docs/
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
NotifyAccess=main
User=root
Group=root

WorkingDirectory=/usr/local
EnvironmentFile=-/etc/default/rustfs
ExecStart=/usr/local/bin/rustfs \$RUSTFS_VOLUMES

LimitNOFILE=1048576
LimitNPROC=32768
TasksMax=infinity

Restart=always
RestartSec=10s

TimeoutStartSec=30s
TimeoutStopSec=30s

StandardOutput=append:/var/logs/rustfs/rustfs.log
StandardError=append:/var/logs/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

2. サービス設定再読み込み

```bash
sudo systemctl daemon-reload
```

## 七、サービス起動と検証

1. サービス起動と自動起動設定

```bash
sudo systemctl enable --now rustfs
```

2. サービス状態検証

```bash
systemctl status rustfs
```

3. コンソールアクセス検証

```bash
curl -u rustfsadmin:rustfsadmin http://localhost:9000/
```

4. ログファイル確認

```bash
tail -f /var/logs/rustfs/rustfs.log
```

5. ストレージインターフェーステスト

```bash
curl -X PUT -u rustfsadmin:rustfsadmin \
-H "Content-Type: application/octet-stream" \
--data-binary @testfile \
http://localhost:9000/bucket1/object1
```

