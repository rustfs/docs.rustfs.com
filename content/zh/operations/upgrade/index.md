---
title: "升级"
description: "在保持集群可用性的同时规划并执行 RustFS 升级。"
---

选择与 RustFS 部署方式相匹配的升级工作流程。对于多节点集群，请一次替换一个节点或 Pod，并等待其报告就绪后再继续。

## 部署方式

- [二进制升级](./binary/index.md)介绍由 systemd 管理的可执行文件替换和回滚。
- [容器升级](./container/index.md)介绍使用持久化数据卷替换镜像。
- [Kubernetes 升级](./kubernetes/index.md)介绍由 Helm 和 Operator 管理的工作负载。

执行任何升级之前，请阅读目标版本的发行说明并确认集群健康。