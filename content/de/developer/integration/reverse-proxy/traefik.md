---
title: "Traefik"
description: "Stellen Sie RustFS hinter Traefik mit automatischem TLS für getrennte Hostnamen der S3-API und der Console bereit."
---

Verwenden Sie **Traefik** und seinen Docker-Provider, um RustFS zu entdecken, TLS-Zertifikate von Let's Encrypt zu beziehen und getrennte Hostnamen zur S3-API und zur Console (Weboberfläche) zu leiten. Sie benötigen Docker Engine, Docker Compose, einen öffentlichen Server und zwei DNS-Einträge, die auf diesen Server zeigen.

Diese Anleitung verwendet diese Beispiel-Hostnamen:

- `s3.example.com` für die S3-API
- `console.example.com` für die Console

Ersetzen Sie sie durch Ihre öffentlichen Hostnamen. Die ACME-Challenge HTTP-01 verlangt eingehenden Zugriff auf die Ports `80` und `443`.

:::warning[S3 vom Wurzelpfad bereitstellen]

Veröffentlichen Sie die S3-API nicht unter einem Pfad wie `/s3/`. AWS Signature Version 4 enthält den Anfragepfad und den Host, daher kann das Umschreiben eines der beiden Werte signierte Anfragen ungültig machen.

:::

## 1. Das Bereitstellungsverzeichnis anlegen

Legen Sie ein Verzeichnis und eine leere ACME-Speicherdatei an. Traefik verlangt restriktive Berechtigungen für diese Datei:

```bash
mkdir rustfs-traefik
cd rustfs-traefik
touch acme.json
chmod 600 acme.json
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

Verwenden Sie eine E-Mail-Adresse, die Hinweise zum Ablauf von Zertifikaten empfängt. Nehmen Sie `.env` und `acme.json` nicht in die Versionsverwaltung auf.

## 3. Die Compose-Datei anlegen

Legen Sie die Dienste Traefik und RustFS an:

```yaml title="compose.yaml"
services:
  traefik:
    image: traefik:v3.6.5
    restart: unless-stopped
    command:
      - --log.level=INFO
      - --accesslog=true
      - --providers.docker=true
      - --providers.docker.endpoint=unix:///var/run/docker.sock
      - --providers.docker.exposedbydefault=false
      - --providers.docker.network=rustfs
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --certificatesresolvers.le.acme.email=${ACME_EMAIL}
      - --certificatesresolvers.le.acme.storage=/etc/traefik/acme.json
      - --certificatesresolvers.le.acme.httpchallenge=true
      - --certificatesresolvers.le.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./acme.json:/etc/traefik/acme.json
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
    labels:
      - traefik.enable=true
      - traefik.docker.network=rustfs
      - traefik.http.routers.rustfs-s3.rule=Host(`${S3_HOSTNAME}`)
      - traefik.http.routers.rustfs-s3.entrypoints=websecure
      - traefik.http.routers.rustfs-s3.tls=true
      - traefik.http.routers.rustfs-s3.tls.certresolver=le
      - traefik.http.routers.rustfs-s3.service=rustfs-s3
      - traefik.http.services.rustfs-s3.loadbalancer.server.port=9000
      - traefik.http.services.rustfs-s3.loadbalancer.passhostheader=true
      - traefik.http.routers.rustfs-console.rule=Host(`${CONSOLE_HOSTNAME}`)
      - traefik.http.routers.rustfs-console.entrypoints=websecure
      - traefik.http.routers.rustfs-console.tls=true
      - traefik.http.routers.rustfs-console.tls.certresolver=le
      - traefik.http.routers.rustfs-console.service=rustfs-console
      - traefik.http.services.rustfs-console.loadbalancer.server.port=9001
      - traefik.http.services.rustfs-console.loadbalancer.passhostheader=true
    networks:
      - rustfs

volumes:
  rustfs-data:

networks:
  rustfs:
    name: rustfs
