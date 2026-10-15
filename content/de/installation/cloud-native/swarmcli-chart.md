---
title: "SwarmCLI-Chart"
description: "Stellen Sie einen RustFS-Dienst auf einem Knoten in Docker Swarm mit dem rustfs-Chart von SwarmCLI bereit: Anmeldedaten in Docker-Secrets, versionierte Upgrades und Rollbacks sowie optional HTTPS über Traefik."
---

[SwarmCLI](https://github.com/Eldara-Tech/swarmcli) ist ein von Helm inspirierter Paketmanager und eine Terminal-Oberfläche für Docker Swarm. Sein quelloffenes [`rustfs`-Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) stellt RustFS als Swarm-Dienst bereit. Beide werden von Eldara Tech gepflegt, nicht vom RustFS-Projekt.

Gegenüber einer von Hand geschriebenen Stack-Datei bietet das Chart zusätzlich:

- **Anmeldedaten in Docker-Secrets.** RustFS liest seine Root-Schlüssel über `RUSTFS_ACCESS_KEY_FILE` und `RUSTFS_SECRET_KEY_FILE` aus Dateien, sodass keiner der beiden Werte in der Dienstdefinition oder in `docker inspect` erscheint. Der Standardschlüssel `rustfsadmin` wird abgelehnt.
- **Versionierte Releases.** Prüfen Sie ein Upgrade vorab, wenden Sie es an und kehren Sie zu einer früheren Revision zurück. SwarmCLI speichert den Revisionsverlauf im Swarm selbst, sodass keine zusätzliche Datenbank nötig ist.
- **HTTPS über Traefik.** Mit dem zugehörigen [`traefik`-Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik) erhalten die S3-API und die Console eigene Hostnamen und Zertifikate von Let's Encrypt, und die Console kann Single Sign-on über OpenID Connect nutzen.
- **Rollouts mit Health-Check.** In den Werten aufgeführte Buckets werden beim Start angelegt, und jeder Rollout wird über den Endpunkt `/health/ready` von RustFS überwacht, sodass `--wait` bei einem fehlerhaften Upgrade einen Fehler statt eines Erfolgs meldet.

Das Chart führt einen RustFS-Dienst mit einem Laufwerk auf einem Knoten aus (Single Node Single Disk, SNSD). Ein einzelnes Laufwerk bietet keine Redundanz durch Erasure Coding. Das Chart eignet sich daher für Build-Caches, Backup-Ziele und Blob-Speicher von Anwendungen in einem kleinen Swarm; eine RustFS-Bereitstellung über mehrere Knoten führt es nicht aus.

## 1. Voraussetzungen

* Ein Docker Swarm (`docker swarm init`) und eine Shell auf einem Manager-Knoten
* SwarmCLI 1.13.0 oder neuer – siehe die [Installationsanleitung von SwarmCLI](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)
* Port 9000 (S3-API) ist auf den Swarm-Knoten frei, da Schritt 5 ihn im Routing-Mesh des Swarms veröffentlicht

## 2. Anmeldedaten als Docker-Secrets anlegen

Ersetzen Sie die Platzhalter für die Anmeldedaten und legen Sie dann für jeden Schlüssel ein Secret an:

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

Jeder Wert muss in einer Zeile stehen und darf keine Leerzeichen enthalten. Einen starken geheimen Zugriffsschlüssel erzeugen Sie zum Beispiel mit `openssl rand -base64 30`.

:::warning[Der Dienst lehnt schwache Anmeldedaten ab]

SwarmCLI verweigert die Installation des Charts, solange eines der Secrets fehlt, und der Container beendet sich beim Start, wenn ein Schlüssel leer ist, Leerzeichen enthält oder den allgemein bekannten Wert `rustfsadmin` hat. Docker-Secrets lassen sich nicht bearbeiten: Um die Anmeldedaten zu rotieren, legen Sie Secrets unter neuen Namen an und aktualisieren anschließend das Release, wobei `s3.accessKeySecret` und `s3.secretKeySecret` auf die neuen Secrets verweisen.

:::

## 3. Datenknoten kennzeichnen

Ein benanntes Volume existiert nur auf einem Knoten. Deshalb wird der Dienst an den Knoten mit dem Label `rustfs-data=true` gebunden. Versehen Sie genau einen Knoten mit diesem Label:

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

In einem Swarm mit nur einem Knoten können Sie das Label weglassen und stattdessen `--set persistence.nodeLabel=""` an den Installationsbefehl in Schritt 5 anhängen.

## 4. Chart-Repository hinzufügen

Überspringen Sie diesen Schritt, wenn `swarmcli charts repo list` bereits `swarmcli-charts` anzeigt:

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 5. RustFS installieren

Installieren Sie das Chart als Release mit dem Namen `rustfs`, veröffentlichen Sie die S3-API auf Port 9000 und legen Sie beim Start einen Bucket an:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

Der Dienst speichert seine Daten unter `/data` auf dem benannten Volume `rustfs-data`, das Docker nach dem Release als `rustfs_rustfs-data` benennt. Jeder Bucket in `buckets` wird angelegt, sobald der Server antwortet; ein bereits vorhandener Bucket bleibt unverändert, sodass Neustarts und Upgrades unbedenklich sind.

## 6. Bereitstellung prüfen

Prüfen Sie das Release, den Task des Dienstes und den Bereitschaftsendpunkt der S3-API:

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health/ready
```

Die S3-API ist auf jedem Swarm-Knoten unter `http://localhost:9000` erreichbar. Clients verwenden pfadbasierte Adressierung und die Region `us-east-1`. Bleibt der Task mit `no suitable node` im Status Pending, trägt kein Knoten das Label `rustfs-data=true` aus Schritt 3.

## Upgrade und Rollback

Jede Installation, jedes Upgrade und jeder Rollback erzeugt eine nummerierte Revision des Releases. Prüfen Sie eine Änderung vorab, wenden Sie sie an und listen Sie die Revisionen auf:

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts upgrade rustfs swarmcli-charts/rustfs --wait \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts history rustfs
```

Ein Upgrade geht von den Standardwerten des Charts aus; übergeben Sie daher alle Werte erneut oder speichern Sie die Werte in einer Datei und übergeben Sie diese mit `-f`. So kehren Sie zu einer früheren Revision zurück:

```bash
swarmcli charts rollback rustfs 1
```

Ein Rollback stellt die Dienstdefinition dieser Revision erneut bereit; Daten stellt er nicht wieder her.

## Bereitstellungsmodi

Das Chart stellt die S3-API und die Console unabhängig voneinander bereit. Die Console ist standardmäßig deaktiviert; aktivieren Sie sie mit `console.enabled=true`. Den Modus der S3-API legt `exposure.mode` fest, den der Console `console.exposure.mode`:

| Modus | Erreichbar von |
| - | - |
| `none` (Standard) | Nur Diensten im Overlay-Netzwerk `rustfs-net`, unter `http://<release>-rustfs:9000` (die Console, sofern aktiviert, auf Port 9001) |
| `published` | Einem im Routing-Mesh des Swarms veröffentlichten Port: `publish.port` für die S3-API, `console.publish.port` (9001) für die Console |
| `traefik` | Einem von Traefik über HTTPS gerouteten Hostnamen: `ingress.host` für die S3-API, `console.ingress.host` für die Console |

Der Modus `traefik` setzt ein zuvor installiertes [`traefik`-Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik) voraus: Es legt das Netzwerk `traefik-public` an, dem RustFS beitritt, und bezieht die Zertifikate von Let's Encrypt. Stellen Sie anschließend die S3-API unter ihrem Hostnamen bereit:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=traefik \
  --set ingress.host=s3.example.com \
  --set 'buckets={my-bucket}'
```

Ohne Traefik veröffentlichen Sie die Console so neben der S3-API auf Port 9001:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set console.enabled=true \
  --set console.exposure.mode=published \
  --set 'buckets={my-bucket}'
```

:::note[Der Console-Port bedient auch die S3-API]

Der Console-Listener bedient zusätzlich die vollständige signierte S3- und Admin-API. Wenn Sie nur die Console bereitstellen, ist diese API daher trotzdem unter einer öffentlichen Adresse erreichbar. Lassen Sie die Console deaktiviert, wenn Sie sie nicht verwenden.

:::

## Wichtige Werte

| Wert | Zweck | Standardwert des Charts |
| - | - | - |
| `image.tag` | Tag des RustFS-Images | `""` (die vom Chart festgelegte RustFS-Version) |
| `s3.accessKeySecret` / `s3.secretKeySecret` | Docker-Secrets mit den Root-Anmeldedaten | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | Buckets, die beim Start angelegt werden, falls sie fehlen | `[]` |
| `exposure.mode` | Bereitstellung der S3-API: `none`, `published` oder `traefik` | `none` |
| `publish.port` | Veröffentlichter Port der S3-API | `9000` |
| `ingress.host` | Hostname, den Traefik zur S3-API routet | `s3.example.com` |
| `console.enabled` | Console-Listener ausführen | `false` |
| `console.exposure.mode` | Bereitstellung der Console: `none`, `published` oder `traefik` | `none` |
| `persistence.nodeLabel` | Knoten-Label, an das der Dienst gebunden wird; `""` für keine Bindung | `rustfs-data` |
| `persistence.volumePath` | Hostverzeichnis, das statt des benannten Volumes unter `/data` eingebunden wird; muss `10001` gehören | `""` |
| `extraEnv` | Zusätzliche `RUSTFS_*`-Umgebungsvariablen, etwa `RUSTFS_SERVER_DOMAINS` | `{}` |

Die [README des Charts](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) beschreibt alle Werte, darunter das Routing über Traefik, Single Sign-on für die Console über OpenID Connect und das Einbinden eines Hostverzeichnisses.

## Deinstallation

```bash
swarmcli charts uninstall rustfs
```

Die Deinstallation entfernt den Dienst und den Release-Verlauf. Erhalten bleiben das Daten-Volume, die beiden Docker-Secrets und das Netzwerk `rustfs-net`, das SwarmCLI zusammen mit dem Befehl zum Entfernen auflistet.

:::note[Das Daten-Volume bleibt nach der Deinstallation erhalten]

Eine spätere Installation mit demselben Release-Namen bindet das Volume samt Daten wieder ein. Um die Daten zu verwerfen, entfernen Sie das Volume auf dem gekennzeichneten Knoten, sobald der Task beendet ist (nach bis zu 30 Sekunden), und, falls Sie sie nicht mehr benötigen, die Secrets:

```bash
docker volume rm rustfs_rustfs-data
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## Nächste Schritte

- [RustFS Console](/administration/console)
- [S3-Client konfigurieren](../../developer/examples/aws-cli.md)
- [Checklisten vor der Installation](../requirement/checklists/index.md)
