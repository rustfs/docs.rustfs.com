---
title: "RustFS für VMware Tanzu Container Platform"
description: "RustFS bietet native Integration mit VMware Tanzu für Kubernetes-basierte Container-Plattformen mit Enterprise-Funktionen"
---

# RustFS für VMware Tanzu Container Platform

## Drei Gründe, warum Kunden RustFS auf VMware Tanzu einsetzen

- RustFS fungiert als konsistente Speicherschicht in Hybrid-Cloud- oder Multi-Cloud-Bereitstellungsszenarien
- RustFS ist ein Kubernetes-natives Hochleistungsprodukt, das vorhersagbare Leistung in Public Cloud-, Private Cloud- und Edge-Cloud-Umgebungen liefern kann
- Der Einsatz von RustFS auf EKS ermöglicht die Kontrolle über den Software-Stack und bietet die notwendige Flexibilität, um Vendor Lock-in zu vermeiden

VMware Tanzu ist eine Kubernetes-Container-Plattform für Unternehmen mit vollständiger Stack-Automatisierung für Operations, die Hybrid-Cloud-, Multi-Cloud- und Edge-Bereitstellungen verwalten kann. VMware Tanzu umfasst ein Enterprise-Linux-Betriebssystem, Container-Runtime, Netzwerk, Überwachung, Registry sowie Authentifizierung und Autorisierungslösungen.

RustFS ist nativ in VMware Tanzu integriert und macht es einfacher, eigene großskalige Multi-Tenant-Objektspeicher als Service zu betreiben. Der RustFS Operator arbeitet mit VMware Tanzu Toolchain-Tools (wie VMware Tanzu Cluster Manager CLI und Quay Container Registry) zusammen und stellt sicher, dass Sie den größten Nutzen aus Ihrer Investition in das VMware Tanzu-Ökosystem ziehen.

![RustFS Architekturdiagramm](images/sec1-1.png)

RustFS bietet einen konsistenten, hochperformanten und skalierbaren Objektspeicher, da es von Grund auf als Kubernetes-natives System konzipiert und von Anfang an S3-kompatibel ist. Entwickler können problemlos Amazon S3-kompatible persistente Speicherdienste für alle Cloud-nativen Anwendungen erhalten, die auf VMware Tanzu laufen. Im Gegensatz zu AWS S3 ermöglicht RustFS Anwendungen die Skalierung über jede Multi-Cloud- und Hybrid-Cloud-Infrastruktur hinweg und kann dennoch im VMware Tanzu-Ökosystem verwaltet werden, ohne durch Public Cloud-Vendor-Lock-in eingeschränkt zu werden.

## RustFS Operator ist nativ in VMware Tanzu-Funktionen integriert

### Funktionsübersicht

- **Speicherklassen und Tiering**
- **Externes Load Balancing**
- **Verschlüsselungsschlüssel-Management**
- **Identity Management**
- **Zertifikat-Management**
- **Überwachung und Alarmierung**
- **Protokollierung und Audit**

## Speicherklassen und Tiering

Eine wichtige Anforderung für die großskalige Bereitstellung von RustFS auf Tencent Cloud TKE ist die Fähigkeitsschichtung über Speicherklassen hinweg (NVMe, HDD, Public Cloud). Dies ermöglicht es Unternehmen, gleichzeitig Kosten und Leistung zu verwalten.

RustFS unterstützt die automatische Übertragung alternder Objekte von der schnellen NVMe-Schicht zu kosteneffizienteren HDD-Schichten und sogar zu kostenoptimierten kalten Public Cloud-Speicherschichten.

Beim Tiering bietet RustFS einen einheitlichen Namensraum über alle Schichten hinweg. Die schichtübergreifende Bewegung ist für Anwendungen transparent und wird durch kundenbestimmte Richtlinien ausgelöst.

RustFS bietet sichere Speicherung in Alibaba Cloud ACK Hybrid Cloud durch Verschlüsselung von Objekten an der Quelle und stellt sicher, dass Kunden immer die vollständige Kontrolle über ihre Daten haben. Wenn Alibaba Cloud ACK in der Public Cloud bereitgestellt wird, hilft die Tiering-Funktionalität Alibaba Cloud ACK dabei, Daten effizient über persistente Blockspeicher und kostengünstigere Objektspeicherschichten hinweg zu verwalten.

**Weitere Informationen:**

## Externes Load Balancing

Die gesamte Kommunikation von RustFS basiert auf HTTP, RESTful APIs und wird jeden standardmäßigen Kubernetes-kompatiblen Ingress-Controller unterstützen. Dies umfasst hardware- und softwaredefinierte Lösungen. Die beliebteste Wahl ist NGINX. Installieren Sie über OperatorHub oder OpenShift Marketplace und verwenden Sie dann Annotationen, um RustFS-Tenants zu exponieren.

