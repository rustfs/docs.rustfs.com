---
title: "Linux の前提条件とサービス設定"
description: "Linux の各デプロイ方式で共通する前提条件、ディスク準備、バイナリのインストール、systemd サービスの設定を説明します。"
---

このページでは、Linux の 3 つのデプロイ方式である [SNSD](./single-node-single-disk.md)、[SNMD](./single-node-multiple-disk.md)、[MNMD](./multiple-node-multiple-disk.md) に共通する前提条件とサービスの設定手順を説明します。先にこれらの手順を完了し、その後それぞれの方式のページに戻って環境ファイルを設定し、サービスを起動します。

## オペレーティングシステムのバージョン

Linux カーネル 4.x 以降を推奨します。5.x および 6.x では、I/O スループットとネットワーク性能が向上します。Ubuntu 22.04 と RHEL 8.x は、いずれも RustFS のインストールに適しています。

## ファイアウォール

Linux では、ファイアウォールがデフォルトで有効です。状態は次のコマンドで確認します。

```bash
systemctl status firewalld
```

状態が "active" の場合は、ファイアウォールを無効にできます。

```bash
systemctl stop firewalld
systemctl disable firewalld
```

または、RustFS の S3 ポート（9000）と Console のポート（9001）を許可します。

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --zone=public --add-port=9001/tcp --permanent
firewall-cmd --reload
```

同一デプロイ内のすべての RustFS サーバーは、**同じ待受ポート**を使う必要があります。ポート 9000 を使う場合は、ほかのサーバーもポート 9000 を使います。

## メモリ要件

テスト環境では、RustFS に少なくとも 2 GB のメモリが必要です。本番環境では、最低 128 GB のメモリが必要です。

## 時刻同期

RustFS の分散デプロイでは、すべてのノードのクロックを同期させる必要があります。RustFS は、リクエスト署名、オブジェクトのバージョニング、分散ロック、レプリケーションのためにタイムスタンプに依存しています。ノード間のクロックドリフトにより、次のような問題が起きる可能性があります。

- **リクエスト署名の失敗** — S3 署名の検証は、正確なタイムスタンプに依存します。
- **レプリケーションと整合性の問題** — クロックスキューにより、オブジェクトバージョンが古くなったり競合したりする可能性があります。
- **ロックの競合** — 分散ロックは、リース期限にタイムスタンプを使います。
- **サービスの起動失敗** — ノード間のクロックスキューが安全な閾値を超えると、RustFS は起動を拒否します。

:::warning

任意の 2 ノード間のクロックドリフトは **15 分**を超えないようにしてください。本番環境では、ドリフトを **1 秒**以内に抑えることを推奨します。

:::

### 推奨する NTP ツール

**すべてのノード**で、次のいずれかの時刻同期サービスを使います。1 つを選び、デプロイ全体で同じ設定にします。

#### chrony（推奨）

`chrony` は、最近の Linux ディストリビューションで推奨される NTP 実装です。従来の `ntpd` より同期が速く、断続するネットワーク接続にも適しています。

chrony をインストールします。

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install chrony -y

# Ubuntu / Debian
sudo apt install chrony -y
```

設定ファイル `/etc/chrony.conf`（RHEL）または `/etc/chrony/chrony.conf`（Debian/Ubuntu）を編集し、使用する NTP サーバーを指定します。

```ini
server time1.google.com iburst
server time2.google.com iburst
server time3.google.com iburst
server time4.google.com iburst
```

> 組織内に NTP サーバーがある場合は、そのアドレスに置き換えてください。`iburst` を付けると、初期同期が速くなります。

サービスを有効にして起動します。

```bash
sudo systemctl enable chronyd
sudo systemctl start chronyd
```

#### systemd-timesyncd

`systemd-timesyncd` は、systemd ベースのディストリビューションに組み込まれた軽量の SNTP クライアントです。フル機能の NTP デーモンが不要な環境に適しています。

`/etc/systemd/timesyncd.conf` を編集し、NTP サーバーを設定します。

```ini
[Time]
NTP=time1.google.com time2.google.com time3.google.com time4.google.com
FallbackNTP=0.pool.ntp.org 1.pool.ntp.org
```

サービスを有効にして起動します。

