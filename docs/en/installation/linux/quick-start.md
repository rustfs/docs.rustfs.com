---
title: "Quick RustFS Installation on Linux"
description: "Quick deployment and installation in Linux environment using RustFS one-click installation package"
---

# Quick RustFS Installation on Linux

<a id="mode"></a>

## 1. Pre-Installation Reading

This page contains complete documentation and instructions for all three installation modes of RustFS. Among them, the multi-machine multi-disk mode includes enterprise-grade performance, security, and scalability. It also provides architecture diagrams needed for production workloads. Please read before installation, our startup modes and checklists are as follows:

1. Please clarify your three installation startup modes:

    - [Single Node Single Disk Mode (SNSD)](./single-node-single-disk.md)
    - [Single Node Multiple Disk Mode (SNMD)](./single-node-multiple-disk.md)
    - [Multiple Node Multiple Disk Mode (MNMD)](./multiple-node-multiple-disk.md)

2. [Pre-Installation Check](../checklists/index.md), ensure all indicators meet production guidance characteristics. If production standards are not needed, this guidance can be skipped;

## 2. Quick Installation

Using the quick installation script implements **SNSD (Single Node Single Disk)** mode quick installation. The script is as follows:

```bash
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
```

Notes:
1. Default installation port is `9000`;
2. Default installation path is `/data/rustfs0`. If you have independent disks, please mount them in advance;
3. Please install `unzip` in advance to ensure RustFS zip installation package can be extracted normally.

The GitHub address for quick installation is: https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh

## 3. Other Important Notes

1. Please check if firewall is enabled;
2. Please ensure NTP time server consistency;
3. Please determine current disk capacity and disk planning;
4. Please confirm operating system kernel version to support IO-Uring;
5. Please check SELinux.
