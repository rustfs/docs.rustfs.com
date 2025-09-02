---
title: "RustFS Einzelmaschine-Einzeldatenträger-Installation"
description: "Installation von RustFS auf einem einzelnen Datenträger einer einzelnen Server-Maschine, Daten werden auf diesem einen Datenträger gespeichert."
---

# Einzelmaschine-Einzeldatenträger-Modus (SNSD, Single Node Single Disk)

## I. Vor der Installation lesen

Dieses Dokument enthält den RustFS Einzelmaschine-Einzeldatenträger-Bereitstellungsmodus.

1. Bitte klären Sie Ihre drei Installationsmodi:

    - [Einzelmaschine-Einzeldatenträger-Modus (SNSD)](./single-node-single-disk.md)    (aktuelles Dokument)
    - [Einzelmaschine-Mehrere-Datenträger-Modus (SNMD)](./single-node-multiple-disk.md)
    - [Mehrere-Maschinen-Mehrere-Datenträger-Modus (MNMD)](./multiple-node-multiple-disk.md)

2. [Prüfung vor Installation](../checklists/index.md), um sicherzustellen, dass alle Indikatoren den Produktionsrichtlinien entsprechen. Diese Anleitung kann übersprungen werden, falls kein Produktionsstandard erforderlich ist;

> Einzelmaschine-Einzeldatenträger ist geeignet für niedrige Dichte nicht-kritische Geschäfte. In Produktionsumgebungen wird empfohlen, Datenbackups durchzuführen, um Datenrisiken zu vermeiden.

In einem Server gibt es nur einen Datenträger, alle Daten werden auf diesem einen Datenträger gespeichert.

Das spezifische Architekturdiagramm ist wie folgt:

<img src="./images/single-node-single-disk.jpg" alt="RustFS Single Node Single Disk Mode" />

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

### 2.5 Kapazitäts- und EC-Planung

Bei der Planung der Objektspeicherkapazität empfehlen wir Ihnen, basierend auf:

- Anfangsdatenmenge: Wie viele Daten planen Sie, auf einmal zu migrieren oder zu speichern? (z.B.: 500 TB)
- Datenwachstum: Tägliche/wöchentliche/monatliche Datenwachstumskapazität;
- Planungszyklus: Wie lange soll diese Hardware-Planung unterstützen? (empfohlen: 3 Jahre)
- Berücksichtigen Sie den Hardware-Iterations- und Update-Zyklus Ihres Unternehmens.

EC (Erasure Code) Planung ist wie folgt:

| Szenario | Empfohlener Prüflevel | Erklärung |
|  -  |  - |  - |
| Standard-Produktionsumgebung | EC:4 | Kann maximal 4 Datenträger (oder Knoten) Ausfälle tolerieren, bietet ein gutes Gleichgewicht zwischen Zuverlässigkeit und Speichereffizienz. |
| Hohe Verfügbarkeitsanforderungen | EC:4 - 8 | Oder höher, geeignet für Szenarien mit extrem hohen Datenverfügbarkeitsanforderungen, aber opfert mehr Speicherplatz. |
| Entwicklungs-/Testumgebung | EC:2 | Bietet grundlegende Redundanzschutz, geeignet für nicht-kritische Geschäfte. |

### 2.6 Datenträgerplanung

Da NFS bei hoher IO-Produktion Phantom-Schreib- und Sperrprobleme verursacht, ist es **verboten, NFS** als RustFS-Basisspeichermedium zu verwenden. Offiziell wird dringend empfohlen, den **JBOD (Just a Bunch of Disks)** Modus zu verwenden, d.h. einfache Datenträgerbündelung. Das bedeutet, physische Datenträger direkt und unabhängig dem Betriebssystem auszusetzen, wobei RustFS auf Software-Ebene für Datenredundanz und -schutz verantwortlich ist.

Die Gründe sind wie folgt:

- **Bessere Leistung:** RustFS's Erasure Coding-Engine ist hochoptimiert und kann direkt mehrere Datenträger parallel lesen und schreiben, was höheren Durchsatz als Hardware-RAID-Controller erreicht. Hardware-RAID wird zum Leistungsengpass.
- **Niedrigere Kosten:** Keine teuren RAID-Karten erforderlich, reduziert Hardware-Beschaffungskosten.
- **Einfachere Verwaltung:** Einheitliche Datenträgerverwaltung durch RustFS, vereinfacht Storage-Layer-Betrieb.
- **Schnellere Fehlerbehebung:** RustFS (Healing) Prozess ist schneller als traditioneller RAID-Rebuild und hat weniger Einfluss auf Cluster-Leistung.

