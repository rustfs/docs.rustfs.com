---
title: "RustFS Einzelmaschine-Mehrere-Datenträger-Installation"
description: "Installation von RustFS auf mehreren Datenträgern einer einzelnen Server-Maschine, Daten werden auf mehreren Datenträgern gespeichert."
---

# Einzelmaschine-Mehrere-Datenträger-Modus (SNMD, Single Node Multiple Disk)

## I. Vor der Installation lesen

Dieses Dokument enthält den Einzelmaschine-Mehrere-Datenträger-Bereitstellungsmodus.

1. Bitte klären Sie Ihre drei Installationsmodi:

    - [Einzelmaschine-Einzeldatenträger-Modus (SNSD)](./single-node-single-disk.md)
    - [Einzelmaschine-Mehrere-Datenträger-Modus (SNMD)](./single-node-multiple-disk.md)     (aktuelles Dokument)
    - [Mehrere-Maschinen-Mehrere-Datenträger-Modus (MNMD)](./multiple-node-multiple-disk.md)

2. [Prüfung vor Installation](../checklists/index.md), um sicherzustellen, dass alle Indikatoren den Produktionsrichtlinien entsprechen. Diese Anleitung kann übersprungen werden, falls kein Produktionsstandard erforderlich ist;

> Das aktuelle Dokument ist geeignet für den Einzelmaschine-Mehrere-Datenträger-Modus. Der Einzelmaschine-Mehrere-Datenträger-Modus ist geeignet für mittlere nicht-kritische Geschäfte. In Produktionsumgebungen verursacht normalerweise der Ausfall der angegebenen M-Datenträger keine Datenrisiken. Wenn der gesamte Server ausfällt oder mehr als M-Datenträger beschädigt werden, gehen Daten verloren. Bitte beachten Sie das Backup wichtiger Daten.

In einem Server gibt es nur mehrere Datenträger, Daten werden in Chunk-Form auf mehreren Datenträgern gespeichert.

Ein Datenblock wird in die angegebenen K-Datenblöcke und M-Prüfblöcke aufgeteilt. Höchstens K-Datenblöcke dürfen nicht verloren gehen, höchstens M-Prüfblöcke dürfen nicht verloren gehen.

Nehmen Sie das folgende Diagramm als Beispiel:

<img src="./images/single-node-multiple-disk.jpg" alt="RustFS Single Node Multiple Disk Mode" />

## II. Voraussetzungen

1. Betriebssystemversion;
2. Firewall;
3. Speicherbedingungen;
4. Zeitsynchronisation;
5. Kapazitätsplanung;
6. Datenträgerplanung;
7. Dateisystemauswahl;

### 2.1. Betriebssystemversion

Wir empfehlen Linux-Kernel-Versionen 4.x und höher. Weil Versionen 5.x / 6.x bessere IO-Durchsatz- und Netzwerkleistung bieten können.

Sie können Ubuntu 22.04 und RHEL8.x verwenden, um RustFS zu installieren.

### 2.2 Firewall

Linux-Systeme haben standardmäßig Firewalls aktiviert. Sie können den Firewall-Status mit dem folgenden Befehl überprüfen:

```bash
systemctl status firewalld
```

Wenn Ihr Firewall-Status "active" ist, können Sie die Firewall mit den folgenden Befehlen deaktivieren:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Oder öffnen Sie Port 9000 für RustFS:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --reload
```

Alle RustFS-Server in der Bereitstellung **müssen** den gleichen Listening-Port verwenden. Wenn Sie Port 9000 verwenden, müssen alle anderen Server auch Port 9000 verwenden.

### 2.3 Speicherbedingungen

RustFS benötigt mindestens 2 GB Speicher für Testumgebungen, Produktionsumgebungen benötigen mindestens 128 GB Speicher.

### 2.4 Zeitsynchronisation

Multi-Node-Konsistenz muss Zeit-Server verwenden, um Zeitkonsistenz zu wahren, sonst können Probleme beim Starten des Dienstes auftreten. Verwandte Zeit-Server verwenden zum Beispiel `ntp`, `timedatectl` oder `timesyncd`.

RustFS benötigt Zeitsynchronisation. Sie können den Zeitsynchronisationsstatus mit dem folgenden Befehl überprüfen:

```bash
timedatectl status
```

Wenn der Status "synchronized" ist, bedeutet das, dass die Zeitsynchronisation normal ist.
