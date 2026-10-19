---
title: "Envoy"
description: "Stellen Sie RustFS hinter Envoy mit TLS-terminierten Routen für die S3-API und die Console bereit."
---

Verwenden Sie **Envoy**, um TLS zu terminieren und getrennte Hostnamen zur RustFS-S3-API und zur Console (Weboberfläche) zu leiten. In dieser Bereitstellung betreiben Sie Envoy und eine RustFS-Instanz mit einem Knoten in einem Docker-Netzwerk. Sie benötigen Docker Engine, zwei DNS-Einträge und ein TLS-Zertifikat, das beide Hostnamen abdeckt (die Anleitung verwendet zum Testen ein selbst signiertes Zertifikat).

Diese Anleitung verwendet diese Beispiel-Hostnamen:

- `s3.example.com` für die S3-API
- `console.example.com` für die Console

Ersetzen Sie sie durch Hostnamen, die auf den Docker-Host zeigen.

:::warning[S3 vom Wurzelpfad bereitstellen]

Veröffentlichen Sie die S3-API nicht unter einem Pfad wie `/s3/`. AWS Signature Version 4 enthält den Anfragepfad und den Host, daher kann das Umschreiben eines der beiden Werte signierte Anfragen ungültig machen. Envoy leitet den eingehenden Header `Host` unverändert weiter, wodurch Signaturen gültig bleiben.

:::

## 1. Die Bereitstellungsverzeichnisse anlegen

Legen Sie Verzeichnisse für die Envoy-Konfiguration und das TLS-Zertifikat an:

```bash
mkdir -p rustfs-envoy/certs
cd rustfs-envoy
```

Erzeugen Sie für lokale Tests ein selbst signiertes Zertifikat, das beide Hostnamen abdeckt:

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout certs/privkey.pem -out certs/fullchain.pem -days 30 \
  -subj "/CN=*.example.com" \
  -addext "subjectAltName=DNS:s3.example.com,DNS:console.example.com"
chmod 644 certs/privkey.pem
```

Machen Sie das Zertifikat für den Benutzer ohne Root-Rechte lesbar, unter dem das Envoy-Image läuft. Ein privater Schlüssel mit `600` erzeugt den irreführenden Fehler `Failed to load incomplete private key`.

## 2. Envoy konfigurieren

Legen Sie die Konfiguration mit einem HTTPS-Listener und zwei virtuellen Hosts an. Route-Timeouts sind deaktiviert (`timeout: 0s`), damit lange Streaming-S3-Uploads nicht abgeschnitten werden:

```yaml title="envoy.yaml"
static_resources:
  listeners:
  - name: https
    address: {socket_address: {address: 0.0.0.0, port_value: 8443}}
    filter_chains:
    - transport_socket:
        name: envoy.transport_sockets.tls
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext
          common_tls_context:
            tls_certificates:
            - certificate_chain: {filename: /certs/fullchain.pem}
              private_key: {filename: /certs/privkey.pem}
      filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: rustfs_https
          route_config:
            virtual_hosts:
            - name: s3
              domains: ["s3.example.com", "s3.example.com:*"]
              routes:
              - match: {prefix: "/"}
                route: {cluster: rustfs_s3, timeout: 0s}
            - name: console
              domains: ["console.example.com", "console.example.com:*"]
              routes:
              - match: {prefix: "/"}
                route: {cluster: rustfs_console, timeout: 0s}
          http_filters:
          - name: envoy.filters.http.router
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router
  clusters:
  - name: rustfs_s3
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_s3
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: rustfs, port_value: 9000}}}
  - name: rustfs_console
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_console
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: rustfs, port_value: 9001}}}
```

Die Domäneneinträge `host:*` sind wichtig: Clients senden auf Nicht-Standard-Ports `Host: s3.example.com:8443`, und Envoy vergleicht die Authority einschließlich des Ports.

## 3. Envoy starten

Starten Sie Envoy im selben Docker-Netzwerk wie RustFS und veröffentlichen Sie nur den Proxy-Port:

```bash
docker run -d --name envoy --network oo-rustfs_default -p 8443:8443 \
  -v "$PWD/envoy.yaml":/envoy.yaml:ro \
  -v "$PWD/certs":/certs:ro \
  envoyproxy/envoy:v1.34-latest -c /envoy.yaml
