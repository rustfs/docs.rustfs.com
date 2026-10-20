---
title: "RustFS unter macOS installieren"
description: "Installieren Sie eine lokale RustFS-Instanz unter macOS mit RustFS Launcher oder der eigenständigen Server-Binary."
---

Diese Anleitung zeigt zwei Wege, **RustFS** auf macOS zu betreiben: über die grafische Anwendung **RustFS Launcher** oder über die eigenständige Server-Binary im Terminal. Beide Wege erzeugen eine lokale Einzelknoten-Instanz für Evaluierung, Entwicklung und Tests.

:::note[Geltungsbereich der Bereitstellung]

Diese Verfahren führen RustFS als Desktop-Prozess aus, nicht als Hintergrunddienst von macOS. Für eine produktive oder verteilte Bereitstellung verwenden Sie die [Linux-Installationsanleitungen](/de/installation/linux).

:::

## 1. Mac-Architektur prüfen

RustFS stellt unterschiedliche Binaries für Apple Silicon (`arm64`) und Intel (`x86_64`) bereit. Öffnen Sie das Terminal und führen Sie Folgendes aus:

```bash
uname -m
```

Wählen Sie anhand des Ergebnisses das passende Paket:

| Ergebnis | Mac-Typ | Verfügbarkeit der aktuellen eigenständigen Binary |
| --- | --- | --- |
| `arm64` | Apple Silicon | Laden Sie das macOS-AArch64-Paket aus den aktuellen RustFS-Releases herunter. |
| `x86_64` | Intel | RustFS-Releases nach `v1.0.0-beta.9` enthalten kein vorgefertigtes Intel-macOS-Paket. Bauen Sie die aktuelle Version aus dem Quellcode. |

:::warning[Grenze der Intel-Mac-Releases]

Führen Sie die Apple-Silicon-Binary nicht auf einem Intel-Mac aus. Wenn Sie auf Intel-macOS eine RustFS-Version neuer als `v1.0.0-beta.9` benötigen, folgen Sie dem Quellcode-Build in dieser Anleitung. Eine ältere beta.9-Binary enthält keine Korrekturen und Funktionen späterer Releases.

:::

Stellen Sie vor dem Fortfahren außerdem Folgendes sicher:

- Sie dürfen Anwendungen installieren oder ausführen und in das gewählte Datenverzeichnis schreiben.
- Die TCP-Ports `9000` und `9001` sind frei, oder Sie haben zwei andere ungenutzte Ports gewählt.
- Sie haben ein eigenes Datenverzeichnis angelegt, zum Beispiel `$HOME/rustfs/data`.

```bash
mkdir -p "$HOME/rustfs/data"
```

:::warning[Datenverzeichnis schützen]

Verwenden Sie ein leeres Verzeichnis auf einem Datenträger mit ausreichend freiem Speicher. Legen Sie dort keine fremden Dateien ab und bearbeiten Sie RustFS-Datendateien nicht, während der Server läuft.

:::

## 2. Installationsmethode wählen

| Methode | Geeignet, wenn | Hinweis zur Architektur |
| --- | --- | --- |
| RustFS Launcher | Sie eine grafische Einrichtung und eine integrierte Protokollanzeige möchten. | Laden Sie ein Launcher-Paket herunter, das zu Apple Silicon oder Intel passt. |
| Eigenständige Binary | Sie explizite Terminal-Befehle oder Skripte möchten. | Aktuelle Releases stellen Apple-Silicon-Binaries bereit. Intel-Nutzer bauen Releases nach beta.9 aus dem Quellcode. |

## Mit RustFS Launcher installieren

### 3. Launcher herunterladen und installieren

