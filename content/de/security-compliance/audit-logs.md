---
title: "Audit-Ziele"
description: "Konfigurieren Sie Audit-Ziele in RustFS und übermitteln Sie Audit-Datensätze auf Anfrageebene an externe Systeme."
---

Audit-Ziele in RustFS senden Aktivitätsdatensätze auf Anfrageebene an externe Systeme für Sicherheitsüberwachung, Compliance und die Untersuchung von Vorfällen. In dieser Anleitung konfigurieren Sie ein Webhook-Ziel und prüfen die Audit-Zustellung mit einer S3-Anfrage.

## Überblick

Audit-Ziele und Ereignisbenachrichtigungen erfüllen unterschiedliche Zwecke:

| Funktion | Audit-Ziele | Ereignisbenachrichtigungen |
| --- | --- | --- |
| Umfang | Anfrage- und API-Aktivität in ganz RustFS | Ereignisse, die die jeweilige Bucket-Konfiguration auswählt |
| Weiterleitung | Jedes aktivierte Audit-Ziel erhält Audit-Datensätze | Jede Bucket-Regel wählt ein Ziel |
| Filterung | Kein Ereignisfilter je Ziel | Filter für Ereignis, Präfix und Suffix |
| Typische Verwendung | Sicherheitsinformations- und Ereignismanagement (SIEM), Compliance, Untersuchung | Anwendungsabläufe und Datenpipelines |

RustFS unterstützt die Audit-Ziel-Familien Webhook, Kafka, MQTT, MySQL, PostgreSQL, NATS, Redis, AMQP und Pulsar. Jedes aktivierte Ziel erhält den Audit-Strom unabhängig.

Audit-Datensätze können Anfragepfade, Abfrageparameter, ausgewählte Header, Identitäts-Claims, Kennungen von Zugriffsschlüsseln, entfernte Hosts, User-Agents, den Antwortstatus und Fehler enthalten. Schützen Sie das Ziel und beschränken Sie den Zugriff entsprechend Ihren Aufbewahrungs- und Compliance-Anforderungen.

## Konfiguration

Die Audit-Zustellung ist standardmäßig deaktiviert. Die folgenden Umgebungsvariablen aktivieren das Modul und legen ein Webhook-Ziel mit dem Namen `primary` an:

```bash
export RUSTFS_AUDIT_ENABLE="true"
export RUSTFS_AUDIT_WEBHOOK_ENABLE_PRIMARY="on"
export RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY="https://audit.example.com/rustfs"
export RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY="<your-webhook-token>"
export RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY="/var/lib/rustfs/audit-primary"
export RUSTFS_OUTBOUND_ALLOW_ORIGINS="https://audit.example.com"
```

Starten Sie RustFS neu, nachdem Sie Ziele geändert haben, die über Umgebungsvariablen verwaltet werden. Der Zielname ist die kleingeschriebene Form des Suffixes der Umgebungsvariable. `_PRIMARY` erzeugt daher `primary`.

RustFS sendet eine Integritätsprüfung per `HEAD` an den Wurzelpfad des Endpunkt-Origins, zum Beispiel `https://audit.example.com/`, und sendet JSON-`POST`-Anfragen an den vollständig konfigurierten Endpunkt. Der Origin muss auf `HEAD` antworten, Zustellanfragen müssen einen erfolgreichen HTTP-Status zurückgeben. Erlauben Sie dem Dienstkonto von RustFS, in das Warteschlangenverzeichnis zu schreiben.

### Webhook-Einstellungen

Verwenden Sie für alle Einstellungen dieses Ziels dasselbe Suffix `_PRIMARY`:

