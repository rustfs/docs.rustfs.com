---
title: "Benutzer, Gruppen und Richtlinien"
description: "Diese Seite beschreibt die Verwaltung von IAM-Benutzern und -Gruppen in RustFS, das JSON-Format von Richtliniendokumenten, Bedingungsoperatoren und integrierte Richtlinien."
---

Diese Seite behandelt die tägliche IAM-Verwaltung: Benutzer und Gruppen anlegen, Richtlinien zuweisen und eigene Richtliniendokumente schreiben.

## Voraussetzungen

- Installieren Sie [`rc`](/de/operations/rc), bevor Sie administrative RustFS-Befehle verwenden.
- Konfigurieren Sie einen Alias mit Zugangsdaten, deren Richtlinien die entsprechenden Aktionen `admin:*` erlauben.

## Benutzer verwalten

Benutzer lassen sich in der Console (Abschnitt **Identity** in der linken Navigation), mit `rc admin` oder über die Admin-REST-API verwalten. Die nativen Admin-Endpunkte liegen unter dem Präfix `/rustfs/admin/v3`. Anfragen müssen mit AWS Signature V4 von Zugangsdaten signiert sein, deren Richtlinien die entsprechende Aktion `admin:*` erlauben.

| Operation | Methode und Pfad | Hinweise |
| --- | --- | --- |
| Benutzer anlegen oder aktualisieren | `PUT /rustfs/admin/v3/add-user?accessKey=<name>` | JSON-Body: `{"secretKey": "...", "status": "enabled"}`; `policy` ist optional. Erfordert `admin:CreateUser`. |
| Benutzer auflisten | `GET /rustfs/admin/v3/list-users` | Erfordert `admin:ListUsers`. |
| Benutzerdetails | `GET /rustfs/admin/v3/user-info?accessKey=<name>` | Erfordert `admin:GetUser`. |
| Benutzer aktivieren oder deaktivieren | `PUT /rustfs/admin/v3/set-user-status?accessKey=<name>&status=<enabled\|disabled>` | Sie können den Status der Zugangsdaten, mit denen der Aufruf erfolgt, nicht ändern. |
| Benutzer löschen | `DELETE /rustfs/admin/v3/remove-user?accessKey=<name>` | Erfordert `admin:DeleteUser`. |
| IAM-Daten exportieren | `GET /rustfs/admin/v3/export-iam` | Exportiert Benutzer, Gruppen, Richtlinien und Zuordnungen. |
| IAM-Daten importieren | `PUT /rustfs/admin/v3/import-iam` | Stellt einen exportierten Datenbestand wieder her. |

:::note

Ein Benutzername (Zugriffsschlüssel) darf keine Leerzeichen enthalten und darf nicht mit dem Root-Zugriffsschlüssel übereinstimmen. Beim Anlegen eines Benutzers ist der geheime Zugriffsschlüssel erforderlich.

:::

## Gruppen verwalten

Gruppen fassen Benutzer zusammen, damit eine einzige Richtlinienzuordnung für alle Mitglieder gilt. Mitgliedschaft und Status verwalten Sie über diese Endpunkte (entsprechende Funktionen gibt es in der Console unter **Identity**):

| Operation | Methode und Pfad | Hinweise |
| --- | --- | --- |
| Gruppen auflisten | `GET /rustfs/admin/v3/groups` | Erfordert `admin:ListGroups`. |
| Gruppendetails | `GET /rustfs/admin/v3/group?group=<name>` | Erfordert `admin:GetGroup`. |
| Mitglieder hinzufügen oder entfernen | `PUT /rustfs/admin/v3/update-group-members` | JSON-Body unten. Wenn Sie Mitglieder zu einer noch nicht vorhandenen Gruppe hinzufügen, wird sie angelegt. Erfordert `admin:AddUserToGroup` / `admin:RemoveUserFromGroup`. |
| Gruppe aktivieren oder deaktivieren | `PUT /rustfs/admin/v3/set-group-status?group=<name>&status=<enabled\|disabled>` | Erfordert `admin:EnableGroup` / `admin:DisableGroup`. |
| Gruppe löschen | `DELETE /rustfs/admin/v3/group/{group}` | Schlägt fehl, solange die Gruppe noch Mitglieder hat. |

