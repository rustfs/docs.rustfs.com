---
title: "Linux Schnellinstallation RustFS"
description: "Verwenden Sie das RustFS One-Click-Installationspaket für schnelle Bereitstellung und Installation in Linux-Umgebungen"
---

# Linux Schnellinstallation RustFS

<a id="mode"></a>

## I. Vor der Installation lesen

Diese Seite enthält die vollständige Dokumentation und Erklärung für die drei Installationsmodi von RustFS. Der Multi-Machine-Multi-Disk-Modus bietet unternehmensreife Leistung, Sicherheit und Skalierbarkeit. Außerdem werden Architekturdiagramme bereitgestellt, die für Produktionsarbeitslasten benötigt werden. Bitte lesen Sie vor der Installation unsere Startmodi und Checkliste, wie folgt:

1. Bitte klären Sie Ihre drei Installations-Startmodi:

    - [Einzelmaschine-Einzeldatenträger-Modus (SNSD)](./single-node-single-disk.md)
    - [Einzelmaschine-Mehrere-Datenträger-Modus (SNMD)](./single-node-multiple-disk.md)
    - [Mehrere-Maschinen-Mehrere-Datenträger-Modus (MNMD)](./multiple-node-multiple-disk.md)

2. [Vorinstallationsprüfung](../checklists/index.md), stellen Sie sicher, dass alle Metriken den Produktionsleitlinien entsprechen. Wenn Sie keine Produktionsstandards benötigen, müssen Sie diese Anleitung nicht lesen.

## II. Schnellinstallation

Verwenden Sie das Schnellinstallationsskript für den **SNSD (Einzelmaschine-Einzeldatenträger)** Modus, das Skript ist wie folgt:

~~~
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
~~~

Hinweise:
1. Der Standard-Installationsport ist Port `9000`;
2. Der Standard-Installationspfad ist `/data/rustfs0`. Wenn Sie unabhängige Datenträger haben, binden Sie diese bitte vorher ein;
3. Installieren Sie bitte vorher `unzip`, um sicherzustellen, dass das RustFS-Zip-Installationspaket ordnungsgemäß entpackt werden kann.

Die GitHub-Adresse für die Schnellinstallation ist: https://github.com/rustfs/rustfs.com/blob/main/public/install_rustfs.sh

## III. Andere wichtige Punkte

1. Überprüfen Sie bitte, ob die Firewall aktiviert ist;
2. Stellen Sie bitte die Konsistenz des NTP-Zeitservers sicher;
3. Bestimmen Sie bitte die Kapazität und Datenträgerplanung des aktuellen Datenträgers;
4. Bestätigen Sie bitte die Kernel-Version des Betriebssystems zur Unterstützung von IO-Uring;
5. Überprüfen Sie bitte SELinux.
