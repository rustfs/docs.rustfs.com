---
title: "Anmeldedatenverwaltung"
description: "Konfigurieren und rotieren Sie die Root-Anmeldedaten von RustFS, legen Sie das RPC-Geheimnis zwischen den Knoten fest und nutzen Sie MinIO-kompatible Umgebungsaliase."
---

## Root-Anmeldedaten

RustFS liest sein Root-Paar (Admin) aus:

```bash
RUSTFS_ACCESS_KEY=<your-access-key>
RUSTFS_SECRET_KEY=<your-secret-key>
```

Wenn keines von beiden gesetzt ist, fällt der Server auf den eingebauten Standard `rustfsadmin` / `rustfsadmin` zurück.

:::warning[Sichere Root-Anmeldedaten wählen]

[AWS Signature Version 4 (SigV4)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-signing-elements.html) bettet den Zugriffsschlüssel in einen durch Schrägstriche getrennten Gültigkeitsbereich der Anmeldedaten ein:

`<access-key>/<date>/<region>/<service>/aws4_request`

Nehmen Sie kein `/` in `RUSTFS_ACCESS_KEY` auf, weil Zugriffsschlüssel und Gültigkeitsbereich sonst falsch zerlegt werden. Wir empfehlen, nur ASCII-Großbuchstaben und Ziffern (`A-Z`, `0-9`) zu verwenden, passend zum Format, das RustFS erzeugt. Verwenden Sie unveränderte Base64-Ausgabe nicht als Zugriffsschlüssel. Verwenden Sie für `RUSTFS_SECRET_KEY` einen eigenen starken Zufallswert.

Die Standard-Anmeldedaten `rustfsadmin` sind öffentlich und allgemein bekannt. Der Einstiegspunkt des Containers gibt eine Warnung aus, startet aber trotzdem. Setzen Sie immer von den Standardwerten abweichende Anmeldedaten, bevor Sie die Ports 9000 und 9001 über localhost hinaus freigeben. Zusätzlich **muss** ein Cluster mit mehreren Knoten, der mit einem Paar aus lauter Standardwerten läuft, `RUSTFS_RPC_SECRET` setzen (siehe unten). Der Server lehnt es ab, die RPC-Authentifizierung zwischen den Knoten aus dem standardmäßigen geheimen Zugriffsschlüssel abzuleiten.

:::

## Übergabe über Dateien (Docker- und Kubernetes-Secrets)

Statt Geheimnisse in die Umgebung zu legen, verweisen Sie RustFS auf Dateien, die sie enthalten:

```bash
RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
```

Es gibt gleichwertige CLI-Optionen (`--access-key-file`, `--secret-key-file`). Der Einstiegspunkt des Containers erzwingt diese Regeln:

- Gelesen wird nur die **erste Zeile** der Datei. Umgebender Leerraum und CR-Zeichen (mit CRLF bearbeitete Dateien) werden abgeschnitten. Eine Datei ohne abschließenden Zeilenumbruch ist gültig.
- Beide Varianten für dieselbe Anmeldedatenart zu setzen, die direkte Variable und die Variante `_FILE`, ist ein harter Fehler: `Set either RUSTFS_ACCESS_KEY or RUSTFS_ACCESS_KEY_FILE, not both.`
- Ein leerer Wert, eine leere Datei oder eine nicht lesbare Datei ist ein harter Fehler (Exit 1).
- Eine Datei mit dem Standardwert `rustfsadmin` löst dieselbe Warnung aus wie die direkte Variable.

```yaml title="docker-compose example with secrets"
services:
  rustfs:
    image: rustfs/rustfs:latest
    environment:
      - RUSTFS_ACCESS_KEY_FILE=/run/secrets/rustfs_access_key
      - RUSTFS_SECRET_KEY_FILE=/run/secrets/rustfs_secret_key
    secrets:
      - rustfs_access_key
      - rustfs_secret_key
secrets:
  rustfs_access_key:
    file: ./secrets/access_key.txt
  rustfs_secret_key:
    file: ./secrets/secret_key.txt
```

## Root-Anmeldedaten rotieren

Alle Knoten eines Clusters müssen mit **demselben** Paar der Root-Anmeldedaten laufen. Die RPC-Authentifizierung zwischen den Knoten wird daraus abgeleitet, sofern `RUSTFS_RPC_SECRET` nicht ausdrücklich gesetzt ist.

:::note

Das folgende schrittweise Vorgehen entspricht der üblichen Betriebspraxis und setzt sich aus geprüften Bausteinen zusammen (Konfiguration über Umgebung oder Datei sowie die geprüften Bereitschaftssignale beim rollierenden Neustart). RustFS dokumentiert derzeit keine API für die Online-Rotation der Root-Anmeldedaten.

:::

