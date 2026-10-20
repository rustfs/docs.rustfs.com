---
title: "SSE-C"
description: "Verwenden Sie vom Kunden bereitgestellte AES-256-Schlüssel für die Ver- und Entschlüsselung von Objekten in RustFS."
---

SSE-C verschlüsselt ein Objekt mit einem 256-Bit-Schlüssel, den der Client bei jeder Schreib- und Leseanfrage übergibt. RustFS prüft den Schlüssel und verwendet ihn für die Anfrage, speichert den Kundenschlüssel im Klartext jedoch nicht. SSE-C verwendet das KMS-Backend von RustFS nicht.

## Anforderungen

- Installieren und konfigurieren Sie [`rc`](/de/operations/rc).
- Installieren Sie OpenSSL für das Beispiel zur Schlüsselerzeugung.
- Verwenden Sie HTTPS, damit Kundenschlüssel während der Übertragung verschlüsselt sind.
- Speichern Sie den Kundenschlüssel in einem Secret-Manager und pflegen Sie eine Zuordnung zwischen jedem Objekt und seinem Schlüssel.

:::warning[Für jeden Lesezugriff ist derselbe Schlüssel erforderlich]

Wenn Sie einen SSE-C-Schlüssel verlieren, kann RustFS ihn nicht wiederherstellen und das Objekt wird unlesbar. Protokollieren Sie den Schlüssel nicht, übernehmen Sie ihn nicht in die Versionsverwaltung und senden Sie ihn nicht über eine unverschlüsselte Verbindung.

:::

## Kundenschlüssel vorbereiten

Erzeugen Sie 32 zufällige Bytes über eine hexadezimale Zwischenform und leiten Sie daraus den Base64-Schlüssel und seine Base64-kodierte MD5-Prüfsumme ab:

```bash
SSE_C_KEY_HEX=$(openssl rand -hex 32)
SSE_C_KEY_B64=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p | openssl base64 -A)
SSE_C_KEY_MD5=$(printf '%s' "$SSE_C_KEY_HEX" | xxd -r -p \
	| openssl dgst -md5 -binary | openssl base64 -A)
```

Übernehmen Sie diese Werte in Ihren freigegebenen Ablauf zur Geheimnisverwaltung. Geben Sie sie nicht im Terminal oder in der Shell-Historie aus.

## Verschlüsseltes Objekt hochladen

`rc 0.1.29` hat keine eigene SSE-C-Option. Die signierte Option für eigene Header kann die drei S3-SSE-C-Header senden:

```bash
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

Die erforderlichen Anfrage-Header sind:

| Header | Wert |
| --- | --- |
| `x-amz-server-side-encryption-customer-algorithm` | `AES256` |
| `x-amz-server-side-encryption-customer-key` | Base64-kodierter Schlüssel mit 32 Bytes |
| `x-amz-server-side-encryption-customer-key-md5` | Base64-kodierter MD5-Digest des Rohschlüssels |

## Verschlüsseltes Objekt lesen

Übergeben Sie dieselben drei Header bei Lesezugriffen und Metadatenanfragen:

```bash
rc object show rustfs/my-bucket/hello.txt \
	-H "x-amz-server-side-encryption-customer-algorithm:AES256" \
	-H "x-amz-server-side-encryption-customer-key:$SSE_C_KEY_B64" \
	-H "x-amz-server-side-encryption-customer-key-md5:$SSE_C_KEY_MD5"
```

Derselbe Ablauf wurde mit `rc 0.1.29` gegen RustFS geprüft: Ein Objekt wurde hochgeladen, mit dem ursprünglichen Schlüssel gelesen und die zurückgegebenen Bytes wurden mit der Quelle verglichen.

:::warning[Befehlsargumente schützen]

Die allgemeine Methode `-H` schreibt expandierte Header-Werte in die Prozessargumente von `rc`. Andere Prozesse auf dem Host können sie dadurch sehen. Bevorzugen Sie für die Automatisierung in der Produktion ein S3-SDK, das SSE-C-Schlüsselmaterial über geschützten Speicher oder einen Anbieter für Zugangsdaten entgegennimmt und nicht über Befehlszeilenargumente.

:::

## Shell-Variablen löschen

Entfernen Sie das Schlüsselmaterial nach dem Vorgang aus der Shell-Umgebung:

```bash
unset SSE_C_KEY_HEX SSE_C_KEY_B64 SSE_C_KEY_MD5
```

Eine Änderung des SSE-S3- oder SSE-KMS-Standards eines Buckets ändert SSE-C-Objekte nicht. SSE-C wird durch die Kundenschlüssel-Header der einzelnen Anfrage gewählt und hat für diese Anfrage Vorrang.

## Nächste Schritte

Vergleichen Sie [SSE-S3](./sse-s.md) für die vom Server verwaltete Verschlüsselung und [KMS](./kms.md) für die ausdrückliche Schlüsselverwaltung über KMS.
