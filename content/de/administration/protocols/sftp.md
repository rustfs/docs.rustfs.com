---
title: "SFTP"
description: "Bauen, konfigurieren und verwenden Sie das SFTP-Gateway von RustFS, um mit SFTP-Clients auf Buckets und Objekte zuzugreifen."
---

RustFS enthält ein Gateway für das SSH File Transfer Protocol (SFTP), das Buckets und Objekte über eine verschlüsselte SSH-Verbindung für SFTP-Clients bereitstellt. Sie können Buckets auflisten und erstellen sowie Objekte hochladen, herunterladen, umbenennen oder löschen, während RustFS die Berechtigungen des authentifizierten Benutzers von Identity and Access Management (IAM) durchsetzt.

SFTP ist ein optionales Feature zur Build-Zeit und nicht im Standard-Build von RustFS enthalten. Bauen Sie RustFS mit dem Feature `sftp` oder `full`, bevor Sie den Listener aktivieren. Der Listener ist zur Laufzeit standardmäßig deaktiviert.

## Überblick

Das Gateway bildet SFTP-Pfade auf RustFS-Ressourcen ab:

| SFTP-Pfad | RustFS-Ressource |
| --- | --- |
| `/` | Alle Buckets, die für den authentifizierten Benutzer sichtbar sind |
| `/my-bucket/` | Der Bucket `my-bucket` |
| `/my-bucket/hello.txt` | Das Objekt `hello.txt` in `my-bucket` |
| `/my-bucket/docs/hello.txt` | Das Objekt `docs/hello.txt` in `my-bucket` |

Das Erstellen oder Entfernen eines Verzeichnisses direkt unter `/` erstellt oder entfernt einen Bucket. Verzeichnisse unterhalb eines Buckets werden auf Präfixe von Objektschlüsseln abgebildet und existieren nicht als eigenständige Dateisystemverzeichnisse.

RustFS unterstützt die folgenden Operationen über das SFTP-Gateway:

| SFTP-Operation | RustFS-Operation |
| --- | --- |
| `/` auflisten | Sichtbare Buckets auflisten |
| Bucket oder Präfix auflisten | Objekte und Präfixe auflisten |
| `mkdir` unter `/` | Bucket erstellen |
| `put` | Objekt hochladen |
| `get` | Objekt herunterladen |
| `rename` | Objekt kopieren und anschließend die Quelle löschen |
| `rm` | Objekt löschen |
| `rmdir` unter `/` | Leeren Bucket löschen |

Geben Sie einen RustFS-Zugriffsschlüssel als SFTP-Benutzernamen und den zugehörigen geheimen Zugriffsschlüssel als Passwort ein. RustFS prüft die S3-Richtlinien des IAM-Benutzers für jede Operation.

:::warning[Nur Passwortauthentifizierung]

Das SFTP-Gateway unterstützt keine Authentifizierung mit öffentlichen Client-Schlüsseln und keinen anonymen Zugriff. SSH-Host-Schlüssel identifizieren den Server. Sie authentifizieren keine Clients. Konfigurieren Sie für RustFS-SFTP keine Datei `authorized_keys`.

:::

## Konfiguration

### Mit SFTP-Unterstützung bauen

Bauen Sie RustFS mit dem SFTP-Feature:

```bash
cargo build --release --features sftp
```

Um alle optionalen RustFS-Features einschließlich SFTP zu aktivieren, verwenden Sie stattdessen `--features full`. `RUSTFS_SFTP_ENABLE=true` hat in einem Binary ohne das Feature `sftp` keine Wirkung.

### SFTP-Variablen

| Variable | Beschreibung | Standard |
| --- | --- | --- |
| `RUSTFS_SFTP_ENABLE` | Aktiviert den SFTP-Listener. | `false` |
| `RUSTFS_SFTP_ADDRESS` | Bind-Adresse für SFTP-Verbindungen. | `0.0.0.0:2222` |
| `RUSTFS_SFTP_HOST_KEY_DIR` | Verzeichnis mit mindestens einem unverschlüsselten privaten SSH-Host-Schlüssel. Erforderlich, wenn SFTP aktiviert ist. | Nicht gesetzt |
| `RUSTFS_SFTP_READ_ONLY` | Lehnt Operationen ab, die Buckets oder Objekte ändern. | `false` |
| `RUSTFS_SFTP_IDLE_TIMEOUT` | SSH-Inaktivitätszeitlimit in Sekunden. Muss größer als null sein. | `600` |
| `RUSTFS_SFTP_PART_SIZE` | Teilgröße des mehrteiligen Uploads in Bytes. | `16777216` (16 MiB) |

Der Standardport `2222` vermeidet den privilegierten SSH-Port `22`. Die Adresse kann IPv4- oder IPv6-Syntax verwenden, zum Beispiel `127.0.0.1:2222` oder `[::]:2222`.

### Host-Schlüssel vorbereiten

Erstellen Sie ein dauerhaftes Verzeichnis für Host-Schlüssel und erzeugen Sie einen Ed25519-Host-Schlüssel:

```bash
mkdir -p /path/to/sftp-keys
ssh-keygen -t ed25519 \
	-f /path/to/sftp-keys/ssh_host_ed25519_key \
	-N ""
chmod 600 /path/to/sftp-keys/ssh_host_ed25519_key*
```

Der Host-Schlüssel darf keine Passphrase verwenden. RustFS akzeptiert außerdem private ECDSA- und RSA-Host-Schlüssel, die es einlesen kann.

