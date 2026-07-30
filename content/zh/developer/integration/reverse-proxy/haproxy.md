---
title: "HAProxy"
description: "在 HAProxy 后方部署 RustFS，为 S3 API 和控制台配置独立的 HTTPS 路由。"
---

使用 **HAProxy** 终止 TLS，并将不同的主机名分别路由到 RustFS S3 API 和控制台。此部署使用 Docker Compose 运行 HAProxy 和单节点 RustFS 实例。你需要 Docker Engine、Docker Compose、两条 DNS 记录，以及一张涵盖两个主机名的 TLS 证书。

本指南使用以下示例主机名：

- S3 API 使用 `s3.example.com`
- 控制台使用 `console.example.com`

请将它们替换为解析到 Docker 主机的主机名。

:::warning[从根路径提供 S3 服务]

不要在 `/s3/` 等路径下发布 S3 API。AWS Signature Version 4 会将请求路径和主机纳入签名，因此重写任一值都可能导致签名请求失效。

:::

## 1. 创建部署目录

为 HAProxy 配置和 TLS 证书创建目录：

```bash
mkdir -p rustfs-haproxy/config rustfs-haproxy/certs
cd rustfs-haproxy
```

HAProxy 要求证书链和私钥位于同一个 PEM 文件中。请按以下顺序合并：

```bash
cat fullchain.pem privkey.pem > certs/rustfs.pem
chmod 600 certs/rustfs.pem
```

证书必须涵盖两个公网主机名。

## 2. 设置 RustFS 凭证

创建环境文件并替换两个凭证占位符：

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

不要将此文件或证书私钥提交到源代码管理系统。

## 3. 配置 HAProxy

创建 HAProxy 配置：

```text title="config/haproxy.cfg"
global
    log stdout format raw local0

defaults
    log global
    mode http
    option httplog
    timeout connect 10s
    timeout client 1h
    timeout server 1h
    timeout http-request 30s
    timeout tunnel 1h

frontend http
    bind :80
    http-request redirect scheme https code 301

frontend https
    bind :443 ssl crt /usr/local/etc/haproxy/certs/rustfs.pem alpn h2,http/1.1

    acl host_s3 hdr(host) -i s3.example.com
    acl host_console hdr(host) -i console.example.com

    use_backend rustfs_s3 if host_s3
    use_backend rustfs_console if host_console
    default_backend reject_unknown_host

backend reject_unknown_host
    http-request deny deny_status 404

backend rustfs_s3
    balance leastconn
    option httpchk GET /health/ready
    http-check expect status 200
    server rustfs rustfs:9000 check inter 10s fall 3 rise 2

backend rustfs_console
    balance leastconn
    cookie RUSTFS_CONSOLE insert indirect nocache secure httponly
    option httpchk GET /rustfs/console/health
    http-check expect status 200
    server rustfs rustfs:9001 check inter 10s fall 3 rise 2 cookie rustfs
```

除非显式重写，否则 HAProxy 会保留传入的主机和请求路径。较长的客户端、服务器和隧道超时时间可以满足流式 S3 操作和控制台 WebSocket 连接的需要。

控制台后端会设置亲和性 Cookie。只有一台 RustFS 服务器时，它不会影响路由，但保留在基础配置中可以使添加节点后的行为保持一致。

## 4. 创建 Compose 文件

创建 HAProxy 和 RustFS 服务：

```yaml title="compose.yaml"
services:
  haproxy:
    image: haproxy:3.2-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro
      - ./certs:/usr/local/etc/haproxy/certs:ro
    networks:
      - rustfs

  rustfs:
    image: rustfs/rustfs:latest
    restart: unless-stopped
    environment:
      RUSTFS_ACCESS_KEY: ${RUSTFS_ACCESS_KEY}
      RUSTFS_SECRET_KEY: ${RUSTFS_SECRET_KEY}
      RUSTFS_CONSOLE_ENABLE: "true"
      RUSTFS_ADDRESS: "0.0.0.0:9000"
      RUSTFS_CONSOLE_ADDRESS: "0.0.0.0:9001"
    expose:
      - "9000"
      - "9001"
    volumes:
      - rustfs-data:/data
    healthcheck:
      test: ["CMD-SHELL", "curl --fail http://127.0.0.1:9000/health/ready && curl --fail http://127.0.0.1:9001/rustfs/console/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - rustfs

volumes:
  rustfs-data:

networks:
  rustfs:
```

只有 HAProxy 会发布主机端口。RustFS 端口 `9000` 和 `9001` 仅可在 Compose 网络内部访问。

## 5. 验证并启动部署

渲染 Compose 配置并启动 RustFS：

```bash
docker compose config
docker compose up -d rustfs
```

使用与部署相同的镜像验证 HAProxy 配置：

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
```

启动 HAProxy 并检查两个服务：

```bash
docker compose up -d haproxy
docker compose ps
```

如果服务未进入健康状态，请检查其日志：

```bash
docker compose logs haproxy
docker compose logs rustfs
```

## 6. 验证两个端点

通过各自的公网 HTTPS 主机名验证 API 和控制台：

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

将 S3 客户端端点配置为 `https://s3.example.com`，并启用路径样式寻址。打开 `https://console.example.com` 登录控制台。

替换续订后的 `certs/rustfs.pem` 时，请验证配置并重新创建 HAProxy 容器以加载证书：

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
docker compose up -d --force-recreate haproxy
```

## 多节点后端

对于分布式 RustFS 部署，请将每个 RustFS 节点添加到两个后端：

```text title="config/haproxy.cfg"
backend rustfs_s3
		balance leastconn
		option httpchk GET /health/ready
		http-check expect status 200
		server node1 node1.example.net:9000 check inter 10s fall 3 rise 2
		server node2 node2.example.net:9000 check inter 10s fall 3 rise 2
		server node3 node3.example.net:9000 check inter 10s fall 3 rise 2
		server node4 node4.example.net:9000 check inter 10s fall 3 rise 2

backend rustfs_console
		balance leastconn
		cookie RUSTFS_CONSOLE insert indirect nocache secure httponly
		option httpchk GET /rustfs/console/health
		http-check expect status 200
		server node1 node1.example.net:9001 check inter 10s fall 3 rise 2 cookie node1
		server node2 node2.example.net:9001 check inter 10s fall 3 rise 2 cookie node2
		server node3 node3.example.net:9001 check inter 10s fall 3 rise 2 cookie node3
		server node4 node4.example.net:9001 check inter 10s fall 3 rise 2 cookie node4
```

控制台 Cookie 可确保正在进行的 OpenID Connect 登录始终由创建其 `state` 的 RustFS 节点处理。请保持 RustFS 节点之间的端口 `9000` 直接开放，因为内部节点 RPC 使用同一监听器。

## 后续步骤

- [配置 S3 客户端](/developer/examples/aws-cli)
- [启用虚拟主机样式的存储桶 URL](/integration/virtual)
- [查看健康和就绪端点](/operations/status-check)