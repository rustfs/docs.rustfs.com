---
title: "TLS の設定"
description: "Linux と Docker で、RustFS の S3 API と Console に TLS を有効にします。"
---

安全にアクセスできるよう TLS を設定します。環境変数 `RUSTFS_TLS_PATH` を設定します。

## 設定

### 前提条件

- 稼働している RustFS インスタンス（[インストールガイド](../installation/index.md) を参照）。
- TLS 証明書と、対になる秘密鍵。

**注意**: 証明書のファイル名は `rustfs_cert.pem` と `rustfs_key.pem` である必要があり、指定したパスに配置します。

### Linux

1. RustFS インスタンスの設定ファイル（既定は `/etc/default/rustfs`）を編集し、環境変数 `RUSTFS_TLS_PATH` を追加します。

    ```bash
    # Edit RustFS instance configuration file
    sudo vi /etc/default/rustfs

    # Add RUSTFS_TLS_PATH environment variable
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**注意**: `RUSTFS_TLS_PATH` には任意のパスを指定できますが、`rustfs_cert.pem` と `rustfs_key.pem` の両方が含まれている必要があります。

2. RustFS インスタンスを再起動します。

    ```bash
    systemctl restart rustfs
    ```

これで TLS は両方のリスナーに適用されます。S3 API は `https://rustfs.example.com:9000` 、Console は `https://rustfs.example.com:9001` です。

### Docker

1. `-v` で証明書のパスをマウントし、`-e` で `RUSTFS_TLS_PATH` を指定します。

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

2. RustFS インスタンスのコンテナを再起動したあと、S3 API は `https://rustfs.example.com:9000` 、Console は `https://rustfs.example.com:9001` でアクセスします。

:::note[証明書ファイルの所有者]

RustFS コンテナは既定でユーザー `rustfs`（UID `10001`）として動作します。`rustfs_key.pem` と `rustfs_cert.pem` の所有者がこのユーザーであることを確認します。所有者でない場合、RustFS は証明書を読み取れず、TLS は起動に失敗します。

:::
