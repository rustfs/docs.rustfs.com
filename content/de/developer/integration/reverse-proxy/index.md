---
title: "Reverse Proxy"
description: "Choose and configure a reverse proxy for the RustFS S3 API and Console."
---

Use a reverse proxy to expose the **RustFS** S3 API and Console through managed hostnames and TLS endpoints.

We recommend using separate hostnames for the S3 API on port `9000` and the Console on port `9001`. Serve the S3 API from the root of its hostname because S3 clients sign the request path.

## Supported guides

- [Nginx](./nginx.md)
- [Traefik](./traefik.md)
- [Caddy](./caddy.md)
- [HAProxy](./haproxy.md)

## Related configuration

See [Virtual-Host Access](/integration/virtual) when clients access buckets through virtual-hosted-style URLs.