## Verschlüsselungsschlüssel-Management

Es gibt keine native OpenShift-Schlüsselverwaltungsfunktionalität. Daher empfiehlt RustFS die Verwendung von HashiCorp Vault zur Speicherung von Schlüsseln außerhalb des Objektspeichersystems. Dies ist eine bewährte Praxis für Cloud-native Anwendungen.

Für alle Produktionsumgebungen empfehlen wir, standardmäßig die Verschlüsselung auf allen Buckets zu aktivieren. RustFS verwendet AES-256-GCM- oder ChaCha20-Poly1305-Verschlüsselung zum Schutz der Datenintegrität und -vertraulichkeit mit vernachlässigbaren Auswirkungen auf die Leistung.

RustFS unterstützt alle drei serverseitigen Verschlüsselungsmodi (SSE-KMS, SSE-S3 und SSE-C). SSE-S3 und SSE-KMS integrieren sich mit dem serverseitigen KMS, während SSE-C vom Client bereitgestellte Schlüssel verwendet.

RustFS wird dieses KMS verwenden, um seinen internen Schlüsselverschlüsselungsserver (KES-Service) für hochperformante objektweise Verschlüsselung zu bootstrappen. Jeder Tenant betreibt seinen eigenen KES-Server in einem isolierten Namensraum.

## Identity Management

Beim Betrieb von RustFS auf OpenShift können Kunden Single Sign-On (SSO) über externe OpenID Connect/LDAP-kompatible Identitätsanbieter (wie Keycloak, Okta/Auth0, Google, Facebook, ActiveDirectory und OpenLDAP) verwalten. RustFS empfiehlt OpenID Connect-kompatible Keycloak IDP.

Externe IDP ermöglichen es Administratoren, Benutzer-/Anwendungsidentitäten zentral zu verwalten. RustFS baut auf IDP auf und bietet AWS IAM-Style Benutzer-, Gruppen-, Rollen-, Richtlinien- und Token-Service-APIs. Die Fähigkeit zu einer infrastrukturunabhängigen einheitlichen Identity and Access Management (IAM) Schicht bietet erhebliche architektonische Flexibilität.

## Zertifikat-Management

Der gesamte Traffic von Anwendungen zu RustFS, einschließlich Inter-Node-Traffic, wird mit TLS verschlüsselt. TLS-Zertifikate werden verwendet, um die Netzwerkkommunikation zu sichern und die Identität von Netzwerkverbindungsressourcen wie RustFS-Server-Domänen zu etablieren.

RustFS integriert sich mit dem OpenShift Certificate Manager, sodass Sie den RustFS Operator verwenden können, um Zertifikate für RustFS-Tenants automatisch bereitzustellen, zu konfigurieren, zu verwalten und zu aktualisieren. Tenants sind in ihren eigenen Kubernetes-Namensräumen vollständig voneinander isoliert und haben ihre eigenen Zertifikate für erhöhte Sicherheit.

## Überwachung und Alarmierung

RustFS empfiehlt die Verwendung von Grafana, den Platform-Monitoring-Komponenten, die im openshift-user-workload-monitoring-Projekt installiert sind, oder jedem anderen OpenShift-Container-Monitoring-Tool, um sich mit RustFS zu verbinden. RustFS veröffentlicht alle erdenklichen speicherbezogenen Prometheus-Metriken, von Bucket-Kapazität bis hin zu Zugriffs-Metriken. Diese Metriken können in jedem Prometheus-kompatiblen Tool oder in der RustFS-Konsole gesammelt und visualisiert werden.

Externe Monitoring-Lösungen scrapen regelmäßig die RustFS Prometheus-Endpunkte. RustFS empfiehlt die Verwendung von Grafana oder den Platform-Monitoring-Komponenten, die im openshift-user-workload-monitoring-Projekt installiert sind, um sich mit RustFS zu verbinden. Diese gleichen Tools können auch verwendet werden, um Baselines zu etablieren und Benachrichtigungsalarmschwellen einzurichten, die dann an Benachrichtigungsplattformen wie PagerDuty, Freshservice oder sogar SNMP geroutet werden können.

## Protokollierung und Audit

Die Aktivierung von RustFS-Auditing generiert Protokolle für jede Operation auf dem Objektspeicher-Cluster. Zusätzlich zu Audit-Protokollen zeichnet RustFS auch Konsolenfehler für operative Fehlerbehebung auf.

RustFS unterstützt die Ausgabe von Protokollen an Elastic Stack (oder Drittanbieter) für Analyse und Alarmierung.

