---
title: "RustFS traefik 反向代理配置指南"
description: "使用 traefik 作为 RustFS 的反向代理，实现服务发现和负载均衡。"
---

# 关于 traefki

[traefik](https://doc.traefik.io/) 是一个开源的云原生应用程序代理，具有服务发现、请求路由以及负载均衡等功能。

## traefik 与 RustFS 集成

traefik 和 RustFS 都支持 docker 安装，因此使用 `docker label` 的方式来让 traefik 将流量转发到 RustFS 容器。涉及到 traefik 和 RustFS 两部分配置。

### traefik 配置

需要在 traefik 中开启 `docker` provider，以告知 traefik 通过 `docker lable` 的方式来捕获要进行流量转发的服务。配置如下：

```
- --providers.docker=true
- --providers.docker.endpoint=unix:///var/run/docker.sock
- --providers.docker.exposedbydefault=false
```

开启 traefik 监听端口：

```
- --entrypoints.web.address=:80
- --entrypoints.websecure.address=:443
```

> 其中 80 对应 http，443 对应 https。

如果要为应用配置 https 访问，还需要设置证书相关配置，以 [Let's Encrypt](https://letsencrypt.org/)为例，需要开启以下配置：

```
- --certificatesresolvers.le.acme.email=your@email.com
- --certificatesresolvers.le.acme.storage=/etc/traefik/acme.json
- --entrypoints.web.http.redirections.entrypoint.to=websecure
- --entrypoints.web.http.redirections.entrypoint.scheme=https
- --certificatesresolvers.le.acme.httpchallenge=true
- --certificatesresolvers.le.acme.httpchallenge.entrypoint=web
```

开启端口映射：

```
- "80:80"
- "443:443"
- "8080:8080"  # Traefik Dashboard
```

### RustFS 配置

在 RustFS 的容器配置中，通过 `label` 来设置如下参数：

```
# 告诉 traefik 启用对 RustFS 容器的路由和服务发现。如果缺少此标签，traefik 将忽略该容器上的所有其他 traefik 标签。
- "traefik.enable=true"
# 定义了一个名为 rustfs 的 路由器。rule=Host(...) 指定了 traefik 应该将所有发往 your.rustfs.com 这个域名的 HTTP/HTTPS 请求路由给该路由器处理。
- "traefik.http.routers.rustfs.rule=Host(`your.rustfs.com`)"
# 指定该路由器应该监听哪个或哪些 EntryPoints（入口点）。websecure 对应您在静态配置中定义的 443 端口，意味着该路由只处理 HTTPS 流量。
- "traefik.http.routers.rustfs.entrypoints=websecure"
# 告诉该路由器使用名为 le 的证书解析器（即您之前配置的 Let's Encrypt / ACME 解析器）来自动为 your.rustfs.com 获取和管理 SSL/TLS 证书。
- "traefik.http.routers.rustfs.tls.certresolver=le"
# 定义了一个名为 rustfs 的 服务。该服务指定了流量的最终目的地是 Docker 网络内部 rustfs 容器的 9001 端口。
- "traefik.http.services.rustfs.loadbalancer.server.port=9001"
# 显式启用该路由器上的 TLS（传输层安全协议）。这是激活 HTTPS 的必要步骤。结合 certresolver=le，意味着使用 Let's Encrypt 证书进行加密连接。
- "traefik.http.routers.rustfs.tls=true"
```

### 测试验证

将 traefik 和 RustFS 内容写入一个 `docker-compose.yml` 文件，内容如下：

```
services:
  traefik:
    image: traefik:v3.5.4
    container_name: traefik
    command:
      - --log.level=DEBUG
      - --accesslog=true
      - --api.insecure=true              # 可选: 启用 Traefik Web UI（调试用）
      - --providers.docker=true
      - --providers.docker.endpoint=unix:///var/run/docker.sock
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --providers.docker.network=rustfs
      - --certificatesresolvers.le.acme.email=devops008@sina.com
      - --certificatesresolvers.le.acme.storage=/etc/traefik/acme.json
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --certificatesresolvers.le.acme.httpchallenge=true
      - --certificatesresolvers.le.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
      - "8443:8443"
      - "8080:8080"  # Traefik Dashboard (http://localhost:8080)
    labels:
      - "traefik.enable=true"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/etc/traefik/acme.json
        #      - ./traefik.yml:/etc/traefik/traefik.yml
    networks:
      - rustfs

  rustfs:
    image: rustfs/rustfs:1.0.0-alpha.66
    container_name: rustfs-traefik
    hostname: rustfs
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.rustfs.rule=Host(`your.rustfs.com`)"
      - "traefik.http.routers.rustfs.entrypoints=websecure"
      - "traefik.http.routers.rustfs.tls.certresolver=le"
      - "traefik.http.services.rustfs.loadbalancer.server.port=9001"
      - "traefik.http.routers.rustfs.tls=true"
      - "traefik.http.routers.rustfs.priority=100"
    environment:
      # Use service names and correct disk indexing (1..4 to match mounted paths)
      - RUSTFS_VOLUMES=/data
      - RUSTFS_ADDRESS=0.0.0.0:9000
      - RUSTFS_CONSOLE_ENABLE=true
      - RUSTFS_CONSOLE_ADDRESS=0.0.0.0:9001
      - RUSTFS_ACCESS_KEY=rustfsadmin
      - RUSTFS_SECRET_KEY=rustfsadmin
      - RUSTFS_CMD=rustfs
    ports:
      - "9000:9000"  # API endpoint
      - "9001:9001"  # Console
    volumes:
      - data:/data
        #command: ["sh", "-c", "sleep 3 && rustfs"]
    healthcheck:
      test:
        [
        "CMD",
        "sh", "-c",
        "curl -f http://localhost:9000/health && curl -f http://localhost:9001/health"
        ]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s
    networks:
      - rustfs

networks:
  rustfs:
    driver: bridge
    name: rustfs

volumes:
  data:
    driver: local
```

创建一个用于存储 let's encrypt 证书的文件 acme.json，**并确保权限是 600**，和 `docker-compose.yml` 位于同目录：

```
touch acme.json
chmod 600 acme.json
```

执行命令：

```
docker compose up -d
```

查看结果：

```
docker compose ps
NAME             IMAGE                          COMMAND                  SERVICE   CREATED          STATUS                    PORTS
rustfs-traefik   rustfs/rustfs:1.0.0-alpha.66   "/entrypoint.sh rust…"   rustfs    46 minutes ago   Up 46 minutes (healthy)   0.0.0.0:9000-9001->9000-9001/tcp, [::]:9000-9001->9000-9001/tcp
traefik          traefik:v3.5.4                 "/entrypoint.sh --lo…"   traefik   46 minutes ago   Up 46 minutes             0.0.0.0:80->80/tcp, [::]:80->80/tcp, 0.0.0.0:443->443/tcp, [::]:443->443/tcp, 0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp, 0.0.0.0:8443->8443/tcp, [::]:8443->8443/tcp
```

通过 `https://your.rustfs.com` 访问 RustFS 服务（用户名和密码默认为 `rustfsadmin`）。

当然，也可以通过[mc](../developer/mc.md)来进行验证：

```
mc alias set rustfs https://your.rustfs.com rustfsadmin rustfsadmin
mc ls rustfs
```

**注意**：上述配置使用了 https 访问应用，如果不想使用 https，而是通过 http 来访问应用，删除证书和 tls 相关配置即可。**但是建议用 https 访问应用，这样更安全**。