Offiziell wird empfohlen, NVMe SSD als Speichermedium auf Datenträgern zu verwenden, um höhere Leistung und Durchsatz zu gewährleisten.

### 2.7 Dateisystemauswahl

RustFS offiziell empfiehlt dringend, auf allen für Speicher verwendeten Datenträgern das XFS-Dateisystem zu verwenden. RustFS-Entwicklung und -Tests basieren auf XFS und können beste Leistung und Stabilität gewährleisten. Es wird nicht empfohlen, andere Dateisysteme wie ext4, BTRFS oder ZFS zu verwenden, da sie zu Leistungsabfall oder unvorhersehbaren Problemen führen können.

RustFS ist ein Objektspeichersystem, das für hohe Parallelität und hohe Leistung entwickelt wurde. Wenn Clients große Objekte hochladen oder herunterladen, teilt RustFS sie in Chunks auf und liest/schreibt parallel zu mehreren Datenträgern im Erasure Set.

XFS-Vorteile: XFS (eXtents File System) wurde von Anfang an für hohe Leistung und Skalierbarkeit entwickelt. Es zeigt hervorragende Leistung bei der Verarbeitung großer Dateien und hoher paralleler I/O-Szenarien. Seine internen Logs und Datenstrukturen (wie B+-Bäume) können effizient große Mengen paralleler Lese-/Schreibanfragen verarbeiten, was perfekt mit dem RustFS-Arbeitsmodus übereinstimmt. Im Vergleich dazu, obwohl ext4 und andere Dateisysteme in den letzten Jahren große Leistungsverbesserungen hatten, kann XFS bei extremer paralleler Last normalerweise stabileren und überlegenen Durchsatz bieten.

Objektspeicher muss normalerweise massive Dateien und riesige einzelne Dateien (TB-Ebene) verarbeiten. XFS ist ein 64-Bit-Dateisystem, das extrem große Dateigrößen (bis zu 8 EB) und Dateisystemgrößen unterstützen kann. Seine Metadatenverwaltung ist sehr effizient, selbst wenn Millionen von Dateien in einem einzelnen Verzeichnis gespeichert werden, ist der Leistungsabfall viel kleiner als bei anderen Dateisystemen. Das ist entscheidend für RustFS's Art, jedes Objekt (oder Objektversion) als unabhängige Datei im Backend-Dateisystem zu speichern.

RustFS reserviert beim Schreiben neuer Objekte oder Objektversionen Platz, um Schreibleistung zu gewährleisten und Dateifragmente zu reduzieren. XFS bietet eine effiziente API namens fallocate, die es Anwendungen ermöglicht, einen zusammenhängenden Datenträgerbereich zu reservieren. RustFS nutzt diese Funktion, um den benötigten Platz für Dateien vor dem Schreiben zuzuweisen, vermeidet Leistungsaufwand durch dynamische Erweiterung und Metadaten-Updates während des Schreibprozesses und reduziert auch maximal die Produktion von Dateifragmenten, was nachfolgende Leseeistung gewährleistet.

Für bessere Datenträgererkennung empfehlen wir bei der XFS-Dateisystemformatierung die Verwendung von **Label**-Tags, um Datenträger zu markieren.

Zuerst müssen Sie die Datenträgersystem-Situation überprüfen:

```
sudo lsblk

NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 465.7G  0 disk
├─sda1        8:1    0   512M  0 part /boot/efi
└─sda2        8:2    0 465.2G  0 part /
nvme0n1           8:16   0   3.7T  0 disk  <-- wenn das unser neu zu formatierender Datenträger ist
nvme1n1           8:32   0   3.7T  0 disk  <-- wenn das unser neu zu formatierender Datenträger ist
nvme2n1          8:48   0   3.7T   0  disk
```

Der spezifische Formatierungsbefehl ist wie folgt:

```
sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

Wir können bei der Formatierung einige empfohlene Optionen hinzufügen, um die Leistung zu optimieren:

- -L \<label\>: Setzt einen Tag (Label) für das Dateisystem, bequem für nachfolgende Erkennung und Einbindung.
- -i size=512: RustFS offiziell empfiehlt, die Inode-Größe auf 512 Bytes zu setzen, was für Szenarien mit vielen kleinen Objekten (Metadaten) Leistungsvorteile hat.
- -n ftype=1: Aktiviert die ftype-Funktion. Das ermöglicht dem Dateisystem, Dateitypen in der Verzeichnisstruktur zu protokollieren, kann die Leistung von Operationen wie readdir und unlink verbessern, was für RustFS sehr vorteilhaft ist.

Einbindung:

```
# neue Zeile schreiben
vim /etc/fstab
LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0

