---
title: "Virtual-Hosted–Style Requests"
description: "RustFS S3 Virtual Host Style and Path Style configuration."
---

RustFS supports both S3 URL addressing styles:

1. Virtual Host Style
2. Path Style

The two styles differ in where the bucket name appears in the URL.

## Path Style

Path-style addressing is the default. In a path-style URL, the bucket name follows the endpoint.

Example (Bucket: `test`, Host: `rustfs.yourdomain.com`):

```text
http://rustfs.yourdomain.com/test
```

**Note**: No configuration is required for Path Style.

## Virtual Host Style

In Virtual Host Style, the bucket name is part of the domain.

Example (Bucket: `test`, Host: `rustfs.yourdomain.com`):

```text
http://test.rustfs.yourdomain.com/
```

### Configuration

1. **DNS**: Create a wildcard DNS record (for example, `*.rustfs.yourdomain.com` → your server's IP address).
2. **Configuration**: Modify the configuration file (Linux: `/etc/default/rustfs`, Docker/K8s: env vars).
3. **Set Domain**: Set `RUSTFS_SERVER_DOMAINS = "rustfs.yourdomain.com"`.
4. **Restart**: Restart the service (`systemctl restart rustfs`).

### Port in Domain (Optional)

Virtual-host routing applies to the S3 API listener (port 9000 by default); RustFS automatically matches `Host` headers that carry the S3 listener's own port. Only when clients reach RustFS through a **different** port (for example via a proxy) do you need to include that port in `RUSTFS_SERVER_DOMAINS`.

Example (`rustfs.yourdomain.com:8000`):

```ini
RUSTFS_SERVER_DOMAINS = "rustfs.yourdomain.com:8000"
```

This ensures that requests like:

```text
http://my-bucket.rustfs.yourdomain.com:8000/
```

are routed correctly with virtual-hosted–style addressing.

:::warning[Match the Host header]
The value of `RUSTFS_SERVER_DOMAINS` must exactly match the `Host` header (including the port, if present) that clients send.
:::

