---
title: "Reverse-Proxy"
description: "Wählen und konfigurieren Sie einen Reverse-Proxy für die RustFS-S3-API und die Console."
---

Verwenden Sie einen Reverse-Proxy, um die **RustFS**-S3-API und die Console (Weboberfläche) über verwaltete Hostnamen und TLS-Endpunkte bereitzustellen.

Wir empfehlen getrennte Hostnamen für die S3-API auf Port `9000` und die Console auf Port `9001`. Stellen Sie die S3-API vom Wurzelpfad ihres Hostnamens bereit, weil S3-Clients den Anfragepfad signieren.

## Unterstützte Anleitungen

- [Nginx](./nginx.md)
- [Traefik](./traefik.md)
- [Caddy](./caddy.md)
- [HAProxy](./haproxy.md)
- [Envoy](./envoy.md)
- [Apache HTTP Server](./httpd.md)

## Zugehörige Konfiguration

Siehe [Virtual-Host-Zugriff](/de/integration/virtual), wenn Clients Buckets über URLs mit Adressierung im Virtual-Hosted-Stil ansprechen.
