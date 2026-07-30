---
title: "安装"
description: "根据本地试用、单节点或多节点生产环境、容器及 Kubernetes 场景选择合适的 RustFS 部署方式。"
---

RustFS 是使用 Rust 编写并采用 Apache 2.0 许可证发布的分布式对象存储系统。它可在 Linux、Windows、macOS、FreeBSD 和容器中运行，支持 x86、ARM、RISC-V 等 CPU 架构。

:::warning[立即更改默认凭证]

安装后，在将 RustFS 接入网络前，请为 `RUSTFS_ACCESS_KEY` 和 `RUSTFS_SECRET_KEY` 设置唯一值。任一凭证都不要使用众所周知的 `rustfsadmin` 值。

- 对于 Linux 二进制文件或 systemd 安装，请在 `/etc/default/rustfs` 中设置这两个值，然后重启 `rustfs` 服务。
- 对于 Docker、Podman 或 Docker Compose，请在创建容器时将这两个值作为容器环境变量传入。如果现有容器启动时未设置这些值，请重新创建该容器。

:::

## 选择部署方式

| 目标 | 推荐方式 | 指南 |
| - | - | - |
| 在本地计算机上试用 RustFS | 一键安装脚本或容器 | [Linux 快速入门](./linux/quick-start.md) · [容器](./container/index.mdx) |
| 单服务器生产环境 | SNSD（单磁盘）或 SNMD（多磁盘） | [在 Linux 上安装 RustFS](./linux/index.md) |
| 多服务器生产集群 | 完成生产检查清单后使用 MNMD | [多节点多磁盘](./linux/multiple-node-multiple-disk.md) · [检查清单](./requirement/checklists/index.md) |
| Kubernetes/云原生 | 容器编排部署 | [云原生](./cloud-native/index.md) |
| Windows 或 macOS 主机 | 原生安装 | [Windows](./windows/index.md) · [macOS](./macos/index.md) |

## 部署模式对比

| 模式 | 节点 | 磁盘 | 容错能力 | 典型用途 |
| - | - | - | - | - |
| [SNSD](./linux/single-node-single-disk.md) | 1 | 1 | 无，需依赖备份 | 开发、测试和低密度非关键业务 |
| [SNMD](./linux/single-node-multiple-disk.md) | 1 | 多块 | 节点内最多容忍 M 块校验盘故障 | 单台服务器上的中等规模非关键业务 |
| [MNMD](./linux/multiple-node-multiple-disk.md) | 4+ | 每节点多块 | 通过跨服务器纠删码实现磁盘级和节点级容错 | 生产工作负载 |

## 检查清单

部署任何生产环境前，请完成[安装前检查清单](./requirement/checklists/index.md)，检查硬件、网络、软件和安全性，确保环境符合生产指导要求。