---
title: "Laufwerksausfälle"
description: "Ersetzen Sie ein ausgefallenes Laufwerk in einer RustFS-Bereitstellung und lassen Sie RustFS die Daten automatisch wiederherstellen."
---

RustFS verwendet Erasure Coding, damit Daten lesbar und schreibbar bleiben, wenn einzelne Laufwerke ausfallen. Nachdem Sie ein ausgefallenes Laufwerk ersetzt haben, stellt RustFS die fehlenden Daten automatisch darauf wieder her (Healing).

<a id="unmount-failed-disk"></a>

### Ausgefallenes Laufwerk aushängen

Hängen Sie das ausgefallene Laufwerk auf Betriebssystemebene aus, bevor Sie die physische Festplatte ersetzen. So vermeiden Sie I/O-Fehler im Dateisystem oder in RustFS während des Austauschs.

```bash
sudo umount /data/rustfs0
```

:::note[Hinweise]

* Wenn das Laufwerk mehrere Einhängepunkte hat, führen Sie `umount` für jeden aus.
* Wenn Sie den Fehler „device is busy“ sehen, stoppen Sie zuerst den RustFS-Dienst:

```bash
sudo systemctl stop rustfs
```

:::

<a id="replace-failed-disk"></a>

### Ausgefallenes Laufwerk ersetzen

Nachdem Sie das ausgefallene Laufwerk physisch ersetzt haben, partitionieren und formatieren Sie das neue Laufwerk und vergeben Sie dieselbe Bezeichnung wie beim ursprünglichen Laufwerk.

```bash
sudo mkfs.xfs -f -i size=512 -n ftype=1 -L RUSTFS0 /dev/sdb
```

:::note[Anforderungen]

* Das neue Laufwerk ist mindestens so groß wie das ursprüngliche Laufwerk.
* Verwenden Sie dasselbe Dateisystem wie bei den anderen Laufwerken (XFS; siehe die [Installationsanleitung](../installation/linux/index.md)).
* Wir empfehlen, Dateisysteme über die Bezeichnung (LABEL) oder die UUID einzuhängen, damit Einhängungen korrekt bleiben, wenn sich Gerätenamen nach einem Neustart ändern.

:::

<a id="update-etcfstab-or-rustfs-configuration"></a>

### `/etc/fstab` oder die RustFS-Konfiguration aktualisieren

Prüfen Sie, dass Bezeichnungen oder UUIDs in den Einträgen von `/etc/fstab` auf das neue Laufwerk zeigen. Der Einhängepunkt muss mit dem in `RUSTFS_VOLUMES` (in `/etc/default/rustfs`) genannten identisch bleiben, damit das wiederhergestellte Laufwerk dem Cluster unter demselben Pfad beitritt.

```ini title="/etc/fstab"
UUID=<filesystem-uuid> /data/rustfs0 xfs defaults,noatime,nodiratime 0 0
```

:::tip[Tipps]

* Bei Verwendung einer UUID:

```bash
sudo blkid -s UUID -o value /dev/sdb
```

* Nachdem Sie `/etc/fstab` bearbeitet haben, prüfen Sie die Syntax:

```bash
sudo mount -a
findmnt /data/rustfs0
```

:::

<a id="remount-new-disk"></a>

### Neues Laufwerk wieder einhängen

Führen Sie die folgenden Befehle aus, um alle konfigurierten Dateisysteme einzuhängen und RustFS zu starten:

```bash
sudo systemctl start rustfs
```

Prüfen Sie, dass alle erwarteten Dateisysteme eingehängt sind:

```bash
df -hT /data/rustfs0
```

:::note[Fehler beim Einhängen]

Wenn ein Einhängen fehlschlägt, prüfen Sie, dass Bezeichnungen oder UUIDs in `/etc/fstab` denen des Zieldateisystems entsprechen.

:::

<a id="trigger-and-monitor-data-healing"></a>

### Datenwiederherstellung auslösen und beobachten

Sobald RustFS an einem bekannten Einhängepunkt ein frisch formatiertes Laufwerk erkennt, stellt der Hintergrund-Scanner die fehlenden Daten automatisch darauf wieder her. Ein manueller Befehl ist nicht erforderlich. Bestätigen Sie, dass die Wiederherstellung begonnen hat, und verfolgen Sie den Fortschritt in den Dienstprotokollen:

```bash
journalctl -u rustfs -f
tail -f /var/log/rustfs/rustfs.log
```

Sie können auch die RustFS Console öffnen und den Festplattenstatus des betroffenen Knotens prüfen.

:::note[Hinweise]

* Die Datenwiederherstellung läuft im Hintergrund und wirkt sich in der Regel wenig auf Client-Anfragen aus.
* Wenn die Datenwiederherstellung endet, melden die Protokolle den Erfolg oder listen Objekte, deren Wiederherstellung fehlgeschlagen ist.

:::

<a id="follow-up-checks-and-notes"></a>

### Anschlussprüfungen und Hinweise

1. **Leistungsüberwachung**

 * Die I/O-Last kann während der Datenwiederherstellung schwanken. Wir empfehlen, die Auslastung von Festplatte und Netzwerk zu überwachen.
2. **Ausfälle einer Charge**

 * Wenn mehrere Laufwerke derselben Fertigungscharge ausfallen, prüfen Sie die übrigen Laufwerke dieser Charge häufiger.
3. **Regelmäßige Ausfalltests**

 * Führen Sie regelmäßig Übungen zum Laufwerksausfall durch, damit Ihr Team das Wiederherstellungsverfahren proben kann.
4. **Wartungsfenster**

 * Planen Sie bei hoher Ausfallrate eigene Wartungsfenster, um Austausch und Datenwiederherstellung zu beschleunigen.
