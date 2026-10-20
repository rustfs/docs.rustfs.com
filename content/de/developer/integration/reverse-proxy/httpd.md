---
title: "Apache HTTP Server"
description: "Stellen Sie RustFS hinter dem Apache HTTP Server mit TLS-Terminierung für getrennte Hostnamen der S3-API und der Console bereit."
---

Verwenden Sie **Apache HTTP Server** (httpd), um TLS zu terminieren und getrennte Hostnamen zur RustFS-S3-API und zur Console (Weboberfläche) zu leiten. In dieser Bereitstellung betreiben Sie httpd und eine RustFS-Instanz mit einem Knoten unter Docker Compose. Sie benötigen Docker Engine, Docker Compose, zwei DNS-Einträge und ein TLS-Zertifikat, das beide Hostnamen abdeckt.

Diese Anleitung verwendet diese Beispiel-Hostnamen:

- `s3.example.com` für die S3-API
- `console.example.com` für die Console

Ersetzen Sie sie durch Hostnamen, die auf den Docker-Host zeigen.

:::warning[S3 vom Wurzelpfad bereitstellen]

Veröffentlichen Sie die S3-API nicht unter einem Pfad wie `/s3/`. AWS Signature Version 4 enthält den Anfragepfad und den Host, daher kann das Umschreiben eines der beiden Werte signierte Anfragen ungültig machen. Apache schreibt weitergeleitete URLs um, solange Sie die Kanonisierung nicht abschalten. Diese Konfiguration tut das mit `nocanon`.

:::

## 1. Die Bereitstellungsverzeichnisse anlegen

Legen Sie Verzeichnisse für die httpd-Konfiguration und das TLS-Zertifikat an:

```bash
mkdir -p rustfs-httpd/config rustfs-httpd/certs
cd rustfs-httpd
```

Kopieren Sie Ihre Zertifikatskette und den privaten Schlüssel nach `certs/`:

```text
rustfs-httpd/
├── certs/
│   ├── fullchain.pem
│   └── privkey.pem
└── config/
```

Schränken Sie den Zugriff auf den privaten Schlüssel ein:

```bash
chmod 600 certs/privkey.pem
```

Das Zertifikat muss beide öffentlichen Hostnamen abdecken.

## 2. RustFS-Zugangsdaten setzen

Legen Sie eine Umgebungsdatei an und ersetzen Sie beide Platzhalter für die Zugangsdaten:

```ini title=".env"
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Nehmen Sie diese Datei nicht in die Versionsverwaltung auf.

## 3. Das httpd-Image bauen

Das Standard-Image `httpd` liefert seine Proxy- und TLS-Module auskommentiert aus. Bauen Sie ein kleines Image, das sie aktiviert und die virtuellen Hosts von RustFS lädt:

```dockerfile title="Dockerfile"
FROM httpd:2.4-alpine

# The stock httpd image disables the proxy and TLS modules. Enable the modules
# required to terminate TLS and reverse-proxy RustFS, then load the RustFS
# virtual hosts.
RUN sed -i \
      -e 's|^#\(LoadModule socache_shmcb_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_http_module\)|\1|' \
      -e 's|^#\(LoadModule proxy_balancer_module\)|\1|' \
      -e 's|^#\(LoadModule slotmem_shm_module\)|\1|' \
      -e 's|^#\(LoadModule ssl_module\)|\1|' \
      -e 's|^#\(LoadModule http2_module\)|\1|' \
      -e 's|^#\(LoadModule lbmethod_byrequests_module\)|\1|' \
      /usr/local/apache2/conf/httpd.conf \
      && printf '\nInclude conf/rustfs.conf\n' >> /usr/local/apache2/conf/httpd.conf
```

`proxy_balancer`, `slotmem_shm` und `lbmethod_byrequests` verwendet nur die Konfiguration [mit mehreren Knoten](#backends-mit-mehreren-knoten). Sie auf Bereitstellungen mit einem Knoten zu laden, ist unschädlich.

## 4. Apache HTTP Server konfigurieren

Legen Sie die httpd-Konfiguration mit einem virtuellen Host je RustFS-Endpunkt an:

```apache title="config/rustfs.conf"
# Global settings shared by the RustFS virtual hosts.
ServerName localhost

# The stock image listens on port 80 only. Open port 443 for TLS.
Listen 443

# S3 transfers can run for hours; do not cut idle-looking connections.
Timeout 600
ProxyTimeout 600

# Share TLS sessions across connections to speed up repeated handshakes.
SSLSessionCache "shmcb:logs/ssl_scache(512000)"

# Drop only genuinely stalled clients: MinRate keeps slow-but-steady uploads
# alive while data keeps flowing.
RequestReadTimeout header=30-60,MinRate=500 body=60,MinRate=512

# Accept request bodies of any size (the default, stated explicitly).
LimitRequestBody 0

