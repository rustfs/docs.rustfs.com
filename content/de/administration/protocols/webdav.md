---
title: "WebDAV"
description: "Konfigurieren Sie das WebDAV-Gateway von RustFS und greifen Sie mit WebDAV-Clients auf Buckets und Objekte zu."
---

RustFS enthält ein Gateway für Web Distributed Authoring and Versioning (WebDAV), das Buckets und Objekte über HTTP oder HTTPS für WebDAV-Clients bereitstellt. Sie können Buckets durchsuchen, Sammlungen erstellen und Objekte hochladen, herunterladen, umbenennen oder löschen, während RustFS die Berechtigungen des authentifizierten Benutzers von Identity and Access Management (IAM) durchsetzt.

Die WebDAV-Unterstützung ist im Standard-Binary von RustFS enthalten, das Gateway ist zur Laufzeit jedoch standardmäßig deaktiviert. Sie müssen es aktivieren und konfigurieren, bevor Sie einen Client verbinden.

## Überblick

Das Gateway bildet WebDAV-Pfade auf RustFS-Ressourcen ab:

| WebDAV-Pfad | RustFS-Ressource |
| --- | --- |
| `/` | Alle Buckets, die für den authentifizierten Benutzer sichtbar sind |
| `/my-bucket/` | Der Bucket `my-bucket` |
| `/my-bucket/hello.txt` | Das Objekt `hello.txt` in `my-bucket` |
| `/my-bucket/docs/hello.txt` | Das Objekt `docs/hello.txt` in `my-bucket` |

RustFS unterstützt die folgenden Operationen über das Gateway:

| Methode | Operation |
| --- | --- |
| `PROPFIND` | Buckets oder Objekte auflisten und Metadaten lesen |
| `MKCOL` | Bucket oder Verzeichnispräfix erstellen |
| `PUT` | Objekt hochladen |
| `GET` | Objekt herunterladen |
| `HEAD` | Objektmetadaten abrufen |
| `MOVE` | Objekt oder Verzeichnis umbenennen oder verschieben |
| `DELETE` | Objekt, Verzeichnis oder Bucket löschen |

Listen Sie eine Sammlung mit `PROPFIND` auf, nicht mit `GET`. Das aktuelle Gateway gibt für `GET`-Anfragen an Verzeichnisse `405 Method Not Allowed` zurück.

WebDAV verwendet die HTTP-Basic-Authentifizierung. Geben Sie einen RustFS-Zugriffsschlüssel als Benutzernamen und den zugehörigen geheimen Zugriffsschlüssel als Passwort ein. Das Gateway authentifiziert die Zugangsdaten gegen RustFS-IAM und wendet die S3-Richtlinien des Benutzers auf jede Operation an.

:::warning[Zugangsdaten schützen]

Die Basic-Authentifizierung verschlüsselt Zugangsdaten nicht. Deaktivieren Sie TLS nur für isolierte lokale Tests. Verwenden Sie HTTPS für jede entfernte oder produktive Verbindung.

:::

## Konfiguration

Konfigurieren Sie das Gateway mit Umgebungsvariablen, bevor Sie RustFS starten:

| Variable | Beschreibung | Standard |
| --- | --- | --- |
| `RUSTFS_WEBDAV_ENABLE` | Aktiviert das WebDAV-Gateway. | `false` |
| `RUSTFS_WEBDAV_ADDRESS` | Bind-Adresse für WebDAV-Verbindungen. | `0.0.0.0:8080` |
| `RUSTFS_WEBDAV_TLS_ENABLED` | Aktiviert TLS für den WebDAV-Listener. | `true` |
| `RUSTFS_WEBDAV_CERTS_DIR` | Zertifikatsverzeichnis, das die TLS-Laufzeit von RustFS verwendet. Erforderlich, wenn TLS aktiviert ist. | Nicht gesetzt |
| `RUSTFS_WEBDAV_MAX_BODY_SIZE` | Maximale Größe des Anfragekörpers in Bytes. Muss größer als null sein. | `5368709120` (5 GiB) |

Der Standard-Build von RustFS aktiviert das WebDAV-Feature zur Build-Zeit. Wenn Sie RustFS mit `--no-default-features` bauen, nehmen Sie das Feature ausdrücklich auf:

```bash
cargo build --release --features webdav
```

### Lokale Tests ohne TLS

Das folgende Beispiel startet RustFS mit einem HTTP-WebDAV-Listener auf Port `8080`:

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=127.0.0.1:8080
export RUSTFS_WEBDAV_TLS_ENABLED=false
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

