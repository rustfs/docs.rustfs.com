---
title: "Multi-Site, Active-Active Replikation für Objektspeicher"
description: "RustFS bietet robuste und skalierbare Active-Active Replikation für hohe Verfügbarkeit und Geschäftskontinuität"
---

# Multi-Site, Active-Active Replikation für Objektspeicher

## Active Replikation für Objektspeicher

![Objektspeicher Replikation](images/s6-1.png)

Active Replikation für Objektspeicher ist eine kritische Anforderung für mission-kritische Produktionsumgebungen. RustFS ist derzeit der einzige Anbieter, der diesen Service anbietet. Ausgeführt auf Bucket-Level-Granularität, wird es in folgenden Situationen verwendet:

RustFS unterstützt synchrone und nahezu-synchrone Replikation, abhängig von architektonischen Entscheidungen und Datenänderungsraten. In jedem der oben genannten Fälle muss die Replikation so nah wie möglich an strikter Konsistenz liegen (unter Berücksichtigung von Bandbreitenbeschränkungen und Änderungsraten).

## RustFS Datenreplikation für großskalige Resilienz entwickelt

Hauptmerkmale umfassen:

- ✅ Verschlüsselte oder unverschlüsselte Objekte und ihre zugehörigen Metadaten (atomar mit Objekten geschrieben)
- ✅ Objektversionen
- ✅ Objekt-Tags (falls vorhanden)
- ✅ S3 Objektsperr-Aufbewahrungsinformationen (falls vorhanden)

## Kernfunktionen

### Fähigkeit für Quell- und Ziel-Buckets, denselben Namen zu haben

Dies ist erforderlich für Anwendungen, die transparent zu entfernten Standorten failover müssen ohne jede Unterbrechung.

### Native Unterstützung für automatische Objektsperr-/Aufbewahrungsreplikation zwischen Quelle und Ziel

Stellt sicher, dass Datenintegrität und Compliance-Anforderungen während der Replikation aufrechterhalten werden.

### Nahezu-synchrone Replikation

Kann Objekte unmittelbar nach jeder Mutation im Bucket aktualisieren. RustFS folgt strikter Konsistenz innerhalb von Rechenzentren und eventueller Konsistenz zwischen Rechenzentren zum Schutz der Daten.

### Benachrichtigungsfunktionalität

Benachrichtigungsfunktionalität zum Pushen von Replikationsfehlerereignissen. Anwendungen können diese Ereignisse abonnieren und Betriebsteams alarmieren.

## Betrachtungen bei der Implementierung von RustFS Active-Active Replikation

Auf der grundlegendsten Ebene muss jedes Design Infrastruktur, Bandbreite, Latenz, Resilienz und Skalierung berücksichtigen. Lassen Sie uns sie der Reihe nach betrachten:

### Infrastruktur

RustFS empfiehlt die Verwendung derselben Hardware an beiden Enden der Replikationsendpunkte. Während ähnliche Hardware funktionieren kann, bringt die Einführung heterogener Hardware-Profile Komplexität mit sich und verlangsamt die Problemidentifikation.

### Bandbreite

Bandbreite ist ein kritischer Faktor, um zwei Standorte konsistent synchronisiert zu halten. Die optimale Bandbreitenanforderung zwischen Standorten wird durch die Rate der eingehenden Daten bestimmt. Spezifisch, wenn die Bandbreite unzureichend ist, um Spitzen zu handhaben, werden Änderungen zum entfernten Standort in die Warteschlange gestellt und schließlich synchronisiert.

### Latenz

Nach der Bandbreite ist die Latenz die wichtigste Betrachtung beim Entwurf eines Active-Active-Modells. Latenz repräsentiert die Rundlaufzeit (RTT) zwischen zwei RustFS-Clustern. Das Ziel ist es, die Latenz auf die kleinstmögliche Zahl innerhalb der durch die Bandbreite auferlegten Budgetbeschränkungen zu reduzieren. RustFS empfiehlt RTT-Schwellwerte von nicht mehr als 20 Millisekunden für Ethernet-Links und Netzwerke, mit Paketverlustrate von nicht mehr als 0,01%.

### Architektur

Derzeit empfiehlt RustFS nur die Replikation zwischen zwei Rechenzentren. Replikation über mehrere Rechenzentren ist möglich, jedoch macht die damit verbundene Komplexität und die erforderlichen Kompromisse dies ziemlich schwierig.

## Großskalige Deployment-Architektur

RustFS unterstützt sehr große Deployments in jedem Rechenzentrum, einschließlich Quelle und Ziel, wobei die oben genannten Betrachtungen die Skalierung bestimmen.

![Großskalige Deployment-Architektur](images/s6-2.png)

## Häufig gestellte Fragen

### Was passiert, wenn das Replikationsziel ausfällt?

Wenn das Ziel ausfällt, wird die Quelle Änderungen zwischenspeichern und mit der Synchronisation beginnen, nachdem das Replikationsziel wiederhergestellt ist. Es kann je nach Dauer, Anzahl der Änderungen, Bandbreite und Latenz zu einigen Verzögerungen kommen, bis die vollständige Synchronisation erreicht ist.

### Was sind die Parameter für Unveränderlichkeit?

Unveränderlichkeit wird unterstützt. Schlüsselkonzepte können in diesem Artikel gefunden werden. Im Active-Active Replikationsmodus kann Unveränderlichkeit nur garantiert werden, wenn Objekte versioniert sind. Versionierung kann an der Quelle nicht deaktiviert werden. Wenn die Versionierung am Ziel ausgesetzt wird, beginnt RustFS mit dem Fehlschlagen der Replikation.

### Welche anderen Auswirkungen gibt es, wenn die Versionierung ausgesetzt ist oder es eine Nichtkompatibilität gibt?

In diesen Fällen kann die Replikation fehlschlagen. Wenn Sie zum Beispiel versuchen, die Versionierung am Quell-Bucket zu deaktivieren, wird ein Fehler zurückgegeben. Sie müssen zuerst die Replikationskonfiguration entfernen, bevor Sie die Versionierung am Quell-Bucket deaktivieren können. Zusätzlich, wenn die Versionierung am Ziel-Bucket deaktiviert ist, wird die Replikation fehlschlagen.

### Wie wird es gehandhabt, wenn Objektsperrung an beiden Enden nicht aktiviert ist?

Objektsperrung muss sowohl an Quelle als auch Ziel aktiviert sein. Es gibt einen Grenzfall, wo nach der Einrichtung der Bucket-Replikation der Ziel-Bucket gelöscht und neu erstellt werden kann, aber ohne aktivierte Objektsperrung, und die Replikation kann fehlschlagen. Wenn Objektsperrungseinstellungen an beiden Enden nicht konfiguriert sind, können inkonsistente Situationen auftreten. In diesem Fall wird RustFS stillschweigend fehlschlagen.

