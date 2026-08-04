---
title: "Linux 前提条件和服务设置"
description: "所有 RustFS Linux 部署模式共用的前提条件、磁盘准备、二进制文件安装和 systemd 服务设置。"
---

本页包含三种 Linux 部署模式共用的前提条件和服务设置步骤：[SNSD](./single-node-single-disk.md)、[SNMD](./single-node-multiple-disk.md) 和 [MNMD](./multiple-node-multiple-disk.md)。请先完成这些步骤，然后返回所选模式的页面配置环境文件并启动服务。

## 操作系统版本

建议使用 Linux 内核 4.x 或更高版本；5.x/6.x 版本可获得更好的 I/O 吞吐量和网络性能。Ubuntu 22.04 和 RHEL 8.x 都适合安装 RustFS。

## 防火墙

Linux 系统默认启用防火墙。使用以下命令检查防火墙状态：

```bash
systemctl status firewalld
```

如果防火墙状态为 "active"，可以禁用防火墙：

```bash
systemctl stop firewalld
systemctl disable firewalld
```

也可以允许 RustFS S3 端口（9000）和控制台端口（9001）：

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --zone=public --add-port=9001/tcp --permanent
firewall-cmd --reload
```

同一部署中的所有 RustFS 服务器**必须**使用相同的监听端口。如果使用端口 9000，其他所有服务器也必须使用端口 9000。

## 内存要求

测试环境中 RustFS 至少需要 2 GB 内存；生产环境至少需要 128 GB 内存。

## 时间同步

RustFS 分布式部署中的所有节点**必须**保持时钟同步。RustFS 依赖时间戳进行请求签名、对象版本控制、分布式锁和复制。节点间的时钟漂移可能导致：

- **请求签名失败** — S3 签名验证依赖准确的时间戳。
- **复制和一致性问题** — 时钟偏移可能导致对象版本过时或冲突。
- **锁竞争问题** — 分布式锁使用时间戳进行租约过期。
- **服务启动失败** — 如果节点间时钟偏移超过安全阈值，RustFS 将拒绝启动。

:::warning
任意两个节点之间的时钟漂移不应超过 **15 分钟**。对于生产环境，建议将漂移控制在 **1 秒**以内。
:::

### 推荐的 NTP 工具

在**每个**节点上使用以下任一时间同步服务。请选择一种工具并在整个部署中统一配置。

#### chrony（推荐）

`chrony` 是现代 Linux 发行版首选的 NTP 实现。与传统的 `ntpd` 相比，它同步速度更快，能更好地处理间歇性网络连接。

安装 chrony：

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install chrony -y

# Ubuntu / Debian
sudo apt install chrony -y
```

编辑配置文件 `/etc/chrony.conf`（RHEL）或 `/etc/chrony/chrony.conf`（Debian/Ubuntu），指向您首选的 NTP 服务器：

```conf
server time1.google.com iburst
server time2.google.com iburst
server time3.google.com iburst
server time4.google.com iburst
```

> 请将服务器地址替换为贵组织的内部 NTP 服务器（如有）。使用 `iburst` 可加速初始同步。

启用并启动服务：

```bash
sudo systemctl enable chronyd
sudo systemctl start chronyd
```

#### systemd-timesyncd

`systemd-timesyncd` 是 systemd 发行版内置的轻量级 SNTP 客户端，适用于不需要完整 NTP 守护进程的环境。

编辑 `/etc/systemd/timesyncd.conf` 配置 NTP 服务器：

```ini
[Time]
NTP=time1.google.com time2.google.com time3.google.com time4.google.com
FallbackNTP=0.pool.ntp.org 1.pool.ntp.org
```

启用并启动服务：

```bash
sudo timedatectl set-ntp true
sudo systemctl enable systemd-timesyncd
sudo systemctl start systemd-timesyncd
```

#### ntpd（传统方式）

经典的 `ntpd` 来自 NTP 参考实现，仍然广泛可用。除非您的环境特别需要 `ntpd`，否则建议使用 `chrony`。

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install ntp -y

# Ubuntu / Debian
sudo apt install ntp -y
```

编辑 `/etc/ntp.conf` 设置 NTP 服务器，然后启用并启动：

```bash
sudo systemctl enable ntpd
sudo systemctl start ntpd
```

### 验证时间同步

配置 NTP 服务后，请在每个节点上验证同步状态。

检查系统时钟状态：

```bash
timedatectl status
```

输出应显示 `System clock synchronized: yes` 和 `NTP service: active`。

对于 `chrony`，使用以下命令查看详细的同步状态：

```bash
chronyc tracking
```

关键字段说明：

- **Leap status** — 应为 `Normal`（而非 `Not synchronised`）。
- **System time** — 与参考服务器的偏移量，应接近 `0.000000000 seconds`。
- **Root delay** — 到参考服务器的往返时间。

列出当前 NTP 源及其状态：

```bash
chronyc sources -v
```

需关注的列：

- **`*`** — 当前选定的同步源。
- **`+`** — 其他可接受的源。
- **`-`** — 被选择算法拒绝的源。
- **`?`** — 连接状态存疑的源。

对于 `ntpd`，使用：

```bash
ntpq -p
```

### 验证跨节点时钟一致性

所有节点同步后，请验证集群中时钟是否一致。在每个节点上比较时间戳：

```bash
# 在每个节点上运行并比较输出
date -u '+%Y-%m-%d %H:%M:%S'
```

如需更精确的比较，可安装 `sshpass` 并运行：

```bash
for host in node1 node2 node3 node4; do
  echo -n "$host: "
  ssh "$host" date -u '+%Y-%m-%d %H:%M:%S.%N'
