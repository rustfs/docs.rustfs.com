---
title: "RustFS TLS Yapılandırma Kılavuzu"
description: "RustFS örneği için TLS yapılandırması, HTTPS üzerinden RustFS'ye erişim, güvenli dosya depolama ve erişim sağlayın."
---

# RustFS TLS Yapılandırması

RustFS, [TLS yapılandırması](../integration/tls-configured.md) yoluyla RustFS örneğine daha güvenli bir şekilde erişimi ve kullanımı destekler. TLS için gerekli sertifika yolunu belirtmek üzere `RUSTFS_TLS_PATH` ortam değişkenini kullanmanız gerekir.

## Yapılandırma

### Ön Koşullar

- Kullanılabilir bir RustFS örneği (kurulum detayları için [Kurulum Kılavuzu](../installation/index.md)'na bakın)
- Kullanılabilir sertifika çifti (sertifika dosyası ve özel anahtar dosyası içeren)

**Not**: Sertifika çiftinin adları `rustfs_cert.pem` ve `rustfs_key.pem` olmalı ve belirtilen sertifika yoluna yerleştirilmelidir.

### Yapılandırma Adımları

* Linux Kurulumu

1. RustFS örneğinin yapılandırma dosyasını düzenleyin (varsayılan dosya `/etc/default/rustfs`), `RUSTFS_TLS_PATH` ortam değişkenini ekleyin.

    ```bash
    # RustFS örneğinin yapılandırma dosyasını düzenle
    sudo vi /etc/default/rustfs

    # RUSTFS_TLS_PATH ortam değişkenini ekle
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**Not**: `RUSTFS_TLS_PATH` için herhangi bir yol belirtebilirsiniz, ancak `rustfs_cert.pem` ve `rustfs_key.pem` dosyalarını içermelidir.

2. Yapılandırmanın etkili olması için RustFS örneğini yeniden başlatın.

    ```bash
    systemctl restart rustfs
    ```

`https://rustfs.example.com:9001` üzerinden örneğe erişin.

* Docker Kurulumu

1. Sertifika yolunu `-v` parametresi ile mount edin ve `RUSTFS_TLS_PATH` ortam değişkenini `-e` parametresi ile belirtin.

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

1. RustFS örnek konteynerini yeniden başlatın, ardından `https://rustfs.example.com:9001` üzerinden örneğe erişin.

**Not**: RustFS örnek konteyneri varsayılan olarak `rustfs` kullanıcısı ile çalıştığından, sertifika dosyalarının (`rustfs_key.pem` ve `rustfs_cert.pem`) kullanıcısının `rustfs` olduğundan emin olmalısınız, aksi takdirde izin sorunları nedeniyle RustFS örneği sertifika dosyalarını okuyamaz ve TLS yapılandırması başarısız olur.