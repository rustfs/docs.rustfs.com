---
title: "容器升级"
description: "升级通过 Docker、Podman 或 Docker Compose 启动的 RustFS 容器，同时保留持久化数据。"
---

通过使用较新的镜像重新创建 RustFS 容器来升级容器部署。请选择与原始安装方式相匹配的工作流程：通过 Docker 或 Podman 直接启动的容器，或者由 Docker Compose 管理的服务。

## 升级前准备

阅读目标版本的发行说明，并使用明确的镜像标签进行升级。记录当前镜像，并保留原始 `docker run`、`podman run` 或 Compose 配置，因为重新创建容器不会自动复制其运行时选项。

替换 RustFS 前，确认其处于健康状态：

```bash
curl -fsS http://localhost:9000/health/ready
```

:::warning[保留持久化存储]

请勿删除挂载到 `/data` 的命名卷或主机目录。`docker compose down -v`、`docker volume rm` 和 `podman volume rm` 等命令会删除持久化存储，不属于升级流程。

:::

## 升级 Docker 容器

以下工作流程使用 [Docker 安装指南](/installation/container/docker)中的容器名称和命名卷。如果部署使用不同的端口、环境变量、挂载或启动参数，请在替换命令中保持这些设置不变。

记录当前镜像，然后拉取目标版本：

```bash
docker inspect --format '{{.Config.Image}}' rustfs
docker pull rustfs/rustfs:<target-version>
```

仅停止并删除容器。`rustfs-data` 卷会保持不变：

```bash
docker stop rustfs
docker rm rustfs
```

使用原始配置和目标镜像重新创建容器：

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
	rustfs/rustfs:<target-version> \
	/data
```

等待替换容器进入健康状态：

```bash
docker ps --filter name=rustfs
docker logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## 升级 Podman 容器

Podman 工作流程执行相同的替换操作，并使用 [Podman 安装指南](/installation/container/podman)中的镜像名称。

```bash
podman inspect --format '{{.Config.Image}}' rustfs
podman pull docker.io/rustfs/rustfs:<target-version>
podman stop rustfs
podman rm rustfs
```

使用原始配置和持久化卷重新创建容器：

```bash
podman run -d \
	--name rustfs \
	-p 9000:9000 \
	-p 9001:9001 \
	-v rustfs-data:/data \
	-e RUSTFS_ACCESS_KEY="<your-access-key>" \
	-e RUSTFS_SECRET_KEY="<your-secret-key>" \
	-e RUSTFS_CONSOLE_ENABLE=true \
	docker.io/rustfs/rustfs:<target-version> \
	/data
```

继续之前验证替换结果：

```bash
podman ps --filter name=rustfs
podman logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## 使用 Docker Compose 升级

在包含部署 `docker-compose.yml` 的目录中运行 Compose 命令。升级前，保存完整解析后的配置并确认当前镜像：

```bash
docker compose config > docker-compose.resolved.yaml
docker compose images rustfs
```

将 `rustfs` 服务更改为明确的目标镜像标签，同时保持其卷、环境变量、端口和命令不变：

```yaml title="docker-compose.yml"
services:
	rustfs:
		image: rustfs/rustfs:<target-version>
```

验证文件，拉取目标镜像，并仅重新创建 RustFS 服务。`--no-deps` 会让可选的可观测性服务继续运行：

```bash
docker compose config --quiet
docker compose pull rustfs
docker compose up -d --no-deps rustfs
```

检查服务和 RustFS 就绪端点：

```bash
docker compose ps rustfs
docker compose logs --tail=100 rustfs
curl -fsS http://localhost:9000/health/ready
```

如果 RustFS 与 `observability` profile 一起启动，RustFS 服务仍使用相同的命令升级。请根据各组件的发行说明分别升级可观测性镜像。

## 升级多节点部署

一次替换一个 RustFS 节点。等待已升级节点的就绪端点成功，并确认集群状态后，再继续下一个节点。请勿同时重新创建所有节点。

在每个节点上使用相同的 Docker、Podman 或 Compose 工作流程，并保留该节点现有的挂载和配置。

## 回滚

对于 Docker 或 Podman，请停止并删除失败的替换容器，然后使用之前记录的镜像标签重复相应的 `run` 命令。保持相同的持久化卷和运行时配置。

对于 Docker Compose，请恢复 `docker-compose.yml` 中先前的 `image` 值，然后重新创建 RustFS 服务：

```bash
docker compose pull rustfs
docker compose up -d --no-deps rustfs
curl -fsS http://localhost:9000/health/ready
```

在多节点部署中，请一次回滚一个节点，并等待其就绪后再继续。

## 后续步骤

查看[状态检查](/operations/status-check)，了解其他升级后验证方法。