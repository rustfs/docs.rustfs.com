---
title: "EC-Konfiguration"
description: "Diese Seite beschreibt, wie Sie die Größe des Erasure-Sets und die Parität von RustFS planen und konfigurieren, bevor Sie Speicherpools bereitstellen."
---

RustFS verwendet Reed-Solomon-Erasure-Coding (EC), um jedes Objekt auf die Datenträger eines Erasure-Sets zu verteilen. Schätzen Sie auf dieser Seite die nutzbare Kapazität, verstehen Sie die automatischen Standardwerte und entscheiden Sie, ob Ihre Bereitstellung eine ausdrückliche Paritätseinstellung benötigt.

## Den Aufbau verstehen

Jeder Speicherpool ist in ein oder mehrere Erasure-Sets unterteilt. Für ein Set mit `N` Datenträgern und `M` Paritätsshards gilt:

- Datenshards: `N - M`
- Paritätsshards: `M`
- maximale Anzahl nicht verfügbarer Shards, die rekonstruiert werden können: `M`
- ungefähre Kapazitätseffizienz: `(N - M) / N`

Ein Set mit 16 Datenträgern und `EC:4` speichert beispielsweise 12 Datenshards und 4 Paritätsshards. Die ungefähre Kapazitätseffizienz beträgt 75 %, bevor der Aufwand für Dateisystem, Metadaten und Betrieb hinzukommt.

:::note[Ausfalldomänen]

Die Parität beschreibt nicht verfügbare Shards innerhalb eines Erasure-Sets. Die Fehlertoleranz auf Knotenebene hängt davon ab, wie die Datenträger des Sets auf die Knoten verteilt sind. Gehen Sie nicht davon aus, dass `EC:4` immer vier vollständige Knotenausfälle toleriert; ein Knoten kann mehrere Datenträger desselben Sets aufnehmen.

:::

## Automatische Parität

Wir empfehlen, `RUSTFS_STORAGE_CLASS_STANDARD` nicht zu setzen, sofern Sie keine konkrete, geprüfte Anforderung an Haltbarkeit oder Kapazität haben. RustFS leitet die STANDARD-Parität für jeden Pool unabhängig aus der Anzahl der Datenträger pro Erasure-Set ab:

| Datenträger pro Erasure-Set (`N`) | Automatische STANDARD-Parität | Datenshards | Ungefähre Effizienz |
| --- | --- | --- | --- |
| 1 | `EC:0` | 1 | 100% |
| 2–3 | `EC:1` | `N - 1` | 50%–67% |
| 4–5 | `EC:2` | `N - 2` | 50%–60% |
| 6–7 | `EC:3` | `N - 3` | 50%–57% |
| 8–16 | `EC:4` | `N - 4` | 50%–75% |

Erasure-Sets mit mehreren Datenträgern umfassen 2 bis 16 Datenträger. Eine Bereitstellung mit einem einzelnen Datenträger ist eine eigene Anordnung ohne Parität.

:::warning[Die Set-Breite verwenden, nicht die Summe des Clusters]

Prüfen Sie die Parität anhand der Anzahl der Datenträger in jedem Erasure-Set, nicht anhand der Gesamtzahl der Datenträger im Cluster. Ein Cluster kann mehrere Erasure-Sets oder Speicherpools mit unterschiedlicher Breite enthalten.

:::

## Nutzbare Kapazität schätzen

Schätzen Sie die EC-Kapazität für einen Pool, dessen Sets alle dieselbe Breite und dieselbe Parität verwenden, mit:

$$
\text{nutzbare Kapazität} \approx \text{Rohkapazität} \times \frac{N-M}{N}
$$

16 gleiche Datenträger mit je 10 TiB, angeordnet als ein Set mit 16 Datenträgern und `EC:4`, ergeben beispielsweise ungefähr:

$$
160\ \text{TiB} \times \frac{16-4}{16} = 120\ \text{TiB}
$$

Reservieren Sie zusätzliche Kapazität für XFS, Objektmetadaten, Versionierung, unvollständige Uploads, Datenwiederherstellung (Healing) und den normalen betrieblichen Spielraum. Behandeln Sie das Ergebnis als Planungsschätzung, nicht als garantiert verfügbaren Speicherplatz.

