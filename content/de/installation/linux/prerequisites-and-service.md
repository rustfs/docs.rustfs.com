---
title: "Linux-Voraussetzungen und Diensteinrichtung"
description: "Diese Seite beschreibt die gemeinsamen Voraussetzungen, die Datenträgervorbereitung, die Installation der Binärdatei und die Einrichtung des systemd-Dienstes für alle Linux-Bereitstellungsmodi von RustFS."
---

Diese Seite enthält die gemeinsamen Voraussetzungen und die Schritte zur Diensteinrichtung für alle drei Linux-Bereitstellungsmodi — [SNSD](./single-node-single-disk.md), [SNMD](./single-node-multiple-disk.md) und [MNMD](./multiple-node-multiple-disk.md). Schließen Sie diese Schritte zuerst ab und kehren Sie anschließend zur Seite Ihres Modus zurück, um die Umgebungsdatei zu konfigurieren und den Dienst zu starten.

## Betriebssystemversion

Wir empfehlen den Linux-Kernel 4.x oder neuer; die Versionen 5.x und 6.x erreichen einen höheren I/O-Durchsatz und eine bessere Netzwerkleistung. Ubuntu 22.04 und RHEL 8.x eignen sich beide für die Installation von RustFS.

## Firewall

Linux-Systeme haben die Firewall standardmäßig aktiviert. Prüfen Sie den Firewall-Status mit:

```bash
systemctl status firewalld
```

Wenn der Firewall-Status „active“ ist, können Sie die Firewall deaktivieren:

```bash
systemctl stop firewalld
systemctl disable firewalld
```

Oder geben Sie den S3-Port von RustFS (9000) und den Console-Port (9001) frei:

```bash
firewall-cmd --zone=public --add-port=9000/tcp --permanent
firewall-cmd --zone=public --add-port=9001/tcp --permanent
firewall-cmd --reload
```

Alle RustFS-Server einer Bereitstellung **müssen** denselben Port verwenden. Wenn Sie Port 9000 verwenden, muss jeder andere Server ebenfalls Port 9000 verwenden.

## Arbeitsspeicher

RustFS benötigt mindestens 2 GB Arbeitsspeicher für eine Testumgebung; Produktionsumgebungen benötigen mindestens 128 GB Arbeitsspeicher.

## Zeitsynchronisation

Alle Knoten in einer verteilten RustFS-Bereitstellung **müssen** synchronisierte Uhren haben. RustFS ist auf Zeitstempel für Anfragesignaturen, Objektversionierung, verteilte Sperren (Locks) und Replikation angewiesen. Eine erhebliche Uhrenabweichung zwischen Knoten kann Folgendes verursachen:

- **Fehler bei Anfragesignaturen** — Die Prüfung der S3-Signatur hängt von genauen Zeitstempeln ab.
- **Replikations- und Konsistenzprobleme** — Uhrenversatz kann zu veralteten oder widersprüchlichen Objektversionen führen.
- **Sperrkonflikte** — Verteilte Sperren (Locks) verwenden Zeitstempel für den Ablauf der Lease.
- **Fehler beim Starten des Dienstes** — RustFS verweigert den Start, wenn der Uhrenversatz zwischen den Knoten die sicheren Schwellenwerte überschreitet.

:::warning

Die Uhrenabweichung zwischen zwei beliebigen Knoten sollte **15 Minuten** nicht überschreiten. Für Produktionsumgebungen empfehlen wir, die Abweichung unter **1 Sekunde** zu halten.

:::

### Empfohlene NTP-Werkzeuge

Verwenden Sie auf **jedem** Knoten einen der folgenden Zeitsynchronisationsdienste. Wählen Sie ein Werkzeug und konfigurieren Sie es einheitlich in der gesamten Bereitstellung.

#### chrony (empfohlen)

`chrony` ist die bevorzugte NTP-Implementierung für moderne Linux-Distributionen. Es synchronisiert schneller und kommt mit unterbrochener Netzwerkverbindung besser zurecht als das ältere `ntpd`.

Installieren Sie chrony:

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install chrony -y

