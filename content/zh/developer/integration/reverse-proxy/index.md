---
title: "反向代理"
description: "为 RustFS S3 API 和控制台选择并配置反向代理。"
---

使用反向代理，通过托管主机名和 TLS 端点公开 **RustFS** S3 API 和控制台。

建议分别为端口 `9000` 上的 S3 API 和端口 `9001` 上的控制台使用不同的主机名。请从相应主机名的根路径提供 S3 API，因为 S3 客户端会对请求路径进行签名。

## 支持的指南

- [Nginx](./nginx.md)
- [Traefik](./traefik.md)
- [Caddy](./caddy.md)
- [HAProxy](./haproxy.md)

## 相关配置

当客户端通过虚拟主机样式 URL 访问存储桶时，请参阅[虚拟主机访问](/integration/virtual)。