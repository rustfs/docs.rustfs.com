---
title: "RustFS unter Windows installieren"
description: "Installieren Sie eine lokale RustFS-Instanz unter Windows mit RustFS Launcher oder der eigenständigen Server-Binary."
---

Diese Anleitung zeigt zwei Wege, **RustFS** auf Windows zu betreiben: über die grafische Anwendung **RustFS Launcher** oder indem Sie die eigenständige Server-Binary herunterladen und in PowerShell ausführen. Beide Wege erzeugen eine lokale Einzelknoten-Instanz für Evaluierung, Entwicklung und Tests.

:::warning[Nur für Entwicklung und Fehlersuche]

Die Windows-Version von RustFS ist ausschließlich für Entwicklung und Fehlersuche vorgesehen und wird **für produktive Bereitstellungen nicht empfohlen**. Für produktive Arbeitslasten empfehlen wir [Linux](/de/installation/linux).

Diese Verfahren führen RustFS als Desktop-Prozess aus, nicht als Windows-Dienst. Für eine produktive oder verteilte Bereitstellung verwenden Sie die [Linux-Installationsanleitungen](/de/installation/linux).

:::

## 1. Voraussetzungen prüfen

Stellen Sie vor dem Start Folgendes sicher:

- Sie verwenden 64-Bit-Windows auf einem x86-64-Prozessor. Launcher bündelt derzeit die Windows-x86-64-Binary von RustFS.
- Sie dürfen Anwendungen installieren oder ausführen und in das gewählte Datenverzeichnis schreiben.
- Die TCP-Ports `9000` und `9001` sind frei, oder Sie haben zwei andere ungenutzte Ports gewählt.
- Sie haben ein eigenes Datenverzeichnis angelegt, zum Beispiel `D:\rustfs\data`.

:::warning[Datenverzeichnis schützen]

Verwenden Sie ein leeres Verzeichnis auf einem Datenträger mit ausreichend freiem Speicher. Legen Sie dort keine fremden Dateien ab und bearbeiten Sie RustFS-Datendateien nicht, während der Server läuft.

:::

## 2. Installationsmethode wählen

| Methode | Geeignet, wenn | Verwaltungsmodell |
| --- | --- | --- |
| RustFS Launcher | Sie eine grafische Einrichtung und eine integrierte Protokollanzeige möchten. | Launcher startet und stoppt den mitgelieferten RustFS-Prozess. |
| Eigenständige Binary | Sie explizite PowerShell-Befehle oder Skripte möchten. | Der RustFS-Prozess läuft in der PowerShell-Sitzung. |

## Mit RustFS Launcher installieren

### 3. Launcher herunterladen und installieren

