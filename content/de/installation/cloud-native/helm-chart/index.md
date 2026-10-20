---
title: Überblick
description: Verstehen Sie, wie das RustFS-Helm-Chart Standalone- und verteilte Cluster auf Kubernetes bereitstellt.
---

Das offizielle **RustFS-Helm-Chart** stellt einen RustFS-Cluster direkt in Kubernetes bereit. Helm erzeugt aus einer einzigen Values-Datei die Arbeitslast, die Services, die Zugangsdaten, die Konfiguration, die PersistentVolumeClaims (PVCs), den Ingress und optionale Zertifikatsressourcen.

Das Chart unterstützt zwei Bereitstellungsmodi:

- **Standalone** erzeugt einen Pod mit einem Daten-PVC. Verwenden Sie diesen Modus für Evaluierung und Entwicklung.
- **Verteilt** erzeugt ein StatefulSet mit mehreren Pods und Daten-PVCs. `replicaCount` steuert die Anzahl der Pods und `drivesPerNode` die Anzahl der Daten-PVCs, die jeder Pod einhängt.

Der verteilte Modus ist standardmäßig aktiviert. Das Chart unterstützt außerdem mehrere Speicherpools, die sich nur durch Anhängen erweitern lassen. Für eine erste Bereitstellung lässt sich eine einzelne ausdrückliche Topologie jedoch leichter betreiben. Zugangsdaten müssen über Chart-Values oder ein vorhandenes Secret übergeben werden. Das Chart lehnt leere und allgemein bekannte Standard-Zugangsdaten ab, sofern unsichere Entwicklungsstandards nicht ausdrücklich aktiviert sind.

Verwenden Sie das Helm-Chart, wenn Helm einen RustFS-Cluster verwalten soll. Verwenden Sie den [RustFS Operator](../operator/index.md), wenn Sie Kubernetes-Custom-Resources, mehrere Tenants oder eine vom Operator gesteuerte Pool-Verwaltung benötigen.

## Abläufe mit dem Helm-Chart

- [Installation](./installation.mdx) behandelt Anforderungen sowie die Standalone- oder verteilte Bereitstellung.
- [mTLS](./mtls.md) verschlüsselt den Verkehr zwischen RustFS-Pods und authentifiziert ihn.
- [cert-manager](./cert-manager.md) stellt Zertifikate für RustFS-Ingress und mTLS aus und erneuert sie.
