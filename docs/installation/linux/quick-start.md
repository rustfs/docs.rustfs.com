---
title: "Quick Start Guide for Linux"
description: "Quick deployment and installation in Linux environment using RustFS one-click installation package"
---

# Quick Start Guide for Linux

<a id="mode"></a>

## 1. Pre-Installation Reading

This page contains complete documentation and instructions for all three installation modes of RustFS. Among them, the multi-machine multi-disk mode includes enterprise-grade performance, security, and scalability. It also provides architecture diagrams needed for production workloads. Please read before installation, our startup modes and checklists are as follows:

1. Choose one of the following installation modes:

    - [Single Node Single Disk Mode (SNSD)](./single-node-single-disk.md)
    - [Single Node Multiple Disk Mode (SNMD)](./single-node-multiple-disk.md)
    - [Multiple Node Multiple Disk Mode (MNMD)](./multiple-node-multiple-disk.md)

2. [Pre-Installation Check](../checklists/index.md), ensure your system meets the production requirements. For non-production environments, you can skip this step.

## 2. Quick Installation

The quick installation script sets up the **Single Node Single Disk (SNSD)** mode. The script is as follows:

```bash
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
```

**Notes:**
- Default installation port is `9000`.
- Default installation path is `/data/rustfs0`. If you have independent disks, please mount them in advance.
- Ensure `unzip` is installed to ensure RustFS zip installation package can be extracted normally.

The quick installation script is available on GitHub at: https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh

## 3. Other Important Notes

1. Verify firewall settings.
2. Ensure NTP synchronization.
3. Determine current disk capacity and planning.
4. Confirm the operating system kernel version supports IO-Uring.
5. Check SELinux settings.
