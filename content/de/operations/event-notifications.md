---
title: "Ereignisbenachrichtigungen"
description: "Konfigurieren Sie Bucket-Ereignisbenachrichtigungen in RustFS und liefern Sie gefilterte Objektereignisse an externe Ziele."
---

RustFS-Ereignisbenachrichtigungen liefern S3-Bucket-Aktivität an externe Systeme. In dieser Anleitung konfigurieren Sie ein Webhook-Ziel, ordnen es einem Bucket zu und prüfen die Zustellung mit der AWS CLI.

## Überblick

Eine Ereignisbenachrichtigung hat zwei unabhängige Teile:

- Ein **Benachrichtigungsziel** legt fest, wohin RustFS Ereignisse sendet.
- Eine **Bucket-Benachrichtigungskonfiguration** wählt das Ziel, die Ereignistypen und optionale Filter für Objektschlüssel für einen Bucket.

RustFS unterstützt die Zielfamilien Webhook, Kafka, MQTT, MySQL, PostgreSQL, NATS, Redis, AMQP und Pulsar. Der folgende Webhook-Ablauf eignet sich für HTTP-Dienste, serverlose Funktionen und Integrationsplattformen.

Bucket-Regeln verwenden die S3-APIs `PutBucketNotificationConfiguration` und `GetBucketNotificationConfiguration`. RustFS akzeptiert derzeit Warteschlangenkonfigurationen. Konfigurationen für AWS-SNS-Themen und Lambda-Funktionen werden nicht unterstützt.

Übliche Ereignisfamilien sind:

| Ereignisfamilie | Beispielereignisse |
| --- | --- |
| Objekterstellung | `s3:ObjectCreated:Put`, `s3:ObjectCreated:Copy`, `s3:ObjectCreated:CompleteMultipartUpload` |
| Objektentfernung | `s3:ObjectRemoved:Delete`, `s3:ObjectRemoved:DeleteMarkerCreated` |
| Objektzugriff | `s3:ObjectAccessed:Get`, `s3:ObjectAccessed:Head` |
| Objekt-Tagging | `s3:ObjectTagging:Put`, `s3:ObjectTagging:Delete` |
| Lebenszyklus und Stufung | Ereignisse für Ablauf, Wiederherstellung, Replikation und Übergang |

Verwenden Sie einen Platzhalter wie `s3:ObjectCreated:*`, um jedes Ereignis einer Familie zu abonnieren.

## Konfiguration

Ereignisbenachrichtigungen sind standardmäßig deaktiviert. Die folgenden Umgebungsvariablen aktivieren das Modul und legen ein Webhook-Ziel namens `primary` an:

```bash
export RUSTFS_NOTIFY_ENABLE="true"
export RUSTFS_NOTIFY_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY="https://events.example.com/rustfs"
export RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/notify-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://events.example.com"
```

Starten Sie RustFS neu, nachdem Sie Ziele geändert haben, die über die Umgebung verwaltet werden. Der Zielname ist die Kleinschreibung des Suffixes der Umgebungsvariablen. `_PRIMARY` erzeugt also `primary`. Verwenden Sie in der Bucket-Konfiguration den Ziel-ARN `arn:rustfs:sqs:us-east-1:primary:webhook`.

RustFS sendet eine `HEAD`-Integritätsprüfung an den Wurzelpfad des Endpunkt-Ursprungs, etwa `https://events.example.com/`, und sendet JSON-`POST`-Anfragen an den vollständig konfigurierten Endpunkt. Der Ursprung muss auf `HEAD` antworten, und Zustellanfragen müssen einen erfolgreichen HTTP-Status liefern. Erlauben Sie dem RustFS-Dienstkonto, in das Warteschlangenverzeichnis zu schreiben.

### Webhook-Einstellungen

Verwenden Sie für alle Einstellungen dieses Ziels dasselbe Suffix `_PRIMARY`:

| Variable | Zweck |
| --- | --- |
| `RUSTFS_NOTIFY_WEBHOOK_ENDPOINT_PRIMARY` | HTTP- oder HTTPS-Zustellendpunkt |
| `RUSTFS_NOTIFY_WEBHOOK_AUTH_TOKEN_PRIMARY` | Bearer-Token, das im Header `Authorization` gesendet wird |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_DIR_PRIMARY` | Verzeichnis für eingereihte Zustellungen |
| `RUSTFS_NOTIFY_WEBHOOK_QUEUE_LIMIT_PRIMARY` | Höchstzahl eingereihter Ereignisse |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CERT_PRIMARY` | Client-Zertifikat für gegenseitiges TLS (mTLS) |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_KEY_PRIMARY` | Privater Schlüssel zum Client-Zertifikat |
| `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY` | Zertifizierungsstelle, mit der der Empfänger geprüft wird |
| `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | Prüfung des Serverzertifikats deaktivieren |

:::warning[Zertifikatsprüfung aktiviert lassen]

