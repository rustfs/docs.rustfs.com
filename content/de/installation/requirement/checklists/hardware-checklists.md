---
title: "Hardwareleitfaden für die Produktion"
description: "Diese Seite beschreibt die Bemessung und Konfiguration der Hardware für RustFS-Produktionsbereitstellungen."
---

## Planungsüberlegungen

Bewerten Sie vor der Bereitstellung von RustFS in der Produktion über einen Zeitraum von zwei bis drei Wochen Ihre Arbeitslast und Ihren Kapazitätsbedarf. Konzentrieren Sie sich auf die folgenden Faktoren:

1. **Datenmenge**

   - **Anfängliche Datenmenge**: Schätzen Sie die nutzbare Datenmenge zum Produktivstart (in TiB), einschließlich des Verhältnisses von heißen zu kalten Daten.
   - **Wachstumsprognose**: Schätzen Sie das Datenwachstum der nächsten 24 Monate anhand der Geschäftspläne. Wir empfehlen, das Wachstum quartalsweise zu modellieren.
   - **Objektanzahl**: Schätzen Sie die Gesamtzahl der Objekte aus der durchschnittlichen Objektgröße (idealerweise 128 KB bis 1 MB). Bereitstellungen mit mehr als 100 Millionen Objekten brauchen zusätzliche Abstimmung.

2. **Eigenschaften der Arbeitslast**

   - **Zugriffsmuster**: Unterscheiden Sie leselastige Arbeitslasten (etwa Inhaltsverteilung) von schreiblastigen Arbeitslasten (etwa Protokollerfassung).
   - **Einhaltung von Vorschriften**: Aufbewahrungsfristen müssen die Branchenvorschriften erfüllen (einige Finanzvorschriften verlangen beispielsweise eine Aufbewahrung von mindestens fünf Jahren).
   - **Bereitstellung an mehreren Standorten**: Bewerten Sie bei regionsübergreifenden Bereitstellungen die Netzwerklatenz (idealerweise unter 50 ms) und die Bandbreitenkosten.

3. **Speicherarchitektur**

   - **Bucket-Planung**: Organisieren Sie Buckets nach Geschäftseinheit. Wir empfehlen höchstens 500 aktive Buckets je Cluster.
   - **Notfallwiederherstellung**: Wählen Sie Aktiv-Aktiv-Replikation (empfohlen) oder asynchrone Replikation, je nachdem, wie kritisch die Daten sind.

## Hardware-Konfigurationsmatrix

Basiskonfigurationen auf Grundlage von Lasttestergebnissen:

| Komponente | Einstieg | Produktionsstandard | Hohe Leistung |
| --- | --- | --- | --- |
| Knotenanzahl | 4 Knoten | 8 Knoten | 16 oder mehr Knoten |
| Speichermedium | 4× NVMe-SSD | 8× NVMe-SSD | 12× NVMe-SSD |
| Netzwerkarchitektur | 2× 25GbE (Link-Aggregation) | 2× 100GbE | 200GbE |
| CPU | 2×Intel Silver 4310 (16 Kerne) | 2×AMD EPYC 7313 (32 Kerne) | 2×Intel Platinum 8461Y (48 Kerne) |
| Arbeitsspeicher | 64 GB DDR4-3200 ECC | 256 GB DDR5-4800 ECC | 512 GB DDR5-5600 ECC |
| Speichercontroller | HBA 9500-8i | HBA 9600-16i | Redundante Architektur mit zwei Controllern |

**Bereitstellungsrichtlinien:**

1. Verwenden Sie homogene Knoten: Jeder Knoten sollte identische Hardware aus derselben Charge und dieselben Firmware-Versionen aufweisen.
2. Das Netzwerk muss eine Leaf-Spine-Topologie, ein physisch getrenntes Speichernetz und zwei Uplink-Verbindungen verwenden.
3. Wir empfehlen 2U-Server mit mindestens 12 Laufwerksschächten je Knoten, abhängig von der benötigten Anzahl der Datenträger.

## Leistungsoptimierung

### Optimierung der Netzwerktopologie (höchste Priorität)

- **Bandbreitenbemessung**: Planen Sie 0,5 Gbps Bandbreite je TB nutzbarer Daten ein (100 TB Daten benötigen beispielsweise 50 Gbps dedizierte Bandbreite).
- **Latenzanforderungen**:
  - P99-Latenz zwischen Knoten ≤ 2 ms
  - Latenz zwischen Racks ≤ 5 ms

### Abstimmung des Speichersubsystems

- **Controller-Konfiguration**:
  - Aktivieren Sie den Vorauslese-Cache (mindestens 256 MB empfohlen).
  - Deaktivieren Sie alle RAID-Funktionen und verwenden Sie den Durchleitungsmodus (HBA/JBOD).
  - Prüfen Sie den Zustand der BBU regelmäßig.
