---
title: "Bucket-Richtlinie"
description: "Erstellen, anwenden, lesen und prüfen Sie Bucket-Richtlinien von RustFS über die S3-API."
---

Bucket-Richtlinien von RustFS sind S3-kompatible Ressourcenrichtlinien, die direkt an einen Bucket gebunden sind. Damit gewähren oder verweigern Sie den Zugriff auf den Bucket und seine Objekte, einschließlich eines kontrollierten anonymen Zugriffs für öffentliche Downloads.

## Überblick

Eine Bucket-Richtlinie enthält eine oder mehrere Anweisungen, die einen Principal, eine Aktion, eine Ressource und optionale Bedingungen abgleichen. RustFS wertet die Richtlinie für Anfragen an den Bucket aus, bevor es die Speicheroperation zulässt.

Bucket-Richtlinien und IAM-Richtlinien erfüllen unterschiedliche Zwecke:

| Richtlinientyp | Gebunden an | Typische Verwendung |
| --- | --- | --- |
| Bucket-Richtlinie | Einen Bucket | Öffentlichen Zugriff gewähren, Einschränkungen auf Ressourcenebene hinzufügen oder den Zugriff auf einen Bucket autorisieren. |
| IAM-Richtlinie | Einen Benutzer oder eine Gruppe | Festlegen, was eine authentifizierte Identität über eine oder mehrere Ressourcen tun darf. |

Ein ausdrückliches `Deny` hat Vorrang vor einem `Allow`. Bucket-Eigentümer können die Bucket-Richtlinie weiterhin abrufen, ersetzen oder löschen, damit eine Deny-Anweisung die Richtlinienverwaltung nicht dauerhaft sperrt.

RustFS implementiert die Standard-S3-Operationen `PutBucketPolicy`, `GetBucketPolicy`, `GetBucketPolicyStatus` und `DeleteBucketPolicy`.

:::warning[Öffentliche Richtlinien]

Eine Anweisung mit `"Principal": "*"` kann Zugriff ohne Authentifizierung gewähren. Halten Sie den Umfang von Aktion und Ressource so eng wie möglich und prüfen Sie das Ergebnis anonym, bevor Sie die Richtlinie in der Produktion verwenden.

:::

## Konfiguration

### Voraussetzungen

- Erstellen Sie den Ziel-Bucket, bevor Sie eine Richtlinie anwenden.
- Konfigurieren Sie die AWS CLI mit RustFS-Zugangsdaten und der Region `us-east-1`.
- Verwenden Sie Zugangsdaten, die die erforderliche Aktion zur Richtlinienverwaltung ausführen dürfen.

Setzen Sie wiederverwendbare Variablen:

```bash
export RUSTFS_ENDPOINT=http://localhost:9000
export BUCKET_NAME=my-bucket
```

Die Richtlinienverwaltung erfordert diese Aktionen:

| Operation | Erforderliche Aktion |
| --- | --- |
| Richtlinie anwenden oder ersetzen | `s3:PutBucketPolicy` |
| Richtlinie lesen | `s3:GetBucketPolicy` |
| Öffentlichen Status lesen | `s3:GetBucketPolicyStatus` |
| Richtlinie entfernen | `s3:DeleteBucketPolicy` |

### Aufbau des Richtliniendokuments

