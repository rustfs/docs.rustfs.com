---
title: "Docker"
description: "使用 Docker 和持久化容器存储运行单节点 RustFS 实例。"
---

使用官方 RustFS 镜像启动具有持久化存储的单节点实例。你需要可用的 Docker Engine，并拥有运行容器的权限。

## 1. 拉取镜像

```bash
docker pull rustfs/rustfs:latest
```

## 2. 创建持久化存储

创建命名卷，以便替换容器后对象数据仍然可用：

```bash
docker volume create rustfs-data
```

## 3. 启动 RustFS

运行容器前，请替换凭证占位符：

```bash
docker run -d \
  --name rustfs \
  --restart unless-stopped \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  rustfs/rustfs:latest \
  /data
```

:::warning[创建容器时设置凭证]

在将 RustFS 接入网络前，请设置唯一的 `RUSTFS_ACCESS_KEY` 和 `RUSTFS_SECRET_KEY` 环境变量。任一凭证都不要使用众所周知的 `rustfsadmin` 值。如果容器启动时未设置自定义凭证，请停止容器，并使用上面所示的两个 `-e` 选项重新创建；`rustfs-data` 卷会保持不变。

:::

## 4. 验证部署

检查容器和 S3 API 健康检查端点：

```bash
docker ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

S3 API 位于 `http://localhost:9000`，控制台位于 `http://localhost:9001`。

## 后续步骤

- [RustFS 控制台](/administration/console)
- [配置 S3 客户端](../../developer/examples/aws-cli.md)
- [TLS 配置](../../integration/tls-configured.md)