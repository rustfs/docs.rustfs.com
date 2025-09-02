---
title: "RustFS Multiple Node Multiple Disk Installation"
description: "Install RustFS on multiple servers with multiple disks, data will be stored on multiple disks across multiple servers."
---

# Multiple Node Multiple Disk (MNMD)

## 1. Pre-Installation Reading

This document covers RustFS multiple node multiple disk mode deployment, which is suitable for enterprise-grade performance, security, and scalability. It also provides architecture diagrams needed for production workloads. Please read before installation. Our startup modes and checklists are as follows:

1. Please clarify your three installation startup modes:

   - [Single Node Single Disk Mode (SNSD)](./single-node-single-disk.md)
   - [Single Node Multiple Disk Mode (SNMD)](./single-node-multiple-disk.md)
   - [Multiple Node Multiple Disk Mode (MNMD)](./multiple-node-multiple-disk.md) (current document)

2. [Pre-Installation Checklist](../checklists/index.md) to ensure all indicators meet production guidance characteristics. If production standards are not needed, this guidance can be skipped.

A minimum of **4 servers** is required, with each server needing at least 1 disk to safely start a distributed object storage cluster.

In the following architecture diagram, data is written to any server randomly through load balancing. Using the default 12 + 4 mode, a data block is split into 12 data blocks + 4 parity blocks by default, stored on different disks across different servers.

Any single server failure or maintenance will not affect data security.

Any data corruption within 4 disks will not affect data security.

<img src="./images/multiple-node-multiple-disk.jpg" alt="RustFS Multiple Node Multiple Disk Mode" />

## 2. Prerequisites

1. Operating system version
2. Firewall
3. Host aliases or domain name resolution
4. Memory requirements
5. Time synchronization
6. Capacity planning
7. Disk planning
8. File system planning

### 2.1. Operating System Version

We recommend Linux kernel version 4.x and above. Version 5.x/6.x can achieve better I/O throughput and network performance.

You can use Ubuntu 22.04 and RHEL8.x to install RustFS.

### 2.2. Firewall

Linux systems have firewalls enabled by default. You can use the following command to check firewall status:

```bash
systemctl status firewalld
```

If your firewall status is "active", you can use the following commands to disable the firewall:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Or allow RustFS port 9000:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```

All RustFS servers in the deployment **must** use the same listening port. If you use port 9000, all ports on other servers must also be port 9000.

### 2.3. Hostnames (Single Node Single Disk and Single Node Multiple Disk can skip this step)

> Single Node Single Disk and Single Node Multiple Disk do not set host aliases, please skip this step.

Creating a RustFS cluster requires **identical, sequential** hostnames. There are two ways to achieve sequential hostnames:

**1. DNS Configuration:**

Please configure your DNS resolution server to ensure name continuity.

**2. HOSTS Configuration:**

Modify the local alias settings in /etc/hosts as follows:

```bash
vim /etc/hosts
127.0.0.1 localhost localhost.localdomain localhost4 localhost4.localdomain4
::1 localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

### 2.4. Memory Requirements

RustFS requires at least 2 GB of memory to run in a test environment, and production environments require a minimum of 128 GB of memory.

### 2.5. Time Synchronization

Multi-node consistency must use time servers to maintain time consistency, otherwise services may not start. Related time servers include `ntp`, `timedatectl`, or `timesyncd`.

RustFS requires time synchronization. You can use the following command to check time synchronization status:

```bash
timedatectl status
```

If the status is "synchronized", it means time synchronization is normal.

### 2.6. Capacity and EC Planning

When planning object storage capacity, we recommend considering:

- Initial data volume: How much data do you plan to migrate or store at once? (e.g., 500 TB)
- Data growth volume: Daily/weekly/monthly data growth capacity
- Planning cycle: How long do you hope this hardware planning can support? (recommended: 3 years)
- Consider your company's hardware iteration and update cycles.

EC (Erasure Coding) planning is as follows:

| Scenario | Recommended Parity Level | Description |
| - | - | - |
| Standard Production Environment | EC:4 | Can tolerate up to 4 disk (or node) failures, achieving a good balance between reliability and storage efficiency. |
| High Availability Requirements | EC:4 - 8 or higher | Suitable for scenarios with extremely high data availability requirements, but sacrifices more storage space. |
| Development Test Environment | EC:2 | Provides basic redundancy protection, suitable for non-critical business. |

### 2.7. Disk Planning

Due to NFS generating phantom writes and lock issues under high I/O conditions, **NFS is prohibited** as the underlying storage medium when using RustFS. The official strongly recommends using **JBOD (Just a Bunch of Disks)** mode, which means simple disk bundling. This means exposing physical disks directly and independently to the operating system, with RustFS software layer responsible for data redundancy and protection.

The reasons are as follows:

