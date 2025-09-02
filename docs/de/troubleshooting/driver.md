---
title: "Festplattenfehler"
description: "RustFS gewährleistet durch ähnliche Löschkodierungsmechanismen, dass Lese-/Schreibzugriff auch bei partiellen Festplattenfehlern bereitgestellt wird und Daten nach dem Austausch der Festplatte automatisch geheilt werden."
---

# RustFS Festplattenfehler-Fehlerbehebungsleitfaden

RustFS gewährleistet durch ähnliche Löschkodierungsmechanismen, dass Lese-/Schreibzugriff auch bei partiellen Festplattenfehlern bereitgestellt wird und Daten nach dem Austausch der Festplatte automatisch geheilt werden.

## Inhaltsverzeichnis

1. [Fehlerhafte Festplatte aushängen](#fehlerhafte-festplatte-aushängen)
2. [Fehlerhafte Festplatte austauschen](#fehlerhafte-festplatte-austauschen)
3. [`/etc/fstab` oder RustFS-Konfiguration aktualisieren](#etcfstab-oder-rustfs-konfiguration-aktualisieren)
4. [Neue Festplatte neu einhängen](#neue-festplatte-neu-einhängen)
5. [Datenheilung auslösen und überwachen](#datenheilung-auslösen-und-überwachen)
6. [Nachfolgende Überprüfungen und Überlegungen](#nachfolgende-überprüfungen-und-überlegungen)

<a id="fehlerhafte-festplatte-aushängen"></a>

### Fehlerhafte Festplatte aushängen

Vor dem Austausch der physischen Festplatte muss die fehlerhafte Festplatte zunächst auf Betriebssystemebene sicher ausgehängt werden, um I/O-Fehler im Dateisystem oder RustFS während des Austauschprozesses zu vermeiden.

```bash
# Angenommen, die fehlerhafte Festplatte ist /dev/sdb
umount /dev/sdb
```

> **Hinweis**
>
> * Wenn mehrere Einhängepunkte vorhanden sind, führen Sie `umount` für jeden aus.
> * Falls "Gerät ist beschäftigt" auftritt, können Sie zunächst den RustFS-Service stoppen:
>
> ```bash
> systemctl stop rustfs
> ```
>

<a id="fehlerhafte-festplatte-austauschen"></a>

### Fehlerhafte Festplatte austauschen

Nach dem physischen Austausch der fehlerhaften Festplatte muss die neue Festplatte partitioniert und formatiert werden und mit dem gleichen Label wie die ursprüngliche Festplatte versehen werden.

```bash
# Als ext4 formatieren und mit Label DISK1 versehen (muss dem ursprünglichen Label entsprechen)
mkfs.ext4 /dev/sdb -L DISK1
```

<a id="etcfstab-oder-rustfs-konfiguration-aktualisieren"></a>

### `/etc/fstab` oder RustFS-Konfiguration aktualisieren

Stellen Sie sicher, dass die neue Festplatte in `/etc/fstab` oder der RustFS-Konfiguration korrekt konfiguriert ist.

```bash
# Überprüfen Sie /etc/fstab
cat /etc/fstab

# Beispiel-Eintrag:
# LABEL=DISK1 /mnt/disk1 ext4 defaults 0 2
```

<a id="neue-festplatte-neu-einhängen"></a>

### Neue Festplatte neu einhängen

Hängen Sie die neue Festplatte in das Dateisystem ein:

```bash
# Festplatte einhängen
mount /dev/sdb /mnt/disk1

# Überprüfen Sie den Einhängepunkt
df -h /mnt/disk1
```

<a id="datenheilung-auslösen-und-überwachen"></a>

### Datenheilung auslösen und überwachen

Nach dem Einbau der neuen Festplatte starten Sie RustFS und überwachen den Heilungsprozess:

```bash
# RustFS-Service starten
systemctl start rustfs

# Heilungsstatus überwachen
rustfs admin heal status

# Detaillierte Heilungsinformationen
rustfs admin heal info
```

<a id="nachfolgende-überprüfungen-und-überlegungen"></a>

### Nachfolgende Überprüfungen und Überlegungen

1. **Überprüfen Sie den Heilungsfortschritt**:

   ```bash
   # Heilungsfortschritt überwachen
   watch -n 5 'rustfs admin heal status'
   ```

2. **Überprüfen Sie die Festplattenintegrität**:

   ```bash
   # Festplattenstatus überprüfen
   rustfs admin info
   ```

3. **Überprüfen Sie die Systemprotokolle**:

   ```bash
   # RustFS-Protokolle überprüfen
   journalctl -u rustfs -f
   ```

## Häufige Probleme und Lösungen

### Problem: "Gerät ist beschäftigt"

**Lösung**: Stoppen Sie RustFS vor dem Aushängen:

```bash
systemctl stop rustfs
umount /dev/sdb
```

### Problem: Heilung startet nicht automatisch

**Lösung**: Manuell Heilung auslösen:

```bash
rustfs admin heal start
```

### Problem: Neue Festplatte wird nicht erkannt

**Lösung**: Überprüfen Sie die Hardware-Verbindung und das Label:

```bash
# Festplatten auflisten
lsblk

# Label überprüfen
blkid /dev/sdb
```

## Best Practices

1. **Regelmäßige Überwachung**: Überwachen Sie den Festplattenstatus regelmäßig
2. **Proaktive Wartung**: Ersetzen Sie Festplatten vor dem vollständigen Ausfall
3. **Backup-Strategien**: Implementieren Sie angemessene Backup-Strategien
4. **Dokumentation**: Dokumentieren Sie alle Wartungsaktivitäten

## Zusammenfassung

RustFS bietet robuste Mechanismen zur Behandlung von Festplattenfehlern:

* ✅ **Automatische Heilung**: Daten werden automatisch nach Festplattenaustausch geheilt
* ✅ **Kontinuierlicher Betrieb**: System bleibt auch bei Festplattenfehlern betriebsbereit
* ✅ **Einfache Wartung**: Standardisierte Verfahren für Festplattenaustausch
* ✅ **Überwachung**: Umfassende Tools zur Überwachung des Heilungsprozesses

Durch Befolgen dieser Schritte können Sie Festplattenfehler effektiv beheben und die Datenintegrität in Ihrem RustFS-Cluster aufrechterhalten.
