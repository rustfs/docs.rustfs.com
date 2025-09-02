---
title: "Objekt-Scanner"
description: "RustFS ist ein einfaches, effizientes und verteiltes Objektspeichersystem. Es ist 100% S3-kompatibel und Open-Source-Software unter der Apache2-Lizenz."
---

# Objekt-Scanner

Dieser Artikel bietet eine tiefgreifende Einführung in das Design und die Implementierung des RustFS Objekt-Scanners, einschließlich seiner Integration mit Erasure Coding, Scrub & Repair-Mechanismen sowie Scheduling-Strategien, Monitoring-Metriken und Fehlerbehebungsmethoden.

## Übersicht

Der RustFS Objekt-Scanner ist in die Speicher-Engine integriert und für die periodische Überprüfung der Objektintegrität und die Ausführung geplanter Operationen verantwortlich.
Scanner-Aufgaben umfassen die Statistik der Festplattennutzung, die Bewertung von Lebenszyklus-Management-Regeln, die Ausführung von Objektreplikation und das Auslösen der Selbstheilung beschädigter Objekte.

## Architektur und Designprinzipien

### Scanner-Architektur

Der RustFS Scanner verwendet einen Hash-Sampling-Mechanismus, der basierend auf dem Objektnamen-Hash eines von 1024 Objekten zur Überprüfung auswählt, um die Auswirkungen auf normale Anfragen zu reduzieren.
Der Scanner ist tief in das Erasure Coding-Modul integriert und kann bei Erkennung fehlender oder beschädigter Fragmente die redundanten Fragmente für Online-Rekonstruktion nutzen, um hohe Datenverfügbarkeit und Konsistenz zu gewährleisten.

## Datenvalidierung und -wiederherstellung

Der RustFS Datenvalidierungsmechanismus kann Metadatenkonsistenz schnell überprüfen, letztere liest und validiert Daten bitweise, um versteckte defekte Blöcke zu entdecken. Die Ausführung des Objekt-Scanners kann Probleme wie Bit-Rot erkennen und bei Bedarf Reparaturprozesse auslösen.

## Scan-Modi und Scheduling

RustFS unterstützt drei Scan-Auslösemodi: Online-Scanning beim Lesen, periodisches Hintergrund-Scanning und manuelles vollständiges Scanning, um Leistung und Zuverlässigkeit zu berücksichtigen.
Ähnlich der `osd_scrub_begin_hour`-Konfiguration in Ceph können Administratoren Scan-Startzeiten und -häufigkeiten einstellen, z.B. leichte Validierung standardmäßig täglich einmal.

## Monitoring und Metriken

Der RustFS Scanner erfasst Gesamtanzahl der Aufgaben, Anzahl der Fehler und Zeitverteilung und exponiert Metriken wie `rustfs_scanner_jobs_total`, `rustfs_scanner_failures_total` und `rustfs_scanner_duration_seconds` über das Prometheus-Datenmodell.
In Kombination mit Monitoring-Systemen können basierend auf Scanner-Fehlern und -dauer Alarme gesetzt werden, um potenzielle Probleme auf Speicher- oder Netzwerkebene rechtzeitig zu erkennen und zu lokalisieren.
