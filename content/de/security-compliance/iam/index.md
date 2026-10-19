---
title: "Identitäts- und Zugriffsverwaltung"
description: "Überblick über die Identitäts- und Zugriffsverwaltung (IAM) in RustFS: Identitätstypen, Richtlinienzuordnung und Auswertungssemantik."
---

RustFS bringt eine eingebaute Identitäts- und Zugriffsverwaltung (IAM) mit, die sich an der Richtliniensprache von AWS IAM orientiert. Jede Anfrage — S3-Datenzugriff, Console-Operation oder Admin-API-Aufruf — wird mit Zugangsdaten authentifiziert und anschließend anhand der Richtlinien autorisiert, die dieser Identität zugeordnet sind.

## Identitätstypen

RustFS unterscheidet die folgenden Identitätstypen:

| Identität | Angelegt durch | Typische Verwendung |
| --- | --- | --- |
| Root-Anmeldedaten | Umgebungsvariablen `RUSTFS_ACCESS_KEY` / `RUSTFS_SECRET_KEY` beim Serverstart | Erstkonfiguration und Administration im Notfall (Break-Glass). Das Root-Konto umgeht die Auswertung der IAM-Identitätsrichtlinien (Eigentümer-Semantik). |
| IAM-Benutzer | Console oder Admin-API (`add-user`) | Langfristige benannte Konten für Personen oder Anwendungen. |
| Gruppen | Console oder Admin-API (`update-group-members`) | Ordnen Sie einen Richtliniensatz vielen Benutzern gleichzeitig zu. Benutzer erben die Richtlinien jeder Gruppe, der sie angehören. |
| Dienstkonten (Zugriffsschlüssel) | Console oder Admin-API (`add-service-account`) | Abgeleitete Zugangsdaten, die einem übergeordneten Benutzer gehören. Sie erben die Berechtigungen des übergeordneten Kontos, optional weiter eingeschränkt durch eine eingebettete Sitzungsrichtlinie, und können eine Ablaufzeit tragen. |
| Temporäre STS-Zugangsdaten | STS-Aufrufe `AssumeRole` / `AssumeRoleWithWebIdentity` | Kurzlebige Zugangsdaten (15 Minuten bis 12 Stunden) mit Zugriffsschlüssel, geheimem Zugriffsschlüssel und Sitzungstoken. |
| Externe OIDC-Identitäten | OpenID-Connect-Anbieter (Keycloak, Authing und andere standardkonforme OIDC-Identitätsanbieter) | SSO für die Console. Claims des ID-Tokens werden auf Namen von RustFS-Richtlinien abgebildet, und RustFS stellt STS-Zugangsdaten aus. |

:::warning

Root-Anmeldedaten umgehen IAM-Identitätsrichtlinien, aber Bucket-Richtlinien können S3-Anfragen des Root-Kontos weiterhin ablehnen. Nur `GetBucketPolicy`, `PutBucketPolicy` und `DeleteBucketPolicy` umgehen ein Deny der Bucket-Richtlinie, damit der Eigentümer den Zugriff wiederherstellen kann. Verwenden Sie Root-Anmeldedaten nur, um die Bereitstellung einzurichten, und legen Sie anschließend IAM-Benutzer und Dienstkonten für die tägliche Arbeit an.

:::

## Wie Richtlinien Identitäten zugeordnet werden

Richtlinien sind benannte JSON-Dokumente, die in RustFS gespeichert sind. Die Zuordnung funktioniert so:

- **Benutzerzuordnung** — einem IAM-Benutzer werden ein oder mehrere Richtliniennamen zugeordnet (`set-user-or-group-policy` oder der Endpunkt `idp/builtin/policy/attach`, der eine Liste von Richtlinien akzeptiert).
- **Gruppenzuordnung** — derselbe Mechanismus mit `isGroup=true`; jedes Mitglied der Gruppe erhält die Richtlinien der Gruppe zusätzlich zu den eigenen.
- **Dienstkonten** — erhalten keine eigenen Richtlinienzuordnungen. Sie werden unter den zusammengefassten Richtlinien des übergeordneten Benutzers ausgewertet. Wurde das Dienstkonto mit einem ausdrücklichen Richtliniendokument angelegt, gilt diese Sitzungsrichtlinie als zusätzliche Einschränkung (beide müssen erlauben).
- **STS-Sitzungen** — erben die Richtlinien der übergeordneten Identität. Der Anfrageparameter `Policy` von `AssumeRole` kann eine zusätzliche Sitzungsrichtlinie einbetten, die die temporären Zugangsdaten weiter einschränkt.
- **OIDC-Identitäten** — die Claim-Werte `groups` und `roles` des ID-Tokens werden mit Namen von RustFS-Richtlinien abgeglichen; die passenden Richtlinien gelten für die ausgestellten STS-Zugangsdaten.

RustFS liefert diese integrierten Richtlinien (Canned Policies): `readwrite`, `readonly`, `writeonly`, `diagnostics` und `consoleAdmin`. Siehe [Benutzer, Gruppen und Richtlinien](./policies.md) zu ihrem Inhalt und zum Schreiben eigener Richtlinien.

<a id="policy-evaluation-semantics"></a>

## Auswertungssemantik von Richtlinien

Wenn einer Identität mehrere Richtlinien zugeordnet sind, führt RustFS ihre Statements zusammen (Duplikate entfallen) und wertet das zusammengeführte Dokument aus:

1. **Ein ausdrückliches Deny hat Vorrang.** Alle `Deny`-Statements werden zuerst geprüft. Trifft ein passendes `Deny` auf die Anfrage zu, wird sie unabhängig von jedem `Allow` abgelehnt.
2. **Sonderfall Eigentümer.** Das Root-Konto umgeht die Auswertung der IAM-Identitätsrichtlinien; die oben beschriebenen Prüfungen und Ausnahmen der Bucket-Richtlinie gelten weiterhin.
3. **Ausdrückliches Allow erforderlich.** Andernfalls muss mindestens ein `Allow`-Statement zur angeforderten Aktion und Ressource passen.
4. **Standard-Deny.** Wenn kein Statement passt, wird die Anfrage abgelehnt.

Bei Dienstkonten und STS-Sitzungen mit einer Sitzungsrichtlinie ist die wirksame Berechtigung die Schnittmenge: Die Richtlinien des übergeordneten Kontos und die Sitzungsrichtlinie müssen die Anfrage beide erlauben.

## In diesem Abschnitt

- [Benutzer, Gruppen und Richtlinien](./policies.md) — Benutzer und Gruppen verwalten, das Format des Richtliniendokuments und integrierte Richtlinien.
- [Dienstkonten und STS](./sts.md) — abgeleitete Zugriffsschlüssel und temporäre Zugangsdaten über `AssumeRole`.
- [Zugriffsschlüssel](./access-token.md) — Zugriffsschlüssel in der Console anlegen und löschen.
