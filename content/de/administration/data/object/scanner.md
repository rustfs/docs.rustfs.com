---
title: "Objekt-Scan"
description: "Beschreibt den Objekt-Scanner von RustFS, einschließlich Entwurf, Implementierung und Überwachung."
---

Diese Anleitung beschreibt Entwurf und Implementierung des Objekt-Scanners von RustFS, einschließlich des Zusammenspiels mit Erasure Coding, der Prüfung und Reparatur, der Planung, der Metriken und der Fehlerbehebung.

## Überblick

Der Objekt-Scanner von RustFS ist in die Speicher-Engine eingebaut. Er prüft regelmäßig die Integrität von Objekten und führt geplante Operationen aus.
Der Scanner erfasst Statistiken zur Datenträgernutzung, wertet Lebenszyklusregeln aus, führt die Objektreplikation aus und löst die Datenwiederherstellung (Healing) für beschädigte Objekte aus.

## Architektur und Entwurfsprinzipien

### Scanner-Architektur

Der Scanner von RustFS verwendet eine Hash-Stichprobe. Anhand des Hashs des Objektnamens wählt er jedes 1024. Objekt für eine Prüfung aus, um die Auswirkung auf die Leistung gering zu halten.
Der Scanner arbeitet mit dem Erasure Coding: Erkennt er ein fehlendes oder beschädigtes Shard, baut er das Shard online aus den verbleibenden redundanten Shards wieder auf.

## Datenprüfung und Wiederherstellung

Die Datenprüfung von RustFS prüft die Konsistenz der Metadaten und liest Daten, um sie zu prüfen und latente defekte Sektoren zu erkennen. Der Objekt-Scanner erkennt Probleme wie Bit Rot und stößt bei Bedarf Reparaturvorgänge an.

## Scan-Modi und Planung

RustFS unterstützt drei Scan-Modi, die Leistung und Zuverlässigkeit ausbalancieren: Prüfungen während des Lesens, regelmäßige Hintergrundscans und manuelle vollständige Scans.
Ähnlich wie bei der Ceph-Einstellung `osd_scrub_begin_hour` können Sie Startzeitpunkt und Häufigkeit der Scans festlegen. Eine leichte Prüfung läuft beispielsweise standardmäßig einmal täglich.

## Überwachung und Metriken

Der Scanner meldet die Gesamtzahl der Aufgaben, die Anzahl der Fehler und die Verteilung der Dauer als Prometheus-Metriken, etwa `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total` und `rustfs_scanner_duration_seconds`.
Konfigurieren Sie Alarme für die Fehlerrate und die Dauer der Scans, damit Sie Speicher- oder Netzwerkprobleme früh erkennen und eingrenzen können.
