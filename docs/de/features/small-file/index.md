---
title: "Kleine Datei Optimierung"
description: "Erstellen von Memory Object Storage für ultra-hohe Leistungsarbeitslasten"
---

# Kleine Datei Optimierung

> Erstellen von Memory Object Storage für ultra-hohe Leistungsarbeitslasten

Nutzen Sie Server-DRAM, um verteilte geteilte Speicherpools für Arbeitslasten zu erstellen, die massive IOPS- und Durchsatzleistung erfordern.

## Hintergrund

RustFS kleine Datei Optimierung ist ideal für Arbeitslasten, die IOPS- und Durchsatzleistung benötigen. In modernen Architekturen bedeutet dies zunehmend AI/ML-Arbeitslasten. Ohne Caching kann I/O zu einem Engpass für GPUs werden.

Mit Enterprise-Caching können Buckets, die Trainings-, Validierungs- und Testdatensätze enthalten, im Speicher gehalten werden, um eine speicherbasierte Leistung zu erbringen.

## Funktionen

### 🗃️ Dedizierter Objektcache

RustFS kleine Datei Optimierung ist speziell für das Caching von Dateiobjekten entwickelt.
Wenn ein Objekt nicht im vorhandenen Objektcache gefunden wird, wird es automatisch das Objekt abrufen, es für zukünftige Anfragen cachen und das Objekt an den Aufrufer zurückgeben.

### 💾 Konsistenter Hash-Algorithmus

RustFS kleine Datei Optimierung priorisiert Inhalte.
Verwendet konsistente Hash-Algorithmen, um gecachte Objektdaten über einen Cluster von Cache-Knoten (genannt Peers) zu verteilen. Konsistentes Hashing stellt sicher, dass Objekte basierend auf dem Schlüssel des Objekts leicht gefunden werden können. Dies schafft eine Eins-zu-eins-Beziehung zwischen dem Schlüsselwert des Objekts und dem Knoten, der das gecachte Objekt hält. Es stellt auch sicher, dass Knoten die gleiche Datenmenge enthalten, was verhindert, dass ein Knoten überlastet wird, während andere unterforderlich bleiben. Noch wichtiger ist, dass es Objekte so verteilt, dass wenn Knoten hinzugefügt oder entfernt werden, nur minimale Umstellung erforderlich ist, um das System auszurichten.

### 🧹 Rolling Cache Speicherverwaltung

RustFS verwendet Rolling Cache für die Speicherverwaltung. RustFS verwendet Rolling Cache, um die Gesamtcache-Größe innerhalb der in der kleine Datei Optimierungskonfiguration angegebenen Grenzen zu halten. Wenn das Hinzufügen neuer Objekte dazu führen würde, dass die Cache-Größe die angegebene Grenze überschreitet, werden ein oder mehrere Objekte basierend auf Zeitstempeln entfernt, die anzeigen, wann das Objekt zuletzt angefordert wurde.

### 🔄 Automatische Versionsupdates

Automatische Updates neuer Objektversionen. Wenn ein gecachtes Objekt aktualisiert wurde, aktualisiert RustFS Object Storage automatisch den Cache mit der neuen Objektversion.

### 🧩 Nahtlose API-Integration

RustFS kleine Datei Optimierung ist eine Hintergrund-Erweiterung von RustFS. Da kleine Datei Optimierung eine Erweiterung von RustFS ist, müssen Entwickler keine neuen APIs lernen. Entwickler verwenden dieselben APIs wie zuvor. Wenn sich das angeforderte Objekt im Cache befindet, holt RustFS es automatisch aus dem Cache. Wenn ein Objekt gecacht werden soll und zum ersten Mal angefordert wird, holt RustFS es aus dem Objektspeicher, gibt es an den Aufrufer zurück und platziert es für nachfolgende Anfragen im Cache.

