---
title: "HAProxy"
description: "Stellen Sie RustFS hinter HAProxy mit getrennten HTTPS-Routen für die S3-API und die Console bereit."
---

Verwenden Sie **HAProxy**, um TLS zu terminieren und getrennte Hostnamen zur RustFS-S3-API und zur Console (Weboberfläche) zu leiten. In dieser Bereitstellung betreiben Sie HAProxy und eine RustFS-Instanz mit einem Knoten unter Docker Compose. Sie benötigen Docker Engine, Docker Compose, zwei DNS-Einträge und ein TLS-Zertifikat, das beide Hostnamen abdeckt.

Diese Anleitung verwendet diese Beispiel-Hostnamen:

- `s3.example.com` für die S3-API
- `console.example.com` für die Console

Ersetzen Sie sie durch Hostnamen, die auf den Docker-Host zeigen.

:::warning[S3 vom Wurzelpfad bereitstellen]

Veröffentlichen Sie die S3-API nicht unter einem Pfad wie `/s3/`. AWS Signature Version 4 enthält den Anfragepfad und den Host, daher kann das Umschreiben eines der beiden Werte signierte Anfragen ungültig machen.

:::

## 1. Die Bereitstellungsverzeichnisse anlegen

Legen Sie Verzeichnisse für die HAProxy-Konfiguration und das TLS-Zertifikat an:

```bash
mkdir -p rustfs-haproxy/config rustfs-haproxy/certs
cd rustfs-haproxy
```

HAProxy erwartet die Zertifikatskette und den privaten Schlüssel in einer PEM-Datei. Verbinden Sie sie in dieser Reihenfolge:

```bash
cat fullchain.pem privkey.pem > certs/rustfs.pem
chmod 600 certs/rustfs.pem
```

Das Zertifikat muss beide öffentlichen Hostnamen abdecken.

## 2. RustFS-Zugangsdaten setzen

Legen Sie eine Umgebungsdatei an und ersetzen Sie beide Platzhalter für die Zugangsdaten:

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Nehmen Sie diese Datei und den privaten Schlüssel des Zertifikats nicht in die Versionsverwaltung auf.

## 3. HAProxy konfigurieren

Legen Sie die HAProxy-Konfiguration an:

```text title="config/haproxy.cfg"
global
    log stdout format raw local0

defaults
    log global
    mode http
    option httplog
    timeout connect 10s
    timeout client 1h
    timeout server 1h
    timeout http-request 30s
    timeout tunnel 1h

frontend http
    bind :80
    http-request redirect scheme https code 301

frontend https
    bind :443 ssl crt /usr/local/etc/haproxy/certs/rustfs.pem alpn h2,http/1.1

    acl host_s3 hdr(host) -i s3.example.com
    acl host_console hdr(host) -i console.example.com

    use_backend rustfs_s3 if host_s3
    use_backend rustfs_console if host_console
    default_backend reject_unknown_host

backend reject_unknown_host
    http-request deny deny_status 404

backend rustfs_s3
    balance leastconn
    option httpchk GET /health/ready
    http-check expect status 200
    server rustfs rustfs:9000 check inter 10s fall 3 rise 2

backend rustfs_console
    balance leastconn
    cookie RUSTFS_CONSOLE insert indirect nocache secure httponly
    option httpchk GET /rustfs/console/health
    http-check expect status 200
    server rustfs rustfs:9001 check inter 10s fall 3 rise 2 cookie rustfs
```

HAProxy behält den eingehenden Host und den Anfragepfad bei, solange Sie sie nicht ausdrücklich umschreiben. Die langen Timeouts für Client, Server und Tunnel nehmen Streaming-S3-Operationen und Console-WebSocket-Verbindungen auf.

Das Console-Backend setzt ein Affinitäts-Cookie. Bei einem RustFS-Server hat es keine Routing-Wirkung, aber wenn Sie es in der Grundkonfiguration belassen, bleibt das Verhalten gleich, sobald Sie Knoten hinzufügen.

## 4. Die Compose-Datei anlegen

Legen Sie die Dienste HAProxy und RustFS an:

```yaml title="compose.yaml"
services:
  haproxy:
    image: haproxy:3.2-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro
      - ./certs:/usr/local/etc/haproxy/certs:ro
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
  rustfs-data:

networks:
  rustfs:
```

Nur HAProxy veröffentlicht Host-Ports. Die RustFS-Ports `9000` und `9001` bleiben innerhalb des Compose-Netzwerks erreichbar.

## 5. Die Bereitstellung prüfen und starten

Rendern Sie die Compose-Konfiguration und starten Sie RustFS:

```bash
docker compose config
docker compose up -d rustfs
```

Prüfen Sie die HAProxy-Konfiguration mit demselben Image, das die Bereitstellung verwendet:

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
```

Starten Sie HAProxy und prüfen Sie beide Dienste:

```bash
docker compose up -d haproxy
docker compose ps
```

Wenn ein Dienst nicht gesund wird, prüfen Sie seine Logs:

```bash
docker compose logs haproxy
docker compose logs rustfs
```

## 6. Beide Endpunkte prüfen

Prüfen Sie die API und die Console über ihre öffentlichen HTTPS-Hostnamen:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Konfigurieren Sie S3-Clients mit `https://s3.example.com` als Endpunkt und aktivieren Sie pfadbasierte Adressierung (Path-Style). Öffnen Sie `https://console.example.com/rustfs/console/`, um sich an der Console anzumelden.

Wenn Sie eine erneuerte Datei `certs/rustfs.pem` ersetzen, prüfen Sie die Konfiguration und erstellen Sie den HAProxy-Container neu, um sie zu laden:

```bash
docker compose run --rm --no-deps haproxy haproxy -c -f /usr/local/etc/haproxy/haproxy.cfg
docker compose up -d --force-recreate haproxy
```

## Backends mit mehreren Knoten

Fügen Sie für eine verteilte RustFS-Bereitstellung jeden RustFS-Knoten zu beiden Backends hinzu:

```text title="config/haproxy.cfg"
backend rustfs_s3
		balance leastconn
		option httpchk GET /health/ready
		http-check expect status 200
		server node1 node1.example.net:9000 check inter 10s fall 3 rise 2
		server node2 node2.example.net:9000 check inter 10s fall 3 rise 2
		server node3 node3.example.net:9000 check inter 10s fall 3 rise 2
		server node4 node4.example.net:9000 check inter 10s fall 3 rise 2

backend rustfs_console
		balance leastconn
		cookie RUSTFS_CONSOLE insert indirect nocache secure httponly
		option httpchk GET /rustfs/console/health
		http-check expect status 200
		server node1 node1.example.net:9001 check inter 10s fall 3 rise 2 cookie node1
		server node2 node2.example.net:9001 check inter 10s fall 3 rise 2 cookie node2
		server node3 node3.example.net:9001 check inter 10s fall 3 rise 2 cookie node3
		server node4 node4.example.net:9001 check inter 10s fall 3 rise 2 cookie node4
```

Das Console-Cookie hält eine laufende OpenID-Connect-Anmeldung auf dem RustFS-Knoten, der ihren `state` erzeugt hat. Halten Sie Port `9000` direkt zwischen den RustFS-Knoten offen, weil der interne Knoten-RPC denselben Listener verwendet.

## Nächste Schritte

- [Einen S3-Client konfigurieren](/de/developer/examples/aws-cli)
- [Bucket-URLs mit Adressierung im Virtual-Hosted-Stil aktivieren](/de/integration/virtual)
- [Endpunkte für Integritätsprüfung und Bereitschaft prüfen](/de/operations/status-check)
