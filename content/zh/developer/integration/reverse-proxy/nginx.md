---
title: "Nginx"
description: "在 Nginx 后方部署 RustFS，为 S3 API 和控制台配置独立的 HTTPS 端点。"
---

使用 **Nginx** 终止 TLS，并将不同的主机名分别路由到 RustFS S3 API 和控制台。此部署使用 Docker Compose 运行 Nginx 和单节点 RustFS 实例。你需要 Docker Engine、Docker Compose、两条 DNS 记录，以及一张涵盖两个主机名的 TLS 证书。

本指南使用以下示例主机名：

- S3 API 使用 `s3.example.com`
- 控制台使用 `console.example.com`

请将它们替换为解析到 Docker 主机的主机名。

:::warning[从根路径提供 S3 服务]

不要在 `/s3/` 等路径下发布 S3 API。AWS Signature Version 4 会将请求路径和主机纳入签名，因此重写任一值都可能导致签名请求失效。

:::

## 1. 创建部署目录

为 Nginx 配置和 TLS 证书创建目录：

```bash
mkdir -p rustfs-nginx/sites rustfs-nginx/certs
cd rustfs-nginx
```

将证书链和私钥复制到 `certs/`：

```text
rustfs-nginx/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── sites/
```

限制对私钥的访问：

```bash
chmod 600 certs/privkey.pem
```

## 2. 设置 RustFS 凭证

创建环境文件并替换两个凭证占位符：

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

不要将此文件提交到源代码管理系统。

## 3. 配置 Nginx

创建 Nginx 配置：

```nginx title="sites/rustfs.conf"
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      '';
}

upstream rustfs_s3 {
    server rustfs:9000;
    keepalive 32;
}

upstream rustfs_console {
    server rustfs:9001;
    keepalive 16;
}

server {
    listen 80;
    listen [::]:80;
    server_name s3.example.com console.example.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name s3.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    ignore_invalid_headers off;
    client_max_body_size 0;
    proxy_buffering off;
    proxy_request_buffering off;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection '';
        proxy_cache_convert_head off;
        proxy_connect_timeout 300s;
        chunked_transfer_encoding off;
        proxy_pass http://rustfs_s3;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name console.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    client_max_body_size 0;
    proxy_buffering off;
    proxy_request_buffering off;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_connect_timeout 300s;
        proxy_pass http://rustfs_console;
    }
}
```

S3 服务器会保留原始主机和请求路径，禁用请求缓冲以支持流式上传，并且不会转换已签名的 `HEAD` 请求。控制台服务器还会转发 WebSocket 升级标头。

## 4. 创建 Compose 文件

创建部署定义：

```yaml title="compose.yaml"
services:
  nginx:
    image: nginx:1.25-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./sites/rustfs.conf:/etc/nginx/conf.d/rustfs.conf:ro
      - ./certs:/etc/nginx/certs:ro
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

只有 Nginx 会发布主机端口。RustFS 端口 `9000` 和 `9001` 仅可在 Compose 网络内部访问。

## 5. 验证并启动部署

启动服务前验证两个配置文件：

```bash
docker compose config
docker compose up -d rustfs
docker compose run --rm --no-deps nginx nginx -t
```

启动 Nginx 并检查两个服务：

```bash
docker compose up -d nginx
docker compose ps
```

如果服务未进入健康状态，请检查其日志：

```bash
docker compose logs nginx
docker compose logs rustfs
```

## 6. 验证两个端点

通过各自的公网 HTTPS 主机名验证 API 和控制台：

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

将 S3 客户端端点配置为 `https://s3.example.com`，并启用路径样式寻址。打开 `https://console.example.com` 登录控制台。

替换 `certs/` 中续订后的证书或密钥时，请验证配置并重新加载 Nginx，且不会中断活动连接：

```bash
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

## 多节点上游

对于分布式 RustFS 部署，请将每个上游中的单台服务器替换为所有 RustFS 节点：

```nginx title="sites/rustfs.conf"
upstream rustfs_s3 {
    least_conn;
    server node1.example.net:9000;
    server node2.example.net:9000;
    server node3.example.net:9000;
    server node4.example.net:9000;
  keepalive 32;
}

upstream rustfs_console {
    ip_hash;
    server node1.example.net:9001;
    server node2.example.net:9001;
    server node3.example.net:9001;
    server node4.example.net:9001;
  keepalive 16;
}
```

控制台上游使用客户端亲和性，因为正在进行的 OpenID Connect 登录会将其 `state` 存储在一个 RustFS 节点上。请保持 RustFS 节点之间的端口 `9000` 开放，因为内部节点 RPC 使用同一监听器。

## 后续步骤

- [配置 S3 客户端](/developer/examples/aws-cli)
- [启用虚拟主机样式的存储桶 URL](/integration/virtual)
- [查看健康和就绪端点](/operations/status-check)