1. Öffnen Sie die [Release-Seite von RustFS Launcher](https://github.com/rustfs/launcher/releases).
2. Wählen Sie das neueste Release und laden Sie das Windows-x86-64-Installationsprogramm aus **Assets** herunter. Laden Sie **Source code** nicht herunter. Es dient dazu, Launcher aus dem Quellcode zu bauen.
3. Doppelklicken Sie auf das Installationsprogramm und folgen Sie den Eingabeaufforderungen.
4. Öffnen Sie **RustFS Launcher** aus dem Startmenü, falls die Anwendung nicht automatisch startet.

Wenn Microsoft Defender SmartScreen eine Warnung anzeigt, prüfen Sie, dass das Installationsprogramm von der offiziellen Release-Seite `rustfs/launcher` stammt, bevor Sie die Ausführung zulassen. Deaktivieren Sie Windows-Sicherheitsfunktionen nicht global.

### 4. Launcher konfigurieren

Konfigurieren Sie die Felder im Launcher-Fenster:

| Bereich | Feld | Empfohlener Wert | Beschreibung |
| --- | --- | --- | --- |
| Dataset Mount | Data Path | `D:\rustfs\data` | Vorhandenes Verzeichnis, in dem RustFS Objektdaten speichert. |
| Ports & Access | API Port | `9000` | Port der S3-kompatiblen API. |
| Ports & Access | Host | `127.0.0.1` | Beschränkt den Zugriff auf diesen Computer. |
| Ports & Access | Console Endpoint | Enabled | Aktiviert die Console (Weboberfläche). Launcher deaktiviert sie standardmäßig. |
| Ports & Access | Console Port | `9001` | Console-Port. Er muss sich vom API-Port unterscheiden. |
| Credentials | Access Key | `<your-access-key>` | Administrator-Zugriffsschlüssel für diese Instanz. |
| Credentials | Secret Key | `<your-secret-key>` | Geheimer Administrator-Zugriffsschlüssel für diese Instanz. |

Wählen Sie das Datenverzeichnis mit **Browse** oder ziehen Sie es in Launcher. Launcher setzt voraus, dass das Verzeichnis vor dem Start existiert.

Ersetzen Sie die Platzhalter für die Zugangsdaten durch eigene Werte. Launcher zeigt anfangs die standardmäßigen lokalen Test-Zugangsdaten an. Behalten Sie sie nicht auf einem Computer bei, auf den andere Benutzer zugreifen können.

:::warning[Netzwerkexposition]

Lassen Sie **Host** auf `127.0.0.1`, sofern nicht ein anderer Computer eine Verbindung zu RustFS herstellen muss. Jede Adresse außer `127.0.0.1` legt die API und die Console auf den zugehörigen Netzwerkschnittstellen offen. Konfigurieren Sie die Windows Defender Firewall und starke Zugangsdaten, bevor Sie Fernzugriff zulassen.

:::

### 5. RustFS starten und prüfen

1. Wählen Sie **Launch RustFS**.
2. Warten Sie, bis Launcher meldet, dass der konfigurierte Endpunkt online ist.
3. Öffnen Sie `http://localhost:9001` und melden Sie sich mit dem Zugriffsschlüssel und dem geheimen Zugriffsschlüssel an, die Sie konfiguriert haben.
4. Verwenden Sie `http://localhost:9000` als Endpunkt für S3-kompatible Clients.

![RustFS Launcher mit online gemeldetem Dienst, API-Port 9000, Console-Port 9001 und erfolgreichen Startprotokollen](./images/windows-rustfs-launcher.jpg)

Wenn Sie Host oder Ports geändert haben, verwenden Sie diese Werte. Die Console-URL ist nur verfügbar, wenn **Console Endpoint** aktiviert ist.

Launcher sperrt seine Konfiguration, solange er einen laufenden Prozess verwaltet. Er legt außerdem ein Verzeichnis `logs` neben dem Datenverzeichnis an. Bei einem Datenpfad `D:\rustfs\data` liegen die Server-Protokolldateien beispielsweise unter `D:\rustfs\logs`.

### 6. Launcher anhalten oder beenden

Wählen Sie **Stop RustFS**, bevor Sie die Konfiguration ändern, den Datenträger trennen oder Windows herunterfahren.

Wenn Sie das Launcher-Fenster schließen, wird es im Infobereich von Windows ausgeblendet. RustFS wird dadurch nicht angehalten. Um den verwalteten Prozess anzuhalten und Launcher zu beenden, klicken Sie mit der rechten Maustaste auf das Symbol im Infobereich und wählen Sie **Quit**. Wählen Sie **Show** oder klicken Sie mit der linken Maustaste auf das Symbol, um das Fenster wiederherzustellen.

## Eigenständige Binary installieren

### 7. Binary herunterladen und entpacken

1. Öffnen Sie die [RustFS-Release-Seite](https://github.com/rustfs/rustfs/releases).
2. Wählen Sie das benötigte Release und laden Sie das Windows-x86-64-ZIP-Archiv aus **Assets** herunter. Der Asset-Name beginnt mit `rustfs-windows-x86_64`.
3. Öffnen Sie PowerShell und legen Sie Verzeichnisse für das Programm und seine Daten an:

```powershell
New-Item -ItemType Directory -Force -Path C:\rustfs\bin
New-Item -ItemType Directory -Force -Path D:\rustfs\data
```

4. Entpacken Sie das heruntergeladene Archiv. Ersetzen Sie `<version>` durch die Version im heruntergeladenen Dateinamen:

```powershell
Expand-Archive -Path "$HOME\Downloads\rustfs-windows-x86_64-<version>.zip" -DestinationPath C:\rustfs\bin -Force
```

5. Prüfen Sie, dass die entpackte Binary startet:

```powershell
Set-Location C:\rustfs\bin
.\rustfs.exe --help
```

Wenn das Archiv `rustfs.exe` in ein verschachteltes Verzeichnis entpackt, wechseln Sie in dieses Verzeichnis oder verschieben Sie die ausführbare Datei nach `C:\rustfs\bin`, bevor Sie fortfahren.

### 8. Eigenständigen Server starten

Setzen Sie die Zugangsdaten nur für die aktuelle PowerShell-Sitzung und starten Sie RustFS anschließend mit expliziten Adressen:

```powershell
$env:RUSTFS_ACCESS_KEY = "<your-access-key>"
$env:RUSTFS_SECRET_KEY = "<your-secret-key>"

Set-Location C:\rustfs\bin
.\rustfs.exe server `
	--address "127.0.0.1:9000" `
	--console-enable true `
	--console-address "127.0.0.1:9001" `
	"D:\rustfs\data"
```

Lassen Sie das PowerShell-Fenster geöffnet, solange RustFS läuft. Drücken Sie in diesem Fenster `Ctrl+C`, um den Server anzuhalten.

:::tip[Umgang mit Zugangsdaten]

Sitzungs-Umgebungsvariablen vermeiden es, Zugangsdaten direkt in die Befehlszeile zu schreiben. Bevorzugen Sie für wiederholte oder automatisierte Nutzung die Umgebungsvariablen `RUSTFS_ACCESS_KEY_FILE` und `RUSTFS_SECRET_KEY_FILE` und schützen Sie diese Dateien mit den Windows-Zugriffssteuerungen.

:::

### 9. Eigenständigen Server prüfen

Öffnen Sie `http://localhost:9001` und melden Sie sich mit den konfigurierten Zugangsdaten an. Verwenden Sie `http://localhost:9000` als Endpunkt für S3-kompatible Clients. RustFS verwendet standardmäßig pfadbasierte Adressierung (Path-Style). Konfigurieren Sie die Clients entsprechend.

Prüfen Sie den Ablauf durchgehend: Legen Sie einen Bucket namens `my-bucket` an, laden Sie `hello.txt` hoch und prüfen Sie, dass das Objekt im Bucket erscheint.

## Erfolgreiche Installation bestätigen

Nach der Anmeldung an der Console öffnet sich die Seite **Buckets**, unabhängig davon, ob Sie Launcher oder die eigenständige Binary verwendet haben. Von hier aus können Sie `my-bucket` anlegen und Objekte speichern.

![Seite Buckets der RustFS Console nach erfolgreicher Anmeldung](./images/rustfs-console-login.png)

## Fehlerbehebung

### Windows blockiert das Installationsprogramm oder die ausführbare Datei

Prüfen Sie, dass die Datei aus der offiziellen GitHub-Organisation von RustFS stammt. Öffnen Sie den Dialog **Properties** (Eigenschaften) der Datei. Wenn Windows die Option anbietet, wählen Sie **Unblock** (Zulassen) erst, nachdem Sie die Quelle geprüft haben.

### Der Datenpfad wird abgelehnt

Prüfen Sie, dass das Verzeichnis existiert und Ihr Windows-Konto Lese- und Schreibzugriff hat. Launcher legt das gewählte Datenverzeichnis nicht für Sie an.

### Der API- oder Console-Port ist nicht verfügbar

Die Ports müssen Zahlen von `1` bis `65535` sein, sich voneinander unterscheiden und dürfen nicht bereits belegt sein. Prüfen Sie die Standardports in PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 9000,9001 -ErrorAction SilentlyContinue
```

Beenden Sie die kollidierende Anwendung oder wählen Sie freie Ports und starten Sie RustFS erneut.

### Die Console öffnet sich nicht

Prüfen Sie bei Launcher, dass **Console Endpoint** aktiviert ist. Prüfen Sie bei der eigenständigen Binary, dass der Prozess noch läuft und `--console-enable true` gesetzt ist. Der aktuelle Console-Standard ist Port `9001`. Die aktuelle Launcher-Konfiguration verwendet Port `7001` nicht.

### Launcher meldet einen externen RustFS-Prozess

Ein anderer Prozess lauscht auf der konfigurierten API-Adresse, aber Launcher hat ihn nicht gestartet. Beenden Sie diesen Prozess oder wählen Sie einen anderen API-Port. Launcher kann einen Prozess nicht anhalten, den er nicht verwaltet.

### RustFS beendet sich nach dem Start

Prüfen Sie in Launcher beide Registerkarten, die der Anwendung und die von RustFS, in der integrierten Protokollanzeige. Prüfen Sie bei einer eigenständigen Installation die PowerShell-Ausgabe. Häufige Ursachen sind ein fehlendes Datenverzeichnis, unzureichende Berechtigungen oder ein Portkonflikt.

## Nächste Schritte

- Lesen Sie die [S3-API-Anleitung](/de/administration/protocols/s3), bevor Sie einen Client verbinden.
- Erfahren Sie, wie Sie [einen Bucket anlegen](/de/administration/data/bucket/creation).
- Weitere Prüfmöglichkeiten finden Sie unter [Statusprüfungen](/de/operations/status-check).
- Verwenden Sie die [Linux-Installationsanleitungen](/de/installation/linux) für eine auf den Produktivbetrieb ausgerichtete Bereitstellung.