- **SSD-Parameter**:
  - Reservieren Sie 20 % Überprovisionierung (OP), um die Lebensdauer zu verbessern.
  - Aktivieren Sie atomare Schreibvorgänge (erfordert Hardwareunterstützung).

### Arbeitsspeicherzuweisung

- **Zuweisungsverhältnisse**:
  - Metadaten-Cache: 60 % des gesamten Arbeitsspeichers
  - Lese- und Schreibpuffer: 30 %
  - Systemreserve: 10 %

## Referenzmodell für das Netzwerkdesign

### Netzwerkbandbreite und Datenträgeranzahl

| Netzwerk | Theoretischer Durchsatz | Datenträgertyp | Maximale Datenträger je Knoten |
| --- | --- | --- | --- |
| 10GbE | 1,25 GB/s | 7.2K HDD (180 MB/s) | 8 Datenträger |
| 25GbE | 3,125 GB/s | SATA-SSD (550 MB/s) | 6 Datenträger |
| 100GbE | 12,5 GB/s | NVMe Gen4 (7 GB/s) | 2 (bei voller Lese- und Schreibgeschwindigkeit) |

**Beispiel**: Eine Videoplattform betreibt einen Cluster mit 16 Knoten. Jeder Knoten verfügt über:

- 8×7,68 TB NVMe-SSD
- zwei NVIDIA ConnectX-5-NICs mit 100GbE

Der Cluster erreicht einen aggregierten Durchsatz von 38 GB/s.

## Bemessung des Arbeitsspeichers

Bemessen Sie den Arbeitsspeicher anhand der Datenträgerkapazität und des Lasttyps mit der folgenden Formel:

```python
# Memory calculation formula (unit: GB)
def calc_memory(data_tb, access_pattern):
 base = 32 # Base memory
 if access_pattern == "read_heavy":
 return base + data_tb * 0.8
 elif access_pattern == "write_heavy":
 return base + data_tb * 1.2
 else: # mixed
 return base + data_tb * 1.0
```

**Referenzgrößen**:

| Datenmenge | Leselastig | Schreiblastig | Gemischt |
| --- | --- | --- | --- |
| 10 TB | 40 GB | 44 GB | 42 GB |
| 100 TB | 112 GB | 152 GB | 132 GB |
| 500 TB | 432 GB | 632 GB | 532 GB |

## Speicherrichtlinien

### Speichermedien auswählen

| Metrik | HDD | SATA-SSD | NVMe (erforderlich) |
| --- | --- | --- | --- |
| Latenzanforderungen | > 50 ms | 1 bis 10 ms | < 1 ms |
| Durchsatzanforderungen | < 500 MB/s | 500 MB/s bis 3 GB/s | > 3 GB/s |
| Typische Anwendungsfälle | Archivspeicher | Cache für heiße Daten | Echtzeitanalysen |

### Dateisystemkonfiguration

```bash
# XFS formatting example
mkfs.xfs -f -L rustfs_disk1 -d su=256k,sw=10 /dev/sdb

# Recommended mount parameters
UUID=xxxx /mnt/disk1 xfs defaults,noatime,nodiratime,logbsize=256k 0 0
```

## Hochverfügbarkeit

1. **Stromversorgung**:

   - Verwenden Sie doppelte (redundante) Netzteile.
   - Schließen Sie jede PDU an eine eigene Einspeisung an.
   - Sehen Sie eine USV mit mindestens 30 Minuten Überbrückungszeit vor.

2. **Kühlungsanforderungen**:

   - Leistungsdichte im Rack ≤ 15 kW je Rack.
   - Halten Sie die Temperaturdifferenz zwischen Einlass und Auslass (ΔT) bei höchstens 8 °C.

3. **Firmware-Verwaltung**:

   - Pflegen Sie eine Hardware-Kompatibilitätsmatrix.
   - Vereinheitlichen Sie die Firmware-Versionen auf allen Knoten.

:::tip[Vor der Produktivsetzung]

Wir empfehlen, vor der Produktivsetzung einen 72-Stunden-Stresstest durchzuführen, der die folgenden Szenarien abdeckt:

1. Test beim Ausfall eines Knotens
2. Tests zur Netzwerkpartition
3. Lasttests mit Schreibspitzen (wir empfehlen einen Test mit 120 % des theoretischen Maximums)

:::

---

Diese Anleitung basiert auf der neuesten Entwicklungsversion von RustFS. Stimmen Sie diese Einstellungen für Produktionsbereitstellungen anhand der Dokumentation Ihres Hardwareherstellers ab. Wenden Sie sich für vierteljährliche Bewertungen des Hardwarezustands an RustFS.
