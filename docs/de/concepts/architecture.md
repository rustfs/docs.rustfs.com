---
title: "RustFS Architektur"
description: "Einführung in die RustFS Architektur"
---

# RustFS Architektur

RustFS ist ein Objektspeichersystem, ähnlich dem bekannten AWS S3. Als Alternative zu MinIO referenziert RustFS die elegante, einfache, leichte und skalierbare Architektur von MinIO.

Objekte können Dokumente, Videos, PDF-Dateien usw. sein. Um Objekte zu speichern, bietet RustFS eine skalierbare, flexible und effiziente Lösung zum Speichern, Zugreifen und Verwalten von Daten. Seine Kompatibilität mit der AWS S3 API ermöglicht eine nahtlose Integration mit AWS S3-basierten Anwendungen.

Das Architekturdiagramm ist wie folgt:

![RustFS Architekturdiagramm](./images/s2-1.png)

Dies ist die grundlegende Architektur von RustFS. Ein verteiltes Grid ist eine Computerarchitektur, die mehrere Knoten verwendet, um eine einzelne Aufgabe auszuführen. Knoten sind über ein Netzwerk miteinander verbunden, was es ihnen ermöglicht, miteinander zu kommunizieren.

## Konsistenzdesign

In verteilten und Einzelmaschinenmodi folgen alle Lese- und Schreibvorgänge streng dem Read-After-Write-Konsistenzmodell.

## Wichtige Konzepte in RustFS

**Object (Objekt)**: Das grundlegende Objekt, das in RustFS gespeichert wird, wie Dateien, Byteströme, Alles...

**Bucket (Eimer)**: Der logische Raum zum Speichern von Objekten. Daten zwischen jedem Bucket sind voneinander isoliert. Für Clients ist es wie ein Top-Level-Ordner zum Speichern von Dateien.

**Drive (Laufwerk)**: Das Laufwerk zum Speichern von Daten, das beim Start von RustFS als Parameter übergeben wird. Alle Objektdaten in RustFS werden in Drives gespeichert.

**Set (Menge)**: Eine Sammlung von Drives. Die verteilte Bereitstellung teilt automatisch ein oder mehrere Sets basierend auf der Clustergröße auf. Drives in jedem Set sind an verschiedenen Standorten verteilt. Ein Objekt wird in einem Set gespeichert. (An manchen Stellen wird die Kombination von Sets auch als **Strips** - Streifen bezeichnet).

Daher ist bei der Architekturplanung und Gerätebereitstellung zu beachten:

1. Ein Objekt wird in einem Set gespeichert;

2. Ein Cluster wird in mehrere Sets aufgeteilt;

3. Die Anzahl der Drives in einem Set ist fest und wird standardmäßig automatisch basierend auf der Clustergröße berechnet;

4. Drives in einem Set sind nach Möglichkeit auf verschiedenen Knoten verteilt;

## Besonderer Dank

In traditionellen verteilten Speicherarchitekturen müssen Master-Knoten, MetaData-Knoten und Data Node-Knoten existieren. Dieses Designmuster macht die Bereitstellung für Benutzer sehr komplex. Gleichzeitig besteht ohne reiche Erfahrung in der Verwaltung verteilter Speicher das Risiko von Datenverlust, sobald Metadaten verloren gehen.

Alle Knoten sind Knoten auf gleicher Ebene, was die Architekturplanung erheblich vereinfacht und keine Sorge um Metadatenverlust besteht. Ein Befehl reicht zum Starten aus.

Ohne Eleganz, Einfachheit und Zuverlässigkeit zu verlieren, verwendet RustFS das gleiche Architekturdesign wie MinIO.

Dank an MinIO für die vorgeschlagene Architekturphilosophie, die Benutzern weltweit große Vorteile gebracht und das S3-Protokoll gefördert hat.
