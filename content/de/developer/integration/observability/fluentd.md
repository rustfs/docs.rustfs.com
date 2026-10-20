---
title: "Fluentd"
description: "Senden Sie Fluentd-Log-Ereignisse mit dem S3-Output-Plugin an RustFS."
---

In dieser Anleitung verbinden Sie [Fluentd](https://github.com/fluent/fluentd) — den Open-Source-Datensammler — über das Output-Plugin `out_s3` mit **RustFS**. Sie betreiben Fluentd mit einer Tail-Quelle, puffern Log-Ereignisse und prüfen, dass die geschriebenen Objekte in RustFS liegen. Der Ablauf wurde mit `fluent/fluentd:v1.17-1`, `fluent-plugin-s3` 1.8.6 und `rustfs/rustfs-x86-musl:v2.3.1` verifiziert.

Sie benötigen Docker. Dieses Setup ist für lokale Integrationstests gedacht, nicht für den Produktivbetrieb.

## Architektur

```mermaid
flowchart LR
	App["Application"] -->|"writes lines"| File["app.log"]
	File -->|tail| Fluentd["Fluentd"]
	Fluentd -->|"gzip objects"| RustFS["RustFS :9000"]
```

Die Tail-Quelle liest neue Zeilen aus `app.log` und übergibt sie an die S3-Ausgabe. Diese puffert Ereignisse über einen Zeit-Schlüssel und lädt pro Flush-Fenster ein gzip-Objekt hoch.

## 1. Projektdateien anlegen

Legen Sie zuerst den Bucket an. Fluentd legt keine Buckets an:

```bash
rc alias set rustfs http://<your-rustfs-endpoint>:9000 <your-access-key> <your-secret-key>
rc mb rustfs/fluentd-data
```

Das offizielle Fluentd-Image läuft als Benutzer ohne Root-Rechte und kann beim Start keine Gems installieren. Bauen Sie daher ein kleines Image mit dem S3-Plugin:

```dockerfile title="Dockerfile"
FROM fluent/fluentd:v1.17-1
USER root
RUN gem install fluent-plugin-s3 --no-document
USER fluent
```

Erstellen Sie die Fluentd-Konfiguration und ersetzen Sie beide Platzhalter für die Zugangsdaten:

```nginx title="fluent.conf"
<source>
  @type tail
  path /var/log/app.log
  pos_file /var/log/app.log.pos
  tag rustfs.demo
  <parse>
    @type none
  </parse>
</source>

<match **>
  @type s3
  aws_key_id <your-access-key>
  aws_sec_key <your-secret-key>
  s3_bucket fluentd-data
  s3_endpoint http://rustfs:9000/
  s3_region us-east-1
  force_path_style true
  path fluentd-logs
  <buffer>
    @type memory
    timekey 30s
    timekey_wait 0s
    flush_mode immediate
  </buffer>
</match>
```

`force_path_style true` erzwingt pfadbasierte Adressierung (Path-Style) und ist erforderlich. Ohne diese Einstellung setzt das Plugin den Hostnamen `fluentd-data.rustfs` zusammen, und jede Anfrage scheitert mit einem DNS-Fehler. Im Compose-Netzwerk lautet der Hostname `rustfs`; vom Host aus verwenden Sie `http://localhost:9000/`.

Bauen Sie das Image und starten Sie Fluentd im selben Docker-Netzwerk wie RustFS:

```bash
docker build -t fluentd-rustfs .
mkdir -p logs
docker run -d --name fluentd --network oo-rustfs_default \
  -v "$PWD/fluent.conf":/fluentd/etc/fluent.conf:ro \
  -v "$PWD/logs":/var/log fluentd-rustfs
```

## 2. Log-Ereignisse erzeugen

Hängen Sie Zeilen an die überwachte Datei an:

```bash
echo "rustfs fluentd demo line 1" >> logs/app.log
echo "rustfs fluentd demo line 2" >> logs/app.log
```

Bei einem Zeit-Schlüssel von 30 Sekunden und sofortigem Flush lädt jedes Fenster kurz nach dem Schließen ein gzip-Objekt hoch. Warten Sie etwa eine Minute.

## 3. Objekte in RustFS prüfen

Listen Sie den Bucket auf:

```bash
rc ls rustfs/fluentd-data/ -r
```

Jedes Flush-Fenster erzeugt ein gzip-komprimiertes Objekt:

```text
fluentd-logs20260921154400_0.gz
fluentd-logs20260921154400_1.gz
```

Lesen Sie ein Objekt zurück, um zu prüfen, dass die Ereignisse unversehrt sind:

```bash
rc cat rustfs/fluentd-data/fluentd-logs20260921154400_0.gz | gunzip
```

![In der RustFS Console gespeicherte Fluentd-Log-Objekte](./images/rustfs-fluentd-logs.png)

## 4. Bereitstellung anhalten oder zurücksetzen

Stoppen Sie Fluentd und behalten Sie die Daten:

```bash
docker rm -f fluentd
```

Die Objekte bleiben im Bucket `fluentd-data`. Um sie zu löschen, entfernen Sie den Bucket:

```bash
rc rb rustfs/fluentd-data --force
```

## Fehlerbehebung

### `Unknown output plugin 's3'`

Das Plugin ist nicht installiert. Stellen Sie sicher, dass das Dockerfile `fluent-plugin-s3` als `root` installiert, bevor es zum Benutzer `fluent` zurückwechselt. Eine Installation beim Containerstart als Standardbenutzer scheitert mit Berechtigungsfehlern.

### `Failed to open TCP connection to fluentd-data.rustfs`

Es wird Adressierung im Virtual-Hosted-Stil verwendet. Fügen Sie `force_path_style true` zur Ausgabe `s3` hinzu, damit der Bucket im URL-Pfad bleibt.

### Der Worker stürzt in einer Neustartschleife ab

Die Ausgabe schlägt fehl, sobald der Bucket nicht existiert. Legen Sie `fluentd-data` an, bevor Sie Fluentd starten, und prüfen Sie das Startprotokoll:

```bash
docker logs fluentd | grep -iE "error|bucket" | tail
```

## Nächste Schritte

- Lesen Sie die [S3-Kompatibilitätshinweise](/de/administration/protocols/s3), bevor Sie weitere Fluentd-Ausgaben verwenden.
- Erstellen Sie dedizierte Produktions-Zugangsdaten über die [Zugriffsschlüssel-Verwaltung](/de/security-compliance/iam/access-token).
- Folgen Sie der [Dokumentation zu fluent-plugin-s3](https://github.com/fluent/fluent-plugin-s3) für Objektschlüssel-Formate und Komprimierungsoptionen.
