---
title: "Bucket-Kontingent"
description: "Konfigurieren, lesen und prüfen Sie harte Speicherkontingente für einzelne RustFS-Buckets."
---

Bucket-Kontingente von RustFS begrenzen die gesamten Objektdaten, die in einem einzelnen Bucket gespeichert sind. Verwenden Sie ein Kontingent, damit ein Workload nicht mehr als die zugewiesene Kapazität verbraucht, während andere Buckets den übrigen Speicher nutzen können.

## Überblick

RustFS unterstützt derzeit harte, bytebasierte Kontingente. Bevor RustFS einen Schreibvorgang annimmt, vergleicht es die aktuelle Nutzung des Buckets zuzüglich der angeforderten Objektgröße mit dem konfigurierten Limit. Ein Schreibvorgang, der das Limit überschreiten würde, wird mit `InvalidRequest` und der Meldung `Bucket quota exceeded` abgelehnt.

Kontingentprüfungen umfassen diese Operationen:

| Operation | Kontingentverhalten |
| --- | --- |
| Objekt hochladen | Lehnt den Upload ab, wenn die aktuelle Nutzung zuzüglich der Objektgröße das Limit überschreitet. |
| Mehrteiligen Upload abschließen | Prüft die Größe des abgeschlossenen Objekts, bevor der Upload festgeschrieben wird. |
| Objekt in den Bucket kopieren | Prüft die Größe des Quellobjekts gegen das Kontingent des Ziel-Buckets. |
| Objekt löschen | Immer zulässig, damit Sie Kapazität zurückgewinnen können. |

Das Kontingent gilt für Objektdaten, nicht für die Anzahl der Objekte oder die Anfragerate. Ein Bucket ohne konfiguriertes Limit ist unbegrenzt.

:::note[Ersetzende Uploads]

Die Kontingentprüfung reserviert die vollständige Größe des eingehenden Objekts gegen die aktuelle Nutzung des Buckets. Das Ersetzen eines vorhandenen Objektschlüssels kann deshalb genug freien Kontingentraum für das vollständige Ersatzobjekt erfordern.

:::

## In der Console konfigurieren

1. Melden Sie sich an der RustFS-Console an und öffnen Sie **Browser**.
2. Suchen Sie den Bucket und wählen Sie **Settings** (Einstellungen).
3. Suchen Sie unter **Capacity & Metadata** (Kapazität und Metadaten) den Eintrag **Bucket Quota** (Bucket-Kontingent) und wählen Sie **Edit** (Bearbeiten).
4. Aktivieren Sie **Bucket Quota**.
5. Geben Sie die Kontingentgröße ein und wählen Sie **MiB**, **GiB**, **TiB** oder **PiB**.
6. Wählen Sie **Save Quota** (Kontingent speichern).

![Dialog zum Festlegen des Bucket-Kontingents mit Größe und Einheit](./images/bucket-quota-console.png)

Um das Limit zu entfernen, öffnen Sie den Dialog erneut, deaktivieren Sie **Bucket Quota** und speichern Sie die Änderung.

## `rc` verwenden

Konfigurieren Sie einen Alias für Ihre RustFS-Bereitstellung:

```bash
rc alias set rustfs http://localhost:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

Ersetzen Sie `localhost` durch die Adresse des RustFS-Servers, wenn `rc` auf einem anderen Host läuft.

### Berechtigungen

Kontingentoperationen erfordern diese Richtlinienaktionen:

| Operation | Erforderliche Aktion |
| --- | --- |
| Kontingent setzen oder löschen | `admin:SetBucketQuota` |
| Kontingentkonfiguration oder Statistik lesen | `s3:GetBucketQuota` |
| Prüfen, ob eine geplante Operation passt | `s3:GetBucketQuota` |

Die Root-Anmeldedaten besitzen diese Berechtigungen. Hängen Sie für die delegierte Administration nur die Aktionen an, die der Ablauf benötigt.

### Kontingent setzen

Setzen Sie ein hartes Kontingent von 1 GiB. `rc` akzeptiert Bytewerte oder Einheiten wie `1G`, `500M` und `10KB`:

```bash
rc bucket quota set rustfs/my-bucket 1G
```

Die Antwort enthält das konfigurierte Limit und die aktuelle Nutzung:

```text
Bucket: my-bucket
Quota: 1 GiB
Usage: 0 B
Type:  HARD
```

### Kontingent lesen

```bash
rc bucket quota info rustfs/my-bucket
```

Verwenden Sie `--json`, wenn ein anderes Werkzeug das Ergebnis verarbeiten muss:

```bash
rc bucket quota info rustfs/my-bucket --json
```

Wenn kein Limit konfiguriert ist, meldet die lesbare Ausgabe `Quota: unlimited`.

:::note[Weitergabe der Konfiguration]

Eine Abfrage unmittelbar nach dem Setzen oder Löschen eines Kontingents kann kurz den vorherigen Zustand zurückgeben. Fragen Sie das Kontingent erneut ab und bestätigen Sie den erwarteten Wert, bevor Sie die Überprüfung starten.

:::

### Kontingent löschen

Entfernen Sie das Limit, ohne Objekte zu löschen:

```bash
rc bucket quota clear rustfs/my-bucket
rc bucket quota info rustfs/my-bucket
```

Der Bucket wird unbegrenzt, nachdem die Konfigurationsänderung angewendet wurde.

## Erweiterte Kontingentprüfungen

`rc 0.1.29` stellt keine Befehle für detaillierte Nutzungsstatistiken oder unverbindliche Prüfungen geplanter Schreibvorgänge bereit. Verwenden Sie für diese Operationen die RustFS-Admin-API. Anfragen müssen AWS Signature Version 4 mit aktiven RustFS-Zugangsdaten verwenden.

Die Beispiele verwenden diese Shell-Variablen:

```bash
export RUSTFS_ENDPOINT=http://localhost:9000
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>
export BUCKET_NAME=my-bucket
```

:::warning[Zugangsdaten schützen]

Umgebungsvariablen sind für lokale Tests praktisch, können aber für Prozesse sichtbar sein, die als derselbe Betriebssystembenutzer laufen. Verwenden Sie in der Produktion die Geheimnisverwaltung Ihrer Plattform oder eine eingeschränkte Zugangsdatendatei.

:::

### Detaillierte Nutzungsstatistik lesen

Verwenden Sie den Statistikendpunkt, um das Limit, die aktuelle Nutzung, die verbleibenden Bytes und den genutzten Prozentsatz abzurufen:

```bash
curl --fail-with-body \
	--aws-sigv4 "aws:amz:us-east-1:s3" \
	--user "${RUSTFS_ACCESS_KEY}:${RUSTFS_SECRET_KEY}" \
	"${RUSTFS_ENDPOINT}/rustfs/admin/v3/quota-stats/${BUCKET_NAME}"