```bash
sudo timedatectl set-ntp true
sudo systemctl enable systemd-timesyncd
sudo systemctl start systemd-timesyncd
```

#### ntpd（レガシー）

NTP リファレンス実装の従来の `ntpd` も、現在広く利用できます。環境で `ntpd` が必須でない限り、`chrony` を使ってください。

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install ntp -y

# Ubuntu / Debian
sudo apt install ntp -y
```

`/etc/ntp.conf` を編集して NTP サーバーを設定し、サービスを有効にして起動します。

```bash
sudo systemctl enable ntpd
sudo systemctl start ntpd
```

### 時刻同期の確認

NTP サービスを設定したあと、各ノードで同期状態を確認します。

システムクロックの状態を確認します。

```bash
timedatectl status
```

出力に `System clock synchronized: yes` および `NTP service: active` と表示されていることを確認してください。

`chrony` では、次のコマンドで詳しい同期状態を確認できます。

```bash
chronyc tracking
```

確認する主な項目は次のとおりです。

- **Leap status** — `Normal` であるべきです（`Not synchronised` ではないこと）。
- **System time** — 参照サーバーからのオフセットです。`0.000000000 seconds` に近い値であるべきです。
- **Root delay** — 参照サーバーまでの往復時間です。

現在の NTP ソースと状態を一覧表示します。

```bash
chronyc sources -v
```

注目する列は次のとおりです。

- **`*`** — 現在選択されている同期ソースです。
- **`+`** — ほかの許容できるソースです。
- **`-`** — 選択アルゴリズムが拒否したソースです。
- **`?`** — 接続状態に問題がある可能性のあるソースです。

`ntpd` の場合は、次のコマンドを使います。

```bash
ntpq -p
```

### ノード間の時刻整合性の確認

すべてのノードが同期したあと、クラスター全体でクロックが一致していることを確認してください。各ノードでタイムスタンプを比較します。

```bash
# Run on each node and compare the output
date -u '+%Y-%m-%d %H:%M:%S'
```

より精密に比較する場合は、`sshpass` をインストールして次を実行します。

```bash
for host in node1 node2 node3 node4; do
  echo -n "$host: "
  ssh "$host" date -u '+%Y-%m-%d %H:%M:%S.%N'
done
```

適切に設定された環境では、任意の 2 ノード間の差は無視できる程度（1 ミリ秒未満）であるべきです。

## 容量計画

オブジェクトストレージの容量を計画するときは、次の点を検討することを推奨します。

- 初期データ量: 一度に移行または保存するデータ量（例: 500 TB）
- データ増加量: 日次、週次、月次の増加量
- 計画期間: このハードウェア計画をどの程度の期間使うか（推奨: 3 年）
- 組織のハードウェア更新サイクル

[EC 構成](../requirement/ec-configuration.md)を確認し、使用可能な容量の計算、パリティの自動デフォルト、明示的なパリティやイレイジャーセット幅の検証を、デプロイ前に行ってください。

## ディスク計画

NFS は高 I/O でファントム書き込みとロックの問題を起こすため、RustFS の基盤ストレージとして **NFS は使用できません**。**JBOD（Just a Bunch of Disks）** を強く推奨します。物理ディスクをオペレーティングシステムへ直接かつ独立して見せ、データの冗長化と保護は RustFS のソフトウェア層に任せます。

理由は次のとおりです。

- **性能**: RustFS のイレイジャーコーディングは、複数ディスクへの並行読み書きに最適化されており、ハードウェア RAID コントローラーより高いスループットを得られます。ハードウェア RAID は性能のボトルネックになります。
- **コスト**: 高価な RAID カードが不要になり、ハードウェアの調達コストを抑えられます。
- **運用**: RustFS がディスクを一元管理するため、ストレージ層の運用が単純になります。
- **障害回復**: RustFS のデータ修復は、従来の RAID リビルドより速く、クラスター性能への影響も小さくなります。

より高い性能とスループットを得るには、ストレージ媒体として NVMe SSD を推奨します。

## ファイルシステムの選択

RustFS では、すべてのストレージディスクを XFS でフォーマットすることを強く推奨します。開発とテストは XFS を前提にしており、性能と安定性を確保できます。ext4、BTRFS、ZFS などのほかのファイルシステムは、性能低下や予期しない問題の原因になるため避けてください。

XFS が RustFS のワークロードに適する理由は 3 つあります。

- **高並行 I/O**: XFS は高い性能とスケーラビリティを目的に設計されています。内部のジャーナリングと B+ 木などのデータ構造により、多数の並行読み書きを効率的に処理できます。これは、RustFS が大きなオブジェクトを分割し、イレイジャーセット内の複数ディスクへ並行して読み書きする動作に合います。
- **巨大なファイルと大きなファイルサイズ**: XFS は 64 ビットのファイルシステムで、非常に大きなファイル（最大 8 EB）を扱えます。1 つのディレクトリに数百万のファイルがあっても、メタデータ管理の効率を保てます。RustFS は各オブジェクト（またはオブジェクトバージョン）を独立したファイルとして保存するため、この特性が重要です。
- **領域の予約**: XFS は効率的な `fallocate` API を提供します。RustFS はオブジェクトの書き込み前に連続したディスク領域を予約し、書き込み中の動的拡張とメタデータ更新のオーバーヘッドを避け、ファイルの断片化を抑えます。

ディスクを識別しやすくするため、XFS のフォーマット時に **Label** を使うことを推奨します。

まずディスク構成を確認します。

```bash
sudo lsblk

NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 465.7G  0 disk
├─sda1        8:1    0   512M  0 part /boot/efi
└─sda2        8:2    0 465.2G  0 part /
nvme0n1           8:16   0   3.7T  0 disk  <-- if this is our format new disk
nvme1n1           8:32   0   3.7T  0 disk  <-- if this is our format new disk
nvme2n1          8:48   0   3.7T   0  disk
```

各データディスクをフォーマットします。

```bash
sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

フォーマットオプションは次のとおりです。

- `-L <label>`: 識別とマウントを容易にするため、ファイルシステムのラベルを設定します。
- `-i size=512`: inode サイズは 512 バイトを推奨します。小さなオブジェクトを多数保存する場面（メタデータ）に有利です。
- `-n ftype=1`: ftype を有効にすると、ディレクトリ構造にファイルタイプが記録され、readdir や unlink などの操作が改善します。

マウントします。

```bash
# write new line
vim /etc/fstab
LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0

#save & exit

# mount disk
sudo mount -a
```

## サービスユーザーの設定

ログイン権限のない専用ユーザーで RustFS を実行することを推奨します。

1. **デフォルトアカウントを使う**: サービスユニットのデフォルトユーザーとグループは `root` と `root` です。そのまま使う場合、変更は不要です。
2. **専用アカウントを使う**: ユーザーとグループを作成し、サービスユニットを更新します。

次の例では、ユーザーとグループを作成し、RustFS のデータディレクトリへのアクセス権を付与します（任意です）。

```bash
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

:::note

- rustfs-user ユーザーとグループを作成した場合は、`/etc/systemd/system/rustfs.service` の `User` と `Group` を `rustfs-user` に変更します。
- `/data/rustfs*` は、実際のマウントディレクトリに合わせて調整します。

:::

## インストールパッケージのダウンロード

先に wget または curl をインストールし、RustFS のバイナリをダウンロードしてインストールします。

```bash
# Download address
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
unzip rustfs-linux-x86_64-musl-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

## systemd サービスの設定

1. systemd のサービスファイルを作成します。

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

OOMScoreAdjust=-1000
SendSIGKILL=no

TimeoutStartSec=120s
TimeoutStopSec=30s

NoNewPrivileges=true
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectClock=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictRealtime=true

# service log configuration
StandardOutput=append:/var/log/rustfs/rustfs.log
StandardError=append:/var/log/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

サービスは、方式ごとに異なる `/etc/default/rustfs` から `RUSTFS_VOLUMES` とその他の設定を読み込みます。各デプロイ方式のページに、ファイルの内容が記載されています。

2. サービス設定を再読み込みします。

```bash
sudo systemctl daemon-reload
```

## 次のステップ

環境ファイルの設定とサービスの起動のため、使用するデプロイ方式のページに戻ります。

- [シングルノード・シングルディスク（SNSD）](./single-node-single-disk.md)
- [シングルノード・マルチディスク（SNMD）](./single-node-multiple-disk.md)
- [マルチノード・マルチディスク（MNMD）](./multiple-node-multiple-disk.md)
