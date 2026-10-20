---
title: "Virtual-hosted–style requests"
description: "Configure path-style and virtual-hosted–style S3 URLs for RustFS."
---

RustFS supports both S3 URL addressing styles:

1. Virtual-hosted–style
2. Path-style

The difference is where the bucket name appears in the URL.

## Path-style addressing

Path-style addressing is the default. In a path-style URL, the bucket name follows the endpoint.

Example (bucket: `my-bucket`, host: `rustfs.example.com`):

```text
http://rustfs.example.com/my-bucket
```

:::note[No extra configuration]

Path-style addressing works without `RUSTFS_SERVER_DOMAINS`.

:::

## Virtual-hosted–style addressing

In a virtual-hosted–style URL, the bucket name is part of the hostname.

Example (bucket: `my-bucket`, host: `rustfs.example.com`):

```text
http://my-bucket.rustfs.example.com/
```

### Configure the domain

1. Create a wildcard DNS record (for example, `*.rustfs.example.com` → your server's IP address).
2. Set `RUSTFS_SERVER_DOMAINS=rustfs.example.com` in the server configuration (Linux: `/etc/default/rustfs`; Docker or Kubernetes: the same environment variable). Do not include a port when clients use the S3 API listener's own port.
3. Restart RustFS (`sudo systemctl restart rustfs` on a systemd install).

Virtual-hosted routing applies to the S3 API listener (port `9000` by default). RustFS matches `Host` headers that use that listener's port. Include a port in `RUSTFS_SERVER_DOMAINS` only when clients reach RustFS through a different port, for example a proxy on port `8000`.

```ini title="/etc/default/rustfs"
RUSTFS_SERVER_DOMAINS=rustfs.example.com:8000
```

Requests such as the following are then routed with virtual-hosted–style addressing:

```text
http://my-bucket.rustfs.example.com:8000/
```

:::warning[Match the Host header]

The value of `RUSTFS_SERVER_DOMAINS` must exactly match the `Host` header (including the port, if present) that clients send.

:::

## Next steps

- [S3 API overview](/administration/protocols/s3)
- [Environment variables](/reference/environment-variables)
