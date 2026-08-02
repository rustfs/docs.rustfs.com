---
title: "Traefik"
description: "在 Traefik 后方部署 RustFS，并为独立的 S3 API 和控制台主机名启用自动 TLS。"
---

使用 **Traefik** 及其 Docker 提供程序发现 RustFS、从 Let's Encrypt 获取 TLS 证书，并将不同的主机名分别路由到 S3 API 和控制台。你需要 Docker Engine、Docker Compose、一台公网服务器，以及两条解析到该服务器的 DNS 记录。

本指南使用以下示例主机名：

- S3 API 使用 `s3.example.com`
- 控制台使用 `console.example.com`

请将它们替换为你的公网主机名。ACME HTTP-01 质询要求端口 `80` 和 `443` 可从外部访问。

:::warning[从根路径提供 S3 服务]

不要在 `/s3/` 等路径下发布 S3 API。AWS Signature Version 4 会将请求路径和主机纳入签名，因此重写任一值都可能导致签名请求失效。

:::

## 1. 创建部署目录

创建目录和一个空的 ACME 存储文件。Traefik 要求此文件具有严格的权限：

```bash
mkdir rustfs-traefik
cd rustfs-traefik
touch acme.json
chmod 600 acme.json
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

请使用能够接收证书到期通知的电子邮件地址。不要将 `.env` 或 `acme.json` 提交到源代码管理系统。

## 3. 创建 Compose 文件

创建 Traefik 和 RustFS 服务：

```yaml title="compose.yaml"
services:
  traefik:
    image: traefik:v3.6.5
    restart: unless-stopped
    command:
      - --log.level=INFO
      - --accesslog=true
      - --providers.docker=true
      - --providers.docker.endpoint=unix:///var/run/docker.sock
      - --providers.docker.exposedbydefault=false
      - --providers.docker.network=rustfs
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --certificatesresolvers.le.acme.email=${ACME_EMAIL}
      - --certificatesresolvers.le.acme.storage=/etc/traefik/acme.json
      - --certificatesresolvers.le.acme.httpchallenge=true
      - --certificatesresolvers.le.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/etc/traefik/acme.json
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
    labels:
      - traefik.enable=true
      - traefik.docker.network=rustfs
      - traefik.http.routers.rustfs-s3.rule=Host(`${S3_HOSTNAME}`)
      - traefik.http.routers.rustfs-s3.entrypoints=websecure
      - traefik.http.routers.rustfs-s3.tls=true
      - traefik.http.routers.rustfs-s3.tls.certresolver=le
      - traefik.http.routers.rustfs-s3.service=rustfs-s3
      - traefik.http.services.rustfs-s3.loadbalancer.server.port=9000
      - traefik.http.services.rustfs-s3.loadbalancer.passhostheader=true
      - traefik.http.routers.rustfs-console.rule=Host(`${CONSOLE_HOSTNAME}`)
      - traefik.http.routers.rustfs-console.entrypoints=websecure
      - traefik.http.routers.rustfs-console.tls=true
      - traefik.http.routers.rustfs-console.tls.certresolver=le
      - traefik.http.routers.rustfs-console.service=rustfs-console
      - traefik.http.services.rustfs-console.loadbalancer.server.port=9001
      - traefik.http.services.rustfs-console.loadbalancer.passhostheader=true
    networks:
      - rustfs

volumes:
  rustfs-data:

networks:
  rustfs:
    name: rustfs
```

两个路由器使用不同的主机规则和后端端口。RustFS 不会在 Docker 主机上发布端口 `9000` 或 `9001`，Traefik Dashboard 也不会对外公开。

:::note[Docker 套接字访问]

Traefik 通过只读 Docker 套接字挂载读取容器标签。任何能够修改 Docker 工作负载的用户都可以影响 Docker 提供程序发现的路由。请限制对代理主机上 Docker 的访问。

:::

## 4. 验证并启动部署

渲染 Compose 配置并检查所有变量是否都已解析：

```bash
docker compose config
```

启动两个服务：

```bash
docker compose up -d
docker compose ps
```

在 Traefik 完成 ACME 质询并创建两张证书期间跟踪其日志：

```bash
docker compose logs --follow traefik
```

如果证书签发失败，请确认两条 DNS 记录均解析到此主机，并且端口 `80` 和 `443` 可从互联网访问。Let's Encrypt 存在速率限制，因此请先修正 DNS 和防火墙问题，再反复重新创建部署。

## 5. 验证两个端点

通过 Traefik 验证 S3 API 就绪端点和控制台健康端点：

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

将 S3 客户端端点配置为 `https://s3.example.com`，并启用路径样式寻址。打开 `https://console.example.com` 登录控制台。

## 多节点服务

对于外部多节点 RustFS 集群，请在 `traefik` 服务中启用 Traefik 文件提供程序：

```yaml title="compose.yaml"
services:
  traefik:
    command:
      - --providers.file.filename=/etc/traefik/dynamic.yaml
      - --providers.file.watch=true
    volumes:
      - ./dynamic.yaml:/etc/traefik/dynamic.yaml:ro
```

创建包含每个 RustFS 节点的动态配置：

```yaml title="dynamic.yaml"
http:
  routers:
    rustfs-s3:
      rule: Host(`s3.example.com`)
      entryPoints:
        - websecure
      service: rustfs-s3
      tls:
        certResolver: le
    rustfs-console:
      rule: Host(`console.example.com`)
      entryPoints:
        - websecure
      service: rustfs-console
      tls:
        certResolver: le

  services:
    rustfs-s3:
      loadBalancer:
        passHostHeader: true
        healthCheck:
          path: /health/ready
          interval: 10s
          timeout: 5s
        servers:
          - url: http://node1.example.net:9000
          - url: http://node2.example.net:9000
          - url: http://node3.example.net:9000
          - url: http://node4.example.net:9000
    rustfs-console:
      loadBalancer:
        passHostHeader: true
        sticky:
          cookie:
            name: rustfs_console
            secure: true
            httpOnly: true
        healthCheck:
          path: /rustfs/console/health
          interval: 10s
          timeout: 5s
        servers:
          - url: http://node1.example.net:9001
          - url: http://node2.example.net:9001
          - url: http://node3.example.net:9001
          - url: http://node4.example.net:9001
```

使用 OpenID Connect 时，请为控制台服务配置粘性会话。正在进行的登录会将其 `state` 存储在一个 RustFS 节点上，回调必须返回该节点。请保持 RustFS 节点之间的端口 `9000` 直接开放，因为内部节点 RPC 使用同一监听器。

## 后续步骤

- [配置 S3 客户端](/developer/examples/aws-cli)
- [启用虚拟主机样式的存储桶 URL](/integration/virtual)
- [查看健康和就绪端点](/operations/status-check)