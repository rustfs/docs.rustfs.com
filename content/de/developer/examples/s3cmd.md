---
title: "s3cmd"
description: "Verbinden Sie s3cmd mit RustFS und führen Sie grundlegende Objektoperationen über die Befehlszeile aus."
---

[s3cmd](https://s3tools.org/s3cmd) ist ein Befehlszeilenclient für S3-kompatiblen Speicher. Richten Sie s3cmd mit einer kleinen Konfigurationsdatei auf Ihren RustFS-Endpunkt aus.

## Installation

```bash
# macOS
brew install s3cmd
# Debian/Ubuntu
sudo apt install s3cmd
# or via pip
pip install s3cmd
```

## Konfiguration

Legen Sie `~/.s3cfg` an. Ersetzen Sie `localhost:9000` durch Ihre Serveradresse und verwenden Sie Ihre eigenen [Zugriffsschlüssel](../../security-compliance/iam/access-token.md). RustFS verwendet pfadbasierte Adressierung (Path-Style). Setzen Sie den Bucket-Host daher auf denselben Endpunkt:

```ini title="~/.s3cfg"
[default]
access_key = <your-access-key>
secret_key = <your-secret-key>
host_base = localhost:9000
host_bucket = localhost:9000
use_https = False
signature_v2 = False
```

:::note

Setzen Sie `use_https = True` und verwenden Sie Port `9000`, wenn Sie [TLS eingerichtet](../../integration/tls-configured.md) haben.

:::

## Überprüfung

Erstellen Sie einen Bucket, laden Sie eine Datei hoch und listen Sie ihn auf:

```bash
s3cmd mb s3://my-bucket
s3cmd put /path/to/hello.txt s3://my-bucket/hello.txt
s3cmd ls s3://my-bucket
```

```text
upload: '/path/to/hello.txt' -> 's3://my-bucket/hello.txt'  [1 of 1]
2026-07-16 10:00        12   s3://my-bucket/hello.txt
```

## Nächste Schritte

Lesen Sie die [SDK-Übersicht](../sdk/index.md), um eine Anwendung anzubinden, oder verwalten Sie Objekte mit [`rc`](/de/operations/rc).
