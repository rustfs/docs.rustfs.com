---
title: "Bucket-Replikation"
description: "Konfigurieren, prüfen und überwachen Sie die asynchrone Replikation zwischen versionierten RustFS-Buckets."
---

Die Bucket-Replikation von RustFS kopiert ausgewählte Objektversionen von einem Quell-Bucket in einen Ziel-Bucket. Damit halten Sie eine entfernte Kopie der Bucket-Daten vor, verteilen Objekte zwischen Bereitstellungen oder bereiten eine zweite Kopie für Wiederherstellungsabläufe vor.

## Überblick

Die Bucket-Replikation hat zwei Konfigurationsebenen:

1. Ein **entferntes Ziel** speichert den Zielendpunkt, den Bucket, die Zugangsdaten und die erzeugte Ziel-ARN.
2. Eine S3-**Replikationskonfiguration** bindet Regeln an den Quell-Bucket und verweist auf diese Ziel-ARN.

Quell- und Ziel-Bucket müssen die Versionierung aktiviert haben. RustFS prüft die Zielverbindung und die Versionierung des Ziel-Buckets, wenn Sie das entfernte Ziel registrieren. Eine Replikationskonfiguration, deren aktivierte Regeln auf eine unbekannte oder veraltete Ziel-ARN verweisen, wird abgelehnt.

Die Replikation ist standardmäßig asynchron. Ein erfolgreicher Upload auf der Quelle bedeutet, dass RustFS das Quellobjekt angenommen hat. Er bedeutet nicht, dass die Zielkopie bereits abgeschlossen ist.

Regeln können Objekte nach Präfix oder Objekt-Tags auswählen und steuern dieses Verhalten:

| Regeleinstellung | Verhalten |
| --- | --- |
| `Status` | Aktiviert oder deaktiviert die Regel. |
| `Filter` | Beschränkt die Replikation auf ein Schlüsselpräfix, Objekt-Tags oder beides. |
| `ExistingObjectReplication` | Schließt Objekte ein, die vor der Regel vorhanden waren, wenn der Wert `Enabled` ist. |
| `DeleteMarkerReplication` | Repliziert Löschmarker, wenn der Wert `Enabled` ist. |
| `DeleteReplication` | Repliziert das Löschen einer bestimmten Objektversion, wenn der Wert `Enabled` ist. |
| `Destination` | Identifiziert das registrierte entfernte Ziel über die ARN. |

Die Bucket-Replikation ist gerichtet. Konfigurieren Sie ein separates Ziel und eine separate Regel in der Gegenrichtung, wenn beide Buckets Schreibvorgänge annehmen und sie zueinander replizieren sollen. Verwechseln Sie die Bucket-Replikation nicht mit der [Site-Replikation](/de/operations/high-availability/site-replication), die eine breitere Standortkonfiguration und Identitätsdaten synchronisiert.

## Konfiguration

### Voraussetzungen

- Eine RustFS-Quellbereitstellung und eine erreichbare S3-kompatible Zielbereitstellung.
- Ein Quell-Bucket und ein Ziel-Bucket mit aktivierter Versionierung.
- Eigene Ziel-Zugangsdaten, die die Versionierung des Ziel-Buckets abfragen und replizierte Objektversionen sowie Löschmarker schreiben können.
- Ein Quelladministrator, der entfernte Ziele und die Replikationskonfiguration verwalten darf.
- Netzwerkzugriff von jedem Quellknoten, der Replikationsarbeit ausführen kann, auf den Zielendpunkt.
- Der RustFS-Client [`rc`](/de/operations/rc), installiert auf einem Administrationshost.

Konfigurieren Sie für jede Bereitstellung einen `rc`-Alias. Verwenden Sie eigene Zugangsdaten und ersetzen Sie die Beispielendpunkte, bevor Sie die Befehle ausführen:

```bash
rc alias set source https://source.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias set target https://target.example.com:9000 \
	<target-access-key> <target-secret-key> \
	--region us-east-1 --bucket-lookup path

rc alias list
```

Die Quellbereitstellung verwendet die Zugangsdaten des Zielalias, wenn sie das entfernte Ziel registriert. `rc alias list` zeigt Endpunkte an, gibt aber keine geheimen Zugriffsschlüssel aus.

:::warning[Ziel-Zugangsdaten schützen]

