---
title: "Linux Prerequisites and Service Setup"
description: "Common prerequisites, disk preparation, binary installation, and systemd service setup shared by all RustFS Linux deployment modes."
---

This page contains the prerequisites and service setup steps shared by all three Linux deployment modes — [SNSD](./single-node-single-disk.md), [SNMD](./single-node-multiple-disk.md), and [MNMD](./multiple-node-multiple-disk.md). Complete these steps first, then return to your mode page to configure the environment file and start the service.

## Operating System Version

We recommend Linux kernel version 4.x or later; versions 5.x/6.x achieve better I/O throughput and network performance. Ubuntu 22.04 and RHEL 8.x are both suitable for installing RustFS.

## Firewall

Linux systems have firewalls enabled by default. Check the firewall status with:

```bash
systemctl status firewalld
```

If your firewall status is "active", you can disable the firewall:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Or allow the RustFS S3 port (9000) and console port (9001):

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --zone=public --add-port=9001/tcp --permanent
firewall-cmd --reload
```

All RustFS servers in a deployment **must** use the same listening port. If you use port 9000, every other server must also use port 9000.

## Memory Requirements

RustFS requires at least 2 GB of memory for a test environment; production environments require a minimum of 128 GB of memory.

## Time Synchronization

RustFS の分散デプロイメントでは、すべてのノードのクロックを同期させる必要があります。RustFS はリクエスト署名、オブジェクトバージョニング、分散ロック、レプリケーションにタイムスタンプに依存しています。ノード間のクロックドリフトにより、以下のような問題が発生する可能性があります：

- **リクエスト署名の失敗** — S3 署名の検証は正確なタイムスタンプに依存します。
- **レプリケーションと整合性の問題** — クロックスキーによりオブジェクトバージョンが古くなったり競合したりする可能性があります。
- **ロック競合の問題** — 分散ロックはリース期限にタイムスタンプを使用します。
- **サービス起動の失敗** — ノード間のクロックスキーが安全な閾値を超えると、RustFS は起動を拒否します。

:::warning
任意の 2 ノード間のクロックドリフトは **15 分**を超えてはなりません。本番環境では、ドリフトを **1 秒**以内に抑えることを推奨します。
:::

### 推奨 NTP ツール

**すべてのノード**で以下のいずれかの時間同期サービスを使用してください。1 つのツールを選択し、デプロイメント全体で統一して設定します。

#### chrony（推奨）

`chrony` は最新の Linux ディストリビューションで推奨される NTP 実装です。レガシーの `ntpd` と比較して同期が速く、断続的なネットワーク接続にもより適切に対応します。

chrony のインストール：

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install chrony -y

# Ubuntu / Debian
sudo apt install chrony -y
```

設定ファイル `/etc/chrony.conf`（RHEL）または `/etc/chrony/chrony.conf`（Debian/Ubuntu）を編集し、使用する NTP サーバーを指定します：

```conf
server time1.google.com iburst
server time2.google.com iburst
server time3.google.com iburst
server time4.google.com iburst
```

> サーバーアドレスは組織内の NTP サーバーがある場合はそれに置き換えてください。`iburst` を使用すると初期同期が高速化されます。

サービスを有効化して起動：

```bash
sudo systemctl enable chronyd
sudo systemctl start chronyd
```

#### systemd-timesyncd

`systemd-timesyncd` は systemd ベースのディストリビューションに組み込まれた軽量 SNTP クライアントです。フル NTP デーモンが不要な環境に適しています。

`/etc/systemd/timesyncd.conf` を編集して NTP サーバーを設定：

```ini
[Time]
NTP=time1.google.com time2.google.com time3.google.com time4.google.com
FallbackNTP=0.pool.ntp.org 1.pool.ntp.org
```

サービスを有効化して起動：

```bash
sudo timedatectl set-ntp true
sudo systemctl enable systemd-timesyncd
sudo systemctl start systemd-timesyncd
```

#### ntpd（レガシー）

NTP リファレンス実装のクラシックな `ntpd` は現在も広く利用可能です。環境で特に `ntpd` が必要な場合を除き、`chrony` を使用してください。

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install ntp -y

# Ubuntu / Debian
sudo apt install ntp -y
```

`/etc/ntp.conf` を編集して NTP サーバーを設定し、有効化して起動：

```bash
sudo systemctl enable ntpd
sudo systemctl start ntpd
```

### 時間同期の検証

NTP サービスを設定した後、各ノードで同期状態を確認してください。

システムクロックの状態を確認：

```bash
timedatectl status
```

出力には `System clock synchronized: yes` および `NTP service: active` と表示される必要があります。

`chrony` の場合、以下のコマンドで詳細な同期状態を確認できます：

```bash
chronyc tracking
```

確認すべき重要な項目：

- **Leap status** — `Normal` であるべきです（`Not synchronised` ではないこと）。
- **System time** — 参照サーバーからのオフセット。`0.000000000 seconds` に近い必要があります。
- **Root delay** — 参照サーバーまでの往復時間。

現在の NTP ソースとその状態を一覧表示：

```bash
chronyc sources -v
```

注目すべき列：

- **`*`** — 現在選択されている同期ソース。
- **`+`** — その他の許容可能なソース。
- **`-`** — 選択アルゴリズムによって拒否されたソース。
- **`?`** — 接続状態に問題がある可能性のあるソース。

`ntpd` の場合：

```bash
ntpq -p
```

### クロスノードクロック整合性の検証

すべてのノードが同期した後、クラスタ全体でクロックが一致していることを確認してください。各ノードでタイムスタンプを比較：

```bash
# 各ノードで実行し、出力を比較
date -u '+%Y-%m-%d %H:%M:%S'
```

より精密な比較が必要な場合は、`sshpass` をインストールして以下を実行：

```bash
for host in node1 node2 node3 node4; do
  echo -n "$host: "
  ssh "$host" date -u '+%Y-%m-%d %H:%M:%S.%N'
