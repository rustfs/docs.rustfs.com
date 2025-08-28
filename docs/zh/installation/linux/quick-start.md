---
title: "Linux快速安装 RustFS"
description: "使用RustFS一键安装包快速进行Linux环境下的部署安装"
---

# Linux 快速 RustFS

<a id="mode"></a>

## 一、安装前必读

本页面包含了 RustFS 的三种安装模式的全部文档和说明。其中，多机多盘的模式包含了企业级可用的性能、安全性和扩展性。并且，提供了生产工作负载需要的架构图。请装前请阅读，我们的启动模式与检查清单，如下：

1. 请明确您的三种安装启用模式：

    - [单机单盘模式（SNSD）](./single-node-single-disk.md)
    - [单机多盘模式（SNMD）](./single-node-multiple-disk.md)
    - [多机多盘模式（MNMD）](./multiple-node-multiple-disk.md)

2. [安装前检查](../checklists/index.md)，确保各项指标符合生产指导特征，若不需要生产标准可不阅读此指导；


## 二、快速安装

使用快速安装脚本，实现的是 **SNSD(单机单盘)** 模式快速安装，脚本如下：

~~~
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
~~~


备注：
1. 安装默认端口为 `9000` 端口；
2. 安装默认路径为 `/data/rustfs0` ， 若有独立磁盘请提前挂载；
3. 请提前安装 `unzip` ，以保障RustFS zip 安装包可以正常解压。


快速安装的的GitHub地址为：https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh



## 三、其他注意事项

1. 请检查防火墙是否开启；
2. 请确定NTP 时间服务器的一致性；
3. 请确定当前磁盘的容量和磁盘规划；
4. 请确认操作系统的内核版本以支持IO-Uring；
5. 请检查SELinux。


