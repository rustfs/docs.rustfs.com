---
title: "Datenwiederherstellung von Knoten"
description: "Stellen Sie ausgefallene RustFS-Knoten und Laufwerke wieder her, überwachen Sie die automatische Datenwiederherstellung und führen Sie begrenzte manuelle Heal-Aufgaben mit rc aus."
---

Die Datenwiederherstellung (Healing) von RustFS rekonstruiert fehlende oder inkonsistente Daten mit Erasure Coding aus den gesunden Shards, die in einem Speicherset verbleiben. Verwenden Sie diesen Ablauf, nachdem Sie einen nicht verfügbaren Knoten wiederhergestellt, ein ausgefallenes Laufwerk ersetzt oder Alarme des Scanners und der Datenwiederherstellung geprüft haben.

Die Datenwiederherstellung ist ein Speichervorgang des Clusters. Sie unterscheidet sich von der [Site-Replikation](/de/operations/high-availability/site-replication), die Daten und Identitätskonfiguration zwischen unabhängigen RustFS-Bereitstellungen kopiert.

:::warning[Datenwiederherstellung ist keine Sicherung]

RustFS kann Daten nur rekonstruieren, solange im betroffenen Erasure-Set genug gesunde Shards verbleiben. Die Datenwiederherstellung kann ein Objekt nicht wiederherstellen, wenn die Ausfälle die verfügbare Redundanz des Sets überschreiten, und sie schützt nicht vor absichtlichem Löschen oder vor Beschädigung auf Anwendungsebene. Halten Sie unabhängige Sicherungen oder Replikation gemäß Ihren Wiederherstellungsanforderungen vor.

:::

## Wie die Datenwiederherstellung arbeitet

RustFS koordiniert mehrere Quellen der Datenwiederherstellung über die Heal-Warteschlange des Clusters:

- `autoHeal`: Der automatische Laufwerksscanner erkennt Laufwerke, die unformatiert sind oder nach einem Ausfall zurückgekehrt sind, und reiht die Datenwiederherstellung des Erasure-Sets ein.
- `scanner`: Der Hintergrundscanner der Daten kann die Datenwiederherstellung von Objekten und Buckets einreihen, wenn er einen inkonsistenten Speicherzustand findet.
- `readRepair`: Pfade der Lesereparatur können Arbeit einreichen, die beim Bedienen von Anfragen entdeckt wurde.
- `internal`: Interne Wiederherstellungspfade können vom System angestoßene Arbeit einreichen.
- `admin`: Administratoren können mit `rc admin heal start` eine rekursive Datenwiederherstellung, eine für einen Bucket oder eine für ein Präfix einreichen.

Die automatische Datenwiederherstellung von Laufwerken läuft mit niedriger Priorität. Das Statusobjekt `healOperations` verwendet diese Quellnamen, um eingereihte, aktive und erneut versuchte Arbeit zu trennen.

:::note[Die Rekonstruktion verbraucht Clusterressourcen]

Die Datenwiederherstellung liest gesunde Shards und schreibt rekonstruierte Daten. Tiefe Scans fügen Lese- und Prüfsummenarbeit hinzu. Beobachten Sie die Client-Latenz, die Laufwerksauslastung, die verfügbare Kapazität und die Heal-Warteschlange, solange die Wiederherstellung aktiv ist.

:::

## Voraussetzungen

Bereiten Sie vor der Wiederherstellung eines Knotens oder Laufwerks Folgendes vor:

- Eine RustFS-Bereitstellung, die noch genug gesunde Shards hat, um die betroffenen Daten zu rekonstruieren.
- Stabile Knotenadressen und die ursprünglich konfigurierten Einhängepfade des Speichers.
- Ersatzspeicher mit einer Kapazität, die zum betroffenen Erasure-Set passt.
- Den RustFS-Client [`rc`](/de/operations/rc) auf einem abgesicherten Administrationshost.
- Administrative Zugangsdaten, die Clusterinformationen, Scanner und Datenwiederherstellung erlauben.
- Ein Wartungsfenster, wenn Sie Hardware ersetzen oder einen tiefen rekursiven Scan ausführen.

Notieren Sie den ausgefallenen Knoten, den Speicherpool, das Set, den Laufwerksendpunkt, den Einhängepfad und die UUID des Dateisystems, bevor Sie Hardware ändern. Entfernen Sie keine weiteren Laufwerke aus demselben Erasure-Set, solange die Wiederherstellung nicht abgeschlossen ist.

## 1. Ausgefallene Komponente identifizieren

