---
title: "RustFS Mehrere-Maschinen-Mehrere-Datenträger-Installation"
description: "Installation von RustFS auf mehreren Datenträgern mehrerer Server-Maschinen, Daten werden auf mehreren Datenträgern mehrerer Server gespeichert."
---

# Mehrere-Maschinen-Mehrere-Datenträger (MNMD, Multiple Node Multiple Disk)

## I. Vor der Installation lesen

Dieses Dokument enthält den RustFS Mehrere-Maschinen-Mehrere-Datenträger-Bereitstellungsmodus. Mehrere-Maschinen-Mehrere-Datenträger ist geeignet für unternehmensreife Leistung, Sicherheit und Skalierbarkeit. Außerdem werden Architekturdiagramme für Produktionsarbeitslasten bereitgestellt. Bitte lesen Sie vor der Installation unsere Startmodi und Checkliste, wie folgt:

1. Bitte klären Sie Ihre drei Installationsmodi:

     - [Einzelmaschine-Einzeldatenträger-Modus (SNSD)](./single-node-single-disk.md)
     - [Einzelmaschine-Mehrere-Datenträger-Modus (SNMD)](./single-node-multiple-disk.md)
     - [Mehrere-Maschinen-Mehrere-Datenträger-Modus (MNMD)](./multiple-node-multiple-disk.md)  (aktuelles Dokument)

2. [Prüfung vor Installation](../checklists/index.md), um sicherzustellen, dass alle Indikatoren den Produktionsrichtlinien entsprechen. Diese Anleitung kann übersprungen werden, falls kein Produktionsstandard erforderlich ist;

Mindestens **4 Server** sind erforderlich, jeder Server benötigt mindestens 1 Datenträger, um sicher einen verteilten Objektspeicher-Cluster zu starten.

Das folgende Architekturdiagramm zeigt, dass Daten durch Lastausgleich zufällig auf jeden Server geschrieben werden. Im Standard 12 + 4 Modus wird ein Datenblock standardmäßig in 12 Datenblöcke + 4 Prüfblöcke aufgeteilt und auf verschiedenen Datenträgern verschiedener Server gespeichert.

Der Ausfall oder die Wartung eines beliebigen Servers beeinträchtigt nicht die Datensicherheit.

Der Ausfall von bis zu 4 Datenträgern beeinträchtigt nicht die Datensicherheit.

<img src="./images/multiple-node-multiple-disk.jpg" alt="RustFS Multiple Node Multiple Disk Mode" />

## II. Voraussetzungen

1. Betriebssystemversion;
2. Firewall;
3. Host-Alias oder Domain-Auflösung;
4. Speicherbedingungen;
5. Zeitsynchronisation;
6. Kapazitätsplanung;
7. Datenträgerplanung;
8. Dateisystemplanung;

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

### 2.3 Hostname (Einzelmaschine-Einzeldatenträger und Einzelmaschine-Mehrere-Datenträger können diesen Schritt überspringen)

> Einzelmaschine-Einzeldatenträger und Einzelmaschine-Mehrere-Datenträger setzen keinen Host-Alias, bitte überspringen Sie diesen Schritt.

Für die Erstellung eines RustFS-Clusters müssen **identische, kontinuierliche** Hostnamen verwendet werden. Es gibt zwei Möglichkeiten, kontinuierliche Hostnamen zu implementieren:

**1. DNS-Konfiguration:**

Bitte konfigurieren Sie Ihren DNS-Auflösungsserver, um Namenskontinuität zu gewährleisten.

**2. HOSTS-Konfiguration:**

Ändern Sie die lokalen Alias-Einstellungen in /etc/hosts, die spezifischen Operationen sind wie folgt:
