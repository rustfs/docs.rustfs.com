---
title: "Console"
description: "Aktivieren Sie die RustFS-Console, verbinden Sie sie mit einem Server und melden Sie sich sicher an."
---

Die **RustFS Console** ist die Weboberfläche für die Administration von RustFS. Auf dieser Seite aktivieren Sie die Console, öffnen die Anmeldeseite und wählen das passende Anmeldeverfahren. Ausführliche Abläufe für Buckets, Objekte und die Identitätsverwaltung stehen in den jeweiligen Dokumentationsabschnitten.

## Console aktivieren

Die Console ist standardmäßig aktiviert und lauscht auf Port `9001`, getrennt von der S3-API auf Port `9000`. Das Verhalten legen Sie mit den folgenden Umgebungsvariablen ausdrücklich fest:

```ini title="/etc/default/rustfs"
RUSTFS_ADDRESS=":9000"
RUSTFS_CONSOLE_ADDRESS=":9001"
RUSTFS_CONSOLE_ENABLE=true
RUSTFS_OBS_LOGGER_LEVEL=error
RUSTFS_OBS_LOG_DIRECTORY="/var/log/rustfs/"
```

Starten Sie RustFS neu, nachdem Sie diese Werte geändert haben. Setzen Sie `RUSTFS_CONSOLE_ENABLE=false`, wenn die Console nicht laufen darf.

Die entsprechenden Kommandozeilenoptionen sind `--console-enable` und `--console-address`. Die vollständige Serverkonfiguration finden Sie in der [CLI-Referenz](/de/reference/cli) und in der [Referenz der Umgebungsvariablen](/de/reference/environment-variables).

## Console öffnen

Öffnen Sie die folgende Adresse und ersetzen Sie `<server-ip>` durch die Adresse des RustFS-Servers:

```text
http://<server-ip>:9001
```

![Anmeldeseite der RustFS-Console mit den Anmeldeoptionen Schlüssel, STS und OIDC](./images/rustfs-console-login.png)

Für eine lokale Bereitstellung, einschließlich der Desktop-Starter für Windows und macOS, öffnen Sie `http://localhost:9001`. Die S3-API lauscht auf Port `9000`.

Wenn die Anmeldeseite den Ziel-RustFS-Dienst nicht erreicht, wählen Sie **Server Configuration** (Serverkonfiguration) oder öffnen Sie `/config`. Geben Sie die von außen erreichbare Adresse des RustFS-Dienstes ein und speichern Sie sie, nachdem die Integritätsprüfung erfolgreich war. **Reset** (Zurücksetzen) löscht die gespeicherte Adresse. **Skip** (Überspringen) kehrt zur Anmeldung zurück, ohne sie zu ändern.

## Anmelden

Welche Anmeldeverfahren angezeigt werden, hängt von der Konfiguration der Bereitstellung ab:

- **Key Login** (Anmeldung mit Schlüssel) verwendet den Zugriffsschlüssel und den geheimen Zugriffsschlüssel der RustFS-Bereitstellung. Das ist das übliche Anmeldeverfahren für eine lokale Administration.
- **STS Login** (STS-Anmeldung) verwendet temporäre Zugangsdaten des Security Token Service (STS). Verwenden Sie es nur, wenn Ihr Identitätsablauf ein gültiges Sitzungstoken ausgestellt hat.
- **OIDC Login** (OIDC-Anmeldung) erscheint, wenn ein OpenID-Connect-Anbieter (OIDC) konfiguriert ist. Wählen Sie den Anbieter und schließen Sie die Authentifizierung beim Identitätsanbieter ab.

Nach der Anmeldung öffnet die Console die erste Seite, auf die Ihr Konto zugreifen kann. Menüs und Aktionen hängen von der Kontorichtlinie und den aktivierten Plattformfunktionen ab. Ein fehlendes Menü weist nicht zwangsläufig auf einen Fehler der Console hin.

Wenn die Anmeldung fehlschlägt, prüfen Sie das gewählte Anmeldeverfahren, die Anmeldedaten, die Zielserveradresse und den Kontostatus, bevor Sie es erneut versuchen.

:::warning[Standard-Anmeldedaten nicht offenlegen]

RustFS fällt auf `rustfsadmin` / `rustfsadmin` zurück, wenn keine eigenen Anmeldedaten konfiguriert sind. Verwenden Sie diese Standardwerte nur für einen lokalen Test, den Sie anschließend verwerfen. Konfigurieren Sie einen eindeutigen Zugriffsschlüssel und einen starken geheimen Zugriffsschlüssel, bevor andere Benutzer die Console erreichen können.

:::

## Betriebshinweise

- Verwenden Sie [TLS](/de/integration/tls-configured), bevor Sie die Console außerhalb eines vertrauenswürdigen Netzwerks erreichbar machen.
- Beschränken Sie den Netzwerkzugriff auf den Console-Listener und konfigurieren Sie [CORS der Console](/de/administration/cors) nur, wenn ursprungsübergreifender Zugriff erforderlich ist.
- Die Console-Sitzung übernimmt die Berechtigungen der angemeldeten Identität. Verwenden Sie für die tägliche Arbeit ein Konto mit minimalen Rechten.
- Abmelden oder eine abgelaufene Sitzung führt Sie zur Anmeldeseite zurück. Speichern Sie Administrator-Anmeldedaten nicht in gemeinsam genutzten Browsern.

## Verwaltungsabläufe

- [Buckets erstellen und verwalten](/de/administration/data/bucket/creation)
- [Objekte hochladen und verwalten](/de/administration/data/object/creation)
- [Zugriffsschlüssel verwalten](/de/security-compliance/iam/access-token)
- [Identitäts- und Zugriffsverwaltung konfigurieren](/de/security-compliance/iam)

## Nächste Schritte

Prüfen Sie die [Sicherheitscheckliste](/de/installation/requirement/checklists/security-checklists), bevor Sie die Console außerhalb eines vertrauenswürdigen Netzwerks erreichbar machen. Für die Anmeldung über OIDC fahren Sie mit der [OIDC-Konfiguration](/de/security-compliance/oidc) fort.