## Parität konfigurieren

Setzen Sie die EC-Variablen in derselben Umgebungsdatei, die der RustFS-Dienst verwendet, zum Beispiel in `/etc/default/rustfs`.

Lassen Sie `RUSTFS_STORAGE_CLASS_STANDARD` weg oder leer, um die empfohlene automatische STANDARD-Parität zu verwenden:

```ini title="/etc/default/rustfs"
RUSTFS_STORAGE_CLASS_STANDARD=
```

Um die Parität ausdrücklich festzulegen, verwenden Sie das Format `EC:<parity>`:

```ini title="/etc/default/rustfs"
RUSTFS_STORAGE_CLASS_STANDARD=EC:4
RUSTFS_STORAGE_CLASS_RRS=EC:1
```

`RUSTFS_STORAGE_CLASS_STANDARD` steuert Schreibvorgänge mit der Speicherklasse `STANDARD`. `RUSTFS_STORAGE_CLASS_RRS` steuert Schreibvorgänge mit `REDUCED_REDUNDANCY` und verwendet auf Sets mit mehreren Datenträgern standardmäßig einen Paritätsshard. RustFS akzeptiert diese beiden Speicherklassen für lokale Schreibvorgänge.

Ausdrückliche Einstellungen müssen alle folgenden Regeln erfüllen:

- Die Parität darf in jedem Ziel-Set höchstens die Hälfte der Datenträger betragen: `M <= N / 2`
- Die STANDARD-Parität muss größer oder gleich der Parität von `REDUCED_REDUNDANCY` sein, wenn beide ungleich null sind
- Die konfigurierte Parität muss für jeden Pool gültig sein, einschließlich des schmalsten Pools

RustFS prüft ausdrückliche Speicherklassen beim Start gegen jeden Pool. Ein ungültiger Wert lässt den Start fehlschlagen, statt die Parität stillschweigend zu senken. Entfernen Sie den ausdrücklichen STANDARD-Wert, um zur automatischen Parität je Pool zurückzukehren, oder wählen Sie einen Wert, den jeder Pool erfüllen kann.

## Breite des Erasure-Sets steuern

RustFS wählt eine gültige Set-Breite normalerweise automatisch aus der Volume-Topologie. Die Breite von Sets mit mehreren Datenträgern reicht von 2 bis 16.

Mit `RUSTFS_ERASURE_SET_DRIVE_COUNT` können Sie die Breite festlegen, wenn Sie eine bestimmte symmetrische Anordnung benötigen:

```ini title="/etc/default/rustfs"
RUSTFS_ERASURE_SET_DRIVE_COUNT=16
```

Der Wert muss die Pool-Topologie symmetrisch teilen und für jedes Muster zur Erweiterung der Volumes gültig sein. RustFS lehnt eine Breite ab, die die konfigurierten Endpunkte nicht gleichmäßig aufteilen kann. Setzen Sie diese Variable nicht, sofern Sie die vollständige Anordnung des Pools nicht geprüft haben.

## Konfiguration prüfen

Bevor Sie RustFS starten oder neu starten:

1. Ermitteln Sie für jeden Pool die Anzahl der Datenträger pro Erasure-Set.
2. Bestätigen Sie, dass die ausdrückliche Parität nicht die Hälfte der schmalsten Set-Breite überschreitet.
3. Schätzen Sie die nutzbare Kapazität und reservieren Sie betrieblichen Spielraum.
4. Behalten Sie auf jedem Knoten dieselbe Umgebungskonfiguration des Dienstes bei.

Verwenden Sie nach dem Start die Seite **Status** der Console (Weboberfläche) oder `rc admin info cluster`, um den Aufbau des Backends, die Erasure-Coding-Parität, die Verfügbarkeit der Datenträger und die Pool-Zugehörigkeit zu bestätigen. Den vollständigen Ablauf beschreibt [Statusprüfung](/de/operations/status-check).

## Nächste Schritte

- [Speicherdatenträger vorbereiten](./disk-preparation.md)
- [Bereitstellungstopologie auswählen](/de/installation#deployment-mode-comparison)
- [Alle Umgebungsvariablen für den Speicher prüfen](/de/reference/environment-variables#storage--erasure)