Aktivieren Sie `RUSTFS_NOTIFY_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` in der Produktion nicht. Konfigurieren Sie `RUSTFS_NOTIFY_WEBHOOK_CLIENT_CA_PRIMARY`, wenn der Empfänger eine private Zertifizierungsstelle verwendet. Wenn Sie mTLS verwenden, geben Sie sowohl das Client-Zertifikat als auch den privaten Schlüssel an.

:::

Alle Zielfamilien und zielspezifischen Schlüssel stehen unter [Umgebungsvariablen](/de/reference/environment-variables#event--audit-targets).

## Verwendung

Das folgende Beispiel sendet Erstellungs- und Entfernungsereignisse für `.dat`-Objekte unter `uploads/` an den Webhook `primary`.

### Bucket-Regel konfigurieren

Legen Sie die Benachrichtigungskonfiguration an:

```json title="notification.json"
{
	"QueueConfigurations": [
		{
			"Id": "primary-uploads",
			"QueueArn": "arn:rustfs:sqs:us-east-1:primary:webhook",
			"Events": [
				"s3:ObjectCreated:*",
				"s3:ObjectRemoved:*"
			],
			"Filter": {
				"Key": {
					"FilterRules": [
						{ "Name": "prefix", "Value": "uploads/" },
						{ "Name": "suffix", "Value": ".dat" }
					]
				}
			}
		}
	]
}
```

Wenden Sie sie mit der [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) auf `my-bucket` an:

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration file://notification.json
```

Das Speichern einer Bucket-Regel belegt nicht, dass ihr Ziel existiert oder online ist. Bestätigen Sie, dass Modul und Ziel aktiviert sind, der Empfänger auf Integritätsprüfungen antwortet und eine Testoperation an einem Objekt eine Zustellung erzeugt.

Lesen Sie die aktive Konfiguration:

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api get-bucket-notification-configuration \
	--bucket my-bucket
```

Präfix- und Suffixfilter unterscheiden Groß- und Kleinschreibung und werden mit UND-Logik kombiniert. Eine Regel kann höchstens einen Präfix- und einen Suffixfilter enthalten.

### Regeln mit rc verwalten

Der Client `rc` kann Bucket-Benachrichtigungsregeln hinzufügen, auflisten und entfernen. Er konfiguriert das Benachrichtigungsmodul nicht und legt das zugrunde liegende Webhook-, Broker- oder Datenbankziel nicht an. Konfigurieren Sie diese zuerst über Umgebungsvariablen oder die Console.

Fügen Sie Erstellungs- und Entfernungsereignisse für das Ziel `primary` hinzu:

```bash
rc bucket event add \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook \
	--event put,delete
```

Listen Sie die aktiven Regeln auf:

```bash
rc --json bucket event list rustfs/my-bucket
```

Entfernen Sie jede Regel, die mit diesem Ziel-ARN verknüpft ist:

```bash
rc bucket event remove \
	rustfs/my-bucket \
	arn:rustfs:sqs:us-east-1:primary:webhook
```

Der aktuelle Befehl `rc bucket event add` stellt keine Optionen für Präfix- oder Suffixfilter bereit. Verwenden Sie die AWS CLI, wenn die Regel Objektschlüssel filtern muss.

### Ereignisse auslösen und prüfen

Laden Sie ein passendes Objekt hoch und entfernen Sie es:

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/uploads/hello.dat

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 rm s3://my-bucket/uploads/hello.dat
```

Der Webhook empfängt eine S3-kompatible JSON-Hülle. Wichtige Felder sind der Ereignisname, der Bucket, der Objektschlüssel, die Größe, das ETag und die Anfragekennungen:

```json
{
	"EventName": "s3:ObjectCreated:Put",
	"Records": [
		{
			"eventName": "s3:ObjectCreated:Put",
			"s3": {
				"bucket": { "name": "my-bucket" },
				"object": { "key": "uploads%2Fhello.dat" }
			}
		}
	]
}
```

Decodieren Sie den Objektschlüssel als URL-codierte Daten, bevor Sie ihn verwenden. Verbraucher sollten außerdem idempotent sein: Die eingereihte Zustellung kann Ereignisse zwischenspeichern und später weiterleiten, ein Empfänger kann dasselbe Ereignis aber mehr als einmal sehen.

### Regeln ersetzen oder entfernen

`PutBucketNotificationConfiguration` ersetzt die vollständige Benachrichtigungskonfiguration des Buckets. Nehmen Sie beim Aktualisieren jede Regel auf, die Sie behalten wollen.

Entfernen Sie alle Regeln, indem Sie eine leere Konfiguration anwenden:

```bash
aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3api put-bucket-notification-configuration \
	--bucket my-bucket \
	--notification-configuration '{}'
```

## Nächste Schritte

Konfigurieren Sie [Audit-Ziele](/de/security-compliance/audit-logs), wenn Sie Sicherheits- und Compliance-Nachweise auf Anfrageebene brauchen statt bucketbezogener Objektereignisse. Lesen Sie [Observability](/de/operations/observability), um den RustFS-Dienst zu überwachen.
