---
title: "RustFS für Alibaba Cloud Kubernetes Service"
description: "RustFS bietet erstklassige Integration mit Alibaba Cloud ACK für skalierbare und portable Objektspeicherlösungen"
---

# RustFS für Alibaba Cloud Kubernetes Service

## Drei Gründe, warum Kunden RustFS auf Alibaba Cloud betreiben

- RustFS fungiert als konsistente Speicherschicht in Hybrid-Cloud- oder Multi-Cloud-Bereitstellungsszenarien
- RustFS ist ein Kubernetes-natives Hochleistungsprodukt, das vorhersagbare Leistung in Public Cloud-, Private Cloud- und Edge-Cloud-Umgebungen bieten kann.
- Der Betrieb von RustFS auf ACK ermöglicht die Kontrolle über den Software-Stack und die Flexibilität, die zur Vermeidung von Cloud-Lock-in erforderlich ist.

Alibaba Cloud ACK ist ein verwalteter Service zum Betrieb von Kubernetes auf AWS, ohne eigene Kubernetes-Kontrolleben oder -Knoten installieren, betreiben und warten zu müssen.

RustFS bietet portable Hochleistungs-Objektspeichersysteme auf allen wichtigen Kubernetes-Plattformen (Alibaba Cloud ACK, Tanzu, Azure, GCP, Alibaba Cloud ACK). Auf Alibaba Cloud integriert sich RustFS nativ mit Alibaba Cloud ACK-Services, was es einfacher macht, eigene groß angelegte Multi-Tenant-Objektspeicher-als-Service zu betreiben. RustFS ist ein vollständiger Ersatz für AWS S3 Storage-as-a-Service.

![RustFS Architekturdiagramm](images/sec1-1.png)

Im Gegensatz zu AWS S3 ermöglicht RustFS Anwendungen, über Multi-Cloud- und Hybrid-Cloud-Infrastrukturen zu skalieren, ohne teure Software-Umschreibungen oder proprietäre Integrationen. Da RustFS containerisiert und Kubernetes-nativ ist, kann es auf diesen Plattformen ausgerollt werden, ohne Fachkenntnisse für den Betrieb groß angelegter Speicherinfrastruktur zu benötigen.

## RustFS Operator integriert sich nativ mit Alibaba Cloud ACK-Funktionen

### Funktionsübersicht

- **Speicherklassen und Tiering**
- **Externes Load Balancing**
- **Verschlüsselungs-Schlüsselverwaltung**
- **Identity Management**
- **Zertifikatsverwaltung**
- **Überwachung und Alarmierung**
- **Protokollierung und Auditing**

## Speicherklassen und Tiering

Eine Schlüsselanforderung für die groß angelegte Bereitstellung von RustFS auf Alibaba Cloud ACK ist die Fähigkeit, über Speicherklassen (NVMe, HDD, Public Cloud) hinweg zu stufen. Dies ermöglicht es Unternehmen, sowohl Kosten als auch Leistung zu verwalten.

RustFS unterstützt den automatischen Übergang alternder Objekte von schnellen NVMe-Schichten zu kostengünstigeren HDD-Schichten und sogar zu kostenoptimierten kalten Public Cloud-Speicherschichten.

Beim Tiering bietet RustFS einen einheitlichen Namespace über alle Schichten hinweg. Die schichtübergreifende Bewegung ist für Anwendungen transparent und wird durch vom Kunden bestimmte Richtlinien ausgelöst.

RustFS bietet sicheren Speicher in der Alibaba Cloud ACK Hybrid Cloud, indem es Objekte an der Quelle verschlüsselt und sicherstellt, dass Kunden immer die volle Kontrolle über ihre Daten haben. Wenn Alibaba Cloud ACK in der Public Cloud bereitgestellt wird, hilft die Tiering-Funktion ACK dabei, Daten effektiv über persistenten Block-Speicher und günstigere Objektspeicherschichten zu verwalten.

**Erfahren Sie mehr:**

## Externes Load Balancing

Die gesamte Kommunikation von RustFS basiert auf HTTP-, RESTful-APIs und unterstützt jeden standardmäßigen Kubernetes-kompatiblen Ingress-Controller. Dies umfasst hardware- und software-definierte Lösungen. Die beliebteste Wahl ist NGINX. Installation über OperatorHub oder OpenShift Marketplace, dann RustFS-Tenants mit Annotationen exponieren.

## Verschlüsselungs-Schlüsselverwaltung

