---
title: "FTP(S)"
description: "Konfigurieren Sie das FTP- oder FTPS-Gateway von RustFS und verwalten Sie Buckets und Objekte mit FTP-Clients."
---

RustFS enthält ein FTP-Gateway, das Buckets und Objekte für Standard-FTP-Clients bereitstellt. Sie können es als unverschlüsseltes FTP für isolierte lokale Tests oder als explizites FTP über TLS (FTPS) für verschlüsselte Verbindungen betreiben. RustFS authentifiziert jede Sitzung gegen Identity and Access Management (IAM) und wendet die S3-Richtlinien des Benutzers auf Speicheroperationen an.

Die Unterstützung für FTP und FTPS ist im Standard-Binary von RustFS enthalten, beide Listener sind zur Laufzeit jedoch standardmäßig deaktiviert. Aktivieren Sie nur den Listener, den Sie verwenden möchten.

## Überblick

Das Gateway bildet FTP-Pfade auf RustFS-Ressourcen ab:

| FTP-Pfad | RustFS-Ressource |
| --- | --- |
| `/` | Alle Buckets, die für den authentifizierten Benutzer sichtbar sind |
| `/my-bucket/` | Der Bucket `my-bucket` |
| `/my-bucket/hello.txt` | Das Objekt `hello.txt` in `my-bucket` |

Die folgenden FTP-Operationen werden unterstützt:

| FTP-Befehl | Operation |
| --- | --- |
| `LIST` | Buckets am Wurzelverzeichnis oder Objekte und Präfixe in einem Bucket auflisten |
| `MKD` | Bucket erstellen |
| `CWD` | Bucket betreten |
| `STOR` | Objekt hochladen |
| `RETR` | Objekt herunterladen |
| `DELE` | Objekt löschen |
| `RMD` | Bucket und seine Objekte rekursiv löschen |

RustFS unterstützt derzeit keine FTP-Umbenennungen und keine Uploads, die an ein vorhandenes Objekt angefügt werden. Weil der S3-Speicher kein natives Arbeitsverzeichnis und kein POSIX-Verzeichnismodell hat, verhalten sich manche clientspezifischen Dateisystemoperationen anders als bei einem herkömmlichen FTP-Server.

Geben Sie einen RustFS-Zugriffsschlüssel als FTP-Benutzernamen und den zugehörigen geheimen Zugriffsschlüssel als Passwort ein. Ungültige Benutzernamen und Passwörter geben beide `530 Not logged in` zurück. Nach der Anmeldung prüft RustFS die S3-Berechtigungen des IAM-Benutzers für jede Operation.

:::danger[Unverschlüsseltes FTP legt Zugangsdaten offen]

FTP sendet Zugangsdaten und Daten ohne Verschlüsselung. Binden Sie unverschlüsseltes FTP nur an ein Loopback oder ein isoliertes Testnetz. Verwenden Sie FTPS für jede entfernte oder produktive Verbindung.

:::

:::warning[Das Löschen eines Buckets ist rekursiv]

Die aktuelle Implementierung von `RMD` löscht die Objekte im Ziel-Bucket, bevor sie den Bucket löscht. Prüfen Sie den Pfad, bevor Sie `rmdir` in einem FTP-Client ausführen.

:::

## Konfiguration

FTP und FTPS verwenden getrennte Listener und Umgebungsvariablen.

### FTP-Variablen

| Variable | Beschreibung | Standard |
| --- | --- | --- |
| `RUSTFS_FTP_ENABLE` | Aktiviert den unverschlüsselten FTP-Listener. | `false` |
| `RUSTFS_FTP_ADDRESS` | Bind-Adresse für FTP-Steuerverbindungen. | `0.0.0.0:8021` |
| `RUSTFS_FTP_PASSIVE_PORTS` | Bereich passiver Datenports im Format `start-end`, einschließlich Anfang und Ende. | `40000-50000` |
| `RUSTFS_FTP_EXTERNAL_IP` | Öffentliche IP oder öffentlicher Hostname, der passiven Clients mitgeteilt wird, wenn RustFS hinter NAT steht. | Nicht gesetzt |

### FTPS-Variablen

