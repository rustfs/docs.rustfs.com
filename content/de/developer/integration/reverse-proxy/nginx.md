---
title: "Nginx"
description: "Stellen Sie RustFS hinter Nginx mit getrennten HTTPS-Endpunkten für die S3-API und die Console bereit."
---

Verwenden Sie **Nginx**, um TLS zu terminieren und getrennte Hostnamen zur RustFS-S3-API und zur Console (Weboberfläche) zu leiten. In dieser Bereitstellung betreiben Sie Nginx und eine RustFS-Instanz mit einem Knoten unter Docker Compose. Sie benötigen Docker Engine, Docker Compose, zwei DNS-Einträge und ein TLS-Zertifikat, das beide Hostnamen abdeckt.

Diese Anleitung verwendet diese Beispiel-Hostnamen:

- `s3.example.com` für die S3-API
- `console.example.com` für die Console

Ersetzen Sie sie durch Hostnamen, die auf den Docker-Host zeigen.

:::warning[S3 vom Wurzelpfad bereitstellen]

Veröffentlichen Sie die S3-API nicht unter einem Pfad wie `/s3/`. AWS Signature Version 4 enthält den Anfragepfad und den Host, daher kann das Umschreiben eines der beiden Werte signierte Anfragen ungültig machen.

:::

## 1. Die Bereitstellungsverzeichnisse anlegen

Legen Sie Verzeichnisse für die Nginx-Konfiguration und das TLS-Zertifikat an:

```bash
mkdir -p rustfs-nginx/sites rustfs-nginx/certs
cd rustfs-nginx
```

Kopieren Sie Ihre Zertifikatskette und den privaten Schlüssel nach `certs/`:

```text
rustfs-nginx/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── sites/
```

Schränken Sie den Zugriff auf den privaten Schlüssel ein:

```bash
chmod 600 certs/privkey.pem
```

## 2. RustFS-Zugangsdaten setzen

Legen Sie eine Umgebungsdatei an und ersetzen Sie beide Platzhalter für die Zugangsdaten:

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Nehmen Sie diese Datei nicht in die Versionsverwaltung auf.

## 3. Nginx konfigurieren

Legen Sie die Nginx-Konfiguration an:

```nginx title="sites/rustfs.conf"
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      '';
}

upstream rustfs_s3 {
    server rustfs:9000;
    keepalive 32;
}

upstream rustfs_console {
    server rustfs:9001;
    keepalive 16;
}

server {
    listen 80;
    listen [::]:80;
    server_name s3.example.com console.example.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name s3.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    ignore_invalid_headers off;
    client_max_body_size 0;
    proxy_buffering off;
    proxy_request_buffering off;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection '';
        proxy_cache_convert_head off;
        proxy_connect_timeout 300s;
        chunked_transfer_encoding off;
        proxy_pass http://rustfs_s3;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name console.example.com;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    client_max_body_size 0;
    proxy_buffering off;
    proxy_request_buffering off;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_connect_timeout 300s;
        proxy_pass http://rustfs_console;
    }
}
```

Der S3-Server behält den ursprünglichen Host und den Anfragepfad, deaktiviert die Anfragepufferung für Streaming-Uploads und wandelt signierte `HEAD`-Anfragen nicht um. Der Console-Server leitet außerdem die Header für WebSocket-Upgrades weiter.

## 4. Die Compose-Datei anlegen

Legen Sie die Bereitstellungsdefinition an:

```yaml title="compose.yaml"
services:
  nginx:
    image: nginx:1.25-alpine
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./sites/rustfs.conf:/etc/nginx/conf.d/rustfs.conf:ro
      - ./certs:/etc/nginx/certs:ro
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

Nur Nginx veröffentlicht Host-Ports. Die RustFS-Ports `9000` und `9001` bleiben innerhalb des Compose-Netzwerks erreichbar.

## 5. Die Bereitstellung prüfen und starten

Prüfen Sie beide Konfigurationsdateien, bevor Sie die Dienste starten:

```bash
docker compose config
docker compose up -d rustfs
docker compose run --rm --no-deps nginx nginx -t
```

Starten Sie Nginx und prüfen Sie beide Dienste:

```bash
docker compose up -d nginx
docker compose ps
```

Wenn ein Dienst nicht gesund wird, prüfen Sie seine Logs:

```bash
docker compose logs nginx
docker compose logs rustfs
```

## 6. Beide Endpunkte prüfen

Prüfen Sie die API und die Console über ihre öffentlichen HTTPS-Hostnamen:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Konfigurieren Sie S3-Clients mit `https://s3.example.com` als Endpunkt und aktivieren Sie pfadbasierte Adressierung (Path-Style). Öffnen Sie `https://console.example.com/rustfs/console/`, um sich an der Console anzumelden.

Wenn Sie ein erneuertes Zertifikat oder einen Schlüssel in `certs/` ersetzen, prüfen Sie Nginx und laden Sie es neu, ohne aktive Verbindungen zu unterbrechen:

```bash
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

## Upstreams mit mehreren Knoten

Ersetzen Sie für eine verteilte RustFS-Bereitstellung den einzelnen Server in jedem Upstream durch alle RustFS-Knoten:

```nginx title="sites/rustfs.conf"
upstream rustfs_s3 {
    least_conn;
    server node1.example.net:9000;
    server node2.example.net:9000;
    server node3.example.net:9000;
    server node4.example.net:9000;
  keepalive 32;
}

upstream rustfs_console {
    ip_hash;
    server node1.example.net:9001;
    server node2.example.net:9001;
    server node3.example.net:9001;
    server node4.example.net:9001;
  keepalive 16;
}
```

Der Console-Upstream verwendet Client-Affinität, weil eine laufende OpenID-Connect-Anmeldung ihren `state` auf einem RustFS-Knoten speichert. Halten Sie Port `9000` zwischen den RustFS-Knoten offen, weil der interne Knoten-RPC denselben Listener verwendet.

## Nächste Schritte

- [Einen S3-Client konfigurieren](/de/developer/examples/aws-cli)
- [Bucket-URLs mit Adressierung im Virtual-Hosted-Stil aktivieren](/de/integration/virtual)
- [Endpunkte für Integritätsprüfung und Bereitschaft prüfen](/de/operations/status-check)
