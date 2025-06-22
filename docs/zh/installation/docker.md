---
title: "Docker 安装 RustFS"
description: "RustFS Docker 部署。"
---

# Docker 安装 RustFS





RustFS 是一款高性能、100% 兼容 S3 的开源分布式对象存储系统。单节点单盘（SNSD）部署模式下，后端采用零纠删校验，不提供额外的数据冗余，适合本地测试与小规模场景。
本文以 RustFS 官方 Linux 二进制包为基础，通过自定义 Dockerfile ，将 RustFS 及其运行时环境打包进容器，并配置数据卷与环境变量，即可一键启动服务。

---

## 一、前置准备

1. **主机要求**

 * 已安装 Docker（≥ 20.10）并能正常拉取镜像与运行容器
 * 本地路径 `/mnt/rustfs/data`（或自定义路径）用于挂载对象数据
2. **网络与防火墙**

 * 确保宿主机 7000 端口对外开放（或自定义端口一致）
3. **配置文件准备**

 * 在宿主机 `/etc/rustfs/config.toml` 中，定义监听端口、管理员账号、数据路径等（详见第四节）

---

## 二、快速拉取 RustFS 官方镜像

使用官方 Ubuntu 基础镜像，快束拉取 RustFS 官方镜像：

```bash
podman pull quay.io/rustfs/rustfs
```

或者使用 docker 拉取：
```bash
podman pull docker://rustfs/rustfs

```

---

## 三、编写环境配置

在宿主机创建配置文件 `/etc/rustfs/config.toml`，示例内容：

```bash
RUSTFS_ROOT_USER=rustfsadmin
RUSTFS_ROOT_PASSWORD=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs{0...3}"
RUSTFS_ADDRESS=":7000"
#RUSTFS_SERVER_DOMAINS="play.rustfs.com:7000"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_CONSOLE_ADDRESS=":7001"
RUSTFS_OBS_CONFIG="/etc/default/obs.toml"
RUSTFS_TLS_PATH="/opt/tls"
```

> **说明：** 配置项格式及默认值请参见官方 Linux 安装文档。

---

## 四、运行 RustFS 容器

RustFS SNSD Docker 运行方式，结合上述镜像与配置，执行：

```bash
podman run -d \
 --name rustfs_local \
 -p 7000:7000 \
 -v /mnt/rustfs/data:/data \
 -v /etc/rustfs/rustfs:/config/rustfs:ro \
 rustfs/rustfs:latest
```

各参数说明：

* `-p 7000:7000`：映射宿主机 7000 端口到容器
* `-v /mnt/rustfs/data:/data`：挂载数据卷
* `-v /etc/rustfs/rustfs:/config/rustfs:ro`：挂载配置文件
* `--name rustfs_local`：容器自定义名称
* `-d`： 后台运行

---

## 五、验证与访问

1. **查看容器状态与日志：**

 ```bash
 docker logs rustfs_local
 ```

 日志应显示服务启动成功，并监听 7000 端口。

2. **测试 S3 API：**

 使用 `mc` 或其他 S3 客户端：

 ```bash
 mc alias set rustfs http://localhost:7000 rustfsadmin ChangeMe123!
 mc mb rustfs/mybucket
 mc ls rustfs
 ```

 如能成功创建并列举 bucket，则部署生效。


## 六、其他建议

1. 生产环境建议：
- 使用多节点部署架构
- 启用 TLS 加密通信
- 配置日志轮转策略
- 设置定期备份策略

2. 存储建议：
- 使用本地 SSD/NVMe 存储
- 避免使用网络文件系统(NFS)
- 保证存储目录独占访问

---

## 小结

本文结合 RustFS 单节点单盘容器化最佳实践，详细演示了如何通过 Docker 自行构建 RustFS 镜像并部署 SNSD 环境。
该方案易于快速启动与试验，后续可在 Kubernetes、Swarm 等平台上采用同样思路扩展为多节点多盘生产级集群。