```

## 4. Beide Endpunkte prüfen

Richten Sie die Beispiel-Hostnamen mit `curl --resolve` auf den Proxy (in der Produktion übernimmt das DNS):

```bash
curl -sk --resolve s3.example.com:8443:127.0.0.1 \
  https://s3.example.com:8443/health/ready -o /dev/null -w "s3 api: %{http_code}\n"

curl -sk --resolve console.example.com:8443:127.0.0.1 \
  https://console.example.com:8443/rustfs/console/ -o /dev/null -w "console: %{http_code}\n"
```

```text
s3 api: 200
console: 200
```

`-k` überspringt die Zertifikatsprüfung, weil das Zertifikat selbst signiert ist. Bei einem vertrauenswürdigen Zertifikat lassen Sie es weg.

## 5. Signierte S3-Anfragen über Envoy senden

Richten Sie einen beliebigen S3-Client auf den Proxy aus, als wäre er RustFS. Konfigurieren Sie den Client mit `https://s3.example.com:8443` als Endpunkt und mit pfadbasierter Adressierung (Path-Style). Wenn dem Proxy-Zertifikat vertraut wird, laufen signierte Anfragen mit AWS Signature Version 4 unverändert durch. Fügen Sie für einen schnellen Test über unverschlüsseltes HTTP einen HTTP-Listener auf Port 8080 mit demselben Virtual-Host-Routing wie der HTTPS-Listener hinzu und verwenden Sie dann den Endpunkt `http://s3.example.com:8080`:

```bash
rc alias set rustfs-envoy http://s3.example.com:8080 <your-access-key> <your-secret-key>
rc ls rustfs-envoy/rclone-demo/
```

```text
[                   ]         0B seed/
[2026-09-29 11:12:41]        5 B write-test.txt
```

Die Signaturen bleiben gültig, weil Envoy den ursprünglichen Header `Host` an RustFS weiterleitet.

## Backends mit mehreren Knoten

Fügen Sie für eine verteilte RustFS-Bereitstellung jeden Knoten zum S3-Cluster hinzu:

```yaml title="envoy.yaml"
  - name: rustfs_s3
    connect_timeout: 5s
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: rustfs_s3
      endpoints:
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node1, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node2, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node3, port_value: 9000}}}
      - lb_endpoints:
        - endpoint: {address: {socket_address: {address: node4, port_value: 9000}}}
```

Der Console-Cluster folgt demselben Muster auf Port `9001`.

## Fehlerbehebung

### `Failed to load incomplete private key from path`

Der Envoy-Container läuft als Benutzer ohne Root-Rechte und kann einen root-eigenen Schlüssel mit `600` nicht lesen. Setzen Sie die Schlüsseldateien mit `chmod 644` (oder ändern Sie den Eigentümer auf den Container-Benutzer, UID `1001` im offiziellen Image).

### Routen antworten mit `404` bei den richtigen Hostnamen

Envoy vergleicht die Authority einschließlich des Ports. Fügen Sie die Varianten `host:*` zur Liste `domains` jedes virtuellen Hosts hinzu, wie in der Konfiguration oben.

### `Access Denied` von RustFS bei weitergeleiteten Anfragen

Prüfen Sie, dass der Proxy den Pfad und den Header `Host` nicht umschreibt. Signierte Anfragen müssen RustFS mit dem Host erreichen, für den der Client signiert hat.

## Nächste Schritte

- [Einen S3-Client konfigurieren](/de/developer/examples/aws-cli)
- [Bucket-URLs mit Adressierung im Virtual-Hosted-Stil aktivieren](/de/integration/virtual)
- [Endpunkte für Integritätsprüfung und Bereitschaft prüfen](/de/operations/status-check)
