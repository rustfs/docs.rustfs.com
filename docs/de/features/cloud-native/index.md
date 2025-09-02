---
title: "Hybrid/Multi-Cloud Objektspeicher"
description: "Hybrid/Multi-Cloud-Architektur ermöglicht konsistente Leistung, Sicherheit und Wirtschaftlichkeit."
---

# Hybrid/Multi-Cloud Objektspeicher

Hybrid/Multi-Cloud-Architektur ermöglicht konsistente Leistung, Sicherheit und Wirtschaftlichkeit. Jede Diskussion über Multi-Cloud muss mit einer Definition beginnen. Es ist nicht nur eine einzelne öffentliche Cloud und On-Premises.

## Erfolgreiche Multi-Cloud-Speicherstrategien nutzen Architekturen und Tools, die in verschiedenen Umgebungen laufen können

### Öffentliche Cloud

Dies ist ein zunehmend großes Feld, aber beginnen Sie mit AWS, Azure, GCP, IBM, Alibaba, Tencent und Regierungs-Clouds. Ihre Hybrid/Multi-Cloud-Speichersoftware muss dort laufen, wo der Anwendungsstack läuft. Selbst Unternehmen, die behaupten, auf einer einzelnen Cloud zu laufen, tun es nicht - es gibt immer andere Clouds. RustFS bietet Speicherkonsistenz für jeden öffentlichen Cloud-Anbieter und vermeidet die Notwendigkeit, Anwendungen neu zu schreiben, wenn auf neue Clouds erweitert wird.

### Private Cloud

Kubernetes ist die primäre Software-Architektur für moderne private Clouds. Dies umfasst alle Kubernetes-Distributionen wie VMware (Tanzu), RedHat (OpenShift), Rancher/SUSE, HP (Ezmeral) und Rafay. Multi-Cloud Kubernetes erfordert softwaredefinierten und cloud-nativen Objektspeicher. Private Clouds umfassen auch traditionellere Bare-Metal-Instanzen, aber Unternehmensworkloads werden zunehmend containerisiert und orchestriert.

### Edge

Edge geht darum, die Berechnung dorthin zu bewegen, wo Daten generiert werden. Nach der Verarbeitung werden Daten an zentralere Standorte verschoben. Edge-Speicherlösungen müssen leichtgewichtig, leistungsstark, cloud-nativ und resilient sein, um in solchen Multi-Cloud-Architekturen zu laufen. Das ist sehr schwierig zu erreichen, weshalb nur wenige Anbieter darüber sprechen - sie haben keine gute Antwort, nicht einmal Amazon.

## Multi-Cloud-Architektur mit RustFS

![Multi-Cloud-Architektur](images/multi-cloud-architecture.png)

## Eigenschaften von Hybrid/Multi-Cloud-Speicher

Multi-Cloud-Speicher folgt den von öffentlichen Clouds etablierten Mustern, bei denen öffentliche Cloud-Anbieter konsequent cloud-nativen Objektspeicher übernehmen. Der Erfolg öffentlicher Clouds hat Datei- und Blockspeicher effektiv obsolet gemacht. Jede neue Anwendung wird für die AWS S3 API geschrieben, nicht für POSIX. Um wie cloud-native Technologien zu skalieren und zu performen, müssen ältere Anwendungen für die S3 API neu geschrieben und in Microservices refaktoriert werden, um container-kompatibel zu sein.

### Kubernetes-Native

Kubernetes-native Design erfordert Operator-Services zur Konfiguration und Verwaltung von Multi-Tenant-Objektspeicher als Service-Infrastruktur. Jeder dieser Tenants läuft in seinem eigenen unabhängigen Namespace und teilt gleichzeitig zugrunde liegende Hardware-Ressourcen. Das Operator-Muster erweitert das vertraute deklarative API-Modell von Kubernetes durch Custom Resource Definitions (CRDs), um häufige Operationen wie Ressourcen-Orchestrierung, unterbrechungsfreie Upgrades, Cluster-Skalierung usw. durchzuführen und hohe Verfügbarkeit zu gewährleisten.

