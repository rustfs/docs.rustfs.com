---
title: "Dienstkonten und STS"
description: "Dienstkonten in RustFS (abgeleitete Zugriffsschlüssel) und temporäre Zugangsdaten über die STS-API AssumeRole."
---

RustFS bietet zwei Mechanismen, um Zugangsdaten auszustellen, die von einer vorhandenen Identität abgeleitet sind: **Dienstkonten** (langlebige Zugriffsschlüssel eines übergeordneten Benutzers) und **temporäre STS-Zugangsdaten** (kurzlebige Schlüssel mit einem Sitzungstoken).

## Dienstkonten

Ein Dienstkonto ist ein Paar aus Zugriffsschlüssel und geheimem Zugriffsschlüssel, das einem übergeordneten IAM-Benutzer gehört (oder dem Root-Konto). Es authentifiziert sich wie ein normaler Schlüssel, wird aber als sein übergeordnetes Konto autorisiert:

- **Geerbte Richtlinie (Standard).** Wird das Dienstkonto ohne Richtlinie angelegt, erbt es das, was die zusammengefassten Richtlinien des übergeordneten Benutzers zum Zeitpunkt der Anfrage erlauben.
- **An die Sitzung gebundene Richtlinie.** Wird beim Anlegen ein Richtliniendokument übergeben, wird es in das Dienstkonto eingebettet. Anfragen müssen dann sowohl von den Richtlinien des übergeordneten Kontos als auch von der eingebetteten Richtlinie erlaubt sein.
- **Ablauf.** Optional lässt sich ein Ablaufzeitpunkt (RFC 3339) setzen; die Zugangsdaten funktionieren nach diesem Zeitpunkt nicht mehr.

Dienstkonten können `AssumeRole` nicht aufrufen, und ein Zugriffsschlüssel eines Dienstkontos lässt sich nicht in einen regulären IAM-Benutzer umwandeln.

In der Console verwalten Sie Dienstkonten auf der Seite **Access Keys** (Zugriffsschlüssel); siehe [Zugriffsschlüssel-Verwaltung](./access-token.md). Die Admin-API stellt bereit:

| Operation | Methode und Pfad | Hinweise |
| --- | --- | --- |
| Dienstkonto anlegen | `PUT /rustfs/admin/v3/add-service-account` | JSON-Body siehe unten. Wird auch unter `/add-service-accounts` bereitgestellt. Erfordert `admin:CreateServiceAccount`, wenn das Konto für einen anderen Benutzer (`targetUser`) angelegt wird. |
| Dienstkonten auflisten | `GET /rustfs/admin/v3/list-service-accounts?user=<name>` | Erfordert `admin:ListServiceAccounts`, um die Konten eines anderen Benutzers aufzulisten. |
| Zugriffsschlüssel gesammelt auflisten | `GET /rustfs/admin/v3/list-access-keys-bulk` | Unterstützt die Filterung auf nur Benutzer, nur Dienstkonten oder nur STS-Schlüssel. |
| Details eines Dienstkontos | `GET /rustfs/admin/v3/info-service-account?accessKey=<key>` | Liefert Name, Beschreibung, übergeordnetes Konto, Ablauf und die Sitzungsrichtlinie (oder `impliedPolicy: true`, wenn sie geerbt wird). |
| Details eines temporären Kontos | `GET /rustfs/admin/v3/temporary-account-info?accessKey=<key>` | Für von STS ausgestellte Schlüssel. |
| Details eines Zugriffsschlüssels | `GET /rustfs/admin/v3/info-access-key?accessKey=<key>` | Einheitliche Abfrage über Benutzer, Dienstkonten und STS-Schlüssel. |
| Dienstkonto aktualisieren | `POST /rustfs/admin/v3/update-service-account?accessKey=<key>` | Kann den geheimen Zugriffsschlüssel rotieren sowie Status, Name, Beschreibung und Ablauf ändern oder die Richtlinie ersetzen. |
| Dienstkonto löschen | `DELETE /rustfs/admin/v3/delete-service-account?accessKey=<key>` | Wird auch unter `/delete-service-accounts` bereitgestellt. Aufrufer ohne Admin-Rechte können nur ihre eigenen Dienstkonten löschen. |

JSON-Body beim Anlegen (alle Felder optional, sofern nicht anders angegeben):

```json
{
  "policy": { "Version": "2012-10-17", "Statement": [] },
  "targetUser": "alice",
  "accessKey": "myserviceaccount",
  "secretKey": "mysecret",
  "name": "ci-pipeline",
  "description": "Key used by CI",
  "expiration": "2027-01-01T00:00:00Z"
}
```

:::note

