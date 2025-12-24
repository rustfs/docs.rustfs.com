---
title: "Virtual Host Style"
description: "RustFS S3 Virtual Host Style and Path Style configuration."
---

# S3 Request Modes

RustFS complies with S3 protocols. S3 supports two request modes:

1. Virtual Host Style
2. Path Style

The difference lies in the bucket name placement.

## Path Style

Path Style is the default. In Path Style, the bucket name follows the endpoint.

Example (Bucket: `test`, Host: `rustfs.com`):

```
http://rustfs.com/test
```

**Note**: No configuration is required for Path Style.

## Virtual Host Style

In Virtual Host Style, the bucket name is part of the domain.

Example (Bucket: `test`, Host: `rustfs.com`):

```
http://test.rustfs.com/
```

### Configuration

1. **DNS**: Configure wildcard DNS resolution (e.g., `*.rustfs.com` -> Server IP).
2. **Configuration**: Modify the configuration file (Linux: `/etc/default/rustfs`, Docker/K8s: env vars).
3. **Set Domain**: Set `RUSTFS_SERVER_DOMAINS = "rustfs.com"`.
4. **Restart**: Restart the service (`systemctl restart rustfs`).

### Port in Domain (Optional)

If your domain is accessed **with an explicit port**, include the port number in `RUSTFS_SERVER_DOMAINS`.

Example (`rustfs.com:9001`):

```ini
RUSTFS_SERVER_DOMAINS = "rustfs.com:9001"
```

This ensures that requests like:

```
http://test.rustfs.com:9001/
```

can be correctly resolved in Virtual Host Style mode.

> ⚠️ Note: The value of `RUSTFS_SERVER_DOMAINS` must exactly match the **Host header** (including the port, if present) used by the client request

