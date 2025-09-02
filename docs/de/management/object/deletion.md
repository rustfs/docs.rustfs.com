---
title: "RustFS Objektlöschung"
description: "Objekte können in der RustFS UI oder über MinIO Client und API gelöscht werden."
---

# RustFS Objekte

Objekte (Objects) sind die grundlegenden Einheiten des RustFS-Speichers und enthalten Daten, Metadaten und einen eindeutigen Identifikator (Object Key). Daten werden in Form von Objekten gespeichert. In diesem Kapitel wird die Objektverwaltung am Beispiel des Hochladens und Löschens von Dateien vorgestellt.

> Informationen zu objektbezogenen Konzepten finden Sie im Kapitel [Kernkonzepte](../../concepts/glossary.md).

## Objekte löschen

Objekte können ebenfalls in der UI, mit `mc` oder über API gelöscht werden. Zum Beispiel können Sie die in den obigen Schritten erstellten Dateien löschen, um die Objektlöschung abzuschließen.

## Dateien in der RustFS UI löschen

1. Melden Sie sich bei der RustFS UI-Konsole an.
1. Wählen Sie den Speicher-Bucket aus, aus dem Sie Dateien löschen möchten.
1. Wählen Sie auf der Speicher-Bucket-Seite die zu löschenden Dateien aus.
1. Klicken Sie auf **Ausgewählte löschen** oben rechts und klicken Sie im Popup-Dialog auf **Bestätigen**, um das Löschen der Dateien abzuschließen.

![Objeklöschung aus UI](images/delete_file_from_ui.png)

### Dateien mit `mc` löschen

Verwenden Sie den `mc rm` Befehl, um Dateien zu löschen:

```
# Datei löschen
mc rm rustfs/bucket-creation-by-mc/1.txt
Removed `rustfs/bucket-creation-by-mc/1.txt`.

# Löschung bestätigen
mc ls  rustfs/bucket-creation-by-mc/1.txt
```

Sie können in der RustFS UI bestätigen, dass die Datei gelöscht wurde.

### Dateien mit API löschen

Verwenden Sie die folgende API zum Löschen von Dateien:

```
DELETE /{bucketName}/{objectName} HTTP/1.1
```

Anfrage-Beispiel:

```
curl --location --request DELETE 'http://12.34.56.78:9000/bucket-creation-by-api/password.txt' \
--header 'Content-Type: text/plain' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T030822Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=1ee63bb0b699598602b2fdbd013e355a57bcb9991307a8ad41f6512e8afebf3a' \
--data-binary '@/Users/jhma/Desktop/password.txt'
```

Sie können in der RustFS UI bestätigen, dass die Datei gelöscht wurde.
