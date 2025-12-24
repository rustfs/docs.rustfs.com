---
title: "TLS Configuration"
description: "Configure TLS for secure access."
---

# TLS Configuration

Configure TLS for secure access. Set the `RUSTFS_TLS_PATH` environment variable.

## Configuration

### Prerequisites

- A running RustFS instance (see [Installation Guide](../installation/index.md)).
- Certificate pair (cert and key).

**Note**: Certificates must be named `rustfs_cert.pem` and `rustfs_key.pem` and placed in the specified path.

### Linux

1. Edit the RustFS instance configuration file (default `/etc/default/rustfs`) and add the `RUSTFS_TLS_PATH` environment variable.

    ```bash
    # Edit RustFS instance configuration file
    sudo vi /etc/default/rustfs

    # Add RUSTFS_TLS_PATH environment variable
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**Note**: You can specify any path for `RUSTFS_TLS_PATH`, but it must contain both `rustfs_cert.pem` and `rustfs_key.pem`.

2. Restart the RustFS instance.

    ```bash
    systemctl restart rustfs
    ```

Access via `https://rustfs.example.com:9001`.

### Docker

1. Mount the certificate path via `-v` and specify `RUSTFS_TLS_PATH` via `-e`.

    ```bash
        docker pull rustfs/rustfs:latest
        docker run -d \
        --name rustfs \
        -e RUSTFS_TLS_PATH="/opt/tls/"
        -v /opt/tls:/opt/tls \
        -p 9000:9000 \
        -p 9001:9001 \
        -v /data:/data \
        rustfs/rustfs:latest
    ```

2. Restart the RustFS instance container, then access the instance through `https://rustfs.example.com:9001`.

**Note**: Since the RustFS instance container runs as `rustfs` user by default, you need to ensure that the certificate files (`rustfs_key.pem` and `rustfs_cert.pem`) belong to the `rustfs` user, otherwise the RustFS instance will fail to read the certificate files due to permission issues, causing TLS configuration to fail.