Es gibt keine nativen OpenShift-Schlüsselverwaltungsfunktionen. Daher empfiehlt RustFS die Verwendung von HashiCorp Vault zur Speicherung von Schlüsseln außerhalb des Objektspeichersystems. Dies ist eine bewährte Praxis für Cloud-native Anwendungen.

Für alle Produktionsumgebungen empfehlen wir, die Verschlüsselung standardmäßig auf allen Buckets zu aktivieren. RustFS verwendet AES-256-GCM- oder ChaCha20-Poly1305-Verschlüsselung zum Schutz der Datenintegrität und -vertraulichkeit mit vernachlässigbaren Auswirkungen auf die Leistung.

RustFS unterstützt alle drei serverseitigen Verschlüsselungsmodi (SSE-KMS, SSE-S3 und SSE-C). SSE-S3 und SSE-KMS integrieren sich serverseitig mit KMS, während SSE-C clientbereitgestellte Schlüssel verwendet.

RustFS wird dieses KMS verwenden, um seinen internen Schlüsselverschlüsselungsserver (KES-Service) für hochleistungsfähige pro-Objekt-Verschlüsselung zu bootstrappen. Jeder Tenant betreibt seinen eigenen KES-Server in einem isolierten Namespace.

## Identity Management

Beim Betrieb von RustFS auf OpenShift können Kunden Single Sign-On (SSO) über externe OpenID Connect/LDAP-kompatible Identitätsprovider wie Keycloak, Okta/Auth0, Google, Facebook, ActiveDirectory und OpenLDAP verwalten. RustFS empfiehlt den OpenID Connect-kompatiblen Keycloak IDP.

Externe IDPs ermöglichen es Administratoren, Benutzer-/Anwendungsidentitäten zentral zu verwalten. RustFS baut darauf auf und bietet AWS IAM-ähnliche Benutzer-, Gruppen-, Rollen-, Richtlinien- und Token-Service-APIs. Die Fähigkeit einer infrastrukturunabhängigen, einheitlichen Identity- und Access Management (IAM)-Schicht bietet erhebliche architektonische Flexibilität.

## Zertifikatsverwaltung

Der gesamte Datenverkehr von Anwendungen zu RustFS, einschließlich Node-zu-Node-Verkehr, wird mit TLS verschlüsselt. TLS-Zertifikate werden verwendet, um Netzwerkkommunikation zu sichern und die Identität von Netzwerkverbindungsressourcen wie RustFS-Server-Domains zu etablieren.

RustFS integriert sich mit dem OpenShift Certificate Manager, sodass Sie den RustFS-Operator verwenden können, um Zertifikate für RustFS-Tenants automatisch bereitzustellen, zu konfigurieren, zu verwalten und zu aktualisieren. Tenants sind in ihren eigenen Kubernetes-Namespaces vollständig voneinander isoliert und haben ihre eigenen Zertifikate für erhöhte Sicherheit.

## Überwachung und Alarmierung

RustFS empfiehlt die Verwendung von Grafana, Plattform-Überwachungskomponenten, die im openshift-user-workload-monitoring-Projekt installiert sind, oder jedem anderen OpenShift-Container-Überwachungstool zur Verbindung mit RustFS. RustFS publiziert alle erdenklichen speicherbezogenen Prometheus-Metriken, von Bucket-Kapazität bis zu Zugriffsstetten. Diese Metriken können in jedem Prometheus-kompatiblen Tool oder der RustFS-Konsole gesammelt und visualisiert werden.

Externe Überwachungslösungen scrapen regelmäßig RustFS Prometheus-Endpoints. RustFS empfiehlt die Verwendung von Grafana oder Plattform-Überwachungskomponenten, die im openshift-user-workload-monitoring-Projekt installiert sind, zur Verbindung mit RustFS. Diese gleichen Tools können auch verwendet werden, um Baselines zu etablieren und Benachrichtigungs-Alert-Schwellenwerte zu setzen, die dann an Benachrichtigungsplattformen wie PagerDuty, Freshservice oder sogar SNMP weitergeleitet werden können.

## Protokollierung und Auditing

Die Aktivierung von RustFS-Auditing generiert Protokolle für jede Operation auf dem Objektspeicher-Cluster. Zusätzlich zu Audit-Logs protokolliert RustFS auch Konsolenfehler zur operationellen Fehlerbehebung.

RustFS unterstützt die Ausgabe von Logs an Elastic Stack (oder Drittanbieter) für Analyse und Alarmierung.

