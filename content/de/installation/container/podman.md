---
title: "Podman"
description: "Betreiben Sie mit Podman eine RustFS-Instanz auf einem Knoten mit persistentem Containerspeicher."
---

Podman kann das offizielle Image der Open Container Initiative (OCI) von RustFS ohne Daemon ausführen. Sie benötigen eine funktionsfähige Podman-Installation und die Berechtigung, Container zu erstellen.

## 1. Image abrufen

```bash
podman pull docker.io/rustfs/rustfs:latest
```

## 2. Persistenten Speicher anlegen

Legen Sie ein benanntes Volume an, damit die Objektdaten verfügbar bleiben, wenn Sie den Container ersetzen:

```bash
podman volume create rustfs-data
```

:::note[Host-Verzeichnis per Bind-Mount einbinden]

Das benannte Volume oben braucht keine weitere Vorbereitung. Wenn Sie stattdessen ein Host-Verzeichnis per Bind-Mount einhängen, läuft der Container als Benutzer `rustfs` ohne Root-Rechte mit der ID `10001`. Der Eigentümer des Host-Verzeichnisses muss `10001` sein, sonst treten Fehler `permission denied` auf:

```bash
chown -R 10001:10001 /path/to/host_directory
```

:::

## 3. RustFS starten

Ersetzen Sie die Platzhalter für die Zugangsdaten, bevor Sie den Container starten:

```bash
podman run -d \
  --name rustfs \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_ADDRESS=":9000" \
  -e RUSTFS_CONSOLE_ADDRESS=":9001" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_OBS_LOGGER_LEVEL=error \
  -e RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/" \
  docker.io/rustfs/rustfs:latest \
  /data
```

:::warning[Zugangsdaten beim Erstellen des Containers festlegen]

Legen Sie eindeutige Umgebungsvariablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` fest, bevor Sie RustFS in einem Netzwerk erreichbar machen. Verwenden Sie den allgemein bekannten Wert `rustfsadmin` weder als Zugriffsschlüssel noch als geheimen Zugriffsschlüssel. Wenn der Container ohne eigene Zugangsdaten gestartet wurde, beenden Sie ihn und erstellen Sie ihn mit beiden oben gezeigten `-e`-Optionen neu. Das Volume `rustfs-data` bleibt dabei erhalten.

:::

## 4. Bereitstellung prüfen

Prüfen Sie den Container und den Integritätsendpunkt der S3-API:

```bash
podman ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

Die S3-API ist unter `http://localhost:9000` erreichbar, die Console (Weboberfläche) unter `http://localhost:9001`.

## Nächste Schritte

- [RustFS Console](/de/administration/console)
- [S3-Client konfigurieren](../../developer/examples/aws-cli.md)
- [TLS-Konfiguration](../../integration/tls-configured.md)