# Redirect every plain-HTTP request to HTTPS.
<VirtualHost *:80>
    ServerName s3.example.com
    Redirect permanent / https://s3.example.com/
</VirtualHost>

<VirtualHost *:80>
    ServerName console.example.com
    Redirect permanent / https://console.example.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName s3.example.com

    Protocols h2 http/1.1
    SSLEngine on
    SSLCertificateFile /usr/local/apache2/certs/fullchain.pem
    SSLCertificateKeyFile /usr/local/apache2/certs/privkey.pem

    # AWS Signature Version 4 signs the Host header and the request path.
    # Keep the client's Host, leave the path uncanonicalized, and allow
    # encoded slashes so that signed requests stay valid.
    ProxyPreserveHost On
    ProxyRequests Off
    AllowEncodedSlashes NoDecode

    # Apache does not set X-Forwarded-Proto; declare it explicitly.
    # ProxyAddHeaders (default On) adds X-Forwarded-For/Host/Server.
    RequestHeader set X-Forwarded-Proto "https"

    # nocanon passes the request path to RustFS unchanged.
    ProxyPass / http://rustfs:9000/ nocanon
    ProxyPassReverse / http://rustfs:9000/
</VirtualHost>

<VirtualHost *:443>
    ServerName console.example.com

    Protocols h2 http/1.1
    SSLEngine on
    SSLCertificateFile /usr/local/apache2/certs/fullchain.pem
    SSLCertificateKeyFile /usr/local/apache2/certs/privkey.pem

    ProxyPreserveHost On
    ProxyRequests Off

    RequestHeader set X-Forwarded-Proto "https"

    # upgrade=websocket tunnels Console WebSocket upgrades end to end;
    # regular requests continue to use plain HTTP forwarding.
    ProxyPass / http://rustfs:9001/ upgrade=websocket
    ProxyPassReverse / http://rustfs:9001/
</VirtualHost>
```

`Listen 443` ist erforderlich, weil die mitgelieferte `httpd.conf` nur Port `80` öffnet. Virtuelle Hosts allein öffnen keine Ports. Die beiden Blöcke `VirtualHost *:80` leiten den gesamten unverschlüsselten HTTP-Verkehr mit ausdrücklichen Ziel-Hostnamen auf HTTPS um.

## 5. Die Compose-Datei anlegen

Legen Sie die Dienste httpd und RustFS an:

```yaml title="compose.yaml"
services:
  httpd:
    build: .
    restart: unless-stopped
    depends_on:
      rustfs:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/rustfs.conf:/usr/local/apache2/conf/rustfs.conf:ro
      - ./certs:/usr/local/apache2/certs:ro
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

Nur httpd veröffentlicht Host-Ports. Die RustFS-Ports `9000` und `9001` bleiben innerhalb des Compose-Netzwerks erreichbar.

:::note[Log-Verzeichnis von RustFS]

`RUSTFS_OBS_LOG_DIRECTORY` muss auf ein Verzeichnis zeigen, das der Container anlegen kann. Das RustFS-Image läuft als Benutzer ohne Root-Rechte, daher funktioniert `/logs`, während Pfade unter `/var/log` den Container beim Start mit `Permission denied` beenden.

:::

## 6. Die Bereitstellung prüfen und starten

Rendern Sie die Compose-Konfiguration und starten Sie RustFS:

```bash
docker compose config
docker compose up -d rustfs
```

Prüfen Sie die httpd-Konfiguration mit demselben Image, das die Bereitstellung verwendet:

```bash
docker compose run --rm --no-deps httpd httpd -t
```

Starten Sie httpd und prüfen Sie beide Dienste:

```bash
docker compose up -d httpd
docker compose ps
```

Wenn ein Dienst nicht gesund wird, prüfen Sie seine Logs:

```bash
docker compose logs httpd
docker compose logs rustfs
```

## 7. Beide Endpunkte prüfen

Prüfen Sie die API und die Console über ihre öffentlichen HTTPS-Hostnamen:

```bash
curl --fail https://s3.example.com/health/ready
curl --fail https://console.example.com/rustfs/console/health
```

Konfigurieren Sie S3-Clients mit `https://s3.example.com` als Endpunkt und aktivieren Sie pfadbasierte Adressierung (Path-Style). Öffnen Sie `https://console.example.com/rustfs/console/`, um sich an der Console anzumelden.

:::note[Wurzelpfad der Console]

In RustFS v2.x wird die Console unter dem Pfadpräfix `/rustfs/console/` bereitgestellt. Eine Anfrage an den Wurzelpfad des Console-Hostnamens liefert eine XML-Antwort im S3-Stil mit Zugriffsverweigerung. Das ist erwartet.

:::