Die Bindung an `127.0.0.1` verhindert, dass andere Hosts eine Verbindung zum unverschlüsselten Testendpunkt aufbauen.

### HTTPS

Aktivieren Sie für eine entfernte oder produktive Verbindung TLS und geben Sie ein Zertifikatsverzeichnis an:

```bash
export RUSTFS_WEBDAV_ENABLE=true
export RUSTFS_WEBDAV_ADDRESS=0.0.0.0:8080
export RUSTFS_WEBDAV_TLS_ENABLED=true
export RUSTFS_WEBDAV_CERTS_DIR=/path/to/certs

rustfs /path/to/data
```

Wenn TLS ohne `RUSTFS_WEBDAV_CERTS_DIR` aktiviert ist oder das Verzeichnis nicht vorhanden ist, schlägt die WebDAV-Initialisierung fehl. Hinweise zur Zertifikatsvorbereitung stehen unter [TLS konfigurieren](/de/integration/tls-configured).

Lassen Sie eingehenden TCP-Verkehr zum konfigurierten WebDAV-Port zu. Dieser Listener ist von den Listenern der S3-API und der Console getrennt.

## Verwendung

Die folgenden Befehle verwenden einen HTTP-Endpunkt für lokale Tests. Ersetzen Sie den Endpunkt und die Zugangsdaten durch Ihren HTTPS-WebDAV-Endpunkt und einen IAM-Benutzer mit den erforderlichen Bucket- und Objektberechtigungen.

Setzen Sie wiederverwendbare Shell-Variablen, ohne das Geheimnis direkt in jeden Befehl zu schreiben:

```bash
export WEBDAV_URL=http://127.0.0.1:8080
export WEBDAV_USER=<your-access-key>
read -s WEBDAV_PASSWORD
export WEBDAV_PASSWORD
```

### Buckets auflisten

Senden Sie `PROPFIND` mit `Depth: 1`, um die für den Benutzer sichtbaren Buckets aufzulisten:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/"
```

### Bucket erstellen

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/"
```

Bucket-Namen müssen denselben Namensregeln folgen wie Buckets, die über die S3-API erstellt werden.

### Objekt hochladen und herunterladen

Laden Sie `/path/to/hello.txt` hoch:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--upload-file /path/to/hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

Laden Sie das Objekt herunter:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--output hello.txt \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

### Verzeichnis erstellen und auflisten

WebDAV-Verzeichnisse unterhalb eines Buckets werden auf Präfixe von Objektschlüsseln abgebildet:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MKCOL \
	"$WEBDAV_URL/my-bucket/docs/"

curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request PROPFIND \
	--header "Depth: 1" \
	"$WEBDAV_URL/my-bucket/docs/"
```

### Objekt umbenennen

Verwenden Sie `MOVE` mit einem Zielpfad auf demselben WebDAV-Endpunkt:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request MOVE \
	--header "Destination: $WEBDAV_URL/my-bucket/greeting.txt" \
	"$WEBDAV_URL/my-bucket/hello.txt"
```

Der IAM-Benutzer benötigt die Berechtigung, die Quelle zu lesen und zu löschen und das Ziel zu schreiben. Wenn die Autorisierung fehlschlägt, lässt RustFS die Quelle unverändert.

### Objekt oder Bucket löschen

Löschen Sie ein Objekt:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/greeting.txt"
```

Löschen Sie den Bucket, nachdem Sie seinen Inhalt entfernt haben:

```bash
curl --user "$WEBDAV_USER:$WEBDAV_PASSWORD" \
	--request DELETE \
	"$WEBDAV_URL/my-bucket/"
```

### Desktop-Client verbinden

Verwenden Sie den WebDAV-Endpunkt in einem Client, der Basic-Authentifizierung unterstützt:

| Client | Verbindungsadresse |
| --- | --- |
| GNOME Files | `dav://<host>:8080/` für HTTP oder `davs://<host>:8080/` für HTTPS |
| macOS Finder | `http://<host>:8080/` oder `https://<host>:8080/` |
| Windows-Explorer | `https://<host>:8080/` |

Geben Sie den RustFS-Zugriffsschlüssel und den geheimen Zugriffsschlüssel ein, wenn der Client nach Anmeldedaten fragt. Das Verhalten des Clients und die unterstützten WebDAV-Methoden unterscheiden sich. Verwenden Sie `curl`, um serverseitige Fehler bei der Fehlerbehebung einzugrenzen.

## Nächste Schritte

- [Zugangsdaten verwalten](/de/operations/credentials)
- [TLS konfigurieren](/de/integration/tls-configured)
- [Dienststatus prüfen](/de/operations/status-check)
