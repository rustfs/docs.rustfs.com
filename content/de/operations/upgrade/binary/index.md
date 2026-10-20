---
title: "Binär-Upgrade"
description: "Aktualisieren Sie RustFS-Binärbereitstellungen knotenweise und erhalten Sie dabei die Verfügbarkeit des Clusters."
---

Ersetzen Sie die ausführbare RustFS-Datei mit einem rollierenden Upgrade auf jedem Knoten, ohne den gesamten Cluster offline zu nehmen. Lesen Sie vor Beginn die Versionshinweise der Zielversion und bestätigen Sie, dass jeder Knoten betriebsbereit ist.

## Vor dem Upgrade

Prüfen Sie die Bereitschaft auf jedem Knoten:

```bash
curl -fsS http://<node-hostname>:9000/health/ready
```

Sichern Sie die Dienstkonfiguration und behalten Sie die aktuell laufende ausführbare Datei für das Zurücksetzen:

```bash
sudo cp /etc/default/rustfs /etc/default/rustfs.bak
sudo cp /usr/local/bin/rustfs /usr/local/bin/rustfs.previous
```

## Jeden Knoten aktualisieren

Aktualisieren Sie jeweils einen Knoten. Fahren Sie nicht fort, bevor der neu gestartete Knoten Bereitschaft meldet.

```bash
sudo systemctl stop rustfs
sudo cp rustfs-new /usr/local/bin/rustfs
sudo chmod +x /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

Wiederholen Sie das Vorgehen für jeden verbleibenden Knoten.

## Zurücksetzen

Wenn die neue Version die Prüfung nicht besteht, stellen Sie die vorherige ausführbare Datei knotenweise wieder her und warten Sie auf Bereitschaft, bevor Sie fortfahren:

```bash
sudo systemctl stop rustfs
sudo cp /usr/local/bin/rustfs.previous /usr/local/bin/rustfs
sudo systemctl start rustfs
curl -fsS http://<node-hostname>:9000/health/ready
```

## Nächste Schritte

Weitere Prüfungen nach dem Upgrade finden Sie unter [Statusprüfung](/de/operations/status-check).
