---
title: "SSE-S3"
description: "Konfigurieren Sie die vom Server verwaltete SSE-S3-Verschlüsselung für Buckets und Objektschreibvorgänge in RustFS."
---

SSE-S3 verwendet den S3-Verschlüsselungsmodus `AES256`. RustFS erzeugt für jedes verschlüsselte Objekt einen eigenen Datenverschlüsselungsschlüssel und umhüllt diesen Schlüssel mit dem konfigurierten KMS-Dienst. Clients stellen den Verschlüsselungsschlüssel weder bereit noch bewahren sie ihn auf.

## Anforderungen

- Konfigurieren und starten Sie [KMS](./kms.md), legen Sie den Standardschlüssel an und prüfen Sie, dass der Schlüssel verfügbar ist, bevor Sie SSE-S3 aktivieren.
- Installieren und konfigurieren Sie [`rc`](/de/operations/rc).
- Legen Sie den Ziel-Bucket an und prüfen Sie, dass gewöhnliche Objektschreibvorgänge gelingen.

:::warning[KMS muss verfügbar sein]

RustFS akzeptiert einen SSE-S3-Bucket-Standard auch dann, wenn KMS nicht verfügbar ist. Verschlüsselte Objektschreibvorgänge schlagen dann jedoch fehl. Prüfen Sie einen verschlüsselten Schreib- und Lesevorgang, bevor Sie den Bucket für Produktionsdaten verwenden.

:::

## Bucket-Standardverschlüsselung setzen

Wenden Sie SSE-S3 auf neue Schreibvorgänge an, die keinen Verschlüsselungsmodus auf Objektebene angeben:

```bash
rc bucket encryption set rustfs/my-bucket --mode sse-s3
rc bucket encryption info rustfs/my-bucket
```

Der gemeldete Modus sollte `SSE-S3` sein.

Laden Sie ein Testobjekt hoch und lesen Sie es:

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object show rustfs/my-bucket/hello.txt
```

## Ein Objekt ausdrücklich verschlüsseln

Wenden Sie SSE-S3 auf ein einzelnes Ziel an, ohne den Bucket-Standard zu ändern:

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	--enc-s3 rustfs/my-bucket/hello.txt
```

Bei rekursiven Schreibvorgängen muss die Verschlüsselungsauswahl exakt dem Zielpräfix entsprechen:

```bash
rc object copy ./reports/ rustfs/my-bucket/reports/ --recursive \
	--enc-s3 rustfs/my-bucket/reports/
```

## Bucket-Standard entfernen

Entfernen Sie die Standardregel:

```bash
rc bucket encryption clear rustfs/my-bucket
rc bucket encryption info rustfs/my-bucket
```

Das Entfernen oder Ändern des Bucket-Standards betrifft nur spätere Schreibvorgänge. Vorhandene Objekte werden dadurch weder entschlüsselt noch neu geschrieben.

## Anfrage-Header

S3-Clients fordern SSE-S3 so an:

```http
x-amz-server-side-encryption: AES256
```

Eine Anfrage auf Objektebene überschreibt den Bucket-Standard für diesen Schreibvorgang. Wird kein Modus auf Objektebene angegeben, ermittelt RustFS den wirksamen Modus aus der Verschlüsselungskonfiguration des Buckets.

## Nächste Schritte

Verwenden Sie [SSE-KMS](./kms.md#verify-kms-backed-encryption), wenn Sie eine ausdrückliche KMS-Schlüssel-ID benötigen, oder vergleichen Sie [SSE-C](./sse-c.md) für Schlüssel, die der Client behält.