Eine Bucket-Richtlinie verwendet die Version `2012-10-17` und ein `Statement`-Array:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
```

Die Bucket-ARN und die Objekt-ARN unterscheiden sich:

| Ressource | ARN-Format | Beispielaktionen |
| --- | --- | --- |
| Bucket | `arn:aws:s3:::my-bucket` | `s3:ListBucket`, `s3:GetBucketLocation` |
| Objekte | `arn:aws:s3:::my-bucket/*` | `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` |

Verwenden Sie ein Präfix in der Objekt-ARN, etwa `arn:aws:s3:::my-bucket/public/*`, um den Zugriff auf einen Teil des Buckets zu beschränken. Das vollständige Anweisungsformat und die unterstützten Bedingungsoperatoren stehen unter [Benutzer, Gruppen und Richtlinien](/de/security-compliance/iam/policies#policy-document-format).

### Public Access Block

Wenn `BlockPublicPolicy` in der Konfiguration Public Access Block (Sperre für öffentlichen Zugriff) des Buckets aktiviert ist, lehnt RustFS eine neue Richtlinie ab, die eine `Allow`-Anweisung mit einem Wildcard-Principal enthält. Lassen Sie diesen Schutz aktiviert, solange anonymer Zugriff nicht beabsichtigt ist.

Public Access Block ersetzt keine sorgfältige Prüfung der Richtlinie. Ein vorhandenes ausdrückliches `Deny` setzt Allows weiterhin außer Kraft, und authentifizierte Anfragen werden weiterhin gegen IAM- und Bucket-Richtlinien geprüft.

## Verwendung

### Richtlinie für öffentliches Lesen erstellen

Erstellen Sie eine Richtlinie, die anonyme Downloads nur aus dem Präfix `public/` erlaubt:

```bash
cat > /tmp/my-bucket-policy.json <<'EOF'
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadObjects",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:GetObject"],
			"Resource": ["arn:aws:s3:::my-bucket/public/*"]
		}
	]
}
EOF
```

Diese Richtlinie erlaubt kein anonymes Auflisten des Buckets, keine Uploads, keine Überschreibungen und keine Löschungen.

### Richtlinie anwenden

```bash
aws s3api put-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--policy file:///tmp/my-bucket-policy.json \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

Eine weitere Richtlinie ersetzt die bestehende Richtlinie vollständig. Rufen Sie das aktuelle Dokument ab und prüfen Sie es, bevor Sie es aktualisieren. Anweisungen werden nicht automatisch zusammengeführt.

### Richtlinie lesen

```bash
aws s3api get-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT" \
	--query Policy \
	--output text
```

RustFS behält das übermittelte Richtlinien-JSON bei. Wenn keine Richtlinie vorhanden ist, gibt die API `NoSuchBucketPolicy` zurück.

### Öffentlichen Status prüfen

```bash
aws s3api get-bucket-policy-status \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

Die Antwort enthält einen groben Status zum öffentlichen Zugriff:

```json
{
	"PolicyStatus": {
		"IsPublic": false
	}
}
```

Die aktuelle Statusprüfung erkennt anonymes Auflisten des Buckets (`s3:ListBucket`) und Uploads (`s3:PutObject`). Eine Richtlinie, die nur Objekt-Downloads freigibt, wie das Beispiel `public/` oben, kann weiterhin `false` melden. Prüfen Sie immer die genaue anonyme Aktion, das Objektpräfix und die Bedingungen, anstatt diesen Status als vollständige Zugriffsanalyse zu behandeln.

### Richtlinie entfernen

```bash
aws s3api delete-bucket-policy \
	--bucket "$BUCKET_NAME" \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

Das Löschen einer Bucket-Richtlinie entfernt nur diese Ressourcenrichtlinie. IAM-Richtlinien, die an Benutzer und Gruppen gebunden sind, bleiben unverändert.

## Überprüfung

Laden Sie ein Testobjekt mit authentifizierten Zugangsdaten hoch:

```bash
printf 'hello from RustFS\n' > /tmp/hello.txt

aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key public/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"
```

Prüfen Sie, dass das zugelassene Objekt ohne Zugangsdaten heruntergeladen werden kann:

```bash
curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/public/hello.txt"
```

Prüfen Sie anschließend, dass ein Objekt außerhalb des zugelassenen Präfixes nicht öffentlich ist:

```bash
aws s3api put-object \
	--bucket "$BUCKET_NAME" \
	--key private/hello.txt \
	--body /tmp/hello.txt \
	--endpoint-url "$RUSTFS_ENDPOINT"

curl --fail-with-body \
	"${RUSTFS_ENDPOINT}/${BUCKET_NAME}/private/hello.txt"
```

Die zweite `curl`-Anfrage sollte mit `AccessDenied` fehlschlagen. Prüfen Sie außerdem jede authentifizierte Benutzerrolle, die sich auf die Richtlinie stützt, besonders wenn das Dokument Bedingungen oder ausdrückliche Deny-Anweisungen enthält.

## Nächste Schritte

- [IAM-Richtlinien verwalten](/de/security-compliance/iam/policies)
- [Zugangsdaten verwalten](/de/operations/credentials)
- [Audit-Protokolle konfigurieren](/de/security-compliance/audit-logs)
