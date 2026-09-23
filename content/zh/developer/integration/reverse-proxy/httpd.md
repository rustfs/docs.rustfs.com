---
title: "Apache HTTP Server"
description: "在 Apache HTTP Server 后方部署 RustFS，为 S3 API 和控制台的独立主机名终止 TLS。"
---

使用 **Apache HTTP Server**（httpd）终止 TLS，并将不同的主机名分别路由到 RustFS S3 API 和控制台。此部署使用 Docker Compose 运行 httpd 和单节点 RustFS 实例。你需要 Docker Engine、Docker Compose、两条 DNS 记录，以及一张涵盖两个主机名的 TLS 证书。

本指南使用以下示例主机名：

- S3 API 使用 `s3.example.com`
- 控制台使用 `console.example.com`

请将它们替换为解析到 Docker 主机的主机名。

:::warning[从根路径提供 S3 服务]

不要在 `/s3/` 等路径下发布 S3 API。AWS Signature Version 4 会将请求路径和主机纳入签名，因此重写任一值都可能导致签名请求失效。除非禁用规范化，否则 Apache 会重写被代理的 URL；本配置通过 `nocanon` 禁用规范化。

:::

## 1. 创建部署目录

为 httpd 配置和 TLS 证书创建目录：

```bash
mkdir -p rustfs-httpd/config rustfs-httpd/certs
cd rustfs-httpd
```

将证书链和私钥复制到 `certs/`：

```text
rustfs-httpd/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── config/
```

限制对私钥的访问：

```bash
chmod 600 certs/privkey.pem
```

证书必须涵盖这两个公网主机名。

## 2. 设置 RustFS 凭证

创建环境文件并替换两个凭证占位符：

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

不要将此文件提交到源代码管理系统。

## 3. 构建 httpd 镜像

官方 `httpd` 镜像默认注释掉了代理和 TLS 模块。构建一个启用这些模块并加载 RustFS 虚拟主机的小镜像：

```dockerfile title="Dockerfile"
FROM httpd:2.4-alpine

# The stock httpd image disables the proxy and TLS modules. Enable the modules
# required to terminate TLS and reverse-proxy RustFS, then load the RustFS
# virtual hosts.
RUN sed -i \
      -e 's|^#\(LoadModule socache_shmcb_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_http_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_balancer_module\)|\1|' \
      -e 's|^#\(LoadModule slotmem_shm_module\)|\1|' \
      -e 's|^#\(LoadModule ssl_module\)|\1|' \
      -e 's|^#\(LoadModule http2_module\)|\1|' \
      -e 's|^#\(LoadModule lbmethod_byrequests_module\)|\1|' \
      /usr/local/apache2/conf/httpd.conf \
      && printf '\nInclude conf/rustfs.conf\n' >> /usr/local/apache2/conf/httpd.conf
```

