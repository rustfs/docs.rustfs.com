---
title: "RustFS Objekterstellung"
description: "Objekte können in der RustFS UI oder über MinIO Client und API erstellt werden."
---

# RustFS Objekte

Objekte (Objects) sind die grundlegenden Einheiten des RustFS-Speichers und enthalten Daten, Metadaten und einen eindeutigen Identifikator (Object Key). Daten werden in Form von Objekten gespeichert. In diesem Kapitel wird die Objektverwaltung am Beispiel des Hochladens und Löschens von Dateien vorgestellt.

> Informationen zu objektbezogenen Konzepten finden Sie im Kapitel [Kernkonzepte](../../concepts/glossary.md).

## Objekte erstellen

Voraussetzungen:

- Eine verfügbare RustFS-Instanz. Siehe [Installationsanleitung](../../installation/index.md) für die Installation.

[Erstellen Sie einen Speicher-Bucket](../bucket/creation.md), dann laden Sie Dateien in den Speicher-Bucket hoch, um die Objekterstellung abzuschließen. Dateien können über die RustFS UI, `mc` oder API hochgeladen werden.

### Dateien in der RustFS UI hochladen

1. Melden Sie sich bei der RustFS UI-Konsole an.
1. Wählen Sie den Speicher-Bucket aus, in den Sie Dateien hochladen möchten.
1. Auf der Speicher-Bucket-Seite, oben rechts, wählen Sie **Neues Verzeichnis**, **Neue Datei** oder **Datei/Ordner hochladen**, um die Erstellung von Dateien/Ordnern abzuschließen.
1. Um Dateien/Ordner vom lokalen System hochzuladen. Klicken Sie auf die Schaltfläche **Datei/Ordner hochladen**, wählen Sie lokale Dateien/Ordner aus und klicken Sie auf **Upload starten**, um das Hochladen der Dateien abzuschließen.

![Objekterstellung aus UI](images/upload_file_from_ui.png)

Nach dem Upload können Sie auf das Objekt klicken, um detaillierte Informationen zum Objekt anzuzeigen.

### Dateien mit MinIO Client hochladen

Verwenden Sie den `mc cp` Befehl, um Dateien hochzuladen:

```
mc cp /path/to/local/file rustfs/bucket-name/
```

Antwort:

```
/path/to/local/file: 1.2 MiB / 1.2 MiB [================================] 100.00% 2.1 MiB/s 0s
```

### Dateien mit API hochladen

Verwenden Sie die S3-kompatible API, um Dateien hochzuladen:

```bash
curl -X PUT \
  -H "Authorization: AWS4-HMAC-SHA256 Credential=ACCESS_KEY/20230801/us-east-1/s3/aws4_request, SignedHeaders=host;x-amz-date, Signature=..." \
  -H "x-amz-date: 20230801T120000Z" \
  -H "Content-Type: application/octet-stream" \
  http://rustfs.example.com:9000/bucket-name/object-key \
  --data-binary @/path/to/local/file
```

## Objektmetadaten

Jedes Objekt enthält Metadaten, die Informationen über das Objekt bereitstellen:

- **Object Key**: Eindeutiger Identifikator des Objekts
- **Content-Type**: MIME-Typ des Objekts
- **Content-Length**: Größe des Objekts in Bytes
- **Last-Modified**: Zeitstempel der letzten Änderung
- **ETag**: Entity-Tag für Versionskontrolle
- **Custom Metadata**: Benutzerdefinierte Metadaten

## Objektversionierung

RustFS unterstützt Objektversionierung, die es ermöglicht, mehrere Versionen desselben Objekts zu speichern:

1. Aktivieren Sie die Versionierung für den Speicher-Bucket
2. Jedes Mal, wenn ein Objekt mit demselben Schlüssel hochgeladen wird, wird eine neue Version erstellt
3. Alle Versionen werden beibehalten, bis sie explizit gelöscht werden

## Objektverschlüsselung

RustFS unterstützt verschiedene Verschlüsselungsoptionen:

- **Server-Side Encryption (SSE-S3)**: Verschlüsselung mit RustFS-verwalteten Schlüsseln
- **Server-Side Encryption with Customer-Provided Keys (SSE-C)**: Verschlüsselung mit kundenseitig bereitgestellten Schlüsseln
- **Server-Side Encryption with KMS (SSE-KMS)**: Verschlüsselung mit KMS-verwalteten Schlüsseln

## Objektzugriffskontrolle

RustFS unterstützt verschiedene Zugriffskontrollmechanismen:

- **Bucket Policies**: Bucket-weite Zugriffsrichtlinien
- **Object ACLs**: Objekt-spezifische Zugriffskontrolllisten
- **IAM Policies**: Identitäts- und Zugriffsverwaltungsrichtlinien

## Best Practices

1. **Objektbenennung**: Verwenden Sie aussagekräftige und konsistente Objektschlüssel
2. **Metadaten**: Fügen Sie relevante Metadaten hinzu, um die Objektverwaltung zu verbessern
3. **Verschlüsselung**: Aktivieren Sie die Verschlüsselung für sensible Daten
4. **Versionierung**: Aktivieren Sie die Versionierung für kritische Objekte
5. **Zugriffskontrolle**: Implementieren Sie angemessene Zugriffskontrollen
