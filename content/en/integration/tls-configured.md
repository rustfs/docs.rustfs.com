---
title: "TLS Configuration"
description: "Enable TLS for the RustFS S3 API and Console on Linux and Docker."
---

Configure TLS for secure access. Set the `RUSTFS_TLS_PATH` environment variable.

## Configuration

### Prerequisites

- A running RustFS instance (see [Installation Guide](../installation/index.md)).
- A TLS certificate and its matching private key.

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

TLS now applies to both listeners: the S3 API at `https://rustfs.example.com:9000` and the Console at `https://rustfs.example.com:9001`.

### Docker

1. Mount the certificate path via `-v` and specify `RUSTFS_TLS_PATH` via `-e`.

    ```bash
        docker pull rustfs/rustfs:latest
        docker run -d \
        --name rustfs \
        -e RUSTFS_TLS_PATH="/opt/tls/" \
        -v /opt/tls:/opt/tls \
        -p 9000:9000 \
        -p 9001:9001 \
        -v /data:/data \
        rustfs/rustfs:latest
    ```

2. Restart the RustFS instance container, then access the S3 API at `https://rustfs.example.com:9000` and the Console at `https://rustfs.example.com:9001`.

:::note[Certificate file ownership]

The RustFS container runs as the `rustfs` user by default. Make sure that user owns `rustfs_key.pem` and `rustfs_cert.pem`. Otherwise, RustFS cannot read the certificates and TLS fails to start.

:::