# Ubuntu / Debian
sudo apt install chrony -y
```

Bearbeiten Sie die Konfigurationsdatei `/etc/chrony.conf` (RHEL) oder `/etc/chrony/chrony.conf` (Debian/Ubuntu) und tragen Sie Ihre bevorzugten NTP-Server ein:

```ini
server time1.google.com iburst
server time2.google.com iburst
server time3.google.com iburst
server time4.google.com iburst
```

> Ersetzen Sie die Serveradressen durch die internen NTP-Server Ihrer Organisation, falls vorhanden. `iburst` beschleunigt die Erstsynchronisation.

Aktivieren und starten Sie den Dienst:

```bash
sudo systemctl enable chronyd
sudo systemctl start chronyd
```

#### systemd-timesyncd

`systemd-timesyncd` ist ein leichtgewichtiger SNTP-Client, der in systemd-basierten Distributionen enthalten ist. Er eignet sich für Umgebungen, in denen kein vollständiger NTP-Daemon erforderlich ist.

Bearbeiten Sie `/etc/systemd/timesyncd.conf`, um NTP-Server zu konfigurieren:

```ini
[Time]
NTP=time1.google.com time2.google.com time3.google.com time4.google.com
FallbackNTP=0.pool.ntp.org 1.pool.ntp.org
```

Aktivieren und starten Sie den Dienst:

```bash
sudo timedatectl set-ntp true
sudo systemctl enable systemd-timesyncd
sudo systemctl start systemd-timesyncd
```

#### ntpd (veraltet)

Der klassische `ntpd` aus der NTP-Referenzimplementierung ist noch weit verbreitet. Verwenden Sie `chrony`, es sei denn, Ihre Umgebung erfordert ausdrücklich `ntpd`.

```bash
# RHEL / CentOS / Rocky Linux
sudo dnf install ntp -y

# Ubuntu / Debian
sudo apt install ntp -y
```

Bearbeiten Sie `/etc/ntp.conf`, legen Sie die NTP-Server fest und aktivieren und starten Sie den Dienst anschließend:

```bash
sudo systemctl enable ntpd
sudo systemctl start ntpd
```

### Zeitsynchronisation prüfen

Nachdem Sie den NTP-Dienst konfiguriert haben, prüfen Sie die Synchronisation auf jedem Knoten.

Prüfen Sie den Status der Systemuhr:

```bash
timedatectl status
```

Die Ausgabe sollte `System clock synchronized: yes` und `NTP service: active` anzeigen.

Für `chrony` prüfen Sie den detaillierten Synchronisationsstatus mit dem folgenden Befehl:

```bash
chronyc tracking
```

Wichtige Felder:

- **Leap status** — Sollte `Normal` sein (nicht `Not synchronised`).
- **System time** — Der Offset zum Referenzserver. Sollte nahe bei `0.000000000 seconds` liegen.
- **Root delay** — Laufzeit zum Referenzserver und zurück.

Listen Sie die aktuellen NTP-Quellen und deren Status auf:

```bash
chronyc sources -v
```

Spalten, auf die Sie achten sollten:

- **`*`** — Die aktuell gewählte Synchronisationsquelle.
- **`+`** — Weitere akzeptable Quellen.
- **`-`** — Vom Auswahlalgorithmus abgelehnte Quellen.
- **`?`** — Quellen, deren Konnektivität unklar ist.

Für `ntpd`:

```bash
ntpq -p
```

### Uhrensynchronität im Cluster prüfen

Nachdem alle Knoten synchronisiert sind, prüfen Sie, ob die Uhren im Cluster übereinstimmen. Vergleichen Sie die Zeitstempel auf jedem Knoten:

```bash
# Run on each node and compare the output
date -u '+%Y-%m-%d %H:%M:%S'
```

Für einen genaueren Vergleich installieren Sie `sshpass` und führen Folgendes aus:

```bash
for host in node1 node2 node3 node4; do
  echo -n "$host: "
  ssh "$host" date -u '+%Y-%m-%d %H:%M:%S.%N'
