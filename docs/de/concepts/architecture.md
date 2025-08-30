---
title: "RustFS Architektur"
description: "Einführung in die RustFS Architektur"
---

# RustFS Architektur

RustFS ist ein Objektspeichersystem, ähnlich dem bekannten AWS S3. Als Alternative zu MinIO referenziert RustFS die saubere, leichte, skalierbare und elegante Architektur von MinIO.

Objekte können Dokumente, Videos, PDF-Dateien und mehr sein. Für die Speicherung von Objekten bietet MinIO eine skalierbare, flexible und effiziente Lösung zum Speichern, Zugreifen und Verwalten von Daten. Seine Kompatibilität mit der AWS S3-API ermöglicht eine nahtlose Integration mit AWS S3-basierten Anwendungen.

Das Architekturdiagramm ist wie folgt:

![RustFS Architekturdiagramm](./images/s2-1.png)

Dies ist die grundlegende Architektur von RustFS. Ein verteiltes Netzwerk ist eine Computerarchitektur, die mehrere Knoten zur Ausführung einer einzelnen Aufgabe verwendet. Die Knoten sind über ein Netzwerk miteinander verbunden, wodurch sie miteinander kommunizieren können.

## Konsistenz-Design

In verteilten und Einzelrechner-Modi folgen alle Lese- und Schreiboperationen strikt dem read-after-write-Konsistenzmodell.

## Wichtige Konzepte in RustFS

**Object (Objekt)**: Das grundlegende Objekt, das in RustFS gespeichert wird, wie Dateien, Byte-Streams, alles...

**Bucket (Eimer)**: Der logische Raum zum Speichern von Objekten. Die Daten zwischen jedem Bucket sind voneinander isoliert. Für den Client ist es gleichbedeutend mit einem Ordner der obersten Ebene zum Speichern von Dateien.

**Drive (Laufwerk)**: Das Laufwerk, das Daten speichert, wird beim Start von RustFS als Parameter übergeben. Alle Objektdaten in RustFS werden in Laufwerken gespeichert.

**Set (Satz)**: Eine Sammlung von Laufwerken. Die verteilte Bereitstellung teilt automatisch einen oder mehrere Sets basierend auf der Clustergröße auf, und die Laufwerke in jedem Set sind an verschiedenen Orten verteilt. Ein Objekt wird in einem Set gespeichert.

Daher sollte beim Entwerfen der Architektur und beim Bereitstellen von Geräten beachtet werden:

1. Ein Objekt wird in einem Set gespeichert;
2. Ein Cluster wird in mehrere Sets unterteilt;
3. Die Anzahl der Laufwerke in einem Set ist fest und wird standardmäßig automatisch vom System basierend auf der Clustergröße berechnet;
4. Die Laufwerke in einem Set sind so weit wie möglich auf verschiedene Knoten verteilt;

## Besonderer Dank

Alle Knoten befinden sich in gleichrangigen Beziehungen, was das Architekturdesign erheblich vereinfacht und Sorgen über Metadatenverluste eliminiert. Es kann mit einem einzigen Befehl gestartet werden.

Ohne Eleganz, Einfachheit und Zuverlässigkeit zu verlieren, übernimmt RustFS das gleiche Architekturdesign wie MinIO.

Dank an MinIO für das vorgeschlagene Architekturkonzept, das Benutzern weltweit enormen Komfort bietet und das S3-Protokoll gefördert hat.