RustFS ist speziell dafür gebaut, die Kubernetes-Architektur voll auszunutzen. Da die Server-Binärdatei schnell und leichtgewichtig ist, kann der RustFS Operator mehrere Tenants dicht nebeneinander platzieren, ohne Ressourcen zu erschöpfen. Nutzen Sie die Vorteile von Kubernetes und verwandten Ökosystemen, um Multi-Cloud-Vorteile mit portablem Kubernetes-nativem Speicher zu erlangen.

### Konsistent

Hybrid/Multi-Cloud-Speicher muss in API-Kompatibilität, Leistung, Sicherheit und Compliance konsistent sein. Er muss konsistent und unabhängig von zugrunde liegender Hardware ausgeführt werden. Jede Variation, selbst kleine, kann Anwendungen zum Absturz bringen und enorme operative Belastungen schaffen.

Da RustFS sehr leichtgewichtig ist, können wir unterbrechungsfreie Updates über öffentliche, private und Edge-Clouds in Minuten ausrollen und dabei eine konsistente Erfahrung gewährleisten. RustFS abstrahiert die grundlegenden Unterschiede zwischen diesen Architekturen, einschließlich Schlüsselverwaltung, Identitätsverwaltung, Zugriffsrichtlinien und Hardware/OS-Unterschiede.

### Leistung

Da Objektspeicher sowohl als primärer als auch als sekundärer Speicher dient, muss er Leistung in großem Maßstab liefern. Von mobilen/Web-Anwendungen bis hin zu AI/ML erfordern datenintensive Workloads außergewöhnliche Leistung vom zugrunde liegenden Objektspeicher. Selbst Datenschutz-Workloads benötigen hochperformante Deduplizierung und Snapshot-Zugriff. Kein Unternehmen kann sich langsame Wiederherstellungsprozesse leisten. Traditionell erforderten diese Workloads Bare-Metal-Leistung. Jetzt können alle diese Workloads containerisiert werden - wie der Erfolg öffentlicher Cloud-Anbieter beweist.

RustFS ist der schnellste Objektspeicher der Welt mit NVMe-Lese-/Schreibgeschwindigkeiten von 325 GiB/s und 171 GiB/s bzw. HDD-Lese-/Schreibgeschwindigkeiten von 11 GiB/s und 9 GiB/s. Bei solchen Geschwindigkeiten kann jeder Workload in jeder Multi-Cloud-Architektur erreicht werden, die auf jeder Infrastruktur läuft.

### Skalierbar

Viele Menschen denken, dass Skalierung nur bedeutet, wie groß ein System werden kann. Diese Denkweise ignoriert jedoch die Bedeutung der operativen Effizienz, wenn sich Umgebungen entwickeln. Unabhängig von der zugrunde liegenden Umgebung müssen Multi-Cloud-Objektspeicherlösungen effizient und transparent skalieren mit minimaler menschlicher Interaktion und maximaler Automatisierung. Dies kann nur durch API-gesteuerte Plattformen erreicht werden, die auf einfachen Architekturen aufbauen.

RustFS' unerbittlicher Fokus auf Einfachheit bedeutet, dass großskalige, Multi-Petabyte-Dateninfrastruktur mit minimalen menschlichen Ressourcen verwaltet werden kann. Dies ist eine Funktion von APIs und Automatisierung und schafft eine Umgebung, auf der skalierbarer Multi-Cloud-Speicher aufgebaut werden kann.

### Software-definiert

Der einzige Weg, in Multi-Cloud erfolgreich zu sein, ist mit software-definiertem Speicher. Der Grund ist einfach. Hardware-Geräte laufen nicht auf öffentlichen Clouds oder Kubernetes. Öffentliche Cloud-Speicherdienstangebote sind nicht dafür konzipiert, auf anderen öffentlichen Clouds, privaten Clouds oder Kubernetes-Plattformen zu laufen. Selbst wenn sie es täten, würden Bandbreitenkosten die Speicherkosten übersteigen, da sie nicht für netzwerkübergreifende Replikation entwickelt wurden. Zugegeben, software-definierter Speicher kann auf öffentlichen Clouds, privaten Clouds und Edge laufen.

RustFS ist in Software geboren und portabel über verschiedene Betriebssysteme und Hardware-Architekturen. Beweise finden sich in unseren 2M+ IPs, die über AWS, GCP und Azure laufen.
