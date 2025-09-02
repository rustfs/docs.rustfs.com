---
title: "RustFS Speicher-Bucket-Löschung"
description: "Speicher-Buckets können in der RustFS UI oder über MinIO Client und API gelöscht werden."
---

# RustFS Speicher-Bucket-Löschung

Dieses Kapitel teilt die Löschung von Speicher-Buckets über RustFS UI, `mc` (MinIO Client) oder API.

**Hinweis**: Speicher-Buckets sind wichtige Komponenten für die Datenspeicherung. Das Löschen von Speicher-Buckets kann zu Fehlern in Anwendungen führen, die diesen Speicher-Bucket verwenden. Bevor Sie einen Speicher-Bucket löschen, stellen Sie bitte sicher, dass Sie alle Daten im Speicher-Bucket gesichert haben und diesen Speicher-Bucket nicht mehr benötigen.

## Speicher-Bucket in RustFS UI löschen

1. Melden Sie sich in der RustFS UI-Konsole an.
1. Auf der Startseite wählen Sie den zu löschenden Speicher-Bucket aus.
1. Wählen Sie ganz rechts die **Löschen**-Schaltfläche.
1. Klicken Sie im erscheinenden Dialogfeld auf **Bestätigen**, um die Löschung des Speicher-Buckets abzuschließen.

![bucket deletion](images/bucket-deletion-on-ui.png)

## Speicher-Bucket mit `mc` löschen

Für die Installation und Konfiguration von `mc` siehe das Kapitel [`mc` Verwendungsanleitung](../../developer/mc.md).

Verwenden Sie den `mc rb`-Befehl, um einen Speicher-Bucket zu löschen:

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

## Speicher-Bucket mit API löschen

Verwenden Sie die folgende API, um einen Speicher-Bucket zu löschen:

```
DELETE /{bucketName} HTTP/1.1
```

Anfragebeispiel:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

Sie können in der RustFS UI bestätigen, dass der Speicher-Bucket `bucket-creation-by-api` gelöscht wurde.