1. Öffnen Sie die [Release-Seite von RustFS Launcher](https://github.com/rustfs/launcher/releases).
2. Wählen Sie das neueste Release und klappen Sie **Assets** auf.
3. Laden Sie das macOS-Installationsprogramm herunter, das zu Ihrer Architektur passt: AArch64 für Apple Silicon oder x86-64 für Intel. Laden Sie **Source code** nur herunter, wenn Sie Launcher selbst bauen möchten.
4. Öffnen Sie das heruntergeladene Festplattenabbild und verschieben Sie **RustFS Launcher** nach **Applications** (Programme).
5. Öffnen Sie **RustFS Launcher** aus **Applications**.

Wenn macOS den ersten Start blockiert, prüfen Sie, dass das Paket von der offiziellen Release-Seite `rustfs/launcher` stammt. Öffnen Sie anschließend **System Settings > Privacy & Security** (Systemeinstellungen > Datenschutz und Sicherheit) und erlauben Sie genau diese Anwendung. Deaktivieren Sie Gatekeeper nicht global.

### 4. Launcher konfigurieren

Konfigurieren Sie die Felder im Launcher-Fenster:

| Bereich | Feld | Empfohlener Wert | Beschreibung |
| --- | --- | --- | --- |
| Dataset Mount | Data Path | `$HOME/rustfs/data` | Vorhandenes Verzeichnis, in dem RustFS Objektdaten speichert. |
| Ports & Access | API Port | `9000` | Port der S3-kompatiblen API. |
| Ports & Access | Host | `127.0.0.1` | Beschränkt den Zugriff auf diesen Mac. |
| Ports & Access | Console Endpoint | Enabled | Aktiviert die Console (Weboberfläche). Launcher deaktiviert sie standardmäßig. |
| Ports & Access | Console Port | `9001` | Console-Port. Er muss sich vom API-Port unterscheiden. |
| Credentials | Access Key | `<your-access-key>` | Administrator-Zugriffsschlüssel für diese Instanz. |
| Credentials | Secret Key | `<your-secret-key>` | Geheimer Administrator-Zugriffsschlüssel für diese Instanz. |

Wählen Sie das Datenverzeichnis mit **Browse** oder ziehen Sie es in Launcher. Launcher setzt voraus, dass das Verzeichnis vor dem Start existiert. Die macOS-Dateiauswahl zeigt den aufgelösten Pfad an, nicht die literale Variable `$HOME`.

Ersetzen Sie die Platzhalter für die Zugangsdaten durch eigene Werte. Launcher zeigt anfangs die standardmäßigen lokalen Test-Zugangsdaten an. Behalten Sie sie nicht auf einem Mac bei, auf den andere Benutzer zugreifen können.

:::warning[Netzwerkexposition]

Lassen Sie **Host** auf `127.0.0.1`, sofern nicht ein anderer Computer eine Verbindung zu RustFS herstellen muss. Jede Adresse außer `127.0.0.1` legt die API und die Console auf den zugehörigen Netzwerkschnittstellen offen. Konfigurieren Sie die macOS-Firewall und starke Zugangsdaten, bevor Sie Fernzugriff zulassen.

:::

### 5. RustFS starten und prüfen

1. Wählen Sie **Launch RustFS**.
2. Warten Sie, bis Launcher meldet, dass der konfigurierte Endpunkt online ist.
3. Öffnen Sie `http://localhost:9001` und melden Sie sich mit dem Zugriffsschlüssel und dem geheimen Zugriffsschlüssel an, die Sie konfiguriert haben.
4. Verwenden Sie `http://localhost:9000` als Endpunkt für S3-kompatible Clients.

![RustFS Launcher mit online gemeldetem Dienst, API-Port 9000, Console-Port 9001 und erfolgreichen Startprotokollen](../windows/images/windows-rustfs-launcher.jpg)

Wenn Sie Host oder Ports geändert haben, verwenden Sie diese Werte. Die Console-URL ist nur verfügbar, wenn **Console Endpoint** aktiviert ist.

Launcher sperrt seine Konfiguration, solange er einen laufenden Prozess verwaltet. Er legt außerdem ein Verzeichnis `logs` neben dem Datenverzeichnis an. Wenn Sie beispielsweise `$HOME/rustfs/data` wählen, liegen die Server-Protokolldateien unter `$HOME/rustfs/logs`.

### 6. Launcher anhalten oder beenden

Wählen Sie **Stop RustFS**, bevor Sie die Konfiguration ändern, einen externen Datenträger trennen oder macOS herunterfahren.

Wenn Sie das Launcher-Fenster schließen, wird es in der Menüleiste ausgeblendet. RustFS wird dadurch nicht angehalten. Um den verwalteten Prozess anzuhalten und Launcher zu beenden, öffnen Sie das Launcher-Symbol in der Menüleiste und wählen Sie **Quit**. Wählen Sie **Show** oder das Symbol, um das Fenster wiederherzustellen.

## Eigenständige Binary installieren

### 7. Apple-Silicon-Binary herunterladen

Verwenden Sie dieses Verfahren, wenn `uname -m` den Wert `arm64` zurückgibt:

1. Öffnen Sie die [RustFS-Release-Seite](https://github.com/rustfs/rustfs/releases).
2. Wählen Sie das benötigte Release und laden Sie das macOS-AArch64-ZIP-Archiv aus **Assets** herunter. Der Asset-Name beginnt mit `rustfs-macos-aarch64`.
3. Legen Sie ein Programmverzeichnis an und entpacken Sie das Archiv. Ersetzen Sie `<version>` durch die Version im heruntergeladenen Dateinamen:

```bash
mkdir -p "$HOME/rustfs/bin"
unzip "$HOME/Downloads/rustfs-macos-aarch64-<version>.zip" -d "$HOME/rustfs/bin"
chmod +x "$HOME/rustfs/bin/rustfs"
"$HOME/rustfs/bin/rustfs" --help
```

Wenn das Archiv einen plattformspezifischen Binary-Namen anstelle von `rustfs` enthält, verwenden Sie diesen Dateinamen in den weiteren Befehlen oder benennen Sie die Datei in `$HOME/rustfs/bin/rustfs` um.

### 8. Intel-Binary aus dem Quellcode bauen

Verwenden Sie dieses Verfahren, wenn `uname -m` den Wert `x86_64` zurückgibt und Sie ein Release neuer als `v1.0.0-beta.9` benötigen.

1. Installieren Sie die Xcode-Befehlszeilenwerkzeuge:

```bash
xcode-select --install
```

2. Installieren Sie die aktuelle stabile Rust-Toolchain von [rustup.rs](https://rustup.rs/) und öffnen Sie anschließend eine neue Terminal-Sitzung.
3. Klonen Sie RustFS und checken Sie das benötigte Release aus:

```bash
git clone https://github.com/rustfs/rustfs.git
cd rustfs
git checkout <release-tag>
```

4. Bauen Sie das Intel-macOS-Ziel mit dem Build-Skript des Repositorys:

```bash
./build-rustfs.sh --platform x86_64-apple-darwin
```

Das Build-Skript bindet die Console-Assets standardmäßig ein und prüft die erzeugte Binary. Verwenden Sie im nächsten Schritt die Binary, die am Ende der Build-Ausgabe gemeldet wird.

:::note[Abhängigkeiten des Quellcode-Builds]

Für den Build aus dem Quellcode benötigen Sie zusätzlich zu Rust und den Xcode-Befehlszeilenwerkzeugen die Werkzeuge des gewählten RustFS-Releases. Wenn der Build eine fehlende Abhängigkeit meldet, folgen Sie den Anforderungen in der README dieses Releases im Repository. Setzen Sie keine für Apple Silicon gebaute Binary ein.

:::

### 9. Eigenständigen Server starten

Setzen Sie die Zugangsdaten für die aktuelle Terminal-Sitzung und weisen Sie den Pfad zu Ihrer heruntergeladenen oder gebauten Binary zu:

```bash
export RUSTFS_ACCESS_KEY="<your-access-key>"
export RUSTFS_SECRET_KEY="<your-secret-key>"
export RUSTFS_BIN="$HOME/rustfs/bin/rustfs"

"$RUSTFS_BIN" server \
	--address "127.0.0.1:9000" \
	--console-enable true \
	--console-address "127.0.0.1:9001" \
	"$HOME/rustfs/data"
```

Ersetzen Sie bei einem Intel-Quellcode-Build `RUSTFS_BIN` durch den Binary-Pfad, den `build-rustfs.sh` ausgibt. Lassen Sie das Terminal-Fenster geöffnet, solange RustFS läuft. Drücken Sie `Control+C`, um den Server anzuhalten.

:::tip[Umgang mit Zugangsdaten]

Sitzungs-Umgebungsvariablen vermeiden es, Zugangsdaten direkt in die Befehlszeile zu schreiben. Bevorzugen Sie für wiederholte oder automatisierte Nutzung die Umgebungsvariablen `RUSTFS_ACCESS_KEY_FILE` und `RUSTFS_SECRET_KEY_FILE` und schützen Sie diese Dateien mit macOS-Berechtigungen.

:::

### 10. Eigenständigen Server prüfen

Öffnen Sie `http://localhost:9001` und melden Sie sich mit den konfigurierten Zugangsdaten an. Verwenden Sie `http://localhost:9000` als Endpunkt für S3-kompatible Clients. RustFS verwendet standardmäßig pfadbasierte Adressierung (Path-Style). Konfigurieren Sie die Clients entsprechend.

Prüfen Sie den Ablauf durchgehend: Legen Sie einen Bucket namens `my-bucket` an, laden Sie `hello.txt` hoch und prüfen Sie, dass das Objekt im Bucket erscheint.

## Erfolgreiche Installation bestätigen

Nach der Anmeldung an der Console öffnet sich die Seite **Buckets**, unabhängig davon, ob Sie Launcher, eine Apple-Silicon-Binary oder einen Intel-Quellcode-Build verwendet haben.

![Seite Buckets der RustFS Console nach erfolgreicher Anmeldung](../windows/images/rustfs-console-login.png)

## Fehlerbehebung

### macOS blockiert die Anwendung oder die Binary

Prüfen Sie, dass die Datei aus der offiziellen GitHub-Organisation von RustFS stammt. Erlauben Sie bei Launcher die konkrete Anwendung unter **System Settings > Privacy & Security**. Wenn macOS eine eigenständige Binary unter Quarantäne gestellt hat, lesen Sie die Warnung und prüfen Sie die Bezugsquelle, bevor Sie die Sicherheitsattribute ändern.

### Die Architektur der Binary stimmt nicht überein

Führen Sie `uname -m` aus und prüfen Sie die Binary:

```bash
uname -m
file "$RUSTFS_BIN"
```

Verwenden Sie auf Apple Silicon eine AArch64-Binary. Bauen Sie auf einem Intel-Mac Releases nach `v1.0.0-beta.9` aus dem Quellcode für `x86_64-apple-darwin`.

### Der Datenpfad wird abgelehnt

Prüfen Sie, dass das Verzeichnis existiert und Ihr macOS-Konto Lese- und Schreibzugriff hat. Launcher legt das gewählte Datenverzeichnis nicht für Sie an.

### Der API- oder Console-Port ist nicht verfügbar

Die Ports müssen Zahlen von `1` bis `65535` sein, sich voneinander unterscheiden und dürfen nicht bereits belegt sein. Prüfen Sie die Standardports:

```bash
lsof -nP -iTCP:9000 -iTCP:9001 -sTCP:LISTEN
```

Beenden Sie die kollidierende Anwendung oder wählen Sie freie Ports und starten Sie RustFS erneut.

### Die Console öffnet sich nicht

Prüfen Sie bei Launcher, dass **Console Endpoint** aktiviert ist. Prüfen Sie bei der eigenständigen Binary, dass der Prozess noch läuft und `--console-enable true` gesetzt ist.

### Launcher meldet einen externen RustFS-Prozess

Ein anderer Prozess lauscht auf der konfigurierten API-Adresse, aber Launcher hat ihn nicht gestartet. Beenden Sie diesen Prozess oder wählen Sie einen anderen API-Port. Launcher kann einen Prozess nicht anhalten, den er nicht verwaltet.

### RustFS beendet sich nach dem Start

Prüfen Sie in Launcher beide Registerkarten, die der Anwendung und die von RustFS, in der integrierten Protokollanzeige. Prüfen Sie bei einer eigenständigen Installation die Terminal-Ausgabe. Häufige Ursachen sind ein fehlendes Datenverzeichnis, unzureichende Berechtigungen, eine abweichende Architektur oder ein Portkonflikt.

## Nächste Schritte

- Lesen Sie die [S3-API-Anleitung](/de/administration/protocols/s3), bevor Sie einen Client verbinden.
- Erfahren Sie, wie Sie [einen Bucket anlegen](/de/administration/data/bucket/creation).
- Weitere Prüfmöglichkeiten finden Sie unter [Statusprüfungen](/de/operations/status-check).
- Verwenden Sie die [Linux-Installationsanleitungen](/de/installation/linux) für eine auf den Produktivbetrieb ausgerichtete Bereitstellung.
