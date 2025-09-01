---
title: "Glossar"
description: "Dieses Dokument stellt Begriffe vor, die häufig in der Objektspeicherung verwendet werden, um Benutzern zu helfen, die Objektspeicherung schnell zu verstehen"
---

# Vollständiges Glossar der Kernbegriffe der Objektspeicherung (100 Begriffe)

| Nr. | Begriff | Englisch | Erläuterung |
|-----|------------------------|------------------------------|--------------------------------------------------------------------------|
| 1 | Objektspeicher | Object Storage | Architektur zur Speicherung von Daten als Objekte anstelle traditioneller Dateihierarchien |
| 2 | Bucket | Bucket | Container zur Aufbewahrung von Objekten mit global eindeutigem Namensraum |
| 3 | Objekt | Object | Grundlegende Speichereinheit bestehend aus Daten, Metadaten und eindeutiger Kennung (Object Key) |
| 4 | Metadaten | Metadata | Schlüssel-Wert-Paar-Informationen zur Beschreibung von Objekteigenschaften (wie Dateityp, Erstellungszeit) |
| 5 | S3-kompatibel | S3-Compatible | Speicherdienst, der mit Amazon S3 API-Standards kompatibel ist |
| 6 | Datenhaltbarkeit | Data Durability | Wahrscheinlichkeit der langfristigen Aufbewahrung von Daten im System ohne Verlust (z.B. 99,999999999%) |
| 7 | Mehrfachkopien | Replication | Redundanztechnik zum Datenschutz durch mehrere Kopien |
| 8 | Löschkodierung | Erasure Coding | Fragmentierung und Kodierung von Daten für hohe Zuverlässigkeit mit weniger Speicherplatz |
| 9 | Kalte Speicherung | Cold Storage | Kostengünstiger Speichertyp für selten zugreifbare Daten (wie Archivdaten) |
| 10 | Lebenszyklus-Management | Lifecycle Management | Richtlinien zur automatischen Übertragung/Löschung von Objekten (z.B. nach 30 Tagen in kalte Speicherung) |
| 11 | Versionsverwaltung | Versioning | Beibehaltung historischer Objektversionen zum Schutz vor Überschreibung |
| 12 | Speicherklasse | Storage Class | Verschiedene Leistungs-/Kosten-Speicherschichten (Standard, Selten, Archiv) |
| 13 | Zugriffsschlüssel | Access Key | Authentifizierungsschlüssel für API-Anfragen (Access Key ID + Secret Access Key) |
| 14 | Region | Region | Geografischer Standort der Speicherinfrastruktur (z.B. Ostchina 1, Westamerika) |
| 15 | Verfügbarkeitszone | Availability Zone (AZ) | Isolierte Rechenzentren mit unabhängiger Strom-/Netzwerkversorgung in derselben Region |
| 16 | Endpunkt | Endpoint | Domain-Adresse für Speicherdienst-Zugang (z.B. us-east1.rustfs.com) |
| 17 | RESTful API | RESTful API | API-Designnorm basierend auf HTTP-Protokoll |
| 18 | Mehrteilige Übertragung | Multipart Upload | Mechanismus zur Segmentierung und Zusammenführung großer Dateien |
| 19 | Vorsignierte URL | Pre-Signed URL | Temporärer Zugriffslink mit Zeitbegrenzung |
| 20 | Serverseitige Verschlüsselung | SSE | Automatische serverseitige Datenverschlüsselung (SSE-S3/SSE-KMS/SSE-C) |
| 21 | Clientseitige Verschlüsselung | CSE | Lokale Verschlüsselung vor Upload durch Client |
| 22 | Regionsübergreifende Replikation | Cross-Region Replication | Automatische Objektreplikation über geografische Regionen hinweg |
| 23 | Zugriffskontrollliste | ACL | Regelliste zur Kontrolle von Bucket/Objekt-Zugriffsberechtigungen |
| 24 | Bucket-Richtlinie | Bucket Policy | JSON-basierte granulare Berechtigungskontrollrichtlinie |
| 25 | IAM | Identity and Access Management | Zentralisiertes System zur Verwaltung von Benutzer-/Rollenzugriffsberechtigungen |
| 26 | Ereignisbenachrichtigung | Event Notification | Benachrichtigung an Nachrichtenwarteschlange/Funktionsberechnung bei Ereignisauslösung |
| 27 | Data Lake | Data Lake | Zentrales Repository zur Speicherung strukturierter/unstrukturierter Daten |
| 28 | Compliance | Compliance | Einhaltung von Datenspeicherungsvorschriften wie GDPR, HIPAA |
| 29 | Protokollierung und Audit | Logging & Audit | Aufzeichnung aller API-Operationen zur Prüfung |
| 30 | Überwachung und Alarmierung | Monitoring & Alerting | Echtzeitüberwachung von Speichernutzung/Anfragezahlen mit Alarmauslösung |
| 31 | Cross-Origin Resource Sharing | CORS | Regeln zur Kontrolle des domänenübergreifenden Ressourcenzugriffs durch Browser |
| 32 | Übertragungsbeschleunigung | Transfer Acceleration | Upload-/Download-Geschwindigkeitsoptimierung durch Edge-Knoten |
| 33 | CDN-Integration | CDN Integration | Kombination mit Content Delivery Network für Cache-Beschleunigung |
| 34 | Datenexport | Data Export | Prozess der Datenmigration zu anderen Speichersystemen |
| 35 | Datenimport | Data Import | Massenmigration von Daten aus externen Systemen zum Objektspeicher |
| 36 | Statisches Website-Hosting | Static Website Hosting | Direktes Hosting von HTML/CSS/JS-Dateien durch Buckets |
| 37 | Hotlink-Schutz | Hotlink Protection | Technik zum Schutz vor unbefugter Nutzung von Ressourcenlinks durch externe Websites |
| 38 | Anfragerate-Begrenzung | Request Rate Limiting | Kontrolle der API-Anfragefrequenz pro Benutzer/IP |
| 39 | Tagging | Tagging | Hinzufügung von Klassifikationstags zu Buckets/Objekten zur einfacheren Verwaltung |
| 40 | Inventarbericht | Inventory Report | Regelmäßige Generierung von CSV/ORC-Dateien mit Objektlisten |
| 41 | Datenwiederherstellung | Data Restoration | Wiederherstellung von Daten aus Archivspeicher in zugänglichen Zustand |
| 42 | Storage Gateway | Storage Gateway | Zugriffsschicht zur Abbildung von Objektspeicher als lokales Dateisystem |
| 43 | Datenkompression | Data Compression | Kompression von Daten vor Upload zur Speicherplatzersparnis |
| 44 | Deduplikation | Data Deduplication | Eliminierung doppelter Daten zur Reduktion der Speicherbelegung |
| 45 | Direktes Archiv-Lesen | Direct Read Archive | Technik zum direkten Lesen von Archivdaten ohne Wiederherstellung |
| 46 | Bandbreitenkontrolle | Bandwidth Control | Begrenzung der Download-Bandbreite zur Vermeidung von Netzwerkstaus |
| 47 | Gleichzeitige Verbindungen | Concurrent Connections | Anzahl gleichzeitig verarbeiteter Datenübertragungsverbindungen |
| 48 | Datenmigrationsdienst | Data Migration Service | Automatisierte Migrationstools (wie AWS Snowball) |
| 49 | Client-SDK | Client SDK | Entwickler-Toolkit zur Integration von Speicherdiensten (z.B. Python/Java SDK) |
| 50 | CLI-Tool | Command Line Interface | Kommandozeilen-Verwaltungstool (z.B. aws s3 cp) |
| 51 | Grafische Konsole | Web Console | Webbasierte Verwaltungsoberfläche |
| 52 | Datenvalidierung | Data Integrity Check | Überprüfung der Übertragungsintegrität durch MD5/SHA |
| 53 | Fortsetzbare Übertragung | Resumable Upload/Download | Fortsetzung der Übertragung vom Unterbrechungspunkt nach Netzwerkausfall |
| 54 | Mirror Back to Source | Mirror Back to Source | Abruf und Speicherung von nicht vorhandenen Objekten von angegebener Quelle |
| 55 | Canary-Release | Canary Release | Veröffentlichungsstrategie zur schrittweisen Freigabe neuer Funktionen für Teile der Benutzer |
| 56 | Soft Delete | Soft Delete | Markierung gelöschter Objekte mit beibehaltener Wiederherstellungsperiode |
| 57 | Objektsperre | Object Lock | Compliance-Schutzmechanismus gegen Löschung oder Überschreibung von Objekten |
| 58 | Wasserzeichen | Watermarking | Hinzufügung von Identifikationsinformationen in Bildern/Videos |
| 59 | Thumbnail-Generierung | Thumbnail Generation | Automatische Erstellung von Miniaturversionen von Bildern |
| 60 | Bildverarbeitung | Image Processing | Online-Funktionen zum Zuschneiden/Skalieren/Drehen |
| 61 | Video-Transkodierung | Video Transcoding | Konvertierung von Videoformat/-auflösung für verschiedene Geräte |
| 62 | Inhaltsmoderation | Content Moderation | Automatische Erkennung regelwidriger Bilder/Videos/Texte |
| 63 | Kostenanalyse | Cost Analysis | Kostenstatistik nach Speichertyp/Anfrageanzahl und anderen Dimensionen |
| 64 | Nutzungsüberwachung | Usage Monitoring | Echtzeit-Dashboard für Speichervolumen/Traffic/Anfrageanzahl |
| 65 | Speicheranalyse | Storage Analytics | Tool zur Analyse von Speichermustern zur Kostenoptimierung |
| 66 | Anfragerzahlung | Requester Pays | Abrechnungsmodell, bei dem der Datendownloader die Kosten trägt |
| 67 | Datenschichtung | Tiered Storage | Automatische Datenübertragung zu kostengünstigeren Speicherschichten |
| 68 | Intelligente Schichtung | Intelligent Tiering | Automatische Auswahl des besten Speichertyps basierend auf Zugriffsmustern |
| 69 | Private Link | PrivateLink | Direkter Objektspeicher-Zugang über Intranet ohne öffentliche Netzwerkexposition |
| 70 | VPC-Endpunkt | VPC Endpoint | Eingang für sicheren Speicherdienst-Zugang innerhalb der Virtual Private Cloud |
| 71 | Übertragungsverschlüsselung | SSL/TLS | Verschlüsselte Datenübertragung über HTTPS-Protokoll |
| 72 | Clientseitige Verschlüsselung | Client-Side Encryption | Benutzerseitige Datenverschlüsselung vor Upload |
| 73 | KMS | Key Management Service | Zentralisierter Service zur Verwaltung von Verschlüsselungsschlüsseln |
| 74 | Berechtigungsgrenze | Permission Boundary | Begrenzung des maximalen Berechtigungsumfangs für IAM-Rollen/Benutzer |
| 75 | Temporäre Zugangsdaten | Temporary Credentials | Kurzfristig gültige Zugriffstoken (wie STS Token) |
| 76 | MFA-Löschschutz | MFA Delete | Erfordernis einer Mehrfaktor-Authentifizierung zur Datenlöschung |
| 77 | Datenunveränderlichkeit | Immutability | Eigenschaft zur Verhinderung von Datenmanipulation (kombiniert mit WORM-Modell) |
| 78 | Rechtliche Aufbewahrung | Legal Hold | Zwangsschutz gegen Datenlöschung/-änderung in Compliance-Szenarien |
| 79 | Kontenübergreifende Freigabe | Cross-Account Sharing | Zugriff anderer Cloud-Konten auf bestimmte Speicherressourcen |
| 80 | Vorab-Laderichtlinie | Prefetch Policy | Vorheriges Laden von Daten in Cache zur Beschleunigung nachfolgender Zugriffe |
| 81 | Cache-Kontrolle | Cache-Control | Spezifikation von Browser-/CDN-Cache-Verhalten über HTTP-Header |
| 82 | Verzögerte Löschung | Delayed Deletion | Verzögerte Ausführung von Löschoperationen zur Vermeidung versehentlicher Aktionen |
| 83 | Batch-Operationen | Batch Operations | Einheitliche Operationen auf mehrere Objekte (Löschen/Kopieren/Wiederherstellen) |
| 84 | Datenherkunft | Data Lineage | Metadaten-Aufzeichnung zur Verfolgung von Datenquelle und Änderungshistorie |
| 85 | Datenkatalog | Data Catalog | Suchsystem zur Speicherung von Metadaten-Informationen |
| 86 | Storage Gateway | Storage Gateway | Hybrid-Cloud-Lösung zur Verbindung lokaler Systeme mit Cloud-Speicher |
| 87 | Hybrid-Cloud-Speicher | Hybrid Cloud Storage | Architektur mit gleichzeitiger Nutzung von lokalem und Cloud-Speicher |
| 88 | Edge-Speicher | Edge Storage | Speicherdienst an Edge-Knoten nahe der Datenquelle |
| 89 | Multi-Cloud-Speicher | Multi-Cloud Storage | Speicherlösung über verschiedene Cloud-Anbieter hinweg |
| 90 | Speicher-Föderation | Storage Federation | Abstraktionsschicht zur einheitlichen Verwaltung mehrerer Speichersysteme |
| 91 | Objekt-Tag | Object Tag | Hinzufügung benutzerdefinierter Klassifikationstags zu Objekten |
| 92 | Bucket-Tag | Bucket Tag | Hinzufügung verwaltungs-/abrechnungsbezogener Tags zu Buckets |
| 93 | Speicherkontingent | Storage Quota | Begrenzung der maximalen Bucket-Kapazität |
| 94 | Anfrageratenbegrenzung | Request Throttling | Begrenzung der API-Anfragen pro Zeiteinheit |
| 95 | Service Level Agreement | SLA | Verpflichtungsmetriken für Dienstverfügbarkeit/-haltbarkeit (z.B. 99,9% Verfügbarkeit) |
| 96 | Notfallwiederherstellung | Disaster Recovery | Gewährleistung der Geschäftskontinuität durch regionsübergreifende Backups |
| 97 | Speichertopologie | Storage Topology | Verteilungsstruktur von Daten auf physischer/logischer Ebene |
| 98 | Nähe-Zugriff | Proximity Access | Routing von Benutzeranfragen zum nächstgelegenen Speicherknoten |
| 99 | Globaler einheitlicher Namensraum | Global Namespace | Einheitliche Ansichtsverwaltung regionsübergreifender Buckets |
| 100 | Zero-Copy-Migration | Zero-Copy Migration | Schnelle Datenmigration durch Metadatenoperationen |

