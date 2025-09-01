---
title: "Verschlüsselung"
description: "Infrastruktur für umfangreiche Datensicherheit"
---

# Infrastruktur für großmaßstäbliche Daten

RustFS ist für Skalierung konzipiert. Technische Skalierung, operative Skalierung und wirtschaftliche Skalierung. Grundlegende Skalierung.

Im Bereich der Objektspeicherung ist robuste Verschlüsselung erforderlich, um einen Platz am Verhandlungstisch zu haben. RustFS bietet mehr Funktionalität durch höchste Verschlüsselungsstandards und umfassende Optimierungen, wodurch der Overhead, der typischerweise mit Speicherverschlüsselungsoperationen verbunden ist, praktisch eliminiert wird.

![Datenverschlüsselungsarchitektur](images/s5-1.png)

RustFS verschlüsselt Daten sowohl bei der Speicherung auf der Festplatte als auch bei der Übertragung über das Netzwerk. RustFS's modernste Verschlüsselungsschema unterstützt feingranulre Verschlüsselung auf Objektebene unter Verwendung moderner industrieller Standard-Verschlüsselungsalgorithmen wie AES-256-GCM, ChaCha20-Poly1305 und AES-CBC. RustFS ist vollständig kompatibel mit S3-Verschlüsselungssemantik und erweitert S3 durch Unterstützung von Nicht-AWS-Schlüsselverwaltungsdiensten wie Hashicorp Vault, Gemalto KeySecure und Google Secrets Manager.

## Netzwerkverschlüsselung

Wenn Daten zwischen Objektspeicher und Anwendungen übertragen werden, können sie zwischen einer beliebigen Anzahl unbekannter und/oder nicht vertrauenswürdiger Netzwerke übertragen werden. Die Verschlüsselung von Daten während der Übertragung über das Netzwerk (auch bekannt als "in transit") reduziert erfolgreich Man-in-the-Middle-Angriffe und gewährleistet, dass Daten sicher bleiben, unabhängig vom gewählten Routing-Pfad.

RustFS unterstützt Transport Layer Security (TLS) v1.2+ zwischen allen Komponenten im Cluster. Dieser Ansatz gewährleistet, dass es keine schwachen Stellen im verschlüsselten Verkehr zwischen oder innerhalb von Clustern gibt. TLS ist ein allgegenwärtiges Verschlüsselungsframework: Es ist dasselbe Verschlüsselungsprotokoll, das von Banken, E-Commerce-Websites und anderen Systemen auf Unternehmensebene verwendet wird, die auf Datenspeicherverschlüsselung angewiesen sind.

RustFS's TLS-Implementierung ist auf CPU-Befehlsebene optimiert mit vernachlässigbarem Leistungsaufwand. Es erfordert nur die Angabe von privaten TLS-Schlüsseln und öffentlichen Zertifikaten für jeden RustFS-Server im Cluster. Für Kubernetes-Umgebungen integriert der RustFS Kubernetes Operator automatisch generierte und zugewiesene TLS-Zertifikate während der Tenant-Bereitstellung. RustFS unterstützt mehrere TLS-Zertifikate, wobei jedes Zertifikat einem bestimmten Domainnamen entspricht. RustFS verwendet Server Name Indication (SNI), um zu bestimmen, welches Zertifikat für eine bestimmte Anfrage bereitgestellt werden soll.

## Objektverschlüsselung

Auf der Festplatte gespeicherte Daten sind vollständig auf die Sicherheit der Festplatte angewiesen und erstrecken sich auf das Hostsystem, um Datensicherheit zu gewährleisten. RustFS Server-seitige Objektverschlüsselung verschlüsselt Daten automatisch, bevor sie auf der Festplatte gespeichert werden (Verschlüsselung im Ruhezustand). Dieser Ansatz garantiert, dass keine Daten auf unverschlüsselte Festplatten geschrieben werden. Diese Basis-Sicherheitsschicht gewährleistet Vertraulichkeit, Integrität und Authentizität von Daten im Ruhezustand. RustFS unterstützt sowohl client-gesteuerte als auch automatische Bucket-Standard-Objektverschlüsselung für maximale Flexibilität bei der Datenverschlüsselung.

