---
title: "Windows/Linux Bare-Metal- und Virtualisierungsbereitstellung"
description: "Open Source, S3-kompatibel, Enterprise-gehärtet und extrem schnell"
---

# Windows/Linux Bare-Metal- und Virtualisierungsunterstützung

Open Source, S3-kompatibel, Enterprise-gehärtet und extrem schnell.

RustFS ist ein hochperformantes, verteiltes Objektspeichersystem. Es ist softwaredefiniert, läuft auf branchenüblicher Hardware und ist zu 100% Open Source unter der Hauptlizenz Apache V2.0 Open Source.

RustFS unterscheidet sich dadurch, dass es von Grund auf als Standard für Private Cloud/Hybrid Cloud-Objektspeicherung konzipiert wurde. Da RustFS speziell für die ausschließliche Bereitstellung von Objekten entwickelt wurde, kann die einstufige Architektur alle notwendigen Funktionen bereitstellen, ohne die Leistung zu beeinträchtigen. Das Ergebnis ist ein Cloud-nativer Objektserver, der gleichzeitig hochperformant, skalierbar und leichtgewichtig ist.

Während RustFS bei traditionellen Objektspeicher-Anwendungsfällen wie sekundärer Speicherung, Disaster Recovery und Archivierung hervorragend abschneidet, zeichnet es sich durch die Bewältigung von Herausforderungen aus, die mit Machine Learning, Analytics und Cloud-nativen Anwendungs-Workloads verbunden sind.

## Kernfunktionen

### Erasure Coding

RustFS verwendet Inline-Erasure-Coding pro Objekt mit Assembler-Code für höchstmögliche Leistung. RustFS verwendet Reed-Solomon-Codes, um Objekte in Daten- und Paritätsblöcke mit benutzerdefinierbaren Redundanzebenen zu stripen. Das Erasure Coding von RustFS führt Reparaturen auf Objektebene durch und kann mehrere Objekte unabhängig voneinander reparieren.

Bei maximal N/2 Parität kann die Implementierung von RustFS sicherstellen, dass nur ((N/2)+1) funktionierende Laufwerke in der Bereitstellung für ununterbrochene Lese- und Schreibvorgänge erforderlich sind. Beispielsweise kann RustFS in einem 12-Laufwerk-Setup Objekte zwischen 6 Datenlaufwerken und 6 Paritätslaufwerken stripen und neue Objekte zuverlässig schreiben oder bestehende Objekte rekonstruieren, wenn nur noch 7 Laufwerke in der Bereitstellung verbleiben.

![Erasure Coding](./images/sec2-1.png)

### Bitrot-Schutz

Stille Datenbeschädigung oder Bitrot ist ein ernsthaftes Problem für Festplatten, das dazu führt, dass Daten ohne Wissen des Benutzers beschädigt werden. Die Ursachen sind vielfältig (alternde Laufwerke, Stromspitzen, Festplatten-Firmware-Fehler, Phantom-Writes, falsch gerichtete Lese-/Schreibvorgänge, Treiberfehler, versehentliche Überschreibungen), aber das Ergebnis ist dasselbe – Datenverlust.

RustFS' optimierte Implementierung des HighwayHash-Algorithmus stellt sicher, dass es niemals beschädigte Daten liest – es kann beschädigte Objekte sofort erfassen und reparieren. Durch die Berechnung von Hashes beim READ und deren Verifizierung beim WRITE von der Anwendung über das Netzwerk bis zum Speicher/Laufwerk wird End-to-End-Integrität gewährleistet. Die Implementierung ist auf Geschwindigkeit ausgelegt und kann Hash-Geschwindigkeiten von über 10 GB/s auf einem einzigen Core auf Intel-CPUs erreichen.

![Bitrot-Schutz](./images/sec2-2.png)

### Serverseitige Verschlüsselung

