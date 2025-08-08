---
title: "Verwaltung von RustFS‑Objekten"
description: "Erstellen (Upload) und Löschen von Objekten"
---

# RustFS‑Objekte

Ein Objekt ist die Basiseinheit der Speicherung in RustFS. Es enthält Daten, Metadaten und einen eindeutigen Bezeichner (Object Key). Dieses Kapitel zeigt die Objektverwaltung am Beispiel von Datei‑Upload und ‑Löschung.

> Zu objektbezogenen Begriffen siehe [Grundlagen](../../concepts/glossary.md).

## Objekt erstellen

Voraussetzungen:

- Eine verfügbare RustFS‑Instanz (siehe ../../installation/index.md).

Erstellen Sie zunächst einen [Bucket](bucket-create-and-delete.md) und laden Sie anschließend eine Datei in diesen Bucket hoch. Das kann über die UI, `mc` oder die API erfolgen.

### Upload über die RustFS‑UI

1. Melden Sie sich an der RustFS UI‑Konsole an.
1. Wählen Sie den Ziel‑Bucket aus.
1. Rechts oben auf der Bucket‑Seite wählen Sie „Neuer Ordner“, „Neue Datei“ oder „Datei/Ordner hochladen“.
1. Für lokale Uploads klicken Sie auf „Datei/Ordner hochladen“, wählen die lokalen Elemente aus und klicken auf „Upload starten“.

![object creation from ui](images/upload_file_from_ui.png)

Nach dem Upload können Sie Details des Objekts einsehen.

![object details info](images/object_details_info.png)

### Upload mit `mc`

> Siehe [`mc`‑Leitfaden](../mc.md).

```
# upload file
mc cp 1.txt rustfs/bucket-creation-by-mc
/tmp/1.txt:            13 B / 13 B  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  61 B/s 0s%

# confirm file uploaded
mc ls rustfs/bucket-creation-by-mc
[2025-08-01 10:01:08 CST]    13B 1.txt
```

### Upload per API

```
PUT /{bucketName}/{objectName} HTTP/1.1
```

Beispiel:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T024840Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=b7d8dc29ee34dfdf1f3e9e8e069892a8936f478586e7a2c90cf34f5b86d3a2dc' \
--data-binary '@/path/to/password.txt'
```

## Objekt löschen

Das Löschen kann über die UI, `mc` oder die API erfolgen. Löschen Sie z. B. die oben erstellte Datei.

## Löschung über die RustFS‑UI

1. Melden Sie sich an der RustFS UI‑Konsole an.
1. Wählen Sie den Bucket, der die Datei enthält.
1. Wählen Sie die zu löschende Datei aus.
1. Klicken Sie rechts oben auf „Ausgewählte löschen“ und bestätigen Sie im Dialog.

![object deletion from ui](images/delete_file_from_ui.png)

### Löschen mit `mc`

```
# delete file
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# confirm deletion
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

### Löschen per API

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Beispiel:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```