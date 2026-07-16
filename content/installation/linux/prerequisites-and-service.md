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

Multi-node consistency requires a time server to keep clocks consistent, otherwise services may fail to start. Use tools such as `ntp`, `timedatectl`, or `timesyncd`.

Check the synchronization status with:

```bash
timedatectl status
```

If the status is "synchronized", time synchronization is working properly.

## Capacity and EC Planning

When planning object storage capacity, we recommend considering:

- Initial data volume: How much data do you plan to migrate or store at once? (e.g., 500 TB)
- Data growth volume: Daily/weekly/monthly data growth capacity
- Planning cycle: How long should this hardware planning last? (recommended: 3 years)
- Your company's hardware iteration and update cycles.

EC (Erasure Coding) planning is as follows:

| Scenario | Recommended Parity Level | Description |
| - | - | - |
| Standard Production Environment | EC:4 | Can tolerate up to 4 disk (or node) failures, achieving a good balance between reliability and storage efficiency. |
| High Availability Requirements | EC:4 - 8 or higher | Suitable for scenarios with extremely high data availability requirements, but sacrifices more storage space. |
| Development Test Environment | EC:2 | Provides basic redundancy protection, suitable for non-critical business. |

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
StandardOutput=append:/var/logs/rustfs/rustfs.log
StandardError=append:/var/logs/rustfs/rustfs-err.log

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
