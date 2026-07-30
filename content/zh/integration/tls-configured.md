---
title: "TLS 配置"
description: "配置 TLS 以实现安全访问。"
---

配置 TLS 以实现安全访问。设置 `RUSTFS_TLS_PATH` 环境变量。

## 配置

### 前提条件

- 一个正在运行的 RustFS 实例（请参阅[安装指南](../installation/index.md)）。
- 一对证书（证书和密钥）。

**注意**：证书必须命名为 `rustfs_cert.pem` 和 `rustfs_key.pem`，并放置在指定路径中。

### Linux

1. 编辑 RustFS 实例配置文件（默认为 `/etc/default/rustfs`），并添加 `RUSTFS_TLS_PATH` 环境变量。

    ```bash
    # Edit RustFS instance configuration file
    sudo vi /etc/default/rustfs

    # Add RUSTFS_TLS_PATH environment variable
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**注意**：你可以为 `RUSTFS_TLS_PATH` 指定任意路径，但该路径必须同时包含 `rustfs_cert.pem` 和 `rustfs_key.pem`。

2. 重启 RustFS 实例。

    ```bash
    systemctl restart rustfs
    ```

TLS 现在同时应用于两个监听器：位于 `https://rustfs.example.com:9000` 的 S3 API，以及位于 `https://rustfs.example.com:9001` 的控制台。

### Docker

1. 通过 `-v` 挂载证书路径，并指定 `RUSTFS_TLS_PATH`（通过 `-e`）。

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

2. 重启 RustFS 实例容器，然后通过 `https://rustfs.example.com:9000` 访问 S3 API，通过 `https://rustfs.example.com:9001` 访问控制台。

**注意**：由于 RustFS 实例容器默认以 `rustfs` 用户身份运行，你需要确保 `rustfs_key.pem` 和 `rustfs_cert.pem` 证书文件归 `rustfs` 用户所有，否则 RustFS 实例会因权限问题而无法读取证书文件，导致 TLS 配置失败。