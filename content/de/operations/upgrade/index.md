---
title: "Upgrade"
description: "Planen und führen Sie RustFS-Upgrades aus und erhalten Sie dabei die Verfügbarkeit des Clusters."
---

Wählen Sie den Upgrade-Ablauf, der zu Ihrer RustFS-Bereitstellung passt. Ersetzen Sie in Clustern mit mehreren Knoten jeweils einen Knoten oder ein Pod und warten Sie, bis er Bereitschaft meldet, bevor Sie fortfahren.

## Bereitstellungsmethoden

- [Binär-Upgrade](./binary/index.md) behandelt den Austausch der ausführbaren Datei unter systemd und das Zurücksetzen.
- [Container-Upgrade](./container/index.md) behandelt den Austausch des Images bei persistenten Daten-Volumes.
- [Kubernetes-Upgrade](./kubernetes/index.md) behandelt Workloads unter Helm und dem Operator.

Lesen Sie vor jedem Upgrade die Versionshinweise der Zielversion und bestätigen Sie, dass der Cluster betriebsbereit ist.
