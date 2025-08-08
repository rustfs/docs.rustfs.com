---
title: "Verwaltung von RustFS‑Buckets"
description: "Erstellen und Löschen von Buckets in RustFS"
---

# RustFS‑Buckets

Ein Bucket ist der logische Basis‑Container in RustFS zur Organisation und Verwaltung von Daten. Jeder Bucket hat einen eindeutigen Namen und kann mehrere Objekte enthalten. Buckets lassen sich über die RustFS‑UI, `mc` (MinIO Client) oder per API verwalten (erstellen, löschen, Upload/Download usw.).

## Bucket erstellen

Voraussetzungen:

- Eine verfügbare RustFS‑Instanz (siehe ../../installation/index.md).

## In der RustFS‑UI erstellen

1. Melden Sie sich an der RustFS UI‑Konsole an.
1. Klicken Sie auf der Startseite oben links auf „Bucket erstellen“.
1. Geben Sie den Bucket‑Namen ein und klicken Sie auf „Erstellen“.

![bucket creation](images/bucket-creation-by-ui.png)

### Mit `mc` erstellen

> Siehe [`mc`‑Leitfaden](../mc.md) zur Installation und Konfiguration.

```
# creat rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### Per API erstellen

```
PUT /{bucketName} HTTP/1.1
```

Beispiel:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

Sie können in der UI bestätigen, dass `bucket-creation-by-api` erfolgreich erstellt wurde.

## Bucket löschen

Achtung: Das Löschen eines Buckets kann Anwendungen beeinträchtigen, die ihn verwenden. Sichern Sie Daten und stellen Sie sicher, dass der Bucket nicht mehr benötigt wird.

### In der RustFS‑UI löschen

1. Melden Sie sich an der RustFS UI‑Konsole an.
1. Wählen Sie auf der Startseite den zu löschenden Bucket aus.
1. Klicken Sie ganz rechts auf „Löschen“.
1. Bestätigen Sie im Dialog mit „Bestätigen“.

![bucket deletion](images/bucket-deletion-on-ui.png)

### Mit `mc` löschen

> Siehe [`mc`‑Leitfaden](../mc.md).

```
# delete bucket
mc rb rustfs/bucket-creation-by-mc
Removed `rustfs/bucket-creation-by-mc` successfully.

# confirm bucket deletion
mc ls rustfs/bucket-creation-by-mc
mc: <ERROR> Unable to list folder. Bucket `bucket-creation-by-mc` does not exist.
```

### Per API löschen

```
DELETE /{bucketName} HTTP/1.1
```

Beispiel:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024406Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0f6addf09fffd7eef75191e9d3209bb7188e6b004e9707238fc60ad7033edae'
```

In der RustFS‑UI können Sie bestätigen, dass `bucket-creation-by-api` gelöscht wurde.