```

Die beiden Router verwenden unterschiedliche Host-Regeln und Backend-Ports. RustFS veröffentlicht die Ports `9000` und `9001` nicht auf dem Docker-Host, und das Traefik-Dashboard wird nicht bereitgestellt.

:::note[Zugriff auf den Docker-Socket]

Traefik liest Container-Labels über den schreibgeschützten Mount des Docker-Sockets. Wer Docker-Workloads ändern kann, kann Routen beeinflussen, die der Docker-Provider entdeckt. Schränken Sie den Docker-Zugriff auf dem Proxy-Host ein.

:::

## 4. Die Bereitstellung prüfen und starten

Rendern Sie die Compose-Konfiguration und prüfen Sie, dass alle Variablen aufgelöst werden:

```bash
docker compose config
```

Starten Sie beide Dienste:

```bash
docker compose up -d
docker compose ps
```

Folgen Sie den Traefik-Logs, während die ACME-Challenge abgeschlossen und beide Zertifikate erzeugt werden:

```bash
docker compose logs --follow traefik
```

Wenn die Zertifikatsausstellung scheitert, prüfen Sie, dass beide DNS-Einträge auf diesen Host zeigen und dass die Ports `80` und `443` aus dem Internet erreichbar sind. Let's Encrypt wendet Ratenbegrenzungen an, beheben Sie daher DNS- und Firewall-Probleme, bevor Sie die Bereitstellung wiederholt neu erstellen.

## 5. Beide Endpunkte prüfen

Prüfen Sie den Bereitschaftsendpunkt der S3-API und den Integritätsendpunkt der Console über Traefik:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Konfigurieren Sie S3-Clients mit `https://s3.example.com` als Endpunkt und aktivieren Sie pfadbasierte Adressierung (Path-Style). Öffnen Sie `https://console.example.com/rustfs/console/`, um sich an der Console anzumelden.

## Dienste mit mehreren Knoten

Aktivieren Sie für einen externen RustFS-Cluster mit mehreren Knoten den File-Provider von Traefik im Dienst `traefik`:

```yaml title="compose.yaml"
services:
  traefik:
    command:
      - --providers.file.filename=/etc/traefik/dynamic.yaml
      - --providers.file.watch=true
    volumes:
      - ./dynamic.yaml:/etc/traefik/dynamic.yaml:ro
```

Legen Sie die dynamische Konfiguration mit jedem RustFS-Knoten an:

```yaml title="dynamic.yaml"
http:
  routers:
    rustfs-s3:
      rule: Host(`s3.example.com`)
      entryPoints:
        - websecure
      service: rustfs-s3
      tls:
        certResolver: le
    rustfs-console:
      rule: Host(`console.example.com`)
      entryPoints:
        - websecure
      service: rustfs-console
      tls:
        certResolver: le

  services:
    rustfs-s3:
      loadBalancer:
        passHostHeader: true
        healthCheck:
          path: /health/ready
          interval: 10s
          timeout: 5s
        servers:
          - url: http://node1.example.net:9000
          - url: http://node2.example.net:9000
          - url: http://node3.example.net:9000
          - url: http://node4.example.net:9000
    rustfs-console:
      loadBalancer:
        passHostHeader: true
        sticky:
          cookie:
            name: rustfs_console
            secure: true
            httpOnly: true
        healthCheck:
          path: /rustfs/console/health
          interval: 10s
          timeout: 5s
        servers:
          - url: http://node1.example.net:9001
          - url: http://node2.example.net:9001
          - url: http://node3.example.net:9001
          - url: http://node4.example.net:9001
```

Konfigurieren Sie Sticky Sessions für den Console-Dienst, wenn Sie OpenID Connect verwenden. Eine laufende Anmeldung speichert ihren `state` auf einem RustFS-Knoten, und der Callback muss zu diesem Knoten zurückkehren. Halten Sie Port `9000` direkt zwischen den RustFS-Knoten offen, weil der interne Knoten-RPC denselben Listener verwendet.

## Nächste Schritte

- [Einen S3-Client konfigurieren](/de/developer/examples/aws-cli)
- [Bucket-URLs mit Adressierung im Virtual-Hosted-Stil aktivieren](/de/integration/virtual)
- [Endpunkte für Integritätsprüfung und Bereitschaft prüfen](/de/operations/status-check)