RustFS speichert die Ziel-Zugangsdaten als Teil der Konfiguration des entfernten Ziels am Quell-Bucket. Verwenden Sie eigene Zugangsdaten mit Zugriff nur auf den Ziel-Bucket und verwenden Sie keine Root-Anmeldedaten erneut.

:::

### Berechtigungen

Die Administration auf der Quellseite verwendet diese Richtlinienaktionen:

| Operation | Erforderliche Aktion |
| --- | --- |
| Entferntes Ziel registrieren, aktualisieren oder entfernen | `admin:SetBucketTarget` |
| Entfernte Ziele auflisten | `admin:GetBucketTarget` |
| Replikationsmetriken lesen | `admin:GetReplicationMetrics` |
| Replikationskonfiguration anwenden oder löschen | `s3:PutReplicationConfiguration` |
| Replikationskonfiguration lesen | `s3:GetReplicationConfiguration` |

Die Ziel-Zugangsdaten müssen die Zielprüfung von RustFS bestehen. Sie prüft den Bucket-Zugriff, die Versionierung, Schreibvorgänge replizierter Objekte, replizierte Löschmarker und das Löschen von Objektversionen. Wenn Object Lock auf dem Quell-Bucket aktiviert ist, muss das Ziel eine kompatible Object-Lock-Unterstützung bieten.

### Buckets erstellen und versionieren

Erstellen Sie den Quell-Bucket:

```bash
rc bucket create source/my-bucket
```

Erstellen Sie den Ziel-Bucket:

```bash
rc bucket create target/my-bucket-replica
```

Aktivieren Sie die Versionierung auf beiden Buckets:

```bash
rc bucket version enable source/my-bucket
rc bucket version enable target/my-bucket-replica

rc bucket version info source/my-bucket
rc bucket version info target/my-bucket-replica
```

Setzen Sie die Versionierung des Quell-Buckets nicht aus, solange die Replikation konfiguriert ist.

## Verwendung

### Replikation in der Console konfigurieren

Die RustFS-Console fasst die Registrierung des entfernten Ziels und die Konfiguration der Replikationsregel in einem Formular zusammen.

1. Melden Sie sich an der Console der Quellbereitstellung an.
2. Öffnen Sie **Buckets**, suchen Sie den Quell-Bucket und wählen Sie **Settings** (Einstellungen).
3. Aktivieren Sie unter **Data Protection** (Datenschutz) **Versioning** (Versionierung), falls sie deaktiviert ist.
4. Wählen Sie unter **Automation** (Automatisierung) **Open Bucket Replication** (Bucket-Replikation öffnen).
5. Wählen Sie **Add Replication Rule** (Replikationsregel hinzufügen).
6. Konfigurieren Sie Ziel und Regel:

| Console-Feld | Wert |
| --- | --- |
| **Priority** | Priorität der Regelauswertung. Der Anfangswert ist `1`. |
| **Mode** | Wählen Sie **Asynchronous** (asynchron) oder **Synchronous** (synchron). Asynchron ist standardmäßig ausgewählt. |
| **Endpoint** | S3-API-Adresse des Ziels als `host:port`, ohne URL-Schema. |
| **Bucket** | Name des versionierten Ziel-Buckets. |
| **Access Key** und **Secret Key** | Eigene Zugangsdaten, die zur Replikation in den Ziel-Bucket berechtigt sind. |
| **Region** | Zielregion. Der Anfangswert ist `us-east-1`. |
| **Storage Class** | Speicherklasse, die am Ziel angewendet wird. Der Anfangswert ist `STANDARD`. |
| **Prefix** | Optionales Schlüsselpräfix, das passende Objekte einschränkt. |
| **Tags** | Optionale Filter für Name und Wert von Objekt-Tags. Wählen Sie **Add Tag** (Tag hinzufügen) für weitere Filter. |
| **Use TLS** | Aktiviert HTTPS für die Zielverbindung. |
| **Replicate Existing Objects** | Schließt Objekte ein, die vor der Regel erstellt wurden. Standardmäßig aktiviert. |
| **Replicate Delete Markers** | Kopiert Löschmarker zum Ziel. Standardmäßig aktiviert. |
| **Replicate Delete** | Kopiert das Löschen einer bestimmten Objektversion. Standardmäßig aktiviert. |
| **Health Check Interval** | Intervall der Integritätsprüfung des Ziels in Sekunden. Der Anfangswert ist `60`. |
| **Bandwidth Limit** | Übertragungsgrenze je Ziel, wählbar in KiB/s, MiB/s oder GiB/s. |

