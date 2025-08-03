---
title: "Festplattenfehler"
description: "RustFS gewährleistet durch einen ähnlichen Mechanismus wie Erasure Coding weiterhin Lese-/Schreibzugriff bei teilweisen Festplattenausfällen und heilt Daten automatisch nach dem Festplattenwechsel."
---

# Festplattenfehler

RustFS gewährleistet durch einen ähnlichen Mechanismus wie Erasure Coding weiterhin Lese-/Schreibzugriff bei teilweisen Festplattenausfällen und heilt Daten automatisch nach dem Festplattenwechsel.

---

### Inhaltsverzeichnis

1. [Defekte Festplatte aushängen](#1-defekte-festplatte-aushängen)
2. [Defekte Festplatte ersetzen](#2-defekte-festplatte-ersetzen)
3. [`/etc/fstab` oder RustFS-Konfiguration aktualisieren](#3-etcfstab-oder-rustfs-konfiguration-aktualisieren)
4. [Neue Festplatte wieder einhängen](#4-neue-festplatte-wieder-einhängen)
5. [Datenheilung auslösen und überwachen](#5-datenheilung-auslösen-und-überwachen)
6. [Nachfolgende Überprüfungen und Hinweise](#6-nachfolgende-überprüfungen-und-hinweise)

---

### 1) Defekte Festplatte aushängen

Bevor die physische Festplatte ersetzt wird, muss die defekte Festplatte zunächst sicher auf Betriebssystemebene ausgehängt werden, um I/O-Fehler im Dateisystem oder RustFS während des Austauschprozesses zu vermeiden.

```bash
# Angenommen, die defekte Festplatte ist /dev/sdb
umount /dev/sdb
```

> **Erklärung**
>
> * Bei mehreren Einhängepunkten führen Sie `umount` für jeden aus.
> * Bei einem "Gerät beschäftigt"-Fehler stoppen Sie zuerst den RustFS-Service:
>
> ```bash
> systemctl stop rustfs
> ```

---

### 2) Defekte Festplatte ersetzen

Nach dem physischen Austausch der defekten Festplatte muss die neue Festplatte partitioniert und formatiert werden, mit demselben Label wie die ursprüngliche Festplatte.

```bash
# Als ext4 formatieren und Label DISK1 setzen (muss dem ursprünglichen Label entsprechen)
mkfs.ext4 /dev/sdb -L DISK1
```

> **Anforderungen**
>
> * Kapazität der neuen Festplatte ≥ Kapazität der ursprünglichen Festplatte
> * Dateisystemtyp konsistent mit anderen Festplatten halten
> * Es wird empfohlen, Label (LABEL) oder UUID für das Einhängen zu verwenden, damit die Festplattenreihenfolge nicht durch Systemneustart beeinflusst wird

---

### 3) `/etc/fstab` oder RustFS-Konfiguration aktualisieren

Bestätigen Sie, dass die Labels oder UUIDs der Einhängeeinträge in `/etc/fstab` auf die neue Festplatte zeigen. Bei Verwendung einer RustFS-spezifischen Konfigurationsdatei (wie `config.yaml`) müssen auch die entsprechenden Einträge synchron aktualisiert werden.

```bash
# Aktuelle fstab überprüfen
cat /etc/fstab

# Beispiel fstab-Eintrag (keine Änderung nötig bei gleichem Label)
LABEL=DISK1 /mnt/disk1 ext4 defaults,noatime 0 2
```

> **Tipp**
>
> * Bei Verwendung von UUID:
>
> ```bash
> blkid /dev/sdb
> # UUID der neuen Partition abrufen, dann entsprechendes Feld in fstab ersetzen
> ```
> * Nach fstab-Änderung unbedingt Syntax prüfen:
>
> ```bash
> mount -a # Wenn kein Fehler, ist die Konfiguration korrekt
> ```

---

### 4) Neue Festplatte wieder einhängen

Führen Sie die folgenden Befehle aus, um alle Festplatten stapelweise einzuhängen und den RustFS-Service zu starten:

```bash
mount -a
systemctl start rustfs
```

Bestätigen Sie, dass alle Festplatten normal eingehängt sind:

```bash
df -h | grep /mnt/disk
```

> **Achtung**
>
> * Wenn einige Einhängungen fehlschlagen, überprüfen Sie, ob fstab-Einträge und Festplatten-Labels/UUIDs übereinstimmen.

---

### 5) Datenheilung auslösen und überwachen

Nach Erkennung der neuen Festplatte löst RustFS automatisch oder manuell den Datenheilungsprozess (heal) aus. Hier ist ein Beispiel mit dem hypothetischen `rustfs-admin`-Tool:

```bash
# Aktuellen Festplattenstatus überprüfen
rustfs-admin disk status

# Heilung der neuen Festplatte manuell auslösen
rustfs-admin heal --disk /mnt/disk1

# Heilungsfortschritt in Echtzeit verfolgen
rustfs-admin heal status --follow
```

Gleichzeitig können Sie die Service-Logs überprüfen, um zu bestätigen, dass das System erkannt und mit der Datenwiederherstellung begonnen hat:

```bash
# Für systemd-verwaltete Installation
journalctl -u rustfs -f

# Oder dedizierte Log-Datei überprüfen
tail -f /var/log/rustfs/heal.log
```

> **Erklärung**
>
> * Der Heilungsprozess wird im Hintergrund abgeschlossen, normalerweise mit minimaler Auswirkung auf Online-Zugriff
> * Nach Abschluss der Heilung meldet das Tool Erfolg oder listet fehlgeschlagene Objekte auf

---

### 6) Nachfolgende Überprüfungen und Hinweise

1. **Leistungsüberwachung**

   * Während der Heilung können I/O leicht schwanken, es wird empfohlen, Festplatten- und Netzwerklast zu überwachen.

2. **Stapelausfälle**

   * Wenn derselbe Festplattenstapel mehrere Ausfälle aufweist, sollten häufigere Hardware-Inspektionen in Betracht gezogen werden.

3. **Regelmäßige Übungen**

   * Führen Sie regelmäßig Simulationen von Festplattenausfällen durch, um sicherzustellen, dass das Team mit dem Wiederherstellungsprozess vertraut ist.

4. **Wartungsfenster**

   * Bei hohen Ausfallraten planen Sie ein dediziertes Wartungsfenster, um Austausch und Heilung zu beschleunigen.

