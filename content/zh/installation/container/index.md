---
title: "容器"
description: "使用 Docker 或 Podman 运行官方 RustFS 容器镜像。"
---

RustFS 是高性能、兼容 S3 的开源分布式对象存储系统。在单节点单磁盘（SNSD）部署模式下，后端使用零纠删码，不提供额外数据冗余，适合本地测试和小规模场景。官方 RustFS 镜像将 RustFS 二进制及其运行环境打包到容器中，一条命令即可启动带持久化存储的服务。

容器以非 root 用户 `rustfs`（ID `10001`）运行，因此绑定挂载的主机目录必须由 `10001` 所有，否则会遇到权限拒绝错误。

## 容器运行时

- [Docker](./docker.md)：运行带持久化存储的单节点实例，并可扩展 Docker Compose、TLS 和多节点网络。
- [Podman](./podman.md)：以无守护进程的方式运行同一镜像。

:::note[目录权限]

如果使用 `-v` 将主机目录挂载到容器，请确保主机目录的所有者为 `10001`：

```bash
chown -R 10001:10001 /path/to/host_directory
```

:::

如需在 Kubernetes 中部署，请参阅 [Helm Chart](/installation/cloud-native/helm-chart) 或 [Operator](/installation/cloud-native/operator)。