done
```

適切に設定された環境では、任意の 2 ノード間の差異は無視できる程度（1 ミリ秒未満）である必要があります。

## Capacity Planning

When planning object storage capacity, we recommend considering:

- Initial data volume: How much data do you plan to migrate or store at once? (e.g., 500 TB)
- Data growth volume: Daily/weekly/monthly data growth capacity
- Planning cycle: How long should this hardware planning last? (recommended: 3 years)
- Your company's hardware iteration and update cycles.

Review [EC Configuration](../requirement/ec-configuration.md) to calculate usable capacity, understand the automatic parity defaults, and validate any explicit parity or erasure-set width before deployment.

## Disk Planning

Because NFS generates phantom writes and lock issues under high I/O, **NFS is prohibited** as the underlying storage medium for RustFS. We strongly recommend **JBOD (Just a Bunch of Disks)** mode: expose physical disks directly and independently to the operating system, and let the RustFS software layer handle data redundancy and protection.

The reasons are as follows:

- **Better Performance:** RustFS's Erasure Coding engine is highly optimized and reads/writes multiple disks concurrently, achieving higher throughput than hardware RAID controllers. Hardware RAID becomes a performance bottleneck.
- **Lower Cost:** No expensive RAID cards needed, reducing hardware procurement costs.
- **Simpler Management:** RustFS manages disks uniformly, simplifying storage layer operations and maintenance.
- **Faster Fault Recovery:** The RustFS healing process is faster than a traditional RAID rebuild and has less impact on cluster performance.

We recommend NVMe SSDs as the storage medium for higher performance and throughput.

## File System Selection

RustFS strongly recommends formatting all storage disks with the XFS file system. RustFS development and testing are based on XFS, ensuring optimal performance and stability. Avoid other file systems such as ext4, BTRFS, or ZFS, as they may cause performance degradation or unpredictable issues.

XFS suits RustFS's workload for three reasons:

- **High-concurrency I/O:** XFS was designed for high performance and scalability. Its internal journaling and data structures (such as B+ trees) efficiently handle large numbers of parallel read/write requests, matching how RustFS shards large objects and reads/writes multiple disks in an erasure set in parallel.
- **Massive files and large file sizes:** XFS is a 64-bit file system supporting extremely large files (up to 8 EB). Its metadata management stays efficient even with millions of files in a single directory — important because RustFS stores each object (or object version) as an independent file.
- **Space reservation:** XFS provides an efficient `fallocate` API. RustFS uses it to reserve contiguous disk space before writing objects, avoiding the overhead of dynamic expansion and metadata updates during writes and minimizing file fragmentation.

For better disk discovery, we recommend using **Label** tags when formatting XFS file systems.

First, check the disk layout:

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

Format each data disk:

```bash
sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

Formatting options:

- `-L <label>`: Set a label for the file system for easier identification and mounting.
- `-i size=512`: We recommend an inode size of 512 bytes, which benefits scenarios storing large numbers of small objects (metadata).
- `-n ftype=1`: Enable ftype so the file system records file types in directory structures, improving operations such as readdir and unlink.

Mounting:

```bash
# write new line
vim /etc/fstab
LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0

#save & exit

# mount disk
sudo mount -a
```

## Configure Service User

We recommend running RustFS as a dedicated user without login permissions.

1. **Keep the default account:** The default user and group in the service unit are `root` and `root`; no changes are needed if you use them.
2. **Use a dedicated account:** Create a user and group, then update the service unit accordingly.

The following example creates the user and group and grants access to the RustFS data directories (optional):

```bash
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

:::note

- If you created the rustfs-user user and group, change `User` and `Group` in `/etc/systemd/system/rustfs.service` to `rustfs-user`.
- Adjust `/data/rustfs*` to your actual mount directories.

:::

## Download the Installation Package

Install wget or curl first, then download and install the RustFS binary:

```bash
# Download address
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
unzip rustfs-linux-x86_64-musl-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

## Configure the systemd Service

1. Create the systemd service file

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

The service reads `RUSTFS_VOLUMES` and the other settings from `/etc/default/rustfs`, which is mode-specific — your deployment mode page shows the exact content.

2. Reload the service configuration

```bash
sudo systemctl daemon-reload
```

## Next Steps

Return to your deployment mode page to configure the environment file and start the service:

- [Single Node Single Disk Mode (SNSD)](./single-node-single-disk.md)
- [Single Node Multiple Disk Mode (SNMD)](./single-node-multiple-disk.md)
- [Multiple Node Multiple Disk Mode (MNMD)](./multiple-node-multiple-disk.md)
