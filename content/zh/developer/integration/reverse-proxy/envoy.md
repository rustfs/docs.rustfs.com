---
title: "Envoy"
description: "在 Envoy 后部署 RustFS，用 TLS 终结的独立路由分别转发 S3 API 与 Console。"
---

使用 **Envoy** 终结 TLS，并把独立主机名分别路由到 RustFS 的 S3 API 与 Console。本部署在同一个 Docker 网络上运行 Envoy 和单节点 RustFS。你需要 Docker Engine、两条 DNS 记录，以及一张覆盖两个主机名的 TLS 证书（本指南测试环境使用自签证书）。

本指南使用以下示例主机名：

- `s3.example.com` 对应 S3 API
- `console.example.com` 对应 Console

请替换为解析到 Docker 主机的主机名。

:::warning[Serve S3 from the root path]

不要把 S3 API 发布在 `/s3/` 之类的路径下。AWS Signature Version 4 的签名包含请求路径与主机，改写其中任何一个都会导致签名失效。Envoy 原样转发传入的 `Host` 头，签名因此保持有效。

:::

## 1. 创建部署目录

为 Envoy 配置与 TLS 证书创建目录：

```bash
mkdir -p rustfs-envoy/certs
cd rustfs-envoy
```

本地测试可以生成覆盖两个主机名的自签证书：

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/privkey.pem -out certs/fullchain.pem -days 30 \
  -subj "/CN=*.example.com" \
  -addext "subjectAltName=DNS:s3.example.com,DNS:console.example.com"
chmod 644 certs/privkey.pem
```

Envoy 镜像以非 root 用户运行，证书必须可读——`600` 的私钥会产生误导性的 `Failed to load incomplete private key` 报错。

## 2. 配置 Envoy

创建带 HTTPS 监听器和两个虚拟主机的配置。路由超时设为 `timeout: 0s`（禁用），避免长时间的流式 S3 上传被中断：

```yaml title="envoy.yaml"
static_resources:
  listeners:
  - name: https
    address: {socket_address: {address: 0.0.0.0, port_value: 8443}}
    filter_chains:
    - transport_socket:
        name: envoy.transport_sockets.tls
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext
          common_tls_context:
            tls_certificates:
            - certificate_chain: {filename: /certs/fullchain.pem}
              private_key: {filename: /certs/privkey.pem}
      filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: rustfs_https
          route_config:
            virtual_hosts:
            - name: s3
              domains: ["s3.example.com", "s3.example.com:*"]
              routes:
              - match: {prefix: "/"}
                route: {cluster: rustfs_s3, timeout: 0s}
            - name: console
              domains: ["console.example.com", "console.example.com:*"]
              routes:
              - match: {prefix: "/"}
                route: {cluster: rustfs_console, timeout: 0s}
          http_filters:
          - name: envoy.filters.http.router
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
  clusters:
  - name: rustfs_s3
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_s3
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: rustfs, port_value: 9000}}}
  - name: rustfs_console
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_console
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: rustfs, port_value: 9001}}}
```

`host:*` 形式的 domain 条目很重要：客户端在非标准端口上发送的是 `Host: s3.example.com:8443`，Envoy 按 authority 匹配时包含端口。

## 3. 启动 Envoy

在与 RustFS 相同的 Docker 网络上运行 Envoy，只发布代理端口：

```bash
docker run -d --name envoy --network oo-rustfs_default -p 8443:8443 \
  -v "$PWD/envoy.yaml":/envoy.yaml:ro \
  -v "$PWD/certs":/certs:ro \
  envoyproxy/envoy:v1.34-latest -c /envoy.yaml
```

## 4. 验证两个端点

用 `curl --resolve` 把示例主机名指向代理（生产环境由 DNS 完成）：

```bash
curl -sk --resolve s3.example.com:8443:127.0.0.1 \
  https://s3.example.com:8443/health/ready -o /dev/null -w "s3 api: %{http_code}\n"

curl -sk --resolve console.example.com:8443:127.0.0.1 \
  https://console.example.com:8443/rustfs/console/ -o /dev/null -w "console: %{http_code}\n"
```

```text
s3 api: 200
console: 200
```

`-k` 跳过证书校验，因为这里是自签证书；使用受信任的证书后去掉该参数即可。

## 5. 通过 Envoy 发送签名 S3 请求

把任意 S3 客户端的端点指向代理即可，如同指向 RustFS。将客户端配置为 `https://s3.example.com:8443` 并启用路径风格寻址；代理证书受信任时，签名后的 AWS Signature Version 4 请求原样透传。要在纯 HTTP 上快速测试，可以增加一个与 HTTPS 监听器共享相同虚拟主机路由的 HTTP 监听器（端口 8080），然后使用以下端点：`http://s3.example.com:8080`

```bash
rc alias set rustfs-envoy http://s3.example.com:8080 <your-access-key> <your-secret-key>
rc ls rustfs-envoy/rclone-demo/
```

```text
[                   ]         0B seed/
[2026-09-29 11:12:41]        5 B write-test.txt
```

由于 Envoy 原样转发 `Host` 头，签名可以在 RustFS 侧通过校验。

## 多节点后端

分布式 RustFS 部署时，把每个节点加入 S3 cluster：

```yaml title="envoy.yaml"
  - name: rustfs_s3
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_s3
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node1, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node2, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node3, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node4, port_value: 9000}}}
```

Console cluster 按相同模式使用 `9001` 端口。

## 故障排查

### `Failed to load incomplete private key from path`

Envoy 容器以非 root 用户运行，读不了 `600` 且属主为 root 的私钥。执行 `chmod 644`（或把属主改为容器用户，官方镜像中为 UID `1001`）。

### 主机名正确但路由返回 `404`

Envoy 按 authority（含端口）匹配。如上文配置所示，在每个虚拟主机的 `domains` 里加入 `host:*` 变体。

### 经代理访问 RustFS 返回 `Access Denied`

确认代理没有改写路径或 `Host` 头。签名请求必须以客户端签名时的主机名到达 RustFS。

## 下一步

- [配置 S3 客户端](/developer/examples/aws-cli)
- [启用虚拟主机风格的桶 URL](/integration/virtual)
- [查看健康与就绪端点](/operations/status-check)