Wenn Sie ein erneuertes Zertifikat oder einen Schlüssel in `certs/` ersetzen, prüfen Sie die Konfiguration und laden Sie httpd graceful neu, ohne aktive Transfers abzubrechen:

```bash
docker compose exec httpd httpd -t
docker compose exec httpd httpd -k graceful
```

## So erhält diese Konfiguration S3-Signaturen

AWS Signature Version 4 signiert die HTTP-Methode, den Header `Host` und den rohen Anfragepfad. Jede der folgenden Direktiven hält einen dieser Werte bytegleich zwischen Client und RustFS:

- **`ProxyPreserveHost On`** behält den Header `Host` des Clients. Mit dem Standard (`Off`) schreibt Apache `Host` auf den Backend-Host um, und RustFS antwortet mit `SignatureDoesNotMatch`.
- **`nocanon`** in der Zeile `ProxyPass` übergibt den Anfragepfad ohne URL-Kanonisierung an RustFS. Ohne diesen Wert schreibt Apache Pfade bei der Weiterleitung um (zum Beispiel durch das Zusammenziehen von `//`), und ein signierter Pfad passt nicht mehr.
- **`AllowEncodedSlashes NoDecode`** lässt Objektschlüssel mit `%2F` die Proxy-Handler erreichen, statt `404` zurückzugeben, und erhält die Kodierung.
- **`RequestHeader set X-Forwarded-Proto "https"`** teilt RustFS das ursprüngliche Schema mit. `ProxyAddHeaders` von Apache (Standard `On`) fügt `X-Forwarded-For`, `X-Forwarded-Host` und `X-Forwarded-Server` hinzu, aber nicht `X-Forwarded-Proto`.

Vorsignierte URLs, mehrteilige Uploads und Browser-POST-Uploads beruhen auf derselben Erhaltung von Pfad und Host und brauchen keine weiteren Direktiven.

Der virtuelle Host der Console fügt `upgrade=websocket` zu seiner Zeile `ProxyPass` hinzu, damit WebSocket-Upgrades Ende zu Ende getunnelt werden. Seit 2.4.47 übernimmt `mod_proxy_http` das Upgrade selbst und tunnelt nur Verbindungen, die das Backend mit `101 Switching Protocols` annimmt. Das ältere Modul `mod_proxy_wstunnel` ist veraltet.

## Anfragekörper, große Objekte und Timeouts

Apache leitet Anfragekörper ohne Größengrenze und ohne sie auf die Platte des Proxys zu schreiben an RustFS weiter. Körper, die mit einem `Content-Length` ankommen (das senden AWS CLI, AWS-SDKs und `mc`), werden gestreamt, sobald sie eintreffen. Körper mit `Transfer-Encoding: chunked` werden ebenfalls als Chunked Encoding weitergeleitet, was RustFS ablehnt. Siehe die Warnungen unten.

Die Timeout-Direktiven tauschen Sicherheit gegen lange Transfers:

- **`Timeout 600`** deckt die Verbindungs-Ein-/Ausgabe in beide Richtungen ab, damit langsame Downloads und Uploads nicht mitten im Transfer abbrechen.
- **`ProxyTimeout 600`** wendet dasselbe Budget auf die Verbindung mit RustFS an.
- **`RequestReadTimeout`** begrenzt langsame Clients, ohne stetige zu bestrafen: eine Anfrage wird nur verworfen, wenn Header stocken oder die Körperrate unter `MinRate` fällt.
- **`LimitRequestBody 0`** nennt den Standard ausdrücklich: Anfragekörper beliebiger Größe werden akzeptiert.

:::warning[Uploads müssen ein Content-Length tragen]

RustFS lehnt als `Transfer-Encoding: chunked` weitergeleitete Anfragekörper mit `400 UnexpectedContent` ab (`This request does not support content.`). Clients müssen mit einem `Content-Length` hochladen. Alle gängigen S3-Clients tun das von sich aus, daher betrifft das nur selbst geschriebene HTTP-Skripte, die aus einer Pipe streamen. Die Standardbehandlung von Körpern in Apache wandelt kleine Chunked-Körper im Speicher in `Content-Length` um, leitet große aber als Chunked weiter. Ein solcher Client kann bei kleinen Dateien funktionieren und bei großen scheitern. `SetEnv proxy-sendcl 1` wandelt Chunked-Körper als Rückfall in `Content-Length` um, zum Preis, dass jeder Körper zuerst auf die Platte des Proxys geschrieben wird.

:::

:::warning[Vorsignierte URLs und der Header Content-Type]

Eine vorsignierte URL legt die Header fest, die ihre Signatur abdeckt. Wenn die URL ohne `Content-Type` erzeugt wurde, darf der Upload keinen hinzufügen. RustFS antwortet mit `403 SignatureDoesNotMatch` für den unsignierten Header. `curl -d` und `curl --data-binary` fügen von sich aus `Content-Type: application/x-www-form-urlencoded` hinzu. Wenn der Upload einen `Content-Type` sendet, signieren Sie die URL mit demselben Wert (der Parameter `ContentType` in den AWS-SDKs) vor und lassen Sie die Anfrage genau dazu passen.

