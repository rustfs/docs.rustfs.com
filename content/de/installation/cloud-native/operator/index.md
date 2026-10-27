---
title: "Überblick über den Operator"
description: Verstehen Sie, wie der RustFS Operator RustFS-Cluster auf Kubernetes verwaltet.
---

**RustFS Operator** wendet das Kubernetes-Operator-Muster auf RustFS-Cluster an. Statt StatefulSets, Services, PersistentVolumeClaims (PVCs) und die Konfiguration von Hand anzulegen, deklarieren Sie den benötigten Speichercluster als Kubernetes-Custom-Resource. Der Controller beobachtet diese Ressource und gleicht den laufenden Cluster fortlaufend mit dem deklarierten Zustand ab.

Der Operator installiert zwei Custom Resource Definitions (CRDs):

- `Tenant` (`rustfs.com/v1alpha1`) steht für einen RustFS-Cluster. Er definiert Speicherpools, Zugangsdaten, Scheduling, Transport Layer Security (TLS) und die Einstellungen des Key Management Service (KMS).
- `PolicyBinding` (`sts.rustfs.com/v1alpha1`) ordnet ein Kubernetes-ServiceAccount RustFS-Richtlinien zu, wenn Arbeitslasten temporäre Zugangsdaten vom Security Token Service (STS) des Operators anfordern.

Ein Operator kann mehrere Tenants über Namespaces hinweg verwalten. Jeder Tenant hat eigenen Speicher, eigene Zugangsdaten, eigene S3- und Console-Services (Weboberfläche) sowie einen eigenen Lebenszyklus. Der Operator erzeugt pro Pool ein StatefulSet, sodass Sie Kapazität hinzufügen können, indem Sie einen Pool anhängen, ohne den Cluster neu aufzubauen. Er meldet außerdem die Conditions `Ready`, `Progressing` oder `Degraded` sowie Kubernetes-Events und stellt Endpunkte für Integrität und Metriken zur Cluster-Überwachung bereit.

Dieselbe API deckt kleine Testcluster und verteilte Bereitstellungen ab. Sensible Zugangsdaten und KMS-Material bleiben in Kubernetes-Secrets, während Tenant-Manifeste in der Versionsverwaltung nur Secret-Referenzen enthalten. Dadurch werden Bereitstellungen wiederholbar, GitOps-Abläufe werden unterstützt, und Routineaufgaben wie Mehrmandantenverwaltung, Speicherpool-Erweiterung, TLS und Verschlüsselung bleiben in Kubernetes-nativen Werkzeugen.

## Abläufe mit dem Operator

- [Installation](./installation.md) behandelt Anforderungen, die Helm-Installation, den Zugriff auf die Console und die TLS-Konfiguration.
- [Mehrmandantenbetrieb](./tenant.md) erzeugt isolierte RustFS-Cluster für verschiedene Teams oder Arbeitslasten.
- [Speicherpool-Erweiterung](./pool-expansion.md) fügt Speicherkapazität hinzu, indem ein Pool an einen bestehenden Tenant angehängt wird.
- [KMS-Integration](./kms.md) konfiguriert die lokale oder die HashiCorp-Vault-Schlüsselverwaltung für verschlüsselte Daten.

:::warning[Vorabversion]

RustFS Operator ist derzeit Vorabversionssoftware `v0.1.0` in aktiver Entwicklung. Prüfen Sie Upgrades und Tenant-Änderungen zuerst in einem nicht produktiven Cluster.

:::
