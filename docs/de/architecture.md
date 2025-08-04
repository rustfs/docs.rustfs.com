---
title: "RustFS Architektur"
description: "Einführung in die RustFS Architektur"
---

# RustFS Architektur

RustFS ist ein Objektspeichersystem, ähnlich dem bekannten AWS S3. Als Ersatzprodukt für MinIO orientiert sich RustFS an der einfachen, leichtgewichtigen, skalierbaren und eleganten Architektur von MinIO.

Objekte können Dokumente, Videos, PDF-Dateien usw. sein. Zur Speicherung von Objekten bietet MinIO eine skalierbare, flexible und effiziente Lösung zum Speichern, Zugreifen und Verwalten von Daten. Seine Kompatibilität mit der AWS S3 API ermöglicht eine nahtlose Integration mit AWS S3-basierten Anwendungen.

Das Architekturdiagramm ist wie folgt:

![RustFS Architekturdiagramm](./images/s2-1.png)

Dies ist die Grundarchitektur von RustFS. Das verteilte Gitter ist eine Computerarchitektur, die mehrere Knoten verwendet, um eine einzige Aufgabe auszuführen. Die Knoten sind über ein Netzwerk miteinander verbunden, wodurch sie miteinander kommunizieren können.

## Konsistenz-Design

Im verteilten und Einzelmaschinen-Modus folgen alle Lese- und Schreiboperationen strikt dem read-after-write Konsistenzmodell.

## Wichtige Konzepte in RustFS

**Object (Objekt)**: Das grundlegende Objekt, das in Minio gespeichert wird, wie Dateien, Byte-Streams, alles...

**Bucket (Bucket)**: Der logische Raum zur Speicherung von Objekten. Die Daten zwischen jedem Bucket sind voneinander isoliert. Für den Client entspricht es einem Top-Level-Ordner zum Platzieren von Dateien.

**Drive (Laufwerk)**: Die Festplatte, die Daten speichert, wird beim Start von MinIO als Parameter übergeben. Alle Objektdaten in Minio werden in Laufwerken gespeichert.

**Set (Satz)**: Eine Gruppe von Laufwerken. Die verteilte Bereitstellung teilt automatisch in einen oder mehrere Sätze basierend auf der Clustergröße auf, und die Laufwerke in jedem Satz sind an verschiedenen Standorten verteilt. Ein Objekt wird in einem Satz gespeichert. (An manchen Stellen wird die Kombination von Sätzen auch **Strips** — Streifen genannt).

Daher sollte beim Entwerfen der Architektur und beim Bereitstellen von Geräten beachtet werden:

1. Ein Objekt wird in einem Satz gespeichert;

2. Ein Cluster wird in mehrere Sätze unterteilt;

3. Die Anzahl der in einem Satz enthaltenen Laufwerke ist fest und wird standardmäßig automatisch vom System basierend auf der Clustergröße berechnet;

4. Die Laufwerke in einem Satz sind so weit wie möglich auf verschiedene Knoten verteilt;

## Besonderer Dank

Die traditionelle verteilte Speicherarchitektur muss haben: Master-Knoten, MetaData-Knoten und Data Node-Knoten. Dieses Modus-Design macht die Bereitstellung der Benutzer sehr komplex. Gleichzeitig besteht bei fehlender reicher Erfahrung im Management verteilter Speicher ein Risiko für Datenverlust, wenn Metadaten verloren gehen.

Alle Knoten befinden sich in einer gleichrangigen Beziehung, was das Architekturdesign erheblich vereinfacht und die Sorge um Metadatenverlust beseitigt, da es mit einem einzigen Befehl gestartet werden kann.

Ohne Eleganz, Einfachheit und Zuverlässigkeit zu verlieren, übernimmt RustFS das gleiche Architekturdesign wie MinIO.

Danke an MinIO für das vorgeschlagene Architekturkonzept, das Benutzer weltweit sehr erleichtert und das S3-Protokoll gefördert hat.