---
title: "RustFS-Speicherpool erweitern"
description: "Fügen Sie einem RustFS-Cluster einen Speicherpool hinzu und prüfen Sie die erweiterte Topologie über die Console oder mit rc."
---

## Überblick

### Voraussetzungen

- Installieren Sie [`rc`](/de/operations/rc) auf dem Administrationshost, bevor Sie den `rc`-Ablauf in dieser Anleitung verwenden.
- Konfigurieren Sie Zugangsdaten mit der Berechtigung, den RustFS-Cluster- und Speicherpoolstatus zu lesen.

RustFS erweitert die Kapazität, indem ein **Speicherpool** an die Cluster-Topologie angehängt wird. Jeder Speicherpool ist ein durch Leerzeichen getrennter Volume-Ausdruck in `RUSTFS_VOLUMES`. Nachdem die erweiterte Topologie angewendet wurde, können neue Schreibvorgänge die zusätzliche Kapazität nutzen. Vorhandene Objekte bleiben in ihren aktuellen Speicherpools, bis Sie ein [Rebalancing](./data-rebalancing.md) ausführen.

Diese Anleitung verwendet das folgende Beispiel mit zwei Speicherpools:

```ini title="/etc/default/rustfs"
RUSTFS_VOLUMES="http://rustfs-node1:9000/data/rustfs{1...4}/mnmd http://rustfs-node2:9000/data/rustfs{1...4}/mnmd"
```

Vor der Erweiterung:

- Sichern Sie kritische Daten und führen Sie den Ablauf in einem Wartungsfenster aus.
- Verwenden Sie auf jedem Knoten dieselbe RustFS-Version, dieselben Zugangsdaten und denselben vollständigen Wert von `RUSTFS_VOLUMES`.
- Prüfen Sie Namensauflösung, Zeitsynchronisation und die Erreichbarkeit von Port `9000` zwischen allen bisherigen und neuen Knoten.
- Bereiten Sie den neuen Speicherpool mit der vorgesehenen Laufwerkszahl und Spezifikation vor.

:::warning[Hängen Sie den Speicherpool an und ersetzen Sie die Topologie nicht]

Jeder Knoten muss mit der vollständigen, geordneten Poolliste starten. Wenn Sie den vorhandenen Speicherpool weglassen oder auf einem Knoten einen anderen Ausdruck verwenden, entsteht eine inkonsistente Topologie.

:::

## Ablauf

### Erweiterung mit Unterstützung der Console

Die Console zeigt Speicherpools an, fügt der Starttopologie des Servers aber keinen Speicherpool hinzu. Verwenden Sie diesen Ablauf mit Unterstützung der Console:

1. Notieren Sie die vorhandenen Speicherpools und ihre Nutzung unter **Rebalance** (Rebalancing) oder **Pool Decommission** (Speicherpool-Außerbetriebnahme).
2. Installieren Sie auf dem Knoten oder den Knoten des neuen Speicherpools dieselbe RustFS-Version und Dienstkonfiguration.
3. Hängen Sie den Ausdruck des neuen Speicherpools auf jedem vorhandenen und neuen Knoten an `RUSTFS_VOLUMES` an. Lassen Sie die vorhandenen Ausdrücke unverändert und in derselben Reihenfolge.
4. Starten Sie RustFS auf allen Knoten neu, sodass jeder Prozess mit derselben erweiterten Topologie startet.
5. Warten Sie, bis alle Knoten bereit sind, und aktualisieren Sie dann die Poolliste in der Console.

![RustFS Console mit dem ursprünglichen und dem neu hinzugefügten Speicherpool](./images/pool-expansion-console.png)

Hängen Sie bei einer Helm-Bereitstellung den neuen Eintrag an `pools.list` an und führen Sie `helm upgrade` aus. Entfernen Sie vorhandene Einträge nicht und ändern Sie ihre Reihenfolge nicht.

### Erweiterung mit rc einsehen

Konfigurieren Sie einen Alias mit Zugangsdaten, die Cluster- und Speicherpoolstatus lesen können:

```bash
rc alias set rustfs http://<server-ip>:9000 <your-access-key> <your-secret-key>
```

Notieren Sie die aktuelle Topologie:

```bash
rc admin pool list rustfs
```

Bereiten Sie die neuen Knoten vor, hängen Sie den Ausdruck des neuen Speicherpools auf jedem Knoten an den vollständigen Wert von `RUSTFS_VOLUMES` an und starten Sie RustFS im gesamten Cluster neu. `rc` ändert die Starttopologie des Servers nicht.

Listen Sie die Speicherpools erneut auf, nachdem der Cluster wieder verfügbar ist:

```bash
rc admin pool list rustfs
```

Verwenden Sie eine nullbasierte Pool-ID, um den neuen Speicherpool im Detail einzusehen:

```bash
rc admin pool status rustfs 1 --by-id
```

:::note[Rebalancing-Aliase]

`rc admin expand start`, `status` und `stop` sind Aliase für den Rebalancing-Ablauf nach einer Erweiterung. Sie verteilen vorhandene Daten neu. Sie hängen keinen Speicherpool an `RUSTFS_VOLUMES` an.

:::

## Überprüfung

### Erweiterung in der Console prüfen

Bestätigen Sie Folgendes:

- Die Poolliste zeigt den ursprünglichen und den neuen Speicherpool.
- Jeder erwartete Knoten und jedes erwartete Laufwerk ist online.
- Der neue Speicherpool meldet die erwartete Gesamt- und verfügbare Kapazität.
- Der Cluster meldet keine beeinträchtigten Knoten, bevor Sie den normalen Verkehr wieder aufnehmen.

### Erweiterung mit rc prüfen

Führen Sie aus:

```bash
rc admin pool list rustfs
rc admin pool status rustfs 1 --by-id
```

Prüfen Sie, dass der neue Speicherpool den erwarteten Befehlszeilenausdruck und einen aktiven Zustand hat. Schreiben und lesen Sie ein Testobjekt über den normalen S3-Endpunkt, bevor Sie ein Rebalancing starten.
