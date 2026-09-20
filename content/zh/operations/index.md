---
title: "运维与可观测性"
description: "运维、监控、扩展、升级 RustFS 部署并排查问题。"
---

使用本节通过升级、扩展、可用性规划、监控和事件响应来保持 RustFS 部署健康运行。

## 运维领域

- [升级](./upgrade/index.md)介绍二进制、容器和 Kubernetes 升级。
- [扩展](./scaling/index.md)介绍存储扩容、数据再均衡和存储池退役。
- [高可用](./high-availability/index.md)介绍节点修复和站点复制。
- [集群生命周期运维](./cluster-lifecycle.md)在一份运行手册中涵盖布局边界、法定数量、扩容、数据再平衡、退役、修复与重启。
- [可观测性](./observability.md)介绍指标、日志、追踪、监控集成和告警信号。
- [状态检查](./status-check.md)介绍网络端口、健康探针、集群状态和存储容量检查。
- [事件通知](./event-notifications.md)介绍存储桶事件目标。