done
```

Der Unterschied zwischen zwei beliebigen Knoten sollte vernachlässigbar sein (in einer korrekt konfigurierten Umgebung unter 1 Millisekunde).

## Kapazitätsplanung

Bei der Planung der Objektspeicherkapazität empfehlen wir, Folgendes zu berücksichtigen:

- Anfangsdatenmenge: Wie viele Daten wollen Sie auf einmal migrieren oder speichern? (zum Beispiel 500 TB)
- Datenzuwachs: tägliche, wöchentliche oder monatliche Zunahme
- Planungshorizont: Wie lange soll diese Hardwareplanung tragen? (empfohlen: 3 Jahre)
- Die Erneuerungs- und Aktualisierungszyklen der Hardware in Ihrem Unternehmen

Lesen Sie die [EC-Konfiguration](../requirement/ec-configuration.md), um die nutzbare Kapazität zu berechnen, die automatischen Parity-Standardwerte zu verstehen und eine ausdrücklich gesetzte Parity oder die Breite des Erasure-Sets vor der Bereitstellung zu prüfen.

## Datenträgerplanung

Weil NFS bei hoher I/O-Last Phantom-Schreibvorgänge und Sperrprobleme erzeugt, ist **NFS** als zugrunde liegendes Speichermedium für RustFS **untersagt**. Wir empfehlen nachdrücklich den Modus **JBOD (Just a Bunch of Disks)**: Stellen Sie physische Datenträger dem Betriebssystem direkt und unabhängig bereit und überlassen Sie der Softwareschicht von RustFS Redundanz und Schutz der Daten.

Die Gründe dafür sind:

- **Höhere Leistung:** Die Erasure-Coding-Engine von RustFS ist stark optimiert und liest und schreibt mehrere Datenträger gleichzeitig. Sie erreicht damit einen höheren Durchsatz als Hardware-RAID-Controller. Hardware-RAID wird zum Leistungsengpass.
- **Geringere Kosten:** Teure RAID-Controller sind nicht erforderlich, die Beschaffungskosten sinken.
- **Einfachere Verwaltung:** RustFS verwaltet die Datenträger einheitlich und vereinfacht Betrieb und Wartung der Speicherschicht.
- **Schnellere Wiederherstellung nach Ausfällen:** Der Healing-Prozess von RustFS (Datenwiederherstellung) ist schneller als ein klassischer RAID-Rebuild und beeinträchtigt die Cluster-Leistung weniger.

Wir empfehlen NVMe-SSDs als Speichermedium, wenn Sie höhere Leistung und höheren Durchsatz benötigen.

## Auswahl des Dateisystems

RustFS empfiehlt nachdrücklich, alle Speicherdatenträger mit dem Dateisystem XFS zu formatieren. Entwicklung und Tests von RustFS basieren auf XFS und sind auf hohe Leistung und Stabilität ausgelegt. Vermeiden Sie andere Dateisysteme wie ext4, BTRFS oder ZFS, weil sie die Leistung mindern oder unvorhersehbares Verhalten verursachen können.

XFS passt aus drei Gründen zur Arbeitslast von RustFS:

- **Hohe I/O-Parallelität:** XFS ist auf hohe Leistung und Skalierbarkeit ausgelegt. Journaling und interne Datenstrukturen (etwa B+-Bäume) verarbeiten viele parallele Lese- und Schreibvorgänge effizient. Das entspricht der Arbeitsweise von RustFS, große Objekte aufzuteilen und mehrere Datenträger eines Erasure-Sets parallel zu lesen und zu schreiben.
- **Sehr große Dateien und Dateimengen:** XFS ist ein 64-Bit-Dateisystem und unterstützt extrem große Dateien (bis 8 EB). Die Metadatenverwaltung bleibt auch bei Millionen von Dateien in einem Verzeichnis effizient. Das ist wichtig, weil RustFS jedes Objekt (oder jede Objektversion) als eigene Datei speichert.
- **Speicherreservierung:** XFS stellt eine effiziente `fallocate`-API bereit. RustFS reserviert damit zusammenhängenden Speicherplatz, bevor es Objekte schreibt. Das vermeidet den Aufwand dynamischer Erweiterung und von Metadatenaktualisierungen während des Schreibens und begrenzt die Dateifragmentierung.

Zur besseren Datenträgererkennung empfehlen wir, XFS-Dateisysteme mit **Label**-Kennzeichnungen zu formatieren.

Prüfen Sie zuerst das Datenträgerlayout:

```bash
sudo lsblk

NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 465.7G  0 disk
├─sda1        8:1    0   512M  0 part /boot/efi
└─sda2        8:2    0 465.2G  0 part /
nvme0n1           8:16   0   3.7T  0 disk  <-- if this is our format new disk
nvme1n1           8:32   0   3.7T  0 disk  <-- if this is our format new disk
nvme2n1          8:48   0   3.7T   0  disk
```

Formatieren Sie jeden Speicherdatenträger:

```bash
sudo mkfs.xfs  -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

Formatierungsoptionen:

- `-L <label>`: Setzt eine Kennzeichnung des Dateisystems, damit Sie es leichter erkennen und einhängen können.
- `-i size=512`: Wir empfehlen eine Inode-Größe von 512 Byte. Das ist vorteilhaft, wenn Sie viele kleine Objekte (Metadaten) speichern.
- `-n ftype=1`: Aktiviert ftype, damit das Dateisystem Dateitypen in den Verzeichnisstrukturen speichert. Das beschleunigt Operationen wie readdir und unlink.

Einhängen:

```bash
# write new line
vim /etc/fstab
LABEL=RUSTFS0 /data/rustfs0   xfs   defaults,noatime,nodiratime   0   0

#save & exit

# mount disk
sudo mount -a
```

## Dienstbenutzer konfigurieren

Wir empfehlen, RustFS als dedizierten Benutzer ohne Anmeldeberechtigung auszuführen.

1. **Standardkonto beibehalten:** Benutzer und Gruppe in der Service-Unit sind standardmäßig `root` und `root`. Wenn Sie dabei bleiben, ist keine Änderung nötig.
2. **Dediziertes Konto verwenden:** Legen Sie einen Benutzer und eine Gruppe an und passen Sie die Service-Unit entsprechend an.

Das folgende Beispiel legt Benutzer und Gruppe an und erteilt Zugriff auf die RustFS-Datenverzeichnisse (optional):

```bash
groupadd -r rustfs-user
useradd -M -r -g rustfs-user rustfs-user
chown rustfs-user:rustfs-user  /data/rustfs*
```

:::note

- Wenn Sie den Benutzer und die Gruppe `rustfs-user` angelegt haben, setzen Sie `User` und `Group` in `/etc/systemd/system/rustfs.service` auf `rustfs-user`.
- Passen Sie `/data/rustfs*` an Ihre tatsächlichen Einhängeverzeichnisse an.

:::

## Installationspaket herunterladen

Installieren Sie zuerst wget oder curl, laden Sie anschließend die RustFS-Binärdatei herunter und installieren Sie sie:

```bash
# Download address
wget https://dl.rustfs.com/artifacts/rustfs/release/rustfs-linux-x86_64-musl-latest.zip
unzip rustfs-linux-x86_64-musl-latest.zip
chmod +x rustfs
mv rustfs /usr/local/bin/
```

## systemd-Dienst konfigurieren

1. Legen Sie die systemd-Dienstdatei an

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

TimeoutStartSec=120s
TimeoutStopSec=30s

NoNewPrivileges=true
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
StandardOutput=append:/var/log/rustfs/rustfs.log
StandardError=append:/var/log/rustfs/rustfs-err.log

[Install]
WantedBy=multi-user.target
EOF
```

Der Dienst liest `RUSTFS_VOLUMES` und die übrigen Einstellungen aus `/etc/default/rustfs`. Der Inhalt hängt vom Bereitstellungsmodus ab; die Seite Ihres Modus zeigt den genauen Inhalt.

2. Laden Sie die Dienstkonfiguration neu

```bash
sudo systemctl daemon-reload
```

## Nächste Schritte

Kehren Sie zur Seite Ihres Bereitstellungsmodus zurück, um die Umgebungsdatei zu konfigurieren und den Dienst zu starten:

- [Einzelner Knoten mit einem Datenträger (SNSD)](./single-node-single-disk.md)
- [Einzelner Knoten mit mehreren Datenträgern (SNMD)](./single-node-multiple-disk.md)
- [Mehrere Knoten mit mehreren Datenträgern (MNMD)](./multiple-node-multiple-disk.md)
