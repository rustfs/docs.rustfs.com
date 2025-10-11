---
title: "RustFS TLS Configuration Guide"
description: "Configure TLS for RustFS instances to access RustFS through HTTPS, achieving secure file storage and access."
---

# RustFS TLS Configuration

RustFS supports configuring TLS to access and use RustFS instances in a more secure way. You need to specify the TLS certificate path through the environment variable `RUSTFS_TLS_PATH`.

## Configuration

### Prerequisites

- An available RustFS instance (see [Installation Guide](../installation/index.md) for installation details)
- Available certificate pair (containing certificate file and private key file)

**Note**: The certificate pair names must be `rustfs_cert.pem` and `rustfs_key.pem`, and placed in the specified certificate path.

### Configuration Steps

* Linux Installation

1. Edit the RustFS instance configuration file (default file is `/etc/default/rustfs`), add the `RUSTFS_TLS_PATH` environment variable.

    ```bash
    # Edit RustFS instance configuration file
    sudo vi /etc/default/rustfs

    # Add RUSTFS_TLS_PATH environment variable
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**Note**: You can specify any path for `RUSTFS_TLS_PATH`, but it must contain both `rustfs_cert.pem` and `rustfs_key.pem` files.

2. Restart the RustFS instance to make the configuration effective.

    ```bash
    systemctl restart rustfs
    ```

Access the instance through `https://rustfs.example.com:9001`.

* Docker Installation

1. Mount the certificate path through the `-v` parameter, and specify the `RUSTFS_TLS_PATH` environment variable through the `-e` parameter.

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