Body für die Aktualisierung der Mitgliedschaft:

```json
{
  "group": "developers",
  "members": ["alice", "bob"],
  "isRemove": false
}
```

Setzen Sie `isRemove` auf `true`, um die aufgeführten Mitglieder stattdessen zu entfernen. Temporäre STS-Benutzer und die Root-Anmeldedaten können nicht zu Gruppen hinzugefügt werden.

## Richtlinien zuweisen

Richtlinienzuordnungen verbinden eine benannte Richtlinie mit einem Benutzer oder einer Gruppe:

| Operation | Methode und Pfad | Hinweise |
| --- | --- | --- |
| Richtlinie für Benutzer oder Gruppe setzen | `PUT /rustfs/admin/v3/set-user-or-group-policy?policyName=<policy>&userOrGroup=<name>&isGroup=<true\|false>` | Ersetzt die Zuordnung. Wird auch als `/rustfs/admin/v3/set-policy` bereitgestellt. Erfordert `admin:AttachUserOrGroupPolicy`. |
| Richtlinien anhängen | `POST /rustfs/admin/v3/idp/builtin/policy/attach` | JSON-Body: `{"policies": ["readonly"], "user": "alice"}` (oder `"group"`). Ergänzt die bestehende Zuordnung. |
| Richtlinien lösen | `POST /rustfs/admin/v3/idp/builtin/policy/detach` | Dieselbe Body-Form; entfernt Richtlinien aus der Zuordnung. |
| Richtlinienzuordnungen auflisten | `GET /rustfs/admin/v3/idp/builtin/policy-entities` | Zeigt, welche Benutzer und Gruppen welche Richtlinien haben. |

## Richtliniendokumente verwalten

| Operation | Methode und Pfad | Hinweise |
| --- | --- | --- |
| Richtlinien auflisten | `GET /rustfs/admin/v3/list-canned-policies` | Für Details ist `admin:GetPolicy` erforderlich. |
| Richtliniendetails | `GET /rustfs/admin/v3/info-canned-policy?name=<policy>` | Gibt das JSON-Dokument zurück. |
| Richtlinie anlegen oder ersetzen | `PUT /rustfs/admin/v3/add-canned-policy?name=<policy>` | Der Request-Body ist das JSON-Dokument der Richtlinie. Erfordert `admin:CreatePolicy`. |
| Richtlinie löschen | `DELETE /rustfs/admin/v3/remove-canned-policy?name=<policy>` | Erfordert `admin:DeletePolicy`. |

## Format des Richtliniendokuments [#policy-document-format]

Ein Richtliniendokument ist ein JSON-Objekt mit den Feldern `Version` und `Statement`. Der einzige akzeptierte Wert für `Version` ist `2012-10-17`.

Jedes Statement unterstützt:

| Feld | Erforderlich | Beschreibung |
| --- | --- | --- |
| `Sid` | Nein | Kennung des Statements. |
| `Effect` | Ja | `Allow` oder `Deny`. |
| `Action` | Ja (oder `NotAction`) | Aktionsnamen, Platzhalter sind erlaubt (zum Beispiel `s3:Get*`). |
| `NotAction` | Nein | Trifft auf jede Aktion zu, außer auf die aufgeführten. |
| `Resource` | Ja für S3-Aktionen (oder `NotResource`) | ARNs der Form `arn:aws:s3:::bucket` oder `arn:aws:s3:::bucket/prefix/*`. |
| `NotResource` | Nein | Trifft auf jede Ressource zu, außer auf die aufgeführten. |
| `Condition` | Nein | Bedingungsoperatoren, deren Schlüssel Kontextwerte sind. |

