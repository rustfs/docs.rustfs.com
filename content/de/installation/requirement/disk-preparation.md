---
title: "Datenträgervorbereitung"
description: "Diese Seite beschreibt, wie Sie dedizierte Speicherdatenträger vor der Installation von RustFS unter Linux identifizieren, formatieren, einhängen und prüfen."
---

Bereiten Sie jeden RustFS-Speicherdatenträger als eigenständiges XFS-Dateisystem mit stabilem Label und stabilem Einhängepunkt vor. Führen Sie diese Schritte auf jedem Linux-Knoten aus, bevor Sie `RUSTFS_VOLUMES` konfigurieren.

:::warning[Das Formatieren zerstört Daten]

Der Befehl `mkfs.xfs` löscht das ausgewählte Gerät. Bestätigen Sie den Gerätenamen, sichern Sie Daten, die Sie behalten müssen, und stellen Sie sicher, dass das Betriebssystem den Datenträger nicht verwendet, bevor Sie fortfahren.

:::

## 1. Die Speicherdatenträger identifizieren

Listen Sie Blockgeräte, Dateisysteme, Labels und aktuelle Einhängepunkte auf:

```bash
sudo lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,UUID,MOUNTPOINTS
```

Wählen Sie nur dedizierte Speicherdatenträger. Formatieren Sie weder den Datenträger des Betriebssystems noch ein Gerät, das Daten enthält, die Sie behalten müssen.

## 2. Einen Datenträger mit XFS formatieren

Das folgende Beispiel bereitet `/dev/sdb` vor und weist das Label `RUSTFS0` zu. Ersetzen Sie den Gerätenamen passend zu Ihrer Umgebung und verwenden Sie für jeden Datenträger ein eindeutiges Label.

```bash
sudo mkfs.xfs -f -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

Wiederholen Sie den Befehl für weitere Datenträger mit Labels wie `RUSTFS1`, `RUSTFS2` und `RUSTFS3`.

## 3. Einen dauerhaften Einhängepunkt anlegen

Legen Sie den Einhängepunkt an:

```bash
sudo mkdir -p /data/rustfs0
```

Fügen Sie einen Eintrag in `/etc/fstab` hinzu, damit der Datenträger nach einem Neustart über sein stabiles Dateisystem-Label eingehängt wird:

```ini title="/etc/fstab"
LABEL=RUSTFS0 /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

Wir empfehlen für eine zuverlässigere Geräteauswahl, über die UUID des Dateisystems einzuhängen. Eine UUID identifiziert das Dateisystem eindeutig und verhindert, dass der falsche Datenträger eingehängt wird, wenn Labels doppelt vorkommen oder sich die Linux-Gerätenamen ändern. Rufen Sie die UUID nach dem Formatieren ab:

```bash
sudo blkid -s UUID -o value /dev/sdb
```

Ersetzen Sie `<filesystem-uuid>` durch den zurückgegebenen Wert und verwenden Sie diesen Eintrag anstelle des `LABEL`-Eintrags oben:

```ini title="/etc/fstab"
UUID=<filesystem-uuid> /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

Hängen Sie alle Einträge ein und bestätigen Sie das Ergebnis:

```bash
sudo mount -a
findmnt /data/rustfs0
```

Legen Sie bei mehreren Datenträgern für jede Dateisystem-UUID einen Einhängepunkt und einen Eintrag in `/etc/fstab` an.

## 4. Die vorbereiteten Datenträger prüfen

Bestätigen Sie, dass jeder erwartete Einhängepunkt XFS verwendet und ausreichend freien Speicherplatz bietet:

```bash
df -hT /data/rustfs0
sudo xfs_info /data/rustfs0
```

Verwenden Sie die geprüften Einhängepfade, wenn Sie `RUSTFS_VOLUMES` konfigurieren. Halten Sie Labels und Einhängepfade der Datenträger in einer verteilten Bereitstellung auf allen Knoten einheitlich.

## Nächste Schritte

- [Bereitstellungstopologie auswählen](/de/installation#deployment-mode-comparison)
- [Mit Linux-Voraussetzungen und Diensteinrichtung fortfahren](/de/installation/linux/prerequisites-and-service)