| Variable | Zweck |
| --- | --- |
| `RUSTFS_AUDIT_WEBHOOK_ENDPOINT_PRIMARY` | HTTP- oder HTTPS-Zustellendpunkt |
| `RUSTFS_AUDIT_WEBHOOK_AUTH_TOKEN_PRIMARY` | Bearer-Token, das im Header `Authorization` gesendet wird |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` | Verzeichnis für wartende Audit-Datensätze |
| `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` | Maximale Anzahl wartender Datensätze |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CERT_PRIMARY` | Client-Zertifikat für gegenseitiges TLS (mTLS) |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_KEY_PRIMARY` | Privater Schlüssel zum Client-Zertifikat |
| `RUSTFS_AUDIT_WEBHOOK_CLIENT_CA_PRIMARY` | Zertifizierungsstelle, mit der der Empfänger geprüft wird |
| `RUSTFS_AUDIT_WEBHOOK_SKIP_TLS_VERIFY_PRIMARY` | Deaktiviert die Prüfung des Serverzertifikats |

:::warning[Audit-Daten schützen]

Verwenden Sie HTTPS für entfernte Sammelstellen. Lassen Sie die Zertifikatsprüfung aktiviert, speichern Sie Bearer-Token außerhalb der Versionsverwaltung und stellen Sie bei mTLS sowohl das Client-Zertifikat als auch den Schlüssel bereit. Audit-Payloads können sicherheitsrelevante Anfrage- und Identitätsmetadaten enthalten.

:::

Zu allen Zielfamilien und zielspezifischen Schlüsseln siehe [Umgebungsvariablen](/de/reference/environment-variables#event--audit-targets).

### Mehrere Ziele

Fügen Sie ein eigenes Suffix in Großbuchstaben hinzu, um eine weitere Instanz zu definieren. Verwenden Sie zum Beispiel `RUSTFS_AUDIT_WEBHOOK_ENABLE_ARCHIVE` und die zugehörigen Einstellungen mit `_ARCHIVE`, um neben `primary` ein Webhook-Ziel `archive` anzulegen.

RustFS verteilt jeden Audit-Datensatz an alle aktivierten Ziele. Ein Fehler in einem Ziel verhindert Zustellversuche an die anderen nicht.

:::note[Über Umgebungsvariablen verwaltete Ziele]

Ein Ziel, das durch Umgebungsvariablen definiert ist, lässt sich nicht über die Console oder die Admin-API bearbeiten oder entfernen. Ändern Sie stattdessen seine Umgebungsvariablen und starten Sie RustFS neu. Definieren Sie dasselbe Ziel nicht gleichzeitig über Umgebungsvariablen und über die persistierte Konfiguration.

:::

## Verwendung

:::note[Unterstützung in der rc-Befehlszeile]

Der aktuelle `rc`-Client bietet keine Befehle, um Audit-Ziele anzulegen, aufzulisten oder zu entfernen. Konfigurieren Sie sie über Umgebungsvariablen oder die Console. Die Befehle `rc bucket event` verwalten nur Bucket-Benachrichtigungsregeln; sie verwalten nicht die Audit-Zustellung.

:::

### Empfänger prüfen

Prüfen Sie, bevor Sie Datenverkehr erzeugen, dass die Sammelstelle vom RustFS-Host erreichbar ist und das konfigurierte Bearer-Token akzeptiert:

```bash
curl --fail --head \
	https://audit.example.com/
```

Die Integritätsprüfung misst die Erreichbarkeit des Origins und enthält das Autorisierungstoken des Webhooks nicht. Prüfen Sie getrennt, dass der konfigurierte Zustellpfad `/rustfs` bei `POST`-Anfragen `Authorization: Bearer <your-webhook-token>` akzeptiert.

Wenn das Ziel offline bleibt, prüfen Sie DNS, die Firewall-Richtlinie, `RUSTFS_OUTBOUND_ALLOW_ORIGINS`, das Zertifikatsvertrauen und die Antwort des Origins auf `HEAD /`.

### Audit-Datensatz erzeugen

Führen Sie eine authentifizierte S3-Operation gegen RustFS aus:

```bash
printf 'hello from RustFS\n' > hello.txt

aws --endpoint-url http://localhost:9000 \
	--region us-east-1 \
	s3 cp hello.txt s3://my-bucket/hello.txt
```

Das Webhook erhält einen JSON-Audit-Eintrag. Die Felder hängen von der Operation ab, und leere optionale Felder können entfallen. Eine repräsentative Teilmenge ist:

```json
{
	"version": "1",
	"time": 1719331200000,
	"event": "s3:ObjectCreated:Put",
	"trigger": "s3",
	"api": {
		"name": "PutObject",
		"bucket": "my-bucket",
		"object": "hello.txt",
		"status": "OK",
		"statusCode": 200
	},
	"remotehost": "192.0.2.10",
	"requestID": "<request-id>",
	"userAgent": "aws-cli",
	"requestPath": "/my-bucket/hello.txt",
	"accessKey": "<your-access-key>"
}
```

Behandeln Sie das Payload-Schema als erweiterbar. Werten Sie die Felder aus, die Sie benötigen, und tolerieren Sie unbekannte oder fehlende Felder, damit Sammelstellen mit späteren RustFS-Versionen kompatibel bleiben.

### Zustellverhalten

Wenn `RUSTFS_AUDIT_WEBHOOK_QUEUE_DIR_PRIMARY` konfiguriert ist, speichert RustFS ausstehende Datensätze auf der Festplatte und spielt sie nach vorübergehenden Zustellfehlern erneut ab. Dimensionieren Sie das Warteschlangenverzeichnis und `RUSTFS_AUDIT_WEBHOOK_QUEUE_LIMIT_PRIMARY` für das erwartete Ausfallfenster und überwachen Sie anschließend sowohl die Festplattennutzung als auch den Zustand des Ziels.

Die Webhook-Zustellung erfolgt mindestens einmal. Eine Zeitüberschreitung kann eintreten, nachdem der Empfänger eine Anfrage verarbeitet hat, aber bevor RustFS die Antwort sieht. Verwenden Sie deshalb `requestID` und andere stabile Felder, um Datensätze dort zu deduplizieren, wo das erforderlich ist.

Der Empfänger sollte einen Datensatz erst bestätigen, nachdem er ihn dauerhaft angenommen hat. Ein Status ungleich Erfolg hält Fehler für den Zustellweg sichtbar. Nimmt der Empfänger einen Datensatz stillschweigend an und verwirft ihn, kann RustFS das nicht nachholen.

## Nächste Schritte

Konfigurieren Sie [Ereignisbenachrichtigungen](/de/operations/event-notifications) für anwendungsbezogene Abläufe auf Bucket-Ebene. Lesen Sie [Observability](/de/operations/observability), um den Zustand des Dienstes zu überwachen, und [Anmeldedaten](/de/operations/credentials), um den administrativen Zugriff zu begrenzen.
