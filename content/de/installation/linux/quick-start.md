---
title: "Schnellstart"
description: "Installieren Sie RustFS mit dem Installationsskript, melden Sie sich an der Console an und speichern Sie Ihr erstes Objekt — in etwa zehn Minuten."
---

Diese Anleitung führt Sie von einem leeren Linux-Server zu einer laufenden RustFS-Instanz. Sie installieren RustFS, melden sich an der Console (Weboberfläche) an, legen einen Bucket an und laden Ihr erstes Objekt hoch. Die Produktionsplanung (Aufbau mit mehreren Knoten, Dimensionierung der Hardware) bleibt bewusst dem [nächsten Schritt](#nächste-schritte) vorbehalten.

**Voraussetzungen**

- Ein Linux-Server (x86_64 oder aarch64) mit `systemd` sowie Root- oder sudo-Zugriff
- `unzip` ist installiert, und ausgehender Netzwerkzugriff zum Herunterladen des Pakets ist vorhanden
- Die Ports `9000` (S3-API) und `9001` (Console) sind von Ihrem Rechner aus erreichbar
- [`rc`](/de/operations/rc) ist auf Ihrer Arbeitsstation für den Prüflauf auf der Kommandozeile installiert

## 1. RustFS installieren und starten

Führen Sie das offizielle Installationsskript aus:

```bash
curl -O https://rustfs.com/install_rustfs.sh && bash install_rustfs.sh
```

Das Skript installiert die Binärdatei nach `/usr/local/bin/rustfs`, registriert einen systemd-Dienst `rustfs` und startet ihn. Standardmäßig speichert es die Daten in `/data/rustfs0` und lauscht auf den Ports `9000` (S3-API) und `9001` (Console). Datenpfad und Ports lassen sich während der Installation anpassen. Bei Erfolg gibt es eine Zusammenfassung in dieser Form aus:

```text
RustFS has been installed and started successfully!
Service port: 9000,  Console port: 9001,  Data directory: /data/rustfs0

[SECURITY WARNING] Please change the default value for RUSTFS_ACCESS_KEY/RUSTFS_SECRET_KEY immediately ...
  Config file: /etc/default/rustfs
```

## 2. Zugangsdaten festlegen

Die erzeugte Konfigurationsdatei enthält Platzhalter für die Zugangsdaten. Legen Sie Ihren eigenen Zugriffsschlüssel und Ihren eigenen geheimen Zugriffsschlüssel fest und starten Sie den Dienst anschließend neu:

```ini title="/etc/default/rustfs" {1,2}
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>   ; e.g. output of: openssl rand -base64 24
```

Verwenden Sie einen Zugriffsschlüssel aus Großbuchstaben und Ziffern. Verwenden Sie die unveränderte Base64-Ausgabe nicht für `RUSTFS_ACCESS_KEY`. Base64 kann `/` enthalten. Das kollidiert mit dem Credential Scope von AWS Signature Version 4, also dem Geltungsbereich der Signatur. Einzelheiten stehen in der [Zugangsdatenverwaltung](/de/operations/credentials).

```bash
sudo systemctl restart rustfs
sudo systemctl status rustfs --no-pager   # should report: active (running)
```

:::warning[Standardzugangsdaten nicht beibehalten]

Wenn `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` nicht gesetzt sind, fällt der Server auf den eingebauten Standard `rustfsadmin` / `rustfsadmin` zurück. Das ist nur für einen lokalen Test akzeptabel, den Sie anschließend verwerfen, und niemals für eine Instanz, die andere erreichen können.

:::

## 3. An der Console anmelden

Öffnen Sie `http://<server-ip>:9001` im Browser und melden Sie sich mit dem Zugriffsschlüssel und dem geheimen Zugriffsschlüssel aus Schritt 2 an.

![Anmeldung an der RustFS Console](./images/console.jpg)

## 4. Bucket anlegen und eine Datei hochladen

1. Wählen Sie auf der Startseite der Console **Create Bucket** (Bucket erstellen), vergeben Sie einen Namen (zum Beispiel `my-bucket`) und bestätigen Sie.
2. Öffnen Sie den Bucket und verwenden Sie die Aktion zum Hochladen, um eine beliebige lokale Datei hinzuzufügen.
3. Klicken Sie auf das hochgeladene Objekt, um die Details anzuzeigen. Damit verfügen Sie über einen funktionierenden Objektspeicher.

Sie arbeiten lieber auf der Kommandozeile? Konfigurieren Sie [`rc`](/de/operations/rc) und führen Sie dieselben Operationen aus:

```bash
rc alias set rustfs http://<server-ip>:9000 <your-access-key> <your-secret-key>
rc bucket create rustfs/my-bucket
rc object copy /path/to/hello.txt rustfs/my-bucket/hello.txt
rc object list rustfs/my-bucket
```

```text
✓ Bucket 'rustfs/my-bucket' created successfully.
/path/to/hello.txt -> rustfs/my-bucket/hello.txt
```

<a id="mode"></a>

## Nächste Schritte

Mit der Schnellinstallation betreiben Sie RustFS im Modus **Einzelner Knoten mit einem Datenträger (SNSD)** — ohne Redundanz, geeignet für Evaluierung und Entwicklung. So geht es weiter:

- **Produktionsbereitstellung planen** — wählen Sie eine Topologie und folgen Sie der zugehörigen Anleitung:
  - [Einzelner Knoten mit einem Datenträger (SNSD)](./single-node-single-disk.md) — Entwicklung und kleine Arbeitslasten
  - [Einzelner Knoten mit mehreren Datenträgern (SNMD)](./single-node-multiple-disk.md) — Fehlertoleranz auf Datenträgerebene auf einem Rechner
  - [Mehrere Knoten mit mehreren Datenträgern (MNMD)](./multiple-node-multiple-disk.md) — Verfügbarkeit und Skalierung auf Produktionsniveau, mit den [Checklisten vor der Installation](../requirement/checklists/index.md)
- **Sie bevorzugen Container?** — [Mit einem Container installieren](../container/index.md)
- **Anwendung anbinden** — [SDKs und Beispiele](../../developer/sdk/index.md)