done
```

在配置良好的环境中，任意两个节点之间的差异应可忽略不计（低于 1 毫秒）。

## 容量规划

规划对象存储容量时，建议考虑：

- 初始数据量：计划一次迁移或存储多少数据？（例如 500 TB）
- 数据增长量：每日/每周/每月的数据增长容量
- 规划周期：本次硬件规划应覆盖多长时间？（建议：3 年）
- 公司的硬件迭代和更新周期。

部署前请查看 [EC 配置](../requirement/ec-configuration.md)，计算可用容量、了解自动校验默认值，并验证任何显式校验数或纠删集宽度。

## 磁盘规划

由于 NFS 在高 I/O 下会产生虚假写入和锁问题，**禁止使用 NFS** 作为 RustFS 的底层存储介质。强烈建议使用 **JBOD（Just a Bunch of Disks）**模式：将物理磁盘直接、独立地公开给操作系统，并由 RustFS 软件层处理数据冗余和保护。

原因如下：

- **性能更好：** RustFS 纠删码引擎经过高度优化，可并发读写多块磁盘，吞吐量高于硬件 RAID 控制器。硬件 RAID 会成为性能瓶颈。
- **成本更低：** 无需昂贵的 RAID 卡，降低硬件采购成本。
- **管理更简单：** RustFS 统一管理磁盘，简化存储层运维。
- **故障恢复更快：** RustFS 修复过程比传统 RAID 重建更快，对集群性能的影响也更小。

为了获得更高性能和吞吐量，建议使用 NVMe SSD 作为存储介质。

## 文件系统选择

RustFS 强烈建议使用 XFS 文件系统格式化所有存储磁盘。RustFS 的开发和测试基于 XFS，可确保最佳性能和稳定性。请避免使用 ext4、BTRFS 或 ZFS 等其他文件系统，因为它们可能导致性能下降或不可预测的问题。

XFS 适合 RustFS 工作负载，原因有三：

- **高并发 I/O：** XFS 专为高性能和扩展性而设计。其内部日志和数据结构（例如 B+ 树）可高效处理大量并行读写请求，与 RustFS 对大型对象进行分片并在纠删集中的多块磁盘上并行读写的方式相匹配。
- **海量文件和大型文件：** XFS 是支持超大文件（最大 8 EB）的 64 位文件系统。即使单个目录包含数百万个文件，其元数据管理仍保持高效；这一点很重要，因为 RustFS 将每个对象（或对象版本）存储为独立文件。
- **空间预留：** XFS 提供高效的 `fallocate` API。RustFS 使用它在写入对象前预留连续磁盘空间，避免写入期间动态扩展和更新元数据的开销，并尽量减少文件碎片。

为了更好地发现磁盘，建议在格式化 XFS 文件系统时使用 **Label** 标签。

首先检查磁盘布局：

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

格式化每块数据盘：

```bash
sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

格式化选项：

- `-L <label>`：为文件系统设置标签，便于识别和挂载。
- `-i size=512`：建议 inode 大小为 512 字节，有利于存储大量小对象（元数据）的场景。
- `-n ftype=1`：启用 ftype，使文件系统在目录结构中记录文件类型，从而改善 readdir 和 unlink 等操作。

挂载：

```bash
# write new line
vim /etc/fstab
LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0

#save & exit

# mount disk
sudo mount -a
```

## 配置服务用户

建议使用禁止登录的专用用户运行 RustFS。

1. **保留默认账户：** 服务单元中的默认用户和组为 `root` 和 `root`；使用它们时无需更改。
2. **使用专用账户：** 创建用户和组，然后相应地更新服务单元。

以下示例创建用户和组，并授予对 RustFS 数据目录的访问权限（可选）：

```bash
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

:::note

- 如果创建了 rustfs-user 用户和组，请将 `/etc/systemd/system/rustfs.service` 中的 `User` 和 `Group` 更改为 `rustfs-user`。
- 根据实际挂载目录调整 `/data/rustfs*`。

:::

## 下载安装包

首先安装 wget 或 curl，然后下载并安装 RustFS 二进制文件：

```bash
# Download address
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
unzip rustfs-linux-x86_64-musl-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

## 配置 systemd 服务

1. 创建 systemd 服务文件

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

该服务从 `/etc/default/rustfs` 读取 `RUSTFS_VOLUMES` 和其他设置。该文件因模式而异，部署模式页面提供了准确内容。

2. 重新加载服务配置

```bash
sudo systemctl daemon-reload
```

## 后续步骤

返回部署模式页面，配置环境文件并启动服务：

- [单节点单磁盘模式（SNSD）](./single-node-single-disk.md)
- [单节点多磁盘模式（SNMD）](./single-node-multiple-disk.md)
- [多节点多磁盘模式（MNMD）](./multiple-node-multiple-disk.md)