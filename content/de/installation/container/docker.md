---
title: "RustFS mit Docker installieren und konfigurieren"
description: "Betreiben Sie RustFS mit Docker: Einrichtung auf einem Knoten, Berechtigungen der Host-Verzeichnisse, Docker Compose, TLS und eine Bereitstellung auf mehreren Knoten."
---

Diese Seite beschreibt, wie Sie das offizielle RustFS-Image mit Docker betreiben: eine Instanz auf einem Knoten mit persistentem Speicher, Verzeichnisberechtigungen auf dem Host für den Container-Benutzer ohne Root-Rechte, Docker Compose mit optionalen Observability-Diensten, TLS und eine Bereitstellung auf mehreren Knoten. Sie benötigen eine funktionsfähige Docker Engine und die Berechtigung, Container auszuführen.

## 1. Voraussetzungen

* Docker Engine (≥ 20.10) ist installiert, und Sie können Images abrufen und Container ausführen
* Die Host-Ports 9000 (S3-API) und 9001 (Console, Weboberfläche) sind frei, oder Sie verwenden die Ports, die Sie vorgesehen haben
* Wenn Sie ein Host-Verzeichnis per Bind-Mount einhängen, muss der Eigentümer des Verzeichnisses dem Container-Benutzer entsprechen — siehe [Host-Verzeichnis per Bind-Mount einbinden](#bind-mount-a-host-directory)

## 2. Image abrufen

```bash
docker pull rustfs/rustfs:latest
```

## 3. Persistenten Speicher anlegen

Legen Sie ein benanntes Volume an, damit die Objektdaten verfügbar bleiben, wenn Sie den Container ersetzen:

```bash
docker volume create rustfs-data
```

## 4. RustFS starten

Ersetzen Sie die Platzhalter für die Zugangsdaten, bevor Sie den Container starten:

```bash
docker run -d \
  --name rustfs \
  --restart unless-stopped \
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
  rustfs/rustfs:latest \
  /data
```

:::warning[Zugangsdaten beim Erstellen des Containers festlegen]

Legen Sie eindeutige Umgebungsvariablen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` fest, bevor Sie RustFS in einem Netzwerk erreichbar machen. Verwenden Sie den allgemein bekannten Wert `rustfsadmin` weder als Zugriffsschlüssel noch als geheimen Zugriffsschlüssel. Wenn der Container ohne eigene Zugangsdaten gestartet wurde, beenden Sie ihn und erstellen Sie ihn mit beiden oben gezeigten `-e`-Optionen neu. Das Volume `rustfs-data` bleibt dabei erhalten.

:::

### Umgebungsvariablen oder Kommandozeilenoptionen

Das Beispiel oben konfiguriert RustFS über Umgebungsvariablen. Dieselben Einstellungen können Sie stattdessen als Kommandozeilenoptionen übergeben. Wenn beides gesetzt ist, haben die Kommandozeilenoptionen Vorrang:

```bash
docker run -d \
  --name rustfs \
  -p 9000:9000 \
  -p 9001:9001 \
  -v rustfs-data:/data \
  rustfs/rustfs:latest \
  --access-key "<your-access-key>" \
  --secret-key "<your-secret-key>" \
  --address :9000 \
  --console-enable \
  /data
```

## 5. Host-Verzeichnis per Bind-Mount einbinden [#bind-mount-a-host-directory]

Das benannte Volume oben braucht keine weitere Vorbereitung. Wenn Sie stattdessen ein Host-Verzeichnis einhängen (`-v /path/on/host:/data`), läuft der Container als Benutzer `rustfs` ohne Root-Rechte mit der ID `10001`. Der Eigentümer des Host-Verzeichnisses muss `10001` sein, sonst treten Fehler `permission denied` auf:

```bash
chown -R 10001:10001 /path/to/host_directory
```

## 6. Bereitstellung prüfen

Prüfen Sie den Container und den Integritätsendpunkt der S3-API:

```bash
docker ps --filter name=rustfs
curl --fail http://localhost:9000/health
```

Die S3-API ist unter `http://localhost:9000` erreichbar, die Console unter `http://localhost:9001`.

## Docker Compose

Das RustFS-Repository enthält eine [`docker-compose.yml`](https://github.com/rustfs/rustfs/blob/main/docker-compose.yml) mit den Diensten `grafana`, `prometheus`, `otel-collector` und `jaeger`, vor allem für Observability. Um RustFS zusammen mit diesen Diensten bereitzustellen, klonen Sie das [RustFS-Quellcode-Repository](https://github.com/rustfs/rustfs) lokal:

```bash
git clone https://github.com/rustfs/rustfs.git
```

Führen Sie den Befehl im Wurzelverzeichnis des Repositorys aus:

```bash
docker compose --profile observability up -d
```

Die Compose-Datei verwendet einen Initialisierungscontainer, der `rustfs` die richtigen Zugriffsrechte einräumt. Der Dienst `rustfs_perms` setzt den Eigentümer der eingehängten Volumes auf `10001`, bevor `rustfs` startet. Über `depends_on` wartet `rustfs`, bis dieser Dienst abgeschlossen ist. Damit die Logs dauerhaft gespeichert und zugänglich bleiben, wird das Logverzeichnis auf dem Host auf den Pfad `/var/log/rustfs/` im Container abgebildet:

```yaml title="docker-compose.yml"
  services:
    # grant the necessary permissions to RUSTFS volumes path
    rustfs_perms:
      image: alpine
      user: root
      volumes:
        - /path/to/host_directory/volumes:/fix_path
      command: chown -R 10001:10001 /fix_path

    rustfs:
      image: rustfs/rustfs:latest
      depends_on:
        rustfs_perms:
          condition: service_completed_successfully
      volumes:
        - /path/to_host_directory/volumes/data:/data
        - /path/to_host_directory/volumes/logs:/var/log/rustfs/
      environment:
        - RUSTFS_ADDRESS=":9000"
        - RUSTFS_CONSOLE_ADDRESS=":9001"
        - RUSTFS_CONSOLE_ENABLE=true
        - RUSTFS_OBS_LOGGER_LEVEL=error
        - RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"

      # ... other configurations
```

Wenn Sie nur RustFS ohne Grafana, Prometheus und die übrigen Observability-Dienste wollen, starten Sie nur den Dienst `rustfs` (die Compose-Datei kennzeichnet die Abhängigkeit vom Collector als optional):

```bash
docker compose -f docker-compose.yml up -d rustfs
```

Damit startet nur der Container `rustfs-server`. Egal, ob Sie nur `rustfs-server` oder alle Dienste starten: Die S3-API ist unter `http://localhost:9000` erreichbar, die RustFS Console unter `http://localhost:9001`. Öffnen Sie die Console im Browser und melden Sie sich mit dem Zugriffsschlüssel und dem geheimen Zugriffsschlüssel an, die Sie oben festgelegt haben. Erzeugen Sie ein starkes Geheimnis, zum Beispiel mit `openssl rand -base64 24`, und übernehmen Sie die Platzhalterwerte nicht in die Produktion.

Legen Sie für Docker Compose eindeutige Werte für `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` in der Umgebung des Dienstes `rustfs` oder in der Umgebungsdatei für die Variablenersetzung fest. Erstellen Sie den Dienst anschließend mit `docker compose up -d rustfs` neu.

## Bereitstellung auf mehreren Knoten

Das Standard-Bridge-Netzwerk von Docker unterstützt keine Bereitstellungen auf mehreren Knoten. Verwenden Sie `--network host`, damit jeder Container direkt mit den anderen Knoten kommunizieren kann.

Führen Sie Folgendes auf **jedem Knoten** aus:

```bash
docker run -d \
  --name rustfs \
  --network host \
  -v /mnt/rustfs/data:/data \
  -e RUSTFS_ACCESS_KEY="<your-access-key>" \
  -e RUSTFS_SECRET_KEY="<your-secret-key>" \
  -e RUSTFS_ADDRESS=":9000" \
  -e RUSTFS_CONSOLE_ADDRESS=":9001" \
  -e RUSTFS_CONSOLE_ENABLE=true \
  -e RUSTFS_OBS_LOGGER_LEVEL=error \
  -e RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/" \
  -e RUSTFS_VOLUMES="http://node{1...4}:9000/data/rustfs{0...3}" \
  rustfs/rustfs:latest
```

Tragen Sie die Einträge auf **jedem** Knoten in `/etc/hosts` ein:

```ini title="/etc/hosts"
192.168.1.1 node1
192.168.1.2 node2
192.168.1.3 node3
192.168.1.4 node4
```

## TLS-Konfiguration

Wenn Sie [TLS verwenden](../../integration/tls-configured.md), hängen Sie das Zertifikatsverzeichnis ein und verweisen Sie RustFS darauf:

```bash
-v /path/to/certs:/certs \
-e RUSTFS_TLS_PATH=/certs \
```

## Vor dem Produktivbetrieb

Arbeiten Sie die [Checklisten vor der Installation](../requirement/checklists/index.md) durch — Hardware, Netzwerk, Software und Sicherheit —, bevor Sie in der Produktion bereitstellen. Verwenden Sie eine Bereitstellung auf mehreren Knoten, [aktivieren Sie TLS](../../integration/tls-configured.md), konfigurieren Sie die Logrotation und planen Sie regelmäßige Sicherungen.

## Nächste Schritte

- [RustFS Console](/de/administration/console)
- [S3-Client konfigurieren](../../developer/examples/aws-cli.md)
- [TLS-Konfiguration](../../integration/tls-configured.md)
