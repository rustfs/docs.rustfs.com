---
title: "Objekt löschen"
description: "Löschen Sie Objekte über die RustFS-Oberfläche, mit rc oder über die S3-API."
---

Diese Anleitung beschreibt das Löschen von Objekten.

## Voraussetzungen

- Installieren und konfigurieren Sie [`rc`](/de/operations/rc), bevor Sie den Kommandozeilenablauf verwenden.
- Prüfen Sie Alias, Bucket und Objektschlüssel, bevor Sie ein Objekt löschen.

## RustFS-Oberfläche verwenden

1. Melden Sie sich an der RustFS-Console an.
2. Wählen Sie den Bucket, der das zu löschende Objekt enthält.
3. Wählen Sie auf der Bucket-Seite das zu löschende Objekt aus.
4. Wählen Sie oben rechts **Delete Selected Items** (Ausgewählte Elemente löschen) und anschließend **Confirm** (Bestätigen).

![Objektlöschung über die Oberfläche](images/delete_file_from_ui.png)

## `rc` verwenden

Löschen Sie ein Objekt:

```bash
rc object remove rustfs/my-bucket/hello.txt
rc object list rustfs/my-bucket
```

```text
Removed: rustfs/my-bucket/hello.txt
✓ Removed 1 object(s).
```

Prüfen Sie die Löschung in der RustFS-Console.

## API verwenden

Löschen Sie ein Objekt über die API:

```http
DELETE /{bucketName}/{objectName} HTTP/1.1
```

S3-Anfragen müssen mit AWS Signature V4 signiert sein. Verwenden Sie deshalb einen S3-Client, anstatt Header von Hand zu setzen. Mit der für Ihre Zugriffsschlüssel konfigurierten [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html):

```bash
aws s3api delete-object \
  --bucket bucket-creation-by-api \
  --key hello.txt \
  --endpoint-url http://localhost:9000
```

Prüfen Sie die Löschung in der RustFS-Console.