Lassen Sie `accessKey` und `secretKey` weg, damit RustFS ein zufälliges Paar erzeugt. Lassen Sie `policy` weg, um ein Dienstkonto mit geerbter Richtlinie anzulegen. `targetUser` erfordert Admin-Rechte; reguläre Benutzer legen Dienstkonten für sich selbst an.

:::

## Temporäre STS-Zugangsdaten

RustFS stellt einen AWS-kompatiblen STS-Endpunkt an der Serverwurzel bereit (`POST /` mit formularcodierten Parametern). Zwei Aktionen werden unterstützt:

- `AssumeRole` — für vorhandene IAM-Identitäten, signiert mit SigV4.
- `AssumeRoleWithWebIdentity` — für OIDC-Identitäten, authentifiziert durch das JWT selbst (siehe [Externe Identität (OIDC)](../oidc/index.md)).

### AssumeRole

Die Anfrage muss mit AWS Signature V4 von langfristigen IAM-Zugangsdaten signiert sein. Temporäre Zugangsdaten und Dienstkonten können `AssumeRole` nicht aufrufen. Bei der eingebauten IAM-Autorisierung wertet RustFS `sts:AssumeRole` für reguläre IAM-Benutzer im Nur-Deny-Modus aus: Ein passendes ausdrückliches `Deny` lehnt die Anfrage ab, ein separates `Allow` ist nicht erforderlich. Der Benutzer muss mindestens eine anwendbare Benutzer- oder Gruppenrichtlinienzuordnung haben, und alle zugeordneten Richtliniennamen müssen auflösbar sein.

Formularparameter:

| Parameter | Erforderlich | Beschreibung |
| --- | --- | --- |
| `Action` | Ja | `AssumeRole`. |
| `Version` | Ja | Muss `2011-06-15` sein. |
| `DurationSeconds` | Nein | Lebensdauer der Zugangsdaten in Sekunden. Standard 3600 (1 Stunde); Werte werden auf den Bereich 900 (15 Minuten) bis 43200 (12 Stunden) begrenzt. |
| `Policy` | Nein | Eine eingebettete Sitzungsrichtlinie (JSON), die die temporären Zugangsdaten weiter einschränkt. |
| `RoleArn`, `RoleSessionName`, `ExternalId` | Nein | Werden aus Kompatibilitätsgründen mit AWS akzeptiert. |

Beispiel:

```bash
curl -s -X POST "https://rustfs.example.com/" \
  --user "$ACCESS_KEY:$SECRET_KEY" \
  --aws-sigv4 "aws:amz:us-east-1:s3" \
  -d "Action=AssumeRole" \
  -d "Version=2011-06-15" \
  -d "DurationSeconds=3600"
```

Die Antwort ist ein XML-Dokument `AssumeRoleResponse` mit `AccessKeyId`, `SecretAccessKey`, `SessionToken` und `Expiration`. Verwenden Sie alle drei Werte bei nachfolgenden S3-Anfragen (das Sitzungstoken steht in `X-Amz-Security-Token`).

Die temporären Zugangsdaten erben die Richtlinien des Aufrufers; das Feld `parent` der Zugangsdaten ist der aufrufende Zugriffsschlüssel. Wurde ein Parameter `Policy` übergeben, wird er in der Sitzung gespeichert und als zusätzliche Einschränkung angewendet.

### AssumeRoleWithWebIdentity

Wird vom OIDC-Ablauf verwendet. Eine SigV4-Signatur ist nicht erforderlich, weil das JWT des Identitätsanbieters die Authentifizierung ist:

| Parameter | Erforderlich | Beschreibung |
| --- | --- | --- |
| `Action` | Ja | `AssumeRoleWithWebIdentity`. |
| `Version` | Ja | Muss `2011-06-15` sein. |
| `WebIdentityToken` | Ja | Das OIDC-ID-Token, das ein konfigurierter Anbieter ausgestellt hat. |
| `DurationSeconds` | Nein | Derselbe Standard und dieselbe Begrenzung auf 900–43200 wie bei `AssumeRole`. |
| `Policy` | Nein | Optionale eingebettete Sitzungsrichtlinie. |

RustFS prüft das Token gegen den konfigurierten Anbieter (Signatur, Aussteller, Zielgruppe, Ablauf), ordnet die Claims `groups` und `roles` Namen von RustFS-Richtlinien zu und lehnt die Anfrage ab, wenn keine Richtlinien oder Gruppen zugeordnet werden können. Die Antwort ist ein XML-Dokument `AssumeRoleWithWebIdentityResponse` mit denselben Zugangsdatenfeldern plus `SubjectFromWebIdentityToken`.

:::warning

Halten Sie `DurationSeconds` so kurz, wie es Ihre Arbeitslast zulässt. Abgeflossene temporäre Zugangsdaten bleiben bis zu ihrem Ablauf gültig.

:::
