---
title: "Lebenszyklusverwaltung"
description: "Konfigurieren, prüfen und pflegen Sie Lebenszyklusregeln für RustFS-Objekte mit dem Kommandozeilenclient rc."
---

Die Lebenszyklusverwaltung von RustFS wendet Ablauf- und Übergangsregeln auf Objekte in einem Bucket an. Auf dieser Seite verwalten Sie diese Regeln mit `rc`, prüfen einen Übergang und stellen eine temporäre lokale Kopie übertragener Daten wieder her.

Bevor Sie beginnen, [installieren Sie `rc`](/de/operations/rc), konfigurieren Sie einen Alias namens `local` und erstellen Sie `my-bucket`. Um Objekte zu übertragen, registrieren Sie zuerst das Ziel unter [Gestufte Speicherung](/de/administration/data/tiered-storage) und notieren Sie den Stufennamen in Großbuchstaben.

:::note[Asynchrone Auswertung]

Lebenszyklusregeln verarbeiten nicht jedes geeignete Objekt sofort. Der [Objekt-Scanner](/de/administration/data/object/scanner) wertet Lebenszyklusarbeit im Hintergrund aus.

:::

## Ablaufregel hinzufügen

Lassen Sie Objekte unter dem Präfix `logs/` 30 Tage nach der Erstellung ablaufen:

```bash
rc bucket lifecycle rule add local/my-bucket \
	--prefix logs/ \
	--expiry-days 30
```

Der Befehl erstellt eine aktivierte Regel und gibt die erzeugte Regel-ID zurück. Notieren Sie diese ID, wenn Sie genau diese Regel bearbeiten oder entfernen müssen.

## Übergangsregel hinzufügen

Verschieben Sie Objektdaten nach 90 Tagen in die registrierte Stufe `COLDTIER`:

```bash
rc bucket lifecycle rule add local/my-bucket \
	--transition-days 90 \
	--storage-class COLDTIER
```

`--storage-class` muss mit einem registrierten Stufennamen übereinstimmen. Das Hinzufügen der Regel erstellt die Stufe nicht und prüft eine AWS-Speicherklassenbezeichnung nicht als RustFS-Stufe.

Sie können Ablauf- und Übergangsoptionen in einer Regel kombinieren. Verwenden Sie die Optionen für nicht aktuelle Versionen nur bei einem versionierten Bucket:

```bash
rc bucket lifecycle rule add local/my-bucket \
	--noncurrent-transition-days 30 \
	--noncurrent-transition-storage-class COLDTIER \
	--noncurrent-expiry-days 365
```

## Regeln anzeigen und aktualisieren

Listen Sie die aktuellen Regeln auf und notieren Sie die ID der Regel, die Sie ändern möchten:

```bash
rc bucket lifecycle rule list local/my-bucket
```

Ändern Sie die Ablaufdauer einer Regel oder deaktivieren Sie sie, ohne sie zu löschen:

```bash
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--expiry-days 60
rc bucket lifecycle rule edit local/my-bucket \
	--id <rule-id> \
	--disable true
```

Entfernen Sie eine Regel anhand der ID. Verwenden Sie `--all` nur, wenn Sie die vollständige Lebenszykluskonfiguration des Buckets entfernen möchten:

```bash
rc bucket lifecycle rule remove local/my-bucket --id <rule-id>
rc bucket lifecycle rule remove local/my-bucket --all
```

## Regeln exportieren und importieren

Exportieren Sie die Lebenszykluskonfiguration des Buckets vor einer umfangreichen Änderung:

```bash
rc bucket lifecycle rule export local/my-bucket > lifecycle.json
```

Der Import einer Datei ersetzt die Lebenszykluskonfiguration, die an den Bucket gesendet wird. Prüfen Sie das JSON, bevor Sie es anwenden:

```bash
rc bucket lifecycle rule import local/my-bucket lifecycle.json
```

## Lebenszyklusübergang bestätigen

Nachdem ein Objekt unter seiner Lebenszyklusregel geeignet geworden ist, rufen Sie seine Metadaten auf dem Quellcluster ab (Head):

```bash
aws s3api head-object \
	--bucket my-bucket \
	--key hello.txt \
	--endpoint-url http://localhost:9000
```

Nach Abschluss des Übergangs meldet die Antwort den registrierten Stufennamen als Speicherklasse:

```json
{
	"StorageClass": "COLDTIER"
}
```

Die Antwort kann weitere Objektmetadaten enthalten. Bevor der Übergang abgeschlossen ist, kann `StorageClass` fehlen oder noch nicht `COLDTIER` melden.

Lesen Sie das Objekt wie gewohnt über den RustFS-Quellendpunkt:

```bash
aws s3 cp \
	s3://my-bucket/hello.txt \
	/path/to/hello.txt \
	--endpoint-url http://localhost:9000
```

RustFS liest übertragene Daten über den Quell-Bucket und den Objektschlüssel. Anwendungen müssen den Ziel-Bucket nicht direkt adressieren.

## Lokale Kopie wiederherstellen

Fordern Sie eine temporäre lokale Kopie eines übertragenen Objekts an und behalten Sie sie sieben Tage:

```bash
rc bucket lifecycle restore local/my-bucket/hello.txt --days 7
```

Während das Rückkopieren läuft, meldet `HEAD` `x-amz-restore: ongoing-request="true"`. Nach dem Abschluss meldet es `ongoing-request="false"` mit einem Ablaufdatum. Eine zweite Wiederherstellung, die während einer laufenden Wiederherstellung gesendet wird, gibt `RestoreAlreadyInProgress` zurück.

Wenn der Wiederherstellungszeitraum abläuft, entfernt RustFS die lokale wiederhergestellte Kopie und ihre Wiederherstellungsmetadaten. Das übertragene Objekt bleibt über die entfernte Stufe verfügbar.

## Befehlskompatibilität

Das aktuelle `rc` akzeptiert `rc ilm` zusätzlich als Kompatibilitätsalias. Wir empfehlen für neue Befehle und Skripte die Form `rc bucket lifecycle`, bei der das Substantiv voransteht:

```bash
rc bucket lifecycle --help
rc bucket lifecycle rule --help
rc bucket lifecycle tier --help
```

## Nächste Schritte

Lesen Sie [Gestufte Speicherung](/de/administration/data/tiered-storage), um entfernte Stufen zu überwachen oder zu pflegen, und verwenden Sie [Objekt erstellen](/de/administration/data/object/creation), um Testobjekte für eine Lebenszyklusregel anzulegen.
