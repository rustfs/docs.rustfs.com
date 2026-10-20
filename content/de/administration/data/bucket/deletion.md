---
title: "Bucket löschen"
description: "Löschen Sie Buckets über die RustFS-Oberfläche, mit rc oder über die S3-API."
---

In dieser Anleitung löschen Sie Buckets über die RustFS-Oberfläche, mit `rc` oder über die S3-API.

## Voraussetzungen

- Installieren und konfigurieren Sie [`rc`](/de/operations/rc), bevor Sie den Kommandozeilenablauf verwenden.
- Leeren Sie den Ziel-Bucket, bevor Sie ihn löschen, oder verwenden Sie `--force` erst, nachdem Sie die Objekte geprüft haben, die entfernt werden.

:::warning[Das Löschen ist endgültig]

Das Löschen eines Buckets lässt sich nicht rückgängig machen und kann Anwendungen beeinträchtigen, die davon abhängen. Sichern Sie alle Daten, die Sie behalten müssen, bevor Sie fortfahren.

:::

## RustFS-Oberfläche verwenden

1. Melden Sie sich an der RustFS-Console an.
2. Wählen Sie auf der Startseite den Bucket, den Sie löschen möchten.
3. Wählen Sie ganz rechts die Schaltfläche **Delete** (Löschen).
4. Wählen Sie im Bestätigungsdialog **Confirm** (Bestätigen).

![Bucket-Löschung](images/bucket-deletion-on-ui.png)

## `rc` verwenden

Installation und Alias-Konfiguration stehen in der [`rc`-Anleitung](/de/operations/rc).

Löschen Sie einen Bucket:

```bash
rc bucket remove rustfs/my-bucket
```

```text
✓ Bucket 'rustfs/my-bucket' removed successfully.
```

## API verwenden

Löschen Sie einen Bucket über die API:

```http
DELETE /{bucketName} HTTP/1.1
```

S3-Anfragen müssen mit AWS Signature V4 signiert sein. Verwenden Sie deshalb einen S3-Client, anstatt Header von Hand zu setzen. Mit der für Ihre Zugriffsschlüssel konfigurierten [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html):

```bash
aws s3api delete-bucket \
  --bucket bucket-creation-by-api \
  --endpoint-url http://localhost:9000
```

Prüfen Sie die Löschung des Buckets in der RustFS-Console.
