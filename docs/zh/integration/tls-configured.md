---
title: "RustFS TLS 配置指南"
description: "为 RustFS 实例配置 TLS,通过 HTTPS 访问 RustFS,实现安全的文件存储和访问."
---

# RustFS TLS 配置

RustFS 支持通过[配置 TLS](../integration/tls-configured.md)来以更加安全的方式访问和使用 RustFS 实例。需要通过环境变量 `RUSTFS_TLS_PATH` 指定 TLS 所需证书路径。

## 配置

### 前提条件

- 一个可用的 RustFS 实例（安装详情可查看[安装指南](../installation/index.md)
- 可用的证书对（包含证书文件和私钥文件）

**注意**：证书对的名称必须为 `rustfs_cert.pem` 和 `rustfs_key.pem`，并放置在指定的证书路径中。

### 配置步骤

* Linux 安装

1.  编辑 RustFS 实例的配置文件（默认文件为 `/etc/default/rustfs`），添加 `RUSTFS_TLS_PATH` 环境变量。

    ```bash
    # 编辑 RustFS 实例的配置文件
    sudo vi /etc/default/rustfs

    # 添加 RUSTFS_TLS_PATH 环境变量
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**注意**：可以为 `RUSTFS_TLS_PATH` 指定任意路径，但是必须包含 `rustfs_cert.pem` 和 `rustfs_key.pem` 两个文件。

2.  重启 RustFS 实例，使配置生效。

    ```bash
    systemctl restart rustfs
    ```

通过 `https://rustfs.example.com:9001` 访问实例。


* Docker 安装

1. 通过 `-v` 参数挂载证书路径，并通过 `-e` 参数指定 `RUSTFS_TLS_PATH` 环境变量。

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

1. 重启 RustFS 实例容器，然后通过 `https://rustfs.example.com:9001` 访问实例。

**注意**：由于 RustFS 实例容器默认以 `rustfs` 用户运行，因此需要确保证书文件（`rustfs_key.pem` 和 `rustfs_cert.pem`）的用户为 `rustfs`，否则会出现 RustFS 实例因为权限问题而无法读取证书文件，导致 TLS 配置失败。
