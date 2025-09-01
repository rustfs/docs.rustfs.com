---
title: "Protokollierung und Audit"
description: "Detaillierte Speicher-Performance-Überwachung, Metriken und Protokollierung für jeden Vorgang"
---

# Protokollierung und Audit

Bei der Verfolgung von Gesundheit und Performance jedes Systems sind Metriken und Protokollierung entscheidend. RustFS bietet vollständige Sichtbarkeit in den Cluster durch detaillierte Speicher-Performance-Überwachung, Metriken und Protokollierung jeder Operation. Das Ergebnis ist eine robuste, transparente und effiziente Antwort auf Objektspeicher-Überwachung, Warnungen und Observabilität.

## Funktionsmerkmale

### Überwachungsmetriken

Bietet vollständige Systemüberwachung und Leistungsmetrik-Erfassung.

### Protokollierung

Zeichnet detaillierte Protokollinformationen für jeden Vorgang auf, unterstützt Audit-Tracking.

## Metrik-Überwachung

RustFS exportiert eine breite Palette von feingranulierten Hardware- und Software-Metriken über einen Prometheus-kompatiblen Metrik-Endpunkt. Prometheus ist eine Cloud-native Überwachungsplattform, die aus einem mehrdimensionalen Datenmodell mit Zeitreihendaten besteht, die durch Metriknamen und Schlüssel/Wert-Paare identifiziert werden. RustFS enthält ein Speicherüberwachungs-Dashboard, das Grafana verwendet, um gesammelte Metriken zu visualisieren. Das Prometheus-Ökosystem umfasst mehrere Integrationen zum Routing von RustFS-Metriken zu Speicher-, Messaging- und Warn-Services.

RustFS zeigt verschiedene feine Hardware- und Software-Metriken über den Prometheus-Endpunkt an, einschließlich Gesundheitsinformationen wie Festplatten- oder Knotenausfälle, gesamte verfügbare Speicherkapazität und Speicherkapazität pro Festplatte. Durch die Nutzung von Prometheus und seiner wachsenden Popularität als führende Metrik-Sammlung und Analyseplattform kann sich RustFS auf seine Objektspeicher-Funktionen konzentrieren, anstatt unzählige benutzerdefinierte Datenspeicher-Überwachungsadapter für bestimmte Drittanbieter-Analyse/Visualisierungs/Warn-Services zu erstellen.

Der RustFS Kubernetes Operator kann automatisch Prometheus-Deployments und Metrik-Sammlung für jeden Mandanten bereitstellen, konfigurieren und verwalten. Organisationen können auch ihr eigenes Prometheus oder Prometheus-kompatibles System auf jeden Mandanten richten für zentralisierte Überwachung über mehrere Anbieter, Rechenzentren und Visualisierungs-/Analyse-Tools hinweg.

RustFS bietet auch einen Health-Check-Endpunkt zum Prüfen der Knoten- und Cluster-Lebendigkeit. Eine einfache CURL-Anweisung kann anzeigen, ob ein bestimmter Knoten gesund ist oder ob der Cluster Read/Write-Quorum hat.

## Audit-Protokolle

Die Aktivierung der RustFS Audit-Protokollierung weist RustFS an, Protokolle für jeden Vorgang im Cluster zu generieren. Jeder Vorgang generiert ein Audit-Protokoll mit einer eindeutigen ID sowie Details über Client, Objekt, Bucket und alle anderen mit der Operation verbundenen Metadaten. RustFS schreibt Protokolldaten an konfigurierte HTTP/HTTPS-Webhook-Endpunkte. Benutzerdefinierte Adapter können verwendet werden, um spezifische Anforderungen von Audit-Protokollierungszielen zu erfüllen.

RustFS unterstützt die Konfiguration von Audit-Protokollen über die RustFS Console UI und das RustFS `mc` Kommandozeilen-Tool. Für Kubernetes-Umgebungen konfiguriert der RustFS Operator automatisch die Console mit LogSearch-Integration für visuelle Inspektion gesammelter Audit-Protokolle.

RustFS Lambda-Benachrichtigungen bieten zusätzliche Protokollierungsunterstützung. RustFS kann automatisch Bucket- und Objekt-Events an Drittanbieter-Anwendungen für ereignisgesteuerte Verarbeitung senden, wie serverlose oder Function-as-a-Service-Computing-Frameworks. RustFS Lambda-Benachrichtigungen unterstützen Ziele wie RabbitMQ, Kafka, Elasticsearch und beliebige Services über Webhook.

RustFS unterstützt auch Echtzeit-Tracing von HTTP/S-Operationen über die RustFS Console und den RustFS mc admin trace Shell-Befehl.

## Architektur

**RustFS stellt seine Metriken über einen Prometheus-kompatiblen HTTP(S)-Endpunkt zur Verfügung, wobei ein Prometheus-Service Push/Pull-Zugriff auf diese Metriken bietet. Der RustFS Kubernetes Operator stellt einen unabhängigen Prometheus-Service für jeden vorkonfigurierten RustFS-Mandanten bereit, um Mandanten-Metriken zu scrapen. Organisationen können auch ihren eigenen zentralisierten Prometheus-Service bereitstellen oder nutzen, um Mandanten-Metriken zu scrapen.**

![Architekturdiagramm 1](images/s7-1.png)

RustFS Lambda-Benachrichtigungen pushen automatisch Event-Benachrichtigungen an unterstützte Ziel-Services wie Kafka, Elasticsearch oder PostgreSQL. Administratoren können Bucket-Level-Benachrichtigungsregeln definieren, einschließlich feingranulierer Filter für S3-Events und Objekte, für die RustFS Events generiert. RustFS Lambda-Benachrichtigungen sind in den RustFS-Objektspeicher-Service integriert und benötigen nur Zugriff auf entfernte Benachrichtigungsziele.

![Architekturdiagramm 2](images/s7-2.png)

## Anforderungen

### Für Metriken

BYO Prometheus *oder* Kubernetes Operator für automatische Bereitstellung/Konfiguration pro Mandant verwenden.

### Für Protokollsuche

BYO PostgreSQL *oder* Kubernetes Operator für automatische Bereitstellung/Konfiguration pro Mandant verwenden.

### Für Protokolle

Unterstützung für Drittanbieter-Benachrichtigungsziele.