Daten während der Übertragung zu verschlüsseln ist eine Sache; Daten im Ruhezustand zu schützen ist eine andere. RustFS unterstützt mehrere ausgeklügelte serverseitige Verschlüsselungsschemas zum Datenschutz – unabhängig davon, wo sich die Daten befinden. RustFS' Ansatz gewährleistet Vertraulichkeit, Integrität und Authentizität mit vernachlässigbarem Leistungsoverhead. Serverseitige und clientseitige Verschlüsselung wird mit AES-256-GCM, ChaCha20-Poly1305 und AES-CBC unterstützt.

Verschlüsselte Objekte verwenden AEAD-serverseitige Verschlüsselung für Manipulationssicherheit. Zusätzlich ist RustFS mit allen gängigen Schlüsselverwaltungslösungen (wie HashiCorp Vault) kompatibel und getestet. RustFS verwendet ein Key Management System (KMS) zur Unterstützung von SSE-S3.

Wenn ein Client SSE-S3 anfordert oder automatische Verschlüsselung aktiviert ist, verschlüsselt der RustFS-Server jedes Objekt mit einem eindeutigen Objektschlüssel, der von einem vom KMS verwalteten Hauptschlüssel geschützt wird. Angesichts des extrem niedrigen Overheads kann automatische Verschlüsselung für jede Anwendung und Instanz aktiviert werden.

![Serverseitige Verschlüsselung](./images/sec2-3.png)

### WORM (Write Once Read Many)

#### Identity Management

RustFS unterstützt die fortschrittlichsten Standards im Identity Management und kann sich mit OpenID Connect-kompatiblen Anbietern sowie wichtigen externen IDP-Anbietern integrieren. Das bedeutet, dass der Zugriff zentralisiert ist, Passwörter temporär und rotiert werden, anstatt in Konfigurationsdateien und Datenbanken gespeichert zu werden. Zusätzlich sind Zugriffs-Policies granular und hochgradig konfigurierbar, was Multi-Tenant- und Multi-Instanz-Bereitstellungen einfach unterstützt.

#### Kontinuierliche Replikation

Die Herausforderung traditioneller Replikationsmethoden besteht darin, dass sie nicht effektiv über einige hundert TiB hinaus skalieren. Dennoch benötigt jeder eine Replikationsstrategie zur Unterstützung der Disaster Recovery, und diese Strategie muss geografische Standorte, Rechenzentren und Clouds überspannen.

RustFS' kontinuierliche Replikation ist für großskalige, rechenzentrumsübergreifende Bereitstellungen konzipiert. Durch die Nutzung von Lambda-Computing-Benachrichtigungen und Objektmetadaten kann sie Deltas effizient und schnell berechnen. Lambda-Benachrichtigungen stellen sicher, dass Änderungen sofort propagiert werden, anstatt im traditionellen Batch-Modus.

Kontinuierliche Replikation bedeutet, dass bei einem Ausfall der Datenverlust minimal bleibt – selbst angesichts hochdynamischer Datensätze. Schließlich ist kontinuierliche Replikation, wie alles was RustFS macht, multi-vendor, was bedeutet, dass Ihr Backup-Standort alles von NAS bis Public Cloud sein kann.

#### Globale Föderation

Die Daten moderner Unternehmen sind überall. RustFS ermöglicht es, diese unterschiedlichen Instanzen zu einem einheitlichen globalen Namensraum zusammenzufassen. Konkret können beliebig viele RustFS-Server zu einem verteilten Cluster kombiniert werden, und mehrere verteilte Cluster können zu einer RustFS-Server-Föderation kombiniert werden. Jede RustFS-Server-Föderation bietet eine einheitliche Administrator- und Namensraum-Sicht.

RustFS-Föderationsserver unterstützen eine unbegrenzte Anzahl von verteilten Clustern. Die Auswirkung dieses Ansatzes ist, dass Objektspeicher für große, geografisch verteilte Unternehmen massiv skaliert werden kann, während die Fähigkeit beibehalten wird, verschiedene Anwendungen (Splunk, Teradata, Spark, Hive, Presto, TensorFlow, H20) von einer einzigen Konsole aus zu bedienen.

