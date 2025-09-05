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

 * 确保宿主机 9000 端口对外开放（或自定义端口一致）
3. **配置文件准备**

 * 在宿主机 `/etc/rustfs/config.toml` 中，定义监听端口、管理员账号、数据路径等（详见第四节）

---

## 二、快速拉取 RustFS 官方镜像

使用官方 Ubuntu 基础镜像，快速拉取 RustFS 官方镜像：


```bash
docker pull rustfs/rustfs

```

---


## 三、运行 RustFS 容器

RustFS SNSD Docker 运行方式，结合上述镜像与配置，执行：

```bash
 docker run -d \
  --name rustfs_local \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  rustfs/rustfs:latest \
  /data
```

各参数说明：

* `-p 9000:9000`：映射宿主机 9000 端口到容器
* `-v /mnt/rustfs/data:/data`：挂载数据卷
* `--name rustfs_local`：容器自定义名称
* `-d`：后台运行

---

### 完整参数配置示例

```bash
docker run -d \
  --name rustfs_container \
  -p 9000:9000 \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY=rustfsadmin \
  -e RUSTFS_SECRET_KEY=rustfsadmin \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_SERVER_DOMAINS=example.com \
  rustfs/rustfs:latest \
  --address :9000 \
  --console-enable \
  --server-domains example.com \
  --access-key rustfsadmin \
  --secret-key rustfsadmin \
  /data
```

### 参数说明与对应方法

1. **环境变量方式** (推荐):
   ```bash
   -e RUSTFS_ADDRESS=:9000 \
   -e RUSTFS_SERVER_DOMAINS=example.com \
   -e RUSTFS_ACCESS_KEY=rustfsadmin \
   -e RUSTFS_SECRET_KEY=rustfsadmin \
   -e RUSTFS_CONSOLE_ENABLE=true \
   ```

2. **命令行参数方式**:
   ```
   --address :9000 \
   --server-domains example.com \
   --access-key rustfsadmin \
   --secret-key rustfsadmin \
   --console-enable \
   ```

3. **必需参数**:
    - `<VOLUMES>`: 在命令最后指定，如 `/data`

### 常用配置组合

1. **基础配置**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     rustfs/rustfs:latest \
     /data
   ```

2. **启用控制台**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_CONSOLE_ENABLE=true \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --console-enable \
     /data
   ```

3. **自定义认证密钥**:
   ```bash
   docker run -d \
     -p 9000:9000 \
     -v /mnt/data:/data \
     -e RUSTFS_ACCESS_KEY=rustfsadmin \
     -e RUSTFS_SECRET_KEY=rustfsadmin \
     rustfs/rustfs:latest \
     ./target/debug/rustfs \
     --access-key rustfsadmin \
     --secret-key rustfsadmin \
     /data
   ```

### 注意事项

1. 端口映射要对应：
    - 服务端口默认 9000 (`-p 9000:9000`)

2. 数据卷要持久化：
    - `-v /host/path:/container/path`

3. 环境变量和命令行参数可以混合使用，但命令行参数优先级更高

4. 如果[使用 TLS](../../integration/tls-configured.md)，需要额外挂载证书路径：

   ```bash
   -v /path/to/certs:/certs \
   -e RUSTFS_TLS_PATH=/certs \
   ```

## 四、验证与访问

1. **查看容器状态与日志：**

 ```bash
 docker logs rustfs_local
 ```

 日志应显示服务启动成功，并监听 9000 端口。

2. **测试 S3 API：**

 使用 `mc` 或其他 S3 客户端：

 ```bash
 mc alias set rustfs http://localhost:9000 rustfsadmin ChangeMe123!
 mc mb rustfs/mybucket
 mc ls rustfs
 ```

 如能成功创建并列举 bucket，则部署生效。


## 五、其他建议

1. 生产环境建议：
- 使用多节点部署架构
- [启用 TLS 加密通信](../../integration/tls-configured.md)
- 配置日志轮转策略
- 设置定期备份策略

2. 存储建议：
- 使用本地 SSD/NVMe 存储
- 避免使用网络文件系统 (NFS)
- 保证存储目录独占访问

---

## 小结

本文结合 RustFS 单节点单盘容器化最佳实践，详细演示了如何通过 Docker 自行构建 RustFS 镜像并部署 SNSD 环境。
该方案易于快速启动与试验，后续可在 Kubernetes、Swarm 等平台上采用同样思路扩展为多节点多盘生产级集群。
