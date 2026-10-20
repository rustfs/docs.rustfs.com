---
title: "Bucket erstellen"
description: "Erstellen Sie Buckets über die RustFS-Oberfläche, mit rc oder über die S3-API."
---

In dieser Anleitung erstellen Sie Buckets über die RustFS-Console, mit `rc` oder über die S3-API.

## Voraussetzungen

- Eine laufende RustFS-Instanz (siehe [Installationsanleitung](../../../installation/index.md)).
- [`rc`](/de/operations/rc), installiert und mit einem Alias für den Kommandozeilenablauf konfiguriert.

## RustFS-Console verwenden

1. Melden Sie sich an der RustFS-Console an.
2. Wählen Sie auf der Seite **Buckets** oben rechts **Create Bucket** (Bucket erstellen).
3. Geben Sie einen Bucket-Namen ein und wählen Sie **Create** (Erstellen).

![Bucket-Erstellung](images/bucket-creation-by-ui.png)

## `rc` verwenden

Installation und Alias-Konfiguration stehen in der [`rc`-Anleitung](/de/operations/rc).

Erstellen Sie einen Bucket:

```bash
rc bucket create rustfs/my-bucket
rc bucket list rustfs/
```

```text
✓ Bucket 'rustfs/my-bucket' created successfully.
```

## API verwenden

Erstellen Sie einen Bucket über die API:

```http
PUT /{bucketName} HTTP/1.1
```

S3-Anfragen müssen mit AWS Signature V4 signiert sein. Verwenden Sie deshalb einen S3-Client, anstatt Header von Hand zu setzen. Mit der für Ihre Zugriffsschlüssel konfigurierten [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html):

```bash
aws s3api create-bucket \
  --bucket bucket-creation-by-api \
  --endpoint-url http://localhost:9000
```

Prüfen Sie in der RustFS-Console, dass der Bucket angezeigt wird.