`proxy_balancer`、`slotmem_shm` 和 `lbmethod_byrequests` 仅供[多节点](#多节点后端)配置使用。在单节点部署中加载它们没有副作用。

## 4. 配置 Apache HTTP Server

创建 httpd 配置，为每个 RustFS 端点设置一个虚拟主机：

```apache title="config/rustfs.conf"
# Global settings shared by the RustFS virtual hosts.
ServerName localhost

# The stock image listens on port 80 only. Open port 443 for TLS.
Listen 443

# S3 transfers can run for hours; do not cut idle-looking connections.
Timeout 600
ProxyTimeout 600

# Share TLS sessions across connections to speed up repeated handshakes.
SSLSessionCache "shmcb:logs/ssl_scache(512000)"

# Drop only genuinely stalled clients: MinRate keeps slow-but-steady uploads
# alive while data keeps flowing.
RequestReadTimeout header=30-60,MinRate=500 body=60,MinRate=512

# Accept request bodies of any size (the default, stated explicitly).
LimitRequestBody 0

# Redirect every plain-HTTP request to HTTPS.
<VirtualHost *:80>
    ServerName s3.example.com
    Redirect permanent / https://s3.example.com/
</VirtualHost>

<VirtualHost *:80>
    ServerName console.example.com
    Redirect permanent / https://console.example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName s3.example.com

    Protocols h2 http/1.1
    SSLEngine on
    SSLCertificateFile /usr/local/apache2/certs/fullchain.pem
    SSLCertificateKeyFile /usr/local/apache2/certs/privkey.pem

    # AWS Signature Version 4 signs the Host header and the request path.
    # Keep the client's Host, leave the path uncanonicalized, and allow
    # encoded slashes so that signed requests stay valid.
    ProxyPreserveHost On
    ProxyRequests Off
    AllowEncodedSlashes NoDecode

    # Apache does not set X-Forwarded-Proto; declare it explicitly.
    # ProxyAddHeaders (default On) adds X-Forwarded-For/Host/Server.
    RequestHeader set X-Forwarded-Proto "https"

    # nocanon passes the request path to RustFS unchanged.
    ProxyPass / http://rustfs:9000/ nocanon
    ProxyPassReverse / http://rustfs:9000/
</VirtualHost>

<VirtualHost *:443>
    ServerName console.example.com

    Protocols h2 http/1.1
    SSLEngine on
    SSLCertificateFile /usr/local/apache2/certs/fullchain.pem
    SSLCertificateKeyFile /usr/local/apache2/certs/privkey.pem

    ProxyPreserveHost On
    ProxyRequests Off

    RequestHeader set X-Forwarded-Proto "https"

    # upgrade=websocket tunnels Console WebSocket upgrades end to end;
    # regular requests continue to use plain HTTP forwarding.
    ProxyPass / http://rustfs:9001/ upgrade=websocket
    ProxyPassReverse / http://rustfs:9001/
</VirtualHost>
```

`Listen 443` 是必需的，因为官方 `httpd.conf` 只打开 `80` 端口，仅配置虚拟主机不会开放端口。两个 `VirtualHost *:80` 块将所有明文 HTTP 流量重定向到 HTTPS，并指定明确的目标主机名。

## 5. 创建 Compose 文件

创建 httpd 和 RustFS 服务：

```yaml title="compose.yaml"
services:
  httpd:
    build: .
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/rustfs.conf:/usr/local/apache2/conf/rustfs.conf:ro
      - ./certs:/usr/local/apache2/certs:ro
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
      RUSTFS_OBS_LOG_DIRECTORY: /logs
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

只有 httpd 会发布主机端口。RustFS 端口 `9000` 和 `9001` 仅可在 Compose 网络内部访问。

:::note[RustFS 日志目录]

`RUSTFS_OBS_LOG_DIRECTORY` 必须指向容器可以创建的目录。RustFS 镜像以非 root 用户运行，因此 `/logs` 可用，而 `/var/log` 下的路径会使容器在启动时以 `Permission denied` 退出。

:::

## 6. 验证并启动部署

先验证 Compose 配置，然后启动 RustFS：

```bash
docker compose config
docker compose up -d rustfs
```

使用与部署相同的镜像验证 httpd 配置：

```bash
docker compose run --rm --no-deps httpd httpd -t
```

启动 httpd 并检查两个服务：

```bash
docker compose up -d httpd
docker compose ps
```

如果服务未进入健康状态，请检查其日志：

```bash
docker compose logs httpd
docker compose logs rustfs
```

## 7. 验证两个端点

通过各自的公网 HTTPS 主机名验证 API 和控制台：

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

将 S3 客户端端点配置为 `https://s3.example.com`，并启用路径样式寻址。打开 `https://console.example.com/rustfs/console/` 登录控制台。

:::note[控制台根路径]

在 RustFS v2.x 中，控制台通过 `/rustfs/console/` 路径前缀提供服务。请求控制台主机名的根路径会返回 S3 风格的 XML 访问拒绝响应，这是预期行为。

:::

替换 `certs/` 中续订后的证书或密钥时，请验证配置并平滑重新加载 httpd，且不会中断正在进行的传输：

```bash
docker compose exec httpd httpd -t
docker compose exec httpd httpd -k graceful
```

## 此配置如何保留 S3 签名

AWS Signature Version 4 会对 HTTP 方法、`Host` 标头和原始请求路径进行签名。以下每条指令都确保其中一个值在客户端与 RustFS 之间保持逐字节一致：

- **`ProxyPreserveHost On`** 保留客户端的 `Host` 标头。使用默认值（`Off`）时，Apache 会把 `Host` 重写为后端主机，RustFS 会返回 `SignatureDoesNotMatch`。
- `ProxyPass` 行上的 **`nocanon`** 将请求路径原样传给 RustFS，不做 URL 规范化。缺少它时，Apache 会在转发过程中重写路径（例如合并 `//`），已签名的路径将不再匹配。
- **`AllowEncodedSlashes NoDecode`** 允许包含 `%2F` 的对象键到达代理处理程序而不是返回 `404`，并保持编码不变。
- **`RequestHeader set X-Forwarded-Proto "https"`** 告知 RustFS 原始协议方案。Apache 的 `ProxyAddHeaders`（默认 `On`）会添加 `X-Forwarded-For`、`X-Forwarded-Host` 和 `X-Forwarded-Server`，但不包括 `X-Forwarded-Proto`。

预签名 URL、分片上传和浏览器 POST 上传同样依赖对路径和主机的保留，无需额外指令。

控制台虚拟主机在其 `ProxyPass` 行上添加 `upgrade=websocket`，以便将 WebSocket 升级请求端到端地隧道传输。自 2.4.47 起，`mod_proxy_http` 自行处理升级，仅隧道传输后端以 `101 Switching Protocols` 接受的连接；较旧的 `mod_proxy_wstunnel` 模块已弃用。

## 请求体、大对象与超时

Apache 将请求体转发给 RustFS 时没有大小限制，也不会写入代理的磁盘。携带 `Content-Length` 的请求体（AWS CLI、AWS SDK 和 `mc` 发送的格式）按到达顺序流式转发。携带 `Transfer-Encoding: chunked` 的请求体也会按 chunked 编码转发，而 RustFS 会拒绝这类请求体——参见下方的警告。

超时指令在安全性与长传输之间取得平衡：

- **`Timeout 600`** 覆盖连接上双向的 I/O，因此缓慢的下载和上传不会在传输中途被切断。
- **`ProxyTimeout 600`** 对与 RustFS 的连接应用相同的时限。
- **`RequestReadTimeout`** 限制过慢的客户端而不影响稳定传输的客户端：仅当标头停滞或请求体速率低于 `MinRate` 时才丢弃请求。
- **`LimitRequestBody 0`** 显式声明默认行为：接受任意大小的请求体。

:::warning[上传必须携带 Content-Length]

RustFS 拒绝以 `Transfer-Encoding: chunked` 转发的请求体，返回 `400 UnexpectedContent`（`This request does not support content.`）。客户端必须使用 `Content-Length` 上传。所有主流 S3 客户端开箱即用都这样做，因此这只影响从管道流式读取数据的手写 HTTP 脚本。Apache 默认的请求体处理会把较小的 chunked 请求体在内存中转换为 `Content-Length`，但把较大的按 chunked 转发，因此这类客户端可能小文件正常、大文件失败。`SetEnv proxy-sendcl 1` 可以作为补救把 chunked 请求体转换为 `Content-Length`——代价是先将每个请求体暂存到代理的磁盘。

:::

:::warning[预签名 URL 与 Content-Type 标头]

预签名 URL 会固定其签名覆盖的标头。如果生成 URL 时没有 `Content-Type`，上传请求就不得添加该标头——RustFS 会对未签名的标头返回 `403 SignatureDoesNotMatch`。注意 `curl -d` 和 `curl --data-binary` 会自动添加 `Content-Type: application/x-www-form-urlencoded`。当上传需要发送 `Content-Type` 时，请以相同的值生成预签名 URL（AWS SDK 中的 `ContentType` 参数），并让请求与之完全一致。

:::

## 不适合 RustFS 的设置

以下 Apache 默认值和选项会破坏 S3 语义或浪费资源。本配置全部避免使用它们。

| 设置 | 对 RustFS 的影响 |
| --- | --- |
| `ProxyPreserveHost Off`（默认） | 重写 `Host`；已签名的请求会因 `SignatureDoesNotMatch` 失败。 |
| 缺少 `nocanon` 的 `ProxyPass` | 规范化请求路径；已签名的路径无法通过校验。 |
| `AllowEncodedSlashes Off`（默认） | 对包含 `%2F` 的对象键返回 `404`。 |
| 路径前缀（`ProxyPass /s3/`、`Alias`、重写规则） | 重写请求路径；请让 S3 API 保持在根路径。 |
| `ProxyErrorOverride On` | 用 Apache 错误页面替换 RustFS 的 S3 XML 错误；S3 SDK 无法解析这些页面。 |
| `SetEnv proxy-sendcl 1`、`SetEnv force-proxy-request-1.0 1` | 强制向上游发送 `Content-Length`，并在转发前将 chunked 请求体暂存到磁盘。可以挽救只发 chunked 的客户端，但会为大上传增加磁盘 I/O。 |
| `SetEnv proxy-sendchunked 1` | 强制向上游发送 chunked 编码，RustFS 会以 `400 UnexpectedContent` 拒绝。 |
| `mod_proxy_wstunnel`（`ProxyPass ... ws://`） | 自 2.4.47 起弃用；请改用 `mod_proxy_http` 的 `upgrade=websocket`。 |

还有两个 RustFS 侧的限制值得标注，因为任何代理设置都无法消除它们：

- 包含空（`//`）或点（`.`）路径段的对象键即使不经过代理也会被拒绝，返回 `InvalidArgument`。
- 在 RustFS v2.x 中，控制台位于 `/rustfs/console/` 之下；控制台根路径返回 S3 风格的 XML。

## 多节点后端

对于分布式 RustFS 部署，请将每个单独的 `ProxyPass` 目标替换为列出所有 RustFS 节点的负载均衡器。将 S3 虚拟主机的代理块替换为：

```apache title="config/rustfs.conf"
    <Proxy "balancer://s3">
        BalancerMember http://node1.example.net:9000 route=node1
        BalancerMember http://node2.example.net:9000 route=node2
        BalancerMember http://node3.example.net:9000 route=node3
        BalancerMember http://node4.example.net:9000 route=node4
        ProxySet lbmethod=byrequests
    </Proxy>
    ProxyPass / balancer://s3/ nocanon
    ProxyPassReverse / balancer://s3/
```

将控制台虚拟主机的代理块替换为：

```apache title="config/rustfs.conf"
    # Keep an in-progress login on the node that created its state.
    Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED

    <Proxy "balancer://console">
        BalancerMember http://node1.example.net:9001 route=node1 upgrade=websocket
        BalancerMember http://node2.example.net:9001 route=node2 upgrade=websocket
        BalancerMember http://node3.example.net:9001 route=node3 upgrade=websocket
        BalancerMember http://node4.example.net:9001 route=node4 upgrade=websocket
        ProxySet stickysession=ROUTEID
    </Proxy>
    ProxyPass / balancer://console/
    ProxyPassReverse / balancer://console/
```

`ROUTEID` Cookie 让进行中的 OpenID Connect 登录保持在创建其 `state` 的 RustFS 节点上。请在每个 `BalancerMember` 行上保留 `upgrade=websocket`；`ProxySet` 不接受该参数。请保持 RustFS 节点之间的端口 `9000` 直接开放，因为内部节点 RPC 使用同一监听器。

## 后续步骤

- [配置 S3 客户端](/developer/examples/aws-cli)
- [启用虚拟主机样式的存储桶 URL](/integration/virtual)
- [查看健康和就绪端点](/operations/status-check)
