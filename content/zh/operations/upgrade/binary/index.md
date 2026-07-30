---
title: "二进制升级"
description: "逐个节点升级 RustFS 二进制部署，同时保持集群可用性。"
---

使用滚动升级逐个节点替换 RustFS 可执行文件，无需让整个集群离线。开始之前，请阅读目标版本的发行说明并确认每个节点均健康。

## 升级前准备

检查每个节点的就绪状态：

```bash
curl -fsS http://<node-hostname>:9000/health/ready
```

备份服务配置，并保留当前运行的可执行文件以便回滚：

```bash
sudo cp /etc/default/rustfs /etc/default/rustfs.bak
sudo cp /usr/local/bin/rustfs /usr/local/bin/rustfs.previous
```

## 逐个节点升级

一次升级一个节点。在重启的节点报告就绪之前，请勿继续。

```bash
sudo systemctl stop rustfs
sudo cp rustfs-new /usr/local/bin/rustfs
sudo chmod +x /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

对其余每个节点重复此过程。

## 回滚

如果新版本未通过验证，请逐个节点恢复以前的可执行文件，并在继续之前等待节点就绪：

```bash
sudo systemctl stop rustfs
sudo cp /usr/local/bin/rustfs.previous /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

## 后续步骤

查看[状态检查](/operations/status-check)，了解其他升级后验证方法。