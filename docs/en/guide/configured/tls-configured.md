---
title: "RustFS TLS Configuration Guide"
description: "Configure TLS for RustFS instances to access RustFS via HTTPS, ensuring secure file storage and access."
---

# RustFS TLS Configuration

RustFS supports [configuring TLS](../../installation/security-checklists.md#2-network-transport-encryption-tlsssl) to enable more secure access and usage of RustFS instances. You need to specify the certificate path required for TLS using the environment variable `RUSTFS_TLS_PATH`.

## Configuration

### Prerequisites

- A working RustFS instance (see the [installation guide](../../en/installation/index.md) for details)
- An available certificate pair (including the certificate file and the private key file)

**Note**: The certificate pair must be named `rustfs_cert.pem` and `rustfs_key.pem`, and placed in the specified certificate path.

### Configuration Steps

* Linux Installation

1. Edit the RustFS instance configuration file (the default file is `/etc/default/rustfs`) and add the `RUSTFS_TLS_PATH` environment variable.

    ```bash
    # Edit the RustFS instance configuration file
    sudo vi /etc/default/rustfs

    # Add the RUSTFS_TLS_PATH environment variable
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**Note**: You can specify any path for `RUSTFS_TLS_PATH`, but it must contain both `rustfs_cert.pem` and `rustfs_key.pem`.

2. Restart the RustFS instance to apply the configuration.

    ```bash
    systemctl restart rustfs
    ```

Access the instance via `https://rustfs.example.com:9000`.


* Docker Installation

1. Mount the certificate path using the `-v` parameter and specify the `RUSTFS_TLS_PATH` environment variable using the `-e` parameter.

    ```bash
        docker pull rustfs/rustfs:latest
        docker run -d \
        --name rustfs \
        -e RUSTFS_TLS_PATH="/opt/tls/"
        -v /opt/tls:/opt/tls \
        -p 9000:9000 \
        -v /data:/data \
        rustfs/rustfs:latest
    ```

2. Restart the RustFS instance container, then access the instance via `https://rustfs.example.com:9000`.

**Note**: Since the RustFS instance container runs as the `rustfs` user by default, make sure the certificate files (`rustfs_key.pem` and `rustfs_cert.pem`) are owned by `rustfs`. Otherwise, the RustFS instance will fail to read the certificate files due to permission issues, causing the TLS configuration to fail.
