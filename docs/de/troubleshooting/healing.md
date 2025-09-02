---
title: "Objektprüfung und automatische Wiederherstellung"
description: "Dieser Artikel beschreibt das Design und die Implementierung der Selbstheilungsfunktion von RustFS in einer Einzel-Server-Multi-Disk-Architektur, einschließlich der Bedeutung, Prinzipien, Prozesse, Konfiguration und häufigen Fehlerbehebung der Selbstheilung."
---

# Objektprüfung und automatische Wiederherstellung

## RustFS-Architektur und Selbstheilungsdesign

### Einzel-Server-Multi-Disk-Architektur

RustFS verwendet ein Einzel-Server-Multi-Disk-Design, das mehrere Festplatten zu einem logischen Speicherpool organisiert und Objektspeicherdienste bereitstellt. Jedes Objekt wird beim Schreiben in mehrere Datenfragmente (Shards) und redundante Fragmente aufgeteilt und auf verschiedenen Festplatten verteilt gespeichert, um Zuverlässigkeit und Leistung zu verbessern.

### Selbstheilungsdesignprinzipien

1. **Datenintegritätsvalidierung**: Kombiniert mit Checksum-Mechanismen, um sicherzustellen, dass Objektfragmentdaten beim Lesen konsistent sind, z.B. validiert ZFS beim Lesen die Checksumme jedes Datenblocks und repariert bei Validierungsfehlern.
2. **Fragmentredundanz und Löschkodierung**: Generiert redundante Fragmente durch Erasure Coding. Wenn einige Datenfragmente verloren gehen oder beschädigt werden, können die redundanten Fragmente verwendet werden, um das ursprüngliche Objekt zu rekonstruieren.
3. **Mehrstufige Selbstheilungsauslösung**: Umfasst Online-Selbstheilung beim Lesen, Hintergrund-Scanning-Selbstheilung und manuell ausgelöste Selbstheilung, um Leistung und Datenzuverlässigkeit zu berücksichtigen.

## Objekt-Selbstheilungsprinzipien

### Validierung und Löschkodierung

RustFS teilt Objekte in der Schreibphase in *k* Datenfragmente und *m* redundante Fragmente auf und speichert sie basierend auf den angegebenen Löschkodierungsparametern auf *n=k+m* Blockgeräten verteilt. Beim Lesen können beschädigte oder verlorene Fragmente aus anderen intakten Fragmenten rekonstruiert werden.

### Datenvalidierung und -reparatur (Scrub & Repair)

RustFS führt regelmäßig leichte Validierung (Light Scrub) und Tiefenvalidierung (Deep Scrub) auf dem Speicherpool durch:
- **Leichte Validierung** vergleicht Objektmetadaten und Fragmentgrößen und markiert Beschädigungen rechtzeitig.
- **Tiefenvalidierung** liest Fragmentdaten bitweise und validiert Checksummen, kann versteckte defekte Blöcke oder Bit-Rot-Probleme erkennen und reparieren.

Wenn Daten-Scanning Inkonsistenzen entdeckt, ruft RustFS automatisch den Repair-Prozess auf, rekonstruiert beschädigte Fragmente mit redundanten Fragmenten und schreibt die reparierten Fragmente auf die ursprüngliche Festplatte oder eine Ersatzfestplatte zurück, um sicherzustellen, dass die Daten beim nächsten Zugriff intakt sind.

## Selbstheilungsprozess

### Online-Selbstheilung beim Lesen

Bei jeder Client-Ausführung von `GET`- oder `HEAD`-Anfragen überprüft RustFS zunächst alle Datenfragmente des entsprechenden Objekts:
1. Wenn alle Datenfragmente intakt sind, werden die Daten direkt zurückgegeben.
2. Wenn Fragmente fehlen oder beschädigt sind, berechnet das System die fehlenden Fragmente basierend auf redundanten Fragmenten und gibt nach der Reparatur das vollständige Objekt an den Client zurück.
Dieser Mechanismus ist konsistent mit MinIOs Selbstheilungsprozess beim Lesen und kann Daten transparent reparieren, ohne Client-Anfragen zu beeinträchtigen.

### Hintergrund-Scanning-Selbstheilung

RustFS hat einen eingebauten Objekt-Scanner, der hash-basiert 1/1024 der Objekte im Speicherpool für Integritätsprüfungen durchläuft:
- Der Objekt-Scanner führt regelmäßig (konfigurierbare Häufigkeit) leichte Validierung durch;
- Wenn Beschädigungen entdeckt werden, wird sofort der Selbstheilungsrekonstruktionsprozess ausgelöst.
Standardmäßig wird keine tiefe Bit-Rot-Überprüfung durchgeführt, um Ressourcenaufwand zu reduzieren. Tiefenvalidierung kann bei Bedarf aktiviert werden.

### Manuell ausgelöste Selbstheilung

Administratoren können über Kommandozeilen-Tools vollständige Selbstheilung ausführen:

```bash
rc admin heal start --all
```
Diese Operation scannt den gesamten Speicherpool und führt vollständige Validierung und Reparatur für alle Objekte durch, was hohen Ressourcenverbrauch verursacht und vorsichtig in Zeiten niedriger Auslastung verwendet werden sollte.

## Verwendungsbeispiele

```bash
# Aktuellen Selbstheilungsstatus anzeigen
rc admin heal status
# Selbstheilung für spezifischen Bucket starten
rc admin heal start --bucket photos
# Laufende Selbstheilungsaufgabe stoppen
rc admin heal stop
```

## Zusammenfassung

RustFS' Objekt-Selbstheilung kombiniert bewährte Designs von Systemen wie MinIO, Ceph und ZFS. Durch mehrstufig ausgelöste Validierungs- und Reparaturprozesse kann es effektiv mit Fragmentbeschädigungen, Festplattenfehlern und Bit-Rot-Problemen in Einzel- und Multi-Server-Multi-Disk-Umgebungen umgehen und hohe Zuverlässigkeit und Verfügbarkeit des Objektspeichers gewährleisten.
