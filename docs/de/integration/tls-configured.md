---
title: "RustFS TLS-Konfigurationsanleitung"
description: "TLS für RustFS-Instanzen konfigurieren, über HTTPS auf RustFS zugreifen, sichere Dateispeicherung und -zugriff realisieren."
---

# RustFS TLS-Konfiguration

RustFS unterstützt den Zugriff auf und die Verwendung von RustFS-Instanzen auf sicherere Weise durch [TLS-Konfiguration](../integration/tls-configured.md). Es ist erforderlich, über die Umgebungsvariable `RUSTFS_TLS_PATH` den für TLS benötigten Zertifikatspfad anzugeben.

## Konfiguration

### Voraussetzungen

- Eine verfügbare RustFS-Instanz (Installationsdetails siehe [Installationsanleitung](../installation/index.md))
- Verfügbares Zertifikatspaar (einschließlich Zertifikatsdatei und Private-Key-Datei)

**Hinweis**: Die Namen des Zertifikatspaars müssen `rustfs_cert.pem` und `rustfs_key.pem` sein und im angegebenen Zertifikatspfad platziert werden.

### Konfigurationsschritte

- Linux-Installation

1. Bearbeiten Sie die Konfigurationsdatei der RustFS-Instanz (Standarddatei ist `/etc/default/rustfs`), fügen Sie die Umgebungsvariable `RUSTFS_TLS_PATH` hinzu.

    ```bash
    # Bearbeiten Sie die Konfigurationsdatei der RustFS-Instanz
    sudo vi /etc/default/rustfs

    # Fügen Sie die Umgebungsvariable RUSTFS_TLS_PATH hinzu
    RUSTFS_TLS_PATH="/opt/tls"
    ```

**Hinweis**: Sie können einen beliebigen Pfad für `RUSTFS_TLS_PATH` angeben, aber er muss die beiden Dateien `rustfs_cert.pem` und `rustfs_key.pem` enthalten.

2. Starten Sie die RustFS-Instanz neu, um die Konfiguration wirksam zu machen.

    ```bash
    systemctl restart rustfs
    ```

Greifen Sie über `https://rustfs.example.com:9001` auf die Instanz zu.

- Docker-Installation

1. Mounten Sie den Zertifikatspfad über den `-v`-Parameter und geben Sie die Umgebungsvariable `RUSTFS_TLS_PATH` über den `-e`-Parameter an.

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

1. Starten Sie den RustFS-Instanz-Container neu, dann greifen Sie über `https://rustfs.example.com:9001` auf die Instanz zu.

**Hinweis**: Da der RustFS-Instanz-Container standardmäßig als `rustfs`-Benutzer läuft, müssen Sie sicherstellen, dass die Zertifikatsdateien (`rustfs_key.pem` und `rustfs_cert.pem`) dem `rustfs`-Benutzer gehören, sonst kann die RustFS-Instanz aufgrund von Berechtigungsproblemen die Zertifikatsdateien nicht lesen, was zu einem TLS-Konfigurationsfehler führt.
