---
title: "Caddy"
description: "在 Caddy 后方部署 RustFS，并为独立的 S3 API 和控制台主机名启用自动 HTTPS。"
---

使用 **Caddy** 自动获取和续订 TLS 证书，并将不同的主机名分别路由到 RustFS S3 API 和控制台。此部署使用 Docker Compose 运行 Caddy 和单节点 RustFS 实例。你需要 Docker Engine、Docker Compose、一台公网服务器，以及两条解析到该服务器的 DNS 记录。

本指南使用以下示例主机名：

- S3 API 使用 `s3.example.com`
- 控制台使用 `console.example.com`

请将它们替换为你的公网主机名。Caddy 默认的 ACME 质询要求端口 `80` 和 `443` 可从外部访问。

:::warning[从根路径提供 S3 服务]

不要在 `/s3/` 等路径下发布 S3 API。AWS Signature Version 4 会将请求路径和主机纳入签名，因此重写任一值都可能导致签名请求失效。

:::

## 1. 创建部署目录

为部署创建目录：

```bash
mkdir rustfs-caddy
cd rustfs-caddy
```

## 2. 设置部署变量

创建环境文件并替换每个值：

```ini title=".env"
S3_HOSTNAME=s3.example.com
CONSOLE_HOSTNAME=console.example.com
ACME_EMAIL=admin@example.com
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

请使用能够接收证书通知的电子邮件地址。不要将 `.env` 提交到源代码管理系统。

## 3. 配置 Caddy

创建一个 Caddyfile，为每个 RustFS 端点配置一个站点块：

```text title="Caddyfile"
{
		email {$ACME_EMAIL}
}

{$S3_HOSTNAME} {
		reverse_proxy rustfs:9000 {
				health_uri /health/ready
				health_interval 10s
				health_timeout 5s
				health_fails 3
				health_passes 2
				lb_try_duration 5s
		}
}

{$CONSOLE_HOSTNAME} {
		reverse_proxy rustfs:9001 {
				health_uri /rustfs/console/health
				health_interval 10s
				health_timeout 5s
				health_fails 3
				health_passes 2
				lb_try_duration 5s
		}
}
```

Caddy 默认会保留传入的 `Host` 标头、HTTP 方法和请求 URI。它还会通过 `X-Forwarded-*` 标头转发客户端信息，并且无需额外的标头规则即可处理控制台 WebSocket 升级。

## 4. 创建 Compose 文件

创建 Caddy 和 RustFS 服务：

```yaml title="compose.yaml"
services:
  caddy:
    image: caddy:2.10-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    environment:
      S3_HOSTNAME: ${S3_HOSTNAME}
      CONSOLE_HOSTNAME: ${CONSOLE_HOSTNAME}
      ACME_EMAIL: ${ACME_EMAIL}
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config
    networks:
      - rustfs

  rustfs:
    image: rustfs/rustfs:latest
    restart: unless-stopped
    environment:
      RUSTFS_ACCESS_KEY: ${RUSTFS_ACCESS_KEY}
      RUSTFS_SECRET_KEY: ${RUSTFS_SECRET_KEY}
      RUSTFS_CONSOLE_ENABLE: "true"
      RUSTFS_ADDRESS: ":9000"
      RUSTFS_CONSOLE_ADDRESS: ":9001"
      RUSTFS_OBS_LOGGER_LEVEL: error
      RUSTFS_OBS_LOG_DIRECTORY: /var/log/rustfs/
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
  caddy-data:
  caddy-config:
  rustfs-data:

networks:
  rustfs:
```

持久化的 `caddy-data` 卷用于存储证书、私钥和 ACME 账户状态。请备份此卷，并且不要共享其中的内容。只有 Caddy 会发布主机端口；RustFS 仅可在 Compose 网络内部访问。

## 5. 验证并启动部署

渲染 Compose 配置并启动 RustFS：

```bash
docker compose config
docker compose up -d rustfs
```

使用与部署相同的镜像验证 Caddyfile：

```bash
docker compose run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile
```

启动 Caddy 并检查两个服务：

```bash
docker compose up -d caddy
docker compose ps
docker compose logs --follow caddy
```

Caddy 会在后台获取证书，并将 HTTP 请求重定向到 HTTPS。如果签发失败，请确认两条 DNS 记录均解析到此主机、端口 `80` 和 `443` 可以访问，并且 `caddy-data` 卷可写。

## 6. 验证两个端点

通过各自的公网 HTTPS 主机名验证 API 和控制台：

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

将 S3 客户端端点配置为 `https://s3.example.com`，并启用路径样式寻址。打开 `https://console.example.com` 登录控制台。

## 多节点上游

对于分布式 RustFS 部署，请在对应的站点块中列出每个节点：

```text title="Caddyfile"
{$S3_HOSTNAME} {
		reverse_proxy node1.example.net:9000 node2.example.net:9000 node3.example.net:9000 node4.example.net:9000 {
				lb_policy least_conn
				health_uri /health/ready
				health_interval 10s
				health_timeout 5s
				lb_try_duration 5s
		}
}

{$CONSOLE_HOSTNAME} {
		reverse_proxy node1.example.net:9001 node2.example.net:9001 node3.example.net:9001 node4.example.net:9001 {
				lb_policy cookie rustfs_console <your-cookie-secret>
				health_uri /rustfs/console/health
				health_interval 10s
				health_timeout 5s
				lb_try_duration 5s
		}
}
```

将 `<your-cookie-secret>` 替换为由所有 Caddy 实例共享的随机密钥。控制台会话亲和性可确保正在进行的 OpenID Connect 登录始终由创建其 `state` 的 RustFS 节点处理。请保持 RustFS 节点之间的端口 `9000` 直接开放，因为内部节点 RPC 使用同一监听器。

## 后续步骤

- [配置 S3 客户端](/developer/examples/aws-cli)
- [启用虚拟主机样式的存储桶 URL](/integration/virtual)
- [查看健康和就绪端点](/operations/status-check)