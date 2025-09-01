---
title: "Amazon S3 Kompatibilität"
description: "Amazon S3 API Kompatibilität und Multi-Cloud-Unterstützung von RustFS"
---

# Amazon S3 Kompatibilität

S3-Kompatibilität ist eine unabdingbare Anforderung für Cloud-native Anwendungen. RustFS hält sich strikt an die API-Nutzung und verfügt über Zehntausende von Nutzern, einschließlich kommerzieller Nutzer und der Community. RustFS' S3-Implementierung ist die weltweit am weitesten getestete und eingesetzte Alternative zu AWS S3.

## RustFS und S3 API - Entwickelt für Multi-Cloud-Speicher

RustFS hat sich von Anfang an als Standard für AWS S3-Kompatibilität etabliert. Als einer der frühesten Anwender der S3 API (V2 und V4) und eines der einzigen Speicherunternehmen, das sich ausschließlich auf S3 konzentriert, stellt die große Community von RustFS sicher, dass keine andere AWS-Alternative kompatibler ist. Da die S3 API der De-facto-Standard in der Cloud ist, müssen AWS-Alternativen die API fließend nutzen können, um in verschiedenen Umgebungen (öffentliche Cloud, private Cloud, Rechenzentrum, Multi-Cloud, Hybrid-Cloud und Edge) zu operieren und zu interagieren.

## S3 Ermöglicht Hybrid- und Multi-Cloud-Computing

Es gibt nur einen Weg, Multi-Cloud- und Hybrid-Cloud-Kompatibilität zu erreichen, und das ist S3. Als RESTful API-Standard hat S3 die Interaktionen zwischen Anwendungen, Daten und Infrastruktur revolutioniert. Zusätzlich sind auch die doppelten Kräfte der Containerisierung und Kubernetes-Orchestrierung um RESTful APIs herum aufgebaut, was POSIX APIs zu einem Legacy-Status degradiert.

Das Ergebnis ist, dass Kubernetes-native, S3-kompatible Objektspeicher und Anwendungen überall laufen können - von verschiedenen öffentlichen Cloud-Instanzen (RustFS hat fast 1 Million Bereitstellungen auf Google, Azure und AWS) bis hin zu privaten Clouds (Red Hat OpenShift, VMware Tanzu) und Bare Metal. Durch die Nutzung fortschrittlicher S3 API-gestützter ILM-Technologie können Unternehmen operativ optimierte Instanzen über Cloud- und On-Premises-Instanzen hinweg durchführen.

Kunden, die an S3-Konvertierungsschichten für Microsoft Azure interessiert sind, können das RustFS Blob Storage Gateway (S3 API) vom Azure Marketplace erwerben.

## S3-Kompatibilität für Bare Metal Workloads

Private Cloud ist ein fundamentaler Baustein jeder Hybrid-Cloud-Architektur. Dies bedeutet, dass wie bei öffentlichen Clouds S3-Kompatibilität entscheidend ist - unabhängig von der Anwendung - von Analytics bis zu Artefakten bis hin zur Archivierung.

Mit RustFS ist die S3-Kompatibilität völlig standortunabhängig. Dies bedeutet, dass RustFS' Bare Metal On-Premises-Instanzen genau dieselbe S3-Kompatibilität und Performance haben wie öffentliche Cloud-Instanzen oder sogar Edge-Instanzen.

## Vorteile von RustFS Skalierbarem Objektspeicher

Cloud-native Anwendungen verwenden die S3 API zur Kommunikation mit Objektspeicher. Aber nicht alle S3-Kompatibilität ist gleich - viele Objektspeicher-Anbieter unterstützen nur eine kleine Teilmenge der Gesamtfunktionalität - was zu Anwendungsausfällen führen kann. Andere behaupten umfassende Abdeckung, aber ihre proprietären Software- oder Gerätemodelle begrenzen diese Behauptung, da nur ein kleiner Teil von Anwendungen, Hardware und Software getestet wird.

RustFS' Einzigartigkeit liegt in seiner Fähigkeit, seine S3-Kompatibilitätsbehauptungen zu unterstützen. Wir haben Zehntausende von Kunden und Open-Source-Nutzern, und unsere S3 API-Kompatibilität ist die weltweit am weitesten getestete und implementierte - sie deckt Millionen von Hardware-, Software- und Anwendungskombinationen ab. RustFS veröffentlicht wöchentlich Software, und jeder Defekt in der S3 API wird sofort von der Community gemeldet und von RustFS korrigiert.

Es gibt Gerüchte, dass sogar Amazon RustFS zur Prüfung der S3-Kompatibilität von Drittanbietern verwendet.

Die umfassendste Unterstützung für die S3 API bedeutet, dass Anwendungen auf in RustFS gespeicherte Daten auf jeder Hardware, an jedem Ort und in jeder Cloud zugreifen können. Entwickler sind frei zu innovieren und zu iterieren, mit der Gewissheit, dass RustFS niemals Versionen brechen wird.

## Kernfunktionen

### S3 Select

![S3 Select](images/s1-4.png)

S3 Select hängt von großskaliger Performance für komplexe Abfragen ab, und RustFS' Performance-Eigenschaften können die API vollständig nutzen. RustFS nutzt SIMD-Befehlssätze zur Optimierung der Performance auf Chip-Ebene und ist in der Lage, große, komplexe S3 Select-Abfragen auf CSV, Parquet, JSON und mehr auszuführen.

### Amazon Signature V4

![Amazon Signature V4](images/s1-5.png)

Anwendungen und Clients müssen sich authentifizieren, um auf jede RustFS-Management-API zuzugreifen. RustFS war das erste Unternehmen, das AWS Signature Version 4 unterstützte (mit Unterstützung der veralteten Signature Version 2). Nach der Authentifizierung verwendet RustFS richtlinienbasierte Zugriffskontrolle, die mit AWS IAM-Richtliniensyntax, -struktur und -verhalten kompatibel ist, zur Autorisierung von Operationen.

## AWS S3 API und RustFS

RustFS ist der weltweit schnellste Objektspeicher. Kombiniert mit seiner S3-Kompatibilität stellt es sicher, dass es die breiteste Palette von Anwendungsfällen der Branche ausführen kann. Dies umfasst moderne Anwendungsworkloads wie GitHub und GitLab für Code-Repositories, moderne Analytics-Workloads wie MongoDB, ClickHouse, MariaDB, CockroachDB und Teradata, bis hin zu traditionellen Archivierungs-, Backup- und Disaster Recovery-Anwendungsfällen.

RustFS' Performance-Eigenschaften in Kombination mit seiner S3-Kompatibilität machen es zum Standard für AI/ML- und Data Science-Workloads. KubeFlow und TensorFlow benötigen hochperformanten S3-kompatiblen Objektspeicher und werden zunehmend zuerst für RustFS, dann für AWS oder andere Clouds entwickelt. RustFS bietet wahrhaft Multi-Cloud-Objektspeicher und effiziente Replikation für Anwendungen. Anwendungen, die für die S3 API geschrieben wurden, können überall laufen und ermöglichen es Entwicklern, schnell zu innovieren, wenn die besten Cloud-Tools verfügbar sind.

