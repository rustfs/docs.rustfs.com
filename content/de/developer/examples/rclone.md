---
title: "rclone"
description: "Verbinden Sie rclone mit RustFS und führen Sie grundlegende Objektoperationen aus."
---

[rclone](https://rclone.org/) ist ein Befehlszeilenprogramm zum Synchronisieren von Dateien mit Cloud-Speicher und spricht das S3-Protokoll, das RustFS implementiert.

## Installation

```bash
curl https://rclone.org/install.sh | sudo bash
```

Oder lesen Sie die [offizielle Installationsanleitung](https://rclone.org/install/).

## Konfiguration

Fügen Sie in `~/.config/rclone/rclone.conf` ein Remote hinzu. Ersetzen Sie `http://localhost:9000` durch Ihre Serveradresse und verwenden Sie Ihre eigenen [Zugriffsschlüssel](../../security-compliance/iam/access-token.md). `force_path_style = true` ist erforderlich, weil RustFS pfadbasierte Adressierung (Path-Style) verwendet:

```ini title="~/.config/rclone/rclone.conf"
[rustfs]
type = s3
provider = Other
access_key_id = <your-access-key>
secret_access_key = <your-secret-key>
endpoint = http://localhost:9000
region = us-east-1
force_path_style = true
```

## Überprüfung

Erstellen Sie einen Bucket:

```bash
rclone mkdir rustfs:my-bucket
```

Laden Sie eine Datei hoch:

```bash
rclone copy /path/to/hello.txt rustfs:my-bucket
```

Listen Sie Buckets und Inhalte auf:

```bash
rclone lsd rustfs:
rclone ls rustfs:my-bucket
```

```text
          -1 2026-07-15 10:30:00        -1 my-bucket
       12 hello.txt
```

## Nächste Schritte

Schreiben Sie Anwendungen, die RustFS verwenden, mit einem [S3-SDK](../sdk/index.md), oder verwalten Sie Objekte mit [`rc`](/de/operations/rc).
