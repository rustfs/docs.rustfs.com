---
title: "在 Linux 上安装 RustFS"
description: "选择 SNSD、SNMD 或 MNMD Linux 部署模式，并在一台或多台服务器上安装 RustFS。"
---

本节介绍如何在 Linux 服务器上安装 RustFS。如需使用一条命令试用，请参阅[快速入门](./quick-start.md)。如需手动安装，请从以下三种部署模式中选择。三种模式使用相同的[前提条件和服务设置](./prerequisites-and-service.md)，区别仅在于拓扑和卷配置。

:::warning[立即更改默认凭证]

安装后，请在 `/etc/default/rustfs` 中为 `RUSTFS_ACCESS_KEY` 和 `RUSTFS_SECRET_KEY` 设置唯一值。任一凭证都不要使用众所周知的 `rustfsadmin` 值。更改文件后，运行 `sudo systemctl restart rustfs` 重启服务。

:::

## 单节点单磁盘（SNSD）

一台服务器、一块数据盘。这是最简单的模式，不提供冗余。磁盘故障会导致数据丢失，因此请依赖备份。适用于开发、测试和低密度的非关键业务。

→ [单节点单磁盘安装](./single-node-single-disk.md)

## 单节点多磁盘（SNMD）

一台服务器、多块数据盘。纠删码将数据分片到不同磁盘，因此节点可以容忍有限数量的磁盘故障，但整台服务器故障仍会导致数据丢失。适用于在单台服务器上运行的中等规模非关键业务。

→ [单节点多磁盘安装](./single-node-multiple-disk.md)

## 多节点多磁盘（MNMD）

四台或更多服务器，每台服务器配备一块或多块磁盘。纠删码跨服务器分布，可提供磁盘级和节点级容错能力以及水平扩展能力。这是生产工作负载应使用的模式。

→ [多节点多磁盘安装](./multiple-node-multiple-disk.md)

## 投入生产前

部署到生产环境前，请完成[安装前检查清单](../requirement/checklists/index.md)，检查硬件、网络、软件和安全性。如果不需要满足生产标准，可以跳过这些检查。