7. Wählen Sie **Save** (Speichern). RustFS prüft den Quell-Bucket, die Zielverbindung, die Ziel-Zugangsdaten und die Versionierung des Ziel-Buckets, bevor es die Regel annimmt.
8. Kehren Sie zu **Bucket Replication** (Bucket-Replikation) zurück, um die Regel zu prüfen, oder wählen Sie **Refresh** (Aktualisieren), um den angezeigten Zustand zu aktualisieren.

:::warning[Versionierung auf beiden Bereitstellungen aktivieren]

Quell- und Ziel-Bucket müssen beide die Versionierung aktiviert haben, bevor Sie die Regel speichern. Melden Sie sich bei Bedarf an der Console der Zielbereitstellung an und aktivieren Sie die Versionierung unter **Buckets** → **Settings** → **Data Protection**.

:::

Verwenden Sie für wiederholbare Automatisierung oder Konfigurationsverwaltung den folgenden `rc`-Ablauf.

### Replikationsregel mit rc hinzufügen

Erstellen Sie eine asynchrone Regel, die neue und vorhandene Objekte kopiert und Löschmarker sowie ausdrückliche Versionslöschungen weitergibt:

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-all \
	--priority 1 \
	--replicate delete,delete-marker,existing-objects
```

`rc` registriert das Ziel, erhält die erzeugte ARN und wendet die Replikationsregel in einem Vorgang an. Lassen Sie `--replicate`-Flags für Verhalten weg, das Sie nicht möchten. Fügen Sie `--sync` nur hinzu, wenn Schreibvorgänge auf die synchrone Replikation warten müssen.

Um die Replikation auf ein Präfix zu beschränken, fügen Sie `--prefix` hinzu:

```bash
rc bucket replication add source/my-bucket \
	--remote-bucket target/my-bucket-replica \
	--id replicate-documents \
	--priority 2 \
	--prefix documents/ \
	--replicate delete-marker,existing-objects
```

Objekte, die auf keine aktivierte Regel passen, bleiben nur im Quell-Bucket. Verwenden Sie `--bandwidth`, um eine Grenze in Bytes je Sekunde zu setzen, `--healthcheck-seconds`, um das Intervall der Integritätsprüfung des Ziels zu ändern, und `--storage-class`, um die Speicherklasse am Ziel zu überschreiben.

### Regeln auflisten und aktualisieren

Listen Sie die aktiven Regeln auf:

```bash
rc bucket replication list source/my-bucket
rc bucket replication list source/my-bucket --json
```

Aktualisieren Sie eine Regel über ihre ID. Nur angegebene Einstellungen werden geändert:

```bash
rc bucket replication update source/my-bucket \
	--id replicate-all \
	--priority 2 \
	--bandwidth 104857600 \
	--healthcheck-seconds 60
```

Verwenden Sie `--status Enabled|Disabled`, um eine Regel zu aktivieren oder zu deaktivieren, und `--sync true|false`, um ihren Replikationsmodus zu ändern.

### Konfiguration exportieren und importieren

Exportieren Sie die vollständige Replikationskonfiguration zur Prüfung oder Sicherung:

```bash
rc bucket replication export source/my-bucket --json > replication.json
```

Der Export enthält Metadaten des entfernten Ziels und den Zugriffsschlüssel des Ziels. Der geheime Zugriffsschlüssel wird ausgelassen. Behandeln Sie die Datei als sensible Konfiguration.

Importieren Sie eine zuvor exportierte Konfiguration:

```bash
rc bucket replication import source/my-bucket replication.json
```

### Replikationskonfiguration löschen

```bash
rc bucket replication remove source/my-bucket --id replicate-all

