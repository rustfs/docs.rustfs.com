---
title: RustFS 单机单盘安装
description: 在单台服务器的单个磁盘上安装 RustFS, 数据将存储在这一个磁盘上.
---

# 单机单盘模式（SNSD， Single Node Single Disk）

> 适用于低密度非关键业务，在生产环境建议经验进行数据备份，避免出现风险。

1 台服务器中只有一个数据盘，所有的数据全部落入这一个数据盘中。

具体架构图如下：

<img src="./images/single-node-single-disk.jpg" alt="RustFS Single Node Single Disk Mode" />