1. Setzen Sie, falls noch nicht geschehen, ein ausdrückliches `RUSTFS_RPC_SECRET` (derselbe Wert auf allen Knoten) **vor** der Rotation. Dadurch wird die Authentifizierung zwischen den Knoten vom Anmeldedatenpaar entkoppelt, und der Cluster toleriert während des rollierenden Neustarts Knoten, die vorübergehend mit gemischten alten und neuen Root-Anmeldedaten laufen.
2. Aktualisieren Sie die Umgebungsdatei oder das Secret auf **jedem** Knoten mit dem neuen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` (oder den Dateien hinter den Varianten `_FILE`).
3. Starten Sie die Knoten **einzeln** neu und warten Sie, bis jeder auf Port 9000 von `GET /health/ready` den Status `200` liefert, bevor Sie den nächsten neu starten.
4. Aktualisieren Sie jeden Client, jede SDK-Konfiguration und jede Automatisierung, die das alte Paar verwendet hat.
5. Prüfen Sie: Signieren Sie eine Anfrage mit den alten Anmeldedaten und bestätigen Sie, dass sie abgelehnt wird.

## RUSTFS_RPC_SECRET (RPC-Authentifizierung zwischen den Knoten)

Die Knoten eines verteilten Clusters authentifizieren ihren internen RPC-Verkehr mit einem gemeinsamen Geheimnis:

- Wenn `RUSTFS_RPC_SECRET` gesetzt ist, wird dieser Wert direkt verwendet. Setzen Sie **auf jedem Knoten denselben Wert**.
- Wenn es nicht gesetzt ist, wird das Geheimnis per HMAC aus dem aktiven Paar von Zugriffsschlüssel und geheimem Zugriffsschlüssel **abgeleitet**. Deshalb müssen alle Knoten dieselben Root-Anmeldedaten verwenden.
- Die Ableitung **verweigert die Authentifizierung**, wenn der geheime Zugriffsschlüssel der Standardwert `rustfsadmin` ist: Ein öffentlich bekanntes Geheimnis würde ein öffentlich berechenbares RPC-Geheimnis ergeben, mit dem jeder Netz-Peer Signaturen zwischen den Knoten fälschen könnte. In dieser Konfiguration kann die RPC zwischen den Knoten sich nicht authentifizieren, bis Sie entweder `RUSTFS_RPC_SECRET` setzen oder einen vom Standard abweichenden `RUSTFS_SECRET_KEY` konfigurieren.

Wann Sie es ausdrücklich setzen:

- Cluster mit mehreren Knoten, die (vorübergehend oder dauerhaft) mit standardmäßigen Root-Anmeldedaten laufen;
- vor der Rotation der Root-Anmeldedaten, damit die Authentifizierung zwischen den Knoten während der Ausrollung stabil bleibt;
- Umgebungen, in denen die Authentifizierung zwischen den Knoten unabhängig vom Lebenszyklus der S3-Root-Anmeldedaten sein soll.

```bash
# Same value on every node
RUSTFS_RPC_SECRET=<your-rpc-secret>
```

## Kompatibilitätsaliase

Für die Migration bestehender Umgebungen akzeptiert RustFS Variablen für Zugangsdaten unter älteren und MinIO-kompatiblen Namen, wenn die kanonischen Namen `RUSTFS_ACCESS_KEY` und `RUSTFS_SECRET_KEY` nicht gesetzt sind:

| Akzeptierter Alias | Kanonische Variable |
| --- | --- |
| `RUSTFS_ROOT_USER` (älter) | `RUSTFS_ACCESS_KEY` |
| `RUSTFS_ROOT_PASSWORD` (älter) | `RUSTFS_SECRET_KEY` |
| `MINIO_ROOT_USER` | `RUSTFS_ROOT_USER` → `RUSTFS_ACCESS_KEY` |
| `MINIO_ROOT_PASSWORD` | `RUSTFS_ROOT_PASSWORD` → `RUSTFS_SECRET_KEY` |

Die Zuordnung des Präfixes `MINIO_` umfasst eine breitere Zulassungsliste von Variablen (Adresse, Console-Adresse, Einstellungen für Audit-Webhooks und weitere). Sie wird beim Start als Kompatibilitätszuordnung für externe Präfixe angewendet.

:::note

Aliase sind veraltet. Wird einer verwendet, protokolliert der Server einmalig eine Warnung der Form `Environment variable MINIO_ROOT_USER is deprecated, use RUSTFS_ROOT_USER instead`. Verwenden Sie in neuen Bereitstellungen die kanonischen Namen mit dem Präfix `RUSTFS_`. Der kanonische Name gewinnt immer, wenn beide gesetzt sind.

:::

## Über die Root-Anmeldedaten hinaus

Der tägliche Zugriff sollte nicht das Root-Paar verwenden. Legen Sie eingeschränkte Benutzer, Gruppen, Richtlinien und Servicekonten über die Console auf Port 9001 oder die IAM-Admin-APIs an und behalten Sie die Root-Anmeldedaten administrativen Vorgängen vor. Siehe die IAM-Dokumentation im Abschnitt Verwaltung.
