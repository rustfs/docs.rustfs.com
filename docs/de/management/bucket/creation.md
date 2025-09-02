---
title: "RustFS Speicher-Bucket-Erstellung"
description: "Speicher-Buckets können in der RustFS UI oder über MinIO Client und API erstellt werden."
---

# RustFS Speicher-Bucket-Erstellung

Dieses Kapitel teilt die Erstellung von Speicher-Buckets über RustFS UI, `mc` (MinIO Client) oder API.

## Speicher-Bucket erstellen

Voraussetzungen:

- Eine verfügbare RustFS-Instanz. Siehe [Installationsanleitung](../../installation/index.md) für die Installation.

## Speicher-Bucket in RustFS UI erstellen

1. Melden Sie sich in der RustFS UI-Konsole an.
1. Auf der Startseite, oben links, wählen Sie **Speicher-Bucket erstellen**.
1. Geben Sie den Speicher-Bucket-Namen ein, klicken Sie auf **Erstellen**, um die Erstellung des Speicher-Buckets abzuschließen.

![bucket creation](images/bucket-creation-by-ui.png)

### Speicher-Bucket mit `mc` erstellen

> Für die Installation und Konfiguration von `mc` siehe das Kapitel [`mc` Verwendungsanleitung](../../developer/mc.md).

Verwenden Sie den `mc mb`-Befehl, um einen Speicher-Bucket zu erstellen:

```
# creat rustfs bucket
mc mb rustfs/bucket-creation-by-mc
Bucket created successfully `rustfs/bucket-creation-by-mc`.

# confirm bucket creation
mc ls rustfs/bucket-creation-by-mc
```

### Speicher-Bucket mit API erstellen

Verwenden Sie die folgende API, um einen Speicher-Bucket zu erstellen:

```
PUT /{bucketName} HTTP/1.1
```

Anfragebeispiel:

```
curl --location --request PUT 'http://12.34.56.78:9000/bucket-creation-by-api' \
--header 'X-Amz-Content-Sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' \
--header 'X-Amz-Date: 20250801T023519Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=H4xcBZKQfvJjEnk3zp1N/20250801/cn-east-1/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=c2fb2ba5199a30ebcfa9976d0f35000ba274da3701327957e84ea0f3920288f2'
```

In der RustFS UI können Sie bestätigen, dass der Speicher-Bucket `bucket-creation-by-api` erfolgreich erstellt wurde.