RustFS Server-seitige Verschlüsselung ist kompatibel mit Amazon AWS-S3 Semantik (SSE-S3). RustFS erweitert die Grundunterstützung für AWS KMS um gemeinsame Enterprise-KMS-Systeme wie Hashicorp Vault und Thales Ciphertrust (ehemals Gemalto KeySecure). RustFS unterstützt auch client-gesteuerte Verschlüsselung (SSE-C), bei der Anwendungen den Datenschlüssel angeben können, der zur Verschlüsselung von Objekten verwendet wird. Sowohl für SSE-S3 als auch SSE-C führt der RustFS-Server alle Verschlüsselungsoperationen durch, einschließlich Schlüsselrotation und Objektneuverschlüsselung.

Durch automatische Server-seitige Verschlüsselung verschlüsselt RustFS jedes Objekt mit einem eindeutigen Schlüssel und wendet mehrere Schichten zusätzlicher Verschlüsselung mit dynamischen Verschlüsselungsschlüsseln und Schlüsseln an, die von externem KMS oder client-bereitgestellten Schlüsseln abgeleitet werden. Dieser sichere und ausgeklügelte Ansatz wird innerhalb von RustFS durchgeführt, ohne die Notwendigkeit, mehrere unabhängige Kernel- und Userspace-Verschlüsselungsdienstprogramme zu handhaben.

RustFS verwendet Authenticated Encryption with Associated Data (AEAD) Schemata, um Objekte zu verschlüsseln/entschlüsseln, wenn Objekte in oder aus dem Objektspeicher geschrieben oder gelesen werden. RustFS AEAD-Verschlüsselung unterstützt industrielle Standard-Verschlüsselungsprotokolle wie AES-256-GCM und ChaCha20-Poly1305 zum Schutz von Objektdaten. RustFS's CPU-Level-Optimierungen (wie SIMD-Beschleunigung) gewährleisten vernachlässigbaren Leistungsaufwand für Verschlüsselungs-/Entschlüsselungsoperationen. Organisationen können automatische Bucket-Level-Verschlüsselung jederzeit ausführen, anstatt gezwungen zu sein, suboptimale Sicherheitsentscheidungen zu treffen.

## RustFS Key Encryption Service

RustFS bietet integrierte Optionen für Schlüsselverschlüsselung. RustFS's Key Encryption Service (KES) ist ein zustandsloses verteiltes Schlüsselverwaltungssystem für hochperformante Anwendungen. Es ist darauf ausgelegt, in Kubernetes zu laufen und Verschlüsselungsschlüssel an Anwendungen zu verteilen. KES ist eine erforderliche Komponente für RustFS Server-seitige Objektverschlüsselung (SSE-S3).

KES unterstützt Verschlüsselungsoperationen auf RustFS-Clustern und ist ein Schlüsselmechanismus zur Gewährleistung skalierbarer und hochperformanter Verschlüsselungsoperationen. KES fungiert als Vermittler zwischen RustFS-Clustern und externem KMS, generiert Verschlüsselungsschlüssel nach Bedarf und führt Verschlüsselungsoperationen durch, ohne durch KMS-Einschränkungen begrenzt zu werden. Daher gibt es immer noch ein zentrales KMS, das Masterschlüssel schützt und als Vertrauensquelle in der Infrastruktur dient. KES vereinfacht Bereitstellung und Verwaltung, indem die Notwendigkeit eliminiert wird, KMS für jeden Satz von Anwendungen zu bootstrappen. Stattdessen können Anwendungen Datenverschlüsselungsschlüssel (DEKs) von KES-Servern anfordern oder KES-Server bitten, verschlüsselte DEKs zu entschlüsseln.

Da KES-Server vollständig zustandslos sind, können sie automatisch skaliert werden, wie etwa durch Kubernetes Horizontal Pod Autoscaler. Gleichzeitig, da KES die große Mehrheit der Anwendungsanfragen unabhängig behandelt, erhöht sich die Last auf dem zentralen KMS nicht erheblich.

Für Kubernetes-Umgebungen unterstützt der RustFS Kubernetes Operator die Bereitstellung und Konfiguration von KES für jeden Tenant und ermöglicht SSE-S3 als Teil jeder Tenant-Bereitstellung.

![KES Key Encryption Service Architektur](images/s5-2.png)

## Unterstützte externe Schlüsselverwaltungssysteme

| ![AWS KMS](images/s5i-1.png) | ![HashiCorp Vault](images/s5i-2.png) | ![Google Secret Manager](images/s5i-3.png) |
|-------------------------------|----------------------------------------|-------------------------------------------|
| ![Azure Key Vault](images/s5i-4.png) | ![Thales CipherTrust](images/s5i-5.png) | ![Fortanix](images/s5i-6.png) |

