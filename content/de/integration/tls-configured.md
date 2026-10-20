---
title: "TLS-Konfiguration"
description: "Aktivieren Sie TLS für die S3-API und die Console von RustFS unter Linux und Docker."
---

Konfigurieren Sie TLS für den sicheren Zugriff. Setzen Sie die Umgebungsvariable `RUSTFS_TLS_PATH`.

## Konfiguration

### Voraussetzungen

- Eine laufende RustFS-Instanz (siehe [Installationsanleitung](../installation/index.md)).
- Ein TLS-Zertifikat und der zugehörige private Schlüssel.

**Hinweis**: Die Zertifikate müssen `rustfs_cert.pem` und `rustfs_key.pem` heißen und im angegebenen Pfad liegen.

### Linux

1. Bearbeiten Sie die Konfigurationsdatei der RustFS-Instanz (standardmäßig `/etc/default/rustfs`) und fügen Sie die Umgebungsvariable `RUSTFS_TLS_PATH` hinzu.

    ```bash
    # Edit RustFS instance configuration file
    sudo vi /etc/default/rustfs

    # Add RUSTFS_TLS_PATH environment variable
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**Hinweis**: Sie können für `RUSTFS_TLS_PATH` einen beliebigen Pfad angeben. Er muss jedoch sowohl `rustfs_cert.pem` als auch `rustfs_key.pem` enthalten.

2. Starten Sie die RustFS-Instanz neu.

    ```bash
    systemctl restart rustfs
    ```

TLS gilt danach für beide Listener: die S3-API unter `https://rustfs.example.com:9000` und die Console unter `https://rustfs.example.com:9001`.

### Docker

1. Hängen Sie den Zertifikatspfad mit `-v` ein und setzen Sie `RUSTFS_TLS_PATH` mit `-e`.

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

2. Starten Sie den Container der RustFS-Instanz neu und greifen Sie anschließend auf die S3-API unter `https://rustfs.example.com:9000` und die Console unter `https://rustfs.example.com:9001` zu.

:::note[Zugehörigkeit der Zertifikatsdateien]

Der RustFS-Container läuft standardmäßig als Benutzer `rustfs` (UID `10001`). Stellen Sie sicher, dass dieser Benutzer Eigentümer von `rustfs_key.pem` und `rustfs_cert.pem` ist. Andernfalls kann RustFS die Zertifikate nicht lesen und TLS startet nicht.

:::