# Remove every replication rule from the bucket.
rc bucket replication remove source/my-bucket --all
```

RustFS entfernt außerdem entfernte Replikationsziele, auf die die gelöschte Konfiguration verweist. Objekte oder Versionen, die bereits in den Ziel-Bucket kopiert wurden, werden nicht gelöscht. Entfernen oder behalten Sie diese Objekte entsprechend den Lebenszyklus- und Aufbewahrungsanforderungen des Ziel-Buckets.

:::note[Antwort von rc 0.1.29 beim Entfernen]

Nachdem RustFS die Replikationskonfiguration und ihre Ziele entfernt hat, kann `rc 0.1.29` beim Versuch einer zweiten Zielbereinigung `Remote target not found` melden. Führen Sie `rc bucket replication list source/my-bucket --json` aus. Ein leeres `rules`-Array bestätigt, dass die Konfiguration entfernt wurde.

:::

## Überprüfung

### Bereitschaft des Ziels prüfen

`rc bucket replication add` prüft den Quellzugriff, die Zielkonnektivität, die Ziel-Zugangsdaten und die Bucket-Versionierung, bevor es die Regel erstellt. Bestätigen Sie das resultierende Ziel und die Regeleinstellungen:

```bash
rc bucket replication list source/my-bucket --json
```

### Objekt replizieren

Laden Sie ein Testobjekt auf die Quelle hoch:

```bash
printf 'hello from RustFS replication\n' > /tmp/hello.txt
rc object copy /tmp/hello.txt source/my-bucket/hello.txt
```

Rufen Sie die Metadaten des Quellobjekts ab (Head):

```bash
rc object stat source/my-bucket/hello.txt --json
```

Weil die Replikation standardmäßig asynchron ist, erscheint das Zielobjekt möglicherweise nicht sofort. Wiederholen Sie diesen Befehl, bis er erfolgreich ist:

```bash
rc object stat target/my-bucket-replica/hello.txt --json
rc object show target/my-bucket-replica/hello.txt
```

Vergleichen Sie die Werte `etag` und `size_bytes` von Quelle und Ziel und prüfen Sie anschließend, dass `object show` den erwarteten Inhalt zurückgibt.

Um die Replikation von Löschmarkern zu prüfen, löschen Sie das Quellobjekt und listen Sie die Versionen auf beiden Buckets auf:

```bash
rc object remove source/my-bucket/hello.txt --force

rc bucket version list source/my-bucket/hello.txt --json
rc bucket version list target/my-bucket-replica/hello.txt --json
```

Wenn die Replikation von Löschmarkern erfolgreich ist, hat der neueste Eintrag auf beiden Buckets `is_delete_marker: true`.

### Replikationsmetriken anzeigen

```bash
rc bucket replication status source/my-bucket
rc bucket replication status source/my-bucket --json
```

Der Befehl gibt die aktuellen Replikationsstatistiken des Quellknotens im Arbeitsspeicher zurück. Metriken können null bleiben, auch nachdem ein Objekt das Ziel erreicht hat. Verwenden Sie sie deshalb zusammen mit Prüfungen des Zielobjekts und der Versionen und nicht als einziges Überprüfungssignal.

### Fehler beheben

| Symptom | Prüfung |
| --- | --- |
| `bucket versioning must be enabled` | Aktivieren Sie die Versionierung auf dem Quell-Bucket. |
| Die Zielregistrierung meldet `not versioned` | Aktivieren Sie die Versionierung auf dem Ziel-Bucket. |
| `replication target configuration not found` | Prüfen Sie Zielalias, Zugangsdaten und Ziel-Bucket erneut und führen Sie `replication add` noch einmal aus. |
| Die Regel meldet ein veraltetes Ziel | Aktualisieren Sie die Regelliste und wiederholen Sie `replication add`. Wenn der Zustand bleibt, entfernen Sie die fehlgeschlagene Konfiguration und erstellen Sie das Ziel neu. |
| Das Zielobjekt erscheint nicht | Prüfen Sie die Erreichbarkeit des Ziels, die Zugangsdaten, das Zielkontingent und `rc bucket replication status`. |
| Die Replikation schlägt fehl | Prüfen Sie die Protokolle des Quellknotens auf die Ziel-ARN und den Objektschlüssel. |
| Das Entfernen des Ziels ist nicht zulässig | Löschen oder ersetzen Sie die Replikationskonfiguration, bevor Sie ein referenziertes Ziel entfernen. |

## Nächste Schritte

- [Bucket-Lebenszyklus verwalten](../lifecycle-management.md)
- [Bucket-Kontingente konfigurieren](./quota.md)
- [Observability konfigurieren](/de/operations/observability)