#### Multi-Cloud-Gateway

Alle Unternehmen verfolgen Multi-Cloud-Strategien. Das schließt Private Clouds ein. Daher müssen Ihre Bare-Metal-, Virtualisierungs-, Container- und Public Cloud-Services (einschließlich Nicht-S3-Anbieter wie Google, Microsoft und Alibaba) gleich aussehen. Während moderne Anwendungen hochgradig portabel sind, sind die Daten, die diese Anwendungen unterstützen, es nicht.

Die Bereitstellung dieser Daten, unabhängig davon, wo sie sich befinden, ist eine der Hauptherausforderungen, die RustFS löst. RustFS läuft auf Bare Metal, Network Attached Storage und jeder Public Cloud. Noch wichtiger ist, dass RustFS über die Amazon S3 API sicherstellt, dass diese Datensicht aus Anwendungs- und Verwaltungsperspektive vollkommen identisch aussieht.

RustFS kann noch weiter gehen und Ihre bestehende Speicherinfrastruktur Amazon S3-kompatibel machen. Die Auswirkungen sind weitreichend. Jetzt können Organisationen ihre Dateninfrastruktur wirklich vereinheitlichen – von Datei zu Block erscheinen alle Daten als über die Amazon S3 API zugängliche Objekte, ohne Migration.

Wenn WORM aktiviert ist, deaktiviert RustFS alle APIs, die Objektdaten und -metadaten ändern könnten. Das bedeutet, dass Daten nach dem Schreiben manipulationssicher werden. Dies hat praktische Anwendungen in vielen verschiedenen regulatorischen Anforderungen.

![WORM-Funktionalität](./images/sec2-4.png)

## Systemarchitektur

RustFS ist als Cloud-nativ konzipiert und kann als leichtgewichtige Container laufen, die von externen Orchestrierungsservices wie Kubernetes verwaltet werden. Der gesamte Server ist eine statische Binärdatei von etwa 40 MB und nutzt CPU- und Speicherressourcen effizient, selbst unter hoher Last. Das Ergebnis ist, dass Sie eine große Anzahl von Tenants auf gemeinsam genutzter Hardware co-hosten können.

RustFS läuft auf Commodity-Servern mit lokal angeschlossenen Laufwerken (JBOD/JBOF). Alle Server im Cluster sind funktional gleichwertig (vollständig symmetrische Architektur). Es gibt keinen Namenode oder Metadatenserver.

RustFS schreibt Daten und Metadaten zusammen als Objekte und benötigt keine Metadaten-Datenbank. Außerdem führt RustFS alle Funktionen (Erasure Coding, Bitrot-Prüfung, Verschlüsselung) als Inline-, strikt konsistente Operationen aus. Das Ergebnis ist, dass RustFS außergewöhnlich widerstandsfähig ist.

Jeder RustFS-Cluster ist eine Sammlung von verteilten RustFS-Servern mit einem Prozess pro Knoten. RustFS läuft als einzelner Prozess im Benutzerraum und verwendet leichtgewichtige Coroutinen für hohe Gleichzeitigkeit. Laufwerke werden in Erasure-Sets gruppiert (standardmäßig 16 Laufwerke pro Set), und Objekte werden mit einem deterministischen Hashing-Algorithmus auf diesen Sets platziert.

RustFS ist für großskalige, Multi-Rechenzentrum-Cloud-Speicherdienste konzipiert. Jeder Tenant betreibt seinen eigenen RustFS-Cluster, vollständig isoliert von anderen Tenants, wodurch sie vor Störungen durch Upgrades, Updates und Sicherheitsvorfälle geschützt werden. Jeder Tenant skaliert unabhängig durch die Föderation von Clustern über geografische Standorte hinweg.