Unter Unix darf jede reguläre Datei im Verzeichnis der Host-Schlüssel nur für ihren Eigentümer zugänglich sein. Der Befehl `ssh-keygen` erzeugt außerdem eine `.pub`-Datei. Belassen Sie sie wie gezeigt mit Berechtigungen nur für den Eigentümer oder entfernen Sie sie, weil RustFS sie nicht liest. RustFS verweigert den Start, wenn das Verzeichnis fehlt, keinen verwendbaren privaten Schlüssel enthält oder eine reguläre Datei enthält, bei der Bits für die Gruppe oder für andere Benutzer gesetzt sind.

:::warning[Host-Schlüssel schützen]

Behalten Sie denselben Host-Schlüssel über Neustarts hinweg, damit Clients die Serveridentität prüfen können. Beschränken Sie den Zugriff auf das Konto, unter dem RustFS läuft, und sichern Sie den Schlüssel geschützt. Ein geänderter Host-Schlüssel führt dazu, dass Clients eine mögliche Man-in-the-Middle-Warnung anzeigen.

:::

### SFTP-Listener starten

Das folgende Beispiel startet SFTP für lokale Tests auf der Loopback-Schnittstelle:

```bash
export RUSTFS_SFTP_ENABLE=true
export RUSTFS_SFTP_ADDRESS=127.0.0.1:2222
export RUSTFS_SFTP_HOST_KEY_DIR=/path/to/sftp-keys
export RUSTFS_ACCESS_KEY=<your-access-key>
export RUSTFS_SECRET_KEY=<your-secret-key>

rustfs /path/to/data
```

Binden Sie für entfernte Verbindungen an eine passende Netzwerkschnittstelle und lassen Sie eingehenden TCP-Verkehr zum konfigurierten SFTP-Port zu. Dieser Listener ist von den Listenern der S3-API und der Console getrennt.

## Verwendung

Die folgenden Beispiele verwenden den OpenSSH-Client `sftp`, die kanonischen Namen `my-bucket` und `hello.txt` sowie einen lokalen Listener auf Port `2222`.

### Verbinden

```bash
sftp -P 2222 <your-access-key>@127.0.0.1
```

Geben Sie den geheimen Zugriffsschlüssel von RustFS ein, wenn nach dem Passwort gefragt wird. Prüfen Sie bei der ersten Verbindung den angezeigten Fingerabdruck des Host-Schlüssels, bevor Sie ihn akzeptieren.

### Buckets auflisten und erstellen

Listen Sie an der `sftp`-Eingabeaufforderung die für den IAM-Benutzer sichtbaren Buckets auf und erstellen Sie `my-bucket`:

```text
sftp> ls /
sftp> mkdir /my-bucket
sftp> cd /my-bucket
```

Bucket-Namen müssen denselben Namensregeln folgen wie Buckets, die über die S3-API erstellt werden. Objekte können nicht direkt unter `/` angelegt werden.

### Objekt hochladen und herunterladen

Laden Sie `/path/to/hello.txt` hoch, listen Sie den Bucket auf und laden Sie das Objekt herunter:

```text
sftp> put /path/to/hello.txt /my-bucket/hello.txt
sftp> ls /my-bucket
sftp> get /my-bucket/hello.txt hello.txt
```

Uploads müssen sequenziell vom Anfang der Datei erfolgen. Fortsetzen, Anfügen, Änderungen an Ort und Stelle und segmentierte Uploads eines Objekts über mehrere Verbindungen werden nicht unterstützt.

### Objekt umbenennen

```text
sftp> rename /my-bucket/hello.txt /my-bucket/greeting.txt
```

RustFS implementiert das Umbenennen als serverseitige Kopie mit anschließendem Löschen der Quelle. Die Operation ist nicht atomar, und das Umbenennen eines Buckets wird nicht unterstützt. Der IAM-Benutzer benötigt die Berechtigung, die Quelle zu lesen und zu löschen und das Ziel zu schreiben.

### Objekt und Bucket löschen

Löschen Sie das Objekt und entfernen Sie anschließend den leeren Bucket:

```text
sftp> rm /my-bucket/greeting.txt
sftp> rmdir /my-bucket
```

RustFS löscht einen nicht leeren Bucket über SFTP nicht rekursiv.

### Desktop-Client verbinden

Verwenden Sie diese Einstellungen in grafischen Clients wie FileZilla, Cyberduck oder WinSCP:

| Einstellung | Wert |
| --- | --- |
| Protokoll | SFTP (SSH File Transfer Protocol) |
| Host | Ihr RustFS-SFTP-Hostname |
| Port | `2222` oder der Port in `RUSTFS_SFTP_ADDRESS` |
| Benutzername | RustFS-Zugriffsschlüssel |
| Passwort | Geheimer Zugriffsschlüssel von RustFS |
| Authentifizierung | Passwort |

Konfigurieren Sie den Client für Uploads der vollständigen Datei über eine einzelne Verbindung. Symbolische Links sowie Änderungen an POSIX-Eigentümerschaft, Berechtigungen oder Zeitstempeln werden nicht unterstützt, weil das Gateway SFTP-Operationen auf Objektspeicher abbildet.

## Nächste Schritte

- [Zugangsdaten verwalten](/de/operations/credentials)
- [Dienststatus prüfen](/de/operations/status-check)
- [Lebenszyklusverwaltung konfigurieren](/de/administration/data/lifecycle-management)