- **Better Performance:** RustFS's Erasure Coding engine is highly optimized and can directly read and write multiple disks concurrently, achieving higher throughput than hardware RAID controllers. Hardware RAID becomes a performance bottleneck.
- **Lower Cost:** No expensive RAID cards needed, reducing hardware procurement costs.
- **Simpler Management:** RustFS uniformly manages disks, simplifying storage layer operations and maintenance.
- **Faster Fault Recovery:** RustFS healing process is faster than traditional RAID rebuild and has less impact on cluster performance.

The official recommendation is to use NVMe SSD as your storage medium on disks to ensure higher performance and throughput.

### 2.8. File System Selection

For disk file system formatting, RustFS officially strongly recommends using XFS file system on all disks used for storage. RustFS development and testing are based on XFS, ensuring optimal performance and stability. It is not recommended to use other file systems such as ext4, BTRFS, or ZFS, as they may cause performance degradation or unpredictable issues.

RustFS is an object storage system designed for high concurrency and high performance. When clients upload or download large objects, RustFS will shard them and read/write to multiple disks in the erasure set concurrently in parallel.

XFS advantages: XFS (eXtents File System) was designed from the beginning for high performance and scalability. It performs extremely well in large file processing and high-concurrency I/O scenarios. Its internal journaling and data structures (such as B+ trees) can efficiently handle large numbers of parallel read/write requests, which perfectly matches RustFS's working mode. In comparison, although file systems like ext4 have made great performance improvements in recent years, when facing extreme concurrent loads, XFS usually provides more stable and superior throughput.

Object storage typically needs to handle massive numbers of files and huge individual files (TB level). XFS is a 64-bit file system that can support extremely large file sizes (up to 8 EB) and file system scale. Its metadata management is very efficient, and even with millions of files in a single directory, its performance degradation is much less than other file systems. This is crucial for RustFS's approach of storing each object (or version of an object) as an independent file on the backend file system.

When RustFS writes new objects or object versions, to ensure write performance and reduce file fragmentation, it performs space reservation. XFS provides an efficient API called fallocate that allows applications to reserve a contiguous block of disk space. RustFS leverages this feature to allocate the required space for files before writing them, avoiding performance overhead from dynamic expansion and metadata updates during the write process, while also minimizing file fragmentation to the greatest extent, ensuring subsequent read performance.

For better disk discovery, when formatting XFS file systems, we recommend using **Label** tags to mark disks.

First, you need to check the disk system situation:

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

The specific formatting command is as follows:

```bash
sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

We can add some recommended options during formatting to optimize performance:
- -L \<label\>: Set a label for the file system, convenient for subsequent identification and mounting.
- -i size=512: RustFS officially recommends setting inode size to 512 bytes, which has performance advantages for scenarios storing large numbers of small objects (metadata).
- -n ftype=1: Enable ftype functionality. This allows the file system to record file types in the directory structure, which can improve performance of operations like readdir and unlink, very beneficial for RustFS.

Mounting:

```bash
# write new line
vim /etc/fstab
LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0

#save & exit

# mount disk
sudo mount -a 
```

## 3. Configure Username

For RustFS startup, we recommend configuring a dedicated user without login permissions to start RustFS services. In the rustfs.service startup control script.

1. **Do not modify default startup account:** The default user and group are `root` and `root`. If you want to use the default `root` and `root`, no modification is needed.
2. **Modify default startup account:** You can use the groupadd and useradd commands to create users and groups, then modify the username and password in the systemctl startup configuration file after adding.

The following example shows creating users, groups, and setting permissions to access RustFS-specified data directories (optional):

```bash
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

Note:
- If rustfs-user user and group are created, you need to change User and Group in `/etc/systemd/system/rustfs.service` to `rustfs-user`
- Adjust `/data/rustfs*` to the specified mount directory.

## 4. Download Installation Package

Please first install wget or curl to download the rustfs installation package.

```bash
# Download address
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
unzip rustfs-linux-x86_64-musl-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

## 5. Configure Environment Variables

1. Create configuration file

```bash
# Multiple node multiple disk mode
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ENABLE=true
RUST_LOG=error
RUSTFS_OBS_LOG_DIRECTORY="/var/logs/rustfs/"
EOF
```

2. Create storage directories

```bash
sudo mkdir -p /data/rustfs{0..3} /var/logs/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/logs/rustfs
```

## 6. Configure System Service

1. Create systemd service file

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

TimeoutStartSec=30s
TimeoutStopSec=30s

NoNewPrivileges=true
ProtectSystem=full
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
StandardOutput=append:/var/logs/rustfs/rustfs.log
StandardError=append:/var/logs/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

2. Reload service configuration

```bash
sudo systemctl daemon-reload
```

## 7. Start Service and Verification

1. Start service and set auto-start

```bash
sudo systemctl enable --now rustfs
```

2. Verify service status

```bash
systemctl status rustfs
```

3. Check service port

```bash
netstat -ntpl
```

4. View log files

```bash
tail -f /var/logs/rustfs/rustfs*.log
```

5. Access console

Enter the server's IP address and port to try accessing the console. The interface you see is as follows:

![Console](./images/console.jpg)