:::

## Einstellungen, die nicht zu RustFS passen

Die folgenden Apache-Standardwerte und Optionen brechen die S3-Semantik oder verschwenden Ressourcen. Diese Konfiguration vermeidet sie alle.

| Einstellung | Auswirkung auf RustFS |
| --- | --- |
| `ProxyPreserveHost Off` (Standard) | Schreibt `Host` um; signierte Anfragen scheitern mit `SignatureDoesNotMatch`. |
| `ProxyPass` ohne `nocanon` | Kanonisiert den Anfragepfad; signierte Pfade lassen sich nicht prüfen. |
| `AllowEncodedSlashes Off` (Standard) | Liefert `404` für Objektschlüssel, die `%2F` enthalten. |
| Pfadpräfixe (`ProxyPass /s3/`, `Alias`, Rewrite-Regeln) | Schreibt den Anfragepfad um; belassen Sie die S3-API auf dem Wurzelpfad. |
| `ProxyErrorOverride On` | Ersetzt S3-XML-Fehler von RustFS durch Apache-Fehlerseiten; S3-SDKs können sie nicht lesen. |
| `SetEnv proxy-sendcl 1`, `SetEnv force-proxy-request-1.0 1` | Erzwingt upstream ein `Content-Length` und schreibt Chunked-Anfragekörper vor der Weiterleitung auf die Platte. Das rettet Clients, die nur Chunked können, fügt großen Uploads aber Platten-Ein-/Ausgabe hinzu. |
| `SetEnv proxy-sendchunked 1` | Erzwingt upstream Chunked Encoding, das RustFS mit `400 UnexpectedContent` ablehnt. |
| `mod_proxy_wstunnel` (`ProxyPass ... ws://`) | Seit 2.4.47 veraltet; verwenden Sie `upgrade=websocket` auf `mod_proxy_http`. |

Zwei Grenzen auf der RustFS-Seite sollten markiert bleiben, weil keine Proxy-Einstellung sie aufheben kann:

- Objektschlüssel mit leeren (`//`) oder Punkt-Pfadsegmenten (`.`) werden auch ohne Proxy mit `InvalidArgument` abgelehnt.
- In RustFS v2.x liegt die Console unter `/rustfs/console/`. Der Wurzelpfad der Console antwortet mit XML im S3-Stil.

## Backends mit mehreren Knoten

Ersetzen Sie für eine verteilte RustFS-Bereitstellung jedes einzelne Ziel `ProxyPass` durch einen Balancer, der jeden RustFS-Knoten auflistet. Ersetzen Sie den Proxy-Block des virtuellen S3-Hosts durch:

```apache title="config/rustfs.conf"
    <Proxy "balancer://s3">
        BalancerMember http://node1.example.net:9000 route=node1
        BalancerMember http://node2.example.net:9000 route=node2
        BalancerMember http://node3.example.net:9000 route=node3
        BalancerMember http://node4.example.net:9000 route=node4
        ProxySet lbmethod=byrequests
    </Proxy>
    ProxyPass / balancer://s3/ nocanon
    ProxyPassReverse / balancer://s3/
```

Ersetzen Sie den Proxy-Block des virtuellen Console-Hosts durch:

```apache title="config/rustfs.conf"
    # Keep an in-progress login on the node that created its state.
    Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED

    <Proxy "balancer://console">
        BalancerMember http://node1.example.net:9001 route=node1 upgrade=websocket
        BalancerMember http://node2.example.net:9001 route=node2 upgrade=websocket
        BalancerMember http://node3.example.net:9001 route=node3 upgrade=websocket
        BalancerMember http://node4.example.net:9001 route=node4 upgrade=websocket
        ProxySet stickysession=ROUTEID
    </Proxy>
    ProxyPass / balancer://console/
    ProxyPassReverse / balancer://console/
```

Das Cookie `ROUTEID` hält eine laufende OpenID-Connect-Anmeldung auf dem RustFS-Knoten, der ihren `state` erzeugt hat. Belassen Sie `upgrade=websocket` in jeder Zeile `BalancerMember`. `ProxySet` akzeptiert diesen Parameter nicht. Halten Sie Port `9000` direkt zwischen den RustFS-Knoten offen, weil der interne Knoten-RPC denselben Listener verwendet.

## Nächste Schritte

- [Einen S3-Client konfigurieren](/de/developer/examples/aws-cli)
- [Bucket-URLs mit Adressierung im Virtual-Hosted-Stil aktivieren](/de/integration/virtual)
- [Endpunkte für Integritätsprüfung und Bereitschaft prüfen](/de/operations/status-check)