Konfigurieren Sie einen `rc`-Alias, falls Sie noch keinen haben:

```bash
rc alias set rustfs https://rustfs.example.com:9000 \
	<your-access-key> <your-secret-key> \
	--region us-east-1 --bucket-lookup path
```

Prüfen Sie Clusterbereitschaft, Topologie, Speicherintegrität und Aktivität der Datenwiederherstellung:

```bash
rc ready rustfs
rc admin info cluster rustfs
rc admin info storage rustfs
rc admin scanner status rustfs
rc admin heal status rustfs
```

Die Bereitschaft kann fehlschlagen, während der Cluster beeinträchtigt ist. Nutzen Sie die administrativen Informationsbefehle, um zu erkennen, welcher Knoten oder welches Laufwerk nicht verfügbar ist, und notieren Sie Speicherpool und Position im Erasure-Set.

Fordern Sie für maschinenlesbare Ausgabe JSON an:

```bash
rc --json admin info storage rustfs
rc --json admin heal status rustfs
```

Der zusammengefasste Status der Datenwiederherstellung meldet den Laufzeitzustand, eingereihte und aktive Aufgaben, erneut versuchte Arbeit, Anfragequellen, Prioritäten und verfügbare Fortschrittszähler. Eine Warteschlange der Länge null belegt nicht, dass ein offline geschaltetes Laufwerk ersetzt wurde oder dass jedes Objekt wiederherstellbar ist. Gleichen Sie sie mit Speichertopologie und Bereitschaft ab.

## 2. Knoten oder Laufwerk wiederherstellen

Beheben Sie den zugrunde liegenden Ausfall, bevor Sie eine manuelle Datenwiederherstellung starten.

Bei einem Knotenausfall:

1. Stellen Sie die konfigurierte Netzwerkidentität des Knotens und die Konnektivität zu jedem anderen RustFS-Knoten auf dem S3-API-Port wieder her, normalerweise `9000`.
2. Hängen Sie die ursprünglichen Datenlaufwerke an ihren konfigurierten Pfaden ein.
3. Bestätigen Sie, dass der RustFS-Prozess dieselbe Konfiguration der Speicherendpunkte verwendet wie der Rest des Clusters.
4. Starten Sie RustFS und prüfen Sie, dass der Knoten dem Cluster wieder beitritt.

Bei einem ausgefallenen Laufwerk:

1. Stoppen Sie den RustFS-Prozess auf dem betroffenen Knoten, bevor Sie Speicher entfernen oder neu einhängen.
2. Ersetzen Sie das ausgefallene Gerät und bereiten Sie sein Dateisystem gemäß [Laufwerke vorbereiten](/de/installation/requirement/disk-preparation) vor.
3. Hängen Sie den Ersatz am exakten Pfad des ausgefallenen Laufwerks ein und aktualisieren Sie `/etc/fstab` mit der UUID seines Dateisystems.
4. Prüfen Sie Einhängung, Dateisystemtyp, Eigentümerschaft und verfügbare Kapazität, bevor Sie RustFS starten.
5. Starten Sie RustFS und bestätigen Sie, dass das Laufwerk im erwarteten Speicherpool und Erasure-Set erscheint.

```bash
findmnt /data/rustfs0
df -hT /data/rustfs0
rc admin info storage rustfs
```

:::warning[Verwenden Sie veralteten Speicher nicht unbesehen weiter]

Bestätigen Sie Identität und Inhalt jedes Geräts, bevor Sie es an einem RustFS-Datenpfad einhängen. Kopieren Sie interne Metadaten nicht zwischen Laufwerken, legen Sie nicht mehrere konfigurierte Endpunkte auf ein Ersatzdateisystem und hängen Sie einen Ersatz nicht über einen Pfad ein, der noch benötigte Daten enthält.

:::

## 3. Automatische Datenwiederherstellung überwachen

Nachdem der Knoten oder das Ersatzlaufwerk online ist, kann RustFS den Wiederherstellungskandidaten erkennen und die Datenwiederherstellung des Erasure-Sets einreihen. Prüfen Sie sowohl den Speicherzustand als auch die zusammengefasste Aktivität der Datenwiederherstellung:

```bash
rc admin info storage rustfs
rc admin heal status rustfs
rc admin scanner status rustfs
```

Beobachten Sie in der JSON-Ausgabe diese Gruppen:

| Feld | Bedeutung |
| --- | --- |
| `state` | Laufzeitzustand der Datenwiederherstellung, etwa `active` oder `idle`. |
| `healQueueLength` | Gesamte Arbeit, die in der Heal-Warteschlange wartet. |
| `healActiveTasks` | Gesamtzahl der derzeit laufenden Heal-Aufgaben. |
| `healOperations` | Warteschlange, aktive Aufgaben und erneute Versuche, gruppiert nach Quelle (`scanner`, `admin`, `autoHeal`, `internal` und `readRepair`) und Priorität. |
| `progress` | Verfügbare Summen für gescannte, wiederhergestellte und fehlgeschlagene Objekte sowie verarbeitete Bytes. |
| `clusterStatusComplete` | Ob die Antwort jeden erwarteten Knoten enthält. |

Werten Sie `idle` nicht für sich allein als erfolgreiche Wiederherstellung. Bestätigen Sie, dass das Ersatzlaufwerk online ist, keine Fehler der Datenwiederherstellung übrig sind, der Cluster bereit ist und repräsentative Objekte lesbar sind.

## 4. Gezielte manuelle Datenwiederherstellung ausführen

Verwenden Sie eine manuelle Aufgabe, wenn die automatische Wiederherstellung den erforderlichen Pfad nicht abdeckt oder wenn Sie nach einem Vorfall einen ausdrücklichen Scan brauchen. Beginnen Sie mit dem engsten Bucket oder Präfix, der die betroffenen Daten enthält.

Sehen Sie eine Bucket-Datenwiederherstellung in der Vorschau an, ohne Änderungen anzuwenden:

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--scan-mode normal \
	--dry-run
```

Führen Sie die gezielte Datenwiederherstellung aus, nachdem Sie die Vorschau geprüft haben:

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--scan-mode normal
```

Begrenzen Sie die Aufgabe auf ein Objektpräfix, wenn der betroffene Umfang bekannt ist:

```bash
rc admin heal start rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--scan-mode deep
```

`normal` ist der Standard-Scanmodus. Verwenden Sie `deep`, wenn Sie eine tiefere Datenprüfung brauchen und die zusätzliche Laufwerks-E/A eingeplant haben. Lassen Sie `--bucket` nur weg, wenn ein rekursiver Scan aller Buckets nötig ist.

:::warning[Prüfen Sie ändernde Optionen getrennt]

Die Option `--remove` entfernt verwaiste Objekte oder Teile, und `--recreate` fordert die Neuerzeugung fehlender Daten an. Fügen Sie keine der beiden Optionen zu einem Störungsbefehl hinzu, bevor Sie den betroffenen Speicherzustand eingesehen, mit `--dry-run` getestet und das beabsichtigte Ergebnis bestätigt haben.

:::

## 5. Manuelle Aufgabe verfolgen

Jede manuelle Datenwiederherstellung liefert ein `clientToken`. Speichern Sie es mit dem Vorfallsdatensatz, weil Status- und Stopp-Operationen für diese Aufgabe das Token erfordern.

Übergeben Sie für eine Bucket- oder Präfixaufgabe das ursprüngliche Ziel und das Token:

```bash
rc admin heal status rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--client-token <client-token>
```

Verwenden Sie für eine rekursive Aufgabe, die ohne `--bucket` gestartet wurde, nur das Token:

```bash
rc admin heal status rustfs --client-token <client-token>
```

Der Befehl ohne Token bleibt die clusterweite Hintergrundzusammenfassung:

```bash
rc admin heal status rustfs
```

Der Aufgabenstatus kann Summen gescannter, wiederhergestellter und fehlgeschlagener Elemente, verarbeitete Bytes, das aktuelle Element, den Scanmodus, die Startzeit und die letzte Aktualisierung enthalten. Prüfen Sie fehlgeschlagene Elemente, statt sich nur auf den zusammengefassten Zustand der Aufgabe zu verlassen.

## 6. Wiederherstellung prüfen

Prüfen Sie nach dem Leeren der Heal-Warteschlange den Cluster und den Pfad der wiederhergestellten Daten:

```bash
rc ready rustfs
rc admin info cluster rustfs
rc admin info storage rustfs
rc admin heal status rustfs
```

Lesen Sie repräsentative Objekte aus betroffenen Buckets und Versionen. Für ein bekanntes Testobjekt:

```bash
rc object stat rustfs/my-bucket/hello.txt
rc object copy rustfs/my-bucket/hello.txt ./hello-recovered.txt
```

