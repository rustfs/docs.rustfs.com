---
title: "Caddy"
description: "Stellen Sie RustFS hinter Caddy mit automatischem HTTPS für getrennte Hostnamen der S3-API und der Console bereit."
---

Verwenden Sie **Caddy**, um TLS-Zertifikate automatisch zu beziehen und zu erneuern und getrennte Hostnamen zur RustFS-S3-API und zur Console (Weboberfläche) zu leiten. In dieser Bereitstellung betreiben Sie Caddy und eine RustFS-Instanz mit einem Knoten unter Docker Compose. Sie benötigen Docker Engine, Docker Compose, einen öffentlichen Server und zwei DNS-Einträge, die auf diesen Server zeigen.

Diese Anleitung verwendet diese Beispiel-Hostnamen:

- `s3.example.com` für die S3-API
- `console.example.com` für die Console

Ersetzen Sie sie durch Ihre öffentlichen Hostnamen. Die Standard-ACME-Challenges von Caddy verlangen eingehenden Zugriff auf die Ports `80` und `443`.

:::warning[S3 vom Wurzelpfad bereitstellen]

Veröffentlichen Sie die S3-API nicht unter einem Pfad wie `/s3/`. AWS Signature Version 4 enthält den Anfragepfad und den Host, daher kann das Umschreiben eines der beiden Werte signierte Anfragen ungültig machen.

:::

## 1. Das Bereitstellungsverzeichnis anlegen

Legen Sie ein Verzeichnis für die Bereitstellung an:

```bash
mkdir rustfs-caddy
cd rustfs-caddy
```

## 2. Bereitstellungsvariablen setzen

Legen Sie eine Umgebungsdatei an und ersetzen Sie jeden Wert:

```ini title=".env"
S3_HOSTNAME=s3.example.com
CONSOLE_HOSTNAME=console.example.com
ACME_EMAIL=admin@example.com
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Verwenden Sie eine E-Mail-Adresse, die Zertifikatshinweise empfängt. Nehmen Sie `.env` nicht in die Versionsverwaltung auf.

## 3. Caddy konfigurieren

Legen Sie ein Caddyfile mit einem Site-Block je RustFS-Endpunkt an:

```text title="Caddyfile"
{
		email {$ACME_EMAIL}
}

{$S3_HOSTNAME} {
		reverse_proxy rustfs:9000 {
				health_uri /health/ready
				health_interval 10s
				health_timeout 5s
				health_fails 3
				health_passes 2
				lb_try_duration 5s
		}
}

{$CONSOLE_HOSTNAME} {
		reverse_proxy rustfs:9001 {
				health_uri /rustfs/console/health
				health_interval 10s
				health_timeout 5s
				health_fails 3
				health_passes 2
				lb_try_duration 5s
		}
}
```

Caddy behält den eingehenden Header `Host`, die HTTP-Methode und die Anfrage-URI standardmäßig bei. Es leitet außerdem Client-Informationen über Header `X-Forwarded-*` weiter und verarbeitet Console-WebSocket-Upgrades ohne zusätzliche Header-Regeln.

## 4. Die Compose-Datei anlegen

Legen Sie die Dienste Caddy und RustFS an:

```yaml title="compose.yaml"
services:
  caddy:
    image: caddy:2.10-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    environment:
      S3_HOSTNAME: ${S3_HOSTNAME}
      CONSOLE_HOSTNAME: ${CONSOLE_HOSTNAME}
      ACME_EMAIL: ${ACME_EMAIL}
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config
    networks:
      - rustfs

  rustfs:
    image: rustfs/rustfs:latest
    restart: unless-stopped
    environment:
      RUSTFS_ACCESS_KEY: ${RUSTFS_ACCESS_KEY}
      RUSTFS_SECRET_KEY: ${RUSTFS_SECRET_KEY}
      RUSTFS_CONSOLE_ENABLE: "true"
      RUSTFS_ADDRESS: ":9000"
      RUSTFS_CONSOLE_ADDRESS: ":9001"
      RUSTFS_OBS_LOGGER_LEVEL: error
      RUSTFS_OBS_LOG_DIRECTORY: /logs
    expose:
      - "9000"
      - "9001"
    volumes:
      - rustfs-data:/data
    healthcheck:
      test: ["CMD-SHELL", "curl --fail http://127.0.0.1:9000/health/ready && curl --fail http://127.0.0.1:9001/rustfs/console/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - rustfs

volumes:
  caddy-data:
  caddy-config:
  rustfs-data:

networks:
  rustfs:
```

Das persistente Volume `caddy-data` speichert Zertifikate, private Schlüssel und den Zustand des ACME-Kontos. Sichern Sie dieses Volume und teilen Sie seinen Inhalt nicht. Nur Caddy veröffentlicht Host-Ports. RustFS bleibt innerhalb des Compose-Netzwerks erreichbar.

## 5. Die Bereitstellung prüfen und starten

Rendern Sie die Compose-Konfiguration und starten Sie RustFS:

```bash
docker compose config
docker compose up -d rustfs
```

Prüfen Sie das Caddyfile mit demselben Image, das die Bereitstellung verwendet:

```bash
docker compose run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile
```

Starten Sie Caddy und prüfen Sie beide Dienste:

```bash
docker compose up -d caddy
docker compose ps
docker compose logs --follow caddy
```

Caddy bezieht Zertifikate im Hintergrund und leitet HTTP-Anfragen auf HTTPS um. Wenn die Ausstellung scheitert, prüfen Sie, dass beide DNS-Einträge auf diesen Host zeigen, dass die Ports `80` und `443` erreichbar sind und dass das Volume `caddy-data` beschreibbar ist.

## 6. Beide Endpunkte prüfen

Prüfen Sie die API und die Console über ihre öffentlichen HTTPS-Hostnamen:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Konfigurieren Sie S3-Clients mit `https://s3.example.com` als Endpunkt und aktivieren Sie pfadbasierte Adressierung (Path-Style). Öffnen Sie `https://console.example.com/rustfs/console/`, um sich an der Console anzumelden.

## Upstreams mit mehreren Knoten

Listen Sie für eine verteilte RustFS-Bereitstellung jeden Knoten im zugehörigen Site-Block auf:

```text title="Caddyfile"
{$S3_HOSTNAME} {
		reverse_proxy node1.example.net:9000 node2.example.net:9000 node3.example.net:9000 node4.example.net:9000 {
				lb_policy least_conn
				health_uri /health/ready
				health_interval 10s
				health_timeout 5s
				lb_try_duration 5s
		}
}

{$CONSOLE_HOSTNAME} {
		reverse_proxy node1.example.net:9001 node2.example.net:9001 node3.example.net:9001 node4.example.net:9001 {
				lb_policy cookie rustfs_console <your-cookie-secret>
				health_uri /rustfs/console/health
				health_interval 10s
				health_timeout 5s
				lb_try_duration 5s
		}
}
```

Ersetzen Sie `<your-cookie-secret>` durch ein zufälliges Geheimnis, das alle Caddy-Instanzen teilen. Die Console-Affinität hält eine laufende OpenID-Connect-Anmeldung auf dem RustFS-Knoten, der ihren `state` erzeugt hat. Halten Sie Port `9000` direkt zwischen den RustFS-Knoten offen, weil der interne Knoten-RPC denselben Listener verwendet.

## Nächste Schritte

- [Einen S3-Client konfigurieren](/de/developer/examples/aws-cli)
- [Bucket-URLs mit Adressierung im Virtual-Hosted-Stil aktivieren](/de/integration/virtual)
- [Endpunkte für Integritätsprüfung und Bereitschaft prüfen](/de/operations/status-check)
