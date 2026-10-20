---
title: "SwarmCLI-Chart"
description: "Stellen Sie RustFS mit dem rustfs-Chart von SwarmCLI in Docker Swarm bereit, als Dienst auf einem Knoten oder als verteilten Cluster mit Erasure Coding: Anmeldedaten in Docker-Secrets, versionierte Upgrades und Rollbacks sowie optional HTTPS über Traefik."
---

[SwarmCLI](https://github.com/Eldara-Tech/swarmcli) ist ein von Helm inspirierter Paketmanager und eine Terminal-Oberfläche für Docker Swarm. Sein quelloffenes [`rustfs`-Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) stellt RustFS in Docker Swarm bereit. Beide werden von Eldara Tech gepflegt, nicht vom RustFS-Projekt.

Gegenüber einer von Hand geschriebenen Stack-Datei bietet das Chart zusätzlich:

- **Anmeldedaten in Docker-Secrets.** RustFS liest seine Root-Schlüssel über `RUSTFS_ACCESS_KEY_FILE` und `RUSTFS_SECRET_KEY_FILE` aus Dateien, sodass keiner der beiden Werte in der Dienstdefinition oder in `docker inspect` erscheint. Der Standardschlüssel `rustfsadmin` wird abgelehnt.
- **Versionierte Releases.** Prüfen Sie ein Upgrade vorab, wenden Sie es an und kehren Sie zu einer früheren Revision zurück. SwarmCLI speichert den Revisionsverlauf im Swarm selbst, sodass keine zusätzliche Datenbank nötig ist.
- **HTTPS über Traefik.** Mit dem zugehörigen [`traefik`-Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik) erhalten die S3-API und die Console eigene Hostnamen und Zertifikate von Let's Encrypt, und die Console kann Single Sign-on über OpenID Connect nutzen.
- **Rollouts mit Integritätsprüfung.** In den Werten aufgeführte Buckets werden beim Start angelegt, und jeder Rollout eines Standalone-Releases wird über den Endpunkt `/health/ready` von RustFS überwacht, sodass `--wait` bei einem fehlerhaften Upgrade einen Fehler statt eines Erfolgs meldet.
- **Rolling Upgrades im Cluster.** Im verteilten Modus aktualisiert ein Upgrade die Peers einzeln nacheinander; laufen alle vier Peers der Standardkonfiguration, bedient der Cluster währenddessen durchgehend Lese- und Schreibzugriffe, mit einem Peer weniger.

Das Chart läuft in einem von zwei Modi, den Sie bei der Installation wählen. Der standardmäßige Standalone-Modus führt einen RustFS-Dienst mit einem Laufwerk auf einem Knoten aus (Single Node Single Disk, SNSD). Ein einzelnes Laufwerk bietet keine Redundanz durch Erasure Coding. Der Standalone-Modus eignet sich daher für Build-Caches, Backup-Ziele und Blob-Speicher von Anwendungen in einem kleinen Swarm. Der verteilte Modus speichert Objekte per Erasure Coding auf vier oder mehr Peers, einem pro Knoten, für Daten, die den Ausfall eines Knotens überstehen müssen. Schritt 4 installiert den Standalone-Modus und Schritt 5 den verteilten Modus; die übrigen Schritte gelten für beide.

## 1. Voraussetzungen

* Ein Docker Swarm (`docker swarm init`) und eine Shell auf einem Manager-Knoten
* SwarmCLI 2.2.0 oder neuer – siehe die [Installationsanleitung von SwarmCLI](https://github.com/Eldara-Tech/swarmcli/blob/main/docs/installation.md)
* Für den Standalone-Modus ein freier Port 9000 (S3-API) auf den Swarm-Knoten, da Schritt 4 ihn im Routing-Mesh des Swarms veröffentlicht
* Für den verteilten Modus ein Knoten pro Peer, mindestens vier (für die Entwicklung genügt ein einzelner Knoten; siehe Schritt 5)

## 2. Anmeldedaten als Docker-Secrets anlegen

Ersetzen Sie die Platzhalter für die Anmeldedaten und legen Sie dann für jeden Schlüssel ein Secret an:

```bash
printf '%s' '<your-access-key>' | docker secret create rustfs-access-key -
printf '%s' '<your-secret-key>' | docker secret create rustfs-secret-key -
```

Jeder Wert muss in einer Zeile stehen und darf keine Leerzeichen enthalten. Einen starken geheimen Zugriffsschlüssel erzeugen Sie zum Beispiel mit `openssl rand -base64 30`. Im verteilten Modus liest jeder Peer dieselben beiden Secrets.

:::warning[Der Dienst lehnt schwache Anmeldedaten ab]

SwarmCLI verweigert die Installation des Charts, solange eines der Secrets fehlt, und der Container beendet sich beim Start, wenn ein Schlüssel leer ist, Leerzeichen enthält oder den allgemein bekannten Wert `rustfsadmin` hat. Docker-Secrets lassen sich nicht bearbeiten: Um die Anmeldedaten zu rotieren, legen Sie Secrets unter neuen Namen an und aktualisieren anschließend das Release, wobei `s3.accessKeySecret` und `s3.secretKeySecret` auf die neuen Secrets verweisen. Im verteilten Modus erfordert die Rotation einen vollständigen Stopp, wie unter Upgrade und Rollback beschrieben.

:::

## 3. Chart-Repository hinzufügen

Überspringen Sie diesen Schritt, wenn `swarmcli charts repo list` bereits `swarmcli-charts` anzeigt:

```bash
swarmcli charts repo add swarmcli-charts https://eldara-tech.github.io/swarmcli-charts
```

## 4. Standalone-Modus installieren

Führen Sie entweder diesen Schritt oder Schritt 5 aus, nicht beide. Ein benanntes Volume existiert nur auf einem Knoten. Deshalb wird der Dienst an den Knoten mit dem Label `rustfs-data=true` gebunden. Versehen Sie genau einen Knoten mit diesem Label:

```bash
docker node update --label-add rustfs-data=true <node-hostname>
```

In einem Swarm mit nur einem Knoten können Sie das Label weglassen und stattdessen `--set persistence.nodeLabel=""` an den folgenden Installationsbefehl anhängen.

Installieren Sie das Chart als Release mit dem Namen `rustfs`, veröffentlichen Sie die S3-API auf Port 9000 und legen Sie beim Start einen Bucket an:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket}'
```

Der Dienst speichert seine Daten unter `/data` auf dem benannten Volume `rustfs-data`, das Docker nach dem Release als `rustfs_rustfs-data` benennt. Jeder Bucket in `buckets` wird angelegt, sobald der Server antwortet; ein bereits vorhandener Bucket bleibt unverändert, sodass Neustarts und Upgrades unbedenklich sind.

## 5. Verteilten Modus installieren

Führen Sie diesen Schritt anstelle von Schritt 4 aus. Im verteilten Modus ist jeder Peer ein eigener Swarm-Dienst (`rustfs_rustfs-1` bis `rustfs_rustfs-4` bei einem Release mit dem Namen `rustfs`) mit einem Replikat, einem eigenen Volume und einem eigenen Knoten-Label. Versehen Sie für jeden Peer einen Knoten mit einem Label:

```bash
docker node update --label-add rustfs-1=true <node-a>
docker node update --label-add rustfs-2=true <node-b>
docker node update --label-add rustfs-3=true <node-c>
docker node update --label-add rustfs-4=true <node-d>
```

Platzieren Sie jeden Peer auf einem anderen Knoten: Peers auf demselben Knoten fallen gemeinsam mit diesem aus, und bei den vier Peers der Standardkonfiguration stoppt der Ausfall eines einzigen Knotens, auf dem zwei Peers laufen, die Schreibzugriffe. In einem Swarm mit nur einem Knoten versehen Sie diesen Knoten mit allen vier Labels; das eignet sich nur für die Entwicklung, da diese Konfiguration keine Verfügbarkeit bietet.

Legen Sie den Modus und den Aufbau des Clusters ausdrücklich fest. Die Gesamtzahl der Laufwerke beträgt `cluster.peers * cluster.drivesPerPeer`.

:::warning[Wählen Sie die Topologie vor der Installation]

`cluster.peers` und `cluster.drivesPerPeer` liegen ab der Installation fest: RustFS speichert die Anzahl der Laufwerke und die Breite des Erasure Sets auf jedem Laufwerk und verweigert den Start mit anderen Werten. Auch `mode` wird bei der Installation gewählt. Eine Änderung des Modus an einem bestehenden Release konvertiert die Daten nicht: Die Dienste des neuen Modus starten auf leeren Laufwerken, die Dienste des alten Modus laufen daneben weiter, und Clients erreichen beide. Um einen Standalone-Speicher in einen Cluster zu überführen, installieren Sie den Cluster als zweites Release und kopieren die Buckets über S3 hinüber.

:::

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

buckets:
  - my-bucket
```

Das Beispiel legt vier Peers mit je einem Laufwerk an. Jedes Objekt wird in zwei Daten- und zwei Paritäts-Shards aufgeteilt, sodass Lesezugriffe den Ausfall von zwei Peers überstehen und Schreibzugriffe den Ausfall eines Peers; die nutzbare Kapazität beträgt die Hälfte der Gesamtkapazität der Laufwerke. Mehr als ein Laufwerk pro Peer erfordert `persistence.volumePaths` mit einem Hostverzeichnis pro Laufwerk, jeweils auf einem eigenen Datenträger; die README des Charts beschreibt dies. Installieren Sie das Chart mit der Wertedatei:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

Alle Peers starten gemeinsam. `--wait` kehrt zurück, sobald der Task jedes Peers läuft und seinen Überwachungszeitraum von zwei Minuten überstanden hat. Peer 1 legt die Buckets an, sobald der Cluster Schreibzugriffe annimmt; gelingt ihm das nicht innerhalb von fünf Minuten nach dem Start, protokolliert er den Bucket, den er nicht anlegen konnte (`docker service logs rustfs_rustfs-1` zeigt ihn an), und bedient weiterhin Anfragen. Die Integritätsprüfung eines Peers zeigt nur, dass der Peer lebt; `--wait` zeigt daher nicht, ob der Cluster Anfragen bedient. Das prüft Schritt 6.

## 6. Bereitstellung prüfen

Prüfen Sie im Standalone-Modus das Release, den Task des Dienstes und den Bereitschaftsendpunkt der S3-API:

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs
curl --fail http://localhost:9000/health/ready
```

Die S3-API ist auf jedem Swarm-Knoten unter `http://localhost:9000` erreichbar. Clients verwenden pfadbasierte Adressierung und die Region `us-east-1`. Bleibt der Task mit `no suitable node` im Status Pending, trägt kein Knoten das Label `rustfs-data=true` aus Schritt 4.

Prüfen Sie im verteilten Modus das Release und die Tasks der Peers und fragen Sie dann aus einem Container im Overlay-Netzwerk `rustfs-net` ab, ob der Cluster Anfragen bedient:

```bash
swarmcli charts status rustfs
docker service ps rustfs_rustfs-1 rustfs_rustfs-2 rustfs_rustfs-3 rustfs_rustfs-4
docker run --rm --network rustfs-net curlimages/curl -s -o /dev/null -w '%{http_code}\n' \
  http://rustfs-rustfs:9000/minio/health/cluster
```

`200` bedeutet, dass jedes Erasure Set das Schreibquorum erreicht. Bleibt der Task eines Peers mit `no suitable node` im Status Pending, trägt kein Knoten das Label `rustfs-<n>=true` dieses Peers aus Schritt 5. Sobald das Label gesetzt ist, startet der Peer; meldet das Log von Peer 1 danach einen Bucket, den er nicht anlegen konnte, starten Sie Peer 1 neu, damit er die Buckets erneut anlegt: `docker service update --force rustfs_rustfs-1`.

Dienste, die `rustfs-net` beitreten, erreichen den Cluster unter `http://rustfs-rustfs:9000` mit pfadbasierter Adressierung und der Region `us-east-1`. Jeder Peer bedient jedes Objekt, und der Name wird in die Adressen aller Peers aufgelöst, deren Integritätsprüfung erfolgreich ist. Diese Prüfung zeigt nur, dass ein Peer lebt; bei einer Erstinstallation oder nachdem alle Peers gestoppt wurden, kann ein Peer daher mit 503 antworten, bis der Cluster Anfragen bedient. Auch eine laufende Anfrage an einen Peer, der stoppt, schlägt fehl. Clients müssen fehlgeschlagene Anfragen wiederholen, wie es S3-Clients standardmäßig tun. Um den Cluster von außerhalb des Swarms zu erreichen, machen Sie ihn erreichbar, wie unter Erreichbarkeitsmodi beschrieben.

## Upgrade und Rollback

Jede Installation, jedes Upgrade und jeder Rollback erzeugt eine nummerierte Revision des Releases. Ein Upgrade geht von den Standardwerten des Charts aus; übergeben Sie daher alle Werte erneut, einschließlich `--set persistence.nodeLabel=""`, falls Sie es in Schritt 4 verwendet haben, oder speichern Sie die Werte in einer Datei und übergeben Sie diese mit `-f`. Prüfen Sie für das Standalone-Release aus Schritt 4 eine Änderung vorab, wenden Sie sie an und listen Sie die Revisionen auf:

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts upgrade rustfs swarmcli-charts/rustfs --wait \
  --set exposure.mode=published \
  --set 'buckets={my-bucket,backups}'
swarmcli charts history rustfs
```

So kehren Sie zu einer früheren Revision zurück:

```bash
swarmcli charts rollback rustfs 1
```

Ein Rollback stellt die Dienstdefinition dieser Revision erneut bereit; Daten stellt er nicht wieder her.

Übergeben Sie im verteilten Modus jedem Upgrade die Wertedatei, mit der Sie installiert haben, statt `--reuse-values` zu verwenden, und tragen Sie spätere Änderungen, etwa Erreichbarkeitseinstellungen, in diese Datei ein. Ein Upgrade, dessen Werte `mode: distributed` nicht enthalten, lässt die Peers unverändert und startet daneben einen Standalone-Dienst.

SwarmCLI aktualisiert die Peers einzeln nacheinander: Es stoppt einen Peer, startet dessen neuen Task und wechselt erst dann zum nächsten Peer, wenn dieser Task läuft und seinen Überwachungszeitraum überstanden hat. Laufen alle vier Peers der Standardkonfiguration, bedient der Cluster währenddessen durchgehend Lese- und Schreibzugriffe, mit einem Peer weniger; ist bereits ein Peer ausgefallen, nimmt der Cluster immer dann keine Schreibzugriffe an, wenn das Upgrade einen weiteren Peer stoppt. Prüfen Sie daher zuerst mit den Befehlen aus Schritt 6, dass der Task jedes Peers läuft und der Cluster mit `200` antwortet; ein `200` allein zeigt nicht, dass jeder Peer läuft. Prüfen Sie dann das Upgrade vorab, wenden Sie es an und prüfen Sie den Cluster anschließend erneut:

```bash
swarmcli charts diff upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

Ein Rollback geht bei den Peers auf dieselbe Weise vor. Startet bei einem Upgrade ein Peer nicht, hält das Upgrade an dieser Stelle an, und die übrigen Peers bleiben unangetastet.

:::warning[Die Rotation der Anmeldedaten eines Clusters erfordert einen vollständigen Stopp]

Jeder Peer leitet sein Internode-Secret aus dem Schlüsselpaar ab. Peers mit dem alten Paar und Peers mit dem neuen Paar können einander daher nicht erreichen, und ein Upgrade, das die Peers einzeln nacheinander aktualisiert, würde den Cluster spalten. Legen Sie die neuen Secrets an:

```bash
printf '%s' '<your-new-access-key>' | docker secret create rustfs-access-key-2 -
printf '%s' '<your-new-secret-key>' | docker secret create rustfs-secret-key-2 -
```

Tragen Sie die beiden Secret-Namen in `distributed-values.yaml` ein, damit spätere Upgrades sie beibehalten. Mit den Werten aus Schritt 5 lautet die Datei dann:

```yaml title="distributed-values.yaml"
mode: distributed

cluster:
  peers: 4
  drivesPerPeer: 1

s3:
  accessKeySecret: rustfs-access-key-2
  secretKeySecret: rustfs-secret-key-2

buckets:
  - my-bucket
```

Stoppen Sie dann alle Peers und führen Sie das Upgrade aus, damit alle Peers gemeinsam mit dem neuen Paar starten:

```bash
for n in 1 2 3 4; do docker service scale "rustfs_rustfs-$n=0"; done
swarmcli charts upgrade rustfs swarmcli-charts/rustfs -f distributed-values.yaml --wait
```

Die Daten und die Buckets bleiben erhalten; Clients benötigen das neue Paar. Kehren Sie nicht per Rollback zu einer Revision aus der Zeit vor der Rotation zurück: Der Rollback würde die Peers einzeln nacheinander wieder auf das alte Paar umstellen und den Cluster auf dieselbe Weise spalten.

:::

## Erreichbarkeitsmodi

Das Chart macht die S3-API und die Console unabhängig voneinander erreichbar. Die Console ist standardmäßig deaktiviert; aktivieren Sie sie mit `console.enabled=true`. Den Modus der S3-API legt `exposure.mode` fest, den der Console `console.exposure.mode`:

| Modus | Erreichbar von |
| - | - |
| `none` (Standard) | Diensten im Overlay-Netzwerk `rustfs-net`, unter `http://<release>-rustfs:9000` (die Console, sofern aktiviert, auf Port 9001); solange der andere Listener `traefik` verwendet, auch Diensten in `traefik-public` |
| `published` | Einem veröffentlichten Port: `publish.port` für die S3-API, `console.publish.port` (9001) für die Console, im Routing-Mesh des Swarms (im verteilten Modus auf dem eigenen Knoten jedes Peers) |
| `traefik` | Einem von Traefik über HTTPS gerouteten Hostnamen: `ingress.host` für die S3-API, `console.ingress.host` für die Console |

Der Modus `traefik` setzt ein zuvor installiertes [`traefik`-Chart](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/traefik) voraus: Es legt das Netzwerk `traefik-public` an, dem RustFS beitritt, und bezieht die Zertifikate von Let's Encrypt. Stellen Sie anschließend die S3-API eines Standalone-Releases unter ihrem Hostnamen bereit:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=traefik \
  --set ingress.host=s3.example.com \
  --set 'buckets={my-bucket}'
```

Ohne Traefik veröffentlichen Sie die Console eines Standalone-Releases so neben der S3-API auf Port 9001:

```bash
swarmcli charts install rustfs swarmcli-charts/rustfs \
  --set exposure.mode=published \
  --set console.enabled=true \
  --set console.exposure.mode=published \
  --set 'buckets={my-bucket}'
```

:::note[Der Console-Port bedient auch die S3-API]

Der Console-Listener bedient zusätzlich die vollständige signierte S3- und Admin-API. Wenn Sie nur die Console erreichbar machen, ist diese API daher trotzdem unter einer öffentlichen Adresse erreichbar. Lassen Sie die Console deaktiviert, wenn Sie sie nicht verwenden.

:::

Im verteilten Modus erhalten alle Peers dieselben Erreichbarkeitseinstellungen; legen Sie sie in `distributed-values.yaml` fest und führen Sie dann ein Upgrade aus, wie unter Upgrade und Rollback beschrieben. Mit `traefik` verteilt Traefik die Anfragen auf alle fehlerfreien Peers. Der Modus `published` erfordert `publish.mode=host` (und `console.publish.mode=host` für die Console); damit wird der Port statt im Routing-Mesh auf dem eigenen Knoten jedes Peers veröffentlicht, sodass der Port eines Knotens nur den Peer auf diesem Knoten erreicht. Schalten Sie den Knoten einen Load Balancer vor oder verwenden Sie Traefik. Die Veröffentlichung im Host-Modus erfordert, dass jeder Peer auf einem eigenen Knoten läuft; in einem Swarm mit nur einem Knoten ist sie daher nicht möglich.

## Wichtige Werte

| Wert | Zweck | Standardwert des Charts |
| - | - | - |
| `image.tag` | Tag des RustFS-Images | `""` (die vom Chart festgelegte RustFS-Version) |
| `mode` | `standalone` oder `distributed`, bei der Installation gewählt | `standalone` |
| `cluster.peers` | Peers im verteilten Modus, jeweils mit einem Dienst und einem Knoten-Label; mindestens 4 | `4` |
| `cluster.drivesPerPeer` | Laufwerke pro Peer im verteilten Modus; mehr als eines erfordert `persistence.volumePaths` | `1` |
| `s3.accessKeySecret` / `s3.secretKeySecret` | Docker-Secrets mit den Root-Anmeldedaten | `rustfs-access-key` / `rustfs-secret-key` |
| `buckets` | Buckets, die beim Start angelegt werden, falls sie fehlen | `[]` |
| `exposure.mode` | Erreichbarkeit der S3-API: `none`, `published` oder `traefik` | `none` |
| `publish.port` | Veröffentlichter Port der S3-API | `9000` |
| `ingress.host` | Hostname, den Traefik zur S3-API routet | `s3.example.com` |
| `console.enabled` | Console-Listener ausführen | `false` |
| `console.exposure.mode` | Erreichbarkeit der Console: `none`, `published` oder `traefik` | `none` |
| `persistence.nodeLabel` | Knoten-Label, an das der Standalone-Dienst gebunden wird; `""` für keine Bindung | `rustfs-data` |
| `persistence.nodeLabelPrefix` | Präfix der Knoten-Labels, das Peer `<n>` im verteilten Modus an das Label `<prefix>-<n>` bindet; `""` für keine Bindung, nur in einem Swarm mit nur einem Knoten | `rustfs` |
| `persistence.volumePath` | Hostverzeichnis, das im Standalone-Modus statt des benannten Volumes unter `/data` eingebunden wird; muss `10001` gehören | `""` |
| `extraEnv` | Zusätzliche `RUSTFS_*`-Umgebungsvariablen, etwa `RUSTFS_SERVER_DOMAINS` | `{}` |

Die [README des Charts](https://github.com/Eldara-Tech/swarmcli-charts/tree/main/charts/rustfs) beschreibt alle Werte, darunter das Routing über Traefik, Single Sign-on für die Console über OpenID Connect und das Einbinden von Hostverzeichnissen in beiden Modi.

## Deinstallation

```bash
swarmcli charts uninstall rustfs
```

Die Deinstallation entfernt den Dienst, im verteilten Modus den Dienst jedes Peers, sowie den Release-Verlauf. Erhalten bleiben das Daten-Volume (im verteilten Modus eines pro Peer), die beiden Docker-Secrets und das Netzwerk `rustfs-net`, das SwarmCLI zusammen mit dem Befehl zum Entfernen auflistet.

:::note[Die Daten-Volumes bleiben nach der Deinstallation erhalten]

Im Standalone-Modus bindet eine spätere Installation mit demselben Release-Namen das Volume samt Daten wieder ein. Um die Daten zu verwerfen, entfernen Sie das Volume auf dem gekennzeichneten Knoten, sobald der Task beendet ist (nach bis zu 30 Sekunden):

```bash
docker volume rm rustfs_rustfs-data
```

Im verteilten Modus behält jeder Peer sein eigenes Volume `rustfs_rustfs-data-<n>` auf dem Knoten mit dem Label `rustfs-<n>=true`; entfernen Sie es dort, sobald der Task dieses Peers beendet ist. Eine spätere Installation mit demselben Release-Namen verwendet diese Volumes wieder und muss daher dieselben Werte für `cluster.peers` und `cluster.drivesPerPeer` beibehalten.

Entfernen Sie in beiden Modi die Secrets, falls Sie sie nicht mehr benötigen: das vom Release verwendete Paar und jedes durch eine Rotation ersetzte Paar. Mit den Namen aus Schritt 2:

```bash
docker secret rm rustfs-access-key rustfs-secret-key
```

:::

## Nächste Schritte

- [RustFS Console](/administration/console)
- [S3-Client konfigurieren](../../developer/examples/aws-cli.md)
- [Checklisten vor der Installation](../requirement/checklists/index.md)