| Variable | Beschreibung | Standard |
| --- | --- | --- |
| `RUSTFS_FTPS_ENABLE` | Aktiviert den Listener für explizites FTPS. | `false` |
| `RUSTFS_FTPS_ADDRESS` | Bind-Adresse für FTPS-Steuerverbindungen. | `0.0.0.0:8022` |
| `RUSTFS_FTPS_TLS_ENABLED` | Aktiviert TLS auf dem FTPS-Listener. Lassen Sie dies für FTPS aktiviert. | `true` |
| `RUSTFS_FTPS_CERTS_DIR` | Verzeichnis mit dem FTPS-Zertifikat und dem privaten Schlüssel. Für FTPS erforderlich. | Nicht gesetzt |
| `RUSTFS_FTPS_PASSIVE_PORTS` | Bereich passiver Datenports im Format `start-end`, einschließlich Anfang und Ende. | `40000-50000` |
| `RUSTFS_FTPS_EXTERNAL_IP` | Öffentliche IP oder öffentlicher Hostname, der passiven Clients mitgeteilt wird, wenn RustFS hinter NAT steht. | Nicht gesetzt |

Der Standard-Build von RustFS aktiviert das Feature `ftps` zur Build-Zeit, das sowohl FTP als auch FTPS bereitstellt. Wenn Sie RustFS mit `--no-default-features` bauen, nehmen Sie das Feature ausdrücklich auf:

```bash
cargo build --release --features ftps
```

### Lokale Tests mit FTP

Starten Sie einen unverschlüsselten FTP-Listener auf der Loopback-Schnittstelle:

```bash
export RUSTFS_FTP_ENABLE=true
export RUSTFS_FTP_ADDRESS=127.0.0.1:8021
export RUSTFS_FTP_PASSIVE_PORTS=40000-40010
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

Die Bindung an `127.0.0.1` verhindert, dass entfernte Hosts eine Verbindung zum unverschlüsselten Listener aufbauen.

### Testzertifikat vorbereiten

FTPS erwartet `rustfs_cert.pem` und `rustfs_key.pem` im Zertifikatsverzeichnis. Erstellen Sie für lokale Tests ein kurzlebiges selbstsigniertes Zertifikat:

```bash
mkdir -p /path/to/ftps-certs

openssl req -x509 -newkey rsa:2048 -nodes \
	-keyout /path/to/ftps-certs/rustfs_key.pem \
	-out /path/to/ftps-certs/rustfs_cert.pem \
	-days 7 \
	-subj "/CN=localhost" \
	-addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

Verwenden Sie in der Produktion ein Zertifikat einer vertrauenswürdigen Zertifizierungsstelle. Schützen Sie `rustfs_key.pem` vor unberechtigtem Zugriff und stellen Sie sicher, dass die Subject Alternative Names des Zertifikats zum Host passen, den Clients verwenden.

### FTPS starten

Konfigurieren Sie einen Listener für explizites FTPS:

```bash
export RUSTFS_FTPS_ENABLE=true
export RUSTFS_FTPS_ADDRESS=0.0.0.0:8022
export RUSTFS_FTPS_TLS_ENABLED=true
export RUSTFS_FTPS_CERTS_DIR=/path/to/ftps-certs
export RUSTFS_FTPS_PASSIVE_PORTS=40000-50000

rustfs /path/to/data
```

RustFS verlangt TLS sowohl auf dem FTPS-Steuerkanal als auch auf dem Datenkanal. Konfigurieren Sie Clients für **explicit FTP over TLS** (explizites FTP über TLS), manchmal bezeichnet als **FTPES** oder **Require explicit FTP over TLS**. Implizites FTPS ist nicht der Modus, den dieser Listener implementiert.

Wenn das Zertifikatsverzeichnis fehlt, nicht vorhanden ist oder kein verwendbares Zertifikat und keinen verwendbaren Schlüssel enthält, schlägt die FTPS-Initialisierung fehl. Allgemeine Hinweise zu Zertifikaten stehen unter [TLS konfigurieren](/de/integration/tls-configured).

### Passive Verbindungen konfigurieren

FTP verwendet den Steuerport für Befehle und eine separate Datenverbindung für Auflistungen und Dateiübertragungen. Für den passiven Modus:

1. Lassen Sie eingehenden TCP-Verkehr zum konfigurierten Steuerport zu.
2. Lassen Sie eingehenden TCP-Verkehr zu jedem Port im konfigurierten passiven Bereich zu.
3. Setzen Sie `RUSTFS_FTP_EXTERNAL_IP` oder `RUSTFS_FTPS_EXTERNAL_IP`, wenn Clients über NAT oder einen Load Balancer verbinden.

Ein FTPS-Server hinter NAT kann beispielsweise seinen öffentlichen Hostnamen bekannt geben:

```bash
export RUSTFS_FTPS_EXTERNAL_IP=storage.example.com
export RUSTFS_FTPS_PASSIVE_PORTS=40000-40100
```

Verwenden Sie die entsprechenden Variablen mit FTP-Präfix für den unverschlüsselten FTP-Listener. RustFS unterstützt den aktiven und den passiven Übertragungsmodus. Der passive Modus lässt sich durch Client-Firewalls in der Regel leichter betreiben.

## Verwendung

Die Beispiele verwenden [`lftp`](https://lftp.yar.ru/) sowie die kanonischen Namen `my-bucket` und `hello.txt`. Der IAM-Benutzer muss die S3-Berechtigungen besitzen, die jede Operation erfordert.

### Mit FTP verbinden

Verwenden Sie unverschlüsseltes FTP nur mit dem Loopback-Testlistener:

```bash
lftp -u <your-access-key> ftp://127.0.0.1:8021
```

Geben Sie den geheimen Zugriffsschlüssel ein, wenn `lftp` nach einem Passwort fragt.

### Mit FTPS verbinden

Verbinden Sie sich mit dem Listener für explizites FTPS und verlangen Sie Verschlüsselung für Steuer- und Datenverbindungen:

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	open ftp://storage.example.com:8022
'
```

Geben Sie den geheimen Zugriffsschlüssel ein, wenn Sie dazu aufgefordert werden. Lassen Sie die Zertifikatsprüfung in der Produktion aktiviert.

Nur für das selbstsignierte lokale Testzertifikat verbinden Sie sich mit `localhost` und deaktivieren Sie die Zertifikatsprüfung für diese Sitzung:

```bash
lftp -u <your-access-key> -e '
	set ftp:ssl-force true;
	set ftp:ssl-protect-data true;
	set ssl:verify-certificate no;
	open ftp://localhost:8022
'
```

:::warning

Deaktivieren Sie die Zertifikatsprüfung nicht in der Produktion. Installieren Sie stattdessen die ausstellende Zertifizierungsstelle im Vertrauensspeicher des Clients.

:::

### Buckets auflisten und einen Bucket erstellen

Listen Sie an der `lftp`-Eingabeaufforderung die sichtbaren Buckets auf und erstellen Sie `my-bucket`:

```text
lftp> cls -1 /
lftp> mkdir my-bucket
lftp> cd my-bucket
```

Bucket-Namen müssen denselben Namensregeln folgen wie Buckets, die über die S3-API erstellt werden.

### Objekt hochladen und herunterladen

Laden Sie `/path/to/hello.txt` hoch, listen Sie den Bucket auf und laden Sie das Objekt herunter:

```text
lftp> put /path/to/hello.txt -o hello.txt
lftp> ls
lftp> get hello.txt -o hello.txt
```

Der Upload ersetzt ein Objekt mit demselben Objektschlüssel. Das Anfügen an ein vorhandenes Objekt wird nicht unterstützt.

### Objekt und Bucket löschen

Löschen Sie das Objekt, kehren Sie zum Wurzelverzeichnis zurück und löschen Sie den Bucket:

```text
lftp> rm hello.txt
lftp> cd /
lftp> rmdir my-bucket
```

Denken Sie daran, dass `rmdir` verbleibende Objekte rekursiv aus dem Bucket entfernt, bevor es ihn löscht.

### Andere Clients verbinden

Verwenden Sie diese Einstellungen in grafischen FTP-Clients wie FileZilla oder Cyberduck:

| Einstellung | FTP-Testlistener | FTPS-Listener |
| --- | --- | --- |
| Protokoll | FTP | FTP over TLS (explicit) |
| Host | `127.0.0.1` | Ihr FTPS-Hostname |
| Port | `8021` | `8022` |
| Benutzername | RustFS-Zugriffsschlüssel | RustFS-Zugriffsschlüssel |
| Passwort | Geheimer Zugriffsschlüssel von RustFS | Geheimer Zugriffsschlüssel von RustFS |
| Übertragungsmodus | Passiv | Passiv |

Wenn die Anmeldung gelingt, Verzeichnisauflistungen oder Übertragungen aber in ein Zeitlimit laufen, prüfen Sie zuerst die Firewall-Regeln der passiven Ports und die Einstellung der externen IP.

## Nächste Schritte

- [Zugangsdaten verwalten](/de/operations/credentials)
- [TLS konfigurieren](/de/integration/tls-configured)
- [Dienststatus prüfen](/de/operations/status-check)
