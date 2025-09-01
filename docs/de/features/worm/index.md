---
title: "Objektunveränderlichkeit von RustFS"
description: "WORM-Compliance und Datenimmutabilität"
---

# Objektunveränderlichkeit von RustFS

## RustFS und S3 API - Entwickelt für Multi-Cloud-Speicherung

RustFS hat sich von Anfang an als Standard für AWS S3-Kompatibilität etabliert. Als einer der frühesten Anwender der S3 API (V2 und V4) und eines der einzigen Speicherunternehmen, das sich ausschließlich auf S3 konzentriert, sorgt RustFS's große Community dafür, dass keine andere AWS-Alternative kompatibler ist. Die S3 API ist der de facto Standard in der Cloud, daher müssen AWS-Alternativen in der Lage sein, die API fließend zu nutzen, um in verschiedenen Umgebungen zu operieren und zu interoperieren (öffentliche Cloud, private Cloud, Rechenzentrum, Multi-Cloud, Hybrid-Cloud und Edge).

## Objektaufbewahrung

Objektspeicher-Aufbewahrungsregeln stellen sicher, dass Objekte für einen bestimmten Zeitraum durch WORM geschützt sind. Objektspeicher-Aufbewahrungsrichtlinien spezifizieren die Aufbewahrungsperiode, die für Objektversionen festgelegt wird, entweder explizit oder durch Bucket-Standardeinstellungen. Standard-Sperrkonfigurationen, die auf Bucket-Ebene festgelegt werden, gelten für nachfolgend erstellte Objekte und werden nicht rückwirkend auf Versionen zuvor erstellter Objekte angewendet.

Bei Verwendung von Bucket-Standardeinstellungen wird eine Dauer in Tagen oder Jahren festgelegt, um die Zeitdauer zu definieren, für die jede Objektversion, die in den Bucket gelegt wird, geschützt werden soll. Neue Objekte, die in den Bucket gelegt werden, erben die für den Bucket festgelegte Schutzdauer.

Aufbewahrungsperioden können explizit für Objektversionen festgelegt werden. Explizite Aufbewahrungsperioden spezifizieren ein "Aufbewahren bis Datum" für die Objektversion. Das "Aufbewahren bis Datum" wird in den Metadaten der Objektversion gespeichert und schützt die Objektversion bis die Aufbewahrungsperiode abläuft.

Nach Ablauf der Aufbewahrungsperiode kann die Objektversion gelöscht werden, es sei denn, eine rechtliche Sperre ist ebenfalls auf die Objektversion gelegt.

Explizite Aufbewahrungsmodus-Einstellungen überschreiben Standard-Bucket-Einstellungen.

Aufbewahrungsperioden können einfach verlängert werden, indem eine neue Sperranfrage eingereicht wird.

Innerhalb des Aufbewahrungsrahmens gibt es zwei Arten von Modi zum Festlegen von Aufbewahrungsperioden für Objekte und Buckets.

## Governance-Modus

Governance-Modus wird verwendet, um zu verhindern, dass Objekte von Standardbenutzern gelöscht werden. Bestimmte Benutzer müssen jedoch die erforderlichen Berechtigungen behalten, um Aufbewahrungseinstellungen zu ändern oder Objekte zu löschen. Diese Benutzer benötigen spezielle Berechtigungen wie s3:BypassGovernanceRetention-Berechtigung und DeleteObject-Berechtigung.

## Compliance-Modus

Compliance-Modus ist restriktiver und kann während der Aufbewahrungsperiode nicht widerrufen werden. Daher stellt Compliance-Modus sicher, dass niemand (einschließlich des Root-Benutzers) Objekte während der Objekt-Aufbewahrungsperiode löschen kann.

## Rechtliche Sperre

Rechtliche Sperre bietet den gleichen WORM-Schutz wie Aufbewahrungsperioden, aber ohne Ablaufdatum. Dies ist eine unbegrenzte Aufbewahrung, die nur von autorisierten Benutzern entfernt werden kann.

Wenn Objekte Aufbewahrungs- oder rechtliche Sperr-Richtlinien definiert haben, werden sie weiterhin versioniert. Replikationsoperationen, die auf eine Objektversion durchgeführt werden, übertragen keine Aufbewahrungs- und rechtlichen Sperr-Einstellungen vom Quell-Bucket zum Ziel.

## RustFS Datenimmutabilität entspricht oder übertrifft Cohasset-Zertifizierungsstandards

Der Goldstandard für Objektsperrung, Aufbewahrung und rechtliche Sperre ist die Verifizierung durch Cohasset Associates. RustFS's Objektspeicher-Aufbewahrung und Datenimmutabilität hat positive Bewertung von Cohasset Associates erhalten, insbesondere bezüglich SEC Rule 17a-4(f), FINRA Rule 4511 und CFTC Regulation 1.31. Rule 17a-4 hat spezifische Anforderungen für elektronische Datenspeicherung, einschließlich vieler Aspekte des Datensatz-Managements wie Dauer, Format, Qualität, Verfügbarkeit und Verantwortlichkeit der Broker-Dealer-Datensatz-Aufbewahrung.

Eine Kopie des Bewertungsberichts von Cohasset Associates kann vollständig heruntergeladen und mit relevanten Regulierungsbehörden geteilt werden, wenn Daten auf RustFS gespeichert werden. Er beschreibt detailliert, wie RustFS konfiguriert werden muss, um Anforderungen zu erfüllen und die Logik, die die Objektsperrfunktionalität unterstützt.