Aktionsnamen sind nach Namensraum gegliedert: `s3:*` für Objekt- und Bucket-Operationen (zum Beispiel `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`, `s3:GetBucketLocation`, `s3:ListAllMyBuckets`), `admin:*` für Verwaltungsoperationen, `sts:AssumeRole` für STS und `kms:*` für die Schlüsselverwaltung.

Unterstützte Bedingungsoperatoren sind unter anderem: `StringEquals`, `StringNotEquals`, `StringEqualsIgnoreCase`, `StringNotEqualsIgnoreCase`, `StringLike`, `StringNotLike`, `ArnEquals`, `ArnNotEquals`, `ArnLike`, `ArnNotLike`, `BinaryEquals`, `IpAddress`, `NotIpAddress`, `Null`, `Bool`, `NumericEquals`, `NumericNotEquals`, `NumericLessThan`, `NumericLessThanEquals`, `NumericGreaterThan`, `NumericGreaterThanEquals`, `DateEquals`, `DateNotEquals`, `DateLessThan`, `DateLessThanEquals`, `DateGreaterThan` und `DateGreaterThanEquals`. An jeden Operator kann `IfExists` angehängt werden (die Bedingung ist erfüllt, wenn der referenzierte Kontextschlüssel fehlt).

### Beispiel: Lesezugriff auf einen Bucket

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetBucketLocation", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::reports"]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::reports/*"]
    }
  ]
}
```

### Beispiel: Lese- und Schreibzugriff auf ein Präfix beschränkt

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::app-data"],
      "Condition": {
        "StringLike": {
          "s3:prefix": ["tenant-42/*"]
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": ["arn:aws:s3:::app-data/tenant-42/*"]
    }
  ]
}
```

### Beispiel: Voller Zugriff, Löschen verweigert

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": ["arn:aws:s3:::archive", "arn:aws:s3:::archive/*"]
    },
    {
      "Effect": "Deny",
      "Action": ["s3:DeleteObject", "s3:DeleteObjectVersion", "s3:DeleteBucket"],
      "Resource": ["arn:aws:s3:::archive", "arn:aws:s3:::archive/*"]
    }
  ]
}
```

:::note

Ein ausdrückliches `Deny` hat immer Vorrang vor `Allow`. Das zweite Statement gilt daher für Löschoperationen, auch wenn `s3:*` sie ebenfalls trifft. Siehe die [Auswertungssemantik](./index.md#policy-evaluation-semantics).

:::

## Integrierte Richtlinien

RustFS definiert fünf integrierte Richtlinien, die Sie zuweisen können, ohne sie zuvor anzulegen:

| Richtlinie | Gewährt |
| --- | --- |
| `readwrite` | Alle S3-Aktionen (`s3:*`) auf allen Ressourcen sowie `sts:AssumeRole`. |
| `readonly` | `s3:GetBucketLocation`, `s3:GetObject` und `s3:GetBucketQuota` auf allen Ressourcen sowie `sts:AssumeRole`. |
| `writeonly` | `s3:PutObject` auf allen Ressourcen sowie `sts:AssumeRole`. |
| `diagnostics` | Administrative Diagnoseaktionen (`admin:Profiling`, `admin:ServerTrace`, `admin:ConsoleLog`, `admin:ServerInfo`, `admin:TopLocksInfo`, `admin:OBDInfo`, `admin:Prometheus`, `admin:BandwidthMonitor`) sowie `sts:AssumeRole`. |
| `consoleAdmin` | Alle Admin-Aktionen (`admin:*`), alle KMS-Aktionen (`kms:*`), alle S3-Aktionen (`s3:*`) sowie `sts:AssumeRole`. |

:::warning

Die integrierte Richtlinie `readonly` enthält weder `s3:ListBucket` noch `s3:ListAllMyBuckets`. Mit der Berechtigung `s3:GetBucketLocation` können Sie Bucket-Namen in RustFS sehen; mit `s3:GetObject` können Sie Objekte über einen bekannten Objektschlüssel abrufen. Um Objekte in einem Bucket aufzulisten, fügen Sie eine benutzerdefinierte Richtlinie hinzu, die `s3:ListBucket` für diesen Bucket gewährt.

:::