```

```json
{
	"bucket": "my-bucket",
	"quota_limit": 1073741824,
	"current_usage": 1048576,
	"remaining_quota": 1072693248,
	"usage_percentage": 0.09765625
}
```

Die Nutzungswerte stammen aus der Datennutzungsabrechnung von RustFS. Warten Sie, bis diese Sicht sehr aktuelle Änderungen widerspiegelt, bevor Sie die Statistikantwort für externe Abrechnung oder Orchestrierung verwenden.

### Geplanten Upload prüfen

Prüfen Sie, ob ein Upload von 64 MiB passen würde, ohne ein Objekt zu schreiben:

```bash
curl --fail-with-body \
	--aws-sigv4 "aws:amz:us-east-1:s3" \
	--user "${RUSTFS_ACCESS_KEY}:${RUSTFS_SECRET_KEY}" \
	--request POST \
	--header "Content-Type: application/json" \
	--data '{"operation_type":"PUT","operation_size":67108864}' \
	"${RUSTFS_ENDPOINT}/rustfs/admin/v3/quota-check/${BUCKET_NAME}"
```

Das Feld `allowed` meldet die Entscheidung. Diese Prüfung ist unverbindlich: Ein anderer Schreibvorgang kann Kapazität verbrauchen, bevor der geplante Upload beginnt. Deshalb bleibt der tatsächliche Upload maßgeblich.

## Überprüfung

Setzen Sie ein kleines Testkontingent, laden Sie ein Objekt hoch, das hineinpasst, und versuchen Sie anschließend, ein Objekt hochzuladen, das die verbleibende Kapazität überschreitet:

```bash
rc bucket quota set rustfs/my-bucket 1M

dd if=/dev/zero of=/tmp/quota-small.bin bs=1024 count=256
dd if=/dev/zero of=/tmp/quota-large.bin bs=1048576 count=2

rc object copy /tmp/quota-small.bin rustfs/my-bucket/hello.bin
rc object copy /tmp/quota-large.bin rustfs/my-bucket/too-large.bin
```

Das Objekt von 256 KiB gelingt. Das Objekt von 2 MiB überschreitet das Bucket-Kontingent von 1 MiB. Deshalb endet `rc` mit einem Fehler, und RustFS erstellt `too-large.bin` nicht.

Löschen Sie das erste Objekt und entfernen Sie das Testkontingent:

```bash
rc object remove rustfs/my-bucket/hello.bin --force
rc bucket quota clear rustfs/my-bucket
rc bucket quota info rustfs/my-bucket
```

Prüfen Sie, dass die letzte Abfrage `Quota: unlimited` meldet.

Wenn die Kontingentdurchsetzung ihre interne Konfiguration nicht lesen oder auswerten kann, protokolliert RustFS `Bucket quota check degraded to allow` und lässt den Schreibvorgang zu. Überwachen Sie diese Warnung, weil sie bedeutet, dass die Kontingentdurchsetzung vorübergehend nicht verfügbar ist.

## Nächste Schritte

- [Bucket erstellen](./creation.md)
- [Lebenszyklusregeln verwalten](../lifecycle-management.md)
- [Observability konfigurieren](/de/operations/observability)
