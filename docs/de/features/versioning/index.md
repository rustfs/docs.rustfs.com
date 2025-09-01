---
title: "Bucket- und Objektversionierung"
description: "AWS S3-kompatible Versionierungsfunktionalität"
---

# Bucket- und Objektversionierung

## RustFS Objektspeicherung bietet AWS S3-Versionierungskompatibilität

Versionierung auf Objektebene ist eine bedeutende Verbesserung im Vergleich zu SAN- und NAS-Versionierungsmethoden. Versionierung bietet nicht nur Datenschutz, sondern dient auch als Grundlage für leistungsstarke Funktionen wie Objektsperrung, Immutabilität, Tiering und Lebenszyklus-Management.

Mit RustFS werden Objekte unabhängig nach Amazons S3-Struktur/Implementierung versioniert. RustFS weist jeder Version eines gegebenen Objekts eine eindeutige ID zu - Anwendungen können jederzeit eine Versions-ID angeben, um auf einen Point-in-Time-Snapshot dieses Objekts zuzugreifen.

Versionierung ermöglicht es Benutzern, mehrere Varianten eines Objekts im gleichen Bucket zu bewahren und bietet einen Mechanismus, um jede Version jedes im Bucket gespeicherten Objekts zu speichern, abzurufen und wiederherzustellen, wodurch die Notwendigkeit für Snapshots eliminiert wird. Versionierung stellt sicher, dass Objekte durch eine Reihe von Ausfällen verfügbar bleiben, einschließlich derer, die durch Anwendungs- und menschliche Fehler verursacht werden.

Versionierung wird auf Bucket-Ebene aktiviert. Einmal aktiviert, erstellt RustFS automatisch eine eindeutige Versions-ID für Objekte. Dasselbe Objekt kann mehrere Versionen haben.

Einer der Hauptvorteile der Versionierung ist die Verhinderung versehentlicher Überschreibungen oder Löschungen. Dies wird mit dem Konzept der Löschmarker implementiert. Wenn ein versioniertes Objekt gelöscht wird, wird es nicht dauerhaft entfernt. Stattdessen wird ein Löschmarker erstellt und wird zur aktuellen Version des Objekts. Wenn dieses Objekt angefordert wird, gibt RustFS eine 404 Not Found-Nachricht zurück. Das Objekt kann durch Löschen des Löschmarkers wiederhergestellt werden.

Ähnlich, wenn ein versioniertes Objekt überschrieben wird, erstellt RustFS eine neue Version und sie wird zur aktuellen Version. Ebenso können alte Versionen nach Bedarf wiederhergestellt werden.

## RustFS unterstützt Objektversionierung mit drei verschiedenen Bucket-Zuständen

![Bucket-Zustände](./images/bucket-states.png)

Beachten Sie, dass sobald Versionierung für einen Bucket aktiviert ist, die Operation nicht rückgängig gemacht werden kann - sie kann nur suspendiert werden. Versionierung ist eine globale Einstellung im Bucket - das bedeutet, alle Objekte sind jetzt versioniert.

Benutzer mit entsprechenden Berechtigungen können Versionierung suspendieren, um zu stoppen, Objektversionen anzusammeln. Ähnlich wie bei der Aktivierung der Versionierung wird diese Operation auf Bucket-Ebene durchgeführt.

Wie alle RustFS-Funktionen kann Versionierung mit der RustFS-Konsole, dem Client (mc), SDK oder durch Kommandozeilenanwendungen angewendet werden.

Versionierung ist der einfachste Weg, Daten vor versehentlichen Operationen zu schützen. Da Objekte jedoch versioniert werden, führt dies zu größeren Bucket-Größen und kann zu mehr Interdependenzen zwischen Objekten und Risiken versteckter Objektabhängigkeiten führen. Diese Faktoren können durch Lebenszyklus-Management gemildert werden.

## Kernfunktions-Vorteile

> Zusätzlich zu ihren Datenschutzvorteilen dient RustFS's Objektspeicher-Versionierung als Grundlage für andere Schlüsselfunktionen

### Hauptfunktionsmerkmale

- ✅ **Bucket-Replikation** (Active-Active, Active-Passive)
- ✅ **Mc undo** - PUT/DELETE-Objekte mit einem einzigen Befehl zurücksetzen
- ✅ **Objektsperre**
- ✅ **Kontinuierlicher Datenschutz-ähnlicher Schutz** ohne den Overhead von Snapshots oder vollständiger Systemreplikation
- ✅ **Mc rewind** - Buckets oder Objekte zu jedem Zeitpunkt nach Aktivierung der Versionierung anzeigen

## Architektur

![Architekturdiagramm](./images/architecture.png)

### Systemanforderungen

> Versionierung erfordert: Erasure Coding und mindestens vier Festplatten.

### Versionierungszustände

RustFS unterstützt drei verschiedene Bucket-Versionierungszustände:

1. **🔴 Unversioniert** - Standardzustand, keine Versionierung durchgeführt
2. **🟢 Aktiviert** - Vollständige Versionierungsfunktionalität, weist eindeutige ID jeder Objektversion zu
3. **🟡 Suspendiert** - Stoppt das Ansammeln neuer Versionen, behält aber bestehende Versionen

### Schlüsselfunktionen

- 🆔 **Eindeutige Versions-ID** - Jede Objektversion hat eine eindeutige Kennung
- 🔄 **Point-in-Time-Wiederherstellung** - Kann auf jede historische Version eines Objekts zugreifen
- 🛡️ **Löschschutz** - Verwendet Löschmarker, um versehentliche Löschung zu verhindern
- 📊 **Lebenszyklus-Management** - Verwaltet automatisch Versionsanzahl und Speicherkosten
- 🔐 **Berechtigungssteuerung** - Feingranulare Zugriffsberechtigung-Management

