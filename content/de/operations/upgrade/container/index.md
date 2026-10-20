---
title: "Container-Upgrade"
description: "Aktualisieren Sie mit Docker, Podman oder Docker Compose gestartete RustFS-Container und behalten Sie persistente Daten bei."
---

Aktualisieren Sie eine Container-Bereitstellung, indem Sie den RustFS-Container aus einem neueren Image neu erzeugen. Wählen Sie den Ablauf, der zur ursprünglichen Installationsmethode passt: ein direkt mit Docker oder Podman gestarteter Container oder ein von Docker Compose verwalteter Dienst.

## Vor dem Upgrade

Lesen Sie die Versionshinweise der Zielversion und verwenden Sie für das Upgrade ein explizites Image-Tag. Notieren Sie das aktuelle Image und bewahren Sie die ursprüngliche Konfiguration von `docker run`, `podman run` oder Compose auf, weil das Neuerzeugen eines Containers dessen Laufzeitoptionen nicht automatisch übernimmt.

Bestätigen Sie, dass RustFS betriebsbereit ist, bevor Sie es ersetzen:

```bash
curl -fsS http://localhost:9000/health/ready
```

:::warning[Persistenten Speicher bewahren]

Entfernen Sie weder das benannte Volume noch das Hostverzeichnis, das unter `/data` eingehängt ist. Befehle wie `docker compose down -v`, `docker volume rm` und `podman volume rm` löschen persistenten Speicher und gehören nicht zu einem Upgrade.

:::

## Einen Docker-Container aktualisieren

Der folgende Ablauf entspricht dem Containernamen und dem benannten Volume aus der [Docker-Installationsanleitung](/de/installation/container/docker). Wenn Ihre Bereitstellung andere Ports, Umgebungsvariablen, Einhängungen oder Startargumente verwendet, lassen Sie diese Einstellungen im Ersatzbefehl unverändert.

Notieren Sie das aktuelle Image und ziehen Sie dann die Zielversion:

```bash
docker inspect --format '{{.Config.Image}}' rustfs
docker pull rustfs/rustfs:<target-version>
```

Stoppen und entfernen Sie nur den Container. Das Volume `rustfs-data` bleibt erhalten:

```bash
docker stop rustfs
docker rm rustfs
```

Erzeugen Sie den Container mit der ursprünglichen Konfiguration und dem Ziel-Image neu:

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
	rustfs/rustfs:<target-version> \
	/data
```

Warten Sie, bis der Ersatzcontainer betriebsbereit ist:

```bash
docker ps --filter name=rustfs
docker logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## Einen Podman-Container aktualisieren

Der Podman-Ablauf ist derselbe Ersatzvorgang und verwendet den Image-Namen aus der [Podman-Installationsanleitung](/de/installation/container/podman).

```bash
podman inspect --format '{{.Config.Image}}' rustfs
podman pull docker.io/rustfs/rustfs:<target-version>
podman stop rustfs
podman rm rustfs
```

Erzeugen Sie den Container mit der ursprünglichen Konfiguration und dem persistenten Volume neu:

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
	docker.io/rustfs/rustfs:<target-version> \
	/data
```

Prüfen Sie den Ersatz, bevor Sie fortfahren:

```bash
podman ps --filter name=rustfs
podman logs rustfs
curl -fsS http://localhost:9000/health/ready
```

## Mit Docker Compose aktualisieren

Führen Sie Compose-Befehle aus dem Verzeichnis aus, das die `docker-compose.yml` der Bereitstellung enthält. Speichern Sie vor dem Upgrade die vollständig aufgelöste Konfiguration und bestätigen Sie das aktuelle Image:

```bash
docker compose config > docker-compose.resolved.yaml
docker compose images rustfs
```

Setzen Sie den Dienst `rustfs` auf ein explizites Ziel-Image-Tag und lassen Sie Volumes, Umgebung, Ports und Befehl unverändert:

```yaml title="docker-compose.yml"
services:
	rustfs:
		image: rustfs/rustfs:<target-version>
```

Prüfen Sie die Datei, ziehen Sie das Ziel-Image und erzeugen Sie nur den RustFS-Dienst neu. `--no-deps` lässt optionale Observability-Dienste weiterlaufen:

```bash
docker compose config --quiet
docker compose pull rustfs
docker compose up -d --no-deps rustfs
```

Prüfen Sie den Dienst und den Bereitschafts-Endpunkt von RustFS:

```bash
docker compose ps rustfs
docker compose logs --tail=100 rustfs
curl -fsS http://localhost:9000/health/ready
```

Wenn Sie RustFS zusammen mit dem Profil `observability` gestartet haben, wird der RustFS-Dienst mit denselben Befehlen aktualisiert. Aktualisieren Sie Observability-Images getrennt nach den Versionshinweisen der jeweiligen Komponente.

## Eine Bereitstellung mit mehreren Knoten aktualisieren

Ersetzen Sie jeweils einen RustFS-Knoten. Warten Sie, bis der Bereitschafts-Endpunkt des aktualisierten Knotens erfolgreich antwortet, und bestätigen Sie den Clusterstatus, bevor Sie zum nächsten Knoten wechseln. Erzeugen Sie nicht alle Knoten gleichzeitig neu.

Verwenden Sie auf jedem Knoten denselben Ablauf für Docker, Podman oder Compose und behalten Sie die vorhandenen Einhängungen und die Konfiguration dieses Knotens bei.

## Zurücksetzen

Stoppen und entfernen Sie bei Docker oder Podman den fehlgeschlagenen Ersatzcontainer und wiederholen Sie den zugehörigen `run`-Befehl mit dem zuvor notierten Image-Tag. Behalten Sie dasselbe persistente Volume und dieselbe Laufzeitkonfiguration bei.

Setzen Sie bei Docker Compose den vorherigen Wert von `image` in `docker-compose.yml` wieder ein und erzeugen Sie dann den RustFS-Dienst neu:

```bash
docker compose pull rustfs
docker compose up -d --no-deps rustfs
curl -fsS http://localhost:9000/health/ready
```

Setzen Sie in einer Bereitstellung mit mehreren Knoten jeweils einen Knoten zurück und warten Sie auf Bereitschaft, bevor Sie fortfahren.

## Nächste Schritte

Weitere Prüfungen nach dem Upgrade finden Sie unter [Statusprüfung](/de/operations/status-check).