Vergleichen Sie das heruntergeladene Objekt mit einer unabhängigen Prüfsumme oder einer vertrauenswürdigen Quelle, wenn eine verfügbar ist. Ein erfolgreiches Lesen eines Objekts prüft diese Anfrage, nicht jedes Objekt und nicht jeden Shard im Cluster.

Beobachten Sie Speicherintegrität und Fehler der Datenwiederherstellung weiter, nachdem der Cluster bereit ist. Bewahren Sie den zeitlichen Ablauf des Vorfalls, die Angaben zum ausgefallenen Gerät, das Aufgabentoken und die endgültige Statusausgabe für die Nachbetrachtung auf.

## 7. Manuelle Datenwiederherstellung stoppen

Stoppen Sie nur die Aufgabe, die Sie identifiziert haben. Nehmen Sie für eine Bucket- oder Präfixaufgabe das ursprüngliche Ziel und das Token auf:

```bash
rc admin heal stop rustfs \
	--bucket my-bucket \
	--prefix archive/ \
	--client-token <client-token>
```

Stoppen Sie eine rekursive, an ein Token gebundene Aufgabe mit:

```bash
rc admin heal stop rustfs --client-token <client-token>
```

Der Stopp-Befehl ohne Token zielt auf den globalen Hintergrundvorgang der Datenwiederherstellung:

```bash
rc admin heal stop rustfs
```

Verwenden Sie den globalen Stopp nur, wenn fortgesetzte Hintergrundarbeit ein größeres Betriebsrisiko erzeugt. Wenn Sie die Datenwiederherstellung stoppen, bleibt die Wiederherstellung unvollständig. Notieren Sie den Grund und bestätigen Sie, wie die Datenwiederherstellung fortgesetzt wird, bevor Sie den Vorfall schließen.

## Fehlerbehebung

### Das Ersatzlaufwerk wird nicht wiederhergestellt

Bestätigen Sie, dass der Ersatz am konfigurierten Endpunkt eingehängt ist und in `rc admin info storage` erscheint. Prüfen Sie die RustFS-Protokolle auf Fehler bei der Laufwerksidentifikation, der Formatierung, den Berechtigungen oder der Zulassung zur Warteschlange. Bestätigen Sie außerdem, dass die Dienste der Datenwiederherstellung initialisiert sind, mit `rc admin heal status`.

### Der Status der Datenwiederherstellung ist unvollständig

Wenn `clusterStatusComplete` falsch ist, hat mindestens ein erwarteter Knoten nicht zur zusammengefassten Antwort beigetragen. Stellen Sie die Konnektivität von Knoten zu Knoten wieder her und prüfen Sie Speicher und Prozesszustand jedes Knotens, bevor Sie Cluster-Summen vertrauen.

### Die Warteschlange bleibt aktiv

Vergleichen Sie eingereihte, aktive und erneut versuchte Arbeit nach Quelle. Eine wachsende Zahl `autoHeal` weist auf die Wiederherstellung von Laufwerk oder Erasure-Set hin. Scanner-Arbeit weist auf Entdeckung im Hintergrund hin. Admin-Arbeit gehört zu manuell eingereichten Aufgaben. Prüfen Sie Laufwerkslatenz, freie Kapazität, Knotenkonnektivität und wiederholte Elementfehler, bevor Sie eine weitere Aufgabe starten.

### Objekte lassen sich nicht rekonstruieren

Stoppen Sie weitere Wartung am betroffenen Erasure-Set. Bewahren Sie die verbleibenden Laufwerke und Protokolle auf und stellen Sie dann fest, ob genug gesunde Shards überleben. Wiederholte tiefe Scans können Daten nicht rekonstruieren, wenn die verfügbare Redundanz bereits überschritten ist.

### Eine manuelle Aufgabe lässt sich nicht abfragen

Verwenden Sie das `clientToken`, das `heal start` zurückgegeben hat. Bucket- und Präfixaufgaben müssen mit demselben Ziel aus `--bucket` und `--prefix` abgefragt werden, das beim Start verwendet wurde. Eine rekursive Root-Aufgabe verwendet das Token ohne Bucket.

## Nächste Schritte

- Lesen Sie [Statusprüfung](/de/operations/status-check) für Prüfungen von Bereitschaft, Cluster und Kapazität.
- Konfigurieren Sie [Observability](/de/operations/observability), um bei Laufwerksintegrität und anhaltender Wiederherstellungsarbeit zu alarmieren.
- Lesen Sie [Site-Replikation](/de/operations/high-availability/site-replication), wenn die Wiederherstellung eine unabhängige RustFS-Bereitstellung erfordert.