#speichern & beenden

# Datenträger einbinden
sudo mount -a
```

## III. Benutzernamen konfigurieren

Für den RustFS-Start empfehlen wir Ihnen, einen speziellen Benutzer ohne Anmeldeberechtigungen zu konfigurieren, um den RustFS-Dienst zu starten. Im rustfs.service-Startsteuerungsskript.

1. **Standard-Startkonto nicht ändern**: Der Standard-Benutzer und die Standard-Gruppe sind `root` und `root`. Wenn Sie den Standard `root` und `root` verwenden möchten, müssen Sie nichts ändern.
2. **Standard-Startkonto ändern**: Sie können groupadd und useradd Befehle verwenden, um Benutzer und Gruppen zu erstellen, und nach dem Hinzufügen den Benutzernamen und das Passwort in der systemctl-Startkonfigurationsdatei ändern.

Das folgende Beispiel ist die Änderung der Erstellung von Benutzer, Gruppe und das Setzen von Berechtigungen für den Zugriff auf das von RustFS angegebene Datenverzeichnis (optional):

```
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

Hinweise:

- Wenn rustfs-user Benutzer und Gruppe erstellt wurden, müssen Sie User und Group in `/etc/systemd/system/rustfs.service` zu `rustfs-user` ändern;
- Passen Sie `/data/rustfs*` an das angegebene Einbindungsverzeichnis an.

## IV. Installationspaket herunterladen

Bitte installieren Sie zuerst wget oder curl, um das rustfs-Installationspaket herunterzuladen.

```bash
# Download-Adresse
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
unzip rustfs-linux-x86_64-musl-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

### V. Umgebungsvariablen konfigurieren

1. Konfigurationsdatei erstellen

```bash
# Einzelmaschine-Einzeldatenträger-Modus
sudo tee /etc/default/rustfs <<EOF
RUSTFS_ACCESS_KEY=rustfsadmin
RUSTFS_SECRET_KEY=rustfsadmin
RUSTFS_VOLUMES="/data/rustfs0"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ENABLE=true
RUST_LOG=error
RUSTFS_OBS_LOG_DIRECTORY="/var/logs/rustfs/"
EOF
```

2. Speicherverzeichnis erstellen

```bash
sudo mkdir -p /data/rustfs0 /var/logs/rustfs /opt/tls
sudo chmod -R 750 /data/rustfs* /var/logs/rustfs
```

### VII. Systemdienst konfigurieren

1. systemd-Dienstdatei erstellen

```bash
sudo tee /etc/systemd/system/rustfs.service <<EOF
[Unit]
Description=RustFS Object Storage Server
Documentation=https://rustfs.com/docs/
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
NotifyAccess=main
User=root
Group=root

WorkingDirectory=/usr/local
EnvironmentFile=-/etc/default/rustfs
ExecStart=/usr/local/bin/rustfs \$RUSTFS_VOLUMES

LimitNOFILE=1048576
LimitNPROC=32768
TasksMax=infinity

Restart=always
RestartSec=10s

OOMScoreAdjust=-1000
SendSIGKILL=no

TimeoutStartSec=30s
TimeoutStopSec=30s

NoNewPrivileges=true
ProtectSystem=full
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectClock=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
RestrictRealtime=true

# service log configuration
StandardOutput=append:/var/logs/rustfs/rustfs.log
StandardError=append:/var/logs/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

2. Dienstkonfiguration neu laden

```bash
sudo systemctl daemon-reload
```

### VIII. Dienst starten und verifizieren

1. Dienst starten und Autostart einrichten

```bash
sudo systemctl enable --now rustfs
```

2. Dienststatus verifizieren

```bash
systemctl status rustfs
```

3. Dienstport überprüfen

```bash
netstat -ntpl
```

4. Logdateien anzeigen

```bash
tail -f /var/logs/rustfs/rustfs*.log
```

5. Auf Verwaltungskonsole zugreifen

Geben Sie die IP-Adresse und den Port des Servers ein, versuchen Sie, auf die Verwaltungskonsole zuzugreifen. Die angezeigte Oberfläche ist wie folgt:

![Console](./images